import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDeNtGHflK_dFIR11xnpYx68rG5WVyjDdw",
    authDomain: "israaosman-8e238.firebaseapp.com",
    projectId: "israaosman-8e238",
    storageBucket: "israaosman-8e238.appspot.com",
    messagingSenderId: "952755059042",
    appId: "1:952755059042:web:e8377b47b7469f8477143b"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {
    db
}