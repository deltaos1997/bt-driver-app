import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from './ThemeContext'

export interface Load {
  id: string
  fromCity: string
  toCity: string
  fromState: string
  toState: string
  distance: string
  weight: string
  price: string
  vehicleType: string
  vehicleIcon: string
  postedAgo: string
  isPriority?: boolean
}

interface LoadCardProps {
  load: Load
  onPress: () => void
}

export default function LoadCard({ load, onPress }: LoadCardProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Priority badge */}
      {load.isPriority && (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: colors.warning,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: '#000', fontSize: 11, fontFamily: 'Nunito_700Bold' }}>
            URGENT
          </Text>
        </View>
      )}

      {/* Route row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {/* From */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Nunito_700Bold' }}>
            {load.fromCity}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontFamily: 'Nunito_400Regular' }}>
            {load.fromState}
          </Text>
        </View>

        {/* Arrow + distance */}
        <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
          <Text style={{ color: colors.accent, fontSize: 22 }}>→</Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontFamily: 'Nunito_600SemiBold' }}>
            {load.distance}
          </Text>
        </View>

        {/* To */}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Nunito_700Bold' }}>
            {load.toCity}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontFamily: 'Nunito_400Regular' }}>
            {load.toState}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 12 }} />

      {/* Details row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Vehicle icon + type */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginRight: 6 }}>{load.vehicleIcon}</Text>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily: 'Nunito_400Regular' }}>
              {load.vehicleType}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily: 'Nunito_400Regular' }}>
              {load.weight}
            </Text>
          </View>
        </View>

        {/* Price */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: colors.accent, fontSize: 24, fontFamily: 'Nunito_800ExtraBold' }}>
            ₹{load.price}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontFamily: 'Nunito_400Regular' }}>
            {load.postedAgo}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
