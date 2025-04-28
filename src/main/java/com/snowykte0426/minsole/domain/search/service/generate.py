#!/usr/bin/env python3
# generate.py

import argparse
import json
import re
import sys
import traceback

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

def generate_words(prompt: str, limit: int):
    # 1) 모델과 토크나이저 로드
    model_name = "skt/kogpt2-base-v2"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model     = AutoModelForCausalLM.from_pretrained(model_name).to(device)

    # 2) 입력 토크나이즈
    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    # 3) 텍스트 생성
    out = model.generate(
        **inputs,
        max_new_tokens=50,
        do_sample=True,
        top_k=50,
        temperature=0.7,
        pad_token_id=tokenizer.eos_token_id
    )

    # 4) 디코드 & 프롬프트 이후 텍스트만 취함
    text = tokenizer.decode(out[0], skip_special_tokens=True)
    generated = text[len(prompt):].strip()

    # 5) 단어 분리, 중복 제거, limit만큼
    tokens = re.split(r"[\s,]+", generated)
    words = []
    for w in tokens:
        if len(w) > 1 and w not in words:
            words.append(w)
        if len(words) >= limit:
            break

    return words

def main():
    parser = argparse.ArgumentParser(description="Generate Korean words with KoGPT2")
    parser.add_argument("--prompt", type=str, required=True,
                        help="생성 프롬프트, 예: '한국어 단어 10개:'")
    parser.add_argument("--limit", type=int, default=10,
                        help="추출할 단어 개수")
    args = parser.parse_args()

    try:
        result = generate_words(args.prompt, args.limit)
        # 항상 exit code 0, JSON만 출력
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(0)
    except Exception:
        # 에러도 JSON 형태로 출력
        err = traceback.format_exc()
        print(json.dumps({"error": err}), file=sys.stdout, ensure_ascii=False)
        sys.exit(0)

if __name__ == "__main__":
    main()