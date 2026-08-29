import React, {
  useMemo,
  useState,
} from "react";

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
  softBlueStrong: "#D9E7FF",

  textPrimary: "#28253E",
  textSecondary: "#747088",

  border: "#DDD9F6",

  white: "#FFFFFF",
  disabled: "#BBB7CD",
};

const EMOTIONS = [
  {
    id: "angry",
    label: "Angry",
    icon: "flame-outline",
  },
  {
    id: "frustrated",
    label: "Frustrated",
    icon: "alert-circle-outline",
  },
  {
    id: "irritated",
    label: "Irritated",
    icon: "flash-outline",
  },
  {
    id: "hurt",
    label: "Hurt",
    icon: "heart-outline",
  },
  {
    id: "disappointed",
    label: "Disappointed",
    icon: "cloud-outline",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    icon: "layers-outline",
  },
  {
    id: "something-else",
    label: "Something else",
    icon: "ellipsis-horizontal-outline",
  },
  {
    id: "not-sure",
    label: "Not sure",
    icon: "help-circle-outline",
  },
];

export default function RainRecognizeScreen({
  navigation,
  route,
}) {
  const [selectedEmotion, setSelectedEmotion] =
    useState(null);

  const selectedEmotionData = useMemo(() => {
    return EMOTIONS.find(
      (emotion) => emotion.id === selectedEmotion
    );
  }, [selectedEmotion]);

  const handleSelectEmotion = (emotionId) => {
    setSelectedEmotion(emotionId);
  };

  const handleContinue = () => {
    if (!selectedEmotionData) {
      return;
    }

    navigation.navigate("RainAllow", {
      ...(route?.params || {}),

      recognizedEmotion: {
        id: selectedEmotionData.id,
        label: selectedEmotionData.label,
      },
    });
  };

  const handleSkip = () => {
    navigation.navigate("RainAllow", {
      ...(route?.params || {}),
      recognizedEmotion: null,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.container}>
        {/* Soft decorative background */}
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
              1 of 4
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
          {/* Stage indicator */}
          <View style={styles.stageBadge}>
            <View style={styles.stageLetterCircle}>
              <Text style={styles.stageLetter}>
                R
              </Text>
            </View>

            <Text style={styles.stageBadgeText}>
              Recognize
            </Text>
          </View>

          {/* Main prompt */}
          <Text style={styles.title}>
            What are you noticing right now?
          </Text>

          <Text style={styles.description}>
            Choose the feeling that feels closest.
          </Text>

          {/* Emotion options */}
          <View style={styles.emotionsGrid}>
            {EMOTIONS.map((emotion, index) => {
              const isSelected =
                selectedEmotion === emotion.id;

              const usePurple =
                index % 2 === 0;

              return (
                <TouchableOpacity
                  key={emotion.id}
                  style={[
                    styles.emotionCard,

                    usePurple
                      ? styles.purpleCard
                      : styles.blueCard,

                    isSelected &&
                      styles.selectedEmotionCard,
                  ]}
                  onPress={() =>
                    handleSelectEmotion(
                      emotion.id
                    )
                  }
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                  accessibilityLabel={
                    emotion.label
                  }
                >
                  <View
                    style={[
                      styles.emotionIconContainer,

                      usePurple
                        ? styles.purpleIcon
                        : styles.blueIcon,

                      isSelected &&
                        styles.selectedIcon,
                    ]}
                  >
                    <Ionicons
                      name={emotion.icon}
                      size={23}
                      color={
                        isSelected
                          ? COLORS.white
                          : COLORS.primary
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.emotionLabel,

                      isSelected &&
                        styles.selectedEmotionLabel,
                    ]}
                  >
                    {emotion.label}
                  </Text>

                  {isSelected && (
                    <View
                      style={
                        styles.checkContainer
                      }
                    >
                      <Ionicons
                        name="checkmark"
                        size={15}
                        color={COLORS.white}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Gentle reminder */}
          <View style={styles.reminderContainer}>
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.reminderText}>
              There is no right answer.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom actions */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,

              !selectedEmotion &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedEmotion}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.continueButtonText,

                !selectedEmotion &&
                  styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                selectedEmotion
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

  /*
   * Decorative background shapes
   */

  topPurpleShape: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#E8E3FF",
    top: -135,
    right: -85,
    opacity: 0.75,
  },

  bottomBlueShape: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#DFEBFF",
    bottom: 35,
    left: -150,
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
    width: "25%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  /*
   * Main content
   */

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 28,
  },

  stageBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    borderRadius: 24,
    backgroundColor: COLORS.softPurple,
  },

  stageLetterCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.softPurpleStrong,
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
    marginTop: 26,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: COLORS.textSecondary,
  },

  /*
   * Emotion grid
   */

  emotionsGrid: {
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emotionCard: {
    width: "48%",
    minHeight: 105,
    marginBottom: 14,
    paddingVertical: 15,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "transparent",
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

  selectedEmotionCard: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.primary,

    shadowColor: "#6C63D9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 3,
  },

  emotionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  purpleIcon: {
    backgroundColor:
      COLORS.softPurpleStrong,
  },

  blueIcon: {
    backgroundColor:
      COLORS.softBlueStrong,
  },

  selectedIcon: {
    backgroundColor: COLORS.primary,
  },

  emotionLabel: {
    marginTop: 11,
    fontSize: 14,
    fontWeight: "650",
    color: COLORS.textPrimary,
  },

  selectedEmotionLabel: {
    color: COLORS.primaryDark,
    fontWeight: "750",
  },

  checkContainer: {
    position: "absolute",
    top: 10,
    right: 10,

    width: 22,
    height: 22,
    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,
  },

  /*
   * Reminder
   */

  reminderContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  reminderText: {
    marginLeft: 7,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  /*
   * Bottom controls
   */

  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
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
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginTop: 4,
  },

  skipText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});