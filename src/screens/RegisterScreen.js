import React, {
  useRef,
  useState,
} from "react";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  makeNicknameSearchValue,
  normalizeEmail,
  normalizeNickname,
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirmation,
} from "../utils/authHelpers";

const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#5A5A5A";
const INPUT_BG = "#F3F3F3";
const INPUT_BORDER = "#D4D4D4";

export default function RegisterScreen({
  navigation,
}) {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef =
    useRef(null);

  const [nickname, setNickname] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const getFriendlyRegisterError = (
    errorCode
  ) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account already exists for this email address. Please log in or reset your password.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/weak-password":
        return "Please choose a stronger password.";

      case "auth/operation-not-allowed":
        return "Email and password registration is not enabled in Firebase.";

      case "auth/network-request-failed":
        return "Please check your internet connection and try again.";

      case "auth/too-many-requests":
        return "Too many attempts were made. Please wait and try again.";

      default:
        return "We could not create your Healio account. Please try again.";
    }
  };

  const handleCreateAccount = async () => {
    if (isLoading) {
      return;
    }

    const nicknameError =
      validateNickname(nickname);

    if (nicknameError) {
      Alert.alert(
        "Check nickname",
        nicknameError
      );
      return;
    }

    const emailError =
      validateEmail(email);

    if (emailError) {
      Alert.alert(
        "Check email",
        emailError
      );
      return;
    }

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      Alert.alert(
        "Check password",
        passwordError
      );
      return;
    }

    const confirmationError =
      validatePasswordConfirmation(
        password,
        confirmPassword
      );

    if (confirmationError) {
      Alert.alert(
        "Check password",
        confirmationError
      );
      return;
    }

    setIsLoading(true);

    const cleanNickname =
      normalizeNickname(nickname);

    const cleanEmail =
      normalizeEmail(email);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const user =
        userCredential.user;

      /**
       * Firebase Authentication profile.
       */
      await updateProfile(user, {
        displayName: cleanNickname,
      });

      /**
       * Firestore application profile.
       */
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          nickname: cleanNickname,
          nicknameLower:
            makeNicknameSearchValue(
              cleanNickname
            ),
          email: cleanEmail,
          accountType:
            "email_password",
          emailVerified: false,
          createdAt:
            serverTimestamp(),
          updatedAt:
            serverTimestamp(),
          lastLoginAt: null,
        }
      );

      /**
       * Firebase sends the verification
       * message to the authenticated email.
       */
      await sendEmailVerification(user);

      await AsyncStorage.multiSet([
        [
          "isRegisteredOnThisPhone",
          "true",
        ],
        [
          "healioNickname",
          cleanNickname,
        ],
        [
          "healioEmail",
          cleanEmail,
        ],
      ]);

      /**
       * Sign out until the user verifies
       * the email and logs in.
       */
      await signOut(auth);

      Alert.alert(
        "Verify your email",
        `We sent a verification link to ${cleanEmail}. Open the link, then return to Healio and log in.`,
        [
          {
            text: "Go to Login",
            onPress: () =>
              navigation.replace(
                "Login"
              ),
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      Alert.alert(
        "Registration failed",
        getFriendlyRegisterError(
          error.code
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <Text style={styles.title}>
            Hey! I’m{" "}
            <Text style={styles.greenText}>
              Healio
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Create your private space using
            your email.{"\n"}
            Your nickname is used only to
            personalize your experience.
          </Text>

          <Image
            source={require("../../assets/images/hi.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <TextInput
            style={styles.input}
            placeholder="Choose a nickname"
            placeholderTextColor="#A9A9A9"
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            maxLength={30}
            editable={!isLoading}
            onSubmitEditing={() =>
              emailInputRef.current?.focus()
            }
            accessibilityLabel="Nickname"
          />

          <TextInput
            ref={emailInputRef}
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            editable={!isLoading}
            onSubmitEditing={() =>
              passwordInputRef.current?.focus()
            }
            accessibilityLabel="Email address"
          />

          <View
            style={
              styles.passwordContainer
            }
          >
            <TextInput
              ref={passwordInputRef}
              style={styles.passwordInput}
              placeholder="Create a password"
              placeholderTextColor="#A9A9A9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={
                !isPasswordVisible
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              editable={!isLoading}
              onSubmitEditing={() =>
                confirmPasswordInputRef
                  .current
                  ?.focus()
              }
              accessibilityLabel="Create password"
            />

            <TouchableOpacity
              style={styles.eyeButton}
              activeOpacity={0.7}
              onPress={() =>
                setIsPasswordVisible(
                  (current) => !current
                )
              }
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible
                  ? "Hide password"
                  : "Show password"
              }
            >
              <Ionicons
                name={
                  isPasswordVisible
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#8E8E8E"
              />
            </TouchableOpacity>
          </View>

          <View
            style={
              styles.passwordContainer
            }
          >
            <TextInput
              ref={
                confirmPasswordInputRef
              }
              style={styles.passwordInput}
              placeholder="Confirm password"
              placeholderTextColor="#A9A9A9"
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry={
                !isConfirmPasswordVisible
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              editable={!isLoading}
              onSubmitEditing={
                handleCreateAccount
              }
              accessibilityLabel="Confirm password"
            />

            <TouchableOpacity
              style={styles.eyeButton}
              activeOpacity={0.7}
              onPress={() =>
                setIsConfirmPasswordVisible(
                  (current) => !current
                )
              }
              accessibilityRole="button"
              accessibilityLabel={
                isConfirmPasswordVisible
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              <Ionicons
                name={
                  isConfirmPasswordVisible
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#8E8E8E"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={
              styles.passwordRequirement
            }
          >
            Use at least 8 characters,
            including uppercase, lowercase
            and a number.
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              isLoading &&
                styles.disabledButton,
            ]}
            activeOpacity={0.85}
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={styles.buttonText}
              >
                Create My Space
              </Text>
            )}
          </TouchableOpacity>

          <View
            style={styles.loginPrompt}
          >
            <Text
              style={styles.loginPromptText}
            >
              Already have an account?
            </Text>

            <TouchableOpacity
              disabled={isLoading}
              onPress={() =>
                navigation.replace(
                  "Login"
                )
              }
            >
              <Text
                style={styles.loginLink}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 36,
    paddingBottom: 40,
  },

  title: {
    fontFamily: "Itim_400Regular",
    fontSize: 34,
    color: BLACK,
    textAlign: "center",
    marginTop: 50,
  },

  greenText: {
    color: GREEN,
  },

  subtitle: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    lineHeight: 23,
    color: GRAY,
    textAlign: "center",
    marginTop: 20,
  },

  image: {
    width: 135,
    height: 125,
    marginTop: 22,
    marginBottom: 28,
  },

  input: {
    width: "100%",
    height: 54,
    backgroundColor: INPUT_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingHorizontal: 22,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    color: BLACK,
    marginBottom: 17,
  },

  passwordContainer: {
    width: "100%",
    height: 54,
    backgroundColor: INPUT_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingLeft: 22,
    paddingRight: 12,
    marginBottom: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    color: BLACK,
  },

  eyeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  passwordRequirement: {
    width: "100%",
    marginTop: -5,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 12,
    lineHeight: 17,
    color: "#777777",
  },

  button: {
    width: "100%",
    height: 58,
    backgroundColor: GREEN,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 6,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 20,
    color: "#FFFFFF",
  },

  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  loginPromptText: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 14,
    color: GRAY,
  },

  loginLink: {
    marginLeft: 6,
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 14,
    color: GREEN,
  },
});