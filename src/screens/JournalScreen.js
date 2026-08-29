import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  getNlpEmotionDisplay,
} from "../utils/nlpEmotionData";


const BG = "#EDFFF1";
const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#777777";


const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date =
    timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
};


const getPreviewText = (text) => {
  if (!text) {
    return "No journal text";
  }

  if (text.length <= 35) {
    return text;
  }

  return `${text.substring(
    0,
    35
  )}...`;
};


export default function JournalScreen({
  navigation,
}) {
  const [
    entries,
    setEntries,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const currentUser =
    auth.currentUser;


  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(
        db,
        "journalEntries"
      ),
      where(
        "userId",
        "==",
        currentUser.uid
      )
    );

    const unsubscribe =
      onSnapshot(
        q,

        (snapshot) => {
          const loadedEntries =
            snapshot.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              })
            );

          loadedEntries.sort(
            (a, b) =>
              (b.clientCreatedAt ||
                0) -
              (a.clientCreatedAt ||
                0)
          );

          setEntries(
            loadedEntries
          );

          setIsLoading(false);
        },

        (error) => {
          console.warn(
            "Could not load journal entries:",
            error
          );

          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, [currentUser]);


  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BG}
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <ImageBackground
          source={require("../../assets/images/journal_back.png")}
          opacity={0.5}
          style={
            styles.headerBackground
          }
          resizeMode="cover"
        >
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate(
                "HomeTab"
              )
            }
          >
            <Ionicons
              name="chevron-back"
              size={32}
              color={BLACK}
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerTextBox
            }
          >
            <Text
              style={styles.title}
            >
              Hi there!
            </Text>

            <Text
              style={styles.subtitle}
            >
              Share your thoughts and
              Feelings
            </Text>
          </View>
        </ImageBackground>


        <View
          style={
            styles.addCardWrapper
          }
        >
          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate(
                "AddJournal"
              )
            }
          >
            <Text
              style={
                styles.addCardText
              }
            >
              Write a new journal
            </Text>

            <View
              style={
                styles.plusCircle
              }
            >
              <Ionicons
                name="add"
                size={33}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>
        </View>


        <View
          style={styles.content}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Recent Entries
          </Text>


          {isLoading ? (
            <ActivityIndicator
              color={GREEN}
              size="large"
              style={{
                marginTop: 40,
              }}
            />
          ) : entries.length ===
            0 ? (
            <Text
              style={styles.emptyText}
            >
              No journal entries yet.
              Start by writing what is
              on your mind.
            </Text>
          ) : (
            entries.map(
              (entry) => {
                const emotionDisplay =
                  getNlpEmotionDisplay(
                    entry.nlpEmotion
                  );

                return (
                  <TouchableOpacity
                    key={entry.id}
                    style={
                      styles.entryCard
                    }
                    activeOpacity={
                      0.85
                    }
                    onPress={() =>
                      navigation.navigate(
                        "JournalDetail",
                        {
                          entryId:
                            entry.id,
                          entry,
                        }
                      )
                    }
                  >
                    <View
                      style={[
                        styles.entryEmotionIcon,
                        {
                          backgroundColor:
                            emotionDisplay.color,
                        },
                      ]}
                    >
                      <Text
                        style={
                          styles.entryEmotionEmoji
                        }
                      >
                        {
                          emotionDisplay.emoji
                        }
                      </Text>
                    </View>


                    <View
                      style={
                        styles.entryTextBox
                      }
                    >
                      <Text
                        style={
                          styles.entryMoodName
                        }
                      >
                        {entry.nlpEmotion ||
                          "Not analysed"}
                      </Text>

                      <Text
                        style={
                          styles.entryPreview
                        }
                      >
                        {getPreviewText(
                          entry.text
                        )}
                      </Text>
                    </View>


                    <Text
                      style={
                        styles.entryDate
                      }
                    >
                      {formatDate(
                        entry.createdAt
                      ) ||
                        entry.localDateText}
                    </Text>


                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#777777"
                      style={
                        styles.entryArrow
                      }
                    />
                  </TouchableOpacity>
                );
              }
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BG,
    },


    headerBackground: {
      height: 300,
    },


    backButton: {
      position: "absolute",
      left: 34,
      top: 28,
      zIndex: 2,
    },


    headerTextBox: {
      alignItems: "center",
      marginTop: 96,
    },


    title: {
      fontFamily:
        "Itim_400Regular",
      fontSize: 28,
      color: BLACK,
    },


    subtitle: {
      fontFamily:
        "JosefinSans_600SemiBold",
      fontSize: 16,
      color: BLACK,
      marginTop: 26,
    },


    addCardWrapper: {
      marginTop: -39,
      paddingHorizontal: 32,
    },


    addCard: {
      height: 72,
      borderRadius: 18,
      backgroundColor:
        "#FFFFFF",

      flexDirection: "row",
      alignItems: "center",

      paddingLeft: 26,
      paddingRight: 27,

      justifyContent:
        "space-between",

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.12,
      shadowRadius: 7,

      elevation: 5,
    },


    addCardText: {
      fontFamily:
        "Itim_400Regular",
      fontSize: 17,
      color: BLACK,
    },


    plusCircle: {
      width: 43,
      height: 43,
      borderRadius: 22,

      backgroundColor: GREEN,

      alignItems: "center",
      justifyContent: "center",
    },


    content: {
      paddingHorizontal: 33,
      paddingTop: 35,
      paddingBottom: 90,
    },


    sectionTitle: {
      fontFamily:
        "Itim_400Regular",
      fontSize: 19,
      color: BLACK,
      marginBottom: 36,
    },


    emptyText: {
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 15,
      lineHeight: 22,
      color: GRAY,
    },


    entryCard: {
      height: 74,
      borderRadius: 18,
      backgroundColor:
        "#FFFFFF",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 20,
      marginBottom: 18,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.11,
      shadowRadius: 6,

      elevation: 4,
    },


    /*
     * Replaces the old
     * entryMoodIcon image.
     */
    entryEmotionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,

      alignItems: "center",
      justifyContent: "center",
    },


    entryEmotionEmoji: {
      fontSize: 25,
    },


    entryTextBox: {
      flex: 1,
      marginLeft: 18,
    },


    entryMoodName: {
      fontFamily:
        "JosefinSans_600SemiBold",
      fontSize: 13,
      color: GRAY,
    },


    entryPreview: {
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 12,
      color: GRAY,
      marginTop: 5,
    },


    entryDate: {
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 12,
      color: GRAY,
      marginRight: 12,
    },


    entryArrow: {
      marginRight: -4,
    },
  });