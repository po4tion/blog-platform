---
description: '스마트한 커밋 메시지 생성 및 자동 커밋 실행'
allowed-tools:
  [
    'Bash(git add:*)',
    'Bash(git status:*)',
    'Bash(git commit:*)',
    'Bash(git diff:*)',
    'Bash(git log:*)',
    'Bash(git push:*)',
  ]
---

# Claude Command: 스마트 커밋

## 실행 프로세스

1. 현재 git 상태 확인
2. 스테이징된 파일이 있으면 해당 파일만, 없으면 모든 변경사항 분석
3. 여러 논리적 변경사항이 있으면 분할 제안
4. Conventional Commits + 이모지 형식으로 커밋 메시지 생성
5. 사용자 확인 후 커밋 실행

## 커밋 메시지 형식

`<이모지> <타입>: <설명>`

**타입별 이모지:**

- ✨ `feat`: 새로운 기능
- 🐛 `fix`: 버그 수정
- 📚 `docs`: 문서 변경
- 💎 `style`: 코드 포맷팅, 세미콜론 누락 등
- ♻️ `refactor`: 코드 리팩토링
- ⚡ `perf`: 성능 개선
- ✅ `test`: 테스트 추가/수정
- 🔧 `chore`: 빌드 프로세스, 도구 설정 등
- 🚨 `hotfix`: 긴급 수정
- 🎨 `ui`: UI/UX 개선
- 🔐 `security`: 보안 관련 변경

## 커밋 메시지 규칙

- 명령형 어조 사용 ("추가한다" X, "추가" O)
- 첫 줄은 72자 이내
- 원자적 커밋 (단일 목적)
- 관련 없는 변경사항은 분리

## 실행 단계

커밋 메시지 생성 후:

1. `git status` 로 상태 확인
2. 필요시 `git add` 실행
3. `git commit -m "<생성된 메시지>"` 실행
4. 성공/실패 상태 보고
5. 푸시 여부 확인 후 `git push` 실행 (선택사항)

## 특별 처리

- **BREAKING CHANGE**: 호환성 깨지는 변경시 footer에 명시
- **다중 파일**: 관련 파일들을 논리적으로 그룹화
- **의존성 변경**: package.json 변경시 자동으로 chore(deps) 타입 적용
