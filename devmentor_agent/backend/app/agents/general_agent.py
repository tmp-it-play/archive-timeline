"""
일반 에이전트 - 전문 에이전트에 맞지 않는 일반적인 질문을 처리
마크다운 형식의 전문적인 응답을 제공합니다.
"""

from typing import Dict, Any, List
from .base_agent import BaseAgent
from ..models.schemas import SessionContext, MentorResponse


class GeneralAgent(BaseAgent):

    def get_system_prompt(self, context: SessionContext) -> str:
        return """당신은 개발자를 위한 친근하고 전문적인 AI 어시스턴트입니다.

주요 역할:
- 개발 관련 일반적인 질문에 답변
- 기술 정보 제공 및 설명
- 개발자의 궁금증 해결
- 업계 동향 및 일반적인 조언

응답 지침:
1. 마크다운 형식으로 구조화된 답변 제공
2. 전문적이면서도 친근한 톤 유지
3. 구체적인 예시와 실용적인 조언 포함
4. 필요시 코드 예제나 링크 제공
5. 단계별 설명으로 이해하기 쉽게 구성

응답 구조:
- 제목과 부제목 사용 (##, ###)
- 중요한 포인트는 볼드로 강조
- 목록과 번호 매기기 활용
- 코드나 명령어는 백틱으로 표시
- 긴 코드는 코드 블록 사용

사용자가 전문적인 코드 리뷰나 에러 해결이 필요한 경우, 해당 전문 에이전트를 추천해주세요."""

    async def process_request(self, message: str, context: SessionContext) -> MentorResponse:
        system_prompt = self.get_system_prompt(context)

        # 대화 히스토리 구성
        messages = [{"role": "system", "content": system_prompt}]

        if context.conversation_history:
            recent_history = context.conversation_history[-6:]
            for msg in recent_history:
                role = "user" if msg.is_user else "assistant"
                messages.append({"role": role, "content": msg.content})

        messages.append({"role": "user", "content": message})

        try:
            response_content = await self.generate_response(messages, max_tokens=1500)

            suggested_actions = self._generate_suggested_actions(message, response_content)

            return MentorResponse(
                content=response_content,
                response_type="general",
                metadata={
                    "agent_type": "general",
                    "has_markdown": True,
                    "context_used": len(context.conversation_history) > 0
                },
                suggested_actions=suggested_actions
            )

        except Exception as e:
            self.logger.error(f"일반 에이전트 처리 오류: {e}")
            return MentorResponse(
                content=self._generate_fallback_response(message),
                response_type="general",
                metadata={"agent_type": "general", "fallback": True},
                suggested_actions=["다시 질문해보세요", "더 구체적으로 설명해주세요"]
            )

    def _generate_suggested_actions(self, message: str, response: str) -> List[str]:
        actions = []

        message_lower = message.lower()

        if any(word in message_lower for word in ["학습", "공부", "배우고", "시작"]):
            actions.extend(["구체적인 학습 로드맵 요청", "추천 리소스 문의"])

        if any(word in message_lower for word in ["기술", "언어", "프레임워크"]):
            actions.extend(["비교 분석 요청", "장단점 문의"])

        if any(word in message_lower for word in ["트렌드", "최신", "인기"]):
            actions.extend(["2024년 개발 트렌드 문의", "업계 동향 분석 요청"])

        if any(word in message_lower for word in ["커리어", "취업", "이직"]):
            actions.extend(["커리어 로드맵 상담", "포트폴리오 조언 요청"])

        if not actions:
            actions = [
                "더 자세한 설명 요청",
                "관련 예제 코드 요청",
                "추가 질문하기"
            ]

        return actions[:3]

    def _generate_fallback_response(self, message: str) -> str:
        return f"""## 죄송합니다

현재 일시적으로 AI 서비스에 접근할 수 없어 상세한 답변을 드리기 어렵습니다.

### 질문 내용
> {message}

### 다음과 같이 시도해보세요:
1. 잠시 후 다시 질문해주세요
2. 더 구체적인 키워드로 질문해보세요
3. 단계별로 나누어서 질문해보세요

### 도움이 될 만한 리소스:
- [MDN Web Docs](https://developer.mozilla.org/) - 웹 개발 참고서
- [Stack Overflow](https://stackoverflow.com/) - 개발자 Q&A
- [GitHub](https://github.com/) - 오픈소스 코드 참고

감사합니다!"""
