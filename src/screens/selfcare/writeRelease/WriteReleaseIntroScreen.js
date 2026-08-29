import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const BACKGROUND = "#EAF7FF";
const PRIMARY_BLUE = "#9DBBFF";

export default function WriteReleaseIntroScreen({ navigation }) {
  const handleStart = () => {
    navigation.navigate("WriteReleaseWriting");
  };

  const handleLater = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={31}
            color="#111111"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Write It, Release It
        </Text>

        <Text style={styles.description}>
          Sometimes, writing down what is upsetting us can create a
          little space between the feeling and the situation.{"\n"}
          In this activity, you can write freely about what happened,
          then release the page.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.actionButton, styles.laterButton]}
            onPress={handleLater}
          >
            <Text style={styles.laterButtonText}>
              Later
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.actionButton, styles.startButton]}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>
              Start
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.privacyContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#555555"
        />

        <Text style={styles.privacyText}>
          This page is only used during this activity. After you
          release the page or leave the activity, the writing will be
          permanently cleared.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  header: {
    height: 75,
    paddingHorizontal: 35,
    justifyContent: "center",
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 22,
  },

  title: {
    marginTop: 20,
    fontFamily: "JosefinSans_700Bold",
    fontSize: 23,
    lineHeight: 30,
    color: "#080808",
    textAlign: "center",
  },

  description: {
    marginTop: 55,
    maxWidth: 315,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 16,
    lineHeight: 21,
    color: "#606060",
    textAlign: "center",
  },

  buttonRow: {
    position: "absolute",
    left: 22,
    right: 22,
    top: "57%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionButton: {
    width: "46%",
    height: 44,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  laterButton: {
    backgroundColor: "#D6D6D6",
  },

  startButton: {
    backgroundColor: PRIMARY_BLUE,
  },

  laterButtonText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 18,
    color: "#444444",
  },

  startButtonText: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 18,
    color: "#080808",
  },

  privacyContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    paddingBottom: 25,
  },

  privacyText: {
    flex: 1,
    marginLeft: 12,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 11,
    lineHeight: 15,
    color: "#606060",
  },
});