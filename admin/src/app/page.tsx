import DashboardStats from "./components/DashboardStats";
import RecentActivities from "./components/RecentActivities";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                NextBNB 관리자 대시보드
              </h1>
              <p className="text-sm text-gray-500">
                플랫폼 전반을 관리하고 모니터링하세요
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">관리자</span>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardStats />
        </div>

        {/* Management Menus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 숙소 관리 메뉴 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              숙소 관리
            </h2>
            <div className="space-y-3">
              <Link
                href="/rooms"
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">🏠</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      전체 숙소 관리
                    </h3>
                    <p className="text-sm text-gray-500">숙소 승인/거부/삭제</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/rooms?status=PENDING"
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-yellow-600 text-sm">⏳</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      승인 대기 숙소
                    </h3>
                    <p className="text-sm text-gray-500">신규 등록 숙소 검토</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/rooms?status=SUSPENDED"
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-red-600 text-sm">🚫</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">정지된 숙소</h3>
                    <p className="text-sm text-gray-500">
                      문제가 있는 숙소 관리
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* 사용자 관리 메뉴 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              사용자 관리
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">👥</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">전체 사용자</h3>
                    <p className="text-sm text-gray-500">사용자 계정 관리</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">🏠</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">호스트 관리</h3>
                    <p className="text-sm text-gray-500">숙소 호스트 관리</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">신고 관리</h3>
                    <p className="text-sm text-gray-500">신고된 사용자 처리</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 기존 빠른 작업 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              빠른 작업
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">숙소 승인</h3>
                    <p className="text-sm text-gray-500">대기 중인 숙소 검토</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">👥</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">사용자 관리</h3>
                    <p className="text-sm text-gray-500">사용자 계정 관리</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-yellow-600 text-sm">💳</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">결제 관리</h3>
                    <p className="text-sm text-gray-500">결제 및 환불 처리</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <RecentActivities />
        </div>
      </main>
    </div>
  );
}
