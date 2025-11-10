import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function MainButton({
    title = 'Button', 
    onPress = () => {},
    backgroundColor = '#4C4242',
    textColor = '#FFFFFF',
    style = {},
}) {
  return (
    <TouchableOpacity
        onPress={onPress}
        style={[
        {
            backgroundColor: backgroundColor,
            paddingVertical: 12,
            paddingHorizontal: 24,
            width: '75%',
            height: 48,
            borderRadius: 8,
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        style,
    ]}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}