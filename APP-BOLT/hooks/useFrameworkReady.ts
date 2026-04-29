import { useEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      window.frameworkReady?.();
    }
    // For mobile platforms, we don't need to do anything special
  }, []);
}
