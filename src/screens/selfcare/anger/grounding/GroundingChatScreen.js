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
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F5FAF9",
  card: "#FFFFFF",

  primary: "#4E8894",
  primaryDark: "#366B75",

  softTeal: "#DFF1EC",
  softTealStrong: "#CBE8E0",

  softBlue: "#E4F1F7",
  softBlueStrong: "#CFE5F0",

  userBubble: "#DCEEF4",
  healioBubble: "#FFFFFF",

  textPrimary: "#25363A",
  textSecondary: "#6F7E81",

  border: "#D9E9E5",

  white: "#FFFFFF",
  disabled: "#AEBDBE",
};

const GROUNDING_STAGES = [
  {
    id: "see",
    number: 5,
    label: "SEE",
    icon: "eye-outline",

    prompt:
      "Look around you. What are 5 things you can see?",

    acknowledgement:
      "Good. Just notice them for a moment.",

    nextMessage:
      "Now let's notice what you can physically feel.",
  },

  {
    id: "feel",
    number: 4,
    label: "FEEL",
    icon: "hand-left-outline",

    prompt:
      "What are 4 things you can physically feel?",

    acknowledgement:
      "That's enough. Stay with those sensations for a moment.",

    nextMessage:
      "Now listen to what's around you.",
  },

  {
    id: "hear",
    number: 3,
    label: "HEAR",
    icon: "volume-medium-outline",

    prompt:
      "What are 3 sounds you can hear?",

    acknowledgement:
      "Let those sounds come and go.",

    nextMessage:
      "Now gently notice any smells around you.",
  },

  {
    id: "smell",
    number: 2,
    label: "SMELL",
    icon: "flower-outline",

    prompt:
      "What are 2 things you can smell?",

    acknowledgement:
      "That's okay. Simply noticing is enough.",

    nextMessage:
      "One last sense.",
  },

  {
    id: "taste",
    number: 1,
    label: "TASTE",
    icon: "water-outline",

    prompt:
      "Notice one thing you can taste.",

    acknowledgement:
      "You brought your attention back to this moment.",

    nextMessage: null,
  },
];

export default function GroundingChatScreen({
  navigation,
}) {
  const listRef = useRef(null);

  const typingOpacity = useRef(
    new Animated.Value(0.35)
  ).current;

  const [stageIndex, setStageIndex] =
    useState(0);

  const [inputText, setInputText] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [activityComplete, setActivityComplete] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        id: "welcome",
        sender: "healio",
        text:
          "Let's bring your attention back to what's around you.",
      },
      {
        id: "first-question",
        sender: "healio",
        text:
          GROUNDING_STAGES[0].prompt,
      },
    ]);

  const currentStage =
    GROUNDING_STAGES[stageIndex];

  /*
   * Typing animation
   */

  useEffect(() => {
    if (!isTyping) {
      typingOpacity.setValue(0.35);
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
              toValue: 0.35,
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
   * Scroll down automatically
   */

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        listRef.current?.scrollToEnd?.({
          animated: true,
        });
      }, 150);

    return () =>
      clearTimeout(timeout);
  }, [
    messages,
    isTyping,
  ]);

  const createMessage = (
    sender,
    text
  ) => {
    return {
      id:
        Date.now().toString() +
        Math.random()
          .toString(36)
          .slice(2),

      sender,
      text,
    };
  };

  /*
   * Send answer
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

    processStageResponse();
  };

  /*
   * Skip current sense
   */

  const handleSkipStage = () => {
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
          "I'm not sure right now."
        ),
      ]
    );

    processStageResponse(true);
  };

  /*
   * Process structured conversation
   */

  const processStageResponse = (
    skipped = false
  ) => {
    setIsTyping(true);

    setTimeout(() => {
      const acknowledgement =
        skipped
          ? "That's okay. Let's continue gently."
          : currentStage.acknowledgement;

      setMessages(
        (previous) => [
          ...previous,

          createMessage(
            "healio",
            acknowledgement
          ),
        ]
      );

      if (
        stageIndex >=
        GROUNDING_STAGES.length - 1
      ) {
        setTimeout(() => {
          setMessages(
            (previous) => [
              ...previous,

              createMessage(
                "healio",
                "Take one slow, comfortable breath."
              ),
            ]
          );

          setActivityComplete(true);
          setIsTyping(false);
        }, 700);

        return;
      }

      setTimeout(() => {
        const nextIndex =
          stageIndex + 1;

        const nextStage =
          GROUNDING_STAGES[
            nextIndex
          ];

        setStageIndex(nextIndex);

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
      }, 700);
    }, 650);
  };

  const handleFinish = () => {
    navigation.navigate(
      "GroundingComplete"
    );
  };

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
          <View
            style={
              styles.avatar
            }
          >
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
            <Text
              style={
                styles.senderName
              }
            >
              Healio
            </Text>
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
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? 5
            : 0
        }
      >
        {/* Header */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={0.7}
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
              Grounding
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              5-4-3-2-1
            </Text>
          </View>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        {/* Sensory progress */}

        <View
          style={
            styles.progressCard
          }
        >
          {GROUNDING_STAGES.map(
            (stage, index) => {
              const completed =
                index < stageIndex ||
                activityComplete;

              const active =
                index ===
                  stageIndex &&
                !activityComplete;

              return (
                <View
                  key={stage.id}
                  style={
                    styles.progressItem
                  }
                >
                  <View
                    style={[
                      styles.progressCircle,

                      completed &&
                        styles.completedCircle,

                      active &&
                        styles.activeCircle,
                    ]}
                  >
                    {completed ? (
                      <Ionicons
                        name="checkmark"
                        size={15}
                        color={
                          COLORS.white
                        }
                      />
                    ) : (
                      <Text
                        style={[
                          styles.progressNumber,

                          active &&
                            styles.activeNumber,
                        ]}
                      >
                        {stage.number}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.progressLabel,

                      active &&
                        styles.activeLabel,
                    ]}
                  >
                    {stage.label}
                  </Text>
                </View>
              );
            }
          )}
        </View>

        {/* Current sense */}

        {!activityComplete && (
          <View
            style={
              styles.currentStageBadge
            }
          >
            <Ionicons
              name={
                currentStage.icon
              }
              size={18}
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.currentStageText
              }
            >
              {currentStage.number}{" "}
              {currentStage.label.toLowerCase()}
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
            style={
              styles.typingRow
            }
          >
            <View
              style={
                styles.avatar
              }
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

        {/* Complete button */}

        {activityComplete ? (
          <View
            style={
              styles.completeControls
            }
          >
            <TouchableOpacity
              style={
                styles.finishButton
              }
              onPress={
                handleFinish
              }
              activeOpacity={0.85}
            >
              <Text
                style={
                  styles.finishButtonText
                }
              >
                Finish Grounding
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
            style={
              styles.inputSection
            }
          >
            <TouchableOpacity
              style={
                styles.skipButton
              }
              onPress={
                handleSkipStage
              }
              disabled={isTyping}
            >
              <Text
                style={
                  styles.skipText
                }
              >
                Not sure / Skip
              </Text>
            </TouchableOpacity>

            <View
              style={
                styles.inputRow
              }
            >
              <TextInput
                style={
                  styles.input
                }
                value={inputText}
                onChangeText={
                  setInputText
                }
                placeholder="Type what you notice..."
                placeholderTextColor="#9AA8AA"
                multiline
                maxLength={250}
                editable={
                  !isTyping
                }
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,

                  (!inputText.trim() ||
                    isTyping) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={
                  handleSend
                }
                disabled={
                  !inputText.trim() ||
                  isTyping
                }
                activeOpacity={0.8}
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
    backgroundColor:
      COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    height: 59,

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.8)",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",

    color:
      COLORS.textPrimary,
  },

  headerSubtitle: {
    marginTop: 2,

    fontSize: 10.5,
    fontWeight: "600",

    color:
      COLORS.textSecondary,
  },

  headerSpacer: {
    width: 42,
  },

  progressCard: {
    marginHorizontal: 18,
    marginTop: 5,

    paddingHorizontal: 12,
    paddingVertical: 13,

    flexDirection: "row",
    justifyContent: "space-between",

    borderRadius: 20,

    backgroundColor:
      COLORS.card,

    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  progressItem: {
    alignItems: "center",
    width: "19%",
  },

  progressCircle: {
    width: 32,
    height: 32,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.softBlue,
  },

  activeCircle: {
    backgroundColor:
      COLORS.softTealStrong,

    borderWidth: 2,
    borderColor:
      COLORS.primary,
  },

  completedCircle: {
    backgroundColor:
      COLORS.primary,
  },

  progressNumber: {
    fontSize: 12.5,
    fontWeight: "800",

    color:
      COLORS.textSecondary,
  },

  activeNumber: {
    color:
      COLORS.primaryDark,
  },

  progressLabel: {
    marginTop: 5,

    fontSize: 8.5,
    fontWeight: "650",

    color:
      COLORS.textSecondary,
  },

  activeLabel: {
    color:
      COLORS.primaryDark,
    fontWeight: "800",
  },

  currentStageBadge: {
    alignSelf: "center",

    marginTop: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 18,

    backgroundColor:
      COLORS.softTeal,
  },

  currentStageText: {
    marginLeft: 6,

    fontSize: 12,
    fontWeight: "700",

    color:
      COLORS.primaryDark,
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
    justifyContent:
      "flex-start",
  },

  userRow: {
    justifyContent:
      "flex-end",
  },

  avatar: {
    width: 34,
    height: 34,

    marginRight: 7,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.softTeal,
  },

  messageBubble: {
    maxWidth: "78%",

    paddingHorizontal: 15,
    paddingVertical: 11,

    borderRadius: 19,
  },

  healioBubble: {
    backgroundColor:
      COLORS.healioBubble,

    borderBottomLeftRadius: 6,

    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  userBubble: {
    backgroundColor:
      COLORS.userBubble,

    borderBottomRightRadius: 6,
  },

  senderName: {
    marginBottom: 4,

    fontSize: 10.5,
    fontWeight: "800",

    color:
      COLORS.primary,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,

    color:
      COLORS.textPrimary,
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

    backgroundColor:
      COLORS.card,

    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  typingText: {
    fontSize: 18,
    letterSpacing: 2,

    color:
      COLORS.primary,
  },

  inputSection: {
    paddingHorizontal: 16,
    paddingTop: 7,
    paddingBottom: 13,

    backgroundColor:
      COLORS.background,

    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
  },

  skipButton: {
    alignSelf: "center",

    marginBottom: 7,

    paddingHorizontal: 14,
    paddingVertical: 5,
  },

  skipText: {
    fontSize: 11.5,
    fontWeight: "600",

    color:
      COLORS.textSecondary,
  },

  inputRow: {
    minHeight: 53,

    flexDirection: "row",
    alignItems: "flex-end",

    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,

    borderRadius: 25,

    backgroundColor:
      COLORS.card,

    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  input: {
    flex: 1,

    minHeight: 38,
    maxHeight: 95,

    paddingTop: 8,
    paddingBottom: 7,

    fontSize: 14,

    color:
      COLORS.textPrimary,
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

  sendButtonDisabled: {
    backgroundColor:
      "#DFE8E7",
  },

  completeControls: {
    paddingHorizontal: 20,
    paddingTop: 11,
    paddingBottom: 16,
  },

  finishButton: {
    height: 56,

    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.primary,
  },

  finishButtonText: {
    marginRight: 8,

    fontSize: 15.5,
    fontWeight: "700",

    color:
      COLORS.white,
  },
});