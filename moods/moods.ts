import { MaterialCommunityIcons } from "@expo/vector-icons";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface Mood {
  key: string;
  label: string;
  icon: IconName; // now icon type is safe
  colors: [string, string];
}
