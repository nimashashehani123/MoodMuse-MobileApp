// MoodScreen.tsx
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
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { MoodValue } from "@/types/mood";
import { createMood } from "@/services/moodService";
import { getAllTasks } from "@/services/taskService";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase";
import Svg, { Circle } from "react-native-svg";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";

// Animated Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 12;
const CIRCLE_RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const quotes = [
  "Every day may not be good… but there’s something good in every day 🌈",
  "Little progress each day adds up to big results 🚀",
  "Feel your feelings. They are valid 💙",
  "You are stronger than you think 💪",
];

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

const moodGradients: Record<MoodValue, [string, string]> = {
  happy: ["#FFEF9F", "#FFB199"],
  calm: ["#A1F0C4", "#7EE8C1"],
  sad: ["#C3CFE2", "#667EEA"],
  angry: ["#FEC163", "#FF6B6B"],
  stressed: ["#F5C7F7", "#C1D3FF"],
  excited: ["#FFD1FF", "#B8B6FF"],
};

export default function MoodScreen() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [mood, setMood] = useState<MoodValue>("happy");
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [task, setTask] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [quote, setQuote] = useState("");

  const circleAnim = useRef(new Animated.Value(0)).current;

  // Animate circle when intensity changes
  useEffect(() => {
    Animated.timing(circleAnim, {
      toValue: intensity,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [intensity]);

  // Dark mode subscription
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
  const gradient = moodGradients[mood] || ["#fff", "#eee"];

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

  const resetState = () => {
    setMood("happy");
    setIntensity(5);
    setNote("");
    setTask(null);
    setDone(false);
    setQuote("");
  };

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

    // Alert on save
    Alert.alert("✅ Mood Saved", "Your mood has been saved successfully!");
  };

  const handleMarkDone = () => {
    setDone(true);

    setTimeout(() => {
      resetState(); // Clear mood page
      router.replace("/profile");
    }, 1800);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={darkMode ? ["#0f1724", "#111827"] : gradient}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          {/* Header */}
          <LinearGradient
            colors={[theme.primary, theme.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, borderRadius: 20, marginBottom: 24 }}
          >
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>
              Hi {user?.displayName || "Friend"} 👋
            </Text>
            <Text style={{ color: "#fff", marginTop: 6, opacity: 0.9 }}>
              How are you feeling right now? Choose a mood and save.
            </Text>
          </LinearGradient>

          {/* Mood Picker */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            {(
              ["happy", "calm", "sad", "angry", "stressed", "excited"] as MoodValue[]
            ).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMood(m)}
                style={{
                  width: "30%",
                  padding: 18,
                  borderRadius: 14,
                  alignItems: "center",
                  marginBottom: 16,
                  backgroundColor: mood === m ? theme.primary : theme.card,
                }}
              >
                <Text
                  style={{ fontSize: 26, color: mood === m ? "#fff" : theme.text }}
                >
                  {moodEmoji(m)}
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: "700",
                    color: mood === m ? "#fff" : theme.subtext,
                    textTransform: "capitalize",
                  }}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Circular Intensity */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={darkMode ? "#1b2430" : "#eee"}
                strokeWidth={STROKE_WIDTH}
              />
              <AnimatedCircle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={theme.accent}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={circleAnim.interpolate({
                  inputRange: [0, 10],
                  outputRange: [CIRCLE_CIRCUMFERENCE, 0],
                })}
              />
            </Svg>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: "700",
                color: theme.text,
              }}
            >
              Intensity: {intensity}/10
            </Text>
          </View>

          {/* Intensity Slider */}
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={intensity}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={darkMode ? "transparent" : theme.subtext}
            thumbTintColor={theme.accent}
            onValueChange={setIntensity}
          />

          {/* Note */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: darkMode ? "#2b3440" : "#E5E7EB",
              borderRadius: 12,
              padding: 12,
              marginTop: 12,
              backgroundColor: darkMode ? "#0f1724" : theme.card,
              color: theme.text,
            }}
            placeholder="Add a note (optional)"
            placeholderTextColor={darkMode ? "#6b7280" : theme.subtext}
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: theme.primary,
              padding: 14,
              borderRadius: 12,
              marginTop: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Save Mood</Text>
          </TouchableOpacity>

          {/* Quote */}
          {quote ? (
            <View
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 14,
                backgroundColor: darkMode ? "#0f1620" : "#fff",
              }}
            >
              <Text
                style={{ fontSize: 14, color: theme.subtext, marginBottom: 4 }}
              >
                Today's Inspiration
              </Text>
              <Text style={{ color: theme.text, fontStyle: "italic" }}>
                {quote}
              </Text>
            </View>
          ) : null}

          {/* Task */}
          {task && (
            <View
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 16,
                backgroundColor: darkMode ? "#0b1220" : "#fff",
              }}
            >
              {!done ? (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: theme.primary,
                      marginBottom: 8,
                    }}
                  >
                    💡 Suggested Task
                  </Text>
                  <Text style={{ color: theme.text }}>{task}</Text>
                  <TouchableOpacity
                    onPress={handleMarkDone}
                    style={{
                      marginTop: 16,
                      backgroundColor: "#10B981",
                      padding: 12,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Mark as Done ✅
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text
                  style={{
                    color: theme.subtext,
                    textAlign: "center",
                    marginTop: 8,
                    fontStyle: "italic",
                  }}
                >
                  {quote}
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
