const title = document.querySelector(".hello:first-child h1")
title.onmousedown = (event) => {
    event.preventDefault();
}

title.ondragstart = (event) => {
    event.preventDefault();
}

let checker = false
let count = 0;
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

function clickCounter(){
    count += 1;
    const countOutput = document.querySelectorAll(".hello h1")[1]
    countOutput.innerText = "Count: " + count.toString()
}
title.addEventListener("click", handleTitleClick)