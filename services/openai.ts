import Constants from 'expo-constants';
import { ChatMessage } from '../types/diary';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey ?? process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

export const sendChatMessage = async (messages: ChatMessage[]): Promise<string> => {
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
            content: '당신은 친근하고 공감능력이 뛰어난 챗봇입니다. 사용자와 자연스러운 대화를 나누며, 하루 있었던 일들에 대해 물어보고 공감해주세요. 짧고 친근한 말투로 대화하세요. 사용자가 하루에 대해 충분히 이야기했다면, 자연스럽게 대화를 마무리하도록 유도해주세요.'
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('OpenAI API로부터 잘못된 응답을 받았습니다.');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`챗 메시지 전송 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

export const summarizeConversation = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
      .join('\n');
    
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
            content: '사용자가 오늘 하루 있었던 일들을 요약해주세요. 주요 활동, 느난 점, 특별한 사건들을 포함하여 일기 형태로 정리해주세요. 자연스럽고 따뜻한 어조로 작성해주세요.'
          },
          {
            role: 'user',
            content: `다음 대화 내용을 바탕으로 오늘 하루를 요약해주세요:\n\n${conversationText}`
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('OpenAI API로부터 잘못된 응답을 받았습니다.');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Summarization Error:', error);
    throw new Error(`대화 요약 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

export const analyzeEmotion = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ');
    
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
            content: '사용자의 대화 내용을 분석하여 감정 상태를 파악해주세요. 기쁨, 슬픔, 화남, 불안, 평온, 흥미로움, 복잡한 감정 중 가장 주된 것으로 답하되, 간단한 설명도 포함해주세요. "기쁨 - 오늘 좋은 일이 많았네요" 같은 형식으로 작성해주세요.'
          },
          {
            role: 'user',
            content: `다음 대화 내용에서 감정을 분석해주세요: ${userMessages}`
          }
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('OpenAI API로부터 잘못된 응답을 받았습니다.');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Emotion Analysis Error:', error);
    throw new Error(`감정 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

export const generateImage = async (summary: string): Promise<string> => {
  console.log('🎨 이미지 생성 시작:', summary.substring(0, 100) + '...');
  
  try {
    // 프롬프트를 더 간단하고 안전하게 만들기
    const cleanSummary = summary.replace(/[\"'\n\r]/g, ' ').substring(0, 200);
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
export const generateFallbackImage = async (emotion: string): Promise<string> => {
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