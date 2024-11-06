feed_page_template = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NothingTime-Feed</title>
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
    <style>
        .grid-container {
            display: grid;
            align-items: center;
            justify-content: center;
            margin-left: 20%;
            margin-right: 20%;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
        }
        .grid-item img {
            width: 100%;
            height: auto;
            object-fit: cover;
            border: 2px solid rgba(200, 200, 200, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 5px;
        }
        .grid-item img:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);d
        }
    </style>
</head>
<body>
    <h1>Feed</h1>
    <div class="grid-container" id="imageGrid"></div>

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
                imgDiv.appendChild(img);
                grid.appendChild(imgDiv);
            });
        }
        window.onload = loadImages;
    </script>
</body>
</html>
"""