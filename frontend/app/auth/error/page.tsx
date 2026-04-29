'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const errorType = searchParams.get('error')

    let errorMessage = '인증 중 오류가 발생했습니다.'

    if (errorType === 'Configuration') {
      errorMessage = 'OAuth 인증 설정에 문제가 있습니다.'
    } else if (errorType === 'AccessDenied') {
      errorMessage = '접근이 거부되었습니다.'
    } else if (errorType === 'Callback') {
      errorMessage = 'OAuth 콜백 처리 중 오류가 발생했습니다.'
    } else if (errorType === 'OAuthSignin') {
      errorMessage = 'OAuth 로그인 중 오류가 발생했습니다.'
    } else if (errorType === 'OAuthCallback') {
      errorMessage = 'OAuth 콜백 처리 중 오류가 발생했습니다.'
    }

    setError(errorMessage)
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">로그인 오류</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <div className="flex flex-col gap-4">
          <Link
            href="/users/signin"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition"
          >
            로그인 페이지로 돌아가기
          </Link>
          <button
            onClick={() => router.push('/')}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
