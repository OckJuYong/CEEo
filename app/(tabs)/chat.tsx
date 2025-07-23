import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ChatMessage } from '@/types/diary';
import { sendChatMessage, summarizeConversation, analyzeEmotion, generateImage } from '@/services/openai';
import { saveDiaryEntry } from '@/services/diary';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 오늘 하루는 어떠셨나요? 무슨 일이 있었는지 들려주세요 😊',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setMessageCount(prev => prev + 1);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(newMessages.slice(-10));
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('오류', '메시지를 보내는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const endConversation = async () => {
    if (messages.length < 3) {
      Alert.alert('알맼', '더 많은 대화를 나눈 후 종료해주세요.');
      return;
    }

    setIsLoading(true);
    
    // 단계별 진행 상황을 보여주는 함수
    const showProgress = (step: string) => {
      Alert.alert('대화 처리 중', step, [], { cancelable: false });
    };

    try {
      showProgress('🤖 대화를 요약하고 있습니다...');
      const summary = await summarizeConversation(messages);
      console.log('✅ 대화 요약 완료:', summary.substring(0, 50) + '...');
      
      showProgress('🧠 감정을 분석하고 있습니다...');
      const emotion = await analyzeEmotion(messages);
      console.log('✅ 감정 분석 완료:', emotion);
      
      showProgress('🎨 AI가 그림을 그리고 있습니다... (시간이 조금 걸릴 수 있어요)');
      let imageUrl;
      try {
        imageUrl = await generateImage(summary);
        console.log('✅ 이미지 생성 완료:', imageUrl);
      } catch (imageError) {
        console.error('🖼️ 이미지 생성 실패, 폴백 사용:', imageError);
        // 이미지 생성 실패 시에도 계속 진행
        imageUrl = 'https://via.placeholder.com/1024x1024/FFE4E1/8B4513?text=AI+Diary+Image';
        console.log('🖼️ 폴백 이미지 사용');
      }

      showProgress('💾 일기를 저장하고 있습니다...');
      const today = new Date().toISOString().split('T')[0];
      
      await saveDiaryEntry({
        date: today,
        messages,
        summary,
        emotion,
        imageUrl,
        createdAt: new Date()
      });
      
      console.log('✅ 일기 저장 완료');

      Alert.alert(
        '🎉 대화 완료!', 
        '오늘의 AI 일기가 완성되었습니다!\n\n✅ 대화 요약 완료\n✅ 감정 분석 완료\n✅ AI 그림 생성 완료\n\n타임라인에서 확인해보세요.',
        [
          { 
            text: '타임라인 보기', 
            onPress: () => router.push('/(tabs)/timeline'),
            style: 'default'
          },
          {
            text: '새 대화 시작',
            onPress: () => resetChat(),
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('End conversation error:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      Alert.alert(
        '오류 발생', 
        `대화를 처리하는 중 문제가 발생했습니다:\n\n${errorMessage}\n\n다시 시도해보시겠어요?`,
        [
          { text: '취소', style: 'cancel' },
          { text: '다시 시도', onPress: () => endConversation() }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: '안녕하세요! 오늘 하루는 어떠셨나요? 무슨 일이 있었는지 들려주세요 😊',
      timestamp: new Date()
    }]);
    setMessageCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">AI와 대화하기</ThemedText>
        <ThemedText style={styles.messageCounter}>
          {messageCount}개 메시지 {messageCount >= 5 ? '(일기 생성 가능)' : `(${5 - messageCount}개 더 필요)`}
        </ThemedText>
      </ThemedView>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                message.role === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : styles.botMessage
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.botMessageText
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={styles.botMessageWrapper}>
              <View style={[styles.messageBubble, styles.botMessage]}>
                <Text style={styles.botMessageText}>🤖 생각 중...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          {messageCount >= 5 && (
            <View style={styles.endButtonContainer}>
              <TouchableOpacity 
                style={[styles.endButton, isLoading && styles.endButtonDisabled]} 
                onPress={endConversation}
                disabled={isLoading}
              >
                <Text style={styles.endButtonText}>
                  {isLoading ? '🤖 AI가 열심히 작업 중...' : '🎨 AI 일기 만들기'}
                </Text>
                {!isLoading && (
                  <Text style={styles.endButtonSubtext}>
                    요약 + 감정분석 + AI 그림 생성
                  </Text>
                )}
              </TouchableOpacity>
              {!isLoading && (
                <TouchableOpacity style={styles.resetButton} onPress={resetChat}>
                  <Text style={styles.resetButtonText}>🔄 새 대화 시작</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요..."
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]} 
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  messageCounter: {
    marginTop: 5,
    fontSize: 14,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#4A90E2',
  },
  botMessage: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  endButtonContainer: {
    marginBottom: 15,
    gap: 10,
  },
  endButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  endButtonDisabled: {
    backgroundColor: '#FFB3B3',
  },
  endButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endButtonSubtext: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});