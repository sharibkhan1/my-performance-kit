// ShaPerformanceTest.mm
#import "ShaPerformanceTest.h"
#import <sys/param.h>
#import <sys/mount.h>

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