import { View, Text, TouchableOpacity } from "react-native";
import { logoutUser } from "../services/authService";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-6">🎉 Welcome to MoodMuse!</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 rounded-xl w-40 py-3"
      >
        <Text className="text-white text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
