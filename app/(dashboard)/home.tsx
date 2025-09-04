import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Dummy quotes
const quotes = [
  "Every day is a fresh start 🌱",
  "Small steps every day lead to big changes ✨",
  "You are stronger than you think 💪",
  "Happiness is a habit – cultivate it 🌸",
];

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("");
  const [lastMood, setLastMood] = useState<any>(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning ☀️");
    else if (hour < 18) setGreeting("Good Afternoon 🌤️");
    else setGreeting("Good Evening 🌙");

    // Load last mood from storage
    const loadMood = async () => {
      const moodData = await AsyncStorage.getItem("lastMood");
      if (moodData) setLastMood(JSON.parse(moodData));
    };
    loadMood();

    // Random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Last mood card */}
      {lastMood ? (
        <LinearGradient
          colors={["#6366F1", "#A78BFA"]}
          style={styles.moodCard}
        >
          <Text style={styles.moodTitle}>Your Last Mood</Text>
          <Text style={styles.moodText}>
            {lastMood.emoji} {lastMood.label}
          </Text>
          {lastMood.note ? (
            <Text style={styles.moodNote}>"{lastMood.note}"</Text>
          ) : null}
        </LinearGradient>
      ) : (
        <Text style={styles.noMood}>No mood logged yet 🙂</Text>
      )}

      {/* Weekly chart (dummy data now) */}
      <Text style={styles.sectionTitle}>Weekly Mood Overview</Text>
      <BarChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [3, 4, 2, 5, 4, 3, 5], // replace with real moods later
            },
          ],
        }}
        width={screenWidth - 30}
        height={220}
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ borderRadius: 16, marginVertical: 10 }} yAxisLabel={""} yAxisSuffix={""}      />

      {/* Motivational Quote */}
      <Text style={styles.sectionTitle}>Motivational Quote</Text>
      <LinearGradient
        colors={["#34D399", "#10B981"]}
        style={styles.quoteCard}
      >
        <Text style={styles.quoteText}>{quote}</Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F9FAFB",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },
  moodCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 16,
    color: "#E0E7FF",
    marginBottom: 5,
  },
  moodText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  moodNote: {
    marginTop: 5,
    fontStyle: "italic",
    color: "#F3F4F6",
  },
  noMood: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  quoteCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  quoteText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
});
