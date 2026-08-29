export const scanMoodData = {


  angry: {
    key:
      "angry",

    displayName:
      "Angry",

    icon:
      require(
        "../../assets/images/mood/mood_angry.png"
      ),

    color:
      "#F48B82",

    softColor:
      "#FFF0ED",

    caption:
      "Feeling frustrated? A short calming activity may help create some space.",
  },


  fear: {
    key:
      "fear",

    displayName:
      "Fear",

    icon:
      require(
        "../../assets/images/mood/mood_fear.png"
      ),

    color:
      "#A9BCEB",

    softColor:
      "#F1F4FF",

    caption:
      "Feeling unsettled? A gentle grounding or calming activity may help.",
  },


  happy: {
    key:
      "happy",

    displayName:
      "Happy",

    icon:
      require(
        "../../assets/images/mood/mood_happy.png"
      ),

    color:
      "#9ED58B",

    softColor:
      "#F2FBEF",

    caption:
      "You seem to be having a positive moment. You might enjoy giving it a little more attention.",
  },



  sad: {
    key:
      "sad",

    displayName:
      "Sad",

    icon:
      require(
        "../../assets/images/mood/mood_sad.png"
      ),

    color:
      "#86B6E8",

    softColor:
      "#EEF6FF",

    caption:
      "Feeling low? A small and gentle activity may feel easier than doing too much at once.",
  },


  neutral: {
    key:
      "neutral",

    displayName:
      "Neutral",

    icon:
      require(
        "../../assets/images/mood/mood_neutral.png"
      ),

    color:
      "#AEB8C4",

    softColor:
      "#F4F6F8",

    caption:
      "A steady moment can be a good time for a little reflection or something relaxing.",
  },
};



export const getScanMoodData =
  (
    emotionKey
  ) => {

    if (
      typeof emotionKey !==
      "string"
    ) {
      return (
        scanMoodData
          .neutral
      );
    }


    const normalizedKey =
      emotionKey
        .trim()
        .toLowerCase();


    return (
      scanMoodData[
        normalizedKey
      ] ||
      scanMoodData
        .neutral
    );
  };