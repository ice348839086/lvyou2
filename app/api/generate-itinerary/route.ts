import { NextRequest, NextResponse } from 'next/server';
import { loadAttractions } from '@/lib/attractions';
import { generateItineraryPrompt, parseItineraryResponse, validateItinerary } from '@/lib/ai/prompts';

// 不使用edge runtime,因为需要使用fetch
export const runtime = 'nodejs';
// 注意: Vercel免费版最大超时10秒,Pro版才支持更长时间
// export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, days, nights, pace, interests, travelers, existingAttractions } = body;

    // 验证输入
    if (!destination || !days) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 加载景点数据
    const attractions = loadAttractions(destination);
    if (attractions.length === 0) {
      return NextResponse.json(
        { error: 'No attractions found for this destination' },
        { status: 404 }
      );
    }

    // 生成Prompt
    const prompt = generateItineraryPrompt({
      destination,
      days,
      nights: nights || days - 1,
      pace: pace || 'normal',
      interests: interests || [],
      travelers: travelers || { adults: 2, children: 0, seniors: 0 },
      attractions,
      existingAttractions: existingAttractions || [],
    });

    // 调用DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    
    console.log('[API] Starting AI generation...', {
      destination,
      days,
      hasApiKey: !!apiKey,
      apiUrl,
    });
    
    if (!apiKey) {
      console.error('[API] Missing DEEPSEEK_API_KEY');
      return NextResponse.json(
        { error: 'AI service not configured. Please set DEEPSEEK_API_KEY in environment variables' },
        { status: 500 }
      );
    }

    // 调用DeepSeek Chat Completion API (增加超时控制)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55秒超时
    
    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API] DeepSeek API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }
    } catch (fetchError: any) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        console.error('[API] Request timeout after 55s');
        return NextResponse.json(
          { error: 'AI生成超时,请稍后重试' },
          { status: 504 }
        );
      }
      throw fetchError;
    }

    const data = await response.json();
    
    // 解析响应
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    console.log('AI Response received, length:', content.length);
    
    // 解析AI返回的内容
    let itineraryData;
    try {
      itineraryData = parseItineraryResponse(content);
    } catch (parseError: any) {
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'AI返回的数据格式不正确', 
          details: parseError.message,
          rawResponse: content.substring(0, 500) // 返回前500字符用于调试
        },
        { status: 500 }
      );
    }

    // 验证数据
    const validation = validateItinerary(itineraryData, attractions);
    if (!validation.valid) {
      console.error('Validation errors:', validation.errors);
      return NextResponse.json(
        { 
          error: '生成的行程包含错误', 
          details: validation.errors.join('; ')
        },
        { status: 500 }
      );
    }

    console.log('[API] Generation successful');
    return NextResponse.json(itineraryData);
  } catch (error: any) {
    console.error('[API] Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
