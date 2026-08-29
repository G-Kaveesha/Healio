export const anxietyActivities = [
  {
    id: "calm-my-body",

    title: "Calm My Body",

    duration: "5 min",

    /*
     * Progressive muscle relaxation
     * activity.
     *
     * We will create this screen flow
     * next.
     */
    activityScreen: "CalmMyBodyIntro",

    image: require(
      "../../../../assets/images/selfcare/anxiety/calm_my_body.jpg"
    ),

    infoDescription:
      "Calm My Body is a gentle relaxation activity that helps you notice and release physical tension. You will briefly tense and relax different muscle areas at a comfortable level, helping your body slow down when you feel worried, restless, or tense.",

    introduction:
      "Take a few minutes to notice where your body feels tense and gently let some of that tension go.",

    steps: [
      "Get comfortable and notice how your body feels.",
      "Gently tense one muscle area without straining.",
      "Hold for a few seconds.",
      "Release the tension slowly.",
      "Notice the difference between tension and relaxation.",
      "Continue through a few areas of the body.",
    ],

    closingMessage:
      "You gave your body a chance to soften. You do not need to feel completely relaxed for this pause to be worthwhile.",
  },

  {
    id: "sort-my-worry",

    title: "Sort My Worry",

    duration: "5 min",
    activityScreen: "SortMyWorryIntro",

    image: require(
      "../../../../assets/images/selfcare/anxiety/sort_my_worry.jpg"
    ),

    infoDescription:
      "Sort My Worry gives you a simple space to look at what is worrying you and decide whether there is a small action you can take now or whether the worry can be gently set aside for later.",

    introduction:
      "You do not need to solve every worry at once. Start by looking at just one thing that is on your mind.",

    steps: [
      "Write down one worry that is taking up your attention.",
      "Decide whether you can do something practical about it now.",
      "If you can, choose one small next step.",
      "If you cannot act on it now, place it aside for later.",
      "Finish with a short calming pause.",
    ],

    closingMessage:
      "You gave your worry some structure. You can return to what matters now without needing to solve everything immediately.",
  },

  {
    id: "slow-the-wave",

    title: "Slow the Wave",

    duration: "5 min",
    activityScreen: "SlowTheWaveIntro",

    image: require(
      "../../../../assets/images/selfcare/anxiety/slow_the_wave.jpg"
    ),

    infoDescription:
      "Slow the Wave is a gentle paced-breathing activity designed to help you slow down when worry or anxiety feels physically intense. It uses a comfortable inhale and a slightly longer exhale without asking you to hold your breath.",

    introduction:
      "Follow the breathing rhythm at a comfortable pace. There is no need to take unusually deep breaths.",

    steps: [
      "Settle into a comfortable position.",
      "Breathe in gently for four seconds.",
      "Breathe out slowly for six seconds.",
      "Continue at a comfortable pace.",
      "Let the final breath return to normal.",
    ],

    closingMessage:
      "Take a moment before moving on. Even a small pause can help create some space around anxious feelings.",
  },
];