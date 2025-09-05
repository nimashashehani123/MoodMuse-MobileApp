import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { MoodEntry } from "@/types/mood";

// Firestore collection ref
const moodsRef = collection(db, "moods");

// helper: YYYY-MM-DD key
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

/**
 * Create new mood entry
 */
export const createMood = async (
  entry: Omit<MoodEntry, "id" | "createdAt" | "dateKey">
) => {
  const now = new Date();
  const docRef = await addDoc(moodsRef, {
    ...entry,
    createdAt: serverTimestamp(),
    dateKey: toDateKey(now),
  });
  return docRef.id; // return Firestore doc id
};

/**
 * Realtime subscription (between two dates)
 */
export const subscribeMoodsByRange = (
  userId: string,
  fromKey: string,
  toKey: string,
  cb: (items: MoodEntry[]) => void
) => {
  const q = query(
    moodsRef,
    where("userId", "==", userId),
    where("dateKey", ">=", fromKey),
    where("dateKey", "<=", toKey),
    orderBy("dateKey", "desc")
  );

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as any) } as MoodEntry)
    );
    cb(items);
  });
};

/**
 * Update mood entry
 */
export const updateMood = async (id: string, patch: Partial<MoodEntry>) => {
  const ref = doc(db, "moods", id);
  await updateDoc(ref, patch as any);
};

/**
 * Delete mood entry
 */
export const deleteMood = async (id: string) => {
  const ref = doc(db, "moods", id);
  await deleteDoc(ref);
};

/**
 * Get moods by range (non-realtime)
 */
export const getMoodsByDateRange = async (
  userId: string,
  fromKey: string,
  toKey: string
) => {
  const q = query(
    moodsRef,
    where("userId", "==", userId),
    where("dateKey", ">=", fromKey),
    where("dateKey", "<=", toKey),
    orderBy("dateKey", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as any) } as MoodEntry)
  );
};
