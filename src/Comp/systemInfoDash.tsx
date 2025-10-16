import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  getAllStorageInfo,
  getBatteryLevel,
  getCPUUsage,
  getMemoryUsage,
} from 'sha-performance-test';
import { darkTheme, lightTheme } from './colorTheme';
import CircularProgress from './round_Progress';

export interface SystemInfoDashboardProps {
  theme?: 'light' | 'dark';
  showBattery?: boolean;
  showStorage?: boolean;
  showCPU?: boolean;
  showRAM?: boolean;

  refreshIntervals?: {
    battery?: number;
    storage?: number;
    cpu?: number;
    ram?: number;
  };

  progressColors?: {
    battery?: string;
    storageUsed?: string;
    storageFree?: string;
    cpu?: string;
    ramUsed?: string;
    ramFree?: string;
  };
}

const SystemInfoDashboard: React.FC<SystemInfoDashboardProps> = ({
  theme = 'light',
  showBattery = false,
  showStorage = false,
  showCPU = false,
  showRAM = false,
  refreshIntervals = {},
  progressColors = {},
}) => {
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [cpuInfo, setCpuInfo] = useState<any>(null);
  const [showUsedStorage, setShowUsedStorage] = useState(true);
  const [showUsedRAM, setShowUsedRAM] = useState(true);
  const initialLoadRef = useRef(false);

  const intervals = useMemo(() => {
    const defaultIntervals = {
      battery: 30000, // 30 seconds
      storage: 10 * 60 * 1000, // 10 minutes
      cpu: 2000, // 2 seconds
      ram: 5000, // 5 seconds
    };

    return {
      ...defaultIntervals,
      ...refreshIntervals,
    };
  }, [refreshIntervals]);

  const getProgressColor = useMemo(() => {
    return (type: keyof typeof progressColors, defaultColor: string) => {
      return progressColors[type] || defaultColor;
    };
  }, [progressColors]);

  useEffect(() => {
    // Only load data once on initial mount
    if (!initialLoadRef.current) {
      try {
        const allInfo = getAllStorageInfo();
        const getCurrentBatteryLevel = getBatteryLevel();
        const memory = getMemoryUsage();
        const cpu = getCPUUsage();
        setBatteryLevel(getCurrentBatteryLevel);
        setStorageInfo(allInfo);
        setMemoryInfo(memory);
        setCpuInfo(cpu);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      initialLoadRef.current = true;
    }

    const intervalsToClear: NodeJS.Timeout[] = [];

    if (showCPU) {
      const cpuInterval = setInterval(() => {
        setCpuInfo(getCPUUsage());
      }, intervals.cpu);
      intervalsToClear.push(cpuInterval);
    }

    if (showRAM) {
      const memoryInterval = setInterval(() => {
        setMemoryInfo(getMemoryUsage());
      }, intervals.ram);
      intervalsToClear.push(memoryInterval);
    }

    if (showBattery) {
      const batteryInterval = setInterval(() => {
        setBatteryLevel(getBatteryLevel());
      }, intervals.battery);
      intervalsToClear.push(batteryInterval);
    }

    if (showStorage) {
      const storageInterval = setInterval(() => {
        setStorageInfo(getAllStorageInfo());
      }, intervals.storage);
      intervalsToClear.push(storageInterval);
    }

    return () => {
      intervalsToClear.forEach((interval) => clearInterval(interval));
    };
  }, [showBattery, showStorage, showCPU, showRAM, intervals]);

  if (batteryLevel === null || storageInfo === null) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentTheme.backgroundColor },
        ]}
      >
        <Text style={[styles.cardTitle, { color: currentTheme.textColor }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const totalStorage = storageInfo.totalDiskSpaceInGB.toFixed(2);
  const freeStoragePercent = storageInfo.freeDiskSpaceInPer.toFixed(2);
  const usedStoragePercent = storageInfo.usedDiskSpaceInPer.toFixed(2);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
      contentContainerStyle={{
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      {showStorage && (
        <WidgetCard theme={currentTheme} title="Storage">
          <CircularProgress
            percent={showUsedStorage ? usedStoragePercent : freeStoragePercent}
            size={100}
            strokeWidth={10}
            color={
              showUsedStorage
                ? getProgressColor('storageUsed', currentTheme.usedColor)
                : getProgressColor('storageFree', currentTheme.freeColor)
            }
            backgroundColor={currentTheme.backgroundColor}
            textColor={currentTheme.textColor}
            centerText={`${totalStorage} GB`}
          />
          <View style={styles.statsRow}>
            <TouchableOpacity onPress={() => setShowUsedStorage(true)}>
              <Text
                style={[
                  styles.statText,
                  {
                    color: showUsedStorage
                      ? getProgressColor('storageUsed', currentTheme.usedColor)
                      : currentTheme.textColor,
                  },
                ]}
              >
                Used: {usedStoragePercent}%
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowUsedStorage(false)}>
              <Text
                style={[
                  styles.statText,
                  {
                    color: !showUsedStorage
                      ? getProgressColor('storageFree', currentTheme.freeColor)
                      : currentTheme.textColor,
                  },
                ]}
              >
                Free: {freeStoragePercent}%
              </Text>
            </TouchableOpacity>
          </View>
        </WidgetCard>
      )}

      {showBattery && batteryLevel !== null && (
        <WidgetCard theme={currentTheme} title="Battery">
          <CircularProgress
            percent={batteryLevel}
            size={100}
            strokeWidth={10}
            color={getProgressColor('battery', currentTheme.batteryColor)}
            backgroundColor={currentTheme.backgroundColor}
            textColor={currentTheme.textColor}
            centerText={`${batteryLevel.toFixed(0)}%`}
          />
          <Text style={[styles.centerLabel, { color: currentTheme.textColor }]}>
            Charge level
          </Text>
        </WidgetCard>
      )}

      {showCPU && cpuInfo && (
        <WidgetCard theme={currentTheme} title="CPU Usage">
          <CircularProgress
            percent={cpuInfo.cpuUsage}
            size={100}
            strokeWidth={10}
            color={getProgressColor('cpu', currentTheme.cpuColor)}
            backgroundColor={currentTheme.backgroundColor}
            textColor={currentTheme.textColor}
            centerText={`${cpuInfo.cpuUsage.toFixed(0)}%`}
          />
          <Text style={[styles.centerLabel, { color: currentTheme.textColor }]}>
            Current Load
          </Text>
        </WidgetCard>
      )}

      {showRAM && memoryInfo && (
        <WidgetCard theme={currentTheme} title="RAM Usage">
          <CircularProgress
            percent={
              showUsedRAM
                ? memoryInfo.usedMemoryPercentage
                : 100 - memoryInfo.usedMemoryPercentage
            }
            size={100}
            strokeWidth={10}
            color={
              showUsedRAM
                ? getProgressColor('ramUsed', currentTheme.ramUsedColor)
                : getProgressColor('ramFree', currentTheme.freeColor)
            }
            backgroundColor={currentTheme.backgroundColor}
            textColor={currentTheme.textColor}
            centerText={`${memoryInfo.totalMemoryGB.toFixed(1)} GB`}
          />
          <View style={styles.statsRow}>
            <TouchableOpacity onPress={() => setShowUsedRAM(true)}>
              <Text
                style={[
                  styles.statText,
                  {
                    color: showUsedRAM
                      ? getProgressColor('ramUsed', currentTheme.ramUsedColor)
                      : currentTheme.textColor,
                  },
                ]}
              >
                Used: {memoryInfo.usedMemoryGB.toFixed(1)} GB
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowUsedRAM(false)}>
              <Text
                style={[
                  styles.statText,
                  {
                    color: !showUsedRAM
                      ? getProgressColor('ramFree', currentTheme.freeColor)
                      : currentTheme.textColor,
                  },
                ]}
              >
                Free:{' '}
                {(memoryInfo.totalMemoryGB - memoryInfo.usedMemoryGB).toFixed(
                  1
                )}{' '}
                GB
              </Text>
            </TouchableOpacity>
          </View>
        </WidgetCard>
      )}
    </ScrollView>
  );
};

const WidgetCard = ({ theme, title, children }: any) => (
  <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
    <Text style={[styles.cardTitle, { color: theme.textColor }]}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  centerLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SystemInfoDashboard;
