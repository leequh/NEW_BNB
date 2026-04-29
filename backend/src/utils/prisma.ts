import { PrismaClient } from '@prisma/client';

// Prisma 클라이언트의 단일 인스턴스를 생성
const prisma = new PrismaClient();

export default prisma; 