#import "ShaPerformanceTest.h"

@implementation ShaPerformanceTest
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
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
