import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";

const moods = [
  { key: "happy", icon: "emoticon-happy-outline", colors: ["#FFD93D", "#FFB347"] },
  { key: "sad", icon: "emoticon-sad-outline", colors: ["#6C63FF", "#3B3B98"] },
  { key: "calm", icon: "emoticon-neutral-outline", colors: ["#00C9A7", "#92FE9D"] },
  { key: "angry", icon: "emoticon-angry-outline", colors: ["#FF6B6B", "#D62828"] },
  { key: "anxious", icon: "emoticon-confused-outline", colors: ["#4D96FF", "#14279B"] },
];

export default function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [intensity, setIntensity] = useState(5);

  return (
    <LinearGradient
      colors={selectedMood.colors}
      style={styles.container}
    >
      <Text style={styles.title}>How are you feeling today?</Text>

      {/* Moods Circle */}
      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            onPress={() => {
              setSelectedMood(mood);
              Haptics.selectionAsync();
            }}
            style={[
              styles.moodButton,
              selectedMood.key === mood.key && { backgroundColor: "rgba(255,255,255,0.3)" },
            ]}
          >
            <MaterialCommunityIcons
              name={mood.icon}
              size={36}
              color={selectedMood.key === mood.key ? "#fff" : "#222"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Intensity */}
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <Text style={styles.intensityLabel}>Intensity: {intensity}/10</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={intensity}
          onValueChange={(val) => setIntensity(val)}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.5)"
          thumbTintColor="#fff"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  moodRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  moodButton: {
    marginHorizontal: 12,
    padding: 18,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  intensityLabel: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
});
