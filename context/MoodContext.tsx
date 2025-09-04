import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MoodEntry, MoodValue } from "@/types/mood";
import { createMood, deleteMood, subscribeMoodsByRange, toDateKey, updateMood } from "@/services/moodService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

type MoodCtx = {
  loading: boolean;
  moods: MoodEntry[];
  add: (mood: MoodValue, intensity: number, note?: string) => Promise<void>;
  edit: (id: string, patch: Partial<MoodEntry>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  userId?: string | null;
};

const Ctx = createContext<MoodCtx>({
  loading: true,
  moods: [],
  add: async () => {},
  edit: async () => {},
  remove: async () => {},
  userId: null,
});

export const useMoods = () => useContext(Ctx);

// helper: current week keys (Mon..Sun)
const getWeekRangeKeys = () => {
  const now = new Date();
  const day = now.getDay(); // 0 Sun..6 Sat
  // set Monday as week start
  const diffToMonday = ((day + 6) % 7);
  const start = new Date(now);
  start.setDate(now.getDate() - diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { fromKey: toDateKey(start), toKey: toDateKey(end) };
};

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // track auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserId(u?.uid ?? null);
    });
    return unsub;
  }, []);

  // subscribe weekly moods for Home
  useEffect(() => {
    if (!userId) {
      setMoods([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { fromKey, toKey } = getWeekRangeKeys();
    const unsub = subscribeMoodsByRange(userId, fromKey, toKey, (items) => {
      setMoods(items);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const value = useMemo<MoodCtx>(() => ({
    loading,
    moods,
    userId,
    add: async (mood, intensity, note) => {
      if (!userId) return;
      await createMood({ userId, mood, intensity, note });
    },
    edit: async (id, patch) => updateMood(id, patch),
    remove: async (id) => deleteMood(id),
  }), [loading, moods, userId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
