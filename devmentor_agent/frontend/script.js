// DevMentor Agent - Modern JavaScript with Markdown Support

class DevMentorChat {
    constructor() {
        this.ws = null;
        this.sessionId = this.generateSessionId();
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.messageHistory = [];

        this.initializeElements();
        this.setupEventListeners();
        this.setupMarkdown();
        this.connectWebSocket();
        this.updateWelcomeTime();
    }

    initializeElements() {
        this.elements = {
            chatMessages: document.getElementById('chat-messages'),
            messageInput: document.getElementById('message-input'),
            sendButton: document.getElementById('send-button'),
            connectionStatus: document.getElementById('connection-status'),
            statusDot: document.getElementById('status-dot'),
            sessionId: document.getElementById('session-id'),
            suggestedActions: document.getElementById('suggested-actions'),
            loadingSpinner: document.getElementById('loading-spinner')
        };
    }

    setupEventListeners() {
        // Send button click
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());

        // Enter key handling
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.elements.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // Window unload
        window.addEventListener('beforeunload', () => {
            if (this.ws) {
                this.ws.close();
            }
        });

        // Periodic connection check
        setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.CLOSED && !this.isConnecting) {
                console.log('연결 상태 확인: 끊어짐 감지, 재연결 시도');
                this.connectWebSocket();
            }
        }, 5000);
    }

    setupMarkdown() {
        // Configure marked for better rendering
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {}
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    updateWelcomeTime() {
        const welcomeTime = document.getElementById('welcome-time');
        if (welcomeTime) {
            welcomeTime.textContent = this.formatTime(new Date());
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    connectWebSocket() {
        if (this.isConnecting) return;
        this.isConnecting = true;

        this.updateConnectionStatus('연결 중...', 'connecting');

        // WebSocket URL 생성 개선
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host || 'localhost:8000';
        const wsUrl = `${protocol}//${host}/ws/${this.sessionId}`;

        console.log('WebSocket 연결 시도:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = (event) => {
            console.log('✅ WebSocket 연결 성공:', this.sessionId);
            this.updateConnectionStatus('연결됨', 'connected');
            this.elements.sessionId.textContent = this.sessionId;
            this.isConnecting = false;
            this.reconnectAttempts = 0;

            // 연결 성공 메시지 추가
            this.addBotMessage('🔗 서버에 연결되었습니다. 무엇을 도와드릴까요?');
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 메시지 수신:', data);

                // 라우터 정보가 있으면 함께 표시
                if (data.metadata && data.metadata.selected_agent) {
                    this.addBotMessageWithRouterInfo(data.response, data.metadata);
                } else {
                    this.addBotMessage(data.response);
                }

                this.updateSuggestedActions(data.suggested_actions || []);
                this.hideLoading();
            } catch (error) {
                console.error('❌ 메시지 파싱 오류:', error, '원본 데이터:', event.data);
                this.addBotMessage('응답을 처리하는 중 오류가 발생했습니다.');
                this.hideLoading();
            }
        };

        this.ws.onclose = (event) => {
            console.log('🔌 WebSocket 연결 종료:', {
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean
            });
            this.updateConnectionStatus('연결 끊김', 'disconnected');
            this.isConnecting = false;
            this.hideLoading();

            // 연결 종료 이유별 처리
            if (event.code === 1006) {
                console.log('서버가 예상치 못하게 종료되었습니다.');
            }

            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = Math.min(2000 * this.reconnectAttempts, 10000); // 최대 10초
                console.log(`🔄 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts} (${delay}ms 후)`);

                setTimeout(() => {
                    if (this.ws && this.ws.readyState === WebSocket.CLOSED) {
                        this.connectWebSocket();
                    }
                }, delay);
            } else {
                this.updateConnectionStatus('연결 실패', 'disconnected');
                this.addBotMessage('❌ 연결이 끊어졌습니다. 페이지를 새로고침해주세요.');
            }
        };

        this.ws.onerror = (error) => {
            console.error('❌ WebSocket 오류:', error);
            console.log('연결 시도한 URL:', wsUrl);
            this.updateConnectionStatus('연결 오류', 'disconnected');
            this.isConnecting = false;
            this.hideLoading();

            // 에러 상세 정보 표시
            this.addBotMessage('⚠️ 서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도됩니다.');
        };

        // 연결 타임아웃 설정 (10초)
        setTimeout(() => {
            if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
                console.log('⏰ WebSocket 연결 타임아웃');
                this.ws.close();
                this.updateConnectionStatus('연결 타임아웃', 'disconnected');
                this.isConnecting = false;
            }
        }, 10000);
    }

    updateConnectionStatus(status, type) {
        this.elements.connectionStatus.textContent = status;
        this.elements.statusDot.className = `status-dot ${type}`;
    }

    sendMessage(customMessage = null) {
        const message = customMessage || this.elements.messageInput.value.trim();

        if (!message) {
            this.elements.messageInput.focus();
            return;
        }

        if (this.ws.readyState === WebSocket.OPEN) {
            this.addUserMessage(message);
            this.showLoading();

            try {
                this.ws.send(JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                }));

                if (!customMessage) {
                    this.elements.messageInput.value = '';
                    this.autoResizeTextarea();
                }

                // Store message in history
                this.messageHistory.push({
                    type: 'user',
                    content: message,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('메시지 전송 오류:', error);
                this.addBotMessage('메시지 전송 중 오류가 발생했습니다.');
                this.hideLoading();
            }
        } else if (this.ws.readyState === WebSocket.CONNECTING) {
            this.addBotMessage('연결 중입니다. 잠시 후 다시 시도해주세요.');
        } else {
            this.addBotMessage('연결이 끊어졌습니다. 재연결을 시도합니다...');
            this.connectWebSocket();
        }
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement('user', message);
        this.elements.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messageElement = this.createMessageElement('bot', message);
        this.elements.chatMessages.appendChild(messageElement);
        this.scrollToBottom();

        // Store message in history
        this.messageHistory.push({
            type: 'bot',
            content: message,
            timestamp: new Date()
        });
    }

    addBotMessageWithRouterInfo(message, metadata = {}) {
        const messageElement = this.createMessageElement('bot', message, metadata);
        this.elements.chatMessages.appendChild(messageElement);
        this.scrollToBottom();

        // Store message in history
        this.messageHistory.push({
            type: 'bot',
            content: message,
            timestamp: new Date(),
            metadata: metadata
        });
    }

    createMessageElement(type, content, metadata = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        // 에이전트 타입에 따른 아바타 설정
        if (type === 'user') {
            avatar.innerHTML = '👤';
        } else if (metadata && metadata.selected_agent) {
            const agentEmojis = {
                'mentor': '🎓',
                'code_review': '🔍',
                'troubleshooting': '🔧'
            };
            avatar.innerHTML = agentEmojis[metadata.selected_agent] || '🤖';
        } else {
            avatar.innerHTML = '🤖';
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';

        const senderName = document.createElement('span');
        senderName.className = 'sender-name';

        // 에이전트 타입에 따른 이름 설정
        if (type === 'user') {
            senderName.textContent = '사용자';
        } else if (metadata && metadata.selected_agent) {
            const agentNames = {
                'mentor': '멘토 에이전트',
                'code_review': '코드 리뷰 에이전트',
                'troubleshooting': '트러블슈팅 에이전트'
            };
            senderName.textContent = agentNames[metadata.selected_agent] || 'DevMentor';
        } else {
            senderName.textContent = 'DevMentor';
        }

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = this.formatTime(new Date());

        messageHeader.appendChild(senderName);
        messageHeader.appendChild(timestamp);

        // 라우터 정보 표시 (봇 메시지에만)
        if (type === 'bot' && metadata && metadata.selected_agent) {
            const routerInfo = document.createElement('div');
            routerInfo.className = 'router-info';

            const confidenceBar = this.createConfidenceBar(metadata.agent_confidence);
            const reasonText = metadata.routing_reason || '자동 선택됨';

            routerInfo.innerHTML = `
                <div class="router-details">
                    <span class="router-label">🎯 AI 라우터:</span>
                    <span class="confidence-text">신뢰도 ${Math.round(metadata.agent_confidence * 100)}%</span>
                    ${confidenceBar}
                </div>
                <div class="router-reason">${reasonText}</div>
            `;

            messageHeader.appendChild(routerInfo);
        }

        const messageBody = document.createElement('div');
        messageBody.className = 'message-body';

        if (type === 'bot') {
            // Render markdown for bot messages
            messageBody.className += ' markdown-content';
            const sanitizedContent = DOMPurify.sanitize(marked.parse(content));
            messageBody.innerHTML = sanitizedContent;

            // Add copy buttons to code blocks
            this.addCopyButtonsToCodeBlocks(messageBody);
        } else {
            // Plain text for user messages
            messageBody.textContent = content;
        }

        messageContent.appendChild(messageHeader);
        messageContent.appendChild(messageBody);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        return messageDiv;
    }

    createConfidenceBar(confidence) {
        const percentage = Math.round(confidence * 100);
        let colorClass = 'low';

        if (percentage >= 80) colorClass = 'high';
        else if (percentage >= 60) colorClass = 'medium';

        return `
            <div class="confidence-bar">
                <div class="confidence-fill ${colorClass}" style="width: ${percentage}%"></div>
            </div>
        `;
    }

    addCopyButtonsToCodeBlocks(container) {
        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock, index) => {
            const pre = codeBlock.parentElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-container';

            pre.parentElement.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = '복사';
            copyButton.onclick = () => this.copyCodeToClipboard(codeBlock, copyButton);

            wrapper.appendChild(copyButton);
        });
    }

    copyCodeToClipboard(codeElement, button) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = '복사됨!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('복사 실패:', err);
            button.textContent = '복사 실패';
            setTimeout(() => {
                button.textContent = '복사';
            }, 2000);
        });
    }

    updateSuggestedActions(actions) {
        if (!actions || actions.length === 0) {
            this.elements.suggestedActions.innerHTML = '';
            return;
        }

        const actionsHtml = `
            <span class="actions-label">💡 제안된 액션:</span>
            ${actions.map(action => 
                `<button class="action-button" onclick="chat.sendMessage('${action.replace(/'/g, "\\'")}')">${action}</button>`
            ).join('')}
        `;

        this.elements.suggestedActions.innerHTML = actionsHtml;
    }

    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }

    showLoading() {
        this.elements.loadingSpinner.classList.add('show');
        this.elements.sendButton.disabled = true;
    }

    hideLoading() {
        this.elements.loadingSpinner.classList.remove('show');
        this.elements.sendButton.disabled = false;
    }

    clearChat() {
        if (confirm('대화 내역을 모두 지우시겠습니까?')) {
            const messages = this.elements.chatMessages.querySelectorAll('.message:not(:first-child)');
            messages.forEach(message => message.remove());
            this.messageHistory = [];
            this.elements.suggestedActions.innerHTML = '';
        }
    }

    reconnectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }
        this.reconnectAttempts = 0;
        this.connectWebSocket();
    }
}

// Global functions for HTML onclick handlers
let chat;

function sendMessage(message) {
    if (chat) {
        chat.sendMessage(message);
    }
}

function clearChat() {
    if (chat) {
        chat.clearChat();
    }
}

function reconnectWebSocket() {
    if (chat) {
        chat.reconnectWebSocket();
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    chat = new DevMentorChat();
    console.log('DevMentor Chat initialized');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevMentorChat;
}
