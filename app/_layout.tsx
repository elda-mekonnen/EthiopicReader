import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from '@/context/LanguageContext';
import { FontSizeProvider } from '@/context/FontSizeContext';
import { Colors } from '@/constants/colors';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_500Medium,
  EBGaramond_700Bold,
} from '@expo-google-fonts/eb-garamond';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    EBGaramond_400Regular,
    EBGaramond_400Regular_Italic,
    EBGaramond_500Medium,
    EBGaramond_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <FontSizeProvider>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.burgundy,
                headerTitleStyle: { fontWeight: '700', color: Colors.text },
                contentStyle: { backgroundColor: Colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="reader/[section]"
                options={{ headerBackTitle: 'Back', title: '' }}
              />
              <Stack.Screen
                name="anaphora/index"
                options={{ title: 'Fere Qidase', headerBackTitle: 'Back' }}
              />
              <Stack.Screen
                name="anaphora/[id]"
                options={{ headerBackTitle: 'Back', title: '' }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" />
          </FontSizeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
