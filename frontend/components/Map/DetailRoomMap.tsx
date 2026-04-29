'use client'
/*global kakao*/

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { RoomType } from '@/interface'

import { DEFAULT_LAT, DEFAULT_LNG, ZOOM_LEVEL } from '@/constants'

import { FullPageLoader } from '../Loader'

declare global {
  interface Window {
    kakao: any
  }
}

export default function DetailRoomMap({ data }: { data: RoomType }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('지도를 로드하는 중...')

  useEffect(() => {
    if (!data) {
      console.log('DetailRoomMap: 데이터가 없음')
      setMapError(true)
      setLoadingMessage('숙소 정보가 없습니다')
      return
    }

    // 좌표를 숫자로 변환하여 검증
    const lat = typeof data.lat === 'string' ? parseFloat(data.lat) : data.lat
    const lng = typeof data.lng === 'string' ? parseFloat(data.lng) : data.lng

    if (!data.lat || !data.lng || isNaN(lat) || isNaN(lng)) {
      console.log('DetailRoomMap: 좌표가 없거나 유효하지 않음, 기본 좌표 사용')
      // 기본 좌표로 성수동 사용
      data.lat = '37.5447'
      data.lng = '127.0557'
    }

    // 카카오맵 스크립트가 이미 로드되어 있는지 확인
    const mapScript = document.getElementById(
      'kakao-map-script',
    ) as HTMLScriptElement

    // 환경 변수 확인 (보안을 위해 일부만 표시)
    const apiKey =
      process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT ||
      '24c7f1186319a0c269374ad59d2299f9'
    const maskedApiKey = apiKey
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
      : '없음'
    console.log(
      'DetailRoomMap: KAKAO_MAP_CLIENT 환경변수:',
      apiKey ? '설정됨' : '설정되지 않음',
      '키:',
      maskedApiKey,
    )

    if (!mapScript) {
      console.log('DetailRoomMap: 카카오맵 스크립트 로드 시작')
      setLoadingMessage('카카오맵 스크립트를 로드하는 중...')

      // 스크립트 엘리먼트 생성
      const script = document.createElement('script')
      script.id = 'kakao-map-script'
      script.type = 'text/javascript'
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`
      script.async = true

      script.onload = () => {
        console.log('DetailRoomMap: 카카오맵 스크립트 로드 완료')
        setLoadingMessage('지도를 초기화하는 중...')

        // kakao.maps.load를 사용하여 수동으로 초기화
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('DetailRoomMap: 카카오맵 객체 확인됨')
            setIsMapLoaded(true)
          })
        } else {
          console.error('DetailRoomMap: 카카오맵 객체 로드 실패')
          setMapError(true)
          setLoadingMessage('지도 로드에 실패했습니다')
        }
      }

      script.onerror = (e) => {
        console.error('DetailRoomMap: 카카오맵 스크립트 로드 실패:', e)
        setMapError(true)
        setLoadingMessage('지도 스크립트 로드에 실패했습니다')
      }

      document.head.appendChild(script)
    } else if (window.kakao && window.kakao.maps) {
      console.log('DetailRoomMap: 카카오맵 이미 로드됨')
      setIsMapLoaded(true)
    } else {
      console.log('DetailRoomMap: 카카오맵 스크립트는 있지만 maps 객체가 없음')
      setLoadingMessage('지도 객체를 확인하는 중...')

      // 스크립트는 있지만 maps 객체가 없는 경우 잠시 대기 후 재시도
      let attempts = 0
      const checkKakao = () => {
        attempts++
        if (window.kakao && window.kakao.maps) {
          setIsMapLoaded(true)
        } else if (attempts < 10) {
          setTimeout(checkKakao, 500)
        } else {
          setMapError(true)
          setLoadingMessage('지도 객체 로드에 실패했습니다')
        }
      }
      checkKakao()
    }
  }, [data])

  useEffect(() => {
    if (isMapLoaded && data && document.getElementById('map')) {
      console.log('DetailRoomMap: 지도 초기화 시작', {
        mapElement: document.getElementById('map'),
        data: { lat: data.lat, lng: data.lng, address: data.address },
      })
      initializeMap()
    }
  }, [isMapLoaded, data])

  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('DetailRoomMap: Kakao maps not loaded')
      setMapError(true)
      setLoadingMessage('카카오맵이 로드되지 않았습니다')
      return
    }

    try {
      console.log('DetailRoomMap: 지도 생성 시작')
      const mapContainer = document.getElementById('map')
      console.log('DetailRoomMap: 맵 컨테이너:', mapContainer)

      if (!mapContainer) {
        console.error('DetailRoomMap: 맵 컨테이너를 찾을 수 없음')
        setMapError(true)
        setLoadingMessage('지도 컨테이너를 찾을 수 없습니다')
        return
      }

      // 좌표를 숫자로 변환 (문자열일 수 있음)
      const lat = typeof data.lat === 'string' ? parseFloat(data.lat) : data.lat
      const lng = typeof data.lng === 'string' ? parseFloat(data.lng) : data.lng

      console.log('DetailRoomMap: 변환된 좌표:', {
        lat,
        lng,
        originalLat: data.lat,
        originalLng: data.lng,
      })

      if (isNaN(lat) || isNaN(lng)) {
        console.error('DetailRoomMap: 유효하지 않은 좌표:', { lat, lng })
        setMapError(true)
        setLoadingMessage('유효하지 않은 좌표 정보입니다')
        return
      }

      const mapOption = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 5,
      }
      console.log('DetailRoomMap: 맵 옵션:', mapOption)

      const map = new window.kakao.maps.Map(mapContainer, mapOption)
      console.log('DetailRoomMap: 지도 생성 완료:', map)

      // @see - https://apis.map.kakao.com/web/sample/basicMarker/
      // 마커가 표시될 위치입니다
      const markerPosition = new window.kakao.maps.LatLng(lat, lng)

      // 마커 이미지 설정
      const imageSrc = '/images/marker-icon.png'
      const imageSize = new window.kakao.maps.Size(30, 30)
      const imageOption = { offset: new window.kakao.maps.Point(16, 46) }

      // 마커 이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      )

      // 마커를 생성합니다
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      })

      // 마커가 지도 위에 표시되도록 설정
      marker.setMap(map)

      // custom overlay를 설정해줍니다
      const content = `<div class="custom_overlay">${data.price?.toLocaleString()}원</div>`

      // custom overlay를 생성합니다
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
      })
      // 커스텀 오버레이가 지도 위에 표시되도록 설정합니다
      customOverlay.setMap(map)

      // @see - https://apis.map.kakao.com/web/sample/addMapControl/
      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      const mapTypeControl = new window.kakao.maps.MapTypeControl()

      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

      console.log('DetailRoomMap: 지도 설정 완료')
    } catch (error) {
      console.error('DetailRoomMap: 지도 초기화 중 오류 발생:', error)
      setMapError(true)
      setLoadingMessage('지도 초기화 중 오류가 발생했습니다')
    }
  }

  return (
    <>
      {!data && <FullPageLoader />}
      {mapError ? (
        <div className="w-full h-[500px] border border-gray-300 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 mb-2">{loadingMessage}</div>
            <div className="text-gray-500 text-sm">
              위치: {data?.address || '주소 정보 없음'}
            </div>
            <div className="text-gray-400 text-xs mt-2">
              좌표:{' '}
              {data?.lat && data?.lng
                ? `${data.lat}, ${data.lng}`
                : '좌표 정보 없음'}
            </div>
          </div>
        </div>
      ) : !isMapLoaded ? (
        <div className="w-full h-[500px] border border-gray-300 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-gray-500">{loadingMessage}</div>
            <div className="text-gray-400 text-sm mt-2">
              위치: {data?.address || '주소 정보 없음'}
            </div>
          </div>
        </div>
      ) : (
        <div id="map" className="w-full h-[500px] border border-gray-300" />
      )}
    </>
  )
}
