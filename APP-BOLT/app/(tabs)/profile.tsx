import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Linking,
} from 'react-native';

import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Settings,
  CircleHelp as HelpCircle,
  Gift,
  MessageCircle,
  Star,
  Bell,
  Phone,
  Home,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { colors, spacing, borderRadius, shadows } from '@/utils/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
    verified: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로그인 모달용 상태들
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [isLogging, setIsLogging] = useState(false);

  // Use fixed safe area to avoid SafeAreaInsets issues
  const safeTop = 50;

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser({
          name: userData.name || '사용자',
          email: userData.email || '',
          avatar:
            userData.image ||
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          joinDate: '2024년부터 회원',
          verified: true,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleRegister = () => {
    try {
      router.push('/(auth)/register');
    } catch (error) {
      Alert.alert('알림', '회원가입 페이지로 이동합니다.');
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser({
      name: userData.name,
      email: userData.email,
      avatar: userData.image,
      joinDate: '2024년부터 회원',
      verified: true,
    });
    setShowLoginModal(false);

    // AsyncStorage에 저장
    AsyncStorage.setItem('authToken', 'test-token');
    AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        onPress: async () => {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          setUser(null);
        },
      },
    ]);
  };

  // 4개 아이콘 메뉴 아이템들
  const iconMenuItems = [
    {
      id: 'coupon',
      title: '쿠폰',
      icon: <Gift size={28} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('쿠폰', '쿠폰 페이지입니다.'),
    },
    {
      id: 'message',
      title: '메시지',
      icon: <MessageCircle size={28} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('메시지', '메시지 페이지입니다.'),
    },
    {
      id: 'review',
      title: '리뷰',
      icon: <Star size={28} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('리뷰', '리뷰 페이지입니다.'),
    },
    {
      id: 'notification',
      title: '알림',
      icon: <Bell size={28} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('알림', '알림 설정 페이지입니다.'),
    },
  ];

  // 고객센터 메뉴 아이템들
  const customerServiceItems = [
    {
      id: 'faq',
      title: '자주 묻는 질문',
      icon: <HelpCircle size={20} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('FAQ', '자주 묻는 질문 페이지입니다.'),
    },
    {
      id: 'chat',
      title: '1:1 채팅 상담',
      subtitle: '월-금요일 10:30-18:30',
      icon: <MessageCircle size={20} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('채팅 상담', '1:1 채팅 상담을 시작합니다.'),
    },
    {
      id: 'phone',
      title: '전화 상담',
      subtitle: '월-금요일 10:30-18:30',
      icon: <Phone size={20} color={colors.neutral[600]} />,
      onPress: () => Alert.alert('전화 상담', '전화 상담 연결 중입니다.'),
    },
  ];

  // 호스트 메뉴 아이템들
  const hostItems = [
    {
      id: 'host-dashboard',
      title: '호스트 대시보드',
      icon: <Home size={20} color={colors.neutral[600]} />,
      onPress: () => {
        try {
          router.push('/host-dashboard');
        } catch (error) {
          Alert.alert('호스트 대시보드', '호스트 대시보드로 이동합니다.');
        }
      },
    },
    {
      id: 'host-site',
      title: '호스트 사이트 바로가기',
      icon: <Home size={20} color={colors.neutral[600]} />,
      onPress: () => {
        Alert.alert('호스트 사이트', '호스트 전용 사이트로 이동합니다.', [
          {
            text: '확인',
            onPress: () => Linking.openURL('https://host.example.com'),
          },
        ]);
      },
    },
    {
      id: 'register-property',
      title: '숙소 등록하기',
      icon: <Home size={20} color={colors.neutral[600]} />,
      onPress: () => {
        try {
          router.push('/property/register/category');
        } catch (error) {
          Alert.alert('숙소 등록', '숙소 등록 페이지로 이동합니다.');
        }
      },
    },
  ];

  // 하단 메뉴 아이템들
  const bottomMenuItems = [
    {
      id: 'terms',
      title: '서비스 이용약관',
      onPress: () => Alert.alert('이용약관', '서비스 이용약관을 확인합니다.'),
    },
    {
      id: 'privacy',
      title: '개인정보 처리방침',
      onPress: () =>
        Alert.alert('개인정보 처리방침', '개인정보 처리방침을 확인합니다.'),
    },
  ];

  // 아이콘 메뉴 렌더링
  const renderIconMenu = () => (
    <View style={styles.iconMenuContainer}>
      {iconMenuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.iconMenuItem}
          onPress={item.onPress}
        >
          <View style={styles.iconMenuIcon}>{item.icon}</View>
          <Typography
            variant="caption"
            color={colors.neutral[700]}
            style={styles.iconMenuText}
          >
            {item.title}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 메뉴 아이템 렌더링
  const renderMenuItem = (item: any, showSubtitle = false) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        {item.icon}
        <View style={styles.menuItemTextContainer}>
          <Typography variant="body2" color={colors.neutral[800]}>
            {item.title}
          </Typography>
          {showSubtitle && item.subtitle && (
            <Typography
              variant="caption"
              color={colors.neutral[500]}
              style={styles.menuItemSubtitle}
            >
              {item.subtitle}
            </Typography>
          )}
        </View>
      </View>
      <ChevronRight size={16} color={colors.neutral[400]} />
    </TouchableOpacity>
  );

  // 로그인된 사용자 뷰
  const renderLoggedInView = () => (
    <ScrollView
      style={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContentContainer}
    >
      {/* 사용자 정보 헤더 */}
      <View style={styles.userHeader}>
        <Typography variant="h3" weight="bold" color={colors.neutral[800]}>
          안녕하세요, {user?.name}님!
        </Typography>
        <Typography
          variant="body2"
          color={colors.neutral[600]}
          style={styles.userEmail}
        >
          {user?.email}
        </Typography>
      </View>

      {/* 4개 아이콘 메뉴 */}
      {renderIconMenu()}

      {/* 고객 센터 */}
      <View style={styles.section}>
        <Typography
          variant="subtitle1"
          weight="bold"
          style={styles.sectionTitle}
        >
          고객 센터
        </Typography>
        <View style={styles.menuList}>
          {customerServiceItems.map((item) => renderMenuItem(item, true))}
        </View>
      </View>

      {/* 호스트 */}
      <View style={styles.section}>
        <Typography
          variant="subtitle1"
          weight="bold"
          style={styles.sectionTitle}
        >
          호스트
        </Typography>
        <Typography
          variant="caption"
          color={colors.neutral[500]}
          style={styles.sectionSubtitle}
        >
          숙소 등록하는 호스트 본인만?
        </Typography>
        <View style={styles.menuList}>
          {hostItems.map((item) => renderMenuItem(item))}
        </View>
      </View>

      {/* 하단 메뉴 */}
      <View style={styles.section}>
        <View style={styles.menuList}>
          {bottomMenuItems.map((item) => renderMenuItem(item))}
        </View>
      </View>

      {/* 로그아웃 버튼 */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error.default} />
          <Typography
            variant="body2"
            color={colors.error.default}
            style={styles.logoutText}
          >
            로그아웃
          </Typography>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // 로그아웃 상태 뷰
  const renderLoggedOutView = () => (
    <ScrollView
      style={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 회원가입/로그인 버튼 */}
      <View style={styles.loginSection}>
        <Button
          variant="primary"
          onPress={handleLogin}
          style={styles.loginRegisterButton}
        >
          회원가입 / 로그인하기
        </Button>
      </View>

      {/* 4개 아이콘 메뉴 */}
      {renderIconMenu()}

      {/* 고객 센터 */}
      <View style={styles.section}>
        <Typography
          variant="subtitle1"
          weight="bold"
          style={styles.sectionTitle}
        >
          고객 센터
        </Typography>
        <View style={styles.menuList}>
          {customerServiceItems.map((item) => renderMenuItem(item, true))}
        </View>
      </View>

      {/* 호스트 */}
      <View style={styles.section}>
        <Typography
          variant="subtitle1"
          weight="bold"
          style={styles.sectionTitle}
        >
          호스트
        </Typography>
        <Typography
          variant="caption"
          color={colors.neutral[500]}
          style={styles.sectionSubtitle}
        >
          숙소 등록하는 호스트 본인만?
        </Typography>
        <View style={styles.menuList}>
          {hostItems.map((item) => renderMenuItem(item))}
        </View>
      </View>

      {/* 하단 메뉴 */}
      <View style={styles.section}>
        {bottomMenuItems.map((item) => renderMenuItem(item))}
      </View>
    </ScrollView>
  );

  // 로그인 모달
  const renderLoginModal = () => {
    const handleModalLogin = async () => {
      setIsLogging(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = {
          name: '테스트 사용자',
          email: email,
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        };
        handleLoginSuccess(userData);
        Alert.alert('성공', '로그인에 성공했습니다!');
      } catch (error) {
        Alert.alert('오류', '로그인에 실패했습니다.');
      } finally {
        setIsLogging(false);
      }
    };

    return (
      <Modal
        visible={showLoginModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Typography variant="h2" weight="bold">
              로그인
            </Typography>
            <TouchableOpacity
              onPress={() => setShowLoginModal(false)}
              style={styles.closeButton}
            >
              <Typography variant="h3">✕</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Typography variant="subtitle2" style={styles.inputLabel}>
                이메일
              </Typography>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="subtitle2" style={styles.inputLabel}>
                비밀번호
              </Typography>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Button
              variant="primary"
              onPress={handleModalLogin}
              disabled={isLogging}
              style={styles.modalLoginButton}
            >
              {isLogging ? '로그인 중...' : '로그인'}
            </Button>

            <Typography
              variant="body2"
              color={colors.neutral[600]}
              style={styles.testInfo}
            >
              테스트용 계정이 미리 입력되어 있습니다.
            </Typography>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: safeTop }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.default} />
          <Typography variant="body2" style={{ marginTop: spacing.md }}>
            로그인 상태 확인 중...
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {user ? renderLoggedInView() : renderLoggedOutView()}
      {renderLoginModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 로그인 섹션
  loginSection: {
    padding: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  loginRegisterButton: {
    backgroundColor: colors.primary.default,
    borderRadius: borderRadius.lg,
  },
  // 사용자 헤더 (로그인시)
  userHeader: {
    padding: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  userEmail: {
    marginTop: spacing.xs,
  },
  // 4개 아이콘 메뉴
  iconMenuContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    justifyContent: 'space-around',
  },
  iconMenuItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconMenuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconMenuText: {
    textAlign: 'center',
  },
  // 섹션
  section: {
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    color: colors.neutral[800],
  },
  sectionSubtitle: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  // 메뉴 리스트
  menuList: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    backgroundColor: colors.white,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  menuItemSubtitle: {
    marginTop: spacing.xs,
  },
  // 로그아웃 섹션과 버튼
  logoutSection: {
    backgroundColor: colors.white,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  logoutText: {
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  // 모달 스타일
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalContent: {
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    marginBottom: spacing.xs,
    color: colors.neutral[700],
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  modalLoginButton: {
    width: '100%',
    marginTop: spacing.md,
  },
  testInfo: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
