import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { MoodEntry } from "@/types/mood";
import {
  deleteMood,
  updateMood,
  subscribeMoodsByRange,
} from "@/services/moodService";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { UserProfile } from "@/services/userService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

// 🎨 Mood Colors
const moodColors: Record<string, [string, string]> = {
  happy: ["#f9d976", "#f39f86"],
  calm: ["#a1c4fd", "#c2e9fb"],
  sad: ["#d3cce3", "#e9e4f0"],
  angry: ["#f5576c", "#f093fb"],
  stressed: ["#fbc2eb", "#a6c1ee"],
  excited: ["#fddb92", "#d1fdff"],
};

// 😀 Mood Emojis
const moodEmojis: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  sad: "😢",
  angry: "😡",
  stressed: "😰",
  excited: "🤩",
};

// 🔧 Helper: generate date range for Calendar marking
const getRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  let curr = new Date(start);
  const last = new Date(end);
  while (curr <= last) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);

  // Edit states
  const [editVisible, setEditVisible] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editIntensity, setEditIntensity] = useState(5);
  const [editId, setEditId] = useState<string | null>(null);

  // 📅 Filter states
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 🔄 Load user profile + moods
  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      setLoading(true);

      const unsubProfile = onSnapshot(doc(db, "users", uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfile & { darkMode?: boolean };
          setProfile({
            ...data,
            photoURL: data.photoURL ? `${data.photoURL}?t=${Date.now()}` : null,
          });
          setDarkMode(data.darkMode || false);
        }
      });

      const unsubscribeMoods = subscribeMoodsByRange(
        uid,
        startDate || "2000-01-01",
        endDate || "2100-12-31",
        (items) => {
          const sorted = [...items].sort((a, b) =>
            a.dateKey < b.dateKey ? 1 : -1
          );
          setMoods(sorted);
          setLoading(false);
        }
      );

      return () => {
        unsubProfile();
        unsubscribeMoods();
      };
    }, [user, startDate, endDate])
  );

  // ❌ Delete Mood
  const handleDelete = (id: string) => {
    Alert.alert("Delete Mood", "Are you sure you want to delete this mood entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMood(id);
          setMoods((prev) => prev.filter((m) => m.id !== id));
        },
      },
    ]);
  };

  // ✏️ Edit Mood
  const handleOpenEdit = (mood: MoodEntry) => {
    setEditId(mood.id!);
    setEditNote(mood.note || "");
    setEditIntensity(mood.intensity);
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    await updateMood(editId, { note: editNote, intensity: editIntensity });
    setEditVisible(false);
  };

  // 🎨 Render Mood Card
  const renderItem = ({ item }: { item: MoodEntry }) => {
    const colors = moodColors[item.mood] || ["#ccc", "#eee"];
    const emoji = moodEmojis[item.mood] || "🙂";

    return (
      <LinearGradient
        colors={colors as [string, string]}
        style={{
          marginBottom: 16,
          borderRadius: 20,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        {/* Top Row */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 32 }}>{emoji}</Text>
          <Text style={{ fontSize: 12, color: "#222" }}>{item.dateKey}</Text>
        </View>

        {/* Mood Title */}
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 6, color: "#222" }}>
          {item.mood}
        </Text>

        {/* Intensity Bar */}
        <View
          style={{
            height: 6,
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 3,
            marginBottom: 8,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${(item.intensity / 10) * 100}%`,
              backgroundColor: "rgba(0,0,0,0.4)",
              height: "100%",
            }}
          />
        </View>

        {/* Note */}
        {item.note ? (
          <Text style={{ fontStyle: "italic", marginBottom: 8, color: "#222" }}>
            “{item.note}”
          </Text>
        ) : null}

        {/* Actions */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity onPress={() => handleOpenEdit(item)} style={{ marginRight: 16 }}>
            <Ionicons name="create-outline" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id!)}>
            <Ionicons name="trash-outline" size={24} color="#e53935" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkMode ? "#1a202c" : "#f5f5f5",
        padding: 16,
      }}
    >
      {/* Profile Section */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        {profile?.photoURL ? (
          <Image
            source={{ uri: profile.photoURL }}
            style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 8 }}
          />
        ) : (
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              marginBottom: 8,
              backgroundColor: "#a1c4fd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
        )}
        <Text style={{ fontSize: 22, fontWeight: "700", color: darkMode ? "#fff" : "#000" }}>
          {profile?.name || "User"}
        </Text>
        <Text style={{ color: darkMode ? "#ccc" : "#666" }}>{profile?.email}</Text>
      </View>

      {/* 🔍 Filter Controls */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setCalendarVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#5a67f2",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 14,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontWeight: "600" }}>Select Date Range</Text>
        </TouchableOpacity>

        {(startDate || endDate) && (
          <TouchableOpacity
            onPress={() => {
              setStartDate(null);
              setEndDate(null);
            }}
            style={{
              backgroundColor: "#e53935",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 14,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mood List */}
      {loading ? (
        <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
          Loading...
        </Text>
      ) : (
        <FlatList
          data={moods}
          keyExtractor={(item) => item.id!}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* 🗓 Calendar Bottom Sheet */}
      <Modal visible={calendarVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 40,
              paddingTop: 16,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>Pick a Date Range</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <Calendar
              markingType={"period"}
              markedDates={{
                ...(startDate && {
                  [startDate]: { startingDay: true, color: "#5a67f2", textColor: "white" },
                }),
                ...(endDate && {
                  [endDate]: { endingDay: true, color: "#5a67f2", textColor: "white" },
                }),
                ...(startDate &&
                  endDate && {
                    ...getRange(startDate, endDate).reduce(
                      (acc, d) => ({
                        ...acc,
                        [d]: { color: "#9fa8da", textColor: "white" },
                      }),
                      {}
                    ),
                  }),
              }}
              onDayPress={(day) => {
                if (!startDate || (startDate && endDate)) {
                  setStartDate(day.dateString);
                  setEndDate(null);
                } else {
                  setEndDate(day.dateString);
                }
              }}
            />

            {/* Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                style={{ padding: 12, backgroundColor: "#ccc", borderRadius: 8, minWidth: 100, alignItems: "center" }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setCalendarVisible(false);
                }}
                style={{ padding: 12, backgroundColor: "#e53935", borderRadius: 8, minWidth: 100, alignItems: "center" }}
              >
                <Text style={{ color: "#fff" }}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                style={{ padding: 12, backgroundColor: "#5a67f2", borderRadius: 8, minWidth: 100, alignItems: "center" }}
              >
                <Text style={{ color: "#fff" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: darkMode ? "#2d3748" : "#fff",
              width: "90%",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 12,
                color: darkMode ? "#fff" : "#000",
              }}
            >
              Edit Mood
            </Text>
            <TextInput
              placeholder="Update note"
              placeholderTextColor={darkMode ? "#ccc" : "#999"}
              value={editNote}
              onChangeText={setEditNote}
              style={{
                borderWidth: 1,
                borderColor: darkMode ? "#555" : "#ccc",
                borderRadius: 12,
                padding: 10,
                marginBottom: 12,
                color: darkMode ? "#fff" : "#000",
              }}
            />
            <Text style={{ marginBottom: 6, color: darkMode ? "#fff" : "#000" }}>
              Intensity: {editIntensity}/10
            </Text>
            <TextInput
              keyboardType="numeric"
              value={String(editIntensity)}
              onChangeText={(val) => setEditIntensity(Number(val))}
              style={{
                borderWidth: 1,
                borderColor: darkMode ? "#555" : "#ccc",
                borderRadius: 12,
                padding: 10,
                marginBottom: 20,
                color: darkMode ? "#fff" : "#000",
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setEditVisible(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: darkMode ? "#ccc" : "#555", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={{
                  backgroundColor: "#5a67f2",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
