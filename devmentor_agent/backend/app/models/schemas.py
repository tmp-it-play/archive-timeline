from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum
import datetime


class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ProgrammingLanguage(str, Enum):
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
    SPRING_BOOT = "springboot"
    FLASK = "flask"
    FASTAPI = "fastapi"
    NESTJS = "nestjs"
    REACT = "react"
    FLUTTER = "flutter"


class TheoryArea(str, Enum):
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
    issues: List[Dict[str, Any]]
    suggestions: List[str]
    quality_score: float
    complexity_metrics: Dict[str, Any]


class UserProfile(BaseModel):
    user_id: str
    name: Optional[str] = None
    skills: Dict[str, SkillLevel] = {}
    interested_areas: List[str] = []
    current_goals: List[str] = []
    experience_years: int = 0


class LearningRoadmap(BaseModel):
    roadmap_id: str
    user_id: str
    title: str
    description: str
    milestones: List[Dict[str, Any]]
    estimated_duration: int
    difficulty: SkillLevel
    tech_stack: List[str]


class SessionContext(BaseModel):
    session_id: str
    user_profile: UserProfile
    conversation_history: List[ChatMessage] = []
    current_topic: Optional[str] = None
    active_roadmap: Optional[str] = None


class MentorResponse(BaseModel):
    content: str
    response_type: str
    metadata: Dict[str, Any] = {}
    suggested_actions: List[str] = []


class TroubleshootingCase(BaseModel):
    error_type: str
    error_message: str
    language: ProgrammingLanguage
    context: Dict[str, Any]
    solution_steps: List[str]
    related_docs: List[str] = []
