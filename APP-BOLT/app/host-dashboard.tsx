import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Calendar,
  Home,
  MessageCircle,
  DollarSign,
  TrendingUp,
  LogIn,
  LogOut,
} from 'lucide-react-native';
import { colors } from '@/utils/theme';
import { apiService } from '@/services/api';

interface Booking {
  id: number;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalAmount: number;
  status: string;
  user: {
    name: string;
    image: string;
  };
  room: {
    title: string;
  };
}

interface DashboardStats {
  todayCheckIns: number;
  todayCheckOuts: number;
  monthlyRevenue: number;
  totalBookings: number;
  pendingBookings: number;
}

export default function HostDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayCheckIns: 0,
    todayCheckOuts: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('알림', '로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      // 실제 백엔드 API 엔드포인트 사용
      const response = await apiService.getHostBookings();

      if (response.success && response.data) {
        setBookings(response.data);
        calculateStats(response.data);
      } else {
        console.log('No bookings data available');
        setBookings([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error('Failed to fetch host data:', error);
      Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData: Booking[]) => {
    const today = new Date().toISOString().split('T')[0];

    const todayCheckIns = bookingsData.filter(
      (b) => b.checkIn.split('T')[0] === today
    ).length;

    const todayCheckOuts = bookingsData.filter(
      (b) => b.checkOut.split('T')[0] === today
    ).length;

    const monthlyRevenue = bookingsData
      .filter((b) => b.status === 'SUCCESS')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    setStats({
      todayCheckIns,
      todayCheckOuts,
      monthlyRevenue,
      totalBookings: bookingsData.length,
      pendingBookings: bookingsData.filter((b) => b.status === 'PENDING')
        .length,
    });
  };

  const handleBookingAction = (
    bookingId: number,
    action: 'approve' | 'reject'
  ) => {
    Alert.alert(
      action === 'approve' ? '예약 승인' : '예약 거절',
      `이 예약을 ${action === 'approve' ? '승인' : '거절'}하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => updateBookingStatus(bookingId, action),
        },
      ]
    );
  };

  const updateBookingStatus = async (
    bookingId: number,
    action: 'approve' | 'reject'
  ) => {
    try {
      const status = action === 'approve' ? 'SUCCESS' : 'CANCEL';
      const response = await apiService.updateBookingStatus(bookingId, status);

      if (response.success) {
        fetchHostData(); // 데이터 새로고침
        Alert.alert(
          '성공',
          `예약이 ${action === 'approve' ? '승인' : '거절'}되었습니다.`
        );
      } else {
        Alert.alert('오류', response.error || '처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '처리 중 오류가 발생했습니다.');
    }
  };

  const StatCard = ({ icon, title, value, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      {icon}
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>호스트 대시보드</Text>
          <Text style={styles.subtitle}>오늘의 현황</Text>
        </View>

        {/* 통계 카드들 */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={<LogIn size={24} color={colors.primary.default} />}
            title="오늘 체크인"
            value={stats.todayCheckIns}
            color={colors.primary.default}
          />
          <StatCard
            icon={<LogOut size={24} color={colors.accent.default} />}
            title="오늘 체크아웃"
            value={stats.todayCheckOuts}
            color={colors.accent.default}
          />
          <StatCard
            icon={<DollarSign size={24} color={colors.success.default} />}
            title="이번 달 수익"
            value={`₩${stats.monthlyRevenue.toLocaleString()}`}
            color={colors.success.default}
          />
          <StatCard
            icon={<TrendingUp size={24} color={colors.warning.default} />}
            title="대기 중 예약"
            value={stats.pendingBookings}
            color={colors.warning.default}
          />
        </View>

        {/* 빠른 액션 버튼들 */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>빠른 액션</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={20} color={colors.primary.default} />
              <Text style={styles.actionButtonText}>캘린더</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color={colors.primary.default} />
              <Text style={styles.actionButtonText}>메시지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Home size={20} color={colors.primary.default} />
              <Text style={styles.actionButtonText}>내 숙소</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 최근 예약 목록 */}
        <View style={styles.recentBookings}>
          <Text style={styles.sectionTitle}>최근 예약</Text>
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Home size={48} color={colors.neutral[400]} />
              <Text style={styles.emptyStateTitle}>예약이 없습니다</Text>
              <Text style={styles.emptyStateText}>
                아직 등록하신 숙소에 예약이 없습니다.{'\n'}
                숙소를 홍보해 보세요!
              </Text>
            </View>
          ) : (
            bookings.slice(0, 5).map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>{booking.room.title}</Text>
                  <Text style={styles.bookingGuest}>{booking.user.name}</Text>
                  <Text style={styles.bookingDates}>
                    {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </Text>
                  <Text style={styles.bookingAmount}>
                    ₩{booking.totalAmount.toLocaleString()}
                  </Text>
                </View>

                {booking.status === 'PENDING' && (
                  <View style={styles.bookingActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleBookingAction(booking.id, 'approve')}
                    >
                      <Text style={styles.approveBtnText}>승인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleBookingAction(booking.id, 'reject')}
                    >
                      <Text style={styles.rejectBtnText}>거절</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral[900],
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral[600],
    marginTop: 4,
  },
  statsContainer: {
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral[900],
  },
  statTitle: {
    fontSize: 14,
    color: colors.neutral[600],
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.neutral[700],
    fontWeight: '500',
  },
  recentBookings: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingInfo: {
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral[900],
  },
  bookingGuest: {
    fontSize: 14,
    color: colors.neutral[600],
    marginTop: 4,
  },
  bookingDates: {
    fontSize: 14,
    color: colors.neutral[600],
    marginTop: 4,
  },
  bookingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary.default,
    marginTop: 4,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: colors.success.default,
  },
  rejectBtn: {
    backgroundColor: colors.error.default,
  },
  approveBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
});
