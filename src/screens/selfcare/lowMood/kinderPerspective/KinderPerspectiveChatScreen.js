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
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import * as Speech from "expo-speech";

const COLORS = {
  background: "#F8F7FC",
  card: "#FFFFFF",

  primary: "#8676B5",
  primaryDark: "#66558F",

  softLavender: "#EEEAF8",
  softLavenderStrong: "#DED6F1",

  softBlue: "#E8F2F8",
  blue: "#79A7C4",

  softYellow: "#FFF5CF",
  yellow: "#D6AA3B",

  userBubble: "#E6F0F7",
  healioBubble: "#FFFFFF",

  textPrimary: "#30303C",
  textSecondary: "#777685",

  border: "#E6E1ED",

  white: "#FFFFFF",
  disabled: "#B8B5C1",
};

/*
 * =========================================================
 * GUIDED CONVERSATION STAGES
 * =========================================================
 */

const STAGES = [
  {
    id: "situation",

    title: "Notice",

    prompt:
      "What's making things feel heavy right now?",

    acknowledgement:
      "Thank you for putting that into words.",

    placeholder:
      "Share as much or as little as you want...",
  },

  {
    id: "thought",

    title: "Notice the thought",

    prompt:
      "What thought keeps coming back when you think about it?",

    acknowledgement:
      "That sounds like a difficult thought to carry.",

    placeholder:
      "What does your mind keep telling you?",
  },

  {
    id: "friend",

    title: "Step back",

    prompt:
      "If a friend you cared about had this same thought, what would you say to them?",

    acknowledgement:
      "Notice how you can offer kindness without pretending everything is easy.",

    placeholder:
      "What would you tell a friend?",
  },

  {
    id: "balanced",

    title: "Respond kindly",

    prompt:
      "What could be a kinder and fairer way to speak to yourself right now?",

    acknowledgement:
      "That can be your kinder perspective for this moment.",

    placeholder:
      "Write a kinder thought...",
  },
];

export default function KinderPerspectiveChatScreen({
  navigation,
  route,
}) {
  const listRef = useRef(null);

  const typingOpacity = useRef(
    new Animated.Value(0.4)
  ).current;

  const [stageIndex, setStageIndex] =
    useState(0);

  const [inputText, setInputText] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [
    activityComplete,
    setActivityComplete,
  ] = useState(false);

  const [
    kinderThought,
    setKinderThought,
  ] = useState("");

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const currentStage =
    STAGES[stageIndex];

  const [messages, setMessages] =
    useState([
      {
        id: "welcome",
        sender: "healio",
        text:
          "We'll look at this gently. You don't have to solve everything.",
      },

      {
        id: "first-prompt",
        sender: "healio",
        text: STAGES[0].prompt,
      },
    ]);

  /*
   * =========================================================
   * TYPING INDICATOR
   * =========================================================
   */

  useEffect(() => {
    if (!isTyping) {
      typingOpacity.setValue(0.4);
      return;
    }

    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            typingOpacity,
            {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            typingOpacity,
            {
              toValue: 0.4,
              duration: 500,
              useNativeDriver: true,
            }
          ),
        ])
      );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    isTyping,
    typingOpacity,
  ]);

  /*
   * =========================================================
   * AUTO SCROLL
   * =========================================================
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollToEnd?.({
        animated: true,
      });
    }, 150);

    return () =>
      clearTimeout(timer);
  }, [
    messages,
    isTyping,
  ]);

  /*
   * =========================================================
   * STOP SPEECH ON EXIT
   * =========================================================
   */

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  /*
   * =========================================================
   * MESSAGE CREATOR
   * =========================================================
   */

  const createMessage = (
    sender,
    text
  ) => ({
    id:
      Date.now().toString() +
      Math.random()
        .toString(36)
        .slice(2),

    sender,
    text,
  });

  /*
   * =========================================================
   * KIND VOICE
   * =========================================================
   */

  const speakMessage = async (
    text
  ) => {
    if (!text) {
      return;
    }

    try {
      /*
       * Stop any previous voice
       * before starting another.
       */
      await Speech.stop();

      setIsSpeaking(true);

      Speech.speak(text, {
        language: "en-US",

        /*
         * Slightly slower than the
         * normal system speaking rate.
         */
        rate: 0.82,

        /*
         * Keep pitch natural.
         */
        pitch: 1.0,

        onDone: () => {
          setIsSpeaking(false);
        },

        onStopped: () => {
          setIsSpeaking(false);
        },

        onError: () => {
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.log(
        "Kinder voice error:",
        error
      );

      setIsSpeaking(false);
    }
  };

  const stopSpeaking = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.log(
        "Stop speech error:",
        error
      );
    }
  };

  /*
   * =========================================================
   * SEND RESPONSE
   * =========================================================
   */

  const handleSend = () => {
    const cleanText =
      inputText.trim();

    if (
      !cleanText ||
      isTyping ||
      activityComplete
    ) {
      return;
    }

    /*
     * Final stage response becomes
     * the kinder thought saved for
     * the completion screen.
     */

    if (
      currentStage.id ===
      "balanced"
    ) {
      setKinderThought(
        cleanText
      );
    }

    setMessages(
      (previous) => [
        ...previous,

        createMessage(
          "user",
          cleanText
        ),
      ]
    );

    setInputText("");

    processResponse(
      cleanText
    );
  };

  /*
   * =========================================================
   * PROCESS RESPONSE
   * =========================================================
   */

  const processResponse = (
    responseText
  ) => {
    setIsTyping(true);

    setTimeout(() => {
      setMessages(
        (previous) => [
          ...previous,

          createMessage(
            "healio",
            currentStage
              .acknowledgement
          ),
        ]
      );

      /*
       * Final stage
       */

      if (
        stageIndex >=
        STAGES.length - 1
      ) {
        setTimeout(() => {
          setMessages(
            (previous) => [
              ...previous,

              createMessage(
                "healio",
                "You don't have to fully believe the kinder thought yet. Just keep it nearby."
              ),
            ]
          );

          setActivityComplete(
            true
          );

          setIsTyping(false);
        }, 700);

        return;
      }

      /*
       * Move to next stage
       */

      setTimeout(() => {
        const nextIndex =
          stageIndex + 1;

        const nextStage =
          STAGES[nextIndex];

        setStageIndex(
          nextIndex
        );

        setMessages(
          (previous) => [
            ...previous,

            createMessage(
              "healio",
              nextStage.prompt
            ),
          ]
        );

        setIsTyping(false);
      }, 750);
    }, 650);
  };

  /*
   * =========================================================
   * SKIP
   * =========================================================
   */

  const handleSkip = () => {
    if (
      isTyping ||
      activityComplete
    ) {
      return;
    }

    setMessages(
      (previous) => [
        ...previous,

        createMessage(
          "user",
          "I'd rather skip this one."
        ),
      ]
    );

    setIsTyping(true);

    setTimeout(() => {
      setMessages(
        (previous) => [
          ...previous,

          createMessage(
            "healio",
            "That's okay. You don't have to share anything you don't want to."
          ),
        ]
      );

      if (
        stageIndex >=
        STAGES.length - 1
      ) {
        setActivityComplete(true);
        setIsTyping(false);

        return;
      }

      setTimeout(() => {
        const nextIndex =
          stageIndex + 1;

        setStageIndex(
          nextIndex
        );

        setMessages(
          (previous) => [
            ...previous,

            createMessage(
              "healio",
              STAGES[nextIndex]
                .prompt
            ),
          ]
        );

        setIsTyping(false);
      }, 650);
    }, 600);
  };

  /*
   * =========================================================
   * CONTINUE
   * =========================================================
   */

  const handleFinish = () => {
    stopSpeaking();

    navigation.navigate(
      "KinderPerspectiveComplete",
      {
        ...(route?.params || {}),

        kinderThought,
      }
    );
  };

  /*
   * =========================================================
   * BACK
   * =========================================================
   */

  const handleBack = () => {
    stopSpeaking();
    navigation.goBack();
  };

  /*
   * =========================================================
   * MESSAGE UI
   * =========================================================
   */

  const renderMessage = ({
    item,
  }) => {
    const isHealio =
      item.sender === "healio";

    return (
      <View
        style={[
          styles.messageRow,

          isHealio
            ? styles.healioRow
            : styles.userRow,
        ]}
      >
        {isHealio && (
          <View style={styles.avatar}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={
                COLORS.primary
              }
            />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,

            isHealio
              ? styles.healioBubble
              : styles.userBubble,
          ]}
        >
          {isHealio && (
            <View
              style={
                styles.messageHeader
              }
            >
              <Text
                style={
                  styles.senderName
                }
              >
                Healio
              </Text>

              {/* Voice button */}

              <TouchableOpacity
                style={
                  styles.voiceButton
                }
                onPress={() =>
                  speakMessage(
                    item.text
                  )
                }
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel=
                  "Read this message aloud"
              >
                <Ionicons
                  name="volume-medium-outline"
                  size={17}
                  color={
                    COLORS.primary
                  }
                />
              </TouchableOpacity>
            </View>
          )}

          <Text
            style={
              styles.messageText
            }
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
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

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
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
              A Kinder Perspective
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              {stageIndex + 1} of{" "}
              {STAGES.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.soundButton}
            onPress={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakMessage(
                  currentStage.prompt
                );
              }
            }}
          >
            <Ionicons
              name={
                isSpeaking
                  ? "volume-mute-outline"
                  : "volume-medium-outline"
              }
              size={19}
              color={
                COLORS.primary
              }
            />
          </TouchableOpacity>
        </View>

        {/* Progress */}

        <View
          style={
            styles.progressContainer
          }
        >
          {STAGES.map(
            (stage, index) => (
              <View
                key={stage.id}
                style={[
                  styles.progressSegment,

                  index <=
                    stageIndex &&
                    styles.activeSegment,
                ]}
              />
            )
          )}
        </View>

        {/* Stage Badge */}

        {!activityComplete && (
          <View
            style={
              styles.stageBadge
            }
          >
            <Ionicons
              name={
                stageIndex === 0
                  ? "eye-outline"
                  : stageIndex === 1
                  ? "chatbubble-outline"
                  : stageIndex === 2
                  ? "people-outline"
                  : "heart-outline"
              }
              size={17}
              color={
                COLORS.primaryDark
              }
            />

            <Text
              style={
                styles.stageBadgeText
              }
            >
              {currentStage.title}
            </Text>
          </View>
        )}

        {/* Messages */}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={
            renderMessage
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.messagesContent
          }
        />

        {/* Typing */}

        {isTyping && (
          <View
            style={styles.typingRow}
          >
            <View
              style={styles.avatar}
            >
              <Ionicons
                name="heart-outline"
                size={18}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Animated.View
              style={[
                styles.typingBubble,

                {
                  opacity:
                    typingOpacity,
                },
              ]}
            >
              <Text
                style={
                  styles.typingText
                }
              >
                • • •
              </Text>
            </Animated.View>
          </View>
        )}

        {/* Complete */}

        {activityComplete ? (
          <View
            style={
              styles.completeArea
            }
          >
            <TouchableOpacity
              style={
                styles.continueButton
              }
              onPress={
                handleFinish
              }
              activeOpacity={0.85}
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
          </View>
        ) : (
          /* Input */

          <View
            style={styles.inputArea}
          >
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={isTyping}
            >
              <Text
                style={styles.skipText}
              >
                Skip this question
              </Text>
            </TouchableOpacity>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={
                  setInputText
                }
                placeholder={
                  currentStage
                    .placeholder
                }
                placeholderTextColor="#A3A0AC"
                multiline
                maxLength={500}
                editable={!isTyping}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,

                  (!inputText.trim() ||
                    isTyping) &&
                    styles.sendDisabled,
                ]}
                onPress={handleSend}
                disabled={
                  !inputText.trim() ||
                  isTyping
                }
              >
                <Ionicons
                  name="send"
                  size={19}
                  color={
                    inputText.trim() &&
                    !isTyping
                      ? COLORS.white
                      : COLORS.disabled
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    height: 61,
    paddingHorizontal: 17,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 41,
    height: 41,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.75)",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  headerSubtitle: {
    marginTop: 2,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 10.5,

    color: COLORS.textSecondary,
  },

  soundButton: {
    width: 41,
    height: 41,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.softLavender,
  },

  progressContainer: {
    height: 5,

    marginHorizontal: 24,

    flexDirection: "row",

    gap: 5,
  },

  progressSegment: {
    flex: 1,

    borderRadius: 3,

    backgroundColor:
      COLORS.border,
  },

  activeSegment: {
    backgroundColor:
      COLORS.primary,
  },

  stageBadge: {
    alignSelf: "center",

    marginTop: 13,

    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.softYellow,
  },

  stageBadgeText: {
    marginLeft: 6,

    fontFamily: "JosefinSans_700Bold",

    fontSize: 12,

    color: COLORS.primaryDark,
  },

  messagesContent: {
    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 20,
  },

  messageRow: {
    width: "100%",

    marginBottom: 14,

    flexDirection: "row",
    alignItems: "flex-end",
  },

  healioRow: {
    justifyContent: "flex-start",
  },

  userRow: {
    justifyContent: "flex-end",
  },

  avatar: {
    width: 35,
    height: 35,

    marginRight: 7,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.softLavender,
  },

  messageBubble: {
    maxWidth: "79%",

    paddingHorizontal: 14,
    paddingVertical: 11,

    borderRadius: 19,
  },

  healioBubble: {
    backgroundColor:
      COLORS.healioBubble,

    borderBottomLeftRadius: 6,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  userBubble: {
    backgroundColor:
      COLORS.userBubble,

    borderBottomRightRadius: 6,
  },

  messageHeader: {
    marginBottom: 4,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  senderName: {
    fontFamily: "JosefinSans_700Bold",

    fontSize: 10.5,

    color: COLORS.primary,
  },

  voiceButton: {
    width: 25,
    height: 25,

    marginLeft: 12,

    alignItems: "center",
    justifyContent: "center",
  },

  messageText: {
    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 14,
    lineHeight: 20,

    color: COLORS.textPrimary,
  },

  typingRow: {
    paddingHorizontal: 17,
    paddingBottom: 7,

    flexDirection: "row",
    alignItems: "center",
  },

  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 9,

    borderRadius: 18,

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  typingText: {
    fontSize: 18,
    letterSpacing: 2,
    color: COLORS.primary,
  },

  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 7,
    paddingBottom: 13,

    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,

    backgroundColor:
      COLORS.background,
  },

  skipButton: {
    alignSelf: "center",

    marginBottom: 7,

    paddingHorizontal: 14,
    paddingVertical: 5,
  },

  skipText: {
    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 11.5,

    color: COLORS.textSecondary,
  },

  inputRow: {
    minHeight: 54,

    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,

    flexDirection: "row",
    alignItems: "flex-end",

    borderRadius: 26,

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  input: {
    flex: 1,

    minHeight: 38,
    maxHeight: 100,

    paddingTop: 8,
    paddingBottom: 7,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 14,

    color: COLORS.textPrimary,
  },

  sendButton: {
    width: 41,
    height: 41,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.primary,
  },

  sendDisabled: {
    backgroundColor:
      "#E1DEE7",
  },

  completeArea: {
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 16,
  },

  continueButton: {
    height: 57,

    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.primary,
  },

  continueText: {
    marginRight: 8,

    fontFamily: "JosefinSans_700Bold",
    fontSize: 16,

    color: COLORS.white,
  },
});