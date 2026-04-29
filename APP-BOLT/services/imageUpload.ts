import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadImageToFirebase = async (uri: string, filename: string) => {
  const response = await fetch(uri);
  const blob = await response.blob(); // 모바일에서는 blob 변환 필요

  const fileRef = ref(storage, `uploads/${filename}`);
  await uploadBytes(fileRef, blob);
  return await getDownloadURL(fileRef);
};

export const uploadMultipleImagesToFirebase = async (imageUris: string[]) => {
  const uploadPromises = imageUris.map(async (uri, index) => {
    const filename = `image_${Date.now()}_${index}.jpg`;
    const url = await uploadImageToFirebase(uri, filename);
    return {
      url,
      fileName: filename,
      filePath: `uploads/${filename}`,
    };
  });

  return await Promise.all(uploadPromises);
};
