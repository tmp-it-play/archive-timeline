document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('articleForm');
    const tagInput = document.getElementById('tagInput');
    const tagList = document.getElementById('tagList');
    const tagOptions = document.getElementById('tagOptions');
    const tags = new Set();
    const simplemde = new SimpleMDE({element: document.getElementById('content')});
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
        const title = document.getElementById('title').value.trim();
        const content = simplemde.value();
        const imageFile = document.getElementById('image').files[0];
        const tagString = Array.from(tags).join(',');
        if (!imageFile) {
            alert('이미지를 업로드해주세요.');
            return;
        }
        const imageBase64 = await toBase64(imageFile);
        const requestData = {
            title,
            content,
            tag: tagString,
            image: imageBase64
        };
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
});