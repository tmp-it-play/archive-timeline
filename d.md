AI 기반 키워드 추천 기능 추가

다음과 같이 백엔드와 프론트엔드 전체 코드를 업데이트했습니다.

⸻

1. 백엔드

1.1 SearchController에 AI 추천 엔드포인트 추가

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {
    private final SearchService searchService;

    // 기존 메서드 생략...

    /**
     * AI 기반 키워드 추천 -> 연관 음식점 목록 반환
     */
    @GetMapping("/ai/recommend")
    public ResponseEntity<List<DbDataDto>> aiRecommend(
            @RequestParam("keywords") String keywords) {
        List<DbDataDto> recommendations = searchService.recommendByKeywords(keywords);
        return ResponseEntity.ok(recommendations);
    }
}

1.2 SearchService에 추천 로직 추가

@Service
@RequiredArgsConstructor
public class SearchService {
    private final DataJpaRepository dataRepo;

    /**
     * 키워드 기반 음식점 추천 (간단히 bizName, mainFood 매칭)
     */
    public List<DbDataDto> recommendByKeywords(String keywords) {
        // 1) 모든 데이터 조회
        List<DataJpaEntity> all = dataRepo.findAll();
        String[] keys = keywords.split("\\s+");
        // 2) 키워드 하나라도 포함된 항목 필터
        return all.stream()
            .filter(e -> {
                String text = e.getBizName() + " " + e.getMainFood();
                return Arrays.stream(keys).anyMatch(k -> text.contains(k));
            })
            .map(DbDataDto::fromEntity)
            .collect(Collectors.toList());
    }
}

1.3 DataJpaRepository 추가

public interface DataJpaRepository extends JpaRepository<DataJpaEntity, Long> {}



⸻

2. 프론트엔드

2.1 index.html (통합)

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>맛집 탐방</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body data-theme="light">
<header>
  <h1>맛집 탐방</h1>
  <div class="header-controls">
    <button id="theme-toggle">다크 모드</button>
    <div class="api-switch">
      <button data-api="search" class="api-btn active">일반</button>
      <button data-api="dbSearch" class="api-btn">DB</button>
      <button data-api="cross" class="api-btn">교차</button>
    </div>
  </div>
</header>
<main>
  <aside id="filter-panel" class="filter-closed">
    <h3>검색 필터</h3>
    <input type="text" id="filter-keywords" placeholder="키워드 입력...">
    <button id="ai-recommend-btn">AI 추천</button>
    <div class="field">
      <label>카테고리</label>
      <select id="filter-category"><option value="">전체</option></select>
    </div>
    <div class="field">
      <label>최소 평점</label>
      <input type="number" id="filter-rating-min" min="0" max="5" step="0.1">
    </div>
    <button id="apply-filters">적용</button>
    <button id="toggle-filter" class="close-btn">✕</button>
  </aside>

  <section class="search-area">
    <div class="search-bar">
      <input type="text" id="search-query" placeholder="검색어 입력...">
      <button id="search-btn">검색</button>
      <button id="toggle-filter" class="open-btn">🔍 필터</button>
    </div>
    <div id="results" class="results"></div>
  </section>
</main>
<script src="/js/script.js"></script>
</body>
</html>

2.2 script.js

const panel = document.getElementById('filter-panel');
const toggleBtns = document.querySelectorAll('#toggle-filter');
const results = document.getElementById('results');
const apiButtons = document.querySelectorAll('.api-btn');
let currentApi = 'search';
let lastData = [];

// 모드 전환
apiButtons.forEach(btn => btn.onclick = () => {
  apiButtons.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentApi = btn.dataset.api;
});

// 테마
document.getElementById('theme-toggle').onclick = () => {
  const d = document.body.dataset.theme =
    document.body.dataset.theme==='light'?'dark':'light';
  document.getElementById('theme-toggle').textContent =
    d==='dark'?'라이트 모드':'다크 모드';
};

// 필터 패널 열기/닫기
toggleBtns.forEach(b=>b.onclick = ()=>{
  panel.classList.toggle('filter-closed');
});

// 데이터 렌더링
function renderList(data) {
  results.innerHTML = data.length
    ? data.map(item => `<div class="card">
        <h3>${item.bizName || item.title}</h3>
        <p>${item.roadAddr||item.readAddress||''}</p>
        <p>평점: ${item.naverRating?.toFixed(1)||'-'}</p>
      </div>`).join('')
    : '<p>검색 결과 없음</p>';
}

// 그룹 렌더링 (카테고리별)
function applyFilters() {
  let filtered = [...lastData];
  const cat = document.getElementById('filter-category').value;
  const minR = parseFloat(document.getElementById('filter-rating-min').value)||0;
  if(cat) filtered = filtered.filter(x=>x.foodType===cat||x.category===cat);
  filtered = filtered.filter(x=>!x.naverRating||x.naverRating>=minR);
  renderList(filtered);
}

// 검색
document.getElementById('search-btn').onclick = () => {
  const q = document.getElementById('search-query').value.trim();
  if(!q) return alert('검색어를 입력하세요.');
  const urlMap = {
    search: `/api/v1/search/search?query=${encodeURIComponent(q)}`,
    dbSearch: `/api/v1/search/db/search?query=${encodeURIComponent(q)}`,
    cross: `/api/v1/search/cross/search?query=${encodeURIComponent(q)}`
  };
  results.innerHTML = '<p>검색 중...</p>';
  fetch(urlMap[currentApi])
    .then(r=>r.json()).then(data=>{
      lastData = data;
      // 카테고리 채우기
      const cats = [...new Set(data.map(x=>x.foodType||x.category))];
      const sel = document.getElementById('filter-category');
      sel.innerHTML = `<option value="">전체</option>`+
        cats.map(c=>`<option>${c}</option>`).join('');
      applyFilters();
    });
};

// AI 추천
document.getElementById('ai-recommend-btn').onclick = () => {
  const kw = document.getElementById('filter-keywords').value.trim();
  if(!kw) return alert('키워드를 입력하세요.');
  fetch(`/api/v1/search/ai/recommend?keywords=${encodeURIComponent(kw)}`)
    .then(r=>r.json()).then(data=>{
      lastData = data;
      panel.classList.add('filter-closed');
      renderList(data);
    });
};

// 필터 적용
document.getElementById('apply-filters').onclick = applyFilters;

2.3 style.css

body { margin:0; font-family: sans-serif; }
header { display:flex; justify-content:space-between; align-items:center; padding:1rem; background:#fff; }
.header-controls { display:flex; gap:1rem; }
.api-btn { padding:0.5rem 1rem; border:none; background:#eee; cursor:pointer; }
.api-btn.active { background:#333; color:#fff; }
#theme-toggle { padding:0.5rem; }
main { display:flex; height:calc(100vh - 68px); }
aside {
  width:300px; max-width:80%; background:#f9f9f9;
  padding:1rem; position:relative;
  transition:transform .3s;
}
.filter-closed { transform:translateX(-100%); }
.filter-closed + .search-area { flex:1; }
.search-area { flex:1; padding:1rem; overflow:auto; }
.search-bar { display:flex; gap:0.5rem; margin-bottom:1rem; }
.search-bar input { flex:1; padding:0.5rem; }
.search-bar button { padding:0.5rem 1rem; }
.card { background:#fff; margin-bottom:1rem; padding:1rem; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1); }
.close-btn, .open-btn { position:absolute; top:8px; right:8px; background:none; border:none; cursor:pointer; }



⸻

위 변경사항으로 AI 추천 키워드 입력 → 엔티티 필드 분석 → 추천 음식점 목록이 결과 영역에 노출됩니다. UI/UX도 리얼타임 슬라이드 사이드바 형태로 개선했습니다.