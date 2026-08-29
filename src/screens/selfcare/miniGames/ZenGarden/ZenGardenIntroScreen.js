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


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background: "#F7F3EA",

  card: "#FFFFFF",

  sand: "#EAD8B9",
  sandLight: "#F7EEDC",
  sandDark: "#CFB68E",

  sage: "#A8C0A5",
  sageDark: "#6F8B70",

  stone: "#A9AAA5",
  stoneDark: "#73766F",

  flower: "#E9B9B1",

  sky: "#DCEBF0",
  blue: "#6F9BAA",

  textPrimary: "#3D413D",
  textSecondary: "#747970",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function ZenGardenIntroScreen({
  navigation,
  route,
}) {
  const stoneY =
    useRef(
      new Animated.Value(0)
    ).current;

  const leafRotate =
    useRef(
      new Animated.Value(0)
    ).current;

  const lineOffset =
    useRef(
      new Animated.Value(0)
    ).current;


  /*
   * =======================================================
   * BACK
   * =======================================================
   *
   * Intro → MiniGames
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
   * HERO ANIMATION
   * =======================================================
   */

  useEffect(() => {
    const stoneAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            stoneY,
            {
              toValue: -5,

              duration: 2000,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            stoneY,
            {
              toValue: 0,

              duration: 2000,

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


    const leafAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            leafRotate,
            {
              toValue: 1,

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
            leafRotate,
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


    const rakeAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            lineOffset,
            {
              toValue: 10,

              duration: 2400,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            lineOffset,
            {
              toValue: 0,

              duration: 2400,

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


    stoneAnimation.start();
    leafAnimation.start();
    rakeAnimation.start();


    return () => {
      stoneAnimation.stop();
      leafAnimation.stop();
      rakeAnimation.stop();
    };
  }, [
    stoneY,
    leafRotate,
    lineOffset,
  ]);


  /*
   * =======================================================
   * START
   * =======================================================
   */

  const handleStart =
    () => {
      navigation.navigate(
        "ZenGardenGame",
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
        {/* Decorative background */}

        <View
          style={
            styles.topGlow
          }
        />

        <View
          style={
            styles.bottomGlow
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
              styles.headerButton
            }
            onPress={
              handleBack
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back to mini games"
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
            Zen Garden
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
          {/* Sand lines */}

          <Animated.View
            style={[
              styles.rakeLines,

              {
                transform: [
                  {
                    translateX:
                      lineOffset,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.rakeLine
              }
            />

            <View
              style={
                styles.rakeLine
              }
            />

            <View
              style={
                styles.rakeLine
              }
            />

            <View
              style={
                styles.rakeLine
              }
            />

            <View
              style={
                styles.rakeLine
              }
            />
          </Animated.View>


          {/* Stone */}

          <Animated.View
            style={[
              styles.heroStone,

              {
                transform: [
                  {
                    translateY:
                      stoneY,
                  },

                  {
                    rotate:
                      "-8deg",
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.stoneHighlight
              }
            />
          </Animated.View>


          {/* Leaf */}

          <Animated.View
            style={[
              styles.heroLeaf,

              {
                transform: [
                  {
                    rotate:
                      leafRotate.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            "-8deg",
                            "8deg",
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.leafLine
              }
            />
          </Animated.View>


          {/* Flower */}

          <View
            style={
              styles.heroFlower
            }
          >
            <View
              style={[
                styles.heroPetal,
                styles.heroPetalTop,
              ]}
            />

            <View
              style={[
                styles.heroPetal,
                styles.heroPetalRight,
              ]}
            />

            <View
              style={[
                styles.heroPetal,
                styles.heroPetalBottom,
              ]}
            />

            <View
              style={[
                styles.heroPetal,
                styles.heroPetalLeft,
              ]}
            />

            <View
              style={
                styles.heroFlowerCenter
              }
            />
          </View>


          <View
            style={
              styles.heroCaption
            }
          >
            <Text
              style={
                styles.heroCaptionText
              }
            >
              Make space. Move slowly.
            </Text>
          </View>
        </View>


        {/* =================================================
            CONTENT
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
              name="leaf-outline"
              size={16}
              color={
                COLORS.sageDark
              }
            />

            <Text
              style={
                styles.badgeText
              }
            >
              FREE PLAY
            </Text>
          </View>


          <Text
            style={
              styles.title
            }
          >
            Make a quiet space
            of your own
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Draw through the sand,
            place a few objects, or
            simply start again.
          </Text>


          <View
            style={
              styles.featureRow
            }
          >
            <View
              style={
                styles.featureItem
              }
            >
              <View
                style={[
                  styles.featureIcon,

                  {
                    backgroundColor:
                      COLORS.sandLight,
                  },
                ]}
              >
                <Ionicons
                  name="brush-outline"
                  size={20}
                  color={
                    COLORS.sandDark
                  }
                />
              </View>

              <Text
                style={
                  styles.featureText
                }
              >
                Rake
              </Text>
            </View>


            <View
              style={
                styles.featureItem
              }
            >
              <View
                style={[
                  styles.featureIcon,

                  {
                    backgroundColor:
                      "#ECEDE9",
                  },
                ]}
              >
                <Ionicons
                  name="ellipse-outline"
                  size={20}
                  color={
                    COLORS.stoneDark
                  }
                />
              </View>

              <Text
                style={
                  styles.featureText
                }
              >
                Place
              </Text>
            </View>


            <View
              style={
                styles.featureItem
              }
            >
              <View
                style={[
                  styles.featureIcon,

                  {
                    backgroundColor:
                      "#E7EFE4",
                  },
                ]}
              >
                <Ionicons
                  name="leaf-outline"
                  size={20}
                  color={
                    COLORS.sageDark
                  }
                />
              </View>

              <Text
                style={
                  styles.featureText
                }
              >
                Arrange
              </Text>
            </View>
          </View>


          <View
            style={
              styles.note
            }
          >
            <Ionicons
              name="infinite-outline"
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
              No score. No timer. No
              right result.
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
                styles.startText
              }
            >
              Enter the Garden
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

      overflow:
        "hidden",
    },

    topGlow: {
      position:
        "absolute",

      width: 280,

      height: 280,

      borderRadius: 140,

      top: -170,

      right: -110,

      backgroundColor:
        COLORS.sky,

      opacity: 0.55,
    },

    bottomGlow: {
      position:
        "absolute",

      width: 250,

      height: 250,

      borderRadius: 125,

      bottom: -135,

      left: -110,

      backgroundColor:
        "#DEE9DB",

      opacity: 0.6,
    },


    /*
     * Header
     */

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

    headerButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems:
        "center",

      justifyContent:
        "center",

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
      height: 330,

      marginHorizontal: 20,

      marginTop: 9,

      borderRadius: 38,

      overflow: "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.sand,
    },

    rakeLines: {
      position:
        "absolute",

      left: 20,

      right: 20,

      top: 90,

      transform: [
        {
          rotate:
            "-6deg",
        },
      ],
    },

    rakeLine: {
      width: "88%",

      height: 3,

      marginVertical: 8,

      borderRadius: 2,

      backgroundColor:
        "rgba(164,136,96,0.32)",
    },

    heroStone: {
      position:
        "absolute",

      width: 82,

      height: 58,

      borderRadius: 30,

      left: 53,

      bottom: 63,

      backgroundColor:
        COLORS.stone,

      shadowColor:
        "#77766F",

      shadowOffset: {
        width: 0,

        height: 5,
      },

      shadowOpacity: 0.15,

      shadowRadius: 6,

      elevation: 3,
    },

    stoneHighlight: {
      position:
        "absolute",

      width: 32,

      height: 15,

      borderRadius: 10,

      left: 13,

      top: 10,

      backgroundColor:
        "rgba(255,255,255,0.28)",
    },

    heroLeaf: {
      position:
        "absolute",

      width: 58,

      height: 31,

      borderTopLeftRadius: 32,

      borderBottomRightRadius:
        32,

      right: 53,

      top: 62,

      backgroundColor:
        COLORS.sage,

      alignItems: "center",

      justifyContent:
        "center",
    },

    leafLine: {
      width: 40,

      height: 1.5,

      backgroundColor:
        COLORS.sageDark,

      transform: [
        {
          rotate:
            "-18deg",
        },
      ],
    },

    heroFlower: {
      position:
        "absolute",

      width: 72,

      height: 72,

      right: 70,

      bottom: 54,

      alignItems: "center",

      justifyContent:
        "center",
    },

    heroPetal: {
      position:
        "absolute",

      width: 29,

      height: 29,

      borderRadius: 15,

      backgroundColor:
        "#F5D7D0",
    },

    heroPetalTop: {
      top: 3,
    },

    heroPetalBottom: {
      bottom: 3,
    },

    heroPetalLeft: {
      left: 3,
    },

    heroPetalRight: {
      right: 3,
    },

    heroFlowerCenter: {
      width: 24,

      height: 24,

      borderRadius: 12,

      backgroundColor:
        "#E9B57B",

      zIndex: 5,
    },

    heroCaption: {
      position:
        "absolute",

      bottom: 17,

      paddingHorizontal: 15,

      paddingVertical: 8,

      borderRadius: 18,

      backgroundColor:
        "rgba(255,255,255,0.7)",
    },

    heroCaptionText: {
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

      paddingTop: 24,

      alignItems:
        "center",
    },

    badge: {
      paddingHorizontal: 12,

      paddingVertical: 7,

      borderRadius: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#E6EFE3",
    },

    badgeText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1,

      color:
        COLORS.sageDark,
    },

    title: {
      maxWidth: 330,

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

    featureRow: {
      width: "100%",

      marginTop: 23,

      flexDirection: "row",

      justifyContent:
        "space-evenly",
    },

    featureItem: {
      alignItems: "center",
    },

    featureIcon: {
      width: 48,

      height: 48,

      borderRadius: 18,

      alignItems: "center",

      justifyContent:
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

    note: {
      marginTop: 20,

      paddingHorizontal: 14,

      paddingVertical: 9,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.white,
    },

    noteText: {
      marginLeft: 7,

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
        COLORS.sageDark,
    },

    startText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },
  });