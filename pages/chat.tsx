import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import ProtectedRoute from '../src/components/ProtectedRoute';
import { sendChatMessage, summarizeConversation, analyzeEmotion, generateImage } from '../src/services/openai';
import { saveDiaryEntry } from '../src/services/diary';
import { ChatMessage } from '../src/types/diary';

export default function ChatScreen() {
  const router = useRouter();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      console.log('🤖 GPT API 호출 중...');
      const response = await sendChatMessage(newMessages.slice(-10));
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      console.log('✅ GPT 응답 완료');
    } catch (error) {
      console.error('Chat error:', error);
      alert('메시지를 보내는 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    if (messages.length < 3) {
      alert('더 많은 대화를 나눈 후 종료해주세요.');
      return;
    }

    if (confirm('AI 일기를 생성하시겠습니까? (요약, 감정분석, AI 그림 생성)')) {
      setIsLoading(true);
      
      try {
        console.log('🤖 대화 요약 시작...');
        const summary = await summarizeConversation(messages);
        console.log('✅ 대화 요약 완료');
        
        console.log('🧠 감정 분석 시작...');
        const emotion = await analyzeEmotion(messages);
        console.log('✅ 감정 분석 완료');
        
        console.log('🎨 AI 이미지 생성 시작...');
        const imageUrl = await generateImage(summary);
        console.log('✅ AI 이미지 생성 완료');
        
        console.log('💾 일기 저장 시작...');
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
        
        alert('🎉 AI 일기 생성 완료!\n\n✅ 대화 요약\n✅ 감정 분석\n✅ AI 그림 생성\n\n타임라인에서 확인해보세요!');
        router.push('/timeline');
      } catch (error) {
        console.error('End conversation error:', error);
        alert('AI 일기 생성 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
      } finally {
        setIsLoading(false);
      }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="p-5 border-b border-gray-200 text-center bg-white">
          <h2 className="text-xl font-semibold">AI와 대화하기</h2>
          <p className="text-sm text-gray-600 mt-1">
            {messageCount}개 메시지 {messageCount >= 5 ? '(일기 생성 가능)' : `(${5 - messageCount}개 더 필요)`}
          </p>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-base leading-5">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white text-gray-800 border border-gray-200">
                <p>🤖 생각 중...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="p-4 bg-white border-t border-gray-200">
          {messageCount >= 5 && (
            <div className="mb-4 space-y-2">
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold ${
                  isLoading 
                    ? 'bg-red-300 text-white cursor-not-allowed' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                onClick={endConversation}
                disabled={isLoading}
              >
                {isLoading ? '🤖 AI가 열심히 작업 중...' : '🎨 AI 일기 만들기'}
              </button>
              {!isLoading && (
                <button
                  className="w-full py-2 px-4 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                  onClick={resetChat}
                >
                  🔄 새 대화 시작
                </button>
              )}
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <textarea
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              rows={1}
              maxLength={500}
              disabled={isLoading}
            />
            <button
              className={`px-5 py-2 rounded-2xl font-semibold ${
                (!inputText.trim() || isLoading)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              전송
            </button>
          </div>
        </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}