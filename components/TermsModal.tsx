import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";

const { height } = Dimensions.get("window");

const TermsModal = () => {
  const [visible, setVisible] = useState(false);

  const termsText = `
Welcome to MoodMuse!

1. You agree to use this app responsibly.
2. We respect your privacy and protect your data.
3. Tasks and moods are for personal use only.
4. The app may receive updates without prior notice.
5. By using this app, you agree to these terms and conditions.

Thank you for using MoodMuse!
`;

  return (
    <View>
      {/* Open button */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.openBtn}>
        <Text style={styles.openText}>View Terms & Conditions</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.header}>Terms & Conditions</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.termsText}>{termsText}</Text>
            </ScrollView>
            <Pressable onPress={() => setVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  openBtn: {
    padding: 14,
    backgroundColor: "#6366F1",
    borderRadius: 12,
    marginVertical: 10,
    alignSelf: "center",
  },
  openText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scrollView: {
    marginVertical: 10,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  closeBtn: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 10,
    width: "50%",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
