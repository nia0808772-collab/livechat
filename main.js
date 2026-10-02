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

 // 3. Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const messagesCollection =
    collection(db, "messages")


// ==================================================
// IDENTIFIKASI BROWSER
// ==================================================

function ambilAtauBuatIdBrowser() {

    let idBrowser =
        localStorage.getItem(
            "livechatpunyaku123"
        )

    if (!idBrowser) {

        idBrowser =
            "user_" +
            Math.random()
                .toString(36)
                .substring(2, 11) +
            "_" +
            Date.now()

        localStorage.setItem(
            "livechatpunyaku123",
            idBrowser
        )
    }

    return idBrowser
}


const idBrowserSekarang =
    ambilAtauBuatIdBrowser()


// ==================================================
// 🔊 SUARA NOTIFIKASI PESAN
// ==================================================

const suaraPesanMasuk =
    new Audio("notifikasipesan.mp3")

suaraPesanMasuk.preload = "auto"

let pertamaKali = true


// ==================================================
// USERNAME
// ==================================================

const usernameTersimpan =
    localStorage.getItem(
        "livechat_username"
    ) || ""


// ==================================================
// DAFTAR STIKER
// ==================================================

const daftarStiker = [

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Grinning%20face/3D/grinning_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Face%20with%20tears%20of%20joy/3D/face_with_tears_of_joy_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rolling%20on%20the%20floor%20laughing/3D/rolling_on_the_floor_laughing_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Beaming%20face%20with%20smiling%20eyes/3D/beaming_face_with_smiling_eyes_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Grinning%20squinting%20face/3D/grinning_squinting_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20heart-eyes/3D/smiling_face_with_heart_eyes_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star-struck/3D/star-struck_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Face%20blowing%20a%20kiss/3D/face_blowing_a_kiss_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20hearts/3D/smiling_face_with_hearts_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20sunglasses/3D/smiling_face_with_sunglasses_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Zany%20face/3D/zany_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Face%20savoring%20food/3D/face_savoring_food_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Squinting%20face%20with%20tongue/3D/squinting_face_with_tongue_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Thinking%20face/3D/thinking_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Exploding%20head/3D/exploding_head_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Face%20screaming%20in%20fear/3D/face_screaming_in_fear_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Flushed%20face/3D/flushed_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crying%20face/3D/crying_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Loudly%20crying%20face/3D/loudly_crying_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Angry%20face/3D/angry_face_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Face%20with%20symbols%20on%20mouth/3D/face_with_symbols_on_mouth_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Thumbs%20up/3D/thumbs_up_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Thumbs%20down/3D/thumbs_down_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Clapping%20hands/3D/clapping_hands_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Victory%20hand/3D/victory_hand_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Folded%20hands/3D/folded_hands_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20heart/3D/red_heart_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fire/3D/fire_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/3D/party_popper_3d.png",

    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Collision/3D/collision_3d.png"
]


// ==================================================
// ELEMENT DOM
// ==================================================

const chatForm =
    document.getElementById("chat-form")

const usernameInput =
    document.getElementById("username")

const messageInput =
    document.getElementById("message")

const chatBox =
    document.getElementById("chat-box")

const pemilihStiker =
    document.getElementById("pemilih-stiker")

const divDaftarStiker =
    document.getElementById("daftar-stiker")

const tombolStiker =
    document.getElementById("tombol-stiker")


// ==================================================
// USERNAME YANG SUDAH TERSIMPAN
// ==================================================

if (usernameTersimpan) {

    usernameInput.value =
        usernameTersimpan

    usernameInput.disabled =
        true
}


// ==================================================
// RENDER STIKER
// ==================================================

daftarStiker.forEach((url) => {

    const img =
        document.createElement("img")

    img.src = url

    img.classList.add(
        "pilihan-stiker"
    )

    img.onclick = () => {

        kirimStiker(url)

    }

    img.onerror = () => {

        img.style.display =
            "none"

    }

    divDaftarStiker.appendChild(
        img
    )

})


// ==================================================
// TOMBOL STIKER
// ==================================================

tombolStiker.onclick = () => {

    pemilihStiker.classList.toggle(
        "tersembunyi"
    )

}


// ==================================================
// USERNAME
// ==================================================

function dapatkanDanKunciUsername() {

    let username =
        localStorage.getItem(
            "livechat_username"
        )


    if (!username) {

        username =
            usernameInput.value.trim()


        if (!username) {

            alert(
                "Username tidak boleh kosong!"
            )

            return ""

        }


        localStorage.setItem(
            "livechat_username",
            username
        )


        usernameInput.disabled =
            true

    }


    return username

}


// ==================================================
// KIRIM STIKER
// ==================================================

async function kirimStiker(url) {

    const username =
        dapatkanDanKunciUsername()


    if (!username) {
        return
    }


    pemilihStiker.classList.add(
        "tersembunyi"
    )


    try {

        await addDoc(
            messagesCollection,
            {
                username: username,

                idBrowser:
                    idBrowserSekarang,

                message: url,

                waktu:
                    serverTimestamp(),

                tipe: "stiker"
            }
        )

    } catch (error) {

        console.log(
            "Gagal mengirim stiker:",
            error
        )

    }

}


// ==================================================
// KIRIM PESAN
// ==================================================

chatForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault()


        const username =
            dapatkanDanKunciUsername()


        if (!username) {
            return
        }


        const message =
            messageInput.value.trim()


        if (!message) {
            return
        }


        try {

            await addDoc(
                messagesCollection,
                {
                    username: username,

                    idBrowser:
                        idBrowserSekarang,

                    message: message,

                    waktu:
                        serverTimestamp(),

                    tipe: "teks"
                }
            )


            messageInput.value = ""


        } catch (error) {

            console.log(
                "Gagal mengirim pesan:",
                error
            )

        }

    }
)


// ==================================================
// REALTIME PESAN
// ==================================================

const queryPesan =
    query(
        messagesCollection,
        orderBy(
            "waktu",
            "asc"
        )
    )


onSnapshot(
    queryPesan,
    (cuplikan) => {

        // Bersihkan chat
        chatBox.innerHTML = ""


        // Tampilkan semua pesan
        cuplikan.forEach(
            (dokumen) => {

                const data =
                    dokumen.data()


                // Pesan yang waktu-nya belum tersedia
                if (!data.waktu) {
                    return
                }


                const waktu =
                    data.waktu
                        .toDate()
                        .toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )


                const sendiri =
                    data.idBrowser ===
                    idBrowserSekarang


                renderPesan(
                    data.username,
                    data.message,
                    waktu,
                    data.tipe,
                    sendiri
                )

            }
        )


        // ==================================================
        // 🔊 SUARA HANYA UNTUK PESAN BARU
        // ==================================================

        if (!pertamaKali) {

            cuplikan.docChanges()
                .forEach(
                    (perubahan) => {

                        // Hanya pesan yang baru ditambahkan
                        if (
                            perubahan.type !==
                            "added"
                        ) {
                            return
                        }


                        const data =
                            perubahan.doc.data()


                        // Jangan bunyi untuk pesan sendiri
                        if (
                            data.idBrowser !==
                            idBrowserSekarang
                        ) {

                            suaraPesanMasuk
                                .currentTime = 0


                            suaraPesanMasuk
                                .play()
                                .catch(
                                    (error) => {

                                        console.log(
                                            "Browser memblokir suara:",
                                            error
                                        )

                                    }
                                )

                        }

                    }
                )

        }


        // Selesai memuat pertama kali
        pertamaKali = false


        // Scroll ke bawah
        chatBox.scrollTop =
            chatBox.scrollHeight

    }
)


// ==================================================
// RENDER PESAN
// ==================================================

function renderPesan(
    username,
    message,
    waktu,
    tipe = "teks",
    diriSendiri = false
) {

    const messageDiv =
        document.createElement("div")


    messageDiv.classList.add(
        "message-card"
    )


    if (diriSendiri) {

        messageDiv.classList.add(
            "my-message"
        )

    }


    const warnaUser =
        stringToColor(username)


    let isiPesan


    // Kalau stiker
    if (
        tipe === "stiker"
    ) {

        isiPesan =
            `<img src="${message}" alt="stiker" class="stiker" />`

    } else {

        isiPesan =
            `<span>${message}</span>`

    }


    messageDiv.innerHTML = `

        <div class="message-content">

            <strong
                style="color: ${warnaUser}"
            >
                ${username}
            </strong>

            ${isiPesan}

        </div>

        <span class="time">
            ${waktu}
        </span>

    `


    chatBox.appendChild(
        messageDiv
    )

}


// ==================================================
// WARNA USERNAME
// ==================================================

function stringToColor(str) {

    let hash = 0


    for (
        let i = 0;
        i < str.length;
        i++
    ) {

        hash =
            str.charCodeAt(i) +
            ((hash << 5) - hash)

    }


    const hue =
        Math.abs(hash) % 360


    return `hsl(${hue}, 65%, 40%)`

}