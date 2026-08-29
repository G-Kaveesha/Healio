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

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background: "#F5F9F7",
  card: "#FFFFFF",

  primary: "#6797AE",
  primaryDark: "#477487",

  softBlue: "#E7F2F7",
  softBlueStrong: "#D8EAF2",

  green: "#79A98D",
  greenDark: "#557E67",
  softGreen: "#E4F1E8",

  cream: "#F8F0E4",
  creamDark: "#B18C61",

  textPrimary: "#303A3A",
  textSecondary: "#727D7B",

  border: "#DEE8E4",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * SORT MY WORRY INTRO
 * =========================================================
 */

export default function SortMyWorryIntroScreen({
  navigation,
  route,
}) {
  const handleBegin = () => {
    navigation.navigate(
      "SortMyWorryChat",
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
        {/* =================================================
            HEADER
           ================================================= */}

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
            Sort My Worry
          </Text>

          <View
            style={styles.headerSpacer}
          />
        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* Hero */}

          <Image
            source={require(
              "../../../../../assets/images/selfcare/anxiety/sort_my_worry.jpg"
            )}
            style={styles.heroImage}
            resizeMode="cover"
          />


          {/* Main Card */}

          <View style={styles.mainCard}>
            <View style={styles.titleRow}>
              <View style={styles.titleArea}>
                <Text style={styles.title}>
                  Sort My Worry
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


            <Text style={styles.description}>
              Take one worry at a time and
              decide what needs attention
              now and what can wait.
            </Text>


            {/* Key message */}

            <View style={styles.ideaCard}>
              <View style={styles.ideaIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color={COLORS.greenDark}
                />
              </View>

              <View
                style={
                  styles.ideaTextArea
                }
              >
                <Text
                  style={styles.ideaTitle}
                >
                  One worry is enough
                </Text>

                <Text
                  style={styles.ideaText}
                >
                  You do not need to solve
                  everything at once.
                </Text>
              </View>
            </View>


            <Text
              style={styles.sectionTitle}
            >
              How it works
            </Text>


            <Step
              number="1"
              title="Name it"
              text="Write one worry that's on your mind."
              icon="create-outline"
              backgroundColor={
                COLORS.softBlue
              }
            />

            <Step
              number="2"
              title="Sort it"
              text="Decide whether something can be done now."
              icon="git-branch-outline"
              backgroundColor={
                COLORS.softGreen
              }
            />

            <Step
              number="3"
              title="Choose"
              text="Take one small step or set it aside."
              icon="checkmark-circle-outline"
              backgroundColor={
                COLORS.cream
              }
            />


            <View style={styles.note}>
              <Ionicons
                name="heart-outline"
                size={18}
                color={COLORS.green}
              />

              <Text style={styles.noteText}>
                Share only what feels
                comfortable.
              </Text>
            </View>
          </View>
        </ScrollView>


        {/* =================================================
            BOTTOM
           ================================================= */}

        <View
          style={styles.bottomContainer}
        >
          <TouchableOpacity
            style={styles.beginButton}
            onPress={handleBegin}
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.beginButtonText
              }
            >
              Sort a Worry
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


/*
 * =========================================================
 * STEP
 * =========================================================
 */

function Step({
  number,
  title,
  text,
  icon,
  backgroundColor,
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
      <View style={styles.stepNumber}>
        <Text
          style={
            styles.stepNumberText
          }
        >
          {number}
        </Text>
      </View>

      <View style={styles.stepIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={
            COLORS.primaryDark
          }
        />
      </View>

      <View
        style={styles.stepTextArea}
      >
        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepText}>
          {text}
        </Text>
      </View>
    </View>
  );
}


/*
 * =========================================================
 * STYLES
 * =========================================================
 */

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
      justifyContent: "space-between",
    },

    backButton: {
      width: 43,
      height: 43,

      borderRadius: 22,

      alignItems: "center",
      justifyContent: "center",
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
      alignItems: "flex-start",
      justifyContent: "space-between",
    },

    titleArea: {
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
        COLORS.softBlue,
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
        COLORS.softGreen,
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

      fontSize: 14.5,

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
        "rgba(255,255,255,0.78)",
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

      marginLeft: 4,

      alignItems: "center",
      justifyContent: "center",
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

      backgroundColor:
        COLORS.cream,
    },

    noteText: {
      flex: 1,

      marginLeft: 8,

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