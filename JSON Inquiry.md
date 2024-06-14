# JSON(JavaScript Object Notation)
+ **웹 애플리케이션에서 데이터를 전송할 때 일반적으로 사용하는 JS 객체 문법 기반 파일 포맷**
+ 쉽게 설명하면 데이터를 쉽게 **교환**하고 **저장**하기 위한 텍스트 기반 데이터 교환 표준이라고 할 수 있음
+ 기본적으로 **문자열**의 형태로 나타냄
+ **일정한 패턴을 지닌 문자열을 생성해 전송**하면 클라이언트가 해석하여 데이터를 활용하는 것을 가능케 했음
+ 기존 XML(e**X**tensible **M**arkup **L**anguage)이 가독성이 떨어지는 문제를 보완해 사람도 쉽고 빠르게 읽어낼 수 있도록 간결하고 통일된 양식을 사용
## JSON의 특장점
+ 기본적으로 이름처럼 **JS 객체 표기법의 부분집합**이기 때문에 웹브라우저에서 빠르게 해석할 수 있고 규칙이 간단한 만큼 다른 언어에서도 구현하기 쉬움
+ NoSQL과 같은 DB부터 관계형 DB에서도 지원하며 Unity3D에서도 플러그인으로 지하며 모바일 플랫폼에서도 확산되고있음
## 단점
+ 주석을 지원하지 않음
+ 날짜,시간 데이터를 지원하지 않음
## 기본적인 문법
+ 기본적으로 <b>Key(키)</b>와 <b>Value(값)</b>의 쌍으로 이뤄져 있으며 <b>그 사이에는 :(콜론)</b>이 들어감
  ``` 
  { key : value }
  ```
+ 여러 데이터를 나열할 경우 <b>,(쉼표)</b>를 사용함
  ```
  { key1 : value1, key2 : value2 }
  ```
+ <b>Object(객체)</b>는 <b>{}(중괄호)</b>,<b> Array(배열)</b>은 <b>[[](대괄호)]</b><b>(대괄호)</b>로 묶어 표현함
  ```
  { key1 : { inKey : inValue }, key2 : [arr1, arr2 arr3] }
  { "판매자정보" : { "이름" : "남도일", "지역" : "서울" } , "판매품목" : ['사과','배','딸기'] }
  ```
+ **데이터의 값으로 다양한 Type(타입)을 사용할 수 있음**
  ```
  [   1,    "str",    true,    {inKey : "value"},    ["일", "이"],    null    ]
  // 숫자 (number)
  {  k  :  1  }
  //문자열 (string)
  {  k  :  "str"  }
  //불(boolean)
  {  k  :  true  }
  //객체(object)
  {  k  :  {inKey : "value" }  }
  //배열(array)
  {  k  :  ["일", "이"]  }
  //널(NULL)
  {  k  :  null  }
  ```
  ---
## 참고자료
+ [JSON으로 작업하기](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/JSON)
+ [JSON - 나무위키](https://namu.wiki/w/JSON)
+ [XML - 나무위키](https://namu.wiki/w/XML)
+ [[JSON] JSON 이란 무엇인가? 간단 정리 및 예제를 통한 사용 방법](https://codingazua.tistory.com/4)
