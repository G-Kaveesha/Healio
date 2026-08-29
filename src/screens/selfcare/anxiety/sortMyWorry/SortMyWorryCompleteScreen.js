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
  background: "#F5F9F7",

  card: "#FFFFFF",

  primary: "#6797AE",
  primaryDark: "#477487",

  softBlue: "#E7F2F7",
  softBlueStrong: "#D8EAF2",

  green: "#79A98D",
  greenDark: "#557E67",
  softGreen: "#E4F1E8",

  cream: "#F8F0E4",
  creamDark: "#A9865F",

  textPrimary: "#303A3A",
  textSecondary: "#727D7B",

  border: "#DEE8E4",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * ACTIVITY CONFIGURATION
 * =========================================================
 */

const ACTIVITY_ID =
  "sort-my-worry";

const NORMAL_FINISH_ROUTE =
  "AnxietyActivities";


/*
 * =========================================================
 * COMPLETE SCREEN
 * =========================================================
 */

export default function SortMyWorryCompleteScreen({
  navigation,
  route,
}) {

  const worryPath =
    route?.params
      ?.worryPath ||
    "later";


  const chosenAction =
    route?.params
      ?.chosenAction ||
    "";


  const isActionable =
    worryPath ===
    "action";


  /*
   * =======================================================
   * ENTRY ANIMATION
   * =======================================================
   */

  const scale =
    useRef(
      new Animated.Value(
        0.82
      )
    ).current;


  const opacity =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  useEffect(
    () => {

      Animated.parallel([
        Animated.spring(
          scale,
          {
            toValue: 1,

            friction: 6,

            tension: 45,

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          opacity,
          {
            toValue: 1,

            duration: 600,

            useNativeDriver:
              true,
          }
        ),
      ]).start();

    },
    [
      scale,
      opacity,
    ]
  );


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * Every back action from a completed Self Care activity
   * should return to the main SelfCare screen.
   *
   * We reset the Home stack so old activity screens do not
   * remain underneath SelfCare.
   *
   * Result:
   *
   * HomeMain
   *    ↓
   * SelfCare
   *
   * The completed Sort My Worry flow is removed.
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

        navigation.reset({
          index: 1,

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
   * The Android hardware Back button behaves exactly like
   * the visible header Back button.
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
   * FINISH
   * =======================================================
   *
   * If started from Chatbot:
   * → return to the same Chatbot conversation.
   *
   * If started normally:
   * → return to AnxietyActivities.
   *
   * This existing behavior is preserved.
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
   * SORT ANOTHER WORRY
   * =======================================================
   *
   * This is intentionally different from Back.
   *
   * It restarts the Sort My Worry activity rather than
   * returning to SelfCare.
   *
   * Chatbot origin is intentionally not cleared here.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "SortMyWorryChat",
        {
          activityId:
            route?.params
              ?.activityId ||
            ACTIVITY_ID,

          category:
            "anxiety",
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
            DECORATIVE SHAPES
           ================================================= */}

        <View
          style={
            styles.blueShape
          }
        />


        <View
          style={
            styles.greenShape
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
            onPress={
              handleBackToSelfCare
            }
            activeOpacity={
              0.7
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
            Sort My Worry
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <View
          style={
            styles.content
          }
        >

          {/* =================================================
              COMPLETION VISUAL
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
                  name={
                    isActionable
                      ? "checkmark"
                      : "leaf-outline"
                  }
                  size={
                    40
                  }
                  color={
                    isActionable
                      ? COLORS.greenDark
                      : COLORS.primaryDark
                  }
                />
              </View>
            </View>
          </Animated.View>


          {/* =================================================
              HEADING
             ================================================= */}

          <Animated.View
            style={[
              styles.textArea,

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
              SORT MY WORRY
            </Text>


            <Text
              style={
                styles.title
              }
            >
              {
                isActionable
                  ? "You have a next step."
                  : "You can leave it here."
              }
            </Text>


            <Text
              style={
                styles.description
              }
            >
              {
                isActionable
                  ? "Keep it small. You don't need to solve everything today."
                  : "Not every worry needs an answer right now."
              }
            </Text>

          </Animated.View>


          {/* =================================================
              RESULT
             ================================================= */}

          {
            isActionable
              ? (
                <View
                  style={
                    styles.actionCard
                  }
                >

                  <View
                    style={
                      styles.actionIcon
                    }
                  >
                    <Ionicons
                      name="footsteps-outline"
                      size={
                        23
                      }
                      color={
                        COLORS.greenDark
                      }
                    />
                  </View>


                  <Text
                    style={
                      styles.actionLabel
                    }
                  >
                    YOUR SMALL STEP
                  </Text>


                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    {
                      chosenAction ||
                      "Take one manageable step."
                    }
                  </Text>

                </View>
              )
              : (
                <View
                  style={
                    styles.laterCard
                  }
                >

                  <View
                    style={
                      styles.laterIcon
                    }
                  >
                    <Ionicons
                      name="archive-outline"
                      size={
                        25
                      }
                      color={
                        COLORS.creamDark
                      }
                    />
                  </View>


                  <Text
                    style={
                      styles.laterTitle
                    }
                  >
                    Later Pocket
                  </Text>


                  <Text
                    style={
                      styles.laterText
                    }
                  >
                    You can return to this
                    worry when it becomes
                    useful to do so.
                  </Text>

                </View>
              )
          }


          {/* =================================================
              GENTLE CLOSING
             ================================================= */}

          <View
            style={
              styles.reminderCard
            }
          >

            <Ionicons
              name="heart-outline"
              size={
                19
              }
              color={
                COLORS.primary
              }
            />


            <Text
              style={
                styles.reminderText
              }
            >
              One thing at a time is
              enough.
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
              0.85
            }
            accessibilityRole="button"
            accessibilityLabel="Finish Sort My Worry activity"
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
            accessibilityLabel="Sort another worry"
          >

            <Ionicons
              name="refresh-outline"
              size={
                19
              }
              color={
                COLORS.primary
              }
            />


            <Text
              style={
                styles.againText
              }
            >
              Sort Another Worry
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

      overflow:
        "hidden",
    },


    /*
     * =====================================================
     * DECORATIVE BACKGROUND
     * =====================================================
     */

    blueShape: {
      position:
        "absolute",

      width:
        290,

      height:
        290,

      borderRadius:
        145,

      top:
        -175,

      right:
        -115,

      backgroundColor:
        COLORS.softBlueStrong,

      opacity:
        0.68,
    },


    greenShape: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      bottom:
        -90,

      left:
        -185,

      backgroundColor:
        COLORS.softGreen,

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
        62,

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
     * CONTENT
     * =====================================================
     */

    content: {
      flex: 1,

      paddingHorizontal:
        24,

      paddingTop:
        14,

      alignItems:
        "center",
    },


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
        COLORS.softGreen,
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


    textArea: {
      alignItems:
        "center",
    },


    smallLabel: {
      marginTop:
        26,

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

      maxWidth:
        330,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        29,

      lineHeight:
        35,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        10,

      maxWidth:
        320,

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
     * ACTION RESULT
     * =====================================================
     */

    actionCard: {
      width:
        "100%",

      marginTop:
        30,

      paddingHorizontal:
        18,

      paddingVertical:
        19,

      borderRadius:
        22,

      alignItems:
        "center",

      backgroundColor:
        COLORS.softGreen,
    },


    actionIcon: {
      width:
        47,

      height:
        47,

      borderRadius:
        24,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },


    actionLabel: {
      marginTop:
        11,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        10.5,

      letterSpacing:
        1,

      color:
        COLORS.greenDark,
    },


    actionText: {
      marginTop:
        8,

      maxWidth:
        285,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15.5,

      lineHeight:
        22,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    /*
     * =====================================================
     * LATER RESULT
     * =====================================================
     */

    laterCard: {
      width:
        "100%",

      marginTop:
        30,

      paddingHorizontal:
        18,

      paddingVertical:
        20,

      borderRadius:
        22,

      alignItems:
        "center",

      backgroundColor:
        COLORS.cream,
    },


    laterIcon: {
      width:
        50,

      height:
        50,

      borderRadius:
        25,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },


    laterTitle: {
      marginTop:
        10,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15,

      color:
        COLORS.creamDark,
    },


    laterText: {
      marginTop:
        7,

      maxWidth:
        280,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        19,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * REMINDER
     * =====================================================
     */

    reminderCard: {
      marginTop:
        22,

      paddingHorizontal:
        15,

      paddingVertical:
        11,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    reminderText: {
      marginLeft:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

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


    againButton: {
      height:
        48,

      marginTop:
        5,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    againText: {
      marginLeft:
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.primary,
    },
  });