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


const COLORS = {
  background:
    "#F3F9F7",

  card:
    "#FFFFFF",

  primary:
    "#4E8894",

  primaryDark:
    "#366B75",

  softTeal:
    "#DFF1EC",

  softTealStrong:
    "#CBE8E0",

  softBlue:
    "#E4F1F7",

  softBlueStrong:
    "#CFE5F0",

  textPrimary:
    "#25363A",

  textSecondary:
    "#6F7E81",

  border:
    "#D9E9E5",

  white:
    "#FFFFFF",
};


const ACTIVITY_ID =
  "grounding";


const NORMAL_FINISH_ROUTE =
  "AngerActivities";


const SENSES = [
  {
    label:
      "See",

    icon:
      "eye-outline",
  },

  {
    label:
      "Feel",

    icon:
      "hand-left-outline",
  },

  {
    label:
      "Hear",

    icon:
      "volume-medium-outline",
  },

  {
    label:
      "Smell",

    icon:
      "flower-outline",
  },

  {
    label:
      "Taste",

    icon:
      "water-outline",
  },
];


export default function GroundingCompleteScreen({
  navigation,
}) {

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
   * Header back and Android physical back
   * both leave the activity completely.
   *
   * This clears the old grounding screens
   * from the navigation stack.
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
   * Chatbot-started activity:
   * → return to Chatbot.
   *
   * Normal activity:
   * → return to AngerActivities.
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
   * REPEAT
   * =======================================================
   *
   * This is intentionally different from Back.
   * The user wants to repeat the grounding
   * exercise, so we reopen the activity flow.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "GroundingChat",
        {
          activityId:
            ACTIVITY_ID,

          category:
            "anger",
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

        <View
          style={
            styles.topShape
          }
        />


        <View
          style={
            styles.bottomShape
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
            Grounding
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

          {/* =================================================
              COMPLETION GRAPHIC
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
                    44
                  }
                  color={
                    COLORS.primary
                  }
                />

              </View>

            </View>

          </Animated.View>


          {/* =================================================
              COMPLETION TEXT
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
              GROUNDING COMPLETE
            </Text>


            <Text
              style={
                styles.title
              }
            >
              You're here.
            </Text>


            <Text
              style={
                styles.description
              }
            >
              You brought your attention
              back to the present moment.
            </Text>

          </Animated.View>


          {/* =================================================
              SENSES
             ================================================= */}

          <View
            style={
              styles.sensesCard
            }
          >

            <Text
              style={
                styles.cardTitle
              }
            >
              5-4-3-2-1 complete
            </Text>


            <View
              style={
                styles.sensesRow
              }
            >

              {SENSES.map(
                (
                  sense,
                  index
                ) => (

                  <View
                    key={
                      sense.label
                    }
                    style={
                      styles.senseItem
                    }
                  >

                    <View
                      style={[
                        styles.senseCircle,

                        index %
                          2 ===
                        0
                          ? styles.tealCircle
                          : styles.blueCircle,
                      ]}
                    >

                      <Ionicons
                        name={
                          sense.icon
                        }
                        size={
                          18
                        }
                        color={
                          COLORS.primaryDark
                        }
                      />

                    </View>


                    <Text
                      style={
                        styles.senseLabel
                      }
                    >
                      {
                        sense.label
                      }
                    </Text>


                    <Ionicons
                      name="checkmark-circle"
                      size={
                        14
                      }
                      color={
                        COLORS.primary
                      }
                      style={
                        styles.checkIcon
                      }
                    />

                  </View>
                )
              )}

            </View>

          </View>


          {/* =================================================
              FINAL BREATH
             ================================================= */}

          <View
            style={
              styles.breathCard
            }
          >

            <View
              style={
                styles.breathIcon
              }
            >

              <Ionicons
                name="cloud-outline"
                size={
                  21
                }
                color={
                  COLORS.primary
                }
              />

            </View>


            <Text
              style={
                styles.breathText
              }
            >
              Take one comfortable breath
              before continuing.
            </Text>

          </View>


          {/* =================================================
              GENTLE NOTE
             ================================================= */}

          <View
            style={
              styles.note
            }
          >

            <Ionicons
              name="heart-outline"
              size={
                18
              }
              color={
                COLORS.primary
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
            accessibilityLabel="Finish grounding activity"
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
            accessibilityLabel="Repeat grounding activity"
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
              Ground Again
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


    topShape: {
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
        "#DDEFF3",

      opacity:
        0.75,
    },


    bottomShape: {
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
        -175,

      backgroundColor:
        "#DDF1EB",

      opacity:
        0.75,
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
        5,
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
        "rgba(255,255,255,0.80)",
    },


    headerTitle: {
      fontSize:
        17,

      fontWeight:
        "700",

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

      alignItems:
        "center",

      paddingHorizontal:
        24,

      paddingTop:
        7,
    },


    /*
     * =====================================================
     * COMPLETION GRAPHIC
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
        COLORS.softTeal,
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

      shadowColor:
        "#000",

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.06,

      shadowRadius:
        9,

      elevation:
        3,
    },


    /*
     * =====================================================
     * MAIN MESSAGE
     * =====================================================
     */

    messageArea: {
      alignItems:
        "center",
    },


    smallLabel: {
      marginTop:
        27,

      fontSize:
        11,

      fontWeight:
        "800",

      letterSpacing:
        1.5,

      color:
        COLORS.primary,
    },


    title: {
      marginTop:
        8,

      fontSize:
        31,

      fontWeight:
        "800",

      color:
        COLORS.textPrimary,

      textAlign:
        "center",
    },


    description: {
      marginTop:
        11,

      maxWidth:
        315,

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
     * SENSES
     * =====================================================
     */

    sensesCard: {
      width:
        "100%",

      marginTop:
        32,

      paddingHorizontal:
        15,

      paddingTop:
        17,

      paddingBottom:
        18,

      borderRadius:
        22,

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    cardTitle: {
      marginBottom:
        16,

      fontSize:
        13,

      fontWeight:
        "700",

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    sensesRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",
    },


    senseItem: {
      width:
        "19%",

      alignItems:
        "center",
    },


    senseCircle: {
      width:
        39,

      height:
        39,

      borderRadius:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    tealCircle: {
      backgroundColor:
        COLORS.softTeal,
    },


    blueCircle: {
      backgroundColor:
        COLORS.softBlue,
    },


    senseLabel: {
      marginTop:
        6,

      fontSize:
        9.5,

      fontWeight:
        "650",

      color:
        COLORS.textSecondary,
    },


    checkIcon: {
      marginTop:
        3,
    },


    /*
     * =====================================================
     * BREATH
     * =====================================================
     */

    breathCard: {
      width:
        "100%",

      marginTop:
        20,

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
        COLORS.softTeal,
    },


    breathIcon: {
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

      backgroundColor:
        COLORS.card,
    },


    breathText: {
      flex:
        1,

      marginLeft:
        11,

      fontSize:
        13,

      lineHeight:
        19,

      color:
        COLORS.textSecondary,
    },


    note: {
      marginTop:
        21,

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    noteText: {
      marginLeft:
        7,

      fontSize:
        13,

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

      paddingBottom:
        18,
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
          5,
      },

      shadowOpacity:
        0.18,

      shadowRadius:
        9,

      elevation:
        4,
    },


    finishText: {
      marginRight:
        8,

      fontSize:
        16,

      fontWeight:
        "700",

      color:
        COLORS.white,
    },


    againButton: {
      height:
        48,

      marginTop:
        7,

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

      fontSize:
        13.5,

      fontWeight:
        "650",

      color:
        COLORS.primary,
    },
  });