const playMiniBox = document.querySelector('#play-mini-box');
const mouseHoverBox = document.querySelector('#mouse-hover-box');
playMiniBox.addEventListener('mouseover', () => {
    mouseHoverBox.classList.add('show');
});

playMiniBox.addEventListener('mouseout', () => {
    mouseHoverBox.classList.remove('show');
});

const rangeInput = document.querySelector('input[type="range"]');

rangeInput.addEventListener('input', function () {
    const value = (this.value - this.min) / (this.max - this.min) * 100;
    this.style.setProperty('--value', `${value}%`);
});

const sidebarBtns = document.getElementsByClassName('sidebar-btn');
let activeBtn = null;
Array.prototype.forEach.call(sidebarBtns, function (btn) {
    btn.addEventListener('click', function () {
        if (activeBtn) {
            activeBtn.style.backgroundColor = '#f9f9f9';
        }
        btn.style.backgroundColor = '#e0e0e0';
        activeBtn = btn;
    });
});

const lyricsBtn = document.getElementById('lyrics-btn');
const lyricsBtnBox = document.getElementById('lyrics-btn-box');
const lyricsBox = document.getElementById('lyrics-container');
let isAtive = false
lyricsBtnBox.addEventListener('click', function () {
    if (isAtive) {
        lyricsBtnBox.style.backgroundColor = '';
        lyricsBtn.style.fill = '';
        lyricsBox.style.width = '0px';
        isAtive = false;
    } else {
        lyricsBtnBox.style.backgroundColor = '#6c6c6c';
        lyricsBtn.style.fill = '#fff';
        lyricsBox.style.width = '1200px';
        isAtive = true
    }
});