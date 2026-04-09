export default {
  id: 'css',
  title: 'CSS 스타일링',
  description: '화면 구현에서 사용하는 CSS 핵심 속성을 직접 입력하며 실시간으로 결과를 확인합니다. 빈칸(___) 을 채워가며 각 속성이 화면에 미치는 영향을 눈으로 확인하세요.',
  lessons: [
    {
      id: 'css_01',
      title: 'CSS 선택자와 기본 스타일',
      type: 'live-html',
      description: `CSS 선택자 종류:
• 태그 선택자:   h1 { ... }
• 클래스 선택자: .myClass { ... }
• ID 선택자:     #myId { ... }
• 자손 선택자:   table td { ... }

자주 쓰는 속성:
• color               — 글자 색상
• background-color    — 배경 색상
• font-size           — 글자 크기 (예: 16px)
• font-weight         — 굵기 (bold / normal)
• text-align          — 정렬 (left / center / right)

___ 부분을 채워가며 테이블 스타일 변화를 확인해보세요.`,
      annotations: [
        { tag: 'table', color: '#2563eb', label: 'table',   description: 'CSS table { ... } 로 스타일 적용.' },
        { tag: 'th',    color: '#d97706', label: 'th',      description: 'CSS table th { ... } 로 헤더 스타일.' },
        { tag: 'td',    color: '#dc2626', label: 'td',      description: 'CSS table td { ... } 로 셀 스타일.' },
        { tag: 'tr',    color: '#16a34a', label: 'tr:nth-child(even)', description: '짝수 행 배경색 지정에 사용.' },
      ],
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
      type: 'live-html',
      description: `CSS 박스 모델의 4겹 구조:
  [ margin ]
    [ border ]
      [ padding ]
        [ content ]

• padding  — 안쪽 여백 (테두리 ↔ 내용)
• border   — 테두리 선
• margin   — 바깥 여백 (다른 요소와의 간격)

단위: px(픽셀), %(부모 기준 비율), em(부모 폰트 크기 기준)

___ 를 수치로 채우면서 각 여백이 어떻게 변하는지 확인하세요.`,
      annotations: [
        { tag: 'nav', color: '#7c3aed', label: 'nav',       description: 'CSS nav { ... } 로 배경·패딩 적용.' },
        { tag: 'a',   color: '#db2777', label: 'a',         description: 'CSS nav a { ... } 로 링크 스타일.' },
      ],
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
</nav>

<p style="margin-top:20px; color:#555;">
  nav 위에 마우스를 올려보세요 (hover 효과)
</p>`,
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
      title: '버튼 스타일 (cursor, border-radius)',
      type: 'live-html',
      description: `폼 버튼 스타일링에서 자주 쓰는 속성:

• cursor: pointer     — 마우스 올리면 손가락 모양
• border: none        — 기본 테두리 제거
• border-radius: 4px  — 모서리 둥글게
• :hover 선택자       — 마우스 올렸을 때 스타일

___ 를 채워서 두 버튼을 완성하세요.`,
      annotations: [
        { tag: 'button', color: '#2563eb', label: 'button', description: 'CSS .btn { ... } 클래스로 스타일 적용.' },
      ],
      starterCode: `<style>
  .btn {
    padding: 8px 20px;
    font-size: 14px;
    cursor: ___;
    border: none;
    border-radius: 4px;
    margin: 4px;
  }
  /* 주 버튼: 검정 배경, 흰 글자 */
  .btn-primary {
    background-color: #000;
    color: #fff;
  }
  .btn-primary:hover {
    background-color: #333;
  }
  /* 보조 버튼: 흰 배경, 검은 테두리·글자 */
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
<button class="btn btn-secondary">취소</button>

<hr style="margin:20px 0;"/>

<p style="font-size:13px; color:#666;">
  힌트: cursor에는 pointer, btn-secondary 배경에는 #fff 또는 white
</p>`,
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
