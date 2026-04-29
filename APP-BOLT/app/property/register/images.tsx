import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Camera, Plus, X } from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius } from '@/utils/theme';

// 동적 IP 설정 - 개발 환경에서는 실제 백엔드 서버 IP 사용
const API_BASE_URL = 'http://192.168.0.41:5000/api';

// 임시 샘플 이미지 URL들
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop',
];

export default function ImagesScreen() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadSavedData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const [libraryStatus, cameraStatus] = await Promise.all([
      ImagePicker.requestMediaLibraryPermissionsAsync(),
      ImagePicker.requestCameraPermissionsAsync(),
    ]);

    if (libraryStatus.status !== 'granted') {
      Alert.alert(
        '권한 필요',
        '사진을 선택하려면 갤러리 접근 권한이 필요합니다.'
      );
    }

    if (cameraStatus.status !== 'granted') {
      Alert.alert(
        '권한 필요',
        '사진을 촬영하려면 카메라 접근 권한이 필요합니다.'
      );
    }
  };

  const loadSavedData = async () => {
    try {
      const savedImages = await AsyncStorage.getItem('roomForm_images');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    } catch (error) {
      console.error('[PropertyRegister] Error loading saved images:', error);
    }
  };

  const showImagePickerOptions = () => {
    if (images.length >= 5) {
      Alert.alert('알림', '최대 5장의 사진만 업로드할 수 있습니다.');
      return;
    }

    Alert.alert('사진 선택', '사진을 어떻게 추가하시겠습니까?', [
      {
        text: '갤러리에서 선택',
        onPress: pickImagesFromGallery,
      },
      {
        text: '카메라로 촬영',
        onPress: takePhotoWithCamera,
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  };

  const pickImagesFromGallery = async () => {
    setUploadingImage(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
        selectionLimit: 5 - images.length,
      });

      await processImagePickerResult(result);
    } catch (error) {
      handleImagePickerError(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const takePhotoWithCamera = async () => {
    setUploadingImage(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      await processImagePickerResult(result);
    } catch (error) {
      handleImagePickerError(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const processImagePickerResult = async (result: any) => {
    if (!result.canceled && result.assets) {
      // URI 검증 및 필터링
      const validImages = result.assets
        .filter((asset: any) => {
          // file:// 스키마를 가진 URI만 허용
          if (!asset.uri.startsWith('file://')) {
            console.warn('Invalid URI scheme:', asset.uri);
            return false;
          }
          return true;
        })
        .map((asset: any) => asset.uri);

      if (validImages.length === 0) {
        Alert.alert(
          '이미지 선택 오류',
          '갤러리에서 직접 저장된 이미지를 선택해주세요.\nGoogle Drive나 클라우드 파일은 지원되지 않습니다.'
        );
        return;
      }

      const totalImages = images.length + validImages.length;

      if (totalImages > 5) {
        Alert.alert(
          '알림',
          `최대 5장까지만 선택할 수 있습니다. ${
            5 - images.length
          }장만 추가됩니다.`
        );
        validImages.splice(5 - images.length);
      }

      const updatedImages = [...images, ...validImages];
      setImages(updatedImages);

      // AsyncStorage에 저장
      await AsyncStorage.setItem(
        'roomForm_images',
        JSON.stringify(updatedImages)
      );
    }
  };

  const handleImagePickerError = (error: any) => {
    console.error('[PropertyRegister] Error picking images:', error);

    // 더 구체적인 에러 메시지
    let errorMessage = '이미지 선택 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      if (error.message.includes("Uri lacks 'file' scheme")) {
        errorMessage =
          '갤러리에서 직접 저장된 이미지를 선택해주세요.\nGoogle Drive나 클라우드 파일은 지원되지 않습니다.';
      } else if (error.message.includes('rejected')) {
        errorMessage = '이미지 선택이 취소되었거나 권한이 없습니다.';
      }
    }

    Alert.alert('이미지 선택 오류', errorMessage);
  };

  const addSampleImages = async () => {
    const updatedImages = [...SAMPLE_IMAGES];
    setImages(updatedImages);

    // AsyncStorage에 저장
    await AsyncStorage.setItem(
      'roomForm_images',
      JSON.stringify(updatedImages)
    );
    Alert.alert('완료', '샘플 이미지가 추가되었습니다!');
  };

  const addImageFromUrl = async () => {
    if (!imageUrl.trim()) {
      Alert.alert('알림', '이미지 URL을 입력해주세요.');
      return;
    }

    if (images.length >= 5) {
      Alert.alert('알림', '최대 5장의 사진만 업로드할 수 있습니다.');
      return;
    }

    const updatedImages = [...images, imageUrl.trim()];
    setImages(updatedImages);
    setImageUrl('');

    // AsyncStorage에 저장
    await AsyncStorage.setItem(
      'roomForm_images',
      JSON.stringify(updatedImages)
    );
  };

  const removeImage = async (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    await AsyncStorage.setItem(
      'roomForm_images',
      JSON.stringify(updatedImages)
    );
  };

  const collectFormData = async () => {
    try {
      // AsyncStorage에서 모든 데이터 수집
      const [
        category,
        title,
        desc,
        price,
        bedroomDesc,
        address,
        lat,
        lng,
        freeCancel,
        selfCheckIn,
        officeSpace,
        hasMountainView,
        hasShampoo,
        hasFreeLaundry,
        hasAirConditioner,
        hasWifi,
        hasBarbeque,
        hasFreeParking,
      ] = await AsyncStorage.multiGet([
        'roomForm_category',
        'roomForm_title',
        'roomForm_desc',
        'roomForm_price',
        'roomForm_bedroomDesc',
        'roomForm_address',
        'roomForm_lat',
        'roomForm_lng',
        'roomForm_freeCancel',
        'roomForm_selfCheckIn',
        'roomForm_officeSpace',
        'roomForm_hasMountainView',
        'roomForm_hasShampoo',
        'roomForm_hasFreeLaundry',
        'roomForm_hasAirConditioner',
        'roomForm_hasWifi',
        'roomForm_hasBarbeque',
        'roomForm_hasFreeParking',
      ]);

      return {
        category: category[1] || 'apartment',
        title: title[1] || '',
        desc: desc[1] || '',
        price: parseInt(price[1] || '0'),
        bedroomDesc: bedroomDesc[1] || '',
        address: address[1] || '',
        lat: lat[1] || '37.5665',
        lng: lng[1] || '126.9780',
        images: images,
        freeCancel: freeCancel[1] === 'true',
        selfCheckIn: selfCheckIn[1] === 'true',
        officeSpace: officeSpace[1] === 'true',
        hasMountainView: hasMountainView[1] === 'true',
        hasShampoo: hasShampoo[1] === 'true',
        hasFreeLaundry: hasFreeLaundry[1] === 'true',
        hasAirConditioner: hasAirConditioner[1] === 'true',
        hasWifi: hasWifi[1] === 'true',
        hasBarbeque: hasBarbeque[1] === 'true',
        hasFreeParking: hasFreeParking[1] === 'true',
      };
    } catch (error) {
      console.error('[PropertyRegister] Error collecting form data:', error);
      throw error;
    }
  };

  const submitProperty = async () => {
    try {
      setLoading(true);

      // 폼 데이터 수집
      const formData = await collectFormData();

      console.log('[PropertyRegister] Submitting property with form data');

      // API URL 확인
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.41:5000/api';
      console.log('[PropertyRegister] Using API URL:', apiUrl);

      // 첫 번째 단계: 이미지가 있으면 Firebase Storage로 직접 업로드
      let uploadedImageUrls: string[] = [];

      if (images.length > 0) {
        console.log(
          '[PropertyRegister] Uploading images to Firebase Storage...'
        );

        try {
          // Firebase Storage로 직접 업로드
          const { uploadMultipleImagesToFirebase } = await import(
            '../../../services/imageUpload'
          );
          const uploadResults = await uploadMultipleImagesToFirebase(images);
          uploadedImageUrls = uploadResults.map((result) => result.url);

          console.log(
            '[PropertyRegister] Images uploaded successfully to Firebase:',
            uploadedImageUrls
          );
        } catch (firebaseError) {
          console.warn(
            '[PropertyRegister] Firebase upload failed, trying backend API...',
            firebaseError
          );

          // Firebase 업로드 실패 시 기존 백엔드 API로 대체
          const imageFormData = new FormData();

          for (let i = 0; i < images.length; i++) {
            const imageUri = images[i];
            imageFormData.append('images', {
              uri: imageUri,
              type: 'image/jpeg',
              name: `image_${i}.jpg`,
            } as any);
          }

          try {
            const imageResponse = await fetch(
              `${apiUrl}/images/upload-public`,
              {
                method: 'POST',
                body: imageFormData,
              }
            );

            if (imageResponse.ok) {
              const imageResult = await imageResponse.json();
              uploadedImageUrls = imageResult.urls || [];
              console.log(
                '[PropertyRegister] Backend upload successful:',
                uploadedImageUrls
              );
            } else {
              console.warn('[PropertyRegister] Backend upload also failed');
            }
          } catch (backendError) {
            console.warn(
              '[PropertyRegister] Backend upload error:',
              backendError
            );
          }
        }
      }

      // 두 번째 단계: 숙소 정보 등록
      const submitFormData = new FormData();

      // 기본 정보 추가
      submitFormData.append('title', formData.title);
      submitFormData.append('desc', formData.desc);
      submitFormData.append('price', formData.price.toString());
      submitFormData.append('address', formData.address);
      submitFormData.append('lat', formData.lat);
      submitFormData.append('lng', formData.lng);
      submitFormData.append('category', formData.category);
      submitFormData.append('bedroomDesc', formData.bedroomDesc);

      // 편의시설 정보 추가
      submitFormData.append('freeCancel', formData.freeCancel.toString());
      submitFormData.append('selfCheckIn', formData.selfCheckIn.toString());
      submitFormData.append('officeSpace', formData.officeSpace.toString());
      submitFormData.append(
        'hasMountainView',
        formData.hasMountainView.toString()
      );
      submitFormData.append('hasShampoo', formData.hasShampoo.toString());
      submitFormData.append(
        'hasFreeLaundry',
        formData.hasFreeLaundry.toString()
      );
      submitFormData.append(
        'hasAirConditioner',
        formData.hasAirConditioner.toString()
      );
      submitFormData.append('hasWifi', formData.hasWifi.toString());
      submitFormData.append('hasBarbeque', formData.hasBarbeque.toString());
      submitFormData.append(
        'hasFreeParking',
        formData.hasFreeParking.toString()
      );

      // 업로드된 이미지 URL들 추가
      console.log(
        '[PropertyRegister] Adding image URLs to FormData:',
        uploadedImageUrls
      );
      uploadedImageUrls.forEach((url, index) => {
        submitFormData.append(`images[${index}]`, url);
      });

      // 이미지 배열도 JSON으로 추가 (백엔드에서 파싱용)
      submitFormData.append('images', JSON.stringify(uploadedImageUrls));

      console.log('[PropertyRegister] FormData prepared, sending request...');

      const response = await fetch(`${apiUrl}/rooms`, {
        method: 'POST',
        headers: {
          // Content-Type을 설정하지 않음 (FormData가 자동으로 설정)
        },
        body: submitFormData,
      });

      console.log('[PropertyRegister] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: '서버 응답을 파싱할 수 없습니다.' }));
        console.error('[PropertyRegister] Registration failed:', errorData);

        throw new Error(
          errorData.message || '숙소 등록 중 오류가 발생했습니다.'
        );
      }

      const result = await response.json();
      console.log('[PropertyRegister] Property created:', result);

      // 성공 시 AsyncStorage 초기화
      await clearFormData();

      // 성공 메시지 (이미지 업로드 여부에 따라 다름)
      const successMessage =
        uploadedImageUrls.length > 0
          ? '숙소가 성공적으로 등록되었습니다!'
          : '숙소가 등록되었습니다. (이미지는 업로드되지 않았습니다)';

      Alert.alert('등록 완료', successMessage, [
        {
          text: '확인',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('[PropertyRegister] Error submitting property:', error);

      let errorMessage = '숙소 등록 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage =
            '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearFormData = async () => {
    try {
      const keys = [
        'roomForm_category',
        'roomForm_title',
        'roomForm_desc',
        'roomForm_price',
        'roomForm_bedroomDesc',
        'roomForm_address',
        'roomForm_lat',
        'roomForm_lng',
        'roomForm_images',
        'roomForm_freeCancel',
        'roomForm_selfCheckIn',
        'roomForm_officeSpace',
        'roomForm_hasMountainView',
        'roomForm_hasShampoo',
        'roomForm_hasFreeLaundry',
        'roomForm_hasAirConditioner',
        'roomForm_hasWifi',
        'roomForm_hasBarbeque',
        'roomForm_hasFreeParking',
      ];

      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('[PropertyRegister] Error clearing form data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" style={styles.title}>
          숙소 사진 업로드
        </Typography>
        <Typography variant="body2" style={styles.subtitle}>
          숙소의 사진을 추가해주세요 (최대 5장)
        </Typography>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 이미지 업로드 영역 */}
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={showImagePickerOptions}
          disabled={uploadingImage || images.length >= 5}
          activeOpacity={0.7}
        >
          {uploadingImage ? (
            <ActivityIndicator size="large" color={colors.primary.default} />
          ) : (
            <>
              <Camera size={40} color={colors.neutral[400]} />
              <Typography variant="h6" style={styles.uploadText}>
                {images.length >= 5
                  ? '최대 5장까지 업로드 가능'
                  : '사진 선택하기'}
              </Typography>
              <Typography variant="caption" style={styles.uploadSubtext}>
                갤러리에서 사진을 선택하세요
              </Typography>
            </>
          )}
        </TouchableOpacity>

        {/* 샘플 이미지 추가 버튼 */}
        <TouchableOpacity
          style={[
            styles.sampleButton,
            images.length >= 5 && styles.sampleButtonDisabled,
          ]}
          onPress={addSampleImages}
          disabled={images.length >= 5}
          activeOpacity={0.7}
        >
          <Typography variant="body1" style={styles.sampleButtonText}>
            📸 샘플 이미지 5장 추가
          </Typography>
        </TouchableOpacity>

        {/* URL로 이미지 추가 */}
        <View style={styles.urlInputSection}>
          <Typography variant="h6" style={styles.sectionTitle}>
            또는 이미지 URL 직접 입력
          </Typography>
          <View style={styles.urlInputContainer}>
            <TextInput
              style={styles.urlInput}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/image.jpg"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[
                styles.addUrlButton,
                (!imageUrl.trim() || images.length >= 5) &&
                  styles.addUrlButtonDisabled,
              ]}
              onPress={addImageFromUrl}
              disabled={!imageUrl.trim() || images.length >= 5}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 선택된 이미지들 */}
        {images.length > 0 && (
          <View style={styles.imagesGrid}>
            {images.map((imageUri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 안내 메시지 */}
        <View style={styles.infoSection}>
          <Typography variant="body2" style={styles.infoText}>
            • 첫 번째 사진이 대표 이미지로 사용됩니다.{'\n'}• 밝고 깨끗한 사진을
            업로드하면 더 많은 예약을 받을 수 있습니다.{'\n'}• 사진은
            정사각형으로 자동 조정됩니다.
          </Typography>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={submitProperty}
          loading={loading}
          disabled={images.length === 0}
          style={styles.submitButton}
        >
          {loading ? '등록 중...' : '숙소 등록하기'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.neutral[900],
  },
  subtitle: {
    textAlign: 'center',
    color: colors.neutral[600],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  uploadArea: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    minHeight: 200,
  },
  uploadText: {
    marginTop: spacing.md,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  uploadSubtext: {
    marginTop: spacing.xs,
    color: colors.neutral[500],
    textAlign: 'center',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  infoText: {
    color: colors.neutral[600],
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  submitButton: {
    width: '100%',
  },
  urlInputSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
    color: colors.neutral[900],
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
  },
  addUrlButton: {
    marginLeft: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.default,
  },
  addUrlButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  sampleButton: {
    backgroundColor: colors.primary.default,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sampleButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  sampleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
