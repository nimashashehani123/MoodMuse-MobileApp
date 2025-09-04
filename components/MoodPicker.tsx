import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MoodValue } from "@/types/mood";

const EMOJI_MAP: Record<MoodValue, string> = {
  happy: "😊",
  calm: "😌",
  sad: "😢",
  angry: "😠",
  stressed: "😖",
  excited: "🤩",
};

type Props = {
  value: MoodValue;
  onChange: (v: MoodValue) => void;
};

export default function MoodPicker({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-3 mt-2">
      {Object.keys(EMOJI_MAP).map((k) => {
        const key = k as MoodValue;
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            className={`px-3 py-2 rounded-2xl ${active ? "bg-indigo-200" : "bg-gray-100"}`}
          >
            <Text style={{ fontSize: 20 }}>{EMOJI_MAP[key]} </Text>
            <Text className="text-xs text-center mt-1">{key}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
