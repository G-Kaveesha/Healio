import React, {
  useCallback,
  useMemo,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Alert,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useSelfCare,
} from "../../context/SelfCareContext";

import {
  getSelfCareActivity,
} from "./selfCareActivityRegistry";


const GREEN =
  "#88BF98";

const TEXT =
  "#1F2521";

const MUTED =
  "#7A837D";

const CARD =
  "#F7FAF8";


/*
 * =========================================================
 * RECENT ACTIVITIES
 * =========================================================
 */

export default function RecentActivitiesScreen({
  navigation,
}) {
  const {
    recentActivities,
    isFavorite,
    toggleFavorite,
    clearRecentActivities,
    refreshRecentActivities,
  } = useSelfCare();


  /*
   * =======================================================
   * REFRESH EXPIRATION
   * =======================================================
   */

  useFocusEffect(
    useCallback(() => {
      refreshRecentActivities();
    }, [
      refreshRecentActivities,
    ])
  );


  /*
   * =======================================================
   * BUILD ACTIVITY OBJECTS
   * =======================================================
   */

  const recentItems =
    useMemo(() => {
      return recentActivities
        .map(
          (
            recent
          ) => {
            const activity =
              getSelfCareActivity(
                recent.category,
                recent.id
              );


            if (
              !activity
            ) {
              return null;
            }


            return {
              ...activity,

              category:
                recent.category,

              lastOpenedAt:
                recent.lastOpenedAt,
            };
          }
        )
        .filter(Boolean)
        .sort(
          (
            a,
            b
          ) =>
            b.lastOpenedAt -
            a.lastOpenedAt
        );
    }, [
      recentActivities,
    ]);


  /*
   * =======================================================
   * OPEN ACTIVITY
   * =======================================================
   *
   * IMPORTANT:
   *
   * We DO NOT update Recent Activities
   * when the user merely opens an item.
   *
   * The timestamp is updated only after
   * the activity reaches its Complete
   * screen.
   */

  const openActivity =
    (
      item
    ) => {
      if (
        item.activityScreen
      ) {
        navigation.navigate(
          item.activityScreen,
          {
            activityId:
              item.id,

            category:
              item.category,
          }
        );

        return;
      }


      navigation.navigate(
        "SelfCareActivityDetails",
        {
          activityId:
            item.id,

          category:
            item.category,
        }
      );
    };


  /*
   * =======================================================
   * CLEAR
   * =======================================================
   */

  const handleClear =
    () => {
      if (
        recentItems.length ===
        0
      ) {
        return;
      }


      Alert.alert(
        "Clear Recent Activities?",

        "This will remove all completed activities from your recent history.",

        [
          {
            text:
              "Cancel",

            style:
              "cancel",
          },

          {
            text:
              "Clear",

            style:
              "destructive",

            onPress:
              clearRecentActivities,
          },
        ]
      );
    };


  /*
   * =======================================================
   * RELATIVE TIME
   * =======================================================
   */

  const getRelativeTime =
    (
      timestamp
    ) => {
      const difference =
        Date.now() -
        timestamp;


      const minutes =
        Math.floor(
          difference /
            (1000 * 60)
        );


      const hours =
        Math.floor(
          difference /
            (1000 *
              60 *
              60)
        );


      if (
        minutes < 1
      ) {
        return "Just now";
      }


      if (
        minutes < 60
      ) {
        return `${minutes} min ago`;
      }


      if (
        hours === 1
      ) {
        return "1 hour ago";
      }


      return `${hours} hours ago`;
    };


  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  const renderItem =
    ({
      item,
    }) => {
      const favorite =
        isFavorite(
          item.id,
          item.category
        );


      return (
        <View
          style={
            styles.card
          }
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={
              styles.activityArea
            }
            onPress={() =>
              openActivity(
                item
              )
            }
          >
            <Image
              source={
                item.image
              }
              style={
                styles.image
              }
            />


            <View
              style={
                styles.content
              }
            >
              <Text
                style={
                  styles.activityTitle
                }
              >
                {item.title}
              </Text>


              <View
                style={
                  styles.durationRow
                }
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={
                    MUTED
                  }
                />

                <Text
                  style={
                    styles.duration
                  }
                >
                  {item.duration}
                </Text>
              </View>


              <Text
                style={
                  styles.lastOpened
                }
              >
                Completed{" "}
                {getRelativeTime(
                  item.lastOpenedAt
                )}
              </Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.heartButton
            }
            activeOpacity={0.7}
            onPress={() =>
              toggleFavorite(
                item,
                item.category
              )
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
                  ? "#E97979"
                  : "#6F7771"
              }
            />
          </TouchableOpacity>
        </View>
      );
    };


  /*UI*/

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
          style={
            styles.headerSide
          }
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111"
          />
        </TouchableOpacity>


        <Text
          style={
            styles.headerTitle
          }
        >
          Recent Activities
        </Text>


        <TouchableOpacity
          style={
            styles.clearContainer
          }
          onPress={
            handleClear
          }
          disabled={
            recentItems.length ===
            0
          }
        >
          <Text
            style={[
              styles.clearText,

              recentItems.length ===
                0 &&
                styles.clearTextDisabled,
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={
          recentItems
        }
        keyExtractor={(
          item
        ) =>
          `${item.category}-${item.id}`
        }
        renderItem={
          renderItem
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={[
          styles.list,

          recentItems.length ===
            0 &&
            styles.emptyList,
        ]}
        ListHeaderComponent={
          recentItems.length >
          0 ? (
            <Text
              style={
                styles.notice
              }
            >
              Completed activities
              disappear from this list
              24 hours after completion.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Ionicons
                name="time-outline"
                size={45}
                color={
                  GREEN
                }
              />
            </View>


            <Text
              style={
                styles.emptyTitle
              }
            >
              Nothing here yet
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Activities you complete
              will appear here so you
              can easily return to
              them.
            </Text>


            <TouchableOpacity
              style={
                styles.exploreButton
              }
              onPress={() =>
                navigation.goBack()
              }
            >
              <Text
                style={
                  styles.exploreText
                }
              >
                Explore Activities
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}


/*styles*/

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        "#FFFFFF",
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        20,

      paddingVertical:
        18,
    },

    headerSide: {
      width: 60,

      height: 40,

      justifyContent:
        "center",
    },

    headerTitle: {
      flex: 1,

      textAlign:
        "center",

      fontSize: 27,

      color: "#111",

      fontFamily:
        "Itim_400Regular",
    },

    clearContainer: {
      width: 60,

      height: 40,

      alignItems:
        "flex-end",

      justifyContent:
        "center",
    },

    clearText: {
      fontSize: 15,

      color: "#D86565",

      fontFamily:
        "JosefinSans_600SemiBold",
    },

    clearTextDisabled: {
      color: "#C7CCC8",
    },

    list: {
      paddingHorizontal:
        20,

      paddingTop: 4,

      paddingBottom: 40,
    },

    emptyList: {
      flexGrow: 1,
    },

    notice: {
      marginBottom: 17,

      textAlign:
        "center",

      fontSize: 13,

      lineHeight: 18,

      color: MUTED,

      fontFamily:
        "JosefinSans_400Regular",
    },

    card: {
      position:
        "relative",

      backgroundColor:
        CARD,

      borderRadius: 20,

      marginBottom: 16,

      overflow:
        "hidden",

      shadowColor:
        "#000",

      shadowOpacity:
        0.07,

      shadowRadius: 7,

      shadowOffset: {
        width: 0,

        height: 3,
      },

      elevation: 3,
    },

    activityArea: {
      flexDirection:
        "row",

      padding: 12,

      paddingRight: 50,
    },

    image: {
      width: 92,

      height: 92,

      borderRadius: 16,
    },

    content: {
      flex: 1,

      paddingLeft: 14,

      justifyContent:
        "center",
    },

    activityTitle: {
      fontSize: 18,

      color: TEXT,

      fontFamily:
        "JosefinSans_600SemiBold",
    },

    durationRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop: 7,
    },

    duration: {
      marginLeft: 5,

      fontSize: 13,

      color: MUTED,

      fontFamily:
        "JosefinSans_400Regular",
    },

    lastOpened: {
      marginTop: 9,

      fontSize: 13,

      color: GREEN,

      fontFamily:
        "JosefinSans_600SemiBold",
    },

    heartButton: {
      position:
        "absolute",

      right: 13,

      top: 13,

      width: 38,

      height: 38,

      borderRadius: 19,

      backgroundColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    emptyContainer: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        38,

      paddingBottom: 70,
    },

    emptyIcon: {
      width: 90,

      height: 90,

      borderRadius: 45,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#EDF7F0",
    },

    emptyTitle: {
      marginTop: 22,

      fontSize: 22,

      color: TEXT,

      fontFamily:
        "JosefinSans_600SemiBold",
    },

    emptyText: {
      marginTop: 10,

      textAlign:
        "center",

      fontSize: 15,

      lineHeight: 22,

      color: MUTED,

      fontFamily:
        "JosefinSans_400Regular",
    },

    exploreButton: {
      marginTop: 25,

      paddingVertical:
        13,

      paddingHorizontal:
        24,

      borderRadius: 22,

      backgroundColor:
        GREEN,
    },

    exploreText: {
      color: "#FFFFFF",

      fontSize: 15,

      fontFamily:
        "JosefinSans_600SemiBold",
    },
  });