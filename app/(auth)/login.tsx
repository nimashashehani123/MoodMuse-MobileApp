import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "@/services/authService";
import { Mail, Lock } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../localization";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang === "si") setLang("si");
    };
    loadLanguage();
  }, []);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    await loginUser(email, password)
      .then(() => router.replace("/home"))
      .catch((err) => {
        console.error(err);
        Alert.alert(strings[lang].login + " Failed", "Invalid email or password");
      })
      .finally(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={["#A5F3FC", "#C4B5FD", "#FBCFE8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
              {strings[lang].welcomeBack} <Text className="text-indigo-600">MoodMuse</Text>
            </Text>

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
              <Mail color="#6B7280" size={20} />
              <TextInput
                placeholder={strings[lang].emailPlaceholder}
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                className="flex-1 ml-3 text-base text-gray-900"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-2">
              <Lock color="#6B7280" size={20} />
              <TextInput
                placeholder={strings[lang].passwordPlaceholder}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-3 text-base text-gray-900"
              />
            </View>

            <Pressable onPress={() => Alert.alert(strings[lang].forgotPassword)}>
              <Text className="text-right text-sm text-indigo-500 mb-6">
                {strings[lang].forgotPassword}
              </Text>
            </Pressable>

            <TouchableOpacity activeOpacity={0.85} onPress={handleLogin}>
              <LinearGradient
                colors={["#6366F1", "#9333EA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 rounded-xl shadow-md"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-semibold text-center">
                    {strings[lang].login}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-center text-sm text-gray-500 mt-6">
                {strings[lang].dontHaveAccount}{" "}
                <Text className="text-indigo-600 font-semibold">{strings[lang].register}</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Login;
