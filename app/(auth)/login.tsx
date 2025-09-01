import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { loginUser } from "@/services/authService";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      console.log("Logged in:", user.email);
      router.push("/"); // go to Home (index.tsx)
    } catch (e: any) {
      alert("Login Failed: " + e.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6">🔐 Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 rounded-xl w-full py-3 mb-4"
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text className="text-blue-600">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
