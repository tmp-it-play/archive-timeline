

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import uuid
import asyncio
import logging

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.mentor_service import MentorService
from app.models.schemas import UserProfile, SkillLevel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DevMentor Agent",
    description="개발자 멘토링 AI 에이전트 - ACE Agent 기반",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mentor_service = MentorService()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        logger.info(f"WebSocket 연결: {session_id}")

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            logger.info(f"WebSocket 연결 해제: {session_id}")

    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            websocket = self.active_connections[session_id]
            await websocket.send_text(json.dumps(message, ensure_ascii=False))

manager = ConnectionManager()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_profile: Optional[UserProfile] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    response_type: str
    metadata: Dict = {}
    suggested_actions: List[str] = []

class ProfileUpdateRequest(BaseModel):
    skills: Optional[Dict[str, SkillLevel]] = {}
    interested_areas: Optional[List[str]] = []
    current_goals: Optional[List[str]] = []
    experience_years: Optional[int] = None

class RoadmapRequest(BaseModel):
    target_skills: List[str]
    timeline_weeks: int = 12

# 라우트 정의

@app.get("/", response_class=HTMLResponse)
async def get_chat_interface():
    """메인 채팅 인터페이스 페이지"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>DevMentor Agent</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .chat-area { height: 400px; overflow-y: auto; padding: 20px; border-bottom: 1px solid #eee; }
            .message { margin: 10px 0; padding: 10px; border-radius: 5px; }
            .user-message { background: #e3f2fd; margin-left: 50px; }
            .bot-message { background: #f5f5f5; margin-right: 50px; }
            .input-area { padding: 20px; display: flex; gap: 10px; }
            .input-area input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .input-area button { padding: 10px 20px; background: #2c3e50; color: white; border: none; border-radius: 5px; cursor: pointer; }
            .status { padding: 10px; background: #f8f9fa; font-size: 12px; color: #666; }
            .actions { padding: 10px; }
            .action-btn { background: #3498db; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🤖 DevMentor Agent</h1>
                <p>개발자를 위한 AI 멘토링 서비스</p>
            </div>
            
            <div class="status" id="status">
                연결 상태: <span id="connection-status">연결 중...</span> | 
                세션 ID: <span id="session-id">생성 중...</span>
            </div>
            
            <div class="chat-area" id="chat-area">
                <div class="bot-message">
                    <strong>DevMentor:</strong> 안녕하세요! 저는 개발자 멘토링 AI입니다. 🚀<br>
                    다음과 같은 도움을 드릴 수 있어요:<br>
                    • 📚 맞춤형 학습 로드맵 제공<br>
                    • 🔍 코드 리뷰 및 품질 개선<br>
                    • 🐛 에러 디버깅 및 트러블슈팅<br>
                    • 💼 커리어 가이드 및 기술 상담<br><br>
                    무엇을 도와드릴까요?
                </div>
            </div>
            
            <div class="actions" id="suggested-actions"></div>
            
            <div class="input-area">
                <input type="text" id="message-input" placeholder="질문을 입력하세요..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">전송</button>
            </div>
        </div>

        <script>
            let ws;
            let sessionId = generateSessionId();
            
            function generateSessionId() {
                return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            
            function connectWebSocket() {
                ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`);
                
                ws.onopen = function(event) {
                    document.getElementById('connection-status').textContent = '연결됨';
                    document.getElementById('session-id').textContent = sessionId;
                };
                
                ws.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    addBotMessage(data.response);
                    updateSuggestedActions(data.suggested_actions);
                };
                
                ws.onclose = function(event) {
                    document.getElementById('connection-status').textContent = '연결 끊김';
                };
                
                ws.onerror = function(error) {
                    console.error('WebSocket 오류:', error);
                    document.getElementById('connection-status').textContent = '오류';
                };
            }
            
            function sendMessage() {
                const input = document.getElementById('message-input');
                const message = input.value.trim();
                
                if (message && ws.readyState === WebSocket.OPEN) {
                    addUserMessage(message);
                    ws.send(JSON.stringify({
                        message: message,
                        session_id: sessionId
                    }));
                    input.value = '';
                }
            }
            
            function addUserMessage(message) {
                const chatArea = document.getElementById('chat-area');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message user-message';
                messageDiv.innerHTML = `<strong>사용자:</strong> ${message}`;
                chatArea.appendChild(messageDiv);
                chatArea.scrollTop = chatArea.scrollHeight;
            }
            
            function addBotMessage(message) {
                const chatArea = document.getElementById('chat-area');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message bot-message';
                messageDiv.innerHTML = `<strong>DevMentor:</strong> ${message.replace(/\\n/g, '<br>')}`;
                chatArea.appendChild(messageDiv);
                chatArea.scrollTop = chatArea.scrollHeight;
            }
            
            function updateSuggestedActions(actions) {
                const actionsDiv = document.getElementById('suggested-actions');
                if (actions && actions.length > 0) {
                    actionsDiv.innerHTML = '💡 제안된 액션: ' + 
                        actions.map(action => `<button class="action-btn" onclick="sendMessage('${action}')">${action}</button>`).join('');
                } else {
                    actionsDiv.innerHTML = '';
                }
            }
            
            function handleKeyPress(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            }
            
            // 페이지 로드 시 WebSocket 연결
            window.onload = function() {
                connectWebSocket();
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket 연결 처리"""
    await manager.connect(websocket, session_id)
    try:
        while True:
            # 클라이언트로부터 메시지 수신
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # 멘토링 서비스로 메시지 처리
            response = await mentor_service.process_message(
                session_id=session_id,
                message=message_data["message"],
                user_profile=message_data.get("user_profile")
            )
            
            # 응답 전송
            await manager.send_message(session_id, {
                "response": response.content,
                "response_type": response.response_type,
                "metadata": response.metadata,
                "suggested_actions": response.suggested_actions
            })
            
    except WebSocketDisconnect:
        manager.disconnect(session_id)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """REST API 채팅 엔드포인트"""
    try:
        # 세션 ID 생성 (없는 경우)
        if not request.session_id:
            request.session_id = f"session_{uuid.uuid4().hex[:8]}"
        
        # 멘토링 서비스로 메시지 처리
        response = await mentor_service.process_message(
            session_id=request.session_id,
            message=request.message,
            user_profile=request.user_profile
        )
        
        return ChatResponse(
            response=response.content,
            session_id=request.session_id,
            response_type=response.response_type,
            metadata=response.metadata,
            suggested_actions=response.suggested_actions
        )
        
    except Exception as e:
        logger.error(f"채팅 처리 오류: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/session/{session_id}")
async def get_session_info(session_id: str):
    """세션 정보 조회"""
    session_info = mentor_service.get_session_info(session_id)
    if session_info:
        return session_info
    else:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")

@app.put("/api/profile/{session_id}")
async def update_profile(session_id: str, profile_updates: ProfileUpdateRequest):
    """사용자 프로필 업데이트"""
    success = mentor_service.update_user_profile(
        session_id=session_id,
        profile_updates=profile_updates.dict(exclude_unset=True)
    )
    
    if success:
        return {"message": "프로필이 업데이트되었습니다."}
    else:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")

@app.post("/api/roadmap/{session_id}")
async def generate_roadmap(session_id: str, request: RoadmapRequest):
    """학습 로드맵 생성"""
    roadmap = mentor_service.generate_learning_roadmap(
        session_id=session_id,
        target_skills=request.target_skills,
        timeline_weeks=request.timeline_weeks
    )
    
    if "error" in roadmap:
        raise HTTPException(status_code=404, detail=roadmap["error"])
    
    return roadmap

@app.get("/api/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "service": "DevMentor Agent",
        "version": "1.0.0",
        "agents": list(mentor_service.agents.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )