export default {
  id: 'sql',
  title: 'SQL 핵심',
  description: '정보처리산업기사 실기의 핵심 영역인 SQL을 학습합니다. SELECT부터 JOIN, 집계함수까지 직접 작성하며 익혀보세요.',
  lessons: [
    {
      id: 'sql_01',
      title: 'SELECT 기본 조회',
      description: `SELECT 문은 테이블에서 데이터를 조회합니다.

기본 구조:
SELECT 컬럼명 FROM 테이블명 WHERE 조건;

실습 테이블: TBL_STUDENT
- student_id (학번)
- name (이름)
- grade (학년)
- dept (학과)

아래 SQL이 어떤 행을 남기고 어떤 컬럼만 보여주는지 결과 테이블과 함께 확인해보세요.`,
      type: 'code',
      language: 'sql',
      starterCode: `-- 컴퓨터공학과(CS) 학생의 학번과 이름을 조회하시오
SELECT student_id, name
FROM TBL_STUDENT
WHERE dept = 'CS';`,
      solution: `SELECT student_id, name
FROM TBL_STUDENT
WHERE dept = 'CS';`
    },
    {
      id: 'sql_02',
      title: 'ORDER BY와 LIMIT',
      description: `ORDER BY: 결과를 특정 컬럼 기준으로 정렬
- ASC: 오름차순 (기본값)
- DESC: 내림차순

LIMIT n: 결과에서 n개만 가져옴

실습 요구사항:
TBL_SCORE 테이블에서 정렬 후 상위 3개 행만 남는 과정을 확인해보세요.`,
      type: 'code',
      language: 'sql',
      starterCode: `-- 점수가 높은 상위 3명의 이름과 점수를 조회하시오
-- TBL_SCORE 컬럼: student_id, name, score
SELECT name, score
FROM TBL_SCORE
ORDER BY score DESC
LIMIT 3;`,
      solution: `SELECT name, score
FROM TBL_SCORE
ORDER BY score DESC
LIMIT 3;`
    },
    {
      id: 'sql_03',
      title: 'JOIN (테이블 연결)',
      description: `INNER JOIN은 두 테이블에서 조인 조건을 만족하는 행만 반환합니다.

구조:
SELECT 컬럼
FROM 테이블A
INNER JOIN 테이블B ON 테이블A.키 = 테이블B.키

과제 레포(HRD_01)의 회원-주문 테이블 구조:
- TBL_MEMBER: custno, custname, phone, grade
- TBL_ORDER: ordno, custno, prodname, amount, orderdate

요구사항:
조인 전후에 어떤 컬럼이 합쳐지고 어떤 행이 매칭되는지 확인해보세요.`,
      type: 'code',
      language: 'sql',
      starterCode: `-- 회원 이름과 주문 상품명, 수량을 조회하시오
SELECT m.custname, o.prodname, o.amount
FROM TBL_MEMBER m
INNER JOIN TBL_ORDER o ON m.custno = o.custno;`,
      solution: `SELECT m.custname, o.prodname, o.amount
FROM TBL_MEMBER m
INNER JOIN TBL_ORDER o ON m.custno = o.custno;`
    },
    {
      id: 'sql_04',
      title: 'GROUP BY와 집계함수',
      description: `GROUP BY: 특정 컬럼 값이 같은 행들을 그룹으로 묶음
HAVING: 그룹화된 결과에 조건 적용

집계함수:
- COUNT(*): 행 수
- SUM(컬럼): 합계
- AVG(컬럼): 평균
- MAX/MIN(컬럼): 최댓값/최솟값

요구사항:
GROUP BY로 묶인 뒤 SUM과 HAVING이 어떻게 적용되는지 결과 변화와 함께 확인해보세요.`,
      type: 'code',
      language: 'sql',
      starterCode: `-- 고객번호별 총 주문 금액 (10000 이상인 고객만)
SELECT custno, SUM(amount) AS total_amount
FROM TBL_ORDER
GROUP BY custno
HAVING SUM(amount) >= 10000;`,
      solution: `SELECT custno, SUM(amount) AS total_amount
FROM TBL_ORDER
GROUP BY custno
HAVING SUM(amount) >= 10000;`
    },
    {
      id: 'sql_05',
      title: 'INSERT와 UPDATE',
      description: `DML(데이터 조작어):
- INSERT: 새 행 추가
- UPDATE: 기존 행 수정
- DELETE: 행 삭제

INSERT 구조:
INSERT INTO 테이블 (컬럼1, 컬럼2) VALUES (값1, 값2);

UPDATE 구조:
UPDATE 테이블 SET 컬럼1=값1 WHERE 조건;

요구사항:
INSERT로 행이 추가되고, UPDATE로 같은 행의 값이 바뀌는 전후 상태를 확인해보세요.`,
      type: 'code',
      language: 'sql',
      starterCode: `-- ① 새 회원 추가
INSERT INTO TBL_MEMBER (custno, custname, grade)
VALUES (1001, '이순신', 'VIP');

-- ② grade 변경
UPDATE TBL_MEMBER
SET grade = 'GOLD'
WHERE custno = 1001;`,
      solution: `-- ① 새 회원 추가
INSERT INTO TBL_MEMBER (custno, custname, grade)
VALUES (1001, '이순신', 'VIP');

-- ② grade 변경
UPDATE TBL_MEMBER
SET grade = 'GOLD'
WHERE custno = 1001;`
    }
  ]
}
