import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DiaryEntry } from '@/types/diary';
import { getDiaryEntries } from '@/services/diary';

export default function TimelineScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const loadEntries = async () => {
    try {
      const data = await getDiaryEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getEmotionEmoji = (emotion: string) => {
    const emotionLower = emotion.toLowerCase();
    if (emotionLower.includes('기쁨') || emotionLower.includes('행복') || emotionLower.includes('좋')) return '😊';
    if (emotionLower.includes('슬픔') || emotionLower.includes('우울')) return '😢';
    if (emotionLower.includes('화남') || emotionLower.includes('진노')) return '😠';
    if (emotionLower.includes('불안') || emotionLower.includes('걱정')) return '😰';
    if (emotionLower.includes('평온') || emotionLower.includes('평지')) return '😌';
    if (emotionLower.includes('흥미') || emotionLower.includes('호기심')) return '🤔';
    if (emotionLower.includes('피곤') || emotionLower.includes('지쳐')) return '😴';
    if (emotionLower.includes('당황') || emotionLower.includes('놀라')) return '😲';
    if (emotionLower.includes('복잡')) return '😕';
    return '😐';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <ThemedText style={styles.loadingText}>타임라인을 불러오고 있습니다...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedEntry) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedEntry(null)}
          >
            <Text style={styles.backButtonText}>← 돌아가기</Text>
          </TouchableOpacity>
          <ThemedText type="subtitle">{formatDate(selectedEntry.date)}</ThemedText>
        </ThemedView>

        <ScrollView style={styles.detailContent}>
          <View style={styles.detailCard}>
            {/* 이미지 표시 개선 */}
            {selectedEntry.imageUrl && selectedEntry.imageUrl !== 'https://via.placeholder.com/1024x1024/FFE4E1/8B4513?text=AI+Diary+Image' ? (
              <View style={styles.detailImageContainer}>
                <Image 
                  source={{ uri: selectedEntry.imageUrl }} 
                  style={styles.detailImage}
                  resizeMode="cover"
                  onLoad={() => console.log('상세 이미지 로드 성공')}
                  onError={(error) => console.log('상세 이미지 로드 실패:', error)}
                />
                <View style={styles.detailImageOverlay}>
                  <Text style={styles.detailImageOverlayText}>🎨 AI가 그린 오늘의 이미지</Text>
                </View>
              </View>
            ) : (
              <View style={styles.detailPlaceholderContainer}>
                <View style={styles.detailPlaceholder}>
                  <Text style={styles.detailPlaceholderEmoji}>🎨</Text>
                  <Text style={styles.detailPlaceholderText}>AI 이미지 생성 실패</Text>
                  <Text style={styles.detailPlaceholderSubtext}>대신 다음에 더 멋진 이미지를 만들어드릴게요!</Text>
                </View>
              </View>
            )}
            
            <View style={styles.detailInfo}>
              <View style={styles.emotionBadge}>
                <Text style={styles.emotionEmoji}>{getEmotionEmoji(selectedEntry.emotion)}</Text>
                <Text style={styles.emotionText}>{selectedEntry.emotion}</Text>
              </View>
              
              <ThemedText type="subtitle" style={styles.summaryTitle}>📝 오늘의 AI 일기</ThemedText>
              <View style={styles.detailSummaryContainer}>
                <Text style={styles.summaryText}>{selectedEntry.summary}</Text>
              </View>
              
              <View style={styles.detailStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>💬</Text>
                  <Text style={styles.statText}>{selectedEntry.messages.filter(m => m.role === 'user').length}개 메시지</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>🎨</Text>
                  <Text style={styles.statText}>AI 그림 생성</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>🧠</Text>
                  <Text style={styles.statText}>감정 분석</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.conversationCard}>
            <ThemedText type="subtitle" style={styles.conversationTitle}>💬 대화 기록</ThemedText>
            <ScrollView style={styles.conversationScroll} showsVerticalScrollIndicator={false}>
              {selectedEntry.messages.map((message, index) => (
                <View key={index} style={[
                  styles.messageItem,
                  message.role === 'user' ? styles.userMessageItem : styles.botMessageItem
                ]}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageRole}>
                      {message.role === 'user' ? '👤 나' : '🤖 AI'}
                    </Text>
                    <Text style={styles.messageTime}>
                      {new Date(message.timestamp).toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                  <Text style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.botMessageText
                  ]}>
                    {message.content}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">📅 AI 일기 타임라인</ThemedText>
        <ThemedText style={styles.subtitle}>지금까지의 AI와의 대화와 추억들</ThemedText>
      </ThemedView>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <ThemedText style={styles.emptyText}>아직 대화 기록이 없습니다</ThemedText>
          <ThemedText style={styles.emptySubtext}>챗봇과 대화를 나눠보세요!</ThemedText>
        </View>
      ) : (
        <ScrollView 
          style={styles.timelineContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => setSelectedEntry(entry)}
              activeOpacity={0.7}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryDateContainer}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  <View style={styles.entryBadge}>
                    <Text style={styles.entryBadgeText}>🤖 AI 일기</Text>
                  </View>
                </View>
                <Text style={styles.entryEmoji}>{getEmotionEmoji(entry.emotion)}</Text>
              </View>
              
              {/* 이미지 표시 개선 */}
              {entry.imageUrl && entry.imageUrl !== 'https://via.placeholder.com/1024x1024/FFE4E1/8B4513?text=AI+Diary+Image' ? (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: entry.imageUrl }} 
                    style={styles.entryImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('이미지 로드 실패:', error.nativeEvent.error);
                    }}
                    onLoad={() => {
                      console.log('이미지 로드 성공:', entry.imageUrl);
                    }}
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageOverlayText}>🎨 AI 생성</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderImageContainer}>
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderEmoji}>🎨</Text>
                    <Text style={styles.placeholderText}>AI 이미지</Text>
                  </View>
                </View>
              )}
              
              {/* 요약 표시 개선 */}
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryLabel}>📖 오늘의 이야기</Text>
                <Text style={styles.entrySummary} numberOfLines={4}>
                  {entry.summary}
                </Text>
              </View>
              
              <View style={styles.entryFooter}>
                <View style={styles.emotionContainer}>
                  <Text style={styles.emotionEmoji}>{getEmotionEmoji(entry.emotion)}</Text>
                  <Text style={styles.entryEmotion}>{entry.emotion}</Text>
                </View>
                <Text style={styles.tapToView}>👆 탭하여 상세보기</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 5,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  timelineContainer: {
    flex: 1,
    padding: 15,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  entryDateContainer: {
    flex: 1,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  entryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  entryBadgeText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  entryEmoji: {
    fontSize: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  entrySummary: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryEmotion: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  tapToView: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  placeholderImageContainer: {
    marginBottom: 15,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  detailHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  detailContent: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailImageContainer: {
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  detailImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  detailImageOverlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailPlaceholderContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  detailPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  detailPlaceholderEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  detailPlaceholderText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailPlaceholderSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    maxWidth: 200,
  },
  detailSummaryContainer: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    marginBottom: 20,
  },
  detailInfo: {
    padding: 20,
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  emotionEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  emotionText: {
    fontSize: 14,
    color: '#666',
  },
  summaryTitle: {
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontWeight: '400',
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  conversationCard: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationTitle: {
    marginBottom: 15,
  },
  conversationScroll: {
    maxHeight: 400,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  messageItem: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
  },
  userMessageItem: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  botMessageItem: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
});