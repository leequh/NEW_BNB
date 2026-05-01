'use client'

import { useQuery } from '@tanstack/react-query'

import { RoomType } from '@/interface'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import axios from 'axios'

export default function Comment({ room }: { room: RoomType }) {
  const fetchComments = async () => {
    const { data } = await axios(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments?roomId=${room.id}&limit=6`,
    )
    return data
  }

  const {
    data: comments,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [`room-${room.id}-comment`],
    queryFn: fetchComments,
    enabled: !!room.id,
  })

  return (
    <div className="border-b border-gray-300 py-8 px-4">
      <CommentList comments={comments} isLoading={isLoading} roomId={room.id} />
      <CommentForm room={room} refetch={refetch} />
    </div>
  )
}
