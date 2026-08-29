import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F8FAF7",
  card: "#FFFFFF",

  primary: "#E0A92F",
  primaryDark: "#B67F15",

  softYellow: "#FFF3C9",
  softYellowStrong: "#FFE7A0",

  softBlue: "#E9F3FA",
  blue: "#73A8C7",

  softLavender: "#F0ECFA",
  lavender: "#8B7CB6",

  softGreen: "#E8F3E7",

  textPrimary: "#303238",
  textSecondary: "#74767D",

  border: "#ECE5D7",

  white: "#FFFFFF",
};

export default function SmallStepIntroScreen({
  navigation,
  route,
}) {
  const handleBegin = () => {
    navigation.navigate(
      "SmallStepChoose",
      {
        ...(route?.params || {}),
      }
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View style={styles.container}>
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
              size={29}
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
          >
            One Small Step
          </Text>

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
          {/* Hero Image */}

          <Image
            source={require(
              "../../../../../assets/images/selfcare/lowMood/one_small_step.jpg"
            )}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Overlapping Card */}

          <View style={styles.mainCard}>
            <View
              style={styles.titleRow}
            >
              <View
                style={
                  styles.titleContainer
                }
              >
                <Text
                  style={styles.title}
                >
                  One Small Step
                </Text>
              </View>

              <View
                style={
                  styles.durationBadge
                }
              >
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={
                    COLORS.primaryDark
                  }
                />

                <Text
                  style={
                    styles.durationText
                  }
                >
                  5 min
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.description
              }
            >
              When your energy feels low,
              even one small action can be
              enough for now.
            </Text>

            {/* Main idea */}

            <View
              style={
                styles.ideaCard
              }
            >
              <View
                style={
                  styles.ideaIcon
                }
              >
                <Ionicons
                  name="sunny-outline"
                  size={25}
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>

              <View
                style={
                  styles.ideaTextArea
                }
              >
                <Text
                  style={
                    styles.ideaTitle
                  }
                >
                  Keep it small
                </Text>

                <Text
                  style={
                    styles.ideaText
                  }
                >
                  Choose one simple thing
                  that feels possible today.
                </Text>
              </View>
            </View>

            {/* Three simple stages */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              How it works
            </Text>

            <Step
              number="1"
              title="Choose"
              text="Pick one manageable action."
              backgroundColor={
                COLORS.softYellow
              }
              icon="checkmark-circle-outline"
            />

            <Step
              number="2"
              title="Try"
              text="Give it a few minutes."
              backgroundColor={
                COLORS.softBlue
              }
              icon="play-circle-outline"
            />

            <Step
              number="3"
              title="Notice"
              text="See how you feel afterwards."
              backgroundColor={
                COLORS.softLavender
              }
              icon="heart-outline"
            />

            {/* Gentle reminder */}

            <View
              style={styles.note}
            >
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={
                  COLORS.lavender
                }
              />

              <Text
                style={
                  styles.noteText
                }
              >
                You don't need to do
                everything today.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={
              styles.beginButton
            }
            onPress={handleBegin}
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.beginButtonText
              }
            >
              Choose My Step
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                COLORS.white
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Step({
  number,
  title,
  text,
  backgroundColor,
  icon,
}) {
  return (
    <View
      style={[
        styles.stepCard,
        {
          backgroundColor,
        },
      ]}
    >
      <View
        style={
          styles.stepNumber
        }
      >
        <Text
          style={
            styles.stepNumberText
          }
        >
          {number}
        </Text>
      </View>

      <View
        style={
          styles.stepIcon
        }
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            COLORS.primaryDark
          }
        />
      </View>

      <View
        style={
          styles.stepTextArea
        }
      >
        <Text
          style={
            styles.stepTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.stepText
          }
        >
          {text}
        </Text>
      </View>
    </View>
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
    },

    header: {
      height: 64,

      paddingHorizontal: 19,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    backButton: {
      width: 43,
      height: 43,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 22,
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 21,

      color:
        COLORS.textPrimary,
    },

    headerSpacer: {
      width: 43,
    },

    scrollContent: {
      paddingBottom: 28,
    },

    heroImage: {
      width: "100%",
      height: 250,
    },

    mainCard: {
      marginTop: -32,
      marginHorizontal: 20,

      paddingHorizontal: 21,
      paddingTop: 25,
      paddingBottom: 27,

      borderRadius: 28,

      backgroundColor:
        COLORS.card,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.07,
      shadowRadius: 12,

      elevation: 4,
    },

    titleRow: {
      flexDirection: "row",
      alignItems:
        "flex-start",

      justifyContent:
        "space-between",
    },

    titleContainer: {
      flex: 1,
      paddingRight: 10,
    },

    title: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 27,
      lineHeight: 33,

      color:
        COLORS.textPrimary,
    },

    durationBadge: {
      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 11,
      paddingVertical: 8,

      borderRadius: 18,

      backgroundColor:
        COLORS.softYellow,
    },

    durationText: {
      marginLeft: 5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.primaryDark,
    },

    description: {
      marginTop: 15,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 15.5,
      lineHeight: 23,

      color:
        COLORS.textSecondary,
    },

    ideaCard: {
      marginTop: 23,

      paddingHorizontal: 15,
      paddingVertical: 15,

      borderRadius: 20,

      flexDirection: "row",
      alignItems: "center",

      backgroundColor:
        COLORS.softYellow,
    },

    ideaIcon: {
      width: 45,
      height: 45,

      borderRadius: 23,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.white,
    },

    ideaTextArea: {
      flex: 1,
      marginLeft: 12,
    },

    ideaTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.textPrimary,
    },

    ideaText: {
      marginTop: 3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,
      lineHeight: 18,

      color:
        COLORS.textSecondary,
    },

    sectionTitle: {
      marginTop: 25,
      marginBottom: 13,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 19,

      color:
        COLORS.textPrimary,
    },

    stepCard: {
      minHeight: 68,

      marginBottom: 10,

      paddingHorizontal: 11,
      paddingVertical: 10,

      borderRadius: 18,

      flexDirection: "row",
      alignItems: "center",
    },

    stepNumber: {
      width: 35,
      height: 35,

      borderRadius: 18,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(255,255,255,0.75)",
    },

    stepNumberText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.primaryDark,
    },

    stepIcon: {
      width: 35,

      alignItems: "center",
      justifyContent: "center",

      marginLeft: 4,
    },

    stepTextArea: {
      flex: 1,
      marginLeft: 7,
    },

    stepTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13.5,

      color:
        COLORS.textPrimary,
    },

    stepText: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,
      lineHeight: 17,

      color:
        COLORS.textSecondary,
    },

    note: {
      marginTop: 14,

      paddingHorizontal: 14,
      paddingVertical: 10,

      borderRadius: 18,

      flexDirection: "row",
      alignItems: "center",

      alignSelf: "center",

      backgroundColor:
        COLORS.softLavender,
    },

    noteText: {
      marginLeft: 7,

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

    beginButton: {
      height: 58,

      borderRadius: 19,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.primary,

      shadowColor:
        COLORS.primaryDark,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.16,
      shadowRadius: 8,

      elevation: 3,
    },

    beginButtonText: {
      marginRight: 9,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },
  });