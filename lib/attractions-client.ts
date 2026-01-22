import type { Attraction, FilterOptions } from './types';

/**
 * 筛选景点 (客户端版本)
 */
export function filterAttractions(
  attractions: Attraction[],
  filters: FilterOptions
): Attraction[] {
  return attractions.filter(attraction => {
    // 类型筛选
    if (filters.type && attraction.type !== filters.type) {
      return false;
    }
    
    // 游玩时长筛选
    if (filters.duration) {
      const normalDuration = attraction.duration.normal;
      if (filters.duration === 'short' && normalDuration > 90) return false;
      if (filters.duration === 'medium' && (normalDuration < 90 || normalDuration > 180)) return false;
      if (filters.duration === 'long' && normalDuration < 180) return false;
    }
    
    // 适合人群筛选
    if (filters.suitableFor && !attraction.suitableFor.includes(filters.suitableFor as any)) {
      return false;
    }
    
    // 天气筛选
    if (filters.weather && !attraction.weather.includes(filters.weather as any)) {
      return false;
    }
    
    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        attraction.name.toLowerCase().includes(searchLower) ||
        attraction.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        attraction.location.address.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });
}

/**
 * 获取景点的中文类型名称
 */
export function getAttractionTypeLabel(type: Attraction['type']): string {
  const labels: Record<Attraction['type'], string> = {
    historical: '历史遗迹',
    natural: '自然风光',
    cultural: '文化艺术',
    modern: '现代建筑',
    food: '美食体验',
    shopping: '购物休闲'
  };
  return labels[type] || type;
}

/**
 * 计算两个景点之间的距离(km)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球半径(km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 查找附近的景点
 */
export function findNearbyAttractions(
  attraction: Attraction,
  allAttractions: Attraction[],
  maxDistance: number = 5
): Attraction[] {
  return allAttractions
    .filter(attr => attr.id !== attraction.id)
    .map(attr => ({
      attraction: attr,
      distance: calculateDistance(
        attraction.location.lat,
        attraction.location.lng,
        attr.location.lat,
        attr.location.lng
      )
    }))
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .map(item => item.attraction);
}
