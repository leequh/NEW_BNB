export interface RoomType {
  id: number
  title: string
  images: string[]
  imageKeys?: string[]
  address: string
  lat: string
  lng: string
  category: string
  desc?: string
  bedroomDesc?: string
  price: number
  freeCancel: boolean
  selfCheckIn: boolean
  officeSpace: boolean
  hasMountainView: boolean
  hasShampoo: boolean
  hasFreeLaundry: boolean
  hasAirConditioner: boolean
  hasWifi: boolean
  hasBarbeque: boolean
  hasFreeParking: boolean
  userId?: string
  user?: UserType
  likes?: LikeType[]
  comments?: CommentType[]
  bookings?: BookingType[]
  createdAt?: string
  updatedAt?: string
}

export interface RoomFormType {
  images?: string[]
  title?: string
  address?: string
  desc?: string
  bedroomDesc?: string
  price?: number
  category?: string
  lat?: string
  lng?: string
  freeCancel?: boolean
  selfCheckIn?: boolean
  officeSpace?: boolean
  hasMountainView?: boolean
  hasShampoo?: boolean
  hasFreeLaundry?: boolean
  hasAirConditioner?: boolean
  hasWifi?: boolean
  hasBarbeque?: boolean
  hasFreeParking?: boolean
}

export interface UserType {
  id: string
  email?: string
  name?: string
  image?: string
  phone?: string
  address?: string
  desc?: string
  rooms?: RoomType[]
  accounts?: any[]
  sessions?: any[]
  bookings?: BookingType[]
  comments?: CommentType[]
  likes?: LikeType[]
}

export interface BookingType {
  id: number
  roomId: number
  userId: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalAmount: number
  totalDays?: number
  status: string
  createdAt?: string
  updatedAt?: string
  room?: RoomType
  user?: UserType
  payments?: PaymentType[]
}

export interface CommentType {
  id: number
  body: string
  roomId: number
  userId: string
  createdAt: string
  updatedAt?: string
  room?: RoomType
  user?: UserType
}

export interface CommentApiType {
  totalCount: number
  data: CommentType[]
  page: number
  totalPage: number
}

export interface LikeType {
  id: number
  roomId: number
  userId: string
  createdAt?: string
  room?: RoomType
  user?: UserType
}

export interface LocationType {
  lat: string
  lng: string
  zoom: number
}

export type DetailFilterType = 'location' | 'checkIn' | 'checkOut' | 'guest' | null

export interface FilterProps {
  location: string
  checkIn: string
  checkOut: string
  guest: number
  category: string
}

export interface FilterLayoutProps {
  title: string
  dataTitle?: string
  children: React.ReactNode
  isShow: boolean
}

export interface SearchProps {
  q: string | null
}

export interface ParamsProps {
  params: {
    id: string
  }
}

export interface BookingParamsProps {
  params: {
    id: string
  }
  searchParams: {
    checkIn: string
    checkOut: string
    guestCount: string
    totalAmount: string
    totalDays: string
  }
}

export interface PaymentType {
  id: number
  orderName?: string
  method?: string
  status?: string
  mId?: string
  cardNumber?: string
  amount?: number
  approvedAt?: string
  receiptUrl?: string
  bookingId?: number
  createdAt?: string
  updatedAt?: string
}

export interface FaqType {
  id: number
  title: string
  desc: string
  createdAt?: string
  updatedAt?: string
}
