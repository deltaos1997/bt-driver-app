export type UserRole = 'driver' | 'fleet_owner' | 'shipper'
export type AuthProvider = 'email' | 'google' | 'facebook'
export type VehicleType = 'mini_truck' | 'lcv' | 'hcv' | 'trailer'

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type DriverStatus = 'active' | 'inactive' | 'on_trip' | 'off_duty'

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: UserRole
  authProvider?: AuthProvider
  companyName?: string       // Fleet owners only
  gstNumber?: string         // Fleet owners / shippers
  licenseNumber?: string     // Drivers
  vehicleNumber?: string     // Drivers
  vehicleType?: VehicleType
  profilePhoto?: string
  rating?: number
  totalTrips?: number
  joinedDate: string
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterData {
  name: string
  role: UserRole
  email?: string
  vehicle_type?: VehicleType
  vehicle_number?: string
  company_name?: string
  gst_number?: string
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
