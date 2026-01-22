'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import FilterBar from './components/FilterBar';
import AttractionCard from './components/AttractionCard';
import type { Attraction, FilterOptions } from '@/lib/types';
import { filterAttractions } from '@/lib/attractions-client';
import { useTravelContext } from './contexts/TravelContext';

type TabType = 'explore' | 'itinerary' | 'favorites';

// 动态导入地图组件(避免SSR问题)
const MapView = dynamic(() => import('./components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('beijing');
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  
  const { 
    itinerary, 
    addToItinerary, 
    removeFromItinerary,
    isInItinerary,
    favorites, 
    addToFavorites, 
    removeFromFavorites,
    isFavorite 
  } = useTravelContext();

  // 禁用/启用body滚动(防止弹窗打开时背景滚动)并隐藏地图logo
  useEffect(() => {
    if (selectedAttraction) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [selectedAttraction]);

  // 加载景点数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/attractions/${selectedCity}`);
        const data = await response.json();
        setAttractions(data);
      } catch (error) {
        console.error('Failed to load attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCity]);

  // 筛选景点
  const filteredAttractions = useMemo(() => {
    return filterAttractions(attractions, filters);
  }, [attractions, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🗺️ 智旅 2.0
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI驱动的智能旅行规划助手
              </p>
            </div>

            {/* 城市选择 */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="beijing">北京</option>
                <option value="shanghai">上海</option>
                <option value="hangzhou">杭州</option>
                <option value="chengdu">成都</option>
              </select>

              <Link href="/plan">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                  AI规划行程
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* 筛选栏 - 只在浏览模式显示 */}
        {activeTab === 'explore' && (
          <div className="mb-6">
            <FilterBar onFilterChange={setFilters} />
          </div>
        )}

        {/* 地图区域 - 只在浏览模式显示 */}
        {activeTab === 'explore' && (
          <div className="mb-6">
            <div className="h-[500px]">
            {!loading && process.env.NEXT_PUBLIC_AMAP_KEY ? (
              <MapView
                attractions={filteredAttractions}
                onMarkerClick={setSelectedAttraction}
              />
            ) : !loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                <div className="text-center px-6">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">地图功能未配置</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    请配置高德地图 API Key 以启用地图功能
                  </p>
                  <div className="bg-white rounded-lg p-4 text-left text-xs text-gray-700">
                    <p className="font-medium mb-2">配置步骤:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>访问 <a href="https://lbs.amap.com/" target="_blank" className="text-blue-600 hover:underline">高德开放平台</a></li>
                      <li>创建应用并获取 Web端(JS API) Key</li>
                      <li>在 .env.local 中设置 NEXT_PUBLIC_AMAP_KEY</li>
                      <li>重启开发服务器</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white rounded-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-700">加载景点数据中...</p>
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* 浏览模式 */}
        {activeTab === 'explore' && (
          <>
            {/* 结果统计 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                找到 <span className="text-blue-600">{filteredAttractions.length}</span> 个景点
              </h2>
            </div>

            {/* 景点卡片网格布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onClick={() => setSelectedAttraction(attraction)}
                />
              ))}
            </div>
          </>
        )}

        {/* 行程模式 */}
        {activeTab === 'itinerary' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">我的行程</h2>
              <p className="text-gray-600">
                已添加 <span className="text-blue-600 font-semibold">{itinerary.length}</span> 个景点
              </p>
            </div>

            {itinerary.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">还没有行程安排</h3>
                <p className="text-gray-600 mb-6">
                  在浏览页面添加感兴趣的景点到行程吧
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  去浏览景点
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {itinerary.map((attraction, index) => (
                  <div
                    key={attraction.id}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {attraction.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          📍 {attraction.location.address}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {attraction.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedAttraction(attraction)}
                          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          查看详情
                        </button>
                        <button
                          onClick={() => removeFromItinerary(attraction.id)}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 收藏模式 */}
        {activeTab === 'favorites' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">我的收藏</h2>
              <p className="text-gray-600">
                已收藏 <span className="text-red-600 font-semibold">{favorites.length}</span> 个景点
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">还没有收藏</h3>
                <p className="text-gray-600 mb-6">
                  收藏喜欢的景点,方便下次查看
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  去浏览景点
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((attraction) => (
                  <div key={attraction.id} className="relative">
                    <AttractionCard
                      attraction={attraction}
                      onClick={() => setSelectedAttraction(attraction)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(attraction.id);
                      }}
                      className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors z-10"
                    >
                      <span className="text-xl">❤️</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 底部Tab导航 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              <button
                onClick={() => setActiveTab('explore')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                  activeTab === 'explore'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">🗺️</span>
                <span className="text-xs font-medium">浏览</span>
              </button>

              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all relative ${
                  activeTab === 'itinerary'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">📋</span>
                <span className="text-xs font-medium">行程</span>
                {itinerary.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {itinerary.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all relative ${
                  activeTab === 'favorites'
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">❤️</span>
                <span className="text-xs font-medium">收藏</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 景点详情弹窗 */}
        {selectedAttraction && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedAttraction(null)}
          >
            <div
              className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 详情内容 */}
              <div className="p-6">
                {/* 关闭按钮 */}
                <button
                  onClick={() => setSelectedAttraction(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>

                {/* 标题 */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedAttraction.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  📍 {selectedAttraction.location.address}
                </p>

                {/* AI摘要 */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">🎯 AI精华摘要</h3>
                  
                  {selectedAttraction.aiSummary.highlights.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">必看亮点:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedAttraction.aiSummary.highlights.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAttraction.aiSummary.tips.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">游玩建议:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedAttraction.aiSummary.tips.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAttraction.aiSummary.avoidPitfalls.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">避坑指南:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedAttraction.aiSummary.avoidPitfalls.map((item, i) => (
                          <li key={i}>⚠️ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">⏰ 开放时间</p>
                    <p className="font-medium">{selectedAttraction.openingHours.weekday}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">🎫 门票价格</p>
                    <p className="font-medium">
                      {typeof selectedAttraction.ticketInfo.price === 'number'
                        ? selectedAttraction.ticketInfo.price === 0
                          ? '免费'
                          : `¥${selectedAttraction.ticketInfo.price}`
                        : `成人¥${selectedAttraction.ticketInfo.price.adult}`}
                    </p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  {isInItinerary(selectedAttraction.id) ? (
                    <button 
                      disabled
                      className="flex-1 px-6 py-3 bg-green-100 text-green-700 border-2 border-green-300 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>✓</span>
                      <span>已添加到行程</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        addToItinerary(selectedAttraction);
                        // 显示成功提示
                        const toast = document.createElement('div');
                        toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] animate-fade-in';
                        toast.textContent = `✓ 已添加「${selectedAttraction.name}」到行程`;
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium active:scale-95"
                    >
                      添加到行程
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (isFavorite(selectedAttraction.id)) {
                        removeFromFavorites(selectedAttraction.id);
                      } else {
                        addToFavorites(selectedAttraction);
                      }
                    }}
                    className={`px-6 py-3 border-2 rounded-lg transition-colors font-medium ${
                      isFavorite(selectedAttraction.id)
                        ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {isFavorite(selectedAttraction.id) ? '❤️ 已收藏' : '🤍 收藏'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
