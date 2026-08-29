import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  LinearGradient,
} from "expo-linear-gradient";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  getDemoTodayInsight,
} from "../utils/insightsHelper";

import {
  useSelfCare,
} from "../context/SelfCareContext";

import {
  buildHomeActivityCards,
} from "../services/homeActivityRecommendationService";


const {
  width,
} =
  Dimensions.get(
    "window"
  );


const GREEN =
  "#66C380";

const BLACK =
  "#111111";

const GRAY =
  "#666666";


const CARD_STYLES = [
  {
    color:
      "#EDFFF1",

    border:
      "#B9E6C5",

    badgeBorder:
      "#9BCFAA",
  },

  {
    color:
      "#EEF8FF",

    border:
      "#BEDDEC",

    badgeBorder:
      "#9DC8DB",
  },

  {
    color:
      "#F6F1FF",

    border:
      "#D8C9ED",

    badgeBorder:
      "#C3AFDF",
  },

  {
    color:
      "#FFF7EA",

    border:
      "#E9D5B1",

    badgeBorder:
      "#D8BC8E",
  },
];


const getWeekDates =
  () => {

    const today =
      new Date();


    const currentDay =
      today.getDay();


    const mondayOffset =
      currentDay === 0
        ? -6
        : 1 -
          currentDay;


    const monday =
      new Date(
        today
      );


    monday.setDate(
      today.getDate() +
        mondayOffset
    );


    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];


    return days.map(
      (
        day,
        index
      ) => {

        const date =
          new Date(
            monday
          );


        date.setDate(
          monday.getDate() +
            index
        );


        return {
          day,

          dateNumber:
            date.getDate(),

          fullDate:
            date.toISOString(),

          isToday:
            date.toDateString() ===
            today.toDateString(),
        };
      }
    );
  };


export default function HomeScreen({
  navigation,
}) {

  const [
    nickname,
    setNickname,
  ] =
    useState(
      "Friend"
    );


  const [
    homeActivities,
    setHomeActivities,
  ] =
    useState(
      []
    );


  const [
    isLoadingActivities,
    setIsLoadingActivities,
  ] =
    useState(
      true
    );


  const {
    favorites,
    recentActivities,
  } =
    useSelfCare();


  const weekDates =
    useMemo(
      () =>
        getWeekDates(),
      []
    );


  const todayInsight =
    useMemo(
      () =>
        getDemoTodayInsight(),
      []
    );


  const loadNickname =
    useCallback(
      async () => {

        try {

          const user =
            auth.currentUser;


          if (
            user
          ) {

            const profileReference =
              doc(
                db,
                "users",
                user.uid
              );


            const profileSnapshot =
              await getDoc(
                profileReference
              );


            if (
              profileSnapshot.exists()
            ) {

              const profileData =
                profileSnapshot.data();


              const profileNickname =
                profileData
                  ?.nickname
                  ?.trim();


              if (
                profileNickname
              ) {

                setNickname(
                  profileNickname
                );


                await AsyncStorage
                  .setItem(
                    "healioNickname",
                    profileNickname
                  );


                return;
              }
            }


            const authenticationName =
              user
                .displayName
                ?.trim();


            if (
              authenticationName
            ) {

              setNickname(
                authenticationName
              );


              await AsyncStorage
                .setItem(
                  "healioNickname",
                  authenticationName
                );


              return;
            }
          }


          const savedNickname =
            await AsyncStorage
              .getItem(
                "healioNickname"
              );


          if (
            savedNickname
              ?.trim()
          ) {

            setNickname(
              savedNickname
                .trim()
            );


            return;
          }


          setNickname(
            "Friend"
          );


        } catch (
          error
        ) {

          console.warn(
            "Could not load nickname:",
            error
          );


          try {

            const savedNickname =
              await AsyncStorage
                .getItem(
                  "healioNickname"
                );


            setNickname(
              savedNickname
                ?.trim() ||
                "Friend"
            );


          } catch (
            storageError
          ) {

            console.warn(
              "Could not load local nickname:",
              storageError
            );


            setNickname(
              "Friend"
            );
          }
        }
      },
      []
    );


  const loadLatestJournalEmotion =
    useCallback(
      async () => {

        const currentUser =
          auth.currentUser;


        if (
          !currentUser
        ) {

          return null;
        }


        try {

          const journalQuery =
            query(
              collection(
                db,
                "journalEntries"
              ),

              where(
                "userId",
                "==",
                currentUser.uid
              )
            );


          const snapshot =
            await getDocs(
              journalQuery
            );


          if (
            snapshot.empty
          ) {

            return null;
          }


          const entries =
            snapshot.docs.map(
              (
                journalDocument
              ) => {

                const data =
                  journalDocument
                    .data();


                let createdTime =
                  0;


                const clientCreatedAt =
                  Number(
                    data
                      ?.clientCreatedAt
                  );


                if (
                  Number.isFinite(
                    clientCreatedAt
                  )
                ) {

                  createdTime =
                    clientCreatedAt;

                } else if (
                  data
                    ?.createdAt
                    ?.toMillis
                ) {

                  try {

                    createdTime =
                      data
                        .createdAt
                        .toMillis();

                  } catch (
                    error
                  ) {

                    createdTime =
                      0;
                  }
                }


                return {
                  id:
                    journalDocument.id,

                  ...data,

                  createdTime,
                };
              }
            );


          entries.sort(
            (
              first,
              second
            ) =>
              second.createdTime -
              first.createdTime
          );


          const latestEntry =
            entries[0];


          if (
            !latestEntry
          ) {

            return null;
          }


          return {
            emotion:
              latestEntry
                .nlpEmotion ||
              null,

            confidence:
              latestEntry
                .nlpConfidence ??
              null,

            status:
              latestEntry
                .nlpStatus ||
              null,

            journalId:
              latestEntry.id,
          };


        } catch (
          error
        ) {

          console.warn(
            "Could not load latest journal emotion:",
            error
          );


          return null;
        }
      },
      []
    );


  const loadHomeActivities =
    useCallback(
      async () => {

        setIsLoadingActivities(
          true
        );


        try {

          const journalResult =
            await loadLatestJournalEmotion();


          const selectedActivities =
            buildHomeActivityCards({
              journalEmotion:
                journalResult
                  ?.emotion ||
                null,

              journalConfidence:
                journalResult
                  ?.confidence ??
                null,

              journalStatus:
                journalResult
                  ?.status ||
                null,

              favorites:
                favorites ||
                [],

              recentActivities:
                recentActivities ||
                [],
            });


          const styledActivities =
            selectedActivities.map(
              (
                activity,
                index
              ) => {

                const cardStyle =
                  CARD_STYLES[
                    index %
                    CARD_STYLES.length
                  ];


                return {
                  ...activity,
                  ...cardStyle,
                };
              }
            );


          setHomeActivities(
            styledActivities
          );


        } catch (
          error
        ) {

          console.warn(
            "Could not build Home activity recommendations:",
            error
          );


          setHomeActivities(
            []
          );


        } finally {

          setIsLoadingActivities(
            false
          );
        }
      },
      [
        favorites,
        recentActivities,
        loadLatestJournalEmotion,
      ]
    );


  useFocusEffect(
    useCallback(
      () => {

        loadNickname();

        loadHomeActivities();


        return undefined;
      },
      [
        loadNickname,
        loadHomeActivities,
      ]
    )
  );


  const handleDatePress =
    (
      item
    ) => {

      navigation.navigate(
        "DailyLog",
        {
          selectedDate:
            item.fullDate,

          dayName:
            item.day,
        }
      );
    };


  const handleActivityPress =
    (
      item
    ) => {

      if (
        !item
      ) {

        return;
      }


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

            source:
              "home",
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


  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />


      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.mainScrollContent
        }
      >

        <View
          style={
            styles.topArea
          }
        >

          <View
            style={
              styles.header
            }
          >

            <View
              style={
                styles.greetingContainer
              }
            >
              <Text
                style={
                  styles.greeting
                }
                numberOfLines={
                  1
                }
              >
                Hey, {nickname}
              </Text>


              <Text
                style={
                  styles.greetingSubtitle
                }
              >
                How are you feeling today?
              </Text>
            </View>


            <TouchableOpacity
              activeOpacity={
                0.7
              }
              style={
                styles.settingsButton
              }
              onPress={
                () =>
                  navigation.navigate(
                    "Settings"
                  )
              }
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Image
                source={require(
                  "../../assets/images/settings.png"
                )}
                style={
                  styles.settingsIcon
                }
                resizeMode="contain"
              />
            </TouchableOpacity>

          </View>


          <View
            style={
              styles.weekRow
            }
          >

            {weekDates.map(
              (
                item
              ) => (

                <TouchableOpacity
                  key={
                    item.fullDate
                  }
                  style={
                    styles.dateWrapper
                  }
                  activeOpacity={
                    0.8
                  }
                  onPress={
                    () =>
                      handleDatePress(
                        item
                      )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    `${item.day} ${item.dateNumber}`
                  }
                >

                  <View
                    style={[
                      styles.dateBox,

                      item.isToday &&
                        styles.todayDateBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateNumber,

                        item.isToday &&
                          styles.todayDateNumber,
                      ]}
                    >
                      {
                        item.dateNumber
                      }
                    </Text>
                  </View>


                  <Text
                    style={
                      styles.dayText
                    }
                  >
                    {
                      item.day
                    }
                  </Text>

                </TouchableOpacity>
              )
            )}

          </View>

        </View>


        <View
          style={
            styles.contentArea
          }
        >

          <LinearGradient
            colors={[
              "#ACFAE4",
              "#A0E7FF",
            ]}
            start={{
              x:
                0,

              y:
                0,
            }}
            end={{
              x:
                1,

              y:
                1,
            }}
            style={
              styles.helpCard
            }
          >
            <Text
              style={
                styles.helpTitle
              }
            >
              Need Immediate Help?
            </Text>


            <TouchableOpacity
              style={
                styles.crisisButton
              }
              activeOpacity={
                0.85
              }
              onPress={
                () =>
                  navigation.navigate(
                    "CrisisSupport"
                  )
              }
              accessibilityRole="button"
              accessibilityLabel="Open crisis support"
            >
              <Image
                source={require(
                  "../../assets/images/support.png"
                )}
                style={
                  styles.supportIcon
                }
                resizeMode="contain"
              />


              <Text
                style={
                  styles.crisisButtonText
                }
              >
                Crisis Support
              </Text>
            </TouchableOpacity>

          </LinearGradient>


          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Self Care
            </Text>


            <TouchableOpacity
              style={
                styles.viewAllButton
              }
              activeOpacity={
                0.7
              }
              onPress={
                () =>
                  navigation.navigate(
                    "SelfCare"
                  )
              }
              accessibilityRole="button"
              accessibilityLabel="View all self-care activities"
            >
              <Text
                style={
                  styles.viewAllText
                }
              >
                See More
              </Text>


              <Text
                style={
                  styles.arrowText
                }
              >
                →
              </Text>
            </TouchableOpacity>
          </View>


          {isLoadingActivities ? (

            <View
              style={
                styles.loadingContainer
              }
            >
              <ActivityIndicator
                size="small"
                color={
                  GREEN
                }
              />


              <Text
                style={
                  styles.loadingText
                }
              >
                Choosing activities for you...
              </Text>
            </View>

          ) : homeActivities.length >
            0 ? (

            <View
              style={
                styles.selfCareGrid
              }
            >

              {homeActivities.map(
                (
                  item
                ) => (

                  <TouchableOpacity
                    key={
                      `${item.category}-${item.id}`
                    }
                    activeOpacity={
                      0.85
                    }
                    style={[
                      styles.selfCareCard,

                      {
                        backgroundColor:
                          item.color,

                        borderColor:
                          item.border,
                      },
                    ]}
                    onPress={
                      () =>
                        handleActivityPress(
                          item
                        )
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      `Open ${item.title}`
                    }
                  >

                    <Image
                      source={
                        item.image
                      }
                      style={
                        styles.selfCareImage
                      }
                      resizeMode="cover"
                    />


                    <Text
                      style={
                        styles.cardTitle
                      }
                      numberOfLines={
                        2
                      }
                    >
                      {
                        item.title
                      }
                    </Text>


                    <Text
                      style={
                        styles.cardDescription
                      }
                      numberOfLines={
                        4
                      }
                    >
                      {
                        item
                          .infoDescription ||
                        item
                          .shortDescription ||
                        ""
                      }
                    </Text>


                    <View
                      style={[
                        styles.timeBadge,

                        {
                          borderColor:
                            item.badgeBorder,
                        },
                      ]}
                    >
                      <Text
                        style={
                          styles.timeText
                        }
                      >
                        {
                          item.duration
                        }
                      </Text>
                    </View>

                  </TouchableOpacity>
                )
              )}

            </View>

          ) : (

            <View
              style={
                styles.emptyActivitiesCard
              }
            >
              <Text
                style={
                  styles.emptyActivitiesTitle
                }
              >
                Explore Self Care
              </Text>


              <Text
                style={
                  styles.emptyActivitiesText
                }
              >
                Choose an activity to get started. Your suggestions will become more personal as you use Healio.
              </Text>


              <TouchableOpacity
                style={
                  styles.emptyActivitiesButton
                }
                activeOpacity={
                  0.85
                }
                onPress={
                  () =>
                    navigation.navigate(
                      "SelfCare"
                    )
                }
              >
                <Text
                  style={
                    styles.emptyActivitiesButtonText
                  }
                >
                  Browse Activities
                </Text>
              </TouchableOpacity>
            </View>

          )}


          <Text
            style={
              styles.insightTitle
            }
          >
            Today Insight
          </Text>


          <View
            style={
              styles.insightBox
            }
          >
            <Text
              style={
                styles.insightText
              }
            >
              {
                todayInsight
                  .homeReflection
              }
            </Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({

    safeArea: {
      flex:
        1,

      backgroundColor:
        "#FFFFFF",
    },


    mainScrollContent: {
      backgroundColor:
        "#FFFFFF",

      paddingBottom:
        130,
    },


    topArea: {
      backgroundColor:
        "#FFFFFF",

      paddingBottom:
        28,
    },


    header: {
      marginTop:
        30,

      paddingHorizontal:
        28,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    greetingContainer: {
      flex:
        1,

      paddingRight:
        15,
    },


    greeting: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        29,

      color:
        BLACK,
    },


    greetingSubtitle: {
      marginTop:
        5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      color:
        GRAY,
    },


    settingsButton: {
      width:
        44,

      height:
        44,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    settingsIcon: {
      width:
        33,

      height:
        33,
    },


    weekRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      paddingHorizontal:
        24,

      marginTop:
        34,
    },


    dateWrapper: {
      alignItems:
        "center",
    },


    dateBox: {
      width:
        45,

      height:
        45,

      borderRadius:
        13,

      backgroundColor:
        "#F2FFFC",

      alignItems:
        "center",

      justifyContent:
        "center",

      shadowColor:
        "#1B221E",

      shadowOffset: {
        width:
          0,

        height:
          3,
      },

      shadowOpacity:
        0.3,

      shadowRadius:
        5,

      elevation:
        5,
    },


    todayDateBox: {
      backgroundColor:
        GREEN,
    },


    dateNumber: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        17,

      color:
        BLACK,
    },


    todayDateNumber: {
      color:
        "#FFFFFF",
    },


    dayText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        14,

      color:
        BLACK,

      marginTop:
        10,
    },


    contentArea: {
      backgroundColor:
        "#FFFFFF",

      paddingHorizontal:
        24,

      paddingTop:
        10,
    },


    helpCard: {
      width:
        "100%",

      height:
        130,

      borderRadius:
        22,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        44,

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.13,

      shadowRadius:
        6,

      elevation:
        5,
    },


    helpTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        23,

      color:
        BLACK,

      marginBottom:
        15,
    },


    crisisButton: {
      height:
        38,

      paddingHorizontal:
        22,

      borderRadius:
        20,

      backgroundColor:
        "#FFFFFF",

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    supportIcon: {
      width:
        18,

      height:
        18,

      tintColor:
        "#000000",
    },


    crisisButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        "#000000",

      marginLeft:
        9,
    },


    sectionHeader: {
      marginBottom:
        24,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    sectionTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        26,

      color:
        BLACK,
    },


    viewAllButton: {
      flexDirection:
        "row",

      alignItems:
        "center",

      minHeight:
        38,
    },


    viewAllText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      color:
        BLACK,

      marginRight:
        8,
    },


    arrowText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        20,

      color:
        BLACK,

      marginTop:
        -2,
    },


    selfCareGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    selfCareCard: {
      width:
        (
          width -
          60
        ) /
        2,

      height:
        260,

      borderRadius:
        18,

      borderWidth:
        1.6,

      paddingHorizontal:
        14,

      paddingTop:
        14,

      paddingBottom:
        37,

      marginBottom:
        32,

      overflow:
        "hidden",
    },


    selfCareImage: {
      width:
        "100%",

      height:
        92,

      borderRadius:
        13,

      marginBottom:
        12,

      backgroundColor:
        "#FFFFFF",
    },


    cardTitle: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        16,

      lineHeight:
        20,

      color:
        BLACK,
    },


    cardDescription: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      lineHeight:
        15,

      color:
        GRAY,

      marginTop:
        7,

      paddingRight:
        2,
    },


    timeBadge: {
      position:
        "absolute",

      bottom:
        10,

      right:
        12,

      minWidth:
        54,

      height:
        22,

      borderRadius:
        11,

      borderWidth:
        1.4,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        8,

      backgroundColor:
        "#FFFFFF",
    },


    timeText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        10,

      color:
        BLACK,
    },


    loadingContainer: {
      minHeight:
        180,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginBottom:
        20,
    },


    loadingText: {
      marginTop:
        10,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      color:
        GRAY,
    },


    emptyActivitiesCard: {
      minHeight:
        170,

      borderRadius:
        20,

      borderWidth:
        1.4,

      borderColor:
        "#D7E7DC",

      backgroundColor:
        "#F7FFF9",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        26,

      paddingVertical:
        24,

      marginBottom:
        32,
    },


    emptyActivitiesTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        21,

      color:
        BLACK,
    },


    emptyActivitiesText: {
      marginTop:
        9,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        13,

      lineHeight:
        19,

      color:
        GRAY,

      textAlign:
        "center",
    },


    emptyActivitiesButton: {
      minWidth:
        150,

      height:
        40,

      borderRadius:
        20,

      backgroundColor:
        GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginTop:
        18,

      paddingHorizontal:
        20,
    },


    emptyActivitiesButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        13,

      color:
        "#FFFFFF",
    },


    insightTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        26,

      color:
        BLACK,

      marginTop:
        8,

      marginBottom:
        22,
    },


    insightBox: {
      width:
        "100%",

      minHeight:
        125,

      borderRadius:
        20,

      borderWidth:
        1.5,

      borderColor:
        "#D9D9D9",

      padding:
        18,

      justifyContent:
        "center",

      backgroundColor:
        "#FFFFFF",
    },


    insightText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        15,

      lineHeight:
        22,

      color:
        GRAY,

      textAlign:
        "center",
    },
  });