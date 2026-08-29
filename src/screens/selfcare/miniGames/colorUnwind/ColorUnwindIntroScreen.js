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


const COLORS = {
  background:
    "#F8F5F0",

  card:
    "#FFFFFF",

  peach:
    "#F8D7BF",

  peachDark:
    "#DD8D5B",

  sky:
    "#DDEEF5",

  skyDark:
    "#638FA2",

  mint:
    "#E1EEE3",

  mintDark:
    "#6D9175",

  lilac:
    "#EAE4F7",

  lilacDark:
    "#8D7ABC",

  rose:
    "#F4DDE4",

  yellow:
    "#F8EDBD",

  textPrimary:
    "#343D40",

  textSecondary:
    "#748085",

  border:
    "#E8E1D8",

  white:
    "#FFFFFF",

  canvas:
    "#FCFCFC",

  ink:
    "#4D5960",
};


export default function ColorUnwindIntroScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * ANIMATION VALUES
   * =======================================================
   */

  const brushFloat =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  const cardScale =
    useRef(
      new Animated.Value(
        1
      )
    ).current;


  const lineProgress =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  /*
   * =======================================================
   * EXIT TO MAIN SELF CARE
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
   * ANDROID BACK
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
   * INTRO ANIMATIONS
   * =======================================================
   */

  useEffect(
    () => {

      const floatLoop =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              brushFloat,
              {
                toValue:
                  -7,

                duration:
                  1800,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              brushFloat,
              {
                toValue:
                  0,

                duration:
                  1800,

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


      const pulseLoop =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              cardScale,
              {
                toValue:
                  1.015,

                duration:
                  2000,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              cardScale,
              {
                toValue:
                  1,

                duration:
                  2000,

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


      const lineLoop =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              lineProgress,
              {
                toValue:
                  1,

                duration:
                  2400,

                easing:
                  Easing.inOut(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              lineProgress,
              {
                toValue:
                  0,

                duration:
                  2400,

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


      floatLoop.start();

      pulseLoop.start();

      lineLoop.start();


      return () => {

        floatLoop.stop();

        pulseLoop.stop();

        lineLoop.stop();
      };

    },
    [
      brushFloat,
      cardScale,
      lineProgress,
    ]
  );


  /*
   * =======================================================
   * START
   * =======================================================
   *
   * The old Choose screen is intentionally skipped.
   *
   * Preserve all incoming route params so Chatbot-origin
   * information can continue through the activity.
   * =======================================================
   */

  const handleStart =
    () => {

      navigation.navigate(
        "ColorUnwindCanvas",
        {
          ...(
            route?.params ||
            {}
          ),

          activityId:
            route?.params
              ?.activityId ||
            "color-unwind",

          category:
            route?.params
              ?.category ||
            "miniGames",
        }
      );
    };


  const animatedLineScale =
    lineProgress.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        0.45,
        1,
      ],
    });


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

        {/* Decorative background */}

        <View
          pointerEvents="none"
          style={
            styles.topGlow
          }
        />


        <View
          pointerEvents="none"
          style={
            styles.bottomGlow
          }
        />


        <View
          pointerEvents="none"
          style={
            styles.sideGlow
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
              styles.headerButton
            }
            onPress={
              handleBackToSelfCare
            }
            activeOpacity={
              0.72
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
          >
            <Ionicons
              name="chevron-back"
              size={
                26
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
            Color & Unwind
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

          <Animated.View
            style={[
              styles.previewCard,

              {
                transform: [
                  {
                    scale:
                      cardScale,
                  },
                ],
              },
            ]}
          >

            <View
              style={
                styles.previewTopRow
              }
            >
              <View
                style={
                  styles.previewWindowDots
                }
              >
                <View
                  style={[
                    styles.windowDot,
                    {
                      backgroundColor:
                        COLORS.rose,
                    },
                  ]}
                />

                <View
                  style={[
                    styles.windowDot,
                    {
                      backgroundColor:
                        COLORS.yellow,
                    },
                  ]}
                />

                <View
                  style={[
                    styles.windowDot,
                    {
                      backgroundColor:
                        COLORS.mint,
                    },
                  ]}
                />
              </View>


              <Animated.View
                style={[
                  styles.brushBubble,

                  {
                    transform: [
                      {
                        translateY:
                          brushFloat,
                      },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name="brush-outline"
                  size={
                    25
                  }
                  color={
                    COLORS.peachDark
                  }
                />
              </Animated.View>
            </View>


            {/* Blank canvas preview */}

            <View
              style={
                styles.previewCanvas
              }
            >

              <View
                style={
                  styles.previewHint
                }
              >
                <Ionicons
                  name="sparkles-outline"
                  size={
                    18
                  }
                  color={
                    "#C4C9CA"
                  }
                />

                <Text
                  style={
                    styles.previewHintText
                  }
                >
                  your space
                </Text>
              </View>


              <Animated.View
                style={[
                  styles.previewStrokeOne,

                  {
                    transform: [
                      {
                        scaleX:
                          animatedLineScale,
                      },
                    ],
                  },
                ]}
              />


              <View
                style={
                  styles.previewStrokeTwo
                }
              />


              <View
                style={
                  styles.previewStrokeThree
                }
              />

            </View>


            <View
              style={
                styles.colorRow
              }
            >

              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      "#454B4F",
                  },
                ]}
              />

              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      "#6EA8C5",
                  },
                ]}
              />

              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      "#79B38B",
                  },
                ]}
              />

              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      "#A38BD2",
                  },
                ]}
              />

              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      "#E590A4",
                  },
                ]}
              />

              <View
                style={[
                  styles.colorDot,

                  {
                    backgroundColor:
                      "#E5B45E",
                  },
                ]}
              />

            </View>

          </Animated.View>

        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <View
          style={
            styles.content
          }
        >

          <View
            style={
              styles.badge
            }
          >
            <Ionicons
              name="pencil-outline"
              size={
                15
              }
              color={
                COLORS.skyDark
              }
            />

            <Text
              style={
                styles.badgeText
              }
            >
              FREE DRAWING
            </Text>
          </View>


          <Text
            style={
              styles.title
            }
          >
            Draw whatever{"\n"}
            comes to mind
          </Text>


          <Text
            style={
              styles.description
            }
          >
            No picture to complete and no right way to draw.
            Let your finger wander across the page.
          </Text>


          <View
            style={
              styles.featureRow
            }
          >

            <View
              style={
                styles.feature
              }
            >
              <View
                style={[
                  styles.featureIcon,

                  {
                    backgroundColor:
                      COLORS.lilac,
                  },
                ]}
              >
                <Ionicons
                  name="pencil-outline"
                  size={
                    20
                  }
                  color={
                    COLORS.lilacDark
                  }
                />
              </View>

              <Text
                style={
                  styles.featureText
                }
              >
                Draw
              </Text>
            </View>


            <View
              style={
                styles.feature
              }
            >
              <View
                style={[
                  styles.featureIcon,

                  {
                    backgroundColor:
                      COLORS.sky,
                  },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={
                    20
                  }
                  color={
                    COLORS.skyDark
                  }
                />
              </View>

              <Text
                style={
                  styles.featureText
                }
              >
                Choose
              </Text>
            </View>


            <View
              style={
                styles.feature
              }
            >
              <View
                style={[
                  styles.featureIcon,

                  {
                    backgroundColor:
                      COLORS.mint,
                  },
                ]}
              >
                <Ionicons
                  name="leaf-outline"
                  size={
                    20
                  }
                  color={
                    COLORS.mintDark
                  }
                />
              </View>

              <Text
                style={
                  styles.featureText
                }
              >
                Unwind
              </Text>
            </View>

          </View>

        </View>


        {/* =================================================
            START BUTTON
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >

          <TouchableOpacity
            style={
              styles.startButton
            }
            onPress={
              handleStart
            }
            activeOpacity={
              0.86
            }
            accessibilityRole="button"
            accessibilityLabel="Start free drawing"
          >

            <Text
              style={
                styles.startText
              }
            >
              Start Drawing
            </Text>


            <View
              style={
                styles.startIcon
              }
            >
              <Ionicons
                name="arrow-forward"
                size={
                  18
                }
                color={
                  COLORS.peachDark
                }
              />
            </View>

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


    topGlow: {
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
        -90,

      backgroundColor:
        COLORS.sky,

      opacity:
        0.55,
    },


    bottomGlow: {
      position:
        "absolute",

      width:
        260,

      height:
        260,

      borderRadius:
        130,

      bottom:
        -150,

      left:
        -110,

      backgroundColor:
        COLORS.mint,

      opacity:
        0.5,
    },


    sideGlow: {
      position:
        "absolute",

      width:
        150,

      height:
        150,

      borderRadius:
        75,

      top:
        380,

      right:
        -90,

      backgroundColor:
        COLORS.lilac,

      opacity:
        0.35,
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
        "rgba(255,255,255,0.88)",

      borderWidth:
        1,

      borderColor:
        "rgba(226,220,211,0.8)",
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
        320,

      paddingHorizontal:
        24,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    previewCard: {
      width:
        "100%",

      maxWidth:
        350,

      height:
        272,

      borderRadius:
        32,

      padding:
        16,

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      shadowColor:
        "#AFA79F",

      shadowOffset: {
        width:
          0,

        height:
          6,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        12,

      elevation:
        4,
    },


    previewTopRow: {
      height:
        40,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    previewWindowDots: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    windowDot: {
      width:
        8,

      height:
        8,

      borderRadius:
        4,

      marginRight:
        6,
    },


    brushBubble: {
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
        "#FFF2E8",
    },


    previewCanvas: {
      flex:
        1,

      marginTop:
        5,

      borderRadius:
        20,

      backgroundColor:
        COLORS.canvas,

      borderWidth:
        1,

      borderColor:
        "#ECECEC",

      overflow:
        "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    previewHint: {
      position:
        "absolute",

      flexDirection:
        "row",

      alignItems:
        "center",

      opacity:
        0.75,
    },


    previewHintText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        "#A5AAAB",
    },


    previewStrokeOne: {
      position:
        "absolute",

      width:
        145,

      height:
        5,

      borderRadius:
        5,

      left:
        48,

      top:
        53,

      backgroundColor:
        "#A38BD2",

      transform: [
        {
          rotate:
            "12deg",
        },
      ],
    },


    previewStrokeTwo: {
      position:
        "absolute",

      width:
        96,

      height:
        7,

      borderRadius:
        5,

      right:
        42,

      bottom:
        49,

      backgroundColor:
        "#6EA8C5",

      transform: [
        {
          rotate:
            "-18deg",
        },
      ],

      opacity:
        0.82,
    },


    previewStrokeThree: {
      position:
        "absolute",

      width:
        72,

      height:
        4,

      borderRadius:
        4,

      left:
        58,

      bottom:
        41,

      backgroundColor:
        "#E590A4",

      transform: [
        {
          rotate:
            "-31deg",
        },
      ],
    },


    colorRow: {
      height:
        42,

      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "center",
    },


    colorDot: {
      width:
        18,

      height:
        18,

      borderRadius:
        9,

      marginHorizontal:
        6,
    },


    content: {
      flex:
        1,

      paddingHorizontal:
        27,

      alignItems:
        "center",
    },


    badge: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        12,

      paddingVertical:
        7,

      borderRadius:
        18,

      backgroundColor:
        COLORS.white,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    badgeText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        9.5,

      letterSpacing:
        1.2,

      color:
        COLORS.skyDark,
    },


    title: {
      marginTop:
        15,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        29,

      lineHeight:
        34,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      maxWidth:
        330,

      marginTop:
        9,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13.5,

      lineHeight:
        20,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    featureRow: {
      width:
        "100%",

      marginTop:
        24,

      flexDirection:
        "row",

      justifyContent:
        "space-evenly",
    },


    feature: {
      alignItems:
        "center",

      minWidth:
        68,
    },


    featureIcon: {
      width:
        43,

      height:
        43,

      borderRadius:
        15,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    featureText: {
      marginTop:
        6,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    bottomContainer: {
      paddingHorizontal:
        24,

      paddingBottom:
        17,
    },


    startButton: {
      height:
        58,

      borderRadius:
        20,

      backgroundColor:
        COLORS.peachDark,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      shadowColor:
        COLORS.peachDark,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.18,

      shadowRadius:
        7,

      elevation:
        3,
    },


    startText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        16,

      color:
        COLORS.white,
    },


    startIcon: {
      width:
        29,

      height:
        29,

      marginLeft:
        10,

      borderRadius:
        15,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },
  });