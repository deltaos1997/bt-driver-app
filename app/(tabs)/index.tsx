import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../components/ThemeContext'

interface Trip {
  id: string
  fromCity: string
  fromState: string
  toCity: string
  toState: string
  distance: string
  cargo: string
  weight: string
  rate: string
  vehicleType: string
  shipper: string
  postedAgo: string
  isUrgent?: boolean
}

const TRIPS: Trip[] = [
  {
    id: '1',
    fromCity: 'Mumbai',
    fromState: 'Maharashtra',
    toCity: 'Delhi',
    toState: 'Delhi NCR',
    distance: '1,400 km',
    cargo: 'Steel Coils',
    weight: '12 Ton',
    rate: '45,000',
    vehicleType: '22-Wheeler',
    shipper: 'Tata Steel Ltd.',
    postedAgo: '5 min ago',
    isUrgent: true,
  },
  {
    id: '2',
    fromCity: 'Pune',
    fromState: 'Maharashtra',
    toCity: 'Ahmedabad',
    toState: 'Gujarat',
    distance: '660 km',
    cargo: 'Automobile Parts',
    weight: '8 Ton',
    rate: '22,000',
    vehicleType: '10-Wheeler',
    shipper: 'Bajaj Auto Ltd.',
    postedAgo: '12 min ago',
  },
  {
    id: '3',
    fromCity: 'Chennai',
    fromState: 'Tamil Nadu',
    toCity: 'Hyderabad',
    toState: 'Telangana',
    distance: '520 km',
    cargo: 'Cement Bags',
    weight: '5 Ton',
    rate: '14,500',
    vehicleType: 'Mini Truck',
    shipper: 'UltraTech Cement',
    postedAgo: '25 min ago',
  },
  {
    id: '4',
    fromCity: 'Kolkata',
    fromState: 'West Bengal',
    toCity: 'Patna',
    toState: 'Bihar',
    distance: '580 km',
    cargo: 'FMCG Goods',
    weight: '15 Ton',
    rate: '18,000',
    vehicleType: '22-Wheeler',
    shipper: 'ITC Limited',
    postedAgo: '1 hr ago',
  },
  {
    id: '5',
    fromCity: 'Jaipur',
    fromState: 'Rajasthan',
    toCity: 'Lucknow',
    toState: 'Uttar Pradesh',
    distance: '480 km',
    cargo: 'Textile Bales',
    weight: '6 Ton',
    rate: '13,200',
    vehicleType: '10-Wheeler',
    shipper: 'Raymond Ltd.',
    postedAgo: '2 hr ago',
  },
  {
    id: '6',
    fromCity: 'Bangalore',
    fromState: 'Karnataka',
    toCity: 'Coimbatore',
    toState: 'Tamil Nadu',
    distance: '340 km',
    cargo: 'Electronics',
    weight: '3 Ton',
    rate: '8,800',
    vehicleType: 'Mini Truck',
    shipper: 'Samsung India',
    postedAgo: '3 hr ago',
  },
]

const FILTERS = ['All', 'Heavy', 'Medium', 'Light']

export default function TripsScreen() {
  const { colors } = useTheme()
  const [online, setOnline] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const handleAccept = (trip: Trip) => {
    Alert.alert(
      `Accept Trip`,
      `${trip.fromCity} → ${trip.toCity}\nCargo: ${trip.cargo}\nRate: ₹${trip.rate}\n\nConfirm this trip?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => Alert.alert('Trip Accepted', 'The shipper has been notified. Check your Active Trip tab.') },
      ]
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>Good morning</Text>
          <Text style={[styles.name, { color: colors.text }]}>Ramesh Kumar</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.statusPill,
            {
              backgroundColor: online ? colors.success + '18' : colors.surfaceElevated,
              borderColor: online ? colors.success : colors.border,
            },
          ]}
          onPress={() => setOnline(!online)}
          activeOpacity={0.8}
        >
          <View style={[styles.statusDot, { backgroundColor: online ? colors.success : colors.textMuted }]} />
          <Text style={[styles.statusText, { color: online ? colors.success : colors.textMuted }]}>
            {online ? 'Available' : 'Offline'}
          </Text>
          <Switch
            value={online}
            onValueChange={setOnline}
            trackColor={{ false: colors.border, true: colors.success + '55' }}
            thumbColor={online ? colors.success : colors.textMuted}
            style={{ transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Offline banner */}
      {!online && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
          <Text style={{ fontSize: 16 }}>⚠️</Text>
          <Text style={[styles.offlineText, { color: colors.warning }]}>
            You are offline — new trips will not appear
          </Text>
        </View>
      )}

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        style={{ flexGrow: 0 }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterChip,
              {
                backgroundColor: activeFilter === f ? colors.accent : colors.surfaceElevated,
                borderColor: activeFilter === f ? colors.accent : colors.border,
              },
            ]}
          >
            <Text style={[styles.filterText, { color: activeFilter === f ? '#FFF' : colors.textMuted }]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={[styles.countText, { color: colors.textMuted }]}>
          {TRIPS.length} trips available near you
        </Text>
      </View>

      {/* Trip cards */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {TRIPS.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            activeOpacity={0.88}
            onPress={() => handleAccept(trip)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            {trip.isUrgent && (
              <View style={[styles.urgentBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}

            {/* Route */}
            <View style={styles.routeRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.city, { color: colors.text }]}>{trip.fromCity}</Text>
                <Text style={[styles.state, { color: colors.textMuted }]}>{trip.fromState}</Text>
              </View>
              <View style={styles.routeMid}>
                <Text style={[styles.arrow, { color: colors.accent }]}>→</Text>
                <Text style={[styles.distance, { color: colors.textMuted }]}>{trip.distance}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[styles.city, { color: colors.text }]}>{trip.toCity}</Text>
                <Text style={[styles.state, { color: colors.textMuted }]}>{trip.toState}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Cargo row */}
            <View style={styles.cargoRow}>
              <View style={[styles.cargoBadge, { backgroundColor: colors.accent + '18' }]}>
                <Text style={[styles.cargoText, { color: colors.accent }]}>📦 {trip.cargo}</Text>
              </View>
              <Text style={[styles.shipper, { color: colors.textMuted }]}>{trip.shipper}</Text>
            </View>

            {/* Details + rate */}
            <View style={styles.detailsRow}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Vehicle</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{trip.vehicleType}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Weight</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{trip.weight}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Posted</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{trip.postedAgo}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.rate, { color: colors.accent }]}>₹{trip.rate}</Text>
                <Text style={[styles.rateLabel, { color: colors.textMuted }]}>freight rate</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  greeting: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  name: { fontSize: 21, fontFamily: 'Nunito_800ExtraBold' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontFamily: 'Nunito_700Bold' },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 8,
  },
  offlineText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', flex: 1 },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  countText: { fontSize: 13, fontFamily: 'Nunito_400Regular' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  urgentText: { color: '#000', fontSize: 10, fontFamily: 'Nunito_700Bold', letterSpacing: 0.5 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  city: { fontSize: 19, fontFamily: 'Nunito_700Bold' },
  state: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 1 },
  routeMid: { alignItems: 'center', paddingHorizontal: 8 },
  arrow: { fontSize: 22 },
  distance: { fontSize: 11, fontFamily: 'Nunito_600SemiBold', marginTop: 1 },
  divider: { height: 1, marginBottom: 12 },
  cargoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cargoBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cargoText: { fontSize: 13, fontFamily: 'Nunito_700Bold' },
  shipper: { fontSize: 12, fontFamily: 'Nunito_400Regular' },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  detailLabel: { fontSize: 11, fontFamily: 'Nunito_400Regular', marginBottom: 2 },
  detailValue: { fontSize: 13, fontFamily: 'Nunito_700Bold' },
  rate: { fontSize: 24, fontFamily: 'Nunito_800ExtraBold' },
  rateLabel: { fontSize: 11, fontFamily: 'Nunito_400Regular' },
})
