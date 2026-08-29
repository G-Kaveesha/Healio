import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";


const COLORS = {
  background: "#FFF9F0",
  card: "#FFFFFF",

  yellow: "#FFE9A8",
  peach: "#F7C8A0",
  coral: "#F29B82",

  softBlue: "#DFF1F7",
  blue: "#78AFC4",

  textPrimary: "#3C3934",
  textSecondary: "#7A746C",

  border: "#EEE1D3",

  white: "#FFFFFF",
  disabled: "#BDB5AC",
};


const MOMENTS = [
  {
    id: "small-good",
    title:
      "A small good moment",
    subtitle:
      "Something simple that felt nice.",
    icon:
      "sunny-outline",
    color:
      "#FFE9A8",
  },

  {
    id: "someone",
    title:
      "Someone I care about",
    subtitle:
      "A person or connection that matters.",
    icon:
      "heart-outline",
    color:
      "#F7C8A0",
  },

  {
    id: "achievement",
    title:
      "Something I achieved",
    subtitle:
      "Something you feel good about.",
    icon:
      "trophy-outline",
    color:
      "#FFF0C7",
  },

  {
    id: "around-me",
    title:
      "Something around me",
    subtitle:
      "Nature, music, food, light, or anything pleasant.",
    icon:
      "leaf-outline",
    color:
      "#DFF1F7",
  },

  {
    id: "other",
    title:
      "Something else",
    subtitle:
      "Your own kind of good moment.",
    icon:
      "sparkles-outline",
    color:
      "#F7E5EF",
  },
];


export default function HoldTheMomentChooseScreen({
  navigation,
  route,
}) {
  const [
    selectedMoment,
    setSelectedMoment,
  ] = useState(null);


  const handleContinue =
    () => {
      if (
        !selectedMoment
      ) {
        return;
      }

      navigation.navigate(
        "HoldTheMomentSavor",
        {
          ...(route?.params ||
            {}),

          selectedMoment,
        }
      );
    };


  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View
        style={
          styles.container
        }
      >
        {/* Decorative accents */}

        <View
          style={
            styles.yellowShape
          }
        />

        <View
          style={
            styles.blueShape
          }
        />


        {/* Header */}

        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
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
              Hold the Moment
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Choose
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        <View
          style={
            styles.content
          }
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            RIGHT NOW
          </Text>

          <Text
            style={
              styles.title
            }
          >
            What feels good today?
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Choose the closest one.
          </Text>


          <View
            style={
              styles.cardsContainer
            }
          >
            {MOMENTS.map(
              (
                moment
              ) => {
                const selected =
                  selectedMoment
                    ?.id ===
                  moment.id;

                return (
                  <TouchableOpacity
                    key={
                      moment.id
                    }
                    style={[
                      styles.card,

                      {
                        backgroundColor:
                          moment.color,
                      },

                      selected &&
                        styles.selectedCard,
                    ]}
                    onPress={() =>
                      setSelectedMoment(
                        moment
                      )
                    }
                    activeOpacity={
                      0.82
                    }
                  >
                    <View
                      style={[
                        styles.cardIcon,

                        selected &&
                          styles.selectedIcon,
                      ]}
                    >
                      <Ionicons
                        name={
                          moment.icon
                        }
                        size={24}
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.textPrimary
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.cardTextArea
                      }
                    >
                      <Text
                        style={
                          styles.cardTitle
                        }
                      >
                        {
                          moment.title
                        }
                      </Text>

                      <Text
                        style={
                          styles.cardSubtitle
                        }
                      >
                        {
                          moment.subtitle
                        }
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.radio,

                        selected &&
                          styles.radioSelected,
                      ]}
                    >
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color={
                            COLORS.white
                          }
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>


        {/* Bottom */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !selectedMoment &&
                styles.disabledButton,
            ]}
            disabled={
              !selectedMoment
            }
            onPress={
              handleContinue
            }
          >
            <Text
              style={[
                styles.continueText,

                !selectedMoment &&
                  styles.disabledText,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                selectedMoment
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
      width: 240,
      height: 240,
      borderRadius: 120,
      top: -150,
      right: -90,
      backgroundColor:
        COLORS.yellow,
      opacity: 0.55,
    },

    blueShape: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 120,
      left: -160,
      bottom: -80,
      backgroundColor:
        COLORS.softBlue,
      opacity: 0.7,
    },

    header: {
      height: 62,
      paddingHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
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
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 16,
      color:
        COLORS.textPrimary,
    },

    headerSubtitle: {
      marginTop: 2,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 10.5,
      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    content: {
      flex: 1,
      paddingHorizontal: 23,
      paddingTop: 24,
    },

    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 10.5,
      letterSpacing: 1.4,
      color:
        COLORS.coral,
    },

    title: {
      marginTop: 8,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 30,
      lineHeight: 36,
      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 5,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 14,
      color:
        COLORS.textSecondary,
    },

    cardsContainer: {
      marginTop: 25,
    },

    card: {
      minHeight: 88,
      marginBottom: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderRadius: 22,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor:
        "transparent",
    },

    selectedCard: {
      borderColor:
        COLORS.coral,
      backgroundColor:
        COLORS.card,
      elevation: 3,
      shadowColor:
        COLORS.coral,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.11,
      shadowRadius: 7,
    },

    cardIcon: {
      width: 50,
      height: 50,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "rgba(255,255,255,0.7)",
    },

    selectedIcon: {
      backgroundColor:
        COLORS.coral,
    },

    cardTextArea: {
      flex: 1,
      marginLeft: 12,
      marginRight: 10,
    },

    cardTitle: {
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 15.5,
      color:
        COLORS.textPrimary,
    },

    cardSubtitle: {
      marginTop: 3,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 11.5,
      lineHeight: 15,
      color:
        COLORS.textSecondary,
    },

    radio: {
      width: 23,
      height: 23,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor:
        "#BAAEA2",
      alignItems: "center",
      justifyContent: "center",
    },

    radioSelected: {
      borderColor:
        COLORS.coral,
      backgroundColor:
        COLORS.coral,
    },

    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 17,
    },

    continueButton: {
      height: 58,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.coral,
    },

    disabledButton: {
      backgroundColor:
        "#E8E1DA",
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