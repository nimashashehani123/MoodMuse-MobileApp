import React from "react";
import { View, Text } from "react-native";
import { useMoods } from "@/context/MoodContext";

const moodColor = (m: string) => {
  switch (m) {
    case "happy": return "#FDE68A";
    case "calm": return "#BFDBFE";
    case "sad": return "#C7D2FE";
    case "angry": return "#FCA5A5";
    case "stressed": return "#FBCFE8";
    case "excited": return "#A7F3D0";
    default: return "#E5E7EB";
  }
};

export default function Home() {
  const { loading, moods } = useMoods();

  const last = moods[0];
  const counts = moods.reduce<Record<string, number>>((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-3">Good to see you 👋</Text>

      {/* Today / Last mood */}
      <View
        style={{ backgroundColor: last ? moodColor(last.mood) : "#E5E7EB" }}
        className="rounded-2xl p-4 mb-12"
      >
        <Text className="text-base">Last mood</Text>
        <Text className="text-3xl font-semibold mt-1">
          {last ? `${last.mood} (${last.intensity}/10)` : "No entries yet"}
        </Text>
      </View>

      {/* Quick weekly stats */}
      <Text className="text-lg font-semibold mb-2">This week</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : moods.length === 0 ? (
        <Text>No moods yet. Log one from the Mood tab!</Text>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {Object.keys(counts).map((k) => (
            <View key={k} className="bg-white rounded-2xl px-4 py-3 shadow">
              <Text className="text-sm">{k}</Text>
              <Text className="text-xl font-bold">{counts[k]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
