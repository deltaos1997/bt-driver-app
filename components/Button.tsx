import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { useTheme } from './ThemeContext'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'lg' | 'md' | 'sm'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme()

  const heights: Record<Size, number> = { lg: 56, md: 48, sm: 40 }
  const fontSizes: Record<Size, number> = { lg: 18, md: 16, sm: 14 }

  const bgColor = () => {
    if (disabled) return colors.border
    if (variant === 'primary') return colors.accent
    if (variant === 'danger') return colors.error
    return 'transparent'
  }

  const borderColor = () => {
    if (disabled) return colors.border
    if (variant === 'secondary') return colors.accent
    if (variant === 'danger') return colors.error
    return 'transparent'
  }

  const textColor = () => {
    if (disabled) return colors.textMuted
    if (variant === 'primary' || variant === 'danger') return '#FFFFFF'
    if (variant === 'secondary') return colors.accent
    return colors.text
  }

  const containerStyle: ViewStyle = {
    height: heights[size],
    backgroundColor: bgColor(),
    borderColor: borderColor(),
    borderWidth: variant === 'secondary' ? 2 : 0,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  }

  const labelStyle: TextStyle = {
    color: textColor(),
    fontSize: fontSizes[size],
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.3,
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.accent} />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}
