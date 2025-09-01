import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { registerUser } from "@/services/authService";
import { useRouter } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);
      console.log("Registered:", user.email);
      router.push("/login"); // after register → go login
    } catch (e: any) {
      alert("Register Failed: " + e.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6">📝 Register</Text>

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
        onPress={handleRegister}
        className="bg-green-500 rounded-xl w-full py-3 mb-4"
      >
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text className="text-blue-600">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
