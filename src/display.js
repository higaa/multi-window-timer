const timerDisplay = document.getElementById('timer');
const fullscreenButton = document.getElementById('fullscreenButton');

let endTime;
let counting = false;


function updateDisplay() {
    if (!counting) {
        return;
    }
    const currentTime = Date.now();
    let remainingSeconds = Math.ceil((endTime - currentTime) / 1000);

    const timeString = (() => {
        if (remainingSeconds > 60) {
            return `あと <span class="time">${Math.ceil(remainingSeconds / 60)}</span>分`;
        } else if (remainingSeconds > 0) {
            return `あと <span class="time">${remainingSeconds}</span>秒`;
        } else if (remainingSeconds >= -10) {
            return '終了';
        } else {
            return `超過 <span class="time">${Math.abs(remainingSeconds)}</span>秒`;
        }
    })();

    timerDisplay.innerHTML = timeString;

    if (remainingSeconds > 60) {
        document.body.style.backgroundColor = '#fff'; // 白色
        document.body.style.color = '#000'; // 黒色
    } else if (remainingSeconds > 0) {
        document.body.style.backgroundColor = '#ffff00'; // 黄色
        document.body.style.color = '#000'; // 黒色
    } else {
        document.body.style.backgroundColor = '#ff0000'; // 赤色
        document.body.style.color = '#fff'; // 白色
    }

    while ((endTime - remainingSeconds * 1000) - currentTime <= 0) {
        --remainingSeconds;
    }
    setTimeout(updateDisplay, (endTime - remainingSeconds * 1000) - currentTime);
}

function resetDisplay() {
    timerDisplay.textContent = '';
    document.body.style.backgroundColor = '#fff'; // 白色
    document.body.style.color = '#000'; // 黒色
}

const bcChannel = new BroadcastChannel('multi-window-timer');

bcChannel.onmessage = (event) => {
    console.log('displayWorker.js received:', event.data);
    if (event.data.type === 'updateEndTime') {
        endTime = event.data.endTime;
        if (endTime === 0) {
            counting = false;
            resetDisplay();
        } else {
            counting = true;
            updateDisplay();
        }
    }
};

// 初期表示をlocalStorageから取得
endTime = parseInt(localStorage.getItem('endTime'), 10);
if (isNaN(endTime)) {
    endTime = 0;
}
if (endTime === 0) {
    counting = false;
    resetDisplay();
} else {
    counting = true;
    updateDisplay();
}

// 全画面表示に切り替える関数
function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

// 全画面表示の状態を監視する関数
function checkFullScreen() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        fullscreenButton.style.display = 'none';
    } else {
        fullscreenButton.style.display = 'block';
    }
}

// 全画面表示の変更を監視するイベントリスナーを追加
document.addEventListener('fullscreenchange', checkFullScreen);
document.addEventListener('mozfullscreenchange', checkFullScreen);
document.addEventListener('webkitfullscreenchange', checkFullScreen);
document.addEventListener('msfullscreenchange', checkFullScreen);

// ボタンをクリックして全画面表示に切り替える
fullscreenButton.addEventListener('click', () => {
    requestFullScreen(document.documentElement);
});