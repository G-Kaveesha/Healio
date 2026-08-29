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

import {
  useAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";


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
  softGreenStrong: "#CDE4D5",

  cream: "#FAF2E6",
  creamDark: "#B18E69",

  textPrimary: "#2F3938",
  textSecondary: "#74807D",

  white: "#FFFFFF",

  disabled: "#B9C4C0",
};


/*
 * =========================================================
 * AUDIO
 * =========================================================
 *
 * Add:
 *
 * assets/
 * └── audio/
 *     └── selfcare/
 *         └── anxiety/
 *             └── slow_wave_music.mp3
 */

const SLOW_WAVE_AUDIO = require(
  "../../../../../assets/audio/selfcare/anxiety/slow_wave_music.mp3"
);


/*
 * =========================================================
 * BREATHING SETTINGS
 * =========================================================
 */

const INHALE_SECONDS = 4;

const EXHALE_SECONDS = 6;

/*
 * 30 cycles:
 *
 * 4 sec inhale
 * +
 * 6 sec exhale
 * =
 * 10 seconds
 *
 * 30 × 10 = 300 seconds
 * = 5 minutes
 */

const TOTAL_CYCLES = 30;


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function SlowTheWaveBreathingScreen({
  navigation,
  route,
}) {
  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    phase,
    setPhase,
  ] = useState("inhale");

  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(
    INHALE_SECONDS
  );

  const [
    cycle,
    setCycle,
  ] = useState(1);

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

  const [
    soundEnabled,
    setSoundEnabled,
  ] = useState(true);


  /*
   * =======================================================
   * AUDIO PLAYER
   * =======================================================
   */

  const player =
    useAudioPlayer(
      SLOW_WAVE_AUDIO,
      {
        updateInterval: 500,

        downloadFirst: true,
      }
    );


  /*
   * Configure audio once.
   */

  useEffect(() => {
    const configureAudio =
      async () => {
        try {
          await setAudioModeAsync({
            playsInSilentMode:
              true,

            interruptionMode:
              "doNotMix",
          });
        } catch (error) {
          console.log(
            "Slow the Wave audio mode error:",
            error
          );
        }
      };

    configureAudio();
  }, []);


  /*
   * =======================================================
   * AUDIO FUNCTIONS
   * =======================================================
   */

  const startMusic =
    async () => {
      if (!soundEnabled) {
        return;
      }

      try {
        /*
         * Make sure an old session
         * is not still playing.
         */

        player.pause();

        /*
         * Return to beginning.
         */

        await player.seekTo(0);

        /*
         * Loop continuously during
         * the breathing session.
         */

        player.loop = true;

        /*
         * Very quiet background
         * volume.
         */

        player.volume = 0.18;

        /*
         * Start playback.
         */

        player.play();
      } catch (error) {
        console.log(
          "Slow the Wave music start error:",
          error
        );
      }
    };


  const pauseMusic =
    () => {
      try {
        player.pause();
      } catch (error) {
        console.log(
          "Slow the Wave music pause error:",
          error
        );
      }
    };


  const resumeMusic =
    () => {
      if (!soundEnabled) {
        return;
      }

      try {
        player.play();
      } catch (error) {
        console.log(
          "Slow the Wave music resume error:",
          error
        );
      }
    };


  const stopMusic =
    () => {
      try {
        player.pause();
      } catch (error) {
        console.log(
          "Slow the Wave music stop error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * ANIMATION
   * =======================================================
   */

  const waveY =
    useRef(
      new Animated.Value(0)
    ).current;

  const waveScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const markerY =
    useRef(
      new Animated.Value(0)
    ).current;

  const glowScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const animationRef =
    useRef(null);


  /*
   * =======================================================
   * STOP ANIMATION
   * =======================================================
   */

  const stopWaveAnimation =
    () => {
      if (
        animationRef.current
      ) {
        animationRef.current.stop();

        animationRef.current =
          null;
      }
    };


  /*
   * =======================================================
   * RESET ANIMATION
   * =======================================================
   */

  const resetAnimation =
    () => {
      waveY.setValue(0);

      waveScale.setValue(1);

      markerY.setValue(0);

      glowScale.setValue(1);
    };


  /*
   * =======================================================
   * INHALE ANIMATION
   * =======================================================
   */

  const animateInhale =
    () => {
      stopWaveAnimation();

      /*
       * Use remaining time rather
       * than always starting a full
       * 4-second animation.
       *
       * This helps pause/resume stay
       * visually closer to the timer.
       */

      const duration =
        Math.max(
          1,
          secondsLeft
        ) * 1000;

      animationRef.current =
        Animated.parallel([
          Animated.timing(
            waveY,
            {
              toValue: -28,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            markerY,
            {
              toValue: -62,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            waveScale,
            {
              toValue: 1.05,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            glowScale,
            {
              toValue: 1.12,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),
        ]);

      animationRef.current.start();
    };


  /*
   * =======================================================
   * EXHALE ANIMATION
   * =======================================================
   */

  const animateExhale =
    () => {
      stopWaveAnimation();

      const duration =
        Math.max(
          1,
          secondsLeft
        ) * 1000;

      animationRef.current =
        Animated.parallel([
          Animated.timing(
            waveY,
            {
              toValue: 0,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            markerY,
            {
              toValue: 0,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            waveScale,
            {
              toValue: 1,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            glowScale,
            {
              toValue: 1,

              duration,

              easing:
                Easing.inOut(
                  Easing.sin
                ),

              useNativeDriver:
                true,
            }
          ),
        ]);

      animationRef.current.start();
    };


  /*
   * =======================================================
   * PHASE ANIMATION
   * =======================================================
   */

  useEffect(() => {
    if (
      !hasStarted ||
      isPaused ||
      isComplete
    ) {
      return;
    }

    if (
      phase === "inhale"
    ) {
      animateInhale();
    } else {
      animateExhale();
    }

    return () => {
      stopWaveAnimation();
    };
  }, [
    phase,
    hasStarted,
    isPaused,
    isComplete,
  ]);


  /*
   * =======================================================
   * TIMER
   * =======================================================
   */

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
          (previous) => {
            /*
             * Continue countdown.
             */

            if (
              previous > 1
            ) {
              return (
                previous - 1
              );
            }


            /*
             * -----------------------------------------------
             * INHALE FINISHED
             * -----------------------------------------------
             */

            if (
              phase === "inhale"
            ) {
              setPhase(
                "exhale"
              );

              return (
                EXHALE_SECONDS
              );
            }


            /*
             * -----------------------------------------------
             * EXHALE FINISHED
             * -----------------------------------------------
             */

            if (
              cycle <
              TOTAL_CYCLES
            ) {
              setCycle(
                (
                  previousCycle
                ) =>
                  previousCycle +
                  1
              );

              setPhase(
                "inhale"
              );

              return (
                INHALE_SECONDS
              );
            }


            /*
             * -----------------------------------------------
             * SESSION COMPLETE
             * -----------------------------------------------
             */

            setIsComplete(
              true
            );

            setHasStarted(
              false
            );

            setIsPaused(
              false
            );

            stopWaveAnimation();

            /*
             * Stop music when the
             * five-minute session ends.
             */

            stopMusic();

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
    phase,
    cycle,
  ]);


  /*
   * =======================================================
   * SCREEN CLEANUP
   * =======================================================
   *
   * Important:
   * music and animations stop if
   * the user leaves the screen.
   */

  useEffect(() => {
    return () => {
      stopWaveAnimation();

      try {
        player.pause();
      } catch (error) {
        /*
         * Safe cleanup.
         */
      }
    };
  }, [
    player,
  ]);


  /*
   * =======================================================
   * START
   * =======================================================
   */

  const handleStart =
    async () => {
      resetAnimation();

      setPhase(
        "inhale"
      );

      setSecondsLeft(
        INHALE_SECONDS
      );

      setCycle(
        1
      );

      setIsPaused(
        false
      );

      setIsComplete(
        false
      );

      setHasStarted(
        true
      );

      /*
       * Start calm music with
       * breathing session.
       */

      await startMusic();
    };


  /*
   * =======================================================
   * PAUSE / RESUME
   * =======================================================
   */

  const handlePauseResume =
    () => {
      if (!hasStarted) {
        return;
      }

      /*
       * Resume
       */

      if (isPaused) {
        setIsPaused(
          false
        );

        resumeMusic();

        return;
      }


      /*
       * Pause
       */

      setIsPaused(
        true
      );

      stopWaveAnimation();

      pauseMusic();
    };


  /*
   * =======================================================
   * SOUND BUTTON
   * =======================================================
   */

  const handleSound =
    () => {
      /*
       * Sound currently ON.
       *
       * Turn it off.
       */

      if (soundEnabled) {
        setSoundEnabled(
          false
        );

        pauseMusic();

        return;
      }


      /*
       * Sound currently OFF.
       *
       * Turn it on.
       */

      setSoundEnabled(
        true
      );

      /*
       * Only resume music if
       * session is actively running.
       */

      if (
        hasStarted &&
        !isPaused &&
        !isComplete
      ) {
        try {
          player.volume =
            0.18;

          player.play();
        } catch (error) {
          console.log(
            "Slow the Wave sound toggle error:",
            error
          );
        }
      }
    };


  /*
   * =======================================================
   * FINISH EARLY
   * =======================================================
   */

  const handleFinishEarly =
    () => {
      stopWaveAnimation();

      stopMusic();

      setHasStarted(
        false
      );

      setIsPaused(
        false
      );

      setIsComplete(
        true
      );
    };


  /*
   * =======================================================
   * BACK
   * =======================================================
   */

  const handleBack =
    () => {
      stopWaveAnimation();

      stopMusic();

      navigation.goBack();
    };


  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {
      stopWaveAnimation();

      stopMusic();

      navigation.navigate(
        "SlowTheWaveComplete",
        {
          ...(route?.params || {}),

          cyclesCompleted:
            cycle,

          completedFullSession:
            cycle >=
            TOTAL_CYCLES,
        }
      );
    };


  /*
   * =======================================================
   * PHASE PROGRESS
   * =======================================================
   */

  const phaseDuration =
    phase === "inhale"
      ? INHALE_SECONDS
      : EXHALE_SECONDS;


  const phaseProgress =
    isComplete
      ? 100
      : (
          (
            phaseDuration -
            secondsLeft
          ) /
          phaseDuration
        ) * 100;


  /*
   * =======================================================
   * SESSION PROGRESS
   * =======================================================
   *
   * One cycle has:
   *
   * inhale = 1 unit
   * exhale = 1 unit
   */

  const completedUnits =
    (cycle - 1) * 2 +
    (
      phase === "exhale"
        ? 1
        : 0
    );


  const totalUnits =
    TOTAL_CYCLES * 2;


  const sessionProgress =
    isComplete
      ? 100
      : (
          completedUnits /
          totalUnits
        ) * 100;


  /*
   * =======================================================
   * REMAINING SESSION TIME
   * =======================================================
   */

  const completedCycles =
    Math.max(
      0,
      cycle - 1
    );


  const completedSeconds =
    completedCycles *
      (
        INHALE_SECONDS +
        EXHALE_SECONDS
      ) +
    (
      phase === "exhale"
        ? INHALE_SECONDS
        : 0
    ) +
    (
      phaseDuration -
      secondsLeft
    );


  const totalSessionSeconds =
    TOTAL_CYCLES *
    (
      INHALE_SECONDS +
      EXHALE_SECONDS
    );


  const remainingSeconds =
    Math.max(
      0,
      totalSessionSeconds -
        completedSeconds
    );


  const remainingMinutes =
    Math.floor(
      remainingSeconds /
        60
    );


  const remainingSecondsPart =
    remainingSeconds %
    60;


  const remainingTimeText =
    `${remainingMinutes}:${String(
      remainingSecondsPart
    ).padStart(
      2,
      "0"
    )}`;


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
              styles.headerButton
            }
            onPress={
              handleBack
            }
            activeOpacity={
              0.7
            }
            accessibilityRole="button"
            accessibilityLabel="Go back"
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
              Slow the Wave
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {isComplete
                ? "Complete"
                : `${remainingTimeText} remaining`}
            </Text>
          </View>


          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={
              handleSound
            }
            activeOpacity={
              0.7
            }
            accessibilityRole="button"
            accessibilityLabel={
              soundEnabled
                ? "Mute music"
                : "Play music"
            }
          >
            <Ionicons
              name={
                soundEnabled
                  ? "volume-medium-outline"
                  : "volume-mute-outline"
              }
              size={20}
              color={
                soundEnabled
                  ? COLORS.primaryDark
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>
        </View>


        {/* =================================================
            SESSION PROGRESS
           ================================================= */}

        <View
          style={
            styles.sessionProgressContainer
          }
        >
          <View
            style={
              styles.sessionProgressTrack
            }
          >
            <View
              style={[
                styles.sessionProgressFill,

                {
                  width:
                    `${Math.max(
                      0,
                      Math.min(
                        100,
                        sessionProgress
                      )
                    )}%`,
                },
              ]}
            />
          </View>
        </View>


        {/* =================================================
            MAIN CONTENT
           ================================================= */}

        <View
          style={
            styles.content
          }
        >
          {!isComplete && (
            <>
              {/* Phase */}

              <View
                style={[
                  styles.phaseBadge,

                  phase ===
                    "exhale" &&
                    styles.exhaleBadge,
                ]}
              >
                <View
                  style={[
                    styles.phaseBadgeDot,

                    {
                      backgroundColor:
                        phase ===
                        "inhale"
                          ? COLORS.primary
                          : COLORS.green,
                    },
                  ]}
                />

                <Text
                  style={
                    styles.phaseBadgeText
                  }
                >
                  {phase ===
                  "inhale"
                    ? "INHALE"
                    : "EXHALE"}
                </Text>
              </View>


              <Text
                style={[
                  styles.phaseTitle,

                  phase ===
                    "exhale" &&
                    styles.exhaleTitle,
                ]}
              >
                {phase ===
                "inhale"
                  ? "Breathe in"
                  : "Breathe out"}
              </Text>


              <Text
                style={
                  styles.phaseSubtitle
                }
              >
                {phase ===
                "inhale"
                  ? "Slow and comfortable"
                  : "Let it leave gently"}
              </Text>
            </>
          )}


          {/* =================================================
              WAVE VISUAL
             ================================================= */}

          <View
            style={
              styles.waveStage
            }
          >
            {/* Cream glow */}

            <View
              style={
                styles.creamGlow
              }
            />


            {/* Animated center glow */}

            <Animated.View
              style={[
                styles.backgroundGlow,

                {
                  transform: [
                    {
                      scale:
                        glowScale,
                    },
                  ],
                },
              ]}
            />


            {/* Horizon */}

            <View
              style={
                styles.horizonLine
              }
            />


            {/* Back wave */}

            <Animated.View
              style={[
                styles.waveBack,

                {
                  transform: [
                    {
                      translateY:
                        waveY,
                    },

                    {
                      scaleX:
                        waveScale,
                    },
                  ],
                },
              ]}
            />


            {/* Middle wave */}

            <Animated.View
              style={[
                styles.waveMiddle,

                {
                  transform: [
                    {
                      translateY:
                        waveY,
                    },

                    {
                      scaleX:
                        waveScale,
                    },
                  ],
                },
              ]}
            />


            {/* Front wave */}

            <Animated.View
              style={[
                styles.waveFront,

                {
                  transform: [
                    {
                      translateY:
                        waveY,
                    },

                    {
                      scaleX:
                        waveScale,
                    },
                  ],
                },
              ]}
            />


            {/* Moving breathing marker */}

            <Animated.View
              style={[
                styles.breathMarker,

                {
                  transform: [
                    {
                      translateY:
                        markerY,
                    },
                  ],
                },
              ]}
            >
              {isComplete ? (
                <Ionicons
                  name="checkmark"
                  size={29}
                  color={
                    COLORS.greenDark
                  }
                />
              ) : (
                <Ionicons
                  name={
                    phase ===
                    "inhale"
                      ? "arrow-up-outline"
                      : "arrow-down-outline"
                  }
                  size={27}
                  color={
                    phase ===
                    "inhale"
                      ? COLORS.primaryDark
                      : COLORS.greenDark
                  }
                />
              )}
            </Animated.View>


            {/* Countdown */}

            {!isComplete && (
              <View
                style={
                  styles.secondsBadge
                }
              >
                <Text
                  style={
                    styles.secondsNumber
                  }
                >
                  {
                    secondsLeft
                  }
                </Text>

                <Text
                  style={
                    styles.secondsLabel
                  }
                >
                  sec
                </Text>
              </View>
            )}


            {/* Music indicator */}

            {hasStarted &&
              !isComplete &&
              soundEnabled && (
                <View
                  style={
                    styles.musicIndicator
                  }
                >
                  <Ionicons
                    name="musical-note-outline"
                    size={13}
                    color={
                      COLORS.primaryDark
                    }
                  />

                  <Text
                    style={
                      styles.musicIndicatorText
                    }
                  >
                    Calm sound
                  </Text>
                </View>
              )}
          </View>


          {/* =================================================
              PHASE TIMER
             ================================================= */}

          {!isComplete && (
            <View
              style={
                styles.phaseProgressArea
              }
            >
              <View
                style={
                  styles.phaseProgressLabels
                }
              >
                <Text
                  style={
                    styles.phaseProgressLabel
                  }
                >
                  {phase ===
                  "inhale"
                    ? "Inhale gently"
                    : "Exhale slowly"}
                </Text>

                <Text
                  style={
                    styles.phaseProgressTime
                  }
                >
                  {phaseDuration}
                  s
                </Text>
              </View>


              <View
                style={
                  styles.phaseTrack
                }
              >
                <View
                  style={[
                    styles.phaseFill,

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
                        phase ===
                        "inhale"
                          ? COLORS.primary
                          : COLORS.green,
                    },
                  ]}
                />
              </View>
            </View>
          )}


          {/* =================================================
              START
             ================================================= */}

          {!hasStarted &&
            !isComplete && (
              <TouchableOpacity
                style={
                  styles.startButton
                }
                onPress={
                  handleStart
                }
                activeOpacity={
                  0.85
                }
              >
                <Ionicons
                  name="play"
                  size={19}
                  color={
                    COLORS.white
                  }
                />

                <Text
                  style={
                    styles.startText
                  }
                >
                  Start Breathing
                </Text>
              </TouchableOpacity>
            )}


          {/* =================================================
              ACTIVE CONTROLS
             ================================================= */}

          {hasStarted &&
            !isComplete && (
              <View
                style={
                  styles.controls
                }
              >
                {/* Pause */}

                <TouchableOpacity
                  style={
                    styles.controlButton
                  }
                  onPress={
                    handlePauseResume
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Ionicons
                    name={
                      isPaused
                        ? "play"
                        : "pause"
                    }
                    size={18}
                    color={
                      COLORS.primaryDark
                    }
                  />

                  <Text
                    style={
                      styles.controlText
                    }
                  >
                    {isPaused
                      ? "Resume"
                      : "Pause"}
                  </Text>
                </TouchableOpacity>


                {/* Finish */}

                <TouchableOpacity
                  style={
                    styles.controlButton
                  }
                  onPress={
                    handleFinishEarly
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={
                      COLORS.greenDark
                    }
                  />

                  <Text
                    style={
                      styles.controlText
                    }
                  >
                    Finish
                  </Text>
                </TouchableOpacity>
              </View>
            )}


          {/* Pause indicator */}

          {isPaused && (
            <View
              style={
                styles.pausedChip
              }
            >
              <Ionicons
                name="pause-circle-outline"
                size={16}
                color={
                  COLORS.creamDark
                }
              />

              <Text
                style={
                  styles.pausedText
                }
              >
                Take your time
              </Text>
            </View>
          )}


          {/* =================================================
              COMPLETE
             ================================================= */}

          {isComplete && (
            <View
              style={
                styles.completeSection
              }
            >
              <View
                style={
                  styles.completeIcon
                }
              >
                <Ionicons
                  name="water-outline"
                  size={28}
                  color={
                    COLORS.greenDark
                  }
                />
              </View>


              <Text
                style={
                  styles.completeHeading
                }
              >
                Let your breath return
              </Text>


              <Text
                style={
                  styles.completeDescription
                }
              >
                Breathe normally for a
                moment.
              </Text>


              <View
                style={
                  styles.completeCard
                }
              >
                <Ionicons
                  name="leaf-outline"
                  size={20}
                  color={
                    COLORS.greenDark
                  }
                />

                <Text
                  style={
                    styles.completeCardText
                  }
                >
                  Nothing else to change
                  right now.
                </Text>
              </View>
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
            style={[
              styles.continueButton,

              !isComplete &&
                styles.continueDisabled,
            ]}
            disabled={
              !isComplete
            }
            onPress={
              handleContinue
            }
            activeOpacity={
              0.85
            }
          >
            <Text
              style={[
                styles.continueText,

                !isComplete &&
                  styles.continueTextDisabled,
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


/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =====================================================
     * SCREEN
     * =====================================================
     */

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
      height: 62,

      paddingHorizontal: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    headerButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.82)",

      elevation: 1,
    },

    headerCenter: {
      alignItems:
        "center",
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


    /*
     * =====================================================
     * SESSION PROGRESS
     * =====================================================
     */

    sessionProgressContainer: {
      paddingHorizontal: 24,

      paddingTop: 4,
    },

    sessionProgressTrack: {
      height: 6,

      borderRadius: 20,

      backgroundColor:
        "#E2EAE7",

      overflow:
        "hidden",
    },

    sessionProgressFill: {
      height: "100%",

      borderRadius: 20,

      backgroundColor:
        COLORS.primary,
    },


    /*
     * =====================================================
     * CONTENT
     * =====================================================
     */

    content: {
      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 22,

      alignItems:
        "center",
    },


    /*
     * =====================================================
     * PHASE HEADER
     * =====================================================
     */

    phaseBadge: {
      paddingHorizontal: 12,

      paddingVertical: 6,

      borderRadius: 16,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },

    exhaleBadge: {
      backgroundColor:
        COLORS.softGreen,
    },

    phaseBadgeDot: {
      width: 7,

      height: 7,

      borderRadius: 4,

      marginRight: 6,
    },

    phaseBadgeText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1,

      color:
        COLORS.textSecondary,
    },

    phaseTitle: {
      marginTop: 11,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 30,

      color:
        COLORS.primaryDark,

      textAlign:
        "center",
    },

    exhaleTitle: {
      color:
        COLORS.greenDark,
    },

    phaseSubtitle: {
      marginTop: 4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * WAVE VISUAL
     * =====================================================
     */

    waveStage: {
      width: "100%",

      height: 330,

      marginTop: 20,

      borderRadius: 36,

      overflow:
        "hidden",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,

      borderWidth: 1,

      borderColor:
        "rgba(108,158,178,0.08)",

      shadowColor:
        COLORS.primaryDark,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.07,

      shadowRadius: 12,

      elevation: 2,
    },

    creamGlow: {
      position:
        "absolute",

      width: 220,

      height: 220,

      borderRadius: 110,

      top: -85,

      right: -55,

      backgroundColor:
        COLORS.cream,

      opacity: 0.8,
    },

    backgroundGlow: {
      position:
        "absolute",

      width: 235,

      height: 235,

      borderRadius:
        118,

      top: 34,

      backgroundColor:
        "rgba(255,255,255,0.46)",
    },

    horizonLine: {
      position:
        "absolute",

      width: "82%",

      height: 1,

      top: "52%",

      backgroundColor:
        "rgba(85,126,145,0.13)",
    },

    waveBack: {
      position:
        "absolute",

      width: 480,

      height: 175,

      borderRadius: 105,

      bottom: -32,

      backgroundColor:
        COLORS.softGreenStrong,

      opacity: 0.72,
    },

    waveMiddle: {
      position:
        "absolute",

      width: 465,

      height: 145,

      borderRadius: 90,

      bottom: -35,

      backgroundColor:
        COLORS.softGreen,

      opacity: 0.92,
    },

    waveFront: {
      position:
        "absolute",

      width: 455,

      height: 120,

      borderRadius: 75,

      bottom: -40,

      backgroundColor:
        COLORS.softBlueStrong,

      opacity: 0.98,
    },


    /*
     * Breathing marker
     */

    breathMarker: {
      width: 70,

      height: 70,

      borderRadius: 35,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      shadowColor:
        COLORS.primaryDark,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity:
        0.13,

      shadowRadius:
        11,

      elevation: 5,
    },


    /*
     * Seconds
     */

    secondsBadge: {
      position:
        "absolute",

      bottom: 26,

      minWidth: 69,

      height: 38,

      paddingHorizontal: 11,

      borderRadius: 20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.88)",
    },

    secondsNumber: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 18,

      color:
        COLORS.textPrimary,
    },

    secondsLabel: {
      marginLeft: 3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10,

      color:
        COLORS.textSecondary,
    },


    /*
     * Music indicator
     */

    musicIndicator: {
      position:
        "absolute",

      top: 15,

      left: 15,

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 14,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.68)",
    },

    musicIndicatorText: {
      marginLeft: 4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 9.5,

      color:
        COLORS.primaryDark,
    },


    /*
     * =====================================================
     * PHASE TIMER
     * =====================================================
     */

    phaseProgressArea: {
      width: "100%",

      marginTop: 19,
    },

    phaseProgressLabels: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginBottom: 7,
    },

    phaseProgressLabel: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },

    phaseProgressTime: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },

    phaseTrack: {
      height: 9,

      borderRadius: 20,

      backgroundColor:
        "#E2EAE7",

      overflow:
        "hidden",
    },

    phaseFill: {
      height: "100%",

      borderRadius: 20,
    },


    /*
     * =====================================================
     * START BUTTON
     * =====================================================
     */

    startButton: {
      marginTop: 22,

      height: 51,

      paddingHorizontal: 25,

      borderRadius: 26,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,

      shadowColor:
        COLORS.primaryDark,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        7,

      elevation: 3,
    },

    startText: {
      marginLeft: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.white,
    },


    /*
     * =====================================================
     * CONTROLS
     * =====================================================
     */

    controls: {
      marginTop: 18,

      flexDirection:
        "row",

      gap: 12,
    },

    controlButton: {
      minWidth: 106,

      height: 43,

      paddingHorizontal: 15,

      borderRadius: 22,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        "#DCE7E3",

      elevation: 1,
    },

    controlText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },

    pausedChip: {
      marginTop: 9,

      paddingHorizontal: 13,

      paddingVertical: 7,

      borderRadius: 17,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.cream,
    },

    pausedText: {
      marginLeft: 5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11.5,

      color:
        COLORS.creamDark,
    },


    /*
     * =====================================================
     * COMPLETE
     * =====================================================
     */

    completeSection: {
      width: "100%",

      marginTop: 24,

      alignItems:
        "center",
    },

    completeIcon: {
      width: 65,

      height: 65,

      borderRadius: 33,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softGreen,
    },

    completeHeading: {
      marginTop: 13,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 21,

      color:
        COLORS.textPrimary,
    },

    completeDescription: {
      marginTop: 5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      color:
        COLORS.textSecondary,
    },

    completeCard: {
      width: "100%",

      marginTop: 17,

      paddingHorizontal: 16,

      paddingVertical: 13,

      borderRadius: 19,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softGreen,
    },

    completeCardText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * BOTTOM
     * =====================================================
     */

    bottomContainer: {
      paddingHorizontal: 24,

      paddingBottom: 17,
    },

    continueButton: {
      height: 58,

      borderRadius: 20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,
    },

    continueDisabled: {
      backgroundColor:
        "#E0E8E5",
    },

    continueText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },

    continueTextDisabled: {
      color:
        COLORS.disabled,
    },
  });