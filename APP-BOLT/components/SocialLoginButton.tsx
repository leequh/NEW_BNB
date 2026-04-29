import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Typography from '@/components/Typography';
import { colors, spacing, borderRadius } from '@/utils/theme';

interface SocialLoginButtonProps {
  provider: 'google' | 'kakao' | 'naver';
  onPress: () => void;
  loading?: boolean;
}

// 간단한 텍스트 버전의 소셜 로그인 버튼 (아이콘 없이)
export const SimpleSocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  loading = false,
}) => {
  const getButtonConfig = () => {
    switch (provider) {
      case 'google':
        return {
          text: 'Google로 로그인',
          backgroundColor: colors.white,
          textColor: colors.neutral[700],
          borderColor: colors.neutral[300],
          symbol: 'G',
        };
      case 'kakao':
        return {
          text: 'KakaoTalk으로 로그인',
          backgroundColor: '#FEE500',
          textColor: '#000000',
          borderColor: '#FEE500',
          symbol: 'K',
        };
      case 'naver':
        return {
          text: 'NAVER로 로그인',
          backgroundColor: '#03C75A',
          textColor: colors.white,
          borderColor: '#03C75A',
          symbol: 'N',
        };
      default:
        return {
          text: '로그인',
          backgroundColor: colors.white,
          textColor: colors.neutral[700],
          borderColor: colors.neutral[300],
          symbol: '?',
        };
    }
  };

  const config = getButtonConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        loading && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View
          style={[styles.symbolContainer, { borderColor: config.textColor }]}
        >
          <Typography variant="body1" weight="bold" color={config.textColor}>
            {config.symbol}
          </Typography>
        </View>
        <Typography
          variant="body1"
          weight="medium"
          color={config.textColor}
          style={styles.text}
        >
          {loading ? '로그인 중...' : config.text}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  text: {
    flex: 1,
    textAlign: 'center',
  },
});

export default SimpleSocialLoginButton;
