import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCOwVcvC2AcPkCwCxqjSvoLhby88xVSPxI",
    authDomain: "lab06-expense-e654e.firebaseapp.com",
    projectId: "lab06-expense-e654e",
    storageBucket: "lab06-expense-e654e.firebasestorage.app",
    messagingSenderId: "322585149309",
    appId: "1:322585149309:web:9b0be31f4bf2bcad741614"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);