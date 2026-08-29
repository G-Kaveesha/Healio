import React, {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  RefreshControl,
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
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  sendChatMessage,
} from "../services/chatbotApi";

import {
  getTrustedContact,
  openTrustedContactMessage,
} from "../services/trustedContactService";

import {
  markChatbotActivityStarted,
  consumeChatbotResumeRequest,
} from "../services/chatbotActivityNavigation";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const GREEN = "#CFFFD5";

const DARK_GREEN = "#88BF98";

const USER_BUBBLE = "#D9D9D9";

const BLACK = "#111111";

const GRAY = "#8E8E8E";

const CARD_BORDER = "#9BC6A8";

const CARD_BACKGROUND = "#FFFFFF";

const CARD_ICON_BACKGROUND = "#EDFFF1";


/*
 * =========================================================
 * CHAT CONFIGURATION
 * =========================================================
 */

const MAX_CONTEXT_MESSAGES =
  6;


/*
 * This is metadata only.
 *
 * Actual model:
 * FacebookAI/roberta-base
 * fine-tuned locally for Healio's six classes.
 */

const NLP_MODEL_NAME =
  "roberta_emotion_6class";


/*
 * =========================================================
 * WELCOME MESSAGE
 * =========================================================
 */

const createWelcomeMessage =
  () => ({
    id:
      "welcome-message",

    role:
      "bot",

    text:
      "Hi, I’m Healio. I’m here to listen. How are you feeling today?",

    safetyTriggered:
      false,

    safetyLevel:
      "none",

    recommendedActivity:
      null,

    recommendedActivities:
      [],
  });


/*
 * =========================================================
 * CHATBOT SCREEN
 * =========================================================
 */

export default function ChatbotScreen({
  navigation,
}) {
  /*
   * -------------------------------------------------------
   * REFS
   * -------------------------------------------------------
   */

  const flatListRef =
    useRef(null);


  /*
   * -------------------------------------------------------
   * STATE
   * -------------------------------------------------------
   */

  const [
    messageText,
    setMessageText,
  ] = useState("");


  const [
    messages,
    setMessages,
  ] = useState([
    createWelcomeMessage(),
  ]);


  const [
    isBotTyping,
    setIsBotTyping,
  ] = useState(false);


  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);


  const [
    sessionId,
    setSessionId,
  ] = useState(
    Date.now().toString()
  );


  const [
    isSending,
    setIsSending,
  ] = useState(false);


  /*
   * =======================================================
   * START A NEW VISIBLE CHAT
   * =======================================================
   */

  const startFreshVisibleChat =
    useCallback(() => {
      setMessages([
        createWelcomeMessage(),
      ]);

      setMessageText("");

      setIsBotTyping(
        false
      );

      setIsSending(
        false
      );

      setSessionId(
        Date.now().toString()
      );
    }, []);


  /*
   * =======================================================
   * SCREEN FOCUS BEHAVIOR
   *
   * Normal opening:
   * → start a fresh visible chat.
   *
   * Returning after an activity that was launched
   * from the chatbot:
   * → keep the existing chat visible.
   * =======================================================
   */

  useFocusEffect(
    useCallback(() => {
      const shouldResume =
        consumeChatbotResumeRequest();


      if (
        shouldResume
      ) {
        /*
         * Returning from a chatbot-started
         * activity.
         *
         * Keep messages and sessionId.
         */

        setIsBotTyping(
          false
        );

        setIsSending(
          false
        );

        setMessageText("");


        setTimeout(() => {
          flatListRef.current
            ?.scrollToEnd({
              animated:
                true,
            });
        }, 150);

      } else {
        /*
         * Normal opening of Chatbot.
         */

        startFreshVisibleChat();
      }


      return () => {
        setMessageText("");

        setIsBotTyping(
          false
        );

        setIsSending(
          false
        );
      };

    }, [
      startFreshVisibleChat,
    ])
  );


  /*
   * =======================================================
   * SCROLL TO BOTTOM
   * =======================================================
   */

  const scrollToBottom =
    () => {
      setTimeout(() => {
        flatListRef.current
          ?.scrollToEnd({
            animated:
              true,
          });
      }, 100);
    };


  /*
   * =======================================================
   * REFRESH
   *
   * Pulling to refresh intentionally starts a fresh
   * visible conversation/session.
   * =======================================================
   */

  const handleRefresh =
    () => {
      setIsRefreshing(
        true
      );


      startFreshVisibleChat();


      setTimeout(() => {
        setIsRefreshing(
          false
        );
      }, 400);
    };


  /*
   * =======================================================
   * BUILD RECENT CONVERSATION CONTEXT
   *
   * The welcome message is excluded.
   *
   * Failed connection/fallback bot messages are also
   * excluded so they are not sent to Gemini as meaningful
   * conversation history.
   * =======================================================
   */

  const buildRecentConversationContext =
    () => {
      return messages
        .filter(
          (item) =>
            item &&
            item.id !==
              "welcome-message" &&
            !String(
              item.id
            ).startsWith(
              "bot-error-"
            ) &&
            (
              item.role ===
                "user" ||
              item.role ===
                "bot"
            ) &&
            typeof item.text ===
              "string" &&
            item.text.trim()
        )

        .slice(
          -MAX_CONTEXT_MESSAGES
        )

        .map(
          (item) => ({
            role:
              item.role ===
                "bot"
                ? "assistant"
                : "user",

            text:
              item.text.trim(),
          })
        );
    };


  /*
   * =======================================================
   * SAVE USER MESSAGE TO FIRESTORE
   *
   * detectedEmotion belongs to the USER message.
   * =======================================================
   */

  const saveUserMessageToFirestore =
    async ({
      text,
      detectedEmotion = null,
      emotionConfidence = null,
      nlpStatus = null,
      safetyTriggered = false,
      safetyLevel = "none",
    }) => {
      const currentUser =
        auth.currentUser;


      if (
        !currentUser
      ) {
        return;
      }


      try {
        await addDoc(
          collection(
            db,
            "users",
            currentUser.uid,
            "chatMessages"
          ),
          {
            userId:
              currentUser.uid,

            sessionId,

            role:
              "user",

            text,

            detectedEmotion,

            emotionConfidence,

            contextEmotion:
              null,

            contextEmotionConfidence:
              null,

            nlpStatus,

            nlpModel:
              safetyTriggered
                ? null
                : NLP_MODEL_NAME,

            safetyTriggered,

            safetyLevel,

            /*
             * A user message itself does not
             * contain a recommendation.
             */

            recommendedActivityId:
              null,

            recommendedActivityTitle:
              null,

            recommendedActivityType:
              null,

            recommendedActivityScreen:
              null,

            recommendedActivityIds:
              [],

            createdAt:
              serverTimestamp(),

            clientCreatedAt:
              Date.now(),
          }
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to save user chat message:",
          error
        );
      }
    };


  /*
   * =======================================================
   * SAVE ASSISTANT MESSAGE TO FIRESTORE
   *
   * detectedEmotion is intentionally null.
   *
   * contextEmotion is the emotion detected from the
   * triggering USER message.
   * =======================================================
   */

  const saveAssistantMessageToFirestore =
    async ({
      text,
      contextEmotion = null,
      contextEmotionConfidence = null,
      nlpStatus = null,
      safetyTriggered = false,
      safetyLevel = "none",
      recommendedActivity = null,
      recommendedActivities = [],
    }) => {
      const currentUser =
        auth.currentUser;


      if (
        !currentUser
      ) {
        return;
      }


      const safeRecommendedActivities =
        Array.isArray(
          recommendedActivities
        )
          ? recommendedActivities
          : [];


      try {
        await addDoc(
          collection(
            db,
            "users",
            currentUser.uid,
            "chatMessages"
          ),
          {
            userId:
              currentUser.uid,

            sessionId,

            role:
              "assistant",

            text,

            /*
             * Assistant output itself is not
             * emotion-classified.
             */

            detectedEmotion:
              null,

            emotionConfidence:
              null,

            contextEmotion,

            contextEmotionConfidence,

            nlpStatus,

            nlpModel:
              null,

            safetyTriggered,

            safetyLevel,

            /*
             * One ordinary activity recommendation.
             */

            recommendedActivityId:
              recommendedActivity
                ?.id ??
              null,

            recommendedActivityTitle:
              recommendedActivity
                ?.title ??
              null,

            recommendedActivityType:
              recommendedActivity
                ?.type ??
              (
                safeRecommendedActivities
                  .length > 0
                  ? "sleep-options"
                  : null
              ),

            recommendedActivityScreen:
              recommendedActivity
                ?.activityScreen ??
              (
                safeRecommendedActivities
                  .length > 0
                  ? "SleepMusicPlayer"
                  : null
              ),

            /*
             * Used when Healio displays several
             * sleep-music choices.
             */

            recommendedActivityIds:
              safeRecommendedActivities
                .map(
                  (item) =>
                    item?.id
                )
                .filter(
                  Boolean
                ),

            createdAt:
              serverTimestamp(),

            clientCreatedAt:
              Date.now(),
          }
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to save assistant chat message:",
          error
        );
      }
    };


  /*
   * =======================================================
   * UPDATE LIGHTWEIGHT CHAT MEMORY
   * =======================================================
   */

  const updateChatMemorySummary =
    async ({
      userMessage,
      botReply,
      detectedEmotion,
      emotionConfidence,
      safetyTriggered = false,
      safetyLevel = "none",
    }) => {
      const currentUser =
        auth.currentUser;


      if (
        !currentUser
      ) {
        return;
      }


      try {
        await setDoc(
          doc(
            db,
            "users",
            currentUser.uid,
            "chatMemory",
            "summary"
          ),
          {
            userId:
              currentUser.uid,

            lastSessionId:
              sessionId,

            lastUserMessagePreview:
              userMessage.substring(
                0,
                120
              ),

            lastBotReplyPreview:
              botReply.substring(
                0,
                120
              ),

            lastDetectedEmotion:
              detectedEmotion ??
              null,

            lastEmotionConfidence:
              emotionConfidence ??
              null,

            lastSafetyTriggered:
              safetyTriggered,

            lastSafetyLevel:
              safetyLevel,

            updatedAt:
              serverTimestamp(),
          },
          {
            merge:
              true,
          }
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to update chat memory:",
          error
        );
      }
    };


  /*
   * =======================================================
   * TRUSTED PERSON
   * =======================================================
   */

  const handleTrustedPerson =
    async () => {
      try {
        const contact =
          await getTrustedContact();


        if (
          !contact
        ) {
          Alert.alert(
            "No trusted person saved",
            "You have not added a trusted person yet. You can add one from Settings → Add Help.",
            [
              {
                text:
                  "Not now",

                style:
                  "cancel",
              },

              {
                text:
                  "Open Crisis Support",

                onPress:
                  () =>
                    navigation.navigate(
                      "HomeTab",
                      {
                        screen:
                          "CrisisSupport",
                      }
                    ),
              },
            ]
          );

          return;
        }


        if (
          !contact.phoneNumber
        ) {
          Alert.alert(
            "Phone number missing",
            `${contact.name} is saved as your trusted person, but no phone number was found. Please update the contact in Settings.`
          );

          return;
        }


        Alert.alert(
          "Contact trusted person?",
          `Would you like to message ${contact.name} and let them know that you could use some support right now?`,
          [
            {
              text:
                "Not now",

              style:
                "cancel",
            },

            {
              text:
                "Message now",

              onPress:
                async () => {
                  try {
                    await openTrustedContactMessage(
                      contact
                    );

                  } catch (
                    error
                  ) {
                    Alert.alert(
                      "Message unavailable",
                      error?.message ||
                        "Healio could not open your messaging app."
                    );
                  }
                },
            },
          ]
        );

      } catch (
        error
      ) {
        console.error(
          "Trusted contact error:",
          error
        );


        Alert.alert(
          "Trusted person unavailable",
          "Healio could not load your trusted person right now. You can still use Crisis Support."
        );
      }
    };


  /*
   * =======================================================
   * SAFETY OPTIONS
   * =======================================================
   */

  const showSafetyOptions =
    () => {
      Alert.alert(
        "Support is available",
        "Would you like to open Crisis Support or contact your trusted person?",
        [
          {
            text:
              "Stay here",

            style:
              "cancel",
          },

          {
            text:
              "Trusted person",

            onPress:
              handleTrustedPerson,
          },

          {
            text:
              "Crisis Support",

            onPress:
              () =>
                navigation.navigate(
                  "HomeTab",
                  {
                    screen:
                      "CrisisSupport",
                  }
                ),
          },
        ]
      );
    };


  /*
   * =======================================================
   * OPEN REAL HEALIO ACTIVITY
   *
   * The recommendation comes from the controlled backend
   * catalogue.
   *
   * We record that it started from the chatbot.
   *
   * Completion screens can then return to the chatbot
   * only for this path.
   * =======================================================
   */

  const handleOpenActivity =
    (
      activity
    ) => {
      if (
        !activity ||
        typeof activity.id !==
          "string" ||
        !activity.id ||
        typeof activity.activityScreen !==
          "string" ||
        !activity.activityScreen
      ) {
        console.warn(
          "Invalid Healio activity recommendation:",
          activity
        );

        return;
      }


      markChatbotActivityStarted({
        activityId:
          activity.id,

        activityTitle:
          activity.title ??
          null,

        activityType:
          activity.type ??
          "activity",
      });


      const routeParams = {
        /*
         * Helpful for individual activity screens,
         * even though our navigation service also
         * remembers the source.
         */

        source:
          "chatbot",

        chatbotActivityId:
          activity.id,
      };


      /*
       * SleepMusicPlayer expects activityId.
       */

      if (
        activity.type ===
        "sleep"
      ) {
        routeParams.activityId =
          activity.id;
      }


      navigation.navigate(
        "HomeTab",
        {
          screen:
            activity.activityScreen,

          params:
            routeParams,
        }
      );
    };


  /*
   * =======================================================
   * SEND MESSAGE
   * =======================================================
   */

  const handleSendMessage =
    async () => {
      const cleanMessage =
        messageText.trim();


      if (
        !cleanMessage ||
        isSending
      ) {
        return;
      }


      const currentUser =
        auth.currentUser;


      if (
        !currentUser
      ) {
        Alert.alert(
          "Login needed",
          "Please log in before using the chatbot."
        );

        return;
      }


      /*
       * Build history BEFORE adding
       * the current message.
       */

      const recentConversation =
        buildRecentConversationContext();


      /*
       * Immediately display user message.
       */

      const userLocalMessage = {
        id:
          `user-${Date.now()}`,

        role:
          "user",

        text:
          cleanMessage,

        safetyTriggered:
          false,

        recommendedActivity:
          null,

        recommendedActivities:
          [],
      };


      setMessages(
        (
          previousMessages
        ) => [
          ...previousMessages,
          userLocalMessage,
        ]
      );


      setMessageText("");

      setIsSending(
        true
      );

      setIsBotTyping(
        true
      );


      scrollToBottom();


      try {
        /*
         * -------------------------------------------------
         * Call backend
         * -------------------------------------------------
         */

        const result =
          await sendChatMessage(
            cleanMessage,
            recentConversation
          );


        const botReply =
          result.reply;


        const detectedEmotion =
          result.emotion;


        const emotionConfidence =
          result.confidence;


        const nlpStatus =
          result.status;


        const safetyTriggered =
          result.safetyTriggered;


        const safetyLevel =
          result.safetyLevel;


        const recommendedActivity =
          result.recommendedActivity ??
          null;


        const recommendedActivities =
          Array.isArray(
            result.recommendedActivities
          )
            ? result.recommendedActivities
            : [];


        /*
         * -------------------------------------------------
         * Assistant local message
         * -------------------------------------------------
         */

        const botLocalMessage = {
          id:
            `bot-${Date.now()}`,

          role:
            "bot",

          text:
            botReply,

          contextEmotion:
            detectedEmotion,

          contextEmotionConfidence:
            emotionConfidence,

          safetyTriggered,

          safetyLevel,

          recommendedActivity,

          recommendedActivities,
        };


        setMessages(
          (
            previousMessages
          ) => [
            ...previousMessages,
            botLocalMessage,
          ]
        );


        /*
         * -------------------------------------------------
         * Firestore USER message
         * -------------------------------------------------
         */

        await saveUserMessageToFirestore({
          text:
            cleanMessage,

          detectedEmotion,

          emotionConfidence,

          nlpStatus,

          safetyTriggered,

          safetyLevel,
        });


        /*
         * -------------------------------------------------
         * Firestore ASSISTANT message
         * -------------------------------------------------
         */

        await saveAssistantMessageToFirestore({
          text:
            botReply,

          contextEmotion:
            detectedEmotion,

          contextEmotionConfidence:
            emotionConfidence,

          nlpStatus,

          safetyTriggered,

          safetyLevel,

          recommendedActivity,

          recommendedActivities,
        });


        /*
         * -------------------------------------------------
         * Chat memory
         * -------------------------------------------------
         */

        await updateChatMemorySummary({
          userMessage:
            cleanMessage,

          botReply,

          detectedEmotion,

          emotionConfidence,

          safetyTriggered,

          safetyLevel,
        });


        scrollToBottom();


        /*
         * -------------------------------------------------
         * Crisis options
         * -------------------------------------------------
         */

        if (
          safetyTriggered
        ) {
          setTimeout(() => {
            showSafetyOptions();
          }, 500);
        }


      } catch (
        error
      ) {
        console.error(
          "Healio chatbot error:",
          error
        );


        const fallbackMessage = {
          id:
            `bot-error-${Date.now()}`,

          role:
            "bot",

          text:
            "I’m having a little trouble connecting right now. Please try sending your message again in a moment.",

          safetyTriggered:
            false,

          safetyLevel:
            "none",

          recommendedActivity:
            null,

          recommendedActivities:
            [],
        };


        setMessages(
          (
            previousMessages
          ) => [
            ...previousMessages,
            fallbackMessage,
          ]
        );


        scrollToBottom();


        Alert.alert(
          "Connection problem",
          error?.message ||
            "Healio could not respond right now. Please try again."
        );


      } finally {
        setIsBotTyping(
          false
        );

        setIsSending(
          false
        );
      }
    };


  /*
   * =======================================================
   * BACK
   *
   * Leaving the chatbot normally ends the visible session.
   * Firestore history remains stored.
   * =======================================================
   */

  const handleBack =
    () => {
      startFreshVisibleChat();

      navigation.navigate(
        "HomeTab"
      );
    };


  /*
   * =======================================================
   * ACTIVITY CARD
   * =======================================================
   */

  const renderActivityCard =
    (
      activity,
      compact = false
    ) => {
      if (
        !activity
      ) {
        return null;
      }


      const isSleep =
        activity.type ===
        "sleep";


      const isGame =
        activity.type ===
        "game";


      let iconName =
        "leaf-outline";


      if (
        isSleep
      ) {
        iconName =
          "moon-outline";

      } else if (
        isGame
      ) {
        iconName =
          "game-controller-outline";
      }


      return (
        <TouchableOpacity
          key={
            activity.id
          }
          activeOpacity={
            0.82
          }
          style={[
            styles.activityCard,

            compact &&
              styles.sleepCard,
          ]}
          onPress={
            () =>
              handleOpenActivity(
                activity
              )
          }
          accessibilityRole="button"
          accessibilityLabel={
            `Open ${activity.title}`
          }
        >

          <View
            style={
              styles.activityIcon
            }
          >
            <Ionicons
              name={
                iconName
              }
              size={
                20
              }
              color={
                DARK_GREEN
              }
            />
          </View>


          <View
            style={
              styles.activityCardContent
            }
          >

            <Text
              style={
                styles.activityTitle
              }
              numberOfLines={
                2
              }
            >
              {activity.title}
            </Text>


            {activity.subtitle ? (
              <Text
                style={
                  styles.activitySubtitle
                }
                numberOfLines={
                  2
                }
              >
                {activity.subtitle}
              </Text>

            ) : activity.duration ? (
              <Text
                style={
                  styles.activityMeta
                }
              >
                {activity.duration}
              </Text>

            ) : null}

          </View>


          <Ionicons
            name=
              "chevron-forward"
            size={
              20
            }
            color={
              DARK_GREEN
            }
          />

        </TouchableOpacity>
      );
    };


  /*
   * =======================================================
   * RENDER MESSAGE
   * =======================================================
   */

  const renderMessageBubble =
    ({
      item,
    }) => {
      const isBot =
        item.role ===
        "bot";


      const hasSingleRecommendation =
        Boolean(
          isBot &&
          !item.safetyTriggered &&
          item.recommendedActivity
        );


      const hasMultipleRecommendations =
        Boolean(
          isBot &&
          !item.safetyTriggered &&
          Array.isArray(
            item.recommendedActivities
          ) &&
          item.recommendedActivities
            .length > 0
        );


      return (
        <View
          style={[
            styles.messageRow,

            isBot
              ? styles.botMessageRow
              : styles.userMessageRow,
          ]}
        >

          <View
            style={[
              styles.messageBubble,

              isBot
                ? styles.botBubble
                : styles.userBubble,

              (
                hasSingleRecommendation ||
                hasMultipleRecommendations
              ) &&
                styles.messageBubbleWithRecommendation,
            ]}
          >

            <Text
              style={
                styles.messageText
              }
            >
              {item.text}
            </Text>


            {/*
             * ---------------------------------------------
             * ONE REAL HEALIO ACTIVITY
             * ---------------------------------------------
             */}

            {hasSingleRecommendation && (
              <View
                style={
                  styles.recommendationSection
                }
              >

                <Text
                  style={
                    styles.recommendationLabel
                  }
                >
                  Try in Healio
                </Text>


                {renderActivityCard(
                  item.recommendedActivity
                )}

              </View>
            )}


            {/*
             * ---------------------------------------------
             * SLEEP MUSIC OPTIONS
             * ---------------------------------------------
             */}

            {hasMultipleRecommendations && (
              <View
                style={
                  styles.recommendationSection
                }
              >

                <Text
                  style={
                    styles.recommendationLabel
                  }
                >
                  Choose a sleep sound
                </Text>


                {item.recommendedActivities
                  .map(
                    (
                      activity
                    ) =>
                      renderActivityCard(
                        activity,
                        true
                      )
                  )}

              </View>
            )}


            {/*
             * ---------------------------------------------
             * SAFETY SUPPORT
             * ---------------------------------------------
             */}

            {isBot &&
              item.safetyTriggered && (
                <View
                  style={
                    styles.safetyActions
                  }
                >

                  <TouchableOpacity
                    activeOpacity={
                      0.85
                    }
                    style={
                      styles.crisisButton
                    }
                    onPress={
                      () =>
                        navigation.navigate(
                          "HomeTab",
                          {
                            screen:
                              "CrisisSupport",
                          }
                        )
                    }
                    accessibilityRole="button"
                    accessibilityLabel=
                      "Open Crisis Support"
                  >
                    <Text
                      style={
                        styles.crisisButtonText
                      }
                    >
                      Crisis Support
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    activeOpacity={
                      0.8
                    }
                    style={
                      styles.trustedPersonButton
                    }
                    onPress={
                      handleTrustedPerson
                    }
                    accessibilityRole="button"
                    accessibilityLabel=
                      "Message trusted person"
                  >
                    <Text
                      style={
                        styles.trustedPersonButtonText
                      }
                    >
                      Message trusted person
                    </Text>
                  </TouchableOpacity>

                </View>
              )}

          </View>
        </View>
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
        barStyle=
          "dark-content"
        backgroundColor=
          "#FFFFFF"
      />


      <KeyboardAvoidingView
        style={
          styles.keyboardView
        }
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : "height"
        }
      >

        {/*
         * -------------------------------------------------
         * HEADER
         * -------------------------------------------------
         */}

        <View
          style={
            styles.header
          }
        >

          <TouchableOpacity
            activeOpacity={
              0.7
            }
            onPress={
              handleBack
            }
            accessibilityRole="button"
            accessibilityLabel=
              "Back to home"
          >
            <Text
              style={
                styles.backIcon
              }
            >
              ‹
            </Text>
          </TouchableOpacity>


          <Image
            source={require(
              "../../assets/images/chaticon.png"
            )}
            style={
              styles.botAvatar
            }
            resizeMode=
              "contain"
          />

        </View>


        {/*
         * -------------------------------------------------
         * MESSAGES
         * -------------------------------------------------
         */}

        <FlatList
          ref={
            flatListRef
          }
          data={
            messages
          }
          keyExtractor={
            (item) =>
              item.id
          }
          renderItem={
            renderMessageBubble
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps=
            "handled"
          contentContainerStyle={
            styles.chatContent
          }
          onContentSizeChange={
            () =>
              flatListRef.current
                ?.scrollToEnd({
                  animated:
                    true,
                })
          }
          refreshControl={
            <RefreshControl
              refreshing={
                isRefreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor={
                DARK_GREEN
              }
              colors={[
                DARK_GREEN,
              ]}
            />
          }
        />


        {/*
         * -------------------------------------------------
         * TYPING
         * -------------------------------------------------
         */}

        {isBotTyping && (
          <View
            style={
              styles.typingRow
            }
          >
            <View
              style={
                styles.typingBubble
              }
            >
              <Text
                style={
                  styles.typingText
                }
              >
                Healio is typing...
              </Text>
            </View>
          </View>
        )}


        {/*
         * -------------------------------------------------
         * INPUT
         * -------------------------------------------------
         */}

        <View
          style={
            styles.inputBar
          }
        >

          <TextInput
            style={
              styles.input
            }
            placeholder=
              "Type a Message..."
            placeholderTextColor={
              GRAY
            }
            value={
              messageText
            }
            onChangeText={
              setMessageText
            }
            multiline
            maxLength={
              2000
            }
            editable={
              !isSending
            }
            returnKeyType=
              "default"
            accessibilityLabel=
              "Chat message"
          />


          <TouchableOpacity
            activeOpacity={
              0.75
            }
            style={
              styles.sendButton
            }
            onPress={
              handleSendMessage
            }
            disabled={
              isSending ||
              !messageText.trim()
            }
            accessibilityRole="button"
            accessibilityLabel=
              "Send message"
          >
            <Text
              style={[
                styles.sendIcon,

                (
                  isSending ||
                  !messageText.trim()
                ) &&
                  styles.sendIconDisabled,
              ]}
            >
              ➤
            </Text>
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

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
     * -----------------------------------------------------
     * MAIN
     * -----------------------------------------------------
     */

    safeArea: {
      flex: 1,

      backgroundColor:
        "#FFFFFF",
    },


    keyboardView: {
      flex: 1,
    },


    /*
     * -----------------------------------------------------
     * HEADER
     * -----------------------------------------------------
     */

    header: {
      height: 86,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        35,
    },


    backIcon: {
      fontSize:
        44,

      color:
        BLACK,

      marginTop:
        -5,

      marginRight:
        22,
    },


    botAvatar: {
      width:
        58,

      height:
        58,

      borderRadius:
        29,

      borderWidth:
        1,

      borderColor:
        "#DADADA",
    },


    /*
     * -----------------------------------------------------
     * CHAT
     * -----------------------------------------------------
     */

    chatContent: {
      flexGrow: 1,

      paddingHorizontal:
        18,

      paddingTop:
        20,

      paddingBottom:
        25,
    },


    messageRow: {
      width:
        "100%",

      marginBottom:
        18,
    },


    botMessageRow: {
      alignItems:
        "flex-start",
    },


    userMessageRow: {
      alignItems:
        "flex-end",
    },


    messageBubble: {
      maxWidth:
        "82%",

      minHeight:
        48,

      paddingHorizontal:
        18,

      paddingVertical:
        12,
    },


    /*
     * Activity cards sometimes require a little
     * more horizontal room.
     */

    messageBubbleWithRecommendation: {
      maxWidth:
        "90%",
    },


    botBubble: {
      backgroundColor:
        GREEN,

      borderTopLeftRadius:
        22,

      borderTopRightRadius:
        22,

      borderBottomRightRadius:
        22,

      borderBottomLeftRadius:
        4,
    },


    userBubble: {
      backgroundColor:
        USER_BUBBLE,

      borderTopLeftRadius:
        22,

      borderTopRightRadius:
        22,

      borderBottomLeftRadius:
        22,

      borderBottomRightRadius:
        4,
    },


    messageText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        16,

      lineHeight:
        22,

      color:
        BLACK,
    },


    /*
     * -----------------------------------------------------
     * ACTIVITY RECOMMENDATIONS
     * -----------------------------------------------------
     */

    recommendationSection: {
      marginTop:
        15,
    },


    recommendationLabel: {
      marginBottom:
        7,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        12,

      color:
        "#597463",
    },


    activityCard: {
      width:
        "100%",

      minHeight:
        66,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        12,

      paddingVertical:
        10,

      borderRadius:
        15,

      borderWidth:
        1,

      borderColor:
        CARD_BORDER,

      backgroundColor:
        CARD_BACKGROUND,

      marginTop:
        5,
    },


    sleepCard: {
      minHeight:
        64,

      marginBottom:
        2,
    },


    activityIcon: {
      width:
        40,

      height:
        40,

      borderRadius:
        20,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        CARD_ICON_BACKGROUND,

      marginRight:
        10,
    },


    activityCardContent: {
      flex: 1,

      paddingRight:
        7,
    },


    activityTitle: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        14,

      lineHeight:
        18,

      color:
        BLACK,
    },


    activityMeta: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      color:
        "#6D7C71",
    },


    activitySubtitle: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      lineHeight:
        16,

      color:
        "#6D7C71",
    },


    /*
     * -----------------------------------------------------
     * SAFETY
     * -----------------------------------------------------
     */

    safetyActions: {
      marginTop:
        16,
    },


    crisisButton: {
      minHeight:
        44,

      borderRadius:
        14,

      backgroundColor:
        DARK_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        16,
    },


    crisisButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        "#FFFFFF",
    },


    trustedPersonButton: {
      minHeight:
        42,

      marginTop:
        10,

      borderRadius:
        14,

      borderWidth:
        1.2,

      borderColor:
        DARK_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        14,
    },


    trustedPersonButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        14,

      color:
        DARK_GREEN,
    },


    /*
     * -----------------------------------------------------
     * TYPING
     * -----------------------------------------------------
     */

    typingRow: {
      paddingHorizontal:
        18,

      marginBottom:
        10,

      alignItems:
        "flex-start",
    },


    typingBubble: {
      backgroundColor:
        "#F0F0F0",

      borderRadius:
        18,

      paddingHorizontal:
        16,

      paddingVertical:
        10,
    },


    typingText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        14,

      color:
        GRAY,
    },


    /*
     * -----------------------------------------------------
     * INPUT
     * -----------------------------------------------------
     */

    inputBar: {
      minHeight:
        88,

      borderTopWidth:
        1,

      borderTopColor:
        "#BDBDBD",

      backgroundColor:
        "#FFFFFF",

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        22,

      paddingVertical:
        12,
    },


    input: {
      flex: 1,

      maxHeight:
        100,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        18,

      color:
        BLACK,

      paddingHorizontal:
        8,

      paddingTop:
        8,

      paddingBottom:
        8,
    },


    sendButton: {
      width:
        50,

      height:
        50,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginLeft:
        8,
    },


    sendIcon: {
      fontSize:
        32,

      color:
        "#BDBDBD",

      transform: [
        {
          rotate:
            "-20deg",
        },
      ],
    },


    sendIconDisabled: {
      opacity:
        0.45,
    },
  });