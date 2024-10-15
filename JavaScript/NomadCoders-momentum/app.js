const title = document.querySelector(".hello:first-child h1")

function handleTitleClick() {
    console.log(title)
    const clickedClass = "active"
    title.classList.toggle(clickedClass)
}

title.addEventListener("click", handleTitleClick)