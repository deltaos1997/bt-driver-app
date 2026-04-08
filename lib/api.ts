import axios from 'axios'
import { UserRole, RegisterData } from './types'

const AUTH_URL    = process.env.EXPO_PUBLIC_AUTH_URL    ?? 'http://localhost:3001'
const BOOKING_URL = process.env.EXPO_PUBLIC_BOOKING_URL ?? 'http://localhost:3002'

export const authApi    = axios.create({ baseURL: AUTH_URL })
export const bookingApi = axios.create({ baseURL: BOOKING_URL })

// Attach JWT token to all requests
export function setAuthToken(token: string | null) {
  if (token) {
    authApi.defaults.headers.common['Authorization']    = `Bearer ${token}`
    bookingApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete authApi.defaults.headers.common['Authorization']
    delete bookingApi.defaults.headers.common['Authorization']
  }
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string
  refresh_token: string
  is_new_user: boolean
  user: {
    id: string
    phone: string
    name?: string
    email?: string
    role: UserRole
    profile_photo?: string
    created_at?: string
  }
}

export async function sendOtp(phone: string): Promise<void> {
  await authApi.post('/auth/send-otp', { phone })
}

export async function verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
  const { data } = await authApi.post('/auth/verify-otp', { phone, otp })
  return data.data
}

export async function googleSignIn(idToken: string, role?: UserRole): Promise<AuthResponse> {
  const body: Record<string, string> = { id_token: idToken }
  if (role) body.role = role
  const { data } = await authApi.post('/auth/google', body)
  return data.data
}

export async function registerProfile(profile: RegisterData): Promise<void> {
  await authApi.post('/auth/register', profile)
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { data } = await authApi.post('/auth/refresh', { refresh_token: refreshToken })
  return data.data.access_token
}

export async function getMe() {
  const { data } = await authApi.get('/auth/me')
  return data.data.user
}

export async function authLogout(): Promise<void> {
  await authApi.post('/auth/logout')
}
