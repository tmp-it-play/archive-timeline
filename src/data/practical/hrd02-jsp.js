export default {
  id: 'hrd02-jsp',
  title: 'HRD-02 학생성적 JSP',
  description: '학생 성적처리 프로그램(HRD_02) 실기 과제 형식으로 JSP 화면을 구현합니다. sub1.jsp(학생현황), sub3.jsp(성적현황), sub4.jsp(과목별조회) 순으로 학습합니다.',
  lessons: [
    {
      id: 'hrd02_01',
      title: 'sub1.jsp — 학생 현황 (주민번호 처리)',
      description: `[과제 상황]
학생 현황 목록에서 주민번호를 포맷(XXXXXX-XXXXXXX)하고
성별을 주민번호 7번째 자리로 판별해 출력합니다.

[TBL_STUDENT_202210 컬럼]
stuid, sname, deptname, jumin, phone, email

[성별 판별 로직]
jumin 7번째 자리(index 6) → '3' 또는 '1' = 남자, '4' 또는 '2' = 여자
(StudentDAO.selectSub1()에서 처리하여 gender 필드로 반환)

[주민번호 포맷]
substring(0,6) + "-" + substring(6)

주민번호 포맷과 성별 표시 로직이 화면에 어떻게 연결되는지 확인해보세요.`,
      type: 'live-jsp',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.StudentDTO, java.util.List" %>
<%
  StudentDAO dao = new StudentDAO();
  List<StudentDTO> list = dao.selectSub1();
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>학생 현황</h2>
<table border="1">
  <tr>
    <th>학번</th><th>이름</th><th>주민번호</th>
    <th>학과</th><th>성별</th><th>연락처</th><th>이메일</th>
  </tr>
  <%
    for(StudentDTO dto : list) {
      String jumin = dto.getJumin();
      String fmtJumin = jumin.substring(0,6) + "-" + jumin.substring(6);
  %>
  <tr>
    <td><%= dto.getStuid() %></td>
    <td><%= dto.getSname() %></td>
    <td><%= fmtJumin %></td>
    <td><%= dto.getDeptname() %></td>
    <td><%= dto.getGender() %></td>
    <td><%= dto.getPhone() %></td>
    <td><%= dto.getEmail() %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.StudentDTO, java.util.List" %>
<%
  StudentDAO dao = new StudentDAO();
  List<StudentDTO> list = dao.selectSub1();
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>학생 현황</h2>
<table border="1">
  <tr>
    <th>학번</th><th>이름</th><th>주민번호</th>
    <th>학과</th><th>성별</th><th>연락처</th><th>이메일</th>
  </tr>
  <%
    for(StudentDTO dto : list) {
      String jumin = dto.getJumin();
      String fmtJumin = jumin.substring(0,6) + "-" + jumin.substring(6);
  %>
  <tr>
    <td><%= dto.getStuid() %></td>
    <td><%= dto.getSname() %></td>
    <td><%= fmtJumin %></td>
    <td><%= dto.getDeptname() %></td>
    <td><%= dto.getGender() %></td>
    <td><%= dto.getPhone() %></td>
    <td><%= dto.getEmail() %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`
    },
    {
      id: 'hrd02_02',
      title: 'sub3.jsp — 성적 현황 (3-테이블 JOIN)',
      description: `[과제 상황]
학생, 성적, 과목 3개 테이블을 조인하여 성적 현황을 출력합니다.
평균(avg)과 총점(total)은 DAO에서 계산되어 ScoreDTO에 담겨 옵니다.

[ScoreDTO 필드]
stuid, sname, subname, subcode, proname,
midscore, finalscore, attend, report, etc, avg(int), total(double), grade

[total 출력 포맷] DecimalFormat("0.0")

3개 테이블 조인 결과가 화면에 출력되는 구조를 확인해보세요.`,
      type: 'live-jsp',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.ScoreDTO, java.util.List, java.text.DecimalFormat" %>
<%
  StudentDAO dao = new StudentDAO();
  List<ScoreDTO> list = dao.selectSub3();
  DecimalFormat df = new DecimalFormat("0.0");
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>성적 현황</h2>
<table border="1">
  <tr>
    <th>학번</th><th>이름</th><th>과목명</th><th>과목코드</th><th>교수명</th>
    <th>중간</th><th>기말</th><th>출결</th><th>레포트</th><th>기타</th>
    <th>평균</th><th>총점</th><th>등급</th>
  </tr>
  <%
    for(ScoreDTO dto : list) {
  %>
  <tr>
    <td><%= dto.getStuid() %></td>
    <td><%= dto.getSname() %></td>
    <td><%= dto.getSubname() %></td>
    <td><%= dto.getSubcode() %></td>
    <td><%= dto.getProname() %></td>
    <td><%= dto.getMidscore() %></td>
    <td><%= dto.getFinalscore() %></td>
    <td><%= dto.getAttend() %></td>
    <td><%= dto.getReport() %></td>
    <td><%= dto.getEtc() %></td>
    <td><%= dto.getAvg() %></td>
    <td><%= df.format(dto.getTotal()) %></td>
    <td><%= dto.getGrade() %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.ScoreDTO, java.util.List, java.text.DecimalFormat" %>
<%
  StudentDAO dao = new StudentDAO();
  List<ScoreDTO> list = dao.selectSub3();
  DecimalFormat df = new DecimalFormat("0.0");
%>
<%@ include file="header.jsp" %>
<%@ include file="nav.jsp" %>

<h2>성적 현황</h2>
<table border="1">
  <tr>
    <th>학번</th><th>이름</th><th>과목명</th><th>과목코드</th><th>교수명</th>
    <th>중간</th><th>기말</th><th>출결</th><th>레포트</th><th>기타</th>
    <th>평균</th><th>총점</th><th>등급</th>
  </tr>
  <%
    for(ScoreDTO dto : list) {
  %>
  <tr>
    <td><%= dto.getStuid() %></td>
    <td><%= dto.getSname() %></td>
    <td><%= dto.getSubname() %></td>
    <td><%= dto.getSubcode() %></td>
    <td><%= dto.getProname() %></td>
    <td><%= dto.getMidscore() %></td>
    <td><%= dto.getFinalscore() %></td>
    <td><%= dto.getAttend() %></td>
    <td><%= dto.getReport() %></td>
    <td><%= dto.getEtc() %></td>
    <td><%= dto.getAvg() %></td>
    <td><%= df.format(dto.getTotal()) %></td>
    <td><%= dto.getGrade() %></td>
  </tr>
  <%
    }
  %>
</table>
<%@ include file="footer.jsp" %>`
    },
    {
      id: 'hrd02_03',
      title: 'sub4.jsp — 과목별 성적 조회 (검색 폼)',
      description: `[과제 상황]
과목코드를 입력받아 해당 과목의 성적을 조회하는 화면입니다.
결과가 없을 경우 "해당 과목코드에 대한 성적 정보가 없습니다." 출력.

[요구사항]
① 검색 폼 action은 sub4.jsp (자기 자신), method는 GET
② searchSubcode 파라미터가 있을 때만 DAO 조회 실행
③ list가 비어있으면 안내 메시지 출력

검색 폼과 결과 분기 처리 흐름을 확인해보세요.`,
      type: 'live-jsp',
      language: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.ScoreDTO, java.util.List" %>
<%
  String searchSubcode = request.getParameter("searchSubcode");
  List<ScoreDTO> list = null;
  if(searchSubcode != null && !searchSubcode.isEmpty()) {
    StudentDAO dao = new StudentDAO();
    list = dao.selectSub4(searchSubcode);
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
      <th>중간</th><th>기말</th><th>출결</th><th>레포트</th>
      <th>기타</th><th>총점</th><th>등급</th>
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
      <td><%= dto.getAttend() %></td>
      <td><%= dto.getReport() %></td>
      <td><%= dto.getEtc() %></td>
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
<%@ include file="footer.jsp" %>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="test.StudentDAO, test.ScoreDTO, java.util.List" %>
<%
  String searchSubcode = request.getParameter("searchSubcode");
  List<ScoreDTO> list = null;
  if(searchSubcode != null && !searchSubcode.isEmpty()) {
    StudentDAO dao = new StudentDAO();
    list = dao.selectSub4(searchSubcode);
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
      <th>중간</th><th>기말</th><th>출결</th><th>레포트</th>
      <th>기타</th><th>총점</th><th>등급</th>
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
      <td><%= dto.getAttend() %></td>
      <td><%= dto.getReport() %></td>
      <td><%= dto.getEtc() %></td>
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
