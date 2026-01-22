'use client';

import type { DailyPlan, Activity } from '@/lib/types';

interface TimelineProps {
  dailyPlans: DailyPlan[];
  selectedDay?: number;
  onActivityClick?: (activity: Activity) => void;
}

export default function Timeline({ dailyPlans, selectedDay = 1, onActivityClick }: TimelineProps) {
  const currentPlan = dailyPlans.find(plan => plan.day === selectedDay);

  if (!currentPlan) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无行程数据
      </div>
    );
  }

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      attraction: '🏛️',
      meal: '🍜',
      transport: '🚕',
      rest: '😴',
    };
    return icons[type] || '📍';
  };

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      attraction: 'bg-blue-100 text-blue-700 border-blue-300',
      meal: 'bg-orange-100 text-orange-700 border-orange-300',
      transport: 'bg-gray-100 text-gray-700 border-gray-300',
      rest: 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* 日期标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Day {currentPlan.day} · {new Date(currentPlan.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
        </h2>
        <p className="text-gray-600">主题: {currentPlan.theme}</p>
        <p className="text-sm text-gray-500 mt-1">
          预估费用: ¥{currentPlan.estimatedCost}
        </p>
      </div>

      {/* 时间轴 */}
      <div className="space-y-4">
        {currentPlan.activities.map((activity, index) => (
          <div
            key={index}
            onClick={() => onActivityClick?.(activity)}
            className="relative pl-8 pb-8 last:pb-0 cursor-pointer hover:bg-gray-50 rounded-lg p-3 -ml-3 transition-colors"
          >
            {/* 时间线 */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200">
              {index < currentPlan.activities.length - 1 && (
                <div className="absolute top-8 bottom-0 w-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
              )}
            </div>

            {/* 时间点 */}
            <div className="absolute left-[-6px] top-3 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white shadow-md"></div>

            {/* 内容 */}
            <div className="ml-2">
              {/* 时间 */}
              <div className="text-sm font-medium text-gray-500 mb-2">
                {activity.time}
              </div>

              {/* 活动卡片 */}
              <div className={`border-2 rounded-lg p-4 ${getActivityColor(activity.type)}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      {activity.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      游玩时长: {activity.duration}分钟
                    </p>

                    {/* 提示 */}
                    {activity.tips && activity.tips.length > 0 && (
                      <div className="space-y-1">
                        {activity.tips.map((tip, tipIndex) => (
                          <p key={tipIndex} className="text-sm text-gray-700">
                            💡 {tip}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* AI推荐理由 */}
                    {activity.aiReason && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">AI推荐:</span> {activity.aiReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部操作 */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + 添加活动
        </button>
        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium">
          调整顺序
        </button>
      </div>
    </div>
  );
}
