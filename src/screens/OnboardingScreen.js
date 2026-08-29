import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

const { width, height } =
  Dimensions.get("window");

const GREEN = "#88BF98";
const DARK_TEXT = "#000000";
const GRAY_TEXT = "#555555";
const DOT_GRAY = "#D9D9D9";

const slides = [
  {
    id: "1",
    type: "normal",
    title: "Welcome to ",
    titleHighlight: "Healio",
    description:
      "A gentle space to pause, breathe,\nand understand how your day really feels.",
    image: require("../../assets/images/onboard_welcome.png"),
    imageStyle: {
      width: width * 0.6,
      height: height * 0.6,
      marginTop: 0,
    },
  },

  {
    id: "2",
    type: "normal",
    title: "See what your\nfeelings are telling you",
    description:
      "Lift your mood, live a better you.",
    image: require("../../assets/images/onboard_mood.png"),
    imageStyle: {
      width: width * 0.9,
      height: height * 0.6,
      marginTop: 0,
    },
  },

  {
    id: "3",
    type: "normal",
    title: "Write what\nwords can hold",
    description:
      "Capture your thoughts, little wins,\nand heavy moments in a private journal\nthat listens without judgement.",
    image: require("../../assets/images/onboard_journal.png"),
    imageStyle: {
      width: width * 0.8,
      height: height * 0.6,
      marginTop: 0,
    },
  },

  {
    id: "4",
    type: "imageBackground",
    title: "Ready to begin your\njourney",
    background: require("../../assets/images/onboard_night_bg.png"),
  },
];

export default function OnboardingScreen({
  navigation,
}) {
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isStarting, setIsStarting] =
    useState(false);

  const handleScrollEnd = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x /
        width
    );

    setCurrentIndex(slideIndex);
  };

  /**
   * Saves that onboarding has already been viewed.
   * The Splash screen can use this value to send
   * returning users directly to Login.
   */
  const handleStart = async () => {
    if (isStarting) {
      return;
    }

    setIsStarting(true);

    try {
      await AsyncStorage.setItem(
        "onboardingCompleted",
        "true"
      );

      navigation.replace("Register");
    } catch (error) {
      console.error(
        "Unable to save onboarding status:",
        error
      );

      Alert.alert(
        "Unable to continue",
        "Healio could not save your onboarding progress. Please try again."
      );

      setIsStarting(false);
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const isActive =
            currentIndex === index;

          return (
            <View
              key={`onboarding-dot-${index}`}
              style={[
                styles.dot,
                isActive &&
                  styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderNormalSlide = (item) => {
    return (
      <SafeAreaView style={styles.slide}>
        <View style={styles.normalContent}>
          <View
            style={styles.titleContainer}
          >
            {item.titleHighlight ? (
              <Text style={styles.title}>
                {item.title}

                <Text
                  style={
                    styles.titleHighlight
                  }
                >
                  {item.titleHighlight}
                </Text>
              </Text>
            ) : (
              <Text style={styles.title}>
                {item.title}
              </Text>
            )}
          </View>

          <Text style={styles.description}>
            {item.description}
          </Text>

          <Image
            source={item.image}
            style={[
              styles.illustration,
              item.imageStyle,
            ]}
            resizeMode="contain"
          />

          {renderDots()}
        </View>
      </SafeAreaView>
    );
  };

  const renderLastSlide = (item) => {
    return (
      <ImageBackground
        source={item.background}
        style={styles.lastSlide}
        resizeMode="cover"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#12376D"
        />

        <SafeAreaView
          style={styles.lastContent}
        >
          <Text style={styles.lastTitle}>
            {item.title}
          </Text>

          <View style={styles.lastBottom}>
            {renderDots()}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.startButton,
                isStarting &&
                  styles.startButtonDisabled,
              ]}
              onPress={handleStart}
              disabled={isStarting}
              accessibilityRole="button"
              accessibilityLabel="Start using Healio"
            >
              <Text
                style={
                  styles.startButtonText
                }
              >
                {isStarting
                  ? "Starting..."
                  : "Let’s Start →"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  };

  const renderItem = ({ item }) => {
    if (
      item.type ===
      "imageBackground"
    ) {
      return renderLastSlide(item);
    }

    return renderNormalSlide(item);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={
          false
        }
        bounces={false}
        onMomentumScrollEnd={
          handleScrollEnd
        }
        initialNumToRender={1}
        windowSize={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  slide: {
    width,
    height,
    backgroundColor: "#FFFFFF",
  },

  normalContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
  },

  titleContainer: {
    marginTop: height * 0.14,
    minHeight: 95,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: "Itim_400Regular",
    fontSize: 34,
    lineHeight: 43,
    color: DARK_TEXT,
    textAlign: "center",
  },

  titleHighlight: {
    color: GREEN,
  },

  description: {
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 16,
    lineHeight: 22,
    color: GRAY_TEXT,
    textAlign: "center",
    marginTop: 12,
  },

  illustration: {
    resizeMode: "contain",
  },

  dotsContainer: {
    position: "absolute",
    bottom: height * 0.085,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 9,
    backgroundColor: DOT_GRAY,
  },

  activeDot: {
    backgroundColor: GREEN,
  },

  lastSlide: {
    width,
    height,
  },

  lastContent: {
    flex: 1,
    alignItems: "center",
  },

  lastTitle: {
    fontFamily: "Itim_400Regular",
    fontSize: 34,
    lineHeight: 50,
    color: "#020202",
    textAlign: "center",
    marginTop: height * 0.3,
    paddingHorizontal: 35,
  },

  lastBottom: {
    position: "absolute",
    bottom: height * 0.05,
    alignItems: "center",
  },

  startButton: {
    marginTop: 30,
    width: width * 0.55,
    height: 58,
    borderRadius: 30,
    backgroundColor:
      "rgba(94, 146, 97, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  startButtonDisabled: {
    opacity: 0.65,
  },

  startButtonText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 23,
    color: "#FFFFFF",
  },
});