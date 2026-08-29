import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebaseConfig";

const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#666666";
const LINE = "#BDBDBD";
const SECTION_GRAY = "#D9D9D9";

export default function SettingsScreen({ navigation }) {
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [trustedContact, setTrustedContact] = useState("");
  const [trustedRelation, setTrustedRelation] = useState("");
  const [hasConsent, setHasConsent] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const loadTrustedContact = async () => {
      const savedContact = await AsyncStorage.getItem("trustedContact");
      const savedRelation = await AsyncStorage.getItem("trustedRelation");

      if (savedContact) {
        setTrustedContact(savedContact);
      }

      if (savedRelation) {
        setTrustedRelation(savedRelation);
      }
    };

    loadTrustedContact();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaveTrustedContact = async () => {
    const cleanContact = trustedContact.trim();
    const cleanRelation = trustedRelation.trim();

    if (!cleanContact) {
      Alert.alert(
        "Contact needed",
        "Please enter a phone number or contact detail."
      );
      return;
    }

    if (!cleanRelation) {
      Alert.alert("Relation needed", "Please enter who this person is to you.");
      return;
    }

    if (!hasConsent) {
      Alert.alert(
        "Consent needed",
        "Please confirm that this trusted person can be contacted when you choose to ask for help."
      );
      return;
    }

    try {
      await AsyncStorage.setItem("trustedContact", cleanContact);
      await AsyncStorage.setItem("trustedRelation", cleanRelation);

      if (currentUser) {
        await setDoc(
          doc(db, "users", currentUser.uid, "trustedContacts", "primary"),
          {
            contactInfo: cleanContact,
            relation: cleanRelation,
            consentGiven: true,
            purpose:
              "Used only when the user chooses to get help or contact a trusted person.",
            updatedAt: serverTimestamp(),
          }
        );
      }

      setHelpModalVisible(false);

      Alert.alert(
        "Trusted contact saved",
        "This contact will only be used when you choose to ask for help."
      );
    } catch (error) {
      Alert.alert("Save failed", "Please check your connection and try again.");
    }
  };

  const deleteQueryCollection = async (collectionName, uid) => {
    const q = query(collection(db, collectionName), where("userId", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    const batch = writeBatch(db);

    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    await batch.commit();
  };

  const deleteUserSubcollection = async (uid, subcollectionName) => {
    const snapshot = await getDocs(
      collection(db, "users", uid, subcollectionName)
    );

    if (snapshot.empty) {
      return;
    }

    const batch = writeBatch(db);

    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    await batch.commit();
  };

  const clearLocalUserData = async () => {
    const allKeys = await AsyncStorage.getAllKeys();

    const keysToRemove = allKeys.filter(
      (key) =>
        key === "isRegisteredOnThisPhone" ||
        key === "healioNickname" ||
        key === "hasSeenOnboarding" ||
        key === "trustedContact" ||
        key === "trustedRelation" ||
        key.startsWith("dailyGoals_") ||
        key.startsWith("dailyLog_")
    );

    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("No user found", "Please log in again and try.");
      return;
    }

    if (!deletePassword.trim()) {
      Alert.alert(
        "Password needed",
        "Please enter your password to delete your account."
      );
      return;
    }

    Alert.alert(
      "Delete account?",
      "This will remove your Healio account and stored app data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);

            try {
              const credential = EmailAuthProvider.credential(
                user.email,
                deletePassword
              );

              await reauthenticateWithCredential(user, credential);

              // Delete top-level collections that store userId.
              await deleteQueryCollection("moodCheckIns", user.uid);
              await deleteQueryCollection("journalEntries", user.uid);
              await deleteQueryCollection("faceScanResults", user.uid);
              await deleteQueryCollection("chatMessages", user.uid);
              await deleteQueryCollection("activityLogs", user.uid);

              // Delete user subcollections.
              await deleteUserSubcollection(user.uid, "chatMessages");
              await deleteUserSubcollection(user.uid, "chatMemory");
              await deleteUserSubcollection(user.uid, "trustedContacts");

              // Delete user profile document.
              await deleteDoc(doc(db, "users", user.uid));

              // Clear local data so app behaves like a new user.
              await clearLocalUserData();

              // Delete Firebase Authentication account.
              await deleteUser(user);

              setDeleteModalVisible(false);
              setDeletePassword("");

              navigation.reset({
                index: 0,
                routes: [{ name: "Splash" }],
              });
            } catch (error) {
              if (
                error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-credential"
              ) {
                Alert.alert(
                  "Wrong password",
                  "Please check your password and try again."
                );
              } else if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                  "Login again needed",
                  "For security, please log in again before deleting your account."
                );
              } else {
                Alert.alert(
                  "Delete failed",
                  "Something went wrong while deleting your account. Please try again."
                );
              }
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  const openComingSoon = (title) => {
    Alert.alert(title, "This feature will be added later.");
  };

  const SettingRow = ({ icon, label, onPress }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
          <Ionicons name="chevron-back" size={31} color={BLACK} />
        </TouchableOpacity>

        <Text style={styles.title}>Settings</Text>

        <View style={{ width: 31 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.line} />

        <SettingRow
          label="Profile"
          icon={
            <Ionicons
              name="person-circle-outline"
              size={25}
              color={BLACK}
            />
          }
          onPress={() =>
            navigation.navigate("ProfileSettings")
            }
            />

        <SettingRow
          label="Add Help"
          icon={
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={25}
              color={BLACK}
            />
          }
          onPress={() => setHelpModalVisible(true)}
        />

        <View style={styles.sectionBreak} />

        <SettingRow
          label="Notifications"
          icon={
            <Ionicons
              name="notifications-outline"
              size={24}
              color={BLACK}
            />
          }
          onPress={() => 
            navigation.navigate("NotificationsSettings")
          }
            />

        <SettingRow
          label="Feedback"
          icon={
            <MaterialCommunityIcons
              name="message-star-outline"
              size={24}
              color={BLACK}
            />
          }
          onPress={() => 
            navigation.navigate("Feedback")
          }
          />

        <View style={styles.sectionBreak} />

        <SettingRow
          label="Data Privacy"
          icon={
            <MaterialCommunityIcons
              name="lock-check-outline"
              size={24}
              color={BLACK}
            />
          }
          onPress={() =>
            navigation.navigate("DataPrivacy")
          }
        />

        <SettingRow
          label="Delete my Account"
          icon={<Feather name="trash-2" size={24} color={BLACK} />}
          onPress={() => setDeleteModalVisible(true)}
        />

        <SettingRow
          label="Log Out"
          icon={<Feather name="log-out" size={24} color={BLACK} />}
          onPress={handleLogout}
        />
      </ScrollView>

      <Modal
        visible={helpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalKeyboard}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Help Contact</Text>

              <Text style={styles.modalDescription}>
                Add one trusted person you feel safe contacting. Healio will not
                contact them automatically. This information is for moments when
                you choose to ask for support.
              </Text>

              <Text style={styles.inputLabel}>
                Phone number or contact detail
              </Text>

              <TextInput
                style={styles.input}
                placeholderTextColor="#A9A9A9"
                value={trustedContact}
                onChangeText={setTrustedContact}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Relation</Text>

              <TextInput
                style={styles.input}
                placeholder="Example: Parent, friend, cousin"
                placeholderTextColor="#A9A9A9"
                value={trustedRelation}
                onChangeText={setTrustedRelation}
              />

              <View style={styles.consentRow}>
                <Switch
                  value={hasConsent}
                  onValueChange={setHasConsent}
                  trackColor={{ false: "#D9D9D9", true: "#CDEBD5" }}
                  thumbColor={hasConsent ? GREEN : "#FFFFFF"}
                />

                <Text style={styles.consentText}>
                  I confirm this person can be used as my trusted help contact
                  when I choose to get support.
                </Text>
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setHelpModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleSaveTrustedContact}
                >
                  <Text style={styles.confirmText}>Save Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalKeyboard}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Delete Account</Text>

              <Text style={styles.inputLabel}>Enter password to confirm</Text>

              <TextInput
                style={styles.input}
                placeholder="Your password"
                placeholderTextColor="#A9A9A9"
                value={deletePassword}
                onChangeText={setDeletePassword}
                secureTextEntry
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setDeleteModalVisible(false);
                    setDeletePassword("");
                  }}
                  disabled={isDeleting}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 78,
    paddingHorizontal: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "Itim_400Regular",
    fontSize: 26,
    color: BLACK,
  },

  line: {
    height: 1,
    backgroundColor: LINE,
  },

  row: {
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    color: BLACK,
    marginLeft: 26,
  },

  sectionBreak: {
    height: 40,
    backgroundColor: SECTION_GRAY,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
  },

  modalKeyboard: {
    width: "100%",
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
  },

  modalTitle: {
    fontFamily: "Itim_400Regular",
    fontSize: 26,
    color: BLACK,
    textAlign: "center",
  },

  modalDescription: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: GRAY,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 18,
  },

  warningText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: BLACK,
    textAlign: "center",
    marginBottom: 18,
  },

  inputLabel: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    color: BLACK,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 15,
    color: BLACK,
    marginBottom: 16,
  },

  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  consentText: {
    flex: 1,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: GRAY,
    marginLeft: 12,
  },

  modalButtonRow: {
    flexDirection: "row",
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  deleteButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  cancelText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    color: BLACK,
  },

  confirmText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});