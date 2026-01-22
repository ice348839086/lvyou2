'use client';

import { useState } from 'react';
import type { FilterOptions } from '@/lib/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
      {/* 搜索框 */}
      <div>
        <input
          type="text"
          placeholder="搜索景点名称或地址..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* 筛选按钮组 */}
      <div className="flex flex-wrap gap-3">
        {/* 类型筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">类型:</span>
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            onChange={(e) => handleFilterChange('type', e.target.value)}
            value={filters.type || 'all'}
          >
            <option value="all">全部</option>
            <option value="historical">历史遗迹</option>
            <option value="natural">自然风光</option>
            <option value="cultural">文化艺术</option>
            <option value="modern">现代建筑</option>
            <option value="food">美食体验</option>
            <option value="shopping">购物休闲</option>
          </select>
        </div>

        {/* 时长筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">时长:</span>
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            onChange={(e) => handleFilterChange('duration', e.target.value)}
            value={filters.duration || 'all'}
          >
            <option value="all">全部</option>
            <option value="short">1小时内</option>
            <option value="medium">1-3小时</option>
            <option value="long">3小时以上</option>
          </select>
        </div>

        {/* 适合人群筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">人群:</span>
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            onChange={(e) => handleFilterChange('suitableFor', e.target.value)}
            value={filters.suitableFor || 'all'}
          >
            <option value="all">全部</option>
            <option value="family">亲子家庭</option>
            <option value="couple">情侣约会</option>
            <option value="solo">独自旅行</option>
            <option value="friends">朋友聚会</option>
          </select>
        </div>

        {/* 天气筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">天气:</span>
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            onChange={(e) => handleFilterChange('weather', e.target.value)}
            value={filters.weather || 'all'}
          >
            <option value="all">全部</option>
            <option value="sunny">晴天适合</option>
            <option value="rainy">雨天适合</option>
            <option value="any">任何天气</option>
          </select>
        </div>

        {/* 清除筛选 */}
        {Object.keys(filters).length > 0 && (
          <button
            onClick={() => {
              setFilters({});
              onFilterChange({});
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
