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

import {
  finishChatbotStartedActivity,
} from "../../../../services/chatbotActivityNavigation";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F8F5F0",

  card:
    "#FFFFFF",

  peach:
    "#F8D7BF",

  peachDark:
    "#DD8D5B",

  sky:
    "#DDEEF5",

  skyDark:
    "#638FA2",

  mint:
    "#E1EEE3",

  mintDark:
    "#6D9175",

  lilac:
    "#EAE4F7",

  lilacDark:
    "#8D7ABC",

  rose:
    "#F4DDE4",

  yellow:
    "#F8EDBD",

  textPrimary:
    "#343D40",

  textSecondary:
    "#748085",

  border:
    "#E8E1D8",

  white:
    "#FFFFFF",
};


/*
 * =========================================================
 * ACTIVITY
 * =========================================================
 */

const ACTIVITY_ID =
  "color-unwind";


/*
 * =========================================================
 * FORMAT DRAWING TIME
 * =========================================================
 */

const formatDrawingTime =
  (
    seconds
  ) => {

    const safeSeconds =
      Number.isFinite(
        Number(
          seconds
        )
      )
        ? Math.max(
            0,
            Number(
              seconds
            )
          )
        : 0;


    if (
      safeSeconds <
      60
    ) {

      return `${Math.round(
        safeSeconds
      )} sec`;
    }


    const minutes =
      Math.floor(
        safeSeconds /
        60
      );


    const remainingSeconds =
      Math.round(
        safeSeconds %
        60
      );


    if (
      remainingSeconds ===
      0
    ) {

      return `${minutes} min`;
    }


    return `${minutes}m ${remainingSeconds}s`;
  };


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function ColorUnwindCompleteScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * ROUTE DATA
   * =======================================================
   */

  const strokeCount =
    Number(
      route?.params
        ?.strokeCount
    ) ||
    0;


  const colorsUsed =
    Number(
      route?.params
        ?.colorsUsed
    ) ||
    0;


  const drawingTimeSeconds =
    Number(
      route?.params
        ?.drawingTimeSeconds
    ) ||
    0;


  const drawingTimeText =
    formatDrawingTime(
      drawingTimeSeconds
    );


  /*
   * =======================================================
   * ANIMATION
   * =======================================================
   */

  const badgeScale =
    useRef(
      new Animated.Value(
        0.82
      )
    ).current;


  const floatY =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  const sparkleOpacity =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  /*
   * =======================================================
   * EXIT ACTIVITY
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

        navigation.reset({
          index:
            1,

          routes: [
            {
              name:
                "HomeMain",
            },

            {
              name:
                "SelfCare",
            },
          ],
        });


        return true;
      },
      [
        navigation,
      ]
    );


  /*
   * =======================================================
   * ANDROID BACK
   * =======================================================
   */

  useFocusEffect(
    useCallback(
      () => {

        const subscription =
          BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackToSelfCare
          );


        return () => {

          subscription.remove();
        };
      },
      [
        handleBackToSelfCare,
      ]
    )
  );


  /*
   * =======================================================
   * ENTRY ANIMATION
   * =======================================================
   */

  useEffect(
    () => {

      Animated.parallel([
        Animated.spring(
          badgeScale,
          {
            toValue:
              1,

            friction:
              6,

            tension:
              48,

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          sparkleOpacity,
          {
            toValue:
              1,

            duration:
              600,

            useNativeDriver:
              true,
          }
        ),
      ]).start();


      const floatLoop =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              floatY,
              {
                toValue:
                  -7,

                duration:
                  1800,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              floatY,
              {
                toValue:
                  0,

                duration:
                  1800,

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


      floatLoop.start();


      return () => {

        floatLoop.stop();
      };

    },
    [
      badgeScale,
      floatY,
      sparkleOpacity,
    ]
  );


  /*
   * =======================================================
   * FINISH
   * =======================================================
   *
   * Existing Chatbot return behavior remains unchanged.
   * =======================================================
   */

  const handleFinish =
    () => {

      finishChatbotStartedActivity({
        navigation,

        activityId:
          ACTIVITY_ID,

        fallbackRoute:
          "MiniGames",
      });
    };


  /*
   * =======================================================
   * DRAW AGAIN
   * =======================================================
   *
   * Keep the route params so a Chatbot-started activity
   * still knows that it originated from the Chatbot.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "ColorUnwindCanvas",
        {
          ...(
            route?.params ||
            {}
          ),

          activityId:
            ACTIVITY_ID,

          category:
            "miniGames",

          /*
           * Old result values are intentionally replaced
           * when Canvas finishes again.
           */
          strokeCount:
            undefined,

          colorsUsed:
            undefined,

          drawingTimeSeconds:
            undefined,
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

        {/* Decorative background */}

        <View
          pointerEvents="none"
          style={
            styles.topGlow
          }
        />


        <View
          pointerEvents="none"
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
              handleBackToSelfCare
            }
            activeOpacity={
              0.72
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
          >
            <Ionicons
              name="chevron-back"
              size={
                26
              }
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
            Color & Unwind
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
              styles.heroCircleOne
            }
          />


          <View
            style={
              styles.heroCircleTwo
            }
          />


          <Animated.View
            style={[
              styles.sparkleLeft,

              {
                opacity:
                  sparkleOpacity,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={
                24
              }
              color={
                COLORS.lilacDark
              }
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.sparkleRight,

              {
                opacity:
                  sparkleOpacity,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={
                18
              }
              color={
                COLORS.skyDark
              }
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.completeBadge,

              {
                transform: [
                  {
                    scale:
                      badgeScale,
                  },

                  {
                    translateY:
                      floatY,
                  },
                ],
              },
            ]}
          >

            <View
              style={
                styles.brushCircle
              }
            >
              <Ionicons
                name="brush"
                size={
                  42
                }
                color={
                  COLORS.peachDark
                }
              />
            </View>


            <View
              style={
                styles.completeCheck
              }
            >
              <Ionicons
                name="checkmark"
                size={
                  16
                }
                color={
                  COLORS.white
                }
              />
            </View>

          </Animated.View>


          <View
            style={
              styles.finishedPill
            }
          >
            <Ionicons
              name="checkmark-circle"
              size={
                16
              }
              color={
                COLORS.mintDark
              }
            />

            <Text
              style={
                styles.finishedPillText
              }
            >
              Drawing complete
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

          <Text
            style={
              styles.eyebrow
            }
          >
            A LITTLE SPACE FOR YOU
          </Text>


          <Text
            style={
              styles.title
            }
          >
            You let your hand{"\n"}
            wander for a while
          </Text>


          <Text
            style={
              styles.description
            }
          >
            There was nothing you needed to make perfect.
            You simply gave yourself some room to create.
          </Text>


          {/* Summary */}

          <View
            style={
              styles.summaryCard
            }
          >

            <View
              style={
                styles.summaryItem
              }
            >
              <View
                style={[
                  styles.summaryIcon,

                  {
                    backgroundColor:
                      COLORS.sky,
                  },
                ]}
              >
                <Ionicons
                  name="pencil-outline"
                  size={
                    19
                  }
                  color={
                    COLORS.skyDark
                  }
                />
              </View>

              <Text
                style={
                  styles.summaryValue
                }
              >
                {
                  strokeCount
                }
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                strokes
              </Text>
            </View>


            <View
              style={
                styles.summaryDivider
              }
            />


            <View
              style={
                styles.summaryItem
              }
            >
              <View
                style={[
                  styles.summaryIcon,

                  {
                    backgroundColor:
                      COLORS.lilac,
                  },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={
                    19
                  }
                  color={
                    COLORS.lilacDark
                  }
                />
              </View>

              <Text
                style={
                  styles.summaryValue
                }
              >
                {
                  colorsUsed
                }
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                colors
              </Text>
            </View>


            <View
              style={
                styles.summaryDivider
              }
            />


            <View
              style={
                styles.summaryItem
              }
            >
              <View
                style={[
                  styles.summaryIcon,

                  {
                    backgroundColor:
                      COLORS.mint,
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={
                    19
                  }
                  color={
                    COLORS.mintDark
                  }
                />
              </View>

              <Text
                style={
                  styles.summaryValueSmall
                }
              >
                {
                  drawingTimeText
                }
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                drawing
              </Text>
            </View>

          </View>


          {/* Gentle reflection */}

          <View
            style={
              styles.noteCard
            }
          >

            <View
              style={
                styles.noteIcon
              }
            >
              <Ionicons
                name="leaf-outline"
                size={
                  18
                }
                color={
                  COLORS.mintDark
                }
              />
            </View>


            <Text
              style={
                styles.noteText
              }
            >
              The drawing did not need to become anything.
              Making space for the moment was enough.
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
              styles.finishButton
            }
            onPress={
              handleFinish
            }
            activeOpacity={
              0.86
            }
            accessibilityRole="button"
            accessibilityLabel="Finish Color and Unwind"
          >

            <Text
              style={
                styles.finishText
              }
            >
              Finish Activity
            </Text>


            <Ionicons
              name="checkmark-circle-outline"
              size={
                21
              }
              color={
                COLORS.white
              }
            />

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.againButton
            }
            onPress={
              handleAgain
            }
            activeOpacity={
              0.78
            }
            accessibilityRole="button"
            accessibilityLabel="Draw again"
          >
            <Ionicons
              name="refresh-outline"
              size={
                18
              }
              color={
                COLORS.peachDark
              }
            />


            <Text
              style={
                styles.againText
              }
            >
              Draw Again
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
      flex:
        1,

      backgroundColor:
        COLORS.background,
    },


    container: {
      flex:
        1,

      backgroundColor:
        COLORS.background,

      overflow:
        "hidden",
    },


    topGlow: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      top:
        -170,

      right:
        -100,

      backgroundColor:
        COLORS.sky,

      opacity:
        0.45,
    },


    bottomGlow: {
      position:
        "absolute",

      width:
        250,

      height:
        250,

      borderRadius:
        125,

      bottom:
        -140,

      left:
        -110,

      backgroundColor:
        COLORS.mint,

      opacity:
        0.42,
    },


    /*
     * Header
     */

    header: {
      height:
        62,

      paddingHorizontal:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    headerButton: {
      width:
        42,

      height:
        42,

      borderRadius:
        21,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.88)",

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        17,

      color:
        COLORS.textPrimary,
    },


    headerSpacer: {
      width:
        42,
    },


    /*
     * Hero
     */

    hero: {
      height:
        285,

      marginHorizontal:
        20,

      marginTop:
        8,

      borderRadius:
        36,

      alignItems:
        "center",

      justifyContent:
        "center",

      overflow:
        "hidden",

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      shadowColor:
        "#AEA69C",

      shadowOffset: {
        width:
          0,

        height:
          5,
      },

      shadowOpacity:
        0.1,

      shadowRadius:
        10,

      elevation:
        3,
    },


    heroCircleOne: {
      position:
        "absolute",

      width:
        205,

      height:
        205,

      borderRadius:
        103,

      left:
        -68,

      top:
        -65,

      backgroundColor:
        COLORS.sky,

      opacity:
        0.72,
    },


    heroCircleTwo: {
      position:
        "absolute",

      width:
        215,

      height:
        215,

      borderRadius:
        108,

      right:
        -75,

      bottom:
        -80,

      backgroundColor:
        COLORS.mint,

      opacity:
        0.7,
    },


    completeBadge: {
      width:
        132,

      height:
        132,

      borderRadius:
        45,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#FFF5EC",

      borderWidth:
        1,

      borderColor:
        "#F0DDD0",

      shadowColor:
        COLORS.peachDark,

      shadowOffset: {
        width:
          0,

        height:
          7,
      },

      shadowOpacity:
        0.14,

      shadowRadius:
        9,

      elevation:
        4,
    },


    brushCircle: {
      width:
        82,

      height:
        82,

      borderRadius:
        28,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.peach,
    },


    completeCheck: {
      position:
        "absolute",

      right:
        13,

      bottom:
        13,

      width:
        30,

      height:
        30,

      borderRadius:
        15,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.mintDark,

      borderWidth:
        3,

      borderColor:
        COLORS.card,
    },


    sparkleLeft: {
      position:
        "absolute",

      left:
        60,

      top:
        72,
    },


    sparkleRight: {
      position:
        "absolute",

      right:
        62,

      top:
        95,
    },


    finishedPill: {
      position:
        "absolute",

      bottom:
        18,

      minHeight:
        32,

      paddingHorizontal:
        13,

      borderRadius:
        16,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.88)",
    },


    finishedPillText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        10.5,

      color:
        COLORS.mintDark,
    },


    /*
     * Content
     */

    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        22,

      alignItems:
        "center",
    },


    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        9.5,

      letterSpacing:
        1.4,

      color:
        COLORS.peachDark,
    },


    title: {
      marginTop:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        27,

      lineHeight:
        32,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      maxWidth:
        325,

      marginTop:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13.2,

      lineHeight:
        19,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * Summary
     */

    summaryCard: {
      width:
        "100%",

      minHeight:
        106,

      marginTop:
        20,

      paddingHorizontal:
        10,

      borderRadius:
        22,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    summaryItem: {
      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    summaryIcon: {
      width:
        35,

      height:
        35,

      borderRadius:
        13,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        6,
    },


    summaryValue: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        17,

      color:
        COLORS.textPrimary,
    },


    summaryValueSmall: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.textPrimary,
    },


    summaryLabel: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        9.5,

      color:
        COLORS.textSecondary,
    },


    summaryDivider: {
      width:
        1,

      height:
        52,

      backgroundColor:
        COLORS.border,
    },


    /*
     * Note
     */

    noteCard: {
      width:
        "100%",

      minHeight:
        62,

      marginTop:
        13,

      paddingHorizontal:
        14,

      paddingVertical:
        11,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#F6F2EB",
    },


    noteIcon: {
      width:
        35,

      height:
        35,

      borderRadius:
        13,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.mint,
    },


    noteText: {
      flex:
        1,

      marginLeft:
        9,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      lineHeight:
        16.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Bottom
     */

    bottomContainer: {
      paddingHorizontal:
        24,

      paddingBottom:
        16,
    },


    finishButton: {
      height:
        57,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.peachDark,

      shadowColor:
        COLORS.peachDark,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.16,

      shadowRadius:
        7,

      elevation:
        3,
    },


    finishText: {
      marginRight:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15.5,

      color:
        COLORS.white,
    },


    againButton: {
      height:
        43,

      marginTop:
        6,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    againText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        12,

      color:
        COLORS.peachDark,
    },
  });