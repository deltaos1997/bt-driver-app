import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const THEME_KEY = 'bt_theme'

export type ThemeMode = 'dark' | 'light'

export interface ThemeColors {
  bg: string
  surface: string
  surfaceElevated: string
  border: string
  text: string
  textMuted: string
  accent: string
  success: string
  error: string
  warning: string
}

const darkColors: ThemeColors = {
  bg: '#09090B',
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  border: '#2A2A2A',
  text: '#FFFFFF',
  textMuted: '#888888',
  accent: '#F97316',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#FBBF24',
}

const lightColors: ThemeColors = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F4F4F5',
  border: '#E4E4E7',
  text: '#09090B',
  textMuted: '#71717A',
  accent: '#EA6E00',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
}

interface ThemeContextValue {
  mode: ThemeMode
  colors: ThemeColors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'light' || val === 'dark') setMode(val)
    })
  }, [])

  const toggleTheme = async () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    await AsyncStorage.setItem(THEME_KEY, next)
  }

  const colors = mode === 'dark' ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
