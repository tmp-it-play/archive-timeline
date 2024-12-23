document.addEventListener('DOMContentLoaded', () => {
    let darkMode = localStorage.getItem('mode') === 'dark';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    const form = document.getElementById('articleForm');
    const tagInput = document.getElementById('tagInput');
    const tagList = document.getElementById('tagList');
    const tagOptions = document.getElementById('tagOptions');
    const modeToggle = document.getElementById('modeToggle');
    const pageTitle = document.getElementById('pageTitle');
    const titleInput = document.getElementById('title');
    const imageInput = document.getElementById('image');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const tags = new Set();
    const fileNameDisplay = document.createElement('div');
    fileNameDisplay.className = 'file-name-display';
    imagePreviewContainer.appendChild(fileNameDisplay);
    const simplemde = new SimpleMDE({
        element: document.getElementById('content'),
        spellChecker: false,
        renderingConfig: {
            codeSyntaxHighlighting: true
        }
    });
    fetch('/api/v1/articles/tags')
        .then(response => response.json())
        .then(data => {
            const existingTags = data.tags.split(',').map(tag => tag.trim());
            renderTagOptions(existingTags);
        })
        .catch(error => console.error('태그 로드 중 오류 발생:', error));
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && tagInput.value.trim() !== '') {
            e.preventDefault();
            const inputTags = tagInput.value.split(/\s+/);
            inputTags.forEach(tag => {
                const sanitizedTag = sanitizeTag(tag);
                if (sanitizedTag) addTag(sanitizedTag);
            });
            tagInput.value = '';
        }
    });

    function sanitizeTag(tag) {
        const cleanedTag = tag.replace(/[^a-zA-Z0-9가-힣]/g, '');
        return cleanedTag ? (cleanedTag.startsWith('#') ? cleanedTag : `#${cleanedTag}`) : null;
    }

    function addTag(tag) {
        if (tags.has(tag)) return;
        tags.add(tag);
        const tagEl = document.createElement('div');
        tagEl.className = 'tag';
        tagEl.textContent = tag;
        const removeEl = document.createElement('span');
        removeEl.textContent = '✕';
        removeEl.className = 'remove-tag';
        removeEl.addEventListener('click', () => {
            tags.delete(tag);
            tagEl.remove();
        });
        tagEl.appendChild(removeEl);
        tagList.appendChild(tagEl);
    }

    function renderTagOptions(existingTags) {
        existingTags.forEach(tag => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tag-button';
            button.textContent = tag;
            button.addEventListener('click', () => addTag(tag));
            tagOptions.appendChild(button);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const content = simplemde.value();
        const imageFile = imageInput.files[0];
        const tagString = Array.from(tags).join(',');
        if (!imageFile) {
            alert('이미지를 업로드해주세요.');
            return;
        }
        const imageBase64 = await toBase64(imageFile);
        const requestData = {title, content, tag: tagString, image: imageBase64};

        fetch('/api/v1/articles', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) throw new Error('글 작성 실패');
                return response.json();
            })
            .then(data => {
                alert('글 작성이 완료되었습니다.');
                window.location.href = `/post?id=${data.id}`;
            })
            .catch(error => {
                console.error(error);
                alert('글 작성 중 오류가 발생했습니다.');
            });
    });

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const sanitizedFileName = sanitizeFileName(file.name);
            fileNameDisplay.textContent = `업로드된 파일: ${sanitizedFileName}`;
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                imagePreviewContainer.style.position = 'relative'; // 크기 조절을 위한 설정
                addResizeHandles(imagePreview); // 핸들 추가
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = '';
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    });

    function sanitizeFileName(fileName) {
        return fileName.replace(/[<>:"\/\\|?*]+/g, '_');
    }

    function addResizeHandles(image) {
        const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        handles.forEach((position) => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            imagePreviewContainer.appendChild(handle);
            handle.addEventListener('mousedown', startResizing);
        });

        function startResizing(e) {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = image.offsetWidth;
            const startHeight = image.offsetHeight;

            function resize(e) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                if (e.target.classList.contains('top-left')) {
                    image.style.width = `${startWidth - deltaX}px`;
                    image.style.height = `${startHeight - deltaY}px`;
                } else if (e.target.classList.contains('top-right')) {
                    image.style.width = `${startWidth + deltaX}px`;
                    image.style.height = `${startHeight - deltaY}px`;
                } else if (e.target.classList.contains('bottom-left')) {
                    image.style.width = `${startWidth - deltaX}px`;
                    image.style.height = `${startHeight + deltaY}px`;
                } else if (e.target.classList.contains('bottom-right')) {
                    image.style.width = `${startWidth + deltaX}px`;
                    image.style.height = `${startHeight + deltaY}px`;
                }
            }

            function stopResizing() {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResizing);
            }

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResizing);
        }
    }

    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'dark') {
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
        const wrapper = simplemde.codemirror.getWrapperElement();
        const lines = wrapper.querySelectorAll('.CodeMirror-line');
        wrapper.style.backgroundColor = '#333';
        wrapper.style.color = '#fff';
        lines.forEach(line => {
            line.style.color = '#fff';
        });
        pageTitle.style.color = '#fff';
        document.body.style.backgroundColor = '#222';
    }

    function removeDarkMode() {
        document.body.classList.remove('dark-mode');
        const wrapper = simplemde.codemirror.getWrapperElement();
        const lines = wrapper.querySelectorAll('.CodeMirror-line');
        wrapper.style.backgroundColor = '#fff';
        wrapper.style.color = '#000';
        lines.forEach(line => {
            line.style.color = '#000';
        });
        pageTitle.style.color = '#000';
        document.body.style.backgroundColor = '#f9f9f9';
    }

    titleInput.addEventListener('input', () => {
        pageTitle.textContent = titleInput.value.trim() || '글 작성';
    });
});