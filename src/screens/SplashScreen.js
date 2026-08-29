import React, {
  useEffect,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
} from "../firebase/firebaseConfig";

export default function SplashScreen({
  navigation,
}) {
  useEffect(() => {
    let splashTimer = null;

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          try {
            const onboardingCompleted =
              await AsyncStorage.getItem(
                "onboardingCompleted"
              );

            splashTimer = setTimeout(
              () => {
                if (
                  user &&
                  user.emailVerified
                ) {
                  navigation.replace(
                    "MainTabs"
                  );
                  return;
                }

                if (
                  onboardingCompleted ===
                  "true"
                ) {
                  navigation.replace(
                    "Login"
                  );
                  return;
                }

                navigation.replace(
                  "Onboarding"
                );
              },
              1800
            );
          } catch (error) {
            navigation.replace(
              "Onboarding"
            );
          }
        }
      );

    return () => {
      unsubscribe();

      if (splashTimer) {
        clearTimeout(splashTimer);
      }
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7FAF7"
      />

      <ImageBackground
        source={require("../../assets/images/splash_background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Text style={styles.title}>
          Healio
        </Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF7",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 62,
    color: "#555555",
    fontWeight: "400",
    fontFamily:
      Platform.OS === "ios"
        ? "Georgia"
        : "serif",
    marginTop: -40,
  },
});