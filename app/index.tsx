import { Image, StyleSheet, Platform, ScrollView, SafeAreaView, Text, StatusBar, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor, useThemeColors } from '@/hooks/useThemeColor';
import CardList from '@/components/CardList';


export default function Page() {
  const {background} = useThemeColors()

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <ScrollView style={styles.scrollView}> */}
        <CardList/>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    paddingTop: 40,
    marginHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
