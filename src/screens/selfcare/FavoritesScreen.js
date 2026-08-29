import React, {
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
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

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
 * FAVORITES SCREEN
 * =========================================================
 */

export default function FavoritesScreen({
  navigation,
}) {
  const {
    favorites,
    toggleFavorite,
  } = useSelfCare();


  /*
   * =======================================================
   * TURN STORED IDS INTO ACTIVITIES
   * =======================================================
   */

  const favoriteActivities =
    useMemo(() => {
      return favorites
        .map(
          (
            savedItem
          ) => {
            const activity =
              getSelfCareActivity(
                savedItem.category,
                savedItem.id
              );


            if (
              !activity
            ) {
              return null;
            }


            return {
              ...activity,

              category:
                savedItem.category,

              savedAt:
                savedItem.savedAt,
            };
          }
        )
        .filter(Boolean);
    }, [
      favorites,
    ]);


  /*
   * =======================================================
   * OPEN ACTIVITY
   * =======================================================
   *
   * IMPORTANT:
   *
   * We DO NOT add this activity to
   * Recent Activities here.
   *
   * Recent Activities are only
   * recorded after the user reaches
   * an activity's Complete screen.
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
   * RENDER
   * =======================================================
   */

  const renderItem =
    ({
      item,
    }) => {
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
                  size={17}
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
                  styles.description
                }
                numberOfLines={2}
              >
                {
                  item.infoDescription
                }
              </Text>
            </View>
          </TouchableOpacity>


          {/* Remove Favorite */}

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
              name="heart"
              size={25}
              color="#E97979"
            />
          </TouchableOpacity>
        </View>
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
            styles.headerButton
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
          My Favorites
        </Text>


        <View
          style={
            styles.headerButton
          }
        />
      </View>


      <FlatList
        data={
          favoriteActivities
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

          favoriteActivities.length ===
            0 &&
            styles.emptyList,
        ]}
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
                name="heart-outline"
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
              No favorites yet
            </Text>


            <Text
              style={
                styles.emptyText
              }
            >
              Tap the heart on an
              activity you enjoy and
              it will appear here.
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
        "#FFFFFF",
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingHorizontal:
        20,

      paddingVertical:
        18,
    },

    headerButton: {
      width: 40,

      height: 40,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    headerTitle: {
      fontSize: 27,

      color: "#111",

      fontFamily:
        "Itim_400Regular",
    },

    list: {
      paddingHorizontal:
        20,

      paddingTop: 8,

      paddingBottom: 40,
    },

    emptyList: {
      flexGrow: 1,
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

      paddingRight: 48,
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

    description: {
      marginTop: 7,

      fontSize: 13,

      lineHeight: 18,

      color: MUTED,

      fontFamily:
        "JosefinSans_400Regular",
    },

    heartButton: {
      position:
        "absolute",

      top: 13,

      right: 13,

      width: 38,

      height: 38,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderRadius: 19,

      backgroundColor:
        "#FFFFFF",
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