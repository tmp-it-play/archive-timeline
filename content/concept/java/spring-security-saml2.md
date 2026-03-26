---
id: "java-con-010"
title: "Spring Security에서 SAML 2.0은 어떻게 통합될까"
difficulty: "senior"
category: "java"
type: "concept"
---

## SAML 2.0이란?

SAML 2.0은 주로 엔터프라이즈 환경에서 사용하는 XML 기반 SSO 표준입니다.
서비스 제공자(SP)와 인증 제공자(IdP)가 인증 정보를 주고받습니다.

## Spring Security에서의 통합

Spring Security는 SAML 2.0 로그인 흐름을 지원합니다.
핵심은 애플리케이션이 SP 역할을 하고, 외부 IdP와 메타데이터/인증 요청/응답을 처리하는 것입니다.

## 기본 흐름

1. 사용자가 보호된 리소스 접근
2. Spring Security가 IdP로 인증 요청
3. IdP가 사용자 인증
4. SAML Response를 SP 애플리케이션으로 반환
5. Spring Security가 이를 검증하고 SecurityContext를 구성

## 중요한 포인트

- 메타데이터 교환
- 서명 검증
- Assertion 검증
- 사용자 식별값(NameID 등) 매핑

## 면접 포인트

- OAuth/OIDC와 다르게 SAML은 XML, Assertion, IdP/SP 개념이 핵심입니다.
- Spring Security는 이 흐름을 필터 체인 안에서 통합해 처리한다고 설명하면 좋습니다.
