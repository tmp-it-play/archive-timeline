export default {
  id: 'hrd01-jsp',
  title: 'HRD-01 회원관리 JSP',
  description: '쇼핑몰 회원관리 프로그램(HRD_01) 실기 과제 형식으로 JSP 화면을 구현합니다. sub1.jsp(등록 폼), sub2.jsp(목록 조회), sub3.jsp(매출 조회) 순으로 학습합니다.',
  lessons: [
    {
      id: 'hrd01_01',
      title: 'sub1.jsp — 회원 등록 폼',
      description: `[과제 상황]
쇼핑몰 회원관리 시스템에서 신규 회원을 등록하는 화면입니다.

[DB 테이블: member_tbl_02]
custno(회원번호), custname(이름), phone(연락처),
address(주소), joindate(가입일), grade(등급), city(지역)

[요구사항]
① custno는 DAO의 getCustno()로 자동 생성, 읽기 전용
② joindate는 오늘 날짜 자동 입력, 읽기 전용
③ 폼 action은 sub1Action.jsp, method는 POST
④ [등록] 버튼 클릭 시 fnCheck() JavaScript 유효성 검사 실행
⑤ [조회] 버튼 클릭 시 sub2.jsp로 이동

아래 ( A ) ~ ( E ) 를 채우세요.`,
      type: 'html',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO" %>
<%
  MemberDAO dao = new MemberDAO();
  int custno = dao.getCustno();

  java.util.Date now = new java.util.Date();
  java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd");
  String joindate = sdf.format(now);
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 등록</h2>
<form action="( A )" method="( B )" name="frm">
<table border="1">
  <tr>
    <th>회원번호</th>
    <td><input type="text" name="custno" value="<%= custno %>" readonly="readonly"/></td>
  </tr>
  <tr>
    <th>이름</th>
    <td><input type="text" name="custname"/></td>
  </tr>
  <tr>
    <th>연락처</th>
    <td><input type="text" name="phone"/></td>
  </tr>
  <tr>
    <th>주소</th>
    <td><input type="text" name="address"/></td>
  </tr>
  <tr>
    <th>가입일</th>
    <td><input type="text" name="joindate" value="( C )" readonly="readonly"/></td>
  </tr>
  <tr>
    <th>등급</th>
    <td><input type="text" name="grade"/></td>
  </tr>
  <tr>
    <th>지역</th>
    <td><input type="text" name="city"/></td>
  </tr>
  <tr>
    <td colspan="2">
      <input type="button" value="등록" onclick="( D )"/>
      <input type="button" value="조회" onclick="location.href='( E )'"/>
    </td>
  </tr>
</table>
</form>
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO" %>
<%
  MemberDAO dao = new MemberDAO();
  int custno = dao.getCustno();

  java.util.Date now = new java.util.Date();
  java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd");
  String joindate = sdf.format(now);
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 등록</h2>
<form action="sub1Action.jsp" method="post" name="frm">
<table border="1">
  <tr>
    <th>회원번호</th>
    <td><input type="text" name="custno" value="<%= custno %>" readonly="readonly"/></td>
  </tr>
  <tr>
    <th>이름</th>
    <td><input type="text" name="custname"/></td>
  </tr>
  <tr>
    <th>연락처</th>
    <td><input type="text" name="phone"/></td>
  </tr>
  <tr>
    <th>주소</th>
    <td><input type="text" name="address"/></td>
  </tr>
  <tr>
    <th>가입일</th>
    <td><input type="text" name="joindate" value="<%= joindate %>" readonly="readonly"/></td>
  </tr>
  <tr>
    <th>등급</th>
    <td><input type="text" name="grade"/></td>
  </tr>
  <tr>
    <th>지역</th>
    <td><input type="text" name="city"/></td>
  </tr>
  <tr>
    <td colspan="2">
      <input type="button" value="등록" onclick="fnCheck()"/>
      <input type="button" value="조회" onclick="location.href='sub2.jsp'"/>
    </td>
  </tr>
</table>
</form>
<%@ include file="footer.jsp" %>`
    },
    {
      id: 'hrd01_02',
      title: 'sub1Action.jsp — 등록 처리',
      description: `[과제 상황]
sub1.jsp에서 POST로 전송된 회원 데이터를 받아 DB에 저장하는 액션 페이지입니다.

[요구사항]
① request.setCharacterEncoding으로 한글 처리
② 각 파라미터를 getParameter()로 수신
③ MemberDTO에 값을 담아 dao.insertSub1() 호출
④ 처리 완료 후 sub1.jsp로 리다이렉트

아래 ( A ) ~ ( F ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.MemberDTO" %>
<%
  request.setCharacterEncoding("( A )");

  int custno    = Integer.parseInt(request.getParameter("custno"));
  String custname = request.getParameter("( B )");
  String phone    = request.getParameter("phone");
  String address  = request.getParameter("address");
  String joindate = request.getParameter("joindate");
  String grade    = request.getParameter("( C )");
  String city     = request.getParameter("city");

  MemberDTO dto = new MemberDTO();
  dto.setCustno(custno);
  dto.setCustname(( D ));
  dto.setPhone(phone);
  dto.setAddress(address);
  dto.setJoindate(joindate);
  dto.setGrade(grade);
  dto.setCity(city);

  MemberDAO dao = new MemberDAO();
  dao.insertSub1(( E ));

  response.sendRedirect("( F )");
%>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.MemberDTO" %>
<%
  request.setCharacterEncoding("UTF-8");

  int custno    = Integer.parseInt(request.getParameter("custno"));
  String custname = request.getParameter("custname");
  String phone    = request.getParameter("phone");
  String address  = request.getParameter("address");
  String joindate = request.getParameter("joindate");
  String grade    = request.getParameter("grade");
  String city     = request.getParameter("city");

  MemberDTO dto = new MemberDTO();
  dto.setCustno(custno);
  dto.setCustname(custname);
  dto.setPhone(phone);
  dto.setAddress(address);
  dto.setJoindate(joindate);
  dto.setGrade(grade);
  dto.setCity(city);

  MemberDAO dao = new MemberDAO();
  dao.insertSub1(dto);

  response.sendRedirect("sub1.jsp");
%>`
    },
    {
      id: 'hrd01_03',
      title: 'sub2.jsp — 회원 목록 조회',
      description: `[과제 상황]
전체 회원 목록을 테이블 형태로 출력하는 화면입니다.

[요구사항]
① dao.selectSub2()로 List<MemberDTO> 반환
② for문으로 각 회원 정보를 테이블 행으로 출력
③ 7개 컬럼: 회원번호, 이름, 연락처, 주소, 가입일, 등급, 지역

아래 ( A ) ~ ( D ) 를 채우세요.`,
      type: 'html',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.MemberDTO, java.util.List" %>
<%
  MemberDAO dao = new MemberDAO();
  List<MemberDTO> list = dao.( A )();
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 목록</h2>
<table border="1">
  <tr>
    <th>회원번호</th><th>이름</th><th>연락처</th>
    <th>주소</th><th>가입일</th><th>등급</th><th>지역</th>
  </tr>
  <%
    for(MemberDTO dto : ( B )) {
  %>
  <tr>
    <td><%= dto.getCustno() %></td>
    <td><%= dto.( C )() %></td>
    <td><%= dto.getPhone() %></td>
    <td><%= dto.getAddress() %></td>
    <td><%= dto.getJoindate() %></td>
    <td><%= dto.getGrade() %></td>
    <td><%= dto.( D )() %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.MemberDTO, java.util.List" %>
<%
  MemberDAO dao = new MemberDAO();
  List<MemberDTO> list = dao.selectSub2();
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 목록</h2>
<table border="1">
  <tr>
    <th>회원번호</th><th>이름</th><th>연락처</th>
    <th>주소</th><th>가입일</th><th>등급</th><th>지역</th>
  </tr>
  <%
    for(MemberDTO dto : list) {
  %>
  <tr>
    <td><%= dto.getCustno() %></td>
    <td><%= dto.getCustname() %></td>
    <td><%= dto.getPhone() %></td>
    <td><%= dto.getAddress() %></td>
    <td><%= dto.getJoindate() %></td>
    <td><%= dto.getGrade() %></td>
    <td><%= dto.getCity() %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`
    },
    {
      id: 'hrd01_04',
      title: 'sub3.jsp — 매출 조회 (GROUP BY)',
      description: `[과제 상황]
회원별 누적 구매 금액을 내림차순으로 출력하는 매출 조회 화면입니다.

[TotalDTO 필드]
custno, custname, grade, total(합계금액)

[요구사항]
① dao.selectSub3()로 List<TotalDTO> 반환 (합계 내림차순)
② total은 DecimalFormat("￦#,##0")으로 형식화 출력

아래 ( A ) ~ ( D ) 를 채우세요.`,
      type: 'html',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.TotalDTO, java.util.List, java.text.DecimalFormat" %>
<%
  MemberDAO dao = new MemberDAO();
  List<TotalDTO> list = dao.( A )();
  DecimalFormat df = new DecimalFormat("( B )");
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 매출 조회</h2>
<table border="1">
  <tr>
    <th>회원번호</th><th>이름</th><th>등급</th><th>합계</th>
  </tr>
  <%
    for(TotalDTO dto : list) {
  %>
  <tr>
    <td><%= dto.getCustno() %></td>
    <td><%= dto.getCustname() %></td>
    <td><%= dto.getGrade() %></td>
    <td><%= df.format(dto.( C )()) %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.TotalDTO, java.util.List, java.text.DecimalFormat" %>
<%
  MemberDAO dao = new MemberDAO();
  List<TotalDTO> list = dao.selectSub3();
  DecimalFormat df = new DecimalFormat("￦#,##0");
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 매출 조회</h2>
<table border="1">
  <tr>
    <th>회원번호</th><th>이름</th><th>등급</th><th>합계</th>
  </tr>
  <%
    for(TotalDTO dto : list) {
  %>
  <tr>
    <td><%= dto.getCustno() %></td>
    <td><%= dto.getCustname() %></td>
    <td><%= dto.getGrade() %></td>
    <td><%= df.format(dto.getTotal()) %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`
    }
  ]
}
