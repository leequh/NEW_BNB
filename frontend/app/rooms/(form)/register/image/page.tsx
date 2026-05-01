/* eslint-disable @next/next/no-img-element */
'use client'

import { roomFormState } from '@/atom'
import { useRouter } from 'next/navigation'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import { useForm } from 'react-hook-form'
import Stepper from '@/components/Form/Stepper'
import NextButton from '@/components/Form/NextButton'
import { AiFillCamera } from 'react-icons/ai'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { uploadMultipleImages } from '@/utils/imageApi'

interface RoomImageProps {
  images?: string[]
}

export default function RoomRegisterImage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [roomForm, setRoomForm] = useRecoilState(roomFormState)
  // FileReader로 읽은 이미지 객체들
  const [images, setImages] = useState<string[] | null>(null)
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
  const resetRoomForm = useResetRecoilState(roomFormState)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // 실제 파일 객체들

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomImageProps>()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e

    if (!files) return

    const fileArray = Array.from(files)
    setSelectedFiles(fileArray) // 실제 파일 객체 저장
    setImages([])

    // 미리보기용 이미지 생성
    fileArray.forEach((file: File) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onloadend = (event: ProgressEvent<FileReader>) => {
        const { result } = event.target as FileReader
        if (result) {
          setImages((val) =>
            val ? [...val, result?.toString()] : [result?.toString()],
          )
        }
      }
    })
  }

  async function uploadImages() {
    console.log('📸 uploadImages 함수 시작')
    console.log('📸 selectedFiles:', selectedFiles?.length || 0, '개')
    
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('⚠️ selectedFiles가 비어있음!')
      return []
    }

    console.log(`🔄 Starting upload of ${selectedFiles.length} images...`)

    try {
      // 먼저 Firebase Storage로 직접 업로드 시도
      console.log('🔥 Firebase 업로드 시도 중...')
      const { uploadMultipleImagesToFirebase } = await import(
        '@/utils/imageApi'
      )
      const uploadResults = await uploadMultipleImagesToFirebase(selectedFiles)
      const imageUrls = uploadResults.map((result) => result.url)

      console.log(
        `✅ Firebase upload completed. ${imageUrls.length} images uploaded successfully.`,
      )
      console.log('✅ Firebase imageUrls:', imageUrls)
      return imageUrls
    } catch (firebaseError) {
      console.error(
        '❌ Firebase upload failed, trying backend API...',
        firebaseError,
      )

      try {
        // Firebase 실패 시 기존 백엔드 API로 대체
        console.log('🔄 Backend API 업로드 시도 중...')
        const uploadResults = await uploadMultipleImages(selectedFiles)
        const imageUrls = uploadResults.map((result) => result.url)

        console.log(
          `✅ Backend upload completed. ${imageUrls.length} images uploaded successfully.`,
        )
        console.log('✅ Backend imageUrls:', imageUrls)
        return imageUrls
      } catch (error) {
        console.error('❌ Error in uploadImages function: ', error)
        toast.error('이미지 업로드에 실패했습니다.')
        throw error
      }
    }
  }

  // 이미지 삭제는 백엔드에서 자동으로 처리되므로 제거

  const onSubmit = async (data: RoomImageProps) => {
    // roomForm API 생성 요청
    // 생성 후에는 resetRoomForm으로 리코일 초기화
    // 내가 등록한 숙소 리스트로 돌아가도록 라우팅
    try {
      setDisableSubmit(true)

      console.log('Starting room registration process...')
      console.log('Room form data:', roomForm)

      let imageUrls: string[] = []

      // 이미지가 선택된 경우에만 업로드 시도
      if (selectedFiles && selectedFiles.length > 0) {
        console.log('🚀 uploadImages 함수 호출 시작...')
        try {
          imageUrls = await uploadImages()
          console.log('✅ Images uploaded successfully, count:', imageUrls?.length || 0)
          console.log('✅ Image URLs:', imageUrls)
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError)
          toast.error('이미지 업로드에 실패했습니다. 이미지 없이 등록하시겠습니까?')
          setDisableSubmit(false)
          return
        }
      } else {
        console.log('⚠️ 이미지 없이 숙소 등록')
      }

      try {
        console.log('Sending room data to backend...')
        console.log('Session data:', session)
        console.log('Session user:', session?.user)
        console.log('Session user ID:', session?.user?.id)
        console.log('Access token:', (session as any)?.accessToken)

        // Fallback: Generate token if accessToken is missing
        let authToken = (session as any)?.accessToken

        if (!authToken && session?.user?.id) {
          console.log(
            'No accessToken found, creating user and generating token...',
          )
          try {
            // 카카오 로그인 사용자를 Backend에 생성/찾기
            const createUserResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social-login`,
              {
                name: session.user.name,
                email: `${session.user.id}@kakao.user`, // 카카오 사용자용 임시 이메일
                image: session.user.image,
                provider: 'kakao',
              },
            )
            console.log('User created/found:', createUserResponse.data)
            authToken = createUserResponse.data.token
            console.log('Generated token:', authToken)
          } catch (tokenError) {
            console.error(
              'Failed to create user and generate token:',
              tokenError,
            )
            console.error('Error response:', (tokenError as any).response?.data)
          }
        }

        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
          {
            ...roomForm,
            price: Number(roomForm.price), // price를 숫자로 변환
            images: imageUrls,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          },
        )

        console.log('Backend response:', result.status, result.data)

        if (result.status === 201) {
          toast.success('숙소를 등록했습니다.')
          resetRoomForm()
          router.push('/')
        } else {
          toast.error('데이터 생성중 문제가 발생했습니다.')
          setDisableSubmit(false)
        }
      } catch (error) {
        console.error('Backend API error:', error)
        toast.error('API 요청 중 문제가 발생했습니다.')
        deleteImages()
        setDisableSubmit(false)
      }
    } catch (e) {
      setDisableSubmit(false)
      console.error('Overall error:', e)
      toast.error('이미지 업로드 중 문제가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <>
      <Stepper count={5} />
      <form
        className="mt-10 flex flex-col gap-6 px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-semibold text-lg md:text-2xl text-center">
          숙소의 사진을 추가해주세요
        </h1>
        <p className="text-sm md:text-base text-gray-500 text-center">
          숙소 사진은 최대 5장까지 추가할 수 있습니다.
        </p>
        <div className="flex flex-col gap-2">
          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <AiFillCamera className="mx-auto h-12 w-12 text-gray-300" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-600 focus-within:ring-offset-2 hover:text-rose-500"
                  >
                    <span>최대 5장의 사진을</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      {...register('images', { required: true })}
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">업로드 해주세요</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF 등 이미지 포맷만 가능
                </p>
              </div>
            </div>
          </div>
          {errors?.images && errors?.images?.type === 'required' && (
            <span className="text-red-600 text-sm">필수 항목입니다.</span>
          )}
        </div>
        <div className="mt-10 max-w-lg mx-auto flex flex-wrap gap-4">
          {images &&
            images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="미리보기"
                width={100}
                height={100}
                className="rounded-md"
              />
            ))}
        </div>
        <NextButton
          type="submit"
          text="완료"
          disabled={isSubmitting || disableSubmit}
        />
      </form>
    </>
  )
}
