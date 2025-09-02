import { View, Text, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

export default function LanguageSelection() {
  const router = useRouter()

  const setLanguage = async (lang: string) => {
    await AsyncStorage.setItem("appLanguage", lang)
    router.replace("/") // go to Index (auth check)
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-8">🌍 Choose Language</Text>

      <TouchableOpacity
        className="bg-indigo-500 px-6 py-3 rounded-xl mb-4"
        onPress={() => setLanguage("en")}
      >
        <Text className="text-white text-lg">English 🇬🇧</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-pink-500 px-6 py-3 rounded-xl"
        onPress={() => setLanguage("si")}
      >
        <Text className="text-white text-lg">සිංහල 🇱🇰</Text>
      </TouchableOpacity>
    </View>
  )
}
