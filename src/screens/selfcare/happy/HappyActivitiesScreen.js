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
  happyActivities,
} from "./happyActivities";

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
  26;

const CARD_WIDTH =
  width -
  CARD_HORIZONTAL_MARGIN *
    2;

const CARD_HEIGHT =
  110;

const IMAGE_WIDTH =
  95;


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#FFF9F0",

  card:
    "#FFFFFF",

  yellow:
    "#F2CC67",

  softYellow:
    "#FFF2C5",

  peach:
    "#EFAF88",

  softPeach:
    "#FCE4D5",

  blue:
    "#84B5CC",

  softBlue:
    "#E5F3F8",

  textPrimary:
    "#37342F",

  textSecondary:
    "#756F67",

  border:
    "#EDC879",

  favorite:
    "#E56F7A",

  white:
    "#FFFFFF",
};


/*
 * =========================================================
 * HAPPY ACTIVITIES SCREEN
 * =========================================================
 */

export default function HappyActivitiesScreen({
  navigation,
}) {
  const [
    selectedInfoActivity,
    setSelectedInfoActivity,
  ] = useState(null);


  /*
   * =======================================================
   * SELF CARE CONTEXT
   * =======================================================
   *
   * IMPORTANT:
   *
   * Favorites are handled here.
   *
   * Recent Activities are NOT added
   * when the user simply opens an
   * activity anymore.
   *
   * The relevant Complete screen will
   * add the activity to Recent
   * Activities after completion.
   * =======================================================
   */

  const {
    isFavorite,
    toggleFavorite,
  } = useSelfCare();


  /*
   * =======================================================
   * OPEN ACTIVITY
   * =======================================================
   */

  const openActivity =
    (
      activity
    ) => {
      /*
       * IMPORTANT:
       *
       * Do NOT call:
       *
       * addRecentActivity(...)
       *
       * here.
       *
       * Opening an activity does not
       * mean that the activity has
       * been completed.
       *
       * It will be added to Recent
       * Activities from the relevant
       * Complete screen.
       */


      /*
       * Dedicated interactive
       * activity flow.
       */

      if (
        activity.activityScreen
      ) {
        navigation.navigate(
          activity.activityScreen,
          {
            /*
             * These two values are
             * extremely important.
             *
             * They are passed through
             * the complete activity
             * flow so that the final
             * Complete screen knows
             * which activity should be
             * added to Recents.
             */

            activityId:
              activity.id,

            category:
              "happy",
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
            activity.id,

          category:
            "happy",
        }
      );
    };


  /*
   * =======================================================
   * INFORMATION MODAL
   * =======================================================
   */

  const openInformation =
    (
      event,
      activity
    ) => {
      /*
       * Prevent pressing the info icon
       * from also opening the activity.
       */

      event
        ?.stopPropagation
        ?.();


      setSelectedInfoActivity(
        activity
      );
    };


  const closeInformation =
    () => {
      setSelectedInfoActivity(
        null
      );
    };


  /*
   * =======================================================
   * FAVORITES
   * =======================================================
   */

  const handleFavoritePress =
    (
      event,
      activity
    ) => {
      /*
       * Prevent pressing the heart
       * from also opening the activity.
       */

      event
        ?.stopPropagation
        ?.();


      /*
       * Store / remove favorite using:
       *
       * activity.id
       * category = "happy"
       */

      toggleFavorite(
        activity,
        "happy"
      );
    };


  /*
   * =======================================================
   * ACTIVITY CARD
   * =======================================================
   */

  const renderActivity =
    ({
      item,
    }) => {
      /*
       * Determine whether this activity
       * is currently saved as favorite.
       */

      const favorite =
        isFavorite(
          item.id,
          "happy"
        );


      return (
        <TouchableOpacity
          activeOpacity={
            0.88
          }
          style={
            styles.activityCard
          }
          onPress={() =>
            openActivity(
              item
            )
          }
          accessibilityRole="button"
          accessibilityLabel={
            `Open ${item.title} activity`
          }
          accessibilityHint="Opens the selected happy mood activity"
        >
          {/* =================================================
              IMAGE
             ================================================= */}

          <Image
            source={
              item.image
            }
            style={
              styles.activityImage
            }
            resizeMode="cover"
          />


          {/* =================================================
              INFORMATION
             ================================================= */}

          <View
            style={
              styles.activityContent
            }
          >
            <Text
              style={
                styles.activityTitle
              }
              numberOfLines={
                2
              }
            >
              {
                item.title
              }
            </Text>


            {/* ===============================================
                INFO BUTTON
               =============================================== */}

            <Pressable
              style={({
                pressed,
              }) => [
                styles.informationButton,

                pressed &&
                  styles.iconPressed,
              ]}
              onPress={(
                event
              ) =>
                openInformation(
                  event,
                  item
                )
              }
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                `Information about ${item.title}`
              }
              accessibilityHint="Shows a short explanation of the activity"
            >
              <Ionicons
                name="information-circle-outline"
                size={25}
                color={
                  COLORS.textPrimary
                }
              />
            </Pressable>


            {/* ===============================================
                DURATION
               =============================================== */}

            <View
              style={
                styles.durationContainer
              }
            >
              <Ionicons
                name="time-outline"
                size={13}
                color={
                  COLORS.textPrimary
                }
              />

              <Text
                style={
                  styles.durationText
                }
              >
                {
                  item.duration
                }
              </Text>
            </View>
          </View>


          {/* =================================================
              FAVORITE BUTTON
             ================================================= */}

          <Pressable
            style={({
              pressed,
            }) => [
              styles.heartButton,

              pressed &&
                styles.heartButtonPressed,
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
            accessibilityHint={
              favorite
                ? "Removes this activity from your favorites"
                : "Adds this activity to your favorites"
            }
          >
            <Ionicons
              name={
                favorite
                  ? "heart"
                  : "heart-outline"
              }
              size={25}
              color={
                favorite
                  ? COLORS.favorite
                  : "#555555"
              }
            />
          </Pressable>
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
        styles.container
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
            0.7
          }
          onPress={() =>
            navigation.goBack()
          }
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={31}
            color={
              COLORS.textPrimary
            }
          />
        </TouchableOpacity>


        <View
          style={
            styles.headerTextArea
          }
        >
          <Text
            style={
              styles.headerTitle
            }
          >
            Happy
          </Text>


          <Text
            style={
              styles.headerSubtitle
            }
          >
            Enjoy and keep the
            good moments.
          </Text>
        </View>


        <View
          style={
            styles.headerSpacer
          }
        />
      </View>


      {/* =================================================
          ACTIVITY LIST
         ================================================= */}

      <FlatList
        data={
          happyActivities
        }
        keyExtractor={(
          item
        ) =>
          item.id
        }
        renderItem={
          renderActivity
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
              styles.cardSeparator
            }
          />
        )}
      />


      {/* =================================================
          INFORMATION MODAL
         ================================================= */}

      <Modal
        visible={Boolean(
          selectedInfoActivity
        )}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={
          closeInformation
        }
      >
        <Pressable
          style={
            styles.modalOverlay
          }
          onPress={
            closeInformation
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
            {/* ===============================================
                MODAL HEADER
               =============================================== */}

            <View
              style={
                styles.modalHeader
              }
            >
              <View
                style={
                  styles.modalTitleContainer
                }
              >
                <View
                  style={
                    styles.modalInformationIcon
                  }
                >
                  <Ionicons
                    name="sunny-outline"
                    size={24}
                    color="#B6812C"
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
                  styles.modalCloseButton
                }
                activeOpacity={
                  0.7
                }
                onPress={
                  closeInformation
                }
                accessibilityRole="button"
                accessibilityLabel="Close activity information"
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#222222"
                />
              </TouchableOpacity>
            </View>


            {/* ===============================================
                DESCRIPTION
               =============================================== */}

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


            {/* ===============================================
                DISCLAIMER
               =============================================== */}

            <Text
              style={
                styles.modalDisclaimer
              }
            >
              This activity supports
              general emotional
              well-being and does not
              replace professional
              mental-health care.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
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
    /*
     * =====================================================
     * CONTAINER
     * =====================================================
     */

    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },


    /*
     * =====================================================
     * HEADER
     * =====================================================
     */

    header: {
      minHeight: 92,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        26,

      paddingVertical:
        12,
    },

    backButton: {
      width: 45,

      height: 45,

      alignItems:
        "flex-start",

      justifyContent:
        "center",
    },

    headerTextArea: {
      flex: 1,

      alignItems:
        "center",

      paddingHorizontal:
        8,
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

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12.5,

      lineHeight: 17,

      textAlign:
        "center",

      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 45,
    },


    /*
     * =====================================================
     * LIST
     * =====================================================
     */

    listContent: {
      paddingHorizontal:
        CARD_HORIZONTAL_MARGIN,

      paddingTop: 15,

      paddingBottom: 45,
    },

    cardSeparator: {
      height: 31,
    },


    /*
     * =====================================================
     * ACTIVITY CARD
     * =====================================================
     */

    activityCard: {
      width:
        CARD_WIDTH,

      height:
        CARD_HEIGHT,

      flexDirection:
        "row",

      backgroundColor:
        COLORS.card,

      borderRadius: 21,

      overflow:
        "hidden",

      borderWidth: 1.2,

      borderColor:
        COLORS.border,

      elevation: 4,

      shadowColor:
        "#C6A35E",

      shadowOffset: {
        width: 0,

        height: 3,
      },

      shadowOpacity: 0.17,

      shadowRadius: 5,
    },

    activityImage: {
      width:
        IMAGE_WIDTH,

      height:
        "100%",
    },

    activityContent: {
      flex: 1,

      justifyContent:
        "center",

      paddingLeft: 11,

      /*
       * Keep space for the
       * information + favorite icons.
       */

      paddingRight: 70,

      position:
        "relative",
    },

    activityTitle: {
      maxWidth:
        "100%",

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 18,

      lineHeight: 24,

      color:
        COLORS.textPrimary,

      marginBottom: 13,
    },


    /*
     * =====================================================
     * INFO BUTTON
     * =====================================================
     */

    informationButton: {
      position:
        "absolute",

      right: 43,

      top: 15,

      width: 34,

      height: 34,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 17,
    },

    iconPressed: {
      backgroundColor:
        COLORS.softYellow,
    },


    /*
     * =====================================================
     * FAVORITE BUTTON
     * =====================================================
     */

    heartButton: {
      position:
        "absolute",

      top: 12,

      right: 10,

      width: 36,

      height: 36,

      borderRadius: 18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.93)",
    },

    heartButtonPressed: {
      backgroundColor:
        "#FBECEF",

      transform: [
        {
          scale: 0.94,
        },
      ],
    },


    /*
     * =====================================================
     * DURATION
     * =====================================================
     */

    durationContainer: {
      position:
        "absolute",

      right: 22,

      bottom: 12,

      minWidth: 59,

      height: 22,

      paddingHorizontal:
        8,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        "#6C665D",

      borderRadius: 13,
    },

    durationText: {
      marginLeft: 3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 11,

      color:
        COLORS.textPrimary,
    },


    /*
     * =====================================================
     * MODAL
     * =====================================================
     */

    modalOverlay: {
      flex: 1,

      backgroundColor:
        "rgba(0,0,0,0.42)",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        25,
    },

    modalCard: {
      width:
        "100%",

      maxWidth:
        380,

      backgroundColor:
        COLORS.white,

      borderRadius:
        24,

      paddingHorizontal:
        23,

      paddingTop:
        22,

      paddingBottom:
        22,

      elevation:
        10,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,

        height: 4,
      },

      shadowOpacity:
        0.2,

      shadowRadius:
        10,
    },

    modalHeader: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",
    },

    modalTitleContainer: {
      flex: 1,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingRight:
        12,
    },

    modalInformationIcon: {
      width:
        40,

      height:
        40,

      borderRadius:
        20,

      backgroundColor:
        COLORS.softYellow,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        11,
    },

    modalTitle: {
      flex:
        1,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        21,

      lineHeight:
        27,

      color:
        COLORS.textPrimary,
    },

    modalCloseButton: {
      width:
        34,

      height:
        34,

      borderRadius:
        17,

      backgroundColor:
        "#F6F3EE",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    modalDescription: {
      marginTop:
        19,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        16,

      lineHeight:
        24,

      color:
        COLORS.textSecondary,
    },

    modalDisclaimer: {
      marginTop:
        18,

      paddingTop:
        15,

      borderTopWidth:
        1,

      borderTopColor:
        "#ECE8E1",

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      lineHeight:
        18,

      color:
        "#918C84",
    },
  });