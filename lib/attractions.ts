import type { Attraction, FilterOptions } from './types';
import fs from 'fs';
import path from 'path';

// 缓存数据
let attractionsCache: Map<string, Attraction[]> | null = null;

/**
 * 加载指定城市的景点数据
 */
export function loadAttractions(city: string): Attraction[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'attractions', `${city}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load attractions for ${city}:`, error);
    return [];
  }
}

/**
 * 加载所有城市的景点数据
 */
export function loadAllAttractions(): Map<string, Attraction[]> {
  if (attractionsCache) {
    return attractionsCache;
  }

  const attractionsDir = path.join(process.cwd(), 'data', 'attractions');
  const files = fs.readdirSync(attractionsDir);
  
  const allAttractions = new Map<string, Attraction[]>();
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const city = file.replace('.json', '');
      const attractions = loadAttractions(city);
      allAttractions.set(city, attractions);
    }
  }
  
  attractionsCache = allAttractions;
  return allAttractions;
}

/**
 * 获取所有可用的城市列表
 */
export function getAvailableCities(): string[] {
  const attractionsDir = path.join(process.cwd(), 'data', 'attractions');
  const files = fs.readdirSync(attractionsDir);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * 根据ID查找景点
 */
export function getAttractionById(id: string): Attraction | null {
  const allAttractions = loadAllAttractions();
  
  for (const attractions of allAttractions.values()) {
    const found = attractions.find(attr => attr.id === id);
    if (found) return found;
  }
  
  return null;
}

// 注意: filterAttractions, getAttractionTypeLabel, calculateDistance, findNearbyAttractions
// 已迁移到 attractions-client.ts 供客户端组件使用
