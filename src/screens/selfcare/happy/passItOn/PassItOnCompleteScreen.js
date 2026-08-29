import React, {
  useCallback,
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
 * ACTIVITY CONFIGURATION
 * =========================================================
 */

const ACTIVITY_ID =
  "pass-it-on";

const NORMAL_FINISH_ROUTE =
  "HappyActivities";


/*
 * =========================================================
 * FEELINGS
 * =========================================================
 */

const FEELINGS = [
  {
    id:
      "nice",

    label:
      "Nice",

    icon:
      "happy-outline",

    color:
      "#FFE7A0",
  },

  {
    id:
      "warm",

    label:
      "Warm",

    icon:
      "heart-outline",

    color:
      "#F8C9A8",
  },

  {
    id:
      "peaceful",

    label:
      "Peaceful",

    icon:
      "leaf-outline",

    color:
      "#E3F2F7",
  },

  {
    id:
      "same",

    label:
      "About the same",

    icon:
      "remove-outline",

    color:
      "#F2EEE9",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function PassItOnCompleteScreen({
  navigation,
  route,
}) {

  const [
    selectedFeeling,
    setSelectedFeeling,
  ] =
    useState(
      null
    );


  /*
   * =======================================================
   * ENTRANCE ANIMATION
   * =======================================================
   */

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const translateY =
    useRef(
      new Animated.Value(25)
    ).current;


  useEffect(
    () => {

      Animated.parallel([
        Animated.timing(
          opacity,
          {
            toValue:
              1,

            duration:
              500,

            useNativeDriver:
              true,
          }
        ),

        Animated.spring(
          translateY,
          {
            toValue:
              0,

            friction:
              7,

            useNativeDriver:
              true,
          }
        ),
      ]).start();

    },
    [
      opacity,
      translateY,
    ]
  );


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * IMPORTANT:
   *
   * The visible back button and the Android physical
   * Back button must always leave the activity flow and
   * return directly to the MAIN SelfCare screen.
   *
   * We use reset instead of goBack() because the current
   * stack may contain:
   *
   * SelfCare
   * HappyActivities
   * PassItOnIntro
   * PassItOnChoose
   * ...
   * PassItOnComplete
   *
   * A normal goBack() would only return to the previous
   * activity step.
   *
   * reset() removes the activity screens and gives us:
   *
   * HomeMain
   * SelfCare
   *
   * Therefore the user cannot accidentally reopen the
   * completed activity by pressing Back again later.
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
   * ANDROID PHYSICAL BACK
   * =======================================================
   */

  useFocusEffect(
    useCallback(
      () => {

        const subscription =
          BackHandler
            .addEventListener(
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
   * FINISH ACTIVITY
   * =======================================================
   *
   * This behavior is intentionally preserved.
   *
   * Chatbot-started:
   * → return to Chatbot.
   *
   * Normal activity:
   * → return to HappyActivities.
   *
   * The Back button is different from Finish.
   * =======================================================
   */

  const handleFinish =
    () => {

      finishChatbotStartedActivity({
        navigation,

        activityId:
          ACTIVITY_ID,

        fallbackRoute:
          NORMAL_FINISH_ROUTE,
      });
    };


  /*
   * =======================================================
   * PASS ON ANOTHER
   * =======================================================
   *
   * This is NOT treated as a back action.
   *
   * The user intentionally wants to repeat the activity,
   * so we return to PassItOnChoose.
   *
   * Chatbot origin is preserved when repeating.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "PassItOnChoose",
        {
          activityId:
            route
              ?.params
              ?.activityId ||
            ACTIVITY_ID,

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
              styles.backButton
            }
            onPress={
              handleBackToSelfCare
            }
            activeOpacity={
              0.7
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
            accessibilityHint="Leaves this activity and returns to the main Self Care screen"
          >
            <Ionicons
              name="chevron-back"
              size={
                27
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
              styles.peachBlob
            }
          />


          <View
            style={
              styles.blueBlob
            }
          />


          <View
            style={
              styles.heroIcon
            }
          >
            <Ionicons
              name="heart"
              size={
                41
              }
              color={
                COLORS.coral
              }
            />
          </View>


          <View
            style={
              styles.sparkleOne
            }
          >
            <Ionicons
              name="sparkles"
              size={
                21
              }
              color={
                COLORS.coralDark
              }
            />
          </View>


          <View
            style={
              styles.sparkleTwo
            }
          >
            <Ionicons
              name="sparkles"
              size={
                16
              }
              color={
                COLORS.blue
              }
            />
          </View>

        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <Animated.View
          style={[
            styles.content,

            {
              opacity,

              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >

          <Text
            style={
              styles.eyebrow
            }
          >
            PASSED ON
          </Text>


          <Text
            style={
              styles.title
            }
          >
            A small good thing
          </Text>


          <Text
            style={
              styles.description
            }
          >
            How did that moment feel?
          </Text>


          {/* =================================================
              FEELING OPTIONS
             ================================================= */}

          <View
            style={
              styles.feelingsGrid
            }
          >

            {FEELINGS.map(
              (
                feeling
              ) => {

                const selected =
                  selectedFeeling ===
                  feeling.id;


                return (
                  <TouchableOpacity
                    key={
                      feeling.id
                    }
                    style={[
                      styles.feelingCard,

                      {
                        backgroundColor:
                          feeling.color,
                      },

                      selected &&
                        styles.feelingSelected,
                    ]}
                    onPress={
                      () =>
                        setSelectedFeeling(
                          feeling.id
                        )
                    }
                    activeOpacity={
                      0.82
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      feeling.label
                    }
                    accessibilityState={{
                      selected,
                    }}
                  >

                    <View
                      style={[
                        styles.feelingIcon,

                        selected &&
                          styles.feelingIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={
                          feeling.icon
                        }
                        size={
                          24
                        }
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.textPrimary
                        }
                      />
                    </View>


                    <Text
                      style={[
                        styles.feelingLabel,

                        selected &&
                          styles.feelingLabelSelected,
                      ]}
                    >
                      {
                        feeling.label
                      }
                    </Text>

                  </TouchableOpacity>
                );
              }
            )}

          </View>


          {/* =================================================
              RESPONSE
             ================================================= */}

          {selectedFeeling && (

            <View
              style={
                styles.responseCard
              }
            >

              <Ionicons
                name="sparkles-outline"
                size={
                  18
                }
                color={
                  COLORS.coral
                }
              />


              <Text
                style={
                  styles.responseText
                }
              >
                Whatever you noticed is
                okay. The action itself
                was enough.
              </Text>

            </View>

          )}

        </Animated.View>


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
              0.85
            }
            accessibilityRole="button"
            accessibilityLabel="Finish activity"
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
              0.75
            }
            accessibilityRole="button"
            accessibilityLabel="Pass on another positive action"
          >

            <Ionicons
              name="refresh-outline"
              size={
                17
              }
              color={
                COLORS.blue
              }
            />


            <Text
              style={
                styles.againText
              }
            >
              Pass On Another
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


    /*
     * =====================================================
     * HEADER
     * =====================================================
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


    backButton: {
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
        "rgba(255,255,255,0.84)",
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
     * =====================================================
     * HERO
     * =====================================================
     */

    hero: {
      height:
        255,

      marginHorizontal:
        20,

      marginTop:
        8,

      borderRadius:
        40,

      overflow:
        "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    yellowBlob: {
      position:
        "absolute",

      width:
        190,

      height:
        190,

      borderRadius:
        95,

      left:
        -48,

      top:
        -60,

      backgroundColor:
        COLORS.yellow,

      opacity:
        0.92,
    },


    peachBlob: {
      position:
        "absolute",

      width:
        185,

      height:
        185,

      borderRadius:
        93,

      right:
        -42,

      bottom:
        -62,

      backgroundColor:
        COLORS.peach,

      opacity:
        0.88,
    },


    blueBlob: {
      position:
        "absolute",

      width:
        115,

      height:
        115,

      borderRadius:
        58,

      right:
        42,

      top:
        25,

      backgroundColor:
        "#CDE7EF",
    },


    heroIcon: {
      width:
        102,

      height:
        102,

      borderRadius:
        34,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation:
        5,

      shadowColor:
        COLORS.coral,

      shadowOffset: {
        width:
          0,

        height:
          6,
      },

      shadowOpacity:
        0.14,

      shadowRadius:
        11,

      transform: [
        {
          rotate:
            "-5deg",
        },
      ],
    },


    sparkleOne: {
      position:
        "absolute",

      top:
        60,

      left:
        65,
    },


    sparkleTwo: {
      position:
        "absolute",

      bottom:
        60,

      right:
        70,
    },


    /*
     * =====================================================
     * CONTENT
     * =====================================================
     */

    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        20,

      alignItems:
        "center",
    },


    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        10,

      letterSpacing:
        1.5,

      color:
        COLORS.coral,
    },


    title: {
      marginTop:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        28,

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        14,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * FEELINGS
     * =====================================================
     */

    feelingsGrid: {
      width:
        "100%",

      marginTop:
        20,

      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    feelingCard: {
      width:
        "48%",

      minHeight:
        105,

      marginBottom:
        12,

      paddingHorizontal:
        13,

      paddingVertical:
        13,

      borderRadius:
        24,

      justifyContent:
        "space-between",

      borderWidth:
        1.5,

      borderColor:
        "transparent",
    },


    feelingSelected: {
      backgroundColor:
        COLORS.white,

      borderColor:
        COLORS.coral,

      elevation:
        3,

      shadowColor:
        COLORS.coral,

      shadowOffset: {
        width:
          0,

        height:
          3,
      },

      shadowOpacity:
        0.1,

      shadowRadius:
        7,
    },


    feelingIcon: {
      width:
        44,

      height:
        44,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.72)",
    },


    feelingIconSelected: {
      backgroundColor:
        COLORS.coral,
    },


    feelingLabel: {
      marginTop:
        11,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.textPrimary,
    },


    feelingLabelSelected: {
      color:
        COLORS.coralDark,
    },


    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    responseCard: {
      width:
        "100%",

      marginTop:
        5,

      paddingHorizontal:
        15,

      paddingVertical:
        10,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softPink,
    },


    responseText: {
      flex:
        1,

      marginLeft:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      lineHeight:
        18,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * BOTTOM
     * =====================================================
     */

    bottomContainer: {
      paddingHorizontal:
        24,

      paddingBottom:
        17,
    },


    finishButton: {
      height:
        58,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
    },


    finishText: {
      marginRight:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        16,

      color:
        COLORS.white,
    },


    againButton: {
      height:
        46,

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
        "JosefinSans_700Bold",

      fontSize:
        12.5,

      color:
        COLORS.blue,
    },
  });