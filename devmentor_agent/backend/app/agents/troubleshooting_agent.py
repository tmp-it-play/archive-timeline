"""
DevMentor Agent - 트러블슈팅 전담 에이전트
에러 디버깅 및 문제 해결 지원
"""

import re
from typing import Dict, Any, List, Optional
from ..models.schemas import (
    SessionContext, MentorResponse, TroubleshootingCase,
    ProgrammingLanguage
)
from .base_agent import BaseAgent


class TroubleshootingAgent(BaseAgent):
    
    def __init__(self, api_key: str, model: str = "gpt-4"):
        super().__init__(api_key, model)
        self.error_patterns = self._load_error_patterns()
        self.solution_database = self._load_solution_database()
    
    def get_system_prompt(self, context: SessionContext) -> str:
        user_context = self.extract_user_skill_context(context.user_profile)
        
        return f"""당신은 숙련된 디버깅 전문가이자 문제 해결사입니다.
        
        {user_context}
        
        당신의 역할:
        1. 에러 메시지 분석 및 원인 파악
        2. 단계별 해결 방법 제시
        3. 예방 방법 및 베스트 프랙티스 안내
        4. 관련 문서 및 리소스 추천
        5. 디버깅 기법 교육
        
        지원 언어: Java, Kotlin, Python, JavaScript, TypeScript, C, Lua, HCL, Go, Dart, SQL
        
        문제 해결 접근법:
        1. 에러 메시지 정확한 분석
        2. 가능한 원인들 나열
        3. 우선순위별 해결 방법 제시
        4. 재현 가능한 해결 예제 제공
        5. 향후 예방 방법 안내
        
        응답 형식:
        - 명확하고 단계적인 설명
        - 코드 예제 포함 (필요시)
        - 관련 문서 링크
        - 비슷한 문제 예방법
        """
    
    async def process_request(
        self, 
        message: str, 
        context: SessionContext
    ) -> MentorResponse:
        """트러블슈팅 요청 처리"""

        error_info = self._extract_error_info(message)
        
        if error_info:
            # 알려진 에러 패턴 매칭
            known_solution = self._match_known_errors(error_info)
            
            if known_solution:
                # 알려진 해결책이 있는 경우
                response_content = self._format_known_solution(known_solution, error_info)
                metadata = {
                    "error_detected": True,
                    "error_type": error_info.get("type", "unknown"),
                    "language": error_info.get("language", "unknown"),
                    "solution_found": True
                }
            else:
                # AI로 분석 필요한 경우
                messages = self.build_conversation_context(context, message)
                response_content = await self.generate_response(messages, max_tokens=1500)
                metadata = {
                    "error_detected": True,
                    "error_type": error_info.get("type", "unknown"),
                    "language": error_info.get("language", "unknown"),
                    "solution_found": False
                }
        else:
            # 일반적인 트러블슈팅 질문
            messages = self.build_conversation_context(context, message)
            response_content = await self.generate_response(messages)
            metadata = {"error_detected": False}
        
        suggested_actions = self._generate_troubleshooting_actions(error_info)
        
        return MentorResponse(
            content=response_content,
            response_type="troubleshooting",
            metadata=metadata,
            suggested_actions=suggested_actions
        )
    
    def _extract_error_info(self, message: str) -> Optional[Dict[str, Any]]:
        """메시지에서 에러 정보 추출"""
        error_info = {}
        
        # 에러 메시지 패턴 검색
        error_patterns = [
            r'(Error|Exception|에러|오류):\s*(.+)',
            r'Traceback.*?(\w+Error):\s*(.+)',
            r'(\w+Exception):\s*(.+)',
            r'SyntaxError:\s*(.+)',
            r'TypeError:\s*(.+)',
            r'ValueError:\s*(.+)',
            r'AttributeError:\s*(.+)',
            r'ImportError:\s*(.+)',
            r'ModuleNotFoundError:\s*(.+)'
        ]
        
        for pattern in error_patterns:
            match = re.search(pattern, message, re.IGNORECASE | re.MULTILINE)
            if match:
                if len(match.groups()) >= 2:
                    error_info["type"] = match.group(1)
                    error_info["message"] = match.group(2).strip()
                else:
                    error_info["message"] = match.group(1).strip()
                break
        
        # 언어 감지
        language_keywords = {
            "python": ["python", "py", "pip", "conda", "django", "flask"],
            "java": ["java", "javac", "maven", "gradle", "springframework"],
            "javascript": ["node", "npm", "yarn", "react", "vue", "angular"],
            "typescript": ["tsc", "typescript", "ts"],
            "go": ["go", "golang", "go.mod"],
            "sql": ["sql", "mysql", "postgresql", "sqlite"]
        }
        
        message_lower = message.lower()
        for lang, keywords in language_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                error_info["language"] = lang
                break
        
        # 스택 트레이스 추출
        stack_trace_pattern = r'(Traceback.*?(?=\n\n|\n[A-Za-z]|\Z))'
        stack_match = re.search(stack_trace_pattern, message, re.DOTALL)
        if stack_match:
            error_info["stack_trace"] = stack_match.group(1)
        
        return error_info if error_info else None
    
    def _match_known_errors(self, error_info: Dict[str, Any]) -> Optional[TroubleshootingCase]:
        """알려진 에러 패턴과 매칭"""
        error_message = error_info.get("message", "").lower()
        error_type = error_info.get("type", "").lower()
        
        # 일반적인 Python 에러들
        if "python" in error_info.get("language", ""):
            if "modulenotfounderror" in error_type or "no module named" in error_message:
                return TroubleshootingCase(
                    error_type="ModuleNotFoundError",
                    error_message=error_info["message"],
                    language=ProgrammingLanguage.PYTHON,
                    context=error_info,
                    solution_steps=[
                        "1. 패키지가 설치되어 있는지 확인: pip list | grep [패키지명]",
                        "2. 패키지 설치: pip install [패키지명]",
                        "3. 가상환경이 활성화되어 있는지 확인",
                        "4. PYTHONPATH 환경변수 확인",
                        "5. requirements.txt에 패키지 추가"
                    ],
                    related_docs=[
                        "https://docs.python.org/3/tutorial/modules.html",
                        "https://pip.pypa.io/en/stable/user_guide/"
                    ]
                )
            
            elif "indentationerror" in error_type or "expected an indented block" in error_message:
                return TroubleshootingCase(
                    error_type="IndentationError",
                    error_message=error_info["message"],
                    language=ProgrammingLanguage.PYTHON,
                    context=error_info,
                    solution_steps=[
                        "1. 들여쓰기 일관성 확인 (스페이스 vs 탭)",
                        "2. 함수/클래스 정의 후 콜론(:) 확인",
                        "3. if/for/while문 후 들여쓰기 확인",
                        "4. 편집기에서 공백 문자 표시 기능 활용",
                        "5. 자동 포매터(black, autopep8) 사용"
                    ],
                    related_docs=[
                        "https://docs.python.org/3/reference/lexical_analysis.html#indentation"
                    ]
                )
        
        # JavaScript/Node.js 에러들
        elif "javascript" in error_info.get("language", "") or "node" in error_info.get("language", ""):
            if "cannot find module" in error_message:
                return TroubleshootingCase(
                    error_type="ModuleNotFound",
                    error_message=error_info["message"],
                    language=ProgrammingLanguage.JAVASCRIPT,
                    context=error_info,
                    solution_steps=[
                        "1. 패키지 설치 확인: npm list [패키지명]",
                        "2. 패키지 설치: npm install [패키지명]",
                        "3. package.json의 dependencies 확인",
                        "4. 상대 경로/절대 경로 확인",
                        "5. node_modules 폴더 재생성: rm -rf node_modules && npm install"
                    ],
                    related_docs=[
                        "https://nodejs.org/api/modules.html",
                        "https://docs.npmjs.com/"
                    ]
                )
        
        return None
    
    def _format_known_solution(
        self, 
        solution: TroubleshootingCase, 
        error_info: Dict[str, Any]
    ) -> str:
        """알려진 해결책 포맷팅"""
        response = f"""🔍 **에러 분석**
에러 타입: {solution.error_type}
언어: {solution.language.value}

📝 **에러 메시지**
```
{solution.error_message}
```

🛠️ **해결 방법**
"""
        
        for step in solution.solution_steps:
            response += f"{step}\n"
        
        if solution.related_docs:
            response += f"\n📚 **참고 문서**\n"
            for doc in solution.related_docs:
                response += f"• {doc}\n"
        
        response += f"""
💡 **예방 방법**
• 가상환경 사용하여 패키지 의존성 관리
• requirements.txt 또는 package.json 최신 상태 유지
• 린터와 포매터 사용으로 구문 오류 예방
• IDE의 에러 체크 기능 활용
"""
        
        return response
    
    def _generate_troubleshooting_actions(
        self, 
        error_info: Optional[Dict[str, Any]]
    ) -> List[str]:
        """트러블슈팅 액션 제안"""
        actions = []
        
        if error_info:
            language = error_info.get("language", "")
            error_type = error_info.get("type", "").lower()
            
            # 언어별 기본 액션
            if "python" in language:
                actions.extend([
                    "pip list로 설치된 패키지 확인",
                    "Python 버전 확인",
                    "가상환경 상태 확인"
                ])
            elif "javascript" in language or "node" in language:
                actions.extend([
                    "npm list로 패키지 확인",
                    "Node.js 버전 확인",
                    "package.json 의존성 확인"
                ])
            
            # 에러 타입별 액션
            if "module" in error_type or "import" in error_type:
                actions.append("패키지 재설치 시도")
            elif "syntax" in error_type:
                actions.append("문법 검사 도구 실행")
            elif "type" in error_type:
                actions.append("변수 타입 확인")
        
        # 일반적인 디버깅 액션
        actions.extend([
            "로그 레벨 상세히 설정",
            "단계별 디버깅 수행",
            "관련 문서 확인"
        ])
        
        return actions[:5]  # 최대 5개까지
    
    def _load_error_patterns(self) -> Dict[str, List[str]]:
        """에러 패턴 데이터베이스 로드"""
        return {
            "python": [
                r"ModuleNotFoundError: No module named '(.+)'",
                r"IndentationError: (.+)",
                r"SyntaxError: (.+)",
                r"TypeError: (.+)",
                r"ValueError: (.+)",
                r"AttributeError: (.+)"
            ],
            "javascript": [
                r"Cannot find module '(.+)'",
                r"ReferenceError: (.+) is not defined",
                r"TypeError: (.+)",
                r"SyntaxError: (.+)"
            ],
            "java": [
                r"ClassNotFoundException: (.+)",
                r"NoSuchMethodError: (.+)",
                r"NullPointerException",
                r"IllegalArgumentException: (.+)"
            ]
        }
    
    def _load_solution_database(self) -> Dict[str, Any]:
        """해결책 데이터베이스 로드"""
        return {
            "common_solutions": {
                "module_not_found": {
                    "python": "pip install [package_name]",
                    "javascript": "npm install [package_name]",
                    "java": "Add dependency to pom.xml or build.gradle"
                },
                "syntax_error": {
                    "python": "Check indentation and syntax",
                    "javascript": "Check brackets and semicolons",
                    "java": "Check brackets and semicolons"
                }
            }
        }