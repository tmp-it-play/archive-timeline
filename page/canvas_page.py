canvas_page_code = """
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meme Maker</title>
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

        body {
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
            width: 800px;
            height: 800px;
            background-color: white;
            border-radius: 10px;
        }

        .btns {
            display: flex;
            flex-direction: column;
            gap: 20px
        }

        .color-options {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
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
            transition: opacity ease-in-out .1s;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        button:hover {
            opacity: 0.85;
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
        <div class="color-option" style="background-color: #95a5a6;" data-color="#95a5a6"></div>
        <div class="color-option" style="background-color: #d35400;" data-color="#d35400"></div>
        <div class="color-option" style="background-color: #bdc3c7;" data-color="#bdc3c7"></div>
        <div class="color-option" style="background-color: #2ecc71;" data-color="#2ecc71"></div>
        <div class="color-option" style="background-color: #e67e22;" data-color="#e67e22"></div>
    </div>
    <canvas></canvas>
    <span>Pencil Width</span>
    <div class="btns">
        <input id="line-width" type="range" min="1" max="10" value="5" step="0.2" />
        <button id="mode-btn">🩸Fill</button>
        <button id="destory-btn">💣Destory</button>
        <button id="eraser-btn">❌Erase</button>
        <label for="file">
            📁Upload Image
            <input type="file" accept="image/*" id="file" />
        </label>
        <input type="text" id="text" placeholder="Add text here... :)" />
        <button id="save">🖼️Save Image</button>
    </div>
    <script>
        const colorOptions = Array.from(document.getElementsByClassName("color-option"));
        const textInput = document.getElementById("text");
        const fileInput = document.getElementById("file");
        const saveBtn = document.getElementById("save");
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
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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

        saveBtn.addEventListener("click", () => {
            const image = canvas.toDataURL();
            const link = document.createElement("a");
            link.href = image;
            link.download = "MEME.png";
            link.click();
        });
    </script>
</body>

</html>
 """
