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


const COLORS = {
  background:
    "#FFF9F4",

  card:
    "#FFFFFF",

  primary:
    "#E8903A",

  primaryDark:
    "#BD6420",

  softOrange:
    "#FFE7D2",

  softYellow:
    "#FFF4C8",

  softBlue:
    "#E8F3FA",

  blue:
    "#79AFCB",

  textPrimary:
    "#333338",

  textSecondary:
    "#77767B",

  border:
    "#F0E3D7",

  white:
    "#FFFFFF",
};


const FEELING_OPTIONS = [
  {
    id:
      "energized",

    label:
      "A little more awake",

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
      "tired",

    label:
      "Ready to rest",

    icon:
      "moon-outline",
  },
];


const ACTIVITY_ID =
  "move-with-me";

const NORMAL_FINISH_ROUTE =
  "LowMoodActivities";


export default function MoveWithMeCompleteScreen({
  navigation,
  route,
}) {

  const [
    selectedFeeling,
    setSelectedFeeling,
  ] = useState(
    null
  );


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


  const selectedMovement =
    route?.params
      ?.selectedMovement;


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


  const getReflection =
    () => {

      if (
        selectedFeeling ===
        "energized"
      ) {
        return (
          "Notice that little bit of energy. " +
          "You don't need to do more right now."
        );
      }


      if (
        selectedFeeling ===
        "same"
      ) {
        return (
          "That's okay. The movement still counted."
        );
      }


      if (
        selectedFeeling ===
        "tired"
      ) {
        return (
          "That's okay too. Rest can be your next small step."
        );
      }


      return null;
    };


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * The back button on a completed activity should not
   * travel backward through the activity flow.
   *
   * We reset the Home stack so that:
   *
   * HomeMain
   * → SelfCare
   *
   * becomes the clean active stack.
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
   * → return to Chatbot
   *
   * Normal Self Care flow:
   * → LowMoodActivities
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
   * MOVE AGAIN
   * =======================================================
   *
   * This deliberately restarts this activity rather than
   * leaving the activity.
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "MoveWithMeChoose",
        {
          activityId:
            route?.params
              ?.activityId ||
            ACTIVITY_ID,

          category:
            "lowMood",
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
            styles.orangeShape
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
            Move With Me
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
                    45
                  }
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>
            </View>
          </Animated.View>


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
              MOVEMENT COMPLETE
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
              You gave your body a few
              minutes of movement and
              attention.
            </Text>
          </Animated.View>


          {/* =================================================
              COMPLETED MOVEMENT
             ================================================= */}

          {selectedMovement?.title && (
            <View
              style={
                styles.movementCard
              }
            >
              <View
                style={
                  styles.movementIcon
                }
              >
                <Ionicons
                  name={
                    selectedMovement
                      .icon ||
                    "walk-outline"
                  }
                  size={
                    23
                  }
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>


              <View
                style={
                  styles.movementTextArea
                }
              >
                <Text
                  style={
                    styles.movementLabel
                  }
                >
                  You chose
                </Text>


                <Text
                  style={
                    styles.movementText
                  }
                >
                  {
                    selectedMovement
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
            How does your body feel now?
          </Text>


          <Text
            style={
              styles.reflectionSubtitle
            }
          >
            Just notice. No right answer.
          </Text>


          <View
            style={
              styles.feelingRow
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
                          : COLORS.blue
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
                  COLORS.primaryDark
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
          >
            <Ionicons
              name="refresh-outline"
              size={
                19
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
              Move Again
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


    orangeShape: {
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
        COLORS.softOrange,

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
        0.65,
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
        "rgba(255,255,255,0.86)",
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


    content: {
      flex:
        1,

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
        COLORS.softOrange,
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


    movementCard: {
      width:
        "100%",

      marginTop:
        27,

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


    movementIcon: {
      width:
        44,

      height:
        44,

      borderRadius:
        22,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },


    movementTextArea: {
      flex:
        1,

      marginLeft:
        11,
    },


    movementLabel: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        COLORS.textSecondary,
    },


    movementText: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        14,

      color:
        COLORS.textPrimary,
    },


    reflectionTitle: {
      marginTop:
        27,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        19,

      textAlign:
        "center",

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


    feelingRow: {
      width:
        "100%",

      marginTop:
        16,

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
        17,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    selectedFeeling: {
      backgroundColor:
        COLORS.primary,
    },


    feelingText: {
      marginTop:
        6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.2,

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
        11,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softOrange,
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
        COLORS.blue,
    },
  });