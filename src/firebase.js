
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/*
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {ref, onUnmounted, computed } from 'vue'
*/


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbPN5NRUzz7Vx3aDTd_CO1PkqRNVD5EZg",
  authDomain: "image-toolkit-app.firebaseapp.com",
  projectId: "image-toolkit-app",
  storageBucket: "image-toolkit-app.appspot.com",
  messagingSenderId: "1085638783123",
  appId: "1:1085638783123:web:1766dcac980664b73b5d66",
  measurementId: "G-KL2DRYDLE8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);