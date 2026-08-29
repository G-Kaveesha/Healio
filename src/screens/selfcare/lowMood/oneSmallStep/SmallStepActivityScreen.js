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
  background: "#F8FAF7",
  card: "#FFFFFF",

  primary: "#E0A92F",
  primaryDark: "#B67F15",

  softYellow: "#FFF3C9",
  softBlue: "#E9F3FA",
  softLavender: "#F0ECFA",
  softGreen: "#E8F3E7",

  textPrimary: "#303238",
  textSecondary: "#74767D",

  border: "#E8E5DD",

  white: "#FFFFFF",
};

const TOTAL_SECONDS = 5 * 60;

export default function SmallStepActivityScreen({
  navigation,
  route,
}) {
  const selectedStep =
    route?.params?.selectedStep;

  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(
    TOTAL_SECONDS
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

  const pulseScale = useRef(
    new Animated.Value(1)
  ).current;

  const pulseRef =
    useRef(null);

  /*
   * Timer
   */

  useEffect(() => {
    if (
      !hasStarted ||
      isPaused ||
      isComplete
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setSecondsLeft(
          (previous) => {
            if (
              previous <= 1
            ) {
              clearInterval(
                timer
              );

              setIsComplete(
                true
              );

              setHasStarted(
                false
              );

              stopPulse();

              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    hasStarted,
    isPaused,
    isComplete,
  ]);

  useEffect(() => {
    return () => {
      if (
        pulseRef.current
      ) {
        pulseRef.current.stop();
      }
    };
  }, []);

  const startPulse = () => {
    if (
      pulseRef.current
    ) {
      pulseRef.current.stop();
    }

    pulseRef.current =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            pulseScale,
            {
              toValue: 1.05,
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
            pulseScale,
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
        ])
      );

    pulseRef.current.start();
  };

  const stopPulse = () => {
    if (
      pulseRef.current
    ) {
      pulseRef.current.stop();
    }

    Animated.spring(
      pulseScale,
      {
        toValue: 1,
        useNativeDriver: true,
      }
    ).start();
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsPaused(false);

    startPulse();
  };

  const handlePauseResume =
    () => {
      if (!hasStarted) {
        return;
      }

      if (isPaused) {
        setIsPaused(false);
        startPulse();
      } else {
        setIsPaused(true);
        stopPulse();
      }
    };

  const completeEarly = () => {
    setIsComplete(true);
    setHasStarted(false);
    setIsPaused(false);

    stopPulse();
  };

  const handleContinue = () => {
    navigation.navigate(
      "SmallStepComplete",
      {
        ...(route?.params || {}),

        completedStep:
          selectedStep,

        finishedTimer:
          secondsLeft === 0,
      }
    );
  };

  const formatTime = (
    totalSeconds
  ) => {
    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
        <View
          style={styles.yellowShape}
        />

        <View
          style={styles.blueShape}
        />

        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={27}
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
          >
            One Small Step
          </Text>

          <TouchableOpacity
            style={
              styles.pauseButton
            }
            onPress={
              handlePauseResume
            }
            disabled={!hasStarted}
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
                  ? COLORS.primaryDark
                  : "#C3C0B8"
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View
            style={
              styles.smallBadge
            }
          >
            <Ionicons
              name="footsteps-outline"
              size={17}
              color={
                COLORS.primaryDark
              }
            />

            <Text
              style={
                styles.smallBadgeText
              }
            >
              Your small step
            </Text>
          </View>

          <Text style={styles.title}>
            {selectedStep?.title ||
              "Take one small step"}
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Give this a few minutes.
            There's no need to rush.
          </Text>

          {/* Timer */}

          <View
            style={
              styles.timerArea
            }
          >
            <View
              style={
                styles.outerCircle
              }
            >
              <Animated.View
                style={[
                  styles.middleCircle,

                  {
                    transform: [
                      {
                        scale:
                          pulseScale,
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
                  {isComplete ? (
                    <Ionicons
                      name="checkmark"
                      size={46}
                      color={
                        COLORS.primaryDark
                      }
                    />
                  ) : (
                    <>
                      <Text
                        style={
                          styles.timerText
                        }
                      >
                        {formatTime(
                          secondsLeft
                        )}
                      </Text>

                      <Text
                        style={
                          styles.timerLabel
                        }
                      >
                        {isPaused
                          ? "paused"
                          : hasStarted
                          ? "take your time"
                          : "ready"}
                      </Text>
                    </>
                  )}
                </View>
              </Animated.View>
            </View>
          </View>

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

          {isPaused && (
            <View
              style={
                styles.messageCard
              }
            >
              <Text
                style={
                  styles.messageText
                }
              >
                Paused. Continue when
                you're ready.
              </Text>
            </View>
          )}

          {hasStarted &&
            !isPaused &&
            !isComplete && (
              <TouchableOpacity
                style={
                  styles.doneEarlyButton
                }
                onPress={
                  completeEarly
                }
                activeOpacity={0.75}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color={
                    COLORS.lavender
                  }
                />

                <Text
                  style={
                    styles.doneEarlyText
                  }
                >
                  I've done my step
                </Text>
              </TouchableOpacity>
            )}

          {isComplete && (
            <View
              style={
                styles.completeCard
              }
            >
              <Ionicons
                name="sparkles-outline"
                size={19}
                color={
                  COLORS.primaryDark
                }
              />

              <Text
                style={
                  styles.completeText
                }
              >
                You did something even
                when your energy was low.
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
            disabled={!isComplete}
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
                  : "#BDBAB3"
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
      overflow: "hidden",
    },

    yellowShape: {
      position: "absolute",

      width: 260,
      height: 260,

      borderRadius: 130,

      top: -155,
      right: -100,

      backgroundColor:
        "#FFF0BA",

      opacity: 0.65,
    },

    blueShape: {
      position: "absolute",

      width: 260,
      height: 260,

      borderRadius: 130,

      bottom: 30,
      left: -175,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.7,
    },

    header: {
      height: 62,

      paddingHorizontal: 18,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    backButton: {
      width: 42,
      height: 42,

      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 17,

      color:
        COLORS.textPrimary,
    },

    pauseButton: {
      width: 42,
      height: 42,

      borderRadius: 21,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        "rgba(255,255,255,0.75)",
    },

    content: {
      flex: 1,

      paddingHorizontal: 25,
      paddingTop: 35,

      alignItems: "center",
    },

    smallBadge: {
      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 14,
      paddingVertical: 8,

      borderRadius: 19,

      backgroundColor:
        COLORS.softYellow,
    },

    smallBadgeText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12.5,

      color:
        COLORS.primaryDark,
    },

    title: {
      marginTop: 25,

      maxWidth: 330,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 28,
      lineHeight: 35,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 10,

      maxWidth: 300,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14.5,
      lineHeight: 21,

      textAlign: "center",

      color:
        COLORS.textSecondary,
    },

    timerArea: {
      marginTop: 45,

      width: 250,
      height: 250,

      alignItems: "center",
      justifyContent: "center",
    },

    outerCircle: {
      width: 225,
      height: 225,

      borderRadius: 113,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.softBlue,
    },

    middleCircle: {
      width: 176,
      height: 176,

      borderRadius: 88,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.softYellow,
    },

    innerCircle: {
      width: 130,
      height: 130,

      borderRadius: 65,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.card,

      elevation: 3,
    },

    timerText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 35,

      color:
        COLORS.primaryDark,
    },

    timerLabel: {
      marginTop: 5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      color:
        COLORS.textSecondary,
    },

    startButton: {
      marginTop: 29,

      minWidth: 120,
      height: 50,

      paddingHorizontal: 23,

      borderRadius: 25,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.primary,
    },

    startText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.white,
    },

    messageCard: {
      marginTop: 25,

      paddingHorizontal: 17,
      paddingVertical: 11,

      borderRadius: 20,

      backgroundColor:
        COLORS.softLavender,
    },

    messageText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      color:
        COLORS.textSecondary,
    },

    doneEarlyButton: {
      marginTop: 27,

      paddingHorizontal: 18,
      paddingVertical: 10,

      flexDirection: "row",
      alignItems: "center",

      borderRadius: 20,

      backgroundColor:
        COLORS.softLavender,
    },

    doneEarlyText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13,

      color:
        COLORS.lavender,
    },

    completeCard: {
      marginTop: 27,

      paddingHorizontal: 17,
      paddingVertical: 11,

      flexDirection: "row",
      alignItems: "center",

      borderRadius: 20,

      backgroundColor:
        COLORS.softGreen,
    },

    completeText: {
      flex: 1,

      marginLeft: 8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,
      lineHeight: 18,

      color:
        COLORS.textSecondary,
    },

    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 18,
    },

    continueButton: {
      height: 58,

      borderRadius: 19,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.primary,
    },

    disabledButton: {
      backgroundColor:
        "#E4E2DA",
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
        "#BDBAB3",
    },
  });