import { Property, Category, User, Booking, Review, Region } from '@/types';

export const categories: Category[] = [
  { id: '1', name: '원룸', icon: '🏠' },
  { id: '2', name: '투룸', icon: '🏡' },
  { id: '3', name: '오피스텔', icon: '🏢' },
  { id: '4', name: '아파트', icon: '🏘️' },
  { id: '5', name: '고시원', icon: '🏚️' },
];

export const regions: Region[] = [
  { id: '1', name: '서울', icon: '🏙️' },
  { id: '2', name: '경기', icon: '🌆' },
  { id: '3', name: '부산', icon: '🌊' },
  { id: '4', name: '제주', icon: '🏝️' },
];

export const properties: Property[] = [
  {
    id: '1',
    title: '시그니엘 원룸',
    description:
      '시그니엘의 고급스러운 원룸입니다. 최고급 인테리어와 시설을 갖춘 프리미엄 원룸입니다.',
    location: '서울특별시 송파구 잠실동',
    price: 1500000,
    rating: 4.9,
    reviews: 127,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host1',
      name: '시그니엘',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Pool'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.5111,
      longitude: 127.0981,
    },
  },
  {
    id: '2',
    title: '트리마제 투룸',
    description:
      '트리마제의 넓은 투룸입니다. 고급스러운 인테리어와 완벽한 시설을 갖춘 프리미엄 투룸입니다.',
    location: '서울특별시 강남구 역삼동',
    price: 2000000,
    rating: 4.8,
    reviews: 89,
    category: '투룸',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host2',
      name: '트리마제',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Pool', 'Gym'],
    bedrooms: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    coordinates: {
      latitude: 37.5665,
      longitude: 126.978,
    },
  },
  {
    id: '3',
    title: '프리미엄 오피스텔',
    description:
      '강남 중심가에 위치한 프리미엄 오피스텔입니다. 최신 인테리어와 완벽한 시설을 갖춘 고급 오피스텔입니다.',
    location: '서울특별시 강남구 역삼동',
    price: 1200000,
    rating: 4.9,
    reviews: 156,
    category: '오피스텔',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host3',
      name: '프리미엄',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.5834,
      longitude: 126.9834,
    },
  },
  {
    id: '4',
    title: '럭셔리 아파트',
    description:
      '해운대 오션뷰를 자랑하는 럭셔리 아파트입니다. 발코니에서 바라보는 일출과 일몰이 환상적입니다.',
    location: '부산광역시 해운대구 우동',
    price: 1300000,
    rating: 4.7,
    reviews: 203,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host4',
      name: '럭셔리',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Pool', 'Gym'],
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    coordinates: {
      latitude: 35.1595,
      longitude: 129.1603,
    },
  },
  {
    id: '5',
    title: '모던 고시원',
    description:
      '강릉의 아름다운 자연 속에 위치한 모던한 고시원입니다. 최신 인테리어와 완벽한 시설을 갖추고 있습니다.',
    location: '강원특별자치도 강릉시 사천면',
    price: 950000,
    rating: 4.5,
    reviews: 67,
    category: '고시원',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host5',
      name: '모던',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 1,
    coordinates: {
      latitude: 37.7519,
      longitude: 128.8761,
    },
  },
  {
    id: '6',
    title: '클래식 원룸',
    description:
      '경주 역사 문화를 느낄 수 있는 클래식한 원룸입니다. 전통과 현대가 조화를 이루는 특별한 공간입니다.',
    location: '경상북도 경주시 불국로',
    price: 850000,
    rating: 4.8,
    reviews: 134,
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host6',
      name: '클래식',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 35.7898,
      longitude: 129.332,
    },
  },
  {
    id: '7',
    title: '오션뷰 원룸',
    description:
      '여수의 아름다운 밤바다를 감상할 수 있는 오션뷰 원룸입니다. 최고의 뷰를 자랑하는 프리미엄 원룸입니다.',
    location: '전라남도 여수시 돌산읍',
    price: 1100000,
    rating: 4.6,
    reviews: 98,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host7',
      name: '오션뷰',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Pool'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 34.7604,
      longitude: 127.6622,
    },
  },
  {
    id: '8',
    title: '마운틴뷰 원룸',
    description:
      '설악산 국립공원을 바라보는 마운틴뷰 원룸입니다. 자연과 함께하는 프리미엄 원룸입니다.',
    location: '강원특별자치도 속초시 설악산로',
    price: 950000,
    rating: 4.7,
    reviews: 145,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host8',
      name: '마운틴뷰',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 38.1198,
      longitude: 128.4656,
    },
  },
  {
    id: '9',
    title: '프리미엄 오피스텔',
    description:
      '강남 중심가에 위치한 프리미엄 오피스텔입니다. 최신 인테리어와 완벽한 시설을 갖춘 고급 오피스텔입니다.',
    location: '서울특별시 강남구 역삼동',
    price: 1800000,
    rating: 4.8,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host9',
      name: '프리미엄',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.5834,
      longitude: 126.9834,
    },
  },
  {
    id: '10',
    title: '럭셔리 아파트',
    description:
      '해운대 오션뷰를 자랑하는 럭셔리 아파트입니다. 발코니에서 바라보는 일출과 일몰이 환상적입니다.',
    location: '부산광역시 해운대구 우동',
    price: 2500000,
    rating: 4.7,
    reviews: 203,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host10',
      name: '럭셔리',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Pool', 'Gym'],
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    coordinates: {
      latitude: 35.1595,
      longitude: 129.1603,
    },
  },
  {
    id: '11',
    title: '모던 고시원',
    description:
      '강남 중심가에 위치한 모던한 고시원입니다. 최신 인테리어와 완벽한 시설을 갖추고 있습니다.',
    location: '서울특별시 강남구 역삼동',
    price: 450000,
    rating: 4.5,
    reviews: 67,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host11',
      name: '모던',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Parking', 'TV', 'Air Conditioning', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 1,
    coordinates: {
      latitude: 37.5834,
      longitude: 126.9834,
    },
  },
  // 추가 원룸 숙소들
  {
    id: '12',
    title: '강남 프리미엄 원룸',
    description:
      '강남역 인근의 프리미엄 원룸입니다. 최신 시설과 완벽한 교통 접근성을 자랑합니다.',
    location: '서울특별시 강남구 역삼동',
    price: 1200000,
    rating: 4.7,
    reviews: 98,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host12',
      name: '프리미엄',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.4979,
      longitude: 127.0276,
    },
  },
  {
    id: '13',
    title: '홍대 감성 원룸',
    description:
      '홍대 거리의 활기찬 분위기를 느낄 수 있는 감성적인 원룸입니다. 젊은 예술가들의 거리.',
    location: '서울특별시 마포구 홍익로',
    price: 900000,
    rating: 4.6,
    reviews: 142,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host13',
      name: '감성',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.5563,
      longitude: 126.9242,
    },
  },
  // 추가 투룸 숙소들
  {
    id: '14',
    title: '잠실 패밀리 투룸',
    description:
      '잠실 롯데타워 인근의 패밀리 친화적인 투룸입니다. 넓은 공간과 완벽한 시설을 갖추고 있습니다.',
    location: '서울특별시 송파구 잠실동',
    price: 1800000,
    rating: 4.8,
    reviews: 167,
    category: '투룸',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host14',
      name: '패밀리',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Pool', 'Gym'],
    bedrooms: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    coordinates: {
      latitude: 37.5125,
      longitude: 127.1025,
    },
  },
  {
    id: '15',
    title: '신촌 럭셔리 투룸',
    description:
      '신촌의 중심가에 위치한 럭셔리 투룸입니다. 대학가의 활기와 편안한 휴식을 동시에.',
    location: '서울특별시 서대문구 신촌동',
    price: 1600000,
    rating: 4.7,
    reviews: 89,
    category: '투룸',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host15',
      name: '럭셔리',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking'],
    bedrooms: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    coordinates: {
      latitude: 37.5596,
      longitude: 126.9425,
    },
  },
  // 추가 오피스텔 숙소들
  {
    id: '16',
    title: '판교 모던 오피스텔',
    description:
      '판교 테크노밸리의 모던한 오피스텔입니다. IT 기업들과 가까운 최적의 위치입니다.',
    location: '경기도 성남시 분당구 판교동',
    price: 1400000,
    rating: 4.8,
    reviews: 124,
    category: '오피스텔',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host16',
      name: '모던',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.3943,
      longitude: 127.1108,
    },
  },
  {
    id: '17',
    title: '용산 아이파크 오피스텔',
    description:
      '용산 아이파크몰 인근의 고급 오피스텔입니다. 쇼핑과 교통이 편리한 최고의 입지입니다.',
    location: '서울특별시 용산구 한강로동',
    price: 1500000,
    rating: 4.9,
    reviews: 201,
    category: '오피스텔',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host17',
      name: '아이파크',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Pool', 'Gym'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: {
      latitude: 37.5299,
      longitude: 126.9645,
    },
  },
  // 추가 아파트 숙소들
  {
    id: '18',
    title: '송도 센트럴파크 아파트',
    description:
      '송도 센트럴파크를 조망하는 현대적인 아파트입니다. 국제도시의 품격을 느낄 수 있습니다.',
    location: '인천광역시 연수구 송도동',
    price: 1700000,
    rating: 4.8,
    reviews: 156,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host18',
      name: '센트럴파크',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: [
      'Wifi',
      'Kitchen',
      'TV',
      'Air Conditioning',
      'Pool',
      'Gym',
      'Parking',
    ],
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    coordinates: {
      latitude: 37.3954,
      longitude: 126.6368,
    },
  },
  {
    id: '19',
    title: '분당 정자동 아파트',
    description:
      '분당 정자동의 고급 아파트입니다. 쾌적한 주거환경과 편리한 교통을 자랑합니다.',
    location: '경기도 성남시 분당구 정자동',
    price: 1600000,
    rating: 4.7,
    reviews: 134,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host19',
      name: '정자동',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking', 'Gym'],
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    coordinates: {
      latitude: 37.3615,
      longitude: 127.1111,
    },
  },
  // 추가 고시원 숙소들
  {
    id: '20',
    title: '신림 스마트 고시원',
    description:
      '신림동의 스마트한 고시원입니다. 깔끔한 시설과 합리적인 가격으로 장기 거주에 최적입니다.',
    location: '서울특별시 관악구 신림동',
    price: 650000,
    rating: 4.4,
    reviews: 89,
    category: '고시원',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host20',
      name: '스마트',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: false,
    },
    amenities: ['Wifi', 'TV', 'Air Conditioning', 'Kitchen'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 1,
    coordinates: {
      latitude: 37.4844,
      longitude: 126.9287,
    },
  },
  {
    id: '21',
    title: '노량진 프리미엄 고시원',
    description:
      '노량진 고시촌의 프리미엄 고시원입니다. 공부하기 좋은 조용한 환경과 완벽한 시설을 제공합니다.',
    location: '서울특별시 동작구 노량진동',
    price: 700000,
    rating: 4.6,
    reviews: 167,
    category: '고시원',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host21',
      name: '프리미엄',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'TV', 'Air Conditioning', 'Kitchen', 'Study Room'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 1,
    coordinates: {
      latitude: 37.513,
      longitude: 126.9425,
    },
  },
  // 서울 추가 숙소들
  {
    id: '22',
    title: '홍대 감성 원룸',
    description:
      '홍대 근처의 감성적인 원룸입니다. 젊은 감각의 인테리어와 편리한 위치를 자랑합니다.',
    location: '서울특별시 마포구 홍익동',
    price: 950000,
    rating: 4.5,
    reviews: 78,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host22',
      name: '홍대감성',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'TV'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: { latitude: 37.5503, longitude: 126.9246 },
  },
  {
    id: '23',
    title: '이태원 모던 아파트',
    description:
      '이태원의 모던한 아파트입니다. 국제적인 분위기와 편리한 시설을 갖추고 있습니다.',
    location: '서울특별시 용산구 이태원동',
    price: 1800000,
    rating: 4.8,
    reviews: 156,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host23',
      name: '이태원모던',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Gym'],
    bedrooms: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    coordinates: { latitude: 37.5347, longitude: 126.9947 },
  },
  {
    id: '24',
    title: '삼성동 프리미엄 오피스텔',
    description:
      '삼성동 코엑스 근처의 프리미엄 오피스텔입니다. 비즈니스 출장에 최적화되어 있습니다.',
    location: '서울특별시 강남구 삼성동',
    price: 1400000,
    rating: 4.7,
    reviews: 203,
    category: '오피스텔',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host24',
      name: '삼성프리미엄',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: { latitude: 37.512, longitude: 127.0592 },
  },
  {
    id: '25',
    title: '명동 중심가 투룸',
    description:
      '명동 중심가의 편리한 투룸입니다. 쇼핑과 관광에 최적의 위치를 자랑합니다.',
    location: '서울특별시 중구 명동',
    price: 1700000,
    rating: 4.6,
    reviews: 134,
    category: '투룸',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host25',
      name: '명동중심',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning'],
    bedrooms: 2,
    beds: 2,
    baths: 1,
    maxGuests: 4,
    coordinates: { latitude: 37.5636, longitude: 126.9824 },
  },
  // 경기 추가 숙소들
  {
    id: '26',
    title: '수원 화성 근처 아파트',
    description:
      '수원 화성 관광지 근처의 깔끔한 아파트입니다. 역사적 명소 탐방에 최적입니다.',
    location: '경기도 수원시 팔달구',
    price: 1200000,
    rating: 4.4,
    reviews: 89,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host26',
      name: '수원화성',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Parking'],
    bedrooms: 2,
    beds: 2,
    baths: 1,
    maxGuests: 4,
    coordinates: { latitude: 37.2636, longitude: 127.0286 },
  },
  {
    id: '27',
    title: '안양 평촌 신도시 원룸',
    description:
      '안양 평촌 신도시의 모던한 원룸입니다. 교통이 편리하고 시설이 우수합니다.',
    location: '경기도 안양시 동안구 평촌동',
    price: 980000,
    rating: 4.5,
    reviews: 112,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host27',
      name: '평촌신도시',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: { latitude: 37.389, longitude: 126.951 },
  },
  {
    id: '28',
    title: '고양 일산 호수공원 투룸',
    description:
      '일산 호수공원 근처의 환경 좋은 투룸입니다. 산책과 휴식에 최적의 위치입니다.',
    location: '경기도 고양시 일산동구',
    price: 1350000,
    rating: 4.7,
    reviews: 145,
    category: '투룸',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host28',
      name: '일산호수',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking'],
    bedrooms: 2,
    beds: 2,
    baths: 1,
    maxGuests: 4,
    coordinates: { latitude: 37.6688, longitude: 126.7794 },
  },
  // 부산 추가 숙소들
  {
    id: '29',
    title: '서면 중심가 오피스텔',
    description:
      '부산 서면 중심가의 편리한 오피스텔입니다. 쇼핑과 교통이 편리합니다.',
    location: '부산광역시 부산진구 서면동',
    price: 1100000,
    rating: 4.5,
    reviews: 98,
    category: '오피스텔',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host29',
      name: '서면중심',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: { latitude: 35.1579, longitude: 129.0569 },
  },
  {
    id: '30',
    title: '광안리 해변 아파트',
    description:
      '광안리 해변이 보이는 멋진 아파트입니다. 바다 전망과 야경이 환상적입니다.',
    location: '부산광역시 수영구 광안동',
    price: 1600000,
    rating: 4.9,
    reviews: 234,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host30',
      name: '광안리뷰',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Pool'],
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    coordinates: { latitude: 35.1532, longitude: 129.118 },
  },
  {
    id: '31',
    title: '남포동 관광특구 원룸',
    description:
      '남포동 관광특구의 편리한 원룸입니다. 자갈치시장과 용두산공원이 가깝습니다.',
    location: '부산광역시 중구 남포동',
    price: 850000,
    rating: 4.3,
    reviews: 67,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host31',
      name: '남포관광',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'TV'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: { latitude: 35.0974, longitude: 129.0286 },
  },
  // 제주 추가 숙소들
  {
    id: '32',
    title: '제주시 신제주 아파트',
    description:
      '신제주 지역의 현대적인 아파트입니다. 제주공항 접근성이 좋고 편의시설이 풍부합니다.',
    location: '제주특별자치도 제주시 연동',
    price: 1300000,
    rating: 4.6,
    reviews: 123,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host32',
      name: '신제주',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning', 'Parking'],
    bedrooms: 2,
    beds: 2,
    baths: 1,
    maxGuests: 4,
    coordinates: { latitude: 33.489, longitude: 126.4983 },
  },
  {
    id: '33',
    title: '성산일출봉 근처 펜션',
    description:
      '성산일출봉 근처의 아늑한 펜션입니다. 일출 명소와 가까워 특별한 경험을 선사합니다.',
    location: '제주특별자치도 서귀포시 성산읍',
    price: 1150000,
    rating: 4.8,
    reviews: 189,
    category: '원룸',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host33',
      name: '성산일출',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'TV', 'Air Conditioning'],
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    coordinates: { latitude: 33.4584, longitude: 126.927 },
  },
  {
    id: '34',
    title: '중문 관광단지 리조트',
    description:
      '중문 관광단지의 럭셔리 리조트입니다. 골프와 해변 접근성이 뛰어납니다.',
    location: '제주특별자치도 서귀포시 중문동',
    price: 2200000,
    rating: 4.9,
    reviews: 312,
    category: '아파트',
    images: [
      'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
    ],
    host: {
      id: 'host34',
      name: '중문리조트',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isSuperhost: true,
    },
    amenities: [
      'Wifi',
      'Kitchen',
      'TV',
      'Air Conditioning',
      'Pool',
      'Gym',
      'Parking',
    ],
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    coordinates: { latitude: 33.2392, longitude: 126.4115 },
  },
];

export const users: User[] = [
  {
    id: '1',
    name: '김민수',
    email: 'minsu.kim@example.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isHost: true,
  },
  {
    id: '2',
    name: '이지은',
    email: 'jieun.lee@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isHost: true,
  },
];

export const bookings: Booking[] = [
  {
    id: '1',
    propertyId: '1',
    userId: '1',
    checkIn: '2024-06-15',
    checkOut: '2024-06-18',
    guests: 2,
    totalPrice: 360000,
    status: 'upcoming',
  },
  {
    id: '2',
    propertyId: '3',
    userId: '1',
    checkIn: '2024-05-10',
    checkOut: '2024-05-12',
    guests: 4,
    totalPrice: 190000,
    status: 'completed',
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    propertyId: '1',
    userId: '1',
    userName: '김민수',
    userAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      '정말 아름다운 바다뷰와 깨끗한 시설이 인상적이었습니다. 호스트분도 매우 친절하셨고, 다음에도 꼭 다시 방문하고 싶어요!',
    date: '2024-05-20',
  },
  {
    id: '2',
    propertyId: '1',
    userId: '2',
    userName: '이지은',
    userAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    comment:
      '위치가 정말 좋고 시설도 깔끔했어요. 아침에 보는 일출이 너무 예뻤습니다.',
    date: '2024-05-15',
  },
  {
    id: '3',
    propertyId: '3',
    userId: '1',
    userName: '김민수',
    userAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      '전통 한옥에서의 특별한 경험이었습니다. 온돌이 따뜻하고 한국 전통 문화를 제대로 체험할 수 있었어요.',
    date: '2024-05-12',
  },
];
