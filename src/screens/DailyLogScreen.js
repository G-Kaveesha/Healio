import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GREEN = "#88BF98";
const LIGHT_GREEN = "#D7FFD9";
const BLACK = "#111111";
const GRAY = "#8E8E8E";
const LIGHT_GRAY = "#F1F1F1";

export default function DailyLogScreen({ navigation, route }) {
  const selectedDate = route.params?.selectedDate || new Date().toISOString();
  const selectedDateObject = new Date(selectedDate);

  const readableDate = selectedDateObject.toDateString();

  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const storageKey = `dailyGoals_${readableDate}`;

  const completedCount = goals.filter((goal) => goal.completed).length;

  const progressPercent = useMemo(() => {
    if (goals.length === 0) {
      return 0;
    }

    return Math.round((completedCount / goals.length) * 100);
  }, [completedCount, goals.length]);

  useEffect(() => {
    const loadDailyGoals = async () => {
      try {
        const savedData = await AsyncStorage.getItem(storageKey);

        if (savedData) {
          const parsed = JSON.parse(savedData);

          // New format
          if (parsed.tasks) {
            setGoals(parsed.tasks);
          }

          if (parsed.goal && !parsed.tasks) {
            setGoals([
              {
                id: Date.now().toString(),
                text: parsed.goal,
                completed: false,
              },
            ]);
          }
        }
      } catch (error) {
        Alert.alert("Error", "Could not load your goals.");
      }
    };

    loadDailyGoals();
  }, [storageKey]);

  const saveGoalsToStorage = async (updatedGoals) => {
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          date: readableDate,
          tasks: updatedGoals,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      Alert.alert("Error", "Could not save your goals.");
    }
  };

  const handleOpenModal = () => {
    setNewGoalText("");
    setIsModalVisible(true);
  };

  const handleAddGoal = async () => {
    const cleanGoal = newGoalText.trim();

    if (!cleanGoal) {
      Alert.alert("Goal needed", "Please type a goal before adding it.");
      return;
    }

    const updatedGoals = [
      ...goals,
      {
        id: Date.now().toString(),
        text: cleanGoal,
        completed: false,
      },
    ];

    setGoals(updatedGoals);
    await saveGoalsToStorage(updatedGoals);

    setNewGoalText("");
    setIsModalVisible(false);
  };

  const handleToggleGoal = async (goalId) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            completed: !goal.completed,
          }
        : goal
    );

    setGoals(updatedGoals);
    await saveGoalsToStorage(updatedGoals);
  };

  const renderGoalRows = () => {
    if (goals.length === 0) {
      return (
        <>

          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.placeholderGoalRow}>
              <View style={styles.emptyCircle} />
            </View>
          ))}
        </>
      );
    }

    return goals.map((goal) => (
      <TouchableOpacity
        key={goal.id}
        activeOpacity={0.8}
        style={styles.goalRow}
        onPress={() => handleToggleGoal(goal.id)}
      >
        <Text
          style={[
            styles.goalText,
            goal.completed && styles.completedGoalText,
          ]}
          numberOfLines={2}
        >
          {goal.text}
        </Text>

        <View
          style={[
            styles.checkCircle,
            goal.completed && styles.completedCircle,
          ]}
        >
          {goal.completed && (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={require("../../assets/images/goals_back.png")}
          style={styles.topBackground}
          opacity={0.8}
          resizeMode="cover"
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={32} color={BLACK} />
            </TouchableOpacity>

            <View style={styles.headerTextBox}>
              <Text style={styles.title}>To Do List</Text>
              <Text style={styles.subtitle}>Let’s plan a meaningful day.</Text>
              <Text style={styles.dateText}>{readableDate}</Text>
            </View>

            <View style={{ width: 32 }} />
          </View>
        </ImageBackground>

        <View style={styles.addCardWrapper}>
          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.85}
            onPress={handleOpenModal}
          >
            <View style={styles.plusCircle}>
              <Ionicons name="add" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.addText}>Add a New Goal</Text>

            <View style={styles.cardDecoration}>
              <Text style={styles.decorationEmoji}>☕🌿</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Today’s Goals</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>

            <View style={styles.percentCircle}>
              <Text style={styles.percentText}>{progressPercent}%</Text>
            </View>
          </View>

          <View style={styles.goalsList}>{renderGoalRows()}</View>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalKeyboardView}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Today’s Goal</Text>

              <Text style={styles.modalSubtitle}>
                Write one simple thing you want to complete today.
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholderTextColor="#A9A9A9"
                value={newGoalText}
                onChangeText={setNewGoalText}
                multiline
                autoFocus
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.8}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  activeOpacity={0.8}
                  onPress={handleAddGoal}
                >
                  <Text style={styles.addButtonText}>Add Goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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

  topBackground: {
    height: 218,
  },

  header: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  headerTextBox: {
    alignItems: "center",
    marginTop: 25,
  },

  title: {
    fontFamily: "Itim_400Regular",
    fontSize: 27,
    color: BLACK,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    color: BLACK,
    marginTop: 10,
    textAlign: "center",
  },

  dateText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 12,
    color: "#555555",
    marginTop: 8,
    textAlign: "center",
  },

  addCardWrapper: {
    marginTop: -25,
    paddingHorizontal: 32,
  },

  addCard: {
    height: 72,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 6,
  },

  plusCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },

  addText: {
    fontFamily: "Itim_400Regular",
    fontSize: 18,
    color: BLACK,
    marginLeft: 22,
    flex: 1,
  },

  cardDecoration: {
    width: 105,
    height: "100%",
    backgroundColor: "#FFF6D9",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
  },

  decorationEmoji: {
    fontSize: 31,
  },

  goalsSection: {
    paddingHorizontal: 34,
    marginTop: 70,
  },

  sectionTitle: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 16,
    color: BLACK,
    marginBottom: 20,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    overflow: "hidden",
    marginRight: 28,
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: GREEN,
  },

  percentCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  percentText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 14,
    color: GREEN,
  },

  goalsList: {
    marginTop: 8,
  },

  goalRow: {
    minHeight: 50,
    borderRadius: 19,
    backgroundColor: LIGHT_GRAY,
    paddingLeft: 18,
    paddingRight: 20,
    paddingVertical: 10,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  goalText: {
    flex: 1,
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    lineHeight: 20,
    color: BLACK,
    marginRight: 15,
  },

  completedGoalText: {
    color: GRAY,
    textDecorationLine: "line-through",
  },

  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#B8B8B8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  completedCircle: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  placeholderGoalRow: {
    height: 50,
    borderRadius: 19,
    backgroundColor: LIGHT_GRAY,
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },

  emptyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#B8B8B8",
    backgroundColor: "#F6F6F6",
  },

  emptyText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: GRAY,
    marginBottom: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  modalKeyboardView: {
    width: "100%",
  },

  modalCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  modalTitle: {
    fontFamily: "Itim_400Regular",
    fontSize: 25,
    color: BLACK,
    textAlign: "center",
  },

  modalSubtitle: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: GRAY,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  modalInput: {
    minHeight: 110,
    borderRadius: 18,
    borderWidth: 1.3,
    borderColor: "#DDDDDD",
    backgroundColor: "#F9F9F9",
    padding: 16,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 16,
    color: BLACK,
    textAlignVertical: "top",
  },

  modalButtonRow: {
    flexDirection: "row",
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  cancelButtonText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    color: BLACK,
  },

  addButton: {
    flex: 1,
    height: 50,
    borderRadius: 17,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  addButtonText: {
    fontFamily: "JosefinSans_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});