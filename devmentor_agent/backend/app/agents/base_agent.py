"""
DevMentor Agent - 기본 에이전트 클래스
모든 전문 에이전트들의 기본 클래스 정의
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import openai
import asyncio
import logging
from datetime import datetime

from ..models.schemas import (
    SessionContext, MentorResponse, UserProfile, 
    ChatMessage, SkillLevel
)


class BaseAgent(ABC):
    """모든 에이전트의 기본 클래스"""
    
    def __init__(self, api_key: str, model: str = "gpt-4"):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model = model
        self.logger = logging.getLogger(self.__class__.__name__)
        
    @abstractmethod
    async def process_request(
        self, 
        message: str, 
        context: SessionContext
    ) -> MentorResponse:
        """요청을 처리하고 응답을 생성"""
        pass
    
    @abstractmethod
    def get_system_prompt(self, context: SessionContext) -> str:
        """시스템 프롬프트 생성"""
        pass
    
    async def generate_response(
        self, 
        messages: List[Dict[str, str]], 
        max_tokens: int = 1000
    ) -> str:
        """OpenAI API를 사용하여 응답 생성"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            self.logger.error(f"OpenAI API 호출 실패: {e}")
            return "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    
    def build_conversation_context(
        self, 
        context: SessionContext, 
        current_message: str
    ) -> List[Dict[str, str]]:
        """대화 컨텍스트 구성"""
        messages = [
            {"role": "system", "content": self.get_system_prompt(context)}
        ]
        
        # 최근 대화 히스토리 추가 (최대 10개)
        recent_history = context.conversation_history[-10:]
        for msg in recent_history:
            role = "user" if msg.is_user else "assistant"
            messages.append({"role": role, "content": msg.content})
        
        # 현재 메시지 추가
        messages.append({"role": "user", "content": current_message})
        
        return messages
    
    def extract_user_skill_context(self, user_profile: UserProfile) -> str:
        """사용자 기술 정보를 텍스트로 변환"""
        skills_text = []
        for skill, level in user_profile.skills.items():
            skills_text.append(f"{skill}: {level.value}")
        
        return f"""
        사용자 정보:
        - 경력: {user_profile.experience_years}년
        - 기술 스킬: {', '.join(skills_text) if skills_text else '정보 없음'}
        - 관심 분야: {', '.join(user_profile.interested_areas) if user_profile.interested_areas else '정보 없음'}
        - 현재 목표: {', '.join(user_profile.current_goals) if user_profile.current_goals else '정보 없음'}
        """


class MentorAgent(BaseAgent):
    """학습 로드맵 및 커리어 가이드 전담 에이전트"""
    
    def get_system_prompt(self, context: SessionContext) -> str:
        user_context = self.extract_user_skill_context(context.user_profile)
        
        return f"""당신은 경험이 풍부한 시니어 개발자이자 멘토입니다.
        
        {user_context}
        
        당신의 역할:
        1. 개인화된 학습 로드맵 제공
        2. 커리어 발전 조언
        3. 기술 트렌드 가이드
        4. 목표 설정 및 달성 전략 제시
        
        지원 기술 스택:
        - 언어: Java, Kotlin, Python, JavaScript, TypeScript, C, Lua, HCL, Go, Dart, SQL
        - 프레임워크: SpringBoot, Flask, FastAPI, NestJS, React, Flutter
        - 이론: RDB, NoSQL(Redis, MongoDB), 네트워크, 브라우저 렌더링, AWS, Terraform
        
        응답 시 고려사항:
        - 사용자의 현재 수준에 맞는 조언
        - 구체적이고 실행 가능한 단계별 계획
        - 최신 기술 트렌드 반영
        - 동기부여와 격려 포함
        """
    
    async def process_request(
        self, 
        message: str, 
        context: SessionContext
    ) -> MentorResponse:
        """멘토링 요청 처리"""
        messages = self.build_conversation_context(context, message)
        
        response_content = await self.generate_response(messages)
        
        # 응답 분석 및 메타데이터 추출
        metadata = self._analyze_response_metadata(message, response_content)
        suggested_actions = self._extract_suggested_actions(response_content)
        
        return MentorResponse(
            content=response_content,
            response_type="advice",
            metadata=metadata,
            suggested_actions=suggested_actions
        )
    
    def _analyze_response_metadata(
        self, 
        user_message: str, 
        response: str
    ) -> Dict[str, Any]:
        """응답에서 메타데이터 추출"""
        metadata = {
            "topic_detected": self._detect_topic(user_message),
            "skill_level_mentioned": self._detect_skill_level(response),
            "technologies_mentioned": self._extract_technologies(response)
        }
        return metadata
    
    def _detect_topic(self, message: str) -> str:
        """메시지에서 주제 감지"""
        keywords = {
            "roadmap": ["로드맵", "학습", "계획", "roadmap", "learning"],
            "career": ["커리어", "취업", "이직", "career", "job"],
            "technology": ["기술", "언어", "프레임워크", "technology", "tech"],
            "project": ["프로젝트", "포트폴리오", "project", "portfolio"]
        }
        
        for topic, topic_keywords in keywords.items():
            if any(keyword in message.lower() for keyword in topic_keywords):
                return topic
        
        return "general"
    
    def _detect_skill_level(self, response: str) -> Optional[str]:
        """응답에서 언급된 스킬 레벨 감지"""
        levels = ["초급", "중급", "고급", "전문가", "beginner", "intermediate", "advanced", "expert"]
        for level in levels:
            if level in response.lower():
                return level
        return None
    
    def _extract_technologies(self, response: str) -> List[str]:
        """응답에서 언급된 기술들 추출"""
        technologies = [
            "Java", "Kotlin", "Python", "JavaScript", "TypeScript", 
            "React", "SpringBoot", "Flask", "FastAPI", "AWS", "Docker"
        ]
        
        mentioned = []
        for tech in technologies:
            if tech.lower() in response.lower():
                mentioned.append(tech)
        
        return mentioned
    
    def _extract_suggested_actions(self, response: str) -> List[str]:
        """응답에서 제안된 액션들 추출"""
        # 간단한 패턴 매칭으로 행동 제안 추출
        action_patterns = [
            "추천", "시작해보세요", "학습하세요", "연습해보세요", 
            "프로젝트를 만들어보세요", "공부해보세요"
        ]
        
        actions = []
        sentences = response.split('.')
        
        for sentence in sentences:
            for pattern in action_patterns:
                if pattern in sentence:
                    actions.append(sentence.strip())
                    break
        
        return actions[:3]  # 최대 3개까지
