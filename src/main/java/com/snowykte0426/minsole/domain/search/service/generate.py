#!/usr/bin/env python3
import logging
import os
import re
import json
import pymysql
import redis
import uvicorn
from typing import List, Dict
from fastapi import FastAPI, HTTPException, Query, Header, Request
from pydantic import BaseModel
from openai import OpenAI

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    OPENAI_API_KEY = ""
client = OpenAI(api_key=OPENAI_API_KEY)

class AIRecommender:
    def __init__(self):
        self.db_config = dict(
            host='amond-server.kro.kr',
            port=3306,
            user='root',
            password='rootpassword',
            database='hot_place_research',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        self.redis_client = redis.StrictRedis(
            host='amond-server.kro.kr',
            port=6379,
            password="rootpassword",
            db=0,
            decode_responses=True
        )

    def generate_keywords(self, limit: int) -> List[str]:
        prompt = (
            "맛집 추천 키워드를 한국어로 쉼표(,)로 구분하여 "
            f"총 {limit}개만 반환해주세요."
        )
        try:
            resp = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": prompt}],
                temperature=0.7,
                max_tokens=limit * 4
            )
            text = resp.choices[0].message.content
            kws = [w.strip() for w in re.split(r"[,\n]+", text) if w.strip()]
            return kws[:limit]
        except Exception as e:
            raise RuntimeError(f"OpenAI 키워드 생성 실패: {e}")

    def _fetch_all_restaurants(self) -> List[Dict]:
        conn = pymysql.connect(**self.db_config)
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT biz_name   AS title,
                           road_addr  AS address,
                           jibun_addr AS readAddress
                    FROM data
                """)
                return cur.fetchall()
        finally:
            conn.close()

    def generate_keywords_from_history(self, history: List[str], limit: int) -> List[str]:
        prompt = (
            f"사용자가 이전에 아래와 같은 키워드를 검색했습니다:\n"
            + ", ".join(history)
            + f"\n이 사용자에게 맛집 추천을 위해 유용할 키워드를 "
              f"한국어로 쉼표로 구분하여 {limit}개만 반환해주세요."
        )
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7,
            max_tokens=limit * 4,
        )
        text = resp.choices[0].message.content
        kws = [w.strip() for w in re.split(r"[,\n]+", text) if w.strip()]
        return kws[:limit]

    def recommend_restaurants(self, keyword: str) -> List[Dict]:
        rows = self._fetch_all_restaurants()
        if not rows:
            return []

        system_prompt = (
            "당신은 최고의 맛집 추천 큐레이터입니다. "
            "키워드 '{keyword}'들과 가장 연관성 높은 맛집 상위 5곳을 "
            "[{\"title\":\"...\",\"address\":\"...\",\"readAddress\":\"...\"}] "
            "형태의 JSON 리스트로 반환해주세요. "
            "키워드들을 하나로 보는 게 아니라 각각의 키워드로 각각의 맛집을 추천해주세요. "
            "(물론 여러 키워드가 동시에 충족된다면 그 맛집을 추천해도 됩니다.) "
            "단, 추천 맛집은 반드시 5개여야 하며, "
            "각 맛집의 title, address, readAddress는 반드시 포함되어야 합니다. "
            "가장 중요한 건 유사도가 높은 맛집을 추천하는 것, 예를 들어 키워드가 \"디저트\"라면 "
            "이름에 디저트가 들어가지 않아도 디저트 가게인 것 같은 곳을 추론하여 추천해주면 됩니다."
        )
        user_prompt = json.dumps(rows, ensure_ascii=False)

        print(f"DB에서 맛집 데이터: {len(rows)}개 로드됨")
        try:
            resp = client.chat.completions.create(
                model="gpt-4-32k",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.0,
                max_tokens=3200000,
            )
            text = resp.choices[0].message.content
            match = re.search(r"\[.*\]", text, re.DOTALL)
            if match:
                result = json.loads(match.group(0))
                for item in result:
                    item.setdefault("imageLinks", [])
                return result
        except Exception:
            pass

        # Fallback: 단순 필터링
        filtered = []
        for row in rows:
            if keyword in row["title"] or keyword in row["address"] or keyword in row["readAddress"]:
                filtered.append({**row, "imageLinks": []})
                if len(filtered) >= 5:
                    break
        return filtered

app = FastAPI(title="AI Restaurant Recommender (OpenAI GPT)")

class KeywordResponse(BaseModel):
    keywords: List[str]

class RecommendRequest(BaseModel):
    keyword: str

class RecommendItem(BaseModel):
    title: str
    address: str
    readAddress: str
    imageLinks: List[str]

recommender = AIRecommender()

@app.get("/ai/keywords", response_model=KeywordResponse)
async def get_keywords(
    request: Request,
    limit: int = Query(10, ge=1, le=20),
    x_user_id: str = Header(None),
):
    user_key = f"user:{x_user_id or request.client.host}"

    history = recommender.redis_client.lrange(user_key, 0, 9)

    if len(history) >= 3:
        try:
            kws = recommender.generate_keywords_from_history(history, limit)
            return {"keywords": kws}
        except Exception:
            pass

    fallback = [
        "도시락","디저트","한식","일식","양식",
        "초밥","아시안","샌드위치","샐러드","카페",
        "피자","치킨","햄버거","브런치","빵"
    ]
    return {"keywords": fallback[:limit]}

@app.post("/ai/recommend", response_model=List[RecommendItem])
async def recommend(
    req: RecommendRequest,
    request: Request,
):
    try:
        ip = request.headers.get("X-Forwarded-For", request.client.host)
        user_key = f"user:{ip}"

        recommender.redis_client.lpush(user_key, req.keyword)
        recommender.redis_client.ltrim(user_key, 0, 19)

        return recommender.recommend_restaurants(req.keyword)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("generate:app", host="0.0.0.0", port=8001)