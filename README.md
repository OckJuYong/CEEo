# AI 대화 일기 앱 🤖📝

React Native + Expo로 구현한 AI 기반 대화형 일기 앱입니다.

## ✨ 주요 기능

- 🤖 **AI 챗봇과 자연스러운 대화**: GPT-4o-mini를 활용한 친근한 대화 인터페이스
- 📝 **자동 일기 생성**: 대화 내용을 바탕으로 AI가 자동으로 일기 요약 생성
- 🎨 **AI 이미지 생성**: DALL-E 3를 활용해 하루의 추억을 시각적으로 표현
- 🧠 **감정 분석**: 대화 내용을 분석하여 사용자의 감정 상태 파악
- 📅 **타임라인 뷰**: 지난 대화와 일기들을 아름다운 타임라인으로 확인
- 💾 **Firebase 연동**: 모든 데이터를 안전하게 클라우드에 저장

## 🛠 기술 스택

- **Frontend**: React Native 0.79.5, Expo SDK 53
- **Backend**: Firebase Firestore
- **AI Services**: OpenAI GPT-4o-mini, DALL-E 3
- **Language**: TypeScript
- **Navigation**: Expo Router

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Firebase 설정
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# OpenAI API 키 (보안을 위해 실제 배포시에는 서버에서 관리 권장)
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

### 3. Firebase 프로젝트 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화
3. 프로젝트 설정에서 Web 앱 추가 후 구성 정보 복사

### 4. OpenAI API 키 설정
1. [OpenAI Platform](https://platform.openai.com/)에서 API 키 생성
2. `.env` 파일에 API 키 추가

### 5. 앱 실행
```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹에서 실행
npm run web
```

## 📱 주요 화면

### 1. 홈 화면
- 앱 소개 및 주요 기능 안내
- 챗봇 대화 및 타임라인 접근 버튼

### 2. 챗봇 화면
- GPT-4o-mini와의 자연스러운 대화
- 5개 이상 메시지 교환 후 AI 일기 생성 가능
- 실시간 메시지 카운터 및 진행 상황 표시

### 3. 타임라인 화면
- 과거 대화 기록과 AI 생성 일기 확인
- AI가 생성한 이미지와 감정 분석 결과 표시
- 상세 대화 내용 및 통계 정보 제공

## 🔒 보안 고려사항

- API 키는 환경 변수로 관리
- 실제 프로덕션 환경에서는 백엔드 서버를 통한 API 호출 권장
- Firebase 보안 규칙 설정 필요

## 🎨 UI/UX 특징

- 한국어 최적화된 친근한 인터페이스
- 감정에 따른 이모지 자동 매핑
- 부드러운 애니메이션과 직관적인 네비게이션
- 다크모드 지원 (시스템 설정 기반)

## 📄 라이선스

MIT License

## 🤝 기여하기

이슈와 풀 리퀘스트를 환영합니다!

---

💡 **개발 팁**: 개발 중에는 OpenAI API 사용량을 모니터링하여 과도한 요청을 방지하세요.