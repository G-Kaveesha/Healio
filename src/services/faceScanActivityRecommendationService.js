/*
 * =========================================================
 * HEALIO
 * FACE-SCAN ACTIVITY RECOMMENDATION SERVICE
 * =========================================================
 *
 * Purpose:
 *
 * CNN facial expression
 *      ↓
 * Approved Healio activity pool
 *      ↓
 * Randomly select 2 real activities
 *
 * IMPORTANT:
 *
 * - No Gemini is used here.
 * - No new activity is invented.
 * - Only activities that already exist in Healio are used.
 * - A low-confidence CNN result uses a general,
 *   low-pressure activity pool instead of strongly
 *   personalizing from an uncertain emotion.
 * =========================================================
 */


import {
  angerActivities,
} from "../screens/selfcare/angerActivities";

import {
  lowMoodActivities,
} from "../screens/selfcare/lowMood/lowMoodActivities";

import {
  anxietyActivities,
} from "../screens/selfcare/anxiety/anxietyActivities";

import {
  happyActivities,
} from "../screens/selfcare/happy/happyActivities";

import {
  miniGames,
} from "../screens/selfcare/miniGames/miniGames";


/*
 * =========================================================
 * BUILD COMPLETE FRONTEND ACTIVITY CATALOGUE
 * =========================================================
 */

const ALL_FACE_SCAN_ACTIVITIES = [
  ...angerActivities.map(
    (activity) => ({
      ...activity,
      category: "anger",
    })
  ),

  ...lowMoodActivities.map(
    (activity) => ({
      ...activity,
      category: "lowMood",
    })
  ),

  ...anxietyActivities.map(
    (activity) => ({
      ...activity,
      category: "anxiety",
    })
  ),

  ...happyActivities.map(
    (activity) => ({
      ...activity,
      category: "happy",
    })
  ),

  ...miniGames.map(
    (activity) => ({
      ...activity,
      category: "miniGames",
    })
  ),
];


/*
 * =========================================================
 * LOOKUP
 * =========================================================
 */

const ACTIVITY_BY_ID = {};

ALL_FACE_SCAN_ACTIVITIES.forEach(
  (activity) => {
    ACTIVITY_BY_ID[
      activity.id
    ] = activity;
  }
);


/*
 * =========================================================
 * CNN EMOTION → APPROVED ACTIVITY IDS
 * =========================================================
 *
 * CNN classes:
 *
 * angry
 * fear
 * happy
 * neutral
 * sad
 * =========================================================
 */

const FACE_SCAN_ACTIVITY_MAP = {

  angry: [
    "write-release",
    "rain-mindfulness",
    "box-breathing",
    "grounding",
    "zen-garden",
    "bubble-pop-calm",
  ],


  fear: [
    "calm-my-body",
    "slow-the-wave",
    "sort-my-worry",
    "grounding",
    "bubble-pop-calm",
    "zen-garden",
  ],


  sad: [
    "one-small-step",
    "move-with-me",
    "kinder-perspective",
    "color-unwind",
    "zen-garden",
  ],


  happy: [
    "hold-the-moment",
    "pass-it-on",
    "happy-capsule",
    "color-unwind",
  ],


  /*
   * Neutral does not require a strong
   * emotion-focused intervention.
   *
   * These are gentle optional activities.
   */

  neutral: [
    "zen-garden",
    "color-unwind",
    "hold-the-moment",
    "bubble-pop-calm",
  ],
};


/*
 * =========================================================
 * LOW-CONFIDENCE FALLBACK
 * =========================================================
 *
 * If the CNN is not confident enough,
 * avoid making a strong emotion-based recommendation.
 *
 * These are general, low-pressure activities.
 * =========================================================
 */

const GENERAL_ACTIVITY_IDS = [
  "zen-garden",
  "color-unwind",
  "grounding",
  "hold-the-moment",
  "bubble-pop-calm",
];


/*
 * =========================================================
 * NORMALIZE CNN LABEL
 * =========================================================
 */

const normalizeEmotion =
  (
    emotion
  ) => {

    if (
      typeof emotion !==
      "string"
    ) {
      return "neutral";
    }


    const normalized =
      emotion
        .trim()
        .toLowerCase();


    if (
      FACE_SCAN_ACTIVITY_MAP[
        normalized
      ]
    ) {
      return normalized;
    }


    return "neutral";
  };


/*
 * =========================================================
 * SHUFFLE
 * =========================================================
 */

const shuffle =
  (
    items
  ) => {

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
            (
              index + 1
            )
        );


      const temporary =
        copy[index];


      copy[index] =
        copy[randomIndex];


      copy[randomIndex] =
        temporary;
    }


    return copy;
  };


/*
 * =========================================================
 * RESOLVE IDS INTO REAL ACTIVITIES
 * =========================================================
 */

const resolveActivities =
  (
    activityIds
  ) => {

    return activityIds
      .map(
        (activityId) =>
          ACTIVITY_BY_ID[
            activityId
          ] || null
      )
      .filter(Boolean);
  };


/*
 * =========================================================
 * PUBLIC FUNCTION
 * =========================================================
 *
 * Returns exactly two real activities whenever
 * enough valid activities exist.
 *
 * Example:
 *
 * getFaceScanActivityRecommendations({
 *   emotion: "fear",
 *   lowConfidence: false
 * })
 *
 * →
 *
 * [
 *   Slow the Wave,
 *   Grounding
 * ]
 * =========================================================
 */

export const getFaceScanActivityRecommendations =
  ({
    emotion,
    lowConfidence = false,
    count = 2,
  }) => {

    /*
     * -----------------------------------------
     * LOW CONFIDENCE
     * -----------------------------------------
     */

    if (
      lowConfidence
    ) {

      const generalActivities =
        resolveActivities(
          GENERAL_ACTIVITY_IDS
        );


      return shuffle(
        generalActivities
      ).slice(
        0,
        count
      );
    }


    /*
     * -----------------------------------------
     * RELIABLE EMOTION
     * -----------------------------------------
     */

    const normalizedEmotion =
      normalizeEmotion(
        emotion
      );


    const activityIds =
      FACE_SCAN_ACTIVITY_MAP[
        normalizedEmotion
      ] ||
      FACE_SCAN_ACTIVITY_MAP
        .neutral;


    const activities =
      resolveActivities(
        activityIds
      );


    /*
     * If something is unexpectedly missing,
     * use general activities rather than
     * leaving the result page empty.
     */

    if (
      activities.length <
      count
    ) {

      const fallbackActivities =
        resolveActivities(
          GENERAL_ACTIVITY_IDS
        );


      const combined = [
        ...activities,
        ...fallbackActivities,
      ];


      const unique = [];
      const usedIds =
        new Set();


      combined.forEach(
        (activity) => {

          if (
            activity &&
            !usedIds.has(
              activity.id
            )
          ) {
            usedIds.add(
              activity.id
            );

            unique.push(
              activity
            );
          }
        }
      );


      return shuffle(
        unique
      ).slice(
        0,
        count
      );
    }


    return shuffle(
      activities
    ).slice(
      0,
      count
    );
  };


/*
 * =========================================================
 * OPTIONAL DEBUG FUNCTION
 * =========================================================
 */

export const getFaceScanCandidateActivities =
  (
    emotion
  ) => {

    const normalizedEmotion =
      normalizeEmotion(
        emotion
      );


    return resolveActivities(
      FACE_SCAN_ACTIVITY_MAP[
        normalizedEmotion
      ] ||
        FACE_SCAN_ACTIVITY_MAP
          .neutral
    );
  };