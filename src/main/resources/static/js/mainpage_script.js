// mainpage_script.js

// 서버에서 글 목록 가져오기
let posts = [];
let uniqueTags = [];

// DOM 요소 캐싱
document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('postList');
    const tagList = document.getElementById('tagList');
    const searchInput = document.getElementById('searchInput');
    const modeToggle = document.getElementById('modeToggle');
    const errorMessage = document.getElementById('errorMessage');

    let selectedTags = [];

    fetch('/api/v1/articles')
        .then(response => response.json())
        .then(data => {
            posts = data;
            // 서버에서 받은 posts를 바탕으로 태그 추출
            uniqueTags = [...new Set(posts.map(post => post.tag))];

            renderTags(uniqueTags);
            renderPosts(posts);
        })
        .catch(error => {
            console.error('글 목록을 가져오는 중 오류 발생:', error);
            showErrorMessage('글 목록을 가져오는 중 오류가 발생했습니다.');
        });

    // 모드 상태 로드
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        modeToggle.checked = true;
    }

    // 태그 렌더링 함수
    function renderTags(tags) {
        tagList.innerHTML = '';
        tags.forEach(tag => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = tag;
            button.className = 'tag-button';
            button.addEventListener('click', () => toggleTagSelection(button, tag));
            li.appendChild(button);
            tagList.appendChild(li);
        });
    }

    // 태그 선택/해제 함수
    function toggleTagSelection(button, tag) {
        if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter(t => t !== tag);
            button.classList.remove('active');
        } else {
            selectedTags.push(tag);
            button.classList.add('active');
        }
        filterPosts();
    }

    // 글 렌더링 함수
    function renderPosts(filteredPosts) {
        postList.innerHTML = '';
        errorMessage.style.display = 'none';

        if (filteredPosts.length === 0) {
            showErrorMessage('조건에 맞는 글이 없습니다.');
            return;
        }

        filteredPosts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post-item';
            div.textContent = post.title;
            div.addEventListener('click', () => openPost(post.id));
            postList.appendChild(div);
        });
    }

    // 오류 메시지 표시 함수
    function showErrorMessage(message) {
        postList.innerHTML = '';
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // 검색 및 태그 필터링 함수
    function filterPosts() {
        const query = searchInput.value.toLowerCase();
        let filtered = posts;

        // 검색어 필터링
        if (query) {
            filtered = filtered.filter(post => post.title.toLowerCase().includes(query));
        }

        // 태그 필터링 (선택된 태그 중 하나라도 매치되면 표시)
        if (selectedTags.length > 0) {
            filtered = filtered.filter(post => selectedTags.includes(post.tag));
        }

        renderPosts(filtered);
    }

    // 검색 이벤트
    searchInput.addEventListener('input', filterPosts);

    // 글 상세 페이지로 이동
    function openPost(id) {
        window.location.href = `/post.html?id=${id}`;
    }

    // 모드 전환 스위치 기능
    modeToggle.addEventListener('change', () => {
        if (modeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('mode', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('mode', 'light');
        }
    });
});
