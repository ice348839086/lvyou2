// 景点数据模型
export interface Attraction {
  id: string;
  name: string;
  city: string;
  type: 'historical' | 'natural' | 'cultural' | 'modern' | 'food' | 'shopping';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  duration: {
    quick: number;      // 快速打卡(分钟)
    normal: number;     // 常规游览
    deep: number;       // 深度体验
  };
  openingHours: {
    weekday: string;
    weekend: string;
    closedDays?: string[];
  };
  ticketInfo: {
    price: number | { adult: number; child?: number; senior?: number };
    needReservation: boolean;
    reservationUrl?: string;
    reservationAdvanceDays?: number;
  };
  crowdLevel: {
    morning: 'low' | 'medium' | 'high';
    afternoon: 'low' | 'medium' | 'high';
    evening: 'low' | 'medium' | 'high';
  };
  tags: string[];
  suitableFor: ('family' | 'couple' | 'solo' | 'friends')[];
  weather: ('sunny' | 'rainy' | 'any')[];
  aiSummary: {
    highlights: string[];      // 必看亮点
    tips: string[];           // 游玩建议
    avoidPitfalls: string[];  // 避坑指南
    hiddenGems: string[];     // 隐藏玩法
  };
  xiaohongshuTags?: string[]; // 小红书热门标签
  relatedAttractions?: string[]; // 关联景点ID
}

// 用户行程规划
export interface TripPlan {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: {
    adults: number;
    children: number;
    seniors: number;
  };
  preferences: {
    pace: 'relaxed' | 'normal' | 'packed';
    interests: string[];
    budget: 'budget' | 'moderate' | 'luxury';
  };
  dailyPlans: DailyPlan[];
  generatedBy: 'ai' | 'template' | 'user';
}

export interface DailyPlan {
  day: number;
  date: Date;
  theme: string;
  activities: Activity[];
  estimatedCost: number;
}

export interface Activity {
  time: string;
  type: 'attraction' | 'meal' | 'transport' | 'rest';
  attractionId?: string;
  name: string;
  duration: number;
  tips: string[];
  aiReason?: string; // AI推荐理由
}

// 城市数据
export interface CityData {
  id: string;
  name: string;
  attractions: Attraction[];
}
