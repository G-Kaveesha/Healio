import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FaceDetectionProvider } from "@infinitered/react-native-mlkit-face-detection";

import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

const FACE_DETECTION_OPTIONS = {
  performanceMode: "accurate",
  landmarkMode: false,
  contourMode: false,
  classificationMode: false,
  minFaceSize: 0.1,
  isTrackingEnabled: false,
};

export default function AppNavigator() {
  return (
    <FaceDetectionProvider options={FACE_DETECTION_OPTIONS}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          />

          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />

          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FaceDetectionProvider>
  );
}