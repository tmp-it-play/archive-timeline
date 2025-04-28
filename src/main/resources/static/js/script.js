document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        if (body.dataset.theme === 'light') {
            body.dataset.theme = 'dark';
            themeToggle.textContent = '라이트 모드 전환';
        } else {
            body.dataset.theme = 'light';
            themeToggle.textContent = '다크 모드 전환';
        }
    });

    // API Mode 토글
    const apiButtons = document.querySelectorAll('.api-btn');
    let currentApi = 'search';
    apiButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            apiButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentApi = btn.dataset.api;
            document.getElementById('category-filter').disabled = false;
        });
    });

    // 필터 패널 & 오버레이
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel  = document.getElementById('filter-panel');
    const overlay      = document.getElementById('overlay');
    filterToggle.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        overlay.classList.toggle('visible');
    });
    overlay.addEventListener('click', () => {
        filterPanel.classList.remove('open');
        overlay.classList.remove('visible');
    });

    // 검색 & 렌더링
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results');
    let lastData = [];

    searchBtn.addEventListener('click', () => {
        const q = document.getElementById('search-query').value.trim();
        if (!q) return alert('검색어를 입력하세요.');
        let url;
        if (currentApi === 'search')     url = `/api/v1/search/search?query=${encodeURIComponent(q)}`;
        else if (currentApi === 'dbSearch') url = `/api/v1/search/db/search?query=${encodeURIComponent(q)}`;
        else                              url = `/api/v1/search/cross/search?query=${encodeURIComponent(q)}`;

        resultsContainer.innerHTML = '<p>검색 중…</p>';
        fetch(url)
            .then(res => res.json())
            .then(data => {
                lastData = data;
                populateCategoryFilter(data);
                // 필터 변경 시 재렌더
                ['category-filter','filter-category','filter-rating-min'].forEach(id => {
                    document.getElementById(id).onchange = () => renderResults();
                });
                renderResults();
            })
            .catch(err => {
                console.error(err);
                resultsContainer.innerHTML = '<p>검색 결과를 불러오는데 오류가 발생했습니다.</p>';
            });
    });

    function populateCategoryFilter(data) {
        const catMain = document.getElementById('category-filter');
        const catPanel= document.getElementById('filter-category');
        let cats = Array.from(new Set(
            lastData.map(item => item.category || item.foodType || '')
        )).filter(x => x).sort();
        catMain.innerHTML = '<option value="">전체 카테고리</option>';
        catPanel.innerHTML = '<option value="">전체</option>';
        cats.forEach(c => {
            [catMain, catPanel].forEach(sel => {
                const o = document.createElement('option');
                o.value = c; o.textContent = c;
                sel.appendChild(o);
            });
        });
    }

    function renderResults() {
        const selCat   = document.getElementById('category-filter').value;
        const selCat2  = document.getElementById('filter-category').value;
        const minRate  = parseFloat(document.getElementById('filter-rating-min').value) || 0;
        let items = lastData.slice();
        // 카테고리 필터링
        if (selCat)  items = items.filter(i => (i.category||i.foodType) === selCat);
        if (selCat2) items = items.filter(i => (i.category||i.foodType) === selCat2);
        // 평점 필터링 (DB 검색에서만 평점이 있음)
        if (minRate) items = items.filter(i => i.naverRating != null && i.naverRating >= minRate);

        if (!items.length) {
            return resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
        }
        // 그룹별 렌더
        const key = currentApi === 'dbSearch' ? 'foodType' : 'category';
        const grouped = items.reduce((a,i)=> {
            const k = i[key]||'기타';
            (a[k]||(a[k]=[])).push(i);
            return a;
        }, {});
        resultsContainer.innerHTML = '';
        Object.keys(grouped).sort().forEach(cat => {
            const sec = document.createElement('section');
            sec.className = 'category-section';
            sec.innerHTML = `<h2>${cat}</h2><div class="results-container"></div>`;
            grouped[cat].forEach(item => {
                const renderer = currentApi==='dbSearch' ? renderDbCard : renderSearchCard;
                sec.querySelector('.results-container').appendChild(renderer(item));
            });
            resultsContainer.appendChild(sec);
        });
    }

    // 카드 렌더러들
    function renderSearchCard(item) {
        const c = document.createElement('div'); c.className = 'result-card';
        if (item.imageLinks?.length) {
            const img = document.createElement('img');
            img.src = item.imageLinks[0];
            c.appendChild(img);
        }
        c.innerHTML += `<h3>${item.title}</h3>`;
        [['주소', item.address], ['도로명', item.readAddress]].forEach(([l,v]) => {
            if (v) c.innerHTML += `<p><strong>${l}:</strong> ${v}</p>`;
        });
        if (item.homePageLink) {
            c.innerHTML += `<a href="${item.homePageLink}" target="_blank">홈페이지 방문</a>`;
        }
        return c;
    }

    function renderDbCard(item) {
        const c = document.createElement('div'); c.className = 'result-card';
        c.innerHTML = `<h3>${item.bizName}</h3>`;
        [
            ['ID', item.id],
            ['인허가 번호', item.permitNo],
            ['대표 음식', item.mainFood],
            ['네이버 평점', item.naverRating != null ? item.naverRating.toFixed(1)+' ⭐️' : '정보 없음']
        ].forEach(([l,v]) => {
            if (v != null) c.innerHTML += `<p><strong>${l}:</strong> ${v}</p>`;
        });
        return c;
    }

});