import { DiaryEntry } from '../types/diary';

const DIARY_ENTRIES_KEY = 'diaryEntries';

// 웹 로컬 스토리지용 일기 저장
export const saveDiaryEntryLocal = async (entry: Omit<DiaryEntry, 'id'>): Promise<string> => {
  try {
    console.log('💾 로컬 스토리지에 일기 저장 중...');
    
    // 기존 일기들 불러오기
    const existingEntries = await getDiaryEntriesLocal();
    
    // 새 ID 생성
    const newId = Date.now().toString();
    
    // 새 일기 추가
    const newEntry: DiaryEntry = {
      ...entry,
      id: newId,
      createdAt: new Date()
    };
    
    const updatedEntries = [newEntry, ...existingEntries];
    
    // 웹 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(DIARY_ENTRIES_KEY, JSON.stringify(updatedEntries));
    }
    
    console.log('✅ 로컬 스토리지 저장 완료:', newId);
    return newId;
  } catch (error) {
    console.error('❌ 로컬 스토리지 저장 실패:', error);
    throw error;
  }
};

// 웹 로컬 스토리지에서 일기 목록 불러오기
export const getDiaryEntriesLocal = async (): Promise<DiaryEntry[]> => {
  try {
    console.log('📖 로컬 스토리지에서 일기 불러오기...');
    
    if (typeof window === 'undefined') {
      return [];
    }
    
    const entriesJson = localStorage.getItem(DIARY_ENTRIES_KEY);
    
    if (!entriesJson) {
      console.log('📝 저장된 일기가 없습니다.');
      return [];
    }
    
    const entries: DiaryEntry[] = JSON.parse(entriesJson);
    
    // 날짜 순으로 정렬
    const sortedEntries = entries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log(`✅ ${sortedEntries.length}개 일기 불러오기 완료`);
    return sortedEntries;
  } catch (error) {
    console.error('❌ 로컬 스토리지 불러오기 실패:', error);
    return [];
  }
};

// 특정 일기 삭제
export const deleteDiaryEntryLocal = async (id: string): Promise<void> => {
  try {
    const existingEntries = await getDiaryEntriesLocal();
    const updatedEntries = existingEntries.filter(entry => entry.id !== id);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(DIARY_ENTRIES_KEY, JSON.stringify(updatedEntries));
    }
    
    console.log('✅ 일기 삭제 완료:', id);
  } catch (error) {
    console.error('❌ 일기 삭제 실패:', error);
    throw error;
  }
};

// 모든 일기 삭제 (테스트용)
export const clearAllDiaryEntriesLocal = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DIARY_ENTRIES_KEY);
    }
    console.log('✅ 모든 일기 삭제 완료');
  } catch (error) {
    console.error('❌ 일기 전체 삭제 실패:', error);
    throw error;
  }
};