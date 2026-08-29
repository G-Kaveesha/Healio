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
  background: "#FFF9F2",

  card: "#FFFFFF",

  yellow: "#FFE7A0",

  peach: "#F8C9A8",

  coral: "#EF967D",
  coralDark: "#C96E59",

  softBlue: "#E3F2F7",
  blue: "#72A9C0",

  softPink: "#FCE6E5",

  textPrimary: "#3B3935",
  textSecondary: "#78736C",

  border: "#EDE1D7",

  white: "#FFFFFF",

  disabled: "#BEB7AF",
};


/*
 * =========================================================
 * ACTION OPTIONS
 * =========================================================
 */

const ACTIONS = [
  {
    id: "message",

    title:
      "Send a kind message",

    subtitle:
      "A simple hello or caring thought.",

    icon:
      "chatbubble-ellipses-outline",

    color:
      "#FFE7A0",

    suggestion:
      "Send someone a short message that could brighten their day.",
  },

  {
    id: "thank",

    title:
      "Thank someone",

    subtitle:
      "Let someone know you noticed.",

    icon:
      "heart-outline",

    color:
      "#F8C9A8",

    suggestion:
      "Thank someone for something small or meaningful.",
  },

  {
    id: "compliment",

    title:
      "Give a compliment",

    subtitle:
      "Say something genuine.",

    icon:
      "sparkles-outline",

    color:
      "#FCE6E5",

    suggestion:
      "Tell someone one genuine thing you appreciate about them.",
  },

  {
    id: "help",

    title:
      "Do one helpful thing",

    subtitle:
      "A small action is enough.",

    icon:
      "hand-left-outline",

    color:
      "#E3F2F7",

    suggestion:
      "Do one small helpful thing for someone nearby.",
  },

  {
    id: "appreciate",

    title:
      "Show appreciation",

    subtitle:
      "Remind someone they matter.",

    icon:
      "people-outline",

    color:
      "#FFF0C5",

    suggestion:
      "Tell someone why you appreciate having them in your life.",
  },

  {
    id: "own",

    title:
      "Choose my own",

    subtitle:
      "You already have something in mind.",

    icon:
      "create-outline",

    color:
      "#E8F3F6",

    suggestion:
      "Choose your own small way to share something positive.",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function PassItOnChooseScreen({
  navigation,
  route,
}) {
  const [
    selectedAction,
    setSelectedAction,
  ] = useState(null);


  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {
      if (
        !selectedAction
      ) {
        return;
      }

      navigation.navigate(
        "PassItOnAction",
        {
          ...(route?.params || {}),

          selectedAction,
        }
      );
    };


  /*
   * =======================================================
   * UI
   * =======================================================
   */

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
        {/* Decorative blobs */}

        <View
          style={
            styles.topBlob
          }
        />

        <View
          style={
            styles.bottomBlob
          }
        />


        {/* =================================================
            HEADER
           ================================================= */}

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
              Pass It On
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


        {/* =================================================
            CONTENT
           ================================================= */}

        <ScrollView
          style={
            styles.scroll
          }
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            ONE SMALL THING
          </Text>


          <Text
            style={
              styles.title
            }
          >
            What feels easy today?
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Pick just one.
          </Text>


          {/* Options */}

          <View
            style={
              styles.options
            }
          >
            {ACTIONS.map(
              (
                action
              ) => {
                const selected =
                  selectedAction
                    ?.id ===
                  action.id;


                return (
                  <TouchableOpacity
                    key={
                      action.id
                    }
                    style={[
                      styles.actionCard,

                      {
                        backgroundColor:
                          action.color,
                      },

                      selected &&
                        styles.selectedCard,
                    ]}
                    onPress={() =>
                      setSelectedAction(
                        action
                      )
                    }
                    activeOpacity={
                      0.84
                    }
                  >
                    <View
                      style={[
                        styles.actionIcon,

                        selected &&
                          styles.selectedIcon,
                      ]}
                    >
                      <Ionicons
                        name={
                          action.icon
                        }
                        size={25}
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.textPrimary
                        }
                      />
                    </View>


                    <View
                      style={
                        styles.actionTextArea
                      }
                    >
                      <Text
                        style={[
                          styles.actionTitle,

                          selected &&
                            styles.selectedTitle,
                        ]}
                      >
                        {
                          action.title
                        }
                      </Text>

                      <Text
                        style={
                          styles.actionSubtitle
                        }
                      >
                        {
                          action.subtitle
                        }
                      </Text>
                    </View>


                    <View
                      style={[
                        styles.checkCircle,

                        selected &&
                          styles.checkCircleSelected,
                      ]}
                    >
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={14}
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
        </ScrollView>


        {/* =================================================
            BOTTOM
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !selectedAction &&
                styles.disabledButton,
            ]}
            disabled={
              !selectedAction
            }
            onPress={
              handleContinue
            }
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueText,

                !selectedAction &&
                  styles.disabledText,
              ]}
            >
              Let's Do It
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                selectedAction
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

      overflow: "hidden",
    },

    topBlob: {
      position: "absolute",

      width: 260,

      height: 260,

      borderRadius: 130,

      top: -175,

      right: -110,

      backgroundColor:
        COLORS.yellow,

      opacity: 0.45,
    },

    bottomBlob: {
      position: "absolute",

      width: 250,

      height: 250,

      borderRadius: 125,

      bottom: -110,

      left: -160,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.65,
    },


    /*
     * Header
     */

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
        "rgba(255,255,255,0.8)",
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


    /*
     * Content
     */

    scroll: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 23,

      paddingTop: 23,

      paddingBottom: 20,
    },

    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1.3,

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

    options: {
      marginTop: 25,
    },


    /*
     * Cards
     */

    actionCard: {
      minHeight: 90,

      marginBottom: 12,

      paddingHorizontal: 14,

      paddingVertical: 13,

      borderRadius: 23,

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
        COLORS.white,

      elevation: 3,

      shadowColor:
        COLORS.coral,

      shadowOffset: {
        width: 0,

        height: 3,
      },

      shadowOpacity: 0.12,

      shadowRadius: 7,
    },

    actionIcon: {
      width: 52,

      height: 52,

      borderRadius: 18,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.74)",
    },

    selectedIcon: {
      backgroundColor:
        COLORS.coral,
    },

    actionTextArea: {
      flex: 1,

      marginLeft: 13,

      marginRight: 9,
    },

    actionTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.textPrimary,
    },

    selectedTitle: {
      color:
        COLORS.coralDark,
    },

    actionSubtitle: {
      marginTop: 4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      lineHeight: 16,

      color:
        COLORS.textSecondary,
    },

    checkCircle: {
      width: 24,

      height: 24,

      borderRadius: 12,

      borderWidth: 1.5,

      borderColor:
        "#BCAF9F",

      alignItems: "center",

      justifyContent: "center",
    },

    checkCircleSelected: {
      borderColor:
        COLORS.coral,

      backgroundColor:
        COLORS.coral,
    },


    /*
     * Bottom
     */

    bottomContainer: {
      paddingHorizontal: 24,

      paddingTop: 10,

      paddingBottom: 17,

      backgroundColor:
        COLORS.background,
    },

    continueButton: {
      height: 58,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

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