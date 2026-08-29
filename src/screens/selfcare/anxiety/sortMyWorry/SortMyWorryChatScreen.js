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
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
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
  background: "#F5F9F7",
  card: "#FFFFFF",

  primary: "#6797AE",
  primaryDark: "#477487",

  softBlue: "#E7F2F7",
  softBlueStrong: "#D8EAF2",

  green: "#79A98D",
  greenDark: "#557E67",
  softGreen: "#E4F1E8",

  cream: "#F8F0E4",
  creamDark: "#A9865F",

  textPrimary: "#303A3A",
  textSecondary: "#727D7B",

  border: "#DEE8E4",

  white: "#FFFFFF",
  disabled: "#B9C4C1",
};


/*
 * =========================================================
 * QUICK ACTION SUGGESTIONS
 * =========================================================
 */

const ACTION_OPTIONS = [
  {
    id: "small-start",

    text:
      "Start one small part",

    icon:
      "play-outline",
  },

  {
    id: "make-plan",

    text:
      "Make a short plan",

    icon:
      "list-outline",
  },

  {
    id: "ask-help",

    text:
      "Ask someone for help",

    icon:
      "people-outline",
  },

  {
    id: "own",

    text:
      "Write my own",

    icon:
      "create-outline",
  },
];


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function SortMyWorryChatScreen({
  navigation,
  route,
}) {
  const [
    stage,
    setStage,
  ] = useState("worry");

  const [
    worryText,
    setWorryText,
  ] = useState("");

  const [
    selectedPath,
    setSelectedPath,
  ] = useState(null);

  const [
    selectedAction,
    setSelectedAction,
  ] = useState(null);

  const [
    customAction,
    setCustomAction,
  ] = useState("");

  const pocketScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const worryY =
    useRef(
      new Animated.Value(0)
    ).current;

  const worryOpacity =
    useRef(
      new Animated.Value(1)
    ).current;


  /*
   * =========================================================
   * RESET ANIMATION
   * =========================================================
   */

  useEffect(() => {
    return () => {
      worryY.stopAnimation();
      worryOpacity.stopAnimation();
      pocketScale.stopAnimation();
    };
  }, [
    worryY,
    worryOpacity,
    pocketScale,
  ]);


  /*
   * =========================================================
   * STAGE 1
   * =========================================================
   */

  const handleWorryContinue =
    () => {
      if (
        !worryText.trim()
      ) {
        return;
      }

      setStage(
        "decision"
      );
    };


  /*
   * =========================================================
   * DECISION
   * =========================================================
   */

  const handleCanActNow =
    () => {
      setSelectedPath(
        "action"
      );

      setStage(
        "action"
      );
    };


  const handleCannotActNow =
    () => {
      setSelectedPath(
        "later"
      );

      setStage(
        "later"
      );
    };


  /*
   * =========================================================
   * ACTIONABLE WORRY
   * =========================================================
   */

  const selectAction = (
    item
  ) => {
    setSelectedAction(
      item
    );

    if (
      item.id !== "own"
    ) {
      setCustomAction("");
    }
  };


  const handleActionContinue =
    () => {
      if (
        !selectedAction
      ) {
        return;
      }

      if (
        selectedAction.id ===
          "own" &&
        !customAction.trim()
      ) {
        return;
      }

      setStage(
        "complete"
      );
    };


  /*
   * =========================================================
   * LATER POCKET ANIMATION
   * =========================================================
   */

  const handlePlaceAside =
    () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(
            worryY,
            {
              toValue: 80,

              duration: 600,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            worryOpacity,
            {
              toValue: 0,

              duration: 600,

              useNativeDriver:
                true,
            }
          ),
        ]),

        Animated.sequence([
          Animated.timing(
            pocketScale,
            {
              toValue: 1.08,

              duration: 180,

              useNativeDriver:
                true,
            }
          ),

          Animated.spring(
            pocketScale,
            {
              toValue: 1,

              useNativeDriver:
                true,
            }
          ),
        ]),
      ]).start(() => {
        setStage(
          "complete"
        );
      });
    };


  /*
   * =========================================================
   * BACK HANDLING
   * =========================================================
   */

  const handleInternalBack =
    () => {
      if (
        stage === "worry"
      ) {
        navigation.goBack();
        return;
      }

      if (
        stage === "decision"
      ) {
        setStage(
          "worry"
        );
        return;
      }

      if (
        stage === "action" ||
        stage === "later"
      ) {
        setStage(
          "decision"
        );

        return;
      }

      if (
        stage === "complete"
      ) {
        return;
      }
    };


  /*
   * =========================================================
   * COMPLETE
   * =========================================================
   */

  const getFinalAction =
    () => {
      if (
        selectedPath !==
        "action"
      ) {
        return null;
      }

      if (
        selectedAction?.id ===
        "own"
      ) {
        return (
          customAction.trim()
        );
      }

      return (
        selectedAction?.text ||
        ""
      );
    };


  const handleContinue =
    () => {
      navigation.navigate(
        "SortMyWorryComplete",
        {
          ...(route?.params || {}),

          worryText:
            worryText.trim(),

          worryPath:
            selectedPath,

          chosenAction:
            getFinalAction(),
        }
      );
    };


  /*
   * =========================================================
   * PROGRESS
   * =========================================================
   */

  const getProgress =
    () => {
      switch (stage) {
        case "worry":
          return 25;

        case "decision":
          return 50;

        case "action":
        case "later":
          return 75;

        case "complete":
          return 100;

        default:
          return 25;
      }
    };


  /*
   * =========================================================
   * UI
   * =========================================================
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
        style={
          styles.keyboardView
        }
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View
          style={styles.container}
        >
          {/* Decorative shapes */}

          <View
            style={styles.blueShape}
          />

          <View
            style={styles.greenShape}
          />


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
              onPress={
                handleInternalBack
              }
              disabled={
                stage === "complete"
              }
            >
              <Ionicons
                name="chevron-back"
                size={26}
                color={
                  stage ===
                  "complete"
                    ? COLORS.disabled
                    : COLORS.textPrimary
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
                Sort My Worry
              </Text>

              <Text
                style={
                  styles.headerSubtitle
                }
              >
                One worry at a time
              </Text>
            </View>

            <View
              style={
                styles.headerSpacer
              }
            />
          </View>


          {/* Progress */}

          <View
            style={
              styles.progressContainer
            }
          >
            <View
              style={
                styles.progressTrack
              }
            >
              <View
                style={[
                  styles.progressFill,

                  {
                    width:
                      `${getProgress()}%`,
                  },
                ]}
              />
            </View>
          </View>


          {/* =================================================
              CONTENT
             ================================================= */}

          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={
              styles.content
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >
            {/* =================================================
                STAGE 1 - WORRY
               ================================================= */}

            {stage === "worry" && (
              <>
                <View
                  style={
                    styles.mainIcon
                  }
                >
                  <Ionicons
                    name="cloud-outline"
                    size={33}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <Text
                  style={styles.title}
                >
                  What's on your mind?
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Write one worry.
                </Text>

                <View
                  style={
                    styles.inputCard
                  }
                >
                  <TextInput
                    style={
                      styles.worryInput
                    }
                    value={
                      worryText
                    }
                    onChangeText={
                      setWorryText
                    }
                    placeholder="Something I'm worried about..."
                    placeholderTextColor="#9BA6A3"
                    multiline
                    maxLength={400}
                    textAlignVertical="top"
                  />

                  <Text
                    style={
                      styles.characterCount
                    }
                  >
                    {
                      worryText.length
                    }
                    /400
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,

                    !worryText.trim() &&
                      styles.disabledButton,
                  ]}
                  onPress={
                    handleWorryContinue
                  }
                  disabled={
                    !worryText.trim()
                  }
                >
                  <Text
                    style={[
                      styles.primaryButtonText,

                      !worryText.trim() &&
                        styles.disabledButtonText,
                    ]}
                  >
                    Continue
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={
                      worryText.trim()
                        ? COLORS.white
                        : COLORS.disabled
                    }
                  />
                </TouchableOpacity>
              </>
            )}


            {/* =================================================
                STAGE 2 - DECISION
               ================================================= */}

            {stage ===
              "decision" && (
              <>
                <View
                  style={
                    styles.worryPreview
                  }
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.worryPreviewText
                    }
                    numberOfLines={3}
                  >
                    {worryText}
                  </Text>
                </View>


                <View
                  style={
                    styles.mainIcon
                  }
                >
                  <Ionicons
                    name="git-branch-outline"
                    size={32}
                    color={
                      COLORS.greenDark
                    }
                  />
                </View>

                <Text
                  style={styles.title}
                >
                  Can you do something
                  about this now?
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Either answer is okay.
                </Text>


                <TouchableOpacity
                  style={
                    styles.yesCard
                  }
                  onPress={
                    handleCanActNow
                  }
                  activeOpacity={0.82}
                >
                  <View
                    style={
                      styles.optionIconGreen
                    }
                  >
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={
                        COLORS.greenDark
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.optionTextArea
                    }
                  >
                    <Text
                      style={
                        styles.optionTitle
                      }
                    >
                      Yes
                    </Text>

                    <Text
                      style={
                        styles.optionDescription
                      }
                    >
                      I can take a small
                      step.
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={21}
                    color={
                      COLORS.greenDark
                    }
                  />
                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.laterCard
                  }
                  onPress={
                    handleCannotActNow
                  }
                  activeOpacity={0.82}
                >
                  <View
                    style={
                      styles.optionIconCream
                    }
                  >
                    <Ionicons
                      name="time-outline"
                      size={23}
                      color={
                        COLORS.creamDark
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.optionTextArea
                    }
                  >
                    <Text
                      style={
                        styles.optionTitle
                      }
                    >
                      Not right now
                    </Text>

                    <Text
                      style={
                        styles.optionDescription
                      }
                    >
                      This can wait.
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={21}
                    color={
                      COLORS.creamDark
                    }
                  />
                </TouchableOpacity>
              </>
            )}


            {/* =================================================
                STAGE 3A - ACTION
               ================================================= */}

            {stage === "action" && (
              <>
                <View
                  style={
                    styles.mainIconGreen
                  }
                >
                  <Ionicons
                    name="footsteps-outline"
                    size={31}
                    color={
                      COLORS.greenDark
                    }
                  />
                </View>

                <Text
                  style={styles.title}
                >
                  Choose one small step
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Keep it manageable.
                </Text>


                <View
                  style={
                    styles.actionsContainer
                  }
                >
                  {ACTION_OPTIONS.map(
                    (item) => {
                      const selected =
                        selectedAction
                          ?.id ===
                        item.id;

                      return (
                        <TouchableOpacity
                          key={
                            item.id
                          }
                          style={[
                            styles.actionCard,

                            selected &&
                              styles.actionCardSelected,
                          ]}
                          onPress={() =>
                            selectAction(
                              item
                            )
                          }
                          activeOpacity={
                            0.82
                          }
                        >
                          <View
                            style={[
                              styles.actionIcon,

                              selected &&
                                styles.actionIconSelected,
                            ]}
                          >
                            <Ionicons
                              name={
                                item.icon
                              }
                              size={20}
                              color={
                                selected
                                  ? COLORS.white
                                  : COLORS.greenDark
                              }
                            />
                          </View>

                          <Text
                            style={[
                              styles.actionText,

                              selected &&
                                styles.actionTextSelected,
                            ]}
                          >
                            {
                              item.text
                            }
                          </Text>

                          <View
                            style={[
                              styles.radio,

                              selected &&
                                styles.radioSelected,
                            ]}
                          >
                            {selected && (
                              <View
                                style={
                                  styles.radioInner
                                }
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>


                {selectedAction?.id ===
                  "own" && (
                  <View
                    style={
                      styles.customInputCard
                    }
                  >
                    <TextInput
                      style={
                        styles.customInput
                      }
                      value={
                        customAction
                      }
                      onChangeText={
                        setCustomAction
                      }
                      placeholder="My small next step..."
                      placeholderTextColor="#9BA6A3"
                      maxLength={180}
                    />
                  </View>
                )}


                <TouchableOpacity
                  style={[
                    styles.primaryButton,

                    (!selectedAction ||
                      (selectedAction?.id ===
                        "own" &&
                        !customAction.trim())) &&
                      styles.disabledButton,
                  ]}
                  disabled={
                    !selectedAction ||
                    (selectedAction?.id ===
                      "own" &&
                      !customAction.trim())
                  }
                  onPress={
                    handleActionContinue
                  }
                >
                  <Text
                    style={[
                      styles.primaryButtonText,

                      (!selectedAction ||
                        (selectedAction?.id ===
                          "own" &&
                          !customAction.trim())) &&
                        styles.disabledButtonText,
                    ]}
                  >
                    Keep This Step
                  </Text>

                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={
                      selectedAction &&
                      !(
                        selectedAction.id ===
                          "own" &&
                        !customAction.trim()
                      )
                        ? COLORS.white
                        : COLORS.disabled
                    }
                  />
                </TouchableOpacity>
              </>
            )}


            {/* =================================================
                STAGE 3B - LATER POCKET
               ================================================= */}

            {stage === "later" && (
              <>
                <Text
                  style={styles.title}
                >
                  Let it wait for now
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  You can return to it
                  later.
                </Text>


                <View
                  style={
                    styles.pocketArea
                  }
                >
                  {/* Worry bubble */}

                  <Animated.View
                    style={[
                      styles.worryBubble,

                      {
                        opacity:
                          worryOpacity,

                        transform: [
                          {
                            translateY:
                              worryY,
                          },
                        ],
                      },
                    ]}
                  >
                    <Ionicons
                      name="cloud-outline"
                      size={18}
                      color={
                        COLORS.primary
                      }
                    />

                    <Text
                      style={
                        styles.worryBubbleText
                      }
                      numberOfLines={3}
                    >
                      {worryText}
                    </Text>
                  </Animated.View>


                  {/* Pocket */}

                  <Animated.View
                    style={[
                      styles.pocket,

                      {
                        transform: [
                          {
                            scale:
                              pocketScale,
                          },
                        ],
                      },
                    ]}
                  >
                    <Ionicons
                      name="archive-outline"
                      size={42}
                      color={
                        COLORS.creamDark
                      }
                    />

                    <Text
                      style={
                        styles.pocketTitle
                      }
                    >
                      Later Pocket
                    </Text>
                  </Animated.View>
                </View>


                <TouchableOpacity
                  style={
                    styles.placeAsideButton
                  }
                  onPress={
                    handlePlaceAside
                  }
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="archive-outline"
                    size={19}
                    color={
                      COLORS.white
                    }
                  />

                  <Text
                    style={
                      styles.placeAsideText
                    }
                  >
                    Set Aside for Now
                  </Text>
                </TouchableOpacity>
              </>
            )}


            {/* =================================================
                STAGE 4 - COMPLETE
               ================================================= */}

            {stage ===
              "complete" && (
              <>
                <View
                  style={
                    styles.completeIcon
                  }
                >
                  <Ionicons
                    name={
                      selectedPath ===
                      "action"
                        ? "checkmark"
                        : "leaf-outline"
                    }
                    size={39}
                    color={
                      selectedPath ===
                      "action"
                        ? COLORS.greenDark
                        : COLORS.primaryDark
                    }
                  />
                </View>

                <Text
                  style={styles.title}
                >
                  That's enough for now
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  One worry has a place.
                </Text>


                {selectedPath ===
                  "action" && (
                  <View
                    style={
                      styles.finalActionCard
                    }
                  >
                    <Text
                      style={
                        styles.finalLabel
                      }
                    >
                      MY SMALL STEP
                    </Text>

                    <Text
                      style={
                        styles.finalActionText
                      }
                    >
                      {
                        getFinalAction()
                      }
                    </Text>
                  </View>
                )}


                {selectedPath ===
                  "later" && (
                  <View
                    style={
                      styles.finalLaterCard
                    }
                  >
                    <Ionicons
                      name="archive-outline"
                      size={21}
                      color={
                        COLORS.creamDark
                      }
                    />

                    <Text
                      style={
                        styles.finalLaterText
                      }
                    >
                      This worry can wait
                      until you choose to
                      return to it.
                    </Text>
                  </View>
                )}


                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }
                  onPress={
                    handleContinue
                  }
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    Continue
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={
                      COLORS.white
                    }
                  />
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
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

    keyboardView: {
      flex: 1,
    },

    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      overflow: "hidden",
    },

    blueShape: {
      position: "absolute",

      width: 270,
      height: 270,

      borderRadius: 135,

      top: -165,
      right: -110,

      backgroundColor:
        COLORS.softBlueStrong,

      opacity: 0.65,
    },

    greenShape: {
      position: "absolute",

      width: 280,
      height: 280,

      borderRadius: 140,

      bottom: -100,
      left: -185,

      backgroundColor:
        COLORS.softGreen,

      opacity: 0.6,
    },


    /*
     * Header
     */

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

      justifyContent: "center",

      backgroundColor:
        "rgba(255,255,255,0.72)",
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


    /*
     * Progress
     */

    progressContainer: {
      paddingHorizontal: 24,

      paddingTop: 3,
    },

    progressTrack: {
      height: 6,

      borderRadius: 20,

      backgroundColor:
        "#DFE8E5",

      overflow: "hidden",
    },

    progressFill: {
      height: "100%",

      borderRadius: 20,

      backgroundColor:
        COLORS.primary,
    },


    /*
     * Content
     */

    content: {
      flexGrow: 1,

      paddingHorizontal: 24,

      paddingTop: 37,

      paddingBottom: 30,

      alignItems: "center",
    },

    mainIcon: {
      width: 74,
      height: 74,

      borderRadius: 37,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.softBlue,
    },

    mainIconGreen: {
      width: 74,
      height: 74,

      borderRadius: 37,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.softGreen,
    },

    title: {
      marginTop: 22,

      maxWidth: 330,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 27,

      lineHeight: 34,

      textAlign: "center",

      color:
        COLORS.textPrimary,
    },

    subtitle: {
      marginTop: 7,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      textAlign: "center",

      color:
        COLORS.textSecondary,
    },


    /*
     * Worry input
     */

    inputCard: {
      width: "100%",

      minHeight: 170,

      marginTop: 30,

      paddingHorizontal: 17,

      paddingTop: 15,

      paddingBottom: 10,

      borderRadius: 23,

      backgroundColor:
        COLORS.card,

      borderWidth: 1.2,

      borderColor:
        COLORS.border,

      elevation: 2,
    },

    worryInput: {
      minHeight: 125,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 15,

      lineHeight: 22,

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


    /*
     * Primary button
     */

    primaryButton: {
      width: "100%",

      height: 57,

      marginTop: 27,

      borderRadius: 19,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.primary,
    },

    disabledButton: {
      backgroundColor:
        "#E0E7E5",
    },

    primaryButtonText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15.5,

      color:
        COLORS.white,
    },

    disabledButtonText: {
      color:
        COLORS.disabled,
    },


    /*
     * Worry preview
     */

    worryPreview: {
      width: "100%",

      paddingHorizontal: 15,

      paddingVertical: 12,

      marginBottom: 25,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softBlue,
    },

    worryPreviewText: {
      flex: 1,

      marginLeft: 9,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      lineHeight: 18,

      color:
        COLORS.textSecondary,
    },


    /*
     * Decision cards
     */

    yesCard: {
      width: "100%",

      minHeight: 92,

      marginTop: 31,

      paddingHorizontal: 15,

      borderRadius: 22,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softGreen,
    },

    laterCard: {
      width: "100%",

      minHeight: 92,

      marginTop: 14,

      paddingHorizontal: 15,

      borderRadius: 22,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.cream,
    },

    optionIconGreen: {
      width: 49,
      height: 49,

      borderRadius: 25,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.white,
    },

    optionIconCream: {
      width: 49,
      height: 49,

      borderRadius: 25,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.white,
    },

    optionTextArea: {
      flex: 1,

      marginLeft: 13,
    },

    optionTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.textPrimary,
    },

    optionDescription: {
      marginTop: 4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Action choices
     */

    actionsContainer: {
      width: "100%",

      marginTop: 28,
    },

    actionCard: {
      minHeight: 67,

      marginBottom: 11,

      paddingHorizontal: 12,

      borderRadius: 19,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softGreen,

      borderWidth: 1.5,

      borderColor:
        "transparent",
    },

    actionCardSelected: {
      backgroundColor:
        COLORS.card,

      borderColor:
        COLORS.green,
    },

    actionIcon: {
      width: 39,
      height: 39,

      borderRadius: 20,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.white,
    },

    actionIconSelected: {
      backgroundColor:
        COLORS.green,
    },

    actionText: {
      flex: 1,

      marginLeft: 10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13.5,

      color:
        COLORS.textPrimary,
    },

    actionTextSelected: {
      fontFamily:
        "JosefinSans_700Bold",

      color:
        COLORS.greenDark,
    },

    radio: {
      width: 21,
      height: 21,

      borderRadius: 11,

      borderWidth: 1.5,

      borderColor:
        "#AEBAB4",

      alignItems: "center",

      justifyContent: "center",
    },

    radioSelected: {
      borderColor:
        COLORS.green,
    },

    radioInner: {
      width: 10,
      height: 10,

      borderRadius: 5,

      backgroundColor:
        COLORS.green,
    },

    customInputCard: {
      width: "100%",

      height: 57,

      marginTop: 4,

      paddingHorizontal: 16,

      justifyContent: "center",

      borderRadius: 19,

      backgroundColor:
        COLORS.card,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },

    customInput: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 14,

      color:
        COLORS.textPrimary,
    },


    /*
     * Pocket
     */

    pocketArea: {
      width: "100%",

      minHeight: 300,

      marginTop: 20,

      alignItems: "center",

      justifyContent:
        "flex-end",
    },

    worryBubble: {
      width: "85%",

      minHeight: 80,

      paddingHorizontal: 15,

      paddingVertical: 13,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softBlue,

      borderWidth: 1,

      borderColor:
        COLORS.softBlueStrong,
    },

    worryBubbleText: {
      flex: 1,

      marginLeft: 9,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      lineHeight: 18,

      color:
        COLORS.textSecondary,
    },

    pocket: {
      width: 175,
      height: 115,

      marginTop: 32,

      borderRadius: 28,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.cream,

      borderWidth: 1.5,

      borderColor:
        "#E4D5C1",
    },

    pocketTitle: {
      marginTop: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13.5,

      color:
        COLORS.creamDark,
    },

    placeAsideButton: {
      width: "100%",

      height: 57,

      marginTop: 27,

      borderRadius: 19,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.primary,
    },

    placeAsideText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color:
        COLORS.white,
    },


    /*
     * Complete
     */

    completeIcon: {
      width: 94,
      height: 94,

      borderRadius: 47,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        COLORS.softGreen,
    },

    finalActionCard: {
      width: "100%",

      marginTop: 28,

      paddingHorizontal: 17,

      paddingVertical: 17,

      borderRadius: 21,

      backgroundColor:
        COLORS.softGreen,
    },

    finalLabel: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10.5,

      letterSpacing: 1,

      color:
        COLORS.greenDark,
    },

    finalActionText: {
      marginTop: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      lineHeight: 21,

      color:
        COLORS.textPrimary,
    },

    finalLaterCard: {
      width: "100%",

      marginTop: 28,

      paddingHorizontal: 16,

      paddingVertical: 15,

      borderRadius: 21,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.cream,
    },

    finalLaterText: {
      flex: 1,

      marginLeft: 10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13,

      lineHeight: 19,

      color:
        COLORS.textSecondary,
    },
  });