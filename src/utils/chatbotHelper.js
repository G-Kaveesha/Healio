// Simple demo NLP helper for Healio chatbot.
// Later, this can be replaced with a real AI API or your trained NLP model.

// Demo activity suggestions by emotion.
const activitySuggestions = {
  stressed: "Try a 4-minute calm breathing activity.",
  sad: "Try writing one kind sentence to yourself.",
  angry: "Try a short cool-down breathing pause.",
  anxious: "Try the 5-4-3-2-1 grounding exercise.",
  tired: "Try a gentle rest reminder and drink some water.",
  happy: "Save this good moment in your journal.",
  neutral: "Write one small goal for today.",
};

// Simple keyword-based emotion detection.
// This is not medical diagnosis. It only helps the app choose a supportive reply.
export const analyzeMessageEmotion = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("stress") ||
    text.includes("overwhelmed") ||
    text.includes("too much") ||
    text.includes("pressure")
  ) {
    return "stressed";
  }

  if (
    text.includes("sad") ||
    text.includes("low") ||
    text.includes("lonely") ||
    text.includes("empty")
  ) {
    return "sad";
  }

  if (
    text.includes("angry") ||
    text.includes("mad") ||
    text.includes("frustrated") ||
    text.includes("irritated")
  ) {
    return "angry";
  }

  if (
    text.includes("anxious") ||
    text.includes("worried") ||
    text.includes("scared") ||
    text.includes("afraid") ||
    text.includes("fear")
  ) {
    return "anxious";
  }

  if (
    text.includes("tired") ||
    text.includes("exhausted") ||
    text.includes("sleepy") ||
    text.includes("drained")
  ) {
    return "tired";
  }

  if (
    text.includes("happy") ||
    text.includes("good") ||
    text.includes("great") ||
    text.includes("calm") ||
    text.includes("better")
  ) {
    return "happy";
  }

  return "neutral";
};

// Demo chatbot reply generator.
// Later, replace this with an API response.
export const generateDemoBotReply = (userMessage) => {
  const detectedEmotion = analyzeMessageEmotion(userMessage);
  const suggestedActivity = activitySuggestions[detectedEmotion];

  const lowerMessage = userMessage.toLowerCase();

  // Friendly greetings
  if (
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hey")
  ) {
    return {
      text: "Hi, I’m here with you. How are you feeling right now?",
      detectedEmotion: "neutral",
      suggestedActivity: null,
    };
  }

  // Activity request
  if (
    lowerMessage.includes("activity") ||
    lowerMessage.includes("help me") ||
    lowerMessage.includes("what can i do")
  ) {
    return {
      text: `A gentle place to start is this: ${suggestedActivity}`,
      detectedEmotion,
      suggestedActivity,
    };
  }

  // Broad safety support message
  if (
    lowerMessage.includes("unsafe") ||
    lowerMessage.includes("emergency") ||
    lowerMessage.includes("danger")
  ) {
    return {
      text:
        "I’m really glad you told me. Please reach out to a trusted adult, trusted person, or local emergency support right now. You do not have to handle this alone.",
      detectedEmotion: "stressed",
      suggestedActivity: "Contact a trusted person or local emergency support.",
    };
  }

  // Main emotion-based replies
  if (detectedEmotion === "stressed") {
    return {
      text:
        "You seem a little stressed today. Let’s slow things down. Would you like to try a short breathing activity?",
      detectedEmotion,
      suggestedActivity,
    };
  }

  if (detectedEmotion === "sad") {
    return {
      text:
        "Feeling low can be heavy. Let’s take one gentle step. You could write one kind sentence to yourself.",
      detectedEmotion,
      suggestedActivity,
    };
  }

  if (detectedEmotion === "angry") {
    return {
      text:
        "It sounds like something may have frustrated you. Let’s pause and let your body cool down first.",
      detectedEmotion,
      suggestedActivity,
    };
  }

  if (detectedEmotion === "anxious") {
    return {
      text:
        "It sounds like your mind is holding a lot. Try noticing five things you can see around you.",
      detectedEmotion,
      suggestedActivity,
    };
  }

  if (detectedEmotion === "tired") {
    return {
      text:
        "You sound tired. A small rest, water, or a gentle stretch might help you reset.",
      detectedEmotion,
      suggestedActivity,
    };
  }

  if (detectedEmotion === "happy") {
    return {
      text:
        "That sounds lovely. Let’s save this good moment so you can remember it later.",
      detectedEmotion,
      suggestedActivity,
    };
  }

  return {
    text:
      "Thank you for sharing that with me. What part of your day has affected your mood the most?",
    detectedEmotion,
    suggestedActivity,
  };
};