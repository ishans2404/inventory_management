// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "inventory-management-cd505.firebaseapp.com",
  projectId: "inventory-management-cd505",
  storageBucket: "inventory-management-cd505.appspot.com",
  messagingSenderId: "83627879038",
  appId: "1:83627879038:web:c0053ae2e518ea9a9c062f",
  measurementId: "G-MRV796477F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };