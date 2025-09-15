// MoodScreen.tsx (Modified with History + Streak)
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { MoodValue } from "@/types/mood";
import { createMood, getRecentMoods } from "@/services/moodService"; // ⬅️ add getRecentMoods
import { getAllTasks } from "@/services/taskService";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase";

// quotes
const quotes = [
  "Every day may not be good… but there’s something good in every day 🌈",
  "Little progress each day adds up to big results 🚀",
  "Feel your feelings. They are valid 💙",
  "You are stronger than you think 💪",
];

// themes
const lightTheme = {
  background: "#F3F4F6",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  primary: "#6366F1",
  accent: "#8B5CF6",
};

const darkTheme = {
  background: "#111827",
  card: "#1F2937",
  text: "#F9FAFB",
  subtext: "#9CA3AF",
  primary: "#8B5CF6",
  accent: "#6366F1",
};

// emoji helper
const moodEmoji = (m: MoodValue) =>
  m === "happy"
    ? "😊"
    : m === "calm"
    ? "😌"
    : m === "sad"
    ? "😢"
    : m === "angry"
    ? "😡"
    : m === "stressed"
    ? "😰"
    : "🤩";

export default function MoodScreen() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [mood, setMood] = useState<MoodValue>("happy");
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [task, setTask] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [quote, setQuote] = useState("");
  const [history, setHistory] = useState<any[]>([]); // mood history
  const [streak, setStreak] = useState(0);

  // animation
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists() && snap.data().darkMode !== undefined) {
        setDarkMode(snap.data().darkMode);
      }
    });
    return () => unsub();
  }, []);

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 550,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Load history + streak
  useEffect(() => {
    if (!user) return;
    (async () => {
      const moods = await getRecentMoods(user.uid, 7); // last 7 days
      setHistory(moods);

      // calculate streak
      let streakCount = 0;
      const today = new Date().toDateString();
      let current = new Date(today);

      for (let m of moods) {
        const moodDate = new Date(m.createdAt?.toDate()).toDateString();
        if (moodDate === current.toDateString()) {
          streakCount++;
          current.setDate(current.getDate() - 1);
        } else {
          break;
        }
      }
      setStreak(streakCount);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    await createMood({ mood, intensity, note });

    const allTasks = await getAllTasks();
    const availableTasks = allTasks.filter((t) => t.mood === mood);

    const randomTask =
      availableTasks.length > 0
        ? availableTasks[Math.floor(Math.random() * availableTasks.length)].title
        : null;

    setTask(randomTask);
    setDone(false);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setNote("");
    setIntensity(5);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <Animated.View
          style={{
            opacity: headerFade,
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={[theme.primary, theme.accent]}
            style={{ padding: 20, borderRadius: 20 }}
          >
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>
              Hi {user?.displayName || "Friend"} 👋
            </Text>
            <Text style={{ color: "#fff", marginTop: 6 }}>
              How are you feeling right now?
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Streak Counter */}
        <View
          style={{
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: theme.text }}>
            🔥 {streak}-day streak
          </Text>
          <Text style={{ fontSize: 13, color: theme.subtext }}>
            Keep checking in daily!
          </Text>
        </View>

        {/* Mood Picker */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          {(["happy", "calm", "sad", "angry", "stressed", "excited"] as MoodValue[]).map(
            (m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMood(m)}
                style={{
                  width: "30%",
                  marginBottom: 16,
                  padding: 20,
                  borderRadius: 14,
                  alignItems: "center",
                  backgroundColor: mood === m ? theme.primary : theme.card,
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    color: mood === m ? "#fff" : theme.text,
                  }}
                >
                  {moodEmoji(m)}
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    fontWeight: "600",
                    color: mood === m ? "#fff" : theme.subtext,
                  }}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Intensity */}
        <Text style={{ fontSize: 16, marginBottom: 6, color: theme.text }}>
          Intensity: {intensity}/10
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={intensity}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.subtext}
          thumbTintColor={theme.accent}
          onValueChange={setIntensity}
        />

        {/* Note */}
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: darkMode ? "#374151" : "#E5E7EB",
            borderRadius: 12,
            padding: 12,
            marginTop: 20,
            backgroundColor: theme.card,
            color: theme.text,
          }}
          placeholder="Add a note (optional)"
          placeholderTextColor={theme.subtext}
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: theme.primary,
            marginTop: 20,
            padding: 16,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Save Mood
          </Text>
        </TouchableOpacity>

        {/* Mood History */}
        {history.length > 0 && (
          <View
            style={{
              marginTop: 24,
              backgroundColor: theme.card,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 12,
                color: theme.text,
              }}
            >
              Recent Check-ins
            </Text>
            {history.map((h, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 18 }}>{moodEmoji(h.mood)}</Text>
                <Text style={{ color: theme.text, flex: 1, marginLeft: 8 }}>
                  {h.mood} ({h.intensity}/10)
                </Text>
                <Text style={{ color: theme.subtext }}>
                  {new Date(h.createdAt?.toDate()).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
