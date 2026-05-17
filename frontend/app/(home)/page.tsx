'use client'
import React, { useEffect, useRef } from 'react'
import CategoryList from '@/components/CategoryList'
import { GridLayout, RoomItem } from '@/components/RoomList'
import { useInfiniteQuery } from '@tanstack/react-query'

import axios from 'axios'

import { RoomType } from '@/interface'
import { Loader, LoaderGrid } from '@/components/Loader'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'

import Map from '@/components/Map'
import SelectedRoom from '@/components/Map/SelectedRoom'

import { useRecoilValue } from 'recoil'
import { filterState } from '@/atom'

// Mock data for testing
const mockRooms: RoomType[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
  ],
  title: `${
    i % 5 === 0
      ? '시그니엘'
      : i % 4 === 0
        ? '트리마제'
        : i % 3 === 0
          ? '프리미엄'
          : i % 2 === 0
            ? '럭셔리'
            : '모던'
  } ${
    i % 5 === 0
      ? '원룸'
      : i % 4 === 0
        ? '투룸'
        : i % 3 === 0
          ? '오피스텔'
          : i % 2 === 0
            ? '아파트'
            : '고시원'
  } ${i + 1}`,
  address: `서울특별시 ${i % 2 === 0 ? '강남구' : '종로구'} 샘플동 ${
    i + 1
  }번지`,
  price: 50000 + i * 10000,
  category:
    i % 5 === 0
      ? '원룸'
      : i % 4 === 0
        ? '투룸'
        : i % 3 === 0
          ? '오피스텔'
          : i % 2 === 0
            ? '아파트'
            : '고시원',
  lat: '37.565337',
  lng: '126.9772095',
  freeCancel: true,
  selfCheckIn: true,
  officeSpace: false,
  hasMountainView: i % 3 === 0,
  hasShampoo: true,
  hasFreeLaundry: i % 2 === 0,
  hasAirConditioner: true,
  hasWifi: true,
  hasBarbeque: i % 4 === 0,
  hasFreeParking: i % 2 === 0,
}))

export default function Home() {
  const ref = useRef<HTMLDivElement | null>(null)
  const filterValue = useRecoilValue(filterState)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const filterParams = {
    location: filterValue.location,
    category: filterValue.category,
  }

  const fetchRooms = async ({ pageParam = 1 }) => {
    try {
      const { data } = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms?page=` + pageParam,
        // 'http://localhost:5000/api/rooms?page=' + pageParam,
        {
          params: {
            limit: 12,
            page: pageParam,
            ...filterParams,
          },
        },
      )
      return data
    } catch (error) {
      console.error('Error fetching rooms:', error)
      // Return mock data on error
      return {
        page: pageParam,
        data: mockRooms,
        totalCount: mockRooms.length,
        totalPage: 1,
      }
    }
  }

  const {
    data: rooms,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['rooms', filterParams],
    queryFn: fetchRooms,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.length > 0 && lastPage.page < lastPage.totalPage
        ? lastPage.page + 1
        : undefined,
  })

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }
  }, [fetchNextPage, hasNextPage, isPageEnd])

  // Use mock data if real data is not available
  const roomsToShow =
    isError || !rooms?.pages ? [{ data: mockRooms }] : rooms.pages

  const allRooms = roomsToShow.flatMap((page) => page?.data || [])

  // 카테고리가 선택되지 않았을 때: 원래 홈페이지 레이아웃
  if (!filterValue.category) {
    return (
      <>
        <CategoryList />
        <GridLayout>
          {isLoading ? (
            <LoaderGrid />
          ) : (
            roomsToShow.map((page, index) => (
              <React.Fragment key={index}>
                {page?.data &&
                  page.data.map((room: RoomType) => (
                    <RoomItem room={room} key={room.id} />
                  ))}
              </React.Fragment>
            ))
          )}
        </GridLayout>
        {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
        <div className="w-full touch-none h-10 mb-10" ref={ref} />
      </>
    )
  }

  // 카테고리가 선택되었을 때: 분할 뷰 (왼쪽 목록 + 오른쪽 지도)
  return (
    <>
      <CategoryList />
      <div className="flex mt-20 h-[calc(100vh-80px)]">
        {/* 왼쪽: 숙소 목록 */}
        <div className="w-1/2 overflow-y-auto px-4 pb-10">
          <div className="sticky top-0 bg-white py-3 z-10 border-b mb-4">
            <h2 className="text-lg font-semibold">
              <span className="text-rose-500">{filterValue.category}</span> 숙소 목록
            </h2>
            <p className="text-sm text-gray-500">
              총 {allRooms.length}개의 숙소
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {isLoading ? (
              <LoaderGrid />
            ) : (
              allRooms.map((room: RoomType) => (
                <RoomItem room={room} key={room.id} />
              ))
            )}
          </div>
          
          {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
          <div className="w-full touch-none h-10" ref={ref} />
        </div>

        {/* 오른쪽: 지도 */}
        <div className="w-1/2 sticky top-20 h-[calc(100vh-80px)]">
          <Map rooms={allRooms} />
          <SelectedRoom />
        </div>
      </div>
    </>
  )
}
