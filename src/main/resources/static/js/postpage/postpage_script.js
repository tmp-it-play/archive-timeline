document.addEventListener('DOMContentLoaded', () => {
    const postDetail = document.getElementById('postDetail');
    const errorMessage = document.getElementById('errorMessage');
    const modeToggle = document.getElementById('modeToggle');
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) return showErrorMessage('잘못된 요청입니다. 글 ID가 없습니다.');
    fetch(`/api/v1/articles/${postId}`)
        .then(res => res.ok ? res.json() : Promise.reject('글 정보를 가져오는 데 실패했습니다.'))
        .then(renderPostDetail)
        .catch(error => showErrorMessage(error));
    if (localStorage.getItem('mode') === 'dark') {
        applyDarkMode();
        modeToggle.checked = true;
    }
    modeToggle.addEventListener('change', () => {
        if (modeToggle.checked) {
            applyDarkMode();
            localStorage.setItem('mode', 'dark');
        } else {
            removeDarkMode();
            localStorage.setItem('mode', 'light');
        }
    });

    function applyDarkMode() {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#333';
    }

    function removeDarkMode() {
        document.body.classList.remove('dark-mode');
        document.body.style.backgroundColor = 'white';
    }

    function renderPostDetail(post) {
        postDetail.innerHTML = `
            <h1 class="post-title">${post.title}</h1>
            <div class="post-image">${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}</div>
            <div class="post-meta">작성일: ${formatDate(post.createdAt)} • 조회수: ${post.viewCount}</div>
            <div class="post-content">${marked.parse(post.content)}</div>
        `;
        hljs.highlightAll();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});