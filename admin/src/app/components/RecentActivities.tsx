"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  type: "user" | "room" | "booking" | "payment";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // TODO: 실제 API에서 데이터 가져오기
    // fetchRecentActivities()

    // 임시 데이터
    setActivities([
      {
        id: "1",
        type: "user",
        title: "새로운 사용자 가입",
        description: "test1234@example.com",
        timestamp: "5분 전",
        status: "success",
      },
      {
        id: "2",
        type: "room",
        title: "숙소 등록 대기",
        description: "강남구 신논현역 근처 원룸",
        timestamp: "1시간 전",
        status: "pending",
      },
      {
        id: "3",
        type: "booking",
        title: "새로운 예약",
        description: "₩150,000 - 3박 4일",
        timestamp: "2시간 전",
        status: "success",
      },
      {
        id: "4",
        type: "payment",
        title: "결제 완료",
        description: "예약 ID: BK-2024-001",
        timestamp: "3시간 전",
        status: "success",
      },
      {
        id: "5",
        type: "room",
        title: "숙소 승인 완료",
        description: "제주도 바다뷰 펜션",
        timestamp: "1일 전",
        status: "success",
      },
    ]);
  }, []);

  const getActivityIcon = (type: string) => {
    const icons = {
      user: "👤",
      room: "🏠",
      booking: "📅",
      payment: "💳",
    };
    return icons[type as keyof typeof icons] || "📋";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.success;
  };

  const getStatusText = (status: string) => {
    const texts = {
      success: "완료",
      pending: "대기",
      failed: "실패",
    };
    return texts[status as keyof typeof texts] || "완료";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">{getActivityIcon(activity.type)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    activity.status
                  )}`}
                >
                  {getStatusText(activity.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
          모든 활동 보기
        </button>
      </div>
    </div>
  );
}
