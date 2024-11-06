canvas_page_code = r"""
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas</title>
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
    <style>
        html,
        body,
        div,
        span,
        applet,
        object,
        iframe,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        blockquote,
        pre,
        a,
        abbr,
        acronym,
        address,
        big,
        cite,
        code,
        del,
        dfn,
        em,
        img,
        ins,
        kbd,
        q,
        s,
        samp,
        small,
        strike,
        strong,
        sub,
        sup,
        tt,
        var,
        b,
        u,
        i,
        center,
        dl,
        dt,
        dd,
        ol,
        ul,
        li,
        fieldset,
        form,
        label,
        legend,
        table,
        caption,
        tbody,
        tfoot,
        thead,
        tr,
        th,
        td,
        article,
        aside,
        canvas,
        details,
        embed,
        figure,
        figcaption,
        footer,
        header,
        hgroup,
        menu,
        nav,
        section {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
        }

        article,
        aside,
        details,
        figcaption,
        figure,
        footer,
        header,
        hgroup,
        menu,
        nav,
        section {
            display: block;
        }

        .fold-hide {
            transform: scaleY(0);
            transform-origin: top;
            height: 0;
            opacity: 0;
            transition: transform 0.3s ease, height 0.3s ease, opacity 0.3s ease;
        }



        body {
            scrollbar-width: 0px;
            line-height: 1;
            display: flex;
            gap: 20px;
            justify-content: center;
            align-items: flex-start;
            background-color: gainsboro;
            padding: 20px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        ol,
        ul {
            list-style: none;
        }

        blockquote,
        q {
            quotes: none;
        }

        blockquote:before,
        blockquote:after,
        q:before,
        q:after {
            content: '';
            content: none;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
        }

        canvas {
            width: 630px;
            height: 630px;
            background-color: white;
            border-radius: 10px;
            position: relative;
        }

        .btns {
            display: flex;
            flex-direction: column;
            gap: 20px;
            transition: all 0.5s ease;
        }

        .color-options {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
        }

        .color-option-setting-btn {
            width: 50px;
            height: 50px;
            border-radius: 50px;
            cursor: pointer;
            background-color: white;
            border: 5px solid white;
            transition: transform ease-in-out .1s;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .color-option-setting-btn:hover {
            transform: scale(1.2);
        }

        #color-option-setting-btn-img {
            width: 30px;
            z-index: 10;
            position: relative;
            top: 0;
            left: 0;
        }

        .color-option {
            width: 50px;
            height: 50px;
            border-radius: 50px;
            cursor: pointer;
            border: 5px solid white;
            transition: transform ease-in-out .1s;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .color-option:hover {
            transform: scale(1.2);
        }

        input#color {
            background-color: white;
        }

        button {
            all: unset;
            padding: 10px 0px;
            text-align: center;
            background-color: royalblue;
            color: white;
            font-weight: 500;
            border-radius: 10px;
            cursor: pointer;
            transition: opacity ease-in-out .1s, transform 0.5s ease;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        button:hover {
            opacity: 0.85;
        }

        .fold-hide {
            transform: scaleY(0);
            transform-origin: top;
            height: 0;
            opacity: 0;
        }

        input#text {
            all: unset;
            padding: 10px 0px;
            background-color: white;
            font-weight: 500;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        input#file {
            display: none;
        }

        label {
            all: unset;
            padding: 10px 0px;
            background-color: royalblue;
            color: white;
            font-weight: 500;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.5s ease;
        }
    </style>
</head>

<body>
    <div class="color-options">
        <input id="color" type="color" />
        <div class="color-option" style="background-color: #1abc9c;" data-color="#1abc9c"></div>
        <div class="color-option" style="background-color: #3498db;" data-color="#3498db"></div>
        <div class="color-option" style="background-color: #34495e;" data-color="#34495e"></div>
        <div class="color-option" style="background-color: #27ae60;" data-color="#27ae60"></div>
        <div class="color-option" style="background-color: #8e44ad;" data-color="#8e44ad"></div>
        <div class="color-option" style="background-color: #f1c40f;" data-color="#f1c40f"></div>
        <div class="color-option" style="background-color: #e74c3c;" data-color="#e74c3c"></div>
        <div class="color-option-setting-btn">
            <img src="{{ url_for('static', filename='setting-btn-img.png') }}" alt="이미지 로딩 실패"
                id="color-option-setting-btn-img">
        </div>
    </div>
    <canvas></canvas>
    <div class="btns">
        <span id="line-width-label">Pencil Width</span>
        <input id="line-width" type="range" min="1" max="10" value="5" step="0.2" />
        <button id="mode-btn">🩸Fill</button>
        <button id="destory-btn">💣Destory</button>
        <button id="eraser-btn">❌Erase</button>
        <button id="undo-btn">⏪Undo</button>
        <button id="redo-btn">⏩Redo</button>
        <label for="file" id="file-label">
            📁Upload Image
            <input type="file" accept="image/*" id="file" />
        </label>
        <input type="text" id="text" placeholder="Add text here... :)" />
        <button id="save">🖼️Save Image</button>
        <button id="share-btn">🚀Share Image</button>
        <button id="toggle-mode-btn">🖌️ Toggle Edit Mode</button>
    </div>
    <script>

        const colorOptions = Array.from(document.getElementsByClassName("color-option"));
        const colorSettingBtn = document.querySelector(".color-option-setting-btn");
        const originalColors = colorOptions.map(element => element.dataset.color);

        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let holdTimeout;

        colorSettingBtn.addEventListener("mousedown", () => {
            colorOptions.forEach(element => {
                const randomColor = getRandomColor();
                element.style.backgroundColor = randomColor;
                element.dataset.color = randomColor;
            });
            holdTimeout = setTimeout(() => {
                colorOptions.forEach((element, index) => {
                    element.style.backgroundColor = originalColors[index];
                    element.dataset.color = originalColors[index];
                });
            }, 1000);
        });

        colorSettingBtn.addEventListener("mouseup", () => {
            clearTimeout(holdTimeout);
        });

        colorSettingBtn.addEventListener("mouseleave", () => {
            clearTimeout(holdTimeout);
        });

        const textInput = document.getElementById("text");
        const fileInput = document.getElementById("file");
        const saveBtn = document.getElementById("save");
        const shareBtn = document.getElementById("share-btn");
        const color = document.getElementById("color");
        const modeBtn = document.getElementById("mode-btn");
        const destoryBtn = document.getElementById("destory-btn");
        const EraseBtn = document.getElementById("eraser-btn");
        const undoBtn = document.getElementById("undo-btn");
        const redoBtn = document.getElementById("redo-btn");
        const lineWidth = document.getElementById("line-width");
        const lineWidthLabel = document.getElementById("line-width-label");
        const fileLabel = document.getElementById("file-label");
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const toggleModeBtn = document.getElementById("toggle-mode-btn");
        canvas.width = 630;
        canvas.height = 630;
        ctx.lineWidth = lineWidth.value;
        ctx.lineCap = "round";
        let isPainting = false;
        let isFilling = false;
        let stickers = [];
        let currentSticker = null;
        let resizingSticker = false;
        let undoStack = [];
        let redoStack = [];
        let isThrottling = false;
        let isEditMode = false;

        modeBtn.style.display = "block";
        lineWidth.style.display = "block";
        lineWidthLabel.style.display = "block";
        EraseBtn.style.display = "block";
        fileLabel.style.display = "none";
        modeBtn.classList.remove("fold-hide");
        lineWidth.classList.remove("fold-hide");
        lineWidthLabel.classList.remove("fold-hide");
        EraseBtn.classList.remove("fold-hide");

        toggleModeBtn.addEventListener("click", () => {
            isEditMode = !isEditMode;
            toggleModeBtn.innerText = isEditMode ? "✏️ Drawing Mode" : "🖌️ Edit Mode";
            toggleVisibility();
        });
        function toggleVisibility() {
            if (isEditMode) {
                modeBtn.classList.add("fold-hide");
                lineWidth.classList.add("fold-hide");
                lineWidthLabel.classList.add("fold-hide");
                EraseBtn.classList.add("fold-hide");
                setTimeout(() => {
                    modeBtn.style.display = "none";
                    lineWidth.style.display = "none";
                    lineWidthLabel.style.display = "none";
                    EraseBtn.style.display = "none";
                    fileLabel.style.display = "block";
                }, 5);
            } else {
                modeBtn.style.display = "block";
                lineWidth.style.display = "block";
                lineWidthLabel.style.display = "block";
                EraseBtn.style.display = "block";
                fileLabel.style.display = "none";
                setTimeout(() => {
                    modeBtn.classList.remove("fold-hide");
                    lineWidth.classList.remove("fold-hide");
                    lineWidthLabel.classList.remove("fold-hide");
                    EraseBtn.classList.remove("fold-hide");
                }, 5);
            }
        }

        window.addEventListener("load", () => {
            const savedColor = localStorage.getItem("color");
            const savedLineWidth = localStorage.getItem("lineWidth");
            if (savedColor) {
                ctx.strokeStyle = savedColor;
                ctx.fillStyle = savedColor;
                color.value = savedColor;
            }
            if (savedLineWidth) {
                ctx.lineWidth = savedLineWidth;
                lineWidth.value = savedLineWidth;
            }
        });

        function saveState() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            undoStack.push(imageData);
            redoStack = [];
        }

        function onMove(event) {
            if (isThrottling || isEditMode) return;
            isThrottling = true;
            if (isPainting) {
                ctx.lineTo(event.offsetX, event.offsetY);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(event.offsetX, event.offsetY);
            requestAnimationFrame(() => {
                isThrottling = false;
            });
        }

        function onMousedown(event) {
            if (!isEditMode) {
                isPainting = true;
                saveState();
            }
        }

        function cancelPainting(event) {
            if (!isEditMode) {
                isPainting = false;
            }
        }

        function onCanvasClick() {
            if (isFilling && !isEditMode) {
                saveState();
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                stickers = [];
            }
        }

        saveBtn.addEventListener("click", (event) => {
            const characters = '0987654321qwertyuiopasdfghjklzxcvbnm';
            const image = canvas.toDataURL();
            const link = document.createElement("a");
            link.href = image;
            const num = 9;
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < num; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            link.download = result + ".png";
            link.click();
        })

        canvas.addEventListener("dblclick", (event) => {
            if (!isEditMode) {
                const text = textInput.value;
                if (text !== "") {
                    ctx.save();
                    ctx.lineWidth = 1;
                    ctx.font = "48px serif";
                    ctx.fillText(text, event.offsetX, event.offsetY);
                    ctx.restore();
                    saveState();
                }
            }
        });
        canvas.addEventListener("click", onCanvasClick);
        canvas.addEventListener("mousemove", onMove);
        canvas.addEventListener("mousedown", onMousedown);
        canvas.addEventListener("mouseup", cancelPainting);
        canvas.addEventListener("mouseleave", cancelPainting);

        lineWidth.addEventListener("change", (event) => {
            ctx.lineWidth = event.target.value;
            localStorage.setItem("lineWidth", event.target.value);
        });

        color.addEventListener("change", (event) => {
            ctx.strokeStyle = event.target.value;
            ctx.fillStyle = event.target.value;
            localStorage.setItem("color", event.target.value);
        });

        colorOptions.forEach(element => {
            element.addEventListener("click", (event) => {
                const selectedColor = event.target.dataset.color;
                ctx.strokeStyle = selectedColor;
                ctx.fillStyle = selectedColor;
                color.value = selectedColor;
                localStorage.setItem("color", selectedColor);
            });
        });

        modeBtn.addEventListener("click", () => {
            if (isFilling) {
                isFilling = false;
                modeBtn.innerText = "🩸Fill";
            }
            else {
                isFilling = true;
                modeBtn.innerText = "🖌️Draw";
            }
        });

        destoryBtn.addEventListener("click", () => {
            saveState();
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            stickers = [];
        });

        EraseBtn.addEventListener("click", () => {
            ctx.strokeStyle = "white";
            isFilling = false;
            modeBtn.innerText = "🩸Fill";
            ctx.fillStyle = "white";
            color.value = "white";
            localStorage.setItem("color", "white");
        });

        fileInput.addEventListener("change", (event) => {
            if (isEditMode) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = () => {
                        stickers.push({ img: img, x: 0, y: 0, width: img.width / 2, height: img.height / 2 });
                        drawStickers();
                        saveState();
                        fileInput.value = null;
                    }
                }
                reader.readAsDataURL(file);
            }
        });

        canvas.addEventListener("mousedown", (event) => {
            if (isEditMode) {
                const { offsetX, offsetY } = event;
                for (let i = stickers.length - 1; i >= 0; i--) {
                    const sticker = stickers[i];
                    if (offsetX > sticker.x && offsetX < sticker.x + sticker.width && offsetY > sticker.y && offsetY < sticker.y + sticker.height) {
                        if (event.ctrlKey) {
                            resizingSticker = true;
                            resizingSticker = true;
                            currentSticker = sticker;
                        } else {
                            currentSticker = sticker;
                            canvas.addEventListener("mousemove", moveSticker);
                        }
                        break;
                    }
                }
            }
        });

        window.addEventListener("mouseup", () => {
            currentSticker = null;
            resizingSticker = false;
            canvas.removeEventListener("mousemove", moveSticker);
            canvas.removeEventListener("mousemove", resizeSticker);
        });

        canvas.addEventListener("mousemove", (event) => {
            if (resizingSticker && currentSticker) {
                resizeSticker(event);
            }
        });

        function moveSticker(event) {
            if (currentSticker && !resizingSticker) {
                currentSticker.x = event.offsetX - currentSticker.width / 2;
                currentSticker.y = event.offsetY - currentSticker.height / 2;
                drawStickers();
            }
        }

        function resizeSticker(event) {
            if (currentSticker) {
                currentSticker.width = event.offsetX - currentSticker.x;
                currentSticker.height = event.offsetY - currentSticker.y;
                drawStickers();
            }
        }

        function drawStickers() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stickers.forEach(sticker => {
                ctx.drawImage(sticker.img, sticker.x, sticker.y, sticker.width, sticker.height);
            });
        }

        undoBtn.addEventListener("click", () => {
            undoAction();
        });

        redoBtn.addEventListener("click", () => {
            redoAction();
        });

        window.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === 'z') {
                event.preventDefault();
                undoAction();
            } else if (event.ctrlKey && event.key === 'y') {
                event.preventDefault();
                redoAction();
            }
        });

        function undoAction() {
            if (undoStack.length > 0) {
                const previousState = undoStack.pop();
                redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                ctx.putImageData(previousState, 0, 0);
                drawStickers();
            }
        }

        function redoAction() {
            if (redoStack.length > 0) {
                const nextState = redoStack.pop();
                undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                ctx.putImageData(nextState, 0, 0);
                drawStickers();
            }
        }
        shareBtn.addEventListener("click", () => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("Failed to capture the canvas.");
                    return;
                }
                const formData = new FormData();
                formData.append("file", blob, "canvas_image.png");
                fetch("http://localhost:5000/upload", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            alert(`Error: ${data.error}`);
                        } else {
                            alert("Image uploaded successfully!");
                            console.log("File path:", data.filepath);
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert("Failed to upload the image.");
                    });
            });
        });


        presetBtn && presetBtn.addEventListener("click", () => {
            const newPresets = [
                "#ff5733",
                "#33ff57",
                "#3357ff",
                "#ff33a6",
                "#a633ff",
                "#33fff0"
            ];

            colorOptions.forEach((element, index) => {
                if (index < newPresets.length) {
                    element.style.backgroundColor = newPresets[index];
                    element.dataset.color = newPresets[index];
                }
            });
        });
    </script>
</body>

</html>
"""