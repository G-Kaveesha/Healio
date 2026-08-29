import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
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
  softYellow: "#FFF4C8",
  softBlue: "#E8F3FA",

  blue: "#79AFCB",

  textPrimary: "#333338",
  textSecondary: "#77767B",

  border: "#F0E3D7",

  white: "#FFFFFF",
  disabled: "#BEBAB5",
};

const BOY_MASCOT = require(
  "../../../../../assets/images/selfcare/lowMood/moveWithMe/boy_mascot.png"
);

const MOVEMENT_OPTIONS = [
  {
    id: "stretch",
    title: "Gentle Stretch",
    duration: "4 min",
    icon: "body-outline",
    background: "#FFE7D2",
  },

  {
    id: "walk",
    title: "Walk With Me",
    duration: "5 min",
    icon: "walk-outline",
    background: "#FFF4C8",
  },

  {
    id: "shake",
    title: "Shake It Out",
    duration: "3 min",
    icon: "musical-notes-outline",
    background: "#E8F3FA",
  },
];

export default function MoveWithMeChooseScreen({
  navigation,
  route,
}) {
  const [
    selectedMovement,
    setSelectedMovement,
  ] = useState(null);

  const handleContinue = () => {
    if (!selectedMovement) {
      return;
    }

    navigation.navigate(
      "MoveWithMeExercise",
      {
        ...(route?.params || {}),
        selectedMovement,
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.container}>
        <View style={styles.orangeShape} />
        <View style={styles.blueShape} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Move With Me
            </Text>

            <Text style={styles.headerSubtitle}>
              Choose
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          {/* Mascot */}
          <View style={styles.heroCard}>
            <Image
              source={BOY_MASCOT}
              style={styles.mascotImage}
              resizeMode="contain"
            />

            <View style={styles.heroTextWrap}>
              <Text style={styles.title}>
                Pick a gentle movement
              </Text>

              <Text style={styles.description}>
                Choose what feels easiest today.
              </Text>
            </View>
          </View>

          {/* Movement Cards */}
          <View style={styles.optionsContainer}>
            {MOVEMENT_OPTIONS.map((movement) => {
              const selected =
                selectedMovement?.id === movement.id;

              return (
                <TouchableOpacity
                  key={movement.id}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor:
                        movement.background,
                    },
                    selected && styles.selectedCard,
                  ]}
                  onPress={() =>
                    setSelectedMovement(movement)
                  }
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      selected && styles.selectedIcon,
                    ]}
                  >
                    <Ionicons
                      name={movement.icon}
                      size={24}
                      color={
                        selected
                          ? COLORS.white
                          : COLORS.primaryDark
                      }
                    />
                  </View>

                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        selected && styles.selectedTitle,
                      ]}
                    >
                      {movement.title}
                    </Text>

                    <View style={styles.durationRow}>
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color={COLORS.textSecondary}
                      />

                      <Text style={styles.durationText}>
                        {movement.duration}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      selected && styles.selectedRadio,
                    ]}
                  >
                    {selected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.noteCard}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={COLORS.blue}
            />

            <Text style={styles.noteText}>
              Low energy? Gentle Stretch is a great place to start.
            </Text>
          </View>
        </View>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedMovement && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedMovement}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueText,
                !selectedMovement && styles.disabledText,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                selectedMovement
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

  orangeShape: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -150,
    right: -95,
    backgroundColor: COLORS.softOrange,
    opacity: 0.65,
  },

  blueShape: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: 30,
    left: -170,
    backgroundColor: COLORS.softBlue,
    opacity: 0.65,
  },

  header: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  headerSubtitle: {
    marginTop: 2,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    flex: 1,
    paddingHorizontal: 23,
    paddingTop: 16,
  },

  heroCard: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 28,
    paddingTop: 16,
    paddingBottom: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: "#C98A54",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  mascotImage: {
    width: 150,
    height: 170,
  },

  heroTextWrap: {
    marginTop: 6,
    alignItems: "center",
  },

  title: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 26,
    textAlign: "center",
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 7,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 13.5,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  optionsContainer: {
    width: "100%",
    marginTop: 22,
  },

  optionCard: {
    width: "100%",
    minHeight: 92,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 3,
  },

  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.75)",
  },

  selectedIcon: {
    backgroundColor: COLORS.primary,
  },

  optionContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 9,
  },

  optionTitle: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  selectedTitle: {
    color: COLORS.primaryDark,
  },

  durationRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  durationText: {
    marginLeft: 4,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#C9C2BB",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedRadio: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },

  noteCard: {
    marginTop: 6,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softBlue,
  },

  noteText: {
    flex: 1,
    marginLeft: 9,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 17,
  },

  continueButton: {
    height: 58,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  disabledButton: {
    backgroundColor: "#E7E1DC",
  },

  continueText: {
    marginRight: 8,
    fontFamily: "JosefinSans_700Bold",
    fontSize: 16,
    color: COLORS.white,
  },

  disabledText: {
    color: COLORS.disabled,
  },
});