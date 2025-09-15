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

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editIntensity, setEditIntensity] = useState(5);
  const [editId, setEditId] = useState<string | null>(null);

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
        "2000-01-01",
        "2100-12-31",
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
    }, [user])
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