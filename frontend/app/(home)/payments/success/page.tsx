import { PaymentType } from '@/interface'
import axios from 'axios'
import dayjs from 'dayjs'

import { redirect } from 'next/navigation'
interface PaymentRequestProps {
  paymentKey: string
  orderId: string
  amount: string
}

interface PaymentResponseProps {
  mId?: string
  orderName?: string
  approvedAt?: string
  requestedAt?: string
  status: string
  receipt?: {
    url?: string
  }
  checkout?: {
    url?: string
  }
  card?: {
    number?: string
    cardType?: string
  }
  type?: string
  totalAmount: number
  method?: '카드' | '가상계좌' | '계좌이체'
}

interface ParamsProps {
  searchParams: PaymentRequestProps
}

interface Payment {
  payment?: PaymentResponseProps
  redirect?: {
    destination?: string
  }
}

export default async function PaymentSuccess({ searchParams }: ParamsProps) {
  const paymentKey = searchParams.paymentKey
  const orderId = searchParams.orderId
  const amount = searchParams.amount

  const data: Payment = await getPayment({
    paymentKey,
    orderId,
    amount,
  })

  if (data?.redirect) {
    redirect(data?.redirect?.destination || '/')
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4">
      <div className="flex flex-col gap-6 border-b pb-8 pt-4">
        <h3 className="font-semibold text-lg md:text-2xl">주문 내역</h3>
        <div className="rounded-md border-black p-2 border-2 cursor-pointer hover:bg-black/5">
          <h3 className="font-semibold">주문</h3>
          <p className="text-gray-800 text-sm mt-1">
            {data?.payment?.orderName}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 border-b pb-8 pt-4">
        <h3 className="font-semibold text-lg md:text-2xl">결제 내역</h3>
        <div className="rounded-md border-black p-2 border-2 cursor-pointer hover:bg-black/5">
          <h3 className="font-semibold">결제 수단</h3>
          <p className="text-gray-800 text-sm mt-1">{data?.payment?.method}</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 border-b pb-8 pt-4">
        <h3 className="font-semibold text-lg md:text-2xl">결제 금액</h3>
        <div className="rounded-md border-black p-2 border-2 cursor-pointer hover:bg-black/5">
          <p className="text-gray-800 text-sm mt-1">
            {data?.payment?.totalAmount?.toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 border-b pb-8 pt-4">
        <h3 className="font-semibold text-lg md:text-2xl">결제 일시</h3>
        <div className="rounded-md border-black p-2 border-2 cursor-pointer hover:bg-black/5">
          <p className="text-gray-800 text-sm mt-1">
            {dayjs(data?.payment?.approvedAt)?.format('YYYY-MM-DD HH:MM:ss')}
          </p>
        </div>
      </div>
      <div>
        <a
          target="_blank"
          href={data?.payment?.receipt?.url}
          className="bg-gray-800 text-white hover:bg-gray-600 px-6 py-3 rounded-md"
        >
          영수증 확인
        </a>
      </div>
      <div className="flex flex-col gap-6 border-b py-8">
        <a
          href="/users/bookings"
          className="bg-rose-600 hover:bg-rose-500 px-6 py-3 text-white rounded-md text-center"
        >
          예약 내역 확인
        </a>
      </div>
    </div>
  )
}

async function getPayment({
  paymentKey,
  orderId,
  amount,
}: PaymentRequestProps) {
  try {
    const { data: payment } = await axios.post<PaymentResponseProps>(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.TOSS_CLIENT_SECRET}:`,
          ).toString('base64')}`,
        },
      },
    )

    // 성공이면 Payment 및 Booking 데이터 PATCH
    if (payment) {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
        {
          orderId: orderId,
          paymentKey: paymentKey,
          amount: amount,
          bookingStatus: 'SUCCESS',
          status: payment.status,
          method: payment?.method,
          receiptUrl: payment?.receipt?.url,
          approvedAt: payment?.approvedAt,
          cardNumber: payment?.card?.number,
          cardType: payment?.card?.cardType,
          type: payment?.type,
          mId: payment?.mId,
          checkoutUrl: payment?.checkout?.url,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      )
    }

    return {
      payment: payment,
    }
  } catch (err: any) {
    console.log(err)

    // 이미 처리된 결제면 예약 내역 페이지로 리다이렉트
    if (err?.response?.data?.code === 'ALREADY_PROCESSED_PAYMENT') {
      return {
        redirect: {
          destination: `/users/bookings`,
        },
      }
    }

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
      {
        orderId: orderId,
        paymentKey: paymentKey,
        amount: amount,
        bookingStatus: 'FAILED',
        failureCode: err.code,
        failureMessage: err.message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )

    return {
      redirect: {
        destination: `/payments/fail?code=${err.code}&message=${err.message}&orderId=${orderId}`,
      },
    }
  }
}
