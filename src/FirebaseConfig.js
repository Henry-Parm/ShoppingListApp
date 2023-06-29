// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseAPI_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: firebaseAPI_KEY,
  authDomain: "shoppinglist-275fb.firebaseapp.com",
  projectId: "shoppinglist-275fb",
  storageBucket: "shoppinglist-275fb.appspot.com",
  messagingSenderId: "938198027292",
  appId: "1:938198027292:web:bb29f5378e6234994623d9",
  measurementId: "G-TL8K9PQ4SX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const auth = getAuth(app);

export { app, database, auth };