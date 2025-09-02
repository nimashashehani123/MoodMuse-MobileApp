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
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "@/services/authService"; // make sure you have this function
import { Mail, Lock } from "lucide-react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    await loginUser(email, password)
      .then(() => {
        router.replace("/home"); 
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Login Failed", "Invalid email or password");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LinearGradient
      colors={["#06B6D4", "#3B82F6", "#9333EA"]}
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
          {/* Floating Card */}
          <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
              Welcome back to <Text className="text-indigo-600">MoodMuse</Text>
            </Text>

            {/* Email */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
              <Mail color="#6B7280" size={20} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                className="flex-1 ml-3 text-base text-gray-900"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
              <Lock color="#6B7280" size={20} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-3 text-base text-gray-900"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
              <LinearGradient
                colors={["#6366F1", "#9333EA"]}
                className="py-4 rounded-xl"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-semibold text-center">
                    Login
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Register Link */}
            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-center text-sm text-gray-500 mt-6">
                Don’t have an account?{" "}
                <Text className="text-indigo-600 font-semibold">Register</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Login;
