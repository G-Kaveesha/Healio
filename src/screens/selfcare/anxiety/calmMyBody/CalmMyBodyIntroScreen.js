import React, {
  useCallback,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  BackHandler,
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


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F5F8FC",

  card:
    "#FFFFFF",

  primary:
    "#6D8FB8",

  primaryDark:
    "#506E95",

  softBlue:
    "#E5F0F8",

  softBlueStrong:
    "#D8E8F4",

  softLavender:
    "#EEEAF8",

  lavender:
    "#8477B4",

  softCream:
    "#FFF7E4",

  textPrimary:
    "#30343D",

  textSecondary:
    "#737985",

  border:
    "#E1E8EE",

  white:
    "#FFFFFF",
};


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function CalmMyBodyIntroScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * BACK → MAIN SELF CARE
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

        navigation.reset({
          index:
            1,

          routes: [
            {
              name:
                "HomeMain",
            },

            {
              name:
                "SelfCare",
            },
          ],
        });


        return true;
      },
      [
        navigation,
      ]
    );


  /*
   * =======================================================
   * ANDROID PHYSICAL BACK
   * =======================================================
   */

  useFocusEffect(
    useCallback(
      () => {

        const subscription =
          BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackToSelfCare
          );


        return () => {

          subscription.remove();
        };
      },
      [
        handleBackToSelfCare,
      ]
    )
  );


  /*
   * =======================================================
   * BEGIN
   * =======================================================
   */

  const handleBegin =
    () => {

      navigation.navigate(
        "CalmMyBodyExercise",
        {
          ...(
            route?.params ||
            {}
          ),

          activityId:
            route?.params
              ?.activityId ||
            "calm-my-body",

          category:
            route?.params
              ?.category ||
            "anxiety",
        }
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
            onPress={
              handleBackToSelfCare
            }
            activeOpacity={
              0.7
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
          >
            <Ionicons
              name="chevron-back"
              size={
                29
              }
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>


          <Text
            style={
              styles.headerTitle
            }
          >
            Calm My Body
          </Text>


          <View
            style={
              styles.headerSpacer
            }
          />

        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* =================================================
              HERO IMAGE
             =================================================
             
             This is now the single calm activity cover image.
             The exercise demonstrations themselves use video.
             ================================================= */}

          <View
            style={
              styles.heroWrapper
            }
          >
            <Image
              source={require(
                "../../../../../assets/images/selfcare/anxiety/calm_my_body.jpg"
              )}
              style={
                styles.heroImage
              }
              resizeMode="cover"
            />


            <View
              style={
                styles.heroOverlay
              }
            />


            <View
              style={
                styles.heroBadge
              }
            >
              <Ionicons
                name="body-outline"
                size={
                  16
                }
                color={
                  COLORS.primaryDark
                }
              />

              <Text
                style={
                  styles.heroBadgeText
                }
              >
                Gentle body release
              </Text>
            </View>
          </View>


          {/* =================================================
              MAIN CARD
             ================================================= */}

          <View
            style={
              styles.mainCard
            }
          >

            <View
              style={
                styles.titleRow
              }
            >

              <View
                style={
                  styles.titleArea
                }
              >
                <Text
                  style={
                    styles.title
                  }
                >
                  Calm My Body
                </Text>
              </View>


              <View
                style={
                  styles.durationBadge
                }
              >
                <Ionicons
                  name="time-outline"
                  size={
                    17
                  }
                  color={
                    COLORS.primaryDark
                  }
                />

                <Text
                  style={
                    styles.durationText
                  }
                >
                  5 min
                </Text>
              </View>

            </View>


            <Text
              style={
                styles.description
              }
            >
              Gently notice tension,
              release it, and give your
              body a little time to settle.
            </Text>


            {/* =================================================
                MAIN CONCEPT
               ================================================= */}

            <View
              style={
                styles.ideaCard
              }
            >

              <View
                style={
                  styles.ideaIcon
                }
              >
                <Ionicons
                  name="body-outline"
                  size={
                    25
                  }
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>


              <View
                style={
                  styles.ideaTextArea
                }
              >
                <Text
                  style={
                    styles.ideaTitle
                  }
                >
                  Tense gently. Then release.
                </Text>

                <Text
                  style={
                    styles.ideaText
                  }
                >
                  Never strain or push
                  through discomfort.
                </Text>
              </View>

            </View>


            {/* =================================================
                VIDEO PREVIEW NOTE
               ================================================= */}

            <View
              style={
                styles.previewNote
              }
            >
              <View
                style={
                  styles.previewNoteIcon
                }
              >
                <Ionicons
                  name="play-circle-outline"
                  size={
                    22
                  }
                  color={
                    COLORS.primaryDark
                  }
                />
              </View>


              <View
                style={
                  styles.previewNoteTextArea
                }
              >
                <Text
                  style={
                    styles.previewNoteTitle
                  }
                >
                  Follow the movement preview
                </Text>

                <Text
                  style={
                    styles.previewNoteText
                  }
                >
                  Short video demonstrations will guide each
                  part of the exercise.
                </Text>
              </View>
            </View>


            {/* =================================================
                HOW IT WORKS
               ================================================= */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              How it works
            </Text>


            <Step
              number="1"
              title="Notice"
              text="Find where your body feels tense."
              icon="eye-outline"
              backgroundColor={
                COLORS.softBlue
              }
            />


            <Step
              number="2"
              title="Tense gently"
              text="Use only comfortable pressure."
              icon="contract-outline"
              backgroundColor={
                COLORS.softLavender
              }
            />


            <Step
              number="3"
              title="Release"
              text="Let the muscles soften again."
              icon="sparkles-outline"
              backgroundColor={
                COLORS.softCream
              }
            />


            {/* =================================================
                SAFETY NOTE
               ================================================= */}

            <View
              style={
                styles.note
              }
            >
              <Ionicons
                name="heart-outline"
                size={
                  18
                }
                color={
                  COLORS.lavender
                }
              />

              <Text
                style={
                  styles.noteText
                }
              >
                Skip any movement that
                causes pain or discomfort.
              </Text>
            </View>

          </View>

        </ScrollView>


        {/* =================================================
            BOTTOM ACTION
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >

          <TouchableOpacity
            style={
              styles.beginButton
            }
            onPress={
              handleBegin
            }
            activeOpacity={
              0.85
            }
            accessibilityRole="button"
            accessibilityLabel="Begin Calm My Body"
          >

            <Text
              style={
                styles.beginButtonText
              }
            >
              Begin Relaxing
            </Text>


            <Ionicons
              name="arrow-forward"
              size={
                21
              }
              color={
                COLORS.white
              }
            />

          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}


/*
 * =========================================================
 * STEP COMPONENT
 * =========================================================
 */

function Step({
  number,
  title,
  text,
  icon,
  backgroundColor,
}) {

  return (
    <View
      style={[
        styles.stepCard,

        {
          backgroundColor,
        },
      ]}
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
          {
            number
          }
        </Text>
      </View>


      <View
        style={
          styles.stepIcon
        }
      >
        <Ionicons
          name={
            icon
          }
          size={
            20
          }
          color={
            COLORS.primaryDark
          }
        />
      </View>


      <View
        style={
          styles.stepTextArea
        }
      >
        <Text
          style={
            styles.stepTitle
          }
        >
          {
            title
          }
        </Text>


        <Text
          style={
            styles.stepText
          }
        >
          {
            text
          }
        </Text>
      </View>

    </View>
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
      flex:
        1,

      backgroundColor:
        COLORS.background,
    },


    container: {
      flex:
        1,

      backgroundColor:
        COLORS.background,
    },


    /*
     * Header
     */

    header: {
      height:
        64,

      paddingHorizontal:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    backButton: {
      width:
        43,

      height:
        43,

      borderRadius:
        22,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.72)",
    },


    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        21,

      color:
        COLORS.textPrimary,
    },


    headerSpacer: {
      width:
        43,
    },


    /*
     * Content
     */

    scrollContent: {
      paddingBottom:
        28,
    },


    /*
     * Hero
     */

    heroWrapper: {
      position:
        "relative",

      width:
        "100%",

      height:
        250,

      overflow:
        "hidden",

      backgroundColor:
        COLORS.softBlue,
    },


    heroImage: {
      width:
        "100%",

      height:
        "100%",
    },


    heroOverlay: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(65,79,96,0.06)",
    },


    heroBadge: {
      position:
        "absolute",

      left:
        20,

      bottom:
        47,

      height:
        35,

      paddingHorizontal:
        13,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.91)",
    },


    heroBadgeText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        11,

      color:
        COLORS.primaryDark,
    },


    /*
     * Main card
     */

    mainCard: {
      marginTop:
        -32,

      marginHorizontal:
        20,

      paddingHorizontal:
        21,

      paddingTop:
        25,

      paddingBottom:
        27,

      borderRadius:
        28,

      backgroundColor:
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          5,
      },

      shadowOpacity:
        0.07,

      shadowRadius:
        12,

      elevation:
        4,
    },


    titleRow: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",
    },


    titleArea: {
      flex:
        1,

      paddingRight:
        10,
    },


    title: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        27,

      lineHeight:
        33,

      color:
        COLORS.textPrimary,
    },


    durationBadge: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        11,

      paddingVertical:
        8,

      borderRadius:
        18,

      backgroundColor:
        COLORS.softBlue,
    },


    durationText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        12,

      color:
        COLORS.primaryDark,
    },


    description: {
      marginTop:
        15,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        15.5,

      lineHeight:
        23,

      color:
        COLORS.textSecondary,
    },


    /*
     * Main concept
     */

    ideaCard: {
      marginTop:
        23,

      paddingHorizontal:
        15,

      paddingVertical:
        15,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softLavender,
    },


    ideaIcon: {
      width:
        45,

      height:
        45,

      borderRadius:
        23,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },


    ideaTextArea: {
      flex:
        1,

      marginLeft:
        12,
    },


    ideaTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        14.5,

      color:
        COLORS.textPrimary,
    },


    ideaText: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      lineHeight:
        18,

      color:
        COLORS.textSecondary,
    },


    /*
     * Preview note
     */

    previewNote: {
      marginTop:
        13,

      paddingHorizontal:
        14,

      paddingVertical:
        13,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#F4F8FB",

      borderWidth:
        1,

      borderColor:
        "#E0EAF1",
    },


    previewNoteIcon: {
      width:
        41,

      height:
        41,

      borderRadius:
        15,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softBlue,
    },


    previewNoteTextArea: {
      flex:
        1,

      marginLeft:
        10,
    },


    previewNoteTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13,

      color:
        COLORS.textPrimary,
    },


    previewNoteText: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11.5,

      lineHeight:
        16,

      color:
        COLORS.textSecondary,
    },


    /*
     * Steps
     */

    sectionTitle: {
      marginTop:
        25,

      marginBottom:
        13,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        19,

      color:
        COLORS.textPrimary,
    },


    stepCard: {
      minHeight:
        68,

      marginBottom:
        10,

      paddingHorizontal:
        11,

      paddingVertical:
        10,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",
    },


    stepNumber: {
      width:
        35,

      height:
        35,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.78)",
    },


    stepNumberText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        14,

      color:
        COLORS.primaryDark,
    },


    stepIcon: {
      width:
        35,

      marginLeft:
        4,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    stepTextArea: {
      flex:
        1,

      marginLeft:
        7,
    },


    stepTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        13.5,

      color:
        COLORS.textPrimary,
    },


    stepText: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      lineHeight:
        17,

      color:
        COLORS.textSecondary,
    },


    /*
     * Note
     */

    note: {
      marginTop:
        14,

      paddingHorizontal:
        14,

      paddingVertical:
        10,

      borderRadius:
        18,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.softCream,
    },


    noteText: {
      flex:
        1,

      marginLeft:
        8,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12.5,

      lineHeight:
        18,

      color:
        COLORS.textSecondary,
    },


    /*
     * Bottom
     */

    bottomContainer: {
      paddingHorizontal:
        24,

      paddingTop:
        10,

      paddingBottom:
        17,

      backgroundColor:
        COLORS.background,
    },


    beginButton: {
      height:
        58,

      borderRadius:
        19,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.primary,

      shadowColor:
        COLORS.primaryDark,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.14,

      shadowRadius:
        8,

      elevation:
        3,
    },


    beginButtonText: {
      marginRight:
        9,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        16,

      color:
        COLORS.white,
    },
  });