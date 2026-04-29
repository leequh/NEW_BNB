'use client'

import { RoomType } from '@/interface'
import axios from 'axios'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { toast } from 'react-hot-toast'

export default function CommentForm({
  room,
  refetch,
}: {
  room: RoomType
  refetch: () => void
}) {
  const [comment, setComment] = useState<string>('')
  const { status } = useSession()

  const handleSubmit = async () => {
    try {
      // 현재 로그인한 사용자의 UUID 사용 (이규형)
      const authToken = '6bd44bbb-8d19-4f5f-be41-aea834a0b7f1'
      
      const res = await axios.post(
        'http://localhost:5000/api/comments',
        {
          body: comment,
          roomId: room.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (res.status === 200 || res.status === 201) {
        toast.success('댓글을 생성했습니다.')
        setComment('')
        refetch()
      } else {
        toast.error('다시 시도해주세요')
      }
    } catch (error) {
      console.error('댓글 생성 에러:', error)
      toast.error('댓글 생성 중 오류가 발생했습니다.')
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e

    if (name === 'comment') {
      setComment(value)
    }
  }

  return (
    <form className="mt-8">
      {status === 'authenticated' && (
        <>
          <textarea
            rows={3}
            onChange={onChange}
            name="comment"
            required
            value={comment}
            placeholder="후기를 작성해주세요..."
            className="w-full block min-h-[120px] resize-none border rounded-md bg-transparent py-2.5 px-4 placeholder:text-gray-400 text-sm leading-6 outline-none focus:border-black"
          />
          <div className="flex flex-row-reverse mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-2.5 text-sm font-semibold shadow-sm rounded-md"
            >
              작성하기
            </button>
          </div>
        </>
      )}
    </form>
  )
}
