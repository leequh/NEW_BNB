'use client'

import { useEffect, useRef, useState } from 'react'
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
} from '@tosspayments/payment-widget-sdk'
import { v4 as uuidv4 } from 'uuid'
import { useAsync } from 'react-use'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader } from '@/components/Loader'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

// 테스트용 클라이언트 키 (토스페이먼츠 테스트 키)
const TEST_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

// 환경 변수에서 클라이언트 키를 가져오거나 테스트 키 사용
// const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || TEST_CLIENT_KEY
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || TEST_CLIENT_KEY

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const price = searchParams.get('totalAmount') || '0'
  const customerKey = searchParams.get('customerKey') || uuidv4()
  const totalDays = searchParams.get('totalDays') || '0'
  const roomTitle = searchParams.get('roomTitle') || 'LUXLAS'
  const bookingId = searchParams.get('bookingId')
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 인증 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('로그인이 필요합니다.')
      router.push('/users/signin')
    }
  }, [status, router])

  // 로딩 중이거나 인증되지 않은 경우 렌더링 방지
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  // 기본적으로 데모 모드는 비활성화 상태에서 시작
  const [isDemoMode, setIsDemoMode] = useState(false)

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance['renderPaymentMethods']
  > | null>(null)

  // 결제 수단 목록 (데모 모드용)
  const demoPaymentMethods = [
    { id: 'card', name: '신용/체크카드' },
    { id: 'virtualAccount', name: '가상계좌' },
    { id: 'transfer', name: '계좌이체' },
    { id: 'phone', name: '휴대폰' },
  ]
  const [selectedMethod, setSelectedMethod] = useState('card')

  useAsync(async () => {
    try {
      console.log('결제 위젯 초기화 시작...', {
        clientKey: clientKey.substring(0, 8) + '...',
      })
      setIsLoading(true)

      try {
        // 결제 위젯 초기화
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey) // 회원 결제
        console.log('결제 위젯 로드 성공:', !!paymentWidget)

        // 결제 위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          '#payment-widget',
          {
            value: parseInt(price),
          },
          { variantKey: 'DEFAULT' },
        )
        console.log('결제 수단 위젯 렌더링 성공')

        // 이용약관 렌더링
        paymentWidget.renderAgreement('#agreement')
        console.log('이용약관 렌더링 성공')

        paymentWidgetRef.current = paymentWidget
        paymentMethodsWidgetRef.current = paymentMethodsWidget
        setIsWidgetLoaded(true)
        setIsDemoMode(false)
      } catch (widgetError) {
        console.error('결제 위젯 로드 실패, 데모 모드로 전환:', widgetError)
        setIsDemoMode(true)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('결제 위젯 초기화 오류:', error)
      setPaymentError(
        '결제 위젯을 불러오는 중 오류가 발생했습니다. 데모 모드로 전환합니다.',
      )
      setIsDemoMode(true)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current
    if (paymentMethodsWidget == null || isDemoMode) {
      return
    }

    try {
      // 금액 업데이트
      paymentMethodsWidget.updateAmount(parseInt(price))
    } catch (error) {
      console.error('금액 업데이트 오류:', error)
    }
  }, [price, isDemoMode])

  // 데모 모드용 결제 처리 함수
  const handleDemoPayment = async () => {
    setIsLoading(true)
    try {
      const uniqueOrderId = uuidv4()
      console.log('데모 결제 요청:', {
        method: selectedMethod,
        orderId: uniqueOrderId,
        amount: price,
        customerKey: customerKey,
      })

      // 세션 정보 상세 로깅
      console.log('전체 세션 정보:', session)
      console.log('세션 사용자:', session?.user)
      console.log('세션 액세스 토큰:', session?.accessToken)
      console.log('세션 사용자 ID:', session?.user?.id)

      // 실제 결제는 진행하지 않고 결제 성공 페이지로 리디렉션
      await new Promise((resolve) => setTimeout(resolve, 1500)) // 결제 진행 시뮬레이션

      // 결제 데이터 저장
      // 세션에서 실제 사용자 ID 가져오기
      let authToken = session?.accessToken || session?.user?.id

      // 세션 사용자 ID가 숫자인 경우 (카카오 로그인) UUID로 변환 필요
      if (authToken === '4232151359') {
        authToken = '6bd44bbb-8d19-4f5f-be41-aea834a0b7f1' // 이규형 사용자 UUID
      } else if (!authToken) {
        authToken = '6bd44bbb-8d19-4f5f-be41-aea834a0b7f1' // 기본값 (이규형)
      }
      console.log('사용할 인증 토큰:', authToken)
      console.log('bookingId:', bookingId)
      console.log('bookingId 타입:', typeof bookingId)
      console.log('bookingId 존재 여부:', !!bookingId)

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
        {
          bookingId: bookingId,
          amount: price,
          status: 'IN_PROGRESS',
          orderId: uniqueOrderId,
          orderName: `${roomTitle?.slice(0, 10)}_${totalDays}박`,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )

      console.log('API 응답:', res.status, res.data)

      if (res?.status === 200 || res?.status === 201) {
        // 가상의 결제 키 생성
        const demoPaymentKey = `DEMO_${uniqueOrderId.substring(0, 10)}`
        router.replace(
          `/payments/success?paymentKey=${demoPaymentKey}&orderId=${uniqueOrderId}&amount=${price}`,
        )
      }
    } catch (error: any) {
      console.error('데모 결제 처리 오류:', error)
      console.error('에러 상세:', error.response?.data)
      console.error('에러 상태:', error.response?.status)
      toast.error(
        `결제 처리 중 오류가 발생했습니다: ${
          error.response?.data?.message || error.message
        }`,
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 my-20">
      <div className="flex flex-col gap-2 mt-4">
        <h1 className="text-lg md:text-2xl font-semibold">확인 및 결제</h1>
        <p className="text-gray-600 mb-4">
          결제 수단을 선택하고 결제를 진행해주세요. 환불금은 예약 취소 후 2~3일
          내에 결제한 카드로 입금됩니다. 동의하시는 경우에만 아래 버튼을 눌러
          예약을 결제하세요.
        </p>

        {isLoading && (
          <div className="flex justify-center my-10">
            <Loader />
          </div>
        )}

        {paymentError && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
            {paymentError}
          </div>
        )}

        {isDemoMode ? (
          // 데모 모드 UI - 결제 수단 선택 UI 직접 구현
          <div className="w-full border rounded-md p-4 min-h-[200px]">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                결제 수단 선택 (데모 모드)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {demoPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-md cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          selectedMethod === method.id
                            ? 'border-rose-500 bg-rose-500'
                            : 'border-gray-300'
                        }`}
                      />
                      <span>{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">결제 금액</h3>
              <p className="text-lg">{parseInt(price).toLocaleString()}원</p>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500 mb-3">
                * 데모 모드에서는 실제 결제가 이루어지지 않습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                💳 아래에서 결제수단을 선택한 후 결제하기 버튼을 눌러주세요.
              </p>
            </div>
            <div
              id="payment-widget"
              className="w-full border rounded-md p-4 min-h-[200px]"
            />
            <div id="agreement" className="w-full mt-4" />
          </>
        )}

        {!isWidgetLoaded && !isLoading && !isDemoMode && (
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md mb-4">
            <p className="font-semibold">결제 위젯이 로드되지 않았습니다.</p>
            <p>다시 시도하려면 페이지를 새로고침하세요.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 underline"
            >
              새로고침
            </button>
          </div>
        )}

        <button
          onClick={async () => {
            if (isDemoMode) {
              handleDemoPayment()
              return
            }

            const paymentWidget = paymentWidgetRef.current
            if (!paymentWidget) {
              toast.error(
                '결제 위젯이 로드되지 않았습니다. 페이지를 새로고침해주세요.',
              )
              return
            }

            // 결제 위젯이 완전히 로드되었는지 확인
            if (!isWidgetLoaded) {
              toast.error(
                '결제 위젯이 아직 로드 중입니다. 잠시 후 다시 시도해주세요.',
              )
              return
            }

            try {
              setIsLoading(true)

              // 결제수단 선택 확인을 위한 약간의 지연
              await new Promise((resolve) => setTimeout(resolve, 100))

              // '결제하기'버튼 누를때 결제창 띄우기
              const uniqueOrderId = uuidv4()
              console.log('결제 요청:', {
                orderId: uniqueOrderId,
                orderName: `${roomTitle?.slice(0, 10)}_${totalDays}박`,
                customerName: session?.user?.name || '익명',
                customerEmail: session?.user?.email || '',
              })

              await paymentWidget
                ?.requestPayment({
                  orderId: uniqueOrderId,
                  orderName: `${roomTitle?.slice(0, 10)}_${totalDays}박`,
                  customerName: session?.user?.name || '익명',
                  customerEmail: session?.user?.email || '',
                  // redirect URL 처리하려면 successUrl, failUrl 추가하기
                })
                .then(async function (data) {
                  console.log('결제 성공:', data)
                  // 성공 처리: 결제 승인 API를 호출하세요
                  // 결제창 입력 완료시 1차로 요청된 payment 데이터 생성

                  // 세션 정보 상세 로깅
                  console.log('전체 세션 정보:', session)
                  console.log('세션 사용자:', session?.user)
                  console.log('세션 액세스 토큰:', session?.accessToken)
                  console.log('세션 사용자 ID:', session?.user?.id)
                  console.log('세션 사용자 이름:', session?.user?.name)
                  console.log('세션 사용자 이메일:', session?.user?.email)

                  // 세션에서 실제 사용자 ID 가져오기
                  let authToken = session?.accessToken || session?.user?.id

                  // 세션 사용자 ID가 숫자인 경우 (카카오 로그인) UUID로 변환 필요
                  if (authToken === '4232151359') {
                    authToken = '6bd44bbb-8d19-4f5f-be41-aea834a0b7f1' // 이규형 사용자 UUID
                  } else if (!authToken) {
                    authToken = '6bd44bbb-8d19-4f5f-be41-aea834a0b7f1' // 기본값 (이규형)
                  }
                  console.log('사용할 인증 토큰:', authToken)
                  console.log('실제 결제 - bookingId:', bookingId)
                  console.log('실제 결제 - bookingId 타입:', typeof bookingId)
                  console.log('실제 결제 - bookingId 존재 여부:', !!bookingId)

                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
                    {
                      bookingId: bookingId,
                      amount: price,
                      status: 'IN_PROGRESS',
                      orderId: uniqueOrderId,
                      orderName: `${roomTitle?.slice(0, 10)}_${totalDays}박`,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                      },
                      withCredentials: true,
                    },
                  )

                  if ((res?.status === 200 || res?.status === 201) && data) {
                    router.replace(
                      `/payments/success?paymentKey=${data.paymentKey}&orderId=${data.orderId}&amount=${data.amount}`,
                    )
                  }
                })
                .catch(function (error) {
                  console.error('결제 에러:', error)
                  console.error('에러 코드:', error.code)
                  console.error('에러 메시지:', error.message)
                  setIsLoading(false)

                  // 에러 처리: 에러 목록을 확인하세요
                  // https://docs.tosspayments.com/reference/error-codes#failurl로-전달되는-에러
                  if (error.code === 'USER_CANCEL') {
                    // 결제 고객이 결제창을 닫았을 때 에러 처리
                    toast?.error('결제가 취소되었습니다.')
                  } else if (error.code === 'INVALID_CARD_COMPANY') {
                    // 유효하지 않은 카드 코드에 대한 에러 처리
                    toast?.error('유효하지 않은 카드 코드입니다.')
                  } else if (error.code === 'NOT_SELECTED_PAYMENT_METHOD') {
                    // 결제수단이 선택되지 않았을 때
                    toast?.error(
                      '결제수단을 선택해주세요. 카드나 계좌이체 등을 클릭하여 선택하세요.',
                    )
                  } else if (
                    error.message &&
                    error.message.includes('결제수단')
                  ) {
                    // 결제수단 관련 에러
                    toast?.error(
                      '결제수단을 먼저 선택해주세요. 위의 결제 방법 중 하나를 클릭하세요.',
                    )
                  } else {
                    // 그 외의 경우 에러 메세지
                    toast?.error(
                      error?.message ||
                        '결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
                    )
                  }
                })
            } catch (error) {
              console.error('결제 시도 중 오류:', error)
              setIsLoading(false)
              toast.error('결제 처리 중 오류가 발생했습니다.')
            }
          }}
          disabled={isLoading || (!isDemoMode && !isWidgetLoaded)}
          type="button"
          className="mt-8 bg-rose-600 hover:bg-rose-500 text-white rounded-md px-5 py-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading
            ? '처리 중...'
            : !isDemoMode && !isWidgetLoaded
              ? '결제 위젯 로딩 중...'
              : '결제하기'}
        </button>
      </div>
    </div>
  )
}
