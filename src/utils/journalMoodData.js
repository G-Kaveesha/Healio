export const journalMoods = [
  {
    key: "happy",
    name: "Happy",
    icon: require("../../assets/images//mood/mood_happy.png"),
    color: "#88BF98",
  },
  {
    key: "angry",
    name: "Angry",
    icon: require("../../assets/images/mood/mood_angry.png"),
    color: "#F48B82",
  },
  {
    key: "sad",
    name: "Sad",
    icon: require("../../assets/images/mood/mood_sad.png"),
    color: "#86B6E8",
  },
  {
    key: "neutral",
    name: "Neutral",
    icon: require("../../assets/images/mood/mood_neutral.png"),
    color: "#AEB8C4",
  },
  {
    key: "fear",
    name: "Fear",
    icon: require("../../assets/images/mood/mood_fear.png"),
    color: "#A9BCEB",
  },
  {
    key: "anxious",
    name: "Anxious",
    icon: require("../../assets/images/mood/mood_anxious.png"),
    color: "#9CD7D9",
  },
  {
    key: "stressed",
    name: "Stressed",
    icon: require("../../assets/images/mood/mood_stressed.png"),
    color: "#B9A4E8",
  },
];

export const getJournalMood = (moodKey) => {
  return journalMoods.find((mood) => mood.key === moodKey) || journalMoods[0];
};