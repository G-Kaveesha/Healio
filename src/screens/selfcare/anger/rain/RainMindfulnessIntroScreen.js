import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F4F3FF",
  card: "#FFFFFF",

  primary: "#6C63D9",
  primaryDark: "#5148B8",

  softPurple: "#E9E6FF",
  softBlue: "#E8F1FF",
  blue: "#6D9DE8",

  textPrimary: "#25233A",
  textSecondary: "#706D86",

  border: "#DDD9F6",
  white: "#FFFFFF",
};

export default function RainMindfulnessIntroScreen({
  navigation,
}) {
  const handleBegin = () => {
    navigation.navigate("RainRecognize");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.container}>
        {/* Decorative background circles */}
        <View style={styles.decorativePurpleCircle} />
        <View style={styles.decorativeBlueCircle} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            RAIN Mindfulness
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Calm icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons
                  name="water-outline"
                  size={42}
                  color={COLORS.primary}
                />
              </View>
            </View>
          </View>

          {/* Main content */}
          <Text style={styles.title}>
            Pause. Notice. Be kind to yourself.
          </Text>

          <Text style={styles.description}>
            Take a few quiet minutes to notice what
            you're feeling without needing to fix it
            right away.
          </Text>

          {/* RAIN stages card */}
          <View style={styles.rainCard}>
            <Text style={styles.rainCardTitle}>
              RAIN
            </Text>

            <View style={styles.stageRow}>
              <StageItem
                letter="R"
                label="Recognize"
                backgroundColor={COLORS.softPurple}
              />

              <StageDivider />

              <StageItem
                letter="A"
                label="Allow"
                backgroundColor={COLORS.softBlue}
              />

              <StageDivider />

              <StageItem
                letter="I"
                label="Investigate"
                backgroundColor={COLORS.softPurple}
              />

              <StageDivider />

              <StageItem
                letter="N"
                label="Nurture"
                backgroundColor={COLORS.softBlue}
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.durationContainer}>
            <Ionicons
              name="time-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text style={styles.durationText}>
              About 10 minutes
            </Text>
          </View>

          {/* Gentle note */}
          <View style={styles.noteContainer}>
            <Ionicons
              name="heart-outline"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.noteText}>
              Go at your own pace.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.beginButton}
            onPress={handleBegin}
            activeOpacity={0.85}
          >
            <Text style={styles.beginButtonText}>
              Begin Activity
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StageItem({
  letter,
  label,
  backgroundColor,
}) {
  return (
    <View style={styles.stageItem}>
      <View
        style={[
          styles.stageCircle,
          {
            backgroundColor,
          },
        ]}
      >
        <Text style={styles.stageLetter}>
          {letter}
        </Text>
      </View>

      <Text
        style={styles.stageLabel}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

function StageDivider() {
  return <View style={styles.stageDivider} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },

  decorativePurpleCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#E7E2FF",
    top: -110,
    right: -90,
    opacity: 0.7,
  },

  decorativeBlueCircle: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#DFECFF",
    bottom: 60,
    left: -120,
    opacity: 0.65,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    zIndex: 2,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 25,
    alignItems: "center",
  },

  iconContainer: {
    marginTop: 12,
    marginBottom: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  iconOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.softPurple,
    alignItems: "center",
    justifyContent: "center",
  },

  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,

    elevation: 3,
  },

  title: {
    fontSize: 29,
    lineHeight: 37,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  description: {
    marginTop: 14,
    fontSize: 15.5,
    lineHeight: 23,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 330,
  },

  rainCard: {
    width: "100%",
    marginTop: 34,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 2,
  },

  rainCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },

  stageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  stageItem: {
    width: 62,
    alignItems: "center",
  },

  stageCircle: {
    width: 47,
    height: 47,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  stageLetter: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  stageLabel: {
    marginTop: 8,
    fontSize: 10.5,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  stageDivider: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.border,
    marginTop: 23,
    marginHorizontal: 2,
  },

  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.softBlue,
  },

  durationText: {
    marginLeft: 7,
    fontSize: 13.5,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  noteContainer: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  noteText: {
    marginLeft: 7,
    fontSize: 13.5,
    color: COLORS.textSecondary,
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: COLORS.background,
  },

  beginButton: {
    height: 58,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    elevation: 4,
  },

  beginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginRight: 9,
  },
});