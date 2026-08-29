import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background: "#FFF9F1",

  card: "#FFFFFF",

  yellow: "#FFE7A3",
  yellowDark: "#B9832B",

  peach: "#F7C6A3",

  coral: "#F09278",
  coralDark: "#C96B56",

  softBlue: "#E3F2F7",
  blue: "#73AAC1",

  softPink: "#FCE7E4",

  textPrimary: "#3D3934",
  textSecondary: "#7A746C",

  white: "#FFFFFF",

  disabled: "#BBB4AC",
};


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function HappyCapsuleSealScreen({
  navigation,
  route,
}) {
  const capsuleType =
    route?.params
      ?.capsuleType;

  const capsuleMemory =
    route?.params
      ?.capsuleMemory ||
    "";

  const capsuleFeeling =
    route?.params
      ?.capsuleFeeling ||
    "happy";


  const [
    isSealed,
    setIsSealed,
  ] = useState(false);

  const [
    isAnimating,
    setIsAnimating,
  ] = useState(false);


  /*
   * =======================================================
   * ANIMATION VALUES
   * =======================================================
   */

  const memoryY =
    useRef(
      new Animated.Value(0)
    ).current;

  const memoryScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const memoryOpacity =
    useRef(
      new Animated.Value(1)
    ).current;

  const capsuleScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const glowOpacity =
    useRef(
      new Animated.Value(0.25)
    ).current;

  const lidY =
    useRef(
      new Animated.Value(-18)
    ).current;


  /*
   * =======================================================
   * IDLE GLOW
   * =======================================================
   */

  useEffect(() => {
    if (
      isSealed ||
      isAnimating
    ) {
      return;
    }

    const glowAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            glowOpacity,
            {
              toValue: 0.7,

              duration: 1400,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            glowOpacity,
            {
              toValue: 0.25,

              duration: 1400,

              useNativeDriver:
                true,
            }
          ),
        ])
      );

    glowAnimation.start();

    return () => {
      glowAnimation.stop();
    };
  }, [
    glowOpacity,
    isSealed,
    isAnimating,
  ]);


  /*
   * =======================================================
   * SEAL
   * =======================================================
   */

  const handleSeal =
    () => {
      if (
        isSealed ||
        isAnimating
      ) {
        return;
      }

      setIsAnimating(
        true
      );


      Animated.sequence([
        /*
         * Memory begins moving
         * toward capsule.
         */

        Animated.parallel([
          Animated.timing(
            memoryY,
            {
              toValue: 145,

              duration: 700,

              easing:
                Easing.inOut(
                  Easing.ease
                ),

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            memoryScale,
            {
              toValue: 0.55,

              duration: 700,

              useNativeDriver:
                true,
            }
          ),

          Animated.timing(
            memoryOpacity,
            {
              toValue: 0,

              duration: 700,

              useNativeDriver:
                true,
            }
          ),
        ]),


        /*
         * Capsule reacts.
         */

        Animated.parallel([
          Animated.sequence([
            Animated.timing(
              capsuleScale,
              {
                toValue: 1.09,

                duration: 180,

                useNativeDriver:
                  true,
              }
            ),

            Animated.spring(
              capsuleScale,
              {
                toValue: 1,

                friction: 5,

                useNativeDriver:
                  true,
              }
            ),
          ]),

          Animated.timing(
            glowOpacity,
            {
              toValue: 1,

              duration: 350,

              useNativeDriver:
                true,
            }
          ),
        ]),


        /*
         * Lid closes.
         */

        Animated.timing(
          lidY,
          {
            toValue: 0,

            duration: 420,

            easing:
              Easing.out(
                Easing.ease
              ),

            useNativeDriver:
              true,
          }
        ),
      ]).start(() => {
        setIsAnimating(
          false
        );

        setIsSealed(
          true
        );
      });
    };


  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  const handleContinue =
    () => {
      if (!isSealed) {
        return;
      }

      navigation.navigate(
        "HappyCapsuleComplete",
        {
          ...(route?.params || {}),

          capsuleSealed:
            true,
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
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <View
        style={styles.container}
      >
        {/* =================================================
            HEADER
           ================================================= */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={() =>
              navigation.goBack()
            }
            disabled={
              isAnimating
            }
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
            style={
              styles.headerCenter
            }
          >
            <Text
              style={
                styles.headerTitle
              }
            >
              My Happy Capsule
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Seal
            </Text>
          </View>


          <View
            style={
              styles.headerSpacer
            }
          />
        </View>


        {/* Progress */}

        <View
          style={
            styles.progressContainer
          }
        >
          <View
            style={
              styles.progressActive
            }
          />

          <View
            style={
              styles.progressActive
            }
          />

          <View
            style={
              styles.progressInactive
            }
          />
        </View>


        {/* =================================================
            CONTENT
           ================================================= */}

        <View
          style={styles.content}
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            YOUR MEMORY
          </Text>


          <Text
            style={styles.title}
          >
            Ready to keep it?
          </Text>


          <Text
            style={
              styles.description
            }
          >
            Seal this little piece of
            today.
          </Text>


          {/* =================================================
              MEMORY CARD
             ================================================= */}

          <Animated.View
            style={[
              styles.memoryCard,

              {
                opacity:
                  memoryOpacity,

                transform: [
                  {
                    translateY:
                      memoryY,
                  },

                  {
                    scale:
                      memoryScale,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.memoryTop
              }
            >
              <View
                style={
                  styles.memoryIcon
                }
              >
                <Ionicons
                  name={
                    capsuleType
                      ?.icon ||
                    "heart-outline"
                  }
                  size={21}
                  color={
                    COLORS.coralDark
                  }
                />
              </View>


              <View
                style={
                  styles.memoryLabels
                }
              >
                <Text
                  style={
                    styles.memoryType
                  }
                >
                  {capsuleType
                    ?.label ||
                    "Happy memory"}
                </Text>

                <Text
                  style={
                    styles.memoryFeeling
                  }
                >
                  {capsuleFeeling}
                </Text>
              </View>
            </View>


            <Text
              style={
                styles.memoryText
              }
              numberOfLines={4}
            >
              {capsuleMemory}
            </Text>
          </Animated.View>


          {/* =================================================
              CAPSULE
             ================================================= */}

          <View
            style={
              styles.capsuleStage
            }
          >
            <Animated.View
              style={[
                styles.capsuleGlow,

                {
                  opacity:
                    glowOpacity,
                },
              ]}
            />


            <Animated.View
              style={[
                styles.capsule,

                {
                  transform: [
                    {
                      scale:
                        capsuleScale,
                    },
                  ],
                },
              ]}
            >
              {/* Lid */}

              <Animated.View
                style={[
                  styles.capsuleLid,

                  {
                    transform: [
                      {
                        translateY:
                          lidY,
                      },
                    ],
                  },
                ]}
              />


              {/* Jar */}

              <View
                style={
                  styles.capsuleJar
                }
              >
                <Ionicons
                  name={
                    isSealed
                      ? "lock-closed"
                      : "heart"
                  }
                  size={31}
                  color={
                    COLORS.coral
                  }
                />

                {isSealed && (
                  <View
                    style={
                      styles.sealedStars
                    }
                  >
                    <Ionicons
                      name="sparkles"
                      size={15}
                      color={
                        COLORS.yellowDark
                      }
                    />
                  </View>
                )}
              </View>
            </Animated.View>
          </View>


          {/* =================================================
              STATE MESSAGE
             ================================================= */}

          {!isSealed ? (
            <Text
              style={
                styles.helperText
              }
            >
              Tap when you're ready.
            </Text>
          ) : (
            <View
              style={
                styles.sealedMessage
              }
            >
              <Ionicons
                name="sparkles-outline"
                size={17}
                color={
                  COLORS.coralDark
                }
              />

              <Text
                style={
                  styles.sealedMessageText
                }
              >
                Your moment is sealed.
              </Text>
            </View>
          )}


          {/* Seal Button */}

          {!isSealed && (
            <TouchableOpacity
              style={[
                styles.sealButton,

                isAnimating &&
                  styles.sealButtonDisabled,
              ]}
              disabled={
                isAnimating
              }
              onPress={
                handleSeal
              }
              activeOpacity={0.85}
            >
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={
                  COLORS.white
                }
              />

              <Text
                style={
                  styles.sealText
                }
              >
                {isAnimating
                  ? "Sealing..."
                  : "Seal My Capsule"}
              </Text>
            </TouchableOpacity>
          )}
        </View>


        {/* =================================================
            BOTTOM
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.continueButton,

              !isSealed &&
                styles.continueDisabled,
            ]}
            disabled={
              !isSealed
            }
            onPress={
              handleContinue
            }
          >
            <Text
              style={[
                styles.continueText,

                !isSealed &&
                  styles.continueTextDisabled,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={
                isSealed
                  ? COLORS.white
                  : COLORS.disabled
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

      overflow: "hidden",
    },

    header: {
      height: 62,

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

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.82)",
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

      fontSize: 10.5,

      color:
        COLORS.textSecondary,
    },

    headerSpacer: {
      width: 42,
    },

    progressContainer: {
      paddingHorizontal: 24,

      flexDirection: "row",

      gap: 7,
    },

    progressActive: {
      flex: 1,

      height: 6,

      borderRadius: 20,

      backgroundColor:
        COLORS.coral,
    },

    progressInactive: {
      flex: 1,

      height: 6,

      borderRadius: 20,

      backgroundColor:
        "#E9E1D8",
    },

    content: {
      flex: 1,

      paddingHorizontal: 24,

      paddingTop: 24,

      alignItems: "center",
    },

    eyebrow: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 10,

      letterSpacing: 1.4,

      color:
        COLORS.coral,
    },

    title: {
      marginTop: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 29,

      color:
        COLORS.textPrimary,
    },

    description: {
      marginTop: 5,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13.5,

      color:
        COLORS.textSecondary,
    },

    memoryCard: {
      width: "100%",

      minHeight: 135,

      marginTop: 23,

      paddingHorizontal: 17,

      paddingVertical: 15,

      borderRadius: 24,

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        "#EEE2D6",

      elevation: 3,

      zIndex: 10,
    },

    memoryTop: {
      flexDirection: "row",

      alignItems: "center",
    },

    memoryIcon: {
      width: 42,

      height: 42,

      borderRadius: 15,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.softPink,
    },

    memoryLabels: {
      marginLeft: 10,
    },

    memoryType: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 13.5,

      color:
        COLORS.textPrimary,
    },

    memoryFeeling: {
      marginTop: 2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 10.5,

      textTransform:
        "capitalize",

      color:
        COLORS.coralDark,
    },

    memoryText: {
      marginTop: 12,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 13.5,

      lineHeight: 20,

      color:
        COLORS.textSecondary,
    },

    capsuleStage: {
      flex: 1,

      minHeight: 260,

      width: "100%",

      alignItems: "center",

      justifyContent:
        "center",
    },

    capsuleGlow: {
      position: "absolute",

      width: 235,

      height: 235,

      borderRadius: 118,

      backgroundColor:
        COLORS.yellow,
    },

    capsule: {
      width: 145,

      height: 175,

      alignItems: "center",

      justifyContent:
        "flex-end",
    },

    capsuleLid: {
      position: "absolute",

      top: 0,

      width: 97,

      height: 38,

      borderRadius: 16,

      backgroundColor:
        COLORS.coral,

      zIndex: 5,
    },

    capsuleJar: {
      width: 135,

      height: 135,

      borderRadius: 40,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,255,255,0.91)",

      borderWidth: 2,

      borderColor:
        COLORS.white,

      elevation: 5,
    },

    sealedStars: {
      position: "absolute",

      right: 26,

      top: 30,
    },

    helperText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize: 12,

      color:
        COLORS.textSecondary,
    },

    sealedMessage: {
      paddingHorizontal: 14,

      paddingVertical: 8,

      borderRadius: 18,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        COLORS.softPink,
    },

    sealedMessageText: {
      marginLeft: 6,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 11.5,

      color:
        COLORS.coralDark,
    },

    sealButton: {
      marginTop: 13,

      height: 50,

      paddingHorizontal: 25,

      borderRadius: 25,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
    },

    sealButtonDisabled: {
      opacity: 0.7,
    },

    sealText: {
      marginLeft: 7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 14,

      color:
        COLORS.white,
    },

    bottomContainer: {
      paddingHorizontal: 24,

      paddingBottom: 17,
    },

    continueButton: {
      height: 58,

      borderRadius: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.coral,
    },

    continueDisabled: {
      backgroundColor:
        "#E7E0D8",
    },

    continueText: {
      marginRight: 8,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize: 16,

      color:
        COLORS.white,
    },

    continueTextDisabled: {
      color:
        COLORS.disabled,
    },
  });