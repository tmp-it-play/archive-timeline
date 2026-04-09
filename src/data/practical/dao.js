export default {
  id: 'dao-dto',
  title: 'DAO / DTO 패턴',
  description: '화면 구현 과제에서 핵심인 DAO(Data Access Object)와 DTO(Data Transfer Object) 패턴을 학습합니다. 데이터베이스와 웹 레이어 사이의 구조를 이해하세요.',
  lessons: [
    {
      id: 'dao_01',
      title: 'DTO (Data Transfer Object) 클래스',
      description: `DTO는 계층 간 데이터 전달을 위한 순수 데이터 객체입니다.
- DB의 테이블 구조와 1:1 매핑
- 멤버 변수(필드) + getter/setter 메서드로 구성
- 비즈니스 로직 없음

과제 레포(HRD_01) MemberDTO 구조:
TBL_MEMBER: custno, custname, phone, address, grade

빈 필드와 getter/setter를 완성해보세요.`,
      type: 'code',
      language: 'java',
      starterCode: `package exam;

public class MemberDTO {
    private int custno;
    private String custname;
    private String phone;
    private String address;
    private String grade;

    // custno getter
    public int getCustno() {
        return custno;
    }

    // custno setter
    public void setCustno(int custno) {
        this.___ = custno;
    }

    // custname getter - 완성하세요
    public String getCustname() {
        return ___;
    }

    // custname setter - 완성하세요
    public void setCustname(String custname) {
        this.custname = ___;
    }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}`,
      solution: `package exam;

public class MemberDTO {
    private int custno;
    private String custname;
    private String phone;
    private String address;
    private String grade;

    public int getCustno() {
        return custno;
    }

    public void setCustno(int custno) {
        this.custno = custno;
    }

    public String getCustname() {
        return custname;
    }

    public void setCustname(String custname) {
        this.custname = custname;
    }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}`
    },
    {
      id: 'dao_02',
      title: 'DAO (Data Access Object) 클래스 구조',
      description: `DAO는 데이터베이스 접근 로직을 담당합니다.
- DB 연결(Connection) 관리
- SQL 실행 (PreparedStatement)
- 결과를 DTO에 담아 반환

핵심 흐름:
Connection → PreparedStatement → executeQuery/executeUpdate → ResultSet → DTO

getMemberList() 메서드를 완성해보세요.`,
      type: 'code',
      language: 'java',
      starterCode: `package exam;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MemberDAO {

    // DB 연결 정보
    private static final String URL = "jdbc:mysql://localhost:3306/hrd_db";
    private static final String USER = "root";
    private static final String PASS = "1234";

    public List<MemberDTO> getMemberList() {
        List<MemberDTO> list = new ArrayList<>();
        String sql = "SELECT custno, custname, grade FROM TBL_MEMBER";

        try {
            // 1. DB 연결
            Connection con = DriverManager.getConnection(___, USER, PASS);

            // 2. SQL 준비
            PreparedStatement pstmt = con.prepareStatement(___);

            // 3. 실행
            ResultSet rs = pstmt.executeQuery();

            // 4. 결과를 DTO에 담기
            while (rs.next()) {
                MemberDTO dto = new MemberDTO();
                dto.setCustno(rs.getInt("custno"));
                dto.setCustname(rs.getString("___"));
                dto.setGrade(rs.getString("grade"));
                list.add(dto);
            }
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}`,
      solution: `package exam;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MemberDAO {

    private static final String URL = "jdbc:mysql://localhost:3306/hrd_db";
    private static final String USER = "root";
    private static final String PASS = "1234";

    public List<MemberDTO> getMemberList() {
        List<MemberDTO> list = new ArrayList<>();
        String sql = "SELECT custno, custname, grade FROM TBL_MEMBER";

        try {
            Connection con = DriverManager.getConnection(URL, USER, PASS);
            PreparedStatement pstmt = con.prepareStatement(sql);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                MemberDTO dto = new MemberDTO();
                dto.setCustno(rs.getInt("custno"));
                dto.setCustname(rs.getString("custname"));
                dto.setGrade(rs.getString("grade"));
                list.add(dto);
            }
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}`
    },
    {
      id: 'dao_03',
      title: 'JSP에서 DAO 호출 — 목록 출력',
      description: `DAO에서 가져온 데이터 목록을 JSP에서 테이블로 출력합니다.
이것이 화면 구현 과제의 핵심 패턴입니다:

DAO.getMemberList() → List<DTO> → JSP 반복문으로 테이블 출력

sub1.jsp처럼 목록을 테이블로 출력하는 부분을 완성하세요.`,
      type: 'html',
      starterCode: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ page import="exam.MemberDAO, exam.MemberDTO, java.util.List" %>
<%
  MemberDAO dao = new MemberDAO();
  List<MemberDTO> list = dao.getMemberList();
%>
<html>
<body>
  <h2>회원 목록</h2>
  <table border="1">
    <tr>
      <th>고객번호</th>
      <th>이름</th>
      <th>등급</th>
    </tr>
    <%
      // list를 순회하며 각 dto의 정보를 출력하세요
      for (MemberDTO dto : ___) {
    %>
    <tr>
      <td><%= dto.getCustno() %></td>
      <td><%= dto.___() %></td>
      <td><%= dto.getGrade() %></td>
    </tr>
    <%
      }
    %>
  </table>
</body>
</html>`,
      solution: `<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ page import="exam.MemberDAO, exam.MemberDTO, java.util.List" %>
<%
  MemberDAO dao = new MemberDAO();
  List<MemberDTO> list = dao.getMemberList();
%>
<html>
<body>
  <h2>회원 목록</h2>
  <table border="1">
    <tr>
      <th>고객번호</th>
      <th>이름</th>
      <th>등급</th>
    </tr>
    <%
      for (MemberDTO dto : list) {
    %>
    <tr>
      <td><%= dto.getCustno() %></td>
      <td><%= dto.getCustname() %></td>
      <td><%= dto.getGrade() %></td>
    </tr>
    <%
      }
    %>
  </table>
</body>
</html>`
    }
  ]
}
