import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getAllStorageInfo } from 'sha-performance-test';
import { darkTheme, lightTheme } from './colorTheme';
import { useState } from 'react';

const allInfo = getAllStorageInfo();

export default function App() {
  const [theme, setTheme] = useState(lightTheme);
  const [isDark, setIsDark] = useState(false);

  const IsTotal = allInfo.totalDiskSpaceInGB.toFixed(2);
  const IsFree = allInfo.freeDiskSpaceInPer.toFixed(2);
  const IsUsed = allInfo.usedDiskSpaceInPer.toFixed(2);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? lightTheme : darkTheme);
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.button, { backgroundColor: theme.buttonBg }]}
      >
        <Text style={[styles.btnText, { color: theme.buttonText }]}>
          Switch to {isDark ? 'Light' : 'Dark'} Theme
        </Text>
      </TouchableOpacity>

      <Text style={[styles.text, { color: theme.textColor }]}>
        All Storage Info:
      </Text>
      <View
        style={[
          styles.cards,
          { borderColor: theme.textColor, backgroundColor: theme.secondary },
        ]}
      >
        <Text style={[styles.cardText, { color: theme.textColor }]}>
          Total Space: {IsTotal} GB
        </Text>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.usedBar,
              { width: `${IsUsed}%`, backgroundColor: theme.usedColor },
            ]}
          />
          <View
            style={[
              styles.freeBar,
              { width: `${IsFree}%`, backgroundColor: theme.freeColor },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cards: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'medium',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    position: 'absolute',
    top: 80,
    right: 30,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  barContainer: {
    flexDirection: 'row',
    width: '90%',
    height: 25,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  usedBar: {
    height: '100%',
  },
  freeBar: {
    height: '100%',
  },
});
