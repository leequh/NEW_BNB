import { IoPartlySunnyOutline } from 'react-icons/io5'
import { MdOutlineBedroomChild, MdOutlineSurfing } from 'react-icons/md'
import {
  GiHolyOak,
  GiCaveEntrance,
  GiCampingTent,
  GiBarn,
  GiSkier,
  GiStarKey,
} from 'react-icons/gi'
import { FaHouseUser, FaUmbrellaBeach } from 'react-icons/fa6'
import { BiSolidTree, BiWater } from 'react-icons/bi'
import { AiOutlineStar } from 'react-icons/ai'
import { TbSwimming, TbMoodKid } from 'react-icons/tb'
import { BsBuilding, BsHouseDoor } from 'react-icons/bs'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'

export const CATEGORY = ['원룸', '투룸', '오피스텔', '아파트', '고시원']

export const CATEGORY_DATA = [
  { title: '원룸', Icon: MdOutlineBedroomChild },
  { title: '투룸', Icon: BsHouseDoor },
  { title: '오피스텔', Icon: HiOutlineOfficeBuilding },
  { title: '아파트', Icon: BsBuilding },
  { title: '고시원', Icon: FaHouseUser },
]

/**  @example - https://png-pixel.com/ */
export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcNX9WPQAGAgJUl8IWQgAAAABJRU5ErkJggg=='

export const DEFAULT_LAT = '37.565337'
export const DEFAULT_LNG = '126.9772095'
export const ZOOM_LEVEL = 7

const FEATURE_TYPE = {
  FREE_CANCEL: 'FREE_CANCEL',
  PAID_CANCEL: 'PAID_CANCEL',
  SELF_CHECKIN: 'SELF_CHECKIN',
  SELF_CHECKIN_DISALLOWED: 'SELF_CHECKIN_DISALLOWED',
  FREE_OFFICE_SPACE: 'FREE_OFFICE_SPACE',
  NO_OFFICE_SPACE: 'NO_OFFICE_SPACE',
}

type FeatureType = (typeof FEATURE_TYPE)[keyof typeof FEATURE_TYPE]

export const FeatureDesc: Record<FeatureType, string> = {
  [FEATURE_TYPE.FREE_CANCEL]: '무료 취소가 가능합니다.',
  [FEATURE_TYPE.PAID_CANCEL]: '무료 취소가 불가능합니다.',
  [FEATURE_TYPE.SELF_CHECKIN]: '셀프 체크인이 가능합니다.',
  [FEATURE_TYPE.SELF_CHECKIN_DISALLOWED]: '셀프 체크인이 불가능합니다.',
  [FEATURE_TYPE.FREE_OFFICE_SPACE]: '사무 시설이 있습니다.',
  [FEATURE_TYPE.NO_OFFICE_SPACE]: '사무 시설이 없습니다.',
}

export const RoomEditField = [
  'title',
  'category',
  'desc',
  'bedroomDesc',
  'price',
  'address',
  'images',
  'imageKeys',
  'freeCancel',
  'selfCheckIn',
  'officeSpace',
  'hasMountainView',
  'hasShampoo',
  'hasFreeLaundry',
  'hasAirConditioner',
  'hasWifi',
  'hasBarbeque',
  'hasFreeParking',
]

export interface RoomFeatureProps {
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

interface FieldProps {
  field: keyof RoomFeatureProps
  label: string
}

export const FeatureFormField: FieldProps[] = [
  { field: 'freeCancel', label: '무료 취소' },
  { field: 'selfCheckIn', label: '셀프 체크인' },
  { field: 'officeSpace', label: '사무시설' },
  { field: 'hasMountainView', label: '마운틴 뷰' },
  { field: 'hasShampoo', label: '욕실 용품' },
  { field: 'hasFreeLaundry', label: '무료 세탁' },
  { field: 'hasAirConditioner', label: '에어컨' },
  { field: 'hasWifi', label: '무료 와이파이' },
  { field: 'hasBarbeque', label: '바베큐 시설' },
  { field: 'hasFreeParking', label: '무료 주차' },
]

export const FormUrl = {
  CATEGORY: '/rooms/register/category',
  INFO: '/rooms/register/info',
  ADDRESS: '/rooms/register/address',
  FEATURE: '/rooms/register/feature',
  IMAGE: '/rooms/register/image',
}
