import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Home, Search, Heart, Calendar, User } from 'lucide-react-native';
import { colors } from '@/utils/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 83 : 70,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#C6C6C8',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          elevation: 0,
          shadowColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 2,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          paddingHorizontal: 0,
          minHeight: Platform.OS === 'ios' ? 49 : 54,
          height: '100%',
          width: '100%',
        },
        tabBarButton: ({ children, onPress, accessibilityState }) => (
          <TouchableOpacity
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 0,
              paddingHorizontal: 0,
              minHeight: Platform.OS === 'ios' ? 49 : 54,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
            hitSlop={{
              top: 15,
              bottom: 15,
              left: 15,
              right: 15,
            }}
            activeOpacity={0.6}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={accessibilityState}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                width: '100%',
                height: '100%',
                minHeight: Platform.OS === 'ios' ? 49 : 54,
                paddingVertical: 6,
                paddingHorizontal: 4,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {children}
            </View>
          </TouchableOpacity>
        ),
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: false,
        tabBarAllowFontScaling: false,
        tabBarAccessibilityLabel: undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          tabBarIcon: ({ color, focused }) => (
            <Search
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          title: '찜',
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: '예약',
          tabBarIcon: ({ color, focused }) => (
            <Calendar
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내 정보',
          tabBarIcon: ({ color, focused }) => (
            <User
              size={focused ? 26 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
