import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 60) / 2;
const CARD_HEIGHT = 250;

const activities = [
  {
    id: "1",
    title: "My\nFavorites",
    image: require("../../assets/images/selfcare/favorites.jpg"),
    screen: "Favorites",
  },
  {
    id: "2",
    title: "Recent\nActivities",
    image: require("../../assets/images/selfcare/recent.jpg"),
    screen: "RecentActivities",
  },
  {
    id: "3",
    title: "Low\nMood",
    image: require("../../assets/images/selfcare/lowmood.jpg"),
    screen: "LowMoodActivities",
  },
  {
    id: "4",
    title: "Take a\nmoment",
    image: require("../../assets/images/selfcare/moment.jpg"),
    screen: "AngerActivities",
  },
  {
    id: "5",
    title: "Worry\nand\nAnxiety",
    image: require("../../assets/images/selfcare/anxiety.jpg"),
    screen: "AnxietyActivities",
  },
  {
    id: "6",
    title: "Happy",
    image: require("../../assets/images/selfcare/happy.jpg"),
    screen: "HappyActivities",
  },
  {
    id: "7",
    title: "Mini\nGames",
    image: require("../../assets/images/selfcare/games.jpg"),
    screen: "MiniGames",
  },
  {
    id: "8",
    title: "For\nSleep",
    image: require("../../assets/images/selfcare/sleep.jpg"),
    screen: "SleepActivities",
  },
];

export default function SelfCareScreen({ navigation }) {
  const openCard = (item) => {
    if (!item.screen) {
      console.warn(`No screen configured for ${item.title}`);
      return;
    }

    navigation.navigate(item.screen);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => openCard(item)}
    >
      <ImageBackground
        source={item.image}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />

        <Text style={styles.cardTitle}>
          {item.title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Self Care</Text>

        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  title: {
    fontSize: 30,
    fontFamily: "Itim_400Regular",
    color: "#111",
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 22,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  image: {
    flex: 1,
    justifyContent: "flex-start",
  },

  imageStyle: {
    borderRadius: 22,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 25,
    marginTop: 18,
    marginLeft: 16,
    width: "100%",
    fontFamily: "JosefinSans_700Bold",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },
});