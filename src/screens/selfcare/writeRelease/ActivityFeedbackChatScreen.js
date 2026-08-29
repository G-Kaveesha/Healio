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
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler,
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
  finishChatbotStartedActivity,
} from "../../../services/chatbotActivityNavigation";


const BACKGROUND =
  "#F4FAF7";

const BOT_COLOR =
  "#E5F3EA";

const USER_COLOR =
  "#B8D8FF";

const PRIMARY_GREEN =
  "#88BF98";

const DARK_GREEN =
  "#5C816D";


const QUICK_REPLIES = [
  "A little calmer",
  "About the same",
  "Still upset",
  "I’m not sure",
];


function createMessage(
  id,
  sender,
  text
) {
  return {
    id,
    sender,
    text,
  };
}


function generateDemoReply(
  userText
) {
  const normalizedText =
    userText
      .trim()
      .toLowerCase();


  const urgentWords = [
    "hurt myself",
    "harm myself",
    "kill myself",
    "suicide",
    "not safe",
  ];


  if (
    urgentWords.some(
      (word) =>
        normalizedText.includes(
          word
        )
    )
  ) {
    return (
      "I’m really sorry that you are feeling this much pain. " +
      "Healio cannot provide emergency support. Please contact a trusted person, " +
      "local emergency service, or crisis-support service now, and try not to remain alone."
    );
  }


  if (
    normalizedText.includes(
      "calmer"
    ) ||
    normalizedText.includes(
      "better"
    ) ||
    normalizedText.includes(
      "relaxed"
    )
  ) {
    return (
      "I’m glad there is even a small sense of calm. " +
      "You do not need to solve everything right now. " +
      "Would resting quietly or doing one gentle grounding activity feel helpful next?"
    );
  }


  if (
    normalizedText.includes(
      "same"
    ) ||
    normalizedText.includes(
      "no change"
    )
  ) {
    return (
      "Thank you for being honest. Sometimes one activity does not change the feeling immediately. " +
      "We can stay with it gently. Would you prefer another slow breath or a short grounding activity?"
    );
  }


  if (
    normalizedText.includes(
      "upset"
    ) ||
    normalizedText.includes(
      "angry"
    ) ||
    normalizedText.includes(
      "worse"
    )
  ) {
    return (
      "It sounds like the feeling is still quite strong. You have not done anything wrong. " +
      "Would it feel better to pause with a grounding activity, or contact someone you trust for support?"
    );
  }


  if (
    normalizedText.includes(
      "not sure"
    ) ||
    normalizedText.includes(
      "don't know"
    ) ||
    normalizedText.includes(
      "do not know"
    )
  ) {
    return (
      "That is completely okay. You do not need to name the feeling perfectly. " +
      "Take a moment to notice whether your body feels tense, tired, lighter, or unchanged."
    );
  }


  return (
    "Thank you for sharing that with me. I’m here to listen without judging. " +
    "What part of the feeling seems strongest for you right now?"
  );
}


export default function ActivityFeedbackChatScreen({
  navigation,
  route,
}) {
  const listRef =
    useRef(null);


  const activityName =
    route?.params
      ?.activityName ??
    "Write It, Release It";


  const [
    messages,
    setMessages,
  ] = useState([
    createMessage(
      "initial-message",
      "bot",
      `You have completed ${activityName}. You gave yourself some private space to pause and release what was on your mind. How do you feel now?`
    ),
  ]);


  const [
    input,
    setInput,
  ] = useState("");


  const [
    isTyping,
    setIsTyping,
  ] = useState(false);


  /*
   * =======================================================
   * BACK TO MAIN SELF CARE
   * =======================================================
   *
   * This is the standard back behavior for completed
   * self-care activities.
   *
   * We reset the Home stack to:
   *
   * HomeMain
   * → SelfCare
   *
   * This removes all Write It, Release It activity screens
   * from the navigation history.
   *
   * Therefore:
   *
   * Header back
   * → SelfCare
   *
   * Android physical back
   * → SelfCare
   *
   * The previous activity screens cannot unexpectedly
   * reopen afterwards.
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {
        navigation.reset({
          index: 1,

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
   * FINISH ACTIVITY
   * =======================================================
   *
   * IMPORTANT:
   *
   * We preserve your existing chatbot-return logic.
   *
   * Chatbot-started activity:
   * → return to the same chatbot conversation.
   *
   * Normal Self Care activity:
   * → fallback to AngerActivities.
   *
   * This button is intentionally different from the
   * screen's Back button.
   * =======================================================
   */

  const handleFinish =
    () => {
      finishChatbotStartedActivity({
        navigation,

        activityId:
          "write-release",

        fallbackRoute:
          "AngerActivities",
      });
    };


  /*
   * =======================================================
   * SEND FEEDBACK MESSAGE
   * =======================================================
   */

  const sendMessage =
    (text) => {
      const cleanText =
        text.trim();


      if (
        !cleanText ||
        isTyping
      ) {
        return;
      }


      const userMessage =
        createMessage(
          `user-${Date.now()}`,
          "user",
          cleanText
        );


      setMessages(
        (
          currentMessages
        ) => [
          ...currentMessages,
          userMessage,
        ]
      );


      setInput("");


      setIsTyping(
        true
      );


      setTimeout(
        () => {
          const botMessage =
            createMessage(
              `bot-${Date.now()}`,
              "bot",
              generateDemoReply(
                cleanText
              )
            );


          setMessages(
            (
              currentMessages
            ) => [
              ...currentMessages,
              botMessage,
            ]
          );


          setIsTyping(
            false
          );
        },
        800
      );
    };


  /*
   * =======================================================
   * RENDER MESSAGE
   * =======================================================
   */

  const renderMessage =
    ({
      item,
    }) => {
      const isUser =
        item.sender ===
        "user";


      return (
        <View
          style={[
            styles.messageRow,

            isUser
              ? styles.userMessageRow
              : styles.botMessageRow,
          ]}
        >
          {!isUser && (
            <View
              style={
                styles.botAvatar
              }
            >
              <Ionicons
                name="heart-outline"
                size={18}
                color={
                  DARK_GREEN
                }
              />
            </View>
          )}


          <View
            style={[
              styles.messageBubble,

              isUser
                ? styles.userBubble
                : styles.botBubble,
            ]}
          >
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


  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <SafeAreaView
      style={
        styles.container
      }
      edges={[
        "top",
        "bottom",
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          BACKGROUND
        }
      />


      <KeyboardAvoidingView
        style={
          styles.keyboardContainer
        }
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : undefined
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
              styles.backButton
            }
            onPress={
              handleBackToSelfCare
            }
            activeOpacity={
              0.75
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color="#111111"
            />
          </TouchableOpacity>


          <View
            style={
              styles.headerTextContainer
            }
          >
            <Text
              style={
                styles.headerTitle
              }
            >
              A gentle check-in
            </Text>


            <Text
              style={
                styles.headerSubtitle
              }
            >
              Notice how you feel now
            </Text>
          </View>


          <View
            style={
              styles.headerPlaceholder
            }
          />
        </View>


        {/* =================================================
            CHAT
           ================================================= */}

        <FlatList
          ref={
            listRef
          }
          data={
            messages
          }
          keyExtractor={
            (item) =>
              item.id
          }
          renderItem={
            renderMessage
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.messageList
          }
          onContentSizeChange={
            () =>
              listRef.current
                ?.scrollToEnd({
                  animated:
                    true,
                })
          }
        />


        {/* =================================================
            TYPING
           ================================================= */}

        {isTyping && (
          <View
            style={
              styles.typingContainer
            }
          >
            <ActivityIndicator
              size="small"
              color="#628271"
            />


            <Text
              style={
                styles.typingText
              }
            >
              Healio is responding gently...
            </Text>
          </View>
        )}


        {/* =================================================
            QUICK REPLIES
           ================================================= */}

        <View
          style={
            styles.quickReplyContainer
          }
        >
          {QUICK_REPLIES.map(
            (reply) => (
              <TouchableOpacity
                key={
                  reply
                }
                activeOpacity={
                  0.8
                }
                style={
                  styles.quickReply
                }
                disabled={
                  isTyping
                }
                onPress={
                  () =>
                    sendMessage(
                      reply
                    )
                }
              >
                <Text
                  style={
                    styles.quickReplyText
                  }
                >
                  {reply}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>


        {/* =================================================
            INPUT
           ================================================= */}

        <View
          style={
            styles.inputContainer
          }
        >
          <TextInput
            value={
              input
            }
            onChangeText={
              setInput
            }
            placeholder="Tell Healio how you feel..."
            placeholderTextColor="#898989"
            multiline
            maxLength={
              1000
            }
            editable={
              !isTyping
            }
            style={
              styles.input
            }
          />


          <TouchableOpacity
            activeOpacity={
              0.8
            }
            disabled={
              !input.trim() ||
              isTyping
            }
            style={[
              styles.sendButton,

              (
                !input.trim() ||
                isTyping
              ) &&
                styles.sendButtonDisabled,
            ]}
            onPress={
              () =>
                sendMessage(
                  input
                )
            }
            accessibilityRole="button"
            accessibilityLabel="Send check-in message"
          >
            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>


        {/* =================================================
            FINISH
           ================================================= */}

        <TouchableOpacity
          style={
            styles.finishButton
          }
          onPress={
            handleFinish
          }
          activeOpacity={
            0.85
          }
          accessibilityRole="button"
          accessibilityLabel="Finish activity"
        >
          <Text
            style={
              styles.finishButtonText
            }
          >
            Finish Activity
          </Text>


          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color="#FFFFFF"
          />
        </TouchableOpacity>


        <Text
          style={
            styles.supportNotice
          }
        >
          This check-in is for general wellbeing support
          and is not professional mental-health care.
        </Text>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({

    container: {
      flex: 1,

      backgroundColor:
        BACKGROUND,
    },


    keyboardContainer: {
      flex: 1,
    },


    /*
     * =====================================================
     * HEADER
     * =====================================================
     */

    header: {
      minHeight:
        74,

      paddingHorizontal:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      borderBottomWidth:
        1,

      borderBottomColor:
        "#DDE9E2",
    },


    backButton: {
      width:
        42,

      height:
        42,

      justifyContent:
        "center",
    },


    headerTextContainer: {
      flex:
        1,

      alignItems:
        "center",
    },


    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        19,

      color:
        "#1D1D1D",

      textAlign:
        "center",
    },


    headerSubtitle: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        "#78827D",

      textAlign:
        "center",
    },


    headerPlaceholder: {
      width:
        42,
    },


    /*
     * =====================================================
     * MESSAGES
     * =====================================================
     */

    messageList: {
      paddingHorizontal:
        17,

      paddingTop:
        20,

      paddingBottom:
        20,
    },


    messageRow: {
      marginBottom:
        15,

      flexDirection:
        "row",

      alignItems:
        "flex-end",
    },


    userMessageRow: {
      justifyContent:
        "flex-end",
    },


    botMessageRow: {
      justifyContent:
        "flex-start",
    },


    botAvatar: {
      width:
        32,

      height:
        32,

      marginRight:
        8,

      borderRadius:
        16,

      backgroundColor:
        "#D9EADF",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    messageBubble: {
      maxWidth:
        "78%",

      paddingHorizontal:
        15,

      paddingVertical:
        12,

      borderRadius:
        18,
    },


    botBubble: {
      backgroundColor:
        BOT_COLOR,

      borderBottomLeftRadius:
        5,
    },


    userBubble: {
      backgroundColor:
        USER_COLOR,

      borderBottomRightRadius:
        5,
    },


    messageText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        15,

      lineHeight:
        21,

      color:
        "#343434",
    },


    /*
     * =====================================================
     * TYPING
     * =====================================================
     */

    typingContainer: {
      paddingHorizontal:
        22,

      paddingBottom:
        8,

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    typingText: {
      marginLeft:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      color:
        "#708078",
    },


    /*
     * =====================================================
     * QUICK REPLIES
     * =====================================================
     */

    quickReplyContainer: {
      paddingHorizontal:
        15,

      paddingBottom:
        10,

      flexDirection:
        "row",

      flexWrap:
        "wrap",
    },


    quickReply: {
      marginRight:
        7,

      marginBottom:
        7,

      paddingHorizontal:
        12,

      paddingVertical:
        8,

      backgroundColor:
        "#FFFFFF",

      borderWidth:
        1,

      borderColor:
        "#9FC9AF",

      borderRadius:
        16,
    },


    quickReplyText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      color:
        "#4F6F5D",
    },


    /*
     * =====================================================
     * INPUT
     * =====================================================
     */

    inputContainer: {
      marginHorizontal:
        15,

      paddingLeft:
        15,

      paddingRight:
        6,

      minHeight:
        52,

      maxHeight:
        110,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#FFFFFF",

      borderWidth:
        1,

      borderColor:
        "#D3E2D9",

      borderRadius:
        25,
    },


    input: {
      flex:
        1,

      paddingVertical:
        10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        14,

      color:
        "#303030",
    },


    sendButton: {
      width:
        41,

      height:
        41,

      borderRadius:
        21,

      backgroundColor:
        PRIMARY_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    sendButtonDisabled: {
      backgroundColor:
        "#C9D5CE",
    },


    /*
     * =====================================================
     * FINISH
     * =====================================================
     */

    finishButton: {
      minHeight:
        52,

      marginHorizontal:
        15,

      marginTop:
        12,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        PRIMARY_GREEN,
    },


    finishButtonText: {
      marginRight:
        8,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        "#FFFFFF",
    },


    supportNotice: {
      paddingHorizontal:
        22,

      paddingTop:
        8,

      paddingBottom:
        10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10,

      lineHeight:
        14,

      color:
        "#8A8A8A",

      textAlign:
        "center",
    },
  });