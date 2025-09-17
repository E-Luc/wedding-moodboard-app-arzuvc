
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import { setupErrorLogging } from '../utils/errorLogger';
import { useAuth } from '../hooks/useAuth';
import '../utils/i18n';

const STORAGE_KEY = 'natively_emulate_device';

export default function RootLayout() {
  const { isAuthenticated, loading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setupErrorLogging();
    console.log('RootLayout mounted, setting up error logging');
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'profile-setup';
    
    console.log('Navigation effect:', {
      isAuthenticated,
      segments,
      inAuthGroup,
      profileComplete: user?.profileComplete
    });

    if (!isAuthenticated && !inAuthGroup) {
      console.log('Redirecting to auth - user not authenticated');
      router.replace('/auth');
    } else if (isAuthenticated && !user?.profileComplete && segments[0] !== 'profile-setup') {
      console.log('Redirecting to profile setup - profile incomplete');
      router.replace('/profile-setup');
    } else if (isAuthenticated && user?.profileComplete && inAuthGroup) {
      console.log('Redirecting to home - user authenticated and profile complete');
      router.replace('/');
    }

    setIsNavigationReady(true);
  }, [isAuthenticated, loading, segments, user?.profileComplete]);

  if (loading || !isNavigationReady) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="profile-setup" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="guests" />
          <Stack.Screen name="budget" />
          <Stack.Screen name="timeline" />
          <Stack.Screen name="vendors" />
          <Stack.Screen name="inspiration" />
          <Stack.Screen name="help" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
