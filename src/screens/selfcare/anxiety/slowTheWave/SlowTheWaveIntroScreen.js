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
  background: "#F7FAF8",
  card: "#FFFFFF",

  primary: "#6C9EB2",
  primaryDark: "#557E91",

  green: "#83A995",
  greenDark: "#5E806C",

  softBlue: "#DDEFF5",
  softBlueStrong: "#CDE5EE",

  softGreen: "#DDEEE4",
  softGreenStrong: "#CDE4D5",

  cream: "#FAF2E6",
  creamDark: "#B18E69",

  textPrimary: "#2F3938",
  textSecondary: "#74807D",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function SlowTheWaveIntroScreen({
  navigation,
  route,
}) {
  /*
   * Decorative wave animation.
   */

  const waveOne =
    useRef(
      new Animated.Value(0)
    ).current;

  const waveTwo =
    useRef(
      new Animated.Value(0)
    ).current;

  const breatheScale =
    useRef(
      new Animated.Value(1)
    ).current;


  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(
              waveOne,
              {
                toValue: 1,

                duration: 3200,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              waveOne,
              {
                toValue: 0,

                duration: 3200,

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
              waveTwo,
              {
                toValue: 1,

                duration: 4100,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              waveTwo,
              {
                toValue: 0,

                duration: 4100,

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
              breatheScale,
              {
                toValue: 1.08,

                duration: 2500,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              breatheScale,
              {
                toValue: 1,

                duration: 2500,

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

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    waveOne,
    waveTwo,
    breatheScale,
  ]);


  const handleBegin =
    () => {
      navigation.navigate(
        "SlowTheWaveBreathing",
        {
          ...(route?.params || {}),
        }
      );
    };


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
              Slow the Wave
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              5 min
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* =================================================
            HERO WAVE
           ================================================= */}

        <View
          style={styles.hero}
        >
          <View
            style={styles.heroGlow}
          />

          <Animated.View
            style={[
              styles.waveLarge,

              {
                transform: [
                  {
                    translateY:
                      waveOne.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            9,
                            -9,
                          ],
                        }
                      ),
                  },

                  {
                    rotate:
                      waveOne.interpolate(
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
          />

          <Animated.View
            style={[
              styles.waveSmall,

              {
                transform: [
                  {
                    translateY:
                      waveTwo.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            -7,
                            8,
                          ],
                        }
                      ),
                  },

                  {
                    rotate:
                      waveTwo.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            "3deg",
                            "-3deg",
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.centerBubble,

              {
                transform: [
                  {
                    scale:
                      breatheScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="water-outline"
              size={37}
              color={
                COLORS.primaryDark
              }
            />
          </Animated.View>
        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <View
          style={styles.content}
        >
          <View
            style={styles.labelChip}
          >
            <Ionicons
              name="leaf-outline"
              size={16}
              color={
                COLORS.greenDark
              }
            />

            <Text
              style={
                styles.labelText
              }
            >
              Gentle breathing
            </Text>
          </View>


          <Text style={styles.title}>
            Let your breathing slow
          </Text>

          <Text
            style={styles.description}
          >
            Follow a comfortable rhythm.
            No breath holding.
          </Text>


          {/* Rhythm */}

          <View
            style={
              styles.rhythmCard
            }
          >
            <View
              style={
                styles.rhythmItem
              }
            >
              <View
                style={
                  styles.blueIcon
                }
              >
                <Ionicons
                  name="arrow-down-outline"
                  size={21}
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>

              <Text
                style={
                  styles.rhythmNumber
                }
              >
                4
              </Text>

              <Text
                style={
                  styles.rhythmLabel
                }
              >
                Inhale
              </Text>
            </View>


            <View
              style={
                styles.rhythmConnector
              }
            >
              <View
                style={
                  styles.connectorLine
                }
              />

              <Ionicons
                name="water-outline"
                size={20}
                color={
                  COLORS.green
                }
              />

              <View
                style={
                  styles.connectorLine
                }
              />
            </View>


            <View
              style={
                styles.rhythmItem
              }
            >
              <View
                style={
                  styles.greenIcon
                }
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={21}
                  color={
                    COLORS.greenDark
                  }
                />
              </View>

              <Text
                style={
                  styles.rhythmNumber
                }
              >
                6
              </Text>

              <Text
                style={
                  styles.rhythmLabel
                }
              >
                Exhale
              </Text>
            </View>
          </View>


          {/* Reminder */}

          <View
            style={
              styles.reminderCard
            }
          >
            <Ionicons
              name="heart-outline"
              size={18}
              color={
                COLORS.creamDark
              }
            />

            <Text
              style={
                styles.reminderText
              }
            >
              Breathe normally if the
              rhythm feels uncomfortable.
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
              styles.beginButton
            }
            onPress={
              handleBegin
            }
            activeOpacity={0.85}
          >
            <Ionicons
              name="play"
              size={18}
              color={
                COLORS.white
              }
            />

            <Text
              style={
                styles.beginText
              }
            >
              Begin
            </Text>
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
      height: 64,

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

    headerCenter: {
      alignItems: "center",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 17,

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
     * Hero
     */

    hero: {
      height: 300,

      marginHorizontal: 20,

      marginTop: 10,

      borderRadius: 38,

      alignItems: "center",

      justifyContent:
        "center",

      overflow: "hidden",

      backgroundColor:
        COLORS.softBlue,
    },

    heroGlow: {
      position: "absolute",

      width: 250,
      height: 250,

      borderRadius: 125,

      top: -80,
      right: -55,

      backgroundColor:
        COLORS.cream,

      opacity: 0.9,
    },

    waveLarge: {
      position: "absolute",

      width: 390,
      height: 150,

      borderRadius: 80,

      bottom: 18,
      left: -50,

      backgroundColor:
        COLORS.softGreenStrong,

      opacity: 0.9,
    },

    waveSmall: {
      position: "absolute",

      width: 350,
      height: 125,

      borderRadius: 70,

      bottom: -22,
      right: -55,

      backgroundColor:
        COLORS.softBlueStrong,

      opacity: 0.95,
    },

    centerBubble: {
      width: 102,
      height: 102,

      borderRadius: 51,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation: 5,

      shadowColor: "#557E91",

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.12,

      shadowRadius: 12,
    },


    /*
     * Content
     */

    content: {
      flex: 1,

      paddingHorizontal: 25,

      paddingTop: 23,

      alignItems: "center",
    },

    labelChip: {
      paddingHorizontal: 13,

      paddingVertical: 7,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softGreen,
    },

    labelText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11.5,

      color:
        COLORS.greenDark,
    },

    title: {
      marginTop: 17,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 29,

      lineHeight: 35,

      color:
        COLORS.textPrimary,

      textAlign: "center",
    },

    description: {
      marginTop: 8,

      maxWidth: 300,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      lineHeight: 20,

      color:
        COLORS.textSecondary,

      textAlign: "center",
    },


    /*
     * Rhythm Card
     */

    rhythmCard: {
      width: "100%",

      marginTop: 24,

      paddingHorizontal: 18,

      paddingVertical: 17,

      borderRadius: 24,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      backgroundColor:
        COLORS.white,

      elevation: 2,
    },

    rhythmItem: {
      width: 80,

      alignItems: "center",
    },

    blueIcon: {
      width: 40,
      height: 40,

      borderRadius: 20,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },

    greenIcon: {
      width: 40,
      height: 40,

      borderRadius: 20,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softGreen,
    },

    rhythmNumber: {
      marginTop: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 22,

      color:
        COLORS.textPrimary,
    },

    rhythmLabel: {
      marginTop: 1,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      color:
        COLORS.textSecondary,
    },

    rhythmConnector: {
      flex: 1,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",
    },

    connectorLine: {
      flex: 1,

      maxWidth: 30,

      height: 1,

      marginHorizontal: 5,

      backgroundColor:
        "#D5E1DD",
    },


    /*
     * Reminder
     */

    reminderCard: {
      width: "100%",

      marginTop: 16,

      paddingHorizontal: 14,

      paddingVertical: 11,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.cream,
    },

    reminderText: {
      flex: 1,

      marginLeft: 8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

      lineHeight: 17,

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

    beginButton: {
      height: 58,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,
    },

    beginText: {
      marginLeft: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },
  });