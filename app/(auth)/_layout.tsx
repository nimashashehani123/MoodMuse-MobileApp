import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false,animation:"slide_from_right"}}>  //stack - wrap screen set
        <Stack.Screen name="login" options={{title:"Hello"}} />
        <Stack.Screen name="register" />
    </Stack>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})