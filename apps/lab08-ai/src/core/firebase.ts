import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCOwVcvC2AcPkCwCxqjSvoLhby88xVSPxI",
  authDomain: "lab06-expense-e654e.firebaseapp.com",
  projectId: "lab06-expense-e654e",
  storageBucket: "lab06-expense-e654e.firebasestorage.app",
  messagingSenderId: "322585149309",
  appId: "1:322585149309:web:9b0be31f4bf2bcad741614",
  measurementId: "G-HE8X2K24D7",
};

export const app = initializeApp(firebaseConfig);