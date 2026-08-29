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
  background: "#F5F8FC",

  card: "#FFFFFF",

  primary: "#6D8FB8",

  primaryDark: "#506E95",

  lavender: "#8477B4",

  softBlue: "#E5F0F8",

  softBlueStrong: "#D8E8F4",

  softLavender: "#EEEAF8",

  softCream: "#FFF7E4",

  textPrimary: "#30343D",

  textSecondary: "#737985",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * OPTIONS
 * =========================================================
 */

const FEELING_OPTIONS = [
  {
    id: "softer",

    label:
      "A little softer",

    icon:
      "sparkles-outline",
  },

  {
    id: "same",

    label:
      "About the same",

    icon:
      "remove-circle-outline",
  },

  {
    id: "tense",

    label:
      "Still tense",

    icon:
      "cloud-outline",
  },
];


/*
 * =========================================================
 * ACTIVITY
 * =========================================================
 */

const ACTIVITY_ID =
  "calm-my-body";

const NORMAL_FINISH_ROUTE =
  "AnxietyActivities";


/*
 * =========================================================
 * COMPLETE SCREEN
 * =========================================================
 */

export default function CalmMyBodyCompleteScreen({
  navigation,
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
   * ENTRY ANIMATION
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


  useEffect(
    () => {

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
   * This is the standard behavior we want across every
   * self-care activity Complete screen.
   *
   * Header back:
   * → SelfCare
   *
   * Android physical back:
   * → SelfCare
   *
   * navigation.reset removes the completed activity flow
   * from the Home stack so Android Back cannot reopen it.
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

          subscription
            .remove();
        };

      },
      [
        handleBackToSelfCare,
      ]
    )
  );


  /*
   * =======================================================
   * REFLECTION MESSAGE
   * =======================================================
   */

  const getReflection =
    () => {

      if (
        selectedFeeling ===
        "softer"
      ) {

        return "Notice that small change and let yourself enjoy the pause.";
      }


      if (
        selectedFeeling ===
        "same"
      ) {

        return "That's okay. Giving your body a pause still matters.";
      }


      if (
        selectedFeeling ===
        "tense"
      ) {

        return "That's okay too. You don't need to force relaxation.";
      }


      return null;
    };


  /*
   * =======================================================
   * FINISH
   * =======================================================
   *
   * Chatbot-started:
   * → returns to the same Chatbot conversation.
   *
   * Normal Self Care flow:
   * → returns to AnxietyActivities.
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
   * REPEAT ACTIVITY
   * =======================================================
   *
   * Relax Again is NOT treated as Back.
   *
   * It intentionally starts the exercise again.
   *
   * Chatbot origin is not cleared, so if the activity was
   * originally started from Chatbot, completing the repeated
   * activity can still return to the same conversation.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "CalmMyBodyExercise"
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
            BACKGROUND
           ================================================= */}

        <View
          style={
            styles.blueShape
          }
        />


        <View
          style={
            styles.lavenderShape
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
            Calm My Body
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
                  name="sparkles"
                  size={
                    38
                  }
                  color={
                    COLORS.primary
                  }
                />
              </View>
            </View>
          </Animated.View>


          {/* =================================================
              MESSAGE
             ================================================= */}

          <Animated.View
            style={{
              opacity,

              alignItems:
                "center",
            }}
          >
            <Text
              style={
                styles.smallLabel
              }
            >
              CALM MY BODY
            </Text>


            <Text
              style={
                styles.title
              }
            >
              Nice work.
            </Text>


            <Text
              style={
                styles.description
              }
            >
              You gave your body a
              chance to release some
              tension.
            </Text>
          </Animated.View>


          {/* =================================================
              REFLECTION
             ================================================= */}

          <Text
            style={
              styles.reflectionTitle
            }
          >
            How does your body feel?
          </Text>


          <Text
            style={
              styles.reflectionSubtitle
            }
          >
            Just notice.
          </Text>


          <View
            style={
              styles.optionsRow
            }
          >
            {FEELING_OPTIONS.map(
              (
                item
              ) => {

                const selected =
                  selectedFeeling ===
                  item.id;


                return (
                  <TouchableOpacity
                    key={
                      item.id
                    }
                    style={[
                      styles.feelingCard,

                      selected &&
                        styles.selectedFeeling,
                    ]}
                    onPress={
                      () =>
                        setSelectedFeeling(
                          item.id
                        )
                    }
                    activeOpacity={
                      0.8
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      item.label
                    }
                    accessibilityState={{
                      selected,
                    }}
                  >
                    <Ionicons
                      name={
                        item.icon
                      }
                      size={
                        21
                      }
                      color={
                        selected
                          ? COLORS.white
                          : COLORS.primary
                      }
                    />


                    <Text
                      style={[
                        styles.feelingText,

                        selected &&
                          styles.selectedFeelingText,
                      ]}
                    >
                      {
                        item.label
                      }
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>


          {/* =================================================
              REFLECTION RESULT
             ================================================= */}

          {selectedFeeling && (
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
                  COLORS.lavender
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


          {/* =================================================
              GENTLE REMINDER
             ================================================= */}

          <View
            style={
              styles.reminderCard
            }
          >
            <Ionicons
              name="leaf-outline"
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
              Relaxation does not need
              to happen perfectly.
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
            accessibilityLabel="Finish Calm My Body activity"
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
              styles.repeatButton
            }
            onPress={
              handleAgain
            }
            activeOpacity={
              0.75
            }
            accessibilityRole="button"
            accessibilityLabel="Relax again"
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
                styles.repeatText
              }
            >
              Relax Again
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
     * BACKGROUND
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
        -170,

      right:
        -115,

      backgroundColor:
        COLORS.softBlueStrong,

      opacity:
        0.7,
    },


    lavenderShape: {
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
        -180,

      backgroundColor:
        COLORS.softLavender,

      opacity:
        0.72,
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
     * COMPLETION ICON
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
        COLORS.softLavender,
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
     * TEXT
     * =====================================================
     */

    smallLabel: {
      marginTop:
        25,

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
        310,

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
     * REFLECTION
     * =====================================================
     */

    reflectionTitle: {
      marginTop:
        32,

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


    optionsRow: {
      width:
        "100%",

      marginTop:
        17,

      flexDirection:
        "row",

      justifyContent:
        "space-between",
    },


    feelingCard: {
      width:
        "31.5%",

      minHeight:
        80,

      paddingHorizontal:
        7,

      paddingVertical:
        10,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,

      borderWidth:
        1,

      borderColor:
        "transparent",
    },


    selectedFeeling: {
      backgroundColor:
        COLORS.primary,

      borderColor:
        COLORS.primary,
    },


    feelingText: {
      marginTop:
        7,

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


    selectedFeelingText: {
      fontFamily:
        "JosefinSans_700Bold",

      color:
        COLORS.white,
    },


    reflectionCard: {
      width:
        "100%",

      marginTop:
        17,

      paddingHorizontal:
        14,

      paddingVertical:
        12,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softLavender,
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
     * REMINDER
     * =====================================================
     */

    reminderCard: {
      marginTop:
        17,

      paddingHorizontal:
        14,

      paddingVertical:
        10,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softCream,
    },


    reminderText: {
      flex:
        1,

      marginLeft:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      lineHeight:
        17,

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


    repeatButton: {
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


    repeatText: {
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