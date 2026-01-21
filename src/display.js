// ========================================
// DOM要素の取得
// ========================================
const timerDisplay = document.getElementById('timer');

// ウィンドウ表示用ボタン
const windowControls = document.getElementById('windowControls');
const windowFontDecreaseButton = document.getElementById('windowFontDecreaseButton');
const windowFontIncreaseButton = document.getElementById('windowFontIncreaseButton');
const windowFullscreenButton = document.getElementById('windowFullscreenButton');

// 全画面表示用ボタン
const fullscreenControlsContainer = document.getElementById('fullscreenControlsContainer');
const fullscreenFontDecreaseButton = document.getElementById('fullscreenFontDecreaseButton');
const fullscreenFontIncreaseButton = document.getElementById('fullscreenFontIncreaseButton');
const fullscreenExitButton = document.getElementById('fullscreenExitButton');

// ========================================
// グローバル変数
// ========================================
let endTime = 0;
let counting = false;
let hideButtonTimeout = null;
let currentFontSize = 10; // vw単位

// ========================================
// タイマー表示関連
// ========================================
function updateDisplay() {
    if (!counting) return;

    const currentTime = Date.now();
    const remainingSeconds = Math.ceil((endTime - currentTime) / 1000);

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
    updateBackgroundColor(remainingSeconds);

    const delay = (endTime - remainingSeconds * 1000) - currentTime;
    if (delay > 0) {
        setTimeout(updateDisplay, delay);
    }
}

function updateBackgroundColor(remainingSeconds) {
    if (remainingSeconds > 60) {
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#000';
    } else if (remainingSeconds > 0) {
        document.body.style.backgroundColor = '#ffff00';
        document.body.style.color = '#000';
    } else {
        document.body.style.backgroundColor = '#ff0000';
        document.body.style.color = '#fff';
    }
}

function resetDisplay() {
    timerDisplay.textContent = '';
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
}

// ========================================
// 全画面表示関連
// ========================================
function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function isFullscreen() {
    return document.fullscreenElement || document.mozFullScreenElement || 
           document.webkitFullscreenElement || document.msFullscreenElement;
}



// ========================================
// フォントサイズ調整
// ========================================
function changeFontSize(delta) {
    currentFontSize = Math.max(5, Math.min(20, currentFontSize + delta));
    timerDisplay.style.fontSize = currentFontSize + 'vw';
    localStorage.setItem('fontSize', currentFontSize);
}

function loadFontSize() {
    const saved = localStorage.getItem('fontSize');
    if (saved) {
        currentFontSize = parseFloat(saved);
        timerDisplay.style.fontSize = currentFontSize + 'vw';
    }
}

// ========================================
// イベントリスナー
// ========================================
// ウィンドウ表示用ボタン
windowFontDecreaseButton.addEventListener('click', () => changeFontSize(-1));
windowFontIncreaseButton.addEventListener('click', () => changeFontSize(1));
windowFullscreenButton.addEventListener('click', () => requestFullScreen(document.documentElement));

// 全画面表示用ボタン
fullscreenFontDecreaseButton.addEventListener('click', () => changeFontSize(-1));
fullscreenFontIncreaseButton.addEventListener('click', () => changeFontSize(1));
fullscreenExitButton.addEventListener('click', exitFullScreen);

function updateControlsDisplay() {
    if (isFullscreen()) {
        fullscreenControlsContainer.style.display = 'flex';
    } else {
        fullscreenControlsContainer.style.display = 'none';
    }
}

document.addEventListener('fullscreenchange', updateControlsDisplay);
document.addEventListener('mozfullscreenchange', updateControlsDisplay);
document.addEventListener('webkitfullscreenchange', updateControlsDisplay);
document.addEventListener('msfullscreenchange', updateControlsDisplay);

// ========================================
// BroadcastChannel通信
// ========================================
const bcChannel = new BroadcastChannel('multi-window-timer');

bcChannel.onmessage = (event) => {
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

// ========================================
// 初期化
// ========================================
function initialize() {
    // localStorageからタイマー状態を取得
    const saved = localStorage.getItem('endTime');
    endTime = (saved && !isNaN(saved)) ? parseInt(saved, 10) : 0;

    // フォントサイズを復元
    loadFontSize();

    // 初期表示
    if (endTime === 0) {
        counting = false;
        resetDisplay();
    } else {
        counting = true;
        updateDisplay();
    }
}

initialize();