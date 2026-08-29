import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getSelfCareActivity,
} from "./selfCareActivityRegistry";


export default function SelfCareActivityDetailsScreen({
  navigation,
  route,
}) {

  const {
    activityId,
    category,
  } =
    route.params ?? {};


  /*find activity*/

  const activity =
    getSelfCareActivity(
      category,
      activityId
    );


  /*activity not found*/

  if (!activity) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F6FBF8"
        />


        <View
          style={
            styles.errorContainer
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color="#779888"
          />


          <Text
            style={
              styles.errorTitle
            }
          >
            Activity unavailable
          </Text>


          <Text
            style={
              styles.errorDescription
            }
          >
            This activity could not
            be loaded. Please return
            to the activities screen
            and try again.
          </Text>


          <TouchableOpacity
            activeOpacity={0.85}
            style={
              styles.backToActivitiesButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backToActivitiesText
              }
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  /*UI*/

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
        backgroundColor="#F6FBF8"
      />


      {/*content*/}

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
            size={30}
            color="#111111"
          />
        </TouchableOpacity>


        <Text
          style={
            styles.headerTitle
          }
          numberOfLines={1}
        >
          {activity.title}
        </Text>


        <View
          style={
            styles.headerPlaceholder
          }
        />
      </View>


      {/*content*/}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <Image
          source={
            activity.image
          }
          style={
            styles.heroImage
          }
          resizeMode="cover"
        />


        <View
          style={
            styles.contentCard
          }
        >
          {/* Title / Duration */}

          <View
            style={
              styles.titleRow
            }
          >
            <Text
              style={
                styles.activityTitle
              }
            >
              {activity.title}
            </Text>


            <View
              style={
                styles.durationContainer
              }
            >
              <Ionicons
                name="time-outline"
                size={16}
                color="#456E5D"
              />

              <Text
                style={
                  styles.durationText
                }
              >
                {activity.duration}
              </Text>
            </View>
          </View>


          {/* Introduction */}

          <Text
            style={
              styles.introduction
            }
          >
            {activity.introduction}
          </Text>


          {/* Steps */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            Follow these steps
          </Text>


          {Array.isArray(
            activity.steps
          ) &&
            activity.steps.map(
              (
                step,
                index
              ) => (
                <View
                  key={
                    `${activity.id}-step-${index}`
                  }
                  style={
                    styles.stepRow
                  }
                >
                  <View
                    style={
                      styles.stepNumber
                    }
                  >
                    <Text
                      style={
                        styles.stepNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>


                  <Text
                    style={
                      styles.stepText
                    }
                  >
                    {step}
                  </Text>
                </View>
              )
            )}


          {/* Closing */}

          {activity.closingMessage ? (
            <View
              style={
                styles.closingCard
              }
            >
              <Ionicons
                name="heart-outline"
                size={23}
                color="#5D8A74"
              />


              <Text
                style={
                  styles.closingMessage
                }
              >
                {
                  activity.closingMessage
                }
              </Text>
            </View>
          ) : null}


          {/* Safety */}

          <Text
            style={
              styles.safetyNote
            }
          >
            This is a non-clinical
            well-being activity.
            Complete it at your own
            pace and stop if you feel
            physically or emotionally
            uncomfortable.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


/*style*/

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        "#F6FBF8",
    },

    header: {
      height: 68,

      paddingHorizontal: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    backButton: {
      width: 42,

      height: 42,

      justifyContent:
        "center",
    },

    headerTitle: {
      flex: 1,

      textAlign: "center",

      fontFamily:
        "Itim_400Regular",

      fontSize: 24,

      color: "#161616",
    },

    headerPlaceholder: {
      width: 42,
    },

    scrollContent: {
      paddingBottom: 45,
    },

    heroImage: {
      width: "100%",

      height: 245,
    },

    contentCard: {
      marginTop: -24,

      marginHorizontal: 18,

      paddingHorizontal: 21,

      paddingTop: 24,

      paddingBottom: 25,

      backgroundColor:
        "#FFFFFF",

      borderRadius: 25,

      elevation: 4,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,

        height: 2,
      },

      shadowOpacity: 0.1,

      shadowRadius: 7,
    },

    titleRow: {
      flexDirection: "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",
    },

    activityTitle: {
      flex: 1,

      marginRight: 12,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 24,

      lineHeight: 30,

      color: "#151515",
    },

    durationContainer: {
      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 10,

      paddingVertical: 7,

      backgroundColor:
        "#EDF8F2",

      borderRadius: 15,
    },

    durationText: {
      marginLeft: 5,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize: 13,

      color: "#456E5D",
    },

    introduction: {
      marginTop: 18,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 16,

      lineHeight: 24,

      color: "#555555",
    },

    sectionTitle: {
      marginTop: 27,

      marginBottom: 16,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 19,

      color: "#222222",
    },

    stepRow: {
      flexDirection: "row",

      alignItems:
        "flex-start",

      marginBottom: 17,
    },

    stepNumber: {
      width: 30,

      height: 30,

      borderRadius: 15,

      backgroundColor:
        "#DDEFE4",

      alignItems: "center",

      justifyContent:
        "center",

      marginRight: 12,
    },

    stepNumberText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color: "#4F7965",
    },

    stepText: {
      flex: 1,

      paddingTop: 3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 15,

      lineHeight: 22,

      color: "#444444",
    },

    closingCard: {
      marginTop: 12,

      padding: 16,

      flexDirection: "row",

      alignItems:
        "flex-start",

      backgroundColor:
        "#F0F8F3",

      borderRadius: 17,
    },

    closingMessage: {
      flex: 1,

      marginLeft: 11,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 15,

      lineHeight: 22,

      color: "#4C685B",
    },

    safetyNote: {
      marginTop: 20,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

      lineHeight: 18,

      textAlign: "center",

      color: "#888888",
    },

    errorContainer: {
      flex: 1,

      paddingHorizontal: 25,

      alignItems: "center",

      justifyContent:
        "center",
    },

    errorTitle: {
      marginTop: 15,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 24,

      color: "#222222",
    },

    errorDescription: {
      marginTop: 10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 16,

      lineHeight: 23,

      textAlign: "center",

      color: "#666666",
    },

    backToActivitiesButton: {
      marginTop: 24,

      paddingHorizontal: 25,

      paddingVertical: 13,

      backgroundColor:
        "#88BF98",

      borderRadius: 15,
    },

    backToActivitiesText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 15,

      color: "#FFFFFF",
    },
  });