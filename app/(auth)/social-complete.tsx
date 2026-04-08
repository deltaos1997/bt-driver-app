import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
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

export default function SocialCompleteScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { user, completeProfile } = useAuthStore()

  const [role, setRole] = useState<UserRole>('driver')
  const [vehicleType, setVehicleType] = useState<VehicleType>('hcv')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (role === 'driver' && !vehicleNumber.trim()) {
      e.vehicleNumber = 'Vehicle registration number is required'
    }
    if (role === 'fleet_owner' && !companyName.trim()) {
      e.companyName = 'Company name is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleComplete = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await completeProfile({
        name: user?.name ?? '',
        role,
        email: user?.email,
        vehicle_type: role === 'driver' ? vehicleType : undefined,
        vehicle_number: role === 'driver' ? vehicleNumber.trim().toUpperCase() : undefined,
        company_name: role === 'fleet_owner' ? companyName.trim() : undefined,
      })
      router.replace('/(tabs)')
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error ?? err.message ?? 'Please try again.')
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
          <View style={s.headerRow}>
            <View style={[s.logoDot, { backgroundColor: colors.accent }]}>
              <Text style={s.logoDotText}>BT</Text>
            </View>
          </View>

          <Text style={[s.heading, { color: colors.text }]}>Complete Your Profile</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>
            Just a few more details to finish setting up your Google account
          </Text>

          {/* Google user preview card */}
          <View style={[s.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {user?.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={s.avatar} />
            ) : (
              <View style={[s.avatarPlaceholder, { backgroundColor: colors.accent + '33' }]}>
                <Text style={[s.avatarInitial, { color: colors.accent }]}>
                  {(user?.name ?? 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View style={s.previewInfo}>
              <Text style={[s.previewName, { color: colors.text }]}>
                {user?.name ?? '—'}
              </Text>
              <Text style={[s.previewEmail, { color: colors.textMuted }]}>
                {user?.email ?? '—'}
              </Text>
              <View style={[s.providerBadge, { backgroundColor: colors.accent + '22' }]}>
                <Text style={[s.providerBadgeText, { color: colors.accent }]}>via Google</Text>
              </View>
            </View>
          </View>

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

          <TouchableOpacity
            style={s.cancelRow}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={[s.cancelText, { color: colors.textMuted }]}>
              Use a different account
            </Text>
          </TouchableOpacity>
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
    headerRow: { alignItems: 'flex-start', marginBottom: 20 },
    logoDot: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
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
      marginBottom: 24,
      lineHeight: 20,
    },
    previewCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 28,
      gap: 14,
    },
    avatar: { width: 56, height: 56, borderRadius: 28 },
    avatarPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitial: { fontSize: 22, fontFamily: 'Nunito_800ExtraBold' },
    previewInfo: { flex: 1, gap: 2 },
    previewName: { fontSize: 16, fontFamily: 'Nunito_700Bold' },
    previewEmail: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
    providerBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginTop: 4,
    },
    providerBadgeText: { fontSize: 11, fontFamily: 'Nunito_600SemiBold' },
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
    cancelRow: { alignItems: 'center', marginTop: 20 },
    cancelText: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  })
