---
description: '스마트한 PR 생성 - 변경사항 분석 및 자동 PR 생성'
allowed-tools:
  [
    'Bash(git status:*)',
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Bash(git push:*)',
    'Bash(git branch:*)',
    'Bash(gh pr:*)',
  ]
---

# Claude Command: 스마트 PR 생성

## 실행 프로세스

1. 현재 브랜치와 base 브랜치 확인
2. 푸시되지 않은 커밋이 있으면 먼저 푸시
3. base 브랜치와의 diff 분석 (커밋 목록, 변경 파일)
4. PR 제목과 본문 자동 생성
5. 사용자 확인 후 PR 생성

## 사용법

```text
/pr                    # main 브랜치로 PR 생성
```

## PR 제목 형식

`<이모지> <타입>: <설명>`

**타입별 이모지:**

- ✨ `feat`: 새로운 기능
- 🐛 `fix`: 버그 수정
- 📚 `docs`: 문서 변경
- 💎 `style`: 코드 포맷팅
- ♻️ `refactor`: 코드 리팩토링
- ⚡ `perf`: 성능 개선
- ✅ `test`: 테스트 추가/수정
- 🔧 `chore`: 빌드 프로세스, 도구 설정 등
- 🎨 `ui`: UI/UX 개선

## PR 본문 형식

```markdown
## Summary

- 주요 변경사항 요약 (3-5개 bullet points)

## Changes

- 변경된 주요 파일/컴포넌트 목록

## Test plan

- [ ] 테스트 항목 1
- [ ] 테스트 항목 2
```

## 기본 Base 브랜치

**⚠️ 중요: 이 프로젝트의 기본 base 브랜치는 `main`입니다.**

- `/pr` → main 브랜치로 PR 생성 (기본)

## 실행 단계

1. `git status` 로 현재 상태 확인
2. `git branch` 로 현재 브랜치 확인
3. 푸시되지 않은 커밋이 있으면 `git push` 실행
4. `git log main..HEAD` 로 커밋 목록 확인 (기본: main)
5. `git diff main...HEAD --stat` 로 변경 파일 확인
6. 커밋 메시지에서 타입 추출 (feat, fix, docs, chore, refactor, style, perf, test)
7. PR 제목과 본문 생성
8. `gh pr create --base main --assignee @me --label <타입들>` 로 PR 생성
9. PR URL 반환

## 자동 설정

- **Assignee**: `@me` (PR 작성자 자동 할당)
- **Labels**: 커밋 타입에서 자동 추출하여 추가
  - `feat:` → `feat` 라벨
  - `fix:` → `fix` 라벨
  - `docs:` → `docs` 라벨
  - `chore:` → `chore` 라벨
  - `refactor:` → `refactor` 라벨
  - `style:` → `style` 라벨
  - `perf:` → `perf` 라벨
  - `test:` → `test` 라벨

## 특별 처리

- **단일 커밋**: 커밋 메시지를 PR 제목으로 사용
- **다중 커밋**: 변경사항을 분석하여 통합 제목 생성
- **이미 PR 존재**: 기존 PR URL 안내
- **노션 URL 제공**: PR 본문에 "Related Links" 섹션 추가하여 노션 링크 포함
- **base 브랜치 미지정**: main 브랜치를 기본으로 사용
