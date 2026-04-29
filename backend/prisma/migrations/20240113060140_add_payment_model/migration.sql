-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('NORMAL', 'BILLING', 'BRANDPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('READY', 'IN_PROGRESS', 'WAITING_FOR_DEPOSIT', 'DONE', 'CANCELED', 'PARTIAL_CANCELED', 'ABORTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "paymentKey" TEXT,
    "amount" INTEGER NOT NULL,
    "type" "PaymentType",
    "orderId" TEXT NOT NULL,
    "orderName" TEXT,
    "mId" TEXT,
    "method" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "requestedAt" TEXT,
    "approvedAt" TEXT,
    "cardNumber" TEXT,
    "cardType" TEXT,
    "receiptUrl" TEXT,
    "checkoutUrl" TEXT,
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
