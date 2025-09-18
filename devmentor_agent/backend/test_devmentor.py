#!/usr/bin/env python3

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("=== DevMentor Agent 시작 테스트 ===")
    
    # 1. 기본 모듈 import 테스트
    print("1. 기본 모듈 import 테스트...")
    from app.models.schemas import UserProfile, SkillLevel
    print("schemas 모듈 import 성공")
    
    # 2. 에이전트 모듈 import 테스트
    print("2. 에이전트 모듈 import 테스트...")
    from app.agents.base_agent import BaseAgent, MentorAgent
    from app.agents.code_review_agent import CodeReviewAgent
    from app.agents.troubleshooting_agent import TroubleshootingAgent
    print("   ✅ 에이전트 모듈 import 성공")

    print("3. 서비스 모듈 import 테스트...")
    from app.services.mentor_service import MentorService
    print("   ✅ 서비스 모듈 import 성공")

    print("4. 기본 객체 생성 테스트...")

    test_profile = UserProfile(
        user_id="test_user",
        name="테스트 사용자",
        experience_years=2
    )
    print("UserProfile 객체 생성 성공")

    mentor_service = MentorService()
    print("MentorService 객체 생성 성공")
    
    print("\n모든 테스트 통과! DevMentor Agent 준비 완료!")
    print("   서버 실행: python -m uvicorn main:app --reload")
    
except ImportError as e:
    print(f"Import 오류: {e}")
    print("   모듈 경로를 확인해주세요.")
except Exception as e:
    print(f"오류 발생: {e}")
    import traceback
    traceback.print_exc()

if __name__ == "__main__":
    print("\n=== FastAPI 서버 시작 ===")
    try:
        import uvicorn
        from main import app
        print("FastAPI 앱 로드 성공! 서버를 시작합니다...")
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
    except Exception as e:
        print(f"서버 시작 실패: {e}")
        import traceback
        traceback.print_exc()