import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  getAllStorageInfo(): {
    totalDiskSpaceInGB: number;
    freeDiskSpaceInPer: number;
    usedDiskSpaceInPer: number;
  };
  getBatteryLevel(): number;
  getMemoryUsage(): {
    totalMemoryGB: number;
    usedMemoryPercentage: number;
    freeMemoryPercentage: number;
    usedMemoryGB: number;
  };
  getCPUUsage(): {
    cpuUsage: number;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('ShaPerformanceTest');
