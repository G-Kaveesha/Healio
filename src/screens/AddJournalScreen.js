import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  predictEmotion,
  NLP_CONFIDENCE_THRESHOLD,
} from "../services/nlpApi";


const BG = "#EDFFF1";
const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#777777";


const getLocalDateKey = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = `${date.getMonth() + 1}`.padStart(
    2,
    "0"
  );

  const day = `${date.getDate()}`.padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
};


const getDateText = () => {
  return new Date().toLocaleString(
    "en-US",
    {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
};


export default function AddJournalScreen({
  navigation,
}) {
  const [
    journalText,
    setJournalText,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  const handleSaveJournal = async () => {
    const cleanText = journalText.trim();

    if (!cleanText) {
      Alert.alert(
        "Journal needed",
        "Please write something before saving."
      );

      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Login needed",
        "Please log in again."
      );

      return;
    }

    setIsSaving(true);


    let nlpEmotion = null;
    let nlpRawEmotion = null;
    let nlpConfidence = null;
    let nlpStatus = "analysis_failed";

    try {
      /*Analyse journal text using Healio NLP API*/
      try {
        const emotionResult =
          await predictEmotion(
            cleanText
          );

        nlpRawEmotion =
          emotionResult.emotion;

        nlpConfidence =
          Number(
            emotionResult.confidence
          );

        if (
          Number.isFinite(
            nlpConfidence
          ) &&
          nlpConfidence >=
            NLP_CONFIDENCE_THRESHOLD
        ) {
          nlpEmotion =
            nlpRawEmotion;

          nlpStatus =
            "analyzed";
        } else {
          nlpEmotion =
            "Uncertain";

          nlpStatus =
            "low_confidence";
        }

        console.log(
          "Journal NLP result:",
          {
            emotion:
              nlpRawEmotion,
            confidence:
              nlpConfidence,
            finalEmotion:
              nlpEmotion,
            status:
              nlpStatus,
          }
        );
      } catch (nlpError) {
        /*
         * NLP failure must NOT prevent
         * the journal from being saved.
         */
        console.warn(
          "Journal NLP analysis failed:",
          nlpError
        );
      }


      /*
       * ------------------------------------------------
       * STEP 2
       * Save journal + NLP result to Firestore
       * ------------------------------------------------
       */
      await addDoc(
        collection(
          db,
          "journalEntries"
        ),
        {
          userId:
            currentUser.uid,

          text:
            cleanText,

          localDateKey:
            getLocalDateKey(),

          localDateText:
            getDateText(),

          /*
           * NLP prediction fields
           */
          nlpEmotion:
            nlpEmotion,

          nlpRawEmotion:
            nlpRawEmotion,

          nlpConfidence:
            nlpConfidence,

          nlpStatus:
            nlpStatus,

          nlpModel:
            "roberta_emotion_6class",

          /*
           * Timestamps
           */
          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),

          clientCreatedAt:
            Date.now(),
        }
      );


      /*
       * ------------------------------------------------
       * STEP 3
       * Show successful save
       * ------------------------------------------------
       */
      Alert.alert(
        "Saved",
        "Your journal entry was saved.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error(
        "Journal save error:",
        error
      );

      Alert.alert(
        "Save failed",
        "Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BG}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={32}
              color={BLACK}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
          >
            <Feather
              name="more-horizontal"
              size={26}
              color={BLACK}
            />
          </TouchableOpacity>
        </View>


        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* Journal input */}
          <TextInput
            style={styles.journalBox}
            placeholder="How was your day?...."
            placeholderTextColor="#8E8E8E"
            value={journalText}
            onChangeText={
              setJournalText
            }
            multiline
            textAlignVertical="top"
            editable={!isSaving}
          />


          {/* NLP information */}
          <Text
            style={styles.analysisNote}
          >
            Healio will gently analyse
            the emotional tone of your
            journal when you save it.
          </Text>


          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving &&
                styles.disabledButton,
            ]}
            activeOpacity={0.85}
            onPress={
              handleSaveJournal
            }
            disabled={isSaving}
          >
            {isSaving ? (
              <View
                style={
                  styles.savingContent
                }
              >
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.savingText
                  }
                >
                  Analysing and saving...
                </Text>
              </View>
            ) : (
              <Text
                style={
                  styles.saveButtonText
                }
              >
                Save Journal
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    height: 82,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  content: {
    paddingHorizontal: 27,
    paddingBottom: 50,
  },

  journalBox: {
    height: 416,
    borderRadius: 24,
    backgroundColor:
      "#FFFFFF",

    borderWidth: 1.2,
    borderColor:
      "#D8E4DC",

    paddingHorizontal: 32,
    paddingTop: 34,
    paddingBottom: 24,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 15,
    lineHeight: 23,
    color: BLACK,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  analysisNote: {
    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 12,
    lineHeight: 18,

    color: GRAY,

    textAlign: "center",

    marginTop: 22,

    paddingHorizontal: 18,
  },

  saveButton: {
    height: 55,

    borderRadius: 14,

    backgroundColor:
      GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 34,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.14,
    shadowRadius: 6,

    elevation: 4,
  },

  disabledButton: {
    opacity: 0.75,
  },

  saveButtonText: {
    fontFamily:
      "JosefinSans_600SemiBold",

    fontSize: 17,

    color: "#FFFFFF",
  },

  savingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  savingText: {
    fontFamily:
      "JosefinSans_600SemiBold",

    fontSize: 14,

    color: "#FFFFFF",

    marginLeft: 10,
  },
});