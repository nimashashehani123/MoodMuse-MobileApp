import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Task,
  createTask,
  updateTask,
  deleteTask,
  subscribeTasks,
} from "@/services/taskService";
import { Picker } from "@react-native-picker/picker";

const moodOptions: { value: string; label: string }[] = [
  { value: "happy", label: "😊 Happy" },
  { value: "calm", label: "😌 Calm" },
  { value: "sad", label: "😢 Sad" },
  { value: "angry", label: "😡 Angry" },
  { value: "stressed", label: "😫 Stressed" },
  { value: "excited", label: "🤩 Excited" },
];

const AdminDashboard = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMood, setNewMood] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMood, setEditMood] = useState("");

  useEffect(() => {
    // Redirect mobile users away
    if (Platform.OS !== "web") {
      router.replace("/home");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeTasks(setTasks);
    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (!newTitle || !newMood) return Alert.alert("Enter title and mood");
    try {
      await createTask({ title: newTitle, mood: newMood });
      setNewTitle("");
      setNewMood("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setEditTitle(task.title);
    setEditMood(task.mood);
    setEditModalVisible(true);
  };

  const handleUpdateTask = async () => {
    if (!currentTask) return;
    try {
      await updateTask(currentTask.id!, { title: editTitle, mood: editMood });
      setEditModalVisible(false);
      setCurrentTask(null);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (Platform.OS !== "web") return null;

  return (
    <ScrollView className="flex-1 p-8 bg-gray-50">
      <Text className="text-3xl font-bold mb-6 text-center">Admin Dashboard</Text>

      {/* Add Task */}
      <View className="mb-6 space-y-3">
        <TextInput
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="Task Title"
          className="border px-3 py-2 rounded"
        />
        <Picker
          selectedValue={newMood}
          onValueChange={(itemValue: React.SetStateAction<string>) => setNewMood(itemValue)}
          className="border px-3 py-2 rounded"
        >
          <Picker.Item label="Select Mood" value="" />
          {moodOptions.map((m) => (
            <Picker.Item key={m.value} label={m.label} value={m.value} />
          ))}
        </Picker>
        <TouchableOpacity
          onPress={handleAddTask}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          <Text className="text-white font-semibold text-center">Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <View className="space-y-4">
        {tasks.map((task) => (
          <View
            key={task.id}
            className="bg-white rounded shadow p-4 flex-row justify-between items-center"
          >
            <View>
              <Text className="font-semibold text-lg">{task.title}</Text>
              <Text className="text-gray-500">
                {moodOptions.find((m) => m.value === task.mood)?.label || task.mood}
              </Text>
              <Text className="text-gray-400 text-sm">
                {task.createdAt?.toDate?.()?.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => openEditModal(task)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTask(task.id!)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-96 p-6 rounded shadow">
            <Text className="text-xl font-bold mb-4">Edit Task</Text>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              className="border px-3 py-2 rounded mb-3"
            />
            <Picker
              selectedValue={editMood}
              onValueChange={(itemValue: React.SetStateAction<string>) => setEditMood(itemValue)}
              className="border px-3 py-2 rounded mb-4"
            >
              {moodOptions.map((m) => (
                <Picker.Item key={m.value} label={m.label} value={m.value} />
              ))}
            </Picker>
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="px-4 py-2 rounded border"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateTask}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AdminDashboard;
