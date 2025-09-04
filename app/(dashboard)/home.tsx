import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { LineChart } from "react-native-chart-kit";

const Home = () => {
  const { width, height } = useWindowDimensions();
  const [greeting, setGreeting] = useState("Good Morning 🌅");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌅");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  const horizontalPadding = width * 0.05;
  const heroPaddingTop = height * 0.08;
  const heroPaddingBottom = height * 0.06;
  const lastMoodOverlap = height * 0.08;
  const avatarSize = width * 0.15;
  const chartWidth = width - horizontalPadding * 2 - 10;

  return (
    <SafeAreaView edges={["top","left","right"]} className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: height * 0.12 }}>

        {/* Hero Section */}
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          className="rounded-b-[32px]"
          style={{ paddingTop: heroPaddingTop, paddingBottom: heroPaddingBottom, paddingHorizontal: horizontalPadding }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white text-3xl font-bold">{greeting}</Text>
              <Text className="text-indigo-100 text-base mt-2">How are you today?</Text>
            </View>
            <Image
              source={{ uri: "https://i.ibb.co/Qm3pJpH/avatar.png" }}
              className="border-2 border-white rounded-full"
              style={{ width: avatarSize, height: avatarSize }}
            />
          </View>
        </LinearGradient>

        {/* Last Mood Card */}
        <View className="mx-5 -mt-20">
          <BlurView intensity={90} tint="light" className="rounded-3xl p-5 shadow-md">
            <Text className="text-gray-700 text-sm">Last Mood</Text>
            <Text className="text-3xl font-bold mt-2">😊 Happy (8/10)</Text>
            <Text className="text-gray-500 italic mt-1">“Had a great workout today!”</Text>

            <TouchableOpacity className="bg-indigo-500 rounded-2xl mt-4 py-3 items-center shadow-md">
              <Text className="text-white font-semibold text-base">Add Mood</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Weekly Chart */}
        <View className="bg-white rounded-2xl p-5 mt-6 shadow-md mx-5">
          <Text className="text-lg font-semibold mb-3">This Week’s Mood Journey</Text>
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
          className="rounded-2xl p-6 mt-8 mx-5 relative shadow-md"
        >
          <Image
            source={{ uri: "https://i.ibb.co/0mZxk5H/motivation.png" }}
            className="absolute opacity-20 w-28 h-28 right-0 bottom-0"
          />
          <Text className="text-white text-xl font-semibold text-center">
            “Every day is a fresh start 🌱”
          </Text>

          <TouchableOpacity className="bg-white rounded-2xl mt-4 py-3 items-center shadow-md">
            <Text className="text-green-600 font-semibold text-base">Start Today</Text>
          </TouchableOpacity>
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
