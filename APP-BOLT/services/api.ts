import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 실제 컴퓨터 IP 주소 사용 (실제 기기와 에뮬레이터 모두 지원)
const getApiBaseUrl = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.41:5000/api';
  console.log('[API] Using API URL:', apiUrl);
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

export interface Room {
  id: number;
  title: string;
  images: string[];
  address: string;
  lat: string;
  lng: string;
  category: string;
  desc: string;
  price: number;
  bedroomDesc?: string;
  freeCancel: boolean;
  selfCheckIn: boolean;
  officeSpace: boolean;
  hasMountainView: boolean;
  hasShampoo: boolean;
  hasFreeLaundry: boolean;
  hasAirConditioner: boolean;
  hasWifi: boolean;
  hasBarbeque: boolean;
  hasFreeParking: boolean;
  userId?: string;
  createdAt: string;
  imageKeys: string[];
  user?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface SocialLoginRequest {
  name: string;
  email: string;
  image?: string;
  provider: string;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('[API] Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`[API] Making request to: ${url}`);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초로 증가

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[API] Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Error response:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`[API] Success response for ${endpoint}`);

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`[API] Request failed for ${url}:`, error);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: '요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.',
        };
      }

      if (error.message?.includes('Network request failed')) {
        return {
          success: false,
          error:
            '서버에 연결할 수 없습니다. Backend 서버가 실행 중인지 확인해주세요. (http://10.0.2.2:5000/api)',
        };
      }

      return {
        success: false,
        error: error.message || '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  // 서버 연결 테스트
  async testConnection(): Promise<ApiResponse> {
    console.log('[API] Testing server connection...');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('[API] Server connection successful');
        return { success: true, message: '서버 연결 성공!' };
      } else {
        console.log(
          '[API] Server responded but with error status:',
          response.status
        );
        return { success: false, error: `서버 오류: ${response.status}` };
      }
    } catch (error: any) {
      console.error('[API] Server connection failed:', error);
      return {
        success: false,
        error:
          '서버에 연결할 수 없습니다. Backend 서버가 실행 중인지 확인해주세요.',
      };
    }
  }

  // 숙소 목록 조회
  async getRooms(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      location?: string;
      priceMin?: number;
      priceMax?: number;
    } = {}
  ): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();

    // 기본값 설정
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('limit', (params.limit || 20).toString());

    if (params.category) queryParams.append('category', params.category);
    if (params.location) queryParams.append('location', params.location);
    if (params.priceMin)
      queryParams.append('priceMin', params.priceMin.toString());
    if (params.priceMax)
      queryParams.append('priceMax', params.priceMax.toString());

    return this.makeRequest(`/rooms?${queryParams.toString()}`);
  }

  // 특정 숙소 조회
  async getRoom(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/rooms/${id}`);
  }

  // 사용자 로그인
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // 사용자 회원가입
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 소셜 로그인
  async socialLogin(socialData: {
    name: string;
    email: string;
    image?: string;
    provider: string;
  }): Promise<ApiResponse> {
    return this.makeRequest('/auth/social-login', {
      method: 'POST',
      body: JSON.stringify(socialData),
    });
  }

  // 사용자 정보 조회
  async getMe(): Promise<ApiResponse> {
    return this.makeRequest('/auth/me');
  }

  // 테스트 사용자 생성/로그인
  async createTestUser(): Promise<ApiResponse> {
    console.log('[API] Creating/logging in test user...');
    return this.makeRequest('/auth/test-user', {
      method: 'POST',
    });
  }

  // 이미지 업로드 (토큰 불필요 - 공개 업로드)
  async uploadImages(
    files: FormData
  ): Promise<ApiResponse<{ success: boolean; urls: string[] }>> {
    return this.makeRequest<{ success: boolean; urls: string[] }>(
      '/images/upload-public',
      {
        method: 'POST',
        body: files,
      }
    );
  }

  // 호스트 대시보드용 메서드들

  // 호스트의 모든 예약 조회
  async getHostBookings(): Promise<ApiResponse> {
    return this.makeRequest('/bookings/my-rooms/bookings');
  }

  // 예약 상태 업데이트
  async updateBookingStatus(
    bookingId: number,
    status: string
  ): Promise<ApiResponse> {
    return this.makeRequest(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // 호스트 통계 조회
  async getHostStats(): Promise<ApiResponse> {
    return this.makeRequest('/users/stats');
  }

  // 이미지 삭제 기능
  async deleteSingleImage(imageUrl: string): Promise<ApiResponse> {
    return this.makeRequest('/images/delete', {
      method: 'DELETE',
      body: JSON.stringify({ imageUrl }),
    });
  }

  async deleteMultipleImages(imageUrls: string[]): Promise<ApiResponse> {
    return this.makeRequest('/images/delete-multiple', {
      method: 'DELETE',
      body: JSON.stringify({ imageUrls }),
    });
  }
}

export const apiService = new ApiService();
