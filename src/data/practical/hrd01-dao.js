export default {
  id: 'hrd01-dao',
  title: 'HRD-01 MemberDAO / DTO',
  description: 'HRD_01 쇼핑몰 회원관리 프로그램의 Java DAO/DTO 클래스를 구현합니다. Oracle JDBC 연결, PreparedStatement, ResultSet 처리를 학습합니다.',
  lessons: [
    {
      id: 'hrd01_dao_01',
      title: 'MemberDTO.java — 필드와 getter/setter',
      description: `[과제 상황]
member_tbl_02 테이블 구조에 맞는 DTO 클래스를 완성합니다.

[테이블 컬럼]
custno(NUMBER), custname(VARCHAR2), phone(VARCHAR2),
address(VARCHAR2), joindate(VARCHAR2), grade(VARCHAR2), city(VARCHAR2)

[요구사항]
① 각 필드에 맞는 Java 타입으로 선언
② 모든 필드에 getter/setter 메서드 작성

아래 ( A ) ~ ( F ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `package test;

public class MemberDTO {
  private ( A ) custno;
  private String custname;
  private String phone;
  private String address;
  private String joindate;
  private String grade;
  private String city;

  public int getCustno() { return custno; }
  public void setCustno(int custno) { this.custno = ( B ); }

  public String getCustname() { return custname; }
  public void setCustname(String custname) { this.( C ) = custname; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getAddress() { return ( D ); }
  public void setAddress(String address) { this.address = address; }

  public String getJoindate() { return joindate; }
  public void setJoindate(String joindate) { this.joindate = ( E ); }

  public String getGrade() { return grade; }
  public void setGrade(String grade) { this.grade = grade; }

  public String getCity() { return ( F ); }
  public void setCity(String city) { this.city = city; }
}`,
      solution: `package test;

public class MemberDTO {
  private int custno;
  private String custname;
  private String phone;
  private String address;
  private String joindate;
  private String grade;
  private String city;

  public int getCustno() { return custno; }
  public void setCustno(int custno) { this.custno = custno; }

  public String getCustname() { return custname; }
  public void setCustname(String custname) { this.custname = custname; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getJoindate() { return joindate; }
  public void setJoindate(String joindate) { this.joindate = joindate; }

  public String getGrade() { return grade; }
  public void setGrade(String grade) { this.grade = grade; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }
}`
    },
    {
      id: 'hrd01_dao_02',
      title: 'MemberDAO — DB 연결 및 getCustno()',
      description: `[과제 상황]
Oracle DB에 연결하고 다음 회원번호를 자동 생성하는 메서드를 완성합니다.

[DB 연결 정보]
- Driver: oracle.jdbc.driver.OracleDriver
- URL: jdbc:oracle:thin:@127.0.0.1:1521:xe
- user: system, password: 1234

[getCustno() 동작]
SELECT MAX(custno)+1 FROM member_tbl_02 실행 후 결과 반환
(데이터가 없으면 1 반환)

아래 ( A ) ~ ( E ) 를 채우세요.`,
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

  public int getCustno() {
    int custno = 1;
    String sql = "SELECT ( C )(custno)+1 FROM member_tbl_02";
    try {
      conn = getConn();
      pstmt = conn.prepareStatement(( D ));
      rs = pstmt.executeQuery();
      if(rs.next()) {
        custno = rs.getInt(( E ));
      }
      conn.close();
    } catch(Exception e) { e.printStackTrace(); }
    return custno;
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

  public int getCustno() {
    int custno = 1;
    String sql = "SELECT MAX(custno)+1 FROM member_tbl_02";
    try {
      conn = getConn();
      pstmt = conn.prepareStatement(sql);
      rs = pstmt.executeQuery();
      if(rs.next()) {
        custno = rs.getInt(1);
      }
      conn.close();
    } catch(Exception e) { e.printStackTrace(); }
    return custno;
  }
}`
    },
    {
      id: 'hrd01_dao_03',
      title: 'MemberDAO — insertSub1() / selectSub2()',
      description: `[과제 상황]
회원 등록 INSERT와 목록 조회 SELECT 메서드를 완성합니다.

[insertSub1 SQL]
INSERT INTO member_tbl_02 VALUES (?, ?, ?, ?, ?, ?, ?)
파라미터 순서: custno, custname, phone, address, joindate, grade, city

[selectSub2 SQL]
SELECT custno, custname, phone, address, joindate, grade, city
FROM member_tbl_02 ORDER BY custno

아래 ( A ) ~ ( H ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public int insertSub1(MemberDTO dto) {
  int result = 0;
  String sql = "INSERT INTO member_tbl_02 VALUES (?,?,?,?,?,?,?)";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    pstmt.setInt   (1, dto.getCustno());
    pstmt.setString(2, dto.( A )());
    pstmt.setString(3, dto.getPhone());
    pstmt.setString(4, dto.getAddress());
    pstmt.setString(5, dto.( B )());
    pstmt.setString(6, dto.getGrade());
    pstmt.setString(7, dto.getCity());
    result = pstmt.( C )();
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return result;
}

public List<MemberDTO> selectSub2() {
  List<MemberDTO> list = new ArrayList<>();
  String sql = "SELECT custno,custname,phone,address,joindate,grade,city "
             + "FROM member_tbl_02 ORDER BY ( D )";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.( E )();
    while(rs.( F )()) {
      MemberDTO dto = new MemberDTO();
      dto.setCustno  (rs.getInt("custno"));
      dto.setCustname(rs.( G )("custname"));
      dto.setPhone   (rs.getString("phone"));
      dto.setAddress (rs.getString("address"));
      dto.setJoindate(rs.getString("joindate"));
      dto.setGrade   (rs.getString("grade"));
      dto.setCity    (rs.getString("( H )"));
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`,
      solution: `public int insertSub1(MemberDTO dto) {
  int result = 0;
  String sql = "INSERT INTO member_tbl_02 VALUES (?,?,?,?,?,?,?)";
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
}

public List<MemberDTO> selectSub2() {
  List<MemberDTO> list = new ArrayList<>();
  String sql = "SELECT custno,custname,phone,address,joindate,grade,city "
             + "FROM member_tbl_02 ORDER BY custno";
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
      id: 'hrd01_dao_04',
      title: 'MemberDAO — selectSub3() (JOIN + GROUP BY)',
      description: `[과제 상황]
회원별 매출 합계를 조회하는 메서드입니다. member_tbl_02와 money_tbl_02를 JOIN합니다.

[SQL 요구사항]
SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total
FROM member_tbl_02 m, money_tbl_02 s
WHERE m.custno = s.custno
GROUP BY m.custno, m.custname, m.grade
ORDER BY total DESC

[TotalDTO 필드]
custno(int), custname, grade, total(int)

아래 ( A ) ~ ( E ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public List<TotalDTO> selectSub3() {
  List<TotalDTO> list = new ArrayList<>();
  String sql = "SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total "
             + "FROM member_tbl_02 m, money_tbl_02 s "
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
      solution: `public List<TotalDTO> selectSub3() {
  List<TotalDTO> list = new ArrayList<>();
  String sql = "SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total "
             + "FROM member_tbl_02 m, money_tbl_02 s "
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
