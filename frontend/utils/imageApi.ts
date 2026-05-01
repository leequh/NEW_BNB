import { authenticatedRequest } from './authApi'
import { apiClient, extractData, handleApiError } from './apiClient'
import { ApiResponse } from '../types/api'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase' // 위에서 export한 storage 사용

interface UploadResult {
  url: string
  fileName: string
  filePath: string
}

/**
 * Firebase Storage로 직접 이미지 업로드 (사용자 가이드 방식)
 */
export const uploadImageToFirebase = async (file: File, path = 'uploads/') => {
  const fileRef = ref(storage, `${path}${file.name}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef) // 다운로드 URL 반환
}

/**
 * 다중 이미지를 Firebase Storage로 직접 업로드
 */
export const uploadMultipleImagesToFirebase = async (files: File[]) => {
  const uploadPromises = files.map(async (file) => {
    const url = await uploadImageToFirebase(file, 'rooms/')
    return {
      url,
      fileName: file.name,
      filePath: `rooms/${file.name}`,
    }
  })

  return await Promise.all(uploadPromises)
}

/**
 * 단일 이미지 업로드 (표준 API 클라이언트 사용)
 */
export async function uploadSingleImage(file: File): Promise<UploadResult> {
  try {
    const result = await apiClient.uploadFile<UploadResult>(
      '/api/images/upload',
      file,
      'image',
    )
    return extractData(result)
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * 다중 이미지 업로드 (공개 업로드 사용 - 인증 불필요)
 */
export async function uploadMultipleImages(
  files: File[],
): Promise<UploadResult[]> {
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/upload-public`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error(`이미지 업로드 실패: HTTP ${response.status}`)
      throw new Error(`이미지 업로드 실패: HTTP ${response.status}`)
    }

    const data = await response.json()
    const uploadedImages = data.data || []
    
    if (uploadedImages.length === 0) {
      console.error('백엔드 이미지 업로드 실패: 빈 배열 반환')
      throw new Error('이미지 업로드에 실패했습니다.')
    }
    
    return uploadedImages
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    throw error
  }
}

/**
 * 단일 이미지 삭제 (표준 API 클라이언트 사용)
 */
export async function deleteSingleImage(imageUrl: string): Promise<void> {
  try {
    await apiClient.delete('/api/images/delete', {
      body: { imageUrl },
    })
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * 다중 이미지 삭제 (표준 API 클라이언트 사용)
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<void> {
  try {
    await apiClient.delete('/api/images/delete-multiple', {
      body: { imageUrls },
    })
  } catch (error) {
    throw handleApiError(error)
  }
}
