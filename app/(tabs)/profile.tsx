import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTheme } from '../../components/ThemeContext'
import { useAuthStore } from '../../lib/store/auth'

const KYC_DOCS = [
  { label: 'Aadhaar Card', number: 'XXXX XXXX 4521', status: 'verified', icon: '🪪', required: true },
  { label: 'PAN Card', number: 'ABCDE1234F', status: 'verified', icon: '💳', required: true },
  { label: 'Driving Licence', number: 'MH0120230012345', status: 'pending', icon: '🪪', required: true },
  { label: 'RC Book', number: 'MH-04-XY-1234', status: 'not_uploaded', icon: '📄', required: true },
  { label: 'Police Clearance', number: '—', status: 'not_uploaded', icon: '📋', required: false },
]

const VEHICLE_DOCS = [
  { label: 'Registration Certificate (RC)', expiry: '31 Mar 2026', status: 'valid' },
  { label: 'Fitness Certificate', expiry: '15 Jun 2025', status: 'valid' },
  { label: 'Insurance Policy', expiry: '10 Aug 2025', status: 'valid' },
  { label: 'Pollution Certificate (PUC)', expiry: '05 Apr 2025', status: 'expiring' },
  { label: 'Permit (National)', expiry: '20 Dec 2024', status: 'expired' },
]

export default function DriverScreen() {
  const { colors, mode, toggleTheme } = useTheme()
  const router = useRouter()
  const { logout } = useAuthStore()
  const [notif, setNotif] = useState(true)
  const [locShare, setLocShare] = useState(true)

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  const docStatusColor = (s: string) =>
    s === 'verified' || s === 'valid' ? colors.success
    : s === 'pending' || s === 'expiring' ? colors.warning
    : colors.error

  const docStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      verified: 'Verified',
      pending: 'Under Review',
      not_uploaded: 'Upload Required',
      valid: 'Valid',
      expiring: 'Expiring Soon',
      expired: 'Expired',
    }
    return map[s] || s
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Driver Profile</Text>
          <TouchableOpacity
            style={[styles.editBtn, { borderColor: colors.border }]}
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon.')}
          >
            <Text style={[styles.editBtnText, { color: colors.textMuted }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Driver ID Card ── */}
        <View style={[styles.driverCard, { backgroundColor: colors.accent }]}>
          {/* Card header */}
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardBrandSmall}>BharatTruck</Text>
              <Text style={styles.cardType}>Driver Identification Card</Text>
            </View>
            <View style={[styles.verifiedChip]}>
              <Text style={styles.verifiedChipText}>✓ KYC Verified</Text>
            </View>
          </View>

          {/* Avatar + identity */}
          <View style={styles.cardBody}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.avatarInitials}>RK</Text>
              </View>
              <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
            </View>
            <View style={styles.cardIdentity}>
              <Text style={styles.cardName}>Ramesh Kumar</Text>
              <Text style={styles.cardLicense}>DL No: MH0120230012345</Text>
              <Text style={styles.cardOperator}>Fleet: BharatTruck Logistics Pvt. Ltd.</Text>
            </View>
          </View>

          {/* Card footer */}
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardFooterLabel}>Driver ID</Text>
              <Text style={styles.cardFooterVal}>BTD-2024-00312</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardFooterLabel}>Joined</Text>
              <Text style={styles.cardFooterVal}>Jan 2024</Text>
            </View>
          </View>

          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {[
            { icon: '🚛', value: '47', label: 'Total Trips' },
            { icon: '⭐', value: '4.8', label: 'Rating' },
            { icon: '📍', value: '68,400 km', label: 'Distance' },
          ].map((s, i) => (
            <View key={i} style={[styles.statBox, i < 2 && { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={[styles.statVal, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLbl, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Vehicle Information ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Information</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {[
            { label: 'Vehicle Type', value: '22-Wheeler' },
            { label: 'Registration No.', value: 'MH-04-XY-1234' },
            { label: 'Make & Model', value: 'Tata Prima 4940.S' },
            { label: 'Load Capacity', value: '25 Metric Ton' },
            { label: 'Year of Manufacture', value: '2021' },
            { label: 'Fuel Type', value: 'Diesel' },
          ].map((row, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── KYC Documents ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>KYC Documents</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {KYC_DOCS.map((doc, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Alert.alert(doc.label, `Number: ${doc.number}\nStatus: ${docStatusLabel(doc.status)}`)}
              style={[styles.docRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 22, marginRight: 12 }}>{doc.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.docLabel, { color: colors.text }]}>{doc.label}</Text>
                  {doc.required && (
                    <View style={[styles.requiredBadge, { backgroundColor: colors.border }]}>
                      <Text style={[styles.requiredText, { color: colors.textMuted }]}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.docNumber, { color: colors.textMuted }]}>{doc.number}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: docStatusColor(doc.status) + '18' }]}>
                <Text style={[styles.statusText, { color: docStatusColor(doc.status) }]}>
                  {docStatusLabel(doc.status)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Vehicle Documents ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Documents</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {VEHICLE_DOCS.map((doc, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Alert.alert(doc.label, `Expiry: ${doc.expiry}\nStatus: ${docStatusLabel(doc.status)}`)}
              style={[styles.docRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 22, marginRight: 12 }}>📄</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.docLabel, { color: colors.text }]}>{doc.label}</Text>
                <Text style={[styles.docNumber, { color: colors.textMuted }]}>Expires: {doc.expiry}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: docStatusColor(doc.status) + '18' }]}>
                <Text style={[styles.statusText, { color: docStatusColor(doc.status) }]}>
                  {docStatusLabel(doc.status)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Operator note */}
        <View style={[styles.operatorNote, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <Text style={{ fontSize: 18, marginRight: 10 }}>🏢</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.operatorNoteTitle, { color: colors.text }]}>Fleet Operator Access</Text>
            <Text style={[styles.operatorNoteText, { color: colors.textMuted }]}>
              Your operator can view your trip status, live location, and fuel logs. KYC documents are private and visible only to you and BharatTruck compliance team.
            </Text>
          </View>
        </View>

        {/* ── Settings ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>🔔</Text>
            <Text style={[styles.settingLabel, { color: colors.text, flex: 1 }]}>Push Notifications</Text>
            <Switch
              value={notif}
              onValueChange={setNotif}
              trackColor={{ false: colors.border, true: colors.accent + '88' }}
              thumbColor={notif ? colors.accent : colors.textMuted}
            />
          </View>
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>📍</Text>
            <Text style={[styles.settingLabel, { color: colors.text, flex: 1 }]}>Share Location with Operator</Text>
            <Switch
              value={locShare}
              onValueChange={setLocShare}
              trackColor={{ false: colors.border, true: colors.accent + '88' }}
              thumbColor={locShare ? colors.accent : colors.textMuted}
            />
          </View>
          <TouchableOpacity
            style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: colors.border }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>{mode === 'dark' ? '☀️' : '🌙'}</Text>
            <Text style={[styles.settingLabel, { color: colors.text, flex: 1 }]}>
              {mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: colors.border }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>🚪</Text>
            <Text style={[styles.settingLabel, { color: colors.error, flex: 1 }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: colors.textMuted }]}>
          BharatTruck Driver App · v1.0.0
        </Text>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Nunito_800ExtraBold' },
  editBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  editBtnText: { fontSize: 14, fontFamily: 'Nunito_600SemiBold' },

  // Driver ID Card
  driverCard: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  cardBrandSmall: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Nunito_600SemiBold', letterSpacing: 0.5 },
  cardType: { color: '#FFF', fontSize: 13, fontFamily: 'Nunito_700Bold', marginTop: 1 },
  verifiedChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedChipText: { color: '#FFF', fontSize: 11, fontFamily: 'Nunito_700Bold' },
  cardBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarWrap: { position: 'relative', marginRight: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarInitials: { color: '#FFF', fontSize: 24, fontFamily: 'Nunito_800ExtraBold' },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  cardIdentity: { flex: 1 },
  cardName: { color: '#FFF', fontSize: 22, fontFamily: 'Nunito_800ExtraBold', marginBottom: 3 },
  cardLicense: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontFamily: 'Nunito_600SemiBold', marginBottom: 2 },
  cardOperator: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontFamily: 'Nunito_400Regular' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
  cardFooterLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Nunito_400Regular', marginBottom: 2 },
  cardFooterVal: { color: '#FFF', fontSize: 13, fontFamily: 'Nunito_700Bold' },
  decorCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    left: 20,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statVal: { fontSize: 16, fontFamily: 'Nunito_800ExtraBold' },
  statLbl: { fontSize: 11, fontFamily: 'Nunito_400Regular', marginTop: 2 },

  sectionTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold', paddingHorizontal: 20, marginBottom: 8 },
  infoCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, marginBottom: 22, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  infoLabel: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Nunito_700Bold' },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  docLabel: { fontSize: 14, fontFamily: 'Nunito_600SemiBold' },
  docNumber: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  requiredBadge: { borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  requiredText: { fontSize: 10, fontFamily: 'Nunito_600SemiBold' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
  statusText: { fontSize: 11, fontFamily: 'Nunito_700Bold' },
  operatorNote: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 22,
  },
  operatorNoteTitle: { fontSize: 14, fontFamily: 'Nunito_700Bold', marginBottom: 4 },
  operatorNoteText: { fontSize: 12, fontFamily: 'Nunito_400Regular', lineHeight: 18 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingLabel: { fontSize: 15, fontFamily: 'Nunito_600SemiBold' },
  version: { textAlign: 'center', fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 4 },
})
