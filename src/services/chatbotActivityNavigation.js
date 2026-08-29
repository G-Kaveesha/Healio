// ---------------------------------------------------------
// Healio Chatbot → Self-Care navigation state
//
// This module keeps short-lived in-memory information about
// whether a self-care activity was opened from the Chatbot.
//
// It is NOT Firestore data.
// It is NOT permanent user history.
//
// Its main purpose is:
//
// Chatbot → Activity → Complete → return to same Chatbot
//
// while still preserving:
//
// Self Care → Activity → Complete → normal category screen
// ---------------------------------------------------------


// ---------------------------------------------------------
// Current chatbot-started activity
// ---------------------------------------------------------

let activeChatbotActivity = null;


// ---------------------------------------------------------
// Whether Chatbot should keep its current visible
// conversation the next time the Chatbot screen receives
// focus.
//
// Normally Chatbot starts a fresh visible session on focus.
// When returning from a chatbot-started activity, however,
// we temporarily set this to true.
// ---------------------------------------------------------

let resumeChatbotOnNextFocus = false;


// ---------------------------------------------------------
// Mark activity as started from Chatbot
//
// Call this BEFORE navigating from Chatbot to an activity.
// ---------------------------------------------------------

export function markChatbotActivityStarted({
  activityId,
  activityTitle = null,
  activityType = "activity",
}) {
  if (!activityId) {
    console.warn(
      "markChatbotActivityStarted: activityId is required."
    );

    return;
  }


  activeChatbotActivity = {
    activityId,

    activityTitle,

    activityType,

    startedFrom:
      "chatbot",

    startedAt:
      Date.now(),
  };


  // A new activity has just started.
  // Do not resume Chatbot yet.
  resumeChatbotOnNextFocus =
    false;
}


// ---------------------------------------------------------
// Get current chatbot-started activity
// ---------------------------------------------------------

export function getActiveChatbotActivity() {
  return activeChatbotActivity;
}


// ---------------------------------------------------------
// Check whether a specific activity was opened
// from the Chatbot
// ---------------------------------------------------------

export function wasStartedFromChatbot(
  activityId
) {
  if (
    !activityId ||
    !activeChatbotActivity
  ) {
    return false;
  }


  return (
    activeChatbotActivity
      .activityId ===
    activityId
  );
}


// ---------------------------------------------------------
// Find the bottom-tab navigator
//
// Activity screens live inside HomeStack.
//
// Structure:
//
// Bottom Tabs
// ├── HomeTab
// │   └── HomeStack
// │       └── Self-care screens
// │
// └── Chatbot
//
// Therefore, when finishing an activity, we usually need to
// navigate through the parent tab navigator.
// ---------------------------------------------------------

function getTabNavigator(
  navigation
) {
  if (!navigation) {
    return null;
  }


  let currentNavigation =
    navigation;


  // Walk upward through navigator parents.
  while (
    currentNavigation
  ) {
    const state =
      currentNavigation.getState?.();


    if (
      state?.routeNames?.includes(
        "Chatbot"
      )
    ) {
      return currentNavigation;
    }


    currentNavigation =
      currentNavigation
        .getParent?.();
  }


  return null;
}


// ---------------------------------------------------------
// Return to Chatbot
// ---------------------------------------------------------

function navigateBackToChatbot(
  navigation
) {
  const tabNavigation =
    getTabNavigator(
      navigation
    );


  if (
    tabNavigation &&
    typeof tabNavigation.navigate ===
      "function"
  ) {
    tabNavigation.navigate(
      "Chatbot"
    );

    return true;
  }


  // Fallback in case navigator structure changes.
  try {
    navigation.navigate(
      "Chatbot"
    );

    return true;

  } catch (error) {
    console.error(
      "Could not return to Chatbot:",
      error
    );

    return false;
  }
}


// ---------------------------------------------------------
// Finish chatbot-started self-care activity
//
// Usage from completion screen:
//
// finishChatbotStartedActivity({
//   navigation,
//   activityId: "slow-the-wave",
//   fallbackRoute: "AnxietyActivities",
// });
//
// If activity came from Chatbot:
// → return to Chatbot
//
// Otherwise:
// → navigate to normal category screen
// ---------------------------------------------------------

export function finishChatbotStartedActivity({
  navigation,
  activityId,
  fallbackRoute,
}) {
  if (!navigation) {
    console.warn(
      "finishChatbotStartedActivity: navigation is required."
    );

    return false;
  }


  const startedFromChatbot =
    wasStartedFromChatbot(
      activityId
    );


  // -------------------------------------------------------
  // Normal Self Care flow
  // -------------------------------------------------------

  if (!startedFromChatbot) {

    if (fallbackRoute) {
      navigation.navigate(
        fallbackRoute
      );

    } else {
      navigation.goBack();
    }


    return false;
  }


  // -------------------------------------------------------
  // Chatbot-started flow
  // -------------------------------------------------------

  activeChatbotActivity =
    null;


  // Tell Chatbot not to erase the current visible
  // conversation when it receives focus again.
  resumeChatbotOnNextFocus =
    true;


  return navigateBackToChatbot(
    navigation
  );
}


// ---------------------------------------------------------
// Finish sleep/music started from Chatbot
//
// Sleep music does not have a normal "complete" screen.
// This helper can therefore be used from the player's
// Back / Finish action.
//
// Chatbot → Sleep Music → Back
//     → Chatbot
//
// Self Care → Sleep Music → Back
//     → normal previous screen
// ---------------------------------------------------------

export function finishChatbotStartedSleep({
  navigation,
  activityId,
}) {
  if (!navigation) {
    console.warn(
      "finishChatbotStartedSleep: navigation is required."
    );

    return false;
  }


  const startedFromChatbot =
    wasStartedFromChatbot(
      activityId
    );


  // -------------------------------------------------------
  // Normal Sleep section flow
  // -------------------------------------------------------

  if (!startedFromChatbot) {

    navigation.goBack();

    return false;
  }


  // -------------------------------------------------------
  // Chatbot-started sleep flow
  // -------------------------------------------------------

  activeChatbotActivity =
    null;

  resumeChatbotOnNextFocus =
    true;


  return navigateBackToChatbot(
    navigation
  );
}


// ---------------------------------------------------------
// Repeat current activity
//
// Important:
//
// If an activity came from Chatbot and the user chooses
// "Try Again", "Breathe Again", etc., we should KEEP the
// chatbot source information.
//
// Therefore completion screens should NOT clear the context
// when repeating an activity.
//
// This function is optional but useful for checking whether
// the source should be preserved.
// ---------------------------------------------------------

export function shouldPreserveChatbotActivity(
  activityId
) {
  return wasStartedFromChatbot(
    activityId
  );
}


// ---------------------------------------------------------
// Chatbot focus handling
//
// ChatbotScreen calls this inside useFocusEffect().
//
// TRUE:
// User has returned from a chatbot-started activity.
// Keep existing messages/session.
//
// FALSE:
// Normal opening of Chatbot.
// Existing Chatbot behavior may start a fresh visible chat.
// ---------------------------------------------------------

export function consumeChatbotResumeRequest() {
  const shouldResume =
    resumeChatbotOnNextFocus;


  // Consume only once.
  resumeChatbotOnNextFocus =
    false;


  return shouldResume;
}


// ---------------------------------------------------------
// Check without consuming
//
// Useful for debugging or future navigation changes.
// ---------------------------------------------------------

export function shouldResumeChatbot() {
  return resumeChatbotOnNextFocus;
}


// ---------------------------------------------------------
// Cancel only the active activity context
//
// Use when the user abandons an activity and should no
// longer be considered inside a chatbot-started flow.
// ---------------------------------------------------------

export function clearActiveChatbotActivity() {
  activeChatbotActivity =
    null;
}


// ---------------------------------------------------------
// Clear all chatbot/self-care navigation state
//
// Useful when:
// - user explicitly starts a new chat
// - user logs out
// - activity flow is abandoned
// - navigation state should be reset
// ---------------------------------------------------------

export function clearChatbotActivityContext() {
  activeChatbotActivity =
    null;

  resumeChatbotOnNextFocus =
    false;
}