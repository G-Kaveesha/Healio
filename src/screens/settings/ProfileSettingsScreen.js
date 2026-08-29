import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  auth,
  db,
} from "../../firebase/firebaseConfig";

/*
  Replace this filename with the actual fixed
  profile image in your project.
*/
const DEFAULT_PROFILE_IMAGE =
  require("../../../assets/images/profile.jpg");

const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#666666";
const LIGHT_GRAY = "#E0E0E0";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim()
  );
}

export default function ProfileSettingsScreen({
  navigation,
}) {
  const user = auth.currentUser;

  const [nickname, setNickname] = useState("");
  const [accountEmail, setAccountEmail] =
    useState(user?.email ?? "");

  const [newAccountEmail, setNewAccountEmail] =
    useState("");

  const [recoveryEmail, setRecoveryEmail] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmNewPassword,
    setConfirmNewPassword,
  ] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSavingProfile, setIsSavingProfile] =
    useState(false);

  const [isChangingEmail, setIsChangingEmail] =
    useState(false);

  const [
    isChangingPassword,
    setIsChangingPassword,
  ] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const profileReference = doc(
        db,
        "users",
        user.uid
      );

      const profileSnapshot = await getDoc(
        profileReference
      );

      const profileData =
        profileSnapshot.exists()
          ? profileSnapshot.data()
          : {};

      setNickname(
        profileData.nickname ||
          user.displayName ||
          ""
      );

      setAccountEmail(user.email ?? "");

      setRecoveryEmail(
        profileData.recoveryEmail || ""
      );
    } catch (error) {
      Alert.alert(
        "Unable to load profile",
        "Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const reauthenticateUser = async (
    password
  ) => {
    const currentUser = auth.currentUser;

    if (!currentUser?.email) {
      throw new Error(
        "The signed-in account has no email address."
      );
    }

    const credential =
      EmailAuthProvider.credential(
        currentUser.email,
        password
      );

    await reauthenticateWithCredential(
      currentUser,
      credential
    );
  };

  const saveProfileInformation = async () => {
    const currentUser = auth.currentUser;
    const cleanNickname = nickname.trim();
    const cleanRecoveryEmail =
      recoveryEmail.trim().toLowerCase();

    if (!currentUser) {
      Alert.alert(
        "Session unavailable",
        "Please log in again."
      );
      return;
    }

    if (cleanNickname.length < 2) {
      Alert.alert(
        "Nickname required",
        "Please enter a nickname with at least two characters."
      );
      return;
    }

    if (
      cleanRecoveryEmail &&
      !isValidEmail(cleanRecoveryEmail)
    ) {
      Alert.alert(
        "Invalid recovery email",
        "Please enter a valid email address."
      );
      return;
    }

    if (
      cleanRecoveryEmail &&
      cleanRecoveryEmail ===
        currentUser.email?.toLowerCase()
    ) {
      Alert.alert(
        "Use another email",
        "The recovery email should be different from your account email."
      );
      return;
    }

    setIsSavingProfile(true);

    try {
      await updateProfile(currentUser, {
        displayName: cleanNickname,
      });

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          nickname: cleanNickname,
          accountEmail:
            currentUser.email ?? "",
          recoveryEmail:
            cleanRecoveryEmail || null,
          profileImageType: "default",
          profileUpdatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      await AsyncStorage.setItem(
        "healioNickname",
        cleanNickname
      );

      Alert.alert(
        "Profile updated",
        "Your nickname and profile information have been saved."
      );
    } catch (error) {
      Alert.alert(
        "Update failed",
        "Your profile could not be updated. Please try again."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const requestAccountEmailChange =
    async () => {
      const currentUser = auth.currentUser;

      const cleanNewEmail =
        newAccountEmail.trim().toLowerCase();

      if (!currentUser) {
        Alert.alert(
          "Session unavailable",
          "Please log in again."
        );
        return;
      }

      if (!isValidEmail(cleanNewEmail)) {
        Alert.alert(
          "Invalid email",
          "Please enter a valid new email address."
        );
        return;
      }

      if (
        cleanNewEmail ===
        currentUser.email?.toLowerCase()
      ) {
        Alert.alert(
          "Same email",
          "Please enter a different email address."
        );
        return;
      }

      if (!currentPassword) {
        Alert.alert(
          "Current password required",
          "Enter your current password before changing the account email."
        );
        return;
      }

      setIsChangingEmail(true);

      try {
        await reauthenticateUser(
          currentPassword
        );

        await verifyBeforeUpdateEmail(
          currentUser,
          cleanNewEmail
        );

        await setDoc(
          doc(
            db,
            "users",
            currentUser.uid
          ),
          {
            pendingAccountEmail:
              cleanNewEmail,
            emailChangeRequestedAt:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        setNewAccountEmail("");
        setCurrentPassword("");

        Alert.alert(
          "Verification email sent",
          "Open the verification message sent to your new email address. Your sign-in email will change after verification."
        );
      } catch (error) {
        if (
          error.code ===
            "auth/invalid-credential" ||
          error.code ===
            "auth/wrong-password"
        ) {
          Alert.alert(
            "Incorrect password",
            "The current password you entered is incorrect."
          );
        } else if (
          error.code ===
          "auth/email-already-in-use"
        ) {
          Alert.alert(
            "Email already in use",
            "Another account is already using this email address."
          );
        } else if (
          error.code ===
          "auth/requires-recent-login"
        ) {
          Alert.alert(
            "Sign in again",
            "Please log out, log in again and retry this change."
          );
        } else {
          Alert.alert(
            "Email change failed",
            error.message ||
              "The verification email could not be sent."
          );
        }
      } finally {
        setIsChangingEmail(false);
      }
    };

  const changePassword = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Session unavailable",
        "Please log in again."
      );
      return;
    }

    if (!currentPassword) {
      Alert.alert(
        "Current password required",
        "Enter your current password."
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Password too short",
        "The new password must contain at least six characters."
      );
      return;
    }

    if (
      newPassword !== confirmNewPassword
    ) {
      Alert.alert(
        "Passwords do not match",
        "Please re-enter the new password."
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      await reauthenticateUser(
        currentPassword
      );

      await updatePassword(
        currentUser,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      Alert.alert(
        "Password changed",
        "Your account password has been updated."
      );
    } catch (error) {
      if (
        error.code ===
          "auth/invalid-credential" ||
        error.code ===
          "auth/wrong-password"
      ) {
        Alert.alert(
          "Incorrect password",
          "The current password you entered is incorrect."
        );
      } else if (
        error.code === "auth/weak-password"
      ) {
        Alert.alert(
          "Weak password",
          "Please choose a stronger password."
        );
      } else {
        Alert.alert(
          "Password change failed",
          "The password could not be updated. Please try again."
        );
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={WHITE}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={BLACK}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={WHITE}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={BLACK}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <View style={styles.imageSection}>
            <Image
              source={DEFAULT_PROFILE_IMAGE}
              style={styles.profileImage}
            />

            <Text style={styles.imageNote}>
              Healio currently uses a standard
              profile image for all users.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            Personal information
          </Text>

          <Text style={styles.label}>
            Nickname
          </Text>

          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Your nickname"
            placeholderTextColor={GRAY}
            maxLength={30}
          />

          <Text style={styles.label}>
            Account email
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.readOnlyInput,
            ]}
            value={accountEmail}
            editable={false}
          />

          <Text style={styles.label}>
            Recovery contact email
          </Text>

          <TextInput
            style={styles.input}
            value={recoveryEmail}
            onChangeText={setRecoveryEmail}
            placeholder="Optional recovery contact email"
            placeholderTextColor={GRAY}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.helperText}>
            This address is stored as an
            additional contact email. Firebase
            password-reset messages are sent to
            your account email.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={
              saveProfileInformation
            }
            disabled={isSavingProfile}
          >
            {isSavingProfile ? (
              <ActivityIndicator
                color={WHITE}
              />
            ) : (
              <Text
                style={styles.primaryButtonText}
              >
                Save Profile
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Change account email
          </Text>

          <Text style={styles.label}>
            New email address
          </Text>

          <TextInput
            style={styles.input}
            value={newAccountEmail}
            onChangeText={
              setNewAccountEmail
            }
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="New account email"
            placeholderTextColor={GRAY}
          />

          <Text style={styles.label}>
            Current password
          </Text>

          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={
              setCurrentPassword
            }
            secureTextEntry
            placeholder="Current password"
            placeholderTextColor={GRAY}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={
              requestAccountEmailChange
            }
            disabled={isChangingEmail}
          >
            {isChangingEmail ? (
              <ActivityIndicator
                color={WHITE}
              />
            ) : (
              <Text
                style={styles.primaryButtonText}
              >
                Send Email Verification
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Change password
          </Text>

          <Text style={styles.label}>
            Current password
          </Text>

          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={
              setCurrentPassword
            }
            secureTextEntry
            placeholder="Current password"
            placeholderTextColor={GRAY}
          />

          <Text style={styles.label}>
            New password
          </Text>

          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="New password"
            placeholderTextColor={GRAY}
          />

          <Text style={styles.label}>
            Confirm new password
          </Text>

          <TextInput
            style={styles.input}
            value={confirmNewPassword}
            onChangeText={
              setConfirmNewPassword
            }
            secureTextEntry
            placeholder="Re-enter new password"
            placeholderTextColor={GRAY}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={changePassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <ActivityIndicator
                color={WHITE}
              />
            ) : (
              <Text
                style={styles.primaryButtonText}
              >
                Change Password
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    height: 72,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  headerTitle: {
    fontFamily: "Itim_400Regular",
    fontSize: 26,
    color: BLACK,
  },

  headerSpace: {
    width: 40,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 45,
  },

  imageSection: {
    alignItems: "center",
    paddingVertical: 28,
  },

  profileImage: {
    width: 105,
    height: 105,
    borderRadius: 53,
    borderWidth: 1,
    borderColor: BLACK,
  },

  imageNote: {
    marginTop: 12,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 13,
    color: GRAY,
    textAlign: "center",
  },

  sectionTitle: {
    marginTop: 12,
    marginBottom: 18,
    fontFamily:
      "JosefinSans_700Bold",
    fontSize: 19,
    color: BLACK,
  },

  label: {
    marginBottom: 7,
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 14,
    color: BLACK,
  },

  input: {
    minHeight: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BLACK,
    paddingHorizontal: 14,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 15,
    color: BLACK,
    backgroundColor: WHITE,
  },

  readOnlyInput: {
    color: GRAY,
  },

  helperText: {
    marginTop: -7,
    marginBottom: 17,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: GRAY,
  },

  primaryButton: {
    minHeight: 50,
    backgroundColor: BLACK,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: WHITE,
  },

  divider: {
    height: 1,
    marginVertical: 30,
    backgroundColor: LIGHT_GRAY,
  },
});