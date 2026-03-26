---
id: "java-con-013"
title: "DispatcherServlet 기준 Spring MVC 요청 흐름"
difficulty: "mid"
category: "java"
type: "concept"
---

## 큰 흐름

1. 클라이언트 요청이 `DispatcherServlet`에 도달
2. HandlerMapping이 어떤 컨트롤러가 처리할지 찾음
3. HandlerAdapter가 실제 컨트롤러 호출
4. Controller가 결과 반환
5. ViewResolver 또는 HttpMessageConverter가 응답 생성
6. 클라이언트에 응답 반환

## RestController와 Controller 차이

### Controller
- 주로 View 이름 반환
- 서버 사이드 렌더링에 적합

### RestController
- `@Controller + @ResponseBody`
- JSON/XML 같은 응답 본문 반환에 적합

## 면접 포인트

- DispatcherServlet이 프론트 컨트롤러라는 점을 꼭 말하면 좋습니다.
