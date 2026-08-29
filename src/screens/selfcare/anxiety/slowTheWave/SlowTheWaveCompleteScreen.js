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
  background: "#F7FAF8",
  card: "#FFFFFF",

  primary: "#6C9EB2",
  primaryDark: "#557E91",

  green: "#83A995",
  greenDark: "#5E806C",

  softBlue: "#DDEFF5",
  softBlueStrong: "#CDE5EE",

  softGreen: "#DDEEE4",

  cream: "#FAF2E6",
  creamDark: "#B18E69",

  textPrimary: "#2F3938",
  textSecondary: "#74807D",

  white: "#FFFFFF",
};


/*
 * =========================================================
 * ACTIVITY CONFIGURATION
 * =========================================================
 */

const ACTIVITY_ID =
  "slow-the-wave";

const ACTIVITY_CATEGORY =
  "anxiety";

const ACTIVITY_REPEAT_ROUTE =
  "SlowTheWaveBreathing";

const NORMAL_FINISH_ROUTE =
  "AnxietyActivities";


/*
 * =========================================================
 * FEELINGS
 * =========================================================
 */

const FEELINGS = [
  {
    id: "calmer",

    label:
      "Calmer",

    icon:
      "leaf-outline",

    background:
      "#DDEEE4",
  },

  {
    id: "same",

    label:
      "About the same",

    icon:
      "remove-outline",

    background:
      "#DDEFF5",
  },

  {
    id: "unsettled",

    label:
      "Still unsettled",

    icon:
      "water-outline",

    background:
      "#FAF2E6",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function SlowTheWaveCompleteScreen({
  navigation,
  route,
}) {

  const [
    selectedFeeling,
    setSelectedFeeling,
  ] = useState(
    null
  );


  /*
   * =======================================================
   * ENTRY ANIMATION
   * =======================================================
   */

  const contentOpacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const contentY =
    useRef(
      new Animated.Value(18)
    ).current;


  const waveX =
    useRef(
      new Animated.Value(0)
    ).current;


  useEffect(
    () => {

      Animated.parallel([
        Animated.timing(
          contentOpacity,
          {
            toValue: 1,

            duration: 600,

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


      const waveAnimation =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              waveX,
              {
                toValue: 1,

                duration: 3000,

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              waveX,
              {
                toValue: 0,

                duration: 3000,

                useNativeDriver:
                  true,
              }
            ),
          ])
        );


      waveAnimation.start();


      return () => {
        waveAnimation.stop();
      };
    },
    [
      contentOpacity,
      contentY,
      waveX,
    ]
  );


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * Any Back action from this Complete screen should return
   * directly to the main SelfCare screen.
   *
   * We reset the Home stack to:
   *
   * HomeMain
   * SelfCare
   *
   * This removes the entire completed Slow The Wave flow
   * from the stack and prevents old activity screens from
   * reopening later.
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
   * MESSAGE
   * =======================================================
   */

  const getMessage =
    () => {

      if (
        selectedFeeling ===
        "calmer"
      ) {

        return "Notice that small shift without needing to hold onto it.";
      }


      if (
        selectedFeeling ===
        "same"
      ) {

        return "That's okay. Taking a quiet pause still counts.";
      }


      if (
        selectedFeeling ===
        "unsettled"
      ) {

        return "That's okay too. You don't need to force calm.";
      }


      return "";
    };


  /*
   * =======================================================
   * FINISH
   * =======================================================
   *
   * Chatbot recommendation:
   * → return to the same Chatbot conversation.
   *
   * Normal Self Care use:
   * → AnxietyActivities.
   *
   * Existing behavior is preserved.
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
   * BREATHE AGAIN
   * =======================================================
   *
   * Repeats the breathing section.
   *
   * Chatbot source/origin remains untouched so that if the
   * user originally entered through Chatbot, finishing later
   * can still return to the same conversation.
   * =======================================================
   */

  const handleAgain =
    () => {

      navigation.navigate(
        ACTIVITY_REPEAT_ROUTE,
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

          fromChatbot:
            route?.params
              ?.fromChatbot,

          chatbotStarted:
            route?.params
              ?.chatbotStarted,
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
            Slow the Wave
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/* =================================================
            WAVE HEADER
           ================================================= */}

        <View
          style={
            styles.waveHeader
          }
        >

          <View
            style={
              styles.headerGlow
            }
          />


          <Animated.View
            style={[
              styles.headerWaveBack,

              {
                transform: [
                  {
                    translateX:
                      waveX.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            -16,
                            16,
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          />


          <Animated.View
            style={[
              styles.headerWaveFront,

              {
                transform: [
                  {
                    translateX:
                      waveX.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],

                          outputRange: [
                            15,
                            -15,
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          />


          <View
            style={
              styles.finishedBadge
            }
          >
            <Ionicons
              name="checkmark"
              size={
                20
              }
              color={
                COLORS.greenDark
              }
            />


            <Text
              style={
                styles.finishedText
              }
            >
              Complete
            </Text>
          </View>

        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

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
              styles.smallLabel
            }
          >
            SLOW THE WAVE
          </Text>


          <Text
            style={
              styles.title
            }
          >
            Let your breathing be natural
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Nothing more to do right now.
          </Text>


          {/* =================================================
              REFLECTION
             ================================================= */}

          <View
            style={
              styles.reflectionCard
            }
          >

            <Text
              style={
                styles.reflectionTitle
              }
            >
              How do you feel now?
            </Text>


            <Text
              style={
                styles.reflectionHint
              }
            >
              Just notice.
            </Text>


            <View
              style={
                styles.optionsContainer
              }
            >
              {FEELINGS.map(
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
                        styles.feelingRow,

                        {
                          backgroundColor:
                            item.background,
                        },

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
                        `I feel ${item.label}`
                      }
                      accessibilityState={{
                        selected,
                      }}
                    >

                      <View
                        style={[
                          styles.feelingIcon,

                          selected &&
                            styles.selectedIcon,
                        ]}
                      >
                        <Ionicons
                          name={
                            item.icon
                          }
                          size={
                            20
                          }
                          color={
                            selected
                              ? COLORS.white
                              : COLORS.primaryDark
                          }
                        />
                      </View>


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


                      <View
                        style={[
                          styles.radio,

                          selected &&
                            styles.radioSelected,
                        ]}
                      >
                        {selected && (
                          <View
                            style={
                              styles.radioInner
                            }
                          />
                        )}
                      </View>

                    </TouchableOpacity>
                  );
                }
              )}
            </View>

          </View>


          {/* =================================================
              RESPONSE
             ================================================= */}

          {selectedFeeling && (
            <View
              style={
                styles.messageCard
              }
            >
              <Ionicons
                name="heart-outline"
                size={
                  18
                }
                color={
                  COLORS.greenDark
                }
              />


              <Text
                style={
                  styles.messageText
                }
              >
                {
                  getMessage()
                }
              </Text>
            </View>
          )}

        </Animated.View>


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
            accessibilityLabel="Finish Slow the Wave activity"
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
            accessibilityLabel="Breathe again"
          >
            <Ionicons
              name="refresh-outline"
              size={
                18
              }
              color={
                COLORS.primaryDark
              }
            />


            <Text
              style={
                styles.againText
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


    /*
     * =====================================================
     * WAVE HEADER
     * =====================================================
     */

    waveHeader: {
      height:
        220,

      marginHorizontal:
        19,

      marginTop:
        4,

      borderRadius:
        35,

      overflow:
        "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    headerGlow: {
      position:
        "absolute",

      width:
        200,

      height:
        200,

      borderRadius:
        100,

      top:
        -65,

      right:
        -45,

      backgroundColor:
        COLORS.cream,
    },


    headerWaveBack: {
      position:
        "absolute",

      width:
        430,

      height:
        130,

      borderRadius:
        70,

      bottom:
        0,

      backgroundColor:
        COLORS.softGreen,
    },


    headerWaveFront: {
      position:
        "absolute",

      width:
        430,

      height:
        105,

      borderRadius:
        60,

      bottom:
        -30,

      backgroundColor:
        COLORS.softBlueStrong,
    },


    finishedBadge: {
      width:
        112,

      height:
        48,

      borderRadius:
        24,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      elevation:
        4,
    },


    finishedText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.greenDark,
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
        22,

      alignItems:
        "center",
    },


    smallLabel: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        10.5,

      letterSpacing:
        1.3,

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
        27,

      lineHeight:
        34,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * REFLECTION
     * =====================================================
     */

    reflectionCard: {
      width:
        "100%",

      marginTop:
        24,

      paddingHorizontal:
        16,

      paddingVertical:
        18,

      borderRadius:
        25,

      backgroundColor:
        COLORS.white,

      elevation:
        2,
    },


    reflectionTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        17,

      color:
        COLORS.textPrimary,
    },


    reflectionHint: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      color:
        COLORS.textSecondary,
    },


    optionsContainer: {
      marginTop:
        15,
    },


    feelingRow: {
      minHeight:
        61,

      marginBottom:
        10,

      paddingHorizontal:
        11,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      borderWidth:
        1.5,

      borderColor:
        "transparent",
    },


    selectedFeeling: {
      borderColor:
        COLORS.primary,
    },


    feelingIcon: {
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

      backgroundColor:
        "rgba(255,255,255,0.78)",
    },


    selectedIcon: {
      backgroundColor:
        COLORS.primary,
    },


    feelingText: {
      flex:
        1,

      marginLeft:
        11,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13.5,

      color:
        COLORS.textPrimary,
    },


    selectedFeelingText: {
      fontFamily:
        "JosefinSans_700Bold",

      color:
        COLORS.primaryDark,
    },


    radio: {
      width:
        21,

      height:
        21,

      borderRadius:
        11,

      borderWidth:
        1.5,

      borderColor:
        "#ABB9B5",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    radioSelected: {
      borderColor:
        COLORS.primary,
    },


    radioInner: {
      width:
        10,

      height:
        10,

      borderRadius:
        5,

      backgroundColor:
        COLORS.primary,
    },


    /*
     * =====================================================
     * MESSAGE
     * =====================================================
     */

    messageCard: {
      width:
        "100%",

      marginTop:
        14,

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


    messageText: {
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
        20,

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
        47,

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
        COLORS.primaryDark,
    },
  });