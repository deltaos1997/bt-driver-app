import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { useTheme } from '../../components/ThemeContext'
import { useAuthStore } from '../../lib/store/auth'
import Input from '../../components/Input'
import Button from '../../components/Button'

WebBrowser.maybeCompleteAuthSession()

// ── Google client IDs (set in .env, see .env.example) ───────────────────────
const GOOGLE_WEB_CLIENT_ID     = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB
const GOOGLE_EXPO_CLIENT_ID    = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_EXPO
const GOOGLE_IOS_CLIENT_ID     = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID

// Each platform requires its own client ID. If none is set for the current
// platform, skip rendering the Google button entirely to avoid a hook crash.
function googleClientIdForPlatform(): string | undefined {
  if (Platform.OS === 'web') return GOOGLE_WEB_CLIENT_ID
  if (Platform.OS === 'ios') return GOOGLE_IOS_CLIENT_ID || GOOGLE_EXPO_CLIENT_ID
  return GOOGLE_ANDROID_CLIENT_ID || GOOGLE_EXPO_CLIENT_ID
}

// ── GoogleSignInButton ────────────────────────────────────────────────────────
// Isolated component so useAuthRequest is only called when a client ID exists.
type GoogleSignInButtonProps = {
  onSignIn: (idToken: string) => void
  colors: any
}

function GoogleSignInButton({ onSignIn, colors }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    clientId: GOOGLE_EXPO_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken
      if (idToken) {
        onSignIn(idToken)
      } else {
        Alert.alert('Google Sign-In Failed', 'Could not retrieve ID token. Please try again.')
        setLoading(false)
      }
    } else if (response?.type === 'error' || response?.type === 'dismiss') {
      setLoading(false)
    }
  }, [response])

  const s = googleBtnStyles

  return (
    <TouchableOpacity
      style={[s.btn, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.8}
      disabled={loading}
      onPress={() => {
        setLoading(true)
        promptAsync()
      }}
    >
      <Text style={s.icon}>G</Text>
      <Text style={[s.label, { color: colors.text }]}>
        {loading ? 'Connecting…' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  )
}

const googleBtnStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 10,
    marginBottom: 32,
  },
  icon: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#4285F4',
    width: 24,
    textAlign: 'center',
  },
  label: { fontSize: 16, fontFamily: 'Nunito_700Bold' },
})

// ── LoginScreen ───────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { sendOtp, googleLogin } = useAuthStore()

  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)

  const googleAvailable = !!googleClientIdForPlatform()

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      const { isNewUser } = await googleLogin(idToken)
      if (isNewUser) {
        router.push('/(auth)/social-complete')
      } else {
        router.replace('/(tabs)')
      }
    } catch (e: any) {
      Alert.alert('Google Sign-In Failed', e?.response?.data?.error ?? e.message ?? 'Please try again.')
    }
  }

  const validatePhone = () => {
    const cleaned = phone.replace(/\s/g, '')
    if (!cleaned) {
      setPhoneError('Phone number is required')
      return false
    }
    const TWILIO_TEST_NUMBERS = ['+14782159223', '14782159223', '+18777804236', '18777804236']
    if (!TWILIO_TEST_NUMBERS.includes(cleaned) && !/^[6-9]\d{9}$/.test(cleaned)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number')
      return false
    }
    setPhoneError('')
    return true
  }

  const handleSendOtp = async () => {
    if (!validatePhone()) return
    setOtpError('')
    setLoading(true)
    try {
      await sendOtp(phone.replace(/\s/g, ''))
      router.push('/(auth)/otp')
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? e?.message ?? 'Could not send OTP. Please try again.'
      console.error('[SendOTP]', e)
      setOtpError(msg)
    } finally {
      setLoading(false)
    }
  }

  const s = makeStyles(colors)

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={s.logoRow}>
            <View style={[s.logoCircle, { backgroundColor: colors.accent }]}>
              <Text style={s.logoText}>BT</Text>
            </View>
          </View>

          <Text style={[s.heading, { color: colors.text }]}>Welcome to BharatTruck</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>
            Enter your mobile number to continue
          </Text>

          {/* Phone input */}
          <View style={s.form}>
            <Input
              label="Mobile Number"
              placeholder="9876543210"
              keyboardType="phone-pad"
              autoCapitalize="none"
              value={phone}
              onChangeText={(t) => {
                setPhone(t)
                if (phoneError) setPhoneError('')
              }}
              error={phoneError}
              containerStyle={s.field}
            />

            <Button
              label="Send OTP"
              onPress={handleSendOtp}
              loading={loading}
              style={s.primaryBtn}
            />
            {!!otpError && (
              <Text style={[s.errorText, { color: '#EF4444' }]}>{otpError}</Text>
            )}
          </View>

          {/* Google sign-in (only rendered when client ID is configured) */}
          {googleAvailable && (
            <>
              <View style={s.dividerRow}>
                <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[s.dividerText, { color: colors.textMuted }]}>or</Text>
                <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
              </View>
              <GoogleSignInButton onSignIn={handleGoogleSignIn} colors={colors} />
            </>
          )}

          <Text style={[s.disclaimer, { color: colors.textMuted }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    safe: { flex: 1 },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
    },
    logoRow: { alignItems: 'center', marginBottom: 28 },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      color: '#FFFFFF',
      fontSize: 30,
      fontFamily: 'Nunito_800ExtraBold',
      letterSpacing: -1,
    },
    heading: {
      fontSize: 26,
      fontFamily: 'Nunito_800ExtraBold',
      textAlign: 'center',
      marginBottom: 8,
    },
    sub: {
      fontSize: 14,
      fontFamily: 'Nunito_400Regular',
      textAlign: 'center',
      marginBottom: 36,
    },
    form: { marginBottom: 28 },
    field: { marginBottom: 20 },
    primaryBtn: {},
    errorText: {
      fontSize: 13,
      fontFamily: 'Nunito_600SemiBold',
      marginTop: 10,
      textAlign: 'center',
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      gap: 10,
    },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
    disclaimer: {
      fontSize: 12,
      fontFamily: 'Nunito_400Regular',
      textAlign: 'center',
      lineHeight: 18,
    },
  })
