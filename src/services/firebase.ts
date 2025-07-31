import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,  
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase 초기화 (빌드 시에는 더미 값 사용)
let app: any = null;
let db: any = null;
let auth: any = null;

try {
  // 유효한 Firebase 구성이 있을 때만 초기화
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'undefined') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    console.warn('⚠️ Firebase 구성이 올바르지 않습니다. CloudType 환경변수를 확인해주세요.');
    
    // 빌드 시 더미 객체 사용
    if (typeof window === 'undefined') {
      db = null;
      auth = null;
    }
  }
} catch (error) {
  console.error('Firebase 초기화 실패:', error);
  db = null;
  auth = null;
}

export { db, auth };