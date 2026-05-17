import { RoomType } from '@/interface'
import { ReactNode } from 'react'
import Link from 'next/link'

import Image from 'next/image'
import { BLUR_DATA_URL } from '@/constants'

export function RoomItem({ room }: { room: RoomType }) {
  const images = room?.images || []

  return (
    <div key={room.id}>
      <Link href={`/rooms/${room.id}`}>
        <div className="h-[320px] md:h-[240px] overflow-hidden relative z-0 rounded-xl">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={room.title}
              style={{ objectFit: 'cover' }}
              fill
              placeholder="blur"
              sizes="(min-width: 640px) 240px, 320px"
              blurDataURL={BLUR_DATA_URL}
              className="w-full h-auto object-fit"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">이미지 없음</span>
            </div>
          )}
        </div>
      </Link>

      <Link href={`/rooms/${room.id}`}>
        <div className="mt-2 font-semibold text-sm">{room.title}</div>
        <span
          data-cy="room-category"
          className="text-xs px-2 py-1 rounded-full bg-black text-white mt-1"
        >
          {room.category}
        </span>
        <div className="mt-1 text-gray-400 text-sm" data-cy="room-address">
          {room.address}
        </div>
        <div className="mt-1 text-sm">
          {room?.price?.toLocaleString()}원{' '}
          <span className="text-gray-500"> /박</span>
        </div>
      </Link>
    </div>
  )
}

export function GridLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20 sm:px-4 md:px-8 lg:px-16 mt-20">
      {children}
    </div>
  )
}
