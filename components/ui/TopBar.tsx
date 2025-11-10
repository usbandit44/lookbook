import { View, Text, Image } from 'react-native'
import React from 'react'
import IconButton from './IconButton'
import icons from '@/constants/icons'

export default function TopBar() {
  return (
    <View>
      <IconButton
              onPress={() => alert('Icon Pressed!')}
              backgroundColor="#ADD8E6"
              icon={<Image source={icons.noTextLogo} style={{ width: 90, height: 90, resizeMode: "contain" }} />}
              style={{ height: 90, width: 90, marginLeft: 'auto', marginRight: 'auto' }}
     />
    </View>
  )
}