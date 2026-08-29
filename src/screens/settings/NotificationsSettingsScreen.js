import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../firebase/firebaseConfig";

const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#666666";
const LIGHT_GRAY = "#D7D7D7";

const DEFAULT_PREFERENCES = {
  allowNotifications: false,

  dailyMoodEnabled: false,
  dailyMoodTime: "8:00 PM",

  journalEnabled: false,
  journalTime: "8:30 PM",
  journalDays: [
    "Monday",
    "Wednesday",
    "Friday",
  ],

  selfCareEnabled: false,
  selfCareFrequency: "A few times a week",

  weeklyInsightsEnabled: false,
  weeklyInsightsDay: "Sunday",
  weeklyInsightsTime: "7:00 PM",

  faceScanFollowUpEnabled: false,
  journalFollowUpEnabled: false,

  quietHoursEnabled: true,
  quietHoursStart: "10:00 PM",
  quietHoursEnd: "7:00 AM",

  hideSensitiveContent: true,
};

const TIME_OPTIONS = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "12:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "10:00 PM",
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SELF_CARE_FREQUENCIES = [
  "Daily",
  "A few times a week",
  "Weekly",
];

function SwitchRow({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
}) {
  return (
    <View
      style={[
        styles.switchRow,
        disabled && styles.disabledContainer,
      ]}
    >
      <View style={styles.switchTextContainer}>
        <Text
          style={[
            styles.rowTitle,
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>

        {description ? (
          <Text
            style={[
              styles.rowDescription,
              disabled && styles.disabledText,
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: LIGHT_GRAY,
          true: BLACK,
        }}
        thumbColor={WHITE}
      />
    </View>
  );
}

function SelectionRow({
  label,
  value,
  onPress,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.selectionRow,
        disabled && styles.disabledContainer,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.selectionLabel,
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>

      <View style={styles.selectionRight}>
        <Text
          numberOfLines={2}
          style={[
            styles.selectionValue,
            disabled && styles.disabledText,
          ]}
        >
          {value}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={disabled ? GRAY : BLACK}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsSettingsScreen({
  navigation,
}) {
  const [preferences, setPreferences] =
    useState(DEFAULT_PREFERENCES);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const currentUser = auth.currentUser;

  const loadPreferences = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);

      Alert.alert(
        "Login required",
        "Please log in to manage notification preferences.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );

      return;
    }

    try {
      const preferenceReference = doc(
        db,
        "users",
        currentUser.uid,
        "preferences",
        "notifications"
      );

      const preferenceSnapshot = await getDoc(
        preferenceReference
      );

      if (preferenceSnapshot.exists()) {
        const savedData =
          preferenceSnapshot.data();

        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...savedData,
        });
      }
    } catch (error) {
      console.error(
        "Load notification preferences error:",
        error
      );

      Alert.alert(
        "Unable to load preferences",
        "Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, navigation]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const showSingleChoice = ({
    title,
    options,
    selectedValue,
    onSelect,
  }) => {
    const buttons = options.map((option) => ({
      text:
        option === selectedValue
          ? `✓ ${option}`
          : option,

      onPress: () => onSelect(option),
    }));

    buttons.push({
      text: "Cancel",
      style: "cancel",
    });

    Alert.alert(title, undefined, buttons);
  };

  const toggleJournalDay = (day) => {
    setPreferences((current) => {
      const existingDays =
        current.journalDays || [];

      const nextDays = existingDays.includes(day)
        ? existingDays.filter(
            (savedDay) => savedDay !== day
          )
        : [...existingDays, day];

      return {
        ...current,
        journalDays: nextDays,
      };
    });
  };

  const showJournalDaySelection = () => {
    const dayButtons = WEEK_DAYS.map((day) => ({
      text: preferences.journalDays.includes(day)
        ? `✓ ${day}`
        : day,

      onPress: () => toggleJournalDay(day),
    }));

    dayButtons.push({
      text: "Done",
      style: "cancel",
    });

    Alert.alert(
      "Journal reminder days",
      "Tap a day to add or remove it. Reopen this list to select additional days.",
      dayButtons
    );
  };

  const openDeviceSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert(
        "Unable to open settings",
        "Please open your device Settings application and select Healio."
      );
    }
  };

  const savePreferences = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        "Login required",
        "Please log in again before saving your preferences."
      );
      return;
    }

    if (
      preferences.journalEnabled &&
      preferences.journalDays.length === 0
    ) {
      Alert.alert(
        "Select journal days",
        "Please choose at least one day for the journal reminder."
      );
      return;
    }

    setIsSaving(true);

    try {
      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "preferences",
          "notifications"
        ),
        {
          ...preferences,

          /*
           * Preferences are saved now, but real local
           * or remote scheduling will be connected in
           * a development build later.
           */
          schedulingStatus:
            "preferences-only",

          platform: Platform.OS,

          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      Alert.alert(
        "Preferences saved",
        "Your reminder preferences have been saved. Actual notification delivery will be enabled when Healio's notification service is connected in the development build."
      );
    } catch (error) {
      console.error(
        "Save notification preferences error:",
        error
      );

      if (
        error.code ===
        "permission-denied"
      ) {
        Alert.alert(
          "Permission denied",
          "Your Firestore security rules did not allow this update. Confirm that you are logged in and that the preferences rule has been published."
        );
      } else {
        Alert.alert(
          "Save failed",
          "The notification preferences could not be saved. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const masterDisabled =
    !preferences.allowNotifications;

  const journalDaysText =
    preferences.journalDays.length > 0
      ? preferences.journalDays.join(", ")
      : "No days selected";

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={WHITE}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={BLACK}
          />

          <Text style={styles.loadingText}>
            Loading notification settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={WHITE}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={BLACK}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.permissionSection}>
          <Text style={styles.permissionTitle}>
            Device notification permission
          </Text>

          <Text style={styles.description}>
            Notification permission is managed
            through your device settings while
            Healio is being tested in Expo Go.
          </Text>

          <Text style={styles.description}>
            Choose which gentle reminders you
            would like to receive. You can change
            these preferences at any time.
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.outlineButton}
            onPress={openDeviceSettings}
          >
            <Text style={styles.outlineButtonText}>
              Open Device Settings
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          General
        </Text>

        <SwitchRow
          title="Allow Healio Notifications"
          description="Enable or disable all optional Healio wellness reminders."
          value={
            preferences.allowNotifications
          }
          onValueChange={(value) =>
            updatePreference(
              "allowNotifications",
              value
            )
          }
        />

        <Text style={styles.sectionTitle}>
          Daily reminders
        </Text>

        <SwitchRow
          title="Daily mood check-in"
          description="Receive a gentle reminder to record how your day feels."
          value={
            preferences.dailyMoodEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "dailyMoodEnabled",
              value
            )
          }
        />

        <SelectionRow
          label="Mood reminder time"
          value={preferences.dailyMoodTime}
          disabled={
            masterDisabled ||
            !preferences.dailyMoodEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Mood reminder time",
              options: TIME_OPTIONS,
              selectedValue:
                preferences.dailyMoodTime,
              onSelect: (value) =>
                updatePreference(
                  "dailyMoodTime",
                  value
                ),
            })
          }
        />

        <SwitchRow
          title="Journal reminder"
          description="Receive a private reminder to pause and write about your day."
          value={
            preferences.journalEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "journalEnabled",
              value
            )
          }
        />

        <SelectionRow
          label="Journal reminder time"
          value={preferences.journalTime}
          disabled={
            masterDisabled ||
            !preferences.journalEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Journal reminder time",
              options: TIME_OPTIONS,
              selectedValue:
                preferences.journalTime,
              onSelect: (value) =>
                updatePreference(
                  "journalTime",
                  value
                ),
            })
          }
        />

        <SelectionRow
          label="Journal reminder days"
          value={journalDaysText}
          disabled={
            masterDisabled ||
            !preferences.journalEnabled
          }
          onPress={showJournalDaySelection}
        />

        <SwitchRow
          title="Self-care reminder"
          description="Receive occasional suggestions for short non-clinical well-being activities."
          value={
            preferences.selfCareEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "selfCareEnabled",
              value
            )
          }
        />

        <SelectionRow
          label="Self-care frequency"
          value={
            preferences.selfCareFrequency
          }
          disabled={
            masterDisabled ||
            !preferences.selfCareEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Self-care frequency",
              options:
                SELF_CARE_FREQUENCIES,
              selectedValue:
                preferences.selfCareFrequency,
              onSelect: (value) =>
                updatePreference(
                  "selfCareFrequency",
                  value
                ),
            })
          }
        />

        <Text style={styles.sectionTitle}>
          Weekly insights
        </Text>

        <SwitchRow
          title="Weekly insights summary"
          description="Receive a reminder when your weekly mood and activity insights are ready."
          value={
            preferences.weeklyInsightsEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "weeklyInsightsEnabled",
              value
            )
          }
        />

        <SelectionRow
          label="Summary day"
          value={
            preferences.weeklyInsightsDay
          }
          disabled={
            masterDisabled ||
            !preferences.weeklyInsightsEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Weekly summary day",
              options: WEEK_DAYS,
              selectedValue:
                preferences.weeklyInsightsDay,
              onSelect: (value) =>
                updatePreference(
                  "weeklyInsightsDay",
                  value
                ),
            })
          }
        />

        <SelectionRow
          label="Summary time"
          value={
            preferences.weeklyInsightsTime
          }
          disabled={
            masterDisabled ||
            !preferences.weeklyInsightsEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Weekly summary time",
              options: TIME_OPTIONS,
              selectedValue:
                preferences.weeklyInsightsTime,
              onSelect: (value) =>
                updatePreference(
                  "weeklyInsightsTime",
                  value
                ),
            })
          }
        />

        <Text style={styles.sectionTitle}>
          Optional follow-up
        </Text>

        <SwitchRow
          title="Face-scan follow-up"
          description="Receive a gentle follow-up only after you explicitly choose to continue support from a face scan."
          value={
            preferences
              .faceScanFollowUpEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "faceScanFollowUpEnabled",
              value
            )
          }
        />

        <SwitchRow
          title="Journal follow-up"
          description="Receive an optional reminder to check in after completing a journal activity."
          value={
            preferences
              .journalFollowUpEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "journalFollowUpEnabled",
              value
            )
          }
        />

        <Text style={styles.sectionTitle}>
          Quiet hours
        </Text>

        <SwitchRow
          title="Enable quiet hours"
          description="Healio will avoid sending non-urgent reminders during your quiet hours."
          value={
            preferences.quietHoursEnabled
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "quietHoursEnabled",
              value
            )
          }
        />

        <SelectionRow
          label="Quiet hours start"
          value={
            preferences.quietHoursStart
          }
          disabled={
            masterDisabled ||
            !preferences.quietHoursEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Quiet hours start",
              options: TIME_OPTIONS,
              selectedValue:
                preferences.quietHoursStart,
              onSelect: (value) =>
                updatePreference(
                  "quietHoursStart",
                  value
                ),
            })
          }
        />

        <SelectionRow
          label="Quiet hours end"
          value={preferences.quietHoursEnd}
          disabled={
            masterDisabled ||
            !preferences.quietHoursEnabled
          }
          onPress={() =>
            showSingleChoice({
              title: "Quiet hours end",
              options: TIME_OPTIONS,
              selectedValue:
                preferences.quietHoursEnd,
              onSelect: (value) =>
                updatePreference(
                  "quietHoursEnd",
                  value
                ),
            })
          }
        />

        <Text style={styles.sectionTitle}>
          Notification privacy
        </Text>

        <SwitchRow
          title="Hide sensitive notification content"
          description="Hide mood, journal and activity details from lock-screen notifications."
          value={
            preferences.hideSensitiveContent
          }
          disabled={masterDisabled}
          onValueChange={(value) =>
            updatePreference(
              "hideSensitiveContent",
              value
            )
          }
        />

        <View style={styles.informationSection}>
          <Text style={styles.informationTitle}>
            Safe notification behaviour
          </Text>

          <Text style={styles.description}>
            When sensitive content is hidden, a
            notification should use general text
            such as “You have a new message from
            Healio” rather than showing a mood,
            journal or face-scan result.
          </Text>
        </View>

        <View style={styles.informationSection}>
          <Text style={styles.informationTitle}>
            Trusted-contact and safety alerts
          </Text>

          <Text style={styles.description}>
            General wellness reminders do not
            automatically contact a trusted
            person. Healio should never contact
            another person solely because a face
            scan identified sadness, anger or
            fear. A trusted-contact action must
            require clear consent and user
            control.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.saveButton}
          onPress={savePreferences}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator
              color={WHITE}
            />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Notification Preferences
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 14,
    color: BLACK,
  },

  header: {
    height: 72,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  headerTitle: {
    fontFamily: "Itim_400Regular",
    fontSize: 26,
    color: BLACK,
  },

  headerSpace: {
    width: 40,
  },

  scrollContent: {
    paddingBottom: 45,
  },

  permissionSection: {
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  permissionTitle: {
    fontFamily:
      "JosefinSans_700Bold",
    fontSize: 17,
    color: BLACK,
  },

  description: {
    marginTop: 8,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: BLACK,
  },

  outlineButton: {
    minHeight: 46,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BLACK,
    alignItems: "center",
    justifyContent: "center",
  },

  outlineButtonText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 14,
    color: BLACK,
  },

  sectionTitle: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 12,
    fontFamily:
      "JosefinSans_700Bold",
    fontSize: 17,
    color: BLACK,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  switchRow: {
    minHeight: 80,
    paddingHorizontal: 22,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  switchTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  rowTitle: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: BLACK,
  },

  rowDescription: {
    marginTop: 5,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: BLACK,
  },

  selectionRow: {
    minHeight: 58,
    paddingHorizontal: 22,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  selectionLabel: {
    flex: 1,
    paddingRight: 12,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 14,
    color: BLACK,
  },

  selectionRight: {
    maxWidth: "60%",
    flexDirection: "row",
    alignItems: "center",
  },

  selectionValue: {
    flexShrink: 1,
    marginRight: 7,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "right",
    color: BLACK,
  },

  disabledContainer: {
    opacity: 0.4,
  },

  disabledText: {
    color: GRAY,
  },

  informationSection: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  informationTitle: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: BLACK,
  },

  saveButton: {
    minHeight: 52,
    marginHorizontal: 22,
    marginTop: 30,
    backgroundColor: BLACK,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    fontFamily:
      "JosefinSans_600SemiBold",
    fontSize: 15,
    color: WHITE,
  },
});