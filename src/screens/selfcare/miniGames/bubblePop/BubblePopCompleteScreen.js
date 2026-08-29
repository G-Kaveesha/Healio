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


const COLORS = {
  background: "#EEF6FA",

  blue: "#78AFC4",
  deepBlue: "#527F96",

  aqua: "#73D9D0",
  teal: "#55B5A8",

  lavender: "#B8A9ED",

  yellow: "#FFF0A8",

  textPrimary: "#30404A",
  textSecondary: "#70818A",

  white: "#FFFFFF",
};


const ACTIVITY_ID =
  "bubble-pop-calm";


export default function BubblePopCompleteScreen({
  navigation,
  route,
}) {

  const pops =
    route?.params
      ?.pops || 0;


  const bubbleY =
    useRef(
      new Animated.Value(0)
    ).current;


  const bubbleScale =
    useRef(
      new Animated.Value(0.85)
    ).current;


  /*
   * =======================================================
   * BACK → MAIN SELF CARE
   * =======================================================
   *
   * All normal back actions from a completed
   * activity should exit the activity flow
   * and return to the main Self Care screen.
   *
   * navigation.reset removes the Bubble Pop
   * activity screens from the stack so that
   * the user cannot accidentally return to
   * them afterwards using Android Back.
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
   * ANDROID HARDWARE BACK
   * =======================================================
   *
   * Physical Back behaves exactly like
   * the visible header back button.
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
   * ANIMATION
   * =======================================================
   */

  useEffect(() => {

    Animated.spring(
      bubbleScale,
      {
        toValue: 1,

        friction: 6,

        tension: 45,

        useNativeDriver:
          true,
      }
    ).start();


    const floating =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            bubbleY,
            {
              toValue: -7,

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
            bubbleY,
            {
              toValue: 0,

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


    floating.start();


    return () => {
      floating.stop();
    };
  }, [
    bubbleScale,
    bubbleY,
  ]);


  /*
   * =======================================================
   * FINISH GAME
   * =======================================================
   *
   * Existing behavior is preserved.
   *
   * If Bubble Pop was started from Chatbot:
   * → return to Chatbot.
   *
   * Otherwise:
   * → return to Mini Games.
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
   * PLAY AGAIN
   * =======================================================
   *
   * "Pop Again" is different from Back.
   *
   * It deliberately starts Bubble Pop again
   * from its Intro screen.
   *
   * This avoids using pop(2), because pop()
   * depends on exactly how the activity was
   * opened and can behave incorrectly when
   * Bubble Pop came from Home, Chatbot,
   * recommendations, or another route.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "BubblePopIntro",
        {
          activityId:
            ACTIVITY_ID,

          category:
            "miniGames",
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
            Bubble Pop Calm
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
              styles.yellowGlow
            }
          />


          <View
            style={
              styles.lavenderGlow
            }
          />


          <Animated.View
            style={{
              transform: [
                {
                  translateY:
                    bubbleY,
                },

                {
                  scale:
                    bubbleScale,
                },
              ],
            }}
          >
            <View
              style={
                styles.completeBubble
              }
            >
              <Ionicons
                name="checkmark"
                size={
                  38
                }
                color={
                  COLORS.deepBlue
                }
              />
            </View>
          </Animated.View>


          <View
            style={
              styles.sparkleOne
            }
          >
            <Ionicons
              name="sparkles"
              size={
                24
              }
              color={
                COLORS.aqua
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
                17
              }
              color={
                COLORS.lavender
              }
            />
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
            ALL DONE
          </Text>


          <Text
            style={
              styles.title
            }
          >
            A little moment of play
          </Text>


          <Text
            style={
              styles.description
            }
          >
            You can leave it here and
            return whenever you want.
          </Text>


          <View
            style={
              styles.popSummary
            }
          >

            <Ionicons
              name="water-outline"
              size={
                21
              }
              color={
                COLORS.deepBlue
              }
            />


            <Text
              style={
                styles.popSummaryNumber
              }
            >
              {
                pops
              }
            </Text>


            <Text
              style={
                styles.popSummaryText
              }
            >
              {
                pops === 1
                  ? "little pop"
                  : "little pops"
              }
            </Text>

          </View>


          <View
            style={
              styles.note
            }
          >

            <Ionicons
              name="leaf-outline"
              size={
                18
              }
              color={
                COLORS.teal
              }
            />


            <Text
              style={
                styles.noteText
              }
            >
              No target was needed.
              You stopped when it felt
              right.
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
          >
            <Text
              style={
                styles.finishText
              }
            >
              Finish Game
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
              0.8
            }
          >
            <Ionicons
              name="refresh-outline"
              size={
                18
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
              Pop Again
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
      flex: 1,

      backgroundColor:
        COLORS.background,
    },


    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },


    header: {
      height: 62,

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
      width: 42,

      height: 42,

      borderRadius:
        21,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.8)",
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


    hero: {
      height:
        330,

      marginHorizontal:
        20,

      marginTop:
        10,

      borderRadius:
        38,

      overflow:
        "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#DCEEF5",
    },


    yellowGlow: {
      position:
        "absolute",

      width:
        215,

      height:
        215,

      borderRadius:
        108,

      left:
        -80,

      top:
        -60,

      backgroundColor:
        COLORS.yellow,

      opacity:
        0.23,
    },


    lavenderGlow: {
      position:
        "absolute",

      width:
        230,

      height:
        230,

      borderRadius:
        115,

      right:
        -90,

      bottom:
        -80,

      backgroundColor:
        COLORS.lavender,

      opacity:
        0.22,
    },


    completeBubble: {
      width:
        155,

      height:
        155,

      borderRadius:
        78,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.68)",

      borderWidth:
        3,

      borderColor:
        "rgba(255,255,255,0.94)",

      shadowColor:
        COLORS.deepBlue,

      shadowOffset: {
        width: 0,

        height: 6,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        10,

      elevation:
        4,
    },


    sparkleOne: {
      position:
        "absolute",

      top:
        65,

      right:
        65,
    },


    sparkleTwo: {
      position:
        "absolute",

      left:
        61,

      bottom:
        67,
    },


    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        28,

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
        COLORS.blue,
    },


    title: {
      marginTop:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        28,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      maxWidth:
        310,

      marginTop:
        7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13.5,

      lineHeight:
        19,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    popSummary: {
      marginTop:
        25,

      minWidth:
        165,

      paddingHorizontal:
        18,

      paddingVertical:
        13,

      borderRadius:
        22,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },


    popSummaryNumber: {
      marginLeft:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        20,

      color:
        COLORS.textPrimary,
    },


    popSummaryText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      color:
        COLORS.textSecondary,
    },


    note: {
      width:
        "100%",

      marginTop:
        20,

      paddingHorizontal:
        15,

      paddingVertical:
        12,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.6)",
    },


    noteText: {
      flex:
        1,

      marginLeft:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      lineHeight:
        17,

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
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.deepBlue,
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