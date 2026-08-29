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


const COLORS = {
  background: "#FFF9F0",
  card: "#FFFFFF",

  yellow: "#FFE9A8",
  yellowStrong: "#F4CF69",

  peach: "#F7C8A0",
  coral: "#F29B82",

  softBlue: "#DFF1F7",
  blue: "#78AFC4",

  textPrimary: "#3C3934",
  textSecondary: "#7A746C",

  white: "#FFFFFF",
};


export default function HoldTheMomentIntroScreen({
  navigation,
  route,
}) {
  const sunScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const sparkleOne =
    useRef(
      new Animated.Value(0)
    ).current;

  const sparkleTwo =
    useRef(
      new Animated.Value(0)
    ).current;


  useEffect(() => {
    const sunAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            sunScale,
            {
              toValue: 1.06,
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
            sunScale,
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
        ])
      );

    const sparkleAnimationOne =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            sparkleOne,
            {
              toValue: 1,
              duration: 1500,
              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            sparkleOne,
            {
              toValue: 0,
              duration: 1500,
              useNativeDriver:
                true,
            }
          ),
        ])
      );

    const sparkleAnimationTwo =
      Animated.loop(
        Animated.sequence([
          Animated.delay(
            700
          ),

          Animated.timing(
            sparkleTwo,
            {
              toValue: 1,
              duration: 1500,
              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            sparkleTwo,
            {
              toValue: 0,
              duration: 1500,
              useNativeDriver:
                true,
            }
          ),
        ])
      );

    sunAnimation.start();
    sparkleAnimationOne.start();
    sparkleAnimationTwo.start();

    return () => {
      sunAnimation.stop();
      sparkleAnimationOne.stop();
      sparkleAnimationTwo.stop();
    };
  }, [
    sunScale,
    sparkleOne,
    sparkleTwo,
  ]);


  const handleBegin =
    () => {
      navigation.navigate(
        "HoldTheMomentChoose",
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

          <Text
            style={
              styles.headerTitle
            }
          >
            Hold the Moment
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
              styles.peachBlob
            }
          />

          <View
            style={
              styles.blueBlob
            }
          />

          <Animated.View
            style={[
              styles.sunCircle,
              {
                transform: [
                  {
                    scale:
                      sunScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="sunny-outline"
              size={55}
              color="#B57B24"
            />
          </Animated.View>


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
                COLORS.coral
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
              size={17}
              color={
                COLORS.blue
              }
            />
          </Animated.View>


          <View
            style={
              styles.heroMessage
            }
          >
            <Text
              style={
                styles.heroMessageText
              }
            >
              Good moments can be easy
              to miss.
            </Text>
          </View>
        </View>


        {/* Main */}

        <View
          style={
            styles.content
          }
        >
          <View
            style={
              styles.labelChip
            }
          >
            <Ionicons
              name="heart-outline"
              size={16}
              color="#A56E20"
            />

            <Text
              style={
                styles.labelText
              }
            >
              Savoring
            </Text>
          </View>


          <Text
            style={
              styles.title
            }
          >
            Stay with something good
            a little longer
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Pick one positive moment.
            Notice it. Enjoy it. Keep a
            little piece of it with you.
          </Text>


          <View
            style={
              styles.stepsRow
            }
          >
            <View
              style={
                styles.stepItem
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
                  name="eye-outline"
                  size={22}
                  color="#A56E20"
                />
              </View>

              <Text
                style={
                  styles.stepText
                }
              >
                Notice
              </Text>
            </View>


            <View
              style={
                styles.stepLine
              }
            />


            <View
              style={
                styles.stepItem
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
                  name="heart-outline"
                  size={22}
                  color="#A85E48"
                />
              </View>

              <Text
                style={
                  styles.stepText
                }
              >
                Feel
              </Text>
            </View>


            <View
              style={
                styles.stepLine
              }
            />


            <View
              style={
                styles.stepItem
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
                  name="bookmark-outline"
                  size={22}
                  color={
                    COLORS.blue
                  }
                />
              </View>

              <Text
                style={
                  styles.stepText
                }
              >
                Keep
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
              Choose a Moment
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

    hero: {
      height: 305,
      marginHorizontal: 20,
      marginTop: 8,
      borderRadius: 36,
      overflow: "hidden",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#FFF2CE",
    },

    peachBlob: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      right: -65,
      top: -45,
      backgroundColor:
        COLORS.peach,
      opacity: 0.76,
    },

    blueBlob: {
      position: "absolute",
      width: 230,
      height: 230,
      borderRadius: 115,
      left: -90,
      bottom: -100,
      backgroundColor:
        COLORS.softBlue,
      opacity: 0.88,
    },

    sunCircle: {
      width: 132,
      height: 132,
      borderRadius: 66,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.white,
      elevation: 5,
      shadowColor:
        "#D09A3F",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.13,
      shadowRadius: 14,
    },

    sparkleOne: {
      position: "absolute",
      top: 72,
      right: 62,
    },

    sparkleTwo: {
      position: "absolute",
      bottom: 80,
      left: 56,
    },

    heroMessage: {
      position: "absolute",
      bottom: 21,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 17,
      backgroundColor:
        "rgba(255,255,255,0.78)",
    },

    heroMessageText: {
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

    labelChip: {
      paddingHorizontal: 13,
      paddingVertical: 7,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        COLORS.yellow,
    },

    labelText: {
      marginLeft: 6,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 11.5,
      color: "#9A6824",
    },

    title: {
      maxWidth: 340,
      marginTop: 16,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 28,
      lineHeight: 34,
      textAlign: "center",
      color:
        COLORS.textPrimary,
    },

    description: {
      maxWidth: 320,
      marginTop: 8,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
      color:
        COLORS.textSecondary,
    },

    stepsRow: {
      width: "100%",
      marginTop: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
    },

    stepItem: {
      alignItems: "center",
      width: 70,
    },

    stepIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },

    stepText: {
      marginTop: 7,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 11.5,
      color:
        COLORS.textSecondary,
    },

    stepLine: {
      width: 34,
      height: 1,
      marginHorizontal: 2,
      marginBottom: 20,
      backgroundColor:
        "#E6D8C5",
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
      justifyContent: "center",
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

    beginText: {
      marginRight: 8,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 16,
      color:
        COLORS.white,
    },
  });