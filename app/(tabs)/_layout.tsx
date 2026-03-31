import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../components/ThemeContext'

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  const { colors } = useTheme()
  return (
    <View style={styles.tabIcon}>
      <Text style={{ fontSize: focused ? 26 : 22 }}>{emoji}</Text>
      <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.textMuted }]}>
        {label}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  const { colors } = useTheme()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🗂️" label="Trips" focused={focused} /> }}
      />
      <Tabs.Screen
        name="active"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🚛" label="Active" focused={focused} /> }}
      />
      <Tabs.Screen
        name="earnings"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⛽" label="Fuel" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🪪" label="Driver" focused={focused} /> }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabIcon: { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  tabLabel: { fontSize: 10, fontFamily: 'Nunito_600SemiBold', marginTop: 2 },
})
