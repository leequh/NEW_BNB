'use client'

import ErrorBoundary from '@/components/ErrorBoundary'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center min-h-screen flex flex-col justify-center">
          <div>
            <h2 className="text-2xl font-semibold text-rose-700">
              Error Boundary!
            </h2>
            <p className="text-gray-500 mt-4 font-semibold">
              해당 페이지를 가져오던 중 문제가 생겼습니다.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
