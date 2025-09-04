import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mood } from "@/moods/moods";

const moods: Mood[] = [
  { key: "happy", label: "Happy", icon: "emoticon-happy-outline", colors: ["#FFDEE9", "#B5FFFC"] },
  { key: "sad", label: "Sad", icon: "emoticon-sad-outline", colors: ["#89F7FE", "#66A6FF"] },
  { key: "calm", label: "Calm", icon: "emoticon-neutral-outline", colors: ["#C9FFBF", "#FFAFBD"] },
  { key: "angry", label: "Angry", icon: "emoticon-angry-outline", colors: ["#FDC830", "#F37335"] },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState<Mood>(moods[0]);

  return (
    <LinearGradient colors={selectedMood.colors} style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>

      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            onPress={() => setSelectedMood(mood)}
            style={[
              styles.moodButton,
              selectedMood.key === mood.key && styles.selectedMood,
            ]}
          >
            <BlurView intensity={80} style={styles.blurBox}>
              <MaterialCommunityIcons
                name={mood.icon} 
                size={40}
                color={selectedMood.key === mood.key ? "#fff" : "#333"}
              />
              <Text
                style={[
                  styles.moodLabel,
                  { color: selectedMood.key === mood.key ? "#fff" : "#333" },
                ]}
              >
                {mood.label}
              </Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 40, color: "#fff" },
  moodRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20 },
  moodButton: { width: 120, height: 120, borderRadius: 24, overflow: "hidden" },
  blurBox: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 24 },
  moodLabel: { marginTop: 6, fontSize: 14, fontWeight: "500" },
  selectedMood: { borderWidth: 2, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10 },
});
