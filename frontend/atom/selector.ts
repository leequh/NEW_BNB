import { selector } from 'recoil'
import { filterState } from '.'
import dayjs from 'dayjs'

export const calculatedFilterState = selector({
  key: 'FilterStateSelector',
  get: ({ get }) => {
    const filter = get(filterState)
    
    // 날짜 유효성 검사 및 기본값 설정
    const today = dayjs()
    const checkInDate = filter.checkIn && dayjs(filter.checkIn).isValid() 
      ? dayjs(filter.checkIn) 
      : today
    const checkOutDate = filter.checkOut && dayjs(filter.checkOut).isValid() 
      ? dayjs(filter.checkOut) 
      : today.add(1, 'day')
    
    // 체크아웃이 체크인보다 이전인 경우 처리
    const validCheckOutDate = checkOutDate.isAfter(checkInDate) 
      ? checkOutDate 
      : checkInDate.add(1, 'day')
    
    const guestCount = Math.max(filter.guest || 1, 1)
    const dayCount = Math.max(validCheckOutDate.diff(checkInDate, 'days'), 0)

    return { 
      guestCount, 
      dayCount,
      checkInDate: checkInDate.format('YYYY-MM-DD'),
      checkOutDate: validCheckOutDate.format('YYYY-MM-DD'),
      isValidDateRange: dayCount > 0
    }
  },
})
