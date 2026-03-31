import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../components/ThemeContext'

type CheckpointStatus = 'completed' | 'active' | 'pending'

interface Checkpoint {
  id: string
  label: string
  sublabel: string
  address: string
  status: CheckpointStatus
  time?: string
  action?: string
}

const INITIAL_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'loading',
    label: 'Loading Point',
    sublabel: 'Collect cargo from shipper',
    address: 'Dharavi Naka, Near NH-48, Mumbai — 400017',
    status: 'completed',
    time: '08:30 AM',
    action: 'Loaded',
  },
  {
    id: 'checkpoint1',
    label: 'Toll Checkpoint',
    sublabel: 'Surat Bypass — NH-48',
    address: 'NHAI Toll Plaza, Surat — 395009',
    status: 'active',
    action: 'Mark Crossed',
  },
  {
    id: 'rest',
    label: 'Rest Stop',
    sublabel: 'Mandatory driver rest — 8 hr rule',
    address: 'Dhaba & Parking Area, Vadodara — 390023',
    status: 'pending',
    action: 'Mark Arrived',
  },
  {
    id: 'delivery',
    label: 'Delivery Point',
    sublabel: 'Deliver cargo to consignee',
    address: 'Azadpur Mandi, Near Ring Road, Delhi — 110033',
    status: 'pending',
    action: 'Confirm Delivery',
  },
]

export default function ActiveTripScreen() {
  const { colors } = useTheme()
  const [checkpoints, setCheckpoints] = useState(INITIAL_CHECKPOINTS)
  const [showDeliveryConfirm, setShowDeliveryConfirm] = useState(false)

  const activeIndex = checkpoints.findIndex((c) => c.status === 'active')

  const handleAdvance = (id: string) => {
    if (id === 'delivery') {
      setShowDeliveryConfirm(true)
      return
    }
    setCheckpoints((prev) =>
      prev.map((c, i) => {
        const idx = prev.findIndex((x) => x.id === id)
        if (c.id === id) return { ...c, status: 'completed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        if (i === idx + 1) return { ...c, status: 'active' }
        return c
      })
    )
  }

  const handleSOS = () => {
    Alert.alert(
      'Emergency — SOS',
      'Do you need immediate assistance?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Emergency', style: 'destructive', onPress: () => Alert.alert('Connecting...', 'Emergency helpline: 1800-XXX-XXXX') },
      ]
    )
  }

  const handlePhotoUpload = (checkpoint: string) => {
    Alert.alert('Upload Photo', `Attach a photo for: ${checkpoint}\n\n(Camera will open here)`)
  }

  const dotColor = (status: CheckpointStatus) => {
    if (status === 'completed') return colors.success
    if (status === 'active') return colors.accent
    return colors.border
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Active Trip</Text>
        <TouchableOpacity onPress={handleSOS} style={[styles.sosBtn, { backgroundColor: colors.error }]}>
          <Text style={styles.sosText}>🆘  SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Cargo Details Card */}
        <View style={[styles.cargoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Cargo Details</Text>
            <View style={[styles.tripIdBadge, { backgroundColor: colors.accent + '18' }]}>
              <Text style={[styles.tripId, { color: colors.accent }]}>TRP-2024-0312</Text>
            </View>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />

          <View style={styles.cargoGrid}>
            {[
              { label: 'Cargo Type', value: 'Steel Coils' },
              { label: 'Weight', value: '12 Metric Ton' },
              { label: 'Shipper', value: 'Tata Steel Ltd.' },
              { label: 'Consignee', value: 'ArcelorMittal India' },
              { label: 'PO Reference', value: 'PO-TS-20240312' },
              { label: 'Vehicle', value: '22-Wheeler' },
            ].map((item, i) => (
              <View key={i} style={styles.cargoItem}>
                <Text style={[styles.cargoLabel, { color: colors.textMuted }]}>{item.label}</Text>
                <Text style={[styles.cargoValue, { color: colors.text }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.instructionBox, { backgroundColor: colors.warning + '12', borderColor: colors.warning + '40' }]}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.instrLabel, { color: colors.warning }]}>Special Instructions</Text>
              <Text style={[styles.instrText, { color: colors.textMuted }]}>
                Handle with care. Do not stack. Keep dry. Delivery between 9 AM – 5 PM only.
              </Text>
            </View>
          </View>
        </View>

        {/* Route Summary */}
        <View style={[styles.routeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.routeRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.routeLabel, { color: colors.textMuted }]}>FROM</Text>
              <Text style={[styles.routeCity, { color: colors.text }]}>Mumbai</Text>
              <Text style={[styles.routeState, { color: colors.textMuted }]}>Maharashtra</Text>
            </View>
            <View style={styles.routeMid}>
              <View style={[styles.routeLine, { backgroundColor: colors.accent }]} />
              <Text style={[styles.routeTruck]}>🚛</Text>
              <View style={[styles.routeLineFade, { backgroundColor: colors.border }]} />
              <Text style={[styles.routeDist, { color: colors.textMuted }]}>1,400 km</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={[styles.routeLabel, { color: colors.textMuted }]}>TO</Text>
              <Text style={[styles.routeCity, { color: colors.text }]}>Delhi</Text>
              <Text style={[styles.routeState, { color: colors.textMuted }]}>Delhi NCR</Text>
            </View>
          </View>
          <View style={[styles.dividerLine, { backgroundColor: colors.border, marginTop: 12 }]} />
          <View style={styles.routeStats}>
            {[
              { label: 'Freight Rate', value: '₹45,000', highlight: true },
              { label: 'Est. Duration', value: '~28 hrs' },
              { label: 'Departure', value: '08:00 AM' },
            ].map((s, i) => (
              <View key={i} style={styles.routeStat}>
                <Text style={[styles.routeStatVal, { color: s.highlight ? colors.accent : colors.text }]}>{s.value}</Text>
                <Text style={[styles.routeStatLbl, { color: colors.textMuted }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Checkpoints */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Checkpoints</Text>

        <View style={[styles.timelineCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {checkpoints.map((cp, index) => (
            <View key={cp.id}>
              <View style={styles.checkpointRow}>
                {/* Timeline dot + line */}
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: cp.status === 'completed' ? colors.success : cp.status === 'active' ? colors.accent : colors.surfaceElevated,
                        borderColor: dotColor(cp.status),
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 14 }}>
                      {cp.status === 'completed' ? '✓' : cp.status === 'active' ? '●' : '○'}
                    </Text>
                  </View>
                  {index < checkpoints.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: cp.status === 'completed' ? colors.success : colors.border }]} />
                  )}
                </View>

                {/* Content */}
                <View style={styles.cpContent}>
                  <View style={styles.cpHeader}>
                    <Text style={[styles.cpLabel, { color: cp.status === 'pending' ? colors.textMuted : colors.text }]}>
                      {cp.label}
                    </Text>
                    {cp.status === 'active' && (
                      <View style={[styles.nowBadge, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}>
                        <Text style={[styles.nowText, { color: colors.accent }]}>NOW</Text>
                      </View>
                    )}
                    {cp.status === 'completed' && cp.time && (
                      <Text style={[styles.cpTime, { color: colors.success }]}>{cp.time}</Text>
                    )}
                  </View>
                  <Text style={[styles.cpSublabel, { color: colors.textMuted }]}>{cp.sublabel}</Text>
                  <Text style={[styles.cpAddress, { color: colors.textMuted }]}>{cp.address}</Text>

                  {/* Action buttons for active checkpoint */}
                  {cp.status === 'active' && (
                    <View style={styles.cpActions}>
                      {/* Photo button */}
                      <TouchableOpacity
                        onPress={() => handlePhotoUpload(cp.label)}
                        style={[styles.photoBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
                      >
                        <Text style={{ fontSize: 18 }}>📷</Text>
                        <Text style={[styles.photoBtnText, { color: colors.text }]}>Photo</Text>
                      </TouchableOpacity>

                      {/* Advance button */}
                      <TouchableOpacity
                        onPress={() => handleAdvance(cp.id)}
                        style={[styles.advanceBtn, { backgroundColor: colors.accent, flex: 1 }]}
                      >
                        <Text style={styles.advanceBtnText}>{cp.action}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Completed: show photo proof */}
                  {cp.status === 'completed' && (
                    <TouchableOpacity
                      onPress={() => handlePhotoUpload(cp.label)}
                      style={[styles.photoProofRow, { borderColor: colors.border }]}
                    >
                      <Text style={{ fontSize: 16, marginRight: 6 }}>📎</Text>
                      <Text style={[styles.photoProofText, { color: colors.textMuted }]}>
                        View / attach photo proof
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Confirm Modal-style card */}
        {showDeliveryConfirm && (
          <View style={[styles.deliveryCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
            <Text style={[styles.deliveryTitle, { color: colors.text }]}>Confirm Delivery</Text>
            <Text style={[styles.deliverySub, { color: colors.textMuted }]}>
              Enter the OTP provided by the consignee to confirm delivery.
            </Text>
            <View style={[styles.otpPlaceholder, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Text style={[styles.otpHint, { color: colors.textMuted }]}>— Enter 4-digit OTP from consignee —</Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePhotoUpload('Delivery Confirmation')}
              style={[styles.attachPhotoBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 20, marginRight: 8 }}>📷</Text>
              <Text style={[styles.attachPhotoText, { color: colors.text }]}>Attach Delivery Photo</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => setShowDeliveryConfirm(false)}
                style={[styles.cancelBtn, { borderColor: colors.border, flex: 1 }]}
              >
                <Text style={[{ color: colors.textMuted, fontFamily: 'Nunito_600SemiBold', fontSize: 15 }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDeliveryConfirm(false)
                  Alert.alert('Delivery Complete', '✅ Trip marked as delivered.\n₹45,000 will be credited within 24 hrs.')
                }}
                style={[styles.confirmBtn, { backgroundColor: colors.success, flex: 1 }]}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contact Shipper */}
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
          onPress={() => Alert.alert('Contact Shipper', 'Rajesh Agarwal\n+91 98765-43210\nTata Steel Ltd.')}
        >
          <Text style={{ fontSize: 22, marginRight: 12 }}>📞</Text>
          <View>
            <Text style={[styles.contactLabel, { color: colors.text }]}>Contact Shipper</Text>
            <Text style={[styles.contactSub, { color: colors.textMuted }]}>Rajesh Agarwal · Tata Steel Ltd.</Text>
          </View>
          <Text style={[{ marginLeft: 'auto', color: colors.textMuted, fontSize: 18 }]}>›</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  screenTitle: { fontSize: 20, fontFamily: 'Nunito_800ExtraBold' },
  sosBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  sosText: { color: '#FFF', fontSize: 14, fontFamily: 'Nunito_700Bold' },
  cargoCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 17, fontFamily: 'Nunito_700Bold' },
  tripIdBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tripId: { fontSize: 12, fontFamily: 'Nunito_700Bold' },
  dividerLine: { height: 1, marginBottom: 14 },
  cargoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 14 },
  cargoItem: { width: '46%' },
  cargoLabel: { fontSize: 11, fontFamily: 'Nunito_400Regular', marginBottom: 2 },
  cargoValue: { fontSize: 14, fontFamily: 'Nunito_700Bold' },
  instructionBox: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    alignItems: 'flex-start',
  },
  instrLabel: { fontSize: 12, fontFamily: 'Nunito_700Bold', marginBottom: 3 },
  instrText: { fontSize: 12, fontFamily: 'Nunito_400Regular', lineHeight: 18 },
  routeCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  routeLabel: { fontSize: 10, fontFamily: 'Nunito_700Bold', letterSpacing: 1, marginBottom: 3 },
  routeCity: { fontSize: 20, fontFamily: 'Nunito_800ExtraBold' },
  routeState: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  routeMid: { flex: 1, alignItems: 'center', paddingHorizontal: 8, position: 'relative' },
  routeLine: { height: 3, width: '42%', borderRadius: 2, position: 'absolute', left: 8 },
  routeLineFade: { height: 3, width: '42%', borderRadius: 2, position: 'absolute', right: 8 },
  routeTruck: { fontSize: 22 },
  routeDist: { fontSize: 11, fontFamily: 'Nunito_600SemiBold', marginTop: 4 },
  routeStats: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
  routeStat: { alignItems: 'center' },
  routeStatVal: { fontSize: 16, fontFamily: 'Nunito_700Bold' },
  routeStatLbl: { fontSize: 11, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontFamily: 'Nunito_700Bold', marginBottom: 12 },
  timelineCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  checkpointRow: { flexDirection: 'row', marginBottom: 8 },
  timelineLeft: { alignItems: 'center', marginRight: 14, width: 40 },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: { width: 2, flex: 1, minHeight: 20, marginTop: 4, marginBottom: 4 },
  cpContent: { flex: 1, paddingTop: 8 },
  cpHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  cpLabel: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
  nowBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2 },
  nowText: { fontSize: 10, fontFamily: 'Nunito_700Bold' },
  cpTime: { fontSize: 12, fontFamily: 'Nunito_600SemiBold', marginLeft: 'auto' },
  cpSublabel: { fontSize: 12, fontFamily: 'Nunito_600SemiBold', marginBottom: 2 },
  cpAddress: { fontSize: 12, fontFamily: 'Nunito_400Regular', lineHeight: 17, marginBottom: 10 },
  cpActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  photoBtnText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  advanceBtn: { borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  advanceBtnText: { color: '#FFF', fontSize: 14, fontFamily: 'Nunito_700Bold' },
  photoProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
    marginBottom: 16,
  },
  photoProofText: { fontSize: 12, fontFamily: 'Nunito_400Regular' },
  deliveryCard: { borderRadius: 16, borderWidth: 2, padding: 20, marginBottom: 16 },
  deliveryTitle: { fontSize: 18, fontFamily: 'Nunito_800ExtraBold', marginBottom: 6 },
  deliverySub: { fontSize: 13, fontFamily: 'Nunito_400Regular', marginBottom: 14 },
  otpPlaceholder: { borderRadius: 12, borderWidth: 1, height: 52, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  otpHint: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  attachPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  attachPhotoText: { fontSize: 14, fontFamily: 'Nunito_600SemiBold' },
  cancelBtn: { borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  confirmBtn: { borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  contactLabel: { fontSize: 15, fontFamily: 'Nunito_700Bold' },
  contactSub: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 2 },
})
