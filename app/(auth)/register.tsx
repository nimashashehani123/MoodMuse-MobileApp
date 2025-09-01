import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { registerUser } from '@/services/authService'

const Register = () => {
const router = useRouter()
const [email,setEmail] = useState<string>("")
const [Password,setPassword] = useState<string>("")
const [IsLoadingReg,setIsLoadingReg] = useState<boolean>(false)

const handleRegister = async() => {
    if (IsLoadingReg) return;
    setIsLoadingReg(true);
    await registerUser(email,Password)
    .then((res) => {
      console.log("Registered user:", res);
      router.back(); 
    })
    .catch((err) => {
      console.error(err)
      Alert.alert("Registration fail","Something went wrong")
      //import {Alert} from 'react-native'
    })
    .finally(() => {
      setIsLoadingReg(false)
    })
}

  return (
    <View className='flex-1 w-full justify-center align-items-center bg-gray-100'>
       <Text className='text-2xl font-bold mb-6 text-blue-600 text-center'>Register to Task Manager</Text>
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
       <TouchableOpacity className='bg-blue-500 p-4 rounded mt-2' onPress={handleRegister}>
        {IsLoadingReg ? (<ActivityIndicator color="#fff" />)
        : (<Text className='text-center text-2xl text-white'>Register</Text>

        )}
         
       </TouchableOpacity>

         <Pressable onPress={() => router.push("/login")}>
             <Text className='text-center text-blue-500 text-xl'>
                 Already have an account? Login
             </Text>
         </Pressable>
     </View>
   )
}

export default Register

const styles = StyleSheet.create({})