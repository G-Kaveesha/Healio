import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  buildDailyInsight,
  buildWeeklyInsight,
} from "../utils/insightsHelper";


/*
 * =========================================================
 * HEALIO INSIGHTS DATA SERVICE
 * =========================================================
 *
 * Real insight sources:
 *
 * 1. Journal
 *    journalEntries
 *
 * 2. Face Scan
 *    moodCheckIns
 *
 * 3. Chatbot
 *    users/{uid}/chatMessages
 *
 * Daily Logs and Activity Logs are intentionally NOT used.
 * =========================================================
 */


/*
 * =========================================================
 * JOURNAL ENTRIES
 * =========================================================
 */

const loadJournalEntries =
  async (
    userId
  ) => {

    try {

      const journalQuery =
        query(
          collection(
            db,
            "journalEntries"
          ),

          where(
            "userId",
            "==",
            userId
          )
        );


      const snapshot =
        await getDocs(
          journalQuery
        );


      return snapshot.docs.map(
        (
          documentSnapshot
        ) => ({
          id:
            documentSnapshot.id,

          ...documentSnapshot.data(),
        })
      );

    } catch (
      error
    ) {

      console.warn(
        "Insights journal load failed:",
        error
      );


      /*
       * One unavailable source should not
       * break the whole Insights screen.
       */

      return [];
    }
  };


/*
 * =========================================================
 * FACE SCANS
 * =========================================================
 */

const loadFaceScans =
  async (
    userId
  ) => {

    try {

      const faceQuery =
        query(
          collection(
            db,
            "moodCheckIns"
          ),

          where(
            "userId",
            "==",
            userId
          )
        );


      const snapshot =
        await getDocs(
          faceQuery
        );


      return snapshot.docs.map(
        (
          documentSnapshot
        ) => ({
          id:
            documentSnapshot.id,

          ...documentSnapshot.data(),
        })
      );

    } catch (
      error
    ) {

      console.warn(
        "Insights face scan load failed:",
        error
      );


      return [];
    }
  };


/*
 * =========================================================
 * CHATBOT USER MESSAGES
 * =========================================================
 *
 * Chatbot messages are stored beneath:
 *
 * users/{uid}/chatMessages/{messageId}
 *
 * We only need USER messages for emotion analysis.
 *
 * Assistant contextEmotion is not treated as a new
 * independent emotion observation.
 * =========================================================
 */

const loadChatMessages =
  async (
    userId
  ) => {

    try {

      const chatReference =
        collection(
          db,
          "users",
          userId,
          "chatMessages"
        );


      const snapshot =
        await getDocs(
          chatReference
        );


      return snapshot.docs
        .map(
          (
            documentSnapshot
          ) => ({
            id:
              documentSnapshot.id,

            ...documentSnapshot.data(),
          })
        )
        .filter(
          (
            message
          ) =>
            message?.role ===
            "user"
        );

    } catch (
      error
    ) {

      console.warn(
        "Insights chatbot load failed:",
        error
      );


      return [];
    }
  };


/*
 * =========================================================
 * LOAD ALL REAL INSIGHT DATA
 * =========================================================
 */

export const loadInsightsData =
  async () => {

    const currentUser =
      auth.currentUser;


    if (
      !currentUser
    ) {

      throw new Error(
        "USER_NOT_AUTHENTICATED"
      );
    }


    const userId =
      currentUser.uid;


    /*
     * Load all three sources together.
     *
     * This is faster than waiting for each
     * Firestore request one at a time.
     */

    const [
      journalEntries,
      faceScans,
      chatMessages,
    ] =
      await Promise.all([
        loadJournalEntries(
          userId
        ),

        loadFaceScans(
          userId
        ),

        loadChatMessages(
          userId
        ),
      ]);


    const sourceData = {
      journalEntries,
      faceScans,
      chatMessages,
    };


    /*
     * Calculation is deliberately separated
     * from database access.
     */

    const daily =
      buildDailyInsight(
        sourceData
      );


    const weekly =
      buildWeeklyInsight(
        sourceData
      );


    return {
      daily,
      weekly,

      sourceCounts: {
        journal:
          journalEntries.length,

        faceScan:
          faceScans.length,

        chatbot:
          chatMessages.length,
      },
    };
  };