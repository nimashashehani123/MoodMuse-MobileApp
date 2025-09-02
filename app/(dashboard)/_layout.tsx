import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "@/app/localization";

const tabs = [
  { name: "home", icon: "home-filled", labelKey: "tabHome" },
  { name: "mood", icon: "mood", labelKey: "tabTask" },
  { name: "journal", icon: "book", labelKey: "tabJournal" },
  { name: "profile", icon: "person", labelKey: "tabProfile" },
] as const;

export default function DashboardLayout() {
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang === "si") setLang("si");
    };
    loadLanguage();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#A1A1AA",
        tabBarStyle: {
          height: 65,
          paddingVertical: 5,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 5,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      {tabs.map(({ name, icon, labelKey }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: strings[lang][labelKey],
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
