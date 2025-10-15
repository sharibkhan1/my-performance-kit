import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  getAllStorageInfo(): {
    totalDiskSpaceInGB: number;
    freeDiskSpaceInPer: number;
    usedDiskSpaceInPer: number;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('ShaPerformanceTest');
