from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import uuid
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

frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

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

@app.get("/", response_class=HTMLResponse)
async def get_chat_interface():
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
    index_file = os.path.join(frontend_path, "index.html")

    if os.path.exists(index_file):
        return FileResponse(index_file)
    else:

        return HTMLResponse(content="""
        <!DOCTYPE html>
        <html>
        <head>
            <title>DevMentor Agent</title>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
                .error { color: #e74c3c; }
            </style>
        </head>
        <body>
            <h1>DevMentor Agent</h1>
            <div class="error">
                <p>프론트엔드 파일을 찾을 수 없습니다.</p>
                <p>다음 경로를 확인해주세요: {}</p>
            </div>
        </body>
        </html>
        """.format(frontend_path))

@app.get("/styles.css")
async def get_styles():
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
    css_file = os.path.join(frontend_path, "styles.css")

    if os.path.exists(css_file):
        return FileResponse(css_file, media_type="text/css")
    else:
        raise HTTPException(status_code=404, detail="CSS 파일을 찾을 수 없습니다.")

@app.get("/script.js")
async def get_script():
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
    js_file = os.path.join(frontend_path, "script.js")

    if os.path.exists(js_file):
        return FileResponse(js_file, media_type="application/javascript")
    else:
        raise HTTPException(status_code=404, detail="JavaScript 파일을 찾을 수 없습니다.")

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    client_host = websocket.client.host if websocket.client else "unknown"
    logger.info(f"WebSocket 연결 요청: {session_id} from {client_host}")

    try:
        await manager.connect(websocket, session_id)
        logger.info(f"WebSocket 연결 성공: {session_id}")

        await manager.send_message(session_id, {
            "response": "서버에 성공적으로 연결되었습니다!",
            "response_type": "system",
            "metadata": {"connection_status": "connected"},
            "suggested_actions": []
        })

        while True:
            try:
                data = await websocket.receive_text()
                logger.info(f"메시지 수신 from {session_id}: {data[:100]}...")

                message_data = json.loads(data)
                user_message = message_data.get("message", "").strip()

                if not user_message:
                    logger.warning(f"빈 메시지 수신: {session_id}")
                    continue

                logger.info(f"처리 시작: {session_id} - {user_message[:50]}...")

                response = await mentor_service.process_message(
                    session_id=session_id,
                    message=user_message,
                    user_profile=message_data.get("user_profile")
                )

                logger.info(f"응답 전송 to {session_id}: {response.content[:50]}...")

                await manager.send_message(session_id, {
                    "response": response.content,
                    "response_type": response.response_type,
                    "metadata": response.metadata,
                    "suggested_actions": response.suggested_actions
                })

            except json.JSONDecodeError as e:
                logger.error(f"JSON 파싱 오류 {session_id}: {e}")
                await manager.send_message(session_id, {
                    "response": "메시지 형식이 올바르지 않습니다.",
                    "response_type": "error",
                    "metadata": {},
                    "suggested_actions": []
                })
            except Exception as e:
                logger.error(f"메시지 처리 오류 {session_id}: {e}", exc_info=True)
                await manager.send_message(session_id, {
                    "response": f"처리 중 오류가 발생했습니다: {str(e)}",
                    "response_type": "error",
                    "metadata": {},
                    "suggested_actions": ["다시 시도해주세요"]
                })

    except WebSocketDisconnect:
        logger.info(f"WebSocket 정상 연결 해제: {session_id}")
        manager.disconnect(session_id)
    except Exception as e:
        logger.error(f"WebSocket 연결 오류 {session_id}: {e}", exc_info=True)
        manager.disconnect(session_id)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        if not request.session_id:
            request.session_id = f"session_{uuid.uuid4().hex[:8]}"

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
    session_info = mentor_service.get_session_info(session_id)
    if session_info:
        return session_info
    else:
        raise HTTPException(status_code=404, detail="세션을 찾을 수 없습니다.")

@app.put("/api/profile/{session_id}")
async def update_profile(session_id: str, profile_updates: ProfileUpdateRequest):
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