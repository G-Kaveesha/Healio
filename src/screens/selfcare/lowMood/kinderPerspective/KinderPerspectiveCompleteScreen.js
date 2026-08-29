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

import * as Speech
  from "expo-speech";

import {
  finishChatbotStartedActivity,
} from "../../../../services/chatbotActivityNavigation";


const COLORS = {
  background:
    "#F8F7FC",

  card:
    "#FFFFFF",

  primary:
    "#8676B5",

  primaryDark:
    "#66558F",

  softLavender:
    "#EEEAF8",

  softLavenderStrong:
    "#DED6F1",

  softBlue:
    "#E8F2F8",

  blue:
    "#79A7C4",

  softYellow:
    "#FFF5CF",

  yellow:
    "#D6AA3B",

  textPrimary:
    "#30303C",

  textSecondary:
    "#777685",

  border:
    "#E6E1ED",

  white:
    "#FFFFFF",
};


const ACTIVITY_ID =
  "kinder-perspective";

const ACTIVITY_CATEGORY =
  "lowMood";

const NORMAL_FINISH_ROUTE =
  "LowMoodActivities";


export default function KinderPerspectiveCompleteScreen({
  navigation,
  route,
}) {

  const kinderThought =
    route?.params
      ?.kinderThought ||
    "";


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
   * ENTRY ANIMATION + SPEECH CLEANUP
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


    return () => {

      Speech.stop();

    };

  }, [
    scale,
    opacity,
  ]);


  /*
   * =======================================================
   * STOP SPEECH
   * =======================================================
   */

  const stopSpeech =
    useCallback(
      async () => {

        try {

          await Speech.stop();

        } catch (
          error
        ) {

          console.log(
            "Speech stop error:",
            error
          );
        }
      },
      []
    );


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * IMPORTANT:
   *
   * This is the final navigation rule for activity
   * Complete screens.
   *
   * Header back:
   * → SelfCare
   *
   * Android physical back:
   * → SelfCare
   *
   * We reset the Home stack so older activity screens
   * do not remain underneath SelfCare.
   *
   * Result:
   *
   * HomeMain
   *   ↓
   * SelfCare
   *
   * The user cannot accidentally reopen the completed
   * activity by pressing Android Back afterwards.
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      async () => {

        await stopSpeech();


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
        stopSpeech,
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
              () => {

                handleBackToSelfCare();

                return true;
              }
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
   * READ KINDER PERSPECTIVE ALOUD
   * =======================================================
   */

  const speakKinderThought =
    async () => {

      if (
        !kinderThought
      ) {

        return;
      }


      try {

        await Speech.stop();


        Speech.speak(
          kinderThought,
          {
            language:
              "en-US",

            rate:
              0.82,

            pitch:
              1.0,
          }
        );

      } catch (
        error
      ) {

        console.log(
          "Kinder thought voice error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * FINISH ACTIVITY
   * =======================================================
   *
   * Chatbot-started activity:
   * → returns to the existing Chatbot conversation.
   *
   * Normally opened activity:
   * → returns to LowMoodActivities.
   *
   * This existing behavior is intentionally preserved.
   * =======================================================
   */

  const handleFinish =
    async () => {

      await stopSpeech();


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
   * REFLECT AGAIN
   * =======================================================
   *
   * This is NOT treated as a Back action.
   *
   * It deliberately restarts the reflection stage.
   *
   * Chatbot origin is intentionally preserved so that
   * if Chatbot launched the original activity, finishing
   * after repeating can still return to that conversation.
   * =======================================================
   */

  const handleAgain =
    async () => {

      await stopSpeech();


      navigation.navigate(
        "KinderPerspectiveChat",
        {
          activityId:
            route?.params
              ?.activityId ||
            ACTIVITY_ID,

          category:
            route?.params
              ?.category ||
            ACTIVITY_CATEGORY,

          source:
            route?.params
              ?.source,
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

        {/* Decorative shapes */}

        <View
          style={
            styles.lavenderShape
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
            A Kinder Perspective
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        <View
          style={
            styles.content
          }
        >

          {/* Completion graphic */}

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
                  name="heart"
                  size={
                    41
                  }
                  color={
                    COLORS.primary
                  }
                />
              </View>
            </View>
          </Animated.View>


          {/* Heading */}

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
              KINDER PERSPECTIVE
            </Text>


            <Text
              style={
                styles.title
              }
            >
              Keep this with you.
            </Text>


            <Text
              style={
                styles.description
              }
            >
              You gave yourself another
              way to look at a difficult
              thought.
            </Text>
          </Animated.View>


          {/* Kinder thought */}

          {kinderThought ? (

            <View
              style={
                styles.thoughtCard
              }
            >
              <View
                style={
                  styles.quoteIcon
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


              <Text
                style={
                  styles.thoughtLabel
                }
              >
                Your kinder thought
              </Text>


              <Text
                style={
                  styles.thoughtText
                }
              >
                “{kinderThought}”
              </Text>


              <TouchableOpacity
                style={
                  styles.listenButton
                }
                onPress={
                  speakKinderThought
                }
                activeOpacity={
                  0.75
                }
                accessibilityRole="button"
                accessibilityLabel="Listen to your kinder thought"
              >
                <Ionicons
                  name="volume-medium-outline"
                  size={
                    18
                  }
                  color={
                    COLORS.primary
                  }
                />


                <Text
                  style={
                    styles.listenText
                  }
                >
                  Listen
                </Text>
              </TouchableOpacity>
            </View>

          ) : (

            <View
              style={
                styles.noThoughtCard
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
                  styles.noThoughtText
                }
              >
                You gave yourself some
                space to reflect. That's
                enough for now.
              </Text>
            </View>
          )}


          {/* Reminder */}

          <View
            style={
              styles.reminderCard
            }
          >
            <View
              style={
                styles.reminderIcon
              }
            >
              <Ionicons
                name="sparkles-outline"
                size={
                  20
                }
                color={
                  COLORS.yellow
                }
              />
            </View>


            <View
              style={
                styles.reminderTextArea
              }
            >
              <Text
                style={
                  styles.reminderTitle
                }
              >
                Remember
              </Text>


              <Text
                style={
                  styles.reminderText
                }
              >
                A difficult thought can
                still be present while you
                choose to respond to
                yourself more gently.
              </Text>
            </View>
          </View>


          <View
            style={
              styles.note
            }
          >
            <Ionicons
              name="heart-outline"
              size={
                17
              }
              color={
                COLORS.blue
              }
            />


            <Text
              style={
                styles.noteText
              }
            >
              Continue at your own pace.
            </Text>
          </View>

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
                22
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
            accessibilityLabel="Reflect again"
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
              Reflect Again
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}


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


    lavenderShape: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      top:
        -165,

      right:
        -110,

      backgroundColor:
        COLORS.softLavenderStrong,

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
        16,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    headerSpacer: {
      width:
        42,
    },


    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        10,

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


    messageArea: {
      alignItems:
        "center",
    },


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
        29,

      textAlign:
        "center",

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


    thoughtCard: {
      width:
        "100%",

      marginTop:
        27,

      paddingHorizontal:
        18,

      paddingVertical:
        18,

      borderRadius:
        22,

      alignItems:
        "center",

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    quoteIcon: {
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
        COLORS.softLavender,
    },


    thoughtLabel: {
      marginTop:
        11,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      color:
        COLORS.textSecondary,
    },


    thoughtText: {
      marginTop:
        9,

      paddingHorizontal:
        5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15,

      lineHeight:
        22,

      textAlign:
        "center",

      color:
        COLORS.primaryDark,
    },


    listenButton: {
      marginTop:
        15,

      paddingHorizontal:
        15,

      paddingVertical:
        8,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    listenText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        12,

      color:
        COLORS.primary,
    },


    noThoughtCard: {
      width:
        "100%",

      marginTop:
        27,

      paddingHorizontal:
        16,

      paddingVertical:
        14,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softLavender,
    },


    noThoughtText: {
      flex:
        1,

      marginLeft:
        9,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        19,

      color:
        COLORS.textSecondary,
    },


    reminderCard: {
      width:
        "100%",

      marginTop:
        19,

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


    reminderIcon: {
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
        COLORS.white,
    },


    reminderTextArea: {
      flex:
        1,

      marginLeft:
        11,
    },


    reminderTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13.5,

      color:
        COLORS.textPrimary,
    },


    reminderText: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      lineHeight:
        17,

      color:
        COLORS.textSecondary,
    },


    note: {
      marginTop:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    noteText: {
      marginLeft:
        7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      color:
        COLORS.textSecondary,
    },


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
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.primary,
    },
  });