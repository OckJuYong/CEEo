import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string;
}

// 로그인
export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  if (!auth) {
    throw new Error('Firebase 인증이 초기화되지 않았습니다.');
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      uid: user.uid,
      email: user.email || ''
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// 회원가입
export const registerUser = async (email: string, password: string): Promise<AuthUser> => {
  if (!auth) {
    throw new Error('Firebase 인증이 초기화되지 않았습니다.');
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      uid: user.uid,
      email: user.email || ''
    };
  } catch (error: any) {
    console.error('Register error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// 로그아웃
export const logoutUser = async (): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase 인증이 초기화되지 않았습니다.');
  }
  
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('로그아웃 중 오류가 발생했습니다.');
  }
};

// 현재 사용자 가져오기
export const getCurrentUser = (): User | null => {
  if (!auth) return null;
  return auth.currentUser;
};

// 인증 상태 변경 리스너
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Firebase Auth 에러 메시지 한국어 변환
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return '존재하지 않는 사용자입니다.';
    case 'auth/wrong-password':
      return '비밀번호가 올바르지 않습니다.';
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/weak-password':
      return '비밀번호는 6자 이상이어야 합니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 형식입니다.';
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해주세요.';
    default:
      return '인증 중 오류가 발생했습니다.';
  }
};