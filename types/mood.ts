export type MoodValue =
  | "happy"
  | "calm"
  | "sad"
  | "angry"
  | "stressed"
  | "excited";

export interface MoodEntry {
  id?: string;
  userId: string;
  mood: MoodValue;
  intensity: number;    // 1..10
  note?: string;
  createdAt: any;       // Firebase Timestamp
  dateKey: string;      // "YYYY-MM-DD"
}
