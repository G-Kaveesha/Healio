import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
  FlatList,
  Image,
  Modal,
  Dimensions,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  miniGames,
} from "./miniGames";

import {
  useSelfCare,
} from "../../../context/SelfCareContext";


/*
 * =========================================================
 * DIMENSIONS
 * =========================================================
 */

const {
  width,
} = Dimensions.get(
  "window"
);

const CARD_HORIZONTAL_MARGIN =
  24;

const CARD_WIDTH =
  width -
  CARD_HORIZONTAL_MARGIN *
    2;

const CARD_HEIGHT =
  122;

const IMAGE_WIDTH =
  102;


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F7F9FC",

  card:
    "#FFFFFF",

  lavender:
    "#DDD7F5",

  softLavender:
    "#F0EDFA",

  blue:
    "#CFE8F3",

  softBlue:
    "#EAF5FA",

  mint:
    "#DCEEE5",

  softMint:
    "#EDF7F1",

  peach:
    "#F7DCCB",

  softPeach:
    "#FCF0E8",

  yellow:
    "#F7E8AF",

  primary:
    "#7770A8",

  textPrimary:
    "#34383D",

  textSecondary:
    "#757B82",

  border:
    "#D9DDEA",

  favorite:
    "#E56F7A",

  white:
    "#FFFFFF",
};


/*
 * =========================================================
 * GAME DISPLAY DETAILS
 * =========================================================
 */

const GAME_META = {
  "bubble-pop-calm": {
    icon:
      "water-outline",

    label:
      "Gentle tapping",

    chipColor:
      COLORS.softBlue,

    iconColor:
      "#669FB8",
  },

  "color-unwind": {
    icon:
      "color-palette-outline",

    label:
      "Creative play",

    chipColor:
      COLORS.softPeach,

    iconColor:
      "#BF8162",
  },

  "zen-garden": {
    icon:
      "leaf-outline",

    label:
      "Free play",

    chipColor:
      COLORS.softMint,

    iconColor:
      "#698F78",
  },
};


/*
 * =========================================================
 * MINI GAMES SCREEN
 * =========================================================
 */

export default function MiniGamesScreen({
  navigation,
}) {
  /*
   * =======================================================
   * INFORMATION MODAL
   * =======================================================
   */

  const [
    selectedInfoActivity,
    setSelectedInfoActivity,
  ] = useState(null);


  /*
   * =======================================================
   * SELF-CARE CONTEXT
   * =======================================================
   */

  const {
    isFavorite,
    toggleFavorite,
    addRecentActivity,
  } = useSelfCare();


  /*
   * =======================================================
   * OPEN GAME
   * =======================================================
   */

  const openGame =
    (
      game
    ) => {
      /*
       * Add the selected game to
       * Recent Activities.
       */

      addRecentActivity(
        game,
        "miniGames"
      );


      /*
       * Every mini game has its
       * own custom flow.
       */

      if (
        game.activityScreen
      ) {
        navigation.navigate(
          game.activityScreen,
          {
            activityId:
              game.id,

            category:
              "miniGames",
          }
        );

        return;
      }


      /*
       * Generic fallback.
       */

      navigation.navigate(
        "SelfCareActivityDetails",
        {
          activityId:
            game.id,

          category:
            "miniGames",
        }
      );
    };


  /*
   * =======================================================
   * FAVORITE
   * =======================================================
   */

  const handleFavoritePress =
    (
      event,
      game
    ) => {
      /*
       * Prevent opening the game
       * when the heart is pressed.
       */

      event
        ?.stopPropagation
        ?.();


      toggleFavorite(
        game,
        "miniGames"
      );
    };


  /*
   * =======================================================
   * INFO
   * =======================================================
   */

  const handleInfoPress =
    (
      event,
      game
    ) => {
      event
        ?.stopPropagation
        ?.();


      setSelectedInfoActivity(
        game
      );
    };


  const closeInfoModal =
    () => {
      setSelectedInfoActivity(
        null
      );
    };


  /*
   * =======================================================
   * RENDER GAME CARD
   * =======================================================
   */

  const renderGame =
    ({
      item,
    }) => {
      const favorite =
        isFavorite(
          item.id,
          "miniGames"
        );


      const meta =
        GAME_META[
          item.id
        ] || {
          icon:
            "game-controller-outline",

          label:
            "Mini game",

          chipColor:
            COLORS.softLavender,

          iconColor:
            COLORS.primary,
        };


      return (
        <TouchableOpacity
          style={
            styles.gameCard
          }
          activeOpacity={
            0.87
          }
          onPress={() =>
            openGame(
              item
            )
          }
          accessibilityRole="button"
          accessibilityLabel={
            `Open ${item.title}`
          }
          accessibilityHint="Opens the selected calming mini game"
        >
          {/* =================================================
              GAME IMAGE
             ================================================= */}

          <View
            style={
              styles.imageContainer
            }
          >
            <Image
              source={
                item.image
              }
              style={
                styles.gameImage
              }
              resizeMode="cover"
            />

            <View
              style={
                styles.imageOverlay
              }
            />
          </View>


          {/* =================================================
              GAME CONTENT
             ================================================= */}

          <View
            style={
              styles.gameContent
            }
          >
            <Text
              style={
                styles.gameTitle
              }
              numberOfLines={
                2
              }
            >
              {item.title}
            </Text>


            {/* Game type chip */}

            <View
              style={[
                styles.typeChip,

                {
                  backgroundColor:
                    meta.chipColor,
                },
              ]}
            >
              <Ionicons
                name={
                  meta.icon
                }
                size={13}
                color={
                  meta.iconColor
                }
              />

              <Text
                style={[
                  styles.typeText,

                  {
                    color:
                      meta.iconColor,
                  },
                ]}
              >
                {meta.label}
              </Text>
            </View>


            {/* Duration */}

            <View
              style={
                styles.durationRow
              }
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={
                  COLORS.textSecondary
                }
              />

              <Text
                style={
                  styles.durationText
                }
              >
                {item.duration}
              </Text>
            </View>
          </View>


          {/* =================================================
              INFO BUTTON
             ================================================= */}

          <Pressable
            style={({
              pressed,
            }) => [
              styles.infoButton,

              pressed &&
                styles.controlPressed,
            ]}
            onPress={(
              event
            ) =>
              handleInfoPress(
                event,
                item
              )
            }
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              `Information about ${item.title}`
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={23}
              color={
                COLORS.textPrimary
              }
            />
          </Pressable>


          {/* =================================================
              FAVORITE BUTTON
             ================================================= */}

          <Pressable
            style={({
              pressed,
            }) => [
              styles.favoriteButton,

              pressed &&
                styles.controlPressed,
            ]}
            onPress={(
              event
            ) =>
              handleFavoritePress(
                event,
                item
              )
            }
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              favorite
                ? `Remove ${item.title} from favorites`
                : `Add ${item.title} to favorites`
            }
          >
            <Ionicons
              name={
                favorite
                  ? "heart"
                  : "heart-outline"
              }
              size={24}
              color={
                favorite
                  ? COLORS.favorite
                  : COLORS.textPrimary
              }
            />
          </Pressable>


          {/* Small arrow */}

          <View
            style={
              styles.openArrow
            }
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={
                COLORS.primary
              }
            />
          </View>
        </TouchableOpacity>
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
      edges={[
        "top",
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />


      <View
        style={
          styles.container
        }
      >
        {/* Decorative background */}

        <View
          pointerEvents="none"
          style={
            styles.topLavenderShape
          }
        />

        <View
          pointerEvents="none"
          style={
            styles.bottomBlueShape
          }
        />


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
            activeOpacity={
              0.72
            }
            onPress={() =>
              navigation.goBack()
            }
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={29}
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
              Mini Games
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              A little space to play
              and unwind.
            </Text>
          </View>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* =================================================
            INTRO STRIP
           ================================================= */}

        <View
          style={
            styles.introStrip
          }
        >
          <View
            style={
              styles.introIconStack
            }
          >
            <View
              style={
                styles.introIconBack
              }
            />

            <View
              style={
                styles.introIconFront
              }
            >
              <Ionicons
                name="game-controller-outline"
                size={21}
                color={
                  COLORS.primary
                }
              />
            </View>
          </View>


          <View
            style={
              styles.introTextArea
            }
          >
            <Text
              style={
                styles.introTitle
              }
            >
              No scores. No pressure.
            </Text>

            <Text
              style={
                styles.introText
              }
            >
              Choose whatever feels
              pleasant right now.
            </Text>
          </View>
        </View>


        {/* =================================================
            LIST
           ================================================= */}

        <FlatList
          data={
            miniGames
          }
          keyExtractor={(
            item
          ) =>
            item.id
          }
          renderItem={
            renderGame
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.listContent
          }
          ItemSeparatorComponent={() => (
            <View
              style={
                styles.separator
              }
            />
          )}
        />


        {/* =================================================
            INFORMATION MODAL
           ================================================= */}

        <Modal
          visible={
            Boolean(
              selectedInfoActivity
            )
          }
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={
            closeInfoModal
          }
        >
          <Pressable
            style={
              styles.modalOverlay
            }
            onPress={
              closeInfoModal
            }
          >
            <Pressable
              style={
                styles.modalCard
              }
              onPress={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              {/* Modal header */}

              <View
                style={
                  styles.modalHeader
                }
              >
                <View
                  style={
                    styles.modalTitleRow
                  }
                >
                  <View
                    style={
                      styles.modalGameIcon
                    }
                  >
                    <Ionicons
                      name={
                        selectedInfoActivity
                          ? GAME_META[
                              selectedInfoActivity
                                .id
                            ]
                              ?.icon ||
                            "game-controller-outline"
                          : "game-controller-outline"
                      }
                      size={23}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>


                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    {
                      selectedInfoActivity
                        ?.title
                    }
                  </Text>
                </View>


                <TouchableOpacity
                  style={
                    styles.modalClose
                  }
                  onPress={
                    closeInfoModal
                  }
                  activeOpacity={
                    0.7
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Close information"
                >
                  <Ionicons
                    name="close"
                    size={23}
                    color={
                      COLORS.textPrimary
                    }
                  />
                </TouchableOpacity>
              </View>


              {/* Description */}

              <Text
                style={
                  styles.modalDescription
                }
              >
                {
                  selectedInfoActivity
                    ?.infoDescription
                }
              </Text>


              {/* Feature strip */}

              <View
                style={
                  styles.modalFeatureRow
                }
              >
                <View
                  style={[
                    styles.modalFeature,

                    {
                      backgroundColor:
                        COLORS.softBlue,
                    },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color="#669FB8"
                  />

                  <Text
                    style={
                      styles.modalFeatureText
                    }
                  >
                    {
                      selectedInfoActivity
                        ?.duration
                    }
                  </Text>
                </View>


                <View
                  style={[
                    styles.modalFeature,

                    {
                      backgroundColor:
                        COLORS.softLavender,
                    },
                  ]}
                >
                  <Ionicons
                    name="heart-outline"
                    size={15}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.modalFeatureText
                    }
                  >
                    No pressure
                  </Text>
                </View>
              </View>


              {/* Disclaimer */}

              <Text
                style={
                  styles.modalDisclaimer
                }
              >
                These mini games are
                intended for general
                relaxation and
                well-being. They are
                not a replacement for
                professional mental-health
                care.
              </Text>


              {/* Open game */}

              <TouchableOpacity
                style={
                  styles.modalPlayButton
                }
                activeOpacity={0.84}
                onPress={() => {
                  const game =
                    selectedInfoActivity;

                  closeInfoModal();

                  if (game) {
                    openGame(
                      game
                    );
                  }
                }}
              >
                <Ionicons
                  name="play"
                  size={17}
                  color={
                    COLORS.white
                  }
                />

                <Text
                  style={
                    styles.modalPlayText
                  }
                >
                  Open Game
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
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

      overflow:
        "hidden",
    },


    /*
     * =====================================================
     * DECORATIVE BACKGROUND
     * =====================================================
     */

    topLavenderShape: {
      position:
        "absolute",

      width: 260,

      height: 260,

      borderRadius: 130,

      top: -165,

      right: -105,

      backgroundColor:
        COLORS.softLavender,

      opacity: 0.9,
    },

    bottomBlueShape: {
      position:
        "absolute",

      width: 250,

      height: 250,

      borderRadius: 125,

      left: -155,

      bottom: -125,

      backgroundColor:
        COLORS.softBlue,

      opacity: 0.75,
    },


    /*
     * =====================================================
     * HEADER
     * =====================================================
     */

    header: {
      minHeight: 88,

      paddingHorizontal: 20,

      paddingVertical: 10,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    backButton: {
      width: 44,

      height: 44,

      borderRadius: 22,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.82)",
    },

    headerCenter: {
      flex: 1,

      alignItems:
        "center",

      paddingHorizontal: 8,
    },

    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 24,

      color:
        COLORS.textPrimary,
    },

    headerSubtitle: {
      marginTop: 4,

      maxWidth: 250,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

      lineHeight: 16,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 44,
    },


    /*
     * =====================================================
     * INTRO STRIP
     * =====================================================
     */

    introStrip: {
      marginHorizontal: 24,

      marginTop: 5,

      marginBottom: 21,

      paddingHorizontal: 15,

      paddingVertical: 13,

      borderRadius: 22,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        "#E5E2EF",
    },

    introIconStack: {
      width: 54,

      height: 54,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    introIconBack: {
      position:
        "absolute",

      width: 46,

      height: 46,

      borderRadius: 17,

      backgroundColor:
        COLORS.lavender,

      transform: [
        {
          rotate:
            "8deg",
        },
      ],
    },

    introIconFront: {
      width: 42,

      height: 42,

      borderRadius: 15,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        "#DDD8EF",
    },

    introTextArea: {
      flex: 1,

      marginLeft: 11,
    },

    introTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.textPrimary,
    },

    introText: {
      marginTop: 3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      lineHeight: 15,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * LIST
     * =====================================================
     */

    listContent: {
      paddingHorizontal:
        CARD_HORIZONTAL_MARGIN,

      paddingBottom: 45,
    },

    separator: {
      height: 22,
    },


    /*
     * =====================================================
     * GAME CARD
     * =====================================================
     */

    gameCard: {
      width:
        CARD_WIDTH,

      height:
        CARD_HEIGHT,

      flexDirection:
        "row",

      position:
        "relative",

      backgroundColor:
        COLORS.card,

      borderRadius: 24,

      overflow:
        "hidden",

      borderWidth: 1.1,

      borderColor:
        COLORS.border,

      elevation: 4,

      shadowColor:
        "#858CA2",

      shadowOffset: {
        width: 0,

        height: 4,
      },

      shadowOpacity: 0.12,

      shadowRadius: 7,
    },

    imageContainer: {
      width:
        IMAGE_WIDTH,

      height: "100%",

      overflow:
        "hidden",
    },

    gameImage: {
      width: "100%",

      height: "100%",
    },

    imageOverlay: {
      ...StyleSheet
        .absoluteFillObject,

      backgroundColor:
        "rgba(255,255,255,0.04)",
    },

    gameContent: {
      flex: 1,

      paddingLeft: 13,

      paddingRight: 74,

      paddingVertical: 14,
    },

    gameTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 17.5,

      lineHeight: 22,

      color:
        COLORS.textPrimary,
    },

    typeChip: {
      alignSelf:
        "flex-start",

      marginTop: 8,

      minHeight: 24,

      paddingHorizontal: 8,

      borderRadius: 12,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    typeText: {
      marginLeft: 4,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 9.5,
    },

    durationRow: {
      marginTop: 8,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    durationText: {
      marginLeft: 4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * CARD CONTROLS
     * =====================================================
     */

    infoButton: {
      position:
        "absolute",

      top: 10,

      right: 43,

      width: 36,

      height: 36,

      borderRadius: 18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.92)",
    },

    favoriteButton: {
      position:
        "absolute",

      top: 10,

      right: 8,

      width: 36,

      height: 36,

      borderRadius: 18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.92)",
    },

    controlPressed: {
      transform: [
        {
          scale: 0.92,
        },
      ],

      backgroundColor:
        COLORS.softLavender,
    },

    openArrow: {
      position:
        "absolute",

      right: 14,

      bottom: 13,

      width: 29,

      height: 29,

      borderRadius: 15,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softLavender,
    },


    /*
     * =====================================================
     * MODAL
     * =====================================================
     */

    modalOverlay: {
      flex: 1,

      paddingHorizontal: 24,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(26,30,36,0.45)",
    },

    modalCard: {
      width: "100%",

      maxWidth: 390,

      paddingHorizontal: 22,

      paddingTop: 22,

      paddingBottom: 21,

      borderRadius: 27,

      backgroundColor:
        COLORS.white,

      elevation: 12,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,

        height: 6,
      },

      shadowOpacity: 0.2,

      shadowRadius: 13,
    },

    modalHeader: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",
    },

    modalTitleRow: {
      flex: 1,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingRight: 10,
    },

    modalGameIcon: {
      width: 43,

      height: 43,

      borderRadius: 16,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softLavender,
    },

    modalTitle: {
      flex: 1,

      marginLeft: 11,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 20,

      lineHeight: 25,

      color:
        COLORS.textPrimary,
    },

    modalClose: {
      width: 35,

      height: 35,

      borderRadius: 18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#F2F3F6",
    },

    modalDescription: {
      marginTop: 19,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 15,

      lineHeight: 22,

      color:
        COLORS.textSecondary,
    },

    modalFeatureRow: {
      marginTop: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 8,
    },

    modalFeature: {
      minHeight: 32,

      paddingHorizontal: 10,

      borderRadius: 16,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    modalFeatureText: {
      marginLeft: 5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },

    modalDisclaimer: {
      marginTop: 18,

      paddingTop: 14,

      borderTopWidth: 1,

      borderTopColor:
        "#EAECF0",

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11.5,

      lineHeight: 17,

      color:
        "#92969C",
    },

    modalPlayButton: {
      height: 49,

      marginTop: 18,

      borderRadius: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,
    },

    modalPlayText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.white,
    },
  });