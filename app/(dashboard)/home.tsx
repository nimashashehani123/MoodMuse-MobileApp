import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { LineChart } from "react-native-chart-kit";
import { router } from "expo-router";

const Home = () => {
  const { width, height } = useWindowDimensions();
  const [greeting, setGreeting] = useState("Good Morning 🌅");

  useEffect(() => {
    if (Platform.OS === "web") {
      router.replace("/admin");
    }
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌅");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  // Dynamic sizes
  const horizontalPadding = width * 0.06;
  const heroPaddingTop = height * 0.1;
  const heroPaddingBottom = height * 0.07;
  const avatarSize = width * 0.16;
  const chartWidth = width - horizontalPadding * 2;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.15 }}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          style={{
            paddingTop: heroPaddingTop,
            paddingBottom: heroPaddingBottom,
            paddingHorizontal: horizontalPadding,
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
          }}
          className="shadow-md"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="text-white text-3xl font-bold leading-snug">
                {greeting}
              </Text>
              <Text className="text-indigo-100 text-base mt-2">
                How are you today?
              </Text>
            </View>
            <Image
              source={{ uri: "https://i.ibb.co/Qm3pJpH/avatar.png" }}
              className="border-2 border-white rounded-full"
              style={{ width: avatarSize, height: avatarSize }}
            />
          </View>
        </LinearGradient>

        {/* Last Mood Card */}
        <View className="mx-6 -mt-16">
          <BlurView
            intensity={90}
            tint="light"
            style={{ borderRadius: 24 }}
            className="p-6 shadow-lg"
          >
            <Text className="text-gray-700 text-sm">Last Mood</Text>
            <Text className="text-3xl font-bold mt-2">😊 Happy (8/10)</Text>
            <Text className="text-gray-500 italic mt-1">
              “Had a great workout today!”
            </Text>

            <TouchableOpacity className="bg-indigo-500 rounded-2xl mt-5 py-3 items-center shadow-md">
              <Text className="text-white font-semibold text-base">Add Mood</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Weekly Chart */}
        <View className="bg-white rounded-3xl p-6 mt-8 shadow-md mx-6">
          <Text className="text-lg font-semibold mb-4">
            This Week’s Mood Journey
          </Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: [3, 4, 2, 5, 4, 6, 7] }],
            }}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
              strokeWidth: 3,
              labelColor: () => "#6B7280",
            }}
            bezier
            style={{ borderRadius: 24 }}
          />
        </View>

        {/* Quote Card */}
        <LinearGradient
          colors={["#34D399", "#10B981"]}
          style={{ borderRadius: 24 }}
          className="p-6 mt-10 mx-6 relative shadow-lg"
        >
          <Image
            source={{ uri: "https://i.ibb.co/0mZxk5H/motivation.png" }}
            className="absolute opacity-20 w-28 h-28 right-0 bottom-0"
          />
          <Text className="text-white text-xl font-semibold text-center leading-relaxed">
            “Every day is a fresh start 🌱”
          </Text>

          <TouchableOpacity className="bg-white rounded-2xl mt-5 py-3 items-center shadow-md">
            <Text className="text-green-600 font-semibold text-base">
              Start Today
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
