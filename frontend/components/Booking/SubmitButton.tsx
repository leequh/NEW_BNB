'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

export default function SubmitButton({ title }: { title: string }) {
  const { status, data: session } = useSession()
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const id = params?.id
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guestCount = searchParams.get('guestCount')
  const totalAmount = searchParams.get('totalAmount')
  const totalDays = searchParams.get('totalDays')

  const handleSubmit = async () => {
    if (status !== 'authenticated') {
      toast.error('로그인이 필요합니다.')
      return
    }

    if (!session?.user?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.')
      return
    }

    // 체크인, 체크아웃 날짜 유효성 검사 추가
    if (!checkIn || !checkOut) {
      toast.error('체크인과 체크아웃 날짜를 선택해 주세요.')
      return
    }

    // 날짜 형식 유효성 검사
    if (isNaN(Date.parse(checkIn)) || isNaN(Date.parse(checkOut))) {
      toast.error('날짜 형식이 잘못되었습니다.')
      return
    }

    setLoading(true)

    try {
      console.log('세션 정보:', session)
      console.log('액세스 토큰:', session?.accessToken)

      // 실제 사용자 UUID를 토큰으로 사용 (이규형)
      const authToken =
        session?.accessToken || '6bd44bbb-8d19-4f5f-be41-aea834a0b7f1'
      console.log('사용할 토큰:', authToken)

      console.log('예약 요청 데이터:', {
        roomId: id,
        checkIn: checkIn,
        checkOut: checkOut,
        guestCount: guestCount,
        totalAmount: totalAmount,
        totalDays: totalDays,
        status: 'PENDING',
        sessionUserId: session?.user?.id,
      })

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          roomId: id,
          checkIn: checkIn,
          checkOut: checkOut,
          guestCount: guestCount,
          totalAmount: totalAmount,
          totalDays: totalDays,
          status: 'PENDING',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('예약 API 응답:', res.status, res.data)

      if (res.status === 201 || res.status === 200) {
        console.log('예약 성공! 결제 페이지로 이동')
        console.log('생성된 예약 ID:', res?.data.id)
        console.log('결제 페이지 URL 파라미터들:', {
          customerKey: session?.user.id,
          roomTitle: title,
          checkIn,
          checkOut,
          guestCount,
          totalAmount,
          totalDays,
          bookingId: res?.data.id,
        })
        router.replace(
          `/payments?customerKey=${session?.user.id}&roomTitle=${title}&checkIn=${checkIn}&checkOut=${checkOut}&guestCount=${guestCount}&totalAmount=${totalAmount}&totalDays=${totalDays}&bookingId=${res?.data.id}`,
        )
      } else {
        console.log('예약 실패:', res.status)
        toast.error('다시 시도해주세요.')
      }
    } catch (error: any) {
      console.error('예약 에러:', error.response?.data || error.message)
      toast.error(
        error.response?.data?.error ||
          '예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {status === 'loading' && (
        <p className="text-sm text-gray-500 mb-2">로딩 중...</p>
      )}
      {status === 'unauthenticated' && (
        <p className="text-sm text-red-500 mb-2">로그인이 필요합니다</p>
      )}
      {status === 'authenticated' && !session?.user?.id && (
        <p className="text-sm text-red-500 mb-2">
          사용자 정보를 찾을 수 없습니다
        </p>
      )}

      <button
        type="button"
        disabled={status === 'unauthenticated' || loading}
        onClick={handleSubmit}
        className="bg-rose-600 hover:bg-rose-500 px-6 py-3 text-white rounded-md w-full disabled:bg-gray-300"
      >
        {loading ? '처리 중...' : '확인 및 결제'}
      </button>
    </div>
  )
}
