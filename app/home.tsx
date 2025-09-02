import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { logoutUser } from '@/services/authService'

const home = () => {
    const router = useRouter()

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };
  return (
    <View>
      <Text>home</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 rounded-xl w-40 py-3"
      >
        <Text className="text-white text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default home

const styles = StyleSheet.create({})