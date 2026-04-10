export default {
  id: 'screen-form',
  title: '화면 구현 — 등록 폼',
  description: '신규 데이터를 입력받는 등록 폼 화면(sub1.jsp)과 처리 페이지(sub1Action.jsp)를 구현합니다. 폼 전송, 파라미터 수신, DTO 구성, DB 저장, 리다이렉트 흐름을 익힙니다.',
  lessons: [
    {
      id: 'form_01',
      title: 'sub1.jsp — 회원 등록 폼',
      description: `[화면 요구사항]
신규 회원을 등록하는 입력 폼 화면입니다.

[DB 테이블: member_tbl]
custno(회원번호), custname(이름), phone(연락처),
address(주소), joindate(가입일), grade(등급), city(지역)

[조건]
- custno는 DAO의 getCustno()로 자동 생성, 읽기 전용(readonly)
- joindate는 오늘 날짜(yyyyMMdd) 자동 입력, 읽기 전용
- 폼 action="sub1Action.jsp", method="post"
- [등록] 클릭 시 fnCheck() 유효성 검사 후 submit
- [조회] 클릭 시 sub2.jsp로 이동

폼 구조와 각 입력 항목의 연결 방식을 확인해보세요.`,
      type: 'live-jsp',
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
      id: 'form_02',
      title: 'sub1Action.jsp — 등록 처리 및 리다이렉트',
      description: `[처리 페이지 요구사항]
폼에서 POST로 전송된 데이터를 받아 DB에 저장하고 원래 화면으로 돌아갑니다.

[처리 순서]
1. 한글 처리: request.setCharacterEncoding("UTF-8")
2. 각 파라미터를 getParameter()로 수신
3. MemberDTO에 setter로 값 설정
4. dao.insertMember(dto) 호출
5. sub1.jsp로 리다이렉트

파라미터 수신부터 DTO 저장, 리다이렉트까지의 흐름을 확인해보세요.`,
      type: 'code',
      language: 'java',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.MemberDTO" %>
<%
  request.setCharacterEncoding("UTF-8");

  int custno      = Integer.parseInt(request.getParameter("custno"));
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
  dao.insertMember(dto);

  response.sendRedirect("sub1.jsp");
%>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.MemberDTO" %>
<%
  request.setCharacterEncoding("UTF-8");

  int custno      = Integer.parseInt(request.getParameter("custno"));
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
  dao.insertMember(dto);

  response.sendRedirect("sub1.jsp");
%>`
    },
    {
      id: 'form_03',
      title: 'check.js — 클라이언트 유효성 검사',
      description: `[요구사항]
등록 버튼 클릭 시 각 입력칸이 비어 있으면 alert 후 해당 필드에 포커스를 주고 함수를 종료합니다.
모든 검사를 통과하면 성공 메시지를 표시하고 폼을 submit합니다.

검사 순서: custname → phone → address → grade → city

각 필드 검사와 폼 제출 흐름을 확인해보세요.`,
      type: 'code',
      language: 'html',
      starterCode: `<script>
function fnCheck() {
  var frm = document.frm;

  if(frm.custname.value.trim() === "") {
    alert("이름을 입력하세요.");
    frm.custname.focus();
    return;
  }
  if(frm.phone.value.trim() === "") {
    alert("연락처를 입력하세요.");
    frm.phone.focus();
    return;
  }
  if(frm.address.value.trim() === "") {
    alert("주소를 입력하세요.");
    frm.address.focus();
    return;
  }
  if(frm.grade.value.trim() === "") {
    alert("등급을 입력하세요.");
    frm.grade.focus();
    return;
  }
  if(frm.city.value.trim() === "") {
    alert("지역을 입력하세요.");
    frm.city.focus();
    return;
  }

  alert("회원등록이 완료 되었습니다!");
  frm.submit();
}
</script>`,
      solution: `<script>
function fnCheck() {
  var frm = document.frm;

  if(frm.custname.value.trim() === "") {
    alert("이름을 입력하세요.");
    frm.custname.focus();
    return;
  }
  if(frm.phone.value.trim() === "") {
    alert("연락처를 입력하세요.");
    frm.phone.focus();
    return;
  }
  if(frm.address.value.trim() === "") {
    alert("주소를 입력하세요.");
    frm.address.focus();
    return;
  }
  if(frm.grade.value.trim() === "") {
    alert("등급을 입력하세요.");
    frm.grade.focus();
    return;
  }
  if(frm.city.value.trim() === "") {
    alert("지역을 입력하세요.");
    frm.city.focus();
    return;
  }

  alert("회원등록이 완료 되었습니다!");
  frm.submit();
}
</script>`
    }
  ]
}
