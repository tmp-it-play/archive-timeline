export default {
  id: 'hrd02-dao',
  title: 'HRD-02 StudentDAO / 성적 계산',
  description: 'HRD_02 학생 성적처리 프로그램의 StudentDAO를 구현합니다. 3-테이블 JOIN, 성별 판별, 등급 계산 로직을 학습합니다.',
  lessons: [
    {
      id: 'hrd02_dao_01',
      title: 'selectSub1() — 성별 판별 포함',
      description: `[과제 상황]
학생 목록을 조회하면서 주민번호로 성별을 판별합니다.

[성별 판별 로직]
jumin 컬럼 7번째 자리(index 6):
'1' 또는 '3' → "남자"
'2' 또는 '4' → "여자"

[SQL]
SELECT stuid, sname, deptname, jumin, phone, email
FROM TBL_STUDENT_202210 ORDER BY stuid

아래 ( A ) ~ ( D ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public List<StudentDTO> selectSub1() {
  List<StudentDTO> list = new ArrayList<>();
  String sql = "SELECT stuid, sname, deptname, jumin, phone, email "
             + "FROM TBL_STUDENT_202210 ORDER BY stuid";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      StudentDTO dto = new StudentDTO();
      dto.setStuid   (rs.getString("stuid"));
      dto.setSname   (rs.getString("sname"));
      dto.setDeptname(rs.getString("deptname"));
      String jumin = rs.getString("jumin");
      dto.setJumin(jumin);

      // 성별 판별: jumin 7번째 자리
      String genderCode = jumin.substring(( A ), 7);
      String gender = "";
      if(genderCode.equals("1") || genderCode.equals("( B )")) {
        gender = "남자";
      } else {
        gender = "( C )";
      }
      dto.setGender(gender);

      dto.setPhone(rs.getString("phone"));
      dto.setEmail(rs.getString("( D )"));
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`,
      solution: `public List<StudentDTO> selectSub1() {
  List<StudentDTO> list = new ArrayList<>();
  String sql = "SELECT stuid, sname, deptname, jumin, phone, email "
             + "FROM TBL_STUDENT_202210 ORDER BY stuid";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      StudentDTO dto = new StudentDTO();
      dto.setStuid   (rs.getString("stuid"));
      dto.setSname   (rs.getString("sname"));
      dto.setDeptname(rs.getString("deptname"));
      String jumin = rs.getString("jumin");
      dto.setJumin(jumin);

      String genderCode = jumin.substring(6, 7);
      String gender = "";
      if(genderCode.equals("1") || genderCode.equals("3")) {
        gender = "남자";
      } else {
        gender = "여자";
      }
      dto.setGender(gender);

      dto.setPhone(rs.getString("phone"));
      dto.setEmail(rs.getString("email"));
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`
    },
    {
      id: 'hrd02_dao_02',
      title: 'selectSub3() — 3테이블 JOIN + 등급 계산',
      description: `[과제 상황]
학생, 성적, 과목 3개 테이블을 조인하여 성적 현황을 조회합니다.

[등급 계산 (가중치 적용)]
total = 중간×0.3 + 기말×0.3 + 출결×0.2 + 레포트×0.1 + 기타×0.1
avg = (중간+기말+출결+레포트+기타) / 5

[등급 기준]
95이상=A+, 90이상=A, 85이상=B+, 80이상=B,
75이상=C+, 70이상=C, 65이상=D+, 60이상=D, 미만=F

아래 ( A ) ~ ( F ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public List<ScoreDTO> selectSub3() {
  List<ScoreDTO> list = new ArrayList<>();
  String sql = "SELECT st.stuid, st.sname, su.subname, sc.subcode, su.proname, "
             + "       sc.midscore, sc.finalscore, sc.attend, sc.report, sc.etc "
             + "FROM TBL_STUDENT_202210 st, TBL_SCORE_202210 sc, TBL_SUBJECT_202210 su "
             + "WHERE st.stuid = sc.stuid AND sc.subcode = ( A )";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      ScoreDTO dto = new ScoreDTO();
      dto.setStuid    (rs.getString("stuid"));
      dto.setSname    (rs.getString("sname"));
      dto.setSubname  (rs.getString("subname"));
      dto.setSubcode  (rs.getString("subcode"));
      dto.setProname  (rs.getString("proname"));

      int mid   = rs.getInt("midscore");
      int fin   = rs.getInt("( B )");
      int att   = rs.getInt("attend");
      int rep   = rs.getInt("report");
      int etc   = rs.getInt("etc");

      dto.setMidscore (mid);
      dto.setFinalscore(fin);
      dto.setAttend   (att);
      dto.setReport   (rep);
      dto.setEtc      (etc);

      int avg = (mid + fin + att + rep + etc) / ( C );
      double total = mid*0.3 + fin*( D ) + att*0.2 + rep*0.1 + etc*0.1;

      dto.setAvg(avg);
      dto.setTotal(total);

      String grade = "";
      if     (total >= 95) grade = "A+";
      else if(total >= 90) grade = "( E )";
      else if(total >= 85) grade = "B+";
      else if(total >= 80) grade = "B";
      else if(total >= 75) grade = "C+";
      else if(total >= 70) grade = "C";
      else if(total >= 65) grade = "D+";
      else if(total >= 60) grade = "D";
      else                 grade = "( F )";

      dto.setGrade(grade);
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`,
      solution: `public List<ScoreDTO> selectSub3() {
  List<ScoreDTO> list = new ArrayList<>();
  String sql = "SELECT st.stuid, st.sname, su.subname, sc.subcode, su.proname, "
             + "       sc.midscore, sc.finalscore, sc.attend, sc.report, sc.etc "
             + "FROM TBL_STUDENT_202210 st, TBL_SCORE_202210 sc, TBL_SUBJECT_202210 su "
             + "WHERE st.stuid = sc.stuid AND sc.subcode = su.subcode";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      ScoreDTO dto = new ScoreDTO();
      dto.setStuid    (rs.getString("stuid"));
      dto.setSname    (rs.getString("sname"));
      dto.setSubname  (rs.getString("subname"));
      dto.setSubcode  (rs.getString("subcode"));
      dto.setProname  (rs.getString("proname"));

      int mid   = rs.getInt("midscore");
      int fin   = rs.getInt("finalscore");
      int att   = rs.getInt("attend");
      int rep   = rs.getInt("report");
      int etc   = rs.getInt("etc");

      dto.setMidscore (mid);
      dto.setFinalscore(fin);
      dto.setAttend   (att);
      dto.setReport   (rep);
      dto.setEtc      (etc);

      int avg = (mid + fin + att + rep + etc) / 5;
      double total = mid*0.3 + fin*0.3 + att*0.2 + rep*0.1 + etc*0.1;

      dto.setAvg(avg);
      dto.setTotal(total);

      String grade = "";
      if     (total >= 95) grade = "A+";
      else if(total >= 90) grade = "A";
      else if(total >= 85) grade = "B+";
      else if(total >= 80) grade = "B";
      else if(total >= 75) grade = "C+";
      else if(total >= 70) grade = "C";
      else if(total >= 65) grade = "D+";
      else if(total >= 60) grade = "D";
      else                 grade = "F";

      dto.setGrade(grade);
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`
    },
    {
      id: 'hrd02_dao_03',
      title: 'selectSub4() — 과목코드 파라미터 검색',
      description: `[과제 상황]
과목코드를 파라미터로 받아 해당 과목의 성적만 조회하는 메서드입니다.

[SQL]
SELECT ... FROM 3개 테이블 WHERE ... AND sc.subcode = ?

PreparedStatement의 setString으로 과목코드 바인딩

아래 ( A ) ~ ( C ) 를 채우세요.`,
      type: 'code',
      language: 'java',
      starterCode: `public List<ScoreDTO> selectSub4(String searchSubcode) {
  List<ScoreDTO> list = new ArrayList<>();
  String sql = "SELECT st.stuid, st.sname, su.subname, sc.subcode, su.proname, "
             + "       sc.midscore, sc.finalscore, sc.attend, sc.report, sc.etc "
             + "FROM TBL_STUDENT_202210 st, TBL_SCORE_202210 sc, TBL_SUBJECT_202210 su "
             + "WHERE st.stuid = sc.stuid AND sc.subcode = su.subcode "
             + "AND sc.subcode = ( A )";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    pstmt.( B )(1, searchSubcode);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      ScoreDTO dto = new ScoreDTO();
      dto.setStuid    (rs.getString("stuid"));
      dto.setSname    (rs.getString("sname"));
      dto.setSubname  (rs.getString("subname"));
      dto.setSubcode  (rs.getString("subcode"));
      dto.setProname  (rs.getString("proname"));
      dto.setMidscore (rs.getInt("midscore"));
      dto.setFinalscore(rs.getInt("finalscore"));
      dto.setAttend   (rs.getInt("attend"));
      dto.setReport   (rs.getInt("report"));
      dto.setEtc      (rs.getInt("etc"));

      int mid = dto.getMidscore(), fin = dto.getFinalscore();
      int att = dto.getAttend(),   rep = dto.getReport(), etc = dto.getEtc();
      double total = mid*0.3 + fin*0.3 + att*0.2 + rep*0.1 + etc*0.1;
      dto.setTotal(total);

      String grade = total >= 90 ? "A" : total >= 80 ? "B"
                   : total >= 70 ? "C" : total >= 60 ? "D" : "( C )";
      dto.setGrade(grade);
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`,
      solution: `public List<ScoreDTO> selectSub4(String searchSubcode) {
  List<ScoreDTO> list = new ArrayList<>();
  String sql = "SELECT st.stuid, st.sname, su.subname, sc.subcode, su.proname, "
             + "       sc.midscore, sc.finalscore, sc.attend, sc.report, sc.etc "
             + "FROM TBL_STUDENT_202210 st, TBL_SCORE_202210 sc, TBL_SUBJECT_202210 su "
             + "WHERE st.stuid = sc.stuid AND sc.subcode = su.subcode "
             + "AND sc.subcode = ?";
  try {
    conn = getConn();
    pstmt = conn.prepareStatement(sql);
    pstmt.setString(1, searchSubcode);
    rs = pstmt.executeQuery();
    while(rs.next()) {
      ScoreDTO dto = new ScoreDTO();
      dto.setStuid    (rs.getString("stuid"));
      dto.setSname    (rs.getString("sname"));
      dto.setSubname  (rs.getString("subname"));
      dto.setSubcode  (rs.getString("subcode"));
      dto.setProname  (rs.getString("proname"));
      dto.setMidscore (rs.getInt("midscore"));
      dto.setFinalscore(rs.getInt("finalscore"));
      dto.setAttend   (rs.getInt("attend"));
      dto.setReport   (rs.getInt("report"));
      dto.setEtc      (rs.getInt("etc"));

      int mid = dto.getMidscore(), fin = dto.getFinalscore();
      int att = dto.getAttend(),   rep = dto.getReport(), etc = dto.getEtc();
      double total = mid*0.3 + fin*0.3 + att*0.2 + rep*0.1 + etc*0.1;
      dto.setTotal(total);

      String grade = total >= 90 ? "A" : total >= 80 ? "B"
                   : total >= 70 ? "C" : total >= 60 ? "D" : "F";
      dto.setGrade(grade);
      list.add(dto);
    }
    conn.close();
  } catch(Exception e) { e.printStackTrace(); }
  return list;
}`
    }
  ]
}
