import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const [greeting, setGreeting] = useState("Good Morning 🌅");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌅");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");
  }, []);

  // Responsive sizing
  const horizontalPadding = width * 0.05; // 5% of screen width
  const heroPaddingTop = height * 0.08; // reduced for iOS safe area
  const heroPaddingBottom = height * 0.06;
  const lastMoodOverlap = height * 0.08;
  const avatarSize = width * 0.15;
  const cardRadius = 24;

  // iOS shadow styles
  const shadowStyle = {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.12 }}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          style={{
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingTop: heroPaddingTop,
            paddingBottom: heroPaddingBottom,
            paddingHorizontal: horizontalPadding,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>{greeting}</Text>
              <Text style={{ color: "#E0E7FF", fontSize: 16, marginTop: 6 }}>How are you today?</Text>
            </View>
            <Image
              source={{ uri: "https://i.ibb.co/Qm3pJpH/avatar.png" }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                borderWidth: 2,
                borderColor: "white",
              }}
            />
          </View>
        </LinearGradient>

        {/* Last Mood Card */}
        <View style={{ marginHorizontal: horizontalPadding, marginTop: -lastMoodOverlap }}>
          <BlurView intensity={90} tint="light" style={[{ borderRadius: cardRadius, padding: 20 }, shadowStyle]}>
            <Text style={{ color: "#374151", fontSize: 14 }}>Last Mood</Text>
            <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 8 }}>😊 Happy (8/10)</Text>
            <Text style={{ color: "#6B7280", fontStyle: "italic", marginTop: 4 }}>
              “Had a great workout today!”
            </Text>

            {/* Rounded Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#6366F1",
                borderRadius: 24,
                marginTop: 16,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Add Mood</Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Weekly Chart */}
        <View
          style={[
            { backgroundColor: "white", borderRadius: cardRadius, padding: 20, marginTop: 24, marginHorizontal: horizontalPadding },
            shadowStyle,
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>This Week’s Mood Journey</Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: [3, 4, 2, 5, 4, 6, 7] }],
            }}
            width={width - horizontalPadding * 2 - 10} // small fix for iOS cut-off
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(99,102,241,${opacity})`,
              strokeWidth: 3,
              labelColor: () => "#6B7280",
            }}
            bezier
            style={{ borderRadius: cardRadius }}
          />
        </View>

        {/* Quote Card */}
        <LinearGradient
          colors={["#34D399", "#10B981"]}
          style={[
            { borderRadius: cardRadius, padding: 24, marginTop: 32, marginHorizontal: horizontalPadding, position: "relative" },
            shadowStyle,
          ]}
        >
          <Image
            source={{ uri: "https://i.ibb.co/0mZxk5H/motivation.png" }}
            style={{
              position: "absolute",
              opacity: 0.2,
              width: width * 0.25,
              height: width * 0.25,
              bottom: 0,
              right: 0,
            }}
          />
          <Text style={{ color: "white", fontSize: 20, fontWeight: "600", textAlign: "center" }}>
            “Every day is a fresh start 🌱”
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              marginTop: 16,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#059669", fontWeight: "600", fontSize: 16 }}>Start Today</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
