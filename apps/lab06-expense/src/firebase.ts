import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCOwVcvC2AcPkCwCxqjSvoLhby88xVSPxI",
    authDomain: "lab06-expense-e654e.firebaseapp.com",
    projectId: "lab06-expense-e654e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
