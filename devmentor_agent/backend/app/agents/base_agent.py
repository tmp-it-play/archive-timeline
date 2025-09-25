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
    
    def __init__(self, api_key: str = None, model: str = "gpt-4"):
        self.api_key = api_key
        if api_key:
            self.client = openai.AsyncOpenAI(api_key=api_key)
        else:
            self.client = None
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
        # API 키가 없는 경우 테스트용 응답 반환
        if not self.client:
            return self._generate_mock_response(messages)
        
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
    
    def _generate_mock_response(self, messages: List[Dict[str, str]]) -> str:
        """테스트용 모의 응답 생성"""
        user_message = messages[-1]['content'] if messages else ""
        
        # 키워드 기반 간단한 응답 생성
        if any(keyword in user_message.lower() for keyword in ['안녕', 'hello', '안녕하세요']):
            return "안녕하세요! 저는 DevMentor AI입니다. 🤖\n\n개발 관련 질문이나 학습 계획에 대해 도움을 드릴 수 있습니다. 무엇을 도와드릴까요?\n\n• 📚 학습 로드맵 작성\n• 🔍 코드 리뷰 및 개선\n• 🐛 문제 해결 지원\n• 💼 커리어 조언"
        
        elif any(keyword in user_message.lower() for keyword in ['로드맵', 'roadmap', '학습', '계획']):
            return "학습 로드맵을 도와드리겠습니다! 📚\n\n현재 어떤 기술 스택에 관심이 있으신가요?\n\n**추천 학습 경로:**\n1. **백엔드 개발:** Java/Spring Boot → JPA → AWS\n2. **프론트엔드:** JavaScript → React → TypeScript\n3. **풀스택:** Python/FastAPI + React\n4. **모바일:** Flutter/Dart 또는 React Native\n\n구체적인 목표나 현재 수준을 알려주시면 더 맞춤형 조언을 드릴 수 있습니다!"
        
        elif any(keyword in user_message.lower() for keyword in ['에러', 'error', '문제', '오류']):
            return "문제 해결을 도와드리겠습니다! 🔧\n\n더 정확한 도움을 위해 다음 정보를 알려주세요:\n\n1. **에러 메시지:** 정확한 오류 내용\n2. **환경 정보:** 사용 중인 언어, 프레임워크, 버전\n3. **상황 설명:** 언제, 어떤 상황에서 발생했는지\n4. **시도한 해결 방법:** 이미 시도해본 것들\n\n에러 로그나 코드를 공유해주시면 더 구체적인 해결책을 제시해드릴 수 있습니다."
        
        elif any(keyword in user_message.lower() for keyword in ['코드', 'code', '리뷰', 'review']):
            return "코드 리뷰를 도와드리겠습니다! 👨‍💻\n\n다음 항목들을 중점적으로 검토해드릴 수 있습니다:\n\n**🔍 검토 항목:**\n• 코드 품질 및 가독성\n• 성능 최적화 포인트\n• 보안 취약점 체크\n• 베스트 프랙티스 적용\n• 리팩토링 제안\n\n코드를 공유해주시면 자세한 피드백을 드리겠습니다. 어떤 부분에 특히 집중해서 리뷰받고 싶으신가요?"
        
        else:
            return f"질문해주셨군요! 🤔\n\n'{user_message}'에 대해 도움을 드리고 싶은데, 좀 더 구체적으로 설명해주실 수 있을까요?\n\n**도움을 드릴 수 있는 영역:**\n• 📖 학습 계획 및 로드맵\n• 🛠️ 기술 문제 해결\n• 📝 코드 리뷰 및 개선\n• 🎯 커리어 조언\n\n어떤 도움이 필요하신지 알려주세요!"
    
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
