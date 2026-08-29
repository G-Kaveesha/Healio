export const miniGames = [
  /*
   * =========================================================
   * 1. BUBBLE POP CALM
   * =========================================================
   */

  {
    id: "bubble-pop-calm",

    title: "Bubble Pop Calm",

    duration: "3–5 min",

    activityScreen:
      "BubblePopIntro",

    image: require(
      "../../../../assets/images/selfcare/miniGames/bubble_pop.jpg"
    ),

    infoDescription:
      "Bubble Pop Calm is a simple, low-pressure tapping game. Soft bubbles drift across the screen and you can pop whichever ones catch your attention. There is no score to beat, no time pressure, and no failure state.",

    introduction:
      "Slow down for a moment and pop whichever bubbles catch your eye.",

    steps: [
      "Watch the bubbles drift gently across the screen.",
      "Tap any bubble that catches your attention.",
      "Enjoy the soft visual and sound feedback.",
      "Continue for as long as it feels comfortable.",
      "Finish whenever you are ready.",
    ],

    closingMessage:
      "You gave your attention a simple place to rest. You can stop here whenever it feels right.",

    gameType:
      "sensory",

    soundEnabled:
      true,

    audio: {
      pop:
        "bubble_pop_soft.mp3",

      ambient:
        "bubble_ambient.mp3",
    },
  },


  /*
   * =========================================================
   * 2. COLOR & UNWIND
   * =========================================================
   */

  {
    id: "color-unwind",

    title: "Color & Unwind",

    duration: "5–10 min",

    activityScreen:
      "ColorUnwindIntro",

    image: require(
      "../../../../assets/images/selfcare/miniGames/color_unwind.jpg"
    ),

    infoDescription:
      "Color & Unwind is a gentle digital coloring activity. Choose a simple picture, select colors you like, and fill the picture at your own pace. You do not need to finish the drawing or make it look a particular way.",

    introduction:
      "Choose a picture and add colors in whatever way feels enjoyable to you.",

    steps: [
      "Choose a simple picture to color.",
      "Pick a color from the palette.",
      "Tap areas of the picture to fill them.",
      "Change colors whenever you like.",
      "Use Undo or Clear if you want to start again.",
      "Finish whenever you feel ready.",
    ],

    closingMessage:
      "There is no right way to color. The time you spent creating something was enough.",

    gameType:
      "creative",

    soundEnabled:
      true,

    audio: {
      tap:
        "color_soft_tap.mp3",
    },
  },


  /*
   * =========================================================
   * 3. ZEN GARDEN
   * =========================================================
   */

  {
    id: "zen-garden",

    title: "Zen Garden",

    duration: "5 min",

    activityScreen:
      "ZenGardenIntro",

    image: require(
      "../../../../assets/images/selfcare/miniGames/zen_garden.jpg"
    ),

    infoDescription:
      "Zen Garden is a quiet free-play activity where you can move your finger through a virtual sand space and create simple patterns. You can also place a few stones, leaves, or flowers. There is no objective, score, timer, or correct result.",

    introduction:
      "Move slowly through the sand and create whatever pattern feels natural.",

    steps: [
      "Drag your finger across the sand to create gentle lines.",
      "Add a stone, leaf, or flower if you want.",
      "Create patterns without trying to make them perfect.",
      "Clear the garden whenever you want a fresh space.",
      "Finish when you feel ready.",
    ],

    closingMessage:
      "Your garden does not need to be perfect or complete. This space was simply yours for a little while.",

    gameType:
      "free-play",

    soundEnabled:
      true,

    audio: {
      sand:
        "zen_sand.mp3",

      ambient:
        "zen_ambient.mp3",
    },
  },
];