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
  lowMoodActivities,
} from "./lowMoodActivities";

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
 * LOW MOOD ACTIVITIES SCREEN
 * =========================================================
 */

export default function LowMoodActivitiesScreen({
  navigation,
}) {
  const [
    selectedInfoActivity,
    setSelectedInfoActivity,
  ] = useState(null);


  /*
   * =======================================================
   * SELF-CARE CONTEXT
   * =======================================================
   *
   * Favorites are handled here.
   *
   * Recent Activities are NO LONGER
   * added when an activity is opened.
   *
   * They will be added only when the
   * user reaches the Complete screen
   * of that activity.
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

  const openActivity = (
    activity
  ) => {
    /*
     * IMPORTANT:
     *
     * Do NOT call:
     *
     * addRecentActivity(...)
     *
     * here anymore.
     *
     * Opening an activity does not
     * mean the user completed it.
     */


    /*
     * Activities with their own
     * interactive screen flow.
     */

    if (
      activity.activityScreen
    ) {
      navigation.navigate(
        activity.activityScreen,
        {
          activityId:
            activity.id,

          category:
            "lowMood",
        }
      );

      return;
    }


    /*
     * Reusable activity details
     * fallback.
     */

    navigation.navigate(
      "SelfCareActivityDetails",
      {
        activityId:
          activity.id,

        category:
          "lowMood",
      }
    );
  };


  /*
   * =======================================================
   * INFORMATION MODAL
   * =======================================================
   */

  const openInformation = (
    event,
    activity
  ) => {
    /*
     * Prevent the main activity
     * card from opening when the
     * information icon is pressed.
     */

    event?.stopPropagation?.();


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

  const handleFavoritePress = (
    event,
    activity
  ) => {
    /*
     * Prevent the main activity
     * from opening when the heart
     * button is pressed.
     */

    event?.stopPropagation?.();


    toggleFavorite(
      activity,
      "lowMood"
    );
  };


  /*
   * =======================================================
   * ACTIVITY CARD
   * =======================================================
   */

  const renderActivity = ({
    item,
  }) => {
    const favorite =
      isFavorite(
        item.id,
        "lowMood"
      );


    return (
      <TouchableOpacity
        activeOpacity={0.88}
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
        accessibilityHint="Opens the selected low mood activity"
      >
        {/* =================================================
            ACTIVITY IMAGE
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
            ACTIVITY INFORMATION
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
            numberOfLines={2}
          >
            {item.title}
          </Text>


          {/* Information */}

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
            accessibilityHint="Shows a brief explanation of the activity"
          >
            <Ionicons
              name="information-circle-outline"
              size={25}
              color="#252A35"
            />
          </Pressable>


          {/* Duration */}

          <View
            style={
              styles.durationContainer
            }
          >
            <Ionicons
              name="time-outline"
              size={13}
              color="#252A35"
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
            FAVORITE
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
                ? "#E56F7A"
                : "#555866"
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
        backgroundColor="#F2F1FF"
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
          activeOpacity={0.7}
          onPress={() =>
            navigation.goBack()
          }
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={31}
            color="#252A35"
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
            Low Mood
          </Text>


          <Text
            style={
              styles.headerSubtitle
            }
          >
            Choose what feels
            manageable today.
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
          lowMoodActivities
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
          ACTIVITY INFORMATION MODAL
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
            {/* =============================================
                MODAL HEADER
               ============================================= */}

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
                    name="information-circle-outline"
                    size={25}
                    color="#6662A8"
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
                activeOpacity={0.7}
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


            {/* =============================================
                DESCRIPTION
               ============================================= */}

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


            {/* =============================================
                DISCLAIMER
               ============================================= */}

            <Text
              style={
                styles.modalDisclaimer
              }
            >
              This activity is
              intended for general
              emotional well-being
              and does not replace
              professional
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
    container: {
      flex: 1,

      backgroundColor:
        "#F2F1FF",
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

      fontSize: 23,

      color:
        "#252A35",
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
        "#77778A",
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
        "#FFFFFF",

      borderRadius: 21,

      overflow:
        "hidden",

      borderWidth: 1.2,

      borderColor:
        "#A9A5DF",

      elevation: 4,

      shadowColor:
        "#A8A4CA",

      shadowOffset: {
        width: 0,

        height: 3,
      },

      shadowOpacity:
        0.2,

      shadowRadius:
        5,
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

      paddingLeft:
        11,

      /*
       * Space reserved for:
       *
       * information icon
       * favorite heart
       */

      paddingRight:
        70,

      position:
        "relative",
    },

    activityTitle: {
      maxWidth:
        "100%",

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        18,

      lineHeight:
        24,

      color:
        "#20222C",

      marginBottom:
        13,
    },


    /*
     * =====================================================
     * INFORMATION
     * =====================================================
     */

    informationButton: {
      position:
        "absolute",

      right:
        43,

      top:
        15,

      width:
        34,

      height:
        34,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius:
        17,
    },

    iconPressed: {
      backgroundColor:
        "#ECEBFF",
    },


    /*
     * =====================================================
     * FAVORITE
     * =====================================================
     */

    heartButton: {
      position:
        "absolute",

      top:
        12,

      right:
        10,

      width:
        36,

      height:
        36,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.92)",
    },

    heartButtonPressed: {
      backgroundColor:
        "#FBECEF",

      transform: [
        {
          scale:
            0.94,
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

      right:
        22,

      bottom:
        12,

      minWidth:
        59,

      height:
        22,

      paddingHorizontal:
        8,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#FFFFFF",

      borderWidth:
        1,

      borderColor:
        "#555866",

      borderRadius:
        13,
    },

    durationText: {
      marginLeft:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        "#3E4050",
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
        "#FFFFFF",

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
        width:
          0,

        height:
          4,
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
      flex:
        1,

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
        "#EEECFF",

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
        "#252536",
    },

    modalCloseButton: {
      width:
        34,

      height:
        34,

      borderRadius:
        17,

      backgroundColor:
        "#F2F2F7",

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
        "#555568",
    },

    modalDisclaimer: {
      marginTop:
        18,

      paddingTop:
        15,

      borderTopWidth:
        1,

      borderTopColor:
        "#E8E8EE",

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      lineHeight:
        18,

      color:
        "#888894",
    },
  });