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
  background: "#F7F3EA",

  card: "#FFFFFF",

  sand: "#EAD8B9",
  sandLight: "#F7EEDC",

  sage: "#9EB99C",
  sageDark: "#668168",

  stone: "#A7A9A3",

  flower: "#F1CDC5",

  sky: "#DDEBF0",
  blue: "#789EAC",

  textPrimary: "#3D413D",
  textSecondary: "#747970",

  white: "#FFFFFF",
};


const ACTIVITY_ID =
  "zen-garden";


export default function ZenGardenCompleteScreen({
  navigation,
  route,
}) {

  const strokesCreated =
    route?.params
      ?.strokesCreated ||
    0;


  const objectsPlaced =
    route?.params
      ?.objectsPlaced ||
    0;


  const stoneY =
    useRef(
      new Animated.Value(0)
    ).current;


  const contentOpacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const contentY =
    useRef(
      new Animated.Value(22)
    ).current;


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * Header back button:
   * → SelfCare
   *
   * Android hardware back:
   * → SelfCare
   *
   * The Zen Garden screens are removed from the stack so
   * they cannot unexpectedly appear again afterwards.
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

  useEffect(() => {

    Animated.parallel([
      Animated.timing(
        contentOpacity,
        {
          toValue: 1,

          duration: 500,

          useNativeDriver:
            true,
        }
      ),

      Animated.spring(
        contentY,
        {
          toValue: 0,

          friction: 7,

          useNativeDriver:
            true,
        }
      ),
    ]).start();


    const stoneFloat =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            stoneY,
            {
              toValue: -5,

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
            stoneY,
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


    stoneFloat.start();


    return () => {
      stoneFloat.stop();
    };

  }, [
    stoneY,
    contentOpacity,
    contentY,
  ]);


  /*
   * =======================================================
   * FINISH GAME
   * =======================================================
   *
   * Chatbot recommendation:
   * → return to Chatbot.
   *
   * Normal Self Care:
   * → return to Mini Games.
   *
   * Existing chatbot-navigation behavior is preserved.
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
   * MAKE ANOTHER GARDEN
   * =======================================================
   *
   * This is intentionally different from Back.
   *
   * Normal flow:
   *
   * ZenGardenIntro
   * → ZenGardenGame
   * → ZenGardenComplete
   *
   * pop(2) returns to ZenGardenIntro.
   *
   * If for some reason the stack does not contain enough
   * screens, navigate directly to the intro as fallback.
   * =======================================================
   */

  const handleAgain =
    () => {

      if (
        navigation.canGoBack()
      ) {

        navigation.pop(2);

        return;
      }


      navigation.navigate(
        "ZenGardenIntro",
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
            Zen Garden
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        <View
          style={
            styles.hero
          }
        >

          <View
            style={
              styles.heroSandLineOne
            }
          />


          <View
            style={
              styles.heroSandLineTwo
            }
          />


          <View
            style={
              styles.heroSandLineThree
            }
          />


          <Animated.View
            style={[
              styles.heroStone,

              {
                transform: [
                  {
                    translateY:
                      stoneY,
                  },
                ],
              },
            ]}
          >

            <View
              style={
                styles.heroStoneHighlight
              }
            />

          </Animated.View>


          <View
            style={
              styles.heroLeaf
            }
          >

            <View
              style={
                styles.heroLeafLine
              }
            />

          </View>


          <View
            style={
              styles.completeBadge
            }
          >
            <Ionicons
              name="checkmark"
              size={
                21
              }
              color={
                COLORS.white
              }
            />
          </View>

        </View>


        <Animated.View
          style={[
            styles.content,

            {
              opacity:
                contentOpacity,

              transform: [
                {
                  translateY:
                    contentY,
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
            GARDEN COMPLETE
          </Text>


          <Text
            style={
              styles.title
            }
          >
            Leave it just as it is
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Your garden did not need
            to be perfect or finished.
          </Text>


          <View
            style={
              styles.summaryRow
            }
          >

            <View
              style={
                styles.summaryCard
              }
            >

              <View
                style={[
                  styles.summaryIcon,

                  {
                    backgroundColor:
                      COLORS.sandLight,
                  },
                ]}
              >
                <Ionicons
                  name="brush-outline"
                  size={
                    20
                  }
                  color="#A68A61"
                />
              </View>


              <Text
                style={
                  styles.summaryNumber
                }
              >
                {
                  strokesCreated
                }
              </Text>


              <Text
                style={
                  styles.summaryLabel
                }
              >
                sand paths
              </Text>

            </View>


            <View
              style={
                styles.summaryCard
              }
            >

              <View
                style={[
                  styles.summaryIcon,

                  {
                    backgroundColor:
                      "#E7EFE4",
                  },
                ]}
              >
                <Ionicons
                  name="leaf-outline"
                  size={
                    20
                  }
                  color={
                    COLORS.sageDark
                  }
                />
              </View>


              <Text
                style={
                  styles.summaryNumber
                }
              >
                {
                  objectsPlaced
                }
              </Text>


              <Text
                style={
                  styles.summaryLabel
                }
              >
                little pieces
              </Text>

            </View>

          </View>


          <View
            style={
              styles.noteCard
            }
          >

            <Ionicons
              name="leaf-outline"
              size={
                19
              }
              color={
                COLORS.sageDark
              }
            />


            <Text
              style={
                styles.noteText
              }
            >
              This space was simply
              yours for a little while.
            </Text>

          </View>

        </Animated.View>


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
            accessibilityLabel="Finish Zen Garden"
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
            accessibilityRole="button"
            accessibilityLabel="Make another Zen Garden"
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
              Make Another Garden
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


    hero: {
      height:
        310,

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
        COLORS.sand,
    },


    heroSandLineOne: {
      position:
        "absolute",

      width:
        260,

      height:
        3,

      top:
        96,

      left:
        35,

      borderRadius:
        3,

      backgroundColor:
        "rgba(151,126,88,0.27)",

      transform: [
        {
          rotate:
            "-4deg",
        },
      ],
    },


    heroSandLineTwo: {
      position:
        "absolute",

      width:
        245,

      height:
        3,

      top:
        118,

      left:
        45,

      borderRadius:
        3,

      backgroundColor:
        "rgba(151,126,88,0.23)",

      transform: [
        {
          rotate:
            "-4deg",
        },
      ],
    },


    heroSandLineThree: {
      position:
        "absolute",

      width:
        225,

      height:
        3,

      top:
        140,

      left:
        55,

      borderRadius:
        3,

      backgroundColor:
        "rgba(151,126,88,0.2)",

      transform: [
        {
          rotate:
            "-4deg",
        },
      ],
    },


    heroStone: {
      width:
        104,

      height:
        70,

      borderRadius:
        38,

      backgroundColor:
        COLORS.stone,

      shadowColor:
        "#73746F",

      shadowOffset: {
        width:
          0,

        height:
          5,
      },

      shadowOpacity:
        0.15,

      shadowRadius:
        7,

      elevation:
        3,
    },


    heroStoneHighlight: {
      width:
        38,

      height:
        14,

      marginLeft:
        17,

      marginTop:
        13,

      borderRadius:
        9,

      backgroundColor:
        "rgba(255,255,255,0.27)",
    },


    heroLeaf: {
      position:
        "absolute",

      width:
        58,

      height:
        32,

      borderTopLeftRadius:
        30,

      borderBottomRightRadius:
        30,

      right:
        62,

      bottom:
        55,

      backgroundColor:
        COLORS.sage,

      alignItems:
        "center",

      justifyContent:
        "center",

      transform: [
        {
          rotate:
            "13deg",
        },
      ],
    },


    heroLeafLine: {
      width:
        39,

      height:
        1.4,

      backgroundColor:
        COLORS.sageDark,

      transform: [
        {
          rotate:
            "-18deg",
        },
      ],
    },


    completeBadge: {
      position:
        "absolute",

      width:
        44,

      height:
        44,

      borderRadius:
        22,

      right:
        48,

      top:
        48,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.sageDark,
    },


    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        27,

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
        COLORS.sageDark,
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
      maxWidth:
        300,

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


    summaryRow: {
      width:
        "100%",

      marginTop:
        24,

      flexDirection:
        "row",

      gap:
        12,
    },


    summaryCard: {
      flex:
        1,

      minHeight:
        125,

      padding:
        14,

      borderRadius:
        23,

      backgroundColor:
        COLORS.white,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    summaryIcon: {
      width:
        43,

      height:
        43,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    summaryNumber: {
      marginTop:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        20,

      color:
        COLORS.textPrimary,
    },


    summaryLabel: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    noteCard: {
      width:
        "100%",

      marginTop:
        16,

      paddingHorizontal:
        15,

      paddingVertical:
        13,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#E8EFE5",
    },


    noteText: {
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
        COLORS.sageDark,
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