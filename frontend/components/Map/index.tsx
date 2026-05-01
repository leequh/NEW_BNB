'use client'
/*global kakao*/

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { RoomType } from '@/interface'
import { BsMap } from 'react-icons/bs'
import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from '@/constants'
import { useSetRecoilState } from 'recoil'
import { selectedRoomState } from '@/atom'
import { FullPageLoader } from '../Loader'

// 🛠 글로벌 window.kakao 정의
declare global {
  interface Window {
    kakao: any
  }
}

// ✅ rooms 타입 명시
export default function Map({ rooms = [] }: { rooms?: RoomType[] }) {
  const setSelectedRoom = useSetRecoilState(selectedRoomState)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchRooms = async () => {
    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`)
    return data as RoomType[]
  }

  const { data: fetchedRooms, isSuccess, isError: isApiError, isLoading: isApiLoading } = useQuery({
    queryKey: ['map-rooms'],
    queryFn: fetchRooms,
    retry: 1, // 한 번만 재시도
    retryDelay: 1000,
  })

  // 카카오맵 API 키 (환경 변수 또는 기본값)
  const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT || '24c7f1186319a0c269374ad59d2299f9'

  useEffect(() => {
    if (!kakaoApiKey) {
      console.error('카카오 API 키가 없습니다.')
      setIsError(true)
      return
    }

    // ✅ 중복 방지
    if (document.getElementById('kakao-map-script')) {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => setIsMapLoaded(true))
      }
      return
    }

    const script = document.createElement('script')
    script.id = 'kakao-map-script'
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false` // ✅ autoload=false
    script.async = true
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => setIsMapLoaded(true)) // ✅ 명시적으로 load()
      } else {
        console.error('카카오맵 객체가 없습니다.')
        setIsError(true)
      }
    }
    script.onerror = (e) => {
      console.error('카카오맵 스크립트 로드 실패:', e)
      setIsError(true)
    }

    document.head.appendChild(script)
  }, [kakaoApiKey])

  useEffect(() => {
    if (!isMapLoaded) return

    const mapContainer = document.getElementById('map')
    if (!mapContainer) {
      console.error('#map 요소가 없습니다.')
      setIsError(true)
      return
    }

    if (!window.kakao || !window.kakao.maps) {
      console.error('window.kakao.maps가 없습니다.')
      setIsError(true)
      return
    }

    try {
      const mapOption = {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: ZOOM_LEVEL,
      }
      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      const roomsToDisplay =
        rooms && rooms.length > 0 ? rooms : fetchedRooms || []

      if (roomsToDisplay.length > 0) {
        roomsToDisplay.forEach((room) => {
          if (!room.lat || !room.lng) return

          const markerPosition = new window.kakao.maps.LatLng(
            room.lat,
            room.lng,
          )
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          })
          marker.setMap(map)

          window.kakao.maps.event.addListener(marker, 'click', function () {
            setSelectedRoom(room)
          })
        })
      }
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error)
      setIsError(true)
    }
  }, [isMapLoaded, rooms, fetchedRooms, setSelectedRoom])

  return (
    <>
      {isApiLoading && !isMapLoaded && <FullPageLoader />}
      {isError && (
        <div className="w-full h-80vh min-h-400 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold text-red-500 mb-2">
              지도를 불러오는데 문제가 발생했습니다
            </h2>
            <p className="text-gray-600">카카오맵 API 키를 확인해주세요</p>
          </div>
        </div>
      )}
      {isApiError && !isError && (
        <div className="w-full bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          ⚠️ 백엔드 서버에 연결할 수 없습니다. 빈 지도가 표시됩니다.
        </div>
      )}
      <div id="map" style={{ width: '100%', height: '80vh', minHeight: 400 }} />
    </>
  )
}

export function MapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center text-sm bg-black rounded-full text-white px-5 py-3.5 shadow-sm hover:shadow-lg mx-auto sticky bottom-12"
    >
      지도 표시하기 <BsMap className="text-xs" />
    </button>
  )
}
