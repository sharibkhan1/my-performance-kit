// ShaPerformanceTest.mm
#import "ShaPerformanceTest.h"
#import <sys/param.h>
#import <sys/mount.h>
#import <mach/mach.h>
#import <mach/processor_info.h>
#import <mach/mach_host.h>

@implementation ShaPerformanceTest
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);
    return result;
}

-(NSDictionary *)getAllStorageInfo {
    NSError *error = nil;

    NSFileManager * fileManager = [NSFileManager defaultManager];
    NSDictionary *attributes = [fileManager attributesOfFileSystemForPath:NSHomeDirectory() error:&error];

    if (error){
        return @{@"error": @YES};
    }

    NSNumber *totalBytes = [attributes objectForKey:NSFileSystemSize];
    NSNumber *freeBytes = [attributes objectForKey:NSFileSystemFreeSize];

    double freeValue = [freeBytes doubleValue];
    double totalValue = [totalBytes doubleValue];
    double usedBytes = totalValue - freeValue;

    double usedPercent = (usedBytes / totalValue) * 100.0;
    double freePercent = (freeValue / totalValue) * 100.0;

    return @{
        @"totalDiskSpaceInGB": @([totalBytes doubleValue]/ (1000.0 * 1000.0 * 1000.0)),
        @"freeDiskSpaceInPer": @(freePercent),
        @"usedDiskSpaceInPer": @(usedPercent),
    };
}

- (NSNumber *)getBatteryLevel {
    UIDevice *device = [UIDevice currentDevice];
    
    if (!device.batteryMonitoringEnabled) {
        device.batteryMonitoringEnabled = YES;
    }
    
    float batteryLevel = [device batteryLevel];
    
    #if TARGET_IPHONE_SIMULATOR
        return @(75);
    #else
        if (batteryLevel < 0) {
            return @(-1);
        }
        
        double batteryPercentage = batteryLevel * 100.0;
        return @(batteryPercentage);
    #endif
}

- (NSDictionary *)getMemoryUsage {
    // Get total physical memory
    uint64_t total_physical_memory = [[NSProcessInfo processInfo] physicalMemory];
    
    mach_port_t host_port = mach_host_self();
    mach_msg_type_number_t host_size = sizeof(vm_statistics_data_t) / sizeof(integer_t);
    vm_size_t pagesize;
    vm_statistics_data_t vm_stat;
    
    host_page_size(host_port, &pagesize);
    kern_return_t kern = host_statistics(host_port, HOST_VM_INFO, (host_info_t)&vm_stat, &host_size);
    
    if (kern != KERN_SUCCESS) {
        return @{@"error": @YES, @"message": @"Failed to get memory statistics"};
    }
    
    // CORRECT CALCULATION:
    // Free memory = completely unused memory
    natural_t free_memory = vm_stat.free_count * pagesize;
    
    // Inactive memory = cached memory that can be quickly reclaimed
    natural_t inactive_memory = vm_stat.inactive_count * pagesize;
    
    // Available memory = free + inactive (what's actually available for new apps)
    natural_t available_memory = free_memory + inactive_memory;
    
    // Used memory = total - available (active + wired memory)
    natural_t used_memory = total_physical_memory - available_memory;
    
    // Convert to GB
    double totalGB = total_physical_memory / (1024.0 * 1024.0 * 1024.0);
    double usedGB = used_memory / (1024.0 * 1024.0 * 1024.0);
    
    // Calculate percentages
    double usedPercentage = (used_memory / (double)total_physical_memory) * 100.0;
    double freePercentage = (free_memory / (double)total_physical_memory) * 100.0;
    
    return @{
        @"usedMemoryPercentage": @(usedPercentage),
        @"freeMemoryPercentage": @(freePercentage),
        @"totalMemoryGB": @(totalGB),
        @"usedMemoryGB": @(usedGB),
    };
}

- (NSDictionary *)getCPUUsage {
    kern_return_t kr;
    task_info_data_t tinfo;
    mach_msg_type_number_t task_info_count;
    
    task_info_count = TASK_INFO_MAX;
    kr = task_info(mach_task_self(), TASK_BASIC_INFO, (task_info_t)tinfo, &task_info_count);
    
    if (kr != KERN_SUCCESS) {
        return @{@"error": @YES, @"message": @"Failed to get CPU usage"};
    }
    
    task_basic_info_t basic_info;
    thread_array_t thread_list;
    mach_msg_type_number_t thread_count;
    
    thread_info_data_t thinfo;
    mach_msg_type_number_t thread_info_count;
    
    thread_basic_info_t basic_info_th;
    uint32_t stat_thread = 0;
    
    basic_info = (task_basic_info_t)tinfo;
    
    // Get threads in the task
    kr = task_threads(mach_task_self(), &thread_list, &thread_count);
    if (kr != KERN_SUCCESS) {
        return @{@"error": @YES, @"message": @"Failed to get thread information"};
    }
    
    if (thread_count > 0) {
        stat_thread += thread_count;
    }
    
    long tot_sec = 0;
    long tot_usec = 0;
    float tot_cpu = 0;
    int j;
    
    for (j = 0; j < (int)thread_count; j++) {
        thread_info_count = THREAD_INFO_MAX;
        kr = thread_info(thread_list[j], THREAD_BASIC_INFO,
                        (thread_info_t)thinfo, &thread_info_count);
        if (kr != KERN_SUCCESS) {
            return @{@"error": @YES, @"message": @"Failed to get thread info"};
        }
        
        basic_info_th = (thread_basic_info_t)thinfo;
        
        if (!(basic_info_th->flags & TH_FLAGS_IDLE)) {
            tot_sec = tot_sec + basic_info_th->user_time.seconds + basic_info_th->system_time.seconds;
            tot_usec = tot_usec + basic_info_th->user_time.microseconds + basic_info_th->system_time.microseconds;
            tot_cpu = tot_cpu + basic_info_th->cpu_usage / (float)TH_USAGE_SCALE * 100.0;
        }
    }
    
    kr = vm_deallocate(mach_task_self(), (vm_offset_t)thread_list, thread_count * sizeof(thread_t));
    
    // For simulator, return mock data
    #if TARGET_IPHONE_SIMULATOR
        return @{
            @"cpuUsage": @(25.5), // Mock CPU usage for simulator
        };
    #else
        return @{
            @"cpuUsage": @(tot_cpu),
        };
    #endif
}


- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeShaPerformanceTestSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ShaPerformanceTest";
}

@end