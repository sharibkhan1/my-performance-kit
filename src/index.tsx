import ShaPerformanceTest from './NativeShaPerformanceTest';
export { default as SystemInfoDashboard } from './Comp/systemInfoDash';

export function multiply(a: number, b: number): number {
  return ShaPerformanceTest.multiply(a, b);
}

export function getAllStorageInfo(): {
  totalDiskSpaceInGB: number;
  freeDiskSpaceInPer: number;
  usedDiskSpaceInPer: number;
} {
  return ShaPerformanceTest.getAllStorageInfo();
}

export function getBatteryLevel(): number {
  return ShaPerformanceTest.getBatteryLevel();
}

export function getMemoryUsage(): {
  totalMemoryGB: number;
  usedMemoryPercentage: number;
  freeMemoryPercentage: number;
} {
  return ShaPerformanceTest.getMemoryUsage();
}

export function getCPUUsage(): {
  cpuUsage: number;
} {
  return ShaPerformanceTest.getCPUUsage();
}
