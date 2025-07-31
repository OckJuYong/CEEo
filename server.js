const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'out')));

// SPA 라우팅 지원 (모든 경로를 index.html로)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});