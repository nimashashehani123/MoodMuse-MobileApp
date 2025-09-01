import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const home = () => {
    const router = useRouter()
  return (
    <View>
      <Text>home</Text>
    </View>
  )
}

export default home

const styles = StyleSheet.create({})