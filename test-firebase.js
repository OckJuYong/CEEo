// Firebase 테스트 스크립트
require('dotenv').config();

// Firebase 모듈을 동적으로 임포트
async function testFirebase() {
  console.log('🔥 Firebase 연결 테스트 시작...');
  
  try {
    // Firebase SDK 가져오기
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection, addDoc, getDocs, query, orderBy } = await import('firebase/firestore');
    
    // Firebase 설정
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    };
    
    console.log('📝 Firebase 설정:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    });
    
    // Firebase 초기화
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase 초기화 성공');
    
    // 테스트 데이터 저장
    const testEntry = {
      date: new Date().toISOString().split('T')[0],
      messages: [
        {
          role: 'user',
          content: '안녕하세요! 테스트 메시지입니다.',
          timestamp: new Date()
        },
        {
          role: 'assistant', 
          content: '안녕하세요! 반가워요!',
          timestamp: new Date()
        }
      ],
      summary: '테스트 일기입니다. Firebase 연결을 확인하고 있습니다.',
      emotion: '기쁨 - 테스트가 성공적으로 진행되고 있어요',
      imageUrl: 'https://example.com/test-image.png',
      createdAt: new Date()
    };
    
    console.log('💾 테스트 데이터 저장 중...');
    const docRef = await addDoc(collection(db, 'diaryEntries'), testEntry);
    console.log('✅ 테스트 데이터 저장 성공! ID:', docRef.id);
    
    // 데이터 조회 테스트
    console.log('📖 데이터 조회 테스트 중...');
    const q = query(collection(db, 'diaryEntries'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('✅ 데이터 조회 성공! 총', querySnapshot.size, '개 항목');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 ID: ${doc.id}, 날짜: ${data.date}, 요약: ${data.summary.substring(0, 30)}...`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Firebase 테스트 실패:', error.message);
    return false;
  }
}

// ES 모듈을 사용하기 위한 즉시 실행 함수
(async () => {
  console.log('🚀 Firebase 테스트 시작\n');
  
  const success = await testFirebase();
  
  console.log('\n📊 Firebase 테스트 결과:', success ? '✅ 성공' : '❌ 실패');
  
  if (success) {
    console.log('\n🎉 Firebase 연결 및 데이터 저장/조회 모두 정상 작동!');
    console.log('💡 이제 앱에서 일기 데이터가 성공적으로 저장되고 타임라인에 표시될 것입니다.');
  } else {
    console.log('\n⚠️ Firebase 설정을 확인해주세요.');
  }
})();