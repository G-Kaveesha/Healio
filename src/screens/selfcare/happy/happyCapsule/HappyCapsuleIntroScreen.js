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
  background: "#FFF9F1",

  card: "#FFFFFF",

  yellow: "#FFE7A3",
  yellowDark: "#B9832B",

  peach: "#F7C6A3",

  coral: "#F09278",
  coralDark: "#C96B56",

  softBlue: "#E3F2F7",
  blue: "#73AAC1",

  softPink: "#FCE7E4",

  textPrimary: "#3D3934",
  textSecondary: "#7A746C",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function HappyCapsuleIntroScreen({
  navigation,
  route,
}) {
  /*
   * =======================================================
   * ANIMATION VALUES
   * =======================================================
   */

  const capsuleY =
    useRef(
      new Animated.Value(0)
    ).current;

  const capsuleRotate =
    useRef(
      new Animated.Value(0)
    ).current;

  const sparkleOne =
    useRef(
      new Animated.Value(0.35)
    ).current;

  const sparkleTwo =
    useRef(
      new Animated.Value(0.25)
    ).current;


  /*
   * =======================================================
   * INTRO ANIMATION
   * =======================================================
   */

  useEffect(() => {
    const capsuleAnimation =
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(
              capsuleY,
              {
                toValue: -7,

                duration: 1900,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              capsuleY,
              {
                toValue: 0,

                duration: 1900,

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
              capsuleRotate,
              {
                toValue: 1,

                duration: 2300,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              capsuleRotate,
              {
                toValue: 0,

                duration: 2300,

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


    const sparkleAnimationOne =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            sparkleOne,
            {
              toValue: 1,

              duration: 1200,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            sparkleOne,
            {
              toValue: 0.25,

              duration: 1200,

              useNativeDriver:
                true,
            }
          ),
        ])
      );


    const sparkleAnimationTwo =
      Animated.loop(
        Animated.sequence([
          Animated.delay(500),

          Animated.timing(
            sparkleTwo,
            {
              toValue: 1,

              duration: 1400,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            sparkleTwo,
            {
              toValue: 0.25,

              duration: 1400,

              useNativeDriver:
                true,
            }
          ),
        ])
      );


    capsuleAnimation.start();

    sparkleAnimationOne.start();

    sparkleAnimationTwo.start();


    return () => {
      capsuleAnimation.stop();

      sparkleAnimationOne.stop();

      sparkleAnimationTwo.stop();
    };
  }, [
    capsuleY,
    capsuleRotate,
    sparkleOne,
    sparkleTwo,
  ]);


  /*
   * =======================================================
   * IMPORTANT BACK FUNCTION
   * =======================================================
   *
   * Intro always returns to the
   * Happy Activities list.
   */

  const handleBack =
    useCallback(() => {
      navigation.navigate(
        "HappyActivities"
      );

      return true;
    }, [
      navigation,
    ]);


  /*
   * Android hardware back.
   */

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
   * BEGIN
   * =======================================================
   */

  const handleBegin =
    () => {
      navigation.navigate(
        "HappyCapsuleCreate",
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
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View
        style={styles.container}
      >
        {/* =================================================
            HEADER
           ================================================= */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              handleBack
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back to happy activities"
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
            My Happy Capsule
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
          style={styles.hero}
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


          <Animated.View
            style={[
              styles.sparkleOne,

              {
                opacity:
                  sparkleOne,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={22}
              color={
                COLORS.yellowDark
              }
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.sparkleTwo,

              {
                opacity:
                  sparkleTwo,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={18}
              color={
                COLORS.blue
              }
            />
          </Animated.View>


          {/* Capsule */}

          <Animated.View
            style={[
              styles.capsuleContainer,

              {
                transform: [
                  {
                    translateY:
                      capsuleY,
                  },

                  {
                    rotate:
                      capsuleRotate.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            "-3deg",
                            "3deg",
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
                styles.capsuleTop
              }
            />

            <View
              style={
                styles.capsuleBody
              }
            >
              <Ionicons
                name="heart"
                size={31}
                color={
                  COLORS.coral
                }
              />

              <Ionicons
                name="star"
                size={18}
                color={
                  COLORS.yellowDark
                }
                style={
                  styles.smallStar
                }
              />
            </View>
          </Animated.View>


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
              Save something worth
              remembering.
            </Text>
          </View>
        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <View
          style={styles.content}
        >
          <View
            style={
              styles.label
            }
          >
            <Ionicons
              name="bookmark-outline"
              size={15}
              color={
                COLORS.coralDark
              }
            />

            <Text
              style={
                styles.labelText
              }
            >
              HAPPY MEMORY
            </Text>
          </View>


          <Text
            style={styles.title}
          >
            Keep a little piece of today
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Save one happy moment,
            achievement, person or
            thought for another day.
          </Text>


          <View
            style={
              styles.steps
            }
          >
            <View
              style={
                styles.step
              }
            >
              <View
                style={[
                  styles.stepIcon,

                  {
                    backgroundColor:
                      COLORS.yellow,
                  },
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={
                    COLORS.yellowDark
                  }
                />
              </View>

              <Text
                style={
                  styles.stepLabel
                }
              >
                Choose
              </Text>
            </View>


            <View
              style={
                styles.stepLine
              }
            />


            <View
              style={
                styles.step
              }
            >
              <View
                style={[
                  styles.stepIcon,

                  {
                    backgroundColor:
                      COLORS.peach,
                  },
                ]}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={
                    COLORS.coralDark
                  }
                />
              </View>

              <Text
                style={
                  styles.stepLabel
                }
              >
                Write
              </Text>
            </View>


            <View
              style={
                styles.stepLine
              }
            />


            <View
              style={
                styles.step
              }
            >
              <View
                style={[
                  styles.stepIcon,

                  {
                    backgroundColor:
                      COLORS.softBlue,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    COLORS.blue
                  }
                />
              </View>

              <Text
                style={
                  styles.stepLabel
                }
              >
                Seal
              </Text>
            </View>
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
              Create My Capsule
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
      height: 310,

      marginHorizontal: 20,

      marginTop: 8,

      borderRadius: 40,

      overflow: "hidden",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#FFF0CD",
    },

    yellowBlob: {
      position: "absolute",

      width: 220,

      height: 220,

      borderRadius: 110,

      top: -85,

      left: -65,

      backgroundColor:
        COLORS.yellow,
    },

    blueBlob: {
      position: "absolute",

      width: 230,

      height: 230,

      borderRadius: 115,

      right: -95,

      bottom: -95,

      backgroundColor:
        COLORS.softBlue,
    },

    peachBlob: {
      position: "absolute",

      width: 115,

      height: 115,

      borderRadius: 58,

      right: 35,

      top: 32,

      backgroundColor:
        COLORS.peach,

      opacity: 0.85,
    },

    capsuleContainer: {
      width: 135,

      height: 165,

      alignItems: "center",
    },

    capsuleTop: {
      width: 90,

      height: 36,

      borderTopLeftRadius: 19,

      borderTopRightRadius: 19,

      borderBottomLeftRadius: 10,

      borderBottomRightRadius: 10,

      backgroundColor:
        COLORS.coral,
    },

    capsuleBody: {
      width: 126,

      height: 125,

      marginTop: -2,

      borderBottomLeftRadius: 45,

      borderBottomRightRadius: 45,

      borderTopLeftRadius: 23,

      borderTopRightRadius: 23,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.92)",

      borderWidth: 2,

      borderColor:
        "rgba(255,255,255,0.95)",

      elevation: 5,
    },

    smallStar: {
      position: "absolute",

      top: 27,

      right: 27,
    },

    sparkleOne: {
      position: "absolute",

      left: 59,

      top: 73,
    },

    sparkleTwo: {
      position: "absolute",

      right: 65,

      bottom: 75,
    },

    heroCaption: {
      position: "absolute",

      bottom: 18,

      paddingHorizontal: 15,

      paddingVertical: 8,

      borderRadius: 18,

      backgroundColor:
        "rgba(255,255,255,0.8)",
    },

    heroCaptionText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },

    content: {
      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 24,

      alignItems: "center",
    },

    label: {
      paddingHorizontal: 12,

      paddingVertical: 7,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softPink,
    },

    labelText: {
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

      maxWidth: 335,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 28,

      lineHeight: 34,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 8,

      maxWidth: 310,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      lineHeight: 20,

      textAlign: "center",

      color:
        COLORS.textSecondary,
    },

    steps: {
      width: "100%",

      marginTop: 25,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",
    },

    step: {
      width: 68,

      alignItems: "center",
    },

    stepIcon: {
      width: 48,

      height: 48,

      borderRadius: 18,

      alignItems: "center",

      justifyContent:
        "center",
    },

    stepLabel: {
      marginTop: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },

    stepLine: {
      width: 34,

      height: 1,

      marginHorizontal: 3,

      marginBottom: 18,

      backgroundColor:
        "#E5D8C9",
    },

    bottomContainer: {
      paddingHorizontal: 24,

      paddingBottom: 17,
    },

    beginButton: {
      height: 58,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
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