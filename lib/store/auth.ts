import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User, UserRole } from '../types'

const MOCK_DRIVER: User = {
  id: 'drv-001',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@email.com',
  role: 'individual_driver',
  licenseNumber: 'DL-MH-2019-0123456',
  vehicleNumber: 'MH-01-AB-1234',
  vehicleType: 'Tata Prima 3718',
  rating: 4.7,
  totalTrips: 312,
  joinedDate: '2022-03-15',
  token: 'mock-token-driver-001',
}

const MOCK_FLEET: User = {
  id: 'flt-001',
  name: 'Vikram Singh',
  phone: '+91 99887 65432',
  email: 'ops@singhamlogistics.com',
  role: 'fleet_operator',
  companyName: 'Singam Logistics Pvt. Ltd.',
  rating: 4.5,
  totalTrips: 4280,
  joinedDate: '2021-01-10',
  token: 'mock-token-fleet-001',
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phone: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem('bt_user')
      if (raw) {
        const user: User = JSON.parse(raw)
        set({ user, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },

  login: async (phone: string, _password: string, role: UserRole) => {
    // Placeholder — swap for real API call later
    const user = role === 'fleet_operator' ? MOCK_FLEET : MOCK_DRIVER
    await AsyncStorage.setItem('bt_user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: async () => {
    await AsyncStorage.removeItem('bt_user')
    set({ user: null, isAuthenticated: false })
  },
}))
