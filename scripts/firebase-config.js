import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"; 
import { getAuth }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUAots1jlZl3BYaBBd44f02nMLZDvKYQ4",
  authDomain: "vector-pay.firebaseapp.com",
  projectId: "vector-pay",
  storageBucket: "vector-pay.firebasestorage.app",
  messagingSenderId: "659660836164",
  appId: "1:659660836164:web:d32789f75f7ca71cac9b11",
  measurementId: "G-J4Z1VL9X4J"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getDatabase(app)