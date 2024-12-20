document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('postList');
    const tagList = document.getElementById('tagList');
    const searchInput = document.getElementById('searchInput');
    const modeToggle = document.getElementById('modeToggle');
    const sortSelect = document.getElementById('sortSelect');
    const errorMessage = document.getElementById('errorMessage');

    let selectedTags = [];
    let posts = [];

    fetch('/api/v1/articles')
        .then(response => response.json())
        .then(data => {
            posts = data;
            const uniqueTags = [...new Set(posts.map(post => post.tag))];
            renderTags(uniqueTags);
            renderPosts(posts);
        })
        .catch(error => {
            console.error('글 목록을 가져오는 중 오류 발생:', error);
            showErrorMessage('글 목록을 가져오는 중 오류가 발생했습니다.');
        });

    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        const sortedPosts = [...posts].sort(sortFunctions[sortBy]);
        renderPosts(sortedPosts);
    });

    const sortFunctions = {
        newest: (a, b) => b.id - a.id,
        oldest: (a, b) => a.id - b.id,
        views: (a, b) => b.viewCount - a.viewCount,
    };

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

    function renderPosts(filteredPosts) {
        postList.innerHTML = '';
        errorMessage.style.display = 'none';

        if (filteredPosts.length === 0) {
            showErrorMessage('조건에 맞는 글이 없습니다.');
            return;
        }

        filteredPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';

            const imageDiv = document.createElement('div');
            imageDiv.className = 'post-image';
            if (post.imageUrl) {
                const img = document.createElement('img');
                img.src = post.imageUrl;
                img.alt = post.title;
                imageDiv.appendChild(img);
            }

            const contentDiv = document.createElement('div');
            contentDiv.className = 'post-content';

            const titleEl = document.createElement('h3');
            titleEl.className = 'post-title';
            titleEl.textContent = post.title;

            const contentEl = document.createElement('p');
            contentEl.className = 'post-excerpt';
            contentEl.textContent = truncateContent(stripMarkdown(post.content));

            const metaEl = document.createElement('div');
            metaEl.className = 'post-meta';
            metaEl.textContent = `${formatDate(post.createdAt)} • 조회수: ${post.viewCount}`;

            contentDiv.appendChild(titleEl);
            contentDiv.appendChild(contentEl);
            contentDiv.appendChild(metaEl);

            postDiv.appendChild(imageDiv);
            postDiv.appendChild(contentDiv);

            postDiv.addEventListener('click', () => openPost(post.id));
            postList.appendChild(postDiv);
        });
    }

    function truncateContent(content, maxLength = 100) {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }

    function stripMarkdown(markdown) {
        return markdown
            .replace(/[#_*~`>\-]+/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .trim();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function showErrorMessage(message) {
        postList.innerHTML = '';
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function filterPosts() {
        const query = searchInput.value.toLowerCase();
        let filtered = posts;
        if (query) {
            filtered = filtered.filter(post => post.title.toLowerCase().includes(query));
        }
        if (selectedTags.length > 0) {
            filtered = filtered.filter(post => selectedTags.includes(post.tag));
        }
        renderPosts(filtered);
    }

    searchInput.addEventListener('input', filterPosts);
    function openPost(id) {
        fetch(`/api/v1/articles/${id}/view`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        }).catch(error => {
            console.warn('조회수 증가 요청 중 오류 발생:', error);
        });
        window.location.href = `/post?id=${id}`;
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
});
