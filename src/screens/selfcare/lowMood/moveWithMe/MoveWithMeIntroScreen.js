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
  background: "#FFF9F4",
  card: "#FFFFFF",

  primary: "#E8903A",
  primaryDark: "#BD6420",

  softOrange: "#FFE7D2",
  softOrangeStrong: "#FFD3AE",

  softYellow: "#FFF4C8",
  softYellowStrong: "#FFE99A",

  softBlue: "#E8F3FA",
  blue: "#79AFCB",

  textPrimary: "#333338",
  textSecondary: "#77767B",

  border: "#F0E3D7",

  white: "#FFFFFF",
};

export default function MoveWithMeIntroScreen({
  navigation,
  route,
}) {
  const handleBegin = () => {
    navigation.navigate(
      "MoveWithMeChoose",
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
            Move With Me
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
          {/* Hero image */}

          <Image
            source={require(
              "../../../../../assets/images/selfcare/lowMood/move_with_me.jpg"
            )}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Main card */}

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
                  Move With Me
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
              A few minutes of gentle
              movement can help you reconnect
              with your body when your energy
              feels low.
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
                  name="body-outline"
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
                  Move gently
                </Text>

                <Text
                  style={
                    styles.ideaText
                  }
                >
                  You do not need a workout.
                  A little movement is enough.
                </Text>
              </View>
            </View>

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
              text="Pick the kind of movement that feels manageable."
              backgroundColor={
                COLORS.softOrange
              }
              icon="options-outline"
            />

            <Step
              number="2"
              title="Move"
              text="Follow a short guided movement."
              backgroundColor={
                COLORS.softYellow
              }
              icon="walk-outline"
            />

            <Step
              number="3"
              title="Slow down"
              text="Finish gently and notice how your body feels."
              backgroundColor={
                COLORS.softBlue
              }
              icon="heart-outline"
            />

            <View
              style={styles.note}
            >
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={
                  COLORS.blue
                }
              />

              <Text
                style={
                  styles.noteText
                }
              >
                Move at your own pace.
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
              Choose Movement
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
        style={styles.stepNumber}
      >
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
        <Text
          style={styles.stepTitle}
        >
          {title}
        </Text>

        <Text
          style={styles.stepText}
        >
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
    fontFamily:
      "JosefinSans_700Bold",

    fontSize: 21,

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

  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontFamily:
      "JosefinSans_700Bold",

    fontSize: 27,
    lineHeight: 33,

    color: COLORS.textPrimary,
  },

  durationBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 11,
    paddingVertical: 8,

    borderRadius: 18,

    backgroundColor:
      COLORS.softOrange,
  },

  durationText: {
    marginLeft: 5,

    fontFamily:
      "JosefinSans_700Bold",

    fontSize: 12,

    color: COLORS.primaryDark,
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

    color: COLORS.textPrimary,
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
    fontFamily:
      "JosefinSans_700Bold",

    fontSize: 14,

    color: COLORS.primaryDark,
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

    color: COLORS.textPrimary,
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

    alignSelf: "center",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    backgroundColor:
      COLORS.softBlue,
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