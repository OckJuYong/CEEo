import React from 'react';
import Link from 'next/link';
import Layout from '../src/components/Layout';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function HomeScreen() {
  return (
    <ProtectedRoute>
      <Layout>
      <div className="flex-1 px-5 justify-center">
        <div className="flex items-center justify-center mb-5 gap-2">
          <h1 className="text-3xl font-bold text-center">AI 대화 일기</h1>
          <span className="text-2xl animate-bounce">👋</span>
        </div>
        
        <p className="text-center text-lg mb-10 opacity-80">
          오늘 하루는 어떠셨나요?
        </p>
        
        <div className="flex flex-col gap-5">
          <Link href="/chat">
            <div className="p-6 rounded-2xl bg-blue-500 text-center cursor-pointer hover:bg-blue-600 transition-colors">
              <h2 className="text-white text-xl font-semibold mb-2">
                💬 AI와 대화하기
              </h2>
              <p className="text-white opacity-80">
                오늘 하루 있었던 일들을 AI와 나눠보세요
              </p>
            </div>
          </Link>
          
          <Link href="/timeline">
            <div className="p-6 rounded-2xl bg-purple-500 text-center cursor-pointer hover:bg-purple-600 transition-colors">
              <h2 className="text-white text-xl font-semibold mb-2">
                📅 타임라인 보기
              </h2>
              <p className="text-white opacity-80">
                지난 대화들과 추억을 확인해보세요
              </p>
            </div>
          </Link>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}