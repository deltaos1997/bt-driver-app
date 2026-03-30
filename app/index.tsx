import { Redirect } from 'expo-router'

// Root: redirect to auth if not logged in, else to (tabs)
export default function Root() {
  const isLoggedIn = false  // TODO: read from auth store (zustand + AsyncStorage)
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/(auth)/login'} />
}
