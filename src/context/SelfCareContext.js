import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const SelfCareContext = createContext(null);

const FAVORITES_KEY = "@healio_selfcare_favorites";
const RECENTS_KEY = "@healio_selfcare_recents";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function SelfCareProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [recentActivities, setRecentActivities] =
    useState([]);

  const [isSelfCareLoaded, setIsSelfCareLoaded] =
    useState(false);

  const expiryTimerRef = useRef(null);

  /*REMOVE EXPIRED RECENT ACTIVITIES*/

  const removeExpiredRecents = useCallback(
    (items = []) => {
      const now = Date.now();

      return items.filter((item) => {
        if (!item.lastOpenedAt) {
          return false;
        }

        return now - item.lastOpenedAt < ONE_DAY_MS;
      });
    },
    []
  );

  /*LOAD SAVED DATA*/

  useEffect(() => {
    const loadSelfCareData = async () => {
      try {
        const [savedFavorites, savedRecents] =
          await Promise.all([
            AsyncStorage.getItem(FAVORITES_KEY),
            AsyncStorage.getItem(RECENTS_KEY),
          ]);

        const parsedFavorites = savedFavorites
          ? JSON.parse(savedFavorites)
          : [];

        const parsedRecents = savedRecents
          ? JSON.parse(savedRecents)
          : [];

        const validRecents =
          removeExpiredRecents(parsedRecents);

        setFavorites(parsedFavorites);
        setRecentActivities(validRecents);

        /*
         * If expired items were found,
         * update AsyncStorage immediately.
         */
        if (
          validRecents.length !== parsedRecents.length
        ) {
          await AsyncStorage.setItem(
            RECENTS_KEY,
            JSON.stringify(validRecents)
          );
        }
      } catch (error) {
        console.log(
          "Error loading self-care data:",
          error
        );
      } finally {
        setIsSelfCareLoaded(true);
      }
    };

    loadSelfCareData();
  }, [removeExpiredRecents]);

  /*SAVE FAVORITES*/

  useEffect(() => {
    if (!isSelfCareLoaded) {
      return;
    }

    AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    ).catch((error) => {
      console.log(
        "Error saving favorites:",
        error
      );
    });
  }, [favorites, isSelfCareLoaded]);

  /*SAVE RECENTS*/

  useEffect(() => {
    if (!isSelfCareLoaded) {
      return;
    }

    AsyncStorage.setItem(
      RECENTS_KEY,
      JSON.stringify(recentActivities)
    ).catch((error) => {
      console.log(
        "Error saving recent activities:",
        error
      );
    });
  }, [recentActivities, isSelfCareLoaded]);

  /*FAVORITE HELPERS*/

  const isFavorite = useCallback(
    (activityId, category) => {
      return favorites.some(
        (item) =>
          item.id === activityId &&
          item.category === category
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (activity, category) => {
      if (!activity?.id || !category) {
        return;
      }

      setFavorites((currentFavorites) => {
        const alreadyFavorite =
          currentFavorites.some(
            (item) =>
              item.id === activity.id &&
              item.category === category
          );

        if (alreadyFavorite) {
          return currentFavorites.filter(
            (item) =>
              !(
                item.id === activity.id &&
                item.category === category
              )
          );
        }

        return [
          {
            id: activity.id,
            category,
            savedAt: Date.now(),
          },
          ...currentFavorites,
        ];
      });
    },
    []
  );

  /*ADD RECENT ACTIVITY*/

  const addRecentActivity = useCallback(
    (activity, category) => {
      if (!activity?.id || !category) {
        return;
      }

      const now = Date.now();

      setRecentActivities((currentRecents) => {
        const validRecents =
          removeExpiredRecents(currentRecents);

        const withoutCurrentActivity =
          validRecents.filter(
            (item) =>
              !(
                item.id === activity.id &&
                item.category === category
              )
          );

        return [
          {
            id: activity.id,
            category,
            lastOpenedAt: now,
          },
          ...withoutCurrentActivity,
        ];
      });
    },
    [removeExpiredRecents]
  );

  /*CLEAR RECENT ACTIVITIES MANUALLY*/

  const clearRecentActivities =
    useCallback(async () => {
      setRecentActivities([]);

      try {
        await AsyncStorage.removeItem(
          RECENTS_KEY
        );
      } catch (error) {
        console.log(
          "Error clearing recent activities:",
          error
        );
      }
    }, []);

  /*CHECK EXPIRATION*/

  const refreshRecentActivities =
    useCallback(() => {
      setRecentActivities((current) =>
        removeExpiredRecents(current)
      );
    }, [removeExpiredRecents]);

 
  useEffect(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
    }

    if (recentActivities.length === 0) {
      return;
    }

    const oldestExpiration = Math.min(
      ...recentActivities.map(
        (item) =>
          item.lastOpenedAt + ONE_DAY_MS
      )
    );

    const delay = Math.max(
      oldestExpiration - Date.now(),
      1000
    );

    expiryTimerRef.current = setTimeout(() => {
      refreshRecentActivities();
    }, delay);

    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
      }
    };
  }, [
    recentActivities,
    refreshRecentActivities,
  ]);

  const value = useMemo(
    () => ({
      favorites,
      recentActivities,
      isSelfCareLoaded,

      isFavorite,
      toggleFavorite,

      addRecentActivity,
      clearRecentActivities,
      refreshRecentActivities,
    }),
    [
      favorites,
      recentActivities,
      isSelfCareLoaded,
      isFavorite,
      toggleFavorite,
      addRecentActivity,
      clearRecentActivities,
      refreshRecentActivities,
    ]
  );

  return (
    <SelfCareContext.Provider value={value}>
      {children}
    </SelfCareContext.Provider>
  );
}

export function useSelfCare() {
  const context = useContext(SelfCareContext);

  if (!context) {
    throw new Error(
      "useSelfCare must be used inside SelfCareProvider."
    );
  }

  return context;
}