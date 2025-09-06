import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Task } from "@/types/task";

const taskRef = collection(db, "tasks");

// Create task
export const createTask = async (task: Omit<Task, "id" | "createdAt">) => {
  await addDoc(taskRef, {
    ...task,
    createdAt: serverTimestamp(),
  });
};

// Delete task
export const deleteTask = async (id: string) => {
  await deleteDoc(doc(db, "tasks", id));
};

// Update task
export const updateTask = async (id: string, data: Partial<Task>) => {
  await updateDoc(doc(db, "tasks", id), data);
};

// Get all tasks once
export const getAllTasks = async (): Promise<Task[]> => {
  const snap = await getDocs(taskRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Task[];
};

// Subscribe realtime
export const subscribeTasks = (cb: (tasks: Task[]) => void) => {
  return onSnapshot(taskRef, (snapshot) => {
    const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Task[];
    cb(all);
  });
};
