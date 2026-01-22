/**
 * 高德地图工具函数
 */

import AMapLoader from '@amap/amap-jsapi-loader';

// 地图实例缓存
let AMap: any = null;

/**
 * 加载高德地图API
 */
export async function loadAMap(): Promise<any> {
  if (AMap) return AMap;

  try {
    AMap = await AMapLoader.load({
      key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
      version: '2.0',
      plugins: ['AMap.Marker', 'AMap.Polyline', 'AMap.InfoWindow', 'AMap.MarkerCluster'],
    });
    return AMap;
  } catch (error) {
    console.error('Failed to load AMap:', error);
    throw error;
  }
}

/**
 * 创建地图实例
 */
export async function createMap(
  container: HTMLElement,
  options: {
    center?: [number, number];
    zoom?: number;
  } = {}
): Promise<any> {
  const AMapInstance = await loadAMap();
  
  const map = new AMapInstance.Map(container, {
    zoom: options.zoom || 12,
    center: options.center || [116.397428, 39.90923],
    viewMode: '2D',
    mapStyle: 'amap://styles/normal',
  });

  return map;
}

/**
 * 添加标记点
 */
export async function addMarker(
  map: any,
  position: [number, number],
  options: {
    title?: string;
    type?: string;
    content?: string;
  } = {}
): Promise<any> {
  const AMapInstance = await loadAMap();
  
  // 根据类型选择图标颜色
  const iconColors: Record<string, string> = {
    historical: '#e74c3c',
    natural: '#27ae60',
    cultural: '#9b59b6',
    modern: '#3498db',
    food: '#f39c12',
    shopping: '#e67e22',
  };
  
  const color = iconColors[options.type || 'cultural'] || '#3498db';
  
  const marker = new AMapInstance.Marker({
    position,
    title: options.title,
    icon: new AMapInstance.Icon({
      size: new AMapInstance.Size(32, 32),
      image: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `)}`,
      imageSize: new AMapInstance.Size(32, 32),
    }),
  });

  marker.setMap(map);

  // 添加信息窗口
  if (options.content) {
    const infoWindow = new AMapInstance.InfoWindow({
      content: options.content,
      offset: new AMapInstance.Pixel(0, -30),
    });

    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });
  }

  return marker;
}

/**
 * 绘制路径线
 */
export async function drawPolyline(
  map: any,
  path: [number, number][],
  options: {
    strokeColor?: string;
    strokeWeight?: number;
  } = {}
): Promise<any> {
  const AMapInstance = await loadAMap();
  
  const polyline = new AMapInstance.Polyline({
    path,
    strokeColor: options.strokeColor || '#3b82f6',
    strokeWeight: options.strokeWeight || 4,
    strokeOpacity: 0.8,
    strokeStyle: 'solid',
  });

  polyline.setMap(map);
  return polyline;
}

/**
 * 地理编码 - 将地址转换为坐标
 */
export async function geocode(address: string, city?: string): Promise<[number, number] | null> {
  const AMapInstance = await loadAMap();
  
  return new Promise((resolve) => {
    AMapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMapInstance.Geocoder({
        city: city || '全国',
      });

      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          const location = result.geocodes[0].location;
          resolve([location.lng, location.lat]);
        } else {
          console.error('Geocoding failed:', status, result);
          resolve(null);
        }
      });
    });
  });
}

/**
 * 计算两点之间的驾车路线
 */
export async function calculateRoute(
  start: [number, number],
  end: [number, number]
): Promise<{
  distance: number; // 距离(米)
  duration: number; // 时间(秒)
  path: [number, number][];
} | null> {
  const AMapInstance = await loadAMap();
  
  return new Promise((resolve) => {
    AMapInstance.plugin('AMap.Driving', () => {
      const driving = new AMapInstance.Driving({
        policy: AMapInstance.DrivingPolicy.LEAST_TIME,
      });

      driving.search(
        new AMapInstance.LngLat(start[0], start[1]),
        new AMapInstance.LngLat(end[0], end[1]),
        (status: string, result: any) => {
          if (status === 'complete' && result.info === 'OK') {
            const route = result.routes[0];
            const path = route.steps.flatMap((step: any) =>
              step.path.map((p: any) => [p.lng, p.lat] as [number, number])
            );
            
            resolve({
              distance: route.distance,
              duration: route.time,
              path,
            });
          } else {
            console.error('Route calculation failed:', status, result);
            resolve(null);
          }
        }
      );
    });
  });
}
