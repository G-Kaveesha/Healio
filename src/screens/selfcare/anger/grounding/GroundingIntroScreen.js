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
  background: "#F3F9F7",
  card: "#FFFFFF",

  primary: "#4E8894",
  primaryDark: "#366B75",

  softTeal: "#DFF1EC",
  softTealStrong: "#CBE8E0",

  softBlue: "#E4F1F7",
  softBlueStrong: "#CFE5F0",

  softCream: "#FAF8F2",

  textPrimary: "#25363A",
  textSecondary: "#6F7E81",

  border: "#D9E9E5",

  white: "#FFFFFF",
};

const STEPS = [
  {
    number: "5",
    title: "See",
    text: "Name five things you can see.",
    icon: "eye-outline",
  },
  {
    number: "4",
    title: "Feel",
    text: "Notice four things you can physically feel.",
    icon: "hand-left-outline",
  },
  {
    number: "3",
    title: "Hear",
    text: "Listen for three things you can hear.",
    icon: "volume-medium-outline",
  },
  {
    number: "2",
    title: "Smell",
    text: "Notice two things you can smell.",
    icon: "flower-outline",
  },
  {
    number: "1",
    title: "Taste",
    text: "Notice one thing you can taste.",
    icon: "water-outline",
  },
];

export default function GroundingIntroScreen({
  navigation,
}) {
  const handleStart = () => {
    navigation.navigate("GroundingChat");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.container}>
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
              size={27}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Grounding
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero image */}

          <Image
            source={require(
              "../../../../../assets/images/selfcare/anger/grounding.jpg"
            )}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Main overlapping card */}

          <View style={styles.mainCard}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                Grounding
              </Text>

              <View style={styles.durationBadge}>
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={COLORS.primaryDark}
                />

                <Text style={styles.durationText}>
                  5 min
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              Bring your attention gently
              back to the present moment.
            </Text>

            <Text style={styles.sectionTitle}>
              5-4-3-2-1
            </Text>

            <Text style={styles.sectionSubtitle}>
              We'll take it one sense at
              a time.
            </Text>

            <View style={styles.stepsContainer}>
              {STEPS.map((step) => (
                <View
                  key={step.number}
                  style={styles.stepRow}
                >
                  <View
                    style={
                      styles.numberCircle
                    }
                  >
                    <Text
                      style={
                        styles.numberText
                      }
                    >
                      {step.number}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.stepIconCircle
                    }
                  >
                    <Ionicons
                      name={step.icon}
                      size={19}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View style={styles.stepTextArea}>
                    <Text
                      style={
                        styles.stepTitle
                      }
                    >
                      {step.title}
                    </Text>

                    <Text
                      style={
                        styles.stepText
                      }
                    >
                      {step.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.note}>
              <Ionicons
                name="heart-outline"
                size={18}
                color={COLORS.primary}
              />

              <Text style={styles.noteText}>
                Go slowly. There are no
                right answers.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom */}

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.startButtonText}>
              Start Grounding
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
    height: 62,
    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: COLORS.background,
    zIndex: 10,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    paddingBottom: 28,
  },

  heroImage: {
    width: "100%",
    height: 255,
  },

  mainCard: {
    marginTop: -34,
    marginHorizontal: 20,

    paddingHorizontal: 21,
    paddingTop: 25,
    paddingBottom: 26,

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
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  durationBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 18,

    backgroundColor:
      COLORS.softTeal,
  },

  durationText: {
    marginLeft: 5,
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  description: {
    marginTop: 15,

    fontSize: 15,
    lineHeight: 23,

    color: COLORS.textSecondary,
  },

  sectionTitle: {
    marginTop: 25,

    fontSize: 21,
    fontWeight: "800",

    color: COLORS.textPrimary,
  },

  sectionSubtitle: {
    marginTop: 4,

    fontSize: 13.5,

    color: COLORS.textSecondary,
  },

  stepsContainer: {
    marginTop: 20,
  },

  stepRow: {
    minHeight: 72,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 10,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderRadius: 19,

    backgroundColor:
      COLORS.softCream,
  },

  numberCircle: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.softTealStrong,
  },

  numberText: {
    fontSize: 15,
    fontWeight: "800",

    color: COLORS.primaryDark,
  },

  stepIconCircle: {
    width: 38,
    height: 38,

    marginLeft: 10,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.softBlue,
  },

  stepTextArea: {
    flex: 1,
    marginLeft: 11,
  },

  stepTitle: {
    fontSize: 13.5,
    fontWeight: "750",

    color: COLORS.textPrimary,
  },

  stepText: {
    marginTop: 2,

    fontSize: 12.5,
    lineHeight: 17,

    color: COLORS.textSecondary,
  },

  note: {
    marginTop: 15,

    flexDirection: "row",
    alignItems: "center",

    alignSelf: "center",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    backgroundColor:
      COLORS.softBlue,
  },

  noteText: {
    marginLeft: 7,

    fontSize: 12.5,

    color: COLORS.textSecondary,
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 17,

    backgroundColor:
      COLORS.background,
  },

  startButton: {
    height: 58,

    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.primary,

    shadowColor:
      COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 9,

    elevation: 4,
  },

  startButtonText: {
    marginRight: 9,

    fontSize: 16,
    fontWeight: "700",

    color: COLORS.white,
  },
});