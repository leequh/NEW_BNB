'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="text-center min-h-screen flex flex-col justify-center">
      <div>
        <h2 className="text-2xl font-semibold text-rose-700">
          Error.tsx Page!
        </h2>
        <p className="text-gray-500 mt-4 font-semibold">
          해당 페이지를 가져오던 중 문제가 생겼습니다.
        </p>
        <p className="mt-2 text-gray-500 text-sm">{error?.message}</p>
        <div className="mt-8">
          <button
            onClick={() => reset()}
            className="bg-rose-700 text-white rounded-md text-sm px-2.5 py-1.5"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
