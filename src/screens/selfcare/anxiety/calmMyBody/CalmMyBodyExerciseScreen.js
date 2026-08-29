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
  Easing,
  Image,
  BackHandler,
  LayoutAnimation,
  Platform,
  UIManager,
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
  useAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";


/*
 * =========================================================
 * LAYOUT ANIMATION
 * =========================================================
 */

if (
  Platform.OS ===
    "android" &&
  UIManager
    .setLayoutAnimationEnabledExperimental
) {

  UIManager
    .setLayoutAnimationEnabledExperimental(
      true
    );
}


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F5F8FC",

  card:
    "#FFFFFF",

  primary:
    "#6D8FB8",

  primaryDark:
    "#506E95",

  lavender:
    "#8477B4",

  softBlue:
    "#E5F0F8",

  softBlueStrong:
    "#D8E8F4",

  softLavender:
    "#EEEAF8",

  softCream:
    "#FFF7E4",

  tense:
    "#8B7DB8",

  release:
    "#6D9AB5",

  textPrimary:
    "#30343D",

  textSecondary:
    "#737985",

  textMuted:
    "#979DA6",

  border:
    "#DEE6ED",

  white:
    "#FFFFFF",

  disabled:
    "#B8C0C8",

  videoBackground:
    "#E8EEF3",
};


/*
 * =========================================================
 * VIDEO ASSETS
 * =========================================================
 *
 * Required location:
 *
 * assets/videos/selfcare/anxiety/calmMyBody/
 *
 * calm_upper_body.mp4
 * calm_face_arms.mp4
 * calm_legs_release.mp4
 * =========================================================
 */

const BODY_VIDEOS = {
  upperBody:
    require(
      "../../../../../assets/videos/selfcare/anxiety/calmMyBody/calm_upper_body.mp4"
    ),

  faceArms:
    require(
      "../../../../../assets/videos/selfcare/anxiety/calmMyBody/calm_face_arms.mp4"
    ),

  legsRelease:
    require(
      "../../../../../assets/videos/selfcare/anxiety/calmMyBody/calm_legs_release.mp4"
    ),
};


/*
 * =========================================================
 * COMPLETE / REST IMAGE
 * =========================================================
 *
 * The old exercise demonstration images are no longer used.
 *
 * calm_rest.png is retained only for the final resting state.
 * =========================================================
 */

const REST_IMAGE =
  require(
    "../../../../../assets/images/selfcare/anxiety/calmMyBody/calm_rest.png"
  );


/*
 * =========================================================
 * AUDIO
 * =========================================================
 */

const CALM_BODY_AUDIO =
  require(
    "../../../../../assets/audio/selfcare/anxiety/calm_body_music.mp3"
  );


/*
 * =========================================================
 * TIMING
 * =========================================================
 */

const TENSE_SECONDS =
  5;

const RELEASE_SECONDS =
  15;


/*
 * =========================================================
 * BODY AREAS
 * =========================================================
 *
 * Three videos are shared across the five activity stages:
 *
 * Hands + Shoulders
 * → calm_upper_body.mp4
 *
 * Face + Arms
 * → calm_face_arms.mp4
 *
 * Legs
 * → calm_legs_release.mp4
 * =========================================================
 */

const BODY_AREAS = [
  {
    id:
      "hands",

    title:
      "Hands",

    tense:
      "Make gentle fists.",

    release:
      "Open your hands and soften.",

    instruction:
      "Slowly curl your fingers into a comfortable fist. Keep the pressure gentle. When the release phase begins, open your hands and allow your fingers to rest naturally.",

    icon:
      "hand-left-outline",

    video:
      BODY_VIDEOS.upperBody,

    videoLabel:
      "Upper-body preview",
  },

  {
    id:
      "shoulders",

    title:
      "Shoulders",

    tense:
      "Lift your shoulders gently.",

    release:
      "Let them drop and soften.",

    instruction:
      "Raise your shoulders gently toward your ears without straining. When it is time to release, allow them to fall naturally and notice the softer position.",

    icon:
      "body-outline",

    video:
      BODY_VIDEOS.upperBody,

    videoLabel:
      "Upper-body preview",
  },

  {
    id:
      "face",

    title:
      "Face & Jaw",

    tense:
      "Gently tighten your face.",

    release:
      "Soften your jaw and forehead.",

    instruction:
      "Create only a small amount of tension around your face and jaw. Avoid clenching hard. During release, soften your forehead, cheeks and jaw.",

    icon:
      "happy-outline",

    video:
      BODY_VIDEOS.faceArms,

    videoLabel:
      "Face and arms preview",
  },

  {
    id:
      "arms",

    title:
      "Arms",

    tense:
      "Gently tighten your arms.",

    release:
      "Let your arms feel loose.",

    instruction:
      "Create a comfortable amount of tension through your arms. Keep your shoulders relaxed. When the release phase begins, allow your arms to feel loose and heavy.",

    icon:
      "fitness-outline",

    video:
      BODY_VIDEOS.faceArms,

    videoLabel:
      "Face and arms preview",
  },

  {
    id:
      "legs",

    title:
      "Legs",

    tense:
      "Gently tighten your legs.",

    release:
      "Let your legs soften.",

    instruction:
      "Gently engage the muscles in your legs without locking your knees or causing discomfort. Then let the tension go and allow your legs to settle.",

    icon:
      "walk-outline",

    video:
      BODY_VIDEOS.legsRelease,

    videoLabel:
      "Leg release preview",
  },
];


/*
 * =========================================================
 * MAIN SCREEN
 * =========================================================
 */

export default function CalmMyBodyExerciseScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(
      0
    );


  const [
    phase,
    setPhase,
  ] =
    useState(
      "tense"
    );


  const [
    secondsLeft,
    setSecondsLeft,
  ] =
    useState(
      TENSE_SECONDS
    );


  const [
    hasStarted,
    setHasStarted,
  ] =
    useState(
      false
    );


  const [
    isPaused,
    setIsPaused,
  ] =
    useState(
      false
    );


  const [
    isComplete,
    setIsComplete,
  ] =
    useState(
      false
    );


  const [
    soundEnabled,
    setSoundEnabled,
  ] =
    useState(
      true
    );


  const [
    instructionOpen,
    setInstructionOpen,
  ] =
    useState(
      false
    );


  /*
   * =======================================================
   * CURRENT BODY AREA
   * =======================================================
   */

  const currentArea =
    BODY_AREAS[
      currentIndex
    ];


  /*
   * =======================================================
   * AUDIO
   * =======================================================
   */

  const player =
    useAudioPlayer(
      CALM_BODY_AUDIO,
      {
        updateInterval:
          500,

        downloadFirst:
          true,
      }
    );


  useEffect(
    () => {

      const configureAudio =
        async () => {

          try {

            await setAudioModeAsync({
              playsInSilentMode:
                true,

              interruptionMode:
                "doNotMix",
            });

          } catch (
            error
          ) {

            console.log(
              "Calm My Body audio mode error:",
              error
            );
          }
        };


      configureAudio();

    },
    []
  );


  const startMusic =
    async () => {

      if (
        !soundEnabled
      ) {

        return;
      }


      try {

        player.pause();


        await player.seekTo(
          0
        );


        player.loop =
          true;


        player.volume =
          0.18;


        player.play();

      } catch (
        error
      ) {

        console.log(
          "Calm My Body music error:",
          error
        );
      }
    };


  const pauseMusic =
    () => {

      try {

        player.pause();

      } catch (
        error
      ) {

        console.log(
          "Calm My Body pause error:",
          error
        );
      }
    };


  const resumeMusic =
    () => {

      if (
        !soundEnabled
      ) {

        return;
      }


      try {

        player.play();

      } catch (
        error
      ) {

        console.log(
          "Calm My Body resume error:",
          error
        );
      }
    };


  const stopMusic =
    () => {

      try {

        player.pause();

      } catch (
        error
      ) {

        console.log(
          "Calm My Body stop error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * IMAGE ANIMATION VALUES
   * =======================================================
   *
   * These are now used for the final rest image.
   * =======================================================
   */

  const mascotScale =
    useRef(
      new Animated.Value(
        1
      )
    ).current;


  const mascotY =
    useRef(
      new Animated.Value(
        0
      )
    ).current;


  const glowScale =
    useRef(
      new Animated.Value(
        1
      )
    ).current;


  const mascotOpacity =
    useRef(
      new Animated.Value(
        1
      )
    ).current;


  const animationRef =
    useRef(
      null
    );


  /*
   * =======================================================
   * RESET VISUAL ANIMATION
   * =======================================================
   */

  const resetImageAnimation =
    () => {

      mascotScale.setValue(
        1
      );


      mascotY.setValue(
        0
      );


      glowScale.setValue(
        1
      );


      mascotOpacity.setValue(
        1
      );
    };


  /*
   * =======================================================
   * STOP VISUAL ANIMATION
   * =======================================================
   */

  const stopAnimation =
    () => {

      if (
        animationRef.current
      ) {

        animationRef.current.stop();


        animationRef.current =
          null;
      }


      Animated.parallel([
        Animated.spring(
          mascotScale,
          {
            toValue:
              1,

            useNativeDriver:
              true,
          }
        ),

        Animated.spring(
          mascotY,
          {
            toValue:
              0,

            useNativeDriver:
              true,
          }
        ),

        Animated.spring(
          glowScale,
          {
            toValue:
              1,

            useNativeDriver:
              true,
          }
        ),
      ]).start();
    };


  /*
   * =======================================================
   * FINAL REST ANIMATION
   * =======================================================
   */

  useEffect(
    () => {

      if (
        !isComplete
      ) {

        return;
      }


      resetImageAnimation();


      animationRef.current =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              mascotY,
              {
                toValue:
                  -4,

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
              mascotY,
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


      animationRef.current.start();


      return () => {

        if (
          animationRef.current
        ) {

          animationRef.current.stop();
        }
      };

    },
    [
      isComplete,
    ]
  );


  /*
   * =======================================================
   * CLOSE INSTRUCTION WHEN AREA CHANGES
   * =======================================================
   */

  useEffect(
    () => {

      setInstructionOpen(
        false
      );

    },
    [
      currentIndex,
    ]
  );


  /*
   * =======================================================
   * TIMER
   * =======================================================
   */

  useEffect(
    () => {

      if (
        !hasStarted ||
        isPaused ||
        isComplete
      ) {

        return;
      }


      const interval =
        setInterval(
          () => {

            setSecondsLeft(
              (
                previous
              ) => {

                /*
                 * Normal countdown.
                 */

                if (
                  previous >
                  1
                ) {

                  return (
                    previous -
                    1
                  );
                }


                /*
                 * -------------------------------------------
                 * TENSE FINISHED
                 * -------------------------------------------
                 */

                if (
                  phase ===
                  "tense"
                ) {

                  setPhase(
                    "release"
                  );


                  return (
                    RELEASE_SECONDS
                  );
                }


                /*
                 * -------------------------------------------
                 * RELEASE FINISHED
                 * -------------------------------------------
                 */

                if (
                  currentIndex <
                  BODY_AREAS.length -
                    1
                ) {

                  setCurrentIndex(
                    (
                      previousIndex
                    ) =>
                      previousIndex +
                      1
                  );


                  setPhase(
                    "tense"
                  );


                  return (
                    TENSE_SECONDS
                  );
                }


                /*
                 * -------------------------------------------
                 * COMPLETE
                 * -------------------------------------------
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


                stopMusic();


                return 0;
              }
            );
          },
          1000
        );


      return () => {

        clearInterval(
          interval
        );
      };

    },
    [
      hasStarted,
      isPaused,
      isComplete,
      phase,
      currentIndex,
    ]
  );


  /*
   * =======================================================
   * CLEANUP
   * =======================================================
   */

  useEffect(
    () => {

      return () => {

        if (
          animationRef.current
        ) {

          animationRef.current.stop();
        }


        try {

          player.pause();

        } catch (
          error
        ) {

          // Safe cleanup.
        }
      };

    },
    [
      player,
    ]
  );


  /*
   * =======================================================
   * START
   * =======================================================
   */

  const handleStart =
    async () => {

      setCurrentIndex(
        0
      );


      setPhase(
        "tense"
      );


      setSecondsLeft(
        TENSE_SECONDS
      );


      setIsComplete(
        false
      );


      setIsPaused(
        false
      );


      setInstructionOpen(
        false
      );


      setHasStarted(
        true
      );


      await startMusic();
    };


  /*
   * =======================================================
   * PAUSE / RESUME
   * =======================================================
   */

  const handlePauseResume =
    () => {

      if (
        !hasStarted
      ) {

        return;
      }


      if (
        isPaused
      ) {

        setIsPaused(
          false
        );


        resumeMusic();

      } else {

        setIsPaused(
          true
        );


        pauseMusic();
      }
    };


  /*
   * =======================================================
   * SOUND
   * =======================================================
   */

  const handleSound =
    () => {

      if (
        soundEnabled
      ) {

        setSoundEnabled(
          false
        );


        pauseMusic();


        return;
      }


      setSoundEnabled(
        true
      );


      if (
        hasStarted &&
        !isPaused
      ) {

        try {

          player.play();

        } catch (
          error
        ) {

          console.log(
            "Calm My Body sound resume error:",
            error
          );
        }
      }
    };


  /*
   * =======================================================
   * TOGGLE INSTRUCTION
   * =======================================================
   */

  const handleInstructionToggle =
    () => {

      LayoutAnimation.configureNext(
        LayoutAnimation.Presets
          .easeInEaseOut
      );


      setInstructionOpen(
        (
          previous
        ) =>
          !previous
      );
    };


  /*
   * =======================================================
   * SKIP BODY AREA
   * =======================================================
   */

  const handleSkip =
    () => {

      if (
        !hasStarted ||
        isComplete
      ) {

        return;
      }


      if (
        currentIndex <
        BODY_AREAS.length -
          1
      ) {

        setCurrentIndex(
          (
            previousIndex
          ) =>
            previousIndex +
            1
        );


        setPhase(
          "tense"
        );


        setSecondsLeft(
          TENSE_SECONDS
        );


        setInstructionOpen(
          false
        );

      } else {

        setIsComplete(
          true
        );


        setHasStarted(
          false
        );


        setIsPaused(
          false
        );


        stopMusic();
      }
    };


  /*
   * =======================================================
   * BACK → MAIN SELF CARE
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

        stopMusic();

        stopAnimation();


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
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {

      stopMusic();


      navigation.navigate(
        "CalmMyBodyComplete",
        {
          ...(
            route?.params ||
            {}
          ),

          activityCompleted:
            true,
        }
      );
    };


  /*
   * =======================================================
   * PROGRESS
   * =======================================================
   */

  const phaseDuration =
    phase ===
    "tense"
      ? TENSE_SECONDS
      : RELEASE_SECONDS;


  const phaseProgress =
    isComplete
      ? 100
      : (
          (
            phaseDuration -
            secondsLeft
          ) /
          phaseDuration
        ) *
        100;


  const completedPhaseUnits =
    currentIndex *
      2 +
    (
      phase ===
      "release"
        ? 1
        : 0
    );


  const totalPhaseUnits =
    BODY_AREAS.length *
    2;


  const overallProgress =
    isComplete
      ? 100
      : (
          completedPhaseUnits /
          totalPhaseUnits
        ) *
        100;


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
            BACKGROUND
           ================================================= */}

        <View
          pointerEvents="none"
          style={
            styles.blueShape
          }
        />


        <View
          pointerEvents="none"
          style={
            styles.lavenderShape
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
              0.7
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
              Calm My Body
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {isComplete
                ? "Complete"
                : `${currentIndex + 1} of ${BODY_AREAS.length}`}
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
              size={
                20
              }
              color={
                COLORS.primary
              }
            />
          </TouchableOpacity>

        </View>


        {/* =================================================
            OVERALL PROGRESS
           ================================================= */}

        <View
          style={
            styles.overallProgressContainer
          }
        >
          <View
            style={
              styles.overallTrack
            }
          >
            <View
              style={[
                styles.overallFill,

                {
                  width:
                    `${Math.max(
                      0,
                      Math.min(
                        100,
                        overallProgress
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
              {/* =================================================
                  BODY AREA
                 ================================================= */}

              <View
                style={
                  styles.areaBadge
                }
              >
                <Ionicons
                  name={
                    currentArea.icon
                  }
                  size={
                    18
                  }
                  color={
                    COLORS.primaryDark
                  }
                />

                <Text
                  style={
                    styles.areaBadgeText
                  }
                >
                  {
                    currentArea.title
                  }
                </Text>
              </View>


              {/* =================================================
                  PHASE
                 ================================================= */}

              <Text
                style={[
                  styles.phaseTitle,

                  phase ===
                    "release" &&
                    styles.releaseTitle,
                ]}
              >
                {phase ===
                "tense"
                  ? "Tense gently"
                  : "Release"}
              </Text>


              <Text
                style={
                  styles.instruction
                }
              >
                {phase ===
                "tense"
                  ? currentArea.tense
                  : currentArea.release}
              </Text>


              {/* =================================================
                  TIMER
                 ================================================= */}

              <View
                style={
                  styles.timerSection
                }
              >

                <View
                  style={
                    styles.timerRow
                  }
                >
                  <Text
                    style={
                      styles.timerSmallText
                    }
                  >
                    {phase ===
                    "tense"
                      ? "Hold gently"
                      : "Let go"}
                  </Text>


                  <Text
                    style={
                      styles.timerNumber
                    }
                  >
                    {
                      secondsLeft
                    }
                    s
                  </Text>
                </View>


                <View
                  style={
                    styles.timerTrack
                  }
                >
                  <View
                    style={[
                      styles.timerFill,

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
                          "tense"
                            ? COLORS.tense
                            : COLORS.release,
                      },
                    ]}
                  />
                </View>

              </View>


              {/* =================================================
                  VIDEO PREVIEW
                 ================================================= */}

              <View
                style={
                  styles.videoSection
                }
              >

                <View
                  style={
                    styles.videoCard
                  }
                >

                  <ExercisePreviewVideo
                    key={
                      currentArea.id
                    }
                    source={
                      currentArea.video
                    }
                    shouldPlay={
                      !isPaused
                    }
                  />


                  <View
                    pointerEvents="none"
                    style={
                      styles.videoTopOverlay
                    }
                  >

                    <View
                      style={
                        styles.videoLabel
                      }
                    >
                      <Ionicons
                        name="play-circle-outline"
                        size={
                          14
                        }
                        color={
                          COLORS.primaryDark
                        }
                      />

                      <Text
                        style={
                          styles.videoLabelText
                        }
                      >
                        {
                          currentArea.videoLabel
                        }
                      </Text>
                    </View>

                  </View>


                  {isPaused && (

                    <View
                      pointerEvents="none"
                      style={
                        styles.videoPausedOverlay
                      }
                    >
                      <View
                        style={
                          styles.videoPauseCircle
                        }
                      >
                        <Ionicons
                          name="pause"
                          size={
                            25
                          }
                          color={
                            COLORS.white
                          }
                        />
                      </View>
                    </View>

                  )}

                </View>


                {/* =================================================
                    INSTRUCTION BUTTON
                   ================================================= */}

                <TouchableOpacity
                  style={[
                    styles.instructionButton,

                    instructionOpen &&
                      styles.instructionButtonOpen,
                  ]}
                  onPress={
                    handleInstructionToggle
                  }
                  activeOpacity={
                    0.78
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    instructionOpen
                      ? "Hide exercise instruction"
                      : "View exercise instruction"
                  }
                >

                  <View
                    style={
                      styles.instructionButtonLeft
                    }
                  >
                    <View
                      style={
                        styles.instructionButtonIcon
                      }
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={
                          18
                        }
                        color={
                          COLORS.primaryDark
                        }
                      />
                    </View>


                    <Text
                      style={
                        styles.instructionButtonText
                      }
                    >
                      {instructionOpen
                        ? "Hide Instruction"
                        : "View Instruction"}
                    </Text>
                  </View>


                  <Ionicons
                    name={
                      instructionOpen
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={
                      18
                    }
                    color={
                      COLORS.primaryDark
                    }
                  />

                </TouchableOpacity>


                {/* =================================================
                    SMALL INSTRUCTION BOX
                   ================================================= */}

                {instructionOpen && (

                  <View
                    style={
                      styles.instructionBox
                    }
                  >

                    <View
                      style={
                        styles.instructionBoxHeader
                      }
                    >
                      <Ionicons
                        name={
                          currentArea.icon
                        }
                        size={
                          18
                        }
                        color={
                          COLORS.lavender
                        }
                      />

                      <Text
                        style={
                          styles.instructionBoxTitle
                        }
                      >
                        {
                          currentArea.title
                        }
                      </Text>
                    </View>


                    <Text
                      style={
                        styles.instructionBoxText
                      }
                    >
                      {
                        currentArea.instruction
                      }
                    </Text>


                    <View
                      style={
                        styles.phaseInstructionRow
                      }
                    >

                      <View
                        style={
                          styles.phaseInstructionItem
                        }
                      >
                        <View
                          style={[
                            styles.phaseInstructionDot,

                            {
                              backgroundColor:
                                COLORS.tense,
                            },
                          ]}
                        />

                        <Text
                          style={
                            styles.phaseInstructionText
                          }
                        >
                          Tense:{" "}
                          {
                            currentArea.tense
                          }
                        </Text>
                      </View>


                      <View
                        style={
                          styles.phaseInstructionItem
                        }
                      >
                        <View
                          style={[
                            styles.phaseInstructionDot,

                            {
                              backgroundColor:
                                COLORS.release,
                            },
                          ]}
                        />

                        <Text
                          style={
                            styles.phaseInstructionText
                          }
                        >
                          Release:{" "}
                          {
                            currentArea.release
                          }
                        </Text>
                      </View>

                    </View>

                  </View>

                )}

              </View>

            </>

          )}


          {/* =================================================
              COMPLETE REST IMAGE
             ================================================= */}

          {isComplete && (

            <View
              style={
                styles.completeContent
              }
            >

              <View
                style={
                  styles.completeImageArea
                }
              >

                <Animated.View
                  style={[
                    styles.mascotGlow,

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


                <Animated.View
                  style={[
                    styles.imageContainer,

                    {
                      opacity:
                        mascotOpacity,

                      transform: [
                        {
                          translateY:
                            mascotY,
                        },

                        {
                          scale:
                            mascotScale,
                        },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={
                      REST_IMAGE
                    }
                    style={
                      styles.mascotImage
                    }
                    resizeMode="contain"
                  />
                </Animated.View>

              </View>


              <View
                style={
                  styles.completeArea
                }
              >

                <View
                  style={
                    styles.completeIcon
                  }
                >
                  <Ionicons
                    name="checkmark"
                    size={
                      34
                    }
                    color={
                      COLORS.primaryDark
                    }
                  />
                </View>


                <Text
                  style={
                    styles.completeTitle
                  }
                >
                  Let your body rest
                </Text>


                <Text
                  style={
                    styles.completeSubtitle
                  }
                >
                  Notice how you feel.
                </Text>

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
                  size={
                    18
                  }
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


          {/* =================================================
              ACTIVE CONTROLS
             ================================================= */}

          {hasStarted &&
            !isComplete && (

              <View
                style={
                  styles.runningButtons
                }
              >

                <TouchableOpacity
                  style={
                    styles.smallActionButton
                  }
                  onPress={
                    handlePauseResume
                  }
                  activeOpacity={
                    0.78
                  }
                >
                  <Ionicons
                    name={
                      isPaused
                        ? "play"
                        : "pause"
                    }
                    size={
                      17
                    }
                    color={
                      COLORS.primaryDark
                    }
                  />

                  <Text
                    style={
                      styles.smallActionText
                    }
                  >
                    {isPaused
                      ? "Resume"
                      : "Pause"}
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.smallActionButton
                  }
                  onPress={
                    handleSkip
                  }
                  activeOpacity={
                    0.78
                  }
                >
                  <Text
                    style={
                      styles.smallActionText
                    }
                  >
                    Skip
                  </Text>

                  <Ionicons
                    name="play-skip-forward-outline"
                    size={
                      17
                    }
                    color={
                      COLORS.primaryDark
                    }
                  />
                </TouchableOpacity>

              </View>

            )}


          {/* =================================================
              PAUSED
             ================================================= */}

          {isPaused && (

            <View
              style={
                styles.pauseCard
              }
            >
              <Ionicons
                name="pause-circle-outline"
                size={
                  17
                }
                color={
                  COLORS.primaryDark
                }
              />

              <Text
                style={
                  styles.pauseText
                }
              >
                Paused
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
            activeOpacity={
              0.85
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
              size={
                21
              }
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
 * VIDEO COMPONENT
 * =========================================================
 *
 * Each 10-second clip:
 *
 * - loops automatically
 * - has no native controls
 * - is muted
 * - pauses when the exercise is paused
 * - resumes when the exercise resumes
 *
 * The background relaxation audio remains separate.
 * =========================================================
 */

function ExercisePreviewVideo({
  source,
  shouldPlay,
}) {

  const videoPlayer =
    useVideoPlayer(
      source,
      (
        player
      ) => {

        player.loop =
          true;


        player.muted =
          true;


        player.play();
      }
    );


  useEffect(
    () => {

      try {

        if (
          shouldPlay
        ) {

          videoPlayer.play();

        } else {

          videoPlayer.pause();
        }

      } catch (
        error
      ) {

        console.log(
          "Calm My Body preview video error:",
          error
        );
      }

    },
    [
      shouldPlay,
      videoPlayer,
    ]
  );


  return (
    <VideoView
      style={
        styles.previewVideo
      }
      player={
        videoPlayer
      }
      nativeControls={
        false
      }
      contentFit="cover"
      allowsFullscreen={
        false
      }
      allowsPictureInPicture={
        false
      }
    />
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
     * Background
     */

    blueShape: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      top:
        -175,

      right:
        -110,

      backgroundColor:
        COLORS.softBlueStrong,

      opacity:
        0.7,
    },


    lavenderShape: {
      position:
        "absolute",

      width:
        280,

      height:
        280,

      borderRadius:
        140,

      bottom:
        -100,

      left:
        -175,

      backgroundColor:
        COLORS.softLavender,

      opacity:
        0.7,
    },


    /*
     * Header
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
        "rgba(255,255,255,0.76)",
    },


    headerCenter: {
      flex:
        1,

      alignItems:
        "center",
    },


    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        16,

      color:
        COLORS.textPrimary,
    },


    headerSubtitle: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Overall progress
     */

    overallProgressContainer: {
      paddingHorizontal:
        24,

      paddingTop:
        3,
    },


    overallTrack: {
      width:
        "100%",

      height:
        6,

      borderRadius:
        20,

      backgroundColor:
        "#DEE6ED",

      overflow:
        "hidden",
    },


    overallFill: {
      height:
        "100%",

      borderRadius:
        20,

      backgroundColor:
        COLORS.primary,
    },


    /*
     * Main
     */

    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        15,

      alignItems:
        "center",
    },


    areaBadge: {
      paddingHorizontal:
        14,

      paddingVertical:
        7,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softLavender,
    },


    areaBadgeText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        12,

      color:
        COLORS.primaryDark,
    },


    phaseTitle: {
      marginTop:
        11,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        25,

      color:
        COLORS.lavender,

      textAlign:
        "center",
    },


    releaseTitle: {
      color:
        COLORS.release,
    },


    instruction: {
      marginTop:
        4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      color:
        COLORS.textSecondary,

      textAlign:
        "center",
    },


    /*
     * Timer
     */

    timerSection: {
      width:
        "100%",

      marginTop:
        12,
    },


    timerRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginBottom:
        6,
    },


    timerSmallText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        COLORS.textSecondary,
    },


    timerNumber: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        12.5,

      color:
        COLORS.primaryDark,
    },


    timerTrack: {
      width:
        "100%",

      height:
        9,

      borderRadius:
        20,

      backgroundColor:
        "#E4E9EE",

      overflow:
        "hidden",
    },


    timerFill: {
      height:
        "100%",

      borderRadius:
        20,
    },


    /*
     * Video
     */

    videoSection: {
      width:
        "100%",

      marginTop:
        13,
    },


    videoCard: {
      width:
        "100%",

      height:
        250,

      borderRadius:
        25,

      overflow:
        "hidden",

      backgroundColor:
        COLORS.videoBackground,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      shadowColor:
        COLORS.primaryDark,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.1,

      shadowRadius:
        8,

      elevation:
        3,
    },


    previewVideo: {
      width:
        "100%",

      height:
        "100%",

      backgroundColor:
        COLORS.videoBackground,
    },


    videoTopOverlay: {
      position:
        "absolute",

      top:
        11,

      left:
        11,
    },


    videoLabel: {
      height:
        29,

      paddingHorizontal:
        10,

      borderRadius:
        15,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.91)",
    },


    videoLabelText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        9.5,

      color:
        COLORS.primaryDark,
    },


    videoPausedOverlay: {
      ...StyleSheet.absoluteFillObject,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(45,53,64,0.18)",
    },


    videoPauseCircle: {
      width:
        58,

      height:
        58,

      borderRadius:
        29,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(63,76,93,0.72)",
    },


    /*
     * Instruction toggle
     */

    instructionButton: {
      width:
        "100%",

      minHeight:
        45,

      marginTop:
        9,

      paddingHorizontal:
        13,

      borderRadius:
        17,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    instructionButtonOpen: {
      borderColor:
        "#C9D8E6",

      backgroundColor:
        "#F9FBFD",
    },


    instructionButtonLeft: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    instructionButtonIcon: {
      width:
        30,

      height:
        30,

      borderRadius:
        11,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    instructionButtonText: {
      marginLeft:
        8,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        11.5,

      color:
        COLORS.primaryDark,
    },


    /*
     * Instruction box
     */

    instructionBox: {
      width:
        "100%",

      marginTop:
        7,

      paddingHorizontal:
        14,

      paddingVertical:
        12,

      borderRadius:
        18,

      backgroundColor:
        "#FAFBFD",

      borderWidth:
        1,

      borderColor:
        "#DEE7EF",
    },


    instructionBoxHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },


    instructionBoxTitle: {
      marginLeft:
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        12.5,

      color:
        COLORS.textPrimary,
    },


    instructionBoxText: {
      marginTop:
        7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      lineHeight:
        16.5,

      color:
        COLORS.textSecondary,
    },


    phaseInstructionRow: {
      marginTop:
        10,

      paddingTop:
        9,

      borderTopWidth:
        1,

      borderTopColor:
        "#E7ECF1",
    },


    phaseInstructionItem: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      marginBottom:
        5,
    },


    phaseInstructionDot: {
      width:
        7,

      height:
        7,

      borderRadius:
        4,

      marginTop:
        4,

      marginRight:
        7,
    },


    phaseInstructionText: {
      flex:
        1,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.8,

      lineHeight:
        15,

      color:
        COLORS.textSecondary,
    },


    /*
     * Start
     */

    startButton: {
      height:
        46,

      marginTop:
        10,

      paddingHorizontal:
        27,

      borderRadius:
        23,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,
    },


    startText: {
      marginLeft:
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        14.5,

      color:
        COLORS.white,
    },


    /*
     * Running buttons
     */

    runningButtons: {
      marginTop:
        10,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        12,
    },


    smallActionButton: {
      minWidth:
        105,

      height:
        39,

      paddingHorizontal:
        15,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    smallActionText: {
      marginHorizontal:
        6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        11.5,

      color:
        COLORS.primaryDark,
    },


    pauseCard: {
      marginTop:
        7,

      paddingHorizontal:
        15,

      paddingVertical:
        6,

      borderRadius:
        17,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softCream,
    },


    pauseText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        11,

      color:
        COLORS.textSecondary,
    },


    /*
     * Complete
     */

    completeContent: {
      flex:
        1,

      width:
        "100%",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    completeImageArea: {
      width:
        "100%",

      minHeight:
        330,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    mascotGlow: {
      position:
        "absolute",

      width:
        245,

      height:
        245,

      borderRadius:
        123,

      backgroundColor:
        COLORS.softBlue,

      opacity:
        0.72,
    },


    imageContainer: {
      width:
        270,

      height:
        300,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    mascotImage: {
      width:
        "100%",

      height:
        "100%",
    },


    completeArea: {
      alignItems:
        "center",

      marginTop:
        -10,
    },


    completeIcon: {
      width:
        64,

      height:
        64,

      borderRadius:
        32,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softLavender,
    },


    completeTitle: {
      marginTop:
        13,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        21,

      color:
        COLORS.textPrimary,
    },


    completeSubtitle: {
      marginTop:
        4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Bottom
     */

    bottomContainer: {
      paddingHorizontal:
        24,

      paddingTop:
        8,

      paddingBottom:
        17,
    },


    continueButton: {
      height:
        56,

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


    disabledButton: {
      backgroundColor:
        "#E0E5E9",
    },


    continueText: {
      marginRight:
        8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15.5,

      color:
        COLORS.white,
    },


    disabledText: {
      color:
        COLORS.disabled,
    },
  });