import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="pwa-container">
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