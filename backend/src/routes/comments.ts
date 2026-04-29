import express from 'express'
import prisma from '../utils/prisma'
import { authenticateJWT } from '../middleware/auth'

const router = express.Router()

// 특정 방의 댓글 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const { roomId, limit = 10, page = 1 } = req.query

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' })
    }

    const comments = await prisma.comment.findMany({
      where: {
        roomId: parseInt(roomId as string),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    })

    res.json({
      data: comments,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    })
  } catch (error) {
    console.error('댓글 조회 에러:', error)
    res.status(500).json({
      error: 'Failed to fetch comments',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 새 댓글 생성
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { roomId, body } = req.body

    if (!roomId || !body) {
      return res.status(400).json({ error: 'Room ID and comment body are required' })
    }

    const comment = await prisma.comment.create({
      data: {
        roomId: parseInt(roomId),
        body: body,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    res.status(201).json(comment)
  } catch (error) {
    console.error('댓글 생성 에러:', error)
    res.status(500).json({
      error: 'Failed to create comment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 댓글 수정
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params
    const { body } = req.body

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    })

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { body },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    res.json(updatedComment)
  } catch (error) {
    console.error('댓글 수정 에러:', error)
    res.status(500).json({
      error: 'Failed to update comment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 댓글 삭제
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    })

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    })

    res.status(204).send()
  } catch (error) {
    console.error('댓글 삭제 에러:', error)
    res.status(500).json({
      error: 'Failed to delete comment',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router 