/**
 * 数据提取脚本 - 从现有攻略中提取核心景点
 * 
 * 使用方法: npm run extract-data
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { Attraction } from '../lib/types';

// 城市配置 - 手动精选的核心城市
const PRIORITY_CITIES = [
  'beijing', 'shanghai', 'hangzhou', 'chengdu', 'xian',
  'chongqing', 'xiamen', 'sanya', 'guilin', 'suzhou'
];

// 景点类型映射
const TYPE_KEYWORDS: Record<string, Attraction['type']> = {
  '博物馆|纪念馆|故宫|长城|寺|庙|教堂|遗址': 'historical',
  '公园|山|湖|海|岛|湿地|自然': 'natural',
  '艺术|文化|书店|剧院|798': 'cultural',
  '商场|购物|太古里|IFS': 'shopping',
  '美食|餐厅|小吃|火锅': 'food',
  '广场|大楼|CBD|现代': 'modern'
};

// 从攻略文件中提取景点
function extractAttractionsFromGuide(guidePath: string, city: string): Partial<Attraction>[] {
  const content = fs.readFileSync(guidePath, 'utf-8');
  const { data, content: markdown } = matter(content);
  
  const attractions: Partial<Attraction>[] = [];
  const attractionNames = new Set<string>();
  
  // 正则匹配表格中的景点
  const tableRegex = /\|\s*(\d{2}:\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/g;
  let match;
  
  while ((match = tableRegex.exec(markdown)) !== null) {
    const name = match[2].trim();
    const tips = match[3].trim();
    
    // 过滤掉非景点项（如"午餐"、"晚餐"、"返回"等）
    if (name.includes('午餐') || name.includes('晚餐') || 
        name.includes('早餐') || name.includes('返回') ||
        name.includes('休息') || name.includes('自由活动')) {
      continue;
    }
    
    // 去重
    if (attractionNames.has(name)) continue;
    attractionNames.add(name);
    
    // 提取门票价格
    const priceMatch = tips.match(/门票[：:]\s*([¥￥]?\d+)元/);
    const price = priceMatch ? parseInt(priceMatch[1]) : 0;
    
    // 判断是否需要预约
    const needReservation = tips.includes('预约') || tips.includes('提前');
    
    // 判断景点类型
    let type: Attraction['type'] = 'cultural';
    for (const [keywords, attractionType] of Object.entries(TYPE_KEYWORDS)) {
      const regex = new RegExp(keywords);
      if (regex.test(name + tips)) {
        type = attractionType;
        break;
      }
    }
    
    attractions.push({
      id: `${city}-${name.replace(/\s+/g, '-').toLowerCase()}`,
      name,
      city,
      type,
      ticketInfo: {
        price,
        needReservation,
      },
      tags: extractTags(tips),
    });
  }
  
  return attractions;
}

// 提取标签
function extractTags(text: string): string[] {
  const tags: string[] = [];
  
  if (text.includes('免费')) tags.push('免费');
  if (text.includes('网红') || text.includes('打卡')) tags.push('网红打卡');
  if (text.includes('拍照')) tags.push('拍照圣地');
  if (text.includes('亲子')) tags.push('亲子友好');
  if (text.includes('历史') || text.includes('古')) tags.push('历史文化');
  if (text.includes('美食')) tags.push('美食');
  if (text.includes('夜景')) tags.push('夜景');
  
  return tags;
}

// 主函数
async function main() {
  console.log('🚀 开始提取景点数据...\n');
  
  const guidesDir = path.join(__dirname, '../../travel-guides/guides');
  const outputDir = path.join(__dirname, '../data/attractions');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let totalAttractions = 0;
  
  // 遍历优先城市
  for (const city of PRIORITY_CITIES) {
    const cityDir = path.join(guidesDir, city);
    
    if (!fs.existsSync(cityDir)) {
      console.log(`⚠️  跳过 ${city} (目录不存在)`);
      continue;
    }
    
    const files = fs.readdirSync(cityDir);
    const guideFile = files.find(f => f.endsWith('.md'));
    
    if (!guideFile) {
      console.log(`⚠️  跳过 ${city} (无攻略文件)`);
      continue;
    }
    
    const guidePath = path.join(cityDir, guideFile);
    const attractions = extractAttractionsFromGuide(guidePath, city);
    
    // 补充默认值
    const completeAttractions: Attraction[] = attractions.map((attr, index) => ({
      id: attr.id || `${city}-${index}`,
      name: attr.name || '',
      city: attr.city || city,
      type: attr.type || 'cultural',
      location: {
        lat: 0,
        lng: 0,
        address: '',
      },
      duration: {
        quick: 60,
        normal: 120,
        deep: 180,
      },
      openingHours: {
        weekday: '09:00-17:00',
        weekend: '09:00-17:00',
      },
      ticketInfo: {
        price: attr.ticketInfo?.price || 0,
        needReservation: attr.ticketInfo?.needReservation || false,
      },
      crowdLevel: {
        morning: 'medium',
        afternoon: 'high',
        evening: 'low',
      },
      tags: attr.tags || [],
      suitableFor: ['family', 'couple', 'solo', 'friends'],
      weather: ['any'],
      aiSummary: {
        highlights: [],
        tips: [],
        avoidPitfalls: [],
        hiddenGems: [],
      },
    }));
    
    // 保存到JSON文件
    const outputPath = path.join(outputDir, `${city}.json`);
    fs.writeFileSync(
      outputPath,
      JSON.stringify(completeAttractions, null, 2),
      'utf-8'
    );
    
    totalAttractions += completeAttractions.length;
    console.log(`✅ ${city}: 提取了 ${completeAttractions.length} 个景点`);
  }
  
  console.log(`\n🎉 完成! 共提取 ${totalAttractions} 个景点`);
  console.log(`📁 数据保存在: ${outputDir}`);
  console.log('\n⚠️  注意: 需要手动补充以下信息:');
  console.log('   1. 景点坐标 (lat, lng)');
  console.log('   2. 详细开放时间');
  console.log('   3. AI摘要内容');
  console.log('   4. 拥挤度信息');
}

main().catch(console.error);
