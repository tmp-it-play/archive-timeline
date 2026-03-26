---
id: "java-con-001"
title: "Java Main 메서드의 매개변수가 String[] args인 이유"
difficulty: "junior"
category: "java"
type: "concept"
---
## Java Main 메서드란?
Java 프로그램의 진입점으로, 프로그램 실행 시 가장 먼저 호출되는 메서드입니다. 일반적으로 다음과 같이 정의됩니다:

```java
public static void main(String[] args) { // Java 25에선 접근 제어자가 생략 가능
    // 프로그램 실행 코드
}
```
## 매개변수 String[] args의 의미
- `String[] args`는 **명령줄 인자(Command-line Arguments)**를 전달
- 프로그램 실행 시 사용자가 입력한 추가 정보를 배열 형태로 받음
- 예시: `java MyProgram Hello World` → `args[0] = "Hello"`, `args[1] = "World"`
- 이 매개변수를 통해 프로그램에 다양한 입력을 제공할 수 있어 유연한 실행이 가능
- 예시 활용:
```java
public static void main(String[] args) {
    if (args.length > 0) {
        System.out.println("첫 번째 인자: " + args[0]);
    } else {
        System.out.println("인자가 없습니다.");
    }
}
```
- 위 예시에서는 명령줄 인자가 있는 경우 첫 번째 인자를 출력하고, 없는 경우 메시지를 출력합니다.
- 따라서 `String[] args`는 Java 프로그램이 외부에서 입력을 받아 처리할 수 있도록 하는 중요한 역할을 합니다.
- Java 25에서는 `main` 메서드의 접근 제어자가 생략 가능해졌지만, 매개변수 `String[] args`는 여전히 프로그램 실행 시 명령줄 인자를 받기 위해 필요합니다.
