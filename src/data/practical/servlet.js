export default {
  id: 'servlet',
  title: '서블릿 & 액션 흐름',
  description: '화면 구현 과제에서 폼 데이터가 서버로 전달되는 흐름을 이해합니다. 폼 submit → Action JSP 처리 → 결과 페이지로 이동하는 MVC 패턴의 기초입니다.',
  lessons: [
    {
      id: 'servlet_01',
      title: '폼 submit → Action.jsp 흐름',
      description: `화면 구현 과제의 핵심 흐름:

1. 사용자가 폼 입력 후 [등록] 클릭
2. action 속성의 URL(insertAction.jsp)로 POST 전송
3. insertAction.jsp에서 파라미터 받기 → DAO로 DB 저장
4. response.sendRedirect()로 목록 페이지 이동

insertAction.jsp 패턴을 완성해보세요.`,
      type: 'html',
      starterCode: `<%-- insertAction.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ page import="exam.MemberDAO, exam.MemberDTO" %>
<%
  request.setCharacterEncoding("UTF-8");

  // 1. 파라미터 받기
  String custname = request.getParameter("custname");
  String phone    = request.getParameter("phone");
  String grade    = request.getParameter("grade");

  // 2. DTO에 담기
  MemberDTO dto = new MemberDTO();
  dto.setCustname(custname);
  dto.setPhone(___);
  dto.setGrade(grade);

  // 3. DAO로 DB 저장
  MemberDAO dao = new MemberDAO();
  dao.insertMember(___);

  // 4. 목록 페이지로 이동
  response.sendRedirect("___");
%>`,
      solution: `<%-- insertAction.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ page import="exam.MemberDAO, exam.MemberDTO" %>
<%
  request.setCharacterEncoding("UTF-8");

  String custname = request.getParameter("custname");
  String phone    = request.getParameter("phone");
  String grade    = request.getParameter("grade");

  MemberDTO dto = new MemberDTO();
  dto.setCustname(custname);
  dto.setPhone(phone);
  dto.setGrade(grade);

  MemberDAO dao = new MemberDAO();
  dao.insertMember(dto);

  response.sendRedirect("sub1.jsp");
%>`
    },
    {
      id: 'servlet_02',
      title: 'DAO insertMember 메서드',
      description: `DAO에서 INSERT SQL을 실행하는 메서드입니다.

PreparedStatement의 파라미터 바인딩:
- pstmt.setString(1, 값): 첫 번째 ? 에 String 값 설정
- pstmt.setInt(1, 값): 첫 번째 ? 에 int 값 설정
- pstmt.executeUpdate(): INSERT/UPDATE/DELETE 실행

insertMember 메서드를 완성하세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public int insertMember(MemberDTO dto) {
    int result = 0;
    String sql = "INSERT INTO TBL_MEMBER (custname, phone, grade) VALUES (?, ?, ?)";

    try {
        Connection con = DriverManager.getConnection(URL, USER, PASS);
        PreparedStatement pstmt = con.prepareStatement(sql);

        // 파라미터 바인딩
        pstmt.setString(1, dto.___());   // 첫번째 ? = custname
        pstmt.setString(2, dto.getPhone()); // 두번째 ? = phone
        pstmt.setString(___, dto.getGrade()); // 세번째 ? = grade

        result = pstmt.___(); // INSERT 실행

        con.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
    return result;
}`,
      solution: `public int insertMember(MemberDTO dto) {
    int result = 0;
    String sql = "INSERT INTO TBL_MEMBER (custname, phone, grade) VALUES (?, ?, ?)";

    try {
        Connection con = DriverManager.getConnection(URL, USER, PASS);
        PreparedStatement pstmt = con.prepareStatement(sql);

        pstmt.setString(1, dto.getCustname());
        pstmt.setString(2, dto.getPhone());
        pstmt.setString(3, dto.getGrade());

        result = pstmt.executeUpdate();

        con.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
    return result;
}`
    },
    {
      id: 'servlet_03',
      title: '전체 화면 구현 흐름 정리',
      description: `화면 구현 과제의 전체 구조를 정리합니다.

과제 레포(HRD_01, HRD_02)의 파일 구조:
- index.jsp: 메인 화면 (header/nav/footer include)
- sub1.jsp: 목록 조회 화면 (DAO.getList() → 테이블 출력)
- sub2.jsp: 등록 폼 화면 (form → sub2Action.jsp)
- sub2Action.jsp: 등록 처리 (파라미터 → DTO → DAO.insert())
- sub4.jsp: 수정/삭제 화면

폴더 구조를 코드로 표현해보세요.`,
      type: 'html',
      starterCode: `<!--
  화면 구현 과제 폴더 구조:

  webapp/
  ├── index.jsp          ← 메인 (header/nav/footer include)
  ├── header.jsp         ← 공통 헤더
  ├── nav.jsp            ← 공통 네비게이션
  ├── footer.jsp         ← 공통 푸터
  ├── sub1.jsp           ← 목록 조회
  ├── sub2.jsp           ← 등록 폼
  ├── sub2Action.jsp     ← 등록 처리 → redirect → sub1.jsp
  ├── sub4.jsp           ← 상세/수정 폼
  └── sub4Action.jsp     ← 수정 처리 → redirect → sub1.jsp

  src/main/java/exam/
  ├── MemberDTO.java
  └── MemberDAO.java
-->

<!-- sub2.jsp: 등록 폼 예시 -->
<form action="sub2Action.jsp" method="post">
  <table border="1">
    <tr>
      <th>이름</th>
      <td><input type="text" name="custname" /></td>
    </tr>
    <tr>
      <th>전화번호</th>
      <td><input type="text" name="phone" /></td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="submit" value="등록" />
        <input type="button" value="목록" onclick="location.href='sub1.jsp'" />
      </td>
    </tr>
  </table>
</form>`,
      solution: `<!-- sub2.jsp: 등록 폼 예시 -->
<form action="sub2Action.jsp" method="post">
  <table border="1">
    <tr>
      <th>이름</th>
      <td><input type="text" name="custname" /></td>
    </tr>
    <tr>
      <th>전화번호</th>
      <td><input type="text" name="phone" /></td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="submit" value="등록" />
        <input type="button" value="목록" onclick="location.href='sub1.jsp'" />
      </td>
    </tr>
  </table>
</form>`
    }
  ]
}
