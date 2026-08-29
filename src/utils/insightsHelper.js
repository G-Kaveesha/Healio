const NLP_CONFIDENCE_THRESHOLD = 0.60;


/*
 * =========================================================
 * MOOD METADATA
 * =========================================================
 */

export const moodMeta = {
  sad: {
    name: "Sad",
    score: 2,
    color: "#A8C3E5",
    icon: require("../../assets/images/mood/mood_sad.png"),
  },

  fear: {
    name: "Fear",
    score: 3,
    color: "#B5DBDD",
    icon: require("../../assets/images/mood/mood_fear.png"),
  },

  disgust: {
    name: "Disgust",
    score: 3.5,
    color: "#FADB99",
    icon: require("../../assets/images/mood/mood_disgust.png"),
  },

  angry: {
    name: "Angry",
    score: 4,
    color: "#FD9987",
    icon: require("../../assets/images/mood/mood_angry.png"),
  },

  anxious: {
    name: "Anxious",
    score: 4.5,
    color: "#C9E3DF",
    icon: require("../../assets/images/mood/mood_anxious.png"),
  },

  stressed: {
    name: "Stressed",
    score: 5,
    color: "#AEB0D8",
    icon: require("../../assets/images/mood/mood_stressed.png"),
  },

  surprised: {
    name: "Surprised",
    score: 6,
    color: "#FCDF7B",
    icon: require("../../assets/images/mood/mood_surprised.png"),
  },

  neutral: {
    name: "Neutral",
    score: 6.5,
    color: "#D7E3C1",
    icon: require("../../assets/images/mood/mood_neutral.png"),
  },

  calm: {
    name: "Calm",
    score: 8,
    color: "#ABD8B2",
    icon: require("../../assets/images/mood/mood_calm.png"),
  },

  happy: {
    name: "Happy",
    score: 10,
    color: "#FBD3DC",
    icon: require("../../assets/images/mood/mood_happy.png"),
  },
};


export const getMoodMeta = (moodKey) =>
  moodMeta[moodKey] || moodMeta.neutral;


/*
 * =========================================================
 * EMOTION NORMALIZATION
 * =========================================================
 */

export const normalizeNlpEmotion = (emotion) => {
  if (typeof emotion !== "string") {
    return null;
  }

  const key = emotion.trim().toLowerCase();

  const map = {
    sadness: "sad",
    sad: "sad",

    happiness: "happy",
    happy: "happy",

    love: "happy",

    anger: "angry",
    angry: "angry",

    worry: "anxious",
    anxiety: "anxious",
    anxious: "anxious",

    surprise: "surprised",
    surprised: "surprised",
  };

  return map[key] || null;
};


export const normalizeCnnEmotion = (emotion) => {
  if (typeof emotion !== "string") {
    return null;
  }

  const key = emotion.trim().toLowerCase();

  const allowed = [
    "angry",
    "fear",
    "happy",
    "neutral",
    "sad",
  ];

  return allowed.includes(key)
    ? key
    : null;
};


/*
 * =========================================================
 * DATE HELPERS
 * =========================================================
 */

export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();

  const month = `${date.getMonth() + 1}`.padStart(
    2,
    "0"
  );

  const day = `${date.getDate()}`.padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
};


const getRecordDate = (record) => {
  try {
    if (record?.createdAt?.toDate) {
      return record.createdAt.toDate();
    }
  } catch (error) {
    // Continue to fallbacks.
  }

  if (
    Number.isFinite(
      Number(record?.clientCreatedAt)
    )
  ) {
    return new Date(
      Number(record.clientCreatedAt)
    );
  }

  return null;
};


const getRecordDateKey = (record) => {
  if (
    typeof record?.localDateKey === "string" &&
    record.localDateKey.trim()
  ) {
    return record.localDateKey.trim();
  }

  const date = getRecordDate(record);

  return date
    ? getLocalDateKey(date)
    : null;
};


const getRecordTime = (record) => {
  const date = getRecordDate(record);

  return date
    ? date.getTime()
    : 0;
};


/*
 * =========================================================
 * RELIABLE AI SIGNALS
 * =========================================================
 */

const getJournalSignal = (entry) => {
  if (entry?.nlpStatus !== "analyzed") {
    return null;
  }

  const confidence = Number(
    entry?.nlpConfidence
  );

  const mood = normalizeNlpEmotion(
    entry?.nlpEmotion
  );

  if (
    !mood ||
    !Number.isFinite(confidence) ||
    confidence < NLP_CONFIDENCE_THRESHOLD
  ) {
    return null;
  }

  return {
    mood,
    confidence,
    time: getRecordTime(entry),
  };
};


const getChatSignal = (message) => {
  if (
    message?.role !== "user" ||
    message?.nlpStatus === "safety" ||
    message?.safetyTriggered === true
  ) {
    return null;
  }

  const confidence = Number(
    message?.emotionConfidence
  );

  const mood = normalizeNlpEmotion(
    message?.detectedEmotion
  );

  if (
    !mood ||
    !Number.isFinite(confidence) ||
    confidence < NLP_CONFIDENCE_THRESHOLD
  ) {
    return null;
  }

  return {
    mood,
    confidence,
    time: getRecordTime(message),
  };
};


const getFaceSignal = (scan) => {
  if (scan?.lowConfidence === true) {
    return null;
  }

  const confidence = Number(
    scan?.confidence
  );

  const mood = normalizeCnnEmotion(
    scan?.primaryEmotion
  );

  if (
    !mood ||
    !Number.isFinite(confidence)
  ) {
    return null;
  }

  return {
    mood,
    confidence,
    time: getRecordTime(scan),
  };
};


/*
 * =========================================================
 * DOMINANT MOOD
 * =========================================================
 */

const getDominantSignal = (signals = []) => {
  const valid = signals.filter(Boolean);

  if (valid.length === 0) {
    return null;
  }

  const groups = {};

  valid.forEach((signal) => {
    if (!groups[signal.mood]) {
      groups[signal.mood] = {
        mood: signal.mood,
        count: 0,
        confidenceTotal: 0,
        latestTime: 0,
      };
    }

    groups[signal.mood].count += 1;

    groups[signal.mood].confidenceTotal +=
      signal.confidence;

    groups[signal.mood].latestTime =
      Math.max(
        groups[signal.mood].latestTime,
        signal.time || 0
      );
  });

  return Object.values(groups)
    .map((item) => ({
      mood: item.mood,
      count: item.count,
      confidence:
        item.confidenceTotal /
        item.count,
      latestTime:
        item.latestTime,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      if (
        b.confidence !==
        a.confidence
      ) {
        return (
          b.confidence -
          a.confidence
        );
      }

      return (
        b.latestTime -
        a.latestTime
      );
    })[0];
};


/*
 * =========================================================
 * DAILY SOURCE SUMMARY
 * =========================================================
 */

const filterByDate = (records = [], dateKey) =>
  records.filter(
    (record) =>
      getRecordDateKey(record) ===
      dateKey
  );


const buildSourceSummaryForDate = (
  sourceData,
  dateKey
) => {
  const journals = filterByDate(
    sourceData?.journalEntries,
    dateKey
  );

  const faceScans = filterByDate(
    sourceData?.faceScans,
    dateKey
  );

  const chats = filterByDate(
    sourceData?.chatMessages,
    dateKey
  );

  const journalMood =
    getDominantSignal(
      journals.map(getJournalSignal)
    );

  const faceMood =
    getDominantSignal(
      faceScans.map(getFaceSignal)
    );

  const chatMood =
    getDominantSignal(
      chats.map(getChatSignal)
    );

  return {
    journals,
    faceScans,
    chats,
    journalMood,
    faceMood,
    chatMood,
  };
};


const combineSourceMoods = (summary) =>
  getDominantSignal([
    summary?.journalMood,
    summary?.faceMood,
    summary?.chatMood,
  ]);


/*
 * =========================================================
 * TEXT HELPERS
 * =========================================================
 */

const journalText = {
  sad:
    "Your latest journal reflected a lower emotional tone today.",

  anxious:
    "Your latest journal suggests that worry or uncertainty may have been on your mind today.",

  angry:
    "Your latest journal reflected some frustration or anger today.",

  happy:
    "Your latest journal reflected a more positive emotional tone today.",

  surprised:
    "Your latest journal reflected surprise or an unexpected emotional moment today.",
};


const chatText = {
  sad:
    "Your recent conversations most often reflected a lower emotional tone.",

  anxious:
    "Worry appeared more often in your recent conversations today.",

  angry:
    "Frustration or anger appeared more often in your recent conversations today.",

  happy:
    "Your recent conversations reflected a more positive emotional tone.",

  surprised:
    "Surprise appeared in your recent conversation pattern today.",
};


const reflectionText = {
  sad:
    "a lower emotional tone appeared more strongly. Keep your next steps small and gentle.",

  anxious:
    "worry appeared more strongly. A short calming or grounding activity may feel useful.",

  angry:
    "frustration or anger appeared more strongly. Giving yourself a little space before reacting may help.",

  happy:
    "a more positive emotional tone appeared more strongly. You may want to notice or save one good moment from today.",

  surprised:
    "surprise appeared more strongly. Give yourself time to notice how the experience felt.",

  fear:
    "fear or uneasiness appeared more strongly. Moving slowly and using a familiar grounding activity may feel supportive.",

  neutral:
    "your emotional signals looked relatively steady today.",
};


/*
 * =========================================================
 * DAILY INSIGHT
 * =========================================================
 */

export const buildDailyInsight = (sourceData) => {
  const today = new Date();

  const summary =
    buildSourceSummaryForDate(
      sourceData,
      getLocalDateKey(today)
    );

  const overall =
    combineSourceMoods(summary);

  const sourceCount = [
    summary.journalMood,
    summary.faceMood,
    summary.chatMood,
  ].filter(Boolean).length;

  const primaryMood =
    overall?.mood ||
    "neutral";

  const mood =
    getMoodMeta(primaryMood);


  const latestJournal =
    [...summary.journals]
      .map((record) => ({
        record,
        signal:
          getJournalSignal(record),
      }))
      .filter((item) => item.signal)
      .sort(
        (a, b) =>
          b.signal.time -
          a.signal.time
      )[0];


  const latestReliableFace =
    [...summary.faceScans]
      .map((record) => ({
        record,
        signal:
          getFaceSignal(record),
      }))
      .filter((item) => item.signal)
      .sort(
        (a, b) =>
          b.signal.time -
          a.signal.time
      )[0];


  const latestAnyFace =
    [...summary.faceScans]
      .sort(
        (a, b) =>
          getRecordTime(b) -
          getRecordTime(a)
      )[0];


  let faceScanInsight =
    "No face scan check-in has been recorded today.";

  if (latestReliableFace) {
    const faceMood =
      getMoodMeta(
        latestReliableFace.signal.mood
      );

    faceScanInsight =
      `Your latest reliable face scan reflected a ${faceMood.name.toLowerCase()} facial expression.`;

  } else if (latestAnyFace) {
    faceScanInsight =
      "Your latest face scan was uncertain, so it was not used strongly in today’s mood summary.";
  }


  const prefix =
    sourceCount === 1
      ? "Based on the available check-in today, "
      : "Across your available check-ins today, ";


  return {
    dateText:
      today.toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }
      ),

    primaryMood,

    moodScore:
      mood.score,

    hasMoodData:
      sourceCount > 0,

    sourceCount,

    journalInsight:
      latestJournal
        ? journalText[
            latestJournal.signal.mood
          ] ||
          "Your journal provided an emotional check-in for today."
        : "No reliable journal emotion analysis has been recorded today.",

    faceScanInsight,

    chatInsight:
      summary.chatMood
        ? chatText[
            summary.chatMood.mood
          ] ||
          "Your conversations provided another emotional check-in for today."
        : "No reliable chatbot emotion analysis has been recorded today.",

    dailyReflection:
      sourceCount === 0
        ? "There is not enough AI check-in data yet today. Journaling, chatting with Healio, or completing a face scan will gradually build your daily insight."
        : prefix +
          (
            reflectionText[
              primaryMood
            ] ||
            "your emotional signals were mixed today."
          ),
  };
};


/*
 * =========================================================
 * WEEK HELPERS
 * =========================================================
 */

const getCurrentWeekDates = () => {
  const today = new Date();

  const monday =
    new Date(today);

  const day =
    monday.getDay();

  monday.setDate(
    monday.getDate() +
      (
        day === 0
          ? -6
          : 1 - day
      )
  );

  monday.setHours(
    0,
    0,
    0,
    0
  );


  return [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ].map((dayName, index) => {
    const date =
      new Date(monday);

    date.setDate(
      monday.getDate() +
        index
    );

    return {
      day: dayName,
      dateKey:
        getLocalDateKey(date),
    };
  });
};


/*
 * =========================================================
 * EMOTION DISTRIBUTION
 * =========================================================
 */

export const buildEmotionDistribution = (
  weeklyMoodTrend = []
) => {
  const validDays =
    weeklyMoodTrend.filter(
      (item) =>
        item.hasData &&
        item.mood
    );

  if (validDays.length === 0) {
    return [];
  }

  const counts = {};

  validDays.forEach((item) => {
    counts[item.mood] =
      (counts[item.mood] || 0) +
      1;
  });

  const keys =
    Object.keys(counts).sort(
      (a, b) =>
        counts[b] -
        counts[a]
    );

  let usedPercent = 0;

  return keys.map(
    (moodKey, index) => {
      const mood =
        getMoodMeta(moodKey);

      const percent =
        index === keys.length - 1
          ? 100 -
            usedPercent
          : Math.round(
              (
                counts[moodKey] /
                validDays.length
              ) *
                100
            );

      if (
        index !==
        keys.length - 1
      ) {
        usedPercent +=
          percent;
      }

      return {
        mood: moodKey,
        label: mood.name,
        percent,
        count:
          counts[moodKey],
        color:
          mood.color,
        icon:
          mood.icon,
      };
    }
  );
};


/*
 * =========================================================
 * WEEKLY REFLECTION
 * =========================================================
 */

const weeklyReflectionText = {
  sad:
    "A lower emotional tone appeared more often in this week’s available check-ins. Keep your next steps small and supportive.",

  anxious:
    "Worry appeared more often in this week’s available check-ins. Short calming pauses or grounding activities may be useful.",

  angry:
    "Frustration or anger appeared more often in this week’s available check-ins. Creating a pause before reacting may be useful.",

  happy:
    "Positive emotional signals appeared more often in this week’s available check-ins. Notice what supported those moments.",

  surprised:
    "Surprise appeared more often in this week’s available check-ins. Give yourself time to notice how those moments affected you.",

  fear:
    "Fear or uneasiness appeared more often in this week’s available check-ins. Familiar grounding activities may feel supportive.",

  neutral:
    "Your available check-ins looked relatively steady this week.",
};


/*
 * =========================================================
 * CHAT ENGAGEMENT
 * =========================================================
 */

const getChatEngagementCount = (
  messages = []
) => {
  if (messages.length === 0) {
    return 0;
  }

  const sessions =
    new Set(
      messages
        .map(
          (message) =>
            message?.sessionId
        )
        .filter(Boolean)
    );

  return sessions.size > 0
    ? sessions.size
    : messages.length;
};


/*
 * =========================================================
 * WEEKLY INSIGHT
 * =========================================================
 */

export const buildWeeklyInsight = (
  sourceData
) => {
  const weekDates =
    getCurrentWeekDates();


  const weeklyMoodTrend =
    weekDates.map(
      (weekDay) => {
        const summary =
          buildSourceSummaryForDate(
            sourceData,
            weekDay.dateKey
          );

        const combined =
          combineSourceMoods(
            summary
          );

        if (!combined) {
          return {
            day:
              weekDay.day,

            dateKey:
              weekDay.dateKey,

            mood:
              null,

            score:
              null,

            hasData:
              false,

            sourceCount:
              0,
          };
        }

        return {
          day:
            weekDay.day,

          dateKey:
            weekDay.dateKey,

          mood:
            combined.mood,

          score:
            getMoodMeta(
              combined.mood
            ).score,

          hasData:
            true,

          sourceCount:
            [
              summary.journalMood,
              summary.faceMood,
              summary.chatMood,
            ].filter(Boolean)
              .length,
        };
      }
    );


  const distribution =
    buildEmotionDistribution(
      weeklyMoodTrend
    );


  const weekKeys =
    new Set(
      weekDates.map(
        (item) =>
          item.dateKey
      )
    );


  const weeklyJournals =
    (
      sourceData?.journalEntries ||
      []
    ).filter(
      (item) =>
        weekKeys.has(
          getRecordDateKey(item)
        )
    );


  const weeklyFaces =
    (
      sourceData?.faceScans ||
      []
    ).filter(
      (item) =>
        weekKeys.has(
          getRecordDateKey(item)
        )
    );


  const weeklyChats =
    (
      sourceData?.chatMessages ||
      []
    ).filter(
      (item) =>
        weekKeys.has(
          getRecordDateKey(item)
        )
    );


  const dominant =
    distribution[0];


  return {
    weeklyMoodTrend,

    distribution,

    engagement: [
      {
        name: "Chatbot",
        count:
          getChatEngagementCount(
            weeklyChats
          ),
      },

      {
        name: "Journal",
        count:
          weeklyJournals.length,
      },

      {
        name: "Face scanning",
        count:
          weeklyFaces.length,
      },
    ],

    daysWithData:
      weeklyMoodTrend.filter(
        (item) =>
          item.hasData
      ).length,

    weeklyReflection:
      !dominant
        ? "There is not enough AI check-in data to build a weekly pattern yet. Continue using Journal, Chat Support, or Face Scan during the week."
        : weeklyReflectionText[
            dominant.mood
          ] ||
          "Your emotional check-ins varied this week. Continuing regular check-ins will make future patterns clearer.",
  };
};


/*
 * =========================================================
 * TEMPORARY BACKWARD-COMPATIBILITY
 * =========================================================
 *
 * Keep these because HomeScreen may still import
 * getDemoTodayInsight().
 *
 * InsightsScreen no longer uses demo data.
 * =========================================================
 */

export const getDemoTodayInsight = () => ({
  dateText:
    new Date().toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }
    ),

  primaryMood:
    "neutral",

  moodScore:
    moodMeta.neutral.score,

  journalInsight:
    "Your journal insights will appear as you save entries.",

  faceScanInsight:
    "Your face scan insights will appear after check-ins.",

  chatInsight:
    "Your chat insights will appear as you use Healio.",

  dailyReflection:
    "Your daily reflection will become clearer as you use Healio.",

  homeReflection:
    "Keep checking in with yourself. Small moments of reflection can help you notice patterns over time.",
});


export const getDemoWeeklyInsight = () => ({
  weeklyMoodTrend: [],

  distribution: [],

  engagement: [
    {
      name: "Chatbot",
      count: 0,
    },
    {
      name: "Journal",
      count: 0,
    },
    {
      name: "Face scanning",
      count: 0,
    },
  ],

  weeklyReflection:
    "Your weekly insight will appear as you use Healio during the week.",
});