const TOTAL_MINUTES = 1795;
let completedMinutes = 0;
const userId = "sharedUser"; // You can customize this later

const minutesInput = document.getElementById('minutesInput');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const remainingText = document.getElementById('remainingText');
const progressForm = document.getElementById('progressForm');
const resetBtn = document.getElementById('resetBtn');

function updateProgressBar(minutes) {
    const remaining = Math.max(TOTAL_MINUTES - minutes, 0);
    const percentage = Math.min((minutes / TOTAL_MINUTES) * 100, 100).toFixed(1);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
    remainingText.textContent = `You have ${remaining} minutes left.`;
}

async function loadProgress() {
    const docRef = doc(db, "progress", userId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
    completedMinutes = snapshot.data().completedMinutes || 0;
    updateProgressBar(completedMinutes);
    } else {
    await setDoc(docRef, { completedMinutes: 0 });
    }
}

async function saveProgress(minutes) {
    const docRef = doc(db, "progress", userId);
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

// Initial load
loadProgress();