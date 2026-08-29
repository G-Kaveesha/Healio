import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F4F3FF",
  card: "#FFFFFF",

  primary: "#6C63D9",
  primaryDark: "#5148B8",

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

const SUPPORTIVE_STATEMENTS = [
  {
    id: "space",
    text: "It's okay to take some space.",
    icon: "moon-outline",
  },
  {
    id: "respond-ready",
    text: "I can respond when I'm ready.",
    icon: "time-outline",
  },
  {
    id: "gentle",
    text: "I can be gentle with myself.",
    icon: "heart-outline",
  },
  {
    id: "not-now",
    text: "I don't have to solve everything right now.",
    icon: "pause-circle-outline",
  },
];

export default function RainNurtureScreen({
  navigation,
  route,
}) {
  const [selectedStatement, setSelectedStatement] =
    useState(null);

  const [customMessage, setCustomMessage] =
    useState("");

  const [showCustomInput, setShowCustomInput] =
    useState(false);

  const hasCustomMessage =
    showCustomInput &&
    customMessage.trim().length > 0;

  const canContinue =
    selectedStatement !== null ||
    hasCustomMessage;

  const handleSelectStatement = (id) => {
    setSelectedStatement(id);
    setShowCustomInput(false);
    setCustomMessage("");
  };

  const handleCustomOption = () => {
    setSelectedStatement(null);
    setShowCustomInput(true);
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    let nurtureResponse = null;

    if (selectedStatement) {
      const selected =
        SUPPORTIVE_STATEMENTS.find(
          (item) =>
            item.id === selectedStatement
        );

      nurtureResponse = selected
        ? {
            type: "preset",
            id: selected.id,
            text: selected.text,
          }
        : null;
    } else if (hasCustomMessage) {
      nurtureResponse = {
        type: "custom",
        text: customMessage.trim(),
      };
    }

    navigation.navigate(
      "RainBreathing",
      {
        ...(route?.params || {}),
        nurtureResponse,
      }
    );
  };

  const handleSkip = () => {
    navigation.navigate(
      "RainBreathing",
      {
        ...(route?.params || {}),
        nurtureResponse: null,
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View style={styles.container}>
          {/* Decorative background */}
          <View
            style={styles.topPurpleShape}
          />

          <View
            style={styles.bottomBlueShape}
          />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                navigation.goBack()
              }
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

            <View
              style={styles.headerCenter}
            >
              <Text
                style={styles.headerTitle}
              >
                RAIN
              </Text>

              <Text
                style={
                  styles.headerProgress
                }
              >
                4 of 4
              </Text>
            </View>

            <View
              style={styles.headerSpacer}
            />
          </View>

          {/* Progress */}
          <View
            style={styles.progressContainer}
          >
            <View
              style={styles.progressTrack}
            >
              <View
                style={styles.progressFill}
              />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.scrollContent
            }
          >
            {/* Stage */}
            <View style={styles.stageBadge}>
              <View
                style={
                  styles.stageLetterCircle
                }
              >
                <Text
                  style={styles.stageLetter}
                >
                  N
                </Text>
              </View>

              <Text
                style={
                  styles.stageBadgeText
                }
              >
                Nurture
              </Text>
            </View>

            {/* Main prompt */}
            <Text style={styles.title}>
              What would feel supportive
              right now?
            </Text>

            <Text
              style={styles.description}
            >
              Choose a thought that feels
              kind and helpful.
            </Text>

            {/* Statements */}
            <View
              style={
                styles.statementsContainer
              }
            >
              {SUPPORTIVE_STATEMENTS.map(
                (item, index) => {
                  const isSelected =
                    selectedStatement ===
                    item.id;

                  const usePurple =
                    index % 2 === 0;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.statementCard,

                        usePurple
                          ? styles.purpleCard
                          : styles.blueCard,

                        isSelected &&
                          styles.selectedCard,
                      ]}
                      onPress={() =>
                        handleSelectStatement(
                          item.id
                        )
                      }
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityState={{
                        selected:
                          isSelected,
                      }}
                    >
                      <View
                        style={[
                          styles.iconCircle,

                          usePurple
                            ? styles.purpleIcon
                            : styles.blueIcon,

                          isSelected &&
                            styles.selectedIcon,
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
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
                          styles.statementText,

                          isSelected &&
                            styles.selectedText,
                        ]}
                      >
                        {item.text}
                      </Text>

                      {isSelected && (
                        <View
                          style={
                            styles.checkCircle
                          }
                        >
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={
                              COLORS.white
                            }
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }
              )}

              {/* Custom option */}
              <TouchableOpacity
                style={[
                  styles.customOption,

                  showCustomInput &&
                    styles.selectedCustomOption,
                ]}
                onPress={
                  handleCustomOption
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.customIconCircle,

                    showCustomInput &&
                      styles.selectedIcon,
                  ]}
                >
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={
                      showCustomInput
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.customOptionText,

                    showCustomInput &&
                      styles.selectedText,
                  ]}
                >
                  Write my own
                </Text>

                <Ionicons
                  name={
                    showCustomInput
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={18}
                  color={
                    COLORS.textSecondary
                  }
                />
              </TouchableOpacity>

              {/* Custom input */}
              {showCustomInput && (
                <View
                  style={
                    styles.inputContainer
                  }
                >
                  <TextInput
                    style={styles.textInput}
                    value={customMessage}
                    onChangeText={
                      setCustomMessage
                    }
                    placeholder="What would you like to say to yourself?"
                    placeholderTextColor="#9995AA"
                    multiline
                    maxLength={120}
                    textAlignVertical="top"
                  />

                  <Text
                    style={
                      styles.characterCount
                    }
                  >
                    {customMessage.length}/120
                  </Text>
                </View>
              )}
            </View>

            {/* Gentle note */}
            <View style={styles.note}>
              <Ionicons
                name="heart-outline"
                size={18}
                color={COLORS.primary}
              />

              <Text
                style={styles.noteText}
              >
                Choose what feels right for
                you.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom controls */}
          <View
            style={styles.bottomContainer}
          >
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
              <Text
                style={styles.skipText}
              >
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },

  /*
   * Decorative background
   */

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
    bottom: 25,
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
   * Progress bar
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
    width: "100%",
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
    marginTop: 24,
    paddingHorizontal: 8,
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
   * Supportive statements
   */

  statementsContainer: {
    marginTop: 28,
  },

  statementCard: {
    minHeight: 82,
    marginBottom: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "transparent",

    flexDirection: "row",
    alignItems: "center",

    position: "relative",
  },

  purpleCard: {
    backgroundColor:
      "rgba(234,230,255,0.74)",
  },

  blueCard: {
    backgroundColor:
      "rgba(232,241,255,0.84)",
  },

  selectedCard: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.primary,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 2,
  },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
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

  statementText: {
    flex: 1,
    marginLeft: 13,
    marginRight: 18,

    fontSize: 14,
    lineHeight: 20,
    fontWeight: "650",

    color: COLORS.textPrimary,
  },

  selectedText: {
    color: COLORS.primaryDark,
    fontWeight: "750",
  },

  checkCircle: {
    position: "absolute",
    top: 10,
    right: 10,

    width: 21,
    height: 21,
    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.primary,
  },

  /*
   * Custom option
   */

  customOption: {
    minHeight: 62,
    paddingHorizontal: 15,
    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1.3,
    borderColor: COLORS.border,

    backgroundColor: COLORS.card,
  },

  selectedCustomOption: {
    borderColor: COLORS.primary,
  },

  customIconCircle: {
    width: 39,
    height: 39,
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.softPurple,
  },

  customOptionText: {
    flex: 1,
    marginLeft: 12,

    fontSize: 14,
    fontWeight: "650",

    color: COLORS.textPrimary,
  },

  /*
   * Custom text input
   */

  inputContainer: {
    marginTop: 11,
    borderRadius: 20,
    borderWidth: 1.3,
    borderColor: COLORS.border,

    backgroundColor: COLORS.card,

    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 9,
  },

  textInput: {
    minHeight: 86,
    maxHeight: 120,

    fontSize: 14,
    lineHeight: 21,

    color: COLORS.textPrimary,
  },

  characterCount: {
    alignSelf: "flex-end",
    marginTop: 4,

    fontSize: 11,
    color: COLORS.textSecondary,
  },

  /*
   * Note
   */

  note: {
    alignSelf: "center",
    marginTop: 20,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 20,

    backgroundColor: COLORS.softBlue,
  },

  noteText: {
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