import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
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

const quotes = [
  "Every day may not be good… but there’s something good in every day 🌈",
  "Little progress each day adds up to big results 🚀",
  "Feel your feelings. They are valid 💙",
  "You are stronger than you think 💪",
];

export default function MoodScreen() {
  const { user } = useAuth();
  const [mood, setMood] = useState<MoodValue>("happy");
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [task, setTask] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [quote, setQuote] = useState("");

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

    // pick random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // clear form
    setNote("");
    setIntensity(5);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-6">
      {/* Greeting */}
      <Text className="text-2xl font-bold mb-2">Hi {user?.displayName || "Friend"} 👋</Text>
      <Text className="text-gray-500 mb-6">Let’s check in with your mood today</Text>

      {/* Mood Picker */}
      <View className="flex-row justify-between mb-6">
        {(["happy", "calm", "sad", "angry", "stressed", "excited"] as MoodValue[]).map(
          (m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMood(m)}
              className={`p-3 rounded-2xl items-center border ${
                mood === m ? "bg-indigo-500 border-indigo-600" : "bg-gray-200 border-gray-300"
              }`}
            >
              <Text className={mood === m ? "text-white text-2xl" : "text-gray-700 text-2xl"}>
                {m === "happy" && "😊"}
                {m === "calm" && "😌"}
                {m === "sad" && "😢"}
                {m === "angry" && "😡"}
                {m === "stressed" && "😰"}
                {m === "excited" && "🤩"}
              </Text>
              <Text
                className={`mt-1 text-xs font-medium capitalize ${
                  mood === m ? "text-white" : "text-gray-600"
                }`}
              >
                {m}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Intensity */}
      <Text className="text-lg mb-1">Intensity: {intensity}/10</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={intensity}
        minimumTrackTintColor="#6366F1"
        maximumTrackTintColor="#D1D5DB"
        thumbTintColor="#4F46E5"
        onValueChange={setIntensity}
      />

      {/* Note */}
      <TextInput
        className="border border-gray-300 rounded-xl p-3 mt-6 bg-white"
        placeholder="Add a note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      {/* Save */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-indigo-600 mt-6 p-4 rounded-2xl"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Save Mood
        </Text>
      </TouchableOpacity>

      {/* Suggestion Task */}
      {task && (
        <View className="mt-10 p-5 bg-white rounded-3xl shadow">
          {!done ? (
            <>
              <Text className="text-lg font-semibold mb-2 text-indigo-600">
                Try this 💡
              </Text>
              <Text className="text-gray-700">{task}</Text>
              <TouchableOpacity
                onPress={() => setDone(true)}
                className="bg-green-500 mt-5 p-3 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">
                  Mark as Done ✅
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center">
              <Text className="text-2xl mb-2">🎉✨🎊</Text>
              <Text className="text-xl font-bold text-green-600 text-center mb-3">
                Great job! Keep it up 💪
              </Text>
              <Text className="text-gray-500 text-center italic">{quote}</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
