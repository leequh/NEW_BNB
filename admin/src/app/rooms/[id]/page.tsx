"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function RoomDetail() {
  const params = useParams();
  const roomId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/rooms"
                className="text-blue-600 hover:text-blue-500 mr-4"
              >
                ← 숙소 목록
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                숙소 상세 관리
              </h1>
              <span className="ml-4 text-sm text-gray-500">ID: {roomId}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">숙소 상세 정보</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <p className="text-gray-600">
                숙소 ID {roomId}의 상세 관리 페이지입니다.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                데이터베이스 연동 완료 후 실제 숙소 정보가 표시됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">기본 정보</h3>
                <p className="text-sm text-gray-600">숙소명, 주소, 가격 등</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">호스트 정보</h3>
                <p className="text-sm text-gray-600">호스트 연락처 및 정보</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">예약 현황</h3>
                <p className="text-sm text-gray-600">진행 중인 예약 정보</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                승인
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                거부
              </button>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                정지
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                삭제
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
