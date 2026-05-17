'use client'
/*global kakao*/

import { useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { RoomType } from '@/interface'
import { BsMap } from 'react-icons/bs'
import { DEFAULT_LAT, DEFAULT_LNG } from '@/constants'
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

  const { data: fetchedRooms, isError: isApiError, isLoading: isApiLoading } = useQuery({
    queryKey: ['map-rooms'],
    queryFn: fetchRooms,
    retry: 1,
    retryDelay: 1000,
  })

  // 카카오맵 API 키 (환경 변수에서 가져옴)
  const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT

  useEffect(() => {
    if (!kakaoApiKey) {
      console.error('카카오 API 키가 없습니다.')
      setIsError(true)
      return
    }

    // 이미 카카오맵이 로드되어 있는 경우
    if (window.kakao && window.kakao.maps) {
      // services 라이브러리가 이미 로드되어 있는지 확인
      if (window.kakao.maps.services) {
        setIsMapLoaded(true)
      } else {
        // services 라이브러리 로드
        window.kakao.maps.load(() => setIsMapLoaded(true))
      }
      return
    }

    // 기존 스크립트가 있으면 제거 (services 라이브러리 포함 버전으로 다시 로드)
    const existingScript = document.getElementById('kakao-map-script')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.id = 'kakao-map-script'
    // services 라이브러리 추가 (지오코딩용)
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsMapLoaded(true)
        })
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

  // 가격 마커 생성 함수
  const createPriceMarker = useCallback((
    map: any,
    room: RoomType,
    lat: string | number,
    lng: string | number,
    bounds: any
  ) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng)

    // 가격 표시 커스텀 오버레이 생성
    const priceContent = document.createElement('div')
    priceContent.className = 'price-marker'
    priceContent.innerHTML = `
      <div style="
        background-color: white;
        border: 2px solid #e11d48;
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 13px;
        font-weight: 600;
        color: #111;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
      ">
        ${room.price ? room.price.toLocaleString() + '원' : '가격문의'}
      </div>
    `

    // 호버 효과
    priceContent.addEventListener('mouseenter', () => {
      const div = priceContent.querySelector('div')
      if (div) {
        div.style.backgroundColor = '#e11d48'
        div.style.color = 'white'
        div.style.transform = 'scale(1.1)'
      }
    })
    priceContent.addEventListener('mouseleave', () => {
      const div = priceContent.querySelector('div')
      if (div) {
        div.style.backgroundColor = 'white'
        div.style.color = '#111'
        div.style.transform = 'scale(1)'
      }
    })

    // 클릭 이벤트
    priceContent.addEventListener('click', () => {
      setSelectedRoom(room)
    })

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: markerPosition,
      content: priceContent,
      yAnchor: 1.3,
    })
    customOverlay.setMap(map)

    // bounds에 좌표 추가
    bounds.extend(markerPosition)
  }, [setSelectedRoom])

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
        level: 8,
      }
      const map = new window.kakao.maps.Map(mapContainer, mapOption)

      // 지오코더 생성 (주소 → 좌표 변환용) - services 라이브러리가 있는 경우에만
      const geocoderInstance = window.kakao.maps.services 
        ? new window.kakao.maps.services.Geocoder() 
        : null

      const roomsToDisplay =
        rooms && rooms.length > 0 ? rooms : fetchedRooms || []

      if (roomsToDisplay.length > 0) {
        const bounds = new window.kakao.maps.LatLngBounds()
        let markersCreated = 0
        const totalRooms = roomsToDisplay.length

        const checkAndSetBounds = () => {
          markersCreated++
          if (markersCreated === totalRooms && totalRooms > 1) {
            setTimeout(() => {
              try {
                map.setBounds(bounds)
              } catch (e) {
                console.log('bounds 설정 실패:', e)
              }
            }, 100)
          }
        }

        roomsToDisplay.forEach((room) => {
          // 좌표가 있는 경우 바로 마커 생성
          if (room.lat && room.lng) {
            createPriceMarker(map, room, room.lat, room.lng, bounds)
            checkAndSetBounds()
          } 
          // 좌표가 없고 주소가 있는 경우 지오코딩 시도
          else if (room.address && geocoderInstance) {
            geocoderInstance.addressSearch(room.address, (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const lat = result[0].y
                const lng = result[0].x
                createPriceMarker(map, room, lat, lng, bounds)
              } else {
                console.log(`주소 변환 실패: ${room.address}`)
              }
              checkAndSetBounds()
            })
          } else {
            // 좌표도 없고 지오코딩도 못하는 경우
            checkAndSetBounds()
          }
        })
      }
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error)
      // 에러가 발생해도 지도는 표시되도록
    }
  }, [isMapLoaded, rooms, fetchedRooms, createPriceMarker])

  return (
    <div className="relative w-full h-[80vh] min-h-[400px]">
      {isApiLoading && !isMapLoaded && <FullPageLoader />}
      {isApiError && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800 z-10">
          ⚠️ 백엔드 서버에 연결할 수 없습니다. Mock 데이터로 표시됩니다.
        </div>
      )}
      {isError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold text-red-500 mb-2">
              지도를 불러오는데 문제가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-2">카카오맵 API 키와 도메인 등록을 확인해주세요</p>
            <p className="text-gray-400 text-sm mb-4">
              카카오 개발자 콘솔에서 localhost:3000을 등록해야 합니다
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : (
        <div id="map" className="w-full h-full" />
      )}
    </div>
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
