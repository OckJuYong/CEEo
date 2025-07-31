import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="pwa-container">
      {/* 상단 헤더 (사용자 정보) */}
      {user && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">안녕하세요!</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <span className="text-xl">👤</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-lg"
                >
                  🚪 로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <main className="content-container min-h-screen">
        {children}
      </main>
      
      {/* 하단 탭 바 */}
      <nav className="tab-bar">
        <Link href="/">
          <div className={`tab-item ${router.pathname === '/' ? 'active' : ''}`}>
            <span className="text-2xl mb-1">🏠</span>
            <span className="text-xs">홈</span>
          </div>
        </Link>
        
        <Link href="/chat">
          <div className={`tab-item ${router.pathname === '/chat' ? 'active' : ''}`}>
            <span className="text-2xl mb-1">💬</span>
            <span className="text-xs">채팅</span>
          </div>
        </Link>
        
        <Link href="/timeline">
          <div className={`tab-item ${router.pathname === '/timeline' ? 'active' : ''}`}>
            <span className="text-2xl mb-1">📅</span>
            <span className="text-xs">타임라인</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}