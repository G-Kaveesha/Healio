// ---------------------------------------------------------
// Healio FastAPI backend
// ---------------------------------------------------------

const API_BASE_URL =
  "http://192.168.8.146:8000";

const CHAT_ENDPOINT =
  `${API_BASE_URL}/chat`;

const REQUEST_TIMEOUT =
  30000;

const MAX_CONTEXT_MESSAGES =
  6;


// ---------------------------------------------------------
// Normalize conversation history
// ---------------------------------------------------------

function prepareConversationHistory(
  conversationHistory
) {
  if (
    !Array.isArray(
      conversationHistory
    )
  ) {
    return [];
  }


  return conversationHistory
    .filter((item) => {
      return (
        item &&
        (
          item.role === "user" ||
          item.role === "assistant"
        ) &&
        typeof item.text ===
          "string" &&
        item.text.trim()
      );
    })

    .slice(
      -MAX_CONTEXT_MESSAGES
    )

    .map((item) => ({
      role:
        item.role,

      text:
        item.text.trim(),
    }));
}


// ---------------------------------------------------------
// Normalize one Healio activity recommendation
// ---------------------------------------------------------

function normalizeActivity(
  activity
) {
  if (
    !activity ||
    typeof activity !==
      "object"
  ) {
    return null;
  }


  const id =
    typeof activity.id ===
      "string"
      ? activity.id.trim()
      : "";

  const title =
    typeof activity.title ===
      "string"
      ? activity.title.trim()
      : "";

  const activityScreen =
    typeof activity.activityScreen ===
      "string"
      ? activity.activityScreen.trim()
      : "";


  if (
    !id ||
    !title ||
    !activityScreen
  ) {
    return null;
  }


  return {
    id,

    title,

    category:
      typeof activity.category ===
        "string" &&
      activity.category.trim()
        ? activity.category.trim()
        : null,

    type:
      typeof activity.type ===
        "string" &&
      activity.type.trim()
        ? activity.type.trim()
        : "activity",

    duration:
      typeof activity.duration ===
        "string" &&
      activity.duration.trim()
        ? activity.duration.trim()
        : null,

    activityScreen,

    subtitle:
      typeof activity.subtitle ===
        "string" &&
      activity.subtitle.trim()
        ? activity.subtitle.trim()
        : null,
  };
}


// ---------------------------------------------------------
// Normalize multiple recommendation cards
//
// Used mainly for Sleep music options.
// ---------------------------------------------------------

function normalizeActivityList(
  activities
) {
  if (
    !Array.isArray(
      activities
    )
  ) {
    return [];
  }


  return activities
    .map((activity) =>
      normalizeActivity(
        activity
      )
    )
    .filter(Boolean);
}


// ---------------------------------------------------------
// Send message to Healio backend
// ---------------------------------------------------------

export async function sendChatMessage(
  message,
  conversationHistory = []
) {
  const cleanMessage =
    typeof message ===
      "string"
      ? message.trim()
      : "";


  if (!cleanMessage) {
    throw new Error(
      "Message cannot be empty."
    );
  }


  const cleanHistory =
    prepareConversationHistory(
      conversationHistory
    );


  const controller =
    new AbortController();


  const timeoutId =
    setTimeout(
      () => {
        controller.abort();
      },
      REQUEST_TIMEOUT
    );


  try {

    const response =
      await fetch(
        CHAT_ENDPOINT,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify({
              message:
                cleanMessage,

              history:
                cleanHistory,
            }),

          signal:
            controller.signal,
        }
      );


    // -----------------------------------------------------
    // Parse backend response safely
    // -----------------------------------------------------

    let data = null;


    try {

      data =
        await response.json();

    } catch {

      data = null;
    }


    // -----------------------------------------------------
    // Backend returned an error status
    // -----------------------------------------------------

    if (!response.ok) {

      const backendMessage =
        typeof data?.detail ===
          "string" &&
        data.detail.trim()
          ? data.detail.trim()
          : "Healio could not process your message.";


      throw new Error(
        backendMessage
      );
    }


    // -----------------------------------------------------
    // Validate required reply
    // -----------------------------------------------------

    if (
      !data ||
      typeof data.reply !==
        "string" ||
      !data.reply.trim()
    ) {

      throw new Error(
        "Healio received an invalid response from the server."
      );
    }


    // -----------------------------------------------------
    // Normalize one standard activity recommendation
    // -----------------------------------------------------

    const recommendedActivity =
      normalizeActivity(
        data.recommendedActivity
      );


    // -----------------------------------------------------
    // Normalize multiple recommendation options
    //
    // Currently mainly used for Sleep music cards.
    // -----------------------------------------------------

    const recommendedActivities =
      normalizeActivityList(
        data.recommendedActivities
      );


    // -----------------------------------------------------
    // Final normalized result returned to ChatbotScreen
    // -----------------------------------------------------

    return {
      reply:
        data.reply.trim(),

      emotion:
        typeof data.emotion ===
          "string" &&
        data.emotion.trim()
          ? data.emotion.trim()
          : null,

      confidence:
        typeof data.confidence ===
          "number" &&
        Number.isFinite(
          data.confidence
        )
          ? data.confidence
          : null,

      status:
        typeof data.status ===
          "string" &&
        data.status.trim()
          ? data.status.trim()
          : "unknown",

      safetyTriggered:
        data.safetyTriggered ===
        true,

      safetyLevel:
        typeof data.safetyLevel ===
          "string" &&
        data.safetyLevel.trim()
          ? data.safetyLevel.trim()
          : "none",

      recommendedActivity,

      recommendedActivities,
    };


  } catch (error) {

    // -----------------------------------------------------
    // Request timeout
    // -----------------------------------------------------

    if (
      error?.name ===
      "AbortError"
    ) {

      throw new Error(
        "Healio took too long to respond. Please try again."
      );
    }


    // -----------------------------------------------------
    // Network / connection failure
    // -----------------------------------------------------

    if (
      error instanceof
      TypeError
    ) {

      throw new Error(
        "Could not connect to the Healio server. Please make sure the backend is running and your phone and computer are connected to the same Wi-Fi network."
      );
    }


    // -----------------------------------------------------
    // Preserve backend or validation error
    // -----------------------------------------------------

    throw error;


  } finally {

    clearTimeout(
      timeoutId
    );
  }
}


// Exports 

export {
  API_BASE_URL,
};