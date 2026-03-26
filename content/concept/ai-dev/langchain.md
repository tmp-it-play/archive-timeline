---
id: "ai-con-005"
title: "LangChain 프레임워크"
difficulty: "mid"
category: "ai_dev"
type: "concept"
---

## LangChain이란?

LLM 기반 애플리케이션을 빠르게 구축하기 위한 **Python/JavaScript 프레임워크**입니다. 2022년 Harrison Chase가 개발, 현재 LLM 생태계에서 가장 널리 사용됩니다.

## 핵심 개념

### Chain

여러 단계를 파이프라인으로 연결합니다.

```python
# LCEL (LangChain Expression Language) 방식
chain = prompt | llm | output_parser
result = chain.invoke({"topic": "MCP"})
```

### LCEL (LangChain Expression Language)

`|` 연산자로 컴포넌트를 선언적으로 연결하는 문법입니다. 스트리밍, 배치 처리, 병렬 실행을 자동 지원합니다.

### Agent

LangChain Agent는 LLM이 어떤 도구를 언제 사용할지 스스로 결정합니다.

```python
from langchain.agents import create_react_agent

agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
```

### Memory

대화 이력을 관리하는 컴포넌트입니다.

| 종류 | 특징 |
|------|------|
| `ConversationBufferMemory` | 전체 이력 저장 |
| `ConversationSummaryMemory` | 이력을 요약해 저장 |
| `VectorStoreRetrieverMemory` | 벡터 DB 기반 장기 기억 |

### Retriever / VectorStore

RAG(검색 증강 생성) 구현의 핵심입니다.

```python
vectorstore = Chroma.from_documents(docs, embedding)
retriever = vectorstore.as_retriever()

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
)
```

## LangChain vs 대안 프레임워크

| 프레임워크 | 특징 |
|-----------|------|
| **LangChain** | 가장 풍부한 생태계, 다소 복잡 |
| **LlamaIndex** | 데이터 인덱싱·RAG 특화 |
| **Haystack** | 엔터프라이즈 검색·QA 파이프라인 특화 |
| **LangGraph** | LangChain 기반, 상태 기계형 멀티 에이전트 |

## LangSmith

LangChain 앱의 추적·평가·디버깅 플랫폼. 프로덕션에서 체인 실행 과정을 시각화합니다.
