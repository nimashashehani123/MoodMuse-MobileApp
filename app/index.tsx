import { Text, View } from "react-native";
import "../firebase";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-900 font-bold">Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
