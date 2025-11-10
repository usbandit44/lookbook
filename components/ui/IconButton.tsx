import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { ReactNode } from 'react'

interface IconButtonProps {
  onPress?: () => void;
  backgroundColor?: string;
  icon?: ReactNode;
  style?: object;
}

export default function IconButton({
  onPress = () => {},
  icon = null,
  style = {},
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          borderRadius: 8,
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  )
}