import React, {
  useEffect,
  useRef,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
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
  yellowDark: "#C8922E",

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
 * SCREEN
 * =========================================================
 */

export default function PassItOnIntroScreen({
  navigation,
  route,
}) {
  /*
   * Floating decorative elements.
   */

  const heartY =
    useRef(
      new Animated.Value(0)
    ).current;

  const sparkleOpacity =
    useRef(
      new Animated.Value(0.35)
    ).current;

  const messageScale =
    useRef(
      new Animated.Value(1)
    ).current;


  /*
   * =======================================================
   * ANIMATION
   * =======================================================
   */

  useEffect(() => {
    const heartAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            heartY,
            {
              toValue: -8,

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
            heartY,
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
        ])
      );


    const sparkleAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            sparkleOpacity,
            {
              toValue: 1,

              duration: 1300,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            sparkleOpacity,
            {
              toValue: 0.3,

              duration: 1300,

              useNativeDriver:
                true,
            }
          ),
        ])
      );


    const messageAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            messageScale,
            {
              toValue: 1.045,

              duration: 1600,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            messageScale,
            {
              toValue: 1,

              duration: 1600,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true,
            }
          ),
        ])
      );


    heartAnimation.start();

    sparkleAnimation.start();

    messageAnimation.start();


    return () => {
      heartAnimation.stop();

      sparkleAnimation.stop();

      messageAnimation.stop();
    };
  }, [
    heartY,
    sparkleOpacity,
    messageScale,
  ]);


  /*
   * =======================================================
   * START
   * =======================================================
   */

  const handleStart =
    () => {
      navigation.navigate(
        "PassItOnChoose",
        {
          ...(route?.params || {}),
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
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={27}
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
            HERO
           ================================================= */}

        <View
          style={
            styles.hero
          }
        >
          <View
            style={
              styles.yellowBlob
            }
          />

          <View
            style={
              styles.blueBlob
            }
          />

          <View
            style={
              styles.peachBlob
            }
          />


          {/* Message */}

          <Animated.View
            style={[
              styles.messageCard,

              {
                transform: [
                  {
                    scale:
                      messageScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={40}
              color={
                COLORS.coralDark
              }
            />

            <View
              style={
                styles.messageLines
              }
            >
              <View
                style={
                  styles.messageLineLong
                }
              />

              <View
                style={
                  styles.messageLineShort
                }
              />
            </View>
          </Animated.View>


          {/* Floating heart */}

          <Animated.View
            style={[
              styles.heartBubble,

              {
                transform: [
                  {
                    translateY:
                      heartY,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="heart"
              size={26}
              color={
                COLORS.coral
              }
            />
          </Animated.View>


          {/* Sparkle */}

          <Animated.View
            style={[
              styles.sparkle,

              {
                opacity:
                  sparkleOpacity,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={23}
              color={
                COLORS.yellowDark
              }
            />
          </Animated.View>


          <View
            style={
              styles.heroLabel
            }
          >
            <Text
              style={
                styles.heroLabelText
              }
            >
              A little kindness travels.
            </Text>
          </View>
        </View>


        {/* =================================================
            MAIN CONTENT
           ================================================= */}

        <View
          style={
            styles.content
          }
        >
          <View
            style={
              styles.badge
            }
          >
            <Ionicons
              name="people-outline"
              size={16}
              color={
                COLORS.coralDark
              }
            />

            <Text
              style={
                styles.badgeText
              }
            >
              CONNECTION
            </Text>
          </View>


          <Text
            style={
              styles.title
            }
          >
            Share a little good
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Choose one small way to
            brighten someone else's
            moment.
          </Text>


          {/* Three ideas */}

          <View
            style={
              styles.ideaRow
            }
          >
            <View
              style={
                styles.ideaItem
              }
            >
              <View
                style={[
                  styles.ideaIcon,

                  {
                    backgroundColor:
                      COLORS.yellow,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={21}
                  color={
                    COLORS.yellowDark
                  }
                />
              </View>

              <Text
                style={
                  styles.ideaText
                }
              >
                Say
              </Text>
            </View>


            <View
              style={
                styles.connector
              }
            />


            <View
              style={
                styles.ideaItem
              }
            >
              <View
                style={[
                  styles.ideaIcon,

                  {
                    backgroundColor:
                      COLORS.peach,
                  },
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={21}
                  color={
                    COLORS.coralDark
                  }
                />
              </View>

              <Text
                style={
                  styles.ideaText
                }
              >
                Share
              </Text>
            </View>


            <View
              style={
                styles.connector
              }
            />


            <View
              style={
                styles.ideaItem
              }
            >
              <View
                style={[
                  styles.ideaIcon,

                  {
                    backgroundColor:
                      COLORS.softBlue,
                  },
                ]}
              >
                <Ionicons
                  name="hand-left-outline"
                  size={21}
                  color={
                    COLORS.blue
                  }
                />
              </View>

              <Text
                style={
                  styles.ideaText
                }
              >
                Help
              </Text>
            </View>
          </View>


          <View
            style={
              styles.note
            }
          >
            <Ionicons
              name="sparkles-outline"
              size={17}
              color={
                COLORS.coral
              }
            />

            <Text
              style={
                styles.noteText
              }
            >
              Keep it small and genuine.
            </Text>
          </View>
        </View>


        {/* =================================================
            BOTTOM
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={
              styles.startButton
            }
            onPress={
              handleStart
            }
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.startButtonText
              }
            >
              Choose Something Small
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
        "rgba(255,255,255,0.82)",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 17,

      color:
        COLORS.textPrimary,
    },

    headerSpacer: {
      width: 42,
    },


    /*
     * Hero
     */

    hero: {
      height: 300,

      marginHorizontal: 20,

      marginTop: 9,

      borderRadius: 38,

      overflow: "hidden",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#FFF0D1",
    },

    yellowBlob: {
      position: "absolute",

      width: 205,

      height: 205,

      borderRadius: 103,

      top: -70,

      left: -52,

      backgroundColor:
        COLORS.yellow,

      opacity: 0.9,
    },

    blueBlob: {
      position: "absolute",

      width: 220,

      height: 220,

      borderRadius: 110,

      bottom: -108,

      right: -50,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.9,
    },

    peachBlob: {
      position: "absolute",

      width: 110,

      height: 110,

      borderRadius: 55,

      right: 35,

      top: 26,

      backgroundColor:
        COLORS.peach,

      opacity: 0.78,
    },

    messageCard: {
      width: 170,

      height: 125,

      borderRadius: 32,

      paddingHorizontal: 22,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation: 5,

      shadowColor:
        COLORS.coral,

      shadowOffset: {
        width: 0,

        height: 7,
      },

      shadowOpacity: 0.13,

      shadowRadius: 12,
    },

    messageLines: {
      flex: 1,

      marginLeft: 14,
    },

    messageLineLong: {
      width: "100%",

      height: 8,

      borderRadius: 5,

      backgroundColor:
        COLORS.peach,
    },

    messageLineShort: {
      width: "65%",

      height: 8,

      marginTop: 10,

      borderRadius: 5,

      backgroundColor:
        COLORS.softBlue,
    },

    heartBubble: {
      position: "absolute",

      width: 55,

      height: 55,

      borderRadius: 20,

      right: 52,

      top: 43,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation: 3,
    },

    sparkle: {
      position: "absolute",

      left: 58,

      bottom: 67,
    },

    heroLabel: {
      position: "absolute",

      bottom: 18,

      paddingHorizontal: 16,

      paddingVertical: 8,

      borderRadius: 18,

      backgroundColor:
        "rgba(255,255,255,0.78)",
    },

    heroLabelText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },


    /*
     * Content
     */

    content: {
      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 23,

      alignItems: "center",
    },

    badge: {
      paddingHorizontal: 12,

      paddingVertical: 7,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softPink,
    },

    badgeText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1,

      color:
        COLORS.coralDark,
    },

    title: {
      marginTop: 15,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 29,

      lineHeight: 35,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },

    description: {
      maxWidth: 310,

      marginTop: 7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      lineHeight: 20,

      textAlign: "center",

      color:
        COLORS.textSecondary,
    },

    ideaRow: {
      width: "100%",

      marginTop: 25,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",
    },

    ideaItem: {
      width: 65,

      alignItems: "center",
    },

    ideaIcon: {
      width: 48,

      height: 48,

      borderRadius: 18,

      alignItems: "center",

      justifyContent:
        "center",
    },

    ideaText: {
      marginTop: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },

    connector: {
      width: 35,

      height: 1,

      marginBottom: 18,

      backgroundColor:
        "#E8D8C9",
    },

    note: {
      marginTop: 20,

      paddingHorizontal: 14,

      paddingVertical: 9,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.yellow,
    },

    noteText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

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

    startButton: {
      height: 58,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,

      shadowColor:
        COLORS.coral,

      shadowOffset: {
        width: 0,

        height: 5,
      },

      shadowOpacity: 0.18,

      shadowRadius: 9,

      elevation: 3,
    },

    startButtonText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },
  });