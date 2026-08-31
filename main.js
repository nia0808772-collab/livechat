 // 1. Impor module yang diperlukan dari firebase dan firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

// 2. Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlmZWoyE6iLeqGor_ri9h9GhcUCUqzt1w",
  authDomain: "rpl2528-a444d.firebaseapp.com",
  projectId: "rpl2528-a444d",
  storageBucket: "rpl2528-a444d.firebasestorage.app",
  messagingSenderId: "524778921414",
  appId: "1:524778921414:web:095b9f8ab73bd49e84e6c7"
}

 // 3. Inisialisasi aplikasi Firebase dan Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const messageCollection = collection(db,"message")