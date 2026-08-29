export const angerActivities = [
  {
    id: "write-release",
    title: "Write It, Release It",
    duration: "10 min",

    // This activity uses its own interactive screen flow.
    activityScreen: "WriteReleaseIntro",

    image: require("../../../assets/images/selfcare/anger/write_release.jpg"),

    infoDescription:
      "Write It, Release It is a gentle, non-clinical journaling activity that gives you a private space to express anger, frustration, or difficult thoughts. Writing may help organize racing thoughts, release emotional pressure, and create a pause before reacting.",

    introduction:
      "This activity gives you a calm space to express difficult thoughts without judging yourself.",

    steps: [],

    closingMessage:
      "Take one slow breath. Your feelings are valid, and you have given yourself space to express them.",
  },

  {
    id: "rain-mindfulness",
    title: "RAIN Mindfulness",
    duration: "8 min",
    
    activityScreen: "RainMindfulnessIntro",

    image: require("../../../assets/images/selfcare/anger/rain_mindfulness.jpg"),

    infoDescription:
      "RAIN Mindfulness helps you recognize an emotion, allow it to exist, investigate it gently, and respond to yourself with care.",

    introduction:
      "RAIN is a mindfulness activity that helps you pause and understand your emotion without reacting immediately.",

    steps: [
      "Recognize: Notice and name what you are feeling.",
      "Allow: Let the emotion be present without fighting it.",
      "Investigate: Notice where you feel the emotion in your body.",
      "Nurture: Say something gentle and supportive to yourself.",
      "Take a few slow breaths before continuing your day.",
    ],

    closingMessage:
      "You do not need to solve everything immediately. Noticing the emotion is already a helpful step.",
  },

  {
    id: "box-breathing",
    title: "Box Breathing",
    duration: "2 min",
    activityScreen: "BoxBreathingIntro",

    image: require("../../../assets/images/selfcare/anger/box_breathing.jpg"),

    infoDescription:
      "Box Breathing uses equal breathing intervals to create a pause when anger or frustration feels intense.",

    introduction:
      "Complete this breathing activity slowly and stop if you feel physically uncomfortable.",

    steps: [
      "Sit comfortably and relax your shoulders.",
      "Breathe in slowly for four seconds.",
      "Hold your breath gently for four seconds.",
      "Breathe out slowly for four seconds.",
      "Pause for four seconds.",
      "Repeat the cycle at a comfortable pace.",
    ],

    closingMessage:
      "Notice whether your breathing or body feels slightly more relaxed than before.",
  },

  {
    id: "grounding",
    title: "Grounding",
    duration: "5 min",
    activityScreen: "GroundingIntro",

    image: require("../../../assets/images/selfcare/anger/grounding.jpg"),

    infoDescription:
      "Grounding brings your attention back to your surroundings when thoughts or emotions feel intense.",

    introduction:
      "The 5-4-3-2-1 grounding activity redirects your attention to the present moment.",

    steps: [
      "Name five things you can see.",
      "Name four things you can physically feel.",
      "Name three things you can hear.",
      "Name two things you can smell.",
      "Name one thing you can taste.",
      "Finish by taking one slow and comfortable breath.",
    ],

    closingMessage:
      "You are here in the present moment. Continue slowly and give yourself time.",
  },
];