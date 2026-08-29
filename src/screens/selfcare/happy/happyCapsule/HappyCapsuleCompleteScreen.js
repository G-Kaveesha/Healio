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
  background: "#FFF9F1",

  card: "#FFFFFF",

  yellow: "#FFE7A3",
  yellowDark: "#B9832B",

  peach: "#F7C6A3",

  coral: "#F09278",
  coralDark: "#C96B56",

  softBlue: "#E3F2F7",
  blue: "#73AAC1",

  softPink: "#FCE7E4",

  textPrimary: "#3D3934",
  textSecondary: "#7A746C",

  white: "#FFFFFF",
};


const ACTIVITY_ID =
  "happy-capsule";

const NORMAL_FINISH_ROUTE =
  "HappyActivities";


export default function HappyCapsuleCompleteScreen({
  navigation,
  route,
}) {

  const capsuleMemory =
    route?.params
      ?.capsuleMemory ||
    "";


  const capsuleFeeling =
    route?.params
      ?.capsuleFeeling ||
    "happy";


  const contentOpacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const contentY =
    useRef(
      new Animated.Value(24)
    ).current;


  const capsuleScale =
    useRef(
      new Animated.Value(0.86)
    ).current;


  const sparkleScale =
    useRef(
      new Animated.Value(0.8)
    ).current;


  const floatY =
    useRef(
      new Animated.Value(0)
    ).current;


  useEffect(() => {

    Animated.parallel([
      Animated.timing(
        contentOpacity,
        {
          toValue: 1,

          duration: 550,

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

      Animated.spring(
        capsuleScale,
        {
          toValue: 1,

          friction: 6,

          tension: 45,

          useNativeDriver:
            true,
        }
      ),

      Animated.spring(
        sparkleScale,
        {
          toValue: 1,

          friction: 5,

          useNativeDriver:
            true,
        }
      ),
    ]).start();


    const floating =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            floatY,
            {
              toValue: -6,

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
            floatY,
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
    contentOpacity,
    contentY,
    capsuleScale,
    sparkleScale,
    floatY,
  ]);


  /*
   * Header back button and Android
   * physical back button always return
   * to the MAIN SelfCare screen.
   *
   * Resetting prevents completed activity
   * screens from remaining underneath
   * SelfCare in the navigation stack.
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
   * Android physical back follows
   * exactly the same rule.
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
   * Finish remains separate from Back.
   *
   * If Chatbot started the activity,
   * your existing helper can return
   * the user to Chatbot.
   *
   * Otherwise it returns to the Happy
   * activity category as before.
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
   * "Create Another Capsule" is not a
   * normal back action.
   *
   * It deliberately restarts the same
   * activity from its introduction.
   *
   * Current stack:
   *
   * Intro
   * Create
   * Seal
   * Complete
   *
   * pop(3) therefore returns to Intro.
   */

  const handleCreateAnother =
    () => {

      if (
        navigation.canGoBack()
      ) {

        navigation.pop(3);

        return;
      }


      navigation.navigate(
        "HappyCapsuleIntro",
        {
          activityId:
            ACTIVITY_ID,

          category:
            "happy",
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
            My Happy Capsule
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


          <Animated.View
            style={[
              styles.sparkleLeft,

              {
                transform: [
                  {
                    scale:
                      sparkleScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={
                25
              }
              color={
                COLORS.yellowDark
              }
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.sparkleRight,

              {
                transform: [
                  {
                    scale:
                      sparkleScale,
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={
                18
              }
              color={
                COLORS.blue
              }
            />
          </Animated.View>


          <Animated.View
            style={[
              styles.completeCapsule,

              {
                transform: [
                  {
                    translateY:
                      floatY,
                  },

                  {
                    scale:
                      capsuleScale,
                  },
                ],
              },
            ]}
          >

            <View
              style={
                styles.capsuleLid
              }
            />


            <View
              style={
                styles.capsuleBody
              }
            >

              <Ionicons
                name="heart"
                size={
                  34
                }
                color={
                  COLORS.coral
                }
              />


              <View
                style={
                  styles.lockBadge
                }
              >
                <Ionicons
                  name="checkmark"
                  size={
                    13
                  }
                  color={
                    COLORS.white
                  }
                />
              </View>

            </View>

          </Animated.View>


          <View
            style={
              styles.savedBadge
            }
          >
            <Ionicons
              name="checkmark-circle"
              size={
                18
              }
              color={
                COLORS.coralDark
              }
            />


            <Text
              style={
                styles.savedBadgeText
              }
            >
              Capsule sealed
            </Text>
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
            SAVED FOR LATER
          </Text>


          <Text
            style={
              styles.title
            }
          >
            Good moments deserve
            somewhere to stay
          </Text>


          <Text
            style={
              styles.description
            }
          >
            You gave this memory a
            little place of its own.
          </Text>


          <View
            style={
              styles.memoryPreview
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
                  20
                }
                color={
                  COLORS.coralDark
                }
              />
            </View>


            <View
              style={
                styles.memoryPreviewTextArea
              }
            >

              <Text
                style={
                  styles.memoryPreviewLabel
                }
              >
                {
                  capsuleFeeling
                }
              </Text>


              <Text
                style={
                  styles.memoryPreviewText
                }
                numberOfLines={
                  3
                }
              >
                {
                  capsuleMemory
                }
              </Text>

            </View>

          </View>


          <View
            style={
              styles.gentleNote
            }
          >

            <Ionicons
              name="sunny-outline"
              size={
                18
              }
              color={
                COLORS.yellowDark
              }
            />


            <Text
              style={
                styles.gentleNoteText
              }
            >
              Carry the feeling. You
              don't need to hold onto
              every detail.
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
              handleCreateAnother
            }
            activeOpacity={
              0.75
            }
          >

            <Ionicons
              name="add-circle-outline"
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
              Create Another Capsule
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


    hero: {
      height:
        285,

      marginHorizontal:
        20,

      marginTop:
        9,

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
        200,

      height:
        200,

      borderRadius:
        100,

      left:
        -50,

      top:
        -65,

      backgroundColor:
        COLORS.yellow,
    },


    peachBlob: {
      position:
        "absolute",

      width:
        195,

      height:
        195,

      borderRadius:
        98,

      right:
        -50,

      bottom:
        -67,

      backgroundColor:
        COLORS.peach,
    },


    blueBlob: {
      position:
        "absolute",

      width:
        120,

      height:
        120,

      borderRadius:
        60,

      right:
        42,

      top:
        27,

      backgroundColor:
        "#CDE8F0",
    },


    completeCapsule: {
      width:
        135,

      height:
        160,

      alignItems:
        "center",

      justifyContent:
        "flex-end",
    },


    capsuleLid: {
      position:
        "absolute",

      top:
        0,

      width:
        92,

      height:
        37,

      borderRadius:
        16,

      backgroundColor:
        COLORS.coral,

      zIndex:
        2,
    },


    capsuleBody: {
      width:
        127,

      height:
        126,

      borderRadius:
        40,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation:
        5,
    },


    lockBadge: {
      position:
        "absolute",

      bottom:
        20,

      right:
        22,

      width:
        24,

      height:
        24,

      borderRadius:
        12,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
    },


    sparkleLeft: {
      position:
        "absolute",

      left:
        59,

      top:
        72,
    },


    sparkleRight: {
      position:
        "absolute",

      right:
        64,

      bottom:
        70,
    },


    savedBadge: {
      position:
        "absolute",

      bottom:
        17,

      paddingHorizontal:
        13,

      paddingVertical:
        8,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.84)",
    },


    savedBadgeText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        11,

      color:
        COLORS.coralDark,
    },


    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        23,

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
      maxWidth:
        330,

      marginTop:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        27,

      lineHeight:
        33,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        7,

      maxWidth:
        310,

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


    memoryPreview: {
      width:
        "100%",

      marginTop:
        24,

      paddingHorizontal:
        15,

      paddingVertical:
        14,

      borderRadius:
        22,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.white,

      borderWidth:
        1,

      borderColor:
        "#EEE3D7",

      elevation:
        2,
    },


    quoteIcon: {
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
        COLORS.softPink,
    },


    memoryPreviewTextArea: {
      flex:
        1,

      marginLeft:
        11,
    },


    memoryPreviewLabel: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        10,

      textTransform:
        "uppercase",

      letterSpacing:
        0.8,

      color:
        COLORS.coralDark,
    },


    memoryPreviewText: {
      marginTop:
        4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        18,

      color:
        COLORS.textSecondary,
    },


    gentleNote: {
      width:
        "100%",

      marginTop:
        15,

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
        "#FFF1D2",
    },


    gentleNoteText: {
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