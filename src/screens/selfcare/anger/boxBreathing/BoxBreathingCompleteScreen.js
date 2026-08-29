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
    "#F3FAF8",

  card:
    "#FFFFFF",

  primary:
    "#4F8FA8",

  primaryDark:
    "#356B7F",

  mint:
    "#CDECE3",

  mintSoft:
    "#E7F6F1",

  blue:
    "#88BBD6",

  blueSoft:
    "#E8F3F8",

  teal:
    "#5FA6A0",

  textPrimary:
    "#26373C",

  textSecondary:
    "#667A80",

  border:
    "#DCEBE8",

  white:
    "#FFFFFF",
};


const ACTIVITY_ID =
  "box-breathing";

const NORMAL_FINISH_ROUTE =
  "AngerActivities";


export default function BoxBreathingCompleteScreen({
  navigation,
}) {

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


  useEffect(() => {

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

  }, [
    scale,
    opacity,
  ]);



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


  
  const handleAgain =
    () => {

      navigation.replace(
        "BoxBreathingExercise"
      );
    };


  /*UI*/

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

        {/* background decoration */}

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


        {/*header*/}

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
            Box Breathing
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/*main content */}

        <View
          style={
            styles.content
          }
        >

          {/* Completion icon */}

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
                    COLORS.teal
                  }
                />

              </View>

            </View>

          </Animated.View>


          {/* Text */}

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
              BOX BREATHING COMPLETE
            </Text>


            <Text
              style={
                styles.title
              }
            >
              You gave yourself a
              moment to slow down
            </Text>


            <Text
              style={
                styles.description
              }
            >
              Take one natural breath
              and notice how you feel.
            </Text>

          </Animated.View>


          {/* Summary */}

          <View
            style={
              styles.summaryCard
            }
          >

            <View
              style={
                styles.summaryIcon
              }
            >
              <Ionicons
                name="square-outline"
                size={
                  27
                }
                color={
                  COLORS.primary
                }
              />
            </View>


            <View
              style={
                styles.summaryContent
              }
            >

              <Text
                style={
                  styles.summaryTitle
                }
              >
                5 breathing cycles
              </Text>


              <Text
                style={
                  styles.summaryText
                }
              >
                Inhale · Hold · Exhale
                · Hold
              </Text>

            </View>

          </View>


          {/* Gentle closing */}

          <View
            style={
              styles.gentleMessage
            }
          >

            <Ionicons
              name="heart-outline"
              size={
                18
              }
              color={
                COLORS.teal
              }
            />


            <Text
              style={
                styles.gentleMessageText
              }
            >
              Continue at your own pace.
            </Text>

          </View>

        </View>


        {/* bottom buttons */}

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
            accessibilityLabel="Finish Box Breathing activity"
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
              styles.againButton
            }
            onPress={
              handleAgain
            }
            activeOpacity={
              0.75
            }
            accessibilityRole="button"
            accessibilityLabel="Repeat Box Breathing"
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
                styles.againButtonText
              }
            >
              Breathe Again
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

      overflow:
        "hidden",
    },

    topShape: {
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
        "#DAEFF7",

      opacity:
        0.8,
    },


    bottomShape: {
      position:
        "absolute",

      width:
        285,

      height:
        285,

      borderRadius:
        143,

      bottom:
        -80,

      left:
        -175,

      backgroundColor:
        "#DDF3EC",

      opacity:
        0.8,
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
      flex: 1,

      paddingHorizontal:
        24,

      paddingTop:
        28,

      alignItems:
        "center",
    },



    iconOuter: {
      width:
        158,

      height:
        158,

      borderRadius:
        79,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.blueSoft,
    },


    iconMiddle: {
      width:
        122,

      height:
        122,

      borderRadius:
        61,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.mintSoft,
    },


    iconInner: {
      width:
        84,

      height:
        84,

      borderRadius:
        42,

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
          4,
      },

      shadowOpacity:
        0.06,

      shadowRadius:
        9,

      elevation:
        3,
    },


    /*text*/

    messageArea: {
      alignItems:
        "center",

      marginTop:
        29,
    },


    smallLabel: {
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
        10,

      maxWidth:
        340,

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


    /*SUMMARY*/

    summaryCard: {
      width:
        "100%",

      marginTop:
        35,

      paddingHorizontal:
        17,

      paddingVertical:
        17,

      borderRadius:
        23,

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


    summaryIcon: {
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
        COLORS.blueSoft,
    },


    summaryContent: {
      flex:
        1,

      marginLeft:
        14,
    },


    summaryTitle: {
      fontSize:
        14.5,

      fontWeight:
        "700",

      color:
        COLORS.textPrimary,
    },


    summaryText: {
      marginTop:
        5,

      fontSize:
        12.5,

      color:
        COLORS.textSecondary,
    },


    gentleMessage: {
      marginTop:
        24,

      paddingHorizontal:
        15,

      paddingVertical:
        10,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.mintSoft,
    },


    gentleMessageText: {
      marginLeft:
        7,

      fontSize:
        13,

      fontWeight:
        "600",

      color:
        COLORS.textSecondary,
    },



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
        0.17,

      shadowRadius:
        9,

      elevation:
        3,
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


    againButton: {
      height:
        50,

      marginTop:
        7,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    againButtonText: {
      marginLeft:
        7,

      fontSize:
        13.5,

      fontWeight:
        "700",

      color:
        COLORS.primary,
    },
  });