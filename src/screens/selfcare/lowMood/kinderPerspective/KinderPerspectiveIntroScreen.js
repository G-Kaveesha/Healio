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
  background: "#F8F7FC",
  card: "#FFFFFF",

  primary: "#8676B5",
  primaryDark: "#66558F",

  softLavender: "#EEEAF8",
  softLavenderStrong: "#DED6F1",

  softBlue: "#E8F2F8",
  blue: "#79A7C4",

  softYellow: "#FFF5CF",
  yellow: "#D6AA3B",

  textPrimary: "#30303C",
  textSecondary: "#777685",

  border: "#E6E1ED",

  white: "#FFFFFF",
};

export default function KinderPerspectiveIntroScreen({
  navigation,
  route,
}) {
  const handleBegin = () => {
    navigation.navigate(
      "KinderPerspectiveChat",
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

          <Text style={styles.headerTitle}>
            A Kinder Perspective
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* Hero */}

          <Image
            source={require(
              "../../../../../assets/images/selfcare/lowMood/kinder_perspective.jpg"
            )}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Overlapping card */}

          <View style={styles.mainCard}>
            <View style={styles.titleRow}>
              <View style={styles.titleArea}>
                <Text style={styles.title}>
                  A Kinder Perspective
                </Text>
              </View>

              <View
                style={styles.durationBadge}
              >
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={
                    COLORS.primaryDark
                  }
                />

                <Text
                  style={styles.durationText}
                >
                  5 min
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              Give a difficult thought a
              little space and look at it
              from a gentler point of view.
            </Text>

            {/* Important principle */}

            <View
              style={styles.messageCard}
            >
              <View
                style={styles.messageIcon}
              >
                <Ionicons
                  name="heart-outline"
                  size={25}
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>

              <View
                style={styles.messageArea}
              >
                <Text
                  style={styles.messageTitle}
                >
                  Not forced positivity
                </Text>

                <Text
                  style={styles.messageText}
                >
                  You don't need to ignore
                  how you feel. We'll just
                  look for a fairer response.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              How it works
            </Text>

            <Step
              number="1"
              title="Notice"
              text="Share what's weighing on your mind."
              icon="chatbubble-outline"
              backgroundColor={
                COLORS.softLavender
              }
            />

            <Step
              number="2"
              title="Step back"
              text="Think about what you would say to a friend."
              icon="people-outline"
              backgroundColor={
                COLORS.softBlue
              }
            />

            <Step
              number="3"
              title="Respond kindly"
              text="Create a gentler, balanced thought."
              icon="heart-outline"
              backgroundColor={
                COLORS.softYellow
              }
            />

            <View style={styles.note}>
              <Ionicons
                name="sparkles-outline"
                size={17}
                color={COLORS.yellow}
              />

              <Text style={styles.noteText}>
                Take your time. You can
                skip anything you don't
                want to share.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom */}

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.beginButton}
            onPress={handleBegin}
            activeOpacity={0.85}
          >
            <Text
              style={styles.beginButtonText}
            >
              Begin
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
          style={styles.stepNumberText}
        >
          {number}
        </Text>
      </View>

      <View style={styles.stepIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primaryDark}
        />
      </View>

      <View style={styles.stepTextArea}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 22,
  },

  headerTitle: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 19,
    color: COLORS.textPrimary,
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

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,

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
    fontFamily: "JosefinSans_700Bold",
    fontSize: 26,
    lineHeight: 32,
    color: COLORS.textPrimary,
  },

  durationBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 11,
    paddingVertical: 8,

    borderRadius: 18,

    backgroundColor:
      COLORS.softLavender,
  },

  durationText: {
    marginLeft: 5,

    fontFamily: "JosefinSans_700Bold",
    fontSize: 12,

    color: COLORS.primaryDark,
  },

  description: {
    marginTop: 15,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 15.5,
    lineHeight: 23,

    color: COLORS.textSecondary,
  },

  messageCard: {
    marginTop: 23,

    paddingHorizontal: 15,
    paddingVertical: 15,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.softLavender,
  },

  messageIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.white,
  },

  messageArea: {
    flex: 1,
    marginLeft: 12,
  },

  messageTitle: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 14.5,
    color: COLORS.textPrimary,
  },

  messageText: {
    marginTop: 3,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 12.5,
    lineHeight: 18,

    color: COLORS.textSecondary,
  },

  sectionTitle: {
    marginTop: 25,
    marginBottom: 13,

    fontFamily: "JosefinSans_700Bold",

    fontSize: 19,
    color: COLORS.textPrimary,
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
    fontFamily: "JosefinSans_700Bold",
    fontSize: 14,
    color: COLORS.primaryDark,
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
    fontFamily: "JosefinSans_700Bold",
    fontSize: 13.5,
    color: COLORS.textPrimary,
  },

  stepText: {
    marginTop: 2,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 12.5,
    lineHeight: 17,

    color: COLORS.textSecondary,
  },

  note: {
    marginTop: 14,

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.softYellow,
  },

  noteText: {
    flex: 1,
    marginLeft: 7,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 12.5,
    lineHeight: 18,

    color: COLORS.textSecondary,
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
  },

  beginButtonText: {
    marginRight: 9,

    fontFamily: "JosefinSans_700Bold",
    fontSize: 16,

    color: COLORS.white,
  },
});