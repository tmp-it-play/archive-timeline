export default {
  id: 'css',
  title: 'CSS 스타일링',
  description: '화면 구현에서 사용하는 CSS 핵심 속성을 학습합니다. 선택자, 텍스트/배경 스타일, 레이아웃을 직접 작성해보세요.',
  lessons: [
    {
      id: 'css_01',
      title: 'CSS 선택자와 기본 스타일',
      description: `CSS 선택자 종류:
- 태그 선택자: h1 { ... }
- 클래스 선택자: .myClass { ... }
- ID 선택자: #myId { ... }
- 복합 선택자: table td { ... }

기본 속성:
- color: 글자 색상
- background-color: 배경 색상
- font-size: 글자 크기
- font-weight: 글자 굵기 (bold, normal)
- text-align: 정렬 (left, center, right)

테이블을 스타일링해보세요.`,
      type: 'html',
      starterCode: `<style>
  /* 테이블 전체 테두리 */
  table {
    border-collapse: collapse;
    width: 100%;
  }
  /* th와 td에 테두리와 패딩 */
  table th, table td {
    border: 1px solid #333;
    padding: 8px;
  }
  /* th 배경색을 검정, 글자색을 흰색으로 */
  table th {
    background-color: ___;
    color: ___;
    text-align: center;
  }
  /* 짝수 행 배경색을 연회색(#f5f5f5)으로 */
  table tr:nth-child(even) {
    background-color: ___;
  }
</style>

<table>
  <tr>
    <th>이름</th>
    <th>학과</th>
    <th>점수</th>
  </tr>
  <tr>
    <td>홍길동</td>
    <td>컴퓨터공학</td>
    <td>95</td>
  </tr>
  <tr>
    <td>김철수</td>
    <td>정보통신</td>
    <td>88</td>
  </tr>
  <tr>
    <td>이영희</td>
    <td>소프트웨어</td>
    <td>92</td>
  </tr>
</table>`,
      solution: `<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  table th, table td {
    border: 1px solid #333;
    padding: 8px;
  }
  table th {
    background-color: #000000;
    color: #ffffff;
    text-align: center;
  }
  table tr:nth-child(even) {
    background-color: #f5f5f5;
  }
</style>

<table>
  <tr>
    <th>이름</th>
    <th>학과</th>
    <th>점수</th>
  </tr>
  <tr>
    <td>홍길동</td>
    <td>컴퓨터공학</td>
    <td>95</td>
  </tr>
  <tr>
    <td>김철수</td>
    <td>정보통신</td>
    <td>88</td>
  </tr>
  <tr>
    <td>이영희</td>
    <td>소프트웨어</td>
    <td>92</td>
  </tr>
</table>`
    },
    {
      id: 'css_02',
      title: '박스 모델 (margin, padding, border)',
      description: `CSS 박스 모델의 구조:
- content: 실제 내용 영역
- padding: 내용과 테두리 사이 안쪽 여백
- border: 테두리
- margin: 테두리 바깥 외부 여백

단위: px(픽셀), %(퍼센트), em(부모 기준)

네비게이션 메뉴를 박스 모델로 스타일링해보세요.`,
      type: 'html',
      starterCode: `<style>
  nav {
    background-color: #222;
    /* 상하 10px, 좌우 20px 패딩 */
    padding: ___ ___;
  }
  nav a {
    color: white;
    text-decoration: none;
    /* 좌우 15px 마진 */
    margin: 0 ___;
    /* 상하 5px, 좌우 10px 패딩 */
    padding: 5px ___;
    display: inline-block;
  }
  nav a:hover {
    background-color: #555;
    /* 둥근 모서리 4px */
    border-radius: ___;
  }
</style>

<nav>
  <a href="#">홈</a>
  <a href="#">필기 준비</a>
  <a href="#">실기 준비</a>
  <a href="#">오답 노트</a>
</nav>`,
      solution: `<style>
  nav {
    background-color: #222;
    padding: 10px 20px;
  }
  nav a {
    color: white;
    text-decoration: none;
    margin: 0 15px;
    padding: 5px 10px;
    display: inline-block;
  }
  nav a:hover {
    background-color: #555;
    border-radius: 4px;
  }
</style>

<nav>
  <a href="#">홈</a>
  <a href="#">필기 준비</a>
  <a href="#">실기 준비</a>
  <a href="#">오답 노트</a>
</nav>`
    },
    {
      id: 'css_03',
      title: '버튼 스타일',
      description: `폼 제출 버튼과 일반 버튼을 CSS로 스타일링합니다.
화면 구현 과제에서 자주 사용되는 버튼 패턴입니다.

주요 속성:
- cursor: pointer: 마우스를 올리면 손가락 모양
- border: none: 기본 테두리 제거
- border-radius: 모서리 둥글기

제출 버튼과 취소 버튼을 스타일링해보세요.`,
      type: 'html',
      starterCode: `<style>
  .btn {
    padding: 8px 20px;
    font-size: 14px;
    cursor: ___;
    border: none;
    border-radius: 4px;
    margin: 4px;
  }
  .btn-primary {
    background-color: #000;
    color: #fff;
  }
  .btn-primary:hover {
    background-color: #333;
  }
  /* 취소 버튼: 흰 배경, 검은 테두리 */
  .btn-secondary {
    background-color: ___;
    color: #000;
    border: 1px solid #000;
  }
  .btn-secondary:hover {
    background-color: #eee;
  }
</style>

<button class="btn btn-primary">저장</button>
<button class="btn btn-secondary">취소</button>`,
      solution: `<style>
  .btn {
    padding: 8px 20px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    margin: 4px;
  }
  .btn-primary {
    background-color: #000;
    color: #fff;
  }
  .btn-primary:hover {
    background-color: #333;
  }
  .btn-secondary {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
  .btn-secondary:hover {
    background-color: #eee;
  }
</style>

<button class="btn btn-primary">저장</button>
<button class="btn btn-secondary">취소</button>`
    }
  ]
}
