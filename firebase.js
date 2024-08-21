// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrl9Ef2qRemMoFU781hIKY3-biozh5uPg",
  authDomain: "flashcard-sass-f14fc.firebaseapp.com",
  projectId: "flashcard-sass-f14fc",
  storageBucket: "flashcard-sass-f14fc.appspot.com",
  messagingSenderId: "941962090185",
  appId: "1:941962090185:web:6b5d1253fcc9d38e831f18",
  measurementId: "G-53R83KSEGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db};