import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { strings } from "./localization";

const Home = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [lang, setLang] = useState<"en" | "si">("en");
  const [langLoaded, setLangLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang === "si") setLang("si");
      setLangLoaded(true);
    };
    loadLanguage();
  }, []);

  if (loading || !langLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-3xl font-bold mb-2">{strings[lang].homeGreeting}, {user.email}!</Text>
      <Text className="text-gray-600 text-center mb-6">{strings[lang].homeSubtitle}</Text>

      {/* Example buttons */}
      <TouchableOpacity
        className="bg-indigo-500 px-6 py-3 rounded-xl mb-4"
      >
        <Text className="text-white text-lg">Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 px-6 py-3 rounded-xl"
        onPress={async () => {
          await AsyncStorage.removeItem("appLanguage");
          router.replace("/languageSelection");
        }}
      >
        <Text className="text-white text-lg">Change Language</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
