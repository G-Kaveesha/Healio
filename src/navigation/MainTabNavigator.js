import React from "react";

import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";

import HomeScreen
  from "../screens/HomeScreen";

import DailyLogScreen
  from "../screens/DailyLogScreen";

import SelfCareScreen
  from "../screens/SelfCareScreen";

import CrisisSupportScreen
  from "../screens/CrisisSupportScreen";

import CrisisContactsScreen
  from "../screens/CrisisContactsScreen";

import ChatbotScreen
  from "../screens/ChatbotScreen";

import FaceScanScreen
  from "../screens/FaceScanScreen";

import JournalScreen
  from "../screens/JournalScreen";

import AddJournalScreen
  from "../screens/AddJournalScreen";

import JournalDetailScreen
  from "../screens/JournalDetailScreen";

import InsightsScreen
  from "../screens/InsightsScreen";

import SettingsScreen
  from "../screens/SettingsScreen";

import AngerActivitiesScreen
  from "../screens/selfcare/AngerActivitiesScreen";

import SelfCareActivityDetailsScreen
  from "../screens/selfcare/SelfCareActivityDetailsScreen";

import FavoritesScreen
  from "../screens/selfcare/FavoritesScreen";

import RecentActivitiesScreen
  from "../screens/selfcare/RecentActivitiesScreen";

import WriteReleaseIntroScreen
  from "../screens/selfcare/writeRelease/WriteReleaseIntroScreen";

import WriteReleaseWritingScreen
  from "../screens/selfcare/writeRelease/WriteReleaseWritingScreen";

import WriteReleaseShredScreen
  from "../screens/selfcare/writeRelease/WriteReleaseShredScreen";

import WriteReleaseBreathingScreen
  from "../screens/selfcare/writeRelease/WriteReleaseBreathingScreen";

import ActivityFeedbackChatScreen
  from "../screens/selfcare/writeRelease/ActivityFeedbackChatScreen";

import RainMindfulnessIntroScreen
  from "../screens/selfcare/anger/rain/RainMindfulnessIntroScreen";

import RainRecognizeScreen
  from "../screens/selfcare/anger/rain/RainRecognizeScreen";

import RainAllowScreen
  from "../screens/selfcare/anger/rain/RainAllowScreen";

import RainInvestigateScreen
  from "../screens/selfcare/anger/rain/RainInvestigateScreen";

import RainNurtureScreen
  from "../screens/selfcare/anger/rain/RainNurtureScreen";

import RainBreathingScreen
  from "../screens/selfcare/anger/rain/RainBreathingScreen";

import RainCompleteScreen
  from "../screens/selfcare/anger/rain/RainCompleteScreen";

import BoxBreathingIntroScreen
  from "../screens/selfcare/anger/boxBreathing/BoxBreathingIntroScreen";

import BoxBreathingExerciseScreen
  from "../screens/selfcare/anger/boxBreathing/BoxBreathingExerciseScreen";

import BoxBreathingCompleteScreen
  from "../screens/selfcare/anger/boxBreathing/BoxBreathingCompleteScreen";

import GroundingIntroScreen
  from "../screens/selfcare/anger/grounding/GroundingIntroScreen";

import GroundingChatScreen
  from "../screens/selfcare/anger/grounding/GroundingChatScreen";

import GroundingCompleteScreen
  from "../screens/selfcare/anger/grounding/GroundingCompleteScreen";

import LowMoodActivitiesScreen
  from "../screens/selfcare/lowMood/LowMoodActivitiesScreen";

import SmallStepIntroScreen
  from "../screens/selfcare/lowMood/oneSmallStep/SmallStepIntroScreen";

import SmallStepChooseScreen
  from "../screens/selfcare/lowMood/oneSmallStep/SmallStepChooseScreen";

import SmallStepActivityScreen
  from "../screens/selfcare/lowMood/oneSmallStep/SmallStepActivityScreen";

import SmallStepCompleteScreen
  from "../screens/selfcare/lowMood/oneSmallStep/SmallStepCompleteScreen";

import MoveWithMeIntroScreen
  from "../screens/selfcare/lowMood/moveWithMe/MoveWithMeIntroScreen";

import MoveWithMeChooseScreen
  from "../screens/selfcare/lowMood/moveWithMe/MoveWithMeChooseScreen";

import MoveWithMeExerciseScreen
  from "../screens/selfcare/lowMood/moveWithMe/MoveWithMeExerciseScreen";

import MoveWithMeCompleteScreen
  from "../screens/selfcare/lowMood/moveWithMe/MoveWithMeCompleteScreen";

import KinderPerspectiveIntroScreen
  from "../screens/selfcare/lowMood/kinderPerspective/KinderPerspectiveIntroScreen";

import KinderPerspectiveChatScreen
  from "../screens/selfcare/lowMood/kinderPerspective/KinderPerspectiveChatScreen";

import KinderPerspectiveCompleteScreen
  from "../screens/selfcare/lowMood/kinderPerspective/KinderPerspectiveCompleteScreen";

import AnxietyActivitiesScreen
  from "../screens/selfcare/anxiety/AnxietyActivitiesScreen";

import CalmMyBodyIntroScreen
  from "../screens/selfcare/anxiety/calmMyBody/CalmMyBodyIntroScreen";

import CalmMyBodyExerciseScreen
  from "../screens/selfcare/anxiety/calmMyBody/CalmMyBodyExerciseScreen";

import CalmMyBodyCompleteScreen
  from "../screens/selfcare/anxiety/calmMyBody/CalmMyBodyCompleteScreen";


import SortMyWorryIntroScreen
  from "../screens/selfcare/anxiety/sortMyWorry/SortMyWorryIntroScreen";

import SortMyWorryChatScreen
  from "../screens/selfcare/anxiety/sortMyWorry/SortMyWorryChatScreen";

import SortMyWorryCompleteScreen
  from "../screens/selfcare/anxiety/sortMyWorry/SortMyWorryCompleteScreen";

import SlowTheWaveIntroScreen
  from "../screens/selfcare/anxiety/slowTheWave/SlowTheWaveIntroScreen";

import SlowTheWaveBreathingScreen
  from "../screens/selfcare/anxiety/slowTheWave/SlowTheWaveBreathingScreen";

import SlowTheWaveCompleteScreen
  from "../screens/selfcare/anxiety/slowTheWave/SlowTheWaveCompleteScreen";

import HappyActivitiesScreen
  from "../screens/selfcare/happy/HappyActivitiesScreen";

import HoldTheMomentIntroScreen
  from "../screens/selfcare/happy/holdTheMoment/HoldTheMomentIntroScreen";

import HoldTheMomentChooseScreen
  from "../screens/selfcare/happy/holdTheMoment/HoldTheMomentChooseScreen";

import HoldTheMomentSavorScreen
  from "../screens/selfcare/happy/holdTheMoment/HoldTheMomentSavorScreen";

import HoldTheMomentCompleteScreen
  from "../screens/selfcare/happy/holdTheMoment/HoldTheMomentCompleteScreen";

import PassItOnIntroScreen
  from "../screens/selfcare/happy/passItOn/PassItOnIntroScreen";

import PassItOnChooseScreen
  from "../screens/selfcare/happy/passItOn/PassItOnChooseScreen";

import PassItOnActionScreen
  from "../screens/selfcare/happy/passItOn/PassItOnActionScreen";

import PassItOnCompleteScreen
  from "../screens/selfcare/happy/passItOn/PassItOnCompleteScreen";

import HappyCapsuleIntroScreen
  from "../screens/selfcare/happy/happyCapsule/HappyCapsuleIntroScreen";

import HappyCapsuleCreateScreen
  from "../screens/selfcare/happy/happyCapsule/HappyCapsuleCreateScreen";

import HappyCapsuleSealScreen
  from "../screens/selfcare/happy/happyCapsule/HappyCapsuleSealScreen";

import HappyCapsuleCompleteScreen
  from "../screens/selfcare/happy/happyCapsule/HappyCapsuleCompleteScreen";

import MiniGamesScreen
  from "../screens/selfcare/miniGames/MiniGamesScreen";

import BubblePopIntroScreen
  from "../screens/selfcare/miniGames/bubblePop/BubblePopIntroScreen";

import BubblePopGameScreen
  from "../screens/selfcare/miniGames/bubblePop/BubblePopGameScreen";

import BubblePopCompleteScreen
  from "../screens/selfcare/miniGames/bubblePop/BubblePopCompleteScreen";

import ColorUnwindIntroScreen
  from "../screens/selfcare/miniGames/colorUnwind/ColorUnwindIntroScreen";

import ColorUnwindChooseScreen
  from "../screens/selfcare/miniGames/colorUnwind/ColorUnwindChooseScreen";

import ColorUnwindCanvasScreen
  from "../screens/selfcare/miniGames/colorUnwind/ColorUnwindCanvasScreen";

import ColorUnwindCompleteScreen
  from "../screens/selfcare/miniGames/colorUnwind/ColorUnwindCompleteScreen";


import ZenGardenIntroScreen
  from "../screens/selfcare/miniGames/ZenGarden/ZenGardenIntroScreen";

import ZenGardenGameScreen
  from "../screens/selfcare/miniGames/ZenGarden/ZenGardenGameScreen";

import ZenGardenCompleteScreen
  from "../screens/selfcare/miniGames/ZenGarden/ZenGardenCompleteScreen";

import ProfileSettingsScreen
  from "../screens/settings/ProfileSettingsScreen";

import NotificationsSettingsScreen
  from "../screens/settings/NotificationsSettingsScreen";

import FeedbackScreen
  from "../screens/settings/FeedbackScreen";

import DataPrivacyScreen
  from "../screens/settings/DataPrivacyScreen";

import SleepActivitiesScreen
  from "../screens/selfcare/sleep/SleepActivitiesScreen";

import SleepMusicPlayerScreen
  from "../screens/selfcare/sleep/SleepMusicPlayerScreen";


/*Navigators*/

const Tab =
  createBottomTabNavigator();

const HomeStack =
  createNativeStackNavigator();

const JournalStack =
  createNativeStackNavigator();


/*Home stack navigator*/

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* MAIN*/}

      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
      />

      <HomeStack.Screen
        name="DailyLog"
        component={DailyLogScreen}
      />

      <HomeStack.Screen
        name="SelfCare"
        component={SelfCareScreen}
      />


      {/* anger */}

      <HomeStack.Screen
        name="AngerActivities"
        component={AngerActivitiesScreen}
      />

      <HomeStack.Screen
        name="SelfCareActivityDetails"
        component={
          SelfCareActivityDetailsScreen
        }
      />


      {/* write it, release it */}

      <HomeStack.Screen
        name="WriteReleaseIntro"
        component={
          WriteReleaseIntroScreen
        }
      />

      <HomeStack.Screen
        name="WriteReleaseWriting"
        component={
          WriteReleaseWritingScreen
        }
      />

      <HomeStack.Screen
        name="WriteReleaseShred"
        component={
          WriteReleaseShredScreen
        }
      />

      <HomeStack.Screen
        name="WriteReleaseBreathing"
        component={
          WriteReleaseBreathingScreen
        }
      />

      <HomeStack.Screen
        name="ActivityFeedbackChat"
        component={
          ActivityFeedbackChatScreen
        }
      />


      {/* rain mindfulness */}

      <HomeStack.Screen
        name="RainMindfulnessIntro"
        component={
          RainMindfulnessIntroScreen
        }
      />

      <HomeStack.Screen
        name="RainRecognize"
        component={
          RainRecognizeScreen
        }
      />

      <HomeStack.Screen
        name="RainAllow"
        component={
          RainAllowScreen
        }
      />

      <HomeStack.Screen
        name="RainInvestigate"
        component={
          RainInvestigateScreen
        }
      />

      <HomeStack.Screen
        name="RainNurture"
        component={
          RainNurtureScreen
        }
      />

      <HomeStack.Screen
        name="RainBreathing"
        component={
          RainBreathingScreen
        }
      />

      <HomeStack.Screen
        name="RainComplete"
        component={
          RainCompleteScreen
        }
      />


      {/* box breathing */}

      <HomeStack.Screen
        name="BoxBreathingIntro"
        component={
          BoxBreathingIntroScreen
        }
      />

      <HomeStack.Screen
        name="BoxBreathingExercise"
        component={
          BoxBreathingExerciseScreen
        }
      />

      <HomeStack.Screen
        name="BoxBreathingComplete"
        component={
          BoxBreathingCompleteScreen
        }
      />


      {/* grounding */}

      <HomeStack.Screen
        name="GroundingIntro"
        component={
          GroundingIntroScreen
        }
      />

      <HomeStack.Screen
        name="GroundingChat"
        component={
          GroundingChatScreen
        }
      />

      <HomeStack.Screen
        name="GroundingComplete"
        component={
          GroundingCompleteScreen
        }
      />


      {/* low mood */}

      <HomeStack.Screen
        name="LowMoodActivities"
        component={
          LowMoodActivitiesScreen
        }
      />


      {/* small step */}

      <HomeStack.Screen
        name="SmallStepIntro"
        component={
          SmallStepIntroScreen
        }
      />

      <HomeStack.Screen
        name="SmallStepChoose"
        component={
          SmallStepChooseScreen
        }
      />

      <HomeStack.Screen
        name="SmallStepActivity"
        component={
          SmallStepActivityScreen
        }
      />

      <HomeStack.Screen
        name="SmallStepComplete"
        component={
          SmallStepCompleteScreen
        }
      />


      {/* move with me */}

      <HomeStack.Screen
        name="MoveWithMeIntro"
        component={
          MoveWithMeIntroScreen
        }
      />

      <HomeStack.Screen
        name="MoveWithMeChoose"
        component={
          MoveWithMeChooseScreen
        }
      />

      <HomeStack.Screen
        name="MoveWithMeExercise"
        component={
          MoveWithMeExerciseScreen
        }
      />

      <HomeStack.Screen
        name="MoveWithMeComplete"
        component={
          MoveWithMeCompleteScreen
        }
      />


      {/* kinder perspective */}

      <HomeStack.Screen
        name="KinderPerspectiveIntro"
        component={
          KinderPerspectiveIntroScreen
        }
      />

      <HomeStack.Screen
        name="KinderPerspectiveChat"
        component={
          KinderPerspectiveChatScreen
        }
      />

      <HomeStack.Screen
        name="KinderPerspectiveComplete"
        component={
          KinderPerspectiveCompleteScreen
        }
      />


      {/* worry & anxiety */}

      <HomeStack.Screen
        name="AnxietyActivities"
        component={
          AnxietyActivitiesScreen
        }
      />


      {/* =================================================
          CALM MY BODY
         ================================================= */}

      <HomeStack.Screen
        name="CalmMyBodyIntro"
        component={
          CalmMyBodyIntroScreen
        }
      />

      <HomeStack.Screen
        name="CalmMyBodyExercise"
        component={
          CalmMyBodyExerciseScreen
        }
      />

      <HomeStack.Screen
        name="CalmMyBodyComplete"
        component={
          CalmMyBodyCompleteScreen
        }
      />


      {/* =================================================
          SORT MY WORRY
         ================================================= */}

      <HomeStack.Screen
        name="SortMyWorryIntro"
        component={
          SortMyWorryIntroScreen
        }
      />

      <HomeStack.Screen
        name="SortMyWorryChat"
        component={
          SortMyWorryChatScreen
        }
      />

      <HomeStack.Screen
        name="SortMyWorryComplete"
        component={
          SortMyWorryCompleteScreen
        }
      />


      {/* =================================================
          SLOW THE WAVE
         ================================================= */}

      <HomeStack.Screen
        name="SlowTheWaveIntro"
        component={
          SlowTheWaveIntroScreen
        }
      />

      <HomeStack.Screen
        name="SlowTheWaveBreathing"
        component={
          SlowTheWaveBreathingScreen
        }
      />

      <HomeStack.Screen
        name="SlowTheWaveComplete"
        component={
          SlowTheWaveCompleteScreen
        }
      />


      {/* =================================================
          HAPPY ACTIVITIES
         ================================================= */}

      <HomeStack.Screen
        name="HappyActivities"
        component={
          HappyActivitiesScreen
        }
      />


      {/* =================================================
          HOLD THE MOMENT
         ================================================= */}

      <HomeStack.Screen
        name="HoldTheMomentIntro"
        component={
          HoldTheMomentIntroScreen
        }
      />

      <HomeStack.Screen
        name="HoldTheMomentChoose"
        component={
          HoldTheMomentChooseScreen
        }
      />

      <HomeStack.Screen
        name="HoldTheMomentSavor"
        component={
          HoldTheMomentSavorScreen
        }
      />

      <HomeStack.Screen
        name="HoldTheMomentComplete"
        component={
          HoldTheMomentCompleteScreen
        }
      />


      {/* =================================================
          PASS IT ON
         ================================================= */}

      <HomeStack.Screen
        name="PassItOnIntro"
        component={
          PassItOnIntroScreen
        }
      />

      <HomeStack.Screen
        name="PassItOnChoose"
        component={
          PassItOnChooseScreen
        }
      />

      <HomeStack.Screen
        name="PassItOnAction"
        component={
          PassItOnActionScreen
        }
      />

      <HomeStack.Screen
        name="PassItOnComplete"
        component={
          PassItOnCompleteScreen
        }
      />


      {/* =================================================
          HAPPY CAPSULE
         ================================================= */}

      <HomeStack.Screen
        name="HappyCapsuleIntro"
        component={
          HappyCapsuleIntroScreen
        }
      />

      <HomeStack.Screen
        name="HappyCapsuleCreate"
        component={
          HappyCapsuleCreateScreen
        }
      />

      <HomeStack.Screen
        name="HappyCapsuleSeal"
        component={
          HappyCapsuleSealScreen
        }
      />

      <HomeStack.Screen
        name="HappyCapsuleComplete"
        component={
          HappyCapsuleCompleteScreen
        }
      />


      {/* =================================================
          MINI GAMES
         ================================================= */}

      <HomeStack.Screen
        name="MiniGames"
        component={
          MiniGamesScreen
        }
      />


      {/* =================================================
          BUBBLE POP CALM
         ================================================= */}

      <HomeStack.Screen
        name="BubblePopIntro"
        component={
          BubblePopIntroScreen
        }
      />

      <HomeStack.Screen
        name="BubblePopGame"
        component={
          BubblePopGameScreen
        }
      />

      <HomeStack.Screen
        name="BubblePopComplete"
        component={
          BubblePopCompleteScreen
        }
      />


      {/* =================================================
          COLOR & UNWIND
         ================================================= */}

      <HomeStack.Screen
        name="ColorUnwindIntro"
        component={
          ColorUnwindIntroScreen
        }
      />

      <HomeStack.Screen
        name="ColorUnwindChoose"
        component={
          ColorUnwindChooseScreen
        }
      />

      <HomeStack.Screen
        name="ColorUnwindCanvas"
        component={
          ColorUnwindCanvasScreen
        }
      />

      <HomeStack.Screen
        name="ColorUnwindComplete"
        component={
          ColorUnwindCompleteScreen
        }
      />


      {/* =================================================
          ZEN GARDEN
         ================================================= */}

      <HomeStack.Screen
        name="ZenGardenIntro"
        component={
          ZenGardenIntroScreen
        }
      />

      <HomeStack.Screen
        name="ZenGardenGame"
        component={
          ZenGardenGameScreen
        }
      />

      <HomeStack.Screen
        name="ZenGardenComplete"
        component={
          ZenGardenCompleteScreen
        }
      />


      {/* =================================================
          CRISIS
         ================================================= */}

      <HomeStack.Screen
        name="CrisisSupport"
        component={
          CrisisSupportScreen
        }
      />

      <HomeStack.Screen
        name="CrisisContacts"
        component={
          CrisisContactsScreen
        }
      />


      {/* =================================================
          SETTINGS
         ================================================= */}

      <HomeStack.Screen
        name="Settings"
        component={
          SettingsScreen
        }
      />

      <HomeStack.Screen
        name="ProfileSettings"
        component={
          ProfileSettingsScreen
        }
      />

      <HomeStack.Screen
        name="NotificationsSettings"
        component={
          NotificationsSettingsScreen
        }
      />

      <HomeStack.Screen
        name="Feedback"
        component={
          FeedbackScreen
        }
      />

      <HomeStack.Screen
        name="DataPrivacy"
        component={
          DataPrivacyScreen
        }
      />


      {/* =================================================
          SLEEP
         ================================================= */}

      <HomeStack.Screen
        name="SleepActivities"
        component={
          SleepActivitiesScreen
        }
      />

      <HomeStack.Screen
        name="SleepMusicPlayer"
        component={
          SleepMusicPlayerScreen
        }
      />


      {/* =================================================
          FAVORITES / RECENT
         ================================================= */}

      <HomeStack.Screen
        name="Favorites"
        component={
          FavoritesScreen
        }
      />

      <HomeStack.Screen
        name="RecentActivities"
        component={
          RecentActivitiesScreen
        }
      />
    </HomeStack.Navigator>
  );
}


/*
 * =========================================================
 * JOURNAL STACK
 * =========================================================
 */

function JournalStackNavigator() {
  return (
    <JournalStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <JournalStack.Screen
        name="JournalMain"
        component={
          JournalScreen
        }
      />

      <JournalStack.Screen
        name="AddJournal"
        component={
          AddJournalScreen
        }
      />

      <JournalStack.Screen
        name="JournalDetail"
        component={
          JournalDetailScreen
        }
      />
    </JournalStack.Navigator>
  );
}


/*
 * =========================================================
 * TAB ICONS
 * =========================================================
 */

const tabIcons = {
  HomeTab: {
    normal: require(
      "../../assets/images/home.png"
    ),

    active: require(
      "../../assets/images/home_clrd.png"
    ),
  },

  Chatbot: {
    normal: require(
      "../../assets/images/chat.png"
    ),

    active: require(
      "../../assets/images/chat_clrd.png"
    ),
  },

  FaceScan: {
    normal: require(
      "../../assets/images/scan.png"
    ),

    active: require(
      "../../assets/images/scan_clrd.png"
    ),
  },

  Journal: {
    normal: require(
      "../../assets/images/journal.png"
    ),

    active: require(
      "../../assets/images/journal_clrd.png"
    ),
  },

  Insights: {
    normal: require(
      "../../assets/images/graph.png"
    ),

    active: require(
      "../../assets/images/graph_clrd.png"
    ),
  },
};


/*
 * =========================================================
 * TAB ICON
 * =========================================================
 */

const TabIcon = ({
  routeName,
  focused,
}) => {
  return (
    <Image
      source={
        focused
          ? tabIcons[
              routeName
            ].active
          : tabIcons[
              routeName
            ].normal
      }
      style={[
        styles.tabIcon,

        routeName ===
          "FaceScan" &&
          styles.scanIcon,
      ]}
      resizeMode="contain"
    />
  );
};


/*
 * =========================================================
 * TAB BACKGROUND
 * =========================================================
 */

const TabBarBackground =
  () => {
    return (
      <View
        style={
          styles.tabBarBackground
        }
      />
    );
  };


/*
 * =========================================================
 * HOME TAB VISIBILITY
 * =========================================================
 */

const getHomeTabBarStyle = (
  route
) => {
  const routeName =
    getFocusedRouteNameFromRoute(
      route
    ) ?? "HomeMain";


  /*
   * Every screen in this array
   * hides the bottom tab bar.
   */

  const hiddenScreens = [
    /*
     * =====================================================
     * MAIN SELF CARE
     * =====================================================
     */

    "DailyLog",

    "SelfCare",

    "AngerActivities",

    "LowMoodActivities",

    "AnxietyActivities",

    "HappyActivities",

    "MiniGames",

    "Favorites",

    "RecentActivities",

    "SelfCareActivityDetails",


    /*
     * =====================================================
     * WRITE IT, RELEASE IT
     * =====================================================
     */

    "WriteReleaseIntro",

    "WriteReleaseWriting",

    "WriteReleaseShred",

    "WriteReleaseBreathing",

    "ActivityFeedbackChat",


    /*
     * =====================================================
     * RAIN MINDFULNESS
     * =====================================================
     */

    "RainMindfulnessIntro",

    "RainRecognize",

    "RainAllow",

    "RainInvestigate",

    "RainNurture",

    "RainBreathing",

    "RainComplete",


    /*
     * =====================================================
     * BOX BREATHING
     * =====================================================
     */

    "BoxBreathingIntro",

    "BoxBreathingExercise",

    "BoxBreathingComplete",


    /*
     * =====================================================
     * GROUNDING
     * =====================================================
     */

    "GroundingIntro",

    "GroundingChat",

    "GroundingComplete",


    /*
     * =====================================================
     * ONE SMALL STEP
     * =====================================================
     */

    "SmallStepIntro",

    "SmallStepChoose",

    "SmallStepActivity",

    "SmallStepComplete",


    /*
     * =====================================================
     * MOVE WITH ME
     * =====================================================
     */

    "MoveWithMeIntro",

    "MoveWithMeChoose",

    "MoveWithMeExercise",

    "MoveWithMeComplete",


    /*
     * =====================================================
     * A KINDER PERSPECTIVE
     * =====================================================
     */

    "KinderPerspectiveIntro",

    "KinderPerspectiveChat",

    "KinderPerspectiveComplete",


    /*
     * =====================================================
     * CALM MY BODY
     * =====================================================
     */

    "CalmMyBodyIntro",

    "CalmMyBodyExercise",

    "CalmMyBodyComplete",


    /*
     * =====================================================
     * SORT MY WORRY
     * =====================================================
     */

    "SortMyWorryIntro",

    "SortMyWorryChat",

    "SortMyWorryComplete",


    /*
     * =====================================================
     * SLOW THE WAVE
     * =====================================================
     */

    "SlowTheWaveIntro",

    "SlowTheWaveBreathing",

    "SlowTheWaveComplete",


    /*
     * =====================================================
     * HOLD THE MOMENT
     * =====================================================
     */

    "HoldTheMomentIntro",

    "HoldTheMomentChoose",

    "HoldTheMomentSavor",

    "HoldTheMomentComplete",


    /*
     * =====================================================
     * PASS IT ON
     * =====================================================
     */

    "PassItOnIntro",

    "PassItOnChoose",

    "PassItOnAction",

    "PassItOnComplete",


    /*
     * =====================================================
     * HAPPY CAPSULE
     * =====================================================
     */

    "HappyCapsuleIntro",

    "HappyCapsuleCreate",

    "HappyCapsuleSeal",

    "HappyCapsuleComplete",


    /*
     * =====================================================
     * BUBBLE POP CALM
     * =====================================================
     */

    "BubblePopIntro",

    "BubblePopGame",

    "BubblePopComplete",


    /*
     * =====================================================
     * COLOR & UNWIND
     * =====================================================
     */

    "ColorUnwindIntro",

    "ColorUnwindChoose",

    "ColorUnwindCanvas",

    "ColorUnwindComplete",


    /*
     * =====================================================
     * ZEN GARDEN
     * =====================================================
     */

    "ZenGardenIntro",

    "ZenGardenGame",

    "ZenGardenComplete",


    /*
     * =====================================================
     * SLEEP
     * =====================================================
     */

    "SleepActivities",

    "SleepMusicPlayer",


    /*
     * =====================================================
     * CRISIS
     * =====================================================
     */

    "CrisisSupport",

    "CrisisContacts",


    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    "Settings",

    "ProfileSettings",

    "NotificationsSettings",

    "Feedback",

    "DataPrivacy",
  ];


  if (
    hiddenScreens.includes(
      routeName
    )
  ) {
    return {
      display: "none",
    };
  }


  return styles.tabBar;
};


/*
 * =========================================================
 * JOURNAL TAB VISIBILITY
 * =========================================================
 */

const getJournalTabBarStyle = (
  route
) => {
  const routeName =
    getFocusedRouteNameFromRoute(
      route
    ) ?? "JournalMain";


  const hiddenScreens = [
    "AddJournal",

    "JournalDetail",
  ];


  if (
    hiddenScreens.includes(
      routeName
    )
  ) {
    return {
      display: "none",
    };
  }


  return styles.tabBar;
};


/*
 * =========================================================
 * MAIN TAB NAVIGATOR
 * =========================================================
 */

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }) => ({
        headerShown:
          false,

        tabBarShowLabel:
          false,

        tabBarHideOnKeyboard:
          true,

        tabBarStyle:
          styles.tabBar,

        tabBarItemStyle:
          styles.tabBarItem,

        tabBarBackground:
          () => (
            <TabBarBackground />
          ),

        tabBarIcon: ({
          focused,
        }) => (
          <TabIcon
            routeName={
              route.name
            }
            focused={
              focused
            }
          />
        ),
      })}
    >
      {/* =================================================
          HOME
         ================================================= */}

      <Tab.Screen
        name="HomeTab"
        component={
          HomeStackNavigator
        }
        options={({
          route,
        }) => ({
          tabBarStyle:
            getHomeTabBarStyle(
              route
            ),
        })}
      />


      {/* =================================================
          CHATBOT
         ================================================= */}

      <Tab.Screen
        name="Chatbot"
        component={
          ChatbotScreen
        }
        options={{
          tabBarStyle: {
            display:
              "none",
          },
        }}
      />


      {/* =================================================
          FACE SCAN
         ================================================= */}

      <Tab.Screen
        name="FaceScan"
        component={
          FaceScanScreen
        }
      />


      {/* =================================================
          JOURNAL
         ================================================= */}

      <Tab.Screen
        name="Journal"
        component={
          JournalStackNavigator
        }
        options={({
          route,
        }) => ({
          tabBarStyle:
            getJournalTabBarStyle(
              route
            ),
        })}
      />


      {/* =================================================
          INSIGHTS
         ================================================= */}

      <Tab.Screen
        name="Insights"
        component={
          InsightsScreen
        }
        options={{
          tabBarStyle: {
            display:
              "none",
          },
        }}
      />
    </Tab.Navigator>
  );
}


/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =====================================================
     * TAB BAR
     * =====================================================
     */

    tabBar: {
      height: 96,

      paddingTop: 17,

      paddingBottom: 34,

      backgroundColor:
        "#FFFFFF",

      borderTopWidth: 0,

      elevation: 14,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,

        height: -3,
      },

      shadowOpacity: 0.09,

      shadowRadius: 7,
    },


    /*
     * =====================================================
     * TAB BAR BACKGROUND
     * =====================================================
     */

    tabBarBackground: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "#FFFFFF",
    },


    /*
     * =====================================================
     * TAB ITEMS
     * =====================================================
     */

    tabBarItem: {
      height: 68,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    /*
     * =====================================================
     * ICONS
     * =====================================================
     */

    tabIcon: {
      width: 34,

      height: 34,
    },

    scanIcon: {
      width: 39,

      height: 39,
    },
  });