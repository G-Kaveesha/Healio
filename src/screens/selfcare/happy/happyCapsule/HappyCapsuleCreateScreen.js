import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background: "#FFF9F1",

  card: "#FFFFFF",

  yellow: "#FFE7A3",
  yellowDark: "#B9832B",

  peach: "#F7C6A3",

  coral: "#F09278",
  coralDark: "#C96B56",

  softBlue: "#E3F2F7",
  blue: "#73AAC1",

  softPink: "#FCE7E4",

  softCream: "#FFF1D7",

  textPrimary: "#3D3934",
  textSecondary: "#7A746C",

  border: "#EDE2D6",

  white: "#FFFFFF",

  disabled: "#BBB4AC",
};


/*
 * =========================================================
 * MEMORY TYPES
 * =========================================================
 */

const MEMORY_TYPES = [
  {
    id: "happy-moment",

    label:
      "Happy moment",

    icon:
      "happy-outline",

    color:
      "#FFE7A3",
  },

  {
    id: "proud",

    label:
      "Something I'm proud of",

    icon:
      "trophy-outline",

    color:
      "#F7C6A3",
  },

  {
    id: "someone",

    label:
      "Someone special",

    icon:
      "heart-outline",

    color:
      "#FCE7E4",
  },

  {
    id: "laugh",

    label:
      "Something funny",

    icon:
      "sparkles-outline",

    color:
      "#E3F2F7",
  },

  {
    id: "future",

    label:
      "Something ahead",

    icon:
      "sunny-outline",

    color:
      "#FFF1D7",
  },
];


/*
 * =========================================================
 * FEELINGS
 * =========================================================
 */

const FEELINGS = [
  {
    id: "joyful",
    label: "Joyful",
  },

  {
    id: "grateful",
    label: "Grateful",
  },

  {
    id: "proud",
    label: "Proud",
  },

  {
    id: "loved",
    label: "Loved",
  },

  {
    id: "peaceful",
    label: "Peaceful",
  },

  {
    id: "excited",
    label: "Excited",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function HappyCapsuleCreateScreen({
  navigation,
  route,
}) {
  const [
    selectedType,
    setSelectedType,
  ] = useState(null);

  const [
    memoryText,
    setMemoryText,
  ] = useState("");

  const [
    selectedFeeling,
    setSelectedFeeling,
  ] = useState(null);


  /*
   * =======================================================
   * VALIDATION
   * =======================================================
   */

  const canContinue =
    Boolean(
      selectedType &&
      memoryText.trim() &&
      selectedFeeling
    );


  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {
      if (!canContinue) {
        return;
      }

      navigation.navigate(
        "HappyCapsuleSeal",
        {
          ...(route?.params || {}),

          capsuleType:
            selectedType,

          capsuleMemory:
            memoryText.trim(),

          capsuleFeeling:
            selectedFeeling,
        }
      );
    };


  /*
   * =======================================================
   * UI
   * =======================================================
   */

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
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* =================================================
            HEADER
           ================================================= */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={() =>
              navigation.goBack()
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={27}
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
              My Happy Capsule
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Create
            </Text>
          </View>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* =================================================
            PROGRESS
           ================================================= */}

        <View
          style={
            styles.progressContainer
          }
        >
          <View
            style={[
              styles.progressPart,
              styles.progressActive,
            ]}
          />

          <View
            style={[
              styles.progressPart,
              styles.progressInactive,
            ]}
          />

          <View
            style={[
              styles.progressPart,
              styles.progressInactive,
            ]}
          />
        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            FIRST
          </Text>


          <Text
            style={styles.title}
          >
            What are you keeping?
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Pick the closest match.
          </Text>


          {/* Memory Types */}

          <View
            style={
              styles.typeContainer
            }
          >
            {MEMORY_TYPES.map(
              (item) => {
                const selected =
                  selectedType
                    ?.id ===
                  item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.typeChip,

                      {
                        backgroundColor:
                          item.color,
                      },

                      selected &&
                        styles.typeChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedType(
                        item
                      )
                    }
                    activeOpacity={0.82}
                  >
                    <View
                      style={[
                        styles.typeIcon,

                        selected &&
                          styles.typeIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={
                          item.icon
                        }
                        size={19}
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.textPrimary
                        }
                      />
                    </View>


                    <Text
                      style={[
                        styles.typeText,

                        selected &&
                          styles.typeTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>


                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={
                          COLORS.coral
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              }
            )}
          </View>


          {/* Memory Writing */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={
                styles.sectionNumber
              }
            >
              02
            </Text>

            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                What happened?
              </Text>

              <Text
                style={
                  styles.sectionHint
                }
              >
                Keep it short if you
                like.
              </Text>
            </View>
          </View>


          <View
            style={
              styles.inputCard
            }
          >
            <TextInput
              style={
                styles.memoryInput
              }
              value={
                memoryText
              }
              onChangeText={
                setMemoryText
              }
              placeholder="Write your good moment here..."
              placeholderTextColor="#AAA197"
              multiline
              maxLength={350}
              textAlignVertical="top"
            />

            <Text
              style={
                styles.characterCount
              }
            >
              {memoryText.length}/350
            </Text>
          </View>


          {/* Feeling */}

          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={
                styles.sectionNumber
              }
            >
              03
            </Text>

            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                What feeling belongs
                here?
              </Text>

              <Text
                style={
                  styles.sectionHint
                }
              >
                Choose one.
              </Text>
            </View>
          </View>


          <View
            style={
              styles.feelingsContainer
            }
          >
            {FEELINGS.map(
              (feeling) => {
                const selected =
                  selectedFeeling ===
                  feeling.id;

                return (
                  <TouchableOpacity
                    key={
                      feeling.id
                    }
                    style={[
                      styles.feelingChip,

                      selected &&
                        styles.feelingChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedFeeling(
                        feeling.id
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.feelingText,

                        selected &&
                          styles.feelingTextSelected,
                      ]}
                    >
                      {
                        feeling.label
                      }
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </ScrollView>


        {/* =================================================
            BOTTOM
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !canContinue &&
                styles.disabledButton,
            ]}
            disabled={
              !canContinue
            }
            onPress={
              handleContinue
            }
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.continueText,

                !canContinue &&
                  styles.disabledText,
              ]}
            >
              Ready to Seal
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                canContinue
                  ? COLORS.white
                  : COLORS.disabled
              }
            />
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
    safeArea: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    header: {
      height: 62,

      paddingHorizontal: 18,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    headerButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.82)",
    },

    headerCenter: {
      alignItems: "center",
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.textPrimary,
    },

    headerSubtitle: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    progressContainer: {
      paddingHorizontal: 24,

      flexDirection: "row",

      gap: 7,
    },

    progressPart: {
      flex: 1,

      height: 6,

      borderRadius: 20,
    },

    progressActive: {
      backgroundColor:
        COLORS.coral,
    },

    progressInactive: {
      backgroundColor:
        "#E9E1D8",
    },

    scroll: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 23,

      paddingTop: 26,

      paddingBottom: 25,
    },

    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1.4,

      color:
        COLORS.coral,
    },

    title: {
      marginTop: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 30,

      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      color:
        COLORS.textSecondary,
    },

    typeContainer: {
      marginTop: 22,
    },

    typeChip: {
      minHeight: 67,

      marginBottom: 10,

      paddingHorizontal: 12,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      borderWidth: 1.5,

      borderColor:
        "transparent",
    },

    typeChipSelected: {
      backgroundColor:
        COLORS.white,

      borderColor:
        COLORS.coral,

      elevation: 2,
    },

    typeIcon: {
      width: 41,

      height: 41,

      borderRadius: 15,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.7)",
    },

    typeIconSelected: {
      backgroundColor:
        COLORS.coral,
    },

    typeText: {
      flex: 1,

      marginLeft: 11,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13.5,

      color:
        COLORS.textPrimary,
    },

    typeTextSelected: {
      color:
        COLORS.coralDark,
    },

    sectionHeader: {
      marginTop: 25,

      flexDirection: "row",

      alignItems: "center",
    },

    sectionNumber: {
      width: 40,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11,

      letterSpacing: 1,

      color:
        COLORS.coral,
    },

    sectionTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 17,

      color:
        COLORS.textPrimary,
    },

    sectionHint: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11,

      color:
        COLORS.textSecondary,
    },

    inputCard: {
      minHeight: 145,

      marginTop: 13,

      paddingHorizontal: 16,

      paddingTop: 15,

      paddingBottom: 10,

      borderRadius: 23,

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      elevation: 2,
    },

    memoryInput: {
      minHeight: 105,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14.5,

      lineHeight: 21,

      color:
        COLORS.textPrimary,
    },

    characterCount: {
      alignSelf: "flex-end",

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10,

      color:
        COLORS.textSecondary,
    },

    feelingsContainer: {
      marginTop: 14,

      flexDirection: "row",

      flexWrap: "wrap",

      gap: 9,
    },

    feelingChip: {
      paddingHorizontal: 15,

      paddingVertical: 10,

      borderRadius: 20,

      backgroundColor:
        COLORS.softBlue,

      borderWidth: 1.5,

      borderColor:
        "transparent",
    },

    feelingChipSelected: {
      backgroundColor:
        COLORS.coral,

      borderColor:
        COLORS.coral,
    },

    feelingText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 12,

      color:
        COLORS.blue,
    },

    feelingTextSelected: {
      color:
        COLORS.white,
    },

    bottomContainer: {
      paddingHorizontal: 24,

      paddingTop: 10,

      paddingBottom: 17,

      backgroundColor:
        COLORS.background,
    },

    continueButton: {
      height: 58,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
    },

    disabledButton: {
      backgroundColor:
        "#E7E0D8",
    },

    continueText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },

    disabledText: {
      color:
        COLORS.disabled,
    },
  });