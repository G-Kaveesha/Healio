import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const BACKGROUND = "#EAF7FF";
const PAPER_COLOR = "#EDF8FF";
const PRIMARY_BLUE = "#96C8FF";


const WRITING_DURATION_SECONDS = 4 * 60;

const TEXT_TOP_PADDING = 18;
const TEXT_BOTTOM_PADDING = 30;

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds)
  );

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export default function WriteReleaseWritingScreen({
  navigation,
}) {
  const [note, setNote] = useState("");

  const [hasStarted, setHasStarted] =
    useState(false);

  const [timeLeft, setTimeLeft] = useState(
    WRITING_DURATION_SECONDS
  );

  const [finishTime, setFinishTime] =
    useState(null);

  const [
    paperViewportHeight,
    setPaperViewportHeight,
  ] = useState(500);

  const [
    textContentHeight,
    setTextContentHeight,
  ] = useState(100);

  const isTimeFinished =
    hasStarted && timeLeft <= 0;

  /*
    Expands the writing area when the user's text
    becomes longer than the visible paper space.
  */
  const paperContentHeight = useMemo(() => {
    const requiredHeight =
      textContentHeight +
      TEXT_TOP_PADDING +
      TEXT_BOTTOM_PADDING;

    return Math.max(
      paperViewportHeight,
      requiredHeight
    );
  }, [
    paperViewportHeight,
    textContentHeight,
  ]);

  /*
    Deadline-based timer.

    This stays accurate even when the application
    temporarily freezes or moves into the background.
  */
  useEffect(() => {
    if (!hasStarted || !finishTime) {
      return undefined;
    }

    const updateTimer = () => {
      const millisecondsRemaining =
        finishTime - Date.now();

      const secondsRemaining = Math.max(
        0,
        Math.ceil(
          millisecondsRemaining / 1000
        )
      );

      setTimeLeft(secondsRemaining);
    };

    updateTimer();

    const timer = setInterval(
      updateTimer,
      250
    );

    return () => {
      clearInterval(timer);
    };
  }, [finishTime, hasStarted]);

  const startWriting = () => {
    const endingTime =
      Date.now() +
      WRITING_DURATION_SECONDS * 1000;

    setTimeLeft(WRITING_DURATION_SECONDS);
    setFinishTime(endingTime);
    setHasStarted(true);
  };

  const confirmLeave = useCallback(() => {
    if (
      !hasStarted &&
      note.trim().length === 0
    ) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      "Leave this activity?",
      "Your private writing will be permanently cleared.",
      [
        {
          text: "Keep Writing",
          style: "cancel",
        },
        {
          text: "Clear and Leave",
          style: "destructive",
          onPress: () => {
            Keyboard.dismiss();
            setNote("");
            setFinishTime(null);
            navigation.goBack();
          },
        },
      ]
    );
  }, [hasStarted, navigation, note]);

  /*
    Handle the Android hardware back button.
  */
  useEffect(() => {
    const subscription =
      BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          confirmLeave();
          return true;
        }
      );

    return () => {
      subscription.remove();
    };
  }, [confirmLeave]);

  const releaseLetter = () => {
    if (!isTimeFinished) {
      return;
    }

    Keyboard.dismiss();

    /*
      Clear the private writing before navigating.

      The text is not transferred to the shred
      animation screen.
    */
    setNote("");
    setFinishTime(null);

    navigation.replace(
      "WriteReleaseShred"
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={confirmLeave}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={31}
              color="#111111"
            />
          </TouchableOpacity>

          <View
            style={[
              styles.timerContainer,
              isTimeFinished &&
                styles.timerFinishedContainer,
            ]}
          >
            <Ionicons
              name="stopwatch-outline"
              size={21}
              color="#111111"
            />

            <Text style={styles.timerText}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View
            style={styles.paperContainer}
            onLayout={(event) => {
              const measuredHeight =
                event.nativeEvent.layout.height;

              if (measuredHeight > 0) {
                setPaperViewportHeight(
                  measuredHeight
                );
              }
            }}
          >
            <ScrollView
              style={styles.paperScrollView}
              contentContainerStyle={[
                styles.paperScrollContent,
                {
                  minHeight:
                    paperContentHeight,
                },
              ]}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              <View
                style={[
                  styles.paperContent,
                  {
                    minHeight:
                      paperContentHeight,
                  },
                ]}
              >
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  editable={
                    hasStarted &&
                    !isTimeFinished
                  }
                  multiline
                  scrollEnabled={false}
                  maxLength={6000}
                  textAlignVertical="top"
                  placeholder={
                    hasStarted
                      ? "Write freely here..."
                      : ""
                  }
                  placeholderTextColor="#7A8790"
                  style={[
                    styles.textInput,
                    {
                      minHeight:
                        paperContentHeight,
                    },
                  ]}
                  selectionColor="#78AFFF"
                  accessibilityLabel="Private writing area"
                  onContentSizeChange={(
                    event
                  ) => {
                    const nextHeight =
                      event.nativeEvent
                        .contentSize.height;

                    if (nextHeight > 0) {
                      setTextContentHeight(
                        nextHeight
                      );
                    }
                  }}
                />
              </View>
            </ScrollView>

            {!hasStarted && (
              <View
                style={
                  styles.permissionOverlay
                }
              >
                <BlurView
                  intensity={42}
                  tint="light"
                  style={
                    StyleSheet.absoluteFill
                  }
                />

                <View
                  style={styles.permissionTint}
                />

                <View
                  style={styles.permissionCard}
                >
                  <View
                    style={
                      styles.permissionIcon
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={25}
                      color="#5F83B8"
                    />
                  </View>

                  <Text
                    style={
                      styles.permissionMessage
                    }
                  >
                    Write whatever is on your
                    mind.{"\n"}
                    The timer begins when you
                    start writing.
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={
                      styles.startWritingButton
                    }
                    onPress={startWriting}
                    accessibilityRole="button"
                    accessibilityLabel="Start writing"
                  >
                    <Text
                      style={
                        styles.startWritingButtonText
                      }
                    >
                      Start Writing
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {isTimeFinished && (
            <Text style={styles.finishedMessage}>
              Your writing time is complete.
              Release the page whenever you feel
              ready.
            </Text>
          )}

          <TouchableOpacity
            activeOpacity={
              isTimeFinished ? 0.85 : 1
            }
            disabled={!isTimeFinished}
            style={[
              styles.releaseButton,
              !isTimeFinished &&
                styles.releaseButtonDisabled,
            ]}
            onPress={releaseLetter}
            accessibilityRole="button"
            accessibilityLabel="Release the letter"
          >
            <Ionicons
              name="paper-plane-outline"
              size={20}
              color={
                isTimeFinished
                  ? "#FFFFFF"
                  : "#A0A0A0"
              }
            />

            <Text
              style={[
                styles.releaseButtonText,
                !isTimeFinished &&
                  styles.releaseButtonTextDisabled,
              ]}
            >
              Release the Letter
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    height: 72,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },

  timerContainer: {
    minWidth: 94,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#6D9EFF",
    backgroundColor:
      "rgba(255,255,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  timerFinishedContainer: {
    backgroundColor: "#DCE9FF",
  },

  timerText: {
    marginLeft: 7,
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: "#111111",
  },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },

  paperContainer: {
    flex: 1,
    minHeight: 380,
    position: "relative",
    overflow: "hidden",
    backgroundColor: PAPER_COLOR,
    borderWidth: 1.2,
    borderColor: "#8B9FFF",
    borderRadius: 20,

    elevation: 2,

    shadowColor: "#5E77A1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  paperScrollView: {
    flex: 1,
  },

  paperScrollContent: {
    flexGrow: 1,
  },

  paperContent: {
    width: "100%",
    backgroundColor: PAPER_COLOR,
  },

  textInput: {
    width: "100%",
    paddingTop: TEXT_TOP_PADDING,
    paddingHorizontal: 18,
    paddingBottom: TEXT_BOTTOM_PADDING,

    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    lineHeight: 25,
    includeFontPadding: false,

    color: "#333333",
    backgroundColor: "transparent",
  },

  permissionOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  permissionTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(224, 241, 255, 0.55)",
  },

  permissionCard: {
    width: "88%",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 21,

    backgroundColor: "#DFEDFF",
    borderWidth: 1,
    borderColor: "#A9BEDE",
    borderRadius: 22,

    alignItems: "center",

    elevation: 7,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  permissionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F4F9FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  permissionMessage: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 18,
    lineHeight: 26,
    color: "#222222",
    textAlign: "center",
  },

  startWritingButton: {
    marginTop: 19,
    minWidth: 220,
    height: 53,
    borderRadius: 19,
    backgroundColor: PRIMARY_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  startWritingButtonText: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },

  finishedMessage: {
    marginTop: 10,
    paddingHorizontal: 14,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#527467",
    textAlign: "center",
  },

  releaseButton: {
    alignSelf: "center",
    marginTop: 15,
    minWidth: 230,
    height: 50,
    paddingHorizontal: 22,
    borderRadius: 19,
    backgroundColor: PRIMARY_BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  releaseButtonDisabled: {
    backgroundColor: "#D7E0E7",
  },

  releaseButtonText: {
    marginLeft: 9,
    fontFamily: "JosefinSans_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
  },

  releaseButtonTextDisabled: {
    color: "#A0A0A0",
  },
});