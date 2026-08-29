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
  background:
    "#F8FAF7",

  card:
    "#FFFFFF",

  primary:
    "#E0A92F",

  primaryDark:
    "#B67F15",

  softYellow:
    "#FFF3C9",

  softBlue:
    "#E9F3FA",

  softLavender:
    "#F0ECFA",

  softGreen:
    "#E8F3E7",

  green:
    "#72A36D",

  lavender:
    "#8B7CB6",

  blue:
    "#73A8C7",

  textPrimary:
    "#303238",

  textSecondary:
    "#74767D",

  border:
    "#E8E5DD",

  white:
    "#FFFFFF",
};


/*
 * =========================================================
 * ACTIVITY CONFIGURATION
 * =========================================================
 */

const ACTIVITY_ID =
  "one-small-step";

const ACTIVITY_CATEGORY =
  "lowMood";

const NORMAL_FINISH_ROUTE =
  "LowMoodActivities";


/*
 * =========================================================
 * MOOD OPTIONS
 * =========================================================
 */

const MOOD_OPTIONS = [
  {
    id:
      "lighter",

    label:
      "A little lighter",

    icon:
      "sunny-outline",
  },

  {
    id:
      "same",

    label:
      "About the same",

    icon:
      "remove-circle-outline",
  },

  {
    id:
      "still-low",

    label:
      "Still low",

    icon:
      "cloud-outline",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function SmallStepCompleteScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    selectedMood,
    setSelectedMood,
  ] =
    useState(
      null
    );


  /*
   * =======================================================
   * ANIMATION VALUES
   * =======================================================
   */

  const scale =
    useRef(
      new Animated.Value(
        0.8
      )
    ).current;


  const opacity =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  /*
   * =======================================================
   * ACTIVITY RESULT
   * =======================================================
   */

  const completedStep =
    route?.params
      ?.completedStep ||
    route?.params
      ?.selectedStep;


  /*
   * =======================================================
   * ENTRY ANIMATION
   * =======================================================
   */

  useEffect(() => {

    Animated.parallel([
      Animated.spring(
        scale,
        {
          toValue:
            1,

          friction:
            6,

          tension:
            45,

          useNativeDriver:
            true,
        }
      ),

      Animated.timing(
        opacity,
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

  }, [
    scale,
    opacity,
  ]);


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * IMPORTANT:
   *
   * Back must NOT go to:
   *
   * SmallStepChoose
   * SmallStepAction
   * SmallStepIntro
   * LowMoodActivities
   *
   * The Healio activity-navigation rule is:
   *
   * Activity back
   * → main SelfCare screen.
   *
   * reset() also removes the completed activity flow
   * from the navigation stack.
   *
   * Final stack:
   *
   * HomeMain
   * SelfCare
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
   *
   * Android's hardware back button follows the same rule
   * as the visible header back button.
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
   * REFLECTION
   * =======================================================
   */

  const getReflection =
    () => {

      if (
        selectedMood ===
        "lighter"
      ) {

        return (
          "Notice that small shift. " +
          "You don't need to do more right now."
        );
      }


      if (
        selectedMood ===
        "same"
      ) {

        return (
          "That's okay. The step still counted."
        );
      }


      if (
        selectedMood ===
        "still-low"
      ) {

        return (
          "That's okay too. You still showed up for yourself."
        );
      }


      return null;
    };


  /*
   * =======================================================
   * FINISH ACTIVITY
   * =======================================================
   *
   * Chatbot-started activity:
   *
   * → return to the same Chatbot conversation.
   *
   * Normal Self Care activity:
   *
   * → return to LowMoodActivities.
   *
   * This existing behavior is intentionally preserved.
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
   * CHOOSE ANOTHER STEP
   * =======================================================
   *
   * This is NOT treated as a back action.
   *
   * It deliberately starts another round of the same
   * One Small Step activity.
   *
   * Chatbot source state remains active if the activity
   * originally came from Chatbot.
   * =======================================================
   */

  const handleAnotherStep =
    () => {

      navigation.navigate(
        "SmallStepChoose",
        {
          activityId:
            route?.params
              ?.activityId ||
            ACTIVITY_ID,

          category:
            route?.params
              ?.category ||
            ACTIVITY_CATEGORY,
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
            DECORATIVE BACKGROUND
           ================================================= */}

        <View
          style={
            styles.yellowShape
          }
        />

        <View
          style={
            styles.blueShape
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
            accessibilityHint="Leaves this activity and returns to the main Self Care screen"
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
            One Small Step
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* =================================================
            MAIN CONTENT
           ================================================= */}

        <View
          style={
            styles.content
          }
        >

          {/* =================================================
              SUCCESS GRAPHIC
             ================================================= */}

          <Animated.View
            style={[
              styles.iconOuter,

              {
                opacity,

                transform: [
                  {
                    scale,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.iconMiddle
              }
            >
              <View
                style={
                  styles.iconInner
                }
              >
                <Ionicons
                  name="checkmark"
                  size={
                    45
                  }
                  color={
                    COLORS.green
                  }
                />
              </View>
            </View>
          </Animated.View>


          {/* =================================================
              COMPLETION MESSAGE
             ================================================= */}

          <Animated.View
            style={[
              styles.messageArea,

              {
                opacity,
              },
            ]}
          >
            <Text
              style={
                styles.smallLabel
              }
            >
              SMALL STEP COMPLETE
            </Text>


            <Text
              style={
                styles.title
              }
            >
              You did it.
            </Text>


            <Text
              style={
                styles.description
              }
            >
              You took one small step,
              even when your energy may
              have felt low.
            </Text>
          </Animated.View>


          {/* =================================================
              COMPLETED STEP
             ================================================= */}

          {completedStep?.title && (
            <View
              style={
                styles.completedCard
              }
            >
              <View
                style={
                  styles.completedIcon
                }
              >
                <Ionicons
                  name={
                    completedStep
                      .icon ||
                    "checkmark-circle-outline"
                  }
                  size={
                    22
                  }
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>


              <View
                style={
                  styles.completedTextArea
                }
              >
                <Text
                  style={
                    styles.completedLabel
                  }
                >
                  Your step
                </Text>


                <Text
                  style={
                    styles.completedText
                  }
                >
                  {
                    completedStep
                      .title
                  }
                </Text>
              </View>
            </View>
          )}


          {/* =================================================
              REFLECTION
             ================================================= */}

          <Text
            style={
              styles.reflectionTitle
            }
          >
            How do you feel now?
          </Text>


          <Text
            style={
              styles.reflectionSubtitle
            }
          >
            There's no right answer.
          </Text>


          <View
            style={
              styles.moodOptions
            }
          >
            {MOOD_OPTIONS.map(
              (
                mood
              ) => {

                const selected =
                  selectedMood ===
                  mood.id;


                return (
                  <TouchableOpacity
                    key={
                      mood.id
                    }
                    style={[
                      styles.moodButton,

                      selected &&
                        styles.selectedMood,
                    ]}
                    onPress={
                      () =>
                        setSelectedMood(
                          mood.id
                        )
                    }
                    activeOpacity={
                      0.8
                    }
                    accessibilityRole="button"
                    accessibilityState={{
                      selected,
                    }}
                    accessibilityLabel={
                      mood.label
                    }
                  >
                    <Ionicons
                      name={
                        mood.icon
                      }
                      size={
                        20
                      }
                      color={
                        selected
                          ? COLORS.white
                          : COLORS.lavender
                      }
                    />


                    <Text
                      style={[
                        styles.moodText,

                        selected &&
                          styles.selectedMoodText,
                      ]}
                    >
                      {
                        mood.label
                      }
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>


          {selectedMood && (
            <View
              style={
                styles.reflectionCard
              }
            >
              <Ionicons
                name="heart-outline"
                size={
                  18
                }
                color={
                  COLORS.green
                }
              />


              <Text
                style={
                  styles.reflectionText
                }
              >
                {
                  getReflection()
                }
              </Text>
            </View>
          )}

        </View>


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
              styles.anotherButton
            }
            onPress={
              handleAnotherStep
            }
            activeOpacity={
              0.75
            }
            accessibilityRole="button"
            accessibilityLabel="Choose another step"
          >
            <Ionicons
              name="add-circle-outline"
              size={
                19
              }
              color={
                COLORS.lavender
              }
            />


            <Text
              style={
                styles.anotherText
              }
            >
              Choose Another Step
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

    yellowShape: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      top:
        -160,

      right:
        -110,

      backgroundColor:
        "#FFF0BA",

      opacity:
        0.65,
    },


    blueShape: {
      position:
        "absolute",

      width:
        270,

      height:
        270,

      borderRadius:
        135,

      bottom:
        10,

      left:
        -180,

      backgroundColor:
        COLORS.softBlue,

      opacity:
        0.7,
    },


    /*
     * =====================================================
     * HEADER
     * =====================================================
     */

    header: {
      height:
        58,

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
        "rgba(255,255,255,0.82)",
    },


    headerTitle: {
      flex:
        1,

      paddingHorizontal:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        17,

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

    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        12,

      alignItems:
        "center",
    },


    /*
     * =====================================================
     * SUCCESS ICON
     * =====================================================
     */

    iconOuter: {
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
        COLORS.softBlue,
    },


    iconMiddle: {
      width:
        116,

      height:
        116,

      borderRadius:
        58,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softYellow,
    },


    iconInner: {
      width:
        80,

      height:
        80,

      borderRadius:
        40,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.card,

      elevation:
        3,
    },


    /*
     * =====================================================
     * COMPLETION MESSAGE
     * =====================================================
     */

    messageArea: {
      alignItems:
        "center",
    },


    smallLabel: {
      marginTop:
        22,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        11,

      letterSpacing:
        1.4,

      color:
        COLORS.primaryDark,
    },


    title: {
      marginTop:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        31,

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        10,

      maxWidth:
        315,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        14.5,

      lineHeight:
        22,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * COMPLETED STEP
     * =====================================================
     */

    completedCard: {
      width:
        "100%",

      marginTop:
        22,

      paddingHorizontal:
        15,

      paddingVertical:
        14,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softYellow,
    },


    completedIcon: {
      width:
        43,

      height:
        43,

      borderRadius:
        22,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },


    completedTextArea: {
      flex:
        1,

      marginLeft:
        11,
    },


    completedLabel: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        COLORS.textSecondary,
    },


    completedText: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        14,

      color:
        COLORS.textPrimary,
    },


    /*
     * =====================================================
     * REFLECTION
     * =====================================================
     */

    reflectionTitle: {
      marginTop:
        22,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        20,

      color:
        COLORS.textPrimary,
    },


    reflectionSubtitle: {
      marginTop:
        4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      color:
        COLORS.textSecondary,
    },


    moodOptions: {
      width:
        "100%",

      marginTop:
        16,

      flexDirection:
        "row",

      justifyContent:
        "space-between",
    },


    moodButton: {
      width:
        "31.5%",

      minHeight:
        75,

      paddingHorizontal:
        7,

      paddingVertical:
        10,

      borderRadius:
        17,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softLavender,

      borderWidth:
        1,

      borderColor:
        "transparent",
    },


    selectedMood: {
      backgroundColor:
        COLORS.lavender,

      borderColor:
        COLORS.lavender,
    },


    moodText: {
      marginTop:
        6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      lineHeight:
        15,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    selectedMoodText: {
      color:
        COLORS.white,

      fontFamily:
        "JosefinSans_700Bold",
    },


    reflectionCard: {
      width:
        "100%",

      marginTop:
        16,

      paddingHorizontal:
        14,

      paddingVertical:
        11,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softGreen,
    },


    reflectionText: {
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
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,
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


    anotherButton: {
      height:
        48,

      marginTop:
        6,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    anotherText: {
      marginLeft:
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.lavender,
    },
  });