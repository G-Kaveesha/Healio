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
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import Svg, {
  Rect,
  Circle,
  Ellipse,
  Path,
  Line,
} from "react-native-svg";

const COLORS = {
  background: "#FAF7F2",
  card: "#FFFFFF",

  peach: "#FFD9B8",
  peachDark: "#E79B5A",

  sky: "#CFEAF6",
  skyDark: "#5B8FA5",

  mint: "#D8F0DF",
  mintDark: "#5F9671",

  lilac: "#E7DFFC",
  lilacDark: "#8A78C6",

  rose: "#F7D6E4",
  roseDark: "#D98BA6",

  textPrimary: "#31424B",
  textSecondary: "#76838A",

  border: "#ECE4DB",
  white: "#FFFFFF",
  disabled: "#C7C1BA",
};

const DRAWINGS = [
  {
    id: "garden",
    title: "Little Garden",
    subtitle:
      "Flower, leaves and a sunny sky",
    tag: "easy",
  },
  {
    id: "butterfly",
    title: "Butterfly",
    subtitle:
      "Simple wings with large sections",
    tag: "gentle",
  },
  {
    id: "hills",
    title: "Peaceful Hills",
    subtitle:
      "Soft landscape with wide shapes",
    tag: "calm",
  },
];

export default function ColorUnwindChooseScreen({
  navigation,
}) {
  const [
    selectedId,
    setSelectedId,
  ] = useState("garden");

  const selectedDrawing =
    DRAWINGS.find(
      (item) =>
        item.id === selectedId
    ) || DRAWINGS[0];

  const handleContinue =
    () => {
      navigation.navigate(
        "ColorUnwindCanvas",
        {
          drawingId:
            selectedDrawing.id,
        }
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

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
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
            style={styles.headerCenter}
          >
            <Text
              style={styles.headerTitle}
            >
              Color & Unwind
            </Text>
            <Text
              style={
                styles.headerSubtitle
              }
            >
              Choose something to color
            </Text>
          </View>

          <View
            style={styles.headerSpacer}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {DRAWINGS.map(
            (drawing) => {
              const selected =
                selectedId ===
                drawing.id;

              return (
                <TouchableOpacity
                  key={drawing.id}
                  style={[
                    styles.optionCard,
                    selected &&
                      styles.selectedCard,
                  ]}
                  activeOpacity={0.86}
                  onPress={() =>
                    setSelectedId(
                      drawing.id
                    )
                  }
                >
                  <View
                    style={
                      styles.previewArea
                    }
                  >
                    <MiniPreview
                      id={
                        drawing.id
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.optionContent
                    }
                  >
                    <View
                      style={
                        styles.optionTopRow
                      }
                    >
                      <Text
                        style={[
                          styles.optionTitle,
                          selected &&
                            styles.selectedTitle,
                        ]}
                      >
                        {
                          drawing.title
                        }
                      </Text>

                      <View
                        style={[
                          styles.tagChip,
                          selected &&
                            styles.selectedTagChip,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tagText,
                            selected &&
                              styles.selectedTagText,
                          ]}
                        >
                          {
                            drawing.tag
                          }
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={
                        styles.optionSubtitle
                      }
                    >
                      {
                        drawing.subtitle
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      selected &&
                        styles.selectedRadio,
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
        </ScrollView>

        <View
          style={styles.bottomContainer}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text
              style={styles.continueText}
            >
              Continue
            </Text>
            <Ionicons
              name="arrow-forward"
              size={21}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MiniPreview({
  id,
}) {
  if (id === "butterfly") {
    return (
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 160 120"
      >
        <Rect
          x="0"
          y="0"
          width="160"
          height="120"
          rx="18"
          fill="#FBFBFD"
        />
        <Ellipse
          cx="48"
          cy="46"
          rx="24"
          ry="18"
          fill="#F6C3D7"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Ellipse
          cx="112"
          cy="46"
          rx="24"
          ry="18"
          fill="#D8E8F7"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Ellipse
          cx="54"
          cy="76"
          rx="20"
          ry="15"
          fill="#D7EEDB"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Ellipse
          cx="106"
          cy="76"
          rx="20"
          ry="15"
          fill="#F7E4AE"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Rect
          x="74"
          y="38"
          width="12"
          height="45"
          rx="6"
          fill="#C6B1EB"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Circle
          cx="80"
          cy="30"
          r="8"
          fill="#FFD9B8"
          stroke="#5E6B73"
          strokeWidth="2"
        />
      </Svg>
    );
  }

  if (id === "hills") {
    return (
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 160 120"
      >
        <Rect
          x="0"
          y="0"
          width="160"
          height="120"
          rx="18"
          fill="#FBFBFD"
        />
        <Circle
          cx="122"
          cy="24"
          r="12"
          fill="#F6D875"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Path
          d="M18 86 Q 58 46 96 86 Z"
          fill="#D6EEDB"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Path
          d="M68 94 Q 114 42 150 94 Z"
          fill="#D8E8F7"
          stroke="#5E6B73"
          strokeWidth="2"
        />
        <Path
          d="M50 120 Q 80 78 110 120 Z"
          fill="#FFD9B8"
          stroke="#5E6B73"
          strokeWidth="2"
        />
      </Svg>
    );
  }

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 160 120"
    >
      <Rect
        x="0"
        y="0"
        width="160"
        height="120"
        rx="18"
        fill="#FBFBFD"
      />
      <Circle
        cx="124"
        cy="24"
        r="12"
        fill="#F6D875"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Circle
        cx="80"
        cy="58"
        r="11"
        fill="#F6B56B"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Circle
        cx="80"
        cy="39"
        r="11"
        fill="#F6C3D7"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Circle
        cx="62"
        cy="58"
        r="11"
        fill="#D8E8F7"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Circle
        cx="98"
        cy="58"
        r="11"
        fill="#C9B5EA"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Circle
        cx="80"
        cy="77"
        r="11"
        fill="#D7EEDB"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Rect
        x="77"
        y="86"
        width="6"
        height="18"
        rx="3"
        fill="#76B889"
        stroke="#5E6B73"
        strokeWidth="2"
      />
      <Rect
        x="0"
        y="100"
        width="160"
        height="20"
        fill="#D7EEDB"
      />
    </Svg>
  );
}

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
      minHeight: 72,
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
        "rgba(255,255,255,0.84)",
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
      fontSize: 11,
      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    scrollContent: {
      paddingHorizontal: 22,
      paddingTop: 10,
      paddingBottom: 30,
    },

    optionCard: {
      minHeight: 132,
      marginBottom: 16,
      borderRadius: 24,
      backgroundColor:
        COLORS.card,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
    },

    selectedCard: {
      borderColor:
        COLORS.peachDark,
      shadowColor:
        COLORS.peachDark,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },

    previewArea: {
      width: 110,
      height: 100,
      borderRadius: 22,
      overflow: "hidden",
      backgroundColor:
        "#F8F7F5",
    },

    optionContent: {
      flex: 1,
      paddingLeft: 14,
      paddingRight: 12,
    },

    optionTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    optionTitle: {
      flex: 1,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 18,
      color:
        COLORS.textPrimary,
      paddingRight: 8,
    },

    selectedTitle: {
      color:
        COLORS.peachDark,
    },

    tagChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 13,
      backgroundColor:
        COLORS.lilac,
    },

    selectedTagChip: {
      backgroundColor:
        COLORS.peach,
    },

    tagText: {
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 10,
      textTransform:
        "uppercase",
      color:
        COLORS.lilacDark,
    },

    selectedTagText: {
      color:
        COLORS.peachDark,
    },

    optionSubtitle: {
      marginTop: 8,
      fontFamily:
        "JosefinSans_400Regular",
      fontSize: 12.8,
      lineHeight: 18,
      color:
        COLORS.textSecondary,
    },

    radio: {
      width: 23,
      height: 23,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor:
        "#C8C0B8",
      alignItems: "center",
      justifyContent: "center",
    },

    selectedRadio: {
      borderColor:
        COLORS.peachDark,
    },

    radioInner: {
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor:
        COLORS.peachDark,
    },

    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 17,
    },

    continueButton: {
      height: 58,
      borderRadius: 20,
      backgroundColor:
        COLORS.peachDark,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
    },

    continueText: {
      marginRight: 8,
      fontFamily:
        "JosefinSans_700Bold",
      fontSize: 16,
      color:
        COLORS.white,
    },
  });