import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { loginUser } from '@/services/authService'

const Login = () => {
    const router = useRouter()
    const [email,setEmail] = useState<string>("")
    const [Password,setPassword] = useState<string>("")
    const [IsLoadingReg,setIsLoadingReg] = useState<boolean>(false)

    const handleLogin = async() => {
      // if(email){}
        if (IsLoadingReg) return;
        setIsLoadingReg(true);
        await loginUser(email,Password)
        .then((res) => {
          router.push("/home"); 
        })
        .catch((err) => {
          console.error(err)
          Alert.alert("Login fail","Something went wrong")
          //import {Alert} from 'react-native'
        })
        .finally(() => {
          setIsLoadingReg(false)
        })
    }
    
  return (
    <View className='flex-1 w-full justify-center align-items-center bg-gray-100'>
      <Text className='text-2xl font-bold mb-6 text-blue-600 text-center'>Login to Task Manager</Text>
      <TextInput 
        placeholder='Email'
        className='bg-slate-200 border border-gray-300 rounded px-4 py-2 text-gray-900'
        placeholderTextColor="#9CA3AF"
         value={email}
         onChangeText={setEmail}/>
      <TextInput
        placeholder='Password'
        className='bg-slate-200 border border-gray-300 rounded px-4 py-2 text-gray-900'
        placeholderTextColor="#9CA3AF"
        secureTextEntry
         value={Password}
         onChangeText={setPassword} />
      <TouchableOpacity className='bg-blue-500 p-4 rounded mt-2' onPress={handleLogin}>
        {IsLoadingReg ? (<ActivityIndicator color="#fff" />
        ): (<Text className='text-center text-2xl text-white'>Login</Text>
       )}
                
      </TouchableOpacity>
        <Pressable onPress={() => router.push("/register")}>
            <Text className='text-center text-blue-500 text-xl'>
                Don't have an account? Register
            </Text>
        </Pressable>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})