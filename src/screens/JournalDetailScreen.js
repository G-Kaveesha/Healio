import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import {
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase/firebaseConfig";

import {
  predictEmotion,
  NLP_CONFIDENCE_THRESHOLD,
} from "../services/nlpApi";

import {
  getNlpEmotionDisplay,
} from "../utils/nlpEmotionData";


const BG = "#EDFFF1";
const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#777777";


const formatDateTime = (entry) => {
  if (entry?.createdAt?.toDate) {
    return entry.createdAt
      .toDate()
      .toLocaleString(
        "en-US",
        {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
  }

  return entry?.localDateText || "";
};


export default function JournalDetailScreen({
  navigation,
  route,
}) {
  const entry = route.params?.entry;

  const emotionDisplay =
    getNlpEmotionDisplay(
      entry?.nlpEmotion
    );

  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false);

  const [
    editModalVisible,
    setEditModalVisible,
  ] = useState(false);

  const [
    editedText,
    setEditedText,
  ] = useState(
    entry?.text || ""
  );

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);


  const handleDelete = () => {
    Alert.alert(
      "Delete journal?",
      "This journal entry will be removed from your account.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteDoc(
                doc(
                  db,
                  "journalEntries",
                  entry.id
                )
              );

              setMenuVisible(false);

              navigation.goBack();
            } catch (error) {
              console.error(
                "Journal delete error:",
                error
              );

              Alert.alert(
                "Delete failed",
                "Please try again."
              );
            }
          },
        },
      ]
    );
  };


  const handleUpdate = async () => {
    const cleanText =
      editedText.trim();

    if (!cleanText) {
      Alert.alert(
        "Journal needed",
        "The journal text cannot be empty."
      );

      return;
    }

    setIsUpdating(true);

    /*
     * Default values are used if
     * NLP analysis cannot complete.
     */
    let nlpEmotion = null;
    let nlpRawEmotion = null;
    let nlpConfidence = null;
    let nlpStatus =
      "analysis_failed";

    try {
      /*
       * Re-analyse the journal because
       * the user has changed the text.
       */
      try {
        const emotionResult =
          await predictEmotion(
            cleanText
          );

        console.log(
          "Updated journal NLP result:",
          emotionResult
        );

        nlpRawEmotion =
          emotionResult.emotion;

        nlpConfidence =
          emotionResult.confidence;

        if (
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
      } catch (nlpError) {
        console.warn(
          "Journal NLP update failed:",
          nlpError
        );

        /*
         * Do not block the update.
         * The journal text should still
         * be saved even if the API is
         * temporarily unavailable.
         */
      }


      await updateDoc(
        doc(
          db,
          "journalEntries",
          entry.id
        ),
        {
          text:
            cleanText,

          nlpEmotion,
          nlpRawEmotion,
          nlpConfidence,
          nlpStatus,

          nlpModel:
            "roberta_emotion_6class",

          updatedAt:
            serverTimestamp(),
        }
      );


      setEditModalVisible(false);

      setMenuVisible(false);


      Alert.alert(
        "Updated",
        "Your journal entry was updated.",
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
        "Journal update error:",
        error
      );

      Alert.alert(
        "Update failed",
        "Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };


  const handleActivities = () => {
    setMenuVisible(false);

    Alert.alert(
      "Activities",
      "Personalized self-care activities will be connected using the detected journal emotion."
    );
  };


  if (!entry) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <Text
          style={styles.errorText}
        >
          Journal entry not found.
        </Text>
      </SafeAreaView>
    );
  }


  const confidencePercentage =
    typeof entry.nlpConfidence ===
    "number"
      ? Math.round(
          entry.nlpConfidence *
            100
        )
      : null;


  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BG}
      />


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
          onPress={() =>
            setMenuVisible(true)
          }
        >
          <Feather
            name="more-horizontal"
            size={27}
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
      >
        <Text
          style={styles.dateText}
        >
          {formatDateTime(entry)}
        </Text>


        <View
          style={[
            styles.detectedEmotionIcon,
            {
              backgroundColor:
                emotionDisplay.color,
            },
          ]}
        >
          <Text
            style={
              styles.detectedEmotionEmoji
            }
          >
            {emotionDisplay.emoji}
          </Text>
        </View>


        <Text
          style={styles.moodName}
        >
          {entry.nlpEmotion ||
            "Not analysed"}
        </Text>


        <Text
          style={
            styles.detectedLabel
          }
        >
          AI detected emotion
        </Text>


        {confidencePercentage !==
          null && (
          <Text
            style={
              styles.confidenceText
            }
          >
            AI confidence:{" "}
            {confidencePercentage}%
          </Text>
        )}


        <Text
          style={styles.diaryLabel}
        >
          Diary text
        </Text>


        <Text
          style={styles.diaryText}
        >
          {entry.text}
        </Text>
      </ScrollView>


      {/* Menu Modal */}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setMenuVisible(false)
        }
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.menuOverlay}
          onPress={() =>
            setMenuVisible(false)
          }
        >
          <View
            style={styles.menuCard}
          >
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.8}
              onPress={() => {
                setMenuVisible(
                  false
                );

                setEditedText(
                  entry.text || ""
                );

                setEditModalVisible(
                  true
                );
              }}
            >
              <Feather
                name="edit-2"
                size={22}
                color={BLACK}
              />

              <Text
                style={
                  styles.menuText
                }
              >
                Edit
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.8}
              onPress={handleDelete}
            >
              <Feather
                name="trash-2"
                size={23}
                color={BLACK}
              />

              <Text
                style={
                  styles.menuText
                }
              >
                Delete
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.8}
              onPress={
                handleActivities
              }
            >
              <Feather
                name="heart"
                size={23}
                color={BLACK}
              />

              <Text
                style={
                  styles.menuText
                }
              >
                Activities
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>


      {/* Edit Journal Modal */}

      <Modal
        visible={
          editModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditModalVisible(
            false
          )
        }
      >
        <View
          style={
            styles.editOverlay
          }
        >
          <KeyboardAvoidingView
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : "height"
            }
            style={
              styles.editKeyboard
            }
          >
            <View
              style={styles.editCard}
            >
              <Text
                style={
                  styles.editTitle
                }
              >
                Edit Journal
              </Text>


              <TextInput
                style={
                  styles.editInput
                }
                value={editedText}
                onChangeText={
                  setEditedText
                }
                multiline
                textAlignVertical="top"
              />


              <View
                style={
                  styles.editButtonRow
                }
              >
                <TouchableOpacity
                  style={
                    styles.cancelButton
                  }
                  onPress={() =>
                    setEditModalVisible(
                      false
                    )
                  }
                  disabled={
                    isUpdating
                  }
                >
                  <Text
                    style={
                      styles.cancelText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isUpdating &&
                      styles.disabledButton,
                  ]}
                  onPress={
                    handleUpdate
                  }
                  disabled={
                    isUpdating
                  }
                >
                  {isUpdating ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={
                        styles.saveText
                      }
                    >
                      Save
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
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
    paddingHorizontal: 64,
    paddingBottom: 80,
  },


  dateText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 16,
    color: GRAY,
    textAlign: "center",
    marginTop: 4,
  },


  detectedEmotionIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
  },


  detectedEmotionEmoji: {
    fontSize: 40,
  },


  moodName: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 17,
    color: BLACK,
    textAlign: "center",
    marginTop: 18,
  },


  detectedLabel: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 12,
    color: GRAY,
    textAlign: "center",
    marginTop: 7,
  },


  confidenceText: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 12,
    color: GRAY,
    textAlign: "center",
    marginTop: 5,
  },


  diaryLabel: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 17,
    color: BLACK,
    marginTop: 56,
    marginBottom: 20,
  },


  diaryText: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    lineHeight: 25,
    color: BLACK,
  },


  errorText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 16,
    color: BLACK,
    textAlign: "center",
    marginTop: 80,
  },


  menuOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.05)",
    alignItems: "flex-end",
    justifyContent:
      "flex-start",
    paddingTop: 75,
    paddingRight: 28,
  },


  menuCard: {
    width: 185,
    backgroundColor: BG,
    borderRadius: 2,
    paddingVertical: 14,
  },


  menuRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 23,
  },


  menuText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 16,
    color: BLACK,
    marginLeft: 27,
  },


  editOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.25)",
    justifyContent: "center",
    paddingHorizontal: 27,
  },


  editKeyboard: {
    width: "100%",
  },


  editCard: {
    backgroundColor:
      "#FFFFFF",
    borderRadius: 24,
    padding: 24,
  },


  editTitle: {
    fontFamily:
      "Itim_400Regular",
    fontSize: 26,
    color: BLACK,
    textAlign: "center",
    marginBottom: 18,
  },


  editInput: {
    height: 220,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#D9D9D9",
    backgroundColor:
      "#F8F8F8",
    padding: 16,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 15,
    lineHeight: 22,
    color: BLACK,
  },


  editButtonRow: {
    flexDirection: "row",
    marginTop: 22,
  },


  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor:
      "#EFEFEF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },


  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 8,
  },


  disabledButton: {
    opacity: 0.75,
  },


  cancelText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: BLACK,
  },


  saveText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});