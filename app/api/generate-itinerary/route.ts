import { NextRequest, NextResponse } from 'next/server';
import { loadAttractions } from '@/lib/attractions';
import { generateItineraryPrompt, parseItineraryResponse, validateItinerary } from '@/lib/ai/prompts';

// 不使用edge runtime,因为需要使用fetch
export const runtime = 'nodejs';

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
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set DEEPSEEK_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // 调用DeepSeek Chat Completion API
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
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API Error:', errorData);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
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

    return NextResponse.json(itineraryData);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
