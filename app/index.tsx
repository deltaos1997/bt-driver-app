import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../components/ThemeContext'

export default function SplashIndex() {
  const router = useRouter()
  const { colors } = useTheme()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      router.replace('/(tabs)')
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <SafeAreaView style={styles.inner}>
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.logoCircle, { backgroundColor: colors.accent }]}>
            <Text style={styles.logoText}>BT</Text>
          </View>
          <Text style={[styles.brandName, { color: colors.text }]}>BharatTruck</Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>Bharat ka Truck</Text>
          <Text style={[styles.taglineEn, { color: colors.textMuted }]}>
            India's Trusted Freight Partner
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.footer, { color: colors.textMuted }]}>Driver App v1.0</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontFamily: 'Nunito_800ExtraBold',
    letterSpacing: -1,
  },
  brandName: {
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  taglineEn: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  footer: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 24,
  },
})
