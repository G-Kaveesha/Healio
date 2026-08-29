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
  ScrollView,
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
  clearChatbotActivityContext,
  finishChatbotStartedActivity,
} from "../../../../services/chatbotActivityNavigation";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F4F3FF",

  card:
    "#FFFFFF",

  primary:
    "#6C63D9",

  primaryDark:
    "#5148B8",

  blue:
    "#6F9DE8",

  softPurple:
    "#EAE6FF",

  softPurpleStrong:
    "#DDD7FF",

  softBlue:
    "#E8F1FF",

  softBlueStrong:
    "#DCE9FF",

  textPrimary:
    "#28253E",

  textSecondary:
    "#747088",

  border:
    "#DDD9F6",

  white:
    "#FFFFFF",
};


/*
 * =========================================================
 * RAIN STAGES
 * =========================================================
 */

const RAIN_STAGES = [
  {
    letter:
      "R",

    label:
      "Recognize",
  },

  {
    letter:
      "A",

    label:
      "Allow",
  },

  {
    letter:
      "I",

    label:
      "Investigate",
  },

  {
    letter:
      "N",

    label:
      "Nurture",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function RainCompleteScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * ROUTE DATA
   * =======================================================
   */

  const nurtureResponse =
    route?.params
      ?.nurtureResponse ||
    null;


  const breathingCompleted =
    route?.params
      ?.breathingCompleted ||
    false;


  /*
   * =======================================================
   * ANIMATION VALUES
   * =======================================================
   */

  const scaleAnimation =
    useRef(
      new Animated.Value(
        0.8
      )
    ).current;


  const fadeAnimation =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  /*
   * =======================================================
   * ENTRY ANIMATION
   * =======================================================
   */

  useEffect(
    () => {

      Animated.parallel([
        Animated.spring(
          scaleAnimation,
          {
            toValue:
              1,

            friction:
              6,

            tension:
              50,

            useNativeDriver:
              true,
          }
        ),


        Animated.timing(
          fadeAnimation,
          {
            toValue:
              1,

            duration:
              600,

            easing:
              Easing.out(
                Easing.ease
              ),

            useNativeDriver:
              true,
          }
        ),
      ]).start();

    },
    [
      fadeAnimation,
      scaleAnimation,
    ]
  );


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * FINAL NAVIGATION RULE:
   *
   * The visible back button on an activity Complete screen
   * must always leave the activity flow and return to the
   * main SelfCare screen.
   *
   * We reset the Home stack to:
   *
   * HomeMain
   * → SelfCare
   *
   * This removes all RAIN activity screens from underneath
   * SelfCare:
   *
   * RainMindfulnessIntro
   * RainRecognize
   * RainAllow
   * RainInvestigate
   * RainNurture
   * RainBreathing
   * RainComplete
   *
   * Therefore pressing Back afterwards cannot accidentally
   * reopen an old RAIN screen.
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

        /*
         * The user is manually leaving the activity rather
         * than using Finish Activity.
         *
         * Clear a possible chatbot activity origin so stale
         * chatbot-return state is not kept after exiting.
         */

        clearChatbotActivityContext();


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
   * ANDROID PHYSICAL BACK BUTTON
   * =======================================================
   *
   * Android Back follows exactly the same behavior as the
   * visible header back arrow.
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
   * FINISH ACTIVITY
   * =======================================================
   *
   * Keep the existing Chatbot integration.
   *
   * If RAIN was started from Chatbot:
   * → return to the same Chatbot conversation.
   *
   * If it was started normally:
   * → return to AngerActivities.
   * =======================================================
   */

  const handleFinish =
    () => {

      finishChatbotStartedActivity({
        navigation,

        activityId:
          "rain-mindfulness",

        fallbackRoute:
          "AngerActivities",
      });
    };


  /*
   * =======================================================
   * TRY ANOTHER ACTIVITY
   * =======================================================
   *
   * This is intentionally different from the back arrow.
   *
   * The user has chosen to remain inside the Anger
   * activity category and select another activity.
   *
   * Any Chatbot activity origin is therefore cleared.
   * =======================================================
   */

  const handleTryAnother =
    () => {

      clearChatbotActivityContext();


      navigation.navigate(
        "AngerActivities"
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
            DECORATIVE BACKGROUND
           ================================================= */}

        <View
          style={
            styles.topPurpleShape
          }
        />


        <View
          style={
            styles.bottomBlueShape
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
            activeOpacity={
              0.7
            }
            onPress={
              handleBackToSelfCare
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
          >

            <Ionicons
              name="chevron-back"
              size={
                28
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
            RAIN Mindfulness
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/* =================================================
            SCROLLABLE CONTENT
           ================================================= */}

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* =================================================
              COMPLETION ICON
             ================================================= */}

          <Animated.View
            style={[
              styles.completeIconOuter,

              {
                opacity:
                  fadeAnimation,

                transform: [
                  {
                    scale:
                      scaleAnimation,
                  },
                ],
              },
            ]}
          >

            <View
              style={
                styles.completeIconMiddle
              }
            >

              <View
                style={
                  styles.completeIconInner
                }
              >

                <Ionicons
                  name="checkmark"
                  size={
                    46
                  }
                  color={
                    COLORS.primary
                  }
                />

              </View>

            </View>

          </Animated.View>


          {/* =================================================
              MAIN MESSAGE
             ================================================= */}

          <Animated.View
            style={[
              styles.messageArea,

              {
                opacity:
                  fadeAnimation,
              },
            ]}
          >

            <Text
              style={
                styles.smallLabel
              }
            >
              RAIN COMPLETE
            </Text>


            <Text
              style={
                styles.title
              }
            >
              You gave yourself a moment
            </Text>


            <Text
              style={
                styles.description
              }
            >
              You paused, noticed what was
              happening, and responded with
              care.
            </Text>

          </Animated.View>


          {/* =================================================
              NURTURE STATEMENT
             ================================================= */}

          {nurtureResponse
            ?.text && (

            <View
              style={
                styles.nurtureCard
              }
            >

              <View
                style={
                  styles.heartContainer
                }
              >

                <Ionicons
                  name="heart-outline"
                  size={
                    22
                  }
                  color={
                    COLORS.primary
                  }
                />

              </View>


              <View
                style={
                  styles.nurtureTextContainer
                }
              >

                <Text
                  style={
                    styles.nurtureLabel
                  }
                >
                  Keep this with you
                </Text>


                <Text
                  style={
                    styles.nurtureText
                  }
                >
                  “{nurtureResponse.text}”
                </Text>

              </View>

            </View>
          )}


          {/* =================================================
              RAIN STAGES
             ================================================= */}

          <View
            style={
              styles.rainCard
            }
          >

            <Text
              style={
                styles.rainCardTitle
              }
            >
              You completed RAIN
            </Text>


            <View
              style={
                styles.stageRow
              }
            >

              {RAIN_STAGES.map(
                (
                  stage,
                  index
                ) => (

                  <React.Fragment
                    key={
                      stage.letter
                    }
                  >

                    <View
                      style={
                        styles.stageItem
                      }
                    >

                      <View
                        style={[
                          styles.stageCircle,

                          index %
                            2 ===
                          0
                            ? styles.purpleStage
                            : styles.blueStage,
                        ]}
                      >

                        <Ionicons
                          name="checkmark"
                          size={
                            16
                          }
                          color={
                            COLORS.primaryDark
                          }
                        />

                      </View>


                      <Text
                        style={
                          styles.stageLetter
                        }
                      >
                        {
                          stage.letter
                        }
                      </Text>


                      <Text
                        style={
                          styles.stageLabel
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {
                          stage.label
                        }
                      </Text>

                    </View>


                    {index <
                      RAIN_STAGES.length -
                        1 && (

                      <View
                        style={
                          styles.stageDivider
                        }
                      />

                    )}

                  </React.Fragment>
                )
              )}

            </View>

          </View>


          {/* =================================================
              BREATHING COMPLETION
             ================================================= */}

          {breathingCompleted && (

            <View
              style={
                styles.breathCard
              }
            >

              <Ionicons
                name="cloud-outline"
                size={
                  19
                }
                color={
                  COLORS.blue
                }
              />


              <Text
                style={
                  styles.breathText
                }
              >
                You also took a few slow
                breaths.
              </Text>

            </View>

          )}


          {/* =================================================
              FINAL MESSAGE
             ================================================= */}

          <View
            style={
              styles.finalMessage
            }
          >

            <Ionicons
              name="sparkles-outline"
              size={
                19
              }
              color={
                COLORS.primary
              }
            />


            <Text
              style={
                styles.finalMessageText
              }
            >
              Continue at your own pace.
            </Text>

          </View>

        </ScrollView>


        {/* =================================================
            BOTTOM ACTIONS
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
            accessibilityLabel="Finish RAIN activity"
          >

            <Text
              style={
                styles.finishButtonText
              }
            >
              Finish Activity
            </Text>


            <Ionicons
              name="checkmark-circle-outline"
              size={
                22
              }
              color={
                COLORS.white
              }
            />

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.anotherButton
            }
            onPress={
              handleTryAnother
            }
            activeOpacity={
              0.7
            }
            accessibilityRole="button"
            accessibilityLabel="Try another anger activity"
          >

            <Ionicons
              name="grid-outline"
              size={
                18
              }
              color={
                COLORS.primary
              }
            />


            <Text
              style={
                styles.anotherButtonText
              }
            >
              Try Another Activity
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
     * DECORATIVE BACKGROUND
     * =====================================================
     */

    topPurpleShape: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      backgroundColor:
        "#E8E3FF",

      top:
        -155,

      right:
        -105,

      opacity:
        0.75,
    },


    bottomBlueShape: {
      position:
        "absolute",

      width:
        270,

      height:
        270,

      borderRadius:
        135,

      backgroundColor:
        "#DFEBFF",

      bottom:
        20,

      left:
        -175,

      opacity:
        0.6,
    },


    /*
     * =====================================================
     * HEADER
     * =====================================================
     */

    header: {
      height:
        60,

      paddingHorizontal:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      zIndex:
        10,
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
        "rgba(255,255,255,0.78)",
    },


    headerTitle: {
      flex:
        1,

      marginHorizontal:
        8,

      fontSize:
        16,

      fontWeight:
        "700",

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    headerSpacer: {
      width:
        42,
    },


    /*
     * =====================================================
     * MAIN CONTENT
     * =====================================================
     */

    scrollContent: {
      flexGrow:
        1,

      alignItems:
        "center",

      paddingHorizontal:
        24,

      paddingTop:
        18,

      paddingBottom:
        30,
    },


    /*
     * =====================================================
     * COMPLETION ICON
     * =====================================================
     */

    completeIconOuter: {
      width:
        150,

      height:
        150,

      borderRadius:
        75,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(220,233,255,0.72)",
    },


    completeIconMiddle: {
      width:
        118,

      height:
        118,

      borderRadius:
        59,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softPurple,
    },


    completeIconInner: {
      width:
        82,

      height:
        82,

      borderRadius:
        41,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.card,

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          5,
      },

      shadowOpacity:
        0.07,

      shadowRadius:
        10,

      elevation:
        3,
    },


    /*
     * =====================================================
     * MESSAGE
     * =====================================================
     */

    messageArea: {
      marginTop:
        29,

      alignItems:
        "center",
    },


    smallLabel: {
      fontSize:
        11,

      fontWeight:
        "800",

      letterSpacing:
        1.7,

      color:
        COLORS.primary,
    },


    title: {
      marginTop:
        9,

      maxWidth:
        330,

      fontSize:
        29,

      lineHeight:
        37,

      fontWeight:
        "800",

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        12,

      maxWidth:
        320,

      fontSize:
        15,

      lineHeight:
        23,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * NURTURE
     * =====================================================
     */

    nurtureCard: {
      width:
        "100%",

      marginTop:
        30,

      paddingHorizontal:
        16,

      paddingVertical:
        16,

      borderRadius:
        21,

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

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          3,
      },

      shadowOpacity:
        0.04,

      shadowRadius:
        8,

      elevation:
        2,
    },


    heartContainer: {
      width:
        45,

      height:
        45,

      borderRadius:
        23,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softPurple,
    },


    nurtureTextContainer: {
      flex:
        1,

      marginLeft:
        13,
    },


    nurtureLabel: {
      fontSize:
        11.5,

      fontWeight:
        "700",

      color:
        COLORS.textSecondary,
    },


    nurtureText: {
      marginTop:
        4,

      fontSize:
        14,

      lineHeight:
        20,

      fontWeight:
        "650",

      color:
        COLORS.primaryDark,
    },


    /*
     * =====================================================
     * RAIN STAGES
     * =====================================================
     */

    rainCard: {
      width:
        "100%",

      marginTop:
        21,

      paddingHorizontal:
        17,

      paddingVertical:
        20,

      borderRadius:
        22,

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    rainCardTitle: {
      marginBottom:
        18,

      fontSize:
        13,

      fontWeight:
        "700",

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    stageRow: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",
    },


    stageItem: {
      width:
        58,

      alignItems:
        "center",
    },


    stageCircle: {
      width:
        40,

      height:
        40,

      borderRadius:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    purpleStage: {
      backgroundColor:
        COLORS.softPurpleStrong,
    },


    blueStage: {
      backgroundColor:
        COLORS.softBlueStrong,
    },


    stageLetter: {
      marginTop:
        6,

      fontSize:
        12,

      fontWeight:
        "800",

      color:
        COLORS.primaryDark,
    },


    stageLabel: {
      marginTop:
        2,

      fontSize:
        9.5,

      fontWeight:
        "600",

      color:
        COLORS.textSecondary,

      textAlign:
        "center",
    },


    stageDivider: {
      flex:
        1,

      height:
        1.5,

      marginTop:
        20,

      marginHorizontal:
        2,

      backgroundColor:
        COLORS.border,
    },


    /*
     * =====================================================
     * BREATHING
     * =====================================================
     */

    breathCard: {
      marginTop:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        15,

      paddingVertical:
        10,

      borderRadius:
        20,

      backgroundColor:
        COLORS.softBlue,
    },


    breathText: {
      marginLeft:
        7,

      fontSize:
        12.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * FINAL MESSAGE
     * =====================================================
     */

    finalMessage: {
      marginTop:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    finalMessageText: {
      marginLeft:
        7,

      fontSize:
        13,

      fontWeight:
        "600",

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * BOTTOM BUTTONS
     * =====================================================
     */

    bottomContainer: {
      paddingHorizontal:
        24,

      paddingTop:
        12,

      paddingBottom:
        18,

      backgroundColor:
        COLORS.background,
    },


    finishButton: {
      height:
        58,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,

      shadowColor:
        COLORS.primary,

      shadowOffset: {
        width:
          0,

        height:
          6,
      },

      shadowOpacity:
        0.18,

      shadowRadius:
        10,

      elevation:
        4,
    },


    finishButtonText: {
      marginRight:
        9,

      fontSize:
        16,

      fontWeight:
        "700",

      color:
        COLORS.white,
    },


    anotherButton: {
      height:
        48,

      marginTop:
        8,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    anotherButtonText: {
      marginLeft:
        7,

      fontSize:
        13.5,

      fontWeight:
        "650",

      color:
        COLORS.primary,
    },
  });