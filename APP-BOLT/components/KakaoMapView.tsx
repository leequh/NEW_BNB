import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Typography from './Typography';
import { colors, spacing } from '@/utils/theme';

interface KakaoMapViewProps {
  latitude?: number;
  longitude?: number;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  }>;
  onMarkerPress?: (markerId: string) => void;
}

const KakaoMapView: React.FC<KakaoMapViewProps> = ({
  latitude = 37.565337,
  longitude = 126.9772095,
  markers = [],
  onMarkerPress,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 환경변수에서 Kakao Map API 키 가져오기
  const kakaoMapApiKey = Constants.expoConfig?.extra?.kakaoMapApiKey;

  useEffect(() => {
    console.log('=== Kakao Map Debug ===');
    console.log('API Key:', kakaoMapApiKey);
    console.log('Constants.expoConfig?.extra:', Constants.expoConfig?.extra);

    if (!kakaoMapApiKey || kakaoMapApiKey === 'your_kakao_map_api_key_here') {
      console.log('API Key가 없거나 기본값입니다.');
      Alert.alert(
        '지도 서비스 오류',
        'Kakao Map API 키가 설정되지 않았습니다. 관리자에게 문의하세요.'
      );
      setHasError(true);
    } else {
      console.log(
        'API Key가 정상적으로 로드되었습니다:',
        kakaoMapApiKey.substring(0, 10) + '...'
      );
    }

    // 30초 후에도 로딩이 완료되지 않으면 에러 처리
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('지도 로딩 타임아웃');
        setHasError(true);
        setIsLoading(false);
      }
    }, 30000);

    return () => clearTimeout(loadingTimeout);
  }, [kakaoMapApiKey, isLoading]);

  const generateHTML = () => {
    const markersJS = markers
      .map(
        (marker) => `
      var markerPosition${marker.id} = new kakao.maps.LatLng(${marker.latitude}, ${marker.longitude});
      var marker${marker.id} = new kakao.maps.Marker({
        position: markerPosition${marker.id}
      });
      marker${marker.id}.setMap(map);
      
      var infowindow${marker.id} = new kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;">${marker.title}</div>'
      });
      
      kakao.maps.event.addListener(marker${marker.id}, 'click', function() {
        infowindow${marker.id}.open(map, marker${marker.id});
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerPress',
          markerId: '${marker.id}'
        }));
      });
    `
      )
      .join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kakao Map</title>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
          #map { width: 100%; height: 100%; }
          .error-container { 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            height: 100%; 
            font-family: Arial, sans-serif; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div id="error-container" class="error-container" style="display: none;">
          <h3>지도를 불러올 수 없습니다</h3>
          <p>잠시 후 다시 시도해주세요</p>
        </div>
        <script>
          function showError(message) {
            console.error('Kakao Map Error:', message);
            document.getElementById('map').style.display = 'none';
            document.getElementById('error-container').style.display = 'flex';
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: message
              }));
            }
          }

          function loadKakaoMap() {
            // Kakao SDK 로드
            var script = document.createElement('script');
            script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false';
            script.onload = function() {
              try {
                if (typeof kakao === 'undefined' || !kakao.maps) {
                  throw new Error('Kakao Maps SDK가 로드되지 않았습니다.');
                }
                
                kakao.maps.load(function() {
                  initializeMap();
                });
              } catch (error) {
                showError(error.message);
              }
            };
            script.onerror = function(error) {
              showError('Kakao Maps SDK 로드에 실패했습니다.');
            };
            document.head.appendChild(script);
          }

          function initializeMap() {
            try {
              var mapContainer = document.getElementById('map');
              if (!mapContainer) {
                throw new Error('지도 컨테이너를 찾을 수 없습니다.');
              }

              var mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
              };
              
              var map = new kakao.maps.Map(mapContainer, mapOption);
              
              // 중심 마커 추가
              var centerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
              var centerMarker = new kakao.maps.Marker({
                position: centerPosition
              });
              centerMarker.setMap(map);
              
              // 추가 마커들
              ${markersJS}
              
              // 로딩 완료 메시지
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapLoaded'
                }));
              }
              
            } catch (error) {
              showError(error.message);
            }
          }

          // API 키 확인 및 지도 로드 시작
          if (!('${kakaoMapApiKey}') || '${kakaoMapApiKey}' === 'your_kakao_map_api_key_here') {
            showError('API 키가 설정되지 않았습니다.');
          } else {
            loadKakaoMap();
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'mapLoaded':
          setIsLoading(false);
          break;
        case 'markerPress':
          if (onMarkerPress) {
            onMarkerPress(data.markerId);
          }
          break;
        case 'error':
          console.error('Kakao Map Error:', data.message);
          setHasError(true);
          setIsLoading(false);
          break;
      }
    } catch (error) {
      console.error('Message parsing error:', error);
    }
  };

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Typography
          variant="h3"
          color={colors.neutral[600]}
          style={{ textAlign: 'center' }}
        >
          지도를 불러올 수 없습니다
        </Typography>
        <Typography
          variant="body2"
          color={colors.neutral[500]}
          style={{ textAlign: 'center', marginTop: spacing.sm }}
        >
          네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.default} />
          <Typography
            variant="body2"
            color={colors.neutral[600]}
            style={{ marginTop: spacing.sm }}
          >
            지도를 불러오는 중...
          </Typography>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ html: generateHTML() }}
        style={styles.webView}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setHasError(true);
          setIsLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
          setHasError(true);
          setIsLoading(false);
        }}
        onLoadEnd={() => {
          // WebView 로딩이 완료되었지만 아직 지도가 로드되지 않았을 수 있음
          console.log('WebView loaded');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 1000,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});

export default KakaoMapView;
