export default {
  id: 'html-basic',
  title: 'HTML 핵심 태그',
  description: 'table, form, input 등 화면 구현에 필수적인 HTML 태그를 직접 입력하며 실시간으로 결과를 확인합니다. 각 태그가 화면에서 어떤 역할을 하는지 색상으로 구분해 보여줍니다.',
  lessons: [
    {
      id: 'html_01',
      title: 'table — 행·열 기본 구조',
      type: 'live-html',
      description: `HTML 테이블의 4가지 핵심 태그:

• <table> — 표 전체를 감싸는 컨테이너. border 속성으로 테두리 두께 지정
• <tr> (table row) — 가로 행(줄) 하나. tr 개수 = 행의 수
• <th> (table header) — 제목 셀. 기본값으로 굵게(bold) + 가운데 정렬
• <td> (table data) — 일반 데이터 셀

왼쪽 에디터를 수정하면 오른쪽 미리보기가 즉시 반영됩니다.
새로운 행(<tr>)이나 열(<td>/<th>)을 추가해보세요.`,
      annotations: [
        { tag: 'table', color: '#2563eb', label: 'table', description: '표 전체 컨테이너. border="1" 로 테두리 표시.' },
        { tag: 'tr',    color: '#16a34a', label: 'tr',    description: '가로 행(row). tr 개수 = 행의 수.' },
        { tag: 'th',    color: '#d97706', label: 'th',    description: '헤더 셀. 굵게 + 가운데 정렬이 기본.' },
        { tag: 'td',    color: '#dc2626', label: 'td',    description: '일반 데이터 셀.' },
      ],
      starterCode: `<table border="1">
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
      solution: `<!-- 행 추가: <tr>...</tr> 블록을 복사해서 붙여넣으면 됩니다 -->
<table border="1">
  <tr>
    <th>이름</th>
    <th>학과</th>
    <th>점수</th>
    <th>등급</th>
  </tr>
  <tr>
    <td>홍길동</td>
    <td>컴퓨터공학</td>
    <td>95</td>
    <td>A+</td>
  </tr>
  <tr>
    <td>김철수</td>
    <td>정보통신</td>
    <td>88</td>
    <td>B+</td>
  </tr>
  <tr>
    <td>이영희</td>
    <td>소프트웨어</td>
    <td>92</td>
    <td>A</td>
  </tr>
</table>`
    },
    {
      id: 'html_02',
      title: 'colspan · rowspan — 셀 병합',
      type: 'live-html',
      description: `셀을 여러 열·행에 걸쳐 합치는 속성:

• colspan="n" — 가로로 n칸 병합 (열 병합)
  예: <th colspan="2"> → 2개 열을 합침

• rowspan="n" — 세로로 n칸 병합 (행 병합)
  예: <td rowspan="3"> → 3개 행을 합침

주의: colspan으로 2칸을 합치면 같은 행에서 <td> 1개를 제거해야 합니다.
아래 예제에서 colspan/rowspan 숫자를 바꿔보세요.`,
      annotations: [
        { tag: 'table', color: '#2563eb', label: 'table', description: '표 전체 컨테이너.' },
        { tag: 'tr',    color: '#16a34a', label: 'tr',    description: '가로 행.' },
        { tag: 'th',    color: '#d97706', label: 'th',    description: '헤더 셀. colspan/rowspan 적용 가능.' },
        { tag: 'td',    color: '#dc2626', label: 'td',    description: '데이터 셀. colspan/rowspan 적용 가능.' },
      ],
      starterCode: `<table border="1" style="border-collapse:collapse;">

  <!-- [열 병합] 이름·연락처를 묶는 "기본정보" 헤더 -->
  <tr>
    <th colspan="2">기본정보</th>
    <th rowspan="2">등급</th>
  </tr>
  <tr>
    <th>이름</th>
    <th>연락처</th>
  </tr>

  <!-- 데이터 행 -->
  <tr>
    <td>홍길동</td>
    <td>010-1234-5678</td>
    <td>A</td>
  </tr>
  <tr>
    <td>김철수</td>
    <td>010-9876-5432</td>
    <td>B</td>
  </tr>

</table>`,
      solution: `<table border="1" style="border-collapse:collapse; text-align:center;">
  <tr>
    <th colspan="3">회원 목록</th>
  </tr>
  <tr>
    <th>이름</th>
    <th>연락처</th>
    <th>등급</th>
  </tr>
  <tr>
    <td rowspan="2">홍길동</td>
    <td>010-1234-5678</td>
    <td>A</td>
  </tr>
  <tr>
    <td>010-9999-0000 (직장)</td>
    <td>A</td>
  </tr>
</table>`
    },
    {
      id: 'html_03',
      title: 'form · input — 입력 폼',
      type: 'live-html',
      description: `폼 관련 핵심 태그:

• <form action="URL" method="post"> — 폼 전체 컨테이너
  - action: 데이터를 보낼 서버 URL (JSP에서는 action="sub1Action.jsp")
  - method: "get" (URL에 노출) / "post" (숨김, 보안)

• <input type="..."> — 단일 입력 필드
  - text: 일반 텍스트 입력
  - password: 비밀번호 (숨김 표시)
  - radio: 단일 선택 (같은 name끼리 그룹)
  - checkbox: 다중 선택
  - submit: 폼 전송 버튼
  - button: 일반 버튼

• <label> — 입력 필드 설명 레이블

input type을 바꿔가며 어떻게 달라지는지 확인해보세요.`,
      annotations: [
        { tag: 'form',  color: '#7c3aed', label: 'form',  description: '폼 컨테이너. action · method 필수.' },
        { tag: 'input', color: '#db2777', label: 'input', description: '입력 필드. type 속성으로 종류 결정.' },
        { tag: 'label', color: '#0891b2', label: 'label', description: '입력 필드 설명 레이블.' },
      ],
      starterCode: `<form action="sub1Action.jsp" method="post">

  <label>이름:</label>
  <input type="text" name="custname" placeholder="이름 입력"/>
  <br/><br/>

  <label>비밀번호:</label>
  <input type="password" name="pwd" placeholder="비밀번호"/>
  <br/><br/>

  <label>성별:</label>
  <input type="radio" name="gender" value="M"/> 남자
  <input type="radio" name="gender" value="F"/> 여자
  <br/><br/>

  <label>관심 분야:</label>
  <input type="checkbox" name="interest" value="web"/> 웹개발
  <input type="checkbox" name="interest" value="db"/> 데이터베이스
  <input type="checkbox" name="interest" value="ai"/> AI
  <br/><br/>

  <input type="submit" value="등록"/>
  <input type="button" value="취소" onclick="history.back()"/>

</form>`,
      solution: `<form action="sub1Action.jsp" method="post" name="frm">

  <label>이름:</label>
  <input type="text" name="custname" placeholder="이름 입력" required/>
  <br/><br/>

  <label>이메일:</label>
  <input type="text" name="email" placeholder="example@email.com"/>
  <br/><br/>

  <label>성별:</label>
  <input type="radio" name="gender" value="M" checked/> 남자
  <input type="radio" name="gender" value="F"/> 여자
  <br/><br/>

  <input type="submit" value="저장"/>
  <input type="reset" value="초기화"/>

</form>`
    },
    {
      id: 'html_04',
      title: 'select · option · textarea',
      type: 'live-html',
      description: `드롭다운과 여러 줄 입력:

• <select name="..."> — 드롭다운 목록
  - <option value="..."> — 각 선택지
  - selected 속성: 기본 선택값 지정

• <textarea name="..." rows="n" cols="n"> — 여러 줄 텍스트 입력
  - rows: 세로 줄 수
  - cols: 가로 글자 수 (또는 width:CSS로 제어)

option을 추가하거나 select의 size 속성을 줘보세요 (size="3" 이면 3개 항목이 보임).`,
      annotations: [
        { tag: 'select',   color: '#059669', label: 'select',   description: '드롭다운 선택 목록.' },
        { tag: 'option',   color: '#ea580c', label: 'option',   description: '선택지 항목. selected로 기본값 지정.' },
        { tag: 'textarea', color: '#7c3aed', label: 'textarea', description: '여러 줄 입력 필드.' },
      ],
      starterCode: `<form>

  <label>지역 선택:</label><br/>
  <select name="city">
    <option value="">-- 선택하세요 --</option>
    <option value="seoul">서울</option>
    <option value="busan" selected>부산</option>
    <option value="daegu">대구</option>
    <option value="incheon">인천</option>
  </select>
  <br/><br/>

  <label>등급 선택:</label><br/>
  <select name="grade" size="3">
    <option value="A">A 등급</option>
    <option value="B">B 등급</option>
    <option value="C">C 등급</option>
    <option value="D">D 등급</option>
  </select>
  <br/><br/>

  <label>비고:</label><br/>
  <textarea name="memo" rows="4" cols="40" placeholder="내용을 입력하세요..."></textarea>
  <br/><br/>

  <input type="submit" value="저장"/>

</form>`,
      solution: `<form>

  <label>지역 선택:</label><br/>
  <select name="city" style="width:200px; padding:4px;">
    <option value="">-- 선택하세요 --</option>
    <option value="seoul">서울</option>
    <option value="busan">부산</option>
    <option value="daegu">대구</option>
    <option value="incheon">인천</option>
    <option value="gwangju">광주</option>
    <option value="daejeon">대전</option>
  </select>
  <br/><br/>

  <label>메모:</label><br/>
  <textarea name="memo" rows="5" style="width:300px; resize:vertical;"
    placeholder="내용을 입력하세요..."></textarea>
  <br/><br/>

  <input type="submit" value="저장"/>&nbsp;
  <input type="reset" value="초기화"/>

</form>`
    },
    {
      id: 'html_05',
      title: 'table + form 조합 — JSP 등록 폼 패턴',
      type: 'live-html',
      description: `실기 시험에서 가장 많이 나오는 패턴: form > table 구조.

입력 폼을 테이블 레이아웃으로 정렬합니다.
• 왼쪽 <th> — 레이블 (이름, 연락처 등)
• 오른쪽 <td> — <input> 배치
• 마지막 행 <td colspan="2"> — 버튼을 가운데 배치

이 구조가 sub1.jsp(등록 폼)의 실제 구조입니다.`,
      annotations: [
        { tag: 'table', color: '#2563eb', label: 'table', description: '폼 레이아웃용 테이블.' },
        { tag: 'tr',    color: '#16a34a', label: 'tr',    description: '각 입력 항목 한 행.' },
        { tag: 'th',    color: '#d97706', label: 'th',    description: '항목 레이블 셀.' },
        { tag: 'td',    color: '#dc2626', label: 'td',    description: '입력 필드가 들어가는 셀.' },
        { tag: 'input', color: '#db2777', label: 'input', description: '실제 입력 필드.' },
      ],
      starterCode: `<form action="sub1Action.jsp" method="post" name="frm">
<table border="1" style="border-collapse:collapse; width:500px;">
  <tr>
    <th style="width:120px; padding:8px;">회원번호</th>
    <td style="padding:8px;">
      <input type="text" name="custno" value="101" readonly="readonly"/>
    </td>
  </tr>
  <tr>
    <th style="padding:8px;">이름</th>
    <td style="padding:8px;">
      <input type="text" name="custname" placeholder="이름 입력"/>
    </td>
  </tr>
  <tr>
    <th style="padding:8px;">연락처</th>
    <td style="padding:8px;">
      <input type="text" name="phone" placeholder="010-0000-0000"/>
    </td>
  </tr>
  <tr>
    <th style="padding:8px;">등급</th>
    <td style="padding:8px;">
      <select name="grade">
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="text-align:center; padding:8px;">
      <input type="button" value="등록" onclick="fnCheck()"/>
      <input type="button" value="목록" onclick="location.href='sub2.jsp'"/>
    </td>
  </tr>
</table>
</form>`,
      solution: `<form action="sub1Action.jsp" method="post" name="frm">
<table border="1" style="border-collapse:collapse; width:500px;">
  <tr>
    <th style="width:130px; padding:10px; background:#f0f0f0;">회원번호</th>
    <td style="padding:10px;">
      <input type="text" name="custno" value="101" readonly="readonly" style="background:#eee;"/>
    </td>
  </tr>
  <tr>
    <th style="padding:10px; background:#f0f0f0;">이름</th>
    <td style="padding:10px;">
      <input type="text" name="custname"/>
    </td>
  </tr>
  <tr>
    <th style="padding:10px; background:#f0f0f0;">연락처</th>
    <td style="padding:10px;">
      <input type="text" name="phone"/>
    </td>
  </tr>
  <tr>
    <th style="padding:10px; background:#f0f0f0;">주소</th>
    <td style="padding:10px;">
      <input type="text" name="address" size="40"/>
    </td>
  </tr>
  <tr>
    <th style="padding:10px; background:#f0f0f0;">등급</th>
    <td style="padding:10px;">
      <input type="text" name="grade"/>
    </td>
  </tr>
  <tr>
    <th style="padding:10px; background:#f0f0f0;">지역</th>
    <td style="padding:10px;">
      <select name="city">
        <option value="서울">서울</option>
        <option value="부산">부산</option>
        <option value="대구">대구</option>
      </select>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="text-align:center; padding:10px;">
      <input type="button" value="등록" onclick="fnCheck()"/>
      &nbsp;
      <input type="button" value="목록" onclick="location.href='sub2.jsp'"/>
    </td>
  </tr>
</table>
</form>`
    }
  ]
}
