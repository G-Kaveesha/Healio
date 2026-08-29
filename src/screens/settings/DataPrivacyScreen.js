import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#555555";
const LIGHT_GRAY = "#DADADA";

function PrivacySection({
  title,
  children,
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {children}
    </View>
  );
}

function Paragraph({ children }) {
  return (
    <Text style={styles.paragraph}>
      {children}
    </Text>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletSymbol}>
        •
      </Text>

      <Text style={styles.bulletText}>
        {children}
      </Text>
    </View>
  );
}

export default function DataPrivacyScreen({
  navigation,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={WHITE}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="chevron-back"
            size={30}
            color={BLACK}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Data Privacy
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <Text style={styles.mainTitle}>
          Your privacy matters
        </Text>

        <Paragraph>
          Healio is a non-clinical emotional
          well-being support application. We
          collect only the information required
          to provide features selected by the
          user, such as account details, mood
          check-ins, journal entries, activity
          history, chatbot conversations and
          face-scan emotion results.
        </Paragraph>

        <Paragraph>
          Your information is used to provide
          personalized app functions, display
          emotional trends and recommend
          non-clinical well-being activities.
          Healio does not use facial
          expressions, journal entries or
          chatbot messages to diagnose a
          mental-health condition.
        </Paragraph>

        <PrivacySection
          title="Information Healio collects"
        >
          <Bullet>Nickname</Bullet>

          <Bullet>
            Authentication email and optional
            recovery contact email
          </Bullet>

          <Bullet>
            Mood check-ins and mood history
          </Bullet>

          <Bullet>
            Journal entries created by the user
          </Bullet>

          <Bullet>
            Chatbot conversations when the
            chatbot is used
          </Bullet>

          <Bullet>
            Face-scan emotion result,
            confidence and timestamp
          </Bullet>

          <Bullet>
            Completed self-care activities
          </Bullet>

          <Bullet>
            Notification preferences
          </Bullet>

          <Bullet>
            Trusted-contact details provided by
            the user
          </Bullet>
        </PrivacySection>

        <PrivacySection
          title="How information is used"
        >
          <Bullet>
            To create and operate the user’s
            account
          </Bullet>

          <Bullet>
            To display mood history and
            well-being insights
          </Bullet>

          <Bullet>
            To personalize non-clinical
            activity suggestions
          </Bullet>

          <Bullet>
            To provide contextual chatbot
            support
          </Bullet>

          <Bullet>
            To save user preferences
          </Bullet>

          <Bullet>
            To improve application reliability
            and safety
          </Bullet>
        </PrivacySection>

        <PrivacySection
          title="Face-scan information"
        >
          <Paragraph>
            When the face-scan feature is used,
            the photograph is processed
            temporarily for facial-expression
            estimation. The implementation is
            designed not to permanently save
            the photograph. Only the resulting
            emotion, confidence value,
            timestamp and related activity
            result may be stored.
          </Paragraph>

          <Paragraph>
            Facial-expression estimates may be
            inaccurate. A face-scan result is
            not a medical or psychological
            diagnosis. Users should be able to
            correct or disagree with the
            result.
          </Paragraph>
        </PrivacySection>

        <PrivacySection
          title="Journal and chatbot information"
        >
          <Paragraph>
            Journal entries are private user
            content stored for the signed-in
            account. Journal content is not
            automatically shared with the
            chatbot.
          </Paragraph>

          <Paragraph>
            The user must choose to discuss a
            journal entry or face-scan result.
            Only the context required to provide
            the requested support should be
            sent to the chatbot service. The
            user should be able to remove or
            stop using that context.
          </Paragraph>
        </PrivacySection>

        <PrivacySection
          title="External AI processing"
        >
          <Paragraph>
            When the user chooses to interact
            with an API-based chatbot, the
            user’s message and any context they
            deliberately selected may be sent
            to the configured AI provider so
            that a response can be generated.
          </Paragraph>

          <Paragraph>
            The final application should name
            the selected AI provider and explain
            its retention and model-training
            practices after those settings have
            been technically confirmed. Users
            can avoid external AI processing by
            not using the chatbot or by not
            choosing to share journal or
            face-scan context.
          </Paragraph>
        </PrivacySection>

        <PrivacySection
          title="Data storage and security"
        >
          <Bullet>
            Firebase Authentication is used for
            account access.
          </Bullet>

          <Bullet>
            Firestore stores account-related
            application data.
          </Bullet>

          <Bullet>
            Database-access controls are
            intended to restrict records to the
            authenticated owner.
          </Bullet>

          <Bullet>
            Sensitive account actions require
            authentication.
          </Bullet>

          <Bullet>
            No computer system can guarantee
            complete protection from every
            security risk.
          </Bullet>
        </PrivacySection>

        <PrivacySection
          title="Your controls"
        >
          <Bullet>
            Edit profile information
          </Bullet>

          <Bullet>
            Change notification preferences
          </Bullet>

          <Bullet>
            Delete individual journals, chats
            or mood records where supported
          </Bullet>

          <Bullet>
            Delete the complete Healio account
          </Bullet>

          <Bullet>
            Withdraw optional AI-processing
            consent by not sharing context or
            using the chatbot
          </Bullet>

          <Bullet>
            Contact the app owner about privacy
            concerns
          </Bullet>
        </PrivacySection>

        <PrivacySection
          title="Data retention"
        >
          <Paragraph>
            User information is retained while
            the account remains active. When
            the user deletes the account,
            Healio removes the user’s profile
            and associated application records
            from the active database.
            Temporary service backups may take
            additional time to expire.
          </Paragraph>
        </PrivacySection>

        <PrivacySection
          title="Trusted contacts and safety"
        >
          <Paragraph>
            Trusted-contact information is used
            only through features clearly
            explained to the user. Healio must
            not silently contact another person
            solely because a face scan was
            classified as sad, angry or fearful.
            Contact actions require clear
            consent, a confirmed trusted
            contact and appropriate user
            control.
          </Paragraph>
        </PrivacySection>

        <PrivacySection
          title="Important safety reminder"
        >
          <Paragraph>
            Please avoid entering passwords,
            banking information, identification
            numbers or other unnecessary
            sensitive information in journals,
            chatbot conversations or feedback
            messages.
          </Paragraph>

          <Paragraph>
            Healio is intended to provide
            general emotional well-being
            support. It is not a medical
            service, does not provide diagnosis
            or treatment, and is not a
            substitute for a qualified
            mental-health professional or
            emergency service.
          </Paragraph>
        </PrivacySection>

        <Text style={styles.lastUpdated}>
          Prototype privacy notice — review and
          update before public release.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
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
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 50,
  },

  mainTitle: {
    marginBottom: 14,
    fontFamily:
      "JosefinSans_700Bold",
    fontSize: 21,
    color: BLACK,
  },

  section: {
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },

  sectionTitle: {
    marginBottom: 12,
    fontFamily:
      "JosefinSans_700Bold",
    fontSize: 17,
    color: BLACK,
  },

  paragraph: {
    marginBottom: 12,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: GRAY,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 9,
  },

  bulletSymbol: {
    width: 18,
    fontFamily:
      "JosefinSans_700Bold",
    fontSize: 15,
    color: BLACK,
  },

  bulletText: {
    flex: 1,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: GRAY,
  },

  lastUpdated: {
    marginTop: 25,
    fontFamily:
      "JosefinSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: GRAY,
    textAlign: "center",
  },
});