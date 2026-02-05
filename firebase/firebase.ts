// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzGU09IEqFyukuenNEAla9PSafdNcUlaY",
  authDomain: "lookbook-34a13.firebaseapp.com",
  projectId: "lookbook-34a13",
  storageBucket: "lookbook-34a13.firebasestorage.app",
  messagingSenderId: "1087351088510",
  appId: "1:1087351088510:web:03b6d983e37d3dd05cbf2f",
  measurementId: "G-DGR0N4ZJ5Y",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
