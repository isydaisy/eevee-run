// /firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBwYlQu3NGK3-Rh46ufFmfTAYDpfi-B-30",
    authDomain: "eeveerun.firebaseapp.com",
    projectId: "eeveerun",
    storageBucket: "eeveerun.firebasestorage.app",
    messagingSenderId: "418724360797",
    appId: "1:418724360797:web:21dfcbae1517f62daad3b4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, GoogleAuthProvider, signInWithPopup, db };


