import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Share,
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

  white: "#FFFFFF",
};


/*
 * =========================================================
 * SHAREABLE STARTERS
 * =========================================================
 */

const SHARE_MESSAGES = {
  message:
    "Just wanted to send a little kindness your way today.",

  thank:
    "Thank you for being there. I appreciate you.",

  compliment:
    "I wanted to remind you that I really appreciate something about you.",

  appreciate:
    "I'm grateful to have you in my life.",
};


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function PassItOnActionScreen({
  navigation,
  route,
}) {
  const selectedAction =
    route?.params
      ?.selectedAction || {
      id: "own",

      title:
        "Your positive action",

      suggestion:
        "Choose one small way to share something positive.",

      icon:
        "sparkles-outline",
    };


  const [
    hasDoneAction,
    setHasDoneAction,
  ] = useState(false);


  /*
   * =======================================================
   * ANIMATION
   * =======================================================
   */

  const cardY =
    useRef(
      new Animated.Value(0)
    ).current;

  const heartScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const animationRef =
    useRef(null);


  useEffect(() => {
    animationRef.current =
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(
              cardY,
              {
                toValue: -6,

                duration: 1800,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              cardY,
              {
                toValue: 0,

                duration: 1800,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),
          ]),

          Animated.sequence([
            Animated.timing(
              heartScale,
              {
                toValue: 1.08,

                duration: 1800,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              heartScale,
              {
                toValue: 1,

                duration: 1800,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),
          ]),
        ])
      );


    animationRef.current.start();


    return () => {
      if (
        animationRef.current
      ) {
        animationRef.current.stop();
      }
    };
  }, [
    cardY,
    heartScale,
  ]);


  /*
   * =======================================================
   * SHARE
   * =======================================================
   */

  const canShareMessage =
    Boolean(
      SHARE_MESSAGES[
        selectedAction.id
      ]
    );


  const handleShare =
    async () => {
      try {
        const message =
          SHARE_MESSAGES[
            selectedAction.id
          ] ||
          "Thinking of you today.";

        await Share.share({
          message,
        });
      } catch (error) {
        console.log(
          "Pass It On share error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * DONE
   * =======================================================
   */

  const handleDone =
    () => {
      setHasDoneAction(
        true
      );
    };


  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {
      navigation.navigate(
        "PassItOnComplete",
        {
          ...(route?.params || {}),

          actionCompleted:
            true,
        }
      );
    };


  /*
   * =======================================================
   * CHOOSE ANOTHER
   * =======================================================
   */

  const handleChooseAnother =
    () => {
      navigation.navigate(
        "PassItOnChoose",
        {
          activityId:
            route?.params
              ?.activityId,

          category:
            "happy",
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
              styles.headerButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>


          <Text
            style={
              styles.headerTitle
            }
          >
            Pass It On
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* =================================================
            MAIN
           ================================================= */}

        <View
          style={
            styles.content
          }
        >
          {!hasDoneAction ? (
            <>
              <Text
                style={
                  styles.smallLabel
                }
              >
                YOUR SMALL ACTION
              </Text>


              <Text
                style={
                  styles.title
                }
              >
                {
                  selectedAction.title
                }
              </Text>


              {/* Large floating action */}

              <View
                style={
                  styles.visualStage
                }
              >
                <View
                  style={
                    styles.yellowCircle
                  }
                />

                <View
                  style={
                    styles.blueCircle
                  }
                />


                <Animated.View
                  style={[
                    styles.mainCard,

                    {
                      transform: [
                        {
                          translateY:
                            cardY,
                        },
                      ],
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.iconBubble,

                      {
                        transform: [
                          {
                            scale:
                              heartScale,
                          },
                        ],
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        selectedAction.icon ||
                        "heart-outline"
                      }
                      size={44}
                      color={
                        COLORS.coralDark
                      }
                    />
                  </Animated.View>


                  <Text
                    style={
                      styles.actionPrompt
                    }
                  >
                    {
                      selectedAction.suggestion
                    }
                  </Text>
                </Animated.View>
              </View>


              <Text
                style={
                  styles.helper
                }
              >
                Take your time. Come
                back when you're done.
              </Text>


              {/* Optional message sharing */}

              {canShareMessage && (
                <TouchableOpacity
                  style={
                    styles.shareButton
                  }
                  onPress={
                    handleShare
                  }
                  activeOpacity={0.82}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color={
                      COLORS.blue
                    }
                  />

                  <Text
                    style={
                      styles.shareText
                    }
                  >
                    Open a message
                  </Text>
                </TouchableOpacity>
              )}


              {/* Done */}

              <TouchableOpacity
                style={
                  styles.doneButton
                }
                onPress={
                  handleDone
                }
                activeOpacity={0.85}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={
                    COLORS.white
                  }
                />

                <Text
                  style={
                    styles.doneText
                  }
                >
                  I've Done It
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={
                  styles.changeButton
                }
                onPress={
                  handleChooseAnother
                }
              >
                <Text
                  style={
                    styles.changeText
                  }
                >
                  Choose another
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /*
             * -----------------------------------------------
             * SMALL SUCCESS STATE
             * -----------------------------------------------
             */

            <View
              style={
                styles.doneState
              }
            >
              <View
                style={
                  styles.doneVisual
                }
              >
                <View
                  style={
                    styles.doneCircleLarge
                  }
                />

                <View
                  style={
                    styles.doneCircleSmall
                  }
                />

                <View
                  style={
                    styles.doneCheck
                  }
                >
                  <Ionicons
                    name="heart"
                    size={42}
                    color={
                      COLORS.coral
                    }
                  />
                </View>
              </View>


              <Text
                style={
                  styles.doneTitle
                }
              >
                You passed it on
              </Text>


              <Text
                style={
                  styles.doneSubtitle
                }
              >
                That's enough.
              </Text>


              <View
                style={
                  styles.doneMessage
                }
              >
                <Ionicons
                  name="sparkles-outline"
                  size={17}
                  color={
                    COLORS.coralDark
                  }
                />

                <Text
                  style={
                    styles.doneMessageText
                  }
                >
                  Small moments of
                  connection can matter.
                </Text>
              </View>
            </View>
          )}
        </View>


        {/* =================================================
            BOTTOM
           ================================================= */}

        {hasDoneAction && (
          <View
            style={
              styles.bottomContainer
            }
          >
            <TouchableOpacity
              style={
                styles.continueButton
              }
              onPress={
                handleContinue
              }
            >
              <Text
                style={
                  styles.continueText
                }
              >
                Continue
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
        )}
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

    headerButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.82)",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.textPrimary,
    },

    headerSpacer: {
      width: 42,
    },


    /*
     * Main
     */

    content: {
      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 26,

      alignItems: "center",
    },

    smallLabel: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1.4,

      color:
        COLORS.coral,
    },

    title: {
      maxWidth: 330,

      marginTop: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 30,

      lineHeight: 36,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },


    /*
     * Visual
     */

    visualStage: {
      flex: 1,

      minHeight: 330,

      width: "100%",

      marginTop: 15,

      alignItems: "center",

      justifyContent:
        "center",
    },

    yellowCircle: {
      position: "absolute",

      width: 270,

      height: 270,

      borderRadius: 135,

      backgroundColor:
        COLORS.yellow,

      opacity: 0.55,
    },

    blueCircle: {
      position: "absolute",

      width: 185,

      height: 185,

      borderRadius: 93,

      right: 12,

      bottom: 25,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.75,
    },

    mainCard: {
      width: 245,

      minHeight: 225,

      paddingHorizontal: 22,

      paddingVertical: 24,

      borderRadius: 38,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation: 6,

      shadowColor:
        COLORS.coral,

      shadowOffset: {
        width: 0,

        height: 8,
      },

      shadowOpacity: 0.12,

      shadowRadius: 14,
    },

    iconBubble: {
      width: 88,

      height: 88,

      borderRadius: 30,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softPink,
    },

    actionPrompt: {
      marginTop: 20,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      lineHeight: 23,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },

    helper: {
      marginTop: 8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      lineHeight: 18,

      textAlign: "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * Share
     */

    shareButton: {
      marginTop: 18,

      height: 43,

      paddingHorizontal: 18,

      borderRadius: 22,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },

    shareText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12.5,

      color:
        COLORS.blue,
    },


    /*
     * Done
     */

    doneButton: {
      marginTop: 12,

      height: 52,

      paddingHorizontal: 28,

      borderRadius: 26,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
    },

    doneText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.white,
    },

    changeButton: {
      paddingHorizontal: 20,

      paddingVertical: 11,
    },

    changeText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },


    /*
     * Done state
     */

    doneState: {
      flex: 1,

      width: "100%",

      alignItems: "center",

      justifyContent:
        "center",
    },

    doneVisual: {
      width: 270,

      height: 270,

      alignItems: "center",

      justifyContent:
        "center",
    },

    doneCircleLarge: {
      position: "absolute",

      width: 235,

      height: 235,

      borderRadius: 118,

      backgroundColor:
        COLORS.yellow,

      opacity: 0.55,
    },

    doneCircleSmall: {
      position: "absolute",

      width: 155,

      height: 155,

      borderRadius: 78,

      backgroundColor:
        COLORS.softBlue,
    },

    doneCheck: {
      width: 104,

      height: 104,

      borderRadius: 36,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation: 4,
    },

    doneTitle: {
      marginTop: 9,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 28,

      color:
        COLORS.textPrimary,
    },

    doneSubtitle: {
      marginTop: 5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      color:
        COLORS.textSecondary,
    },

    doneMessage: {
      marginTop: 19,

      paddingHorizontal: 15,

      paddingVertical: 10,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softPink,
    },

    doneMessageText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Bottom
     */

    bottomContainer: {
      paddingHorizontal: 24,

      paddingBottom: 17,
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

    continueText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },
  });