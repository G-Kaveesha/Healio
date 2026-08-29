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
  background: "#FFF9F0",

  card: "#FFFFFF",

  yellow: "#FFE9A8",

  peach: "#F7C8A0",

  coral: "#F29B82",

  softBlue: "#DFF1F7",

  blue: "#78AFC4",

  textPrimary: "#3C3934",

  textSecondary: "#7A746C",

  white: "#FFFFFF",
};


const ACTIVITY_ID =
  "hold-the-moment";

const ACTIVITY_CATEGORY =
  "happy";

const NORMAL_FINISH_ROUTE =
  "HappyActivities";


const KEEP_OPTIONS = [
  {
    id:
      "feeling",

    title:
      "The feeling",

    icon:
      "heart-outline",

    color:
      "#F7C8A0",
  },

  {
    id:
      "detail",

    title:
      "A small detail",

    icon:
      "sparkles-outline",

    color:
      "#FFE9A8",
  },

  {
    id:
      "person",

    title:
      "The person",

    icon:
      "people-outline",

    color:
      "#F7E5EF",
  },

  {
    id:
      "memory",

    title:
      "The whole memory",

    icon:
      "bookmark-outline",

    color:
      "#DFF1F7",
  },
];


export default function HoldTheMomentCompleteScreen({
  navigation,
  route,
}) {

  const [
    selectedKeep,
    setSelectedKeep,
  ] =
    useState(
      null
    );


  const cardOpacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const cardY =
    useRef(
      new Animated.Value(22)
    ).current;


  useEffect(
    () => {

      Animated.parallel([
        Animated.timing(
          cardOpacity,
          {
            toValue:
              1,

            duration:
              550,

            useNativeDriver:
              true,
          }
        ),

        Animated.spring(
          cardY,
          {
            toValue:
              0,

            friction:
              7,

            useNativeDriver:
              true,
          }
        ),
      ]).start();

    },
    [
      cardOpacity,
      cardY,
    ]
  );


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * This is the standard Back behavior for completed
   * self-care activities.
   *
   * It removes the current activity flow from the stack
   * and returns the user directly to:
   *
   * HomeMain
   *   ↓
   * SelfCare
   *
   * This prevents Android Back from reopening old
   * Hold the Moment screens later.
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
   * FINISH ACTIVITY
   * =======================================================
   *
   * Existing behavior is preserved.
   *
   * If started from Chatbot:
   * → return to Chatbot.
   *
   * If opened normally:
   * → return to HappyActivities.
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
   * CHOOSE ANOTHER MOMENT
   * =======================================================
   *
   * This is intentionally NOT treated as a Back action.
   *
   * It keeps the user inside the same activity flow and
   * returns them to the moment-selection screen.
   *
   * Chatbot-origin information is intentionally preserved.
   */

  const handleAgain =
    () => {

      navigation.navigate(
        "HoldTheMomentChoose",
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
            Hold the Moment
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/* =================================================
            TOP ARTWORK
           ================================================= */}

        <View
          style={
            styles.topArtwork
          }
        >

          <View
            style={
              styles.yellowOrb
            }
          />


          <View
            style={
              styles.peachOrb
            }
          />


          <View
            style={
              styles.blueOrb
            }
          />


          <View
            style={
              styles.completeBadge
            }
          >
            <Ionicons
              name="sparkles-outline"
              size={
                23
              }
              color="#A56E20"
            />
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
                cardOpacity,

              transform: [
                {
                  translateY:
                    cardY,
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
            MOMENT HELD
          </Text>


          <Text
            style={
              styles.title
            }
          >
            Keep one little piece
          </Text>


          <Text
            style={
              styles.description
            }
          >
            What would you like to
            carry with you?
          </Text>


          {/* =================================================
              OPTIONS
             ================================================= */}

          <View
            style={
              styles.optionsGrid
            }
          >

            {KEEP_OPTIONS.map(
              (
                item
              ) => {

                const selected =
                  selectedKeep ===
                  item.id;


                return (
                  <TouchableOpacity
                    key={
                      item.id
                    }
                    style={[
                      styles.keepCard,

                      {
                        backgroundColor:
                          item.color,
                      },

                      selected &&
                        styles.selectedCard,
                    ]}
                    onPress={
                      () =>
                        setSelectedKeep(
                          item.id
                        )
                    }
                    activeOpacity={
                      0.82
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      `Keep ${item.title}`
                    }
                  >

                    <View
                      style={[
                        styles.keepIcon,

                        selected &&
                          styles.selectedIcon,
                      ]}
                    >
                      <Ionicons
                        name={
                          item.icon
                        }
                        size={
                          24
                        }
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.textPrimary
                        }
                      />
                    </View>


                    <Text
                      style={[
                        styles.keepTitle,

                        selected &&
                          styles.selectedTitle,
                      ]}
                    >
                      {
                        item.title
                      }
                    </Text>

                  </TouchableOpacity>
                );
              }
            )}

          </View>


          {/* =================================================
              REFLECTION MESSAGE
             ================================================= */}

          {selectedKeep && (
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
                  COLORS.coral
                }
              />


              <Text
                style={
                  styles.messageText
                }
              >
                You can return to this
                memory whenever you
                want.
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
            accessibilityLabel="Finish Hold the Moment activity"
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
            accessibilityLabel="Choose another moment"
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
              Choose Another Moment
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
      flex:
        1,

      textAlign:
        "center",

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
     * TOP ARTWORK
     * =====================================================
     */

    topArtwork: {
      height:
        245,

      marginHorizontal:
        20,

      marginTop:
        2,

      borderRadius:
        36,

      alignItems:
        "center",

      justifyContent:
        "center",

      overflow:
        "hidden",

      backgroundColor:
        COLORS.softBlue,
    },


    yellowOrb: {
      position:
        "absolute",

      width:
        190,

      height:
        190,

      borderRadius:
        95,

      top:
        -55,

      left:
        -50,

      backgroundColor:
        COLORS.yellow,

      opacity:
        0.9,
    },


    peachOrb: {
      position:
        "absolute",

      width:
        175,

      height:
        175,

      borderRadius:
        88,

      right:
        -40,

      bottom:
        -55,

      backgroundColor:
        COLORS.peach,

      opacity:
        0.85,
    },


    blueOrb: {
      position:
        "absolute",

      width:
        120,

      height:
        120,

      borderRadius:
        60,

      right:
        60,

      top:
        35,

      backgroundColor:
        "#CBE6EF",

      opacity:
        0.75,
    },


    completeBadge: {
      width:
        88,

      height:
        88,

      borderRadius:
        29,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      transform: [
        {
          rotate:
            "-7deg",
        },
      ],

      elevation:
        5,

      shadowColor:
        "#B8A27F",

      shadowOffset: {
        width:
          0,

        height:
          6,
      },

      shadowOpacity:
        0.13,

      shadowRadius:
        10,
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
        24,

      alignItems:
        "center",
    },


    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        10.5,

      letterSpacing:
        1.5,

      color:
        COLORS.coral,
    },


    title: {
      marginTop:
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        28,

      lineHeight:
        34,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop:
        6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13.5,

      color:
        COLORS.textSecondary,

      textAlign:
        "center",
    },


    /*
     * =====================================================
     * OPTIONS
     * =====================================================
     */

    optionsGrid: {
      width:
        "100%",

      marginTop:
        24,

      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    keepCard: {
      width:
        "48%",

      minHeight:
        120,

      marginBottom:
        13,

      borderRadius:
        24,

      paddingHorizontal:
        13,

      paddingVertical:
        14,

      justifyContent:
        "space-between",

      borderWidth:
        1.5,

      borderColor:
        "transparent",
    },


    selectedCard: {
      borderColor:
        COLORS.coral,

      backgroundColor:
        COLORS.white,

      elevation:
        3,
    },


    keepIcon: {
      width:
        45,

      height:
        45,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.72)",
    },


    selectedIcon: {
      backgroundColor:
        COLORS.coral,
    },


    keepTitle: {
      marginTop:
        12,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13.5,

      color:
        COLORS.textPrimary,
    },


    selectedTitle: {
      color:
        COLORS.coral,
    },


    /*
     * =====================================================
     * MESSAGE
     * =====================================================
     */

    messageCard: {
      width:
        "100%",

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
        "#FFF2CE",
    },


    messageText: {
      flex:
        1,

      marginLeft:
        7,

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