export default {
  id: 'html',
  title: 'HTML 화면 구조',
  description: '정보처리산업기사 실기에서 화면 구현의 핵심인 HTML 태그를 학습합니다. table, form, input 등 주요 태그를 직접 작성해보세요.',
  lessons: [
    {
      id: 'html_01',
      title: '기본 테이블 구조 (table 태그)',
      description: `<table> 태그는 HTML에서 표를 만들 때 사용합니다.
- <table>: 표 전체를 감싸는 태그
- <tr> (table row): 행(가로줄)을 정의
- <th> (table header): 열 제목 셀 (굵게 표시, 가운데 정렬)
- <td> (table data): 일반 데이터 셀

아래 시작 코드를 완성하여 3×3 표를 만들어보세요.`,
      type: 'html',
      starterCode: `<table border="1">
  <tr>
    <th>이름</th>
    <th>나이</th>
    <th>학과</th>
  </tr>
  <tr>
    <td>홍길동</td>
    <td>20</td>
    <td>컴퓨터공학</td>
  </tr>
  <!-- 아래에 한 행 더 추가해보세요 -->
  <tr>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>`,
      solution: `<table border="1">
  <tr>
    <th>이름</th>
    <th>나이</th>
    <th>학과</th>
  </tr>
  <tr>
    <td>홍길동</td>
    <td>20</td>
    <td>컴퓨터공학</td>
  </tr>
  <tr>
    <td>김철수</td>
    <td>22</td>
    <td>정보통신</td>
  </tr>
</table>`
    },
    {
      id: 'html_02',
      title: '폼(Form) 만들기',
      description: `<form> 태그는 사용자 입력을 서버로 전송할 때 사용합니다.
- action: 데이터를 전송할 URL (JSP에서 Action 파일)
- method: 전송 방식 (GET / POST)
- <input type="text">: 텍스트 입력칸
- <input type="password">: 비밀번호 입력칸 (•로 가림)
- <input type="submit">: 전송 버튼

로그인 폼을 완성해보세요.`,
      type: 'html',
      starterCode: `<form action="loginAction.jsp" method="post">
  <table border="1">
    <tr>
      <th>아이디</th>
      <td><input type="text" name="userId" /></td>
    </tr>
    <tr>
      <th>비밀번호</th>
      <td><!-- 비밀번호 입력칸을 추가하세요 --></td>
    </tr>
    <tr>
      <td colspan="2">
        <!-- 로그인 버튼을 추가하세요 -->
      </td>
    </tr>
  </table>
</form>`,
      solution: `<form action="loginAction.jsp" method="post">
  <table border="1">
    <tr>
      <th>아이디</th>
      <td><input type="text" name="userId" /></td>
    </tr>
    <tr>
      <th>비밀번호</th>
      <td><input type="password" name="userPw" /></td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="submit" value="로그인" />
      </td>
    </tr>
  </table>
</form>`
    },
    {
      id: 'html_03',
      title: '셀 병합 (colspan, rowspan)',
      description: `표에서 셀을 병합할 수 있습니다.
- colspan="n": 가로 방향으로 n칸 병합
- rowspan="n": 세로 방향으로 n칸 병합

회원 정보 표에서 "주소" 셀을 colspan으로 병합해보세요.`,
      type: 'html',
      starterCode: `<table border="1">
  <tr>
    <th>이름</th>
    <td>홍길동</td>
    <th>나이</th>
    <td>25</td>
  </tr>
  <tr>
    <th>이메일</th>
    <td>hong@example.com</td>
    <th>전화</th>
    <td>010-1234-5678</td>
  </tr>
  <tr>
    <th>주소</th>
    <!-- colspan을 사용하여 나머지 3칸을 병합하세요 -->
    <td>서울시 강남구 역삼동</td>
  </tr>
</table>`,
      solution: `<table border="1">
  <tr>
    <th>이름</th>
    <td>홍길동</td>
    <th>나이</th>
    <td>25</td>
  </tr>
  <tr>
    <th>이메일</th>
    <td>hong@example.com</td>
    <th>전화</th>
    <td>010-1234-5678</td>
  </tr>
  <tr>
    <th>주소</th>
    <td colspan="3">서울시 강남구 역삼동</td>
  </tr>
</table>`
    },
    {
      id: 'html_04',
      title: '드롭다운과 라디오 버튼',
      description: `다양한 입력 타입을 활용합니다.
- <select>: 드롭다운 목록
- <option>: 선택 항목
- <input type="radio">: 라디오 버튼 (같은 name이면 하나만 선택)
- <input type="checkbox">: 체크박스

회원가입 폼을 완성해보세요.`,
      type: 'html',
      starterCode: `<form action="joinAction.jsp" method="post">
  <table border="1">
    <tr>
      <th>이름</th>
      <td><input type="text" name="name" /></td>
    </tr>
    <tr>
      <th>성별</th>
      <td>
        <input type="radio" name="gender" value="M" /> 남성
        <!-- 여성 라디오 버튼 추가 -->
      </td>
    </tr>
    <tr>
      <th>지역</th>
      <td>
        <!-- select 태그로 서울, 부산, 대구 옵션 추가 -->
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="submit" value="가입" />
      </td>
    </tr>
  </table>
</form>`,
      solution: `<form action="joinAction.jsp" method="post">
  <table border="1">
    <tr>
      <th>이름</th>
      <td><input type="text" name="name" /></td>
    </tr>
    <tr>
      <th>성별</th>
      <td>
        <input type="radio" name="gender" value="M" /> 남성
        <input type="radio" name="gender" value="F" /> 여성
      </td>
    </tr>
    <tr>
      <th>지역</th>
      <td>
        <select name="region">
          <option value="seoul">서울</option>
          <option value="busan">부산</option>
          <option value="daegu">대구</option>
        </select>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="submit" value="가입" />
      </td>
    </tr>
  </table>
</form>`
    }
  ]
}
