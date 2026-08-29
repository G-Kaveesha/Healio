import {
  initializeApp,
  getApp,
  getApps,
} from "firebase/app";

import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

import ReactNativeAsyncStorage from
  "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUetW-PrkgjJyv6tAJ7y1n7pFbvpj_-Pk",
  authDomain: "healio-14be5.firebaseapp.com",
  projectId: "healio-14be5",
  storageBucket: "healio-14be5.firebasestorage.app",
  messagingSenderId: "800501794667",
  appId: "1:800501794667:web:fa048d88dabaf8ae4eee2e",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(
      ReactNativeAsyncStorage
    ),
  });
} catch (error) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export {
  app,
  auth,
  db,
};