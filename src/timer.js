const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const timeInput = document.getElementById('timeInput');
const timerDisplay = document.getElementById('timerDisplay');

let endTime;

let counting = false;

startButton.addEventListener('click', () => {
    const duration = parseInt(timeInput.value) * 60000;

    endTime = Date.now() + duration;
    localStorage.setItem('endTime', endTime);
    counting = true;
    updateDisplay();
});

stopButton.addEventListener('click', () => {
    localStorage.setItem('endTime', 0);
    endTime = 0;
    counting = false;
    resetDisplay();
});

endTime = parseInt(window.localStorage.getItem('endTime'), 10);
if (!isNaN(endTime)) {
    if (endTime === 0) {
        resetDisplay();
    } else {
        counting = true;
        updateDisplay();
    }
}
function updateDisplay() {
    if (!counting) {
        return;
    }
    const currentTime = Date.now();
    let remainingSeconds = Math.ceil((endTime - currentTime) / 1000);

    const timeString = (() => {
        if (remainingSeconds > 0) {
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            return `残り時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `終了 超過 ${Math.abs(remainingSeconds)}秒`;
        }
    })();

    timerDisplay.textContent = timeString;



    
    while ((endTime - remainingSeconds * 1000) -  currentTime <= 0) {
        --remainingSeconds;
    }
    setTimeout(updateDisplay, (endTime - remainingSeconds * 1000) -  currentTime);
}

function resetDisplay() {
    timerDisplay.textContent = '残り時間: 00:00';
}