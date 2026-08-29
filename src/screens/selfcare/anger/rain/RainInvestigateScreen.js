import React, { useState } from "react";

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

  blue: "#6F9DE8",

  softPurple: "#EAE6FF",
  softPurpleStrong: "#DDD7FF",

  softBlue: "#E8F1FF",
  softBlueStrong: "#DCE9FF",

  textPrimary: "#28253E",
  textSecondary: "#747088",

  border: "#DDD9F6",

  white: "#FFFFFF",
  disabled: "#BBB7CD",
};

const BODY_AREAS = [
  {
    id: "head-face",
    label: "Head / Face",
    icon: "happy-outline",
  },
  {
    id: "jaw",
    label: "Jaw",
    icon: "ellipse-outline",
  },
  {
    id: "chest",
    label: "Chest",
    icon: "heart-outline",
  },
  {
    id: "shoulders",
    label: "Shoulders",
    icon: "body-outline",
  },
  {
    id: "stomach",
    label: "Stomach",
    icon: "radio-button-on-outline",
  },
  {
    id: "hands",
    label: "Hands",
    icon: "hand-left-outline",
  },
  {
    id: "somewhere-else",
    label: "Somewhere else",
    icon: "ellipsis-horizontal-outline",
  },
  {
    id: "not-sure",
    label: "Not sure",
    icon: "help-circle-outline",
  },
];

const SENSATIONS = [
  {
    id: "tight",
    label: "Tight",
  },
  {
    id: "heavy",
    label: "Heavy",
  },
  {
    id: "warm",
    label: "Warm",
  },
  {
    id: "restless",
    label: "Restless",
  },
  {
    id: "tense",
    label: "Tense",
  },
  {
    id: "shaky",
    label: "Shaky",
  },
  {
    id: "something-else",
    label: "Something else",
  },
  {
    id: "not-sure",
    label: "Not sure",
  },
];

export default function RainInvestigateScreen({
  navigation,
  route,
}) {
  const [selectedBodyArea, setSelectedBodyArea] =
    useState(null);

  const [selectedSensation, setSelectedSensation] =
    useState(null);

  const canContinue =
    selectedBodyArea !== null &&
    selectedSensation !== null;

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    const bodyAreaData = BODY_AREAS.find(
      (item) => item.id === selectedBodyArea
    );

    const sensationData = SENSATIONS.find(
      (item) => item.id === selectedSensation
    );

    navigation.navigate("RainNurture", {
      ...(route?.params || {}),

      investigation: {
        bodyArea: bodyAreaData
          ? {
              id: bodyAreaData.id,
              label: bodyAreaData.label,
            }
          : null,

        sensation: sensationData
          ? {
              id: sensationData.id,
              label: sensationData.label,
            }
          : null,
      },
    });
  };

  const handleSkip = () => {
    navigation.navigate("RainNurture", {
      ...(route?.params || {}),
      investigation: null,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.container}>
        {/* Soft decorative shapes */}
        <View style={styles.topPurpleShape} />
        <View style={styles.bottomBlueShape} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              RAIN
            </Text>

            <Text style={styles.headerProgress}>
              3 of 4
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Stage badge */}
          <View style={styles.stageBadge}>
            <View style={styles.stageLetterCircle}>
              <Text style={styles.stageLetter}>
                I
              </Text>
            </View>

            <Text style={styles.stageBadgeText}>
              Investigate
            </Text>
          </View>

          <Text style={styles.title}>
            Notice what your body is telling you
          </Text>

          <Text style={styles.description}>
            Just notice. You don't need to change anything.
          </Text>

          {/* Body location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Where do you notice it?
            </Text>

            <View style={styles.bodyGrid}>
              {BODY_AREAS.map((item, index) => {
                const isSelected =
                  selectedBodyArea === item.id;

                const usePurple =
                  index % 2 === 0;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.bodyCard,

                      usePurple
                        ? styles.purpleCard
                        : styles.blueCard,

                      isSelected &&
                        styles.selectedCard,
                    ]}
                    onPress={() =>
                      setSelectedBodyArea(item.id)
                    }
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                    }}
                  >
                    <View
                      style={[
                        styles.bodyIconContainer,

                        usePurple
                          ? styles.purpleIcon
                          : styles.blueIcon,

                        isSelected &&
                          styles.selectedIcon,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={21}
                        color={
                          isSelected
                            ? COLORS.white
                            : COLORS.primary
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.bodyLabel,

                        isSelected &&
                          styles.selectedText,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <View
                        style={styles.checkCircle}
                      >
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color={COLORS.white}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sensation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              What does it feel like?
            </Text>

            <View style={styles.chipContainer}>
              {SENSATIONS.map((item) => {
                const isSelected =
                  selectedSensation === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.sensationChip,

                      isSelected &&
                        styles.selectedSensationChip,
                    ]}
                    onPress={() =>
                      setSelectedSensation(item.id)
                    }
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                    }}
                  >
                    <Text
                      style={[
                        styles.sensationText,

                        isSelected &&
                          styles.selectedSensationText,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.white}
                        style={styles.chipCheck}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Gentle reminder */}
          <View style={styles.reminder}>
            <Ionicons
              name="eye-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.reminderText}>
              Simply noticing is enough.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom actions */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueButtonText,

                !canContinue &&
                  styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                canContinue
                  ? COLORS.white
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
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

  topPurpleShape: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#E8E3FF",
    top: -145,
    right: -100,
    opacity: 0.75,
  },

  bottomBlueShape: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#DFEBFF",
    bottom: 30,
    left: -165,
    opacity: 0.6,
  },

  /*
   * Header
   */

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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.78)",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },

  headerProgress: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  headerSpacer: {
    width: 42,
  },

  /*
   * Progress
   */

  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 4,
  },

  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },

  progressFill: {
    width: "75%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  /*
   * Scroll content
   */

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },

  stageBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    borderRadius: 24,
    backgroundColor: COLORS.softPurple,
  },

  stageLetterCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.softPurpleStrong,
  },

  stageLetter: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  stageBadgeText: {
    marginLeft: 9,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  title: {
    marginTop: 24,
    paddingHorizontal: 10,
    fontSize: 27,
    lineHeight: 35,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 9,
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: "center",
    color: COLORS.textSecondary,
  },

  /*
   * Sections
   */

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    marginBottom: 14,
    fontSize: 17,
    fontWeight: "750",
    color: COLORS.textPrimary,
  },

  /*
   * Body cards
   */

  bodyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  bodyCard: {
    width: "48%",
    minHeight: 74,
    marginBottom: 12,
    paddingHorizontal: 11,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "transparent",

    flexDirection: "row",
    alignItems: "center",

    position: "relative",
  },

  purpleCard: {
    backgroundColor:
      "rgba(234,230,255,0.72)",
  },

  blueCard: {
    backgroundColor:
      "rgba(232,241,255,0.82)",
  },

  selectedCard: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.primary,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,

    elevation: 2,
  },

  bodyIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  purpleIcon: {
    backgroundColor: COLORS.softPurpleStrong,
  },

  blueIcon: {
    backgroundColor: COLORS.softBlueStrong,
  },

  selectedIcon: {
    backgroundColor: COLORS.primary,
  },

  bodyLabel: {
    flex: 1,
    marginLeft: 9,
    paddingRight: 12,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: "650",
    color: COLORS.textPrimary,
  },

  selectedText: {
    color: COLORS.primaryDark,
    fontWeight: "750",
  },

  checkCircle: {
    position: "absolute",
    top: 7,
    right: 7,

    width: 19,
    height: 19,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,
  },

  /*
   * Sensation chips
   */

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  sensationChip: {
    minHeight: 43,
    marginRight: 9,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 22,
    borderWidth: 1.3,
    borderColor: COLORS.border,

    backgroundColor: COLORS.card,

    flexDirection: "row",
    alignItems: "center",
  },

  selectedSensationChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  sensationText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  selectedSensationText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  chipCheck: {
    marginLeft: 6,
  },

  /*
   * Reminder
   */

  reminder: {
    alignSelf: "center",
    marginTop: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 20,
    backgroundColor: COLORS.softBlue,
  },

  reminderText: {
    marginLeft: 7,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  /*
   * Bottom
   */

  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 11,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },

  continueButton: {
    height: 58,
    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 4,
  },

  continueButtonDisabled: {
    backgroundColor: "#E3E0ED",
    shadowOpacity: 0,
    elevation: 0,
  },

  continueButtonText: {
    marginRight: 9,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },

  continueButtonTextDisabled: {
    color: COLORS.disabled,
  },

  skipButton: {
    alignSelf: "center",
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },

  skipText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});