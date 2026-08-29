export const nlpEmotionDisplay = {
  Sadness: {
    emoji: "😢",
    color: "#86B6E8",
  },

  Happiness: {
    emoji: "😊",
    color: "#88BF98",
  },

  Love: {
    emoji: "❤️",
    color: "#F2A8B8",
  },

  Anger: {
    emoji: "😠",
    color: "#F48B82",
  },

  Worry: {
    emoji: "😟",
    color: "#9CD7D9",
  },

  Surprise: {
    emoji: "😲",
    color: "#E9C979",
  },

  Uncertain: {
    emoji: "🙂",
    color: "#AEB8C4",
  },
};


export const getNlpEmotionDisplay =
  (emotion) => {
    return (
      nlpEmotionDisplay[
        emotion
      ] ||
      nlpEmotionDisplay.Uncertain
    );
  };