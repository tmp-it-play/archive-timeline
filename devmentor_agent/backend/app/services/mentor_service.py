import os
import re
import datetime
from typing import Dict, Any, Optional
from ..agents.base_agent import MentorAgent, BaseAgent
from ..agents.code_review_agent import CodeReviewAgent
from ..agents.troubleshooting_agent import TroubleshootingAgent
from ..agents.router_agent import RouterAgent
from ..models.schemas import (
    SessionContext, MentorResponse, UserProfile, 
    ChatMessage, ProgrammingLanguage
)


class MentorService:
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("⚠️ WARNING: OPENAI_API_KEY not found. Using mock responses for testing.")
        self.agents: Dict[str, BaseAgent] = {}
        self.router: RouterAgent = RouterAgent(self.api_key)
        self._initialize_agents()
        self.sessions: Dict[str, SessionContext] = {}
    
    def _initialize_agents(self):
        self.agents["mentor"] = MentorAgent(self.api_key)
        self.agents["code_review"] = CodeReviewAgent(self.api_key)
        self.agents["troubleshooting"] = TroubleshootingAgent(self.api_key)
    
    async def process_message(
        self, 
        session_id: str, 
        message: str, 
        user_profile: Optional[UserProfile] = None
    ) -> MentorResponse:
        context = self._get_or_create_session(session_id, user_profile)

        # AI 기반 라우터로 에이전트 선택
        router_decision = await self.router.route_query(message, context.conversation_history)

        print(f"🤖 라우터 결정: {router_decision.agent_type} (신뢰도: {router_decision.confidence:.2f})")
        print(f"📝 선택 이유: {router_decision.reasoning}")

        agent = self.agents[router_decision.agent_type]
        response = await agent.process_request(message, context)

        # 라우터의 제안 액션을 응답에 추가
        if router_decision.suggested_actions:
            response.suggested_actions.extend(router_decision.suggested_actions[:3])  # 최대 3개

        # 라우터 정보를 메타데이터에 추가
        response.metadata.update({
            "selected_agent": router_decision.agent_type,
            "agent_confidence": router_decision.confidence,
            "routing_reason": router_decision.reasoning
        })

        self._update_conversation_history(session_id, message, response.content)
        
        return response
    
    def _get_or_create_session(
        self, 
        session_id: str, 
        user_profile: Optional[UserProfile]
    ) -> SessionContext:
        
        if session_id not in self.sessions:
            if not user_profile:
                user_profile = UserProfile(
                    user_id=session_id,
                    name="익명 사용자",
                    experience_years=1
                )
            
            self.sessions[session_id] = SessionContext(
                session_id=session_id,
                user_profile=user_profile
            )
        
        return self.sessions[session_id]
    
    def _determine_agent_type(self, message: str) -> str:

        troubleshooting_keywords = [
            "에러", "오류", "문제", "해결", "도움", "고장", "안돼", "안되",
            "error", "exception", "traceback", "bug", "problem", "issue", "fix", "help"
        ]

        code_keywords = [
            "코드", "리뷰", "분석", "최적화", "개선", "품질",
            "code", "review", "analyze", "optimize", "improve", "quality", "```"
        ]

        mentor_keywords = [
            "로드맵", "학습", "커리어", "계획", "공부", "추천", "진로",
            "roadmap", "learning", "career", "study", "recommend", "guide"
        ]
        
        message_lower = message.lower()
        troubleshooting_score = sum(1 for keyword in troubleshooting_keywords if keyword in message_lower)
        code_score = sum(1 for keyword in code_keywords if keyword in message_lower)
        mentor_score = sum(1 for keyword in mentor_keywords if keyword in message_lower)

        error_patterns = [r'error:', r'exception:', r'traceback:', r'오류:', r'에러:', r'문제:']
        has_error_pattern = any(re.search(pattern, message_lower) for pattern in error_patterns)
        
        if has_error_pattern or troubleshooting_score > 0:
            return "troubleshooting"
        elif "```" in message or code_score > mentor_score:
            return "code_review"
        else:
            return "mentor"
    
    def _update_conversation_history(
        self, 
        session_id: str, 
        user_message: str, 
        bot_response: str
    ):
        if session_id in self.sessions:
            context = self.sessions[session_id]

            user_msg = ChatMessage(
                content=user_message,
                timestamp=datetime.datetime.now(),
                is_user=True
            )
            context.conversation_history.append(user_msg)

            bot_msg = ChatMessage(
                content=bot_response,
                timestamp=datetime.datetime.now(),
                is_user=False
            )
            context.conversation_history.append(bot_msg)

            if len(context.conversation_history) > 20:
                context.conversation_history = context.conversation_history[-20:]
    
    def get_session_info(self, session_id: str) -> Optional[Dict[str, Any]]:
        if session_id in self.sessions:
            context = self.sessions[session_id]
            return {
                "session_id": session_id,
                "user_profile": context.user_profile.dict(),
                "conversation_count": len(context.conversation_history),
                "current_topic": context.current_topic
            }
        return None
    
    def update_user_profile(
        self, 
        session_id: str, 
        profile_updates: Dict[str, Any]
    ) -> bool:
        if session_id in self.sessions:
            context = self.sessions[session_id]
            for field, value in profile_updates.items():
                if hasattr(context.user_profile, field):
                    setattr(context.user_profile, field, value)
            
            return True
        return False
    
    def generate_learning_roadmap(
        self, 
        session_id: str, 
        target_skills: list, 
        timeline_weeks: int = 12
    ) -> Dict[str, Any]:
        if session_id not in self.sessions:
            return {"error": "세션을 찾을 수 없습니다."}
        
        context = self.sessions[session_id]
        user_profile = context.user_profile
        roadmap = {
            "roadmap_id": f"roadmap_{session_id}_{len(target_skills)}",
            "user_id": session_id,
            "title": f"{', '.join(target_skills)} 학습 로드맵",
            "description": f"{user_profile.experience_years}년 경력 개발자를 위한 맞춤형 학습 계획",
            "milestones": self._generate_milestones(target_skills, timeline_weeks),
            "estimated_duration": timeline_weeks,
            "tech_stack": target_skills
        }
        
        return roadmap
    
    def _generate_milestones(self, skills: list, weeks: int) -> list:
        milestones = []
        weeks_per_skill = max(weeks // len(skills), 2)
        
        for i, skill in enumerate(skills):
            milestone = {
                "week": i * weeks_per_skill + 1,
                "title": f"{skill} 기초 학습",
                "description": f"{skill} 기본 개념 및 핵심 기능 학습",
                "tasks": [
                    f"{skill} 공식 문서 읽기",
                    f"{skill} 기본 예제 프로젝트 만들기", 
                    f"{skill} 관련 온라인 강의 수강"
                ],
                "deliverables": [f"{skill} 기초 프로젝트 완성"],
                "resources": [
                    f"{skill} 공식 문서",
                    f"{skill} 튜토리얼 사이트"
                ]
            }
            milestones.append(milestone)
        
        return milestones
