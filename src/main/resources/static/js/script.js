const themeToggle = document.getElementById('theme-toggle');
const bodyEl = document.body;
const filterToggle = document.getElementById('filter-toggle');
const filterPanel = document.getElementById('filter-panel');
const modeBtns = document.querySelectorAll('.mode-btn');
let currentMode = 'search';
const resultsEl = document.getElementById('results');
let allData = [];

// 테마 토글
themeToggle.addEventListener('click', () => {
    const next = bodyEl.dataset.theme === 'light' ? 'dark' : 'light';
    bodyEl.dataset.theme = next;
    themeToggle.textContent = next === 'light' ? '🌙' : '🌞';
});

// 필터 패널 토글
filterToggle.addEventListener('click', () => filterPanel.classList.toggle('open'));

// 모드 토글
modeBtns.forEach(btn => btn.addEventListener('click', () => {
    modeBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
}));

// 검색
async function doSearch() {
    const q = document.getElementById('search-query').value.trim();
    if(!q) return alert('검색어를 입력하세요.');
    resultsEl.innerHTML = '<p>검색 중...</p>';
    try {
        if(currentMode === 'search') {
            // 로컬 + 이미지 API
            const [locRes, imgRes] = await Promise.all([
                fetch(`/api/v1/search/local?query=${encodeURIComponent(q)}`).then(r=>r.json()),
                fetch(`/api/v1/search/image?query=${encodeURIComponent(q)}`).then(r=>r.json())
            ]);
            allData = locRes.items.map((it,i)=>({
                title: it.title, category: it.category,
                address: it.address, readAddress: it.roadAddress,
                homePageLink: it.link,
                imageLinks: [imgRes.items[i]?.thumbnail]
            }));
        } else {
            // DB or 교차 (DB endpoint)
            const url = currentMode==='dbSearch'
                ? `/api/v1/search/db/search?query=${encodeURIComponent(q)}`
                : `/api/v1/search/cross/search?query=${encodeURIComponent(q)}`;
            allData = await fetch(url).then(r=>r.json());
        }
        renderResults();
    } catch(e) {
        console.error(e);
        resultsEl.innerHTML = '<p>오류 발생</p>';
    }
}

document.getElementById('search-btn').addEventListener('click', doSearch);
