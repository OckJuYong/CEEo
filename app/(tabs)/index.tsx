import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">AI 대화 일기</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedText style={styles.subtitle}>
        오늘 하루는 어떠셨나요?
      </ThemedText>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.chatButton]} 
          onPress={() => router.push('/(tabs)/chat')}
        >
          <ThemedText type="subtitle" style={styles.buttonText}>
            💬 AI와 대화하기
          </ThemedText>
          <ThemedText style={styles.buttonDescription}>
            오늘 하루 있었던 일들을 AI와 나눠보세요
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.timelineButton]} 
          onPress={() => router.push('/(tabs)/timeline')}
        >
          <ThemedText type="subtitle" style={styles.buttonText}>
            📅 타임라인 보기
          </ThemedText>
          <ThemedText style={styles.buttonDescription}>
            지난 대화들과 추억을 확인해보세요
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 40,
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: '#4A90E2',
  },
  timelineButton: {
    backgroundColor: '#7B68EE',
  },
  buttonText: {
    color: 'white',
    marginBottom: 8,
  },
  buttonDescription: {
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
});
