import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzGU09IEqFyukuenNEAla9PSafdNcUlaY",
  authDomain: "lookbook-34a13.firebaseapp.com",
  projectId: "lookbook-34a13",
  storageBucket: "lookbook-34a13.firebasestorage.app",
  messagingSenderId: "1087351088510",
  appId: "1:1087351088510:web:03b6d983e37d3dd05cbf2f",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// const RECAPTCHA_SITE_KEY =
//   Constants.expoConfig?.extra?.EXPO_PUBLIC_RECAPTCHA_SITE_KEY;
// export const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
//   isTokenAutoRefreshEnabled: true,
// });

// if (__DEV__) {
//   (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// }

export const storage = getStorage(app);
export const functions = getFunctions(app);
export const db = getFirestore(app);
