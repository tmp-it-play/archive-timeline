const playMiniBox = document.querySelector('#play-mini-box');
const mouseHoverBox = document.querySelector('#mouse-hover-box');
playMiniBox.addEventListener('mouseover', () => {
    mouseHoverBox.classList.add('show');
});

playMiniBox.addEventListener('mouseout', () => {
    mouseHoverBox.classList.remove('show');
});