import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MoodPicker from "@/components/MoodPicker";
import { MoodValue } from "@/types/mood";
import { useMoods } from "@/context/MoodContext";

export default function MoodTab() {
  const { add } = useMoods();
  const [mood, setMood] = useState<MoodValue>("happy");
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await add(mood, intensity, note.trim() ? note : undefined);
      setNote("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#E9D5FF","#C7D2FE"]} style={{ flex: 1 }}>
      <View className="flex-1 p-5">
        <Text className="text-2xl font-bold mb-3">Log your mood</Text>

        <MoodPicker value={mood} onChange={setMood} />

        {/* Intensity */}
        <View className="mt-6">
          <Text className="mb-2 font-medium">Intensity: {intensity}/10</Text>
          <View className="bg-white rounded-2xl p-4">
            <TextInput
              value={String(intensity)}
              onChangeText={(t) => {
                const n = parseInt(t || "0", 10);
                if (!Number.isNaN(n)) setIntensity(Math.max(1, Math.min(10, n)));
              }}
              keyboardType="number-pad"
              className="text-lg"
              placeholder="1 - 10"
            />
          </View>
        </View>

        {/* Note */}
        <View className="mt-4">
          <Text className="mb-2 font-medium">Note (optional)</Text>
          <View className="bg-white rounded-2xl p-4">
            <TextInput
              placeholder="Why do you feel this way?"
              value={note}
              onChangeText={setNote}
              multiline
              className="min-h-[90px]"
            />
          </View>
        </View>

        <TouchableOpacity onPress={onSave} className="mt-6">
          <LinearGradient colors={["#6366F1","#9333EA"]} className="py-4 rounded-2xl items-center">
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-lg">Save Mood</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
