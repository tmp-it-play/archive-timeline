document.addEventListener('DOMContentLoaded', () => {
    const postDetail = document.getElementById('postDetail');
    const errorMessage = document.getElementById('errorMessage');
    const modeToggle = document.getElementById('modeToggle');

    // URL에서 글 ID 추출
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        showErrorMessage('잘못된 요청입니다. 글 ID가 없습니다.');
        return;
    }

    // API 호출하여 글 상세 정보 가져오기
    fetch(`/api/v1/article/${postId}`)
        .then(response => {
            if (!response.ok) throw new Error('글 정보를 가져오는 데 실패했습니다.');
            return response.json();
        })
        .then(data => renderPostDetail(data))
        .catch(error => {
            console.error('글 정보를 가져오는 중 오류 발생:', error);
            showErrorMessage('글 정보를 가져오는 데 실패했습니다.');
        });

    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        modeToggle.checked = true;
    }

    modeToggle.addEventListener('change', () => {
        if (modeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('mode', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('mode', 'light');
        }
    });

    function renderPostDetail(post) {
        postDetail.innerHTML = '';

        const titleEl = document.createElement('h1');
        titleEl.className = 'post-title';
        titleEl.textContent = post.title;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'post-image';
        if (post.imageUrl) {
            const img = document.createElement('img');
            img.src = post.imageUrl;
            img.alt = post.title;
            imageDiv.appendChild(img);
        }

        const metaEl = document.createElement('div');
        metaEl.className = 'post-meta';
        metaEl.textContent = `작성일: ${formatDate(post.createdAt)} • 조회수: ${post.viewCount}`;

        const contentEl = document.createElement('div');
        contentEl.className = 'post-content';
        contentEl.innerHTML = convertMarkdownToHTML(post.content);

        postDetail.appendChild(titleEl);
        postDetail.appendChild(imageDiv);
        postDetail.appendChild(metaEl);
        postDetail.appendChild(contentEl);
    }

    function convertMarkdownToHTML(markdown) {
        return markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n$/gim, '<br />');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function showErrorMessage(message) {
        postDetail.innerHTML = '';
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});