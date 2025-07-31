const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = 8080;
const HOST = '0.0.0.0';

console.log('🚀 Starting AI Diary PWA server...');
console.log(`📁 Serving from: ${path.join(__dirname, 'out')}`);
console.log(`🌐 Port: ${PORT}`);

// 빌드 폴더 존재 확인
if (!fs.existsSync(path.join(__dirname, 'out'))) {
  console.error('❌ Build folder "out" not found!');
  process.exit(1);
}

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// 정적 파일 제공 (캐시 설정 포함)
app.use(express.static(path.join(__dirname, 'out'), {
  maxAge: '1d',
  etag: false
}));

// SPA 라우팅 지원 (모든 경로를 index.html로)
app.get('*', (req, res) => {
  const indexFile = path.join(__dirname, 'out', 'index.html');
  
  if (!fs.existsSync(indexFile)) {
    console.error('❌ index.html not found!');
    return res.status(404).send('Index file not found');
  }
  
  res.sendFile(indexFile);
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server successfully started on http://${HOST}:${PORT}`);
  console.log('🎉 AI Diary PWA is ready!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});