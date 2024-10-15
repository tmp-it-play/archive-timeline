const title = document.querySelector(".hello:first-child h1")

function handleTitleClick() {
    console.log(title)
    const clickedClass = "active"
    if (title.classList.contains(clickedClass)) {
        title.classList.remove(clickedClass)
    }
    else {
        title.classList.add(clickedClass)
    }
}

title.addEventListener("click", handleTitleClick)