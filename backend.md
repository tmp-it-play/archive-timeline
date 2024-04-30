가능하다면 화이트 모드에서 열람하시는 것을 추천합니다!
# 객체지향
### 객체지향이란?
- 프로그램을 수많은 객체(Object)로 나누고 이들의 상호작용을 기반으로 하여 서술하는 프로그래밍 방식
- 객체는 인간이 정의한 추상적인 개념
- 최초의 객체지향을 지원하는 언어는 'Smalltalk'

<img src="https://github.com/snowykte0426/TIL/blob/main/img/SmallTalk.png" width="100" height="100">

### 대표적인 객체지향언어?
- 현시점 많이 사용되는 대부분의 언어는 객체지향언어
- 대표적으론 Java,Python,Ruby,C++ 등이 존재
<figure class="thrid">
 <a href="link"><img src="https://i.namu.wiki/i/MuCO_ocla-FyadGnRZytkRLggQOcqxv_hXNjN7aYXDOPivIChJNdiRXp6vwSXbM6GcUL3pVTL-5U5TKQ0f1YhA.svg" aling='left'width="100" height="100"></a>
 <a href="link"><img src="https://velog.velcdn.com/images/deep-of-machine/post/3f778fa2-2b43-42b3-9233-091424be7d73/image.png" width="165" height="100"></a>
 <a href="ling"><img src="https://i.namu.wiki/i/Rv7cLGvX03Y-IX85VC6HXqtKuAhofMYJdodeW2v38Ghm6eCgDCqAhjXWcAWb0MB5UdvweeYI8QLNalwMevPplw.svg" width="100" height="100"></a>
</figure>

### 특징
- 캡슐화(Encapsulation): 변수와 함수를 하나의 단위로 묶는 것
- 상속(Inheritance): 자식 클래스(Class)가 부모 클래스의 모든 속성을 그대로 물려받는 것을 의미,클래스의 재사용을 용이하게 만듬
- 다형성(Polymorphism): 하나의 변수,함수가 상황에 따라 다르게 해석 될 수 있음,상위 클래스가 어떤 하위 클래스를 참조하냐에 따라 호출되는 메서드(Method)가 달라짐
# Java 클래스 선언하고 사용해보기
- <a href="https://github.com/snowykte0426/IL/blob/main/radius.java">Java 클래스 사용한 코드</a><br>
<img src="https://media.discordapp.net/attachments/888391965996089365/1234839795511984270/image.png?ex=663231ad&is=6630e02d&hm=95339a4a0bac981a556cbdffa4186cb2de3847e854009a0dddd8b7120f795a0a&=&format=webp&quality=lossless&width=471&height=593" width="500" height="500">

# HTTP 매서드
### HTTP 매서드란?
- 클라이언트(Client)와 서버(Server) 사이에서 요청(Request)와 응답(Response)이 이루어지는 방식
- 서버에게 수행해야 할 동작을 지정하고 요청을 보내는 방법
### HTTP 매서드의 종류
- **GET**: 특정 리소스를 요청(조회)
- **HEAD**: GET과 동일한 요청을 수행하나 응답 본문,즉 메세지의 본문를 제외하고 조회
- **POST**: 데이터 등록,추가
- **PUT**: 기존 리소스 대체,만약 리소스가 없다면 새롭게 생성
- **DELLTE**: 리소스 삭제
- **CONNECT**: 필요한 리소스를 가진 서버로 연결
- **OPTIONS**: 서버와 클라이언트가 통신하기 위한 통신설정을 확인
- **TRACE**: 리소스의 경로를 따라 loop-back 테스트를 수행
- **PATCH**: 리소스 부분 수정(변경) 
### GET
- 리소스를 조회하는 메서드
- URL입력이나 링크를 클릭하는 등의 행위도 GET 요청에 해당
- **멱등성**(idempotent)이라는 성질이 있어 여러 번 반복해서 요청을 하더라도 리소스의 내용이 변하지 않음
- GET 요청으로 서버에 데이터를 전달하는 경우에는 **쿼리스트링**(Query String)를 통해 전달
### HEAD
- GET 요청과 유사하지만 실제 리소스가 아닌 리소스의 정보를 요청한다는 개념
- 응답 메세지에 본문(body) 없이 HTTP 헤더 정보를 반환
### POST
- 주로 새로운 리소스를 생성하는데 사용
- 생성이 성공적으로 완료되면 201 HTTP 응답을 반환
- POST 역시 조회가 가능하지만 멱등성을 지니지 않아 같은 결과값을 출력하는 것을 보장하지 않음
- 메세지 길이에 제한이 없음
### PUT
- 기존 리소스를 완전히 덮어쓰는 기능
- 부분 수정은 불가능
- 멱등성을 지님
### DELLTE
- 리소스를 제거하는 기능
- 멱등성을 지님
### CONNECT
- 요청한 리소스에 대해 양방향 연결을 시작하는 메서드
- SSL(HTTPS)를 사용하는 사이트에 접속하는데 사용 가능
- 한번 연결이 수립되면 프록시 서버(Proxy server)는 클라이언트 간에 오고가는 TCP 스트림을 이용해 계속해 통신
### OPTIONS
- 웹 서버 측 제공 메서드에 대해 질의하는 기능
### TRACE
- 요청 리소스가 수신되는 경로를 추적
- 자기 앞으로 리소스가 반환되는 loop-back(루프백) 테스트 시행
### PATCH
- PUT 요청과 같이 리소스를 수정하지만 부분 변경을 수행
- 멱등성을 지니지 않음
