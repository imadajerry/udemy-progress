import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const auth = getAuth(app);

const loginBtn = document.getElementById("google-login");
const logoutBtn = document.getElementById("logout");
const userInfo = document.getElementById("user-info");

const provider = new GoogleAuthProvider();

loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Signed in:", result.user);
    })
    .catch(err => console.error(err));
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("Logged out");
  });
});

onAuthStateChanged(auth, user => {
  if (user) {
    userInfo.textContent = `Logged in as: ${user.displayName || user.email}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    initFirestoreForUser(user.uid); // 👈 Hook your progress tracking to their ID
  } else {
    userInfo.textContent = "Not logged in";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyBydkLqBW6p9Dyy47ScQ70SCcgsJSls15E",
  authDomain: "udemy-progress-tracker.firebaseapp.com",
  projectId: "udemy-progress-tracker",
  storageBucket: "udemy-progress-tracker.firebasestorage.app",
  messagingSenderId: "3945093779",
  appId: "1:3945093779:web:bc23ee2f274f0af27dcb66",
  measurementId: "G-CQTLNY509X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOTAL_MINUTES = 1795;
let completedMinutes = 0;
const userId = "sharedUser";

const minutesInput = document.getElementById('minutesInput');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const remainingText = document.getElementById('remainingText');
const progressForm = document.getElementById('progressForm');
const resetBtn = document.getElementById('resetBtn');

function updateProgressBar(minutes) {
  const remaining = Math.max(TOTAL_MINUTES - minutes, 0);
  const percentage = Math.min((minutes / TOTAL_MINUTES) * 100, 100).toFixed(2);
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}%`;
  remainingText.textContent = `You have ${remaining} minutes left.`;
}

async function loadProgress() {
  const docRef = doc(db, "progress", "sharedUser");
  try {
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        completedMinutes = snapshot.data().completedMinutes || 0;
        updateProgressBar(completedMinutes);
      } else {
        await setDoc(docRef, { completedMinutes: 0 });
      }
  } catch (err) {
    console.error("Error getting document:", err);
  }
}

async function saveProgress(minutes) {
  const docRef = doc(db, "progress", "sharedUser");
  await setDoc(docRef, { completedMinutes: minutes });
}

progressForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newMinutes = parseInt(minutesInput.value);
  if (!isNaN(newMinutes) && newMinutes > 0) {
    completedMinutes += newMinutes;
    await saveProgress(completedMinutes);
    updateProgressBar(completedMinutes);
    minutesInput.value = '';
  }
});

resetBtn.addEventListener('click', async () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    completedMinutes = 0;
    await saveProgress(0);
    updateProgressBar(0);
  }
});

loadProgress();
