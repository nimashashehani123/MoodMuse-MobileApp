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
import { registerUser } from "@/services/authService";
import { Mail, Lock } from "lucide-react-native";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    await registerUser(email, password)
      .then(() => {
        router.replace("/home"); // after register → go home
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Registration Failed", "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LinearGradient
      // Soft pastel gradient → calm + friendly
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
          {/* Floating Card */}
          <View className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
              Create your <Text className="text-indigo-600">MoodMuse</Text>{" "}
              Account
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

            {/* Register Button */}
            <TouchableOpacity activeOpacity={0.85} onPress={handleRegister}>
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
                    Register
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Already have account */}
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Text className="text-indigo-600 font-semibold">Login</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Register;
