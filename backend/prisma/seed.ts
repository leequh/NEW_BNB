import { PrismaClient } from '@prisma/client'
import { fakerKO as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

export const CATEGORY = [
  '원룸',
  '투룸',
  '오피스텔',
  '아파트',
  '고시원',
]

async function seedUsers() {
  for (let i = 0; i < 10; i++) {
    const userData = {
      email: faker.internet.email(),
      name: faker.person.lastName() + faker.person.firstName(),
      image: faker.image.avatar(),
      desc: faker.lorem.paragraph(),
    }

    const res = await prisma.user.create({
      data: userData,
    })

    console.log(`✅ User ${i + 1}/10 created`)
  }
}

async function seedRooms() {
  const totalUsers = await prisma.user.findMany()
  if (totalUsers?.length > 1) {
    for (let i = 0; i < 50; i++) {
      const randomUserIndex = Math.floor(Math.random() * totalUsers.length)
      const randomUser = totalUsers[randomUserIndex]

      const roomData = {
        title: faker.lorem.words(),
        images: [
          faker.image.urlLoremFlickr({
            category: 'hotel',
            width: 500,
            height: 500,
          }),
          faker.image.urlLoremFlickr({
            category: 'travel',
            width: 500,
            height: 500,
          }),
          faker.image.urlLoremFlickr({
            category: 'nature',
            width: 500,
            height: 500,
          }),
          faker.image.urlLoremFlickr({
            category: 'building',
            width: 500,
            height: 500,
          }),
        ],
        lat: getRandomLatitude(),
        lng: getRandonLongtitude(),
        address:
          faker.location.state() +
          faker.location.street() +
          faker.location.streetAddress({
            useFullAddress: true,
          }),
        desc: faker.lorem.paragraphs(),
        category: CATEGORY[Math.floor(Math.random() * CATEGORY.length)],
        bedroomDesc: faker.lorem.words(),
        price: parseInt(
          faker.commerce.price({ min: 50000, max: 500000, dec: 0 }),
        ),
        freeCancel: faker.datatype.boolean(),
        selfCheckIn: faker.datatype.boolean(),
        officeSpace: faker.datatype.boolean(),
        hasMountainView: faker.datatype.boolean(),
        hasShampoo: faker.datatype.boolean(),
        hasFreeLaundry: faker.datatype.boolean(),
        hasAirConditioner: faker.datatype.boolean(),
        hasWifi: faker.datatype.boolean(),
        hasBarbeque: faker.datatype.boolean(),
        hasFreeParking: faker.datatype.boolean(),
        userId: randomUser.id,
      }

      const res = await prisma.room.create({
        data: roomData,
      })

      console.log(`✅ Room ${i + 1}/50 created`)
    }
  }
}

// 서울 위도/경도값 랜덤 생성 함수
function getRandomLatitude() {
  const minLatitude = 37.4316
  const maxLatitude = 37.701

  return faker.number
    .float({
      min: minLatitude,
      max: maxLatitude,
      precision: 0.000001,
    })
    ?.toString()
}

function getRandonLongtitude() {
  const minLongtitude = 126.7963
  const maxLongtitude = 127.1839

  return faker.number
    .float({
      min: minLongtitude,
      max: maxLongtitude,
      precision: 0.000001,
    })
    ?.toString()
}

async function seedFaqs() {
  for (let i = 0; i < 10; i++) {
    const faqData = {
      title: faker.lorem.words(),
      desc: faker.lorem.paragraph(),
    }

    const res = await prisma.faq.create({
      data: faqData,
    })

    console.log(`✅ FAQ ${i + 1}/10 created`)
  }
}

async function main() {
  await seedUsers()
  await seedRooms()
  await seedFaqs()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
