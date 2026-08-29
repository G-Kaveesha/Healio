import React, {
  useCallback,
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

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const BACKGROUND = "#EAF7FF";

/*
  Breathing pattern:

  Inhale: 4 seconds — counts 1, 2, 3, 4
  Hold:   1 second  — no count
  Exhale: 5 seconds — counts 5, 4, 3, 2, 1
*/
const PHASES = [
  {
    name: "Inhale",
    seconds: 4,
    scale: 1.48,
  },
  {
    name: "Hold",
    seconds: 1,
    scale: 1.48,
  },
  {
    name: "Exhale",
    seconds: 5,
    scale: 1,
  },
];

const BREATHING_LAYERS = [
  {
    size: 260,
    color: "#a0c9ea",
    minimumScale: 0.82,
    maximumScale: 1.08,
    minimumOpacity: 0.24,
    maximumOpacity: 0.52,
  },
  {
    size: 215,
    color: "#68a8d8",
    minimumScale: 0.84,
    maximumScale: 1.07,
    minimumOpacity: 0.34,
    maximumOpacity: 0.64,
  },
  {
    size: 172,
    color: "#589bcb",
    minimumScale: 0.87,
    maximumScale: 1.05,
    minimumOpacity: 0.5,
    maximumOpacity: 0.82,
  },
  {
    size: 132,
    color: "#3986b9",
    minimumScale: 0.9,
    maximumScale: 1.03,
    minimumOpacity: 0.82,
    maximumOpacity: 1,
  },
];

const CIRCLE_AREA_SIZE = 300;

export default function WriteReleaseBreathingScreen({
  navigation,
}) {
  /*
    The original animation value is preserved:

    1.48 = fully exhaled
    1.48 = fully inhaled
  */
  const circleScale = useRef(
    new Animated.Value(1.48)
  ).current;

  const countdownTimerRef = useRef(null);
  const activeAnimationRef = useRef(null);
  const mountedRef = useRef(true);

  const [phase, setPhase] = useState("Ready");

  const [phaseSeconds, setPhaseSeconds] =
    useState(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [sessionCompleted, setSessionCompleted] =
    useState(false);

  const [repeatUsed, setRepeatUsed] =
    useState(false);

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      clearCountdown();

      if (activeAnimationRef.current) {
        activeAnimationRef.current.stop();
        activeAnimationRef.current = null;
      }

      circleScale.stopAnimation();
    };
  }, [circleScale, clearCountdown]);

  const runPhase = useCallback(
    (phaseData) =>
      new Promise((resolve) => {
        if (!mountedRef.current) {
          resolve(false);
          return;
        }

        setPhase(phaseData.name);
        clearCountdown();

        /*
          Set the first displayed count immediately.

          Inhale begins at 1.
          Hold has no number.
          Exhale begins at 5.
        */
        if (phaseData.name === "Inhale") {
          setPhaseSeconds(1);
        } else if (phaseData.name === "Exhale") {
          setPhaseSeconds(5);
        } else {
          setPhaseSeconds(null);
        }

        let elapsedSeconds = 0;

        /*
          Hold does not need a counting interval because
          only the word "Hold" should be displayed.
        */
        if (phaseData.name !== "Hold") {
          countdownTimerRef.current =
            setInterval(() => {
              elapsedSeconds += 1;

              if (!mountedRef.current) {
                clearCountdown();
                return;
              }

              if (phaseData.name === "Inhale") {
                const inhaleCount =
                  elapsedSeconds + 1;

                /*
                  Displays:
                  1 at the beginning
                  2 after one second
                  3 after two seconds
                  4 after three seconds
                */
                if (inhaleCount <= 4) {
                  setPhaseSeconds(inhaleCount);
                }
              }

              if (phaseData.name === "Exhale") {
                const exhaleCount =
                  5 - elapsedSeconds;

                /*
                  Displays:
                  5 at the beginning
                  4 after one second
                  3 after two seconds
                  2 after three seconds
                  1 after four seconds
                */
                if (exhaleCount >= 1) {
                  setPhaseSeconds(exhaleCount);
                }
              }

              if (
                elapsedSeconds >= phaseData.seconds
              ) {
                clearCountdown();
              }
            }, 1000);
        }

        const animation = Animated.timing(
          circleScale,
          {
            toValue: phaseData.scale,
            duration: phaseData.seconds * 1000,
            easing:
              phaseData.name === "Hold"
                ? Easing.linear
                : Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }
        );

        activeAnimationRef.current = animation;

        animation.start(({ finished }) => {
          clearCountdown();

          if (
            activeAnimationRef.current === animation
          ) {
            activeAnimationRef.current = null;
          }

          resolve(finished);
        });
      }),
    [circleScale, clearCountdown]
  );

  const runBreathingSession = useCallback(
    async () => {
      if (isRunning) {
        return;
      }

      setIsRunning(true);
      setSessionCompleted(false);

      for (const phaseData of PHASES) {
        const finished = await runPhase(
          phaseData
        );

        if (
          !finished ||
          !mountedRef.current
        ) {
          return;
        }
      }

      if (mountedRef.current) {
        /*
          Only "Complete" is displayed when the
          breathing cycle has finished.
        */
        setPhase("Complete");
        setPhaseSeconds(null);
        setSessionCompleted(true);
        setIsRunning(false);
      }
    },
    [isRunning, runPhase]
  );

  const repeatBreathing = () => {
    if (
      repeatUsed ||
      isRunning ||
      !sessionCompleted
    ) {
      return;
    }

    setRepeatUsed(true);
    runBreathingSession();
  };

  const openFeedbackChat = () => {
    clearCountdown();

    if (activeAnimationRef.current) {
      activeAnimationRef.current.stop();
      activeAnimationRef.current = null;
    }

    navigation.replace(
      "ActivityFeedbackChat",
      {
        activityName: "Write It, Release It",
        activityType: "anger-support",
      }
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

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

      <Text style={styles.title}>
        Pause for one gentle breath
      </Text>

      <Text style={styles.subtitle}>
        Let your shoulders soften if that feels
        comfortable.
      </Text>

      <View style={styles.breathingArea}>
        <TouchableOpacity
          activeOpacity={0.92}
          disabled={isRunning}
          onPress={runBreathingSession}
          accessibilityRole="button"
          accessibilityLabel={
            isRunning
              ? `${phase} breathing phase`
              : "Start breathing exercise"
          }
        >
          <View style={styles.circleArea}>
            {BREATHING_LAYERS.map(
              (layer, index) => {
                /*
                  Each circle expands by a slightly
                  different amount. This creates the
                  soft layered breathing effect.
                */
                const animatedLayerScale =
                  circleScale.interpolate({
                    inputRange: [1, 1.48],
                    outputRange: [
                      layer.minimumScale,
                      layer.maximumScale,
                    ],
                    extrapolate: "clamp",
                  });

                /*
                  The circles become more visible while
                  inhaling and fade while exhaling.
                */
                const animatedLayerOpacity =
                  circleScale.interpolate({
                    inputRange: [1, 1.48],
                    outputRange: [
                      layer.minimumOpacity,
                      layer.maximumOpacity,
                    ],
                    extrapolate: "clamp",
                  });

                return (
                  <Animated.View
                    key={`breathing-layer-${index}`}
                    pointerEvents="none"
                    style={[
                      styles.breathingLayer,
                      {
                        width: layer.size,
                        height: layer.size,
                        borderRadius:
                          layer.size / 2,
                        backgroundColor:
                          layer.color,
                        left:
                          (CIRCLE_AREA_SIZE -
                            layer.size) /
                          2,
                        top:
                          (CIRCLE_AREA_SIZE -
                            layer.size) /
                          2,
                        opacity:
                          animatedLayerOpacity,
                        transform: [
                          {
                            scale:
                              animatedLayerScale,
                          },
                        ],
                      },
                    ]}
                  />
                );
              }
            )}

            <View
              pointerEvents="none"
              style={styles.phaseContainer}
            >
              <Text style={styles.phaseText}>
                {phase}
              </Text>

              {phaseSeconds !== null && (
                <Text style={styles.countdownText}>
                  {phaseSeconds}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={
              !sessionCompleted ||
              repeatUsed ||
              isRunning
            }
            style={[
              styles.bottomButton,
              styles.repeatButton,
              (!sessionCompleted ||
                repeatUsed ||
                isRunning) &&
                styles.disabledButton,
            ]}
            onPress={repeatBreathing}
            accessibilityRole="button"
            accessibilityLabel="Repeat breathing once"
          >
            <Text
              style={[
                styles.bottomButtonText,
                (!sessionCompleted ||
                  repeatUsed ||
                  isRunning) &&
                  styles.disabledButtonText,
              ]}
            >
              {repeatUsed
                ? "Repeated"
                : "Repeat Once"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={
              !sessionCompleted || isRunning
            }
            style={[
              styles.bottomButton,
              styles.continueButton,
              (!sessionCompleted ||
                isRunning) &&
                styles.disabledButton,
            ]}
            onPress={openFeedbackChat}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text
              style={[
                styles.bottomButtonText,
                (!sessionCompleted ||
                  isRunning) &&
                  styles.disabledButtonText,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>

        {!isRunning && !sessionCompleted && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openFeedbackChat}
          >
            <Text style={styles.skipText}>
              Skip breathing
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  header: {
    height: 70,
    paddingHorizontal: 35,
    justifyContent: "center",
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },

  title: {
    marginTop: 5,
    fontFamily: "JosefinSans_700Bold",
    fontSize: 22,
    color: "#090909",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 18,
    paddingHorizontal: 30,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#222222",
    textAlign: "center",
  },

  breathingArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  circleArea: {
    width: CIRCLE_AREA_SIZE,
    height: CIRCLE_AREA_SIZE,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  breathingLayer: {
    position: "absolute",
  },

  phaseContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  phaseText: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 23,
    letterSpacing: 2,
    color: "#FFFFFF",
    textAlign: "center",

    textShadowColor: "rgba(52, 85, 110, 0.28)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },

  countdownText: {
    marginTop: 7,
    fontFamily: "JosefinSans_700Bold",
    fontSize: 28,
    color: "#FFFFFF",
    textAlign: "center",

    textShadowColor: "rgba(52, 85, 110, 0.28)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },

  bottomArea: {
    paddingHorizontal: 28,
    paddingBottom: 35,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bottomButton: {
    width: "47%",
    height: 46,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  repeatButton: {
    backgroundColor: "#C7E0FF",
  },

  continueButton: {
    backgroundColor: "#96C8FF",
  },

  bottomButtonText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 17,
    color: "#111111",
  },

  disabledButton: {
    backgroundColor: "#DDE3E7",
  },

  disabledButtonText: {
    color: "#929292",
  },

  skipText: {
    marginTop: 17,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
  },
});