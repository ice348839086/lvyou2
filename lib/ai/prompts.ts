import type { Attraction } from '../types';

/**
 * 生成行程规划的Prompt
 */
export function generateItineraryPrompt(params: {
  destination: string;
  days: number;
  nights: number;
  pace: 'relaxed' | 'normal' | 'packed';
  interests: string[];
  travelers: {
    adults: number;
    children: number;
    seniors: number;
  };
  attractions: Attraction[];
  existingAttractions?: Array<{
    id: string;
    name: string;
    type: string;
    duration: any;
  }>;
}): string {
  const { destination, days, nights, pace, interests, travelers, attractions, existingAttractions = [] } = params;

  const paceDescriptions = {
    relaxed: '休闲(每日2-3个景点,节奏舒缓)',
    normal: '标准(每日3-4个景点,时间充裕)',
    packed: '紧凑(每日4-5个景点,行程饱满)',
  };

  const existingAttractionsText = existingAttractions.length > 0
    ? `\n\n# 用户已添加的景点 (必须优先安排)
${existingAttractions.map(attr => `- ${attr.name} (ID: ${attr.id})`).join('\n')}

**重要提示**: 
- 这些景点是用户已经选择的,必须在行程中优先安排
- 根据景点的地理位置和类型,智能安排到合适的天数
- 确保每个已添加的景点都出现在最终行程中
- 在这些景点基础上,再添加其他合适的景点完善行程`
    : '';

  return `你是一位资深旅行规划师,擅长设计合理高效的旅行行程。

# 用户需求
- 目的地: ${destination}
- 天数: ${days}天${nights}夜
- 旅行节奏: ${paceDescriptions[pace]}
- 兴趣偏好: ${interests.join('、')}
- 同行人员: ${travelers.adults}位成人${travelers.children > 0 ? `、${travelers.children}位儿童` : ''}${travelers.seniors > 0 ? `、${travelers.seniors}位老人` : ''}${existingAttractionsText}

# 可选景点数据
${JSON.stringify(attractions.map(attr => ({
  id: attr.id,
  name: attr.name,
  type: attr.type,
  duration: attr.duration,
  location: attr.location,
  tags: attr.tags,
  openingHours: attr.openingHours,
  ticketInfo: attr.ticketInfo,
  aiSummary: attr.aiSummary,
})), null, 2)}

# 规划原则
1. **地理聚类**: 同一天的景点距离不超过15km,优化游览顺序减少交通时间
2. **时间合理**: 
   - 严格考虑开放时间和闭馆日,避免安排闭馆景点
   - 预留交通缓冲时间(市内30分钟,远郊1-2小时)
   - 考虑最佳游览时段(如博物馆上午人少、夜景傍晚最佳)
3. **体验平衡**:
   - 动静结合(历史遗迹+公园漫步+城市观景)
   - 室内外交替(避免全天暴晒或全天室内)
   - 每日1-2个核心亮点景点,其他为辅助景点
4. **用餐场景化**:
   - 正餐时间(11:30-13:00, 17:30-19:30)自动安排用餐
   - 推荐所在区域特色餐厅或美食街
   - 考虑餐饮类型多样性
5. **人群适配**:
   - 有儿童: 避免过长步行,增加休息时间,选择亲子友好景点
   - 有老人: 避免爬山涉水,选择平缓路线,预留充足时间
   - 情侣: 增加浪漫元素,如夜景、文艺街区

# 输出要求
**重要：你必须只返回纯JSON格式，不要添加任何解释文字。**

请生成3个不同风格的方案，严格按照以下JSON格式返回：

{
  "plans": [
    {
      "version": "deep",
      "title": "深度体验版",
      "description": "8个景点,节奏舒缓,适合深度游览",
      "totalAttractions": 8,
      "dailyPlans": [
        {
          "day": 1,
          "date": "2026-05-01",
          "theme": "当日主题(如:天安门-故宫-景山)",
          "activities": [
            {
              "time": "08:30",
              "name": "景点名称",
              "attractionId": "景点ID(必须来自提供的景点数据)",
              "type": "attraction",
              "duration": 180,
              "tips": ["从东华门进入最快", "珍宝馆必看"],
              "aiReason": "为什么选择这个景点和时间"
            },
            {
              "time": "12:00",
              "name": "午餐: 四季民福烤鸭",
              "type": "meal",
              "duration": 60,
              "tips": ["步行5分钟", "人均120元"],
              "aiReason": "位于景点附近,特色美食"
            }
          ],
          "estimatedCost": 200
        }
      ]
    },
    {
      "version": "classic",
      "title": "经典全景版",
      "description": "12个景点,覆盖必去景点,适合首次到访",
      "totalAttractions": 12,
      "dailyPlans": []
    },
    {
      "version": "niche",
      "title": "小众探索版",
      "description": "10个景点,避开人潮,独特体验",
      "totalAttractions": 10,
      "dailyPlans": []
    }
  ]
}

**关键规则：**
1. 只返回JSON，不要用markdown代码块包裹（不要用\`\`\`json）
2. 所有attractionId必须来自提供的景点数据
3. 严格遵守景点开放时间
4. 同一天的景点要地理位置接近
5. 3个方案要有明显差异
6. 每个活动必须包含aiReason字段

现在请直接返回JSON数据：`;
}

/**
 * 解析AI返回的行程数据
 */
export function parseItineraryResponse(response: string): any {
  try {
    // 尝试多种方式提取JSON
    let jsonStr = response.trim();
    
    // 方式1: 提取 ```json ... ``` 代码块
    let jsonMatch = response.match(/```json\s*\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // 方式2: 提取 ``` ... ``` 代码块
      jsonMatch = response.match(/```\s*\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      } else {
        // 方式3: 查找第一个 { 到最后一个 }
        const firstBrace = response.indexOf('{');
        const lastBrace = response.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = response.substring(firstBrace, lastBrace + 1);
        }
      }
    }
    
    // 记录解析的内容（用于调试）
    console.log('Parsing JSON string (first 500 chars):', jsonStr.substring(0, 500));
    
    const parsed = JSON.parse(jsonStr);
    
    // 验证基本结构
    if (!parsed.plans || !Array.isArray(parsed.plans)) {
      throw new Error('返回的数据缺少plans数组');
    }
    
    return parsed;
  } catch (error: any) {
    console.error('Failed to parse itinerary response:', error);
    console.error('Response content (first 1000 chars):', response.substring(0, 1000));
    throw new Error(`AI返回的数据格式不正确: ${error.message}`);
  }
}

/**
 * 验证行程数据的合法性
 */
export function validateItinerary(data: any, availableAttractions: Attraction[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const attractionIds = new Set(availableAttractions.map(a => a.id));

  if (!data.plans || !Array.isArray(data.plans)) {
    errors.push('缺少plans数组');
    return { valid: false, errors };
  }

  for (const plan of data.plans) {
    if (!plan.dailyPlans || !Array.isArray(plan.dailyPlans)) {
      errors.push(`方案${plan.version}缺少dailyPlans`);
      continue;
    }

    for (const dailyPlan of plan.dailyPlans) {
      if (!dailyPlan.activities || !Array.isArray(dailyPlan.activities)) {
        errors.push(`Day ${dailyPlan.day}缺少activities`);
        continue;
      }

      for (const activity of dailyPlan.activities) {
        if (activity.type === 'attraction' && activity.attractionId) {
          if (!attractionIds.has(activity.attractionId)) {
            errors.push(`景点ID不存在: ${activity.attractionId}`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
