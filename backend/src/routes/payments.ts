import express from 'express'
import prisma from '../utils/prisma'
import { authenticateJWT } from '../middleware/auth'
import { PaymentStatus, PaymentType } from '@prisma/client'
import axios from 'axios'

const router = express.Router()

// 결제 요청 생성
router.post('/', async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      orderId,
      orderName,
      customerKey,
      successUrl,
      failUrl,
    } = req.body

    console.log('결제 요청 데이터:', req.body)
    console.log('요청 헤더:', req.headers)

    // 예약 정보 확인 (선택적)
    let booking = null
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          room: true,
          user: true,
        },
      })
    }

    // 결제 정보 생성
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId,
        amount: parseInt(amount),
        orderId: orderId,
        orderName: orderName || `${booking?.room?.title || '숙소'} 예약`,
        status: PaymentStatus.READY,
        type: PaymentType.NORMAL,
      },
    })

    console.log('결제 정보 생성 완료:', payment)

    // 토스페이먼츠 결제 위젯 URL 생성
    const checkoutUrl = `https://api.tosspayments.com/v1/payments/widget`

    res.status(201).json({
      success: true,
      payment: payment,
      checkoutUrl: checkoutUrl,
      message: '결제 정보가 생성되었습니다.',
    })
  } catch (error) {
    console.error('결제 생성 에러:', error)
    res.status(500).json({
      error: 'Failed to create payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 결제 승인 처리
router.post('/confirm', async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body

    console.log('결제 승인 요청:', { paymentKey, orderId, amount })

    // 결제 정보 조회
    const payment = await prisma.payment.findUnique({
      where: { orderId: orderId },
      include: {
        booking: {
          include: {
            room: true,
            user: true,
          },
        },
      },
    })

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // 토스페이먼츠 결제 승인 API 호출
    try {
      // 실제 토스페이먼츠 API 호출
      const tossResponse = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          paymentKey,
          orderId,
          amount: parseInt(amount),
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TOSS_CLIENT_SECRET}:`,
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const tossPayment = tossResponse.data

      // 결제 정보 업데이트
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentKey: paymentKey,
          status: PaymentStatus.DONE,
          approvedAt: tossPayment.approvedAt,
          method: tossPayment.method || 'CARD',
          receiptUrl: tossPayment.receipt?.url,
          cardNumber: tossPayment.card?.number,
          cardType: tossPayment.card?.cardType,
          type: tossPayment.type || 'NORMAL',
          mId: tossPayment.mId,
          requestedAt: tossPayment.requestedAt,
          checkoutUrl: tossPayment.checkout?.url,
        },
      })

      // 예약 상태를 SUCCESS로 업데이트
      if (payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'SUCCESS',
          },
        })
      }

      console.log('결제 승인 완료:', updatedPayment)

      res.json({
        success: true,
        payment: updatedPayment,
        tossPayment: tossPayment,
        message: '결제가 성공적으로 완료되었습니다.',
      })
    } catch (tossError: any) {
      console.error(
        '토스페이먼츠 API 에러:',
        tossError.response?.data || tossError.message,
      )

      // 결제 실패 처리
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.ABORTED,
          failureCode: tossError.response?.data?.code || 'API_ERROR',
          failureMessage:
            tossError.response?.data?.message ||
            '결제 승인 중 오류가 발생했습니다.',
        },
      })

      // 예약 상태도 실패로 변경
      if (payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'FAILED',
          },
        })
      }

      res.status(400).json({
        error: 'Payment confirmation failed',
        details: tossError.response?.data?.message || tossError.message,
        code: tossError.response?.data?.code,
      })
    }
  } catch (error) {
    console.error('결제 승인 에러:', error)
    res.status(500).json({
      error: 'Failed to confirm payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 결제 정보 조회
router.get('/:orderId', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.params

    const payment = await prisma.payment.findUnique({
      where: { orderId: orderId },
      include: {
        booking: {
          include: {
            room: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // 결제 사용자 확인
    if (payment.booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    res.json(payment)
  } catch (error) {
    console.error('결제 조회 에러:', error)
    res.status(500).json({
      error: 'Failed to fetch payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 결제 취소
router.post('/:orderId/cancel', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.params
    const { cancelReason } = req.body

    const payment = await prisma.payment.findUnique({
      where: { orderId: orderId },
      include: {
        booking: true,
      },
    })

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    // 결제 사용자 확인
    if (payment.booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // 결제 취소 처리
    const canceledPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.CANCELED,
        failureMessage: cancelReason || '사용자 요청에 의한 취소',
      },
    })

    // 예약 상태도 취소로 변경
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'CANCEL',
      },
    })

    res.json({
      success: true,
      payment: canceledPayment,
      message: '결제가 취소되었습니다.',
    })
  } catch (error) {
    console.error('결제 취소 에러:', error)
    res.status(500).json({
      error: 'Failed to cancel payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 결제 정보 업데이트 (PATCH)
router.patch('/', async (req, res) => {
  try {
    const {
      orderId,
      paymentKey,
      amount,
      method,
      receiptUrl,
      approvedAt,
      bookingStatus,
      status,
      failureCode,
      failureMessage,
      cardNumber,
      type,
      mId,
      requestedAt,
      cardType,
      checkoutUrl,
    } = req.body

    console.log('결제 정보 업데이트 요청:', req.body)

    // 결제 정보 업데이트
    const payment = await prisma.payment.update({
      where: {
        orderId: orderId,
      },
      data: {
        paymentKey: paymentKey,
        method: method,
        receiptUrl: receiptUrl,
        approvedAt: approvedAt,
        amount: amount ? parseInt(amount) : undefined,
        failureCode: status === 'DONE' ? null : failureCode,
        failureMessage: status === 'DONE' ? null : failureMessage,
        status: status,
        cardNumber: cardNumber,
        type: type,
        mId: mId,
        requestedAt: requestedAt,
        cardType: cardType,
        checkoutUrl: checkoutUrl,
      },
    })

    // 예약 상태 업데이트
    if (payment.bookingId && bookingStatus) {
      await prisma.booking.update({
        where: {
          id: payment.bookingId,
        },
        data: {
          status: bookingStatus,
        },
      })
    }

    console.log('결제 정보 업데이트 완료:', payment)

    res.json({
      success: true,
      payment: payment,
      message: '결제 정보가 업데이트되었습니다.',
    })
  } catch (error) {
    console.error('결제 정보 업데이트 에러:', error)
    res.status(500).json({
      error: 'Failed to update payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
