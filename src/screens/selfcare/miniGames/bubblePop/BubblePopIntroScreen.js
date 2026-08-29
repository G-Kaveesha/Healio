import React, {
  useCallback,
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
  BackHandler,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  Ionicons,
} from "@expo/vector-icons";


const COLORS = {
  background: "#EEF6FA",
  card: "#FFFFFF",

  blue: "#78AFC4",
  deepBlue: "#527F96",

  aqua: "#73D9D0",
  teal: "#55B5A8",

  lavender: "#B8A9ED",
  purple: "#8E7CD3",

  cream: "#FFF4C7",

  textPrimary: "#30404A",
  textSecondary: "#70818A",

  white: "#FFFFFF",
};


export default function BubblePopIntroScreen({
  navigation,
  route,
}) {
  const bubbleScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const bubbleY =
    useRef(
      new Animated.Value(0)
    ).current;

  const smallBubbleY =
    useRef(
      new Animated.Value(0)
    ).current;


  /*
   * =======================================================
   * INTRO BACK BEHAVIOR
   * =======================================================
   */

  const handleBack =
    useCallback(() => {
      navigation.navigate(
        "MiniGames"
      );

      return true;
    }, [
      navigation,
    ]);


  useFocusEffect(
    useCallback(() => {
      const subscription =
        BackHandler.addEventListener(
          "hardwareBackPress",
          handleBack
        );

      return () => {
        subscription.remove();
      };
    }, [
      handleBack,
    ])
  );


  /*
   * =======================================================
   * BUBBLE ANIMATION
   * =======================================================
   */

  useEffect(() => {
    const mainAnimation =
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(
              bubbleY,
              {
                toValue: -9,
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
              bubbleY,
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
              bubbleScale,
              {
                toValue: 1.035,
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
              bubbleScale,
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


    const smallAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            smallBubbleY,
            {
              toValue: -12,
              duration: 2200,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            smallBubbleY,
            {
              toValue: 0,
              duration: 2200,
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


    mainAnimation.start();

    smallAnimation.start();


    return () => {
      mainAnimation.stop();

      smallAnimation.stop();
    };
  }, [
    bubbleScale,
    bubbleY,
    smallBubbleY,
  ]);


  const handleBegin =
    () => {
      navigation.navigate(
        "BubblePopGame",
        {
          ...(route?.params || {}),
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
            onPress={
              handleBack
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


          <Text
            style={
              styles.headerTitle
            }
          >
            Bubble Pop Calm
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* Hero */}

        <View
          style={
            styles.hero
          }
        >
          <View
            style={
              styles.heroGlowOne
            }
          />

          <View
            style={
              styles.heroGlowTwo
            }
          />


          <Animated.View
            style={[
              {
                transform: [
                  {
                    translateY:
                      bubbleY,
                  },
                  {
                    scale:
                      bubbleScale,
                  },
                ],
              },
            ]}
          >
            <Bubble
              size={190}
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.smallBubbleOne,
              {
                transform: [
                  {
                    translateY:
                      smallBubbleY,
                  },
                ],
              },
            ]}
          >
            <Bubble
              size={58}
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.smallBubbleTwo,
              {
                transform: [
                  {
                    translateY:
                      smallBubbleY.interpolate(
                        {
                          inputRange: [
                            -12,
                            0,
                          ],

                          outputRange: [
                            3,
                            -5,
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          >
            <Bubble
              size={40}
            />
          </Animated.View>
        </View>


        {/* Content */}

        <View
          style={
            styles.content
          }
        >
          <View
            style={
              styles.label
            }
          >
            <Ionicons
              name="water-outline"
              size={16}
              color={
                COLORS.deepBlue
              }
            />

            <Text
              style={
                styles.labelText
              }
            >
              GENTLE PLAY
            </Text>
          </View>


          <Text
            style={
              styles.title
            }
          >
            Pop whatever catches
            your eye
          </Text>


          <Text
            style={
              styles.description
            }
          >
            One bubble at a time.
            No score, no rush.
          </Text>


          <View
            style={
              styles.featureRow
            }
          >
            <View
              style={
                styles.feature
              }
            >
              <Ionicons
                name="finger-print-outline"
                size={21}
                color={
                  COLORS.blue
                }
              />

              <Text
                style={
                  styles.featureText
                }
              >
                Tap
              </Text>
            </View>


            <View
              style={
                styles.feature
              }
            >
              <Ionicons
                name="sparkles-outline"
                size={21}
                color={
                  COLORS.purple
                }
              />

              <Text
                style={
                  styles.featureText
                }
              >
                Pop
              </Text>
            </View>


            <View
              style={
                styles.feature
              }
            >
              <Ionicons
                name="leaf-outline"
                size={21}
                color={
                  COLORS.teal
                }
              />

              <Text
                style={
                  styles.featureText
                }
              >
                Unwind
              </Text>
            </View>
          </View>
        </View>


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
            onPress={
              handleBegin
            }
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.beginText
              }
            >
              Start Popping
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
 * CUSTOM BUBBLE
 * =========================================================
 *
 * This recreates the visual idea
 * from your uploaded reference:
 *
 * blue/teal body
 * lavender shine
 * white reflections
 * aqua patches
 * transparent glass-like edge
 */

function Bubble({
  size,
}) {
  return (
    <View
      style={[
        styles.bubble,

        {
          width: size,
          height: size,
          borderRadius:
            size / 2,
        },
      ]}
    >
      <View
        style={[
          styles.bubbleInner,

          {
            borderRadius:
              size / 2,
          },
        ]}
      />


      <View
        style={[
          styles.bubbleBluePatch,

          {
            width:
              size * 0.4,

            height:
              size * 0.5,

            borderRadius:
              size * 0.25,

            left:
              size * 0.15,

            top:
              size * 0.18,
          },
        ]}
      />


      <View
        style={[
          styles.bubbleTealPatch,

          {
            width:
              size * 0.52,

            height:
              size * 0.22,

            borderRadius:
              size * 0.12,

            left:
              size * 0.22,

            bottom:
              size * 0.12,
          },
        ]}
      />


      <View
        style={[
          styles.bubblePurplePatch,

          {
            width:
              size * 0.26,

            height:
              size * 0.15,

            borderRadius:
              size * 0.1,

            right:
              size * 0.08,

            bottom:
              size * 0.22,

            transform: [
              {
                rotate:
                  "-18deg",
              },
            ],
          },
        ]}
      />


      <View
        style={[
          styles.bubbleAquaPatch,

          {
            width:
              size * 0.08,

            height:
              size * 0.27,

            borderRadius:
              size * 0.05,

            left:
              size * 0.06,

            top:
              size * 0.34,
          },
        ]}
      />


      <View
        style={[
          styles.highlightLarge,

          {
            width:
              size * 0.11,

            height:
              size * 0.18,

            left:
              size * 0.18,

            top:
              size * 0.18,
          },
        ]}
      />


      <View
        style={[
          styles.highlightSmall,

          {
            width:
              size * 0.055,

            height:
              size * 0.08,

            left:
              size * 0.3,

            top:
              size * 0.15,
          },
        ]}
      />


      <View
        style={[
          styles.highlightDot,

          {
            width:
              size * 0.045,

            height:
              size * 0.045,

            borderRadius:
              size,

            left:
              size * 0.42,

            top:
              size * 0.52,
          },
        ]}
      />
    </View>
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
    },

    header: {
      height: 62,

      paddingHorizontal: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    backButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.84)",
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

    hero: {
      height: 355,

      marginHorizontal: 20,

      marginTop: 8,

      borderRadius: 38,

      overflow: "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#DDEEF5",
    },

    heroGlowOne: {
      position:
        "absolute",

      width: 270,

      height: 270,

      borderRadius: 135,

      left: -90,

      top: -100,

      backgroundColor:
        COLORS.lavender,

      opacity: 0.2,
    },

    heroGlowTwo: {
      position:
        "absolute",

      width: 240,

      height: 240,

      borderRadius: 120,

      right: -90,

      bottom: -95,

      backgroundColor:
        COLORS.aqua,

      opacity: 0.16,
    },

    smallBubbleOne: {
      position:
        "absolute",

      right: 45,

      top: 50,
    },

    smallBubbleTwo: {
      position:
        "absolute",

      right: 68,

      bottom: 52,
    },

    bubble: {
      overflow: "hidden",

      borderWidth: 3,

      borderColor:
        "rgba(255,255,255,0.83)",

      backgroundColor:
        "rgba(57,114,142,0.50)",

      shadowColor:
        "#456F83",

      shadowOffset: {
        width: 0,

        height: 6,
      },

      shadowOpacity: 0.12,

      shadowRadius: 10,

      elevation: 3,
    },

    bubbleInner: {
      ...StyleSheet.absoluteFillObject,

      borderWidth: 5,

      borderColor:
        "rgba(170,225,242,0.28)",
    },

    bubbleBluePatch: {
      position:
        "absolute",

      backgroundColor:
        "rgba(74,109,190,0.65)",

      transform: [
        {
          rotate:
            "15deg",
        },
      ],
    },

    bubbleTealPatch: {
      position:
        "absolute",

      backgroundColor:
        "rgba(59,184,157,0.76)",

      transform: [
        {
          rotate:
            "6deg",
        },
      ],
    },

    bubblePurplePatch: {
      position:
        "absolute",

      backgroundColor:
        "rgba(195,162,235,0.88)",
    },

    bubbleAquaPatch: {
      position:
        "absolute",

      backgroundColor:
        "rgba(80,229,225,0.9)",
    },

    highlightLarge: {
      position:
        "absolute",

      backgroundColor:
        "rgba(255,255,255,0.95)",

      borderRadius: 4,

      transform: [
        {
          rotate:
            "8deg",
        },
      ],
    },

    highlightSmall: {
      position:
        "absolute",

      backgroundColor:
        "rgba(255,255,255,0.94)",

      borderRadius: 3,
    },

    highlightDot: {
      position:
        "absolute",

      backgroundColor:
        "#FFFFFF",
    },

    content: {
      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 25,

      alignItems:
        "center",
    },

    label: {
      paddingHorizontal: 12,

      paddingVertical: 7,

      borderRadius: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.white,
    },

    labelText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1,

      color:
        COLORS.deepBlue,
    },

    title: {
      maxWidth: 330,

      marginTop: 16,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 29,

      lineHeight: 35,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      lineHeight: 20,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },

    featureRow: {
      marginTop: 25,

      width: "100%",

      flexDirection:
        "row",

      justifyContent:
        "space-evenly",
    },

    feature: {
      alignItems:
        "center",
    },

    featureText: {
      marginTop: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },

    bottomContainer: {
      paddingHorizontal: 24,

      paddingBottom: 17,
    },

    beginButton: {
      height: 58,

      borderRadius: 20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.blue,
    },

    beginText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },
  });