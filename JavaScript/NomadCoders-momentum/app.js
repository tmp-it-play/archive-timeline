const title = document.querySelector(".hello:first-child h1")

title.onmousedown = (event) => {
    event.preventDefault();
}

title.ondragstart = (event) => {
    event.preventDefault();
}

let checker = false
let count = 0

function handleTitleClick() {
    if(checker === false){
        title.innerText = "Title is Click!"
        clickCounter()
        checker = true
    }
    else {
        title.innerText = "Grab me!"
        clickCounter()
        checker = false
    }
}

function handleTitleHover() {
    let currentSize = window.getComputedStyle(title).fontSize;
    title.style.fontSize = parseFloat(currentSize) + 25 + "px";
}

function handleTitleMouseLeave() {
    let currentSize = window.getComputedStyle(title).fontSize;
    title.style.fontSize = parseFloat(currentSize) - 25 + "px";
}

function clickCounter(){
    count += 1;
    const countOutput = document.querySelectorAll(".hello h1")[1]
    countOutput.innerText = "Count: " + count.toString()
}

function handleWindowResize() {
    document.body.style.backgroundColor = "tomato"
}

function handleWindowCopy() {
    alert("First alert!");
    alert("Second alert!");
    alert("Third alert!");
}

title.addEventListener("click", handleTitleClick)
title.addEventListener("mouseover", handleTitleHover)
title.addEventListener("mouseout", handleTitleMouseLeave)
window.addEventListener("resize", handleWindowResize)
window.addEventListener("copy", handleWindowCopy)