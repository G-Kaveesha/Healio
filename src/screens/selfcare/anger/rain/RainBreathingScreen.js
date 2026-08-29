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

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F4F3FF",
  card: "#FFFFFF",

  primary: "#6C63D9",
  primaryDark: "#5148B8",

  blue: "#6F9DE8",

  softPurple: "#EAE6FF",
  softPurpleStrong: "#DDD7FF",

  softBlue: "#E8F1FF",
  softBlueStrong: "#DCE9FF",

  textPrimary: "#28253E",
  textSecondary: "#747088",

  border: "#DDD9F6",

  white: "#FFFFFF",
  disabled: "#BBB7CD",
};

const TOTAL_CYCLES = 3;

const PHASES = {
  INHALE: "inhale",
  EXHALE: "exhale",
};

export default function RainBreathingScreen({
  navigation,
  route,
}) {
  const circleScale = useRef(
    new Animated.Value(1)
  ).current;

  const animationRef = useRef(null);
  const timerRef = useRef(null);

  const [hasStarted, setHasStarted] =
    useState(false);

  const [isComplete, setIsComplete] =
    useState(false);

  const [phase, setPhase] =
    useState(PHASES.INHALE);

  const [secondsLeft, setSecondsLeft] =
    useState(4);

  const [cycle, setCycle] =
    useState(1);

  useEffect(() => {
    return () => {
      clearTimer();

      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetCircle = () => {
    Animated.spring(circleScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animateInhale = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    animationRef.current =
      Animated.timing(circleScale, {
        toValue: 1.38,
        duration: 4000,
        easing: Easing.inOut(
          Easing.ease
        ),
        useNativeDriver: true,
      });

    animationRef.current.start();
  };

  const animateExhale = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    animationRef.current =
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 6000,
        easing: Easing.inOut(
          Easing.ease
        ),
        useNativeDriver: true,
      });

    animationRef.current.start();
  };

  const startPhaseTimer = (
    duration,
    onComplete
  ) => {
    clearTimer();

    setSecondsLeft(duration);

    let remaining = duration;

    timerRef.current = setInterval(
      () => {
        remaining -= 1;

        setSecondsLeft(remaining);

        if (remaining <= 0) {
          clearTimer();
          onComplete();
        }
      },
      1000
    );
  };

  const runInhale = (
    currentCycle
  ) => {
    setPhase(PHASES.INHALE);

    animateInhale();

    startPhaseTimer(4, () => {
      runExhale(currentCycle);
    });
  };

  const runExhale = (
    currentCycle
  ) => {
    setPhase(PHASES.EXHALE);

    animateExhale();

    startPhaseTimer(6, () => {
      if (
        currentCycle >= TOTAL_CYCLES
      ) {
        finishBreathing();
        return;
      }

      const nextCycle =
        currentCycle + 1;

      setCycle(nextCycle);

      runInhale(nextCycle);
    });
  };

  const handleStart = () => {
    clearTimer();

    setHasStarted(true);
    setIsComplete(false);

    setCycle(1);
    setPhase(PHASES.INHALE);
    setSecondsLeft(4);

    circleScale.setValue(1);

    runInhale(1);
  };

  const finishBreathing = () => {
    clearTimer();

    setHasStarted(false);
    setIsComplete(true);

    resetCircle();
  };

  const handleContinue = () => {
    navigation.navigate(
      "RainComplete",
      {
        ...(route?.params || {}),
        breathingCompleted:
          isComplete,
      }
    );
  };

  const handleSkip = () => {
    clearTimer();

    if (animationRef.current) {
      animationRef.current.stop();
    }

    resetCircle();

    navigation.navigate(
      "RainComplete",
      {
        ...(route?.params || {}),
        breathingCompleted: false,
      }
    );
  };

  const getPhaseTitle = () => {
    if (isComplete) {
      return "Well done";
    }

    if (!hasStarted) {
      return "One final pause";
    }

    if (
      phase === PHASES.INHALE
    ) {
      return "Breathe in";
    }

    return "Breathe out";
  };

  const getPhaseMessage = () => {
    if (isComplete) {
      return "Notice how you feel now.";
    }

    if (!hasStarted) {
      return "Take three slow breaths.";
    }

    if (
      phase === PHASES.INHALE
    ) {
      return "Slowly and comfortably.";
    }

    return "Let the breath leave gently.";
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View style={styles.container}>
        {/* Decorative shapes */}
        <View
          style={
            styles.topPurpleShape
          }
        />

        <View
          style={
            styles.bottomBlueShape
          }
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={25}
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
              RAIN
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Final pause
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Small icon */}
          <View
            style={styles.stageBadge}
          >
            <Ionicons
              name="cloud-outline"
              size={18}
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.stageBadgeText
              }
            >
              Slow breathing
            </Text>
          </View>

          <Text style={styles.title}>
            {getPhaseTitle()}
          </Text>

          <Text
            style={
              styles.description
            }
          >
            {getPhaseMessage()}
          </Text>

          {/* Breathing animation */}
          <View
            style={styles.circleArea}
          >
            <View
              style={
                styles.outerGlow
              }
            >
              <Animated.View
                style={[
                  styles.breathCircle,
                  {
                    transform: [
                      {
                        scale:
                          circleScale,
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={
                    styles.innerCircle
                  }
                >
                  {hasStarted ? (
                    <>
                      <Text
                        style={
                          styles.phaseText
                        }
                      >
                        {phase ===
                        PHASES.INHALE
                          ? "Inhale"
                          : "Exhale"}
                      </Text>

                      <Text
                        style={
                          styles.timerNumber
                        }
                      >
                        {secondsLeft}
                      </Text>
                    </>
                  ) : isComplete ? (
                    <Ionicons
                      name="checkmark"
                      size={42}
                      color={
                        COLORS.primary
                      }
                    />
                  ) : (
                    <Ionicons
                      name="leaf-outline"
                      size={38}
                      color={
                        COLORS.primary
                      }
                    />
                  )}
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Cycle indicator */}
          {hasStarted && (
            <View
              style={
                styles.cycleContainer
              }
            >
              <Text
                style={
                  styles.cycleText
                }
              >
                Breath {cycle} of{" "}
                {TOTAL_CYCLES}
              </Text>

              <View
                style={
                  styles.dotContainer
                }
              >
                {Array.from({
                  length: TOTAL_CYCLES,
                }).map(
                  (_, index) => {
                    const isActive =
                      index <
                      cycle;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.dot,

                          isActive &&
                            styles.activeDot,
                        ]}
                      />
                    );
                  }
                )}
              </View>
            </View>
          )}

          {/* Timing reminder */}
          {hasStarted && (
            <View
              style={
                styles.timingCard
              }
            >
              <View
                style={
                  styles.timingItem
                }
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={17}
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={
                    styles.timingText
                  }
                >
                  Inhale 4
                </Text>
              </View>

              <View
                style={
                  styles.timingDivider
                }
              />

              <View
                style={
                  styles.timingItem
                }
              >
                <Ionicons
                  name="arrow-down-outline"
                  size={17}
                  color={
                    COLORS.blue
                  }
                />

                <Text
                  style={
                    styles.timingText
                  }
                >
                  Exhale 6
                </Text>
              </View>
            </View>
          )}

          {/* Start */}
          {!hasStarted &&
            !isComplete && (
              <TouchableOpacity
                style={
                  styles.startButton
                }
                onPress={handleStart}
                activeOpacity={0.85}
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
                    styles.startButtonText
                  }
                >
                  Start Breathing
                </Text>
              </TouchableOpacity>
            )}

          {/* Complete note */}
          {isComplete && (
            <View
              style={
                styles.completeCard
              }
            >
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.completeText
                }
              >
                You gave yourself
                another quiet moment.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom controls */}
        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !isComplete &&
                styles.continueButtonDisabled,
            ]}
            onPress={
              handleContinue
            }
            disabled={!isComplete}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueButtonText,

                !isComplete &&
                  styles.continueButtonTextDisabled,
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

          {!isComplete && (
            <TouchableOpacity
              style={
                styles.skipButton
              }
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.skipText
                }
              >
                Skip for now
              </Text>
            </TouchableOpacity>
          )}
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
      overflow: "hidden",
    },

    /*
     * Decorative background
     */

    topPurpleShape: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor:
        "#E8E3FF",
      top: -150,
      right: -100,
      opacity: 0.75,
    },

    bottomBlueShape: {
      position: "absolute",
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor:
        "#DFEBFF",
      bottom: 20,
      left: -160,
      opacity: 0.6,
    },

    /*
     * Header
     */

    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      paddingHorizontal: 18,
      zIndex: 2,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(255,255,255,0.78)",
    },

    headerCenter: {
      alignItems: "center",
    },

    headerTitle: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 1.2,
      color:
        COLORS.textPrimary,
    },

    headerSubtitle: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: "600",
      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    /*
     * Main
     */

    content: {
      flex: 1,
      paddingHorizontal: 26,
      paddingTop: 30,
      alignItems: "center",
    },

    stageBadge: {
      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 15,
      paddingVertical: 9,

      borderRadius: 22,

      backgroundColor:
        COLORS.softPurple,
    },

    stageBadgeText: {
      marginLeft: 7,

      fontSize: 13,
      fontWeight: "700",

      color:
        COLORS.primaryDark,
    },

    title: {
      marginTop: 25,

      fontSize: 29,
      lineHeight: 36,
      fontWeight: "800",

      color:
        COLORS.textPrimary,

      textAlign: "center",
    },

    description: {
      marginTop: 9,

      fontSize: 15,
      lineHeight: 22,

      color:
        COLORS.textSecondary,

      textAlign: "center",
    },

    /*
     * Circle
     */

    circleArea: {
      marginTop: 50,

      width: 260,
      height: 260,

      alignItems: "center",
      justifyContent: "center",
    },

    outerGlow: {
      width: 230,
      height: 230,

      borderRadius: 115,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(220,233,255,0.65)",
    },

    breathCircle: {
      width: 165,
      height: 165,

      borderRadius: 83,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.softPurple,
    },

    innerCircle: {
      width: 125,
      height: 125,

      borderRadius: 63,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.card,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.07,
      shadowRadius: 10,

      elevation: 3,
    },

    phaseText: {
      fontSize: 15,
      fontWeight: "700",

      color:
        COLORS.textSecondary,
    },

    timerNumber: {
      marginTop: 3,

      fontSize: 38,
      fontWeight: "800",

      color:
        COLORS.primaryDark,
    },

    /*
     * Cycle
     */

    cycleContainer: {
      marginTop: 22,
      alignItems: "center",
    },

    cycleText: {
      fontSize: 13,
      fontWeight: "600",

      color:
        COLORS.textSecondary,
    },

    dotContainer: {
      marginTop: 9,

      flexDirection: "row",
      alignItems: "center",
    },

    dot: {
      width: 8,
      height: 8,

      marginHorizontal: 4,

      borderRadius: 4,

      backgroundColor:
        COLORS.border,
    },

    activeDot: {
      width: 20,

      backgroundColor:
        COLORS.primary,
    },

    /*
     * Timing
     */

    timingCard: {
      marginTop: 20,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 18,
      paddingVertical: 10,

      borderRadius: 22,

      backgroundColor:
        COLORS.card,

      borderWidth: 1,
      borderColor:
        COLORS.border,
    },

    timingItem: {
      flexDirection: "row",
      alignItems: "center",
    },

    timingText: {
      marginLeft: 5,

      fontSize: 12.5,
      fontWeight: "600",

      color:
        COLORS.textSecondary,
    },

    timingDivider: {
      width: 1,
      height: 18,

      marginHorizontal: 15,

      backgroundColor:
        COLORS.border,
    },

    /*
     * Start
     */

    startButton: {
      marginTop: 30,

      height: 50,

      paddingHorizontal: 24,

      borderRadius: 25,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.primary,
    },

    startButtonText: {
      marginLeft: 8,

      fontSize: 14,
      fontWeight: "700",

      color: COLORS.white,
    },

    /*
     * Complete
     */

    completeCard: {
      marginTop: 28,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 17,
      paddingVertical: 11,

      borderRadius: 21,

      backgroundColor:
        COLORS.softBlue,
    },

    completeText: {
      marginLeft: 7,

      fontSize: 13,
      fontWeight: "600",

      color:
        COLORS.textSecondary,
    },

    /*
     * Bottom controls
     */

    bottomContainer: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 16,

      backgroundColor:
        COLORS.background,
    },

    continueButton: {
      height: 58,

      borderRadius: 19,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.primary,

      shadowColor:
        COLORS.primary,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.18,
      shadowRadius: 10,

      elevation: 4,
    },

    continueButtonDisabled: {
      backgroundColor:
        "#E3E0ED",

      shadowOpacity: 0,
      elevation: 0,
    },

    continueButtonText: {
      marginRight: 9,

      fontSize: 16,
      fontWeight: "700",

      color: COLORS.white,
    },

    continueButtonTextDisabled: {
      color: COLORS.disabled,
    },

    skipButton: {
      alignSelf: "center",

      marginTop: 4,

      paddingHorizontal: 20,
      paddingVertical: 11,
    },

    skipText: {
      fontSize: 13.5,
      fontWeight: "600",

      color:
        COLORS.textSecondary,
    },
  });