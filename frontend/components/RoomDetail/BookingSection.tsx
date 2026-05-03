'use client'

import { filterState } from '@/atom'
import { RoomType } from '@/interface'
import { useRecoilState, useRecoilValue } from 'recoil'

import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { calculatedFilterState } from '@/atom/selector'
import { useRouter } from 'next/navigation'
import { event } from '@/utils/gtag'
import { useMemo, useEffect, useState } from 'react'

export default function BookingSection({ data }: { data: RoomType }) {
  const router = useRouter()
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  const { dayCount, guestCount } = useRecoilValue(calculatedFilterState)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)

  // 금액 계산 로직 개선
  const calculations = useMemo(() => {
    const validDayCount = Math.max(dayCount || 0, 0)
    const validGuestCount = Math.max(guestCount || 1, 1)
    const baseAmount = (data?.price || 0) * validDayCount
    const serviceFee = 0 // LUXLAS 수수료
    const cleaningFee = validDayCount > 0 ? 15000 : 0 // 청소비
    const totalAmount = baseAmount + serviceFee + cleaningFee

    return {
      validDayCount,
      validGuestCount,
      baseAmount,
      serviceFee,
      cleaningFee,
      totalAmount,
      isValidBooking:
        validDayCount > 0 && validGuestCount > 0 && totalAmount > 0,
      pricePerNight: data?.price || 0,
    }
  }, [data?.price, dayCount, guestCount])

  // 계산 애니메이션 효과
  useEffect(() => {
    if (calculations.validDayCount > 0) {
      setIsCalculating(true)
      const timer = setTimeout(() => setIsCalculating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [calculations.validDayCount, calculations.validGuestCount])

  const handleSubmit = () => {
    if (!calculations.isValidBooking) return

    const checkInDate = filterValue?.checkIn || dayjs().format('YYYY-MM-DD')
    const checkOutDate = filterValue?.checkOut || dayjs().add(1, 'day').format('YYYY-MM-DD')

    event({
      action: 'click_booking',
      category: 'booking',
      label: `submit_booking_${data.id}`,
      value: calculations.totalAmount,
    })
    router.push(
      `/rooms/${data.id}/bookings?checkIn=${checkInDate}&checkOut=${checkOutDate}&guestCount=${calculations.validGuestCount}&totalAmount=${calculations.totalAmount}&totalDays=${calculations.validDayCount}`,
    )
  }

  const onChangeCheckIn = (e: any) => {
    const newCheckIn = e?.target?.value
    setFilterValue({
      ...filterValue,
      checkIn: newCheckIn,
      // 체크아웃이 체크인보다 이전이면 자동으로 조정
      checkOut:
        filterValue.checkOut &&
        dayjs(filterValue.checkOut).isBefore(dayjs(newCheckIn))
          ? dayjs(newCheckIn).add(1, 'day').format('YYYY-MM-DD')
          : filterValue.checkOut,
    })
  }

  const onChangeCheckOut = (e: any) => {
    setFilterValue({
      ...filterValue,
      checkOut: e?.target?.value,
    })
  }

  const onChangeGuest = (e: any) => {
    setFilterValue({
      ...filterValue,
      guest: parseInt(e?.target?.value) || 1,
    })
  }

  return (
    <div className="w-full">
      <div className="mt-8 shadow-lg rounded-lg border border-gray-300 px-6 py-8 md:sticky md:top-20 transition-all duration-300 hover:shadow-xl">
        {/* 가격 헤더 */}
        <div className="text-gray-600 flex justify-between items-center">
          <div>
            <span className="font-semibold text-lg md:text-xl text-black">
              ₩{data?.price?.toLocaleString()}
            </span>{' '}
            <span className="text-sm">/박</span>
          </div>
          <div className="text-xs text-gray-500">⭐ 4.8 · 후기 15개</div>
        </div>

        {/* 예약 폼 (1번 영역) */}
        <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="relative">
              <label
                className="text-xs font-semibold text-gray-700"
                htmlFor="checkin-input"
              >
                체크인
              </label>
              <input
                type="date"
                id="checkin-input"
                value={filterValue.checkIn || dayjs().format('YYYY-MM-DD')}
                min={dayjs().format('YYYY-MM-DD')}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-xs mt-1 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all duration-200"
                onChange={onChangeCheckIn}
                aria-describedby="checkin-help"
              />
              <div id="checkin-help" className="sr-only">
                체크인 날짜를 선택하세요. 오늘 이후 날짜만 선택 가능합니다.
              </div>
            </div>
            <div className="relative">
              <label
                className="text-xs font-semibold text-gray-700"
                htmlFor="checkout-input"
              >
                체크아웃
              </label>
              <input
                id="checkout-input"
                type="date"
                value={
                  filterValue.checkOut ||
                  dayjs().add(1, 'day').format('YYYY-MM-DD')
                }
                min={
                  filterValue.checkIn
                    ? dayjs(filterValue.checkIn)
                        .add(1, 'day')
                        .format('YYYY-MM-DD')
                    : dayjs().add(1, 'day').format('YYYY-MM-DD')
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-xs mt-1 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all duration-200"
                onChange={onChangeCheckOut}
                aria-describedby="checkout-help"
              />
              <div id="checkout-help" className="sr-only">
                체크아웃 날짜를 선택하세요. 체크인 날짜 이후만 선택 가능합니다.
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="text-xs font-semibold text-gray-700"
              htmlFor="guest-input"
            >
              인원
            </label>
            <select
              id="guest-input"
              onChange={onChangeGuest}
              value={filterValue.guest || 1}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-xs mt-1 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all duration-200"
              aria-describedby="guest-help"
            >
              {[...Array(20)]?.map((_, i) => (
                <option value={i + 1} key={i}>
                  게스트 {i + 1}명
                </option>
              ))}
            </select>
            <div id="guest-help" className="sr-only">
              숙박할 인원 수를 선택하세요. 최대 20명까지 선택 가능합니다.
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={!calculations.isValidBooking}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg py-3 w-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
              aria-describedby="booking-button-help"
            >
              {calculations.isValidBooking ? '예약하기' : '날짜를 선택하세요'}
            </button>
            <div id="booking-button-help" className="sr-only">
              {calculations.isValidBooking
                ? '예약 페이지로 이동합니다'
                : '체크인, 체크아웃 날짜를 모두 선택해야 예약할 수 있습니다'}
            </div>
            <p className="text-center text-gray-500 mt-3 text-xs">
              예약 확정 전에는 요금이 청구되지 않습니다.
            </p>
          </div>
        </form>

        {/* 금액 계산 표시 (2번 영역) */}
        {calculations.validDayCount > 0 && (
          <div
            className={`mt-6 pt-6 border-t border-gray-200 transition-all duration-500 ${
              isCalculating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center group">
                <button
                  type="button"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="text-gray-600 underline underline-offset-4 cursor-pointer group-hover:text-gray-800 transition-colors text-left"
                  aria-expanded={showPriceBreakdown}
                  aria-controls="price-breakdown"
                >
                  ₩{calculations.pricePerNight?.toLocaleString()} ×{' '}
                  {calculations.validDayCount}박
                </button>
                <div className="text-gray-800 font-medium">
                  ₩{calculations.baseAmount?.toLocaleString()}
                </div>
              </div>

              {showPriceBreakdown && (
                <div
                  id="price-breakdown"
                  className="ml-4 text-xs text-gray-500 bg-gray-50 p-2 rounded"
                >
                  <div>
                    1박당 요금: ₩{calculations.pricePerNight?.toLocaleString()}
                  </div>
                  <div>총 숙박일: {calculations.validDayCount}박</div>
                  <div>
                    계산: {calculations.pricePerNight?.toLocaleString()} ×{' '}
                    {calculations.validDayCount} = ₩
                    {calculations.baseAmount?.toLocaleString()}
                  </div>
                </div>
              )}

              {calculations.cleaningFee > 0 && (
                <div className="flex justify-between items-center group">
                  <div className="text-gray-600 underline underline-offset-4 cursor-pointer group-hover:text-gray-800 transition-colors">
                    청소비
                  </div>
                  <div className="text-gray-800">
                    ₩{calculations.cleaningFee?.toLocaleString()}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center group">
                <div className="text-gray-600 underline underline-offset-4 cursor-pointer group-hover:text-gray-800 transition-colors">
                  LUXLAS 서비스 수수료
                </div>
                <div className="text-gray-800">
                  ₩{calculations.serviceFee?.toLocaleString()}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-base">총 합계</div>
                  <div className="font-bold text-lg text-rose-600">
                    ₩{calculations.totalAmount?.toLocaleString()}
                  </div>
                </div>
                {calculations.validDayCount > 0 && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {calculations.validGuestCount}명 ·{' '}
                    {calculations.validDayCount}박
                  </div>
                )}
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 text-xs">
                <span className="text-green-600">✓</span>
                <span>무료 취소 가능 (체크인 24시간 전까지)</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 text-xs mt-1">
                <span className="text-green-600">✓</span>
                <span>즉시 예약 확정</span>
              </div>
            </div>
          </div>
        )}

        {/* 날짜가 선택되지 않았을 때 안내 메시지 */}
        {calculations.validDayCount <= 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-gray-500 text-sm py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium mb-1">날짜를 선택해주세요</div>
              <div className="text-xs">
                체크인 및 체크아웃 날짜를 선택하면
                <br />총 요금을 확인할 수 있습니다.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
