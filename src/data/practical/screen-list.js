export default {
  id: 'screen-list',
  title: '화면 구현 — 목록 조회',
  description: 'DB에서 전체 목록을 조회하여 테이블로 출력하는 화면(sub2.jsp)과 집계 결과(sub3.jsp), 조건 검색(sub4.jsp)을 구현합니다.',
  lessons: [
    {
      id: 'list_01',
      title: 'sub2.jsp — 전체 목록 테이블 출력',
      description: `[화면 요구사항]
DAO에서 전체 회원 목록을 조회하여 HTML 테이블로 출력합니다.

[출력 컬럼]
회원번호, 이름, 연락처, 주소, 가입일, 등급, 지역 (7개)

[처리 순서]
1. MemberDAO 객체 생성
2. selectMemberList()로 List<MemberDTO> 반환
3. for-each 반복문으로 행 출력

( A ) ~ ( D ) 빈칸을 채우세요.`,
      type: 'live-jsp',
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
  List<MemberDTO> list = dao.selectMemberList();
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
      id: 'list_02',
      title: 'sub3.jsp — 집계 조회 (DecimalFormat)',
      description: `[화면 요구사항]
회원별 누적 구매금액을 내림차순으로 출력합니다.
금액은 DecimalFormat으로 "￦#,##0" 형식으로 표시합니다.

[TotalDTO 필드]
custno(int), custname, grade, total(int)

( A ) ~ ( C ) 빈칸을 채우세요.`,
      type: 'live-jsp',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.MemberDAO, test.TotalDTO, java.util.List, java.text.DecimalFormat" %>
<%
  MemberDAO dao = new MemberDAO();
  List<TotalDTO> list = dao.selectSalesSummary();
  DecimalFormat df = new DecimalFormat("( A )");
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 매출 조회</h2>
<table border="1">
  <tr>
    <th>회원번호</th><th>이름</th><th>등급</th><th>합계금액</th>
  </tr>
  <%
    for(TotalDTO dto : list) {
  %>
  <tr>
    <td><%= dto.getCustno() %></td>
    <td><%= dto.getCustname() %></td>
    <td><%= dto.getGrade() %></td>
    <td><%= df.format(dto.( B )()) %></td>
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
  List<TotalDTO> list = dao.selectSalesSummary();
  DecimalFormat df = new DecimalFormat("￦#,##0");
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>회원 매출 조회</h2>
<table border="1">
  <tr>
    <th>회원번호</th><th>이름</th><th>등급</th><th>합계금액</th>
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
    },
    {
      id: 'list_03',
      title: 'sub4.jsp — 조건 검색 화면',
      description: `[화면 요구사항]
과목코드를 입력받아 해당 과목의 성적을 조회합니다.
파라미터가 없거나 결과가 없으면 안내 메시지를 출력합니다.

[조건]
- 폼 action="sub4.jsp" (자기 자신), method="get"
- searchSubcode 파라미터가 있을 때만 DAO 조회
- list가 비어있으면 "해당 과목코드에 대한 성적 정보가 없습니다." 출력

( A ) ~ ( D ) 빈칸을 채우세요.`,
      type: 'live-jsp',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.ScoreDTO, java.util.List" %>
<%
  String searchSubcode = request.getParameter("( A )");
  List<ScoreDTO> list = null;
  if(searchSubcode != null && !searchSubcode.( B )()) {
    StudentDAO dao = new StudentDAO();
    list = dao.selectBySubcode(searchSubcode);
  }
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>과목별 성적 조회</h2>
<form action="sub4.jsp" method="get">
  과목코드: <input type="text" name="searchSubcode"
    value="<%= searchSubcode != null ? searchSubcode : "" %>"/>
  <input type="submit" value="조회"/>
</form>

<%
  if(list != null) {
    if(list.( C )() == 0) {
%>
  <p>해당 과목코드에 대한 성적 정보가 없습니다.</p>
<%
    } else {
%>
  <table border="1">
    <tr>
      <th>학번</th><th>이름</th><th>과목명</th><th>교수명</th>
      <th>중간</th><th>기말</th><th>총점</th><th>등급</th>
    </tr>
    <%
      for(ScoreDTO dto : list) {
    %>
    <tr>
      <td><%= dto.getStuid() %></td>
      <td><%= dto.getSname() %></td>
      <td><%= dto.getSubname() %></td>
      <td><%= dto.getProname() %></td>
      <td><%= dto.getMidscore() %></td>
      <td><%= dto.getFinalscore() %></td>
      <td><%= dto.( D )() %></td>
      <td><%= dto.getGrade() %></td>
    </tr>
    <%
      }
    %>
  </table>
<%
    }
  }
%>
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.ScoreDTO, java.util.List" %>
<%
  String searchSubcode = request.getParameter("searchSubcode");
  List<ScoreDTO> list = null;
  if(searchSubcode != null && !searchSubcode.isEmpty()) {
    StudentDAO dao = new StudentDAO();
    list = dao.selectBySubcode(searchSubcode);
  }
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>과목별 성적 조회</h2>
<form action="sub4.jsp" method="get">
  과목코드: <input type="text" name="searchSubcode"
    value="<%= searchSubcode != null ? searchSubcode : "" %>"/>
  <input type="submit" value="조회"/>
</form>

<%
  if(list != null) {
    if(list.size() == 0) {
%>
  <p>해당 과목코드에 대한 성적 정보가 없습니다.</p>
<%
    } else {
%>
  <table border="1">
    <tr>
      <th>학번</th><th>이름</th><th>과목명</th><th>교수명</th>
      <th>중간</th><th>기말</th><th>총점</th><th>등급</th>
    </tr>
    <%
      for(ScoreDTO dto : list) {
    %>
    <tr>
      <td><%= dto.getStuid() %></td>
      <td><%= dto.getSname() %></td>
      <td><%= dto.getSubname() %></td>
      <td><%= dto.getProname() %></td>
      <td><%= dto.getMidscore() %></td>
      <td><%= dto.getFinalscore() %></td>
      <td><%= dto.getTotal() %></td>
      <td><%= dto.getGrade() %></td>
    </tr>
    <%
      }
    %>
  </table>
<%
    }
  }
%>
<%@ include file="footer.jsp" %>`
    }
  ]
}
