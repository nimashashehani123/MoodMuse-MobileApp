import { ActivityIndicator, View } from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "@/context/AuthContext"

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [langChecked, setLangChecked] = useState(false)

  useEffect(() => {
    const checkLanguage = async () => {
      const lang = await AsyncStorage.getItem("appLanguage")
      if (!lang) {
        router.replace("/languageSelection") 
      } else {
        if (!loading) {
          if (user) router.replace("/home")
          else router.replace("/login")
        }
      }
      setLangChecked(true)
    }
    checkLanguage()
  }, [user, loading])

  if (loading || !langChecked) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return null
}
