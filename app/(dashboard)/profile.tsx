import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { MoodEntry } from "@/types/mood";
import { getMoodsByUser, deleteMood, updateMood, subscribeMoodsByRange } from "@/services/moodService";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { UserProfile } from "@/services/userService";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [editVisible, setEditVisible] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editIntensity, setEditIntensity] = useState(5);
  const [editId, setEditId] = useState<string | null>(null);

  // 🔹 Runs every time Profile tab is focused
  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      setLoading(true);

      // 🔹 Realtime profile subscription
      const unsubProfile = onSnapshot(doc(db, "users", uid), (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      });

      // 🔹 Subscribe realtime moods
      const unsubscribeMoods = subscribeMoodsByRange(
        uid,
        "2000-01-01",
        "2100-12-31",
        (items) => {
          setMoods(items);
          setLoading(false);
        }
      );

      // Cleanup when leaving screen
      return () => {
        unsubProfile();
        unsubscribeMoods();
      };
    }, [user])
  );

  // Delete mood
  const handleDelete = async (id: string) => {
    await deleteMood(id);
    setMoods((prev) => prev.filter((m) => m.id !== id));
  };

  // Open edit modal
  const handleOpenEdit = (mood: MoodEntry) => {
    setEditId(mood.id!);
    setEditNote(mood.note || "");
    setEditIntensity(mood.intensity);
    setEditVisible(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editId) return;
    await updateMood(editId, { note: editNote, intensity: editIntensity });
    setEditVisible(false);
  };

  const renderItem = ({ item }: { item: MoodEntry }) => (
    <View className="bg-white p-4 mb-3 rounded-2xl shadow">
      <Text className="text-2xl">
        {item.mood === "happy" && "😊"}
        {item.mood === "calm" && "😌"}
        {item.mood === "sad" && "😢"}
        {item.mood === "angry" && "😡"}
        {item.mood === "stressed" && "😰"}
        {item.mood === "excited" && "🤩"} {item.mood}
      </Text>
      <Text className="text-gray-600">Intensity: {item.intensity}/10</Text>
      {item.note ? <Text className="italic">“{item.note}”</Text> : null}
      <Text className="text-xs text-gray-400 mt-1">{item.dateKey}</Text>

      <View className="flex-row mt-3 space-x-3">
        <TouchableOpacity
          onPress={() => handleOpenEdit(item)}
          className="bg-indigo-500 px-4 py-2 rounded-xl"
        >
          <Text className="text-white">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          className="bg-red-500 px-4 py-2 rounded-xl"
        >
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-6">
      {/* User Info */}
      <View className="items-center mb-6">
        {profile?.photoURL ? (
          <Image
            source={{ uri: profile.photoURL }}
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="bg-indigo-200 w-20 h-20 rounded-full items-center justify-center">
            <Text className="text-3xl">👤</Text>
          </View>
        )}
        <Text className="text-xl font-bold mt-2">{profile?.name || "User"}</Text>
        <Text className="text-gray-500">{profile?.email}</Text>
      </View>

      {/* Mood History */}
      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : (
        <FlatList
          data={moods}
          keyExtractor={(item) => item.id!}
          renderItem={renderItem}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-6 rounded-2xl w-4/5">
            <Text className="text-lg font-bold mb-3">Edit Mood</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 mb-4"
              placeholder="Update note"
              value={editNote}
              onChangeText={setEditNote}
            />
            <Text>Intensity: {editIntensity}/10</Text>
            <TextInput
              keyboardType="numeric"
              value={String(editIntensity)}
              onChangeText={(val) => setEditIntensity(Number(val))}
              className="border border-gray-300 rounded-xl p-2 mt-2"
            />
            <View className="flex-row mt-4 justify-end space-x-3">
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                className="bg-indigo-600 px-4 py-2 rounded-xl"
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
