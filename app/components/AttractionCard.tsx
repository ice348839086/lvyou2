'use client';

import type { Attraction } from '@/lib/types';
import { getAttractionTypeLabel } from '@/lib/attractions-client';

interface AttractionCardProps {
  attraction: Attraction;
  onClick?: () => void;
}

export default function AttractionCard({ attraction, onClick }: AttractionCardProps) {
  const typeEmojis: Record<Attraction['type'], string> = {
    historical: '🏛️',
    natural: '🌳',
    cultural: '🎨',
    modern: '🏙️',
    food: '🍜',
    shopping: '🛍️',
  };

  const price = typeof attraction.ticketInfo.price === 'number'
    ? attraction.ticketInfo.price
    : attraction.ticketInfo.price.adult;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden w-full"
    >
      {/* 顶部渐变背景 */}
      <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">{typeEmojis[attraction.type]}</span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-4">
        {/* 标题和类型 */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {attraction.name}
          </h3>
          <p className="text-sm text-gray-600">
            {getAttractionTypeLabel(attraction.type)} · {attraction.duration.normal}分钟
          </p>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {attraction.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {price === 0 ? '免费' : `¥${price}`}
            </span>
            {attraction.ticketInfo.needReservation && (
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                需预约
              </span>
            )}
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            查看详情 →
          </button>
        </div>
      </div>
    </div>
  );
}
