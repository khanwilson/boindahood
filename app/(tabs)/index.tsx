import AppButton from '@/components/button/AppButton';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function MenuScreen() {
  const gotoSeeMoreLess = () => {
    router.push({
      pathname: '/textModule',
    });
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }} contentContainerStyle={styles.container}>
      <AppButton style={styles.btn} title="text: More Less" onPress={gotoSeeMoreLess} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  btn: {
    marginBottom: 10,
  },
});
