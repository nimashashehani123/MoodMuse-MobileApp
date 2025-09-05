import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { MoodValue } from "@/types/mood";
import { createMood } from "@/services/moodService";

const suggestions: Record<MoodValue, string[]> = {
  happy: ["Share your joy with a friend 👯", "Take a fun photo 📸"],
  calm: ["Enjoy a cup of tea 🍵", "Listen to relaxing music 🎶"],
  sad: ["Write down 3 things you’re grateful for ✍️", "Call a loved one ☎️"],
  angry: ["Take 5 deep breaths 😮‍💨", "Go for a walk 🚶"],
  stressed: ["Try 5 min meditation 🧘", "Stretch for a while 🤸"],
  excited: ["Plan something fun 🎉", "Dance to your favorite song 💃"],
};

export default function MoodScreen() {
  const { user } = useAuth();
  const [mood, setMood] = useState<MoodValue>("happy");
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [task, setTask] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    await createMood({
  userId: user.uid,
  mood,
  intensity,
  note,
});
    // pick random suggestion
    const suggestionList = suggestions[mood];
    setTask(suggestionList[Math.floor(Math.random() * suggestionList.length)]);
    setDone(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold mb-4">How do you feel?</Text>

      {/* Mood Picker */}
      <View className="flex-row justify-between mb-4">
        {(["happy", "calm", "sad", "angry", "stressed", "excited"] as MoodValue[]).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMood(m)}
            className={`p-3 rounded-xl ${mood === m ? "bg-indigo-500" : "bg-gray-200"}`}
          >
            <Text className={mood === m ? "text-white" : "text-gray-700"}>
              {m === "happy" && "😊"}
              {m === "calm" && "😌"}
              {m === "sad" && "😢"}
              {m === "angry" && "😡"}
              {m === "stressed" && "😰"}
              {m === "excited" && "🤩"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Intensity */}
      <Text className="text-lg mb-1">Intensity: {intensity}/10</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={intensity}
        onValueChange={setIntensity}
      />

      {/* Note */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 mt-4"
        placeholder="Add a note (optional)"
        value={note}
        onChangeText={setNote}
      />

      {/* Save */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-indigo-600 mt-6 p-4 rounded-2xl"
      >
        <Text className="text-white text-center font-semibold">Save Mood</Text>
      </TouchableOpacity>

      {/* Suggestion Task */}
      {task && (
        <View className="mt-8 p-5 bg-white rounded-2xl shadow">
          {!done ? (
            <>
              <Text className="text-lg font-semibold mb-2">Try this 💡</Text>
              <Text className="text-gray-700">{task}</Text>
              <TouchableOpacity
                onPress={() => setDone(true)}
                className="bg-green-500 mt-4 p-3 rounded-xl"
              >
                <Text className="text-white text-center">Mark as Done ✅</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text className="text-xl font-bold text-green-600 text-center">
              🎉 Great job! Keep it up 💪
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
