# Comfozi 프론트엔드

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [파일 구조](#2-파일-구조)
3. [기술 스택](#3-기술-스택)
4. [기술적으로 고민했던 부분](#4-기술적으로-고민했던-부분)

---

# 1. 프로젝트 개요

## 1-1. 서비스 소개

기존 ComfoziAI 앞단에 추가되는 구매 증빙 인박스 검증 시스템입니다.

기존에 수작업으로 처리하던 구매 증빙 등록·검수 과정을 아래 흐름으로 자동화하여, 기존 ComfoziAI가 받을 수 있는 정형 데이터로 변환해주는 역할을 하는 시스템입니다.

> 파일/수기 입력 → 구조화 후보 생성 → 중복·누락·규격·단위 불일치 탐지 → 검수 인박스 → 사람의 수정/승인/반려 및 변경 이력 기록 → 승인 데이터 JSON+CSV 출력

- 접속 URL: https://mvp-hackathon-front-end.vercel.app/
- 화면 구성: 대시보드 → 데이터 등록 → 인박스(검수 대기열) → 상세 페이지 (총 4단계)

## 1-2. 프로젝트 목표

| 구분 | 내용 |
|---|---|
| 초기 목표 | 창업팀에서 제공한 목표(필수 요건) 100% 완료 |
| 중장기 목표 | 초기 목표 + 사용자에게 필요한 기능 추가 개발 |
| 최종 결과 | 필수 요건 8개 중 8개 완료(100%), 추가 요건(OCR) 외 9건의 부가 기능 추가 구현, 사용자 시나리오 전 구간 테스트 검증 완료 |

---

# 2. 파일 구조

```
src/
├── components/
│   ├── layout/     # 헤더 등 공통 레이아웃 (MainLayout + <Outlet />)
│   ├── ui/         # 재사용 UI 컴포넌트
│   └── inbox/      # 인박스 도메인 전용 컴포넌트
├── pages/          # 라우트 단위 화면
│   ├── dashboard/
│   ├── inbox/
│   ├── export-history/
│   └── register-page.jsx
├── hooks/
│   ├── queries/    # TanStack Query 조회 훅
│   ├── mutations/  # TanStack Query 변경 훅
│   └── inbox/      # 인박스 검색 파라미터 등 도메인 훅
├── services/api/   # axios 기반 API 함수 (엔드포인트별 파일)
├── constants/       # 쿼리 키 등 상수
├── types/          # JSDoc 타입 정의
└── locale/         # ko.json / en.json
```

---

# 3. 기술 스택

- **React 19** (Vite) + **TailwindCSS 4**
- **axios** — HTTP 클라이언트
- **recharts** — 대시보드 차트
- **TanStack Query** — 서버 상태 관리
- **react-router-dom** — 라우팅
- **i18next** — 다국어 (ko/en)

---

# 4. 기술적으로 고민했던 부분

## 4-1. 다국어 처리

- `i18next` + `react-i18next`로 화면의 문자열을 `t()` 키로 관리합니다 ([i18n.js](src/i18n.js))
- `ko.json` / `en.json` 리소스를 정적으로 번들에 포함합니다, `fallbackLng: "ko"`
- 브라우저 언어 자동으로 감지하는 대신 `localStorage`(`lang` 키) 기준으로 저장하도록 하여 새로고침 후에도 유지되도록 했습니다.

## 4-2. 업로드 파일 관리

[file-upload-section.jsx](src/components/ui/file-upload-section.jsx)에서 다음으로 구현했습니다.

- 확장자에 따라 처리: `xlsx/csv`는 바로 파싱 업로드로, `jpg/jpeg/png/pdf`는 OCR 미리보기 경로로 처리됩니다.
- 허용되지 않는 확장자는 서버 요청 하지 않습니다.
- 업로드 상태를 `processing → success/error`로 관리해 UI를 표시합니다
- 이미지 미리보기용 `URL.createObjectURL`을 화면 전환/파일 교체 시 `revokeObjectURL`로 메모리 누수를 방지했습니다.

## 4-3. OCR 결과 이미지 뷰어 (라이트박스)

OCR로 업로드한 원본 이미지를 확대해서 확인할 수 있도록 자체 라이트박스를 구현했습니다.

- 휠 스크롤 확대/축소, 더블클릭 확대/원복, 드래그 이동을 지원합니다.
- 확대 배율에 따라 드래그 가능 범위를 이미지 크기 기준으로 계산해 과도하게 벗어나지 않도록 제한했습니다.
- 사용자의 편의를 위해 `Esc` 키로 이미지 뷰어를 닫을 수 있습니다. 
