export type UserRole = 'fleet_operator' | 'individual_driver'

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type DriverStatus = 'active' | 'inactive' | 'on_trip' | 'off_duty'

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: UserRole
  companyName?: string       // Fleet operators only
  licenseNumber?: string     // Individual drivers
  vehicleNumber?: string     // Individual drivers
  vehicleType?: string
  profilePhoto?: string
  rating?: number
  totalTrips?: number
  joinedDate: string
  token: string
}

export interface Booking {
  id: string
  bookingNumber: string
  status: BookingStatus
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
  cargo: string
  weight: string
  distance: string
  amount: number
  clientName: string
  driverName?: string
  driverId?: string
  podCaptured?: boolean
}

export interface FuelEntry {
  id: string
  date: string
  liters: number
  pricePerLiter: number
  totalCost: number
  odometer: number
  station: string
  vehicleNumber: string
  notes?: string
}

export interface TripHistory {
  id: string
  bookingNumber: string
  origin: string
  destination: string
  completedDate: string
  distance: string
  amount: number
  status: 'completed' | 'cancelled'
  duration: string
  cargo: string
  rating?: number
}

export interface FleetDriver {
  id: string
  name: string
  phone: string
  vehicleNumber: string
  vehicleType: string
  status: DriverStatus
  location?: string
  currentBooking?: string
  totalTrips: number
  rating: number
}

export interface DashboardStats {
  todayEarnings: number
  weekEarnings: number
  tripsToday: number
  tripsWeek: number
  fuelLevel?: number         // percentage
  activeBookings: number
  pendingBookings: number
}

export interface FleetStats {
  totalDrivers: number
  activeDrivers: number
  onTripDrivers: number
  offDutyDrivers: number
  totalRevenue: number
  todayRevenue: number
  totalBookings: number
  pendingBookings: number
}

export interface PODPhoto {
  id: string
  bookingId: string
  uri: string
  timestamp: string
  latitude?: number
  longitude?: number
  type: 'pickup' | 'delivery'
}
