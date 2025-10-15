import ShaPerformanceTest from './NativeShaPerformanceTest';

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
