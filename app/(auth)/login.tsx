import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { loginUser } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock } from "lucide-react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    await loginUser(email, Password)
      .then(() => router.push("/home"))
      .catch(() => Alert.alert("Login Failed", "Invalid email or password"))
      .finally(() => setLoading(false));
  };

  return (
    <LinearGradient colors={["#a78bfa", "#6366f1", "#3b82f6"]} className="flex-1 justify-center items-center">
      <View className="bg-white w-11/12 p-6 rounded-2xl shadow-lg">
        <Text className="text-3xl font-bold text-center text-indigo-600 mb-6">MoodMuse Login</Text>

        {/* Email */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Mail size={20} color="#6B7280" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            className="flex-1 ml-2 text-gray-900"
          />
        </View>

        {/* Password */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Lock size={20} color="#6B7280" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={Password}
            onChangeText={setPassword}
            className="flex-1 ml-2 text-gray-900"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity className="rounded-xl overflow-hidden mb-4" onPress={handleLogin}>
          <LinearGradient colors={["#6366f1", "#3b82f6"]} className="py-4">
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-lg font-semibold text-white">Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Register Redirect */}
        <Text className="text-center text-gray-600">
          Don’t have an account?{" "}
          <Text onPress={() => router.push("/register")} className="text-indigo-600 font-semibold">
            Register
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Login;
