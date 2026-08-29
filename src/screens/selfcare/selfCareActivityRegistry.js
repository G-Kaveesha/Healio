import {
  angerActivities,
} from "./angerActivities";

import {
  lowMoodActivities,
} from "./lowMood/lowMoodActivities";

import {
  anxietyActivities,
} from "./anxiety/anxietyActivities";

import {
  happyActivities,
} from "./happy/happyActivities";

import {
  miniGames,
} from "./miniGames/miniGames";



export const selfCareActivityRegistry = {
  anger:
    angerActivities,

  lowMood:
    lowMoodActivities,

  anxiety:
    anxietyActivities,

  happy:
    happyActivities,

  miniGames:
    miniGames,
};


/*get one activity*/

export const getSelfCareActivity = (
  category,
  activityId
) => {
  if (
    !category ||
    !activityId
  ) {
    return null;
  }


  const activities =
    selfCareActivityRegistry[
      category
    ] || [];


  return (
    activities.find(
      (activity) =>
        activity.id ===
        activityId
    ) || null
  );
};


/*
 * =========================================================
 * GET ALL ACTIVITIES
 * =========================================================
 */

export const getAllSelfCareActivities =
  () => {
    const allActivities = [];


    Object.entries(
      selfCareActivityRegistry
    ).forEach(
      ([
        category,
        activities,
      ]) => {

        activities.forEach(
          (activity) => {
            allActivities.push({
              ...activity,

              category,
            });
          }
        );
      }
    );


    return allActivities;
  };