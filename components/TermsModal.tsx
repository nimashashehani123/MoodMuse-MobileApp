import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const TermsModal = () => {
  const [visible, setVisible] = useState(false);

  const termsText = `
Welcome to our App!

1. You agree to use this app responsibly.
2. We respect your privacy and protect your data.
3. Tasks and moods are for personal use only.
4. The app may receive updates without prior notice.
5. By using this app, you agree to these terms.

Thank you!
`;

  return (
    <View>
      {/* Open button */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.openBtn}>
        <Text style={styles.openText}>View Terms & Conditions</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Terms & Conditions</Text>
          <ScrollView style={{ marginVertical: 10 }}>
            <Text style={styles.termsText}>{termsText}</Text>
          </ScrollView>

          <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  openBtn: {
    padding: 12,
    backgroundColor: "#6366F1",
    borderRadius: 8,
    marginVertical: 10,
  },
  openText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
