import React, {
  useEffect,
  useRef,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const BACKGROUND = "#EAF7FF";
const STRIP_COUNT = 12;

export default function WriteReleaseShredScreen({
  navigation,
}) {
  const paperTranslateY = useRef(
    new Animated.Value(0)
  ).current;

  const paperScaleY = useRef(
    new Animated.Value(1)
  ).current;

  const paperOpacity = useRef(
    new Animated.Value(1)
  ).current;

  const stripAnimations = useRef(
    Array.from(
      { length: STRIP_COUNT },
      () => new Animated.Value(0)
    )
  ).current;

  useEffect(() => {
    const startTimer = setTimeout(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(paperTranslateY, {
            toValue: 150,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(paperScaleY, {
            toValue: 0.25,
            duration: 1400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(paperOpacity, {
            toValue: 0,
            duration: 1450,
            useNativeDriver: true,
          }),
        ]),

        Animated.stagger(
          65,
          stripAnimations.map((animation) =>
            Animated.timing(animation, {
              toValue: 1,
              duration: 900,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            })
          )
        ),
      ]).start(() => {
        navigation.replace(
          "WriteReleaseBreathing"
        );
      });
    }, 600);

    return () => {
      clearTimeout(startTimer);

      paperTranslateY.stopAnimation();
      paperScaleY.stopAnimation();
      paperOpacity.stopAnimation();

      stripAnimations.forEach((animation) => {
        animation.stopAnimation();
      });
    };
  }, [
    navigation,
    paperOpacity,
    paperScaleY,
    paperTranslateY,
    stripAnimations,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Releasing the page
        </Text>

        <Text style={styles.subtitle}>
          Let the words leave this private space.
        </Text>

        <View style={styles.animationArea}>
          <Animated.View
            style={[
              styles.paper,
              {
                opacity: paperOpacity,
                transform: [
                  {
                    translateY: paperTranslateY,
                  },
                  {
                    scaleY: paperScaleY,
                  },
                ],
              },
            ]}
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <View
                  key={`preview-line-${index}`}
                  style={styles.paperPreviewLine}
                />
              )
            )}
          </Animated.View>

          <View style={styles.stripsContainer}>
            {stripAnimations.map(
              (animation, index) => {
                const direction =
                  index % 2 === 0 ? 1 : -1;

                return (
                  <Animated.View
                    key={`shred-strip-${index}`}
                    style={[
                      styles.shredStrip,
                      {
                        left: index * 17,
                        opacity:
                          animation.interpolate({
                            inputRange: [
                              0,
                              0.1,
                              0.8,
                              1,
                            ],
                            outputRange: [
                              0,
                              1,
                              1,
                              0,
                            ],
                          }),
                        transform: [
                          {
                            translateY:
                              animation.interpolate(
                                {
                                  inputRange: [
                                    0,
                                    1,
                                  ],
                                  outputRange: [
                                    0,
                                    150,
                                  ],
                                }
                              ),
                          },
                          {
                            rotate:
                              animation.interpolate(
                                {
                                  inputRange: [
                                    0,
                                    1,
                                  ],
                                  outputRange: [
                                    "0deg",
                                    `${
                                      direction * 14
                                    }deg`,
                                  ],
                                }
                              ),
                          },
                        ],
                      },
                    ]}
                  />
                );
              }
            )}
          </View>

          <View style={styles.shredder}>
            <View style={styles.shredderSlot} />

            <Ionicons
              name="trash-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.footerMessage}>
          Nothing you wrote is being stored.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  title: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 24,
    color: "#111111",
  },

  subtitle: {
    marginTop: 12,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
  },

  animationArea: {
    width: 240,
    height: 430,
    marginTop: 40,
    alignItems: "center",
  },

  paper: {
    width: 210,
    height: 250,
    paddingHorizontal: 17,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C5D4DF",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.14,
    shadowRadius: 7,
  },

  paperPreviewLine: {
    height: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#C3CDD4",
  },

  stripsContainer: {
    position: "absolute",
    top: 250,
    left: 17,
    width: 205,
    height: 170,
  },

  shredStrip: {
    position: "absolute",
    top: 0,
    width: 11,
    height: 95,
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#D4DDE3",
  },

  shredder: {
    position: "absolute",
    top: 278,
    width: 240,
    height: 80,
    borderRadius: 17,
    backgroundColor: "#769DB8",
    alignItems: "center",
    justifyContent: "center",
  },

  shredderSlot: {
    position: "absolute",
    top: 12,
    width: 185,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#324C5D",
  },

  footerMessage: {
    marginTop: 15,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 13,
    color: "#687B72",
  },
});