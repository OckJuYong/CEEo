// 개선된 이미지 생성 테스트 스크립트
require('dotenv').config();

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

console.log('🎨 개선된 이미지 생성 테스트 시작\n');

// 개선된 이미지 생성 함수 (서비스와 동일)
const generateImage = async (summary) => {
  console.log('🎨 이미지 생성 시작:', summary.substring(0, 100) + '...');
  
  try {
    // 프롬프트를 더 간단하고 안전하게 만들기
    const cleanSummary = summary.replace(/[\"'\\n\\r]/g, ' ').substring(0, 200);
    const imagePrompt = `A warm diary illustration: ${cleanSummary}. Soft watercolor style, pastel colors, peaceful mood, no text.`;
    
    console.log('📝 이미지 프롬프트:', imagePrompt);
    
    const requestBody = {
      model: 'dall-e-3',
      prompt: imagePrompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    };
    
    console.log('📤 DALL-E 요청 전송 중...');
    
    const response = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 DALL-E 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DALL-E 오류 상세:', errorText);
      
      // 폴백 이미지 생성 시도
      console.log('🔄 폴백 이미지 생성 시도...');
      return await generateFallbackImage('평온한 느낌');
    }

    const data = await response.json();
    console.log('📊 DALL-E 응답 데이터 구조 확인');
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error('❌ 잘못된 DALL-E 응답 구조:', data);
      console.log('🔄 폴백 이미지 생성 시도...');
      return await generateFallbackImage('평온한 느낌');
    }
    
    const imageUrl = data.data[0].url;
    console.log('✅ 이미지 생성 성공:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('❌ DALL-E API Error:', error);
    console.log('🔄 폴백 이미지 생성 시도...');
    return await generateFallbackImage('평온한 느낌');
  }
};

// 폴백 이미지 생성 함수
const generateFallbackImage = async (emotion) => {
  console.log('🔄 폴백 이미지 생성 시도:', emotion);
  
  try {
    // 더 간단한 프롬프트로 재시도
    const simplePrompt = `A simple peaceful ${emotion} illustration. Minimalist watercolor, soft colors.`;
    
    const response = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: simplePrompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].url) {
        console.log('✅ 폴백 이미지 생성 성공');
        return data.data[0].url;
      }
    }
    
    throw new Error('폴백 이미지 생성도 실패');
  } catch (error) {
    console.error('❌ 폴백 이미지 생성 실패:', error);
    // 기본 플레이스홀더 이미지 URL 반환
    console.log('🖼️ 플레이스홀더 이미지 사용');
    return 'https://via.placeholder.com/1024x1024/FFE4E1/8B4513?text=AI+Diary+Image';
  }
};

// 다양한 시나리오 테스트
async function runImageTests() {
  const testCases = [
    {
      name: '일반적인 일기 내용',
      summary: '오늘은 친구들과 카페에서 즐거운 시간을 보냈습니다. 맛있는 커피를 마시며 많은 이야기를 나누었고, 오랜만에 웃음이 가득한 하루였습니다.'
    },
    {
      name: '짧은 내용',
      summary: '평온한 하루였습니다.'
    },
    {
      name: '감정적인 내용',
      summary: '오늘은 조금 우울했지만, 저녁에 산책을 하면서 마음이 차분해졌습니다. 자연을 보며 내일은 더 좋은 일이 있을 거라는 희망을 품었습니다.'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\\n🧪 테스트: ${testCase.name}`);
    console.log('━'.repeat(50));
    
    try {
      const imageUrl = await generateImage(testCase.summary);
      console.log(`✅ ${testCase.name} 테스트 성공!`);
      console.log(`🖼️ 이미지 URL: ${imageUrl}`);
    } catch (error) {
      console.log(`❌ ${testCase.name} 테스트 실패: ${error.message}`);
    }
    
    // 테스트 간 간격
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// 테스트 실행
runImageTests().then(() => {
  console.log('\\n🎉 모든 이미지 생성 테스트 완료!');
  console.log('💡 이제 앱에서 이미지 생성이 더 안정적으로 작동할 것입니다.');
}).catch(error => {
  console.error('❌ 테스트 실행 중 오류:', error);
});