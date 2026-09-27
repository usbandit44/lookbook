import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/constants'

const profile = () => {
  return (
    <View
        style={{ flex: 1, backgroundColor: Colors.light.background, gap: 20 }}
    >
      <Text>profile</Text>
    </View>
  )
}

export default profile