import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const GREEN = "#88BF98";
const BLACK = "#111111";
const GRAY = "#666666";
const LIGHT_GREEN = "#EDFFF1";

const helplines = [
  {
    id: "1",
    number: "1926",
    dialNumber: "1926",
    title: "National Institute of Mental Health",
    subtitle: "24/7 confidential support",
  },
  {
    id: "2",
    number: "070 730 8308",
    dialNumber: "0707308308",
    title: "Sri Lanka Sumithrayo",
    subtitle: "Free and confidential emotional support",
  },
  {
    id: "3",
    number: "011 268 2535",
    dialNumber: "0112682535",
    title: "Sri Lanka Sumithrayo",
    subtitle: "Free and confidential emotional support",
  },
  {
    id: "4",
    number: "1333",
    dialNumber: "1333",
    title: "CCCline Sri Lanka",
    subtitle: "Free telephone counselling and emotional support",
  },
];

export default function CrisisContactsScreen({ navigation }) {
  const handleCall = async (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(phoneUrl);

      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "Cannot open phone app",
          "Please dial this number manually from your phone."
        );
      }
    } catch (error) {
      Alert.alert(
        "Call failed",
        "Something went wrong while opening the phone app."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={34} color={BLACK} />
        </TouchableOpacity>

        <View style={styles.textSection}>
          <Text style={styles.description}>
            Healio supports general well-being, but it does not replace emergency
          care or professional support.
          </Text>

          <Text style={styles.description}>
            If you feel unsafe, overwhelmed, or feel that you need emergency
            support, please contact one of the trusted helplines below.
          </Text>
        </View>

        <View style={styles.cardsSection}>
          {helplines.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.contactCard}
              activeOpacity={0.85}
              onPress={() => handleCall(item.dialNumber)}
            >
              <View style={styles.phoneCircle}>
                <Feather name="phone" size={27} color="#FFFFFF" />
              </View>

              <View style={styles.contactTextBox}>
                <Text style={styles.phoneNumber}>{item.number}</Text>
                <Text style={styles.contactTitle}>{item.title}</Text>
                <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            “Asking for help is not weakness. It is a brave step toward feeling
            supported.”
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 24,
    marginLeft: 34,
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  textSection: {
    paddingHorizontal: 42,
    marginTop: 28,
  },

  description: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
    color: BLACK,
    textAlign: "center",
    marginBottom: 27,
  },

  cardsSection: {
    paddingHorizontal: 36,
    marginTop: 10,
  },

  contactCard: {
    minHeight: 84,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: GREEN,
    marginBottom: 23,
    paddingHorizontal: 26,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: GREEN,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 7,
  },

  phoneCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 22,
  },

  contactTextBox: {
    flex: 1,
  },

  phoneNumber: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 20,
    color: BLACK,
    marginBottom: 5,
  },

  contactTitle: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 13,
    color: BLACK,
    marginBottom: 5,
  },

  contactSubtitle: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: GRAY,
  },

  quoteBox: {
    marginHorizontal: 36,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  quoteText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: BLACK,
    textAlign: "center",
  },
});