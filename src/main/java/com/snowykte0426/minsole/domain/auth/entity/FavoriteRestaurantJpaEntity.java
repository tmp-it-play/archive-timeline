//<!DOCTYPE html>
//<html lang="ko" xmlns:th="http://www.thymeleaf.org">
//<head>
//    <meta charset="UTF-8">
//    <meta name="viewport" content="width=device-width, initial-scale=1.0">
//    <title>빅테이터</title>
//    <style>
//        * {
//            margin: 0;
//            padding: 0;
//            box-sizing: border-box;
//        }
//
//        body {
//            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//            width: 100%;
//            height: 100vh;
//            display: flex;
//            align-items: center;
//            justify-content: center;
//        }
//
//        .splash-container {
//            width: 375px;
//            height: 812px;
//            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//            position: relative;
//            box-shadow: 0 0 30px rgba(0,0,0,0.3);
//            border-radius: 0;
//            overflow: hidden;
//            display: flex;
//            flex-direction: column;
//            align-items: center;
//            justify-content: center;
//            text-align: center;
//            color: white;
//        }
//
//        .logo {
//            font-size: 48px;
//            font-weight: bold;
//            margin-bottom: 20px;
//            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
//        }
//
//        .tagline {
//            font-size: 20px;
//            font-weight: 300;
//            margin-bottom: 8px;
//            opacity: 0.9;
//        }
//
//        .subtitle {
//            font-size: 16px;
//            font-weight: 400;
//            opacity: 0.8;
//            margin-bottom: 60px;
//        }
//
//        .start-btn {
//            background-color: rgba(255,255,255,0.2);
//            color: white;
//            border: 2px solid rgba(255,255,255,0.3);
//            padding: 16px 32px;
//            border-radius: 30px;
//            font-size: 18px;
//            font-weight: 500;
//            cursor: pointer;
//            transition: all 0.3s ease;
//            text-decoration: none;
//            backdrop-filter: blur(10px);
//        }
//
//        .start-btn:hover {
//            background-color: rgba(255,255,255,0.3);
//            border-color: rgba(255,255,255,0.5);
//            transform: translateY(-2px);
//        }
//
//        .background-pattern {
//            position: absolute;
//            top: 0;
//            left: 0;
//            right: 0;
//            bottom: 0;
//            opacity: 0.1;
//            background-image:
//                radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
//                radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
//            background-size: 50px 50px;
//            background-position: 0 0, 25px 25px;
//        }
//    </style>
//</head>
//<body>
//    <div class="splash-container">
//        <div class="background-pattern"></div>
//
//        <div class="logo">빅테이터</div>
//
//        <div class="tagline">오늘을 더 맛있게</div>
//        <div class="tagline">오늘을 더 행복하게</div>
//
//        <div class="subtitle">내 취향으로 나만의 맛집지도를 만들다</div>
//
//        <a href="/login" class="start-btn">시작하기</a>
//    </div>
//
//    <script>
//        // 토큰이 있으면 메인 페이지로 리다이렉트
//        const token = localStorage.getItem('token');
//        if (token) {
//            window.location.href = '/main';
//        }
//    </script>
//</body>
//</html>
