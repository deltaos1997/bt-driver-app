import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTheme } from '../../components/ThemeContext'
import { useAuthStore } from '../../lib/store/auth'
import Button from '../../components/Button'

export default function OtpScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { pendingPhone, verifyOtp, sendOtp } = useAuthStore()

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP sent to your number.')
      return
    }
    if (!pendingPhone) {
      router.replace('/(auth)/login')
      return
    }
    setLoading(true)
    try {
      const { isNewUser } = await verifyOtp(pendingPhone, otp)
      if (isNewUser) {
        router.replace('/(auth)/register')
      } else {
        router.replace('/(tabs)')
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? e.message ?? 'Invalid or expired OTP.'
      Alert.alert('Verification Failed', msg)
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!pendingPhone) return
    setResending(true)
    try {
      await sendOtp(pendingPhone)
      Alert.alert('OTP Sent', `A new OTP has been sent to ${pendingPhone}.`)
    } catch (e: any) {
      Alert.alert('Failed', e?.response?.data?.error ?? 'Could not resend OTP. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const s = makeStyles(colors)

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.container}>
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={[s.backArrow, { color: colors.text }]}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={[s.iconWrap, { backgroundColor: colors.accent + '18' }]}>
            <Text style={s.iconText}>📱</Text>
          </View>
          <Text style={[s.heading, { color: colors.text }]}>Enter OTP</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>
            We sent a 6-digit code to{'\n'}
            <Text style={[s.phone, { color: colors.text }]}>{pendingPhone ?? '—'}</Text>
          </Text>

          {/* OTP input */}
          <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()} style={s.otpRow}>
            {Array.from({ length: 6 }).map((_, i) => {
              const char = otp[i] ?? ''
              const isCurrent = otp.length === i
              return (
                <View
                  key={i}
                  style={[
                    s.otpBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isCurrent ? colors.accent : char ? colors.accent + '66' : colors.border,
                    },
                  ]}
                >
                  <Text style={[s.otpChar, { color: colors.text }]}>{char}</Text>
                </View>
              )
            })}
          </TouchableOpacity>

          {/* Hidden TextInput captures keyboard input */}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            style={s.hiddenInput}
            caretHidden
          />

          <Button
            label="Verify OTP"
            onPress={handleVerify}
            loading={loading}
            style={s.verifyBtn}
          />

          {/* Resend */}
          <View style={s.resendRow}>
            <Text style={[s.resendText, { color: colors.textMuted }]}>Didn't receive it? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={[s.resendLink, { color: colors.accent }]}>
                {resending ? 'Sending…' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    safe: { flex: 1 },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 40,
    },
    backBtn: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      marginBottom: 24,
    },
    backArrow: { fontSize: 26, fontFamily: 'Nunito_700Bold' },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconText: { fontSize: 32 },
    heading: {
      fontSize: 28,
      fontFamily: 'Nunito_800ExtraBold',
      marginBottom: 8,
    },
    sub: {
      fontSize: 15,
      fontFamily: 'Nunito_400Regular',
      lineHeight: 22,
      marginBottom: 36,
    },
    phone: { fontFamily: 'Nunito_700Bold' },
    otpRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 36,
    },
    otpBox: {
      flex: 1,
      height: 56,
      borderRadius: 14,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    otpChar: {
      fontSize: 22,
      fontFamily: 'Nunito_800ExtraBold',
    },
    hiddenInput: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1,
    },
    verifyBtn: { marginBottom: 20 },
    resendRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    resendText: { fontSize: 14, fontFamily: 'Nunito_400Regular' },
    resendLink: { fontSize: 14, fontFamily: 'Nunito_700Bold' },
  })
