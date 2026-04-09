export default {
  id: 'dao-impl',
  title: 'DAO 구현',
  description: 'DB 연결, INSERT, SELECT, JOIN+GROUP BY 쿼리를 처리하는 DAO 클래스를 구현합니다. Oracle JDBC의 Connection → PreparedStatement → executeQuery/executeUpdate → ResultSet 흐름을 익힙니다.',
  lessons: [
    {
      id: 'dao_01',
      title: 'DB 연결 및 다음 번호 자동 생성',
      description: `[요구사항]
Oracle DB에 연결하는 getConn() 메서드와
테이블의 MAX 번호 + 1을 반환하는 getNextNo() 메서드를 완성합니다.

[DB 정보]
- Driver: oracle.jdbc.driver.OracleDriver
- URL: jdbc:oracle:thin:@127.0.0.1:1521:xe
- ID: system / PW: 1234

[getNextNo SQL]
SELECT MAX(custno)+1 FROM member_tbl
→ rs.next() 후 rs.getInt(1)로 값 읽기

( A ) ~ ( E ) 빈칸을 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `package test;

import java.sql.*;

public class MemberDAO {
  private Connection conn;
  private PreparedStatement pstmt;
  private ResultSet rs;

  public Connection getConn() {
    try {
      Class.forName("oracle.jdbc.driver.( A )");
      conn = DriverManager.getConnection(
        "jdbc:oracle:thin:@127.0.0.1:1521:xe",
        "( B )", "1234"
      );
    } catch(Exception e) { e.printStackTrace(); }
    return conn;
  }

  public int getNextNo() {
    int no = 1;
    String sql = "SELECT MAX(custno)+1 FROM ( C )";
    try {
      conn = getConn();
      pstmt = conn.prepareStatement(( D ));
      rs = pstmt.executeQuery();
      if(rs.next()) {
        no = rs.getInt(( E ));
      }
      conn.close();
    } catch(Exception e) { e.printStackTrace(); }
    return no;
  }
}`,
      solution: `package test;

import java.sql.*;

public class MemberDAO {
  private Connection conn;
  private PreparedStatement pstmt;
  private ResultSet rs;

  public Connection getConn() {
    try {
      Class.forName("oracle.jdbc.driver.OracleDriver");
      conn = DriverManager.getConnection(
        "jdbc:oracle:thin:@127.0.0.1:1521:xe",
        "system", "1234"
      );
    } catch(Exception e) { e.printStackTrace(); }
    return conn;
  }

  public int getNextNo() {
    int no = 1;
    String sql = "SELECT MAX(custno)+1 FROM member_tbl";
    try {
      conn = getConn();
      pstmt = conn.prepareStatement(sql);
      rs = pstmt.executeQuery();
      if(rs.next()) {
        no = rs.getInt(1);
      }
      conn.close();
    } catch(Exception e) { e.printStackTrace(); }
    return no;
  }
}`
    },
    {
      id: 'dao_02',
      title: 'insertMember() — INSERT 처리',
      description: `[요구사항]
MemberDTO를 받아 member_tbl에 INSERT하는 메서드를 완성합니다.

[SQL]
INSERT INTO member_tbl VALUES (?,?,?,?,?,?,?)
파라미터 순서: custno, custname, phone, address, joindate, grade, city

[핵심]
- pstmt.setInt(인덱스, 값) — int 타입
- pstmt.setString(인덱스, 값) — String 타입
- pstmt.executeUpdate() — INSERT/UPDATE/DELETE 실행

( A ) ~ ( E ) 빈칸을 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public int insertMember(MemberDTO dto) {
  int result = 0;
  String sql = "INSERT INTO member_tbl VALUES (?,?,?,?,?,?,?)";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    pstmt.setInt   (1, dto.getCustno());
    pstmt.setString(2, dto.( A )());
    pstmt.setString(3, dto.getPhone());
    pstmt.setString(4, dto.( B )());
    pstmt.setString(5, dto.getJoindate());
    pstmt.setString(6, dto.getGrade());
    pstmt.setString(7, dto.( C )());
    result = pstmt.( D )();
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return ( E );
}`,
      solution: `public int insertMember(MemberDTO dto) {
  int result = 0;
  String sql = "INSERT INTO member_tbl VALUES (?,?,?,?,?,?,?)";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    pstmt.setInt   (1, dto.getCustno());
    pstmt.setString(2, dto.getCustname());
    pstmt.setString(3, dto.getPhone());
    pstmt.setString(4, dto.getAddress());
    pstmt.setString(5, dto.getJoindate());
    pstmt.setString(6, dto.getGrade());
    pstmt.setString(7, dto.getCity());
    result = pstmt.executeUpdate();
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return result;
}`
    },
    {
      id: 'dao_03',
      title: 'selectMemberList() — 전체 조회',
      description: `[요구사항]
전체 회원을 번호 순으로 조회하여 List<MemberDTO>로 반환합니다.

[SQL]
SELECT custno, custname, phone, address, joindate, grade, city
FROM member_tbl ORDER BY custno

[핵심]
- executeQuery() → ResultSet 반환
- while(rs.next()) 반복으로 DTO 생성 후 list.add()

( A ) ~ ( F ) 빈칸을 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public List<MemberDTO> selectMemberList() {
  List<MemberDTO> list = new ArrayList<>();
  String sql = "SELECT custno,custname,phone,address,joindate,grade,city "
             + "FROM member_tbl ORDER BY custno";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.( A )();
    while(rs.( B )()) {
      MemberDTO dto = new MemberDTO();
      dto.setCustno  (rs.getInt("( C )"));
      dto.setCustname(rs.getString("custname"));
      dto.setPhone   (rs.getString("phone"));
      dto.setAddress (rs.( D )("address"));
      dto.setJoindate(rs.getString("joindate"));
      dto.setGrade   (rs.getString("( E )"));
      dto.setCity    (rs.getString("city"));
      list.( F )(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`,
      solution: `public List<MemberDTO> selectMemberList() {
  List<MemberDTO> list = new ArrayList<>();
  String sql = "SELECT custno,custname,phone,address,joindate,grade,city "
             + "FROM member_tbl ORDER BY custno";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      MemberDTO dto = new MemberDTO();
      dto.setCustno  (rs.getInt("custno"));
      dto.setCustname(rs.getString("custname"));
      dto.setPhone   (rs.getString("phone"));
      dto.setAddress (rs.getString("address"));
      dto.setJoindate(rs.getString("joindate"));
      dto.setGrade   (rs.getString("grade"));
      dto.setCity    (rs.getString("city"));
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`
    },
    {
      id: 'dao_04',
      title: 'selectSalesSummary() — JOIN + GROUP BY',
      description: `[요구사항]
회원 테이블과 주문 테이블을 조인하여 회원별 총 구매금액을 내림차순으로 조회합니다.

[SQL]
SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total
FROM member_tbl m, sales_tbl s
WHERE m.custno = s.custno
GROUP BY m.custno, m.custname, m.grade
ORDER BY total DESC

( A ) ~ ( E ) 빈칸을 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public List<TotalDTO> selectSalesSummary() {
  List<TotalDTO> list = new ArrayList<>();
  String sql = "SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total "
             + "FROM member_tbl m, sales_tbl s "
             + "WHERE ( A ) "
             + "GROUP BY m.custno, m.custname, m.grade "
             + "ORDER BY ( B ) DESC";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      TotalDTO dto = new TotalDTO();
      dto.setCustno  (rs.getInt("custno"));
      dto.setCustname(rs.getString("( C )"));
      dto.setGrade   (rs.getString("grade"));
      dto.setTotal   (rs.getInt("( D )"));
      list.( E )(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`,
      solution: `public List<TotalDTO> selectSalesSummary() {
  List<TotalDTO> list = new ArrayList<>();
  String sql = "SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total "
             + "FROM member_tbl m, sales_tbl s "
             + "WHERE m.custno = s.custno "
             + "GROUP BY m.custno, m.custname, m.grade "
             + "ORDER BY total DESC";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      TotalDTO dto = new TotalDTO();
      dto.setCustno  (rs.getInt("custno"));
      dto.setCustname(rs.getString("custname"));
      dto.setGrade   (rs.getString("grade"));
      dto.setTotal   (rs.getInt("total"));
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`
    }
  ]
}
