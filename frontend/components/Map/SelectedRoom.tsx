'use client'

import { useRecoilState } from 'recoil'
import { selectedRoomState } from '@/atom'
import { BLUR_DATA_URL } from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineCloseCircle } from 'react-icons/ai'

export default function SelectedRoom() {
  const [selectedRoom, setSelectedRoom] = useRecoilState(selectedRoomState)

  // 선택된 객실이 없으면 아무것도 렌더링하지 않음
  if (!selectedRoom) return null

  return (
    <div className="fixed inset-x-0 mx-auto bottom-20 rounded-lg shadow-lg max-w-xs md:max-w-sm z-10 w-full bg-white">
      <div className="flex flex-col relative">
        <button
          type="button"
          onClick={() => setSelectedRoom(null)}
          className="absolute right-2 top-2 text-white text-2xl bg-black/20 rounded-full z-20"
        >
          <AiOutlineCloseCircle />
        </button>
        <Link href={`/rooms/${selectedRoom.id}`}>
          <div className="rounded-lg-t h-[200px] overflow-hidden">
            {selectedRoom?.images?.[0] ? (
              <Image
                src={selectedRoom.images[0]}
                width={384}
                height={384}
                alt={selectedRoom.title || 'Room image'}
                placeholder="blur"
                className="rounded-t-lg object-cover w-full h-full"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="rounded-t-lg bg-gray-200 w-full h-full flex items-center justify-center">
                <p className="text-gray-500">이미지 없음</p>
              </div>
            )}
          </div>
          <div className="p-4 font-semibold bg-white rounded-b-lg text-sm">
            <div className="mt-2">{selectedRoom.title || '제목 없음'}</div>
            <div className="mt-1 text-gray-400">
              {selectedRoom.address || '주소 정보 없음'}
            </div>
            <div className="mt-1 ">
              {selectedRoom.price
                ? `${selectedRoom.price.toLocaleString()}원`
                : '가격 정보 없음'}{' '}
              {selectedRoom.price && (
                <span className="text-gray-400"> /박</span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
