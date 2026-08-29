import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";

import { sleepActivities } from "./sleepActivities";

export default function SleepMusicPlayerScreen({
  navigation,
  route,
}) {
  const { activityId } = route.params || {};

  /*FIND SELECTED MUSIC*/

  const selectedTrack = useMemo(() => {
    return (
      sleepActivities.find(
        (item) => item.id === activityId
      ) || sleepActivities[0]
    );
  }, [activityId]);

  /*AUDIO PLAYER*/

  const player = useAudioPlayer(
    selectedTrack.audio,
    {
      updateInterval: 500,
      downloadFirst: true,
    }
  );

  const status =
    useAudioPlayerStatus(player);

  /*STATES*/

  const [loopEnabled, setLoopEnabled] =
    useState(false);

  const [sleepTimer, setSleepTimer] =
    useState(null);

  const [timeRemaining, setTimeRemaining] =
    useState(null);

  const progressWidthRef =
    useRef(0);

  const timerRef =
    useRef(null);

  /*CONFIGURE AUDIO*/

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
            "Audio mode error:",
            error
          );
        }
      };

    configureAudio();
  }, []);

  /*LOOP*/

  useEffect(() => {
    if (!player) {
      return;
    }

    player.loop = loopEnabled;
  }, [loopEnabled, player]);

  /*CLEAN TIMER ONLY*/

  useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }

    try {
      player.pause();
    } catch (error) {
      console.log(
        "Cleanup pause error:",
        error
      );
    }
  };
}, [player]);

  
  /*FORMAT TIME*/

  const formatTime = (seconds) => {
    if (
      seconds === undefined ||
      seconds === null ||
      Number.isNaN(seconds)
    ) {
      return "00:00";
    }

    const totalSeconds =
      Math.max(
        0,
        Math.floor(seconds)
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const remainingSeconds =
      totalSeconds % 60;

    return `${String(
      minutes
    ).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /*PLAY / PAUSE*/

  const togglePlayPause = () => {
    try {
      if (!status.isLoaded) {
        console.log(
          "Audio is still loading..."
        );

        return;
      }

      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.log(
        "Play/Pause error:",
        error
      );

      Alert.alert(
        "Playback Error",
        "The audio could not be played. Please try again."
      );
    }
  };

  /*REWIND 15 SECONDS*/

  const seekBackward = async () => {
  try {
    if (!status.isLoaded) {
      return;
    }

    const currentTime =
      Number(status.currentTime) || 0;

    const targetTime =
      Math.max(currentTime - 15, 0);

    await player.seekTo(targetTime);
  } catch (error) {
    console.log(
      "Backward seek error:",
      error
    );
  }
};

  /*FORWARD 15 SECONDS*/

  const seekForward = async () => {
  try {
    if (!status.isLoaded) {
      return;
    }

    const currentTime =
      Number(status.currentTime) || 0;

    const duration =
      Number(status.duration) || 0;

    if (duration <= 0) {
      return;
    }

    const targetTime =
      Math.min(
        currentTime + 15,
        duration
      );

    await player.seekTo(targetTime);
  } catch (error) {
    console.log(
      "Forward seek error:",
      error
    );
  }
};


  /*PROGRESS BAR SEEK*/

  const seekFromProgress =
  async (event) => {
    try {
      if (
        !status.isLoaded ||
        !status.duration ||
        !progressWidthRef.current
      ) {
        return;
      }

      const locationX =
        event.nativeEvent.locationX;

      const width =
        progressWidthRef.current;

      const percentage =
        Math.min(
          Math.max(
            locationX / width,
            0
          ),
          1
        );

      const targetTime =
        percentage *
        Number(status.duration);

      await player.seekTo(
        targetTime
      );
    } catch (error) {
      console.log(
        "Progress seek error:",
        error
      );
    }
  };

  /*PROGRESS*/

  const progress =
    status.duration > 0
      ? Math.min(
          Math.max(
            status.currentTime /
              status.duration,
            0
          ),
          1
        )
      : 0;

  /*LOOP*/

  const toggleLoop = () => {
    setLoopEnabled(
      (previous) =>
        !previous
    );
  };

  /*STOP TIMER*/

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }

    setSleepTimer(null);
    setTimeRemaining(null);
  };

  /*START SLEEP TIMER*/

  const startSleepTimer = (minutes) => {
  // Remove any old timer first
  if (timerRef.current) {
    clearInterval(
      timerRef.current
    );

    timerRef.current = null;
  }

  const totalSeconds =
    minutes * 60;

  setSleepTimer(minutes);
  setTimeRemaining(
    totalSeconds
  );

  timerRef.current =
    setInterval(() => {
      setTimeRemaining(
        (previous) => {
          if (
            previous === null
          ) {
            return null;
          }

          if (previous <= 1) {
            if (
              timerRef.current
            ) {
              clearInterval(
                timerRef.current
              );

              timerRef.current =
                null;
            }

            try {
              player.pause();
            } catch (error) {
              console.log(
                "Timer pause error:",
                error
              );
            }

            setSleepTimer(
              null
            );

            return null;
          }

          return previous - 1;
        }
      );
    }, 1000);
};

  /*BACK BUTTON*/
 

  const goBack = () => {
    try {
      if (
        status.isLoaded &&
        status.playing
      ) {
        player.pause();
      }
    } catch (error) {
      console.log(
        "Back pause error:",
        error
      );
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080F2F"
      />

      <ImageBackground
        source={
          selectedTrack.image
        }
        style={
          styles.background
        }
        resizeMode="cover"
      >
        <View
          style={
            styles.darkOverlay
          }
        />

        {/* HEADER */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            onPress={goBack}
            style={
              styles.headerButton
            }
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Sleep Music
          </Text>

          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={() => {
              Alert.alert(
                "Favorites",
                "Favorites will be connected to your My Favorites section."
              );
            }}
          >
            <Ionicons
              name="heart-outline"
              size={27}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* SPACE FOR BACKGROUND IMAGE */}

          <View
            style={
              styles.imageSpace
            }
          />

          {/* TRACK INFORMATION */}

          <View
            style={
              styles.trackInfo
            }
          >
            <Text
              style={
                styles.trackTitle
              }
            >
              {
                selectedTrack.title
              }
            </Text>

            <Text
              style={
                styles.trackSubtitle
              }
            >
              {
                selectedTrack.subtitle
              }
            </Text>
          </View>

          {/* LOADING MESSAGE */}

          {!status.isLoaded && (
            <Text
              style={
                styles.loadingText
              }
            >
              Loading audio...
            </Text>
          )}

          {/* PLAYBACK CONTROLS */}

          <View
            style={
              styles.controls
            }
          >
            <TouchableOpacity
              onPress={
                seekBackward
              }
              disabled={
                !status.isLoaded
              }
              style={
                styles.seekButton
              }
            >
              <Ionicons
                name="play-back"
                size={30}
                color={
                  status.isLoaded
                    ? "#FFFFFF"
                    : "#777E9E"
                }
              />

              <Text
                style={
                  styles.seekText
                }
              >
                15 sec
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                togglePlayPause
              }
              disabled={
                !status.isLoaded
              }
              style={[
                styles.mainPlayButton,
                !status.isLoaded &&
                  styles.disabledPlayButton,
              ]}
            >
              <Ionicons
                name={
                  status.playing
                    ? "pause"
                    : "play"
                }
                size={48}
                color="#11172F"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                seekForward
              }
              disabled={
                !status.isLoaded
              }
              style={
                styles.seekButton
              }
            >
              <Ionicons
                name="play-forward"
                size={30}
                color={
                  status.isLoaded
                    ? "#FFFFFF"
                    : "#777E9E"
                }
              />

              <Text
                style={
                  styles.seekText
                }
              >
                15 sec
              </Text>
            </TouchableOpacity>
          </View>

          {/* PROGRESS */}

          <View
            style={
              styles.progressContainer
            }
          >
            <View
              style={
                styles.progressTimeRow
              }
            >
              <Text
                style={
                  styles.timeText
                }
              >
                {formatTime(
                  status.currentTime
                )}
              </Text>

              <Text
                style={
                  styles.timeText
                }
              >
                {formatTime(
                  status.duration
                )}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              style={
                styles.progressTrack
              }
              disabled={
                !status.isLoaded
              }
              onLayout={(
                event
              ) => {
                progressWidthRef.current =
                  event.nativeEvent.layout.width;
              }}
              onPress={
                seekFromProgress
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      progress * 100
                    }%`,
                  },
                ]}
              />

              <View
                style={[
                  styles.progressThumb,
                  {
                    left: `${
                      progress * 100
                    }%`,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* LOOP */}

          <View
            style={
              styles.extraControls
            }
          >
            <TouchableOpacity
              onPress={
                toggleLoop
              }
              style={[
                styles.optionButton,
                loopEnabled &&
                  styles.optionButtonActive,
              ]}
            >
              <Ionicons
                name="repeat"
                size={21}
                color={
                  loopEnabled
                    ? "#FFFFFF"
                    : "#CBD2F5"
                }
              />

              <Text
                style={[
                  styles.optionText,
                  loopEnabled &&
                    styles.optionTextActive,
                ]}
              >
                {loopEnabled
                  ? "Loop On"
                  : "Loop"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* SLEEP TIMER */}

          <View
            style={
              styles.timerContainer
            }
          >
            <View
              style={
                styles.timerTitleRow
              }
            >
              <Ionicons
                name="moon-outline"
                size={21}
                color="#D5DAFF"
              />

              <Text
                style={
                  styles.timerTitle
                }
              >
                Sleep Timer
              </Text>
            </View>

            <View
              style={
                styles.timerButtons
              }
            >
              {[
                15,
                30,
                45,
              ].map(
                (minutes) => (
                  <TouchableOpacity
                    key={
                      minutes
                    }
                    style={[
                      styles.timerButton,
                      sleepTimer ===
                        minutes &&
                        styles.timerButtonActive,
                    ]}
                    onPress={() =>
                      startSleepTimer(
                        minutes
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.timerButtonText,
                        sleepTimer ===
                          minutes &&
                          styles.timerButtonTextActive,
                      ]}
                    >
                      {
                        minutes
                      }{" "}
                      min
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {sleepTimer !==
              null && (
              <>
                <Text
                  style={
                    styles.timerRemaining
                  }
                >
                  Music will stop
                  in{" "}
                  {formatTime(
                    timeRemaining
                  )}
                </Text>

                <TouchableOpacity
                  onPress={
                    stopTimer
                  }
                  style={
                    styles.cancelTimerButton
                  }
                >
                  <Text
                    style={
                      styles.cancelTimerText
                    }
                  >
                    Turn Timer Off
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text
            style={
              styles.footerMessage
            }
          >
            Rest gently and take
            your time.
          </Text>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#080F2F",
    },

    background: {
      flex: 1,
    },

    darkOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "rgba(3,8,32,0.65)",
    },

    header: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 8,
      zIndex: 10,
    },

    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent:
        "center",
    },

    headerTitle: {
      fontSize: 22,
      color: "#FFFFFF",
      fontFamily:
        "Itim_400Regular",
    },

    scrollContent: {
      paddingHorizontal: 25,
      paddingBottom: 40,
    },

    imageSpace: {
      height: 210,
    },

    trackInfo: {
      alignItems: "center",
      marginBottom: 20,
    },

    trackTitle: {
      color: "#FFFFFF",
      fontSize: 32,
      textAlign: "center",
      fontFamily:
        "JosefinSans_700Bold",
      marginBottom: 9,
    },

    trackSubtitle: {
      color: "#D7DCF4",
      fontSize: 15,
      lineHeight: 21,
      textAlign: "center",
      maxWidth: 320,
    },

    loadingText: {
      color: "#DDE3FF",
      textAlign: "center",
      marginBottom: 15,
      fontSize: 13,
    },

    controls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-around",
      marginTop: 5,
      marginBottom: 25,
    },

    seekButton: {
      width: 75,
      height: 70,
      alignItems: "center",
      justifyContent:
        "center",
    },

    seekText: {
      color: "#FFFFFF",
      fontSize: 11,
      marginTop: 3,
    },

    mainPlayButton: {
      width: 94,
      height: 94,
      borderRadius: 47,
      backgroundColor:
        "#F1F2FF",
      alignItems: "center",
      justifyContent:
        "center",
      borderWidth: 8,
      borderColor:
        "rgba(174,188,255,0.45)",
    },

    disabledPlayButton: {
      opacity: 0.55,
    },

    progressContainer: {
      marginBottom: 22,
    },

    progressTimeRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 10,
    },

    timeText: {
      color: "#FFFFFF",
      fontSize: 13,
    },

    progressTrack: {
      height: 7,
      borderRadius: 4,
      backgroundColor:
        "rgba(255,255,255,0.35)",
      position: "relative",
    },

    progressFill: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor:
        "#9DAAFF",
      borderRadius: 4,
    },

    progressThumb: {
      position: "absolute",
      top: -5,
      width: 17,
      height: 17,
      borderRadius: 9,
      backgroundColor:
        "#B6C0FF",
      marginLeft: -8,
    },

    extraControls: {
      alignItems: "center",
      marginBottom: 20,
    },

    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 22,
      backgroundColor:
        "rgba(255,255,255,0.12)",
      gap: 7,
    },

    optionButtonActive: {
      backgroundColor:
        "#6877CB",
    },

    optionText: {
      color: "#CBD2F5",
      fontSize: 14,
    },

    optionTextActive: {
      color: "#FFFFFF",
    },

    timerContainer: {
      backgroundColor:
        "rgba(20,28,74,0.88)",
      borderRadius: 22,
      padding: 18,
      marginBottom: 20,
    },

    timerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 5,
    },

    timerTitle: {
      color: "#FFFFFF",
      fontSize: 18,
      fontFamily:
        "JosefinSans_700Bold",
    },

    timerDescription: {
      color: "#BFC6E5",
      fontSize: 13,
      marginBottom: 14,
    },

    timerButtons: {
      flexDirection: "row",
      gap: 10,
    },

    timerButton: {
      flex: 1,
      paddingVertical: 11,
      alignItems: "center",
      borderRadius: 12,
      backgroundColor:
        "#313B78",
    },

    timerButtonActive: {
      backgroundColor:
        "#7382DF",
    },

    timerButtonText: {
      color: "#D4D9F5",
      fontSize: 13,
      fontWeight: "600",
    },

    timerButtonTextActive: {
      color: "#FFFFFF",
    },

    timerRemaining: {
      textAlign: "center",
      color: "#FFFFFF",
      marginTop: 14,
      fontSize: 13,
    },

    cancelTimerButton: {
      alignSelf: "center",
      marginTop: 9,
    },

    cancelTimerText: {
      color: "#ADB7FF",
      fontSize: 13,
      textDecorationLine:
        "underline",
    },

    footerMessage: {
      color: "#C4CBE9",
      textAlign: "center",
      fontSize: 13,
      marginBottom: 20,
    },
  });