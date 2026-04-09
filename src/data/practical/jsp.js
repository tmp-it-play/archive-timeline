export default {
  id: 'jsp',
  title: 'JSP 기초',
  description: 'JSP(JavaServer Pages)는 HTML 안에 Java 코드를 삽입하여 동적 웹 페이지를 만드는 기술입니다. 화면 구현 과제에서 핵심적으로 사용됩니다.',
  lessons: [
    {
      id: 'jsp_01',
      title: 'JSP 스크립틀릿(Scriptlet)',
      description: `JSP에서 Java 코드를 삽입하는 방법입니다.

- <% ... %>: 스크립틀릿 - Java 코드 실행
- <%= ... %>: 표현식 - 값을 HTML에 출력
- <%-- ... --%>: JSP 주석

아래는 회원 정보를 출력하는 JSP 예시입니다.
표현식을 사용하여 변수 값을 출력하는 부분을 완성해보세요.`,
      type: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
  String custname = "홍길동";
  int custno = 1001;
  String grade = "VIP";
%>
<html>
<body>
  <h2>회원 정보</h2>
  <table border="1">
    <tr>
      <th>고객번호</th>
      <td><%= custno %></td>
    </tr>
    <tr>
      <th>이름</th>
      <td><!-- custname 변수를 출력하세요 --></td>
    </tr>
    <tr>
      <th>등급</th>
      <td><!-- grade 변수를 출력하세요 --></td>
    </tr>
  </table>
</body>
</html>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
  String custname = "홍길동";
  int custno = 1001;
  String grade = "VIP";
%>
<html>
<body>
  <h2>회원 정보</h2>
  <table border="1">
    <tr>
      <th>고객번호</th>
      <td><%= custno %></td>
    </tr>
    <tr>
      <th>이름</th>
      <td><%= custname %></td>
    </tr>
    <tr>
      <th>등급</th>
      <td><%= grade %></td>
    </tr>
  </table>
</body>
</html>`
    },
    {
      id: 'jsp_02',
      title: 'request 객체로 폼 데이터 받기',
      description: `Action.jsp에서 폼 데이터를 처리하는 방법입니다.

- request.getParameter("name"): 폼에서 name 속성으로 전송된 값을 가져옴
- request.setCharacterEncoding("UTF-8"): 한글 깨짐 방지

화면 구현 과제에서 loginAction.jsp처럼 폼 데이터를 받아 처리하는 패턴입니다.`,
      type: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
  request.setCharacterEncoding("UTF-8");

  // 폼에서 전송된 userId와 userPw를 받아오세요
  String userId = request.getParameter("___");
  String userPw = request.getParameter("___");
%>
<html>
<body>
  <h2>로그인 처리 결과</h2>
  <p>아이디: <%= userId %></p>
  <p>비밀번호: <%= userPw %></p>
  <p>
    <%
      if ("admin".equals(userId) && "1234".equals(userPw)) {
    %>
        <strong>로그인 성공!</strong>
    <%
      } else {
    %>
        <strong>아이디 또는 비밀번호가 틀렸습니다.</strong>
    <%
      }
    %>
  </p>
</body>
</html>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
  request.setCharacterEncoding("UTF-8");

  String userId = request.getParameter("userId");
  String userPw = request.getParameter("userPw");
%>
<html>
<body>
  <h2>로그인 처리 결과</h2>
  <p>아이디: <%= userId %></p>
  <p>비밀번호: <%= userPw %></p>
  <p>
    <%
      if ("admin".equals(userId) && "1234".equals(userPw)) {
    %>
        <strong>로그인 성공!</strong>
    <%
      } else {
    %>
        <strong>아이디 또는 비밀번호가 틀렸습니다.</strong>
    <%
      }
    %>
  </p>
</body>
</html>`
    },
    {
      id: 'jsp_03',
      title: 'JSP include — 공통 레이아웃',
      description: `화면 구현 과제에서는 header.jsp, footer.jsp, nav.jsp를 공통으로 사용합니다.

- <%@ include file="파일경로" %>: 정적 include (컴파일 시 포함)
- <jsp:include page="파일경로" />: 동적 include (실행 시 포함)

과제 레포처럼 공통 레이아웃을 include하는 구조를 작성해보세요.`,
      type: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>회원 관리 시스템</title>
</head>
<body>
  <!-- header.jsp를 include하세요 (정적 include) -->
  <%@ include file="___" %>

  <!-- nav.jsp를 include하세요 -->
  <%@ include file="___" %>

  <div id="content">
    <h2>회원 목록</h2>
    <p>여기에 회원 목록이 표시됩니다.</p>
  </div>

  <!-- footer.jsp를 include하세요 -->
  <%@ include file="footer.jsp" %>
</body>
</html>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>회원 관리 시스템</title>
</head>
<body>
  <%@ include file="header.jsp" %>

  <%@ include file="nav.jsp" %>

  <div id="content">
    <h2>회원 목록</h2>
    <p>여기에 회원 목록이 표시됩니다.</p>
  </div>

  <%@ include file="footer.jsp" %>
</body>
</html>`
    }
  ]
}
