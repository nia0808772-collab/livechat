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

//Menentukan elemen-elemen DOM yang diperlukan
const chatForm = document.getElementById("chat-form")
const usernameInput = document.getElementById("username")
const messageInput = document.getElementById("message")
const chatBox = document.getElementById("chat-box")

//fitur kirim pesan
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  
  const username = usernameInput.value.trim()
  const message = messageInput.value.trim()
  
  if (username && message){
    //kirim ke firestore
    try {
      await addDoc(messageCollection, {
        username: username, 
        message: message, 
        waktu: serverTimestamp()
      })
      //bersihkan inout setelah mengirim pesan
      messageInput.value =""
    } catch (error) {
      console.log("Gagal mangirim pesan:", error)
    }
  }
}) 

//Fitur Pesan Linstener (Realime)
const queryPesan = query(messageCollection, orderBy("waktu","asc")) 

onSnapshot(queryPesan, (snapshot) => {
  //bersihkan chatBox sebelum menampilkan pesan baru
  chatBox.innerHTML = ""
  //tampilkan pesan baru di chatBox
  snapshot.forEach((doc)=> {
    
    //ambil data dari document
    const data = doc.data()
    
    //membuat tampilan waktu
    const waktu = data.waktu.toDate().toLocaleTimeString([], 
      {hour: '2-digit', minute: '2-digit'}
    )
    
    //render pesan (memanggil fungsi renderPesan)
    renderPesan(data.username,data.message, waktu)
  }) 
  //scrool chatBox ke bawah setiap kali ada pedan baru 
  chatBox.scrollTop = chatBox.scrollHeight
}) 

function renderPesan(username, message, waktu){
  //membuat elemen untuk menampilkan pesan
  const messageDiv = document.createElement("div")
  
  //mmenambak nama class meesseg-card ke elemen messageDiv
  messageDiv.classList.add("message-card")
  
  const warnaUser = stringToColor(username)
  
  //menambahkan konten pesan ke messageDiv
  messageDiv.innerHTML = `
  
  <div class="message-content">
     <strong style="color: ${warnaUser}">${username}</strong>
     <span>${message}</span>
  </div>
  <span class="time“>${waktu}</span>
  `//backtick
  
  //menambahkan messageDiv ke chatBox
  chatBox.appendChild(messageDiv)
  
}

// Fungsi untuk mengubah String Nama menjadi Warna (HSL) yang Konsisten
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Ambil nilai Hue 0 - 360, dengan Saturation 65% & Lightness 40% agar warna tetap kontras/jelas
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 40%)`;
}
