'use client';

import { useEffect, useRef, useState } from 'react';
import { createMap, addMarker, drawPolyline } from '@/lib/map';
import type { Attraction } from '@/lib/types';

interface MapViewProps {
  attractions: Attraction[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (attraction: Attraction) => void;
  onMapMove?: (bounds: any) => void;
}

export default function MapView({
  attractions,
  center,
  zoom = 12,
  onMarkerClick,
  onMapMove,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    let mounted = true;

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // 计算中心点
        const mapCenter = center || calculateCenter(attractions);

        // 创建地图
        const mapInstance = await createMap(mapContainer.current!, {
          center: mapCenter,
          zoom,
        });

        if (!mounted) return;

        setMap(mapInstance);

        // 监听地图移动
        if (onMapMove) {
          mapInstance.on('moveend', () => {
            const bounds = mapInstance.getBounds();
            onMapMove(bounds);
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        if (mounted) {
          setError('地图加载失败,请检查API Key配置');
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (map) {
        map.destroy();
      }
    };
  }, []);

  // 更新标记点
  useEffect(() => {
    if (!map || attractions.length === 0) return;

    // 清除旧标记
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 添加新标记
    const addMarkers = async () => {
      for (const attraction of attractions) {
        const marker = await addMarker(
          map,
          [attraction.location.lng, attraction.location.lat],
          {
            title: attraction.name,
            type: attraction.type,
            content: `
              <div style="
                padding: 12px;
                min-width: 200px;
                background: white;
                border-radius: 8px;
              ">
                <h4 style="
                  font-size: 16px;
                  font-weight: 700;
                  color: #111827;
                  margin-bottom: 8px;
                ">${attraction.name}</h4>
                <p style="
                  font-size: 14px;
                  color: #6b7280;
                  margin-bottom: 4px;
                ">
                  ${getTypeEmoji(attraction.type)} ${getTypeLabel(attraction.type)}
                </p>
                <p style="
                  font-size: 12px;
                  color: #9ca3af;
                ">
                  ${attraction.location.address}
                </p>
              </div>
            `,
          }
        );

        if (onMarkerClick) {
          marker.on('click', () => {
            onMarkerClick(attraction);
          });
        }

        markersRef.current.push(marker);
      }

      // 自动调整视野
      if (attractions.length > 0) {
        map.setFitView();
      }
    };

    addMarkers();
  }, [map, attractions, onMarkerClick]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden shadow-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">加载地图中...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 z-10">
          <div className="text-center px-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 font-medium mb-2">{error}</p>
            <p className="text-sm text-red-600">
              请在 .env.local 中配置 NEXT_PUBLIC_AMAP_KEY
            </p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

// 计算中心点
function calculateCenter(attractions: Attraction[]): [number, number] {
  if (attractions.length === 0) {
    return [116.397428, 39.90923]; // 默认北京
  }

  const sum = attractions.reduce(
    (acc, attr) => ({
      lat: acc.lat + attr.location.lat,
      lng: acc.lng + attr.location.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return [sum.lng / attractions.length, sum.lat / attractions.length];
}

// 获取类型标签
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    historical: '历史遗迹',
    natural: '自然风光',
    cultural: '文化艺术',
    modern: '现代建筑',
    food: '美食体验',
    shopping: '购物休闲',
  };
  return labels[type] || '景点';
}

// 获取类型emoji
function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    historical: '🏛️',
    natural: '🌳',
    cultural: '🎨',
    modern: '🏙️',
    food: '🍜',
    shopping: '🛍️',
  };
  return emojis[type] || '📍';
}
