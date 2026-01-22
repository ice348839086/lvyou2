'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ItineraryPlan } from '@/lib/types';
import { useTravelContext } from '../contexts/TravelContext';

export default function PlanPage() {
  const router = useRouter();
  const { itinerary } = useTravelContext();
  const [step, setStep] = useState<'input' | 'generating' | 'results' | 'detail'>('input');
  const [formData, setFormData] = useState({
    destination: 'beijing',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    seniors: 0,
    pace: 'normal' as 'relaxed' | 'normal' | 'packed',
    interests: [] as string[],
    budget: 'moderate' as 'budget' | 'moderate' | 'luxury',
  });
  const [plans, setPlans] = useState<ItineraryPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ItineraryPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const interestOptions = [
    { id: 'historical', label: '历史文化', emoji: '🏛️' },
    { id: 'natural', label: '自然风光', emoji: '🌳' },
    { id: 'cultural', label: '文化艺术', emoji: '🎨' },
    { id: 'food', label: '美食体验', emoji: '🍜' },
    { id: 'shopping', label: '购物休闲', emoji: '🛍️' },
    { id: 'modern', label: '现代建筑', emoji: '🏙️' },
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSelectPlan = (plan: ItineraryPlan) => {
    setSelectedPlan(plan);
    setStep('detail');
  };

  const handleBackToResults = () => {
    setSelectedPlan(null);
    setStep('results');
  };

  const handleGenerate = async () => {
    const days = calculateDays();
    if (days < 1 || days > 10) {
      setError('请选择1-10天的行程');
      return;
    }

    setStep('generating');
    setError(null);
    setProgress(0);

    // 模拟进度
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          days,
          nights: days - 1,
          pace: formData.pace,
          interests: formData.interests,
          travelers: {
            adults: formData.adults,
            children: formData.children,
            seniors: formData.seniors,
          },
          existingAttractions: itinerary.map(attr => ({
            id: attr.id,
            name: attr.name,
            type: attr.type,
            duration: attr.duration,
          })),
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || '生成失败';
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      // 验证返回的数据结构
      if (!data.plans || !Array.isArray(data.plans) || data.plans.length === 0) {
        throw new Error('返回的数据格式不正确：缺少有效的行程方案');
      }
      
      setPlans(data.plans);
      setStep('results');
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Generate error:', err);
      setError(err.message || '生成失败,请重试');
      setStep('input');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
            <h1 className="text-xl font-bold">🤖 AI智能规划</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: 输入偏好 */}
        {step === 'input' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              告诉我你的旅行计划
            </h2>

            <div className="space-y-6">
              {/* 目的地和日期 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 目的地
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="beijing">北京</option>
                    <option value="shanghai">上海</option>
                    <option value="hangzhou">杭州</option>
                    <option value="chengdu">成都</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 开始日期
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 结束日期
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* 人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  👥 同行人数
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">成人</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">儿童</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">老人</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.seniors}
                      onChange={(e) => setFormData({ ...formData, seniors: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 旅行节奏 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ⚙️ 旅行节奏
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'relaxed', label: '休闲', desc: '2-3个景点/天' },
                    { value: 'normal', label: '标准', desc: '3-4个景点/天' },
                    { value: 'packed', label: '紧凑', desc: '4-5个景点/天' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, pace: option.value as any })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.pace === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 兴趣偏好 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ❤️ 兴趣偏好 (可多选)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleInterest(option.id)}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        formData.interests.includes(option.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 已添加的行程景点 */}
              {itinerary.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✓</span>
                      <h3 className="text-lg font-bold text-gray-900">
                        已添加的景点 ({itinerary.length}个)
                      </h3>
                    </div>
                    <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                      AI将优先安排这些景点
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.map((attraction) => (
                      <div
                        key={attraction.id}
                        className="px-3 py-2 bg-white rounded-lg border border-green-300 text-sm font-medium text-gray-800 flex items-center gap-2 shadow-sm"
                      >
                        <span>📍</span>
                        <span>{attraction.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    💡 提示: AI会根据这些景点的位置和类型,智能安排游览顺序和时间
                  </p>
                </div>
              )}

              {/* 错误提示 */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-red-800 font-medium mb-1">生成失败</h4>
                      <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={!formData.startDate || !formData.endDate}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 生成AI行程
              </button>

              <p className="text-sm text-gray-500 text-center">
                预计生成时间: 30-60秒
              </p>
            </div>
          </div>
        )}

        {/* Step 2: 生成中 */}
        {step === 'generating' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🤖 AI正在为你规划...
              </h2>
              <p className="text-gray-600">
                分析景点数据、优化路线、生成个性化方案
              </p>
            </div>

            {/* 进度条 */}
            <div className="max-w-md mx-auto mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{progress}%</p>
            </div>

            {/* 步骤提示 */}
            <div className="max-w-md mx-auto space-y-3 text-left">
              <div className={`flex items-center gap-3 ${progress >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>分析了{calculateDays()}天的景点数据</span>
              </div>
              <div className={`flex items-center gap-3 ${progress >= 60 ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>优化了地理路线</span>
              </div>
              <div className={`flex items-center gap-3 ${progress >= 90 ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>生成了3个方案</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 结果展示 */}
        {step === 'results' && plans.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 为你生成了3个方案!
              </h2>
              <p className="text-gray-600">
                选择一个开始你的旅程
              </p>
            </div>

            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {plan.title}
                    </h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  {index === 1 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⭐ 推荐
                    </span>
                  )}
                </div>

                {/* 行程预览 */}
                <div className="space-y-2 mb-4">
                  {plan.dailyPlans?.slice(0, 2).map((day: any, dayIndex: number) => (
                    <div key={dayIndex} className="text-sm text-gray-600">
                      <span className="font-medium">Day{day.day}:</span> {day.theme}
                    </div>
                  ))}
                  {plan.dailyPlans?.length > 2 && (
                    <div className="text-sm text-gray-500">
                      ... 还有 {plan.dailyPlans.length - 2} 天行程
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  查看完整行程 →
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                setStep('input');
                setPlans([]);
              }}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
              重新规划
            </button>
          </div>
        )}

        {/* Step 4: 详情页面 */}
        {step === 'detail' && selectedPlan && (
          <div className="animate-fade-in">
            {/* 返回按钮 */}
            <button
              onClick={handleBackToResults}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回方案列表
            </button>

            {/* 方案标题 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedPlan.title}
                  </h2>
                  <p className="text-gray-600 text-lg">{selectedPlan.description}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {selectedPlan.totalAttractions || selectedPlan.dailyPlans?.length || 0} 个景点
                </span>
              </div>
            </div>

            {/* 每日行程 */}
            <div className="space-y-6">
              {selectedPlan.dailyPlans?.map((day: any, dayIndex: number) => (
                <div key={dayIndex} className="bg-white rounded-2xl shadow-lg p-6">
                  {/* 日期标题 */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Day {day.day}
                      </h3>
                      <p className="text-gray-600">{day.theme}</p>
                    </div>
                    {day.estimatedCost && (
                      <div className="ml-auto text-right">
                        <div className="text-sm text-gray-500">预计花费</div>
                        <div className="text-lg font-bold text-gray-900">¥{day.estimatedCost}</div>
                      </div>
                    )}
                  </div>

                  {/* 活动列表 */}
                  <div className="space-y-4">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="flex gap-4">
                        {/* 时间轴 */}
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          {actIndex < day.activities.length - 1 && (
                            <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                          )}
                        </div>

                        {/* 活动内容 */}
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">{activity.time}</div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                {activity.type === 'attraction' && '📍 '}
                                {activity.type === 'meal' && '🍽️ '}
                                {activity.type === 'transport' && '🚗 '}
                                {activity.name}
                              </h4>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                              {activity.duration}分钟
                            </span>
                          </div>

                          {/* AI推荐理由 */}
                          {activity.aiReason && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium text-blue-700">💡 推荐理由：</span>
                                {activity.aiReason}
                              </p>
                            </div>
                          )}

                          {/* 小贴士 */}
                          {activity.tips && activity.tips.length > 0 && (
                            <div className="space-y-1">
                              {activity.tips.map((tip: string, tipIndex: number) => (
                                <div key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="text-gray-400">•</span>
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部操作按钮 */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleBackToResults}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
              >
                选择其他方案
              </button>
              <button
                onClick={() => {
                  setStep('input');
                  setPlans([]);
                  setSelectedPlan(null);
                }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
              >
                重新规划
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
