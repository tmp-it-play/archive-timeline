const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const color = document.getElementById("color");
const modeBtn = document.getElementById("mode-btn");
const destoryBtn = document.getElementById("destory-btn");
const EraseBtn = document.getElementById("eraser-btn");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;
function onMove(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function onMousedown(event) {
    isPainting = true;
}

function cancelPainting(event) {
    isPainting = false;
}

function onCanvasClick() {
    if (isFilling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

canvas.addEventListener("dblclick", () => {
    const text = textInput.value;
    if (text !== "") {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "48px serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore();
    }
});
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMousedown);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

lineWidth.addEventListener("change", (event) => {
    ctx.lineWidth = event.target.value;
});

color.addEventListener("change", (event) => {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
});

colorOptions.forEach(element => {
    element.addEventListener("click", (event) => {
        const selectedColor = event.target.dataset.color;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        color.value = selectedColor;
    });
});

modeBtn.addEventListener("click", () => {
    if (isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    }
    else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
});

destoryBtn.addEventListener("click", () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

EraseBtn.addEventListener("click", () => {
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
    ctx.fillStyle = "white";
    color.value = "white";
});

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            fileInput.value = null;
        }
    }
    reader.readAsDataURL(file);
});