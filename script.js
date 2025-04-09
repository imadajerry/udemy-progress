const TOTAL_MINUTES = 1795;

const minutesInput = document.getElementById('minutesInput');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const remainingText = document.getElementById('remainingText');
const progressForm = document.getElementById('progressForm');

// Load saved progress
let completedMinutes = parseInt(localStorage.getItem('completedMinutes')) || 0;

function updateProgress() {
    const remaining = Math.max(TOTAL_MINUTES - completedMinutes, 0);
    const percentage = Math.min((completedMinutes / TOTAL_MINUTES) * 100, 100).toFixed(1);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
    remainingText.innerHTML = `Jerry has <b>${remaining} minutes</b> of content left to complete.`;
}

progressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newMinutes = parseInt(minutesInput.value);
    if (!isNaN(newMinutes) && newMinutes > 0) {
        completedMinutes += newMinutes;
        localStorage.setItem('completedMinutes', completedMinutes);
        updateProgress();
        minutesInput.value = '';
    }
});

updateProgress(); // initialize on load
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset your progress?")) {
        completedMinutes = 0;
        localStorage.removeItem('completedMinutes');
        updateProgress();
    }
});