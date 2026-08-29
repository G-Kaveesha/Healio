import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

import {
  useEvent,
  useEventListener,
} from "expo";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background: "#FFF9F4",

  card: "#FFFFFF",

  primary: "#E8903A",
  primaryDark: "#BD6420",

  softOrange: "#FFE7D2",
  softYellow: "#FFF4C8",
  softBlue: "#E8F3FA",

  blue: "#79AFCB",

  textPrimary: "#333338",
  textSecondary: "#77767B",

  border: "#F0E3D7",

  white: "#FFFFFF",

  disabled: "#BEBAB5",

  videoBackground: "#F7EFE8",
};


/*
 * =========================================================
 * STRETCH PREVIEW VIDEOS
 * =========================================================
 */

const STRETCH_VIDEOS = {
  shoulders: require(
    "../../../../../assets/videos/selfcare/lowMood/moveWithMe/roll_your_shoulders.mp4"
  ),

  arms: require(
    "../../../../../assets/videos/selfcare/lowMood/moveWithMe/reach_your_arms_up.mp4"
  ),

  side: require(
    "../../../../../assets/videos/selfcare/lowMood/moveWithMe/gentle_side_stretch.mp4"
  ),

  release: require(
    "../../../../../assets/videos/selfcare/lowMood/moveWithMe/relax_your_shoulders.mp4"
  ),
};


/*
 * =========================================================
 * WALK PREVIEW VIDEO
 * =========================================================
 *
 * One preview video is shared by
 * all five walking stages.
 *
 * The MP4 contains its own audio.
 * No separate walk music is used.
 */

const WALK_VIDEO =
  require(
    "../../../../../assets/videos/selfcare/lowMood/moveWithMe/walk.mp4"
  );


/*
 * =========================================================
 * EXERCISES
 * =========================================================
 */

const EXERCISES = {
  /*
   * =======================================================
   * GENTLE STRETCH
   *
   * 4 × 45 seconds
   * =======================================================
   */

  stretch: [
    {
      id: "shoulders",

      title:
        "Roll your shoulders",

      shortInstruction:
        "Slow circles, no forcing.",

      seconds: 45,

      video:
        STRETCH_VIDEOS.shoulders,

      instructions: [
        "Sit or stand comfortably.",
        "Let your arms rest.",
        "Roll both shoulders slowly backward.",
        "Keep the circles comfortable.",
        "Change direction if that feels good.",
      ],
    },

    {
      id: "arms",

      title:
        "Reach your arms up",

      shortInstruction:
        "Reach gently, then soften.",

      seconds: 45,

      video:
        STRETCH_VIDEOS.arms,

      instructions: [
        "Stand or sit comfortably.",
        "Slowly raise both arms.",
        "Reach upward without straining.",
        "Keep your shoulders relaxed.",
        "Lower your arms slowly.",
      ],
    },

    {
      id: "side",

      title:
        "Gentle side stretch",

      shortInstruction:
        "Move softly from side to side.",

      seconds: 45,

      video:
        STRETCH_VIDEOS.side,

      instructions: [
        "Keep your body upright.",
        "Reach one arm slightly upward.",
        "Lean gently to the opposite side.",
        "Return to the middle.",
        "Repeat on the other side.",
      ],
    },

    {
      id: "release",

      title:
        "Relax your shoulders",

      shortInstruction:
        "Let your arms rest naturally.",

      seconds: 45,

      video:
        STRETCH_VIDEOS.release,

      instructions: [
        "Let both arms rest.",
        "Allow your shoulders to drop.",
        "Relax your hands and arms.",
        "Keep your breathing comfortable.",
        "Stay here for a moment.",
      ],
    },
  ],


  /*
   * =======================================================
   * EASY WALK
   *
   * 5 × 60 seconds
   * = 5 minutes
   *
   * All stages use walk.mp4
   * as the optional preview.
   * =======================================================
   */

  walk: [
    {
      id: "start-walk",

      title:
        "Start walking slowly",

      shortInstruction:
        "Begin at an easy pace.",

      seconds: 60,

      video:
        WALK_VIDEO,

      instructions: [
        "Choose a safe space to walk.",
        "Begin with comfortable steps.",
        "Keep your pace easy.",
        "Let your body move naturally.",
      ],
    },

    {
      id: "steady",

      title:
        "Find an easy rhythm",

      shortInstruction:
        "Let your arms move naturally.",

      seconds: 60,

      video:
        WALK_VIDEO,

      instructions: [
        "Keep walking comfortably.",
        "Let your arms move naturally.",
        "Keep your shoulders relaxed.",
        "There is no need to hurry.",
      ],
    },

    {
      id: "notice",

      title:
        "Notice your surroundings",

      shortInstruction:
        "Keep your steps comfortable.",

      seconds: 60,

      video:
        WALK_VIDEO,

      instructions: [
        "Continue walking gently.",
        "Notice something around you.",
        "Let your eyes move naturally.",
        "Return attention to your steps.",
      ],
    },

    {
      id: "lighter",

      title:
        "Keep moving gently",

      shortInstruction:
        "Stay with your easy pace.",

      seconds: 60,

      video:
        WALK_VIDEO,

      instructions: [
        "Continue at your comfortable pace.",
        "Keep your movements relaxed.",
        "Let your breathing stay natural.",
        "Slow down whenever you need.",
      ],
    },

    {
      id: "slow",

      title:
        "Slow your steps",

      shortInstruction:
        "Let your body settle.",

      seconds: 60,

      video:
        WALK_VIDEO,

      instructions: [
        "Gradually slow your steps.",
        "Let your arms settle.",
        "Take a few final easy steps.",
        "Stop when you feel ready.",
      ],
    },
  ],


  /*
   * =======================================================
   * SHAKE IT OUT
   *
   * Preview videos can be added later.
   * =======================================================
   */

  shake: [
    {
      id: "hands",

      title:
        "Shake out your hands",

      shortInstruction:
        "Keep it light and easy.",

      seconds: 45,

      video: null,

      instructions: [
        "Keep your arms comfortable.",
        "Gently shake your hands.",
        "Keep the movement light.",
      ],
    },

    {
      id: "shoulders",

      title:
        "Loosen your shoulders",

      shortInstruction:
        "Small movements are enough.",

      seconds: 45,

      video: null,

      instructions: [
        "Let your arms hang naturally.",
        "Move your shoulders gently.",
        "Keep everything comfortable.",
      ],
    },

    {
      id: "step",

      title:
        "Step side to side",

      shortInstruction:
        "Find your own rhythm.",

      seconds: 45,

      video: null,

      instructions: [
        "Take a small step to one side.",
        "Return to the middle.",
        "Repeat on the other side.",
      ],
    },

    {
      id: "free",

      title:
        "Move however feels good",

      shortInstruction:
        "There is no right way.",

      seconds: 45,

      video: null,

      instructions: [
        "Choose a comfortable movement.",
        "Keep it gentle.",
        "Stop or change whenever you want.",
      ],
    },
  ],
};


/*
 * =========================================================
 * MAIN SCREEN
 * =========================================================
 */

export default function MoveWithMeExerciseScreen({
  navigation,
  route,
}) {
  /*
   * =======================================================
   * SELECTED ROUTINE
   * =======================================================
   */

  const selectedMovement =
    route?.params
      ?.selectedMovement;


  const movementId =
    selectedMovement?.id ||
    "stretch";


  const exercises =
    EXERCISES[
      movementId
    ] ||
    EXERCISES.stretch;


  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);


  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(
    exercises[0].seconds
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


  const [
    instructionsVisible,
    setInstructionsVisible,
  ] = useState(false);


  /*
   * =======================================================
   * CURRENT EXERCISE
   * =======================================================
   */

  const currentExercise =
    exercises[
      currentIndex
    ];


  /*
   * =======================================================
   * PROGRESS
   * =======================================================
   */

  const currentDuration =
    currentExercise.seconds;


  const elapsedInStep =
    Math.max(
      0,

      currentDuration -
        secondsLeft
    );


  const stepProgress =
    isComplete
      ? 100
      : Math.min(
          100,

          Math.max(
            0,

            (
              elapsedInStep /
              currentDuration
            ) *
              100
          )
        );


  const overallProgress =
    isComplete
      ? 100
      : (
          currentIndex /
          exercises.length
        ) *
          100 +
        (
          stepProgress /
          exercises.length
        );


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


    const timer =
      setTimeout(() => {
        setSecondsLeft(
          (
            previous
          ) =>
            Math.max(
              0,

              previous - 1
            )
        );
      }, 1000);


    return () => {
      clearTimeout(
        timer
      );
    };
  }, [
    hasStarted,
    isPaused,
    isComplete,
    secondsLeft,
  ]);


  /*
   * =======================================================
   * AUTO NEXT MOVEMENT
   * =======================================================
   */

  useEffect(() => {
    if (
      !hasStarted ||
      isPaused ||
      isComplete ||
      secondsLeft > 0
    ) {
      return;
    }


    if (
      currentIndex >=
      exercises.length - 1
    ) {
      finishExercise();

      return;
    }


    const nextIndex =
      currentIndex + 1;


    setCurrentIndex(
      nextIndex
    );


    setSecondsLeft(
      exercises[
        nextIndex
      ].seconds
    );
  }, [
    secondsLeft,
    hasStarted,
    isPaused,
    isComplete,
    currentIndex,
    exercises,
  ]);


  /*
   * =======================================================
   * WHEN MOVEMENT CHANGES
   * =======================================================
   */

  useEffect(() => {
    setInstructionsVisible(
      false
    );
  }, [
    currentIndex,
  ]);


  /*
   * =======================================================
   * START
   * =======================================================
   */

  const handleStart =
    () => {
      setHasStarted(
        true
      );

      setIsPaused(
        false
      );
    };


  /*
   * =======================================================
   * PAUSE / RESUME
   * =======================================================
   */

  const handlePauseResume =
    () => {
      if (
        !hasStarted ||
        isComplete
      ) {
        return;
      }


      setIsPaused(
        (
          previous
        ) =>
          !previous
      );
    };


  /*
   * =======================================================
   * NEXT MOVEMENT
   * =======================================================
   */

  const moveToNext =
    () => {
      if (
        currentIndex >=
        exercises.length - 1
      ) {
        finishExercise();

        return;
      }


      const nextIndex =
        currentIndex + 1;


      setCurrentIndex(
        nextIndex
      );


      setSecondsLeft(
        exercises[
          nextIndex
        ].seconds
      );
    };


  /*
   * =======================================================
   * SKIP
   * =======================================================
   */

  const handleSkipStep =
    () => {
      if (
        !hasStarted ||
        isComplete
      ) {
        return;
      }


      moveToNext();
    };


  /*
   * =======================================================
   * FINISH
   * =======================================================
   */

  function finishExercise() {
    setIsComplete(
      true
    );

    setHasStarted(
      false
    );

    setIsPaused(
      false
    );

    setSecondsLeft(
      0
    );
  }


  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {
      navigation.navigate(
        "MoveWithMeComplete",
        {
          ...(route?.params || {}),

          movementCompleted:
            true,
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
        {/* Decorative shapes */}

        <View
          style={
            styles.orangeShape
          }
        />

        <View
          style={
            styles.blueShape
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
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={
              0.7
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
              Move With Me
            </Text>


            <Text
              style={
                styles.headerSubtitle
              }
            >
              {selectedMovement
                ?.title ||
                "Gentle Stretch"}
            </Text>
          </View>


          <TouchableOpacity
            style={
              styles.pauseButton
            }
            onPress={
              handlePauseResume
            }
            disabled={
              !hasStarted ||
              isComplete
            }
            activeOpacity={
              0.7
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
                hasStarted &&
                !isComplete
                  ? COLORS.primaryDark
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>
        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <View
          style={
            styles.content
          }
        >
          {/* Overall progress */}

          <View
            style={
              styles.progressHeader
            }
          >
            <Text
              style={
                styles.progressText
              }
            >
              {isComplete
                ? "Complete"
                : `Movement ${
                    currentIndex +
                    1
                  } of ${
                    exercises.length
                  }`}
            </Text>


            {!isComplete && (
              <Text
                style={
                  styles.progressTimeText
                }
              >
                {secondsLeft}s
              </Text>
            )}
          </View>


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
                    `${overallProgress}%`,
                },
              ]}
            />
          </View>


          {/* Current title */}

          <Text
            style={
              styles.title
            }
          >
            {isComplete
              ? "Nice work"
              : currentExercise.title}
          </Text>


          <Text
            style={
              styles.description
            }
          >
            {isComplete
              ? "Let your body settle."
              : currentExercise
                  .shortInstruction}
          </Text>


          {/* =================================================
              VIDEO / COMPLETE
             ================================================= */}

          {!isComplete ? (
            <View
              style={
                styles.videoSection
              }
            >
              {currentExercise
                .video ? (
                <ExerciseVideoPreview
                  key={
                    currentExercise.id
                  }
                  source={
                    currentExercise.video
                  }
                />
              ) : (
                <View
                  style={
                    styles.videoPlaceholder
                  }
                >
                  <Ionicons
                    name="body-outline"
                    size={39}
                    color={
                      COLORS.primaryDark
                    }
                  />

                  <Text
                    style={
                      styles.videoPlaceholderText
                    }
                  >
                    Move at a
                    comfortable pace.
                  </Text>
                </View>
              )}


              {/* Instruction popup */}

              <TouchableOpacity
                style={
                  styles.instructionButton
                }
                onPress={() =>
                  setInstructionsVisible(
                    true
                  )
                }
                activeOpacity={
                  0.75
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={17}
                  color={
                    COLORS.blue
                  }
                />

                <Text
                  style={
                    styles.instructionButtonText
                  }
                >
                  How to do it
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={
                styles.completeVisual
              }
            >
              <View
                style={
                  styles.completeCircle
                }
              >
                <Ionicons
                  name="checkmark"
                  size={43}
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>


              <Text
                style={
                  styles.completeVisualText
                }
              >
                A little movement
                counts.
              </Text>
            </View>
          )}


          {/* =================================================
              STEP TIMER
             ================================================= */}

          {!isComplete && (
            <View
              style={
                styles.timerSection
              }
            >
              <View
                style={
                  styles.timerLabels
                }
              >
                <Text
                  style={
                    styles.timerLabel
                  }
                >
                  {hasStarted
                    ? isPaused
                      ? "Paused"
                      : "Keep it gentle"
                    : `${currentDuration} second movement`}
                </Text>


                <Text
                  style={
                    styles.timerValue
                  }
                >
                  {secondsLeft}s
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
                        `${stepProgress}%`,
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
                  Start Moving
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
                  styles.runningControls
                }
              >
                <TouchableOpacity
                  style={
                    styles.pauseMainButton
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
                    size={17}
                    color={
                      COLORS.primaryDark
                    }
                  />


                  <Text
                    style={
                      styles.pauseMainText
                    }
                  >
                    {isPaused
                      ? "Resume"
                      : "Pause"}
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.skipStepButton
                  }
                  onPress={
                    handleSkipStep
                  }
                  activeOpacity={
                    0.8
                  }
                >
                  <Text
                    style={
                      styles.skipStepText
                    }
                  >
                    Skip
                  </Text>


                  <Ionicons
                    name="play-skip-forward-outline"
                    size={17}
                    color={
                      COLORS.blue
                    }
                  />
                </TouchableOpacity>
              </View>
            )}


          {/* Pause note */}

          {isPaused &&
            !isComplete && (
              <View
                style={
                  styles.pauseMessage
                }
              >
                <Text
                  style={
                    styles.pauseMessageText
                  }
                >
                  Continue when
                  you're ready.
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
              size={21}
              color={
                isComplete
                  ? COLORS.white
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>
        </View>


        {/* =================================================
            INSTRUCTION MODAL
           ================================================= */}

        <Modal
          visible={
            instructionsVisible
          }
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() =>
            setInstructionsVisible(
              false
            )
          }
        >
          <Pressable
            style={
              styles.modalOverlay
            }
            onPress={() =>
              setInstructionsVisible(
                false
              )
            }
          >
            <Pressable
              style={
                styles.modalCard
              }
              onPress={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              {/* Modal header */}

              <View
                style={
                  styles.modalHeader
                }
              >
                <View
                  style={
                    styles.modalTitleArea
                  }
                >
                  <View
                    style={
                      styles.modalIcon
                    }
                  >
                    <Ionicons
                      name={
                        movementId ===
                        "walk"
                          ? "walk-outline"
                          : "body-outline"
                      }
                      size={20}
                      color={
                        COLORS.primaryDark
                      }
                    />
                  </View>


                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    {
                      currentExercise.title
                    }
                  </Text>
                </View>


                <TouchableOpacity
                  style={
                    styles.modalClose
                  }
                  onPress={() =>
                    setInstructionsVisible(
                      false
                    )
                  }
                >
                  <Ionicons
                    name="close"
                    size={21}
                    color={
                      COLORS.textPrimary
                    }
                  />
                </TouchableOpacity>
              </View>


              {/* Instructions */}

              <View
                style={
                  styles.instructionsList
                }
              >
                {currentExercise
                  .instructions
                  .map(
                    (
                      instruction,
                      index
                    ) => (
                      <View
                        key={
                          `${currentExercise.id}-${index}`
                        }
                        style={
                          styles.instructionRow
                        }
                      >
                        <View
                          style={
                            styles.instructionNumber
                          }
                        >
                          <Text
                            style={
                              styles.instructionNumberText
                            }
                          >
                            {index + 1}
                          </Text>
                        </View>


                        <Text
                          style={
                            styles.instructionText
                          }
                        >
                          {
                            instruction
                          }
                        </Text>
                      </View>
                    )
                  )}
              </View>


              {/* Small reminder */}

              <View
                style={
                  styles.modalNote
                }
              >
                <Ionicons
                  name="heart-outline"
                  size={16}
                  color={
                    COLORS.primaryDark
                  }
                />

                <Text
                  style={
                    styles.modalNoteText
                  }
                >
                  Keep every movement
                  comfortable.
                </Text>
              </View>


              <TouchableOpacity
                style={
                  styles.modalDoneButton
                }
                onPress={() =>
                  setInstructionsVisible(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles.modalDoneText
                  }
                >
                  Got it
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}


/*
 * =========================================================
 * VIDEO PREVIEW COMPONENT
 * =========================================================
 *
 * Preview video:
 *
 * - does not autoplay
 * - does not loop
 * - uses its own MP4 audio
 * - does not control the exercise timer
 * =========================================================
 */

function ExerciseVideoPreview({
  source,
}) {
  const player =
    useVideoPlayer(
      source,
      (
        videoPlayer
      ) => {
        videoPlayer.loop =
          false;
      }
    );


  /*
   * =======================================================
   * PLAYING STATE
   * =======================================================
   */

  const {
    isPlaying,
  } = useEvent(
    player,
    "playingChange",
    {
      isPlaying:
        player.playing,
    }
  );


  /*
   * =======================================================
   * RESET AFTER VIDEO ENDS
   * =======================================================
   */

  useEventListener(
    player,
    "playToEnd",
    () => {
      try {
        player.currentTime =
          0;
      } catch (error) {
        console.log(
          "Move With Me preview reset error:",
          error
        );
      }
    }
  );


  /*
   * =======================================================
   * PLAY / PAUSE PREVIEW
   * =======================================================
   */

  const handlePreview =
    () => {
      try {
        if (
          isPlaying
        ) {
          player.pause();

          return;
        }


        /*
         * Restart if preview
         * has already finished.
         */

        if (
          player.duration &&
          player.currentTime >=
            player.duration -
              0.15
        ) {
          player.currentTime =
            0;
        }


        player.play();
      } catch (error) {
        console.log(
          "Move With Me preview error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <View
      style={
        styles.videoCard
      }
    >
      <VideoView
        style={
          styles.video
        }
        player={
          player
        }
        contentFit="contain"
        nativeControls={
          false
        }
      />


      {!isPlaying && (
        <View
          pointerEvents="none"
          style={
            styles.videoShade
          }
        >
          <View
            style={
              styles.videoPlayCircle
            }
          >
            <Ionicons
              name="play"
              size={24}
              color={
                COLORS.primaryDark
              }
              style={{
                marginLeft: 3,
              }}
            />
          </View>
        </View>
      )}


      <TouchableOpacity
        style={
          styles.previewButton
        }
        onPress={
          handlePreview
        }
        activeOpacity={
          0.82
        }
      >
        <Ionicons
          name={
            isPlaying
              ? "pause"
              : "play"
          }
          size={16}
          color={
            COLORS.white
          }
        />


        <Text
          style={
            styles.previewButtonText
          }
        >
          {isPlaying
            ? "Pause Preview"
            : "Preview Movement"}
        </Text>
      </TouchableOpacity>
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
     * BACKGROUND
     * =====================================================
     */

    orangeShape: {
      position:
        "absolute",

      width: 270,

      height: 270,

      borderRadius: 135,

      top: -155,

      right: -105,

      backgroundColor:
        COLORS.softOrange,

      opacity: 0.65,
    },


    blueShape: {
      position:
        "absolute",

      width: 260,

      height: 260,

      borderRadius: 130,

      bottom: 20,

      left: -175,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.65,
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


    backButton: {
      width: 42,

      height: 42,

      alignItems:
        "center",

      justifyContent:
        "center",
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

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },


    pauseButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.75)",
    },


    /*
     * =====================================================
     * CONTENT
     * =====================================================
     */

    content: {
      flex: 1,

      paddingHorizontal: 22,

      paddingTop: 15,

      alignItems:
        "center",
    },


    /*
     * =====================================================
     * OVERALL PROGRESS
     * =====================================================
     */

    progressHeader: {
      width: "100%",

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    progressText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },


    progressTimeText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.primaryDark,
    },


    overallTrack: {
      width: "100%",

      height: 6,

      marginTop: 8,

      borderRadius: 20,

      overflow:
        "hidden",

      backgroundColor:
        COLORS.border,
    },


    overallFill: {
      height: "100%",

      borderRadius: 20,

      backgroundColor:
        COLORS.primary,
    },


    /*
     * =====================================================
     * TITLE
     * =====================================================
     */

    title: {
      marginTop: 19,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 25,

      lineHeight: 30,

      textAlign:
        "center",

      color:
        COLORS.textPrimary,
    },


    description: {
      marginTop: 5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13.5,

      lineHeight: 18,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * VIDEO
     * =====================================================
     */

    videoSection: {
      width: "100%",

      marginTop: 17,

      alignItems:
        "center",
    },


    videoCard: {
      width: "100%",

      height: 250,

      borderRadius: 26,

      overflow:
        "hidden",

      backgroundColor:
        COLORS.videoBackground,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      position:
        "relative",

      shadowColor:
        "#B79678",

      shadowOffset: {
        width: 0,

        height: 5,
      },

      shadowOpacity: 0.1,

      shadowRadius: 8,

      elevation: 3,
    },


    video: {
      width: "100%",

      height: "100%",

      backgroundColor:
        COLORS.videoBackground,
    },


    videoShade: {
      ...StyleSheet.absoluteFillObject,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(40,35,30,0.07)",
    },


    videoPlayCircle: {
      width: 62,

      height: 62,

      borderRadius: 31,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.9)",
    },


    previewButton: {
      position:
        "absolute",

      bottom: 12,

      alignSelf:
        "center",

      minHeight: 39,

      paddingHorizontal: 15,

      borderRadius: 20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(189,100,32,0.91)",
    },


    previewButtonText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11.5,

      color:
        COLORS.white,
    },


    /*
     * =====================================================
     * NO VIDEO FALLBACK
     * =====================================================
     */

    videoPlaceholder: {
      width: "100%",

      height: 250,

      borderRadius: 26,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 30,

      backgroundColor:
        COLORS.softOrange,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },


    videoPlaceholderText: {
      maxWidth: 220,

      marginTop: 11,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      lineHeight: 18,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * INSTRUCTION BUTTON
     * =====================================================
     */

    instructionButton: {
      marginTop: 10,

      paddingHorizontal: 13,

      paddingVertical: 7,

      borderRadius: 16,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    instructionButtonText: {
      marginLeft: 5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11,

      color:
        COLORS.blue,
    },


    /*
     * =====================================================
     * TIMER
     * =====================================================
     */

    timerSection: {
      width: "100%",

      marginTop: 13,
    },


    timerLabels: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    timerLabel: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },


    timerValue: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13,

      color:
        COLORS.primaryDark,
    },


    timerTrack: {
      width: "100%",

      height: 8,

      marginTop: 7,

      borderRadius: 20,

      overflow:
        "hidden",

      backgroundColor:
        "#F1E6DD",
    },


    timerFill: {
      height: "100%",

      borderRadius: 20,

      backgroundColor:
        COLORS.primary,
    },


    /*
     * =====================================================
     * START
     * =====================================================
     */

    startButton: {
      marginTop: 16,

      height: 48,

      paddingHorizontal: 23,

      borderRadius: 24,

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
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.white,
    },


    /*
     * =====================================================
     * RUNNING CONTROLS
     * =====================================================
     */

    runningControls: {
      marginTop: 14,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 10,
    },


    pauseMainButton: {
      minHeight: 42,

      paddingHorizontal: 17,

      borderRadius: 21,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softOrange,
    },


    pauseMainText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11.5,

      color:
        COLORS.primaryDark,
    },


    skipStepButton: {
      minHeight: 42,

      paddingHorizontal: 17,

      borderRadius: 21,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    skipStepText: {
      marginRight: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11.5,

      color:
        COLORS.blue,
    },


    pauseMessage: {
      marginTop: 9,

      paddingHorizontal: 14,

      paddingVertical: 7,

      borderRadius: 16,

      backgroundColor:
        COLORS.softYellow,
    },


    pauseMessageText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * COMPLETE
     * =====================================================
     */

    completeVisual: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    completeCircle: {
      width: 145,

      height: 145,

      borderRadius: 73,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softOrange,

      borderWidth: 12,

      borderColor:
        COLORS.softBlue,
    },


    completeVisualText: {
      marginTop: 18,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * BOTTOM
     * =====================================================
     */

    bottomContainer: {
      paddingHorizontal: 22,

      paddingBottom: 17,

      paddingTop: 6,
    },


    continueButton: {
      height: 56,

      borderRadius: 19,

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
        "#E7E1DC",
    },


    continueText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.white,
    },


    disabledText: {
      color:
        COLORS.disabled,
    },


    /*
     * =====================================================
     * MODAL
     * =====================================================
     */

    modalOverlay: {
      flex: 1,

      paddingHorizontal: 24,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(30,27,24,0.42)",
    },


    modalCard: {
      width: "100%",

      maxWidth: 380,

      padding: 21,

      borderRadius: 27,

      backgroundColor:
        COLORS.white,

      elevation: 12,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,

        height: 6,
      },

      shadowOpacity: 0.18,

      shadowRadius: 12,
    },


    modalHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    modalTitleArea: {
      flex: 1,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingRight: 10,
    },


    modalIcon: {
      width: 42,

      height: 42,

      borderRadius: 16,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softOrange,
    },


    modalTitle: {
      flex: 1,

      marginLeft: 10,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 18,

      color:
        COLORS.textPrimary,
    },


    modalClose: {
      width: 36,

      height: 36,

      borderRadius: 18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#F4F1EE",
    },


    instructionsList: {
      marginTop: 19,
    },


    instructionRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom: 12,
    },


    instructionNumber: {
      width: 27,

      height: 27,

      borderRadius: 14,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softOrange,
    },


    instructionNumberText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11,

      color:
        COLORS.primaryDark,
    },


    instructionText: {
      flex: 1,

      marginLeft: 10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      lineHeight: 18,

      color:
        COLORS.textSecondary,
    },


    modalNote: {
      marginTop: 7,

      paddingHorizontal: 13,

      paddingVertical: 10,

      borderRadius: 17,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softYellow,
    },


    modalNoteText: {
      flex: 1,

      marginLeft: 7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      color:
        COLORS.textSecondary,
    },


    modalDoneButton: {
      height: 48,

      marginTop: 18,

      borderRadius: 18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,
    },


    modalDoneText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.white,
    },
  });