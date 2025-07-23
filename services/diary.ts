import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { DiaryEntry, ChatMessage } from '../types/diary';
import { saveDiaryEntryLocal, getDiaryEntriesLocal } from './localStorage';

// Firebase 사용 가능 여부 확인
const isFirebaseAvailable = async (): Promise<boolean> => {
  try {
    // 간단한 Firebase 연결 테스트
    await getDocs(query(collection(db, 'diaryEntries')));
    return true;
  } catch (error) {
    console.log('🔥 Firebase 사용 불가, 로컬 스토리지 사용:', error);
    return false;
  }
};

export const saveDiaryEntry = async (entry: Omit<DiaryEntry, 'id'>): Promise<string> => {
  try {
    // Firebase 시도
    if (await isFirebaseAvailable()) {
      console.log('🔥 Firebase로 일기 저장 시도...');
      const docRef = await addDoc(collection(db, 'diaryEntries'), {
        ...entry,
        createdAt: new Date(),
      });
      console.log('✅ Firebase 저장 성공');
      return docRef.id;
    } else {
      // Firebase 실패 시 로컬 스토리지 사용
      console.log('💾 로컬 스토리지로 일기 저장...');
      return await saveDiaryEntryLocal(entry);
    }
  } catch (error) {
    console.error('❌ Firebase 저장 실패, 로컬 스토리지로 전환:', error);
    try {
      return await saveDiaryEntryLocal(entry);
    } catch (localError) {
      console.error('❌ 로컬 스토리지 저장도 실패:', localError);
      throw new Error('일기 저장에 실패했습니다.');
    }
  }
};

export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  try {
    // Firebase 시도
    if (await isFirebaseAvailable()) {
      console.log('🔥 Firebase에서 일기 불러오기...');
      const q = query(collection(db, 'diaryEntries'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as DiaryEntry[];
      
      console.log(`✅ Firebase에서 ${entries.length}개 일기 불러오기 완료`);
      return entries;
    } else {
      // Firebase 실패 시 로컬 스토리지 사용
      console.log('💾 로컬 스토리지에서 일기 불러오기...');
      return await getDiaryEntriesLocal();
    }
  } catch (error) {
    console.error('❌ Firebase 불러오기 실패, 로컬 스토리지로 전환:', error);
    try {
      return await getDiaryEntriesLocal();
    } catch (localError) {
      console.error('❌ 로컬 스토리지 불러오기도 실패:', localError);
      return [];
    }
  }
};