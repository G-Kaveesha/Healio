import {
  getSelfCareActivity,
  getAllSelfCareActivities,
} from "../screens/selfcare/selfCareActivityRegistry";

import {
  NLP_CONFIDENCE_THRESHOLD,
} from "./nlpApi";


/*
 * =========================================================
 * SETTINGS
 * =========================================================
 */

const HOME_ACTIVITY_COUNT =
  4;


/*
 * =========================================================
 * JOURNAL EMOTION → REAL HEALIO ACTIVITIES
 * =========================================================
 *
 * IMPORTANT:
 *
 * These are candidate activities only.
 *
 * The journal emotion does NOT mean that all users with
 * that emotion require the same activity.
 *
 * Home randomly chooses from the approved pool.
 * =========================================================
 */

const JOURNAL_ACTIVITY_MAP = {

  anger: [
    {
      category: "anger",
      id: "write-release",
    },

    {
      category: "anger",
      id: "rain-mindfulness",
    },

    {
      category: "anger",
      id: "box-breathing",
    },

    {
      category: "anger",
      id: "grounding",
    },

    {
      category: "miniGames",
      id: "zen-garden",
    },

    {
      category: "miniGames",
      id: "bubble-pop-calm",
    },
  ],


  sadness: [
    {
      category: "lowMood",
      id: "one-small-step",
    },

    {
      category: "lowMood",
      id: "move-with-me",
    },

    {
      category: "lowMood",
      id: "kinder-perspective",
    },

    {
      category: "miniGames",
      id: "color-unwind",
    },

    {
      category: "miniGames",
      id: "zen-garden",
    },
  ],


  worry: [
    {
      category: "anxiety",
      id: "calm-my-body",
    },

    {
      category: "anxiety",
      id: "sort-my-worry",
    },

    {
      category: "anxiety",
      id: "slow-the-wave",
    },

    {
      category: "anger",
      id: "grounding",
    },

    {
      category: "miniGames",
      id: "bubble-pop-calm",
    },

    {
      category: "miniGames",
      id: "color-unwind",
    },

    {
      category: "miniGames",
      id: "zen-garden",
    },
  ],


  happiness: [
    {
      category: "happy",
      id: "hold-the-moment",
    },

    {
      category: "happy",
      id: "pass-it-on",
    },

    {
      category: "happy",
      id: "happy-capsule",
    },

    {
      category: "miniGames",
      id: "color-unwind",
    },
  ],


  love: [
    {
      category: "happy",
      id: "pass-it-on",
    },

    {
      category: "happy",
      id: "happy-capsule",
    },

    {
      category: "happy",
      id: "hold-the-moment",
    },

    {
      category: "miniGames",
      id: "color-unwind",
    },
  ],


  /*
   * Surprise can be positive or uncomfortable,
   * so we keep this pool varied.
   */

  surprise: [
    {
      category: "anger",
      id: "grounding",
    },

    {
      category: "anxiety",
      id: "slow-the-wave",
    },

    {
      category: "happy",
      id: "hold-the-moment",
    },

    {
      category: "miniGames",
      id: "bubble-pop-calm",
    },

    {
      category: "miniGames",
      id: "color-unwind",
    },

    {
      category: "miniGames",
      id: "zen-garden",
    },
  ],
};


/*
 * =========================================================
 * NORMALIZE EMOTION
 * =========================================================
 */

function normalizeEmotion(
  emotion
) {
  if (
    typeof emotion !==
    "string"
  ) {
    return "";
  }


  return emotion
    .trim()
    .toLowerCase();
}


/*
 * =========================================================
 * SHUFFLE
 * =========================================================
 */

function shuffleItems(
  items
) {
  const copy = [
    ...items,
  ];


  for (
    let index =
      copy.length - 1;

    index > 0;

    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1)
      );


    const temporary =
      copy[index];


    copy[index] =
      copy[randomIndex];


    copy[randomIndex] =
      temporary;
  }


  return copy;
}


/*
 * =========================================================
 * UNIQUE ACTIVITIES
 * =========================================================
 */

function removeDuplicates(
  activities
) {
  const seen =
    new Set();


  return activities.filter(
    (activity) => {
      if (
        !activity ||
        !activity.id ||
        !activity.category
      ) {
        return false;
      }


      const key =
        `${activity.category}-${activity.id}`;


      if (
        seen.has(key)
      ) {
        return false;
      }


      seen.add(key);

      return true;
    }
  );
}


/*
 * =========================================================
 * RESOLVE STORED REFERENCE
 * =========================================================
 */

function resolveActivityReference(
  reference
) {
  if (
    !reference?.category ||
    !reference?.id
  ) {
    return null;
  }


  const activity =
    getSelfCareActivity(
      reference.category,
      reference.id
    );


  if (!activity) {
    return null;
  }


  return {
    ...activity,

    category:
      reference.category,
  };
}


/*
 * =========================================================
 * JOURNAL RECOMMENDATIONS
 * =========================================================
 */

export function getJournalRecommendedActivities({
  emotion,
  confidence,
  status,
}) {
  const numericConfidence =
    Number(confidence);


  /*
   * Only reliable NLP results can personalize Home.
   */

  if (
    status !==
      "analyzed" ||
    !Number.isFinite(
      numericConfidence
    ) ||
    numericConfidence <
      NLP_CONFIDENCE_THRESHOLD
  ) {
    return [];
  }


  const normalizedEmotion =
    normalizeEmotion(
      emotion
    );


  if (
    !normalizedEmotion ||
    normalizedEmotion ===
      "uncertain"
  ) {
    return [];
  }


  const references =
    JOURNAL_ACTIVITY_MAP[
      normalizedEmotion
    ] || [];


  const activities =
    references
      .map(
        resolveActivityReference
      )
      .filter(Boolean);


  return removeDuplicates(
    activities
  );
}


/*
 * =========================================================
 * FAVORITES
 * =========================================================
 */

function resolveFavorites(
  favorites
) {
  if (
    !Array.isArray(
      favorites
    )
  ) {
    return [];
  }


  return favorites
    .map(
      (favorite) =>
        resolveActivityReference({
          category:
            favorite.category,

          id:
            favorite.id,
        })
    )
    .filter(Boolean);
}


/*
 * =========================================================
 * RECENTS
 * =========================================================
 */

function resolveRecentActivities(
  recentActivities
) {
  if (
    !Array.isArray(
      recentActivities
    )
  ) {
    return [];
  }


  /*
   * Most recently completed first.
   */

  const sortedRecents = [
    ...recentActivities,
  ].sort(
    (a, b) =>
      (
        b?.lastOpenedAt ||
        0
      ) -
      (
        a?.lastOpenedAt ||
        0
      )
  );


  return sortedRecents
    .map(
      (recent) =>
        resolveActivityReference({
          category:
            recent.category,

          id:
            recent.id,
        })
    )
    .filter(Boolean);
}


/*
 * =========================================================
 * FILL TO EXACTLY FOUR
 * =========================================================
 */

function fillToFour(
  initialActivities
) {
  let result =
    removeDuplicates(
      initialActivities
    );


  if (
    result.length >=
    HOME_ACTIVITY_COUNT
  ) {
    return result.slice(
      0,
      HOME_ACTIVITY_COUNT
    );
  }


  /*
   * Final fallback:
   *
   * If the user has fewer than four Favorites / Recents,
   * fill the remaining positions from the complete
   * Healio activity catalogue.
   */

  const allActivities =
    shuffleItems(
      getAllSelfCareActivities()
    );


  for (
    const activity
    of allActivities
  ) {
    const alreadyIncluded =
      result.some(
        (existing) =>
          existing.id ===
            activity.id &&
          existing.category ===
            activity.category
      );


    if (
      !alreadyIncluded
    ) {
      result.push(
        activity
      );
    }


    if (
      result.length >=
      HOME_ACTIVITY_COUNT
    ) {
      break;
    }
  }


  return result.slice(
    0,
    HOME_ACTIVITY_COUNT
  );
}


/*
 * =========================================================
 * BUILD HOME CARDS
 * =========================================================
 *
 * Priority:
 *
 * 1. Reliable latest journal emotion
 *
 * If that exists:
 * → randomly select from emotion-based candidates.
 *
 * If it does not:
 * → Favorites + Recent Activities.
 *
 * If fewer than four are available:
 * → random activities from complete catalogue.
 * =========================================================
 */

export function buildHomeActivityCards({
  journalEmotion = null,
  journalConfidence = null,
  journalStatus = null,
  favorites = [],
  recentActivities = [],
}) {

  /*
   * -------------------------------------------------------
   * 1. Journal-based recommendations
   * -------------------------------------------------------
   */

  const journalActivities =
    getJournalRecommendedActivities({
      emotion:
        journalEmotion,

      confidence:
        journalConfidence,

      status:
        journalStatus,
    });


  if (
    journalActivities.length >
    0
  ) {
    const randomizedJournalActivities =
      shuffleItems(
        journalActivities
      );


    return fillToFour(
      randomizedJournalActivities
    );
  }


  /*
   * -------------------------------------------------------
   * 2. Favorites + Recents fallback
   * -------------------------------------------------------
   */

  const favoriteActivities =
    resolveFavorites(
      favorites
    );


  const recentItems =
    resolveRecentActivities(
      recentActivities
    );


  /*
   * Give both sources a chance to appear.
   */

  const fallbackPool =
    shuffleItems(
      removeDuplicates([
        ...favoriteActivities,
        ...recentItems,
      ])
    );


  return fillToFour(
    fallbackPool
  );
}