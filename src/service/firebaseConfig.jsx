// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClTwY8fglfqqMLhsBvj_8id6M83KSj7LQ",
  authDomain: "projects-866a7.firebaseapp.com",
  projectId: "projects-866a7",
  storageBucket: "projects-866a7.appspot.com",
  messagingSenderId: "12950594286",
  appId: "1:12950594286:web:9c77e3f940ac0cc6ed09ff",
  measurementId: "G-GL9PXDFLR1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);