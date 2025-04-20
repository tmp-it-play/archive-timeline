const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '라이트 모드 전환';
    } else {
        body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '다크 모드 전환';
    }
});

const apiButtons = document.querySelectorAll('.api-btn');
let currentApi = 'search';
apiButtons.forEach(btn => btn.addEventListener('click', () => {
    apiButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentApi = btn.dataset.api;
    document.getElementById('category-filter').disabled = false;
}));

const resultsContainer = document.getElementById('results');
let lastData = [];

function populateCategoryFilter(data, apiType) {
    const filter = document.getElementById('category-filter');
    let categories = [];
    if (apiType === 'search' || apiType === 'cross') {
        categories = Array.from(new Set(data.map(item => item.category)));
    } else if (apiType === 'dbSearch') {
        categories = Array.from(new Set(data.map(item => item.foodType)));
    }
    categories.sort();
    filter.innerHTML = '<option value="">전체 카테고리</option>';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        filter.appendChild(opt);
    });
}

function renderGrouped(data, key, renderer) {
    const sel = document.getElementById('category-filter').value;
    const filtered = sel ? data.filter(d => d[key] === sel) : data;
    resultsContainer.innerHTML = '';
    if (!filtered.length) {
        resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
    }
    const grouped = filtered.reduce((a, i) => ((a[i[key]] = a[i[key]] || []).push(i), a), {});
    Object.keys(grouped).sort().forEach(cat => {
        const sec = document.createElement('div');
        sec.className = 'category-section';
        const h2 = document.createElement('h2');
        h2.textContent = cat;
        sec.appendChild(h2);
        const wrap = document.createElement('div');
        wrap.className = 'results-container';
        grouped[cat].forEach(it => wrap.appendChild(renderer(it)));
        sec.appendChild(wrap);
        resultsContainer.appendChild(sec);
    });
}

function renderSearchCard(item) {
    const card = document.createElement('div');
    card.className = 'result-card';
    if (item.imageLinks && item.imageLinks.length) {
        const img = document.createElement('img');
        img.src = item.imageLinks[0];
        img.alt = item.title;
        img.className = 'result-image';
        card.appendChild(img);
    }
    const t = document.createElement('h3');
    t.textContent = item.title;
    card.appendChild(t);
    [['카테고리', item.category], ['주소', item.address], ['도로명', item.readAddress]].forEach(([lab, val]) => {
        if (val) {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${lab}:</strong> ${val}`;
            card.appendChild(p);
        }
    });
    if (item.homePageLink) {
        const a = document.createElement('a');
        a.href = item.homePageLink;
        a.target = '_blank';
        a.textContent = '홈페이지 방문';
        card.appendChild(a);
    }
    return card;
}

function renderDbCard(item) {
    const card = document.createElement('div');
    card.className = 'result-card';
    const t = document.createElement('h3');
    t.textContent = item.bizName;
    card.appendChild(t);
    [['ID', item.id], ['인허가 번호', item.permitNo], ['주소', item.roadAddr], ['대표 음식', item.mainFood]].forEach(([lab, val]) => {
        if (val) {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${lab}:</strong> ${val}`;
            card.appendChild(p);
        }
    });
    return card;
}

document.getElementById('search-btn').addEventListener('click', () => {
    const q = document.getElementById('search-query').value.trim();
    if (!q) return alert('검색어를 입력하세요.');
    let url = '';
    if (currentApi === 'search') url = `/api/v1/search/search?query=${encodeURIComponent(q)}`;
    else if (currentApi === 'dbSearch') url = `/api/v1/search/db/search?query=${encodeURIComponent(q)}`;
    else if (currentApi === 'cross') url = `/api/v1/search/cross/search?query=${encodeURIComponent(q)}`;
    resultsContainer.innerHTML = '<p>검색 중...</p>';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            lastData = data;
            populateCategoryFilter(data, currentApi);
            document.getElementById('category-filter').onchange = () => {
                if (currentApi === 'dbSearch') renderGrouped(lastData, 'foodType', renderDbCard);
                else renderGrouped(lastData, 'category', renderSearchCard);
            };
            if (currentApi === 'dbSearch') renderGrouped(data, 'foodType', renderDbCard);
            else renderGrouped(data, 'category', renderSearchCard);
        })
        .catch(err => {
            console.error(err);
            resultsContainer.innerHTML = '<p>검색 결과를 불러오는데 오류가 발생했습니다.</p>';
        });
});