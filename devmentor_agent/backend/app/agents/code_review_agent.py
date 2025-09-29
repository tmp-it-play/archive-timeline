import re
import ast
from typing import Dict, Any, List, Optional
from ..models.schemas import (
    SessionContext, MentorResponse, CodeAnalysisRequest, 
    CodeAnalysisResult, ProgrammingLanguage
)
from .base_agent import BaseAgent


class CodeReviewAgent(BaseAgent):
    def __init__(self, api_key: str, model: str = "gpt-4"):
        super().__init__(api_key, model)
        self.code_patterns = self._load_code_patterns()
    
    def get_system_prompt(self, context: SessionContext) -> str:
        user_context = self.extract_user_skill_context(context.user_profile)
        
        return f"""당신은 코드 리뷰 전문가이자 시니어 개발자입니다.
        
        {user_context}
        
        당신의 역할:
        1. 코드 품질 분석 및 개선 제안
        2. 보안 취약점 및 버그 발견
        3. 성능 최적화 방안 제시
        4. 베스트 프랙티스 가이드
        5. 코드 가독성 개선 조언
        
        지원 언어: Java, Kotlin, Python, JavaScript, TypeScript, C, Lua, HCL, Go, Dart, SQL
        
        코드 리뷰 기준:
        - 가독성과 유지보수성
        - 성능과 효율성
        - 보안과 안정성
        - 설계 패턴과 아키텍처
        - 테스트 가능성
        
        응답 형식:
        1. 전체적인 코드 평가
        2. 구체적인 이슈 및 개선점
        3. 수정된 코드 예시 (필요시)
        4. 학습 자료 추천
        """
    
    async def process_request(
        self, 
        message: str, 
        context: SessionContext
    ) -> MentorResponse:
        code_block = self._extract_code_from_message(message)
        language = self._detect_programming_language(code_block, message)
        
        if code_block:
            analysis_result = await self._analyze_code(code_block, language)

            messages = self.build_conversation_context(context, message)
            response_content = await self.generate_response(messages)
            
            metadata = {
                "code_detected": True,
                "language": language.value if language else "unknown",
                "analysis_result": analysis_result.dict() if analysis_result else None
            }
            
            suggested_actions = self._generate_code_improvement_actions(analysis_result)
            
        else:
            messages = self.build_conversation_context(context, message)
            response_content = await self.generate_response(messages)
            
            metadata = {"code_detected": False}
            suggested_actions = []
        
        return MentorResponse(
            content=response_content,
            response_type="code_review",
            metadata=metadata,
            suggested_actions=suggested_actions
        )
    
    def _extract_code_from_message(self, message: str) -> Optional[str]:
        code_block_pattern = r'```(?:\w+)?\n(.*?)\n```'
        match = re.search(code_block_pattern, message, re.DOTALL)
        
        if match:
            return match.group(1).strip()
        inline_code_pattern = r'`([^`]+)`'
        matches = re.findall(inline_code_pattern, message)
        
        if matches and len(matches[0]) > 20:
            return matches[0]
        
        return None
    
    def _detect_programming_language(
        self, 
        code: Optional[str], 
        message: str
    ) -> Optional[ProgrammingLanguage]:
        if not code:
            return None

        language_patterns = {
            ProgrammingLanguage.PYTHON: [
                r'def\s+\w+\(', r'import\s+\w+', r'if\s+__name__\s*==\s*[\'"]__main__[\'"]',
                r'print\(', r':\s*$'
            ],
            ProgrammingLanguage.JAVA: [
                r'public\s+class\s+\w+', r'public\s+static\s+void\s+main',
                r'System\.out\.println', r'private\s+\w+\s+\w+;'
            ],
            ProgrammingLanguage.JAVASCRIPT: [
                r'function\s+\w+\(', r'const\s+\w+\s*=', r'console\.log\(',
                r'=>', r'var\s+\w+\s*='
            ],
            ProgrammingLanguage.TYPESCRIPT: [
                r'interface\s+\w+', r'type\s+\w+\s*=', r':\s*\w+\s*=',
                r'export\s+', r'import.*from'
            ],
            ProgrammingLanguage.GO: [
                r'package\s+\w+', r'func\s+\w+\(', r'import\s*\(',
                r'fmt\.Print', r':=\s*'
            ],
            ProgrammingLanguage.SQL: [
                r'SELECT\s+', r'FROM\s+\w+', r'WHERE\s+',
                r'INSERT\s+INTO', r'UPDATE\s+\w+'
            ]
        }

        for lang in ProgrammingLanguage:
            if lang.value.lower() in message.lower():
                return lang

        for language, patterns in language_patterns.items():
            matches = sum(1 for pattern in patterns if re.search(pattern, code, re.IGNORECASE | re.MULTILINE))
            if matches >= 2:
                return language
        
        return None
    
    async def _analyze_code(
        self, 
        code: str, 
        language: Optional[ProgrammingLanguage]
    ) -> Optional[CodeAnalysisResult]:
        issues = []
        suggestions = []
        quality_score = 7.0
        complexity_metrics = {}

        if language == ProgrammingLanguage.PYTHON:
            issues, suggestions, quality_score = self._analyze_python_code(code)

        general_issues = self._analyze_general_patterns(code)
        issues.extend(general_issues)

        complexity_metrics = self._calculate_complexity_metrics(code)
        
        return CodeAnalysisResult(
            issues=issues,
            suggestions=suggestions,
            quality_score=quality_score,
            complexity_metrics=complexity_metrics
        )
    
    def _analyze_python_code(self, code: str) -> tuple:
        issues = []
        suggestions = []
        quality_score = 8.0
        
        try:
            tree = ast.parse(code)

            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    func_lines = node.end_lineno - node.lineno + 1
                    if func_lines > 20:
                        issues.append({
                            "type": "complexity",
                            "line": node.lineno,
                            "message": f"함수 '{node.name}'가 너무 길어요 ({func_lines}줄). 20줄 이하로 분리를 고려해보세요."
                        })
                        quality_score -= 0.5

            code_lines = code.split('\n')
            for i, line in enumerate(code_lines, 1):
                if re.search(r'\b[a-z]+[A-Z][a-zA-Z]*\b', line):
                    issues.append({
                        "type": "style",
                        "line": i,
                        "message": "Python에서는 snake_case 변수명을 권장합니다."
                    })
                    quality_score -= 0.2
        
        except SyntaxError as e:
            issues.append({
                "type": "syntax",
                "line": e.lineno,
                "message": f"구문 오류: {e.msg}"
            })
            quality_score -= 2.0

        if len(issues) > 0:
            suggestions.append("코드 품질 개선을 위해 린터(pylint, flake8) 사용을 권장합니다.")
        
        suggestions.append("타입 힌트 추가로 코드 가독성을 높여보세요.")
        suggestions.append("독스트링으로 함수 설명을 추가해보세요.")
        
        return issues, suggestions, max(quality_score, 1.0)
    
    def _analyze_general_patterns(self, code: str) -> List[Dict[str, Any]]:
        issues = []

        if re.search(r'password\s*=\s*[\'"][^\'"]+[\'"]', code, re.IGNORECASE):
            issues.append({
                "type": "security",
                "message": "하드코딩된 패스워드가 감지되었습니다. 환경변수 사용을 권장합니다."
            })

        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            if len(line) > 120:
                issues.append({
                    "type": "style",
                    "line": i,
                    "message": f"라인이 너무 깁니다 ({len(line)}자). 120자 이하로 줄이는 것을 권장합니다."
                })

        for i, line in enumerate(lines, 1):
            if re.search(r'#.*(?:TODO|FIXME|XXX)', line, re.IGNORECASE):
                issues.append({
                    "type": "maintenance",
                    "line": i,
                    "message": "미완성 작업이 남아있습니다."
                })
        
        return issues
    
    def _calculate_complexity_metrics(self, code: str) -> Dict[str, Any]:
        lines = code.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        
        return {
            "total_lines": len(lines),
            "code_lines": len(non_empty_lines),
            "comment_lines": len([line for line in lines if line.strip().startswith('#')]),
            "blank_lines": len(lines) - len(non_empty_lines),
            "average_line_length": sum(len(line) for line in non_empty_lines) / max(len(non_empty_lines), 1)
        }
    
    def _generate_code_improvement_actions(
        self, 
        analysis_result: Optional[CodeAnalysisResult]
    ) -> List[str]:
        if not analysis_result:
            return []
        
        actions = []

        if analysis_result.quality_score < 5.0:
            actions.append("코드 리팩토링을 통한 전체적인 구조 개선이 필요합니다.")
        elif analysis_result.quality_score < 7.0:
            actions.append("일부 개선점들을 수정하여 코드 품질을 높여보세요.")

        issue_types = [issue.get("type") for issue in analysis_result.issues]
        
        if "security" in issue_types:
            actions.append("보안 취약점을 즉시 수정해주세요.")
        
        if "complexity" in issue_types:
            actions.append("복잡한 함수들을 더 작은 단위로 분리해보세요.")
        
        if "style" in issue_types:
            actions.append("코딩 스타일 가이드를 적용해보세요.")
        
        return actions[:3]  # 최대 3개까지
    
    def _load_code_patterns(self) -> Dict[str, List[str]]:
        return {
            "anti_patterns": [
                r'if\s+.*==\s*True',
                r'if\s+.*==\s*False',
            ],
            "best_practices": [
                r'with\s+open\(',
                r'try:.*except:',
            ]
        }
