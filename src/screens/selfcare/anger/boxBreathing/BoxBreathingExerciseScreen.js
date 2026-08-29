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
  ImageBackground,
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

const COLORS = {
  primary: "#EAF9F7",
  primaryStrong: "#FFFFFF",

  mint: "#BFE9DF",
  blue: "#A9D7EA",

  white: "#FFFFFF",

  overlay:
    "rgba(18, 52, 70, 0.24)",

  card:
    "rgba(21, 61, 78, 0.28)",

  button:
    "rgba(255,255,255,0.18)",

  buttonBorder:
    "rgba(255,255,255,0.34)",

  dimText:
    "rgba(255,255,255,0.72)",

  disabled:
    "rgba(255,255,255,0.36)",
};

const BOX_BACKGROUND = require(
  "../../../../../assets/images/selfcare/anger/box.png"
);

const AUDIO = require(
  "../../../../../assets/audio/selfcare/box_breathing_ambient.mp3"
);

const TOTAL_CYCLES = 5;

const PHASE_DURATION = 4000;

const PHASES = [
  {
    key: "inhale",
    title: "Inhale",
    instruction:
      "Breathe in slowly",
  },

  {
    key: "hold1",
    title: "Hold",
    instruction:
      "Hold gently",
  },

  {
    key: "exhale",
    title: "Exhale",
    instruction:
      "Breathe out slowly",
  },

  {
    key: "hold2",
    title: "Hold",
    instruction:
      "Pause gently",
  },
];

export default function BoxBreathingExerciseScreen({
  navigation,
  route,
}) {
  
  const player = useAudioPlayer(
    AUDIO,
    {
      updateInterval: 500,
      downloadFirst: true,
    }
  );


  const [phaseIndex, setPhaseIndex] =
    useState(0);

  const [cycle, setCycle] =
    useState(1);

  const [hasStarted, setHasStarted] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [isComplete, setIsComplete] =
    useState(false);

 
  const guideX = useRef(
    new Animated.Value(0)
  ).current;

  const guideY = useRef(
    new Animated.Value(0)
  ).current;

  const glowScale = useRef(
    new Animated.Value(1)
  ).current;

  const phaseAnimation =
    useRef(null);

  const phaseTimeout =
    useRef(null);

  const currentPhase =
    PHASES[phaseIndex];

  const PATH_SIZE = 238;

  useEffect(() => {
    const configureAudio =
      async () => {
        try {
          await setAudioModeAsync({
            playsInSilentMode: true,
            interruptionMode:
              "doNotMix",
          });
        } catch (error) {
          console.log(
            "Box breathing audio mode error:",
            error
          );
        }
      };

    configureAudio();
  }, []);

  const clearPhaseTimeout = () => {
    if (phaseTimeout.current) {
      clearTimeout(
        phaseTimeout.current
      );

      phaseTimeout.current = null;
    }
  };

  const stopAnimation = () => {
    clearPhaseTimeout();

    if (phaseAnimation.current) {
      phaseAnimation.current.stop();
      phaseAnimation.current = null;
    }
  };

  const stopAudio = () => {
    try {
      player.pause();
    } catch (error) {
      console.log(
        "Box breathing audio stop error:",
        error
      );
    }
  };

  useEffect(() => {
    return () => {
      stopAnimation();
      stopAudio();
    };
  }, [player]);

 
  useEffect(() => {
    if (
      !hasStarted ||
      isPaused ||
      isComplete
    ) {
      glowScale.stopAnimation();

      Animated.timing(
        glowScale,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();

      return;
    }

    const pulse =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glowScale,
            {
              toValue: 1.25,
              duration: 900,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            glowScale,
            {
              toValue: 1,
              duration: 900,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),
        ])
      );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [
    hasStarted,
    isPaused,
    isComplete,
  ]);

  

  const moveGuide = (
    toX,
    toY,
    callback
  ) => {
    if (phaseAnimation.current) {
      phaseAnimation.current.stop();
    }

    phaseAnimation.current =
      Animated.parallel([
        Animated.timing(
          guideX,
          {
            toValue: toX,
            duration:
              PHASE_DURATION,
            easing:
              Easing.linear,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          guideY,
          {
            toValue: toY,
            duration:
              PHASE_DURATION,
            easing:
              Easing.linear,
            useNativeDriver: true,
          }
        ),
      ]);

    phaseAnimation.current.start(
      ({ finished }) => {
        if (
          finished &&
          callback
        ) {
          callback();
        }
      }
    );
  };


  const runPhase = (
    index,
    currentCycle
  ) => {
    if (
      isPaused ||
      isComplete
    ) {
      return;
    }

    setPhaseIndex(index);

    if (index === 0) {
      guideX.setValue(0);
      guideY.setValue(0);

      moveGuide(
        PATH_SIZE,
        0,
        () => {
          runPhase(
            1,
            currentCycle
          );
        }
      );

      return;
    }

    if (index === 1) {
      moveGuide(
        PATH_SIZE,
        PATH_SIZE,
        () => {
          runPhase(
            2,
            currentCycle
          );
        }
      );

      return;
    }

    if (index === 2) {
      moveGuide(
        0,
        PATH_SIZE,
        () => {
          runPhase(
            3,
            currentCycle
          );
        }
      );

      return;
    }


    if (index === 3) {
      moveGuide(
        0,
        0,
        () => {
          if (
            currentCycle >=
            TOTAL_CYCLES
          ) {
            finishExercise();
          } else {
            const nextCycle =
              currentCycle + 1;

            setCycle(
              nextCycle
            );

            runPhase(
              0,
              nextCycle
            );
          }
        }
      );
    }
  };

  /*audio*/

  const startAudio = async () => {
    try {
      player.pause();

      await player.seekTo(0);
  
      player.loop = true;

      player.volume = 0.16;

      player.play();
    } catch (error) {
      console.log(
        "Box breathing audio playback error:",
        error
      );
    }
  };

  const handleStart = async () => {
    stopAnimation();

    setCycle(1);

    setPhaseIndex(0);

    setIsPaused(false);

    setIsComplete(false);

    setHasStarted(true);

    guideX.setValue(0);
    guideY.setValue(0);

    await startAudio();

 
    setTimeout(() => {
      runPhase(0, 1);
    }, 100);
  };

  const handlePauseResume = async () => {
    if (!hasStarted) {
      return;
    }

    if (!isPaused) {
      setIsPaused(true);

      stopAnimation();

      stopAudio();

      return;
    }

    setIsPaused(false);

    try {
      player.play();
    } catch (error) {
      console.log(
        "Box breathing audio resume error:",
        error
      );
    }

    if (phaseIndex === 0) {
      guideX.setValue(0);
      guideY.setValue(0);
    }

    if (phaseIndex === 1) {
      guideX.setValue(PATH_SIZE);
      guideY.setValue(0);
    }

    if (phaseIndex === 2) {
      guideX.setValue(PATH_SIZE);
      guideY.setValue(PATH_SIZE);
    }

    if (phaseIndex === 3) {
      guideX.setValue(0);
      guideY.setValue(PATH_SIZE);
    }

    setTimeout(() => {
      runPhase(
        phaseIndex,
        cycle
      );
    }, 100);
  };



  const finishExercise = () => {
    stopAnimation();
    stopAudio();

    setHasStarted(false);
    setIsPaused(false);
    setIsComplete(true);

    guideX.setValue(0);
    guideY.setValue(0);
  };



  const handleContinue = () => {
    stopAnimation();
    stopAudio();

    navigation.navigate(
      "BoxBreathingComplete",
      {
        ...(route?.params || {}),
        breathingCompleted: true,
      }
    );
  };

  const handleSkip = () => {
    stopAnimation();
    stopAudio();

    navigation.navigate(
      "BoxBreathingComplete",
      {
        ...(route?.params || {}),
        breathingCompleted: false,
      }
    );
  };


  const handleBack = () => {
    stopAnimation();
    stopAudio();

    navigation.goBack();
  };


  const getMainTitle = () => {
    if (isComplete) {
      return "Finished";
    }

    if (!hasStarted) {
      return "Box Breathing";
    }

    if (isPaused) {
      return "Paused";
    }

    return currentPhase.title;
  };

  const getInstruction = () => {
    if (isComplete) {
      return "Take one natural breath.";
    }

    if (!hasStarted) {
      return "Follow the moving light.";
    }

    if (isPaused) {
      return "Continue when you're ready.";
    }

    return currentPhase.instruction;
  };

  return (
    <ImageBackground
      source={BOX_BACKGROUND}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <SafeAreaView
          style={styles.safeArea}
        >
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />

          <View
            style={styles.container}
          >
            {/* Header */}

            <View
              style={styles.header}
            >
              <TouchableOpacity
                style={
                  styles.headerButton
                }
                onPress={handleBack}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons
                  name="chevron-back"
                  size={25}
                  color={
                    COLORS.white
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
                  BOX BREATHING
                </Text>

                <Text
                  style={
                    styles.headerSubtitle
                  }
                >
                  Breath {cycle} of{" "}
                  {TOTAL_CYCLES}
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
                activeOpacity={0.75}
              >
                <Ionicons
                  name={
                    isPaused
                      ? "play"
                      : "pause"
                  }
                  size={20}
                  color={
                    hasStarted
                      ? COLORS.white
                      : COLORS.disabled
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Main content */}

            <View
              style={styles.content}
            >
              <Text
                style={
                  styles.mainTitle
                }
              >
                {getMainTitle()}
              </Text>

              <Text
                style={
                  styles.instruction
                }
              >
                {getInstruction()}
              </Text>

              {/* Breathing square */}

              <View
                style={
                  styles.squareArea
                }
              >
                <View
                  style={
                    styles.breathingSquare
                  }
                >
                  {/* Labels */}

                  <Text
                    style={
                      styles.inhaleLabel
                    }
                  >
                    inhale
                  </Text>

                  <Text
                    style={
                      styles.rightHoldLabel
                    }
                  >
                    hold
                  </Text>

                  <Text
                    style={
                      styles.exhaleLabel
                    }
                  >
                    exhale
                  </Text>

                  <Text
                    style={
                      styles.leftHoldLabel
                    }
                  >
                    hold
                  </Text>

                  {/* Center */}

                  <View
                    style={
                      styles.centerContent
                    }
                  >
                    {!hasStarted &&
                    !isComplete ? (
                      <TouchableOpacity
                        style={
                          styles.centerPlayButton
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
                          size={35}
                          color={
                            COLORS.white
                          }
                        />
                      </TouchableOpacity>
                    ) : isComplete ? (
                      <View
                        style={
                          styles.completeCircle
                        }
                      >
                        <Ionicons
                          name="checkmark"
                          size={35}
                          color={
                            COLORS.white
                          }
                        />
                      </View>
                    ) : (
                      <View
                        style={
                          styles.centerPhaseCard
                        }
                      >
                        <Text
                          style={
                            styles.centerPhaseText
                          }
                        >
                          {
                            currentPhase.title
                          }
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Moving guide */}

                  {hasStarted && (
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.movingGuideOuter,

                        {
                          transform: [
                            {
                              translateX:
                                guideX,
                            },
                            {
                              translateY:
                                guideY,
                            },
                            {
                              scale:
                                glowScale,
                            },
                          ],
                        },
                      ]}
                    >
                      <View
                        style={
                          styles.movingGuideInner
                        }
                      />
                    </Animated.View>
                  )}
                </View>
              </View>

              {/* Phase indicator */}

              <View
                style={
                  styles.phaseIndicator
                }
              >
                {PHASES.map(
                  (phase, index) => {
                    const active =
                      hasStarted &&
                      phaseIndex ===
                        index;

                    return (
                      <View
                        key={
                          phase.key
                        }
                        style={[
                          styles.phaseDot,

                          active &&
                            styles.phaseDotActive,
                        ]}
                      />
                    );
                  }
                )}
              </View>

              {/* Music indication */}

              {hasStarted &&
                !isPaused && (
                  <View
                    style={
                      styles.musicBadge
                    }
                  >
                    <Ionicons
                      name="musical-notes-outline"
                      size={17}
                      color={
                        COLORS.white
                      }
                    />

                    <Text
                      style={
                        styles.musicText
                      }
                    >
                      Gentle sound
                      playing
                    </Text>
                  </View>
                )}

              {isPaused && (
                <View
                  style={
                    styles.pauseMessage
                  }
                >
                  <Ionicons
                    name="pause-circle-outline"
                    size={18}
                    color={
                      COLORS.white
                    }
                  />

                  <Text
                    style={
                      styles.pauseMessageText
                    }
                  >
                    Take your time.
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
                        COLORS.primaryStrong
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

              {hasStarted && (
                <TouchableOpacity
                  style={
                    styles.pauseMainButton
                  }
                  onPress={
                    handlePauseResume
                  }
                  activeOpacity={
                    0.85
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
                      COLORS.primaryStrong
                    }
                  />

                  <Text
                    style={
                      styles.startButtonText
                    }
                  >
                    {isPaused
                      ? "Resume"
                      : "Pause"}
                  </Text>
                </TouchableOpacity>
              )}

              {isComplete && (
                <TouchableOpacity
                  style={
                    styles.continueButton
                  }
                  onPress={
                    handleContinue
                  }
                  activeOpacity={
                    0.85
                  }
                >
                  <Text
                    style={
                      styles.continueText
                    }
                  >
                    Continue
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color={
                      COLORS.white
                    }
                  />
                </TouchableOpacity>
              )}

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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  overlay: {
    flex: 1,

    backgroundColor:
      COLORS.overlay,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  /*
   * Header
   */

  header: {
    height: 62,

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.button,

    borderWidth: 1,
    borderColor:
      COLORS.buttonBorder,
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: "800",

    letterSpacing: 1.4,

    color: COLORS.white,
  },

  headerSubtitle: {
    marginTop: 3,

    fontSize: 11.5,

    color: COLORS.dimText,
  },

  /*
   * Main
   */

  content: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 20,
    paddingTop: 32,
  },

  mainTitle: {
    fontSize: 31,
    fontWeight: "800",

    color: COLORS.white,

    textAlign: "center",

    textShadowColor:
      "rgba(0,0,0,0.18)",

    textShadowOffset: {
      width: 0,
      height: 2,
    },

    textShadowRadius: 5,
  },

  instruction: {
    marginTop: 8,

    fontSize: 15,
    fontWeight: "500",

    color: COLORS.dimText,

    textAlign: "center",
  },

  /*
   * Square area
   */

  squareArea: {
    width: 350,
    height: 350,

    marginTop: 36,

    alignItems: "center",
    justifyContent: "center",
  },

  breathingSquare: {
    width: 260,
    height: 260,

    position: "relative",

    borderWidth: 1.7,
    borderColor:
      "rgba(255,255,255,0.82)",

    backgroundColor:
      "rgba(255,255,255,0.035)",
  },

  /*
   * Labels around square
   */

  inhaleLabel: {
    position: "absolute",

    top: -35,

    alignSelf: "center",

    fontSize: 15,
    fontWeight: "600",

    color: COLORS.white,
  },

  exhaleLabel: {
    position: "absolute",

    bottom: -35,

    alignSelf: "center",

    fontSize: 15,
    fontWeight: "600",

    color: COLORS.white,
  },

  leftHoldLabel: {
    position: "absolute",

    left: -48,
    top: 116,

    width: 45,

    textAlign: "center",

    fontSize: 15,
    fontWeight: "600",

    color: COLORS.white,

    transform: [
      {
        rotate: "-90deg",
      },
    ],
  },

  rightHoldLabel: {
    position: "absolute",

    right: -48,
    top: 116,

    width: 45,

    textAlign: "center",

    fontSize: 15,
    fontWeight: "600",

    color: COLORS.white,

    transform: [
      {
        rotate: "90deg",
      },
    ],
  },

  /*
   * Center
   */

  centerContent: {
    position: "absolute",

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    alignItems: "center",
    justifyContent: "center",
  },

  centerPlayButton: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.24)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.38)",
  },

  centerPhaseCard: {
    paddingHorizontal: 20,
    paddingVertical: 11,

    borderRadius: 22,

    backgroundColor:
      "rgba(255,255,255,0.16)",
  },

  centerPhaseText: {
    fontSize: 17,
    fontWeight: "700",

    color: COLORS.white,
  },

  completeCircle: {
    width: 72,
    height: 72,

    borderRadius: 36,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(191,233,223,0.32)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.42)",
  },

  /*
   * Running guide
   *
   * breathing square is 260.
   * Guide is 22.
   * therefore travel distance
   * is about 238.
   */

  movingGuideOuter: {
    position: "absolute",

    left: -11,
    top: -11,

    width: 22,
    height: 22,

    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.25)",

    shadowColor:
      COLORS.white,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.9,
    shadowRadius: 9,

    elevation: 6,
  },

  movingGuideInner: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor:
      COLORS.white,
  },

  /*
   * Phase indicator
   */

  phaseIndicator: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 5,
  },

  phaseDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    marginHorizontal: 5,

    backgroundColor:
      "rgba(255,255,255,0.32)",
  },

  phaseDotActive: {
    width: 24,

    backgroundColor:
      COLORS.mint,
  },

  /*
   * Music
   */

  musicBadge: {
    marginTop: 22,

    paddingHorizontal: 15,
    paddingVertical: 9,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.14)",
  },

  musicText: {
    marginLeft: 7,

    fontSize: 12.5,
    fontWeight: "600",

    color: COLORS.white,
  },

  pauseMessage: {
    marginTop: 22,

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  pauseMessageText: {
    marginLeft: 7,

    fontSize: 13,

    color: COLORS.white,
  },

  /*
   * Bottom
   */

  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 18,
  },

  startButton: {
    height: 57,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(48,111,132,0.82)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.24)",
  },

  pauseMainButton: {
    height: 57,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(48,111,132,0.82)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.24)",
  },

  startButtonText: {
    marginLeft: 8,

    fontSize: 15.5,
    fontWeight: "700",

    color: COLORS.white,
  },

  continueButton: {
    height: 58,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(48,111,132,0.88)",
  },

  continueText: {
    marginRight: 9,

    fontSize: 16,
    fontWeight: "700",

    color: COLORS.white,
  },

  skipButton: {
    alignSelf: "center",

    paddingHorizontal: 22,
    paddingVertical: 12,

    marginTop: 4,
  },

  skipText: {
    fontSize: 13.5,
    fontWeight: "600",

    color:
      "rgba(255,255,255,0.82)",
  },
});