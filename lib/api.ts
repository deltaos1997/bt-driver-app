import axios from 'axios'

const AUTH_URL    = process.env.EXPO_PUBLIC_AUTH_URL    ?? 'http://localhost:3001'
const BOOKING_URL = process.env.EXPO_PUBLIC_BOOKING_URL ?? 'http://localhost:3002'

export const authApi    = axios.create({ baseURL: AUTH_URL })
export const bookingApi = axios.create({ baseURL: BOOKING_URL })

// Attach JWT token to all requests
export function setAuthToken(token: string) {
  authApi.defaults.headers.common['Authorization']    = `Bearer ${token}`
  bookingApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
