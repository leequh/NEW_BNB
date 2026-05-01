/* eslint-disable @next/next/no-img-element */
'use client'

import { RoomFeatureProps } from '@/app/rooms/(form)/register/feature/page'
import { CATEGORY, FeatureFormField, RoomEditField } from '@/constants'
import { RoomFormType, RoomType } from '@/interface'
import { useSession } from 'next-auth/react'
import { uploadMultipleImages, deleteMultipleImages } from '@/utils/imageApi'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import AddressSearch from './AddressSearch'
import { v4 as uuidv4 } from 'uuid'

import cn from 'classnames'
import { AiFillCamera } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import axios from 'axios'

export default function RoomEditForm({ data }: { data: RoomType }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [images, setImages] = useState<string[] | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // 새로 선택된 파일들
  const [hasNewImages, setHasNewImages] = useState<boolean>(false) // 새 이미지 업로드 여부

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e

    if (!files) return

    const fileArray = Array.from(files)
    setSelectedFiles(fileArray) // 실제 파일 객체 저장
    setHasNewImages(true) // 새 이미지가 선택됨을 표시
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormType>()

  const onClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    title: keyof RoomFeatureProps,
  ) => {
    setValue(title, event?.target?.checked)
  }

  async function uploadImages() {
    // 새 이미지가 선택되지 않은 경우 기존 이미지 유지
    if (!hasNewImages) {
      return data.images
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('이미지를 한 개 이상 업로드해주세요')
      return
    }

    try {
      // 기존 이미지가 있다면 삭제
      if (data.images && data.images.length > 0) {
        await deleteMultipleImages(data.images)
      }

      // 새 이미지 업로드
      const uploadResults = await uploadMultipleImages(selectedFiles)
      const imageUrls = uploadResults.map((result) => result.url)

      return imageUrls
    } catch (error) {
      console.error('Error uploading images: ', error)
      toast.error('이미지 업로드에 실패했습니다.')
      throw error
    }
  }

  useEffect(() => {
    if (data) {
      // 모든 필드를 순회하면서 setValue 호출
      Object.keys(data)?.forEach((key) => {
        const field = key as keyof RoomFormType
        if (RoomEditField.includes(field)) {
          setValue(field, data[field])
        }
      })
    }

    if (data.images) {
      setImages(data.images)
    }
  }, [data])

  return (
    <form
      className="px-4 md:max-w-4xl mx-auto py-8 my-20 flex flex-col gap-8"
      onSubmit={handleSubmit(async (res) => {
        try {
          const imageUrls = await uploadImages()
          const result = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${data.id}`,
            {
              ...res,
              price: Number(res.price),
              images: imageUrls,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )

          if (result.status === 200) {
            toast.success('숙소를 수정했습니다.')
            router.replace('/users/rooms')
          } else {
            toast.error('다시 시도해주세요')
          }
        } catch (e) {
          console.log(e)
          toast.error('데이터 수정중 문제가 생겼습니다.')
        }
      })}
    >
      <h1 className="font-semibold text-lg md:text-2xl text-center">
        숙소 수정하기
      </h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-lg font-semibold">
          숙소 이름
        </label>
        <input
          {...register('title', { required: true, maxLength: 30 })}
          className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
        />
        {errors.title && errors.title.type === 'required' && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
        {errors.title && errors.title.type === 'maxLength' && (
          <span className="text-red-600 text-sm">
            설명은 30자 이내로 작성해주세요.
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-lg font-semibold">
          카테고리
        </label>
        <select
          {...register('category', { required: true })}
          className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
        >
          <option value="">카테고리 선택</option>
          {CATEGORY?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && errors.category.type === 'required' && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="desc" className="text-lg font-semibold">
          숙소 설명
        </label>
        <textarea
          rows={3}
          {...register('desc', { required: true })}
          className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
        />
        {errors.desc && errors.desc.type === 'required' && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="price" className="text-lg font-semibold">
          숙소 가격 (1박 기준)
        </label>
        <input
          type="number"
          {...register('price', { required: true })}
          className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black"
        />
        {errors.price && errors.price.type === 'required' && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="bedroomDesc" className="text-lg font-semibold">
          침실 설명
        </label>
        <textarea
          rows={3}
          {...register('bedroomDesc', { required: true, maxLength: 100 })}
          className="outline-none px-4 py-2 rounded-lg border-2 focus:border-black resize-none"
        />
        {errors.bedroomDesc && errors.bedroomDesc.type === 'required' && (
          <span className="text-red-600 text-sm">필수 항목입니다.</span>
        )}
        {errors.bedroomDesc && errors.bedroomDesc.type === 'maxLength' && (
          <span className="text-red-600 text-sm">
            설명은 100자 이내로 작성해주세요.
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">편의시설</label>
        <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-3">
          {FeatureFormField?.map((feature) => (
            <label
              key={feature.field}
              className={cn(
                'border-2 rounded-md hover:bg-black/5 p-3 text-center text-sm',
                {
                  'border-2 border-black': !!watch(feature?.field),
                },
              )}
            >
              <input
                type="checkbox"
                onClick={(e: any) => onClick(e, feature.field)}
                placeholder={feature.field}
                {...register(feature.field)}
                className="hidden"
              />
              {feature.label}
            </label>
          ))}
        </div>
      </div>
      <AddressSearch register={register} errors={errors} setValue={setValue} />
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
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-semibold leading-6 text-gray-900"
        >
          뒤로가기
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-rose-600 hover:bg-rose-500 px-8 py-2.5 font-semibold text-white disabled:bg-gray-300"
        >
          수정하기
        </button>
      </div>
    </form>
  )
}
