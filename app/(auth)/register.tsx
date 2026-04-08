import { useState } from 'react'
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
import { useTheme } from '../../components/ThemeContext'
import { useAuthStore } from '../../lib/store/auth'
import { UserRole, VehicleType } from '../../lib/types'
import Input from '../../components/Input'
import Button from '../../components/Button'

const ROLES: { label: string; value: UserRole; desc: string }[] = [
  { label: 'Individual Driver', value: 'driver', desc: 'I drive my own truck' },
  { label: 'Fleet Operator', value: 'fleet_owner', desc: 'I manage multiple trucks' },
]

const VEHICLE_TYPES: { label: string; value: VehicleType }[] = [
  { label: 'Mini Truck', value: 'mini_truck' },
  { label: 'LCV (Light)', value: 'lcv' },
  { label: 'HCV (Heavy)', value: 'hcv' },
  { label: 'Trailer', value: 'trailer' },
]

export default function RegisterScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { completeProfile } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('driver')
  const [vehicleType, setVehicleType] = useState<VehicleType>('hcv')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Full name is required'
    if (role === 'driver' && !vehicleNumber.trim()) {
      e.vehicleNumber = 'Vehicle registration number is required'
    }
    if (role === 'fleet_owner' && !companyName.trim()) {
      e.companyName = 'Company name is required'
    }
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      e.email = 'Enter a valid email address'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleComplete = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await completeProfile({
        name: name.trim(),
        role,
        email: email.trim() || undefined,
        vehicle_type: role === 'driver' ? vehicleType : undefined,
        vehicle_number: role === 'driver' ? vehicleNumber.trim().toUpperCase() : undefined,
        company_name: role === 'fleet_owner' ? companyName.trim() : undefined,
      })
      router.replace('/(tabs)')
    } catch (err: any) {
      Alert.alert('Setup Failed', err?.response?.data?.error ?? err.message ?? 'Please try again.')
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
          {/* Header */}
          <View style={[s.logoDot, { backgroundColor: colors.accent }]}>
            <Text style={s.logoDotText}>BT</Text>
          </View>

          <Text style={[s.heading, { color: colors.text }]}>Complete Your Profile</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>
            Just a few details to set up your account
          </Text>

          {/* Role picker */}
          <Text style={[s.sectionLabel, { color: colors.textMuted }]}>I am a…</Text>
          <View style={s.roleRow}>
            {ROLES.map((r) => {
              const active = role === r.value
              return (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    s.roleCard,
                    {
                      backgroundColor: active ? colors.accent + '22' : colors.surface,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setRole(r.value)}
                >
                  <Text style={[s.roleTitle, { color: active ? colors.accent : colors.text }]}>
                    {r.label}
                  </Text>
                  <Text style={[s.roleDesc, { color: colors.textMuted }]}>{r.desc}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Personal details */}
          <Text style={[s.sectionLabel, { color: colors.textMuted }]}>Personal Details</Text>

          <Input
            label="Full Name"
            placeholder="Rajesh Kumar"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            error={errors.name}
            containerStyle={s.field}
          />
          <Input
            label="Email Address (optional)"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            containerStyle={s.field}
          />

          {/* Driver-specific fields */}
          {role === 'driver' && (
            <>
              <Text style={[s.sectionLabel, { color: colors.textMuted }]}>Vehicle Details</Text>

              <Text style={[s.inputLabel, { color: colors.text }]}>Vehicle Type</Text>
              <View style={s.vehicleTypeRow}>
                {VEHICLE_TYPES.map((vt) => {
                  const active = vehicleType === vt.value
                  return (
                    <TouchableOpacity
                      key={vt.value}
                      style={[
                        s.vtChip,
                        {
                          backgroundColor: active ? colors.accent : colors.surface,
                          borderColor: active ? colors.accent : colors.border,
                        },
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setVehicleType(vt.value)}
                    >
                      <Text style={[s.vtChipText, { color: active ? '#fff' : colors.text }]}>
                        {vt.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>

              <Input
                label="Vehicle Registration Number"
                placeholder="MH04XY1234"
                autoCapitalize="characters"
                autoCorrect={false}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                error={errors.vehicleNumber}
                containerStyle={s.field}
              />
            </>
          )}

          {/* Fleet owner-specific fields */}
          {role === 'fleet_owner' && (
            <>
              <Text style={[s.sectionLabel, { color: colors.textMuted }]}>Company Details</Text>
              <Input
                label="Company Name"
                placeholder="Sharma Logistics Pvt. Ltd."
                autoCapitalize="words"
                value={companyName}
                onChangeText={setCompanyName}
                error={errors.companyName}
                containerStyle={s.field}
              />
            </>
          )}

          <Button
            label="Finish Setup"
            onPress={handleComplete}
            loading={loading}
            style={s.btn}
          />
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
      paddingBottom: 48,
    },
    logoDot: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    logoDotText: {
      color: '#fff',
      fontSize: 20,
      fontFamily: 'Nunito_800ExtraBold',
    },
    heading: {
      fontSize: 26,
      fontFamily: 'Nunito_800ExtraBold',
      marginBottom: 6,
    },
    sub: {
      fontSize: 14,
      fontFamily: 'Nunito_400Regular',
      marginBottom: 28,
      lineHeight: 20,
    },
    sectionLabel: {
      fontSize: 13,
      fontFamily: 'Nunito_600SemiBold',
      marginBottom: 10,
      marginTop: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    roleRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    roleCard: {
      flex: 1,
      borderWidth: 1.5,
      borderRadius: 16,
      padding: 16,
      gap: 4,
    },
    roleTitle: { fontSize: 14, fontFamily: 'Nunito_700Bold' },
    roleDesc: { fontSize: 12, fontFamily: 'Nunito_400Regular' },
    field: { marginBottom: 16 },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Nunito_600SemiBold',
      marginBottom: 8,
    },
    vehicleTypeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    vtChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1.5,
    },
    vtChipText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
    btn: { marginTop: 8 },
  })
