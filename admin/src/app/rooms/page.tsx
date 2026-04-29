"use client";

import Link from "next/link";

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-500 mr-4">
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 inline">
                숙소 관리
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            관리자 숙소 관리 시스템
          </h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">개발 진행 상황</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Admin UI 구조 완성</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Backend API 기본 구조 완성</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">🔄</span>
                  <span>데이터베이스 연동 작업 진행 중</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">⏳</span>
                  <span>실제 숙소 데이터 관리 기능 예정</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">예정 기능</h3>
                <p className="text-sm text-blue-700 mt-1">숙소 승인/거부</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900">예정 기능</h3>
                <p className="text-sm text-green-700 mt-1">숙소 정지/복구</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900">예정 기능</h3>
                <p className="text-sm text-purple-700 mt-1">예약 현황 관리</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900">예정 기능</h3>
                <p className="text-sm text-red-700 mt-1">숙소 강제 삭제</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">알림</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>현재 개발 중인 기능입니다.</p>
                    <p>
                      데이터베이스 마이그레이션 완료 후 실제 기능이
                      활성화됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
