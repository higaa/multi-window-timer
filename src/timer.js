const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const openDisplayButton = document.getElementById('openDisplayButton');
const timeInput = document.getElementById('timeInput');
const timerDisplay = document.getElementById('timerDisplay');

let endTime;
let counting = false;

// 表示ウィンドウを開くボタンのクリックイベント
openDisplayButton.addEventListener('click', () => {
    window.open('display.html', '_blank', 'width=600,height=400');
});

const bcChannel = new BroadcastChannel('multi-window-timer');

startButton.addEventListener('click', () => {
    const duration = parseInt(timeInput.value) * 60000;
    endTime = Date.now() + duration;
    localStorage.setItem('endTime', endTime);
    bcChannel.postMessage({ type: 'updateEndTime', endTime });
    console.log('postMessage', { type: 'updateEndTime', endTime });

    counting = true;
    updateDisplay();
});

stopButton.addEventListener('click', () => {
    localStorage.setItem('endTime', 0);
    endTime = 0;
    counting = false;
    resetDisplay();

    bcChannel.postMessage({ type: 'updateEndTime', endTime: 0 });
});

endTime = parseInt(window.localStorage.getItem('endTime'), 10);
if (isNaN(endTime)) {
    endTime = 0;
}

if (endTime === 0) {
    resetDisplay();
} else {
    counting = true;
    updateDisplay();
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

    


    while ((endTime - remainingSeconds * 1000) - currentTime <= 0) {
        --remainingSeconds;
    }
    setTimeout(updateDisplay, (endTime - remainingSeconds * 1000) - currentTime);
}

function resetDisplay() {
    timerDisplay.textContent = '';
}



