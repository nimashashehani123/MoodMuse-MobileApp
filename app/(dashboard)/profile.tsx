import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { MoodEntry, MoodValue } from "@/types/mood";
import { getMoodsByUser, deleteMood, updateMood } from "@/services/moodService";
import { auth } from "@/firebase";
import { getUserProfile, UserProfile } from "@/services/userService";
import { Image } from "react-native";


export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);


  // for edit modal
  const [editVisible, setEditVisible] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editIntensity, setEditIntensity] = useState(5);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      setLoading(true);

      try {
        // Fetch user profile
        const userData = await getUserProfile(uid);
        setProfile(userData);

        // Fetch moods
        const data = await getMoodsByUser(uid);
        setMoods(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);



  const handleDelete = async (id: string) => {
    await deleteMood(id);
    setMoods(moods.filter(m => m.id !== id));
  };

  const handleOpenEdit = (mood: MoodEntry) => {
    setEditId(mood.id!);
    setEditNote(mood.note || "");
    setEditIntensity(mood.intensity);
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    await updateMood(editId, { note: editNote, intensity: editIntensity });
    setMoods(moods.map(m => (m.id === editId ? { ...m, note: editNote, intensity: editIntensity } : m)));
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
