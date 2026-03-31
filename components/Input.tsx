import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import { useTheme } from './ThemeContext'

interface InputProps extends TextInputProps {
  label?: string
  prefix?: React.ReactNode
  containerStyle?: ViewStyle
  error?: string
}

export default function Input({
  label,
  prefix,
  containerStyle,
  error,
  style,
  ...props
}: InputProps) {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      {label ? (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 13,
            fontFamily: 'Nunito_600SemiBold',
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceElevated,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: error
            ? colors.error
            : focused
            ? colors.accent
            : colors.border,
          paddingHorizontal: 16,
          height: 56,
        }}
      >
        {prefix ? <View style={{ marginRight: 10 }}>{prefix}</View> : null}
        <TextInput
          {...props}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          placeholderTextColor={colors.textMuted}
          style={[
            {
              flex: 1,
              color: colors.text,
              fontSize: 18,
              fontFamily: 'Nunito_600SemiBold',
            },
            style,
          ]}
        />
      </View>

      {error ? (
        <Text
          style={{
            color: colors.error,
            fontSize: 12,
            fontFamily: 'Nunito_400Regular',
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}
