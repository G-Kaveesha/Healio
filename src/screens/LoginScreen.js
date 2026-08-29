import React, {
  useEffect,
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
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
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
  normalizeEmail,
  validateEmail,
} from "../utils/authHelpers";

const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#5A5A5A";
const INPUT_BG = "#F3F3F3";
const INPUT_BORDER = "#D4D4D4";

export default function LoginScreen({
  navigation,
}) {
  const passwordInputRef =
    useRef(null);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    isResettingPassword,
    setIsResettingPassword,
  ] = useState(false);

  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail =
          await AsyncStorage.getItem(
            "healioEmail"
          );

        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.warn(
          "Could not load saved email:",
          error
        );
      }
    };

    loadSavedEmail();
  }, []);

  const getFriendlyLoginError = (
    errorCode
  ) => {
    switch (errorCode) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        return "The email or password is incorrect. Please try again.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/user-disabled":
        return "This account has been disabled.";

      case "auth/too-many-requests":
        return "Too many attempts were made. Please wait and try again.";

      case "auth/network-request-failed":
        return "Please check your internet connection and try again.";

      default:
        return "Login failed. Please check your email and password.";
    }
  };

  const handleUnverifiedEmail = (
    user,
    cleanEmail
  ) => {
    Alert.alert(
      "Verify your email",
      `Please verify ${cleanEmail} before logging in.`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: async () => {
            await signOut(auth);
          },
        },
        {
          text: "Resend Email",
          onPress: async () => {
            try {
              await sendEmailVerification(
                user
              );

              await signOut(auth);

              Alert.alert(
                "Verification sent",
                "Please check your inbox and spam folder."
              );
            } catch (error) {
              await signOut(auth);

              Alert.alert(
                "Unable to send email",
                "Please wait a moment and try again."
              );
            }
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const handleLogin = async () => {
    if (isLoading) {
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

    if (!password) {
      Alert.alert(
        "Check password",
        "Please enter your password."
      );
      return;
    }

    setIsLoading(true);

    const cleanEmail =
      normalizeEmail(email);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const user =
        userCredential.user;

      /**
       * Refreshes user data so emailVerified
       * reflects the latest Firebase state.
       */
      await user.reload();

      if (!user.emailVerified) {
        handleUnverifiedEmail(
          user,
          cleanEmail
        );

        return;
      }

      const userReference = doc(
        db,
        "users",
        user.uid
      );

      const profileSnapshot =
        await getDoc(userReference);

      const profileData =
        profileSnapshot.exists()
          ? profileSnapshot.data()
          : null;

      const nickname =
        profileData?.nickname ||
        user.displayName ||
        "Friend";

      await setDoc(
        userReference,
        {
          uid: user.uid,
          email:
            user.email ||
            cleanEmail,
          emailVerified: true,
          lastLoginAt:
            serverTimestamp(),
          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      await AsyncStorage.multiSet([
        [
          "isRegisteredOnThisPhone",
          "true",
        ],
        [
          "healioNickname",
          nickname,
        ],
        [
          "healioEmail",
          cleanEmail,
        ],
      ]);

      navigation.replace("MainTabs");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      Alert.alert(
        "Login failed",
        getFriendlyLoginError(
          error.code
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (
      isResettingPassword ||
      isLoading
    ) {
      return;
    }

    const emailError =
      validateEmail(email);

    if (emailError) {
      Alert.alert(
        "Enter your email",
        "Enter the email address registered with Healio, then select Forgot Password again."
      );
      return;
    }

    const cleanEmail =
      normalizeEmail(email);

    setIsResettingPassword(true);

    try {
      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      Alert.alert(
        "Reset email sent",
        `If an account exists for ${cleanEmail}, check the inbox and spam folder for password-reset instructions.`
      );
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-email":
          Alert.alert(
            "Invalid email",
            "Please enter a valid email address."
          );
          break;

        case "auth/network-request-failed":
          Alert.alert(
            "No connection",
            "Please check your internet connection and try again."
          );
          break;

        case "auth/too-many-requests":
          Alert.alert(
            "Please wait",
            "Too many reset requests were made. Try again later."
          );
          break;

        default:
          /**
           * A generic response avoids exposing
           * whether an account exists.
           */
          Alert.alert(
            "Check your email",
            `If an account exists for ${cleanEmail}, password-reset instructions will be sent.`
          );
      }
    } finally {
      setIsResettingPassword(false);
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
          <Image
            source={require("../../assets/images/welcome_back.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            Welcome Back!
          </Text>

          <Text style={styles.subtitle}>
            We’re glad you’re here.
          </Text>

          <TextInput
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
              placeholder="Password"
              placeholderTextColor="#A9A9A9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={
                !isPasswordVisible
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              editable={!isLoading}
              onSubmitEditing={handleLogin}
              accessibilityLabel="Password"
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

          <TouchableOpacity
            style={
              styles.forgotPasswordButton
            }
            disabled={
              isResettingPassword ||
              isLoading
            }
            onPress={
              handleForgotPassword
            }
          >
            {isResettingPassword ? (
              <ActivityIndicator
                size="small"
                color={GREEN}
              />
            ) : (
              <Text
                style={
                  styles.forgotPasswordText
                }
              >
                Forgot Password?
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isLoading &&
                styles.disabledButton,
            ]}
            activeOpacity={0.85}
            onPress={handleLogin}
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
                Log In
              </Text>
            )}
          </TouchableOpacity>

          <View
            style={styles.registerPrompt}
          >
            <Text
              style={
                styles.registerPromptText
              }
            >
              New to Healio?
            </Text>

            <TouchableOpacity
              disabled={isLoading}
              onPress={() =>
                navigation.replace(
                  "Register"
                )
              }
            >
              <Text
                style={
                  styles.registerLink
                }
              >
                Create Account
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
    paddingHorizontal: 40,
    paddingBottom: 40,
  },

  image: {
    width: 170,
    height: 150,
    marginTop: 65,
  },

  title: {
    fontFamily: "Itim_400Regular",
    fontSize: 34,
    color: BLACK,
    textAlign: "center",
    marginTop: 28,
  },

  subtitle: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    color: GRAY,
    textAlign: "center",
    marginTop: 13,
    marginBottom: 70,
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
    marginBottom: 20,
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

  forgotPasswordButton: {
    alignSelf: "flex-end",
    minHeight: 42,
    justifyContent: "center",
    paddingLeft: 12,
  },

  forgotPasswordText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 14,
    color: GREEN,
  },

  button: {
    width: "100%",
    height: 58,
    backgroundColor: GREEN,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,

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

  registerPrompt: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
  },

  registerPromptText: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 14,
    color: GRAY,
  },

  registerLink: {
    marginLeft: 6,
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 14,
    color: GREEN,
  },
});