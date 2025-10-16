import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SystemInfoDashboard } from 'sha-performance-test';
import { darkTheme, lightTheme } from './colorTheme';
import { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState(lightTheme);
  const [isDark, setIsDark] = useState(false);

  const [enabledWidgets, setEnabledWidgets] = useState({
    battery: true,
    storage: false,
    cpu: false,
    ram: false,
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? lightTheme : darkTheme);
  };

  const toggleWidget = (widget: keyof typeof enabledWidgets) => {
    setEnabledWidgets((prev) => ({
      ...prev,
      [widget]: !prev[widget],
    }));
  };

  const toggleAllWidgets = (enable: boolean) => {
    setEnabledWidgets({
      battery: enable,
      storage: enable,
      cpu: enable,
      ram: enable,
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          System Monitor
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: theme.buttonBg }]}
        >
          <Text style={[styles.btnText, { color: theme.buttonText }]}>
            {isDark ? '☀️' : '🌙'} {isDark ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Widget Controls */}
        <View
          style={[
            styles.controlsCard,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          <Text style={[styles.controlsTitle, { color: theme.textColor }]}>
            Widget Controls
          </Text>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                { backgroundColor: theme.buttonBg },
              ]}
              onPress={() => toggleAllWidgets(true)}
            >
              <Text
                style={[styles.controlButtonText, { color: theme.buttonText }]}
              >
                Enable All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                { backgroundColor: theme.buttonBg },
              ]}
              onPress={() => toggleAllWidgets(false)}
            >
              <Text
                style={[styles.controlButtonText, { color: theme.buttonText }]}
              >
                Disable All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.widgetToggles}>
            <TouchableOpacity
              style={[
                styles.widgetToggle,
                {
                  backgroundColor: enabledWidgets.battery
                    ? theme.usedColor
                    : theme.backgroundColor,
                },
              ]}
              onPress={() => toggleWidget('battery')}
            >
              <Text
                style={[
                  styles.widgetToggleText,
                  {
                    color: enabledWidgets.battery
                      ? theme.buttonText
                      : theme.textColor,
                  },
                ]}
              >
                🔋 Battery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.widgetToggle,
                {
                  backgroundColor: enabledWidgets.storage
                    ? theme.usedColor
                    : theme.backgroundColor,
                },
              ]}
              onPress={() => toggleWidget('storage')}
            >
              <Text
                style={[
                  styles.widgetToggleText,
                  {
                    color: enabledWidgets.storage
                      ? theme.buttonText
                      : theme.textColor,
                  },
                ]}
              >
                💾 Storage
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.widgetToggle,
                {
                  backgroundColor: enabledWidgets.cpu
                    ? theme.usedColor
                    : theme.backgroundColor,
                },
              ]}
              onPress={() => toggleWidget('cpu')}
            >
              <Text
                style={[
                  styles.widgetToggleText,
                  {
                    color: enabledWidgets.cpu
                      ? theme.buttonText
                      : theme.textColor,
                  },
                ]}
              >
                ⚡ CPU
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.widgetToggle,
                {
                  backgroundColor: enabledWidgets.ram
                    ? theme.usedColor
                    : theme.backgroundColor,
                },
              ]}
              onPress={() => toggleWidget('ram')}
            >
              <Text
                style={[
                  styles.widgetToggleText,
                  {
                    color: enabledWidgets.ram
                      ? theme.buttonText
                      : theme.textColor,
                  },
                ]}
              >
                🧠 RAM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Info Dashboard */}
        <SystemInfoDashboard
          theme={isDark ? 'dark' : 'light'}
          showBattery={enabledWidgets.battery}
          showStorage={enabledWidgets.storage}
          showCPU={enabledWidgets.cpu}
          showRAM={enabledWidgets.ram}
          progressColors={{
            battery: '#FF6B6B',
            storageUsed: '#4ECDC4',
            storageFree: '#45B7D1',
            cpu: '#FFA726',
            ramUsed: '#AB47BC',
            ramFree: '#26C6DA',
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  controlsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  widgetToggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  widgetToggle: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  widgetToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
