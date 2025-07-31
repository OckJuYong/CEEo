import React, { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import Image from 'next/image';

// 타입 정의 (이후 분리 예정)
interface DiaryEntry {
  id: string;
  date: string;
  summary: string;
  emotion: string;
  imageUrl?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
}

export default function TimelineScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  // 임시 데이터 (이후 실제 API 연동)
  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      // TODO: 실제 API 호출 
      // const data = await getDiaryEntries();
      
      // 임시 데이터
      const mockEntries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-15',
          summary: '오늘은 새로운 프로젝트를 시작했습니다. 조금 긴장되지만 기대됩니다.',
          emotion: '기대',
          imageUrl: '/placeholder-image.jpg',
          messages: [
            { role: 'user', content: '오늘 새 프로젝트를 시작했어요', timestamp: new Date() },
            { role: 'assistant', content: '와, 새로운 시작이네요! 어떤 기분이세요?', timestamp: new Date() }
          ],
          createdAt: new Date()
        }
      ];
      
      setEntries(mockEntries);
      setIsLoading(false);
    };

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
    if (emotionLower.includes('기대')) return '🤗';
    return '😐';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">타임라인을 불러오고 있습니다...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedEntry) {
    return (
      <Layout>
        <div className="flex flex-col h-screen bg-gray-50">
          {/* 상세 헤더 */}
          <div className="p-5 border-b border-gray-200 bg-white">
            <button 
              className="mb-2 text-blue-500 hover:text-blue-700"
              onClick={() => setSelectedEntry(null)}
            >
              ← 돌아가기
            </button>
            <h2 className="text-xl font-semibold">{formatDate(selectedEntry.date)}</h2>
          </div>

          {/* 상세 내용 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              {/* 이미지 */}
              {selectedEntry.imageUrl ? (
                <div className="relative">
                  <div className="w-full h-72 bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 text-center">
                    🎨 AI가 그린 오늘의 이미지
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-5xl mb-3">🎨</span>
                  <p className="text-gray-600 font-semibold">AI 이미지 생성 실패</p>
                  <p className="text-sm text-gray-500 text-center mt-2">다음에 더 멋진 이미지를 만들어드릴게요!</p>
                </div>
              )}
              
              {/* 정보 */}
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <span className="text-lg mr-2">{getEmotionEmoji(selectedEntry.emotion)}</span>
                  <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">{selectedEntry.emotion}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">📝 오늘의 AI 일기</h3>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-5">
                  <p className="text-gray-800 leading-6">{selectedEntry.summary}</p>
                </div>
                
                <div className="flex justify-around py-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-xl mb-1">💬</div>
                    <p className="text-sm text-gray-600">{selectedEntry.messages.filter(m => m.role === 'user').length}개 메시지</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">🎨</div>
                    <p className="text-sm text-gray-600">AI 그림 생성</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">🧠</div>
                    <p className="text-sm text-gray-600">감정 분석</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 대화 기록 */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-semibold mb-4">💬 대화 기록</h3>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {selectedEntry.messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs opacity-70">
                          {message.role === 'user' ? '👤 나' : '🤖 AI'}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="p-5 border-b border-gray-200 text-center bg-white">
          <h1 className="text-2xl font-bold">📅 AI 일기 타임라인</h1>
          <p className="text-gray-600 mt-1">지금까지의 AI와의 대화와 추억들</p>
        </div>

        {/* 콘텐츠 */}
        {entries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-5">📝</div>
              <p className="text-lg text-gray-600 mb-2">아직 대화 기록이 없습니다</p>
              <p className="text-gray-500">챗봇과 대화를 나눠보세요!</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl shadow-lg p-5 mb-4 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedEntry(entry)}
              >
                {/* 엔트리 헤더 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">{formatDate(entry.date)}</p>
                    <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full inline-block">
                      🤖 AI 일기
                    </div>
                  </div>
                  <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                </div>
                
                {/* 이미지 */}
                {entry.imageUrl ? (
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      🎨 AI 생성
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                    <span className="text-4xl mb-2">🎨</span>
                    <p className="text-gray-500 text-sm">AI 이미지</p>
                  </div>
                )}
                
                {/* 요약 */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">📖 오늘의 이야기</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500 line-clamp-4">
                    {entry.summary}
                  </p>
                </div>
                
                {/* 푸터 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getEmotionEmoji(entry.emotion)}</span>
                    <span className="text-sm font-semibold text-blue-600">{entry.emotion}</span>
                  </div>
                  <p className="text-xs text-gray-400 italic">👆 탭하여 상세보기</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}