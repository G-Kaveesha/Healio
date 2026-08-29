import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { sleepActivities } from "./sleepActivities";

export default function SleepActivitiesScreen({ navigation }) {
  const openTrack = (item) => {
    navigation.navigate("SleepMusicPlayer", {
      activityId: item.id,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => openTrack(item)}
      >
        <Image
          source={item.image}
          style={styles.cardImage}
        />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {item.title}
          </Text>

          <Text
            style={styles.cardSubtitle}
            numberOfLines={2}
          >
            {item.subtitle}
          </Text>

          <View style={styles.cardBottom}>
            <View style={styles.tag}>
              <Ionicons
                name="moon-outline"
                size={14}
                color="#BFC8FF"
              />

              <Text style={styles.tagText}>
                Sleep
              </Text>
            </View>

            <View style={styles.playButton}>
              <Ionicons
                name="play"
                size={20}
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#10183F"
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          For Sleep
        </Text>

        <View style={styles.headerButton} />
      </View>

      <FlatList
        data={sleepActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.introContainer}>
            <View style={styles.moonCircle}>
              <Ionicons
                name="moon"
                size={34}
                color="#DDE3FF"
              />
            </View>

            <Text style={styles.mainTitle}>
              Sleep Music
            </Text>

            <Text style={styles.description}>
              Slow down, get comfortable, and choose
              a relaxing sound for tonight.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10183F",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Itim_400Regular",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  introContainer: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 28,
  },

  moonCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#28336D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  mainTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "JosefinSans_700Bold",
    marginBottom: 8,
  },

  description: {
    color: "#BAC3E6",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 310,
  },

  card: {
    backgroundColor: "#252E68",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 20,
  },

  cardImage: {
    width: "100%",
    height: 175,
    resizeMode: "cover",
  },

  cardContent: {
    padding: 18,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "JosefinSans_700Bold",
    marginBottom: 6,
  },

  cardSubtitle: {
    color: "#BFC6E5",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tagText: {
    color: "#BFC8FF",
    fontSize: 13,
  },

  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7585DF",
    alignItems: "center",
    justifyContent: "center",
  },
});