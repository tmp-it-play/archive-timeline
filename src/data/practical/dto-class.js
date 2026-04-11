export default {
  id: 'dto-class',
  title: 'DTO 클래스 설계',
  description: 'DB 테이블 구조에 맞는 DTO(Data Transfer Object) 클래스를 작성합니다. 멤버 변수 선언, getter/setter, 데이터 가공(주민번호 성별 판별, 성적 등급 계산)을 익힙니다.',
  lessons: [
    {
      id: 'dto_01',
      title: 'MemberDTO — 기본 구조',
      description: `[요구사항]
member_tbl 컬럼 구조에 맞는 DTO 클래스를 완성합니다.

[컬럼 → Java 타입]
custno(NUMBER) → int
custname, phone, address, joindate, grade, city → String

필드 선언과 getter/setter 구조가 어떻게 DTO를 구성하는지 확인해보세요.`,
      type: 'code',
      language: 'java',
      starterCode: `package test;

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
      id: 'dto_02',
      title: 'StudentDTO — 주민번호 성별 판별',
      description: `[요구사항]
StudentDTO에 gender 필드를 추가하고,
DAO에서 주민번호(jumin) 7번째 자리로 성별을 판별하여 설정합니다.

[성별 판별 로직]
주민번호 index 6 (7번째 자리):
'1' 또는 '3' → "남자"
'2' 또는 '4' → "여자"

String의 substring(6, 7)로 7번째 자리를 꺼내고,
그 값을 gender 필드에 어떤 기준으로 매핑하는지 흐름을 확인해보세요.`,
      type: 'code',
      language: 'java',
      starterCode: `// DAO selectList() 메서드 안에서 성별 처리
while(rs.next()) {
  StudentDTO dto = new StudentDTO();
  dto.setStuid(rs.getString("stuid"));
  dto.setSname(rs.getString("sname"));

  String jumin = rs.getString("jumin");
  dto.setJumin(jumin);

  String genderCode = jumin.substring(6, 7);

  String gender = "";
  if(genderCode.equals("1") || genderCode.equals("3")) {
    gender = "남자";
  } else if(genderCode.equals("2") || genderCode.equals("4")) {
    gender = "여자";
  }
  dto.setGender(gender);

  dto.setDeptname(rs.getString("deptname"));
  dto.setPhone(rs.getString("phone"));
  dto.setEmail(rs.getString("email"));
  list.add(dto);
}`,
      solution: `// DAO selectList() 메서드 안에서 성별 처리
while(rs.next()) {
  StudentDTO dto = new StudentDTO();
  dto.setStuid(rs.getString("stuid"));
  dto.setSname(rs.getString("sname"));

  String jumin = rs.getString("jumin");
  dto.setJumin(jumin);

  String genderCode = jumin.substring(6, 7);

  String gender = "";
  if(genderCode.equals("1") || genderCode.equals("3")) {
    gender = "남자";
  } else if(genderCode.equals("2") || genderCode.equals("4")) {
    gender = "여자";
  }
  dto.setGender(gender);

  dto.setDeptname(rs.getString("deptname"));
  dto.setPhone(rs.getString("phone"));
  dto.setEmail(rs.getString("email"));
  list.add(dto);
}`
    },
    {
      id: 'dto_03',
      title: 'ScoreDTO — 등급 계산 (가중치 평균)',
      description: `[요구사항]
성적 DTO에서 가중치 적용 총점(total)과 등급(grade)을 계산합니다.

[가중치]
total = 중간×0.3 + 기말×0.3 + 출결×0.2 + 레포트×0.1 + 기타×0.1

[등급 기준]
95이상=A+, 90이상=A, 85이상=B+, 80이상=B
75이상=C+, 70이상=C, 65이상=D+, 60이상=D, 미만=F

평균(avg), 가중치 총점(total), 등급(grade)이 어떤 기준으로 계산되는지 확인해보세요.`,
      type: 'code',
      language: 'java',
      starterCode: `// DAO에서 성적 DTO 가공
int mid = rs.getInt("midscore");
int fin = rs.getInt("finalscore");
int att = rs.getInt("attend");
int rep = rs.getInt("report");
int etc = rs.getInt("etc");

int avg = (mid + fin + att + rep + etc) / 5;

double total = mid * 0.3 + fin * 0.3
             + att * 0.2 + rep * 0.1 + etc * 0.1;

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

dto.setGrade(grade);`,
      solution: `// DAO에서 성적 DTO 가공
int mid = rs.getInt("midscore");
int fin = rs.getInt("finalscore");
int att = rs.getInt("attend");
int rep = rs.getInt("report");
int etc = rs.getInt("etc");

int avg = (mid + fin + att + rep + etc) / 5;

double total = mid * 0.3 + fin * 0.3
             + att * 0.2 + rep * 0.1 + etc * 0.1;

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

dto.setGrade(grade);`
    }
  ]
}
