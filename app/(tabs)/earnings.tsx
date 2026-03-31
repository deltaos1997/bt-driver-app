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

interface FuelEntry {
  id: string
  date: string
  location: string
  liters: string
  amount: string
  odometer: string
  tripRoute: string
}

const FUEL_LOG: FuelEntry[] = [
  {
    id: '1',
    date: 'Today, 10:15 AM',
    location: 'HP Petrol Pump, Surat Bypass',
    liters: '180 L',
    amount: '17,100',
    odometer: '1,24,580 km',
    tripRoute: 'Mumbai → Delhi',
  },
  {
    id: '2',
    date: 'Today, 06:00 AM',
    location: 'Indian Oil, Mumbai Highway',
    liters: '120 L',
    amount: '11,400',
    odometer: '1,23,900 km',
    tripRoute: 'Mumbai → Delhi',
  },
  {
    id: '3',
    date: 'Yesterday',
    location: 'BPCL, Pune Expressway',
    liters: '90 L',
    amount: '8,550',
    odometer: '1,23,200 km',
    tripRoute: 'Pune → Ahmedabad',
  },
  {
    id: '4',
    date: '29 Mar',
    location: 'HP Petrol Pump, Vadodara',
    liters: '150 L',
    amount: '14,250',
    odometer: '1,22,400 km',
    tripRoute: 'Pune → Ahmedabad',
  },
  {
    id: '5',
    date: '27 Mar',
    location: 'Indian Oil, Ahmedabad',
    liters: '60 L',
    amount: '5,700',
    odometer: '1,21,800 km',
    tripRoute: 'Pune → Ahmedabad',
  },
]

const PERIODS = ['This Week', 'This Month', '3 Months']

export default function FuelScreen() {
  const { colors } = useTheme()
  const [activePeriod, setActivePeriod] = useState('This Month')

  const totalSpend = '57,000'
  const totalLiters = '600 L'
  const avgKmPerLiter = '4.2'
  const tripsThisMonth = 3

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Fuel Log</Text>
            <Text style={[styles.headerSub, { color: colors.textMuted }]}>Track fuel expenses per trip</Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Log Fill-up', 'Fuel fill-up form will open here.')}
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.addBtnText}>+ Log Fill-up</Text>
          </TouchableOpacity>
        </View>

        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setActivePeriod(p)}
              style={[
                styles.periodChip,
                {
                  backgroundColor: activePeriod === p ? colors.accent : colors.surfaceElevated,
                  borderColor: activePeriod === p ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[styles.periodText, { color: activePeriod === p ? '#FFF' : colors.textMuted }]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.accent }]}>
          <Text style={styles.summaryTitle}>Total Fuel Spend</Text>
          <Text style={styles.summaryAmount}>₹{totalSpend}</Text>

          <View style={[styles.summaryDivider]} />

          <View style={styles.statsRow}>
            {[
              { label: 'Total Litres', value: totalLiters },
              { label: 'Avg km/litre', value: avgKmPerLiter },
              { label: 'Trips', value: String(tripsThisMonth) },
            ].map((s, i) => (
              <View key={i} style={[styles.statItem, i < 2 && styles.statBorder]}>
                <Text style={styles.statVal}>{s.value}</Text>
                <Text style={styles.statLbl}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Per-trip cost breakdown */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cost by Trip</Text>
        </View>

        {[
          { route: 'Mumbai → Delhi', cost: '28,500', liters: '300 L', trips: 1 },
          { route: 'Pune → Ahmedabad', cost: '28,500', liters: '300 L', trips: 2 },
        ].map((t, i) => (
          <View key={i} style={[styles.tripCostCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.tripCostLeft}>
              <Text style={{ fontSize: 22 }}>🚛</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tripRoute, { color: colors.text }]}>{t.route}</Text>
              <Text style={[styles.tripMeta, { color: colors.textMuted }]}>{t.liters} · {t.trips} fill-up{t.trips > 1 ? 's' : ''}</Text>
            </View>
            <Text style={[styles.tripCost, { color: colors.text }]}>₹{t.cost}</Text>
          </View>
        ))}

        {/* Fill-up history */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Fill-up History</Text>
        </View>

        {FUEL_LOG.map((entry) => (
          <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.fuelIcon, { backgroundColor: colors.accent + '18' }]}>
              <Text style={{ fontSize: 20 }}>⛽</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.pumpName, { color: colors.text }]}>{entry.location}</Text>
              <Text style={[styles.entryMeta, { color: colors.textMuted }]}>
                {entry.date} · {entry.tripRoute}
              </Text>
              <View style={styles.entryDetails}>
                <View style={[styles.detailPill, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.detailPillText, { color: colors.textMuted }]}>{entry.liters}</Text>
                </View>
                <View style={[styles.detailPill, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.detailPillText, { color: colors.textMuted }]}>ODO: {entry.odometer}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.entryAmount, { color: colors.text }]}>₹{entry.amount}</Text>
          </View>
        ))}

        {/* Operator note */}
        <View style={[styles.noteCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <Text style={{ fontSize: 18, marginRight: 10 }}>ℹ️</Text>
          <Text style={[styles.noteText, { color: colors.textMuted }]}>
            Your fuel logs are visible to your fleet operator for reimbursement and monitoring.
          </Text>
        </View>

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
  headerSub: { fontSize: 13, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  addBtn: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 },
  addBtnText: { color: '#FFF', fontSize: 13, fontFamily: 'Nunito_700Bold' },
  periodRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  periodChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  periodText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  summaryCard: { marginHorizontal: 20, borderRadius: 20, padding: 22, marginBottom: 20 },
  summaryTitle: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Nunito_600SemiBold', marginBottom: 4 },
  summaryAmount: { color: '#FFF', fontSize: 40, fontFamily: 'Nunito_800ExtraBold', marginBottom: 16 },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  statsRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' },
  statVal: { color: '#FFF', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  statLbl: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  sectionRow: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontFamily: 'Nunito_700Bold' },
  tripCostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  tripCostLeft: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripRoute: { fontSize: 14, fontFamily: 'Nunito_700Bold' },
  tripMeta: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 2 },
  tripCost: { fontSize: 16, fontFamily: 'Nunito_800ExtraBold' },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  fuelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pumpName: { fontSize: 13, fontFamily: 'Nunito_700Bold' },
  entryMeta: { fontSize: 11, fontFamily: 'Nunito_400Regular', marginTop: 2, marginBottom: 6 },
  entryDetails: { flexDirection: 'row', gap: 6 },
  detailPill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  detailPillText: { fontSize: 11, fontFamily: 'Nunito_600SemiBold' },
  entryAmount: { fontSize: 15, fontFamily: 'Nunito_800ExtraBold', marginLeft: 8 },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  noteText: { fontSize: 12, fontFamily: 'Nunito_400Regular', lineHeight: 18, flex: 1 },
})
