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
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";


const COLORS = {
  background: "#FFF9F0",
  card: "#FFFFFF",

  yellow: "#FFE9A8",
  yellowStrong: "#F0C85C",

  peach: "#F7C8A0",
  coral: "#F29B82",

  softBlue: "#DFF1F7",
  blue: "#78AFC4",

  textPrimary: "#3C3934",
  textSecondary: "#7A746C",

  white: "#FFFFFF",
  disabled: "#BBB4AC",
};


const PHASES = [
  {
    id: "notice",
    title: "Notice",
    prompt:
      "What feels good about this moment?",
    helper:
      "Look for one detail.",
    icon:
      "eye-outline",
    seconds: 20,
    color:
      "#FFE9A8",
  },

  {
    id: "stay",
    title: "Stay",
    prompt:
      "Let yourself enjoy it for a little longer.",
    helper:
      "Nothing to do. Just stay here.",
    icon:
      "heart-outline",
    seconds: 20,
    color:
      "#F7C8A0",
  },

  {
    id: "keep",
    title: "Keep",
    prompt:
      "What would you like to remember?",
    helper:
      "Choose one small part of it.",
    icon:
      "bookmark-outline",
    seconds: 20,
    color:
      "#DFF1F7",
  },
];


export default function HoldTheMomentSavorScreen({
  navigation,
  route,
}) {
  const selectedMoment =
    route?.params
      ?.selectedMoment;


  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(
    PHASES[0].seconds
  );

  const [
    hasStarted,
    setHasStarted,
  ] = useState(false);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);

  const [
    isComplete,
    setIsComplete,
  ] = useState(false);


  const currentPhase =
    PHASES[currentIndex];


  const glowScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const floatY =
    useRef(
      new Animated.Value(0)
    ).current;

  const animationRef =
    useRef(null);


  const startAnimation =
    () => {
      if (
        animationRef.current
      ) {
        animationRef.current.stop();
      }

      animationRef.current =
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(
                glowScale,
                {
                  toValue: 1.08,
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
                glowScale,
                {
                  toValue: 1,
                  duration: 1800,
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
            ]),
          ])
        );

      animationRef.current.start();
    };


  const stopAnimation =
    () => {
      if (
        animationRef.current
      ) {
        animationRef.current.stop();
      }
    };


  useEffect(() => {
    if (
      hasStarted &&
      !isPaused &&
      !isComplete
    ) {
      startAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [
    hasStarted,
    isPaused,
    isComplete,
    currentIndex,
  ]);


  useEffect(() => {
    if (
      !hasStarted ||
      isPaused ||
      isComplete
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setSecondsLeft(
          (
            previous
          ) => {
            if (
              previous > 1
            ) {
              return (
                previous - 1
              );
            }

            if (
              currentIndex <
              PHASES.length -
                1
            ) {
              const nextIndex =
                currentIndex +
                1;

              setCurrentIndex(
                nextIndex
              );

              return (
                PHASES[
                  nextIndex
                ].seconds
              );
            }

            setHasStarted(
              false
            );

            setIsComplete(
              true
            );

            stopAnimation();

            return 0;
          }
        );
      }, 1000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    hasStarted,
    isPaused,
    isComplete,
    currentIndex,
  ]);


  const handleStart =
    () => {
      setCurrentIndex(0);

      setSecondsLeft(
        PHASES[0].seconds
      );

      setIsPaused(false);

      setIsComplete(false);

      setHasStarted(true);
    };


  const handlePauseResume =
    () => {
      if (
        !hasStarted
      ) {
        return;
      }

      if (isPaused) {
        setIsPaused(false);
      } else {
        setIsPaused(true);

        stopAnimation();
      }
    };


  const handleSkip =
    () => {
      if (
        currentIndex <
        PHASES.length - 1
      ) {
        const nextIndex =
          currentIndex + 1;

        setCurrentIndex(
          nextIndex
        );

        setSecondsLeft(
          PHASES[
            nextIndex
          ].seconds
        );

        return;
      }

      setHasStarted(false);

      setIsComplete(true);

      stopAnimation();
    };


  const handleContinue =
    () => {
      navigation.navigate(
        "HoldTheMomentComplete",
        {
          ...(route?.params ||
            {}),

          completedSavor:
            true,
        }
      );
    };


  const phaseProgress =
    isComplete
      ? 100
      : (
          (
            currentPhase
              .seconds -
            secondsLeft
          ) /
          currentPhase
            .seconds
        ) * 100;


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
        {/* Header */}

        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={() =>
              navigation.goBack()
            }
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
              Hold the Moment
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {isComplete
                ? "Complete"
                : `${currentIndex + 1} of ${PHASES.length}`}
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={
              handlePauseResume
            }
            disabled={
              !hasStarted
            }
          >
            <Ionicons
              name={
                isPaused
                  ? "play"
                  : "pause"
              }
              size={19}
              color={
                hasStarted
                  ? COLORS.coral
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>
        </View>


        {/* Progress */}

        <View
          style={
            styles.progressRow
          }
        >
          {PHASES.map(
            (
              item,
              index
            ) => (
              <View
                key={
                  item.id
                }
                style={[
                  styles.progressPill,

                  index <=
                    currentIndex &&
                    styles.activeProgressPill,
                ]}
              />
            )
          )}
        </View>


        <View
          style={
            styles.content
          }
        >
          {!isComplete && (
            <>
              <Text
                style={
                  styles.momentLabel
                }
              >
                {selectedMoment
                  ?.title ||
                  "Your good moment"}
              </Text>


              <View
                style={[
                  styles.phaseChip,

                  {
                    backgroundColor:
                      currentPhase.color,
                  },
                ]}
              >
                <Ionicons
                  name={
                    currentPhase.icon
                  }
                  size={17}
                  color={
                    COLORS.textPrimary
                  }
                />

                <Text
                  style={
                    styles.phaseChipText
                  }
                >
                  {
                    currentPhase.title
                  }
                </Text>
              </View>


              <Text
                style={
                  styles.prompt
                }
              >
                {
                  currentPhase.prompt
                }
              </Text>


              <Text
                style={
                  styles.helper
                }
              >
                {
                  currentPhase.helper
                }
              </Text>
            </>
          )}


          {/* Visual */}

          <View
            style={
              styles.visualArea
            }
          >
            <View
              style={
                styles.visualBackdrop
              }
            />

            <Animated.View
              style={[
                styles.glow,
                {
                  backgroundColor:
                    currentPhase
                      ?.color ||
                    COLORS.yellow,

                  transform: [
                    {
                      scale:
                        glowScale,
                    },
                  ],
                },
              ]}
            />

            <Animated.View
              style={{
                transform: [
                  {
                    translateY:
                      floatY,
                  },
                ],
              }}
            >
              <View
                style={
                  styles.centerCard
                }
              >
                <Ionicons
                  name={
                    isComplete
                      ? "checkmark"
                      : currentPhase.icon
                  }
                  size={46}
                  color={
                    isComplete
                      ? COLORS.coral
                      : COLORS.textPrimary
                  }
                />

                {!isComplete && (
                  <>
                    <Text
                      style={
                        styles.timer
                      }
                    >
                      {
                        secondsLeft
                      }
                    </Text>

                    <Text
                      style={
                        styles.timerLabel
                      }
                    >
                      seconds
                    </Text>
                  </>
                )}
              </View>
            </Animated.View>
          </View>


          {/* Thin phase bar */}

          {!isComplete && (
            <View
              style={
                styles.phaseTimerArea
              }
            >
              <View
                style={
                  styles.phaseTimerTrack
                }
              >
                <View
                  style={[
                    styles.phaseTimerFill,

                    {
                      width:
                        `${Math.max(
                          0,
                          Math.min(
                            100,
                            phaseProgress
                          )
                        )}%`,

                      backgroundColor:
                        currentPhase
                          .id ===
                        "notice"
                          ? COLORS.yellowStrong
                          : currentPhase
                              .id ===
                            "stay"
                          ? COLORS.coral
                          : COLORS.blue,
                    },
                  ]}
                />
              </View>
            </View>
          )}


          {!hasStarted &&
            !isComplete && (
              <TouchableOpacity
                style={
                  styles.startButton
                }
                onPress={
                  handleStart
                }
              >
                <Ionicons
                  name="play"
                  size={18}
                  color={
                    COLORS.white
                  }
                />

                <Text
                  style={
                    styles.startText
                  }
                >
                  Start
                </Text>
              </TouchableOpacity>
            )}


          {hasStarted &&
            !isComplete && (
              <TouchableOpacity
                style={
                  styles.skipButton
                }
                onPress={
                  handleSkip
                }
              >
                <Text
                  style={
                    styles.skipText
                  }
                >
                  Next
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={
                    COLORS.blue
                  }
                />
              </TouchableOpacity>
            )}


          {isComplete && (
            <View
              style={
                styles.completeBox
              }
            >
              <Ionicons
                name="sparkles-outline"
                size={19}
                color={
                  COLORS.coral
                }
              />

              <Text
                style={
                  styles.completeText
                }
              >
                You gave this moment a
                little more space.
              </Text>
            </View>
          )}
        </View>


        {/* Bottom */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !isComplete &&
                styles.disabledButton,
            ]}
            disabled={
              !isComplete
            }
            onPress={
              handleContinue
            }
          >
            <Text
              style={[
                styles.continueText,

                !isComplete &&
                  styles.disabledText,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                isComplete
                  ? COLORS.white
                  : COLORS.disabled
              }
            />
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
      paddingHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    headerButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "rgba(255,255,255,0.8)",
    },

    headerCenter: {
      alignItems: "center",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 16,
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

    progressRow: {
      paddingHorizontal: 24,
      paddingTop: 5,
      flexDirection: "row",
      gap: 7,
    },

    progressPill: {
      flex: 1,
      height: 6,
      borderRadius: 20,
      backgroundColor:
        "#E9E1D9",
    },

    activeProgressPill: {
      backgroundColor:
        COLORS.coral,
    },

    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 25,
      alignItems: "center",
    },

    momentLabel: {
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 12,
      color:
        COLORS.textSecondary,
    },

    phaseChip: {
      marginTop: 13,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
    },

    phaseChipText: {
      marginLeft: 6,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 12,
      color:
        COLORS.textPrimary,
    },

    prompt: {
      maxWidth: 330,
      marginTop: 20,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 28,
      lineHeight: 34,
      textAlign: "center",
      color:
        COLORS.textPrimary,
    },

    helper: {
      marginTop: 7,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 13,
      color:
        COLORS.textSecondary,
    },

    visualArea: {
      flex: 1,
      minHeight: 300,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    visualBackdrop: {
      position: "absolute",
      width: 270,
      height: 270,
      borderRadius: 135,
      backgroundColor:
        COLORS.softBlue,
      opacity: 0.58,
    },

    glow: {
      position: "absolute",
      width: 215,
      height: 215,
      borderRadius: 108,
      opacity: 0.7,
    },

    centerCard: {
      width: 145,
      height: 165,
      borderRadius: 34,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.white,
      elevation: 5,
      shadowColor:
        "#B9A58D",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.12,
      shadowRadius: 11,
    },

    timer: {
      marginTop: 8,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 32,
      color:
        COLORS.textPrimary,
    },

    timerLabel: {
      marginTop: 1,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 10.5,
      color:
        COLORS.textSecondary,
    },

    phaseTimerArea: {
      width: "100%",
      marginBottom: 18,
    },

    phaseTimerTrack: {
      height: 8,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor:
        "#E9E1D9",
    },

    phaseTimerFill: {
      height: "100%",
      borderRadius: 20,
    },

    startButton: {
      height: 50,
      paddingHorizontal: 26,
      borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.coral,
    },

    startText: {
      marginLeft: 7,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 15,
      color:
        COLORS.white,
    },

    skipButton: {
      height: 42,
      paddingHorizontal: 18,
      borderRadius: 21,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.softBlue,
    },

    skipText: {
      marginRight: 6,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 12.5,
      color:
        COLORS.blue,
    },

    completeBox: {
      width: "100%",
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.yellow,
    },

    completeText: {
      marginLeft: 7,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 12.5,
      color:
        COLORS.textSecondary,
    },

    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 17,
    },

    continueButton: {
      height: 58,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.coral,
    },

    disabledButton: {
      backgroundColor:
        "#E8E1DA",
    },

    continueText: {
      marginRight: 8,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 16,
      color:
        COLORS.white,
    },

    disabledText: {
      color:
        COLORS.disabled,
    },
  });