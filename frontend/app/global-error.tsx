'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optional: Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="h-screen flex flex-col justify-center items-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">문제가 발생했습니다</h1>
            <p className="text-gray-500">
              일시적인 문제가 발생했습니다. 다시 시도해 주세요.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                다시 시도
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
