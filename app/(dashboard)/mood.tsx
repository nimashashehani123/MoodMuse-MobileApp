import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const moodOptions = [
  { emoji: "😄", label: "Happy", key: "happy" },
  { emoji: "😐", label: "Neutral", key: "neutral" },
  { emoji: "😔", label: "Sad", key: "sad" },
  { emoji: "😠", label: "Angry", key: "angry" },
  { emoji: "😰", label: "Anxious", key: "anxious" },
];

const suggestedTasks: Record<string, string[]> = {
  happy: ["Share a smile", "Write down 3 happy thoughts"],
  neutral: ["Take a short walk", "Listen to music"],
  sad: ["Write 3 happy things", "Call a friend"],
  angry: ["Do 5 min breathing", "Listen to calming music"],
  anxious: ["Try 3 deep breaths", "Meditate 5 min"],
};

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);

  const saveMood = async () => {
    if (!selectedMood) {
      Alert.alert("Select a mood first!");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const moodData = { mood: selectedMood, intensity, date: today };
    try {
      const stored = await AsyncStorage.getItem("moodHistory");
      const history = stored ? JSON.parse(stored) : [];
      history.push(moodData);
      await AsyncStorage.setItem("moodHistory", JSON.stringify(history));
      Alert.alert("Mood saved!", `You selected ${selectedMood} with intensity ${intensity}`);
      setSelectedMood(null);
      setIntensity(5);
    } catch (err) {
      console.error(err);
      Alert.alert("Error saving mood");
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4">How are you feeling today?</Text>

      {/* Mood Picker */}
      <View className="flex-row justify-between mb-6">
        {moodOptions.map((m) => (
          <TouchableOpacity
            key={m.key}
            onPress={() => setSelectedMood(m.key)}
            className={`p-4 rounded-xl border-2 ${
              selectedMood === m.key ? "border-indigo-500 bg-indigo-100" : "border-gray-200"
            }`}
          >
            <Text className="text-3xl text-center">{m.emoji}</Text>
            <Text className="text-center mt-2">{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Intensity Slider */}
      {selectedMood && (
        <View className="mb-6">
          <Text className="mb-2 font-semibold">Mood Intensity: {intensity}</Text>
          <Slider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={intensity}
            onValueChange={setIntensity}
            minimumTrackTintColor="#6366F1"
            maximumTrackTintColor="#E5E7EB"
          />
        </View>
      )}

      {/* Suggested Tasks */}
      {selectedMood && (
        <View className="mb-6">
          <Text className="font-semibold mb-2">Suggested tasks:</Text>
          {suggestedTasks[selectedMood].map((task, i) => (
            <Text key={i} className="ml-2 mb-1">
              • {task}
            </Text>
          ))}
        </View>
      )}

      {/* Save Button */}
      {selectedMood && (
        <TouchableOpacity
          onPress={saveMood}
          className="bg-indigo-500 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Save Mood</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
