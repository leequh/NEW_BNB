import express from 'express'
import prisma from '../utils/prisma'
import { authenticateJWT } from '../middleware/auth'

const router = express.Router()

// 모든 사용자 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// 특정 ID의 사용자 상세 정보 가져오기
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        rooms: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

// 사용자 정보 업데이트하기 (인증 필요)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params
    const userData = req.body

    // 본인의 정보만 수정 가능하도록 검증
    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only update your own profile' })
    }

    const user = await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: 'Failed to update user' })
  }
})

// 내 정보 가져오기 (인증 필요)
router.get('/me/profile', authenticateJWT, async (req, res) => {
  try {
    // 이제 auth 미들웨어를 통해 사용자 정보를 가져옴
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ message: 'Failed to fetch user profile' })
  }
})

export default router
