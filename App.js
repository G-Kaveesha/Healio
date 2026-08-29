import React from "react";

import {
  View,
  ActivityIndicator,
} from "react-native";

import AppNavigator from "./src/navigation/AppNavigator.js";

import {
  SelfCareProvider,
} from "./src/context/SelfCareContext";

import {
  useFonts,
  Itim_400Regular,
} from "@expo-google-fonts/itim";

import {
  JosefinSans_400Regular,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";

export default function App() {
  const [fontsLoaded] = useFonts({
    Itim_400Regular,
    JosefinSans_400Regular,
    JosefinSans_600SemiBold,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#88BF98"
        />
      </View>
    );
  }

  return (
    <SelfCareProvider>
      <AppNavigator />
    </SelfCareProvider>
  );
}