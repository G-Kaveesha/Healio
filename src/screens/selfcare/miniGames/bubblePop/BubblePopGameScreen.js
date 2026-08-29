import React, {
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
  Easing,
  Dimensions,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";


/*
 * =========================================================
 * AUDIO
 * =========================================================
 */

const POP_SOUND =
  require(
    "../../../../../assets/audio/selfcare/miniGames/bubble_pop_soft.mp3"
  );


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

const {
  width,
  height,
} = Dimensions.get(
  "window"
);


const COLORS = {
  background: "#DCEEF5",

  deepBackground:
    "#BDDCE9",

  card: "#FFFFFF",

  blue: "#78AFC4",
  deepBlue: "#527F96",

  aqua: "#67D9D1",
  teal: "#4DB8A8",

  lavender: "#B6A6E8",
  purple: "#8B79CF",

  yellow: "#FFF0A8",

  textPrimary: "#30404A",
  textSecondary: "#6D818B",

  white: "#FFFFFF",
};


const GAME_HORIZONTAL_PADDING =
  24;

const GAME_TOP_OFFSET =
  130;

const GAME_BOTTOM_OFFSET =
  160;


/*
 * =========================================================
 * RANDOM HELPERS
 * =========================================================
 */

const randomBetween =
  (
    min,
    max
  ) =>
    Math.random() *
      (max - min) +
    min;


const getRandomBubble =
  () => {
    const size =
      randomBetween(
        105,
        185
      );


    /*
     * Keep the complete bubble
     * within the visible game area.
     */

    const maxX =
      width -
      GAME_HORIZONTAL_PADDING *
        2 -
      size;


    const availableHeight =
      height -
      GAME_TOP_OFFSET -
      GAME_BOTTOM_OFFSET;


    const maxY =
      Math.max(
        40,
        availableHeight -
          size
      );


    return {
      size,

      x:
        randomBetween(
          0,
          Math.max(
            10,
            maxX
          )
        ),

      y:
        randomBetween(
          10,
          maxY
        ),
    };
  };


/*
 * =========================================================
 * MAIN SCREEN
 * =========================================================
 */

export default function BubblePopGameScreen({
  navigation,
  route,
}) {
  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    bubble,
    setBubble,
  ] = useState(
    getRandomBubble()
  );

  const [
    popCount,
    setPopCount,
  ] = useState(0);

  const [
    isPopping,
    setIsPopping,
  ] = useState(false);

  const [
    soundEnabled,
    setSoundEnabled,
  ] = useState(true);

  const [
    sparkleVisible,
    setSparkleVisible,
  ] = useState(false);


  /*
   * =======================================================
   * AUDIO PLAYER
   * =======================================================
   */

  const popPlayer =
    useAudioPlayer(
      POP_SOUND
    );


  useEffect(() => {
    const configureAudio =
      async () => {
        try {
          await setAudioModeAsync({
            playsInSilentMode:
              true,
          });
        } catch (error) {
          console.log(
            "Bubble Pop audio mode error:",
            error
          );
        }
      };


    configureAudio();
  }, []);


  /*
   * =======================================================
   * ANIMATION VALUES
   * =======================================================
   */

  const bubbleScale =
    useRef(
      new Animated.Value(0)
    ).current;

  const bubbleOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const floatY =
    useRef(
      new Animated.Value(0)
    ).current;

  const floatX =
    useRef(
      new Animated.Value(0)
    ).current;

  const sparkleScale =
    useRef(
      new Animated.Value(0)
    ).current;

  const sparkleOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const ringScale =
    useRef(
      new Animated.Value(0.7)
    ).current;

  const ringOpacity =
    useRef(
      new Animated.Value(0)
    ).current;


  const floatAnimationRef =
    useRef(null);


  /*
   * =======================================================
   * SHOW NEW BUBBLE
   * =======================================================
   */

  const showBubble =
    () => {
      bubbleScale.setValue(
        0.82
      );

      bubbleOpacity.setValue(
        0
      );

      floatY.setValue(
        0
      );

      floatX.setValue(
        0
      );


      Animated.parallel([
        Animated.spring(
          bubbleScale,
          {
            toValue: 1,

            friction: 7,

            tension: 55,

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          bubbleOpacity,
          {
            toValue: 1,

            duration: 380,

            useNativeDriver:
              true,
          }
        ),
      ]).start(() => {
        startFloating();
      });
    };


  /*
   * =======================================================
   * FLOATING
   * =======================================================
   */

  const startFloating =
    () => {
      if (
        floatAnimationRef.current
      ) {
        floatAnimationRef
          .current
          .stop();
      }


      const direction =
        Math.random() >
        0.5
          ? 1
          : -1;


      floatAnimationRef.current =
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(
                floatY,
                {
                  toValue:
                    -10,

                  duration:
                    1700,

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
                  toValue:
                    6,

                  duration:
                    1900,

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
                  toValue:
                    0,

                  duration:
                    1500,

                  easing:
                    Easing.inOut(
                      Easing.ease
                    ),

                  useNativeDriver:
                    true,
                }
              ),
            ]),


            Animated.sequence([
              Animated.timing(
                floatX,
                {
                  toValue:
                    direction *
                    6,

                  duration:
                    2200,

                  easing:
                    Easing.inOut(
                      Easing.ease
                    ),

                  useNativeDriver:
                    true,
                }
              ),

              Animated.timing(
                floatX,
                {
                  toValue:
                    direction *
                    -4,

                  duration:
                    2200,

                  easing:
                    Easing.inOut(
                      Easing.ease
                    ),

                  useNativeDriver:
                    true,
                }
              ),

              Animated.timing(
                floatX,
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
            ]),
          ])
        );


      floatAnimationRef
        .current
        .start();
    };


  /*
   * =======================================================
   * INITIAL BUBBLE
   * =======================================================
   */

  useEffect(() => {
    showBubble();


    return () => {
      if (
        floatAnimationRef.current
      ) {
        floatAnimationRef
          .current
          .stop();
      }

      try {
        popPlayer.pause();
      } catch (error) {
        // Safe cleanup.
      }
    };
  }, []);


  /*
   * =======================================================
   * PLAY POP SOUND
   * =======================================================
   */

  const playPopSound =
    async () => {
      if (
        !soundEnabled
      ) {
        return;
      }


      try {
        popPlayer.pause();

        await popPlayer.seekTo(
          0
        );

        popPlayer.volume =
          0.32;

        popPlayer.play();
      } catch (error) {
        console.log(
          "Bubble pop sound error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * POP
   * =======================================================
   */

  const handlePop =
    () => {
      if (
        isPopping
      ) {
        return;
      }


      setIsPopping(
        true
      );


      if (
        floatAnimationRef.current
      ) {
        floatAnimationRef
          .current
          .stop();
      }


      playPopSound();


      /*
       * Reset burst values.
       */

      sparkleScale.setValue(
        0.4
      );

      sparkleOpacity.setValue(
        1
      );

      ringScale.setValue(
        0.65
      );

      ringOpacity.setValue(
        0.7
      );

      setSparkleVisible(
        true
      );


      /*
       * Bubble expands slightly
       * and fades.
       */

      Animated.parallel([
        Animated.timing(
          bubbleScale,
          {
            toValue: 1.28,

            duration: 190,

            easing:
              Easing.out(
                Easing.ease
              ),

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          bubbleOpacity,
          {
            toValue: 0,

            duration: 210,

            useNativeDriver:
              true,
          }
        ),


        /*
         * Sparkle burst
         */

        Animated.timing(
          sparkleScale,
          {
            toValue: 1.55,

            duration: 360,

            easing:
              Easing.out(
                Easing.ease
              ),

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          sparkleOpacity,
          {
            toValue: 0,

            duration: 470,

            useNativeDriver:
              true,
          }
        ),


        /*
         * Outer ring expands
         */

        Animated.timing(
          ringScale,
          {
            toValue: 1.55,

            duration: 400,

            easing:
              Easing.out(
                Easing.ease
              ),

            useNativeDriver:
              true,
          }
        ),

        Animated.timing(
          ringOpacity,
          {
            toValue: 0,

            duration: 400,

            useNativeDriver:
              true,
          }
        ),
      ]).start(() => {
        setPopCount(
          (
            previous
          ) =>
            previous + 1
        );


        /*
         * Short calm pause before
         * next bubble appears.
         */

        setTimeout(() => {
          setBubble(
            getRandomBubble()
          );


          setSparkleVisible(
            false
          );

          setIsPopping(
            false
          );


          requestAnimationFrame(
            () => {
              showBubble();
            }
          );
        }, 260);
      });
    };


  /*
   * =======================================================
   * SOUND TOGGLE
   * =======================================================
   */

  const handleSoundToggle =
    () => {
      setSoundEnabled(
        (
          previous
        ) =>
          !previous
      );
    };


  /*
   * =======================================================
   * FINISH
   * =======================================================
   */

  const handleFinish =
    () => {
      if (
        floatAnimationRef.current
      ) {
        floatAnimationRef
          .current
          .stop();
      }


      try {
        popPlayer.pause();
      } catch (error) {
        // Safe cleanup.
      }


      navigation.navigate(
        "BubblePopComplete",
        {
          ...(route?.params || {}),

          pops:
            popCount,
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
        {/* Background glows */}

        <View
          pointerEvents="none"
          style={
            styles.backgroundGlowOne
          }
        />

        <View
          pointerEvents="none"
          style={
            styles.backgroundGlowTwo
          }
        />

        <View
          pointerEvents="none"
          style={
            styles.backgroundGlowThree
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
              handleFinish
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>


          <View
            style={
              styles.headerCenter
            }
          >
            <Text
              style={
                styles.headerTitle
              }
            >
              Bubble Pop Calm
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Pop whatever catches
              your eye
            </Text>
          </View>


          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={
              handleSoundToggle
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                soundEnabled
                  ? "volume-medium-outline"
                  : "volume-mute-outline"
              }
              size={22}
              color={
                soundEnabled
                  ? COLORS.deepBlue
                  : COLORS.textSecondary
              }
            />
          </TouchableOpacity>
        </View>


        {/* =================================================
            GAME AREA
           ================================================= */}

        <View
          style={
            styles.gameArea
          }
        >
          <View
            style={
              styles.softPrompt
            }
          >
            <View
              style={
                styles.promptDot
              }
            />

            <Text
              style={
                styles.softPromptText
              }
            >
              Take your time
            </Text>
          </View>


          {/* Bubble */}

          <Animated.View
            style={[
              styles.bubblePosition,

              {
                width:
                  bubble.size,

                height:
                  bubble.size,

                left:
                  bubble.x,

                top:
                  bubble.y,

                opacity:
                  bubbleOpacity,

                transform: [
                  {
                    translateX:
                      floatX,
                  },

                  {
                    translateY:
                      floatY,
                  },

                  {
                    scale:
                      bubbleScale,
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={
                handlePop
              }
              disabled={
                isPopping
              }
              style={{
                width: "100%",
                height: "100%",
              }}
              accessibilityRole="button"
              accessibilityLabel="Pop bubble"
            >
              <GameBubble />
            </TouchableOpacity>
          </Animated.View>


          {/* Sparkle burst */}

          {sparkleVisible && (
            <View
              pointerEvents="none"
              style={[
                styles.sparkleHolder,

                {
                  left:
                    bubble.x,

                  top:
                    bubble.y,

                  width:
                    bubble.size,

                  height:
                    bubble.size,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.popRing,

                  {
                    width:
                      bubble.size,

                    height:
                      bubble.size,

                    borderRadius:
                      bubble.size /
                      2,

                    opacity:
                      ringOpacity,

                    transform: [
                      {
                        scale:
                          ringScale,
                      },
                    ],
                  },
                ]}
              />


              <Animated.View
                style={[
                  styles.sparkleBurst,

                  {
                    opacity:
                      sparkleOpacity,

                    transform: [
                      {
                        scale:
                          sparkleScale,
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.sparkleDot,
                    styles.sparkleDotOne,
                  ]}
                />

                <View
                  style={[
                    styles.sparkleDot,
                    styles.sparkleDotTwo,
                  ]}
                />

                <View
                  style={[
                    styles.sparkleDot,
                    styles.sparkleDotThree,
                  ]}
                />

                <View
                  style={[
                    styles.sparkleDot,
                    styles.sparkleDotFour,
                  ]}
                />

                <Ionicons
                  name="sparkles"
                  size={30}
                  color={
                    COLORS.white
                  }
                />
              </Animated.View>
            </View>
          )}
        </View>


        {/* =================================================
            BOTTOM PANEL
           ================================================= */}

        <View
          style={
            styles.bottomPanel
          }
        >
          <View
            style={
              styles.popInfo
            }
          >
            <View
              style={
                styles.popIcon
              }
            >
              <Ionicons
                name="water-outline"
                size={18}
                color={
                  COLORS.deepBlue
                }
              />
            </View>


            <View>
              <Text
                style={
                  styles.popNumber
                }
              >
                {popCount}
              </Text>

              <Text
                style={
                  styles.popLabel
                }
              >
                {popCount === 1
                  ? "little pop"
                  : "little pops"}
              </Text>
            </View>
          </View>


          <TouchableOpacity
            style={
              styles.doneButton
            }
            onPress={
              handleFinish
            }
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.doneButtonText
              }
            >
              I'm Done
            </Text>

            <Ionicons
              name="checkmark"
              size={19}
              color={
                COLORS.white
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


/*
 * =========================================================
 * GAME BUBBLE
 * =========================================================
 */

function GameBubble() {
  return (
    <View
      style={
        styles.bubble
      }
    >
      <View
        style={
          styles.bubbleInnerRing
        }
      />


      <View
        style={
          styles.bluePatch
        }
      />

      <View
        style={
          styles.deepPatch
        }
      />

      <View
        style={
          styles.tealPatch
        }
      />

      <View
        style={
          styles.aquaSide
        }
      />

      <View
        style={
          styles.lavenderPatch
        }
      />

      <View
        style={
          styles.yellowPatch
        }
      />


      <View
        style={
          styles.highlightLarge
        }
      />

      <View
        style={
          styles.highlightMedium
        }
      />

      <View
        style={
          styles.highlightTiny
        }
      />


      <View
        style={
          styles.glassOverlay
        }
      />
    </View>
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

      overflow: "hidden",
    },


    /*
     * Background
     */

    backgroundGlowOne: {
      position: "absolute",

      width: 300,

      height: 300,

      borderRadius: 150,

      left: -130,

      top: 145,

      backgroundColor:
        COLORS.lavender,

      opacity: 0.15,
    },

    backgroundGlowTwo: {
      position: "absolute",

      width: 330,

      height: 330,

      borderRadius: 165,

      right: -170,

      top: 360,

      backgroundColor:
        COLORS.aqua,

      opacity: 0.13,
    },

    backgroundGlowThree: {
      position: "absolute",

      width: 260,

      height: 260,

      borderRadius: 130,

      left: 80,

      bottom: -180,

      backgroundColor:
        COLORS.yellow,

      opacity: 0.12,
    },


    /*
     * Header
     */

    header: {
      height: 73,

      paddingHorizontal: 18,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    headerButton: {
      width: 43,

      height: 43,

      borderRadius: 22,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.72)",
    },

    headerCenter: {
      flex: 1,

      alignItems: "center",

      paddingHorizontal: 8,
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 17,

      color:
        COLORS.textPrimary,
    },

    headerSubtitle: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Game
     */

    gameArea: {
      flex: 1,

      position: "relative",

      marginHorizontal:
        GAME_HORIZONTAL_PADDING,

      borderRadius: 35,

      overflow: "hidden",

      backgroundColor:
        "rgba(255,255,255,0.18)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.48)",
    },

    softPrompt: {
      position: "absolute",

      zIndex: 30,

      alignSelf: "center",

      top: 18,

      left: "50%",

      transform: [
        {
          translateX: -58,
        },
      ],

      width: 116,

      height: 34,

      borderRadius: 17,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.65)",
    },

    promptDot: {
      width: 6,

      height: 6,

      borderRadius: 3,

      marginRight: 6,

      backgroundColor:
        COLORS.teal,
    },

    softPromptText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Bubble location
     */

    bubblePosition: {
      position: "absolute",

      zIndex: 10,
    },


    /*
     * Bubble
     */

    bubble: {
      width: "100%",

      height: "100%",

      borderRadius: 999,

      overflow: "hidden",

      backgroundColor:
        "rgba(56,110,138,0.52)",

      borderWidth: 3,

      borderColor:
        "rgba(245,252,255,0.94)",

      shadowColor:
        "#476E82",

      shadowOffset: {
        width: 0,

        height: 5,
      },

      shadowOpacity: 0.13,

      shadowRadius: 8,

      elevation: 3,
    },

    bubbleInnerRing: {
      ...StyleSheet
        .absoluteFillObject,

      borderRadius: 999,

      borderWidth: 5,

      borderColor:
        "rgba(139,211,232,0.30)",
    },

    bluePatch: {
      position: "absolute",

      width: "40%",

      height: "48%",

      left: "17%",

      top: "22%",

      borderRadius: 999,

      backgroundColor:
        "rgba(68,105,184,0.7)",

      transform: [
        {
          rotate:
            "13deg",
        },
      ],
    },

    deepPatch: {
      position: "absolute",

      width: "35%",

      height: "38%",

      right: "18%",

      top: "24%",

      borderRadius: 999,

      backgroundColor:
        "rgba(49,93,128,0.42)",
    },

    tealPatch: {
      position: "absolute",

      width: "55%",

      height: "23%",

      left: "21%",

      bottom: "10%",

      borderRadius: 999,

      backgroundColor:
        "rgba(59,181,153,0.82)",

      transform: [
        {
          rotate:
            "5deg",
        },
      ],
    },

    aquaSide: {
      position: "absolute",

      width: "8%",

      height: "30%",

      left: "6%",

      top: "35%",

      borderRadius: 999,

      backgroundColor:
        "rgba(67,224,222,0.95)",
    },

    lavenderPatch: {
      position: "absolute",

      width: "26%",

      height: "15%",

      right: "5%",

      bottom: "20%",

      borderRadius: 999,

      backgroundColor:
        "rgba(194,158,233,0.92)",

      transform: [
        {
          rotate:
            "-17deg",
        },
      ],
    },

    yellowPatch: {
      position: "absolute",

      width: "10%",

      height: "13%",

      right: "11%",

      top: "34%",

      backgroundColor:
        "rgba(255,248,183,0.94)",

      transform: [
        {
          rotate:
            "2deg",
        },
      ],
    },

    highlightLarge: {
      position: "absolute",

      width: "11%",

      height: "19%",

      left: "18%",

      top: "18%",

      borderRadius: 3,

      backgroundColor:
        "rgba(255,255,255,0.95)",

      transform: [
        {
          rotate:
            "7deg",
        },
      ],
    },

    highlightMedium: {
      position: "absolute",

      width: "7%",

      height: "11%",

      left: "30%",

      top: "16%",

      borderRadius: 3,

      backgroundColor:
        "rgba(255,255,255,0.92)",
    },

    highlightTiny: {
      position: "absolute",

      width: "5%",

      aspectRatio: 1,

      left: "42%",

      top: "51%",

      borderRadius: 999,

      backgroundColor:
        "#FFFFFF",
    },

    glassOverlay: {
      ...StyleSheet
        .absoluteFillObject,

      borderRadius: 999,

      backgroundColor:
        "rgba(255,255,255,0.035)",
    },


    /*
     * Pop effect
     */

    sparkleHolder: {
      position: "absolute",

      zIndex: 25,

      alignItems: "center",

      justifyContent:
        "center",
    },

    popRing: {
      position: "absolute",

      borderWidth: 2,

      borderColor:
        "rgba(255,255,255,0.9)",
    },

    sparkleBurst: {
      width: "100%",

      height: "100%",

      alignItems: "center",

      justifyContent:
        "center",
    },

    sparkleDot: {
      position: "absolute",

      width: 9,

      height: 9,

      borderRadius: 5,

      backgroundColor:
        COLORS.white,
    },

    sparkleDotOne: {
      top: "12%",

      left: "46%",
    },

    sparkleDotTwo: {
      bottom: "15%",

      left: "18%",

      backgroundColor:
        COLORS.aqua,
    },

    sparkleDotThree: {
      right: "13%",

      top: "42%",

      backgroundColor:
        COLORS.lavender,
    },

    sparkleDotFour: {
      left: "16%",

      top: "34%",

      backgroundColor:
        COLORS.yellow,
    },


    /*
     * Bottom
     */

    bottomPanel: {
      minHeight: 110,

      paddingHorizontal: 24,

      paddingVertical: 18,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    popInfo: {
      flexDirection: "row",

      alignItems: "center",
    },

    popIcon: {
      width: 45,

      height: 45,

      borderRadius: 17,

      marginRight: 10,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.7)",
    },

    popNumber: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 18,

      color:
        COLORS.textPrimary,
    },

    popLabel: {
      marginTop: 1,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },

    doneButton: {
      height: 50,

      paddingHorizontal: 21,

      borderRadius: 25,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.deepBlue,
    },

    doneButtonText: {
      marginRight: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13.5,

      color:
        COLORS.white,
    },
  });