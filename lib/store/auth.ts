import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User, UserRole, RegisterData, AuthSession } from '../types'
import {
  sendOtp as apiSendOtp,
  verifyOtp as apiVerifyOtp,
  googleSignIn as apiGoogleSignIn,
  registerProfile as apiRegisterProfile,
  authLogout as apiAuthLogout,
  setAuthToken,
  AuthResponse,
} from '../api'

const SESSION_KEY = 'bt_session'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  /** Phone stored during OTP flow so OTP screen can resend / verify */
  pendingPhone: string | null
  /** True after verify-otp/google returns is_new_user — profile completion required */
  isNewUser: boolean

  hydrate: () => Promise<void>
  sendOtp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<{ isNewUser: boolean }>
  googleLogin: (idToken: string, role?: UserRole) => Promise<{ isNewUser: boolean }>
  completeProfile: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

function mapApiUser(apiUser: AuthResponse['user']): User {
  return {
    id: apiUser.id,
    name: apiUser.name ?? '',
    phone: apiUser.phone,
    email: apiUser.email,
    role: apiUser.role,
    profilePhoto: apiUser.profile_photo,
    joinedDate: apiUser.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
  }
}

async function persistSession(session: AuthSession) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
  setAuthToken(session.accessToken)
}

function handleAuthResponse(
  response: AuthResponse,
  set: (partial: Partial<AuthState>) => void
): { isNewUser: boolean } {
  const user = mapApiUser(response.user)
  setAuthToken(response.access_token)

  if (response.is_new_user) {
    // Store tokens and partial user, but don't mark as authenticated yet
    set({
      user,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      isNewUser: true,
      isAuthenticated: false,
    })
    return { isNewUser: true }
  }

  // Existing user — fully authenticated
  set({
    user,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    isAuthenticated: true,
    isNewUser: false,
  })
  persistSession({ user, accessToken: response.access_token, refreshToken: response.refresh_token })
  return { isNewUser: false }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  pendingPhone: null,
  isNewUser: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY)
      if (raw) {
        const session: AuthSession = JSON.parse(raw)
        setAuthToken(session.accessToken)
        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },

  sendOtp: async (phone: string) => {
    await apiSendOtp(phone)
    set({ pendingPhone: phone })
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiVerifyOtp(phone, otp)
    return handleAuthResponse(response, set)
  },

  googleLogin: async (idToken: string, role?: UserRole) => {
    const response = await apiGoogleSignIn(idToken, role)
    return handleAuthResponse(response, set)
  },

  completeProfile: async (data: RegisterData) => {
    await apiRegisterProfile(data)
    const { user, accessToken, refreshToken } = get()
    if (!user || !accessToken || !refreshToken) throw new Error('No active session')

    // Merge profile data into local user object
    const updated: User = {
      ...user,
      name: data.name,
      role: data.role,
      email: data.email ?? user.email,
      vehicleNumber: data.vehicle_number,
      vehicleType: data.vehicle_type,
      companyName: data.company_name,
      gstNumber: data.gst_number,
    }
    await persistSession({ user: updated, accessToken, refreshToken })
    set({ user: updated, isAuthenticated: true, isNewUser: false })
  },

  logout: async () => {
    try {
      await apiAuthLogout()
    } catch {
      // Ignore logout errors — clear local session regardless
    }
    await AsyncStorage.removeItem(SESSION_KEY)
    setAuthToken(null)
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      pendingPhone: null,
      isNewUser: false,
    })
  },
}))
