import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Platform } from "react-native";
import { useRouter } from "expo-router";

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect mobile users away
    if (Platform.OS !== "web") {
      router.replace("/home"); // හෝ home page එකට redirect කරන්න
    }
  }, []);

  // Web users only
  if (Platform.OS !== "web") return null;

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">Admin Dashboard</Text>
      <Text className="mt-4 text-gray-600">
        Only accessible on web
      </Text>
    </View>
  );
};

export default AdminPage;
