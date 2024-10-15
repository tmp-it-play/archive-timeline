const title = document.querySelector(".hello:first-child h1")

function handleTitleClick() {
    const currentColor = title.style.color
    if (currentColor === "blue") {
        title.style.color = "tomato"
    }
    else {
        title.style.color = "blue"
    }
}

title.addEventListener("click", handleTitleClick)