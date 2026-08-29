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

import {
  useAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

const COLORS = {
  background: "#F4F3FF",
  card: "#FFFFFF",

  primary: "#6C63D9",
  primaryDark: "#5148B8",

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

const TOTAL_SECONDS = 30;

/*
 * Change this path only if your
 * audio file is stored somewhere else.
 */
const RAIN_ALLOW_AUDIO = require(
  "../../../../../assets/audio/selfcare/rain_allow.mp3"
);

export default function RainAllowScreen({
  navigation,
  route,
}) {
  const recognizedEmotion =
    route?.params?.recognizedEmotion || null;

  /*
   * -----------------------------
   * AUDIO PLAYER
   * -----------------------------
   */

  const player = useAudioPlayer(
    RAIN_ALLOW_AUDIO,
    {
      updateInterval: 500,
      downloadFirst: true,
    }
  );

  /*
   * -----------------------------
   * STATES
   * -----------------------------
   */

  const [secondsLeft, setSecondsLeft] =
    useState(TOTAL_SECONDS);

  const [hasStarted, setHasStarted] =
    useState(false);

  const [isComplete, setIsComplete] =
    useState(false);

  /*
   * -----------------------------
   * REFS
   * -----------------------------
   */

  const circleScale = useRef(
    new Animated.Value(1)
  ).current;

  const pulseAnimation =
    useRef(null);

  /*
   * -----------------------------
   * CONFIGURE AUDIO
   * -----------------------------
   */

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: "doNotMix",
        });
      } catch (error) {
        console.log(
          "RAIN audio mode error:",
          error
        );
      }
    };

    configureAudio();
  }, []);

  /*
   * -----------------------------
   * AUDIO HELPERS
   * -----------------------------
   */

  const stopAudio = () => {
    try {
      if (player) {
        player.pause();
      }
    } catch (error) {
      console.log(
        "RAIN audio pause error:",
        error
      );
    }
  };

  const playGentleAudio = async () => {
    try {
      /*
       * Stop first in case
       * playback was already active.
       */
      player.pause();

      /*
       * Restart from beginning.
       */
      await player.seekTo(0);

      /*
       * No looping needed because
       * the sound only needs to play
       * during this 30-second stage.
       */
      player.loop = false;

      /*
       * Keep volume low and gentle.
       */
      player.volume = 0.22;

      /*
       * Start playback.
       */
      player.play();
    } catch (error) {
      console.log(
        "RAIN audio playback error:",
        error
      );
    }
  };

  /*
   * -----------------------------
   * SCREEN CLEANUP
   * -----------------------------
   */

  useEffect(() => {
    return () => {
      /*
       * Stop pulse animation
       * when leaving the screen.
       */
      if (pulseAnimation.current) {
        pulseAnimation.current.stop();
      }

      /*
       * Stop music when leaving
       * the screen.
       */
      try {
        player.pause();
      } catch (error) {
        console.log(
          "RAIN cleanup audio error:",
          error
        );
      }
    };
  }, [player]);

  /*
   * -----------------------------
   * 30 SECOND ALLOW TIMER
   * -----------------------------
   */

  useEffect(() => {
    if (
      !hasStarted ||
      isComplete
    ) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(
        (previousSeconds) => {
          if (
            previousSeconds <= 1
          ) {
            clearInterval(timer);

            setIsComplete(true);
            setHasStarted(false);

            /*
             * Stop the music exactly
             * when the 30-second
             * activity finishes.
             */
            stopAudio();

            /*
             * Stop pulse animation.
             */
            if (
              pulseAnimation.current
            ) {
              pulseAnimation.current.stop();
            }

            /*
             * Return the circle
             * to normal size.
             */
            Animated.spring(
              circleScale,
              {
                toValue: 1,
                useNativeDriver: true,
              }
            ).start();

            return 0;
          }

          return (
            previousSeconds - 1
          );
        }
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    hasStarted,
    isComplete,
    circleScale,
  ]);

  /*
   * -----------------------------
   * PULSE ANIMATION
   * -----------------------------
   */

  const startPulseAnimation = () => {
    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
    }

    circleScale.setValue(1);

    pulseAnimation.current =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            circleScale,
            {
              toValue: 1.08,

              duration: 2200,

              easing: Easing.inOut(
                Easing.ease
              ),

              useNativeDriver: true,
            }
          ),

          Animated.timing(
            circleScale,
            {
              toValue: 1,

              duration: 2200,

              easing: Easing.inOut(
                Easing.ease
              ),

              useNativeDriver: true,
            }
          ),
        ])
      );

    pulseAnimation.current.start();
  };

  /*
   * -----------------------------
   * START ACTIVITY
   * -----------------------------
   */

  const handleStart = async () => {
    if (hasStarted) {
      return;
    }

    setSecondsLeft(
      TOTAL_SECONDS
    );

    setIsComplete(false);
    setHasStarted(true);

    startPulseAnimation();

    /*
     * Start music at the same
     * time as the 30-second pause.
     */
    await playGentleAudio();
  };

  /*
   * -----------------------------
   * CONTINUE
   * -----------------------------
   */

  const handleContinue = () => {
    stopAudio();

    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
    }

    navigation.navigate(
      "RainInvestigate",
      {
        ...(route?.params || {}),
      }
    );
  };

  /*
   * -----------------------------
   * SKIP
   * -----------------------------
   */

  const handleSkip = () => {
    stopAudio();

    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
    }

    navigation.navigate(
      "RainInvestigate",
      {
        ...(route?.params || {}),
      }
    );
  };

  /*
   * -----------------------------
   * BACK
   * -----------------------------
   */

  const handleBack = () => {
    stopAudio();

    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
    }

    navigation.goBack();
  };

  /*
   * -----------------------------
   * SUPPORTIVE PHRASE
   * -----------------------------
   */

  const getMainPhrase = () => {
    if (isComplete) {
      return "You gave the feeling a little space.";
    }

    if (!hasStarted) {
      return "Let the feeling be here for a moment.";
    }

    if (secondsLeft > 20) {
      return "You don't need to change it.";
    }

    if (secondsLeft > 10) {
      return "You don't need to react right now.";
    }

    return "Just stay with this moment.";
  };

  /*
   * -----------------------------
   * UI
   * -----------------------------
   */

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
        {/* Decorative background */}

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
            onPress={handleBack}
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
                styles.headerProgress
              }
            >
              2 of 4
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        {/* Progress bar */}

        <View
          style={
            styles.progressContainer
          }
        >
          <View
            style={
              styles.progressTrack
            }
          >
            <View
              style={
                styles.progressFill
              }
            />
          </View>
        </View>

        {/* Main content */}

        <View style={styles.content}>
          {/* Stage badge */}

          <View
            style={
              styles.stageBadge
            }
          >
            <View
              style={
                styles.stageLetterCircle
              }
            >
              <Text
                style={
                  styles.stageLetter
                }
              >
                A
              </Text>
            </View>

            <Text
              style={
                styles.stageBadgeText
              }
            >
              Allow
            </Text>
          </View>

          {/* Title */}

          <Text style={styles.title}>
            Give it a little space
          </Text>

          {/* Emotion reflection */}

          {recognizedEmotion?.label ? (
            <Text
              style={
                styles.description
              }
            >
              You noticed{" "}

              <Text
                style={
                  styles.emotionText
                }
              >
                {
                  recognizedEmotion.label
                }
              </Text>

              . You don't need to push
              it away.
            </Text>
          ) : (
            <Text
              style={
                styles.description
              }
            >
              Whatever you're noticing
              can be here for a moment.
            </Text>
          )}

          {/* Animated calm circle */}

          <View
            style={
              styles.circleArea
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
                          styles.timerNumber
                        }
                      >
                        {secondsLeft}
                      </Text>

                      <Text
                        style={
                          styles.timerLabel
                        }
                      >
                        seconds
                      </Text>
                    </>
                  ) : isComplete ? (
                    <Ionicons
                      name="checkmark"
                      size={38}
                      color={
                        COLORS.primary
                      }
                    />
                  ) : (
                    <Ionicons
                      name="pause-outline"
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

          {/* Changing phrase */}

          <Text
            style={
              styles.calmPhrase
            }
          >
            {getMainPhrase()}
          </Text>

          {/* Helper */}

          {!hasStarted &&
            !isComplete && (
              <Text
                style={
                  styles.helperText
                }
              >
                Take 30 quiet seconds.
              </Text>
            )}

          {/* Start button */}

          {!hasStarted &&
            !isComplete && (
              <TouchableOpacity
                style={
                  styles.startButton
                }
                onPress={
                  handleStart
                }
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
                  Start Pause
                </Text>
              </TouchableOpacity>
            )}

          {/* During timer */}

          {hasStarted && (
            <View
              style={
                styles.activeMessage
              }
            >
              <Ionicons
                name="musical-notes-outline"
                size={18}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.activeMessageText
                }
              >
                Stay here for a moment.
              </Text>
            </View>
          )}

          {/* Complete */}

          {isComplete && (
            <View
              style={
                styles.completeMessage
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
                  styles.completeMessageText
                }
              >
                That's enough for now.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom actions */}

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
              onPress={
                handleSkip
              }
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

    topPurpleShape: {
      position: "absolute",
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor:
        "#E8E3FF",
      top: -140,
      right: -95,
      opacity: 0.75,
    },

    bottomBlueShape: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor:
        "#DFEBFF",
      bottom: 20,
      left: -155,
      opacity: 0.6,
    },

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

    headerProgress: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: "600",
      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    progressContainer: {
      paddingHorizontal: 24,
      paddingBottom: 4,
    },

    progressTrack: {
      height: 5,
      borderRadius: 3,
      backgroundColor:
        COLORS.border,
      overflow: "hidden",
    },

    progressFill: {
      width: "50%",
      height: "100%",
      borderRadius: 3,
      backgroundColor:
        COLORS.primary,
    },

    content: {
      flex: 1,
      paddingHorizontal: 26,
      paddingTop: 26,
      alignItems: "center",
    },

    stageBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 16,
      borderRadius: 24,
      backgroundColor:
        COLORS.softPurple,
    },

    stageLetterCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.softPurpleStrong,
    },

    stageLetter: {
      fontSize: 17,
      fontWeight: "800",
      color:
        COLORS.primaryDark,
    },

    stageBadgeText: {
      marginLeft: 9,
      fontSize: 13,
      fontWeight: "700",
      color:
        COLORS.primaryDark,
    },

    title: {
      marginTop: 25,
      fontSize: 28,
      lineHeight: 35,
      fontWeight: "800",
      color:
        COLORS.textPrimary,
      textAlign: "center",
    },

    description: {
      maxWidth: 330,
      marginTop: 11,
      fontSize: 15,
      lineHeight: 23,
      color:
        COLORS.textSecondary,
      textAlign: "center",
    },

    emotionText: {
      color:
        COLORS.primaryDark,
      fontWeight: "700",
    },

    circleArea: {
      marginTop: 42,
      alignItems: "center",
      justifyContent: "center",
    },

    outerCircle: {
      width: 190,
      height: 190,
      borderRadius: 95,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        "rgba(232,241,255,0.7)",
    },

    middleCircle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        COLORS.softPurple,
    },

    innerCircle: {
      width: 112,
      height: 112,
      borderRadius: 56,
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

    timerNumber: {
      fontSize: 34,
      fontWeight: "800",
      color:
        COLORS.primaryDark,
    },

    timerLabel: {
      marginTop: 1,
      fontSize: 12,
      fontWeight: "600",
      color:
        COLORS.textSecondary,
    },

    calmPhrase: {
      marginTop: 31,
      paddingHorizontal: 15,
      fontSize: 17,
      lineHeight: 25,
      fontWeight: "650",
      color:
        COLORS.textPrimary,
      textAlign: "center",
    },

    helperText: {
      marginTop: 7,
      fontSize: 13,
      color:
        COLORS.textSecondary,
    },

    startButton: {
      marginTop: 22,
      height: 48,
      paddingHorizontal: 23,
      borderRadius: 24,
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
      color:
        COLORS.white,
    },

    activeMessage: {
      marginTop: 19,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor:
        COLORS.softBlue,
    },

    activeMessageText: {
      marginLeft: 7,
      fontSize: 13,
      color:
        COLORS.textSecondary,
    },

    completeMessage: {
      marginTop: 19,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor:
        COLORS.softPurple,
    },

    completeMessageText: {
      marginLeft: 7,
      fontSize: 13,
      fontWeight: "600",
      color:
        COLORS.textSecondary,
    },

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
      color:
        COLORS.white,
    },

    continueButtonTextDisabled: {
      color: COLORS.disabled,
    },

    skipButton: {
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingVertical: 11,
      marginTop: 4,
    },

    skipText: {
      fontSize: 13.5,
      fontWeight: "600",
      color:
        COLORS.textSecondary,
    },
  });