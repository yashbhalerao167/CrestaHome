// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQVrt36yIDtUhJzKhsYcxVvlqkgzEwy7s",
  authDomain: "next-home-d048c.firebaseapp.com",
  projectId: "next-home-d048c",
  storageBucket: "next-home-d048c.firebasestorage.app",
  messagingSenderId: "809217936498",
  appId: "1:809217936498:web:67e3a28a16169b7cf646eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
