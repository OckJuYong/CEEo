// API 테스트 스크립트
require('dotenv').config();

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

console.log('🔑 API 키 확인:', OPENAI_API_KEY ? '설정됨' : '없음');
console.log('🔗 Firebase 프로젝트 ID:', process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);

// 간단한 GPT 테스트
async function testGPT() {
  console.log('\n🤖 GPT API 테스트 시작...');
  
  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 친근한 AI입니다. 간단히 인사해주세요.'
          },
          {
            role: 'user',
            content: '안녕하세요!'
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ GPT 응답:', data.choices[0].message.content);
    
    return true;
  } catch (error) {
    console.error('❌ GPT 테스트 실패:', error.message);
    return false;
  }
}

// DALL-E 테스트
async function testDALLE() {
  console.log('\n🎨 DALL-E API 테스트 시작...');
  
  try {
    const response = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: 'A simple happy sun with a smiling face in cartoon style',
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ DALL-E 이미지 생성 성공!');
    console.log('🖼️ 이미지 URL:', data.data[0].url);
    
    return data.data[0].url;
  } catch (error) {
    console.error('❌ DALL-E 테스트 실패:', error.message);
    return null;
  }
}

// 테스트 실행
async function runTests() {
  console.log('🚀 API 테스트 시작\n');
  
  const gptSuccess = await testGPT();
  const dalleImageUrl = await testDALLE();
  
  console.log('\n📊 테스트 결과:');
  console.log('GPT-4o-mini:', gptSuccess ? '✅ 성공' : '❌ 실패');
  console.log('DALL-E 3:', dalleImageUrl ? '✅ 성공' : '❌ 실패');
  
  if (gptSuccess && dalleImageUrl) {
    console.log('\n🎉 모든 API 테스트 통과! 앱이 정상 작동할 것입니다.');
  } else {
    console.log('\n⚠️ 일부 API 테스트 실패. 설정을 확인해주세요.');
  }
}

runTests();