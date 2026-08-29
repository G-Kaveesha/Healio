import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";


const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#666666";
const LIGHT_GRAY = "#DADADA";
const GREEN = "#88BF98";


/*
 * Use the same computer IP address
 * currently used by your Healio backend.
 */
const API_BASE_URL =
  "http://192.168.8.146:8000";

const FEEDBACK_ENDPOINT =
  `${API_BASE_URL}/feedback`;


const FEEDBACK_TYPES = [
  "General feedback",
  "Report a problem",
  "Feature suggestion",
  "Accessibility feedback",
  "Privacy concern",
];


export default function FeedbackScreen({
  navigation,
}) {
  const [
    feedbackType,
    setFeedbackType,
  ] =
    useState(
      "General feedback"
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    isSending,
    setIsSending,
  ] =
    useState(false);


  const chooseFeedbackType =
    () => {
      Alert.alert(
        "Feedback type",
        undefined,
        [
          ...FEEDBACK_TYPES.map(
            (
              option
            ) => ({
              text:
                feedbackType ===
                option
                  ? `✓ ${option}`
                  : option,

              onPress:
                () =>
                  setFeedbackType(
                    option
                  ),
            })
          ),

          {
            text:
              "Cancel",

            style:
              "cancel",
          },
        ]
      );
    };


  const sendFeedback =
    async () => {
      const cleanMessage =
        message.trim();

      if (
        cleanMessage.length <
        5
      ) {
        Alert.alert(
          "Write your feedback",
          "Please enter a short feedback message before sending."
        );

        return;
      }

      if (
        isSending
      ) {
        return;
      }

      setIsSending(
        true
      );

      try {
        const response =
          await fetch(
            FEEDBACK_ENDPOINT,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              /*
               * IMPORTANT:
               * No Firebase UID,
               * nickname or account
               * email is included.
               */
              body:
                JSON.stringify({
                  feedbackType:
                    feedbackType,

                  message:
                    cleanMessage,
                }),
            }
          );


        let data =
          null;

        try {
          data =
            await response.json();
        } catch {
          data =
            null;
        }


        if (
          !response.ok
        ) {
          throw new Error(
            data?.detail ||
            "Feedback could not be sent."
          );
        }


        setMessage("");

        setFeedbackType(
          "General feedback"
        );


        Alert.alert(
          "Feedback sent",
          "Thank you for helping us improve Healio. Your Healio profile information was not included with this feedback.",
          [
            {
              text:
                "OK",
            },
          ]
        );

      } catch (
        error
      ) {
        console.error(
          "Feedback error:",
          error
        );

        Alert.alert(
          "Unable to send feedback",
          error?.message ||
          "Please check your internet connection and try again."
        );

      } finally {
        setIsSending(
          false
        );
      }
    };


  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          WHITE
        }
      />


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
            () =>
              navigation.goBack()
          }
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={BLACK}
          />
        </TouchableOpacity>


        <Text
          style={
            styles.headerTitle
          }
        >
          Feedback
        </Text>


        <View
          style={
            styles.headerSpace
          }
        />
      </View>


      <KeyboardAvoidingView
        style={
          styles.flex
        }
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <Text
            style={
              styles.title
            }
          >
            Send feedback to Healio
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Your feedback can help
            improve Healio’s usability,
            reliability and wellbeing
            support features.
          </Text>


          <Text
            style={
              styles.label
            }
          >
            Feedback type
          </Text>


          <TouchableOpacity
            style={
              styles.selection
            }
            onPress={
              chooseFeedbackType
            }
            disabled={
              isSending
            }
          >
            <Text
              style={
                styles.selectionText
              }
            >
              {feedbackType}
            </Text>

            <Ionicons
              name="chevron-down"
              size={20}
              color={BLACK}
            />
          </TouchableOpacity>


          <Text
            style={
              styles.label
            }
          >
            Your message
          </Text>


          <TextInput
            style={
              styles.textArea
            }
            value={
              message
            }
            onChangeText={
              setMessage
            }
            multiline
            textAlignVertical="top"
            maxLength={3000}
            editable={
              !isSending
            }
            placeholder="Write your feedback here..."
            placeholderTextColor={
              GRAY
            }
          />


          <Text
            style={
              styles.characterCount
            }
          >
            {message.length}/3000
          </Text>


          <View
            style={
              styles.notice
            }
          >
            <Text
              style={
                styles.noticeTitle
              }
            >
              About privacy
            </Text>

            <Text
              style={
                styles.noticeText
              }
            >
              Your nickname, Healio
              account email and user ID
              are not included with this
              feedback.
            </Text>
          </View>


          <Text
            style={
              styles.warning
            }
          >
            Please avoid entering
            passwords, banking
            information, identification
            numbers, journal entries or
            other unnecessary sensitive
            information.
          </Text>


          <TouchableOpacity
            style={[
              styles.sendButton,

              isSending &&
                styles.disabledButton,
            ]}
            onPress={
              sendFeedback
            }
            disabled={
              isSending
            }
            activeOpacity={
              0.85
            }
          >
            {isSending ? (
              <ActivityIndicator
                color={
                  WHITE
                }
              />
            ) : (
              <>
                <Ionicons
                  name="send-outline"
                  size={20}
                  color={
                    WHITE
                  }
                />

                <Text
                  style={
                    styles.sendButtonText
                  }
                >
                  Send Feedback
                </Text>
              </>
            )}
          </TouchableOpacity>


          <Text
            style={
              styles.footerText
            }
          >
            Feedback is sent directly
            to the Healio support
            mailbox.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({
    flex: {
      flex:
        1,
    },

    container: {
      flex:
        1,

      backgroundColor:
        WHITE,
    },

    header: {
      height:
        72,

      paddingHorizontal:
        22,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      borderBottomWidth:
        1,

      borderBottomColor:
        LIGHT_GRAY,
    },

    backButton: {
      width:
        40,

      height:
        40,

      justifyContent:
        "center",
    },

    headerTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        26,

      color:
        BLACK,
    },

    headerSpace: {
      width:
        40,
    },

    scrollContent: {
      padding:
        24,

      paddingBottom:
        45,
    },

    title: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        20,

      color:
        BLACK,
    },

    description: {
      marginTop:
        10,

      marginBottom:
        25,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        14,

      lineHeight:
        21,

      color:
        GRAY,
    },

    label: {
      marginBottom:
        8,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        14,

      color:
        BLACK,
    },

    selection: {
      minHeight:
        50,

      marginBottom:
        22,

      paddingHorizontal:
        14,

      borderWidth:
        1,

      borderColor:
        BLACK,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    selectionText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        15,

      color:
        BLACK,
    },

    textArea: {
      minHeight:
        190,

      padding:
        14,

      borderWidth:
        1,

      borderColor:
        BLACK,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        15,

      lineHeight:
        22,

      color:
        BLACK,
    },

    characterCount: {
      marginTop:
        6,

      textAlign:
        "right",

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      color:
        GRAY,
    },

    notice: {
      marginTop:
        24,

      paddingVertical:
        18,

      borderTopWidth:
        1,

      borderBottomWidth:
        1,

      borderColor:
        LIGHT_GRAY,
    },

    noticeTitle: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        BLACK,
    },

    noticeText: {
      marginTop:
        7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        19,

      color:
        GRAY,
    },

    warning: {
      marginTop:
        18,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        19,

      color:
        BLACK,
    },

    sendButton: {
      minHeight:
        54,

      marginTop:
        26,

      backgroundColor:
        GREEN,

      borderRadius:
        16,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    disabledButton: {
      opacity:
        0.65,
    },

    sendButtonText: {
      marginLeft:
        9,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        WHITE,
    },

    footerText: {
      marginTop:
        16,

      textAlign:
        "center",

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      lineHeight:
        18,

      color:
        GRAY,
    },
  });