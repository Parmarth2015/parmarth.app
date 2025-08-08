import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { ActivityIndicator } from 'react-native-paper';

const SafeVideoPlayer = ({ uri, style, onError }) => {
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when URI changes
    setIsLoading(true);
    setHasError(false);
  }, [uri]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoad = (loadStatus) => {
    setStatus(loadStatus);
    setIsLoading(false);
  };

  const handleError = (error) => {
    console.warn('Video playback error:', error);
    setHasError(true);
    setIsLoading(false);
    
    if (onError) {
      onError(error);
    } else {
      Alert.alert(
        'Video Error',
        'Unable to play this video. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    setStatus(status);
  };

  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Video unavailable</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Video
        source={{ uri }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        shouldPlay={false}
        isMuted={false}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#002855" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: 200,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
  },
});

export default SafeVideoPlayer; 