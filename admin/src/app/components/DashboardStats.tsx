"use client";

import { useEffect, useState } from "react";

interface Stat {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "전체 사용자",
      value: 0,
      change: 12,
      icon: "👥",
      color: "blue",
    },
    {
      title: "등록된 숙소",
      value: 0,
      change: 8,
      icon: "🏠",
      color: "green",
    },
    {
      title: "이번 달 예약",
      value: 0,
      change: 15,
      icon: "📅",
      color: "purple",
    },
    {
      title: "총 수익",
      value: "₩0",
      change: 23,
      icon: "💰",
      color: "yellow",
    },
  ]);

  useEffect(() => {
    // TODO: 실제 API에서 데이터 가져오기
    // fetchDashboardStats()

    // 임시 데이터
    setStats([
      {
        title: "전체 사용자",
        value: 1234,
        change: 12,
        icon: "👥",
        color: "blue",
      },
      {
        title: "등록된 숙소",
        value: 89,
        change: 8,
        icon: "🏠",
        color: "green",
      },
      {
        title: "이번 달 예약",
        value: 156,
        change: 15,
        icon: "📅",
        color: "purple",
      },
      {
        title: "총 수익",
        value: "₩12,345,000",
        change: 23,
        icon: "💰",
        color: "yellow",
      },
    ]);
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      yellow: "bg-yellow-100 text-yellow-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-green-600">↗ {stat.change}%</span>
                <span className="text-sm text-gray-500 ml-1">vs 지난달</span>
              </div>
            </div>
            <div
              className={`h-12 w-12 rounded-lg flex items-center justify-center ${getColorClasses(
                stat.color
              )}`}
            >
              <span className="text-xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
