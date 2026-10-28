// --- LOGIKA LOCK SCREEN & PASSCODE ---
const lockScreen = document.getElementById("lockscreen");
const passcodeScreen = document.getElementById("passcode-screen");
const chatScreen = document.getElementById("chat-screen");
const pinDots = document.querySelectorAll(".pin-dots .dot");
const errorMsg = document.getElementById("error-msg");

let enteredPin = "";
const correctPin = "00000"; // Password sesuai permintaan

// Geser ke atas / klik pada Lock Screen untuk pindah ke Passcode
lockScreen.addEventListener("click", () => {
    lockScreen.classList.remove("active");
    passcodeScreen.classList.add("active");
});

// Fungsi saat tombol angka keypad ditekan
function pressKey(num) {
    if (enteredPin.length < 5) {
        enteredPin += num;
        updateDots();
        
        if (enteredPin.length === 5) {
            checkPin();
        }
    }
}

// Fungsi tombol hapus (⌫)
function deleteKey() {
    enteredPin = enteredPin.slice(0, -1);
    updateDots();
    errorMsg.textContent = "";
}

// Update tampilan titik PIN
function updateDots() {
    pinDots.forEach((dot, index) => {
        if (index < enteredPin.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

// Cek apakah PIN '00000' benar
function checkPin() {
    if (enteredPin === correctPin) {
        // PIN benar, masuk ke Chat Screen dan mulai cerita
        passcodeScreen.classList.remove("active");
        chatScreen.classList.add("active");
        loadScene("start");
    } else {
        // PIN salah
        errorMsg.textContent = "Passcode Salah";
        setTimeout(() => {
            enteredPin = "";
            updateDots();
            errorMsg.textContent = "";
        }, 800);
    }
}


// --- LOGIKA CERITA INTERAKTIF (AU) ---
const storyData = {
    start: [
        { type: "received", text: "sel" },
        { 
            choices: [
                { text: "apa?", nextScene: "scene_1" }
            ]
        }
    ],

    scene_1: [
        { type: "sent", text: "apa?" },
        { type: "received", text: "ini emang rapatnya gini ya?" },
        { type: "received", text: "banyak bercanda jir" },
        { type: "received", text: "apalagi si surya, erak sama kak jeri" },
        { 
            choices: [
                { text: "udah biasa lik", nextScene: "scene_2" }
            ]
        }
    ],

    scene_2: [
        { type: "sent", text: "udah biasa lik" },
        { type: "received", text: "owalah" },
        { type: "received", text: "gue takut dicap gak kerja sih" },
        { 
            choices: [
                { text: "tenang aja", nextScene: "scene_3" }
            ]
        }
    ],

    scene_3: [
        { type: "sent", text: "tenang aja" },
        { type: "sent", text: "yang udh pasti gak kerja mah si surya sama erik" },
        { type: "received", text: "wkwkwk parah lo sel" },
        { 
            choices: [
                { text: "eh tadi lo kumpulan hima ngapain aja? ada yovan kan?", nextScene: "scene_4" }
            ]
        }
    ],

    scene_4: [
        { type: "sent", text: "eh tadi lo kumpulan hima ngapain aja? ada yovan kan?" },
        { type: "received", text: "ada sel" }
    ]
};

const chatBody = document.getElementById("chat-body");
const choicesContainer = document.getElementById("choices-container");
const bgm = document.getElementById("bgm");
const bgmBtn = document.getElementById("bgm-toggle");

let isPlaying = false;
bgmBtn.addEventListener("click", () => {
    if (isPlaying) {
        bgm.pause();
        bgmBtn.textContent = "🎵 BGM";
    } else {
        bgm.play();
        bgmBtn.textContent = "⏸️ Pause BGM";
    }
    isPlaying = !isPlaying;
});

function loadScene(sceneKey) {
    choicesContainer.innerHTML = "";
    const messages = storyData[sceneKey];
    if (!messages) return;

    let delay = 0;
    messages.forEach((msg) => {
        setTimeout(() => {
            if (msg.choices) {
                showChoices(msg.choices);
            } else {
                appendMessage(msg.type, msg.text);
            }
        }, delay);
        delay += 1000;
    });
}

function appendMessage(type, text) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type);
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showChoices(choices) {
    choices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.classList.add("choice-btn");
        btn.textContent = choice.text;
        btn.onclick = () => loadScene(choice.nextScene);
        choicesContainer.appendChild(btn);
    });
}