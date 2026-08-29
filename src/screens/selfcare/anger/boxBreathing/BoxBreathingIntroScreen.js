import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F3FAF8",
  card: "#FFFFFF",

  primary: "#4F8FA8",
  primaryDark: "#356B7F",

  mint: "#CDECE3",
  mintSoft: "#E7F6F1",

  blue: "#88BBD6",
  blueSoft: "#E8F3F8",

  teal: "#5FA6A0",

  textPrimary: "#26373C",
  textSecondary: "#667A80",

  border: "#DCEBE8",

  white: "#FFFFFF",
};

const BOX_IMAGE = require(
  "../../../../../assets/images/selfcare/anger/box_breathing.jpg"
);

const STEPS = [
  {
    id: 1,
    title: "Breathe in slowly.",
  },
  {
    id: 2,
    title: "Hold your breath gently.",
  },
  {
    id: 3,
    title: "Breathe out slowly.",
  },
  {
    id: 4,
    title: "Pause before breathing in again.",
  },
];

export default function BoxBreathingIntroScreen({
  navigation,
}) {
  const handleBegin = () => {
    navigation.navigate(
      "BoxBreathingExercise"
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
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
              size={28}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Box Breathing
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* Top image */}

          <Image
            source={BOX_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* White overlapping card */}

          <View style={styles.infoCard}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                Box Breathing
              </Text>

              <View style={styles.durationBadge}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={COLORS.primaryDark}
                />

                <Text
                  style={
                    styles.durationText
                  }
                >
                  2 min
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              Follow four slow, equal
              breathing steps to create a
              gentle pause.
            </Text>

            <Text style={styles.sectionTitle}>
              Follow these steps
            </Text>

            {STEPS.map((step) => (
              <View
                key={step.id}
                style={styles.stepRow}
              >
                <View
                  style={styles.stepNumber}
                >
                  <Text
                    style={
                      styles.stepNumberText
                    }
                  >
                    {step.id}
                  </Text>
                </View>

                <Text
                  style={styles.stepText}
                >
                  {step.title}
                </Text>
              </View>
            ))}

            {/* Pattern */}

            <View style={styles.patternCard}>
              <View
                style={styles.patternItem}
              >
                <Ionicons
                  name="arrow-forward-outline"
                  size={17}
                  color={COLORS.primary}
                />

                <Text
                  style={
                    styles.patternText
                  }
                >
                  Inhale
                </Text>
              </View>

              <Text style={styles.dot}>
                •
              </Text>

              <View
                style={styles.patternItem}
              >
                <Text
                  style={
                    styles.patternText
                  }
                >
                  Hold
                </Text>
              </View>

              <Text style={styles.dot}>
                •
              </Text>

              <View
                style={styles.patternItem}
              >
                <Text
                  style={
                    styles.patternText
                  }
                >
                  Exhale
                </Text>
              </View>

              <Text style={styles.dot}>
                •
              </Text>

              <View
                style={styles.patternItem}
              >
                <Text
                  style={
                    styles.patternText
                  }
                >
                  Hold
                </Text>
              </View>
            </View>

            {/* Gentle safety note */}

            <View style={styles.note}>
              <Ionicons
                name="heart-outline"
                size={19}
                color={COLORS.teal}
              />

              <Text style={styles.noteText}>
                Breathe comfortably and
                stop if you feel
                uncomfortable.
              </Text>
            </View>

            {/* Begin button */}

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
                Begin Breathing
              </Text>

              <Ionicons
                name="arrow-forward"
                size={21}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    height: 66,
    paddingHorizontal: 17,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor:
      COLORS.background,

    zIndex: 10,
  },

  backButton: {
    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  headerSpacer: {
    width: 44,
  },

  scrollContent: {
    paddingBottom: 34,
  },

  heroImage: {
    width: "100%",
    height: 265,
  },

  infoCard: {
    marginTop: -34,
    marginHorizontal: 20,

    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 24,

    borderRadius: 28,

    backgroundColor:
      COLORS.card,

    borderWidth: 1,
    borderColor:
      "rgba(79,143,168,0.08)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,

    elevation: 5,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,

    fontSize: 28,
    fontWeight: "800",

    color: COLORS.textPrimary,
  },

  durationBadge: {
    marginLeft: 12,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.mintSoft,
  },

  durationText: {
    marginLeft: 5,

    fontSize: 13,
    fontWeight: "700",

    color: COLORS.primaryDark,
  },

  description: {
    marginTop: 20,

    fontSize: 15,
    lineHeight: 23,

    color: COLORS.textSecondary,
  },

  sectionTitle: {
    marginTop: 29,
    marginBottom: 17,

    fontSize: 20,
    fontWeight: "800",

    color: COLORS.textPrimary,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 17,
  },

  stepNumber: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.mintSoft,
  },

  stepNumberText: {
    fontSize: 14,
    fontWeight: "800",

    color: COLORS.primaryDark,
  },

  stepText: {
    flex: 1,

    marginLeft: 14,

    fontSize: 14.5,
    lineHeight: 21,

    fontWeight: "600",

    color: COLORS.textPrimary,
  },

  patternCard: {
    marginTop: 5,

    paddingVertical: 13,
    paddingHorizontal: 12,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",

    backgroundColor:
      COLORS.blueSoft,
  },

  patternItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  patternText: {
    fontSize: 12.5,
    fontWeight: "700",

    color: COLORS.primaryDark,
  },

  dot: {
    marginHorizontal: 6,

    fontSize: 14,

    color: COLORS.teal,
  },

  note: {
    marginTop: 19,

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.mintSoft,
  },

  noteText: {
    flex: 1,

    marginLeft: 9,

    fontSize: 12.5,
    lineHeight: 18,

    color: COLORS.textSecondary,
  },

  beginButton: {
    marginTop: 24,

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

    elevation: 3,
  },

  beginButtonText: {
    marginRight: 9,

    fontSize: 16,
    fontWeight: "700",

    color: COLORS.white,
  },
});