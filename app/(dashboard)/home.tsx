import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { logoutUser } from '@/services/authService'

const home = () => {
  return (
    <View>
      <Text>home</Text>
      <TouchableOpacity onPress={LogOut =>{
        logoutUser()
      }}>logout</TouchableOpacity>
    </View>
  )
}

export default home

const styles = StyleSheet.create({})