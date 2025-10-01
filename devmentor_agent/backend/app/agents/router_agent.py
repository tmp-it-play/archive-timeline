"""
AI 기반 스마트 라우터 에이전트
사용자의 질문을 분석하여 적절한 전문 에이전트를 선택합니다.
빠른 응답을 위해 경량화된 프롬프트를 사용합니다.
"""

import json
import re
from typing import Dict, List, Optional
from dataclasses import dataclass
from .base_agent import BaseAgent


@dataclass
class RouterDecision:
    agent_type: str
    confidence: float
    reasoning: str
    suggested_actions: List[str] = None


class RouterAgent(BaseAgent):
    """AI 기반 에이전트 라우터"""

    def __init__(self, api_key: Optional[str] = None):
        super().__init__(api_key)
        self.agent_descriptions = {
            "troubleshooting": {
                "name": "트러블슈팅 에이전트",
                "description": "에러 해결, 디버깅, 문제 진단, 오류 수정",
                "keywords": ["에러", "오류", "문제", "해결", "디버깅", "버그", "수정", "exception", "error", "traceback", "fix", "debug"],
                "priority": 3  # 가장 높은 우선순위
            },
            "code_review": {
                "name": "코드 리뷰 에이전트",
                "description": "코드 분석, 품질 개선, 최적화, 리팩토링, 베스트 프랙티스",
                "keywords": ["코드", "리뷰", "분석", "최적화", "개선", "품질", "리팩토링", "code", "review", "analyze", "optimize", "refactor"],
                "priority": 2
            },
            "mentor": {
                "name": "멘토 에이전트",
                "description": "학습 로드맵, 커리어 가이드, 기술 추천, 진로 상담",
                "keywords": ["로드맵", "학습", "커리어", "진로", "공부", "추천", "계획", "목표", "roadmap", "learning", "career", "study"],
                "priority": 2
            },
            "general": {
                "name": "일반 에이전트",
                "description": "일반적인 개발 질문, 기술 정보, 설명, 조언",
                "keywords": ["설명", "알려", "뭐야", "무엇", "어떻게", "왜", "차이", "비교", "추천"],
                "priority": 1  # 가장 낮은 우선순위 (폴백용)
            }
        }

    def get_system_prompt(self, context=None) -> str:
        """라우터를 위한 시스템 프롬프트"""
        return """당신은 개발자 멘토링 서비스의 스마트 라우터입니다.
사용자의 질문을 분석하여 가장 적합한 전문 에이전트를 빠르고 정확하게 선택해주세요."""

    async def _call_openai_api(self, messages: List[Dict[str, str]], max_tokens: int = 200, temperature: float = 0.1) -> str:
        """OpenAI API 호출"""
        if not self.client:
            return '{"agent_type": "mentor", "confidence": 0.7, "reasoning": "API 키가 없어 기본 선택", "suggested_actions": ["일반 상담"]}'

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            self.logger.error(f"OpenAI API 호출 오류: {e}")
            return '{"agent_type": "mentor", "confidence": 0.7, "reasoning": "API 오류로 기본 선택", "suggested_actions": ["일반 상담"]}'

    async def route_query(self, user_query: str, conversation_history: List = None) -> RouterDecision:
        """사용자 쿼리를 분석하여 적절한 에이전트를 선택"""

        # 1. 빠른 규칙 기반 사전 필터링
        quick_decision = self._quick_rule_based_routing(user_query)
        if quick_decision.confidence > 0.8:
            return quick_decision

        # 2. AI 기반 정밀 라우팅 (필요시에만)
        if self.api_key:
            ai_decision = await self._ai_based_routing(user_query, conversation_history)
            return ai_decision
        else:
            # API 키가 없으면 규칙 기반 결과 반환
            return quick_decision

    def _quick_rule_based_routing(self, query: str) -> RouterDecision:
        """빠른 규칙 기반 라우팅 - 개선된 버전"""
        query_lower = query.lower()

        # 1. 에러/문제 패턴 우선 검사 (최고 우선순위)
        error_patterns = [
            r'error[:\s]', r'exception[:\s]', r'traceback[:\s]',
            r'오류[:\s]', r'에러[:\s]', r'문제[:\s]',
            r'안\s*돼', r'안\s*되', r'작동\s*안', r'실행\s*안',
            r'버그', r'bug', r'crash', r'fail'
        ]

        if any(re.search(pattern, query_lower) for pattern in error_patterns):
            return RouterDecision(
                agent_type="troubleshooting",
                confidence=0.95,
                reasoning="에러/문제 해결 패턴이 명확히 감지되어 트러블슈팅 에이전트를 선택했습니다.",
                suggested_actions=["에러 로그 분석", "단계별 디버깅", "해결책 제시"]
            )

        # 2. 코드 블록 및 명확한 코드 리뷰 요청 검사
        code_review_indicators = [
            '```', 'code', '코드',
            '리뷰', 'review', '분석', 'analyze',
            '최적화', 'optimize', '개선', 'improve',
            '리팩토링', 'refactor'
        ]

        code_score = sum(1 for indicator in code_review_indicators if indicator in query_lower)
        if code_score >= 2 or '```' in query:  # 코드 블록이 있거나 관련 키워드가 2개 이상
            return RouterDecision(
                agent_type="code_review",
                confidence=0.9,
                reasoning="코드 리뷰 관련 요청이 명확히 감지되어 코드 리뷰 에이전트를 선택했습니다.",
                suggested_actions=["코드 분석", "품질 개선 제안", "최적화 방안"]
            )

        # 3. 멘토링/학습 관련 명확한 요청 검사
        mentor_indicators = [
            '로드맵', 'roadmap', '학습', 'learning',
            '커리어', 'career', '진로', '공부', 'study',
            '계획', 'plan', '목표', 'goal'
        ]

        mentor_score = sum(1 for indicator in mentor_indicators if indicator in query_lower)
        if mentor_score >= 2:  # 멘토링 키워드가 2개 이상
            return RouterDecision(
                agent_type="mentor",
                confidence=0.85,
                reasoning="학습/커리어 멘토링 요청이 감지되어 멘토 에이전트를 선택했습니다.",
                suggested_actions=["맞춤형 가이드 제공", "학습 방향 제시", "전문가 조언"]
            )

        # 4. 일반적인 질문 패턴 검사 (새로 추가)
        general_indicators = [
            '뭐야', '무엇', 'what', '어떻게', 'how',
            '왜', 'why', '차이', 'difference', '비교', 'compare',
            '설명', 'explain', '알려', 'tell me', '추천', 'recommend'
        ]

        general_score = sum(1 for indicator in general_indicators if indicator in query_lower)
        if general_score >= 1:  # 일반적인 질문 패턴
            return RouterDecision(
                agent_type="general",
                confidence=0.75,
                reasoning="일반적인 개발 질문으로 판단하여 일반 에이전트를 선택했습니다.",
                suggested_actions=["상세한 설명 요청", "관련 예제 문의", "추가 정보 요청"]
            )

        # 5. 기본 폴백: 일반 에이전트 (기존 mentor에서 변경)
        return RouterDecision(
            agent_type="general",
            confidence=0.6,
            reasoning="특정 전문 영역으로 분류되지 않아 일반 에이전트를 선택했습니다.",
            suggested_actions=["더 구체적인 질문", "관련 정보 제공", "전문 에이전트 추천"]
        )

    async def _ai_based_routing(self, query: str, conversation_history: List = None) -> RouterDecision:
        """AI 기반 정밀 라우팅"""

        # 대화 컨텍스트 구성
        context = ""
        if conversation_history and len(conversation_history) > 0:
            recent_messages = conversation_history[-3:]  # 최근 3개 메시지만
            context = "\n".join([f"- {msg.content}" for msg in recent_messages])

        prompt = f"""당신은 개발자 멘토링 서비스의 라우터입니다. 사용자 질문을 분석하여 가장 적합한 전문 에이전트를 선택해주세요.

사용가능한 에이전트:
1. mentor: 학습 로드맵, 커리어 가이드, 기술 추천, 진로 상담
2. code_review: 코드 분석, 품질 개선, 최적화, 리팩토링  
3. troubleshooting: 에러 해결, 디버깅, 문제 진단, 오류 수정

최근 대화 맥락:
{context}

사용자 질문: "{query}"

다음 JSON 형식으로 응답해주세요:
{{
    "agent_type": "선택된_에이전트",
    "confidence": 0.0-1.0,
    "reasoning": "선택 이유",
    "suggested_actions": ["제안_액션1", "제안_액션2", "제안_액션3"]
}}

간단하고 빠르게 판단해주세요."""

        try:
            response = await self._call_openai_api([
                {"role": "system", "content": "You are a fast and accurate routing assistant."},
                {"role": "user", "content": prompt}
            ], max_tokens=200, temperature=0.1)

            # JSON 파싱
            result = json.loads(response)

            return RouterDecision(
                agent_type=result.get("agent_type", "mentor"),
                confidence=result.get("confidence", 0.7),
                reasoning=result.get("reasoning", "AI 분석 결과"),
                suggested_actions=result.get("suggested_actions", [])
            )

        except Exception as e:
            print(f"AI 라우팅 오류: {e}")
            # 폴백: 규칙 기반 결과
            return self._quick_rule_based_routing(query)

    def _get_suggested_actions(self, agent_type: str) -> List[str]:
        """에이전트 타입별 제안 액션"""
        actions = {
            "mentor": [
                "학습 로드맵 생성",
                "기술 스택 추천",
                "커리어 가이드",
                "목표 설정 도움"
            ],
            "code_review": [
                "코드 품질 분석",
                "최적화 제안",
                "베스트 프랙티스 적용",
                "리팩토링 가이드"
            ],
            "troubleshooting": [
                "에러 로그 분석",
                "단계별 디버깅",
                "해결책 제시",
                "예방법 안내"
            ],
            "general": [
                "기술 문서 검색",
                "개발 블로그 추천",
                "Q&A 포럼 안내",
                "기타 일반 정보 제공"
            ]
        }
        return actions.get(agent_type, [])

    async def process_request(self, message: str, context) -> any:
        """BaseAgent 인터페이스 구현"""
        decision = await self.route_query(message, context.conversation_history if context else None)
        return decision
