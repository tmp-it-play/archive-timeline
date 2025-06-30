#!/usr/bin/env python3
import logging
import os
import re
import json
import pymysql
import redis
import uvicorn
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, Query, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI
import asyncio
from contextlib import asynccontextmanager

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenAI API 키 설정
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logger.warning("OpenAI API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.")
    OPENAI_API_KEY = "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"  # 테스트용

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY != "sk-test-key" else None

class AIRecommender:
    def __init__(self):
        self.db_config = {
            'host': os.getenv('RDB_HOST', 'amond-server.kro.kr'),
            'port': int(os.getenv('RDB_PORT', 3306)),
            'user': os.getenv('RDB_USER', 'root'),
            'password': os.getenv('RDB_PASSWORD', 'rootpassword'),
            'database': os.getenv('RDB_SCHEMA', 'hot_place_research'),
            'charset': 'utf8mb4',
            'cursorclass': pymysql.cursors.DictCursor
        }

        try:
            self.redis_client = redis.StrictRedis(
                host=os.getenv('REDIS_HOST', 'amond-server.kro.kr'),
                port=int(os.getenv('REDIS_PORT', 6379)),
                password=os.getenv('REDIS_PASSWORD', 'rootpassword'),
                db=0,
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5
            )
            # Redis 연결 테스트
            self.redis_client.ping()
            logger.info("Redis 연결 성공")
        except Exception as e:
            logger.error(f"Redis 연결 실패: {e}")
            self.redis_client = None

    def _get_db_connection(self):
        """DB 연결을 안전하게 생성"""
        try:
            return pymysql.connect(**self.db_config)
        except Exception as e:
            logger.error(f"DB 연결 실패: {e}")
            raise HTTPException(status_code=500, detail="데이터베이스 연결 실패")

    def generate_keywords(self, limit: int) -> List[str]:
        """OpenAI를 사용한 키워드 생성 (폴백 포함)"""
        if not client:
            return self._get_fallback_keywords(limit)

        prompt = (
            "맛집 추천 키워드를 한국어로 쉼표(,)로 구분하여 "
            f"총 {limit}개만 반환해주세요. 예: 한식,일식,양식,카페,디저트"
        )

        try:
            resp = client.chat.completions.create(
                model="gpt-3.5-turbo",  # 비용 최적화
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=min(limit * 10, 200),  # 토큰 제한
                timeout=10
            )
            text = resp.choices[0].message.content
            kws = [w.strip() for w in re.split(r"[,\n]+", text) if w.strip()]
            return kws[:limit] if kws else self._get_fallback_keywords(limit)
        except Exception as e:
            logger.error(f"OpenAI 키워드 생성 실패: {e}")
            return self._get_fallback_keywords(limit)

    def _get_fallback_keywords(self, limit: int) -> List[str]:
        """폴백 키워드 반환"""
        fallback = [
            "한식", "일식", "양식", "중식", "카페",
            "디저트", "치킨", "피자", "햄버거", "브런치",
            "샐러드", "초밥", "스테이크", "파스타", "샌드위치",
            "아시안", "멕시칸", "인도", "태국", "베트남"
        ]
        return fallback[:limit]

    def _fetch_all_restaurants(self) -> List[Dict]:
        """모든 맛집 데이터 조회"""
        conn = self._get_db_connection()
        try:
            with conn.cursor() as cur:
                # 필요한 컬럼만 선택하여 성능 향상
                cur.execute("""
                    SELECT
                        biz_name AS title,
                        road_addr AS address,
                        jibun_addr AS readAddress,
                        food_type,
                        naver_rating
                    FROM data
                    WHERE biz_name IS NOT NULL
                    AND road_addr IS NOT NULL
                    LIMIT 5000
                """)
                result = cur.fetchall()
                logger.info(f"DB에서 맛집 데이터: {len(result)}개 로드됨")
                return result
        except Exception as e:
            logger.error(f"DB 조회 실패: {e}")
            return []
        finally:
            conn.close()

    def generate_keywords_from_history(self, history: List[str], limit: int) -> List[str]:
        """사용자 히스토리 기반 키워드 생성"""
        if not client or not history:
            return self._get_fallback_keywords(limit)

        prompt = (
            f"사용자가 이전에 검색한 키워드: {', '.join(history[:5])}\n"
            f"이 사용자가 좋아할 만한 맛집 키워드를 {limit}개 추천해주세요."
        )

        try:
            resp = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=limit * 8,
                timeout=10
            )
            text = resp.choices[0].message.content
            kws = [w.strip() for w in re.split(r"[,\n]+", text) if w.strip()]
            return kws[:limit] if kws else self._get_fallback_keywords(limit)
        except Exception as e:
            logger.error(f"히스토리 기반 키워드 생성 실패: {e}")
            return self._get_fallback_keywords(limit)

    def recommend_restaurants(self, keyword: str) -> List[Dict]:
        """맛집 추천 (성능 최적화)"""
        if not keyword or keyword.strip() == "":
            logger.warning("빈 키워드로 추천 요청됨")
            return []

        keyword = keyword.strip()
        rows = self._fetch_all_restaurants()

        if not rows:
            logger.warning("DB에 맛집 데이터가 없습니다")
            return []

        # 단순 필터링으로 폴백 (성능 최적화)
        filtered = self._simple_filter_restaurants(rows, keyword)

        if len(filtered) >= 5:
            return filtered[:5]

        # OpenAI 사용 (필요시에만)
        if client and len(filtered) < 3:
            try:
                ai_result = self._ai_recommend_restaurants(rows, keyword)
                if ai_result:
                    return ai_result
            except Exception as e:
                logger.error(f"AI 추천 실패: {e}")

        return filtered[:5] if filtered else self._get_random_restaurants(rows, 5)

    def _simple_filter_restaurants(self, rows: List[Dict], keyword: str) -> List[Dict]:
        """단순 키워드 매칭으로 맛집 필터링"""
        filtered = []
        keyword_lower = keyword.lower()

        for row in rows:
            title = (row.get("title") or "").lower()
            food_type = (row.get("food_type") or "").lower()
            address = (row.get("address") or "").lower()

            if (keyword_lower in title or
                keyword_lower in food_type or
                any(word in title or word in food_type for word in keyword_lower.split())):

                filtered.append({
                    "title": row.get("title", ""),
                    "address": row.get("address", ""),
                    "readAddress": row.get("readAddress", ""),
                    "imageLinks": []
                })

                if len(filtered) >= 10:  # 충분한 결과 확보
                    break

        return filtered

    def _ai_recommend_restaurants(self, rows: List[Dict], keyword: str) -> List[Dict]:
        """AI 기반 맛집 추천 (최소한으로 사용)"""
        # 데이터 샘플링으로 API 비용 절약
        sample_size = min(100, len(rows))
        sampled_rows = rows[:sample_size]

        system_prompt = (
            f"키워드 '{keyword}'와 관련된 맛집 5곳을 JSON 형태로 추천해주세요.\n"
            "형식: [{\"title\":\"맛집명\",\"address\":\"주소\",\"readAddress\":\"지번주소\"}]\n"
            "반드시 5개를 선택해야 합니다."
        )

        user_prompt = json.dumps(sampled_rows, ensure_ascii=False)

        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",  # 비용 최적화
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.0,
            max_tokens=1000,
            timeout=15
        )

        text = resp.choices[0].message.content
        match = re.search(r"\[.*\]", text, re.DOTALL)

        if match:
            try:
                result = json.loads(match.group(0))
                for item in result:
                    item.setdefault("imageLinks", [])
                return result[:5]
            except json.JSONDecodeError:
                pass

        return []

    def _get_random_restaurants(self, rows: List[Dict], count: int) -> List[Dict]:
        """랜덤 맛집 반환"""
        import random
        sampled = random.sample(rows, min(count, len(rows)))
        return [{
            "title": row.get("title", ""),
            "address": row.get("address", ""),
            "readAddress": row.get("readAddress", ""),
            "imageLinks": []
        } for row in sampled]

# FastAPI 앱 설정
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AI 추천 서버 시작")
    yield
    logger.info("AI 추천 서버 종료")

app = FastAPI(
    title="AI Restaurant Recommender",
    description="최적화된 맛집 추천 AI 서버",
    version="2.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 모델 정의
class KeywordResponse(BaseModel):
    keywords: List[str] = Field(..., description="추천 키워드 목록")

class RecommendRequest(BaseModel):
    keyword: str = Field(..., description="추천받고 싶은 키워드", min_length=1)

class RecommendItem(BaseModel):
    title: str = Field(..., description="맛집명")
    address: str = Field(..., description="도로명주소")
    readAddress: str = Field(..., description="지번주소")
    imageLinks: List[str] = Field(default_factory=list, description="이미지 링크")

# 전역 추천기 인스턴스
recommender = AIRecommender()

@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy", "service": "ai-recommender"}

@app.get("/ai/keywords", response_model=KeywordResponse)
async def get_keywords(
    request: Request,
    limit: int = Query(10, ge=1, le=20, description="키워드 개수"),
    x_user_id: Optional[str] = Header(None, description="사용자 ID"),
):
    """키워드 추천 API"""
    try:
        user_key = f"user:{x_user_id or request.client.host}"
        history = []

        # Redis에서 히스토리 조회
        if recommender.redis_client:
            try:
                history = recommender.redis_client.lrange(user_key, 0, 9)
            except Exception as e:
                logger.warning(f"Redis 조회 실패: {e}")

        # 히스토리 기반 추천
        if len(history) >= 3:
            try:
                kws = recommender.generate_keywords_from_history(history, limit)
                return KeywordResponse(keywords=kws)
            except Exception as e:
                logger.error(f"히스토리 기반 추천 실패: {e}")

        # 일반 키워드 생성
        kws = recommender.generate_keywords(limit)
        return KeywordResponse(keywords=kws)

    except Exception as e:
        logger.error(f"키워드 생성 실패: {e}")
        return KeywordResponse(keywords=recommender._get_fallback_keywords(limit))

@app.post("/ai/recommend", response_model=List[RecommendItem])
async def recommend(
    req: RecommendRequest,
    request: Request,
    x_user_id: Optional[str] = Header(None, description="사용자 ID"),
):
    """맛집 추천 API"""
    try:
        # 키워드 검증
        if not req.keyword or not req.keyword.strip():
            raise HTTPException(status_code=400, detail="키워드가 비어있습니다")

        keyword = req.keyword.strip()
        ip = request.headers.get("X-Forwarded-For", str(request.client.host))
        user_key = f"user:{x_user_id or ip}"

        # Redis에 히스토리 저장
        if recommender.redis_client:
            try:
                recommender.redis_client.lpush(user_key, keyword)
                recommender.redis_client.ltrim(user_key, 0, 19)
                recommender.redis_client.expire(user_key, 86400)  # 24시간 TTL
            except Exception as e:
                logger.warning(f"Redis 저장 실패: {e}")

        # 맛집 추천
        result = recommender.recommend_restaurants(keyword)
        return [RecommendItem(**item) for item in result]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"추천 실패: {e}")
        raise HTTPException(status_code=500, detail=f"추천 처리 중 오류 발생: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "generate:app",
        host="0.0.0.0",
        port=8001,
        reload=False,  # 프로덕션에서는 False
        log_level="info"
    )
