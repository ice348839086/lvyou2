'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Timeline from '@/app/components/Timeline';
import type { TripPlan, Activity } from '@/lib/types';

// 动态导入地图组件
const MapView = dynamic(() => import('@/app/components/MapView'), {
  ssr: false,
});

export default function ItineraryPage() {
  const params = useParams();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // 模拟加载行程数据
  useEffect(() => {
    // 这里应该从API或localStorage加载实际数据
    // 现在使用模拟数据
    const mockPlan: TripPlan = {
      id: params.id as string,
      destination: 'beijing',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-05'),
      travelers: {
        adults: 2,
        children: 0,
        seniors: 0,
      },
      preferences: {
        pace: 'normal',
        interests: ['historical', 'cultural'],
        budget: 'moderate',
      },
      dailyPlans: [
        {
          day: 1,
          date: new Date('2026-05-01'),
          theme: '天安门-故宫-景山',
          activities: [
            {
              time: '08:30',
              type: 'attraction',
              attractionId: 'beijing-gugong',
              name: '故宫',
              duration: 180,
              tips: ['从东华门进入最快', '珍宝馆必看'],
              aiReason: '上午人流较少,适合深度游览',
            },
            {
              time: '12:00',
              type: 'meal',
              name: '午餐: 四季民福烤鸭',
              duration: 60,
              tips: ['步行5分钟', '人均120元'],
              aiReason: '位于景点附近,特色美食',
            },
            {
              time: '13:30',
              type: 'attraction',
              attractionId: 'beijing-jingshan',
              name: '景山公园',
              duration: 90,
              tips: ['俯瞰故宫全景', '登顶约15分钟'],
              aiReason: '与故宫相邻,可以俯瞰全景',
            },
          ],
          estimatedCost: 200,
        },
      ],
      generatedBy: 'ai',
    };

    setTripPlan(mockPlan);
  }, [params.id]);

  if (!tripPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentDayPlan = tripPlan.dailyPlans.find(plan => plan.day === selectedDay);
  const attractions = currentDayPlan?.activities
    .filter(act => act.attractionId)
    .map(act => ({
      id: act.attractionId!,
      name: act.name,
      // 这里需要从实际数据加载完整的景点信息
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/plan" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回规划
            </Link>
            <h1 className="text-xl font-bold">📅 行程总览</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              保存
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 行程信息 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {tripPlan.destination} {tripPlan.dailyPlans.length}日游
          </h2>
          <p className="text-gray-600">
            {tripPlan.startDate.toLocaleDateString()} - {tripPlan.endDate.toLocaleDateString()}
          </p>
        </div>

        {/* 天数选择器 */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {tripPlan.dailyPlans.map((plan) => (
              <button
                key={plan.day}
                onClick={() => setSelectedDay(plan.day)}
                className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedDay === plan.day
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                Day {plan.day}
              </button>
            ))}
          </div>
        </div>

        {/* 双视图布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧: 时间轴 */}
          <div id="timeline-section">
            <Timeline
              dailyPlans={tripPlan.dailyPlans}
              selectedDay={selectedDay}
              onActivityClick={setSelectedActivity}
            />
          </div>

          {/* 右侧: 地图 */}
          <div id="map-section" className="lg:sticky lg:top-24 h-[600px]">
            <div className="bg-white rounded-xl shadow-md p-4 h-full">
              <h3 className="font-bold text-gray-900 mb-3">
                当日路线地图
              </h3>
              <div className="h-[calc(100%-2rem)]">
                {/* 地图组件 - 需要传入当日景点数据 */}
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  地图加载中...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 灵感地点库侧边栏 */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">
            💡 可以添加的景点
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            基于你的行程,AI推荐以下景点:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 示例推荐景点 */}
            {[
              { name: '国家博物馆', reason: '与故宫同类型,步行10分钟', emoji: '🏛️' },
              { name: '全聚德烤鸭', reason: '午餐时段,距离故宫5分钟', emoji: '🍜' },
              { name: '798艺术区', reason: '增加现代元素,适合下午', emoji: '🎨' },
            ].map((suggestion, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{suggestion.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      {suggestion.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {suggestion.reason}
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      添加到Day{selectedDay} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 活动详情弹窗 */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedActivity.name}
            </h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">时间:</span> {selectedActivity.time}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">时长:</span> {selectedActivity.duration}分钟
              </p>
              {selectedActivity.tips && selectedActivity.tips.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 mb-2">游玩提示:</p>
                  <ul className="space-y-1">
                    {selectedActivity.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedActivity(null)}
              className="mt-6 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
