import React, {
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
  background: "#F8FAF7",
  card: "#FFFFFF",

  primary: "#E0A92F",
  primaryDark: "#B67F15",

  softYellow: "#FFF3C9",
  softBlue: "#E9F3FA",
  softLavender: "#F0ECFA",
  softGreen: "#E8F3E7",

  blue: "#73A8C7",
  lavender: "#8B7CB6",

  textPrimary: "#303238",
  textSecondary: "#74767D",

  border: "#E8E5DD",

  white: "#FFFFFF",
  disabled: "#B8B7B1",
};

const STEP_OPTIONS = [
  {
    category: "for-me",
    title: "Something for me",
    subtitle:
      "A small act of care",
    icon: "heart-outline",
    color: "#FFF3C9",

    options: [
      {
        id: "water",
        title:
          "Drink a glass of water",
        icon: "water-outline",
      },
      {
        id: "outside",
        title:
          "Sit outside for a few minutes",
        icon: "sunny-outline",
      },
      {
        id: "song",
        title:
          "Listen to one song I like",
        icon: "musical-note-outline",
      },
    ],
  },

  {
    category: "useful",
    title: "Something useful",
    subtitle:
      "Keep it very small",
    icon: "checkmark-done-outline",
    color: "#E9F3FA",

    options: [
      {
        id: "tidy-three",
        title:
          "Put away three things",
        icon: "basket-outline",
      },
      {
        id: "small-space",
        title:
          "Tidy one small space",
        icon: "sparkles-outline",
      },
      {
        id: "tiny-task",
        title:
          "Finish one tiny task",
        icon: "checkbox-outline",
      },
    ],
  },

  {
    category: "connect",
    title: "Something connecting",
    subtitle:
      "A little connection counts",
    icon: "people-outline",
    color: "#F0ECFA",

    options: [
      {
        id: "message",
        title:
          "Send someone a short message",
        icon: "chatbubble-outline",
      },
      {
        id: "sit-together",
        title:
          "Spend a few minutes near someone",
        icon: "people-circle-outline",
      },
      {
        id: "say-hello",
        title:
          "Say hello to someone",
        icon: "hand-left-outline",
      },
    ],
  },
];

export default function SmallStepChooseScreen({
  navigation,
  route,
}) {
  const [
    selectedStep,
    setSelectedStep,
  ] = useState(null);

  const handleContinue = () => {
    if (!selectedStep) {
      return;
    }

    navigation.navigate(
      "SmallStepActivity",
      {
        ...(route?.params || {}),

        selectedStep,
      }
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View style={styles.container}>
        {/* Decorative shapes */}

        <View
          style={styles.yellowShape}
        />

        <View
          style={styles.blueShape}
        />

        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerCenter
            }
          >
            <Text
              style={
                styles.headerTitle
              }
            >
              One Small Step
            </Text>

            <Text
              style={
                styles.headerProgress
              }
            >
              Choose
            </Text>
          </View>

          <View
            style={styles.headerSpacer}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <View
            style={styles.iconCircle}
          >
            <Ionicons
              name="footsteps-outline"
              size={30}
              color={
                COLORS.primaryDark
              }
            />
          </View>

          <Text style={styles.title}>
            What feels possible right
            now?
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Choose just one small thing.
          </Text>

          {STEP_OPTIONS.map(
            (group) => (
              <View
                key={group.category}
                style={
                  styles.groupSection
                }
              >
                <View
                  style={
                    styles.groupHeader
                  }
                >
                  <View
                    style={[
                      styles.groupIcon,

                      {
                        backgroundColor:
                          group.color,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        group.icon
                      }
                      size={20}
                      color={
                        COLORS.primaryDark
                      }
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.groupTitle
                      }
                    >
                      {group.title}
                    </Text>

                    <Text
                      style={
                        styles.groupSubtitle
                      }
                    >
                      {group.subtitle}
                    </Text>
                  </View>
                </View>

                {group.options.map(
                  (option) => {
                    const selected =
                      selectedStep
                        ?.id ===
                      option.id;

                    return (
                      <TouchableOpacity
                        key={
                          option.id
                        }
                        style={[
                          styles.optionCard,

                          selected &&
                            styles.selectedOption,
                        ]}
                        onPress={() =>
                          setSelectedStep(
                            {
                              ...option,

                              category:
                                group.category,
                            }
                          )
                        }
                        activeOpacity={
                          0.8
                        }
                      >
                        <View
                          style={[
                            styles.optionIcon,

                            selected &&
                              styles.selectedIcon,
                          ]}
                        >
                          <Ionicons
                            name={
                              option.icon
                            }
                            size={21}
                            color={
                              selected
                                ? COLORS.white
                                : COLORS.primaryDark
                            }
                          />
                        </View>

                        <Text
                          style={[
                            styles.optionText,

                            selected &&
                              styles.selectedText,
                          ]}
                        >
                          {
                            option.title
                          }
                        </Text>

                        <View
                          style={[
                            styles.radio,

                            selected &&
                              styles.radioSelected,
                          ]}
                        >
                          {selected && (
                            <View
                              style={
                                styles.radioInner
                              }
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
            )
          )}

          <View style={styles.note}>
            <Ionicons
              name="heart-outline"
              size={17}
              color={
                COLORS.lavender
              }
            />

            <Text
              style={
                styles.noteText
              }
            >
              Small is enough.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !selectedStep &&
                styles.disabledButton,
            ]}
            disabled={!selectedStep}
            onPress={
              handleContinue
            }
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueText,

                !selectedStep &&
                  styles.disabledText,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                selectedStep
                  ? COLORS.white
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,

      overflow: "hidden",
    },

    yellowShape: {
      position: "absolute",

      width: 250,
      height: 250,

      borderRadius: 125,

      top: -150,
      right: -90,

      backgroundColor:
        "#FFF0BA",

      opacity: 0.65,
    },

    blueShape: {
      position: "absolute",

      width: 230,
      height: 230,

      borderRadius: 115,

      bottom: 50,
      left: -160,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.65,
    },

    header: {
      height: 61,

      paddingHorizontal: 18,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      zIndex: 2,
    },

    backButton: {
      width: 42,
      height: 42,

      borderRadius: 21,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(255,255,255,0.7)",
    },

    headerCenter: {
      alignItems: "center",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.textPrimary,
    },

    headerProgress: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    scrollContent: {
      paddingHorizontal: 23,
      paddingTop: 20,
      paddingBottom: 30,
    },

    iconCircle: {
      alignSelf: "center",

      width: 65,
      height: 65,

      borderRadius: 33,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.softYellow,
    },

    title: {
      marginTop: 18,

      paddingHorizontal: 20,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 26,
      lineHeight: 33,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      textAlign: "center",

      color:
        COLORS.textSecondary,
    },

    groupSection: {
      marginTop: 27,
    },

    groupHeader: {
      flexDirection: "row",
      alignItems: "center",

      marginBottom: 11,
    },

    groupIcon: {
      width: 40,
      height: 40,

      borderRadius: 20,

      alignItems: "center",
      justifyContent: "center",

      marginRight: 10,
    },

    groupTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.textPrimary,
    },

    groupSubtitle: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      color:
        COLORS.textSecondary,
    },

    optionCard: {
      minHeight: 63,

      marginBottom: 9,

      paddingHorizontal: 12,
      paddingVertical: 10,

      flexDirection: "row",
      alignItems: "center",

      borderRadius: 18,

      backgroundColor:
        COLORS.card,

      borderWidth: 1.2,
      borderColor:
        COLORS.border,
    },

    selectedOption: {
      borderColor:
        COLORS.primary,

      backgroundColor:
        "#FFFCF2",
    },

    optionIcon: {
      width: 40,
      height: 40,

      borderRadius: 20,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.softYellow,
    },

    selectedIcon: {
      backgroundColor:
        COLORS.primary,
    },

    optionText: {
      flex: 1,

      marginHorizontal: 11,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,
      lineHeight: 19,

      color:
        COLORS.textPrimary,
    },

    selectedText: {
      fontFamily:
        "JosefinSans_700Bold",
    },

    radio: {
      width: 21,
      height: 21,

      borderRadius: 11,

      borderWidth: 1.5,
      borderColor:
        "#C9C5BC",

      alignItems: "center",
      justifyContent: "center",
    },

    radioSelected: {
      borderColor:
        COLORS.primary,
    },

    radioInner: {
      width: 11,
      height: 11,

      borderRadius: 6,

      backgroundColor:
        COLORS.primary,
    },

    note: {
      marginTop: 18,

      alignSelf: "center",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 14,
      paddingVertical: 9,

      borderRadius: 18,

      backgroundColor:
        COLORS.softLavender,
    },

    noteText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      color:
        COLORS.textSecondary,
    },

    bottomContainer: {
      paddingHorizontal: 24,
      paddingTop: 10,
      paddingBottom: 17,

      backgroundColor:
        COLORS.background,
    },

    continueButton: {
      height: 58,

      borderRadius: 19,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.primary,
    },

    disabledButton: {
      backgroundColor:
        "#E4E2DA",
    },

    continueText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },

    disabledText: {
      color:
        COLORS.disabled,
    },
  });