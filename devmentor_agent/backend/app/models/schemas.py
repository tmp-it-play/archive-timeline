"""
DevMentor Agent - 데이터 모델 정의
개발자 멘토링을 위한 핵심 데이터 구조들
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum
import datetime


class SkillLevel(str, Enum):
    """기술 숙련도 레벨"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ProgrammingLanguage(str, Enum):
    """지원하는 프로그래밍 언어"""
    JAVA = "java"
    KOTLIN = "kotlin"
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    C = "c"
    LUA = "lua"
    HCL = "hcl"
    GO = "go"
    DART = "dart"
    SQL = "sql"


class TechStack(str, Enum):
    """지원하는 기술 스택"""
    SPRING_BOOT = "springboot"
    FLASK = "flask"
    FASTAPI = "fastapi"
    NESTJS = "nestjs"
    REACT = "react"
    FLUTTER = "flutter"


class TheoryArea(str, Enum):
    """이론 분야"""
    RDB_BASICS = "rdb_basics"
    NOSQL_REDIS = "nosql_redis"
    NOSQL_MONGODB = "nosql_mongodb"
    NETWORK_BASICS = "network_basics"
    BROWSER_RENDERING = "browser_rendering"
    AWS_INFRASTRUCTURE = "aws_infrastructure"
    TERRAFORM_BASICS = "terraform_basics"


class ChatMessage(BaseModel):
    content: str
    timestamp: datetime.datetime
    is_user: bool
    message_type: str = "text"


class CodeAnalysisRequest(BaseModel):
    code: str
    language: ProgrammingLanguage
    analysis_type: str = "review"


class CodeAnalysisResult(BaseModel):
    """코드 분석 결과 모델"""
    issues: List[Dict[str, Any]]
    suggestions: List[str]
    quality_score: float
    complexity_metrics: Dict[str, Any]


class UserProfile(BaseModel):
    """사용자 프로필 모델"""
    user_id: str
    name: Optional[str] = None
    skills: Dict[str, SkillLevel] = {}
    interested_areas: List[str] = []
    current_goals: List[str] = []
    experience_years: int = 0


class LearningRoadmap(BaseModel):
    """학습 로드맵 모델"""
    roadmap_id: str
    user_id: str
    title: str
    description: str
    milestones: List[Dict[str, Any]]
    estimated_duration: int  # weeks
    difficulty: SkillLevel
    tech_stack: List[str]


class SessionContext(BaseModel):
    """세션 컨텍스트 모델"""
    session_id: str
    user_profile: UserProfile
    conversation_history: List[ChatMessage] = []
    current_topic: Optional[str] = None
    active_roadmap: Optional[str] = None


class MentorResponse(BaseModel):
    """멘토 응답 모델"""
    content: str
    response_type: str  # advice, roadmap, code_review, troubleshooting
    metadata: Dict[str, Any] = {}
    suggested_actions: List[str] = []


class TroubleshootingCase(BaseModel):
    """트러블슈팅 케이스 모델"""
    error_type: str
    error_message: str
    language: ProgrammingLanguage
    context: Dict[str, Any]
    solution_steps: List[str]
    related_docs: List[str] = []
