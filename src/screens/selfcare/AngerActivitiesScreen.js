import React, { useState } from "react";

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

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { angerActivities } from "./angerActivities";
import { useSelfCare } from "../../context/SelfCareContext";

const { width } = Dimensions.get("window");

const CARD_HORIZONTAL_MARGIN = 26;
const CARD_WIDTH = width - CARD_HORIZONTAL_MARGIN * 2;
const CARD_HEIGHT = 110;
const IMAGE_WIDTH = 95;

export default function AngerActivitiesScreen({ navigation }) {
  const [selectedInfoActivity, setSelectedInfoActivity] =
    useState(null);

  /*
   * Favorites + Recent Activities functions
   * coming from SelfCareContext.
   */
  const {
    isFavorite,
    toggleFavorite,
    addRecentActivity,
  } = useSelfCare();

  /*
   * Opens the selected activity.
   *
   * Every time an activity is opened,
   * it is also added to Recent Activities.
   */
  const openActivity = (activity) => {
    /*
     * Add/update this activity in Recent Activities.
     */
    addRecentActivity(activity, "anger");

    /*
     * Some activities have their own custom
     * interactive screen flow.
     *
     * Example:
     * Write It, Release It
     * -> WriteReleaseIntro
     */
    if (activity.activityScreen) {
      navigation.navigate(activity.activityScreen, {
        activityId: activity.id,
        category: "anger",
      });

      return;
    }

    /*
     * Activities without a dedicated custom
     * screen continue using the reusable
     * SelfCareActivityDetails screen.
     */
    navigation.navigate("SelfCareActivityDetails", {
      activityId: activity.id,
      category: "anger",
    });
  };

  /*
   * Opens the information modal.
   *
   * stopPropagation prevents the main activity
   * card from opening when the information icon
   * is pressed.
   */
  const openInformation = (event, activity) => {
    event?.stopPropagation?.();

    setSelectedInfoActivity(activity);
  };

  const closeInformation = () => {
    setSelectedInfoActivity(null);
  };

  /*
   * Toggles the favorite state of an activity.
   *
   * This is kept separate from openActivity so
   * pressing the heart does NOT open the activity
   * and does NOT add it to Recent Activities.
   */
  const handleFavoritePress = (
    event,
    activity
  ) => {
    event?.stopPropagation?.();

    toggleFavorite(activity, "anger");
  };

  /*
   * Render one activity card.
   */
  const renderActivity = ({ item }) => {
    /*
     * Check whether this particular activity
     * is already stored in Favorites.
     */
    const favorite = isFavorite(
      item.id,
      "anger"
    );

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.activityCard}
        onPress={() => openActivity(item)}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.title} activity`}
        accessibilityHint="Opens the complete activity instructions"
      >
        {/* Activity image */}
        <Image
          source={item.image}
          style={styles.activityImage}
          resizeMode="cover"
        />

        {/* Activity information */}
        <View style={styles.activityContent}>
          <Text
            style={styles.activityTitle}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Information button */}
          <Pressable
            style={({ pressed }) => [
              styles.informationButton,
              pressed && styles.iconPressed,
            ]}
            onPress={(event) =>
              openInformation(event, item)
            }
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Information about ${item.title}`}
            accessibilityHint="Shows a brief explanation of the activity"
          >
            <Ionicons
              name="information-circle-outline"
              size={25}
              color="#111111"
            />
          </Pressable>

          {/* Duration */}
          <View style={styles.durationContainer}>
            <Ionicons
              name="time-outline"
              size={13}
              color="#111111"
            />

            <Text style={styles.durationText}>
              {item.duration}
            </Text>
          </View>
        </View>

        {/* Favorite heart button */}
        <Pressable
          style={({ pressed }) => [
            styles.heartButton,
            pressed && styles.heartButtonPressed,
          ]}
          onPress={(event) =>
            handleFavoritePress(event, item)
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
                : "#555555"
            }
          />
        </Pressable>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EAF7FF"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={31}
            color="#111111"
          />
        </TouchableOpacity>
      </View>

      {/* Activity list */}
      <FlatList
        data={angerActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivity}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }
        ItemSeparatorComponent={() => (
          <View style={styles.cardSeparator} />
        )}
      />

      {/* Activity Information Modal */}
      <Modal
        visible={Boolean(
          selectedInfoActivity
        )}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeInformation}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={closeInformation}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.modalHeader}>
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
                    color="#377BBE"
                  />
                </View>

                <Text style={styles.modalTitle}>
                  {selectedInfoActivity?.title}
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.modalCloseButton
                }
                activeOpacity={0.7}
                onPress={closeInformation}
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

            <Text
              style={styles.modalDescription}
            >
              {
                selectedInfoActivity?.infoDescription
              }
            </Text>

            <Text
              style={styles.modalDisclaimer}
            >
              This activity is intended for
              general emotional well-being and
              does not replace professional
              mental-health care.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF7FF",
  },

  /*
   * Header
   */
  header: {
    height: 76,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  backButton: {
    width: 45,
    height: 45,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  /*
   * List
   */
  listContent: {
    paddingHorizontal:
      CARD_HORIZONTAL_MARGIN,
    paddingTop: 14,
    paddingBottom: 45,
  },

  cardSeparator: {
    height: 37,
  },

  /*
   * Activity Card
   */
  activityCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,

    flexDirection: "row",

    backgroundColor: "#FFFFFF",

    borderRadius: 21,
    overflow: "hidden",

    borderWidth: 1.2,
    borderColor: "#75BFFF",

    elevation: 4,

    shadowColor: "#79A8C9",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 5,
  },

  activityImage: {
    width: IMAGE_WIDTH,
    height: "100%",
  },

  activityContent: {
    flex: 1,
    justifyContent: "center",

    paddingLeft: 10,

    /*
     * Extra space is kept on the right
     * for information + favorite buttons.
     */
    paddingRight: 70,

    position: "relative",
  },

  activityTitle: {
    maxWidth: "100%",

    fontFamily:
      "JosefinSans_700Bold",

    fontSize: 18,
    lineHeight: 24,

    color: "#111111",

    /*
     * Slightly raised so duration fits
     * comfortably beneath it.
     */
    marginBottom: 13,
  },

  /*
   * Information button
   */
  informationButton: {
    position: "absolute",

    right: 43,
    top: 15,

    width: 34,
    height: 34,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 17,
  },

  iconPressed: {
    backgroundColor: "#EAF7FF",
  },

  /*
   * Favorite button
   */
  heartButton: {
    position: "absolute",

    top: 12,
    right: 10,

    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(255,255,255,0.92)",
  },

  heartButtonPressed: {
    backgroundColor: "#FBECEF",
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  /*
   * Duration badge
   */
  durationContainer: {
    position: "absolute",

    right: 22,
    bottom: 12,

    minWidth: 59,
    height: 22,

    paddingHorizontal: 8,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 13,
  },

  durationText: {
    marginLeft: 3,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 11,

    color: "#111111",
  },

  /*
   * Modal
   */
  modalOverlay: {
    flex: 1,

    backgroundColor:
      "rgba(0, 0, 0, 0.42)",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 25,
  },

  modalCard: {
    width: "100%",
    maxWidth: 380,

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    paddingHorizontal: 23,
    paddingTop: 22,
    paddingBottom: 22,

    elevation: 10,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  modalTitleContainer: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    paddingRight: 12,
  },

  modalInformationIcon: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#EDF8F2",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11,
  },

  modalTitle: {
    flex: 1,

    fontFamily:
      "JosefinSans_700Bold",

    fontSize: 21,
    lineHeight: 27,

    color: "#161616",
  },

  modalCloseButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#F1F5F4",

    alignItems: "center",
    justifyContent: "center",
  },

  modalDescription: {
    marginTop: 19,

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 16,
    lineHeight: 24,

    color: "#4F4F4F",
  },

  modalDisclaimer: {
    marginTop: 18,
    paddingTop: 15,

    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",

    fontFamily:
      "JosefinSans_400Regular",

    fontSize: 12,
    lineHeight: 18,

    color: "#888888",
  },
});