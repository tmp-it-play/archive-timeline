import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicById } from '../data/practical/index.js'
import CodeEditor from '../components/CodeEditor.jsx'
import { hoverTooltip, EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

const DEFAULT_HTML_ANNOTATIONS = [
  { tag: 'form', color: '#2563eb', label: 'form', description: '입력값을 서버로 전송하는 폼 영역.' },
  { tag: 'table', color: '#2563eb', label: 'table', description: '표 전체를 감싸는 컨테이너.' },
  { tag: 'tr', color: '#16a34a', label: 'tr', description: '표의 가로 행(row).' },
  { tag: 'th', color: '#d97706', label: 'th', description: '표의 제목 셀(header).' },
  { tag: 'td', color: '#dc2626', label: 'td', description: '표의 데이터 셀.' },
  { tag: 'input', color: '#7c3aed', label: 'input', description: '사용자 입력을 받는 입력 필드.' },
  { tag: 'button', color: '#7c3aed', label: 'button', description: '클릭 가능한 버튼 요소.' },
  { tag: 'select', color: '#0891b2', label: 'select', description: '여러 항목 중 하나를 고르는 선택 박스.' },
  { tag: 'option', color: '#0f766e', label: 'option', description: 'select 안의 개별 선택 항목.' },
  { tag: 'textarea', color: '#9333ea', label: 'textarea', description: '여러 줄 텍스트 입력 영역.' },
  { tag: 'label', color: '#ea580c', label: 'label', description: '입력 요소의 이름이나 설명.' },
  { tag: 'a', color: '#0284c7', label: 'a', description: '다른 페이지나 위치로 이동하는 링크.' },
  { tag: 'div', color: '#6b7280', label: 'div', description: '화면 구획을 나누는 블록 컨테이너.' },
  { tag: 'span', color: '#6b7280', label: 'span', description: '짧은 인라인 구간을 감싸는 요소.' },
  { tag: 'h1', color: '#b91c1c', label: 'h1', description: '가장 중요한 제목.' },
  { tag: 'h2', color: '#b91c1c', label: 'h2', description: '섹션 제목.' },
  { tag: 'h3', color: '#b91c1c', label: 'h3', description: '하위 섹션 제목.' },
  { tag: 'p', color: '#475569', label: 'p', description: '문단 텍스트.' },
]

function getLessonAnnotations(lesson) {
  if (lesson.annotations?.length) return lesson.annotations
  return DEFAULT_HTML_ANNOTATIONS
}

const ACTION_FLOW_STEPS = [
  {
    key: 'encoding',
    title: '1. 요청 인코딩 설정',
    summary: 'POST 한글 데이터가 깨지지 않도록 UTF-8을 먼저 지정합니다.',
    code: 'request.setCharacterEncoding("UTF-8")',
    highlight: 'request.setCharacterEncoding("UTF-8")',
    state: ['request body', 'custname=홍길동', 'address=서울시', 'grade=A'],
  },
  {
    key: 'params',
    title: '2. 파라미터 꺼내기',
    summary: '폼에서 넘어온 값을 request.getParameter()로 변수에 담습니다.',
    code: 'String custname = request.getParameter("custname")',
    highlight: 'String custname = request.getParameter("custname")',
    state: ['custno -> int 변환', 'custname / phone / address', 'joindate / grade / city 수신'],
  },
  {
    key: 'dto',
    title: '3. DTO 구성',
    summary: 'MemberDTO에 setter로 데이터를 채워 DAO가 한 번에 전달받게 합니다.',
    code: 'dto.setCustname(custname)',
    highlight: 'dto.setCustname(custname)',
    state: ['dto.custno = 1001', 'dto.custname = 홍길동', 'dto.grade = A', 'dto.city = 01'],
  },
  {
    key: 'dao',
    title: '4. DAO 저장 호출',
    summary: 'DAO가 SQL INSERT를 수행하도록 완성된 DTO를 넘깁니다.',
    code: 'dao.insertMember(dto)',
    highlight: 'dao.insertMember(dto)',
    state: ['DAO', 'INSERT member_tbl ...', '입력 데이터가 DB에 저장됨'],
  },
  {
    key: 'redirect',
    title: '5. 화면 이동',
    summary: '처리가 끝나면 등록 화면으로 다시 이동시켜 새 입력을 받을 수 있게 합니다.',
    code: 'response.sendRedirect("sub1.jsp")',
    highlight: 'response.sendRedirect("sub1.jsp")',
    state: ['response', '302 Redirect', '브라우저가 sub1.jsp 재요청'],
  },
]

const VALIDATION_CASES = [
  {
    key: 'name',
    label: '이름 누락',
    values: { custname: '', phone: '010-1234-5678', address: '서울시', grade: 'A', city: '01' },
    alert: '이름을 입력하세요.',
    focus: 'custname',
  },
  {
    key: 'phone',
    label: '연락처 누락',
    values: { custname: '홍길동', phone: '', address: '서울시', grade: 'A', city: '01' },
    alert: '연락처를 입력하세요.',
    focus: 'phone',
  },
  {
    key: 'address',
    label: '주소 누락',
    values: { custname: '홍길동', phone: '010-1234-5678', address: '', grade: 'A', city: '01' },
    alert: '주소를 입력하세요.',
    focus: 'address',
  },
  {
    key: 'success',
    label: '모두 입력됨',
    values: { custname: '홍길동', phone: '010-1234-5678', address: '서울시', grade: 'A', city: '01' },
    alert: '회원등록이 완료 되었습니다!',
    focus: null,
  },
]

const DAO_CONNECTION_STEPS = [
  {
    key: 'driver',
    title: '1. JDBC 드라이버 로드',
    summary: 'Oracle JDBC 클래스를 메모리에 올려 DB 연결 준비를 합니다.',
    code: 'Class.forName("oracle.jdbc.driver.OracleDriver")',
    highlight: 'Class.forName("oracle.jdbc.driver.OracleDriver")',
    sql: null,
    active: 'driver',
  },
  {
    key: 'conn',
    title: '2. Connection 생성',
    summary: 'URL, 계정, 비밀번호로 실제 DB 연결 객체를 얻습니다.',
    code: 'DriverManager.getConnection("jdbc:oracle:thin:@127.0.0.1:1521:xe", "system", "1234")',
    highlight: 'DriverManager.getConnection(',
    sql: null,
    active: 'conn',
  },
  {
    key: 'prepare',
    title: '3. SQL 준비',
    summary: 'MAX(custno)+1 조회용 PreparedStatement를 만듭니다.',
    code: 'pstmt = conn.prepareStatement(sql)',
    highlight: 'pstmt = conn.prepareStatement(sql)',
    sql: 'SELECT MAX(custno)+1 FROM member_tbl',
    active: 'pstmt',
  },
  {
    key: 'query',
    title: '4. Query 실행',
    summary: 'executeQuery()로 ResultSet을 받아 한 줄 결과를 읽습니다.',
    code: 'rs = pstmt.executeQuery()',
    highlight: 'rs = pstmt.executeQuery()',
    sql: 'SELECT MAX(custno)+1 FROM member_tbl',
    active: 'rs',
  },
  {
    key: 'result',
    title: '5. 결과 반환',
    summary: 'rs.next() 후 첫 번째 컬럼 값을 읽어 다음 번호로 반환합니다.',
    code: 'no = rs.getInt(1)',
    highlight: 'no = rs.getInt(1)',
    sql: null,
    active: 'result',
  },
]

const DAO_INSERT_STEPS = [
  {
    key: 'conn',
    title: '1. Connection 생성',
    summary: 'getConn()으로 DB 연결을 준비합니다.',
    code: 'conn = getConn()',
    highlight: 'conn = getConn()',
    sql: null,
    active: 'conn',
  },
  {
    key: 'prepare',
    title: '2. INSERT SQL 준비',
    summary: 'PreparedStatement에 INSERT 문을 준비합니다.',
    code: 'pstmt = conn.prepareStatement(sql)',
    highlight: 'pstmt = conn.prepareStatement(sql)',
    sql: 'INSERT INTO member_tbl VALUES (?,?,?,?,?,?,?)',
    active: 'pstmt',
  },
  {
    key: 'bind',
    title: '3. DTO 값을 바인딩',
    summary: 'DTO 필드를 순서대로 ? 자리에 채웁니다.',
    code: 'pstmt.setString(2, dto.getCustname())',
    highlight: 'pstmt.setString(2, dto.getCustname())',
    sql: '1:custno, 2:custname, 3:phone, 4:address, 5:joindate, 6:grade, 7:city',
    active: 'dto',
  },
  {
    key: 'execute',
    title: '4. executeUpdate 실행',
    summary: 'INSERT/UPDATE/DELETE는 executeUpdate()로 처리 결과 건수를 받습니다.',
    code: 'result = pstmt.executeUpdate()',
    highlight: 'result = pstmt.executeUpdate()',
    sql: 'rows affected = 1',
    active: 'execute',
  },
  {
    key: 'return',
    title: '5. 결과 반환',
    summary: '처리 건수 result를 호출한 쪽으로 돌려줍니다.',
    code: 'return result',
    highlight: 'return result',
    sql: null,
    active: 'return',
  },
]

const DAO_SELECT_STEPS = [
  {
    key: 'conn',
    title: '1. Connection 생성',
    summary: '조회 전에 DB 연결을 준비합니다.',
    code: 'conn = getConn()',
    highlight: 'conn = getConn()',
    sql: null,
    active: 'conn',
  },
  {
    key: 'prepare',
    title: '2. SELECT SQL 준비',
    summary: '전체 회원 목록 조회 SQL을 PreparedStatement에 준비합니다.',
    code: 'pstmt = conn.prepareStatement(sql)',
    highlight: 'pstmt = conn.prepareStatement(sql)',
    sql: 'SELECT custno,custname,phone,address,joindate,grade,city FROM member_tbl ORDER BY custno',
    active: 'pstmt',
  },
  {
    key: 'query',
    title: '3. executeQuery 실행',
    summary: 'SQL 실행 결과를 ResultSet으로 받습니다.',
    code: 'rs = pstmt.executeQuery()',
    highlight: 'rs = pstmt.executeQuery()',
    sql: 'rows -> ResultSet',
    active: 'rs',
  },
  {
    key: 'dto',
    title: '4. DTO 생성 및 매핑',
    summary: '현재 행의 컬럼값을 MemberDTO에 채웁니다.',
    code: 'dto.setCustname(rs.getString("custname"))',
    highlight: 'dto.setCustname(rs.getString("custname"))',
    sql: 'ResultSet row -> MemberDTO',
    active: 'dto',
  },
  {
    key: 'list',
    title: '5. List에 추가',
    summary: '완성된 DTO를 list.add(dto)로 누적합니다.',
    code: 'list.add(dto)',
    highlight: 'list.add(dto)',
    sql: 'List<MemberDTO>',
    active: 'list',
  },
]

const DAO_SUMMARY_STEPS = [
  {
    key: 'prepare',
    title: '1. JOIN + GROUP BY SQL 준비',
    summary: '회원과 주문 테이블을 조인하고 합계를 구하는 SQL을 준비합니다.',
    code: 'pstmt = conn.prepareStatement(sql)',
    highlight: 'pstmt = conn.prepareStatement(sql)',
    sql: 'SELECT m.custno, m.custname, m.grade, SUM(s.price) AS total ...',
    active: 'pstmt',
  },
  {
    key: 'query',
    title: '2. 집계 쿼리 실행',
    summary: 'executeQuery()로 회원별 합계 결과를 ResultSet으로 받습니다.',
    code: 'rs = pstmt.executeQuery()',
    highlight: 'rs = pstmt.executeQuery()',
    sql: 'ResultSet rows with total',
    active: 'rs',
  },
  {
    key: 'dto',
    title: '3. TotalDTO 매핑',
    summary: 'custno, custname, grade, total 값을 TotalDTO에 담습니다.',
    code: 'dto.setTotal(rs.getInt("total"))',
    highlight: 'dto.setTotal   (rs.getInt("total"))',
    sql: 'ResultSet row -> TotalDTO',
    active: 'dto',
  },
  {
    key: 'list',
    title: '4. 결과 누적',
    summary: '각 회원의 집계 결과를 List<TotalDTO>에 넣습니다.',
    code: 'list.add(dto)',
    highlight: 'list.add(dto)',
    sql: 'List<TotalDTO>',
    active: 'list',
  },
]

const DTO_MEMBER_PARTS = [
  {
    key: 'field-custno',
    group: 'field',
    label: 'custno',
    typeLabel: 'int',
    summary: '회원번호를 담는 기본 키 필드입니다.',
    code: 'private int custno;',
    highlight: 'private int custno;',
  },
  {
    key: 'field-custname',
    group: 'field',
    label: 'custname',
    typeLabel: 'String',
    summary: '회원 이름 문자열을 보관합니다.',
    code: 'private String custname;',
    highlight: 'private String custname;',
  },
  {
    key: 'field-phone',
    group: 'field',
    label: 'phone',
    typeLabel: 'String',
    summary: '연락처를 전달하는 필드입니다.',
    code: 'private String phone;',
    highlight: 'private String phone;',
  },
  {
    key: 'field-address',
    group: 'field',
    label: 'address',
    typeLabel: 'String',
    summary: '주소 문자열을 보관합니다.',
    code: 'private String address;',
    highlight: 'private String address;',
  },
  {
    key: 'field-joindate',
    group: 'field',
    label: 'joindate',
    typeLabel: 'String',
    summary: '가입일 데이터를 저장합니다.',
    code: 'private String joindate;',
    highlight: 'private String joindate;',
  },
  {
    key: 'field-grade',
    group: 'field',
    label: 'grade',
    typeLabel: 'String',
    summary: '고객 등급을 담습니다.',
    code: 'private String grade;',
    highlight: 'private String grade;',
  },
  {
    key: 'field-city',
    group: 'field',
    label: 'city',
    typeLabel: 'String',
    summary: '거주 지역 코드를 전달합니다.',
    code: 'private String city;',
    highlight: 'private String city;',
  },
  {
    key: 'setter',
    group: 'method',
    label: 'setter',
    typeLabel: '값 저장',
    summary: '외부에서 전달된 값을 DTO 내부 필드에 채워 넣습니다.',
    code: 'public void setCustname(String custname) { this.custname = custname; }',
    highlight: 'public void setCustname(String custname) { this.custname = custname; }',
  },
  {
    key: 'getter',
    group: 'method',
    label: 'getter',
    typeLabel: '값 읽기',
    summary: '저장된 값을 JSP나 DAO가 다시 읽어갈 때 사용합니다.',
    code: 'public String getCustname() { return custname; }',
    highlight: 'public String getCustname() { return custname; }',
  },
]

const DTO_STUDENT_PARTS = [
  {
    key: 'jumin',
    group: 'field',
    label: 'jumin',
    typeLabel: 'String',
    summary: '주민번호 원본 문자열을 먼저 DTO에 보관합니다.',
    code: 'dto.setJumin(jumin);',
    highlight: 'dto.setJumin(jumin);',
  },
  {
    key: 'substring',
    group: 'method',
    label: 'substring',
    typeLabel: '7번째 자리 추출',
    summary: '7번째 문자를 꺼내 성별 코드로 사용합니다.',
    code: 'String genderCode = jumin.substring(6, 7);',
    highlight: 'String genderCode = jumin.substring(6, 7);',
  },
  {
    key: 'male',
    group: 'method',
    label: '남자 분기',
    typeLabel: '1, 3',
    summary: '성별 코드가 1 또는 3이면 남자로 처리합니다.',
    code: 'if(genderCode.equals("1") || genderCode.equals("3")) {',
    highlight: 'if(genderCode.equals("1") || genderCode.equals("3")) {',
  },
  {
    key: 'female',
    group: 'method',
    label: '여자 분기',
    typeLabel: '2, 4',
    summary: '성별 코드가 2 또는 4이면 여자로 처리합니다.',
    code: 'else if(genderCode.equals("2") || genderCode.equals("4")) {',
    highlight: 'else if(genderCode.equals("2") || genderCode.equals("4")) {',
  },
  {
    key: 'gender',
    group: 'field',
    label: 'gender',
    typeLabel: 'String',
    summary: '판별한 성별 문자열을 DTO 필드에 저장합니다.',
    code: 'dto.setGender(gender);',
    highlight: 'dto.setGender(gender);',
  },
]

const DTO_SCORE_PARTS = [
  {
    key: 'avg',
    group: 'method',
    label: 'avg',
    typeLabel: '단순 평균',
    summary: '5개 점수의 평균을 계산해 avg 필드에 넣습니다.',
    code: 'int avg = (mid + fin + att + rep + etc) / 5;',
    highlight: 'int avg = (mid + fin + att + rep + etc) / 5;',
  },
  {
    key: 'total',
    group: 'method',
    label: 'total',
    typeLabel: '가중치 총점',
    summary: '중간·기말·출결·레포트·기타 점수에 가중치를 적용합니다.',
    code: 'double total = mid * 0.3 + fin * 0.3',
    highlight: 'double total = mid * 0.3 + fin * 0.3',
  },
  {
    key: 'grade-a',
    group: 'method',
    label: 'A 구간',
    typeLabel: '95 / 90',
    summary: '총점이 높으면 A+ 또는 A로 분기됩니다.',
    code: 'if     (total >= 95) grade = "A+";',
    highlight: 'if     (total >= 95) grade = "A+";',
  },
  {
    key: 'grade-c',
    group: 'method',
    label: 'C 구간',
    typeLabel: '75 / 70',
    summary: '70점대 구간은 C+ 또는 C로 분기됩니다.',
    code: 'else if(total >= 75) grade = "C+";',
    highlight: 'else if(total >= 75) grade = "C+";',
  },
  {
    key: 'grade-f',
    group: 'method',
    label: 'F 구간',
    typeLabel: '60 미만',
    summary: '어느 기준에도 못 미치면 F가 됩니다.',
    code: 'else                 grade = "F";',
    highlight: 'else                 grade = "F";',
  },
  {
    key: 'setters',
    group: 'field',
    label: 'DTO 저장',
    typeLabel: 'avg / total / grade',
    summary: '계산된 값을 DTO 필드로 옮겨 화면이나 DAO가 다시 사용합니다.',
    code: 'dto.setAvg(avg);',
    highlight: 'dto.setAvg(avg);',
  },
]

const DTO_VISUALS = {
  dto_01: {
    title: 'DTO 구조와 역할',
    intro: '필드나 getter/setter를 선택하면 왼쪽 코드도 같은 부분을 함께 봅니다.',
    fieldsTitle: '필드와 타입',
    methodsTitle: 'getter / setter 의미',
    selectedTitle: '선택한 코드 조각',
    parts: DTO_MEMBER_PARTS,
  },
  dto_02: {
    title: '성별 판별 흐름',
    intro: '주민번호에서 7번째 자리를 꺼내 gender 필드에 넣는 과정을 코드와 함께 봅니다.',
    fieldsTitle: 'DTO에 저장되는 값',
    methodsTitle: '가공 로직',
    selectedTitle: '선택한 처리 코드',
    parts: DTO_STUDENT_PARTS,
  },
  dto_03: {
    title: '점수 계산 구조',
    intro: 'avg, total, grade가 어떤 수식과 조건으로 계산되는지 코드와 함께 봅니다.',
    fieldsTitle: '최종 저장 값',
    methodsTitle: '계산 / 분기 로직',
    selectedTitle: '선택한 계산 코드',
    parts: DTO_SCORE_PARTS,
  },
}

const SQL_VISUALS = {
  sql_01: {
    title: 'WHERE 필터링 결과',
    steps: [
      {
        key: 'from',
        title: '1. FROM TBL_STUDENT',
        summary: '먼저 학생 테이블 전체 행을 읽습니다.',
        highlight: 'FROM TBL_STUDENT',
        tone: 'slate',
        concepts: ['FROM', '원본 테이블', '전체 행 스캔'],
        insight: '아직 조건을 적용하지 않았기 때문에 모든 학생 행이 그대로 보입니다.',
        sources: [
          {
            label: '원본 학생 테이블',
            columns: ['student_id', 'name', 'grade', 'dept'],
            highlightColumns: ['dept'],
            rows: [
              ['2024001', '김민수', '1', 'CS'],
              ['2024002', '박서연', '2', 'EE'],
              ['2024003', '이도윤', '1', 'CS'],
              ['2024004', '최하은', '3', 'ME'],
            ],
          },
        ],
      },
      {
        key: 'where',
        title: '2. WHERE dept = \'CS\'',
        summary: 'CS 학과인 행만 남깁니다.',
        highlight: 'WHERE dept = \'CS\';',
        tone: 'blue',
        concepts: ['WHERE', '필터링', '조건 일치'],
        insight: '`dept` 값이 `CS`인 행만 통과하고, 나머지 행은 결과에서 제거됩니다.',
        result: {
          label: '필터 후 행',
          columns: ['student_id', 'name', 'grade', 'dept'],
          highlightColumns: ['dept'],
          highlightRows: [0, 1],
          rows: [
            ['2024001', '김민수', '1', 'CS'],
            ['2024003', '이도윤', '1', 'CS'],
          ],
        },
      },
      {
        key: 'select',
        title: '3. SELECT student_id, name',
        summary: '필요한 컬럼만 남겨 최종 결과를 만듭니다.',
        highlight: 'SELECT student_id, name',
        tone: 'emerald',
        concepts: ['SELECT', '컬럼 선택', '최종 결과'],
        insight: '행 수는 그대로 두고, 보여줄 컬럼만 `student_id`, `name`으로 줄입니다.',
        result: {
          label: '최종 결과',
          columns: ['student_id', 'name'],
          highlightColumns: ['student_id', 'name'],
          rows: [
            ['2024001', '김민수'],
            ['2024003', '이도윤'],
          ],
        },
      },
    ],
  },
  sql_02: {
    title: '정렬 후 상위 3개 추출',
    steps: [
      {
        key: 'from',
        title: '1. FROM TBL_SCORE',
        summary: '점수 테이블 전체를 읽습니다.',
        highlight: 'FROM TBL_SCORE',
        tone: 'slate',
        concepts: ['FROM', '원본 데이터', '정렬 전'],
        insight: '이 단계에서는 아직 순서가 원본 입력 순서 그대로입니다.',
        sources: [
          {
            label: '원본 점수 테이블',
            columns: ['student_id', 'name', 'score'],
            highlightColumns: ['score'],
            rows: [
              ['2024001', '김민수', '88'],
              ['2024002', '박서연', '97'],
              ['2024003', '이도윤', '91'],
              ['2024004', '최하은', '85'],
              ['2024005', '정예린', '93'],
            ],
          },
        ],
      },
      {
        key: 'order',
        title: '2. ORDER BY score DESC',
        summary: 'score 기준 내림차순으로 다시 정렬합니다.',
        highlight: 'ORDER BY score DESC',
        tone: 'amber',
        concepts: ['ORDER BY', 'DESC', '정렬'],
        insight: '큰 점수가 위로 올라오도록 행 순서만 재배치합니다. 값 자체는 바뀌지 않습니다.',
        result: {
          label: '정렬 후 결과',
          columns: ['student_id', 'name', 'score'],
          highlightColumns: ['score'],
          highlightRows: [0, 1, 2],
          rows: [
            ['2024002', '박서연', '97'],
            ['2024005', '정예린', '93'],
            ['2024003', '이도윤', '91'],
            ['2024001', '김민수', '88'],
            ['2024004', '최하은', '85'],
          ],
        },
      },
      {
        key: 'limit',
        title: '3. LIMIT 3',
        summary: '정렬된 결과에서 상위 3행만 남깁니다.',
        highlight: 'LIMIT 3;',
        tone: 'emerald',
        concepts: ['LIMIT', '상위 N개', '절단'],
        insight: '정렬이 끝난 뒤 앞에서 3행만 잘라내므로, 정렬 없이 LIMIT만 쓰면 의미가 달라집니다.',
        result: {
          label: '최종 결과',
          columns: ['name', 'score'],
          highlightColumns: ['score'],
          highlightRows: [0, 1, 2],
          rows: [
            ['박서연', '97'],
            ['정예린', '93'],
            ['이도윤', '91'],
          ],
        },
      },
    ],
  },
  sql_03: {
    title: 'INNER JOIN 매칭 결과',
    steps: [
      {
        key: 'tables',
        title: '1. 조인 대상 테이블 확인',
        summary: '회원 테이블과 주문 테이블을 각각 준비합니다.',
        highlight: 'FROM TBL_MEMBER m',
        tone: 'slate',
        concepts: ['JOIN 준비', '기준 키', 'custno'],
        insight: '두 테이블 모두 `custno`를 갖고 있으므로 이 컬럼을 기준으로 행을 연결할 수 있습니다.',
        sources: [
          {
            label: 'TBL_MEMBER',
            columns: ['custno', 'custname', 'grade'],
            highlightColumns: ['custno'],
            rows: [
              ['1001', '김철수', 'VIP'],
              ['1002', '이영희', 'GOLD'],
              ['1003', '박민호', 'SILVER'],
            ],
          },
          {
            label: 'TBL_ORDER',
            columns: ['ordno', 'custno', 'prodname', 'amount'],
            highlightColumns: ['custno'],
            rows: [
              ['1', '1001', '키보드', '2'],
              ['2', '1002', '마우스', '1'],
              ['3', '1001', '모니터', '1'],
            ],
          },
        ],
      },
      {
        key: 'join',
        title: '2. INNER JOIN ... ON m.custno = o.custno',
        summary: 'custno가 같은 행끼리만 연결합니다.',
        highlight: 'INNER JOIN TBL_ORDER o ON m.custno = o.custno;',
        tone: 'violet',
        concepts: ['INNER JOIN', 'ON', '매칭된 행만'],
        insight: '회원 1001은 주문이 2건이라 조인 결과에서도 2행으로 늘어납니다.',
        result: {
          label: '조인 후 결과',
          columns: ['m.custno', 'custname', 'prodname', 'amount'],
          highlightColumns: ['m.custno', 'custname', 'prodname'],
          highlightRows: [0, 1, 2],
          rows: [
            ['1001', '김철수', '키보드', '2'],
            ['1002', '이영희', '마우스', '1'],
            ['1001', '김철수', '모니터', '1'],
          ],
        },
      },
      {
        key: 'select',
        title: '3. 필요한 컬럼만 SELECT',
        summary: '회원 이름, 주문 상품명, 수량만 최종 결과로 남깁니다.',
        highlight: 'SELECT m.custname, o.prodname, o.amount',
        tone: 'emerald',
        concepts: ['SELECT', '별칭', '출력 컬럼 정리'],
        insight: 'JOIN은 컬럼을 합쳐주고, 최종 SELECT는 그중 실제로 보여줄 컬럼만 정리합니다.',
        result: {
          label: '최종 결과',
          columns: ['custname', 'prodname', 'amount'],
          highlightColumns: ['custname', 'prodname', 'amount'],
          rows: [
            ['김철수', '키보드', '2'],
            ['이영희', '마우스', '1'],
            ['김철수', '모니터', '1'],
          ],
        },
      },
    ],
  },
  sql_04: {
    title: 'GROUP BY와 HAVING 집계',
    steps: [
      {
        key: 'from',
        title: '1. 원본 주문 테이블',
        summary: '주문 행을 custno별로 묶기 전 전체 상태입니다.',
        highlight: 'FROM TBL_ORDER',
        tone: 'slate',
        concepts: ['원본 행', 'GROUP BY 전', '중복 custno'],
        insight: '같은 custno가 여러 번 등장하기 때문에 아직은 고객별 합계를 바로 알 수 없습니다.',
        sources: [
          {
            label: 'TBL_ORDER',
            columns: ['ordno', 'custno', 'amount'],
            highlightColumns: ['custno', 'amount'],
            rows: [
              ['1', '1001', '5000'],
              ['2', '1002', '3000'],
              ['3', '1001', '7000'],
              ['4', '1003', '2000'],
              ['5', '1002', '9000'],
            ],
          },
        ],
      },
      {
        key: 'group',
        title: '2. GROUP BY custno + SUM(amount)',
        summary: 'custno별로 행을 묶고 amount 합계를 계산합니다.',
        highlight: 'GROUP BY custno',
        tone: 'orange',
        concepts: ['GROUP BY', 'SUM', '그룹 집계'],
        insight: '여러 주문 행이 고객별 한 행으로 압축되고, amount는 합계 값으로 바뀝니다.',
        result: {
          label: '집계 결과',
          columns: ['custno', 'SUM(amount)'],
          highlightColumns: ['SUM(amount)'],
          rows: [
            ['1001', '12000'],
            ['1002', '12000'],
            ['1003', '2000'],
          ],
        },
      },
      {
        key: 'having',
        title: '3. HAVING SUM(amount) >= 10000',
        summary: '집계 결과 중 합계가 10000 이상인 그룹만 남깁니다.',
        highlight: 'HAVING SUM(amount) >= 10000;',
        tone: 'rose',
        concepts: ['HAVING', '집계 후 필터', '조건 통과 그룹'],
        insight: 'WHERE는 그룹화 전 행을 거르고, HAVING은 그룹화 후 결과를 거른다는 점이 핵심입니다.',
        result: {
          label: '최종 결과',
          columns: ['custno', 'total_amount'],
          highlightColumns: ['total_amount'],
          highlightRows: [0, 1],
          rows: [
            ['1001', '12000'],
            ['1002', '12000'],
          ],
        },
      },
    ],
  },
  sql_05: {
    title: 'INSERT와 UPDATE 전후 비교',
    steps: [
      {
        key: 'before',
        title: '1. 작업 전 TBL_MEMBER',
        summary: '아직 1001 회원이 없는 초기 상태입니다.',
        highlight: 'INSERT INTO TBL_MEMBER (custno, custname, grade)',
        tone: 'slate',
        concepts: ['DML', '변경 전', '대상 테이블'],
        insight: '이 상태를 기준으로 INSERT가 새 행을 추가하고, 그 다음 UPDATE가 같은 행을 수정합니다.',
        result: {
          label: '작업 전',
          columns: ['custno', 'custname', 'grade'],
          rows: [
            ['1002', '김유진', 'SILVER'],
            ['1003', '박준호', 'VIP'],
          ],
        },
      },
      {
        key: 'insert',
        title: '2. INSERT 실행',
        summary: '새 회원 행이 테이블에 추가됩니다.',
        highlight: 'VALUES (1001, \'이순신\', \'VIP\');',
        tone: 'emerald',
        concepts: ['INSERT', '새 행 추가', 'VALUES'],
        insight: 'INSERT는 기존 행을 건드리지 않고, 새로운 한 행을 테이블 끝에 추가합니다.',
        result: {
          label: 'INSERT 후',
          columns: ['custno', 'custname', 'grade'],
          highlightRows: [0],
          rows: [
            ['1001', '이순신', 'VIP'],
            ['1002', '김유진', 'SILVER'],
            ['1003', '박준호', 'VIP'],
          ],
        },
      },
      {
        key: 'update',
        title: '3. UPDATE 실행',
        summary: '같은 회원의 grade 값만 GOLD로 바뀝니다.',
        highlight: 'SET grade = \'GOLD\'',
        tone: 'blue',
        concepts: ['UPDATE', 'SET', 'WHERE'],
        insight: 'UPDATE는 행을 새로 만들지 않고, WHERE 조건에 맞는 기존 행의 특정 컬럼만 변경합니다.',
        result: {
          label: '최종 결과',
          columns: ['custno', 'custname', 'grade'],
          highlightColumns: ['grade'],
          highlightRows: [0],
          rows: [
            ['1001', '이순신', 'GOLD'],
            ['1002', '김유진', 'SILVER'],
            ['1003', '박준호', 'VIP'],
          ],
        },
      },
    ],
  },
}

function findSnippetRange(text, snippet) {
  if (!text || !snippet) return null
  const from = text.indexOf(snippet)
  if (from === -1) return null
  return { from, to: from + snippet.length }
}

function getAdaptiveEditorMinHeight(code, { compact = false } = {}) {
  const lineCount = Math.max(1, (code ?? '').split('\n').length)
  const lineHeight = 24
  const chromeHeight = 52
  const paddingHeight = compact ? 28 : 44
  const min = compact ? 180 : 240
  const max = compact ? 420 : 560
  const calculated = lineCount * lineHeight + chromeHeight + paddingHeight
  return `${Math.max(min, Math.min(max, calculated))}px`
}

function getCodeHighlightRange(lessonId, code, actionFlowStep, validationCase, dtoHighlightKey) {
  if (!code) return null

  if (lessonId === 'form_02' || lessonId === 'hrd01_02') {
    return findSnippetRange(code, ACTION_FLOW_STEPS[actionFlowStep]?.highlight)
  }

  if (lessonId === 'form_03') {
    const current = VALIDATION_CASES[validationCase]
    if (!current) return null
    if (current.focus) {
      const fieldLabels = {
        custname: 'if(frm.custname.value.trim() === "") {',
        phone: 'if(frm.phone.value.trim() === "") {',
        address: 'if(frm.address.value.trim() === "") {',
        grade: 'if(frm.grade.value.trim() === "") {',
        city: 'if(frm.city.value.trim() === "") {',
      }
      return findSnippetRange(code, fieldLabels[current.focus])
        ?? findSnippetRange(code, `frm.${current.focus}.focus();`)
    }
    return findSnippetRange(code, 'frm.submit();') ?? findSnippetRange(code, current.alert)
  }

  if (lessonId === 'dao_01') {
    return findSnippetRange(code, DAO_CONNECTION_STEPS[actionFlowStep]?.highlight)
  }

  if (lessonId === 'dao_02') {
    return findSnippetRange(code, DAO_INSERT_STEPS[actionFlowStep]?.highlight)
  }

  if (lessonId === 'dao_03') {
    return findSnippetRange(code, DAO_SELECT_STEPS[actionFlowStep]?.highlight)
  }

  if (lessonId === 'dao_04') {
    return findSnippetRange(code, DAO_SUMMARY_STEPS[actionFlowStep]?.highlight)
  }

  if (lessonId.startsWith('sql_')) {
    return findSnippetRange(code, SQL_VISUALS[lessonId]?.steps?.[actionFlowStep]?.highlight)
  }

  if (lessonId === 'dto_01') {
    const currentPart = DTO_MEMBER_PARTS.find((part) => part.key === dtoHighlightKey) ?? DTO_MEMBER_PARTS[0]
    return findSnippetRange(code, currentPart?.highlight)
  }

  if (lessonId === 'dto_02') {
    const currentPart = DTO_STUDENT_PARTS.find((part) => part.key === dtoHighlightKey) ?? DTO_STUDENT_PARTS[0]
    return findSnippetRange(code, currentPart?.highlight)
  }

  if (lessonId === 'dto_03') {
    const currentPart = DTO_SCORE_PARTS.find((part) => part.key === dtoHighlightKey) ?? DTO_SCORE_PARTS[0]
    return findSnippetRange(code, currentPart?.highlight)
  }

  return null
}
function DtoStructurePanel({ visual, selectedKey, onSelect }) {
  const parts = visual?.parts ?? []
  const selectedPart = parts.find((part) => part.key === selectedKey) ?? parts[0]
  const fieldParts = parts.filter((part) => part.group === 'field')
  const methodParts = parts.filter((part) => part.group === 'method')

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{visual.title}</div>
        <div className="text-sm text-gray-500 mt-1">{visual.intro}</div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{visual.fieldsTitle}</div>
            <div className="space-y-2">
              {fieldParts.map((part) => {
                const active = part.key === selectedKey
                return (
                  <button
                    key={part.key}
                    type="button"
                    onClick={() => onSelect(part.key)}
                    className={`w-full text-left rounded border px-3 py-2 transition-colors ${
                      active
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-mono text-gray-900 break-all whitespace-pre-wrap">
                      {part.label}: {part.typeLabel}
                    </div>
                    <div className={`text-xs mt-1 ${active ? 'text-green-700' : 'text-gray-500'}`}>
                      {part.summary}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{visual.methodsTitle}</div>
            <div className="space-y-3">
              {methodParts.map((part) => {
                const active = part.key === selectedKey
                const activeClass = part.key === 'setter'
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-violet-300 bg-violet-50'
                const inactiveClass = 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                const toneClass = part.key === 'setter' ? 'text-blue-800' : 'text-violet-800'

                return (
                  <button
                    key={part.key}
                    type="button"
                    onClick={() => onSelect(part.key)}
                    className={`w-full text-left rounded-lg border px-3 py-3 transition-colors ${active ? activeClass : inactiveClass}`}
                  >
                    <div className={`text-xs mb-1 ${toneClass}`}>{part.label}</div>
                    <div className={`text-sm font-mono break-all whitespace-pre-wrap ${toneClass}`}>{part.code}</div>
                    <div className={`text-sm mt-2 ${active ? toneClass : 'text-gray-600'}`}>{part.summary}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-slate-950 px-4 py-3 mb-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">{visual.selectedTitle}</div>
          <div className="text-sm font-mono text-slate-100 break-all whitespace-pre-wrap">{selectedPart.code}</div>
          <div className="text-xs text-slate-400 mt-2">{selectedPart.summary}</div>
        </div>
        {visual === DTO_VISUALS.dto_01 ? (
          <>
            <div className="rounded-lg border border-dashed border-gray-300 p-4 mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">전달 관계</div>
              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-4 text-center">
                  <div className="text-xs text-blue-700 mb-1">JSP / Form</div>
                  <div className="text-sm font-mono text-blue-900 break-all whitespace-pre-wrap">name="custname"</div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-4 text-center">
                  <div className="text-xs text-green-700 mb-1">MemberDTO</div>
                  <div className="text-sm font-mono text-green-900 break-all whitespace-pre-wrap">custname = "홍길동"</div>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-4 text-center">
                  <div className="text-xs text-amber-700 mb-1">DAO</div>
                  <div className="text-sm font-mono text-amber-900 break-all whitespace-pre-wrap">insertMember(dto)</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-3">
                <span>값 수집</span>
                <span>→</span>
                <span>DTO에 보관</span>
                <span>→</span>
                <span>DAO로 전달</span>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-gray-300 p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">핵심 의미</div>
              <div className="text-sm text-gray-700">
                DTO는 SQL을 실행하거나 화면을 직접 그리지 않습니다. 여러 값을 하나의 객체로 묶어 JSP, Servlet, DAO 사이에서 안전하게 전달하는 전용 데이터 상자입니다.
              </div>
            </div>
          </>
        ) : visual === DTO_VISUALS.dto_02 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">핵심 의미</div>
            <div className="text-sm text-gray-700">
              이 레슨의 핵심은 DTO가 직접 성별을 판단한다기보다, DAO에서 계산한 값을 gender 필드에 담아 화면으로 넘긴다는 점입니다. 즉 DTO는 계산 결과를 보관하는 역할을 맡습니다.
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">핵심 의미</div>
            <div className="text-sm text-gray-700">
              avg, total, grade는 계산 로직에서 만들어지지만, 최종적으로는 DTO 안에 모여 JSP나 다른 계층에서 재사용됩니다. DTO는 계산식을 담는 곳이 아니라 계산된 결과를 구조화해 전달하는 곳입니다.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getSqlToneClasses(tone) {
  const toneMap = {
    slate: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      card: 'border-slate-200 bg-slate-50',
      progress: 'bg-slate-900',
      active: 'border-slate-900 bg-slate-900 text-white',
      soft: 'bg-slate-100 text-slate-600',
      callout: 'border-slate-200 bg-slate-50 text-slate-700',
      header: 'bg-slate-50 text-slate-700',
      column: 'bg-slate-100 text-slate-900',
      row: 'bg-slate-50/80',
    },
    blue: {
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      card: 'border-blue-200 bg-blue-50',
      progress: 'bg-blue-600',
      active: 'border-blue-600 bg-blue-600 text-white',
      soft: 'bg-blue-100 text-blue-700',
      callout: 'border-blue-200 bg-blue-50 text-blue-800',
      header: 'bg-blue-50 text-blue-700',
      column: 'bg-blue-100 text-blue-900',
      row: 'bg-blue-50/80',
    },
    emerald: {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      card: 'border-emerald-200 bg-emerald-50',
      progress: 'bg-emerald-600',
      active: 'border-emerald-600 bg-emerald-600 text-white',
      soft: 'bg-emerald-100 text-emerald-700',
      callout: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      header: 'bg-emerald-50 text-emerald-700',
      column: 'bg-emerald-100 text-emerald-900',
      row: 'bg-emerald-50/80',
    },
    amber: {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      card: 'border-amber-200 bg-amber-50',
      progress: 'bg-amber-500',
      active: 'border-amber-500 bg-amber-500 text-white',
      soft: 'bg-amber-100 text-amber-700',
      callout: 'border-amber-200 bg-amber-50 text-amber-800',
      header: 'bg-amber-50 text-amber-700',
      column: 'bg-amber-100 text-amber-900',
      row: 'bg-amber-50/80',
    },
    violet: {
      badge: 'bg-violet-100 text-violet-700 border-violet-200',
      card: 'border-violet-200 bg-violet-50',
      progress: 'bg-violet-600',
      active: 'border-violet-600 bg-violet-600 text-white',
      soft: 'bg-violet-100 text-violet-700',
      callout: 'border-violet-200 bg-violet-50 text-violet-800',
      header: 'bg-violet-50 text-violet-700',
      column: 'bg-violet-100 text-violet-900',
      row: 'bg-violet-50/80',
    },
    orange: {
      badge: 'bg-orange-100 text-orange-700 border-orange-200',
      card: 'border-orange-200 bg-orange-50',
      progress: 'bg-orange-500',
      active: 'border-orange-500 bg-orange-500 text-white',
      soft: 'bg-orange-100 text-orange-700',
      callout: 'border-orange-200 bg-orange-50 text-orange-800',
      header: 'bg-orange-50 text-orange-700',
      column: 'bg-orange-100 text-orange-900',
      row: 'bg-orange-50/80',
    },
    rose: {
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      card: 'border-rose-200 bg-rose-50',
      progress: 'bg-rose-500',
      active: 'border-rose-500 bg-rose-500 text-white',
      soft: 'bg-rose-100 text-rose-700',
      callout: 'border-rose-200 bg-rose-50 text-rose-800',
      header: 'bg-rose-50 text-rose-700',
      column: 'bg-rose-100 text-rose-900',
      row: 'bg-rose-50/80',
    },
  }
  return toneMap[tone] ?? toneMap.slate
}

function SqlTable({ label, columns, rows, highlightColumns = [], highlightRows = [], tone = 'slate' }) {
  const toneClasses = getSqlToneClasses(tone)
  return (
    <div className={`rounded-lg border overflow-hidden bg-white ${toneClasses.card}`}>
      <div className={`px-3 py-2 border-b text-xs font-semibold uppercase tracking-wide ${toneClasses.header}`}>
        {label}
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={`px-3 py-2 text-left text-xs font-semibold border-b whitespace-nowrap ${
                    highlightColumns.includes(column) ? toneClasses.column : 'text-gray-600 border-gray-200'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`${label}-${rowIndex}`}
                className={`border-b border-gray-100 last:border-b-0 ${
                  highlightRows.includes(rowIndex) ? toneClasses.row : ''
                }`}
              >
                {row.map((cell, cellIndex) => (
                  <td key={`${label}-${rowIndex}-${cellIndex}`} className="px-3 py-2 font-mono text-gray-800 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SqlFlowPanel({ visual, stepIndex, onStepChange }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const steps = visual.steps
  const step = steps[stepIndex]
  const toneClasses = getSqlToneClasses(step.tone)

  useEffect(() => {
    if (!isPlaying) return
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = window.setTimeout(() => {
      onStepChange(stepIndex + 1)
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [isPlaying, stepIndex, steps.length, onStepChange])

  const progress = ((stepIndex + 1) / steps.length) * 100

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{visual.title}</div>
            <div className="text-sm text-gray-500 mt-1">{step.title}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="px-3 py-1.5 rounded bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
            >
              {isPlaying ? '일시정지' : '재생'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false)
                onStepChange(0)
              }}
              className="px-3 py-1.5 rounded border border-gray-300 text-xs text-gray-600 hover:border-gray-400 transition-colors"
            >
              처음부터
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{isPlaying ? '재생 중' : '대기 중'}</span>
          <span>{stepIndex + 1} / {steps.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ${toneClasses.progress}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {steps.map((item, index) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setIsPlaying(false)
                onStepChange(index)
              }}
              className={`text-left rounded-lg border px-3 py-2 transition-colors ${
                index === stepIndex
                  ? toneClasses.active
                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-semibold">{index + 1}단계</div>
              <div className="text-xs mt-1 break-all whitespace-pre-wrap">{item.title}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {step.concepts?.map((concept) => (
            <span key={concept} className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses.badge}`}>
              {concept}
            </span>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-slate-950 px-4 py-3 mb-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">현재 SQL 포인트</div>
          <div className="text-sm font-mono text-slate-100 break-all whitespace-pre-wrap">{step.highlight}</div>
          <div className="text-xs text-slate-400 mt-2">{step.summary}</div>
        </div>
        <div className={`rounded-lg border px-4 py-3 mb-4 ${toneClasses.callout}`}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-1">왜 이렇게 바뀌는가</div>
          <div className="text-sm">{step.insight}</div>
        </div>
        {step.sources?.length > 0 && (
          <div className={`grid gap-3 mb-4 ${step.sources.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {step.sources.map((table) => (
              <SqlTable key={table.label} {...table} tone={step.tone} />
            ))}
          </div>
        )}
        {step.result && (
          <SqlTable {...step.result} tone={step.tone} />
        )}
      </div>
    </div>
  )
}

function DaoFlowPanel({ title, steps, stepIndex, onStepChange }) {
  const step = steps[stepIndex]
  const [isPlaying, setIsPlaying] = useState(false)
  const progress = ((stepIndex + 1) / steps.length) * 100

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setTimeout(() => {
      if (stepIndex >= steps.length - 1) {
        setIsPlaying(false)
        return
      }
      onStepChange(stepIndex + 1)
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [isPlaying, onStepChange, stepIndex, steps.length])

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</div>
        <div className="text-sm text-gray-500 mt-1">DB 연결, SQL 준비, 실행, 결과 반환 흐름을 단계별로 봅니다.</div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">{isPlaying ? '재생 중' : '대기 중'} · {stepIndex + 1}/{steps.length}</span>
            <span className="text-xs font-mono text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-900 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              if (stepIndex >= steps.length - 1) onStepChange(0)
              setIsPlaying(prev => !prev)
            }}
            className="px-3 py-1.5 rounded text-xs font-semibold border border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false)
              onStepChange(0)
            }}
            className="px-3 py-1.5 rounded text-xs border border-gray-300 bg-white hover:border-gray-900 transition-colors"
          >
            처음부터
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {steps.map((item, index) => {
            const active = index === stepIndex
            return (
              <button
                key={item.key}
                onClick={() => {
                  setIsPlaying(false)
                  onStepChange(index)
                }}
                className="px-3 py-1.5 rounded-full text-xs border transition-colors"
                style={{
                  borderColor: active ? '#111827' : '#d1d5db',
                  background: active ? '#111827' : '#fff',
                  color: active ? '#fff' : '#4b5563',
                }}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
        <div className="rounded-lg border border-gray-200 p-4 mb-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">{step.title}</div>
          <div className="text-sm text-gray-600 mb-3">{step.summary}</div>
          <CodeEditor
            value={step.code}
            language="java"
            readOnly={true}
            showToolbar={false}
            minHeight="28px"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border p-3 transition-all" style={{ borderColor: step.active === 'driver' ? '#2563eb' : '#e5e7eb', background: step.active === 'driver' ? '#eff6ff' : '#f3f4f6', opacity: step.active === 'driver' ? 1 : 0.55 }}>
            <div className="text-xs text-gray-500 mb-2">Driver</div>
            <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">OracleDriver</div>
          </div>
          <div className="rounded-lg border p-3 transition-all" style={{ borderColor: step.active === 'conn' ? '#16a34a' : '#e5e7eb', background: step.active === 'conn' ? '#f0fdf4' : '#f3f4f6', opacity: step.active === 'conn' ? 1 : 0.55 }}>
            <div className="text-xs text-gray-500 mb-2">Connection</div>
            <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">jdbc:oracle:thin:@127.0.0.1:1521:xe</div>
          </div>
          <div className="rounded-lg border p-3 transition-all" style={{ borderColor: step.active === 'pstmt' ? '#d97706' : '#e5e7eb', background: step.active === 'pstmt' ? '#fff7ed' : '#f3f4f6', opacity: step.active === 'pstmt' ? 1 : 0.55 }}>
            <div className="text-xs text-gray-500 mb-2">PreparedStatement</div>
            <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">{step.sql ?? 'SQL 준비 전'}</div>
          </div>
          <div className="rounded-lg border p-3 transition-all" style={{ borderColor: step.active === 'rs' || step.active === 'result' || step.active === 'execute' || step.active === 'return' ? '#7c3aed' : '#e5e7eb', background: step.active === 'rs' || step.active === 'result' || step.active === 'execute' || step.active === 'return' ? '#f5f3ff' : '#f3f4f6', opacity: step.active === 'rs' || step.active === 'result' || step.active === 'execute' || step.active === 'return' ? 1 : 0.55 }}>
            <div className="text-xs text-gray-500 mb-2">
              {steps === DAO_CONNECTION_STEPS ? 'ResultSet / return' : steps === DAO_INSERT_STEPS ? 'executeUpdate / return' : 'ResultSet / List'}
            </div>
            <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">
              {step.active === 'result' ? 'no = rs.getInt(1)'
                : step.active === 'execute' ? 'result = 1'
                : step.active === 'return' ? 'return result'
                : step.active === 'list' ? 'list.add(dto)'
                : '실행 대기'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionFlowPanel({ stepIndex, onStepChange }) {
  const step = ACTION_FLOW_STEPS[stepIndex]
  const [isPlaying, setIsPlaying] = useState(false)
  const progress = ((stepIndex + 1) / ACTION_FLOW_STEPS.length) * 100
  const activeStage = step.key

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setTimeout(() => {
      if (stepIndex >= ACTION_FLOW_STEPS.length - 1) {
        setIsPlaying(false)
        return
      }
      onStepChange(stepIndex + 1)
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [isPlaying, onStepChange, stepIndex])

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">처리 흐름 시각화</div>
        <div className="text-sm text-gray-500 mt-1">폼 데이터가 서버에서 어떤 순서로 처리되는지 단계별로 봅니다.</div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">
              {isPlaying ? '재생 중' : '대기 중'} · {stepIndex + 1}/{ACTION_FLOW_STEPS.length}
            </span>
            <span className="text-xs font-mono text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              if (stepIndex >= ACTION_FLOW_STEPS.length - 1) onStepChange(0)
              setIsPlaying(prev => !prev)
            }}
            className="px-3 py-1.5 rounded text-xs font-semibold border border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false)
              onStepChange(0)
            }}
            className="px-3 py-1.5 rounded text-xs border border-gray-300 bg-white hover:border-gray-900 transition-colors"
          >
            처음부터
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {ACTION_FLOW_STEPS.map((item, index) => {
            const active = index === stepIndex
            return (
              <button
                key={item.key}
                onClick={() => {
                  setIsPlaying(false)
                  onStepChange(index)
                }}
                className="px-3 py-1.5 rounded-full text-xs border transition-colors"
                style={{
                  borderColor: active ? '#111827' : '#d1d5db',
                  background: active ? '#111827' : '#fff',
                  color: active ? '#fff' : '#4b5563',
                }}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
        <div className="rounded-lg border border-gray-200 p-4 mb-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">{step.title}</div>
          <div className="text-sm text-gray-600 mb-3">{step.summary}</div>
          <CodeEditor
            value={step.code}
            language="java"
            readOnly={true}
            showToolbar={false}
            minHeight="28px"
          />
        </div>
        <div className="rounded-lg border border-dashed border-gray-300 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">실행 요소 동기화</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg border p-3 transition-all" style={{ borderColor: activeStage === 'encoding' || activeStage === 'params' ? '#2563eb' : '#e5e7eb', background: activeStage === 'encoding' || activeStage === 'params' ? '#eff6ff' : '#f3f4f6', opacity: activeStage === 'encoding' || activeStage === 'params' ? 1 : 0.55 }}>
              <div className="text-xs text-gray-500 mb-2">request</div>
              <div className="space-y-1">
                <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">custno=1001</div>
                <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">custname=홍길동</div>
                <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">grade=A</div>
              </div>
            </div>
            <div className="rounded-lg border p-3 transition-all" style={{ borderColor: activeStage === 'dto' ? '#16a34a' : '#e5e7eb', background: activeStage === 'dto' ? '#f0fdf4' : '#f3f4f6', opacity: activeStage === 'dto' ? 1 : 0.55 }}>
              <div className="text-xs text-gray-500 mb-2">MemberDTO</div>
              <div className="space-y-1">
                <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">dto.custno = 1001</div>
                <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">dto.custname = 홍길동</div>
                <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">dto.city = 01</div>
              </div>
            </div>
            <div className="rounded-lg border p-3 transition-all" style={{ borderColor: activeStage === 'dao' ? '#d97706' : '#e5e7eb', background: activeStage === 'dao' ? '#fff7ed' : '#f3f4f6', opacity: activeStage === 'dao' ? 1 : 0.55 }}>
              <div className="text-xs text-gray-500 mb-2">DAO</div>
              <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">insertMember(dto)</div>
              <div className="text-xs text-gray-500 mt-2">DB INSERT 실행</div>
            </div>
            <div className="rounded-lg border p-3 transition-all" style={{ borderColor: activeStage === 'redirect' ? '#7c3aed' : '#e5e7eb', background: activeStage === 'redirect' ? '#f5f3ff' : '#f3f4f6', opacity: activeStage === 'redirect' ? 1 : 0.55 }}>
              <div className="text-xs text-gray-500 mb-2">response</div>
              <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">302 Redirect</div>
              <div className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">/sub1.jsp</div>
            </div>
          </div>
          <div className="space-y-2">
            {step.state.map((line) => (
              <div key={line} className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 font-mono">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ValidationFlowPanel({ caseIndex, onCaseChange }) {
  const current = VALIDATION_CASES[caseIndex]
  const [isPlaying, setIsPlaying] = useState(false)
  const progress = ((caseIndex + 1) / VALIDATION_CASES.length) * 100
  const orderedFields = [
    ['custname', '이름'],
    ['phone', '연락처'],
    ['address', '주소'],
    ['grade', '등급'],
    ['city', '지역'],
  ]
  const firstInvalid = orderedFields.find(([key]) => current.values[key].trim() === '')?.[0] ?? null
  const reachesSubmit = firstInvalid === null

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setTimeout(() => {
      if (caseIndex >= VALIDATION_CASES.length - 1) {
        setIsPlaying(false)
        return
      }
      onCaseChange(caseIndex + 1)
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [caseIndex, isPlaying, onCaseChange])

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">검사 순서 시뮬레이터</div>
        <div className="text-sm text-gray-500 mt-1">입력값에 따라 어느 조건문에서 멈추는지 눈으로 확인합니다.</div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">
              {isPlaying ? '재생 중' : '대기 중'} · {caseIndex + 1}/{VALIDATION_CASES.length}
            </span>
            <span className="text-xs font-mono text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              if (caseIndex >= VALIDATION_CASES.length - 1) onCaseChange(0)
              setIsPlaying(prev => !prev)
            }}
            className="px-3 py-1.5 rounded text-xs font-semibold border border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false)
              onCaseChange(0)
            }}
            className="px-3 py-1.5 rounded text-xs border border-gray-300 bg-white hover:border-gray-900 transition-colors"
          >
            처음부터
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {VALIDATION_CASES.map((item, index) => {
            const active = index === caseIndex
            return (
              <button
                key={item.key}
                onClick={() => {
                  setIsPlaying(false)
                  onCaseChange(index)
                }}
                className="px-3 py-1.5 rounded-full text-xs border transition-colors"
                style={{
                  borderColor: active ? '#111827' : '#d1d5db',
                  background: active ? '#111827' : '#fff',
                  color: active ? '#fff' : '#4b5563',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="rounded-lg border border-gray-200 p-4 mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">실제 폼 요소 동기화</div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-3">회원 등록</div>
            <div className="space-y-2">
              {orderedFields.map(([key, label]) => {
                const active = firstInvalid === key
                return (
                  <div key={key} className="grid grid-cols-[80px_1fr] gap-3 items-center">
                    <label className="text-xs text-gray-600">{label}</label>
                    <input
                      readOnly
                      value={current.values[key]}
                      placeholder={label}
                      className="w-full border rounded px-3 py-2 text-sm bg-white outline-none transition-all"
                      style={{
                        borderColor: active ? '#ef4444' : '#d1d5db',
                        boxShadow: active ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
                        background: active ? '#fef2f2' : '#f3f4f6',
                        opacity: active || reachesSubmit ? 1 : 0.58,
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded border"
                style={{
                  borderColor: reachesSubmit ? '#111827' : '#d1d5db',
                  background: reachesSubmit ? '#111827' : '#fff',
                  color: reachesSubmit ? '#fff' : '#9ca3af',
                  boxShadow: reachesSubmit ? '0 0 0 3px rgba(17,24,39,0.08)' : 'none',
                  opacity: reachesSubmit ? 1 : 0.6,
                }}
              >
                등록
              </button>
              <button type="button" className="px-4 py-2 text-sm rounded border border-gray-300 bg-gray-100 text-gray-400 opacity-60">
                조회
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">조건문 결과</div>
            <div className="text-sm text-gray-700">
              {firstInvalid
                ? `${orderedFields.find(([key]) => key === firstInvalid)?.[1]} 검사에서 중단되고 focus()가 이동합니다.`
                : '모든 검사 통과 후 submit()까지 진행됩니다.'}
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-gray-300 p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">사용자에게 보이는 반응</div>
            <CodeEditor
              value={`alert("${current.alert}")`}
              language="html"
              readOnly={true}
              showToolbar={false}
              minHeight="28px"
            />
            <div className="text-sm text-gray-600">
              <div className="mt-2">
                <CodeEditor
                  value={reachesSubmit ? 'frm.submit()' : `frm.${current.focus}.focus()`}
                  language="html"
                  readOnly={true}
                  showToolbar={false}
                  minHeight="28px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// CodeMirror 에디터에서 태그명 호버 시 툴팁 표시
function makeTagHoverTooltip(annotations) {
  const map = {}
  annotations.forEach(a => { map[a.tag] = a })

  return hoverTooltip((view, pos) => {
    const node = syntaxTree(view.state).resolveInner(pos, -1)
    if (node.name !== 'TagName') return null

    const tagName = view.state.sliceDoc(node.from, node.to)
    const ann = map[tagName] ?? map[tagName.toLowerCase()]
    if (!ann) return null

    return {
      pos: node.from,
      end: node.to,
      above: true,
      create() {
        const dom = document.createElement('div')
        dom.style.cssText = [
          'padding:6px 12px',
          'background:#1a1d23',
          'border-radius:6px',
          `border-left:3px solid ${ann.color}`,
          'white-space:nowrap',
          'box-shadow:0 4px 16px rgba(0,0,0,0.5)',
          'font-size:12px',
          'line-height:1.5',
          'pointer-events:none',
        ].join(';')
        dom.innerHTML =
          `<code style="color:${ann.color};font-weight:bold;font-family:monospace;">&lt;${ann.label}&gt;</code>` +
          `<span style="color:#9ca3af;font-family:sans-serif;margin-left:8px;">${ann.description}</span>`
        return { dom }
      },
    }
  })
}

// 커서 위치가 JSP 블록 또는 빈칸 패턴 안에 있으면 그 범위 반환
function findJspRegion(text, pos) {
  // JSP 블록: <%--...--%> 또는 <%...%>
  const jspRe = /<%--[\s\S]*?--%>|<%[\s\S]*?%>/g
  let m
  while ((m = jspRe.exec(text)) !== null) {
    if (m.index > pos) break
    if (pos < m.index + m[0].length) return { from: m.index, to: m.index + m[0].length }
  }
  // 빈칸 패턴: ( A ) 또는 ___
  const blankRe = /\(\s*[A-Z]\s*\)|___/g
  while ((m = blankRe.exec(text)) !== null) {
    if (m.index > pos) break
    if (pos < m.index + m[0].length) return { from: m.index, to: m.index + m[0].length }
  }
  return null
}

// 에디터 태그/JSP 호버 → 미리보기 iframe 해당 요소 강조
// (hoverTooltip 대신 mousemove 사용 — 지연 없이 즉각 반응)
function makeEditorToPreviewSync(onHover, onLeave, onJspHover, onJspLeave) {
  let lastTag = null
  let lastIndex = -1
  let lastJspFrom = -1

  return EditorView.domEventHandlers({
    mousemove(e, view) {
      const pos = view.posAtCoords({ x: e.clientX, y: e.clientY })
      if (pos === null) {
        if (lastTag !== null)    { onLeave();     lastTag = null; lastIndex = -1 }
        if (lastJspFrom !== -1)  { onJspLeave?.(); lastJspFrom = -1 }
        return false
      }

      const text = view.state.doc.toString()

      // JSP 블록 / 빈칸 패턴 우선 감지
      const jspRegion = onJspHover ? findJspRegion(text, pos) : null
      if (jspRegion) {
        if (lastTag !== null) { onLeave(); lastTag = null; lastIndex = -1 }
        if (jspRegion.from !== lastJspFrom) {
          onJspHover(jspRegion.from, jspRegion.to)
          lastJspFrom = jspRegion.from
        }
        return false
      }
      if (lastJspFrom !== -1) { onJspLeave?.(); lastJspFrom = -1 }

      // HTML 태그명 감지
      const node = syntaxTree(view.state).resolveInner(pos, -1)
      if (node.name !== 'TagName') {
        if (lastTag !== null) { onLeave(); lastTag = null; lastIndex = -1 }
        return false
      }

      const tagName = view.state.sliceDoc(node.from, node.to).toLowerCase()
      const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const isClose = node.parent?.name === 'CloseTag'

      let index = 0
      if (!isClose) {
        const re = new RegExp(`<${escaped}(?=[\\s>/])`, 'gi')
        let m
        while ((m = re.exec(text)) !== null) {
          if (m.index + 1 >= node.from) break
          index++
        }
      } else {
        const re = new RegExp(`<\\/${escaped}(?=[\\s>])`, 'gi')
        let m
        while ((m = re.exec(text)) !== null) {
          if (m.index + 2 >= node.from) break
          index++
        }
      }

      if (tagName !== lastTag || index !== lastIndex) {
        onHover(tagName, index)
        lastTag = tagName
        lastIndex = index
      }
      return false
    },
    mouseleave() {
      if (lastTag !== null)    { onLeave();     lastTag = null; lastIndex = -1 }
      if (lastJspFrom !== -1)  { onJspLeave?.(); lastJspFrom = -1 }
      return false
    },
  })
}

// iframe에 주입할 HTML — 호버 시에만 아웃라인 + 하단 정보 바 표시
function buildAnnotatedHtml(code, annotations = []) {
  const annJson = JSON.stringify(annotations)

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; }
body {
  font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  padding: 16px;
  padding-bottom: 52px;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
  overscroll-behavior: contain;
}
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.35); }
#__info {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  padding: 7px 14px;
  background: #111827;
  color: #f9fafb;
  font-size: 12px;
  font-family: monospace;
  display: none;
  border-top: 3px solid #374151;
  z-index: 9999;
  transition: opacity 0.1s;
}
</style>
</head>
<body>
${code}
<div id="__info"></div>
<script>
(function(){
  var anns = ${annJson};
  var map = {};
  anns.forEach(function(a){ map[a.tag.toUpperCase()] = a; });
  var bar = document.getElementById('__info');
  var cur = null;

  function canScrollPage() {
    var root = document.scrollingElement || document.documentElement;
    return !!root && (root.scrollHeight > root.clientHeight + 1 || root.scrollWidth > root.clientWidth + 1);
  }

  function scrollIfScrollable(el) {
    if (!el || !canScrollPage()) return;
    var root = document.scrollingElement || document.documentElement;
    var rect = el.getBoundingClientRect();
    var rootRect = root.getBoundingClientRect();
    var next = {};
    if (root.scrollHeight > root.clientHeight + 1) {
      next.top = Math.max(0, root.scrollTop + (rect.top - rootRect.top) - (root.clientHeight / 2) + (rect.height / 2));
    }
    if (root.scrollWidth > root.clientWidth + 1) {
      next.left = Math.max(0, root.scrollLeft + (rect.left - rootRect.left) - (root.clientWidth / 2) + (rect.width / 2));
    }
    root.scrollTo(Object.assign({}, next, { behavior: 'smooth' }));
  }

  function clearCur() {
    if (cur) {
      cur.style.outline = '';
      cur.style.outlineOffset = '';
      cur = null;
      bar.style.display = 'none';
      window.parent.postMessage({ type: 'previewLeave' }, '*');
    }
  }

  document.addEventListener('mouseover', function(e) {
    var el = e.target;
    while (el && el.tagName && el.tagName !== 'BODY') {
      if (el.id === '__info') { clearCur(); return; }
      var a = map[el.tagName];
      if (a) {
        if (cur && cur !== el) {
          cur.style.outline = '';
          cur.style.outlineOffset = '';
        }
        cur = el;
        el.style.outline = '2px solid ' + a.color;
        el.style.outlineOffset = '2px';
        bar.style.display = 'block';
        bar.style.borderTopColor = a.color;
        bar.innerHTML =
          '<span style="color:' + a.color + ';font-weight:bold;">&lt;' + a.label + '&gt;</span>' +
          '&ensp;<span style="color:#d1d5db;">' + a.description + '</span>';
        var siblings = document.querySelectorAll(el.tagName.toLowerCase());
        var idx = Array.prototype.indexOf.call(siblings, el);
        var classes = Array.prototype.slice.call(el.classList);
        window.parent.postMessage({ type: 'previewHover', tag: a.tag, index: idx, classes: classes }, '*');
        return;
      }
      el = el.parentElement;
    }
    clearCur();
  });

  document.addEventListener('mouseleave', function() {
    clearCur();
    window.parent.postMessage({ type: 'previewLeave' }, '*');
  });

  // 에디터 호버 → 미리보기 강조
  var editorCur = null;
  var allTagSelected = [];
  function applyAllTagHighlight(tag, color) {
    allTagSelected.forEach(function(el) { el.style.boxShadow = ''; });
    allTagSelected = [];
    if (!tag) return;
    var first = null;
    document.querySelectorAll(tag).forEach(function(el) {
      if (el.id === '__info') return;
      el.style.boxShadow = '0 0 0 2px ' + (color || 'rgba(251,191,36,0.9)') + ', 0 0 0 4px rgba(0,0,0,0.08)';
      allTagSelected.push(el);
      if (!first) first = el;
    });
    scrollIfScrollable(first);
  }

  window.addEventListener('message', function(e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'highlightAllTag') {
      applyAllTagHighlight(e.data.tag, e.data.color);
      return;
    }
    if (editorCur) { editorCur.style.outline = ''; editorCur.style.outlineOffset = ''; editorCur = null; }
    if (e.data.type === 'editorHover') {
      var els = document.querySelectorAll(e.data.tag);
      if (els[e.data.index]) {
        editorCur = els[e.data.index];
        editorCur.style.outline = '2px solid #3b82f6';
        editorCur.style.outlineOffset = '3px';
        scrollIfScrollable(editorCur);
      }
    } else if (e.data.type === 'editorLeave') {
      if (editorCur) { editorCur.style.outline = ''; editorCur.style.outlineOffset = ''; editorCur = null; }
    }
  });
})();
<\/script>
</body>
</html>`
}

// JSP 코드를 시뮬레이션 HTML로 변환 (단일 패스 — 오프셋 임베드)
function buildJspPreviewHtml(code, annotations = []) {
  const vars = {}
  const annJson = JSON.stringify(annotations)

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function isInsideHtmlAttribute(text, pos) {
    const tagStart = text.lastIndexOf('<', pos - 1)
    const tagEnd = text.lastIndexOf('>', pos - 1)
    if (tagStart === -1 || tagStart < tagEnd) return false
    const segment = text.slice(tagStart, pos)
    const doubleQuotes = (segment.match(/"/g) || []).length
    const singleQuotes = (segment.match(/'/g) || []).length
    return doubleQuotes % 2 === 1 || singleQuotes % 2 === 1
  }

  function resolveExprValue(expr) {
    const key = expr.trim()
    if (vars[key] !== undefined) return { value: vars[key], known: true }

    const ternaryMatch = key.match(/^(\w+)\s*!=\s*null\s*\?\s*\1\s*:\s*""$/)
    if (ternaryMatch) {
      const varName = ternaryMatch[1]
      return { value: vars[varName] ?? '', known: true }
    }

    const literalMatch = key.match(/^"([^"]*)"$/)
    if (literalMatch) return { value: literalMatch[1], known: true }

    return { value: key, known: false, raw: key }
  }

  // 스크립틀릿에서 변수 선언 추출 (위치 무관하게 먼저 수집)
  const scriptletRe = /<%(?!=|@)([\s\S]*?)%>/g
  let m
  while ((m = scriptletRe.exec(code)) !== null) {
    const body = m[1]
    let vm
    const strRe = /\bString\s+(\w+)\s*=\s*"([^"]*)"/g
    while ((vm = strRe.exec(body)) !== null) vars[vm[1]] = vm[2]
    const numRe = /\b(?:int|long|double|float)\s+(\w+)\s*=\s*(-?\d+(?:\.\d+)?)/g
    while ((vm = numRe.exec(body)) !== null) vars[vm[1]] = vm[2]
  }

  // 원본 코드에서 교체할 영역 수집 { from, to, html }
  const regions = []
  const isInRegion = (pos) => regions.some(r => pos >= r.from && pos < r.to)

  const addRegion = (from, to, html) => { if (!isInRegion(from)) regions.push({ from, to, html }) }

  // JSP 주석 → 제거
  const commentRe = /<%--[\s\S]*?--%>/g
  while ((m = commentRe.exec(code)) !== null) addRegion(m.index, m.index + m[0].length, '')

  // JSP 표현식 → 초록 배지 (data-jsp-from/to 임베드)
  const exprRe = /<%=([\s\S]*?)%>/g
  while ((m = exprRe.exec(code)) !== null) {
    if (isInRegion(m.index)) continue
    const resolved = resolveExprValue(m[1])
    const val = resolved.value
    if (isInsideHtmlAttribute(code, m.index)) {
      addRegion(m.index, m.index + m[0].length, escapeHtml(String(resolved.known ? val : '')))
      continue
    }
    const style = resolved.known
      ? 'background:#d1fae5;color:#065f46;font-family:monospace;font-size:0.88em;padding:1px 4px;border-radius:2px;cursor:pointer;'
      : 'background:#d1fae5;color:#065f46;font-family:monospace;font-size:0.85em;padding:1px 5px;border-radius:3px;border:1px solid #6ee7b7;cursor:pointer;'
    addRegion(m.index, m.index + m[0].length,
      `<span style="${style}" data-jsp-from="${m.index}" data-jsp-to="${m.index + m[0].length}" data-jsp-type="expr" title="표현식">${val}</span>`)
  }

  // include 디렉티브 → 보라 배지
  const includeRe = /<%@\s*include\s+file="([^"]+)"\s*%>/gi
  while ((m = includeRe.exec(code)) !== null) {
    if (isInRegion(m.index)) continue
    addRegion(m.index, m.index + m[0].length,
      `<span style="display:inline-block;background:#ede9fe;color:#5b21b6;font-size:11px;padding:1px 8px;border-radius:3px;border:1px dashed #a78bfa;font-family:monospace;cursor:pointer;" data-jsp-from="${m.index}" data-jsp-to="${m.index + m[0].length}" data-jsp-type="directive">📄 ${m[1]}</span>`)
  }

  // 나머지 디렉티브·스크립틀릿 → 제거
  const otherJspRe = /<%[\s\S]*?%>/g
  while ((m = otherJspRe.exec(code)) !== null) {
    if (isInRegion(m.index)) continue
    addRegion(m.index, m.index + m[0].length, '')
  }

  // ( A ) ~ ( Z ) 빈칸 → 파란 배지
  const blankRe = /\(\s*([A-Z])\s*\)/g
  while ((m = blankRe.exec(code)) !== null) {
    if (isInRegion(m.index)) continue
    if (isInsideHtmlAttribute(code, m.index)) {
      addRegion(m.index, m.index + m[0].length, `( ${m[1]} )`)
      continue
    }
    addRegion(m.index, m.index + m[0].length,
      `<span style="display:inline-block;background:#dbeafe;color:#1e40af;font-weight:bold;padding:0 8px;border-radius:3px;border:1px dashed #93c5fd;font-family:monospace;font-size:0.85em;cursor:pointer;" data-jsp-from="${m.index}" data-jsp-to="${m.index + m[0].length}" data-jsp-type="blank">( ${m[1]} )</span>`)
  }

  // ___ 빈칸 → 노란 배지
  const underlineRe = /___/g
  while ((m = underlineRe.exec(code)) !== null) {
    if (isInRegion(m.index)) continue
    if (isInsideHtmlAttribute(code, m.index)) {
      addRegion(m.index, m.index + m[0].length, '___')
      continue
    }
    addRegion(m.index, m.index + m[0].length,
      `<span style="display:inline-block;background:#fef3c7;color:#92400e;padding:0 10px;border-radius:3px;border:1px dashed #fcd34d;font-family:monospace;font-size:0.85em;cursor:pointer;" data-jsp-from="${m.index}" data-jsp-to="${m.index + m[0].length}" data-jsp-type="blank">___</span>`)
  }

  // 정렬 후 겹치는 영역 제거 (먼저 추가된 것 우선)
  regions.sort((a, b) => a.from - b.from)
  const filtered = []
  let prevTo = 0
  for (const r of regions) {
    if (r.from >= prevTo) { filtered.push(r); prevTo = r.to }
  }

  // 단일 패스로 HTML 조립
  let html = ''
  let pos = 0
  for (const r of filtered) {
    html += code.slice(pos, r.from) + r.html
    pos = r.to
  }
  html += code.slice(pos)

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; }
body {
  font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  padding: 16px;
  padding-bottom: 52px;
  font-size: 14px;
  margin: 0;
  line-height: 1.7;
  color: #111;
  overscroll-behavior: contain;
}
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.35); }
table { border-collapse: collapse; }
th, td { padding: 4px 10px; border: 1px solid #ccc; }
th { background: #f3f4f6; font-weight: 600; }
input[type="text"], input[type="password"], input[type="email"] {
  border: 1px solid #d1d5db;
  padding: 3px 7px;
  border-radius: 3px;
  font-size: 13px;
  width: 160px;
}
input[type="button"], input[type="submit"], button {
  padding: 4px 14px;
  border: 1px solid #9ca3af;
  background: #f9fafb;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  margin: 2px;
}
h2 { margin: 0 0 12px; font-size: 16px; font-weight: 700; }
select { border: 1px solid #d1d5db; padding: 3px 6px; border-radius: 3px; font-size: 13px; }
#__info {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  padding: 7px 14px;
  background: #111827;
  color: #f9fafb;
  font-size: 12px;
  font-family: monospace;
  display: none;
  border-top: 3px solid #374151;
  z-index: 9999;
}
</style>
</head>
<body>
${html}
<div id="__info"></div>
<script>
(function(){
  var anns = ${annJson};
  var map = {};
  anns.forEach(function(a){ map[a.tag.toUpperCase()] = a; });
  var bar = document.getElementById('__info');
  var cur = null;
  var editorCur = null;

  var SKIP = { SCRIPT: 1, STYLE: 1, HTML: 1, HEAD: 1, BODY: 1 };

  function canScrollPage() {
    var root = document.scrollingElement || document.documentElement;
    return !!root && (root.scrollHeight > root.clientHeight + 1 || root.scrollWidth > root.clientWidth + 1);
  }

  function scrollIfScrollable(el) {
    if (!el || !canScrollPage()) return;
    var root = document.scrollingElement || document.documentElement;
    var rect = el.getBoundingClientRect();
    var rootRect = root.getBoundingClientRect();
    var next = {};
    if (root.scrollHeight > root.clientHeight + 1) {
      next.top = Math.max(0, root.scrollTop + (rect.top - rootRect.top) - (root.clientHeight / 2) + (rect.height / 2));
    }
    if (root.scrollWidth > root.clientWidth + 1) {
      next.left = Math.max(0, root.scrollLeft + (rect.left - rootRect.left) - (root.clientWidth / 2) + (rect.width / 2));
    }
    root.scrollTo(Object.assign({}, next, { behavior: 'smooth' }));
  }

  function clearCur() {
    if (cur) {
      cur.style.outline = '';
      cur.style.outlineOffset = '';
      cur = null;
      bar.style.display = 'none';
      window.parent.postMessage({ type: 'previewLeave' }, '*');
    }
  }

  document.addEventListener('mouseover', function(e) {
    var el = e.target;

    // JSP 배지 감지 (data-jsp-from 속성)
    if (el.dataset && el.dataset.jspFrom !== undefined) {
      if (cur && cur !== el) { cur.style.outline = ''; cur.style.outlineOffset = ''; }
      cur = el;
      el.style.outline = '2px solid #fbbf24';
      el.style.outlineOffset = '2px';
      bar.style.display = 'block';
      bar.style.borderTopColor = '#fbbf24';
      var jspTypeLabel = el.dataset.jspType === 'expr' ? '표현식'
        : el.dataset.jspType === 'directive' ? '디렉티브'
        : el.dataset.jspType === 'blank' ? '빈칸'
        : 'JSP 블록';
      bar.innerHTML =
        '<span style="color:#fcd34d;font-weight:bold;">' + jspTypeLabel + '</span>' +
        '<span style="color:#d1d5db;margin-left:8px;">JSP 영역</span>';
      window.parent.postMessage({ type: 'previewJspHover', from: parseInt(el.dataset.jspFrom), to: parseInt(el.dataset.jspTo) }, '*');
      return;
    }

    while (el && el.tagName) {
      if (el.id === '__info') { clearCur(); return; }
      if (!SKIP[el.tagName]) {
        if (cur && cur !== el) { cur.style.outline = ''; cur.style.outlineOffset = ''; }
        cur = el;
        el.style.outline = '2px solid #f59e0b';
        el.style.outlineOffset = '2px';
        bar.style.display = 'block';
        bar.style.borderTopColor = '#f59e0b';
        var tag = el.tagName.toLowerCase();
        var ann = map[el.tagName] || map[tag];
        bar.innerHTML =
          '<span style="color:' + (ann ? ann.color : '#fcd34d') + ';font-weight:bold;">&lt;' + (ann ? ann.label : tag) + '&gt;</span>' +
          '<span style="color:#d1d5db;margin-left:8px;">' + (ann ? ann.description : 'HTML 요소') + '</span>';
        var siblings = document.querySelectorAll(tag);
        var idx = Array.prototype.indexOf.call(siblings, el);
        var classes = Array.prototype.slice.call(el.classList);
        window.parent.postMessage({ type: 'previewHover', tag: tag, index: idx, classes: classes }, '*');
        return;
      }
      el = el.parentElement;
    }
    clearCur();
  });

  document.addEventListener('mouseleave', function() {
    clearCur();
  });

  // 에디터 호버 / 범례 클릭 → 미리보기 강조
  var typeSelected = [];
  function applyTypeHighlight(jspType) {
    typeSelected.forEach(function(el) { el.style.boxShadow = ''; });
    typeSelected = [];
    if (!jspType) return;
    var first = null;
    document.querySelectorAll('[data-jsp-type="' + jspType + '"]').forEach(function(el) {
      el.style.boxShadow = '0 0 0 2px rgba(251,191,36,0.9), 0 0 0 4px rgba(251,191,36,0.25)';
      typeSelected.push(el);
      if (!first) first = el;
    });
    scrollIfScrollable(first);
  }

  window.addEventListener('message', function(e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'highlightJspType') {
      applyTypeHighlight(e.data.jspType);
      return;
    }
    if (editorCur) { editorCur.style.outline = ''; editorCur.style.outlineOffset = ''; editorCur = null; }
    if (e.data.type === 'editorHover') {
      var els = document.querySelectorAll(e.data.tag);
      if (els[e.data.index]) {
        editorCur = els[e.data.index];
        editorCur.style.outline = '2px solid #3b82f6';
        editorCur.style.outlineOffset = '3px';
        scrollIfScrollable(editorCur);
      }
    } else if (e.data.type === 'editorJspHover') {
      var badge = document.querySelector('[data-jsp-from="' + e.data.from + '"]');
      if (badge) {
        editorCur = badge;
        editorCur.style.outline = '2px solid #3b82f6';
        editorCur.style.outlineOffset = '3px';
        scrollIfScrollable(editorCur);
      }
    }
  });
})();
<\/script>
</body>
</html>`
}

export default function PracticalLesson() {
  const { topic: topicId } = useParams()
  const topic = getTopicById(topicId)
  const splitPaneHeight = '460px'

  const [activeLesson, setActiveLesson] = useState(0)
  const [codes, setCodes] = useState(() => {
    if (!topic) return {}
    return Object.fromEntries(topic.lessons.map(l => [l.id, l.starterCode]))
  })
  const [showSolution, setShowSolution] = useState(false)
  const [descOpen, setDescOpen] = useState(true)
  const [actionFlowStep, setActionFlowStep] = useState(0)
  const [validationCase, setValidationCase] = useState(0)
  const [daoFlowStep, setDaoFlowStep] = useState(0)
  const [dtoHighlightKey, setDtoHighlightKey] = useState(DTO_MEMBER_PARTS[0].key)
  const [sqlFlowStep, setSqlFlowStep] = useState(0)

  // live-html 전용: 디바운스된 미리보기 HTML
  const [liveHtml, setLiveHtml] = useState('')
  const debounceRef = useRef(null)

  // 미리보기 iframe ref — 에디터 호버 메시지 전달용
  const iframeRef = useRef(null)
  const editorToPreviewExt = useMemo(() => [makeEditorToPreviewSync(
    (tag, index) => iframeRef.current?.contentWindow?.postMessage({ type: 'editorHover', tag, index }, '*'),
    ()           => iframeRef.current?.contentWindow?.postMessage({ type: 'editorLeave' }, '*'),
    (from, to)   => iframeRef.current?.contentWindow?.postMessage({ type: 'editorJspHover', from, to }, '*'),
    ()           => iframeRef.current?.contentWindow?.postMessage({ type: 'editorJspLeave' }, '*'),
  )], []) // eslint-disable-line react-hooks/exhaustive-deps

  // 미리보기 → 에디터 하이라이트 연동
  const [previewHoveredTag,   setPreviewHoveredTag]   = useState(null)
  const [previewHoveredRange, setPreviewHoveredRange] = useState(null)
  const [highlightedJspType,  setHighlightedJspType]  = useState(null)
  const [highlightedHtmlTag,  setHighlightedHtmlTag]  = useState(null)

  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return
      if (e.data.type === 'previewHover') {
        setPreviewHoveredTag({ tag: e.data.tag ?? null, index: e.data.index ?? 0, classes: e.data.classes ?? [] })
        setPreviewHoveredRange(null)
      } else if (e.data.type === 'previewJspHover') {
        setPreviewHoveredRange({ from: e.data.from, to: e.data.to })
        setPreviewHoveredTag(null)
      } else if (e.data.type === 'previewLeave') {
        setPreviewHoveredTag(null)
        setPreviewHoveredRange(null)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (!topic) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-400 text-sm mb-4">주제를 찾을 수 없습니다.</p>
        <Link
          to="/practical"
          className="text-sm border border-gray-900 px-4 py-2 rounded hover:bg-gray-900 hover:text-white transition-colors"
        >
          돌아가기
        </Link>
      </div>
    )
  }

  const lesson = topic.lessons[activeLesson]
  const currentCode = codes[lesson.id] ?? lesson.starterCode
  const isLiveHtml = lesson.type === 'live-html'
  const isLiveJsp  = lesson.type === 'live-jsp'
  const isCode = !isLiveHtml && !isLiveJsp
  const showActionFlow = lesson.id === 'form_02' || lesson.id === 'hrd01_02'
  const showValidationFlow = lesson.id === 'form_03'
  const showDaoConnectionFlow = lesson.id === 'dao_01'
  const showDaoInsertFlow = lesson.id === 'dao_02'
  const showDaoSelectFlow = lesson.id === 'dao_03'
  const showDaoSummaryFlow = lesson.id === 'dao_04'
  const showDtoFlow = lesson.id.startsWith('dto_')
  const dtoVisual = DTO_VISUALS[lesson.id] ?? null
  const showSqlFlow = lesson.id.startsWith('sql_')
  const sqlVisual = SQL_VISUALS[lesson.id] ?? null
  const lang = lesson.language ?? (isLiveHtml || isLiveJsp ? 'html' : 'java')
  const lessonAnnotations = getLessonAnnotations(lesson)
  const flowStepForHighlight = showDaoConnectionFlow || showDaoInsertFlow || showDaoSelectFlow || showDaoSummaryFlow
    ? daoFlowStep
    : showSqlFlow
      ? sqlFlowStep
      : actionFlowStep
  const codeHighlightRange = getCodeHighlightRange(lesson.id, currentCode, flowStepForHighlight, validationCase, dtoHighlightKey)
  const codeEditorMinHeight = getAdaptiveEditorMinHeight(currentCode, { compact: showDtoFlow || showSqlFlow })

  useEffect(() => {
    setActionFlowStep(0)
    setValidationCase(0)
    setDaoFlowStep(0)
    setSqlFlowStep(0)
    const nextVisual = DTO_VISUALS[lesson.id]
    setDtoHighlightKey(nextVisual?.parts?.[0]?.key ?? DTO_MEMBER_PARTS[0].key)
  }, [lesson.id])

  // live-html / live-jsp: 에디터 태그 호버 툴팁
  const tagTooltipExt = useMemo(() => {
    if ((!isLiveHtml && !isLiveJsp) || !lessonAnnotations.length) return []
    return [makeTagHoverTooltip(lessonAnnotations)]
  }, [lesson.id, isLiveHtml, isLiveJsp, lessonAnnotations]) // eslint-disable-line react-hooks/exhaustive-deps

  // live-html / live-jsp: 코드 변경 시 300ms 디바운스 후 iframe 업데이트
  useEffect(() => {
    if (!isLiveHtml && !isLiveJsp) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (isLiveHtml) setLiveHtml(buildAnnotatedHtml(currentCode, lessonAnnotations))
      else            setLiveHtml(buildJspPreviewHtml(currentCode, lessonAnnotations))
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [currentCode, lesson.id, isLiveHtml, isLiveJsp, lessonAnnotations])

  // 탭 변경 시 즉시 미리보기 초기화
  const handleTabChange = (i) => {
    setActiveLesson(i)
    setShowSolution(false)
    setDescOpen(true)
    setHighlightedJspType(null)
    setHighlightedHtmlTag(null)
    const nextLesson = topic.lessons[i]
    const nextCode = codes[nextLesson.id] ?? nextLesson.starterCode
    const nextAnnotations = getLessonAnnotations(nextLesson)
    if (nextLesson.type === 'live-html') {
      setLiveHtml(buildAnnotatedHtml(nextCode, nextAnnotations))
    } else if (nextLesson.type === 'live-jsp') {
      setLiveHtml(buildJspPreviewHtml(nextCode, nextAnnotations))
    }
  }

  const handleCodeChange = (val) => {
    setCodes(prev => ({ ...prev, [lesson.id]: val }))
  }

  const handleReset = () => {
    setCodes(prev => ({ ...prev, [lesson.id]: lesson.starterCode }))
    setShowSolution(false)
    if (isLiveHtml) setLiveHtml(buildAnnotatedHtml(lesson.starterCode, lessonAnnotations))
    else if (isLiveJsp) setLiveHtml(buildJspPreviewHtml(lesson.starterCode, lessonAnnotations))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-4">
        <Link to="/practical" className="text-xs text-gray-400 hover:text-gray-700">
          ← 실기 주제 목록
        </Link>
        <div className="flex items-baseline gap-3 mt-2">
          <h1 className="text-lg font-bold text-gray-900">{topic.title}</h1>
          <span className="text-xs text-gray-400">{topic.lessons.length}개 실습</span>
        </div>
      </div>

      {/* 레슨 탭 */}
      <div className="flex gap-0 mb-5 border-b border-gray-200 overflow-x-auto">
        {topic.lessons.map((l, i) => (
          <button
            key={l.id}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors -mb-px ${
              i === activeLesson
                ? 'border-gray-900 text-gray-900 font-semibold bg-white'
                : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {i + 1}. {l.title}
          </button>
        ))}
      </div>

      {/* 요구사항 / 설명 */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setDescOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            설명 / 요구사항
          </span>
          <span className="text-gray-400 text-sm">{descOpen ? '▲' : '▼'}</span>
        </button>
        {descOpen && (
          <div className="px-4 py-4 text-sm text-gray-700 leading-loose whitespace-pre-line bg-white">
            {lesson.description}
          </div>
        )}
      </div>

      {/* ── live-html: 분할 레이아웃 ── */}
      {isLiveHtml && (
        <>
          {/* 에디터 + 미리보기 분할 */}
          <div className="grid grid-cols-2 gap-3 mb-3 min-h-0">
            {/* 왼쪽: 에디터 */}
            <div className="min-h-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  코드 편집
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors"
                >
                  초기화
                </button>
              </div>
              <CodeEditor
                key={`editor-${lesson.id}`}
                value={currentCode}
                onChange={handleCodeChange}
                language={lang}
                height={splitPaneHeight}
                minHeight={splitPaneHeight}
                extraExtensions={[...tagTooltipExt, ...editorToPreviewExt]}
                highlightTag={previewHoveredTag}
                highlightAllTag={highlightedHtmlTag}
              />
            </div>

            {/* 오른쪽: 실시간 미리보기 */}
            <div className="min-h-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  실시간 미리보기
                </span>
                <span className="text-xs text-gray-300">— 입력하면 즉시 반영</span>
              </div>
              <div
                className="rounded-lg border border-gray-200 bg-white"
                style={{ height: splitPaneHeight, minHeight: splitPaneHeight, overflow: 'hidden' }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={liveHtml}
                  className="w-full h-full"
                  style={{ border: 'none', display: 'block' }}
                  scrolling="auto"
                  sandbox="allow-scripts"
                  title="live-preview"
                />
              </div>
            </div>
          </div>

          {/* 태그 범례 — 클릭하면 해당 태그 전체 하이라이트 */}
          {lesson.annotations?.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 shrink-0">태그 선택:</span>
              {lesson.annotations.map(ann => {
                const active = highlightedHtmlTag === ann.tag
                return (
                  <button
                    key={ann.tag}
                    onClick={() => {
                      const next = active ? null : ann.tag
                      setHighlightedHtmlTag(next)
                      iframeRef.current?.contentWindow?.postMessage(
                        { type: 'highlightAllTag', tag: next, color: ann.color }, '*'
                      )
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all"
                    style={{
                      borderColor: ann.color,
                      color: ann.color,
                      background: active ? ann.color + '30' : ann.color + '14',
                      outline: active ? `2px solid ${ann.color}` : '2px solid transparent',
                      outlineOffset: '1px',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ann.color }} />
                    &lt;{ann.label}&gt;
                  </button>
                )
              })}
            </div>
          )}

          {/* 모범 답안 버튼 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="px-4 py-2 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
            >
              {showSolution ? '답안 숨기기' : '모범 답안 보기'}
            </button>
          </div>

          {/* 모범 답안 */}
          {showSolution && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                모범 답안
              </div>
              <CodeEditor
                key={`solution-${lesson.id}`}
                value={lesson.solution}
                language={lang}
                readOnly={true}
                minHeight="280px"
              />
            </div>
          )}
        </>
      )}

      {/* ── live-jsp: 분할 레이아웃 ── */}
      {isLiveJsp && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3 min-h-0">
            {/* 왼쪽: 에디터 */}
            <div className="min-h-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  코드 편집
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors"
                >
                  초기화
                </button>
              </div>
              <CodeEditor
                key={`editor-${lesson.id}`}
                value={currentCode}
                onChange={handleCodeChange}
                language={lang}
                height={splitPaneHeight}
                minHeight={splitPaneHeight}
                extraExtensions={[...tagTooltipExt, ...editorToPreviewExt]}
                highlightTag={previewHoveredTag}
                highlightRange={previewHoveredRange}
                highlightJspType={highlightedJspType}
              />
            </div>

            {/* 오른쪽: JSP 시뮬레이션 미리보기 */}
            <div className="min-h-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  JSP 시뮬레이션
                </span>
                <span className="text-xs text-gray-300">— 변수·빈칸을 시각화</span>
              </div>
              <div
                className="rounded-lg border border-gray-200 bg-white"
                style={{ height: splitPaneHeight, minHeight: splitPaneHeight, overflow: 'hidden' }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={liveHtml}
                  className="w-full h-full"
                  style={{ border: 'none', display: 'block' }}
                  scrolling="auto"
                  sandbox="allow-scripts"
                  title="jsp-preview"
                />
              </div>
            </div>
          </div>

          {/* JSP 블록 색상 범례 — 클릭하면 해당 타입 전체 하이라이트 */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 shrink-0">블록 타입 선택:</span>
            {[
              { color: 'rgba(245,158,11,0.35)', solidColor: '#f59e0b', label: '<% %>', desc: '스크립틀릿', type: 'scriptlet' },
              { color: 'rgba(16,185,129,0.35)',  solidColor: '#10b981', label: '<%= %>', desc: '표현식',    type: 'expr' },
              { color: 'rgba(139,92,246,0.35)',  solidColor: '#8b5cf6', label: '<%@ %>', desc: '디렉티브',  type: 'directive' },
              { color: 'rgba(107,114,128,0.35)', solidColor: '#6b7280', label: '<%-- --%>', desc: '주석',   type: 'comment' },
            ].map(({ color, solidColor, label, desc, type }) => {
              const active = highlightedJspType === type
              return (
                <button
                  key={type}
                  onClick={() => {
                    const next = active ? null : type
                    setHighlightedJspType(next)
                    iframeRef.current?.contentWindow?.postMessage({ type: 'highlightJspType', jspType: next }, '*')
                  }}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono transition-all"
                  style={{
                    background: color,
                    color: '#374151',
                    outline: active ? `2px solid ${solidColor}` : '2px solid transparent',
                    outlineOffset: '1px',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                  <span className="font-sans text-gray-500">{desc}</span>
                </button>
              )
            })}
            <span className="text-xs text-gray-300 ml-1">
              · <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0 4px', borderRadius: 3, fontFamily: 'monospace', fontSize: 11 }}>( A )</span> 빈칸
              &nbsp;· <span style={{ background: '#d1fae5', color: '#065f46', padding: '0 4px', borderRadius: 3, fontFamily: 'monospace', fontSize: 11 }}>expr</span> 표현식
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="px-4 py-2 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
            >
              {showSolution ? '답안 숨기기' : '모범 답안 보기'}
            </button>
          </div>

          {showSolution && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                모범 답안
              </div>
              <CodeEditor
                key={`solution-${lesson.id}`}
                value={lesson.solution}
                language={lang}
                readOnly={true}
                minHeight="280px"
              />
            </div>
          )}
        </>
      )}

      {/* ── code / fill-in-blank 타입 ── */}
      {isCode && (
        <>
          <div className={`mb-3 ${showDtoFlow ? 'space-y-3' : showActionFlow || showValidationFlow || showDaoConnectionFlow || showDaoInsertFlow || showDaoSelectFlow || showDaoSummaryFlow || showSqlFlow ? 'grid grid-cols-2 gap-3' : ''}`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {showDtoFlow ? '코드 구조' : '코드 편집'}
                </span>
                {!showDtoFlow && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors"
                  >
                    초기화
                  </button>
                )}
              </div>
              <CodeEditor
                key={`editor-${lesson.id}`}
                value={currentCode}
                onChange={showDtoFlow ? undefined : handleCodeChange}
                language={lang}
                minHeight={codeEditorMinHeight}
                readOnly={showDtoFlow}
                highlightRange={codeHighlightRange}
              />
            </div>

            {showActionFlow && (
              <ActionFlowPanel
                stepIndex={actionFlowStep}
                onStepChange={setActionFlowStep}
              />
            )}

            {showValidationFlow && (
              <ValidationFlowPanel
                caseIndex={validationCase}
                onCaseChange={setValidationCase}
              />
            )}

            {showDaoConnectionFlow && (
              <DaoFlowPanel
                title="DB 연결 및 조회 흐름"
                steps={DAO_CONNECTION_STEPS}
                stepIndex={daoFlowStep}
                onStepChange={setDaoFlowStep}
              />
            )}

            {showDaoInsertFlow && (
              <DaoFlowPanel
                title="INSERT 실행 흐름"
                steps={DAO_INSERT_STEPS}
                stepIndex={daoFlowStep}
                onStepChange={setDaoFlowStep}
              />
            )}

            {showDaoSelectFlow && (
              <DaoFlowPanel
                title="SELECT → DTO → List 흐름"
                steps={DAO_SELECT_STEPS}
                stepIndex={daoFlowStep}
                onStepChange={setDaoFlowStep}
              />
            )}

            {showDaoSummaryFlow && (
              <DaoFlowPanel
                title="JOIN 집계 결과 흐름"
                steps={DAO_SUMMARY_STEPS}
                stepIndex={daoFlowStep}
                onStepChange={setDaoFlowStep}
              />
            )}

            {showDtoFlow && (
              <DtoStructurePanel
                visual={dtoVisual}
                selectedKey={dtoHighlightKey}
                onSelect={setDtoHighlightKey}
              />
            )}

            {showSqlFlow && sqlVisual && (
              <SqlFlowPanel
                visual={sqlVisual}
                stepIndex={sqlFlowStep}
                onStepChange={setSqlFlowStep}
              />
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="px-4 py-2.5 border border-gray-300 text-sm rounded hover:border-gray-900 transition-colors"
            >
              {showSolution ? '답안 숨기기' : '정답 확인'}
            </button>
          </div>

          {showSolution && (
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">내 코드</div>
                <pre className="text-xs bg-gray-900 text-gray-200 rounded-lg p-4 overflow-auto max-h-72 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700">
                  {currentCode}
                </pre>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">모범 답안</div>
                <pre className="text-xs bg-gray-900 text-gray-200 rounded-lg p-4 overflow-auto max-h-72 whitespace-pre-wrap font-mono leading-relaxed border border-gray-700">
                  {lesson.solution}
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      {/* 이전/다음 */}
      <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => handleTabChange(Math.max(0, activeLesson - 1))}
          disabled={activeLesson === 0}
          className="text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-200 transition-colors"
        >
          ← 이전 실습
        </button>
        <span className="text-xs text-gray-300">
          {activeLesson + 1} / {topic.lessons.length}
        </span>
        <button
          onClick={() => handleTabChange(Math.min(topic.lessons.length - 1, activeLesson + 1))}
          disabled={activeLesson === topic.lessons.length - 1}
          className="text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-200 transition-colors"
        >
          다음 실습 →
        </button>
      </div>
    </div>
  )
}
