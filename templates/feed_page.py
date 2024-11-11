feed_page_template = """
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NothingTime-Feed</title>
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
    <style>
        @font-face {
            font-family: 'SUIT-Regular';
            src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
        }

        h1 {
            font-family: 'SUIT-Regular';
        }

        .grid-container {
            margin-left: 20%;
            margin-right: 20%;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
        }

        .grid-item img {
            width: 100%;
            height: auto;
            object-fit: cover;
            border: 2px solid rgba(200, 200, 200, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 25px;
        }

        .grid-item img:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }

        .modal-content img {
            width: 100%;
            height: auto;
            border-radius: 5px;
        }

        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            color: white;
            cursor: pointer;
        }

        #canvas-btn {
            width: 30px;
            height: 30px;
            right: 20px;
            bottom: 20px;
            position: fixed;
            filter: invert(1);
            border-radius: 50px;
            background-color: #7e4709;
            border: 2px solid black;
            padding: 5px;
            cursor: pointer;
            transition: all ease-in-out 0.3s;
        }

        #canvas-btn:hover {
            transform: scale(1.2);
        }

        @media (max-width: 768px) {
            .grid-container {
                margin-left: 5%;
                margin-right: 5%;
            }

            h1 {
                font-size: 1.5rem;
            }

            #canvas-btn {
                width: 25px;
                height: 25px;
            }
        }

        @media (max-width: 480px) {
            .grid-container {
                margin-left: 2%;
                margin-right: 2%;
            }

            h1 {
                font-size: 1.2rem;
            }

            #canvas-btn {
                width: 20px;
                height: 20px;
                right: 10px;
                bottom: 10px;
            }
        }
    </style>
</head>

<body>
    <h1 align="center">공유된 이미지</h1>
    <div class="grid-container" id="imageGrid"></div>

    <div class="modal" id="imageModal" onclick="closeModal(event)">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <img id="modalImage" src="">
        </div>
    </div>

    <svg id="canvas-btn" onclick="handleCanvasClick()" version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="931.000000pt" height="1280.000000pt" viewBox="0 0 931.000000 1280.000000"
        preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
            <path d="M9186 12779 c-28 -22 -678 -928 -1438 -2004 -1702 -2411 -2879 -4144
-3515 -5175 -91 -148 -263 -442 -263 -450 0 -4 48 -24 108 -46 59 -21 190 -80
292 -131 267 -134 433 -241 688 -446 68 -54 125 -97 126 -95 9 10 107 177 193
328 656 1146 2013 3874 3700 7440 124 261 227 492 230 512 4 30 1 41 -20 62
-32 31 -65 33 -101 5z" />
            <path d="M3796 4802 c-154 -368 -309 -713 -623 -1387 -264 -566 -410 -893
-401 -900 2 -1 32 -8 68 -14 195 -38 431 -178 561 -335 28 -33 55 -62 60 -64
12 -5 199 242 580 768 400 552 642 878 839 1130 176 225 171 216 144 238 -12
9 -66 53 -120 98 -304 248 -652 449 -963 555 -47 16 -87 29 -90 29 -3 0 -28
-53 -55 -118z" />
            <path d="M2358 2395 c-270 -44 -509 -190 -680 -415 -62 -81 -140 -241 -167
-340 -92 -340 -138 -476 -220 -644 -77 -157 -164 -279 -276 -392 -210 -211
-460 -336 -850 -423 -99 -23 -134 -35 -147 -51 -26 -32 -23 -76 8 -107 l26
-26 482 6 c264 4 560 11 656 17 1117 63 1758 256 2118 635 177 186 259 384
269 650 11 288 -65 511 -248 733 -126 153 -342 287 -544 338 -127 31 -303 40
-427 19z" />
        </g>
    </svg>

    <script>
        async function loadImages() {
            const response = await fetch("/feed", { method: "POST" });
            const imagePaths = await response.json();
            const grid = document.getElementById("imageGrid");
            imagePaths.forEach(path => {
                const imgDiv = document.createElement("div");
                imgDiv.className = "grid-item";
                const img = document.createElement("img");
                img.src = path;
                img.onclick = () => openModal(path);
                imgDiv.appendChild(img);
                grid.appendChild(imgDiv);
            });
        }

        function openModal(src) {
            const modal = document.getElementById("imageModal");
            const modalImage = document.getElementById("modalImage");
            modalImage.src = src;
            modal.style.display = "flex";
        }

        function closeModal(event) {
            const modal = document.getElementById("imageModal");
            if (event.target === modal || event.target.classList.contains("close-btn")) {
                modal.style.display = "none";
            }
        }

        async function handleCanvasClick() {
            const url = "https://port-0-nothingtime-lzsaeexf05f2c47e.sel4.cloudtype.app/canvas";
            try {
                const response = await fetch(url, { method: 'GET' });
                if (response.ok) {
                    window.location.href = url;
                } else {
                    console.error("Failed to load page:", response.status);
                    alert("페이지 로드에 실패했습니다. 상태 코드: " + response.status);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("오류 발생: " + error.message);
            }
        }

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        });

        window.onload = loadImages;
    </script>
</body>

</html>
"""