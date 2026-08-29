import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import {
  getTrustedContact,
  openTrustedContactMessage,
} from "../services/trustedContactService";


const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#555555";


export default function CrisisSupportScreen({
  navigation,
}) {


  // -------------------------------------------------------
  // Trusted person
  // -------------------------------------------------------

  const handleTrustedPerson =
    async () => {
      try {
        const contact =
          await getTrustedContact();


        if (!contact) {
          Alert.alert(
            "No trusted person saved",
            "You have not added a trusted person yet. You can add one from Settings → Add Help.",
            [
              {
                text:
                  "OK",
              },
            ]
          );

          return;
        }


        if (!contact.phoneNumber) {
          Alert.alert(
            "Phone number missing",
            `${contact.name} is saved as your trusted person, but no phone number was found. Please update the contact from Settings.`
          );

          return;
        }


        Alert.alert(
          "Message trusted person?",
          `Would you like to message ${contact.name} now and let them know that you could use some support?`,
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

      } catch (error) {
        console.error(
          "Trusted contact error:",
          error
        );

        Alert.alert(
          "Trusted person unavailable",
          "Healio could not load your trusted person right now."
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
        backgroundColor="#FFFFFF"
      />

      <View
        style={
          styles.header
        }
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={
            () =>
              navigation.goBack()
          }
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={BLACK}
          />
        </TouchableOpacity>
      </View>


      <View
        style={
          styles.content
        }
      >
        <View
          style={
            styles.iconCircle
          }
        >
          <Feather
            name="heart"
            size={38}
            color={GREEN}
          />
        </View>


        <Text
          style={
            styles.title
          }
        >
          You are not alone
        </Text>


        <Text
          style={
            styles.quote
          }
        >
          Speaking to someone can be a helpful first step, and you do not have
          to handle everything alone.
        </Text>


        <TouchableOpacity
          style={
            styles.button
          }
          activeOpacity={
            0.85
          }
          onPress={
            () =>
              navigation.navigate(
                "CrisisContacts"
              )
          }
        >
          <Feather
            name="phone"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.buttonText
            }
          >
            View Helplines
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={
            styles.trustedButton
          }
          activeOpacity={
            0.85
          }
          onPress={
            handleTrustedPerson
          }
        >
          <Feather
            name="message-circle"
            size={19}
            color={GREEN}
          />

          <Text
            style={
              styles.trustedButtonText
            }
          >
            Message a trusted person
          </Text>
        </TouchableOpacity>


        <Text
          style={
            styles.note
          }
        >
          Healio will ask for your confirmation before opening a message to
          your trusted person.
        </Text>
      </View>
    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#FFFFFF",
    },

    header: {
      height: 70,
      paddingHorizontal: 28,
      justifyContent:
        "center",
    },

    content: {
      flex: 1,
      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 34,
      paddingBottom: 40,
    },

    iconCircle: {
      width: 78,
      height: 78,
      borderRadius: 39,
      backgroundColor:
        "#EDFFF1",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom: 30,
    },

    title: {
      fontFamily:
        "Itim_400Regular",

      fontSize: 35,
      color: BLACK,
      textAlign:
        "center",
    },

    text: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 16,
      lineHeight: 24,
      color: GRAY,
      textAlign:
        "center",

      marginTop: 20,
    },

    quote: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize: 15,
      lineHeight: 23,
      color: BLACK,
      textAlign:
        "center",

      marginTop: 22,
      marginBottom: 42,
    },

    button: {
      width:
        "100%",

      height:
        58,

      borderRadius:
        18,

      backgroundColor:
        GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      flexDirection:
        "row",
    },

    buttonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        18,

      color:
        "#FFFFFF",

      marginLeft:
        10,
    },

    trustedButton: {
      width:
        "100%",

      height:
        58,

      marginTop:
        18,

      borderRadius:
        18,

      borderWidth:
        1.3,

      borderColor:
        GREEN,

      backgroundColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",

      flexDirection:
        "row",
    },

    trustedButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        16,

      color:
        GREEN,

      marginLeft:
        9,
    },

    secondaryButton: {
      marginTop:
        20,
    },

    secondaryText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        GREEN,
    },

    note: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        19,

      color:
        GRAY,

      textAlign:
        "center",

      marginTop:
        28,
    },
  });