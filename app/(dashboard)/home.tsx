import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { getAllTasks } from "@/services/taskService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Firestore darkMode subscription
  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;

    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists() && snap.data().darkMode !== undefined) {
        setDarkMode(snap.data().darkMode);
      }
    });
    return () => unsub();
  }, [user]);

  const toggleDarkMode = async () => {
    if (!user?.uid) return;
    await setDoc(
      doc(db, "users", user.uid),
      { darkMode: !darkMode },
      { merge: true }
    );
  };

  const lightTheme = {
    background: "#F9FAFB",
    text: "#111827",
    subText: "#6B7280",
    card: "#fff",
    gradient: ["#6366F1", "#8B5CF6"] as const,
  };

  const darkTheme = {
    background: "#0f172a",
    text: "#f8fafc",
    subText: "#cbd5e1",
    card: "#1e293b",
    gradient: ["#06b6d4", "#3b82f6"] as const,
  };

  const theme = darkMode ? darkTheme : lightTheme;

  // Fetch tasks
  useEffect(() => {
    const fetchData = async () => {
      const allTasks = await getAllTasks();
      setTasks(allTasks.slice(0, 3).map((t) => t.title));
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌞";
    else if (hour < 18) return "Good Afternoon ☀️";
    else return "Good Evening 🌙";
  };

  // === Popup + Pulse Animation for Mood Button ===
  const pulse = useSharedValue(0); // for scale & opacity popup

  useEffect(() => {
    // initial popup bounce
    pulse.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) }),
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowColor: theme.gradient[0],
    shadowOffset: { width: 0, height: 0 },
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Greeting + Theme Toggle */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={[styles.greetingText, { color: theme.text }]}>
              {user?.displayName ? `Hi ${user.displayName} 👋` : getGreeting()}
            </Text>
            <Text style={[styles.subGreeting, { color: theme.subText }]}>
              Hope you’re having a peaceful day
            </Text>
          </View>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons
              name={darkMode ? "moon" : "sunny"}
              size={26}
              color={theme.text}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Image */}
        <Animated.View entering={FadeInUp.duration(800)}>
          <Image
            source={{
              uri: "https://i.pinimg.com/1200x/34/20/a1/3420a1e6f686ee3e52e3dcdf3a87b7b3.jpg",
            }}
            style={styles.heroImage}
          />
        </Animated.View>

        {/* Mood Spotlight Card */}
        <Animated.View
          entering={FadeInUp.duration(900)}
          style={[styles.moodSpotlight, { backgroundColor: theme.card }]}
        >
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/63/03/a6/6303a6f6ee79b8f2cae745196bddc508.jpg",
            }}
            style={styles.moodImage}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={styles.overlay}
          />
          <View style={styles.moodContent}>
            <Text style={styles.moodTitle}>🌸 Mood of the Day</Text>
            <Text style={styles.moodDesc}>
              Stay calm, stay positive. Take things slow today ✨
            </Text>
          </View>
        </Animated.View>

        {/* Mood Quick Action */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Action
        </Text>

        {/* === Animated Pulse Button === */}
        <Animated.View style={pulseStyle}>
          <TouchableOpacity
            style={styles.moodButton}
            activeOpacity={0.8}
            onPress={() => router.navigate("/mood")}
          >
            <LinearGradient colors={theme.gradient} style={styles.moodGradient}>
              <Ionicons name="happy-outline" size={28} color="#fff" />
              <Text style={styles.moodText}>Log Your Mood</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Motivational Card */}
        <Animated.View
          entering={FadeInDown.duration(700)}
          style={[styles.tipCard, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.tipTitle, { color: theme.text }]}>💡 Daily Tip</Text>
          <Text style={[styles.tipText, { color: theme.subText }]}>
            Take 5 minutes to breathe deeply and reset your mind today.
          </Text>
        </Animated.View>

        {/* Recent Tasks */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Your Tasks
        </Text>
        {tasks.map((t, i) => (
          <Animated.View
            key={i}
            entering={FadeInUp.delay(200 * i)}
            style={[styles.taskCard, { backgroundColor: theme.card }]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={theme.gradient[0]}
            />
            <Text style={[styles.taskText, { color: theme.text }]}>{t}</Text>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greetingText: { fontSize: 24, fontWeight: "700" },
  subGreeting: { fontSize: 14, marginBottom: 12 },
  heroImage: {
    width: width - 40,
    height: 300,
    borderRadius: 20,
    resizeMode: "cover",
    marginBottom: 20,
  },
  moodSpotlight: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  moodImage: {
    width: width - 40,
    height: 100,
    borderRadius: 20,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  moodContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  moodTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4 },
  moodDesc: { fontSize: 14, fontWeight: "500", color: "#f1f5f9" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  moodButton: { marginBottom: 20 },
  moodGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  moodText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  tipCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tipTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  tipText: { fontSize: 14 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  taskText: { marginLeft: 10, fontSize: 15 },
});
