# Claude Code 2026년 3월 업데이트 리서치

> 리서치 일자: 2026-03-24
> 대상 기간: 2026년 3월 4일 ~ 3월 21일
> 버전 범위: v2.1.68 ~ v2.1.81 (약 13개 릴리스)

---

## 1. 핵심 대형 업데이트 (영상 메인 토픽)

### 1-1. Voice Mode (음성 모드)

- **릴리스**: 3월 중 점진적 롤아웃 (v2.1.69에서 10개 언어 추가)
- **기능**: `/voice` 명령으로 활성화. 스페이스바를 누르고 있으면 녹음, 떼면 전송하는 Push-to-Talk 방식
- **지원 언어**: 기존 10개 + 신규 10개 = 총 20개 언어 (러시아어, 폴란드어, 터키어, 네덜란드어, 우크라이나어, 그리스어, 체코어, 덴마크어, 스웨덴어, 노르웨이어 추가)
- **비개발자 관점**: 코드를 모르는 기획자/디자이너도 음성으로 Claude에게 작업을 지시할 수 있어 접근성이 크게 향상됨
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog), [Claude Code March 2026 All Updates](https://pasqualepillitteri.it/en/news/381/claude-code-march-2026-updates)

### 1-2. Claude Code Channels (텔레그램/디스코드 연동)

- **릴리스**: 2026년 3월 20일 (v2.1.80~81, Research Preview)
- **기능**: `--channels` 플래그로 활성화. 텔레그램이나 디스코드에서 실행 중인 Claude Code 세션에 메시지를 보낼 수 있음. 로컬 머신의 파일시스템, MCP, git 접근 권한을 그대로 유지하면서 메신저 앱을 통해 응답을 받음
- **기술 구현**: MCP(Model Context Protocol) 기반 플러그인 아키텍처. 향후 Slack, WhatsApp 등 확장 가능
- **요구 사항**: Claude Code v2.1.80 이상, claude.ai 계정 (Pro, Max, Enterprise)
- **비개발자 관점**: 외출 중에도 휴대폰 메신저로 Claude에게 코드 작업을 지시하고 결과를 받을 수 있음
- **출처**: [VentureBeat](https://venturebeat.com/orchestration/anthropic-just-shipped-an-openclaw-killer-called-claude-code-channels), [Claude Code Docs - Channels](https://code.claude.com/docs/en/channels), [techbuddies.io](https://www.techbuddies.io/2026/03/21/anthropics-claude-code-channels-bring-always-on-ai-coding-to-telegram-and-discord/)

### 1-3. 1M Context Window (100만 토큰 컨텍스트 창)

- **릴리스**: 2026년 3월 13일 (v2.1.75)
- **기능**: Opus 4.6 모델에서 기본 100만 토큰 컨텍스트 윈도우 제공. Max, Team, Enterprise 플랜에서 기본 활성화
- **이전 대비**: 기존 200K 제한에서 5배 확대
- **비개발자 관점**: 전체 코드베이스를 한번에 이해시킬 수 있어 맥락을 잃지 않고 대규모 프로젝트 작업이 가능해짐
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog), [Releasebot](https://releasebot.io/updates/anthropic/claude-code)

### 1-4. /loop 명령어 (반복 실행 스케줄러)

- **릴리스**: 2026년 3월 7일 (v2.1.71)
- **기능**: `/loop 5m check the deploy` 형태로 지정한 간격마다 Claude가 자동으로 프롬프트를 실행. 세션 내 경량 크론 작업 역할
- **제한**: 세션 종료 시 사라짐. 최대 50개 동시 스케줄, 생성 후 3일 뒤 자동 만료
- **활용 사례**: 배포 모니터링, PR 감시, 장시간 빌드 체크, 리마인더
- **비개발자 관점**: "5분마다 배포 상태 확인해줘"처럼 자연어로 반복 모니터링을 설정할 수 있음
- **출처**: [Claude Code Docs - Scheduled Tasks](https://code.claude.com/docs/en/scheduled-tasks), [WinBuzzer](https://winbuzzer.com/2026/03/09/anthropic-claude-code-cron-scheduling-background-worker-loop-xcxwbn/)

### 1-5. /effort 명령어 (모델 노력 수준 제어)

- **릴리스**: 2026년 3월 14일 (v2.1.76)
- **기능**: Low(빠른 답변, 기호 ○) / Medium(균형 잡힌 기본값, 기호 ◐) / High(심층 분석, 기호 ●) 3단계로 모델의 사고 깊이를 조절. 프롬프트에 "ultrathink" 키워드를 넣으면 일시적으로 High 활성화
- **비개발자 관점**: 간단한 질문에는 빠르게, 복잡한 분석에는 깊게 응답하도록 직접 조절 가능
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

### 1-6. MCP Elicitation (MCP 대화형 입력 요청)

- **릴리스**: 2026년 3월 14일 (v2.1.76)
- **기능**: MCP 서버가 작업 도중 사용자에게 구조화된 입력을 요청할 수 있음. 대화형 폼을 표시하거나 브라우저 URL을 열어 필요한 데이터를 수집
- **관련 훅**: `Elicitation`, `ElicitationResult` 훅으로 응답 가로채기/재정의 가능
- **비개발자 관점**: AI가 작업 중 추가 정보가 필요하면 폼으로 물어보므로, 자연스러운 대화형 워크플로우가 가능
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

---

## 2. 모델 업데이트

### Opus 4.6 기본 모델 전환

- **시점**: 2026년 3월 4일 (v2.1.68)부터 기본 모델로 설정
- **출시일**: 2026년 2월 5일 (Opus 4.6), 2월 17일 (Sonnet 4.6)
- **주요 변경**:
  - 기본 노력 수준: "medium"
  - Opus 4.0, 4.1은 1st party API에서 제거
  - Sonnet 4.5 사용자는 자동으로 Sonnet 4.6으로 마이그레이션 (Pro/Max/Team Premium)

### 출력 토큰 한도 증가 (v2.1.77, 3월 17일)

- Opus 4.6 기본 최대 출력: **64K 토큰**
- Opus 4.6 / Sonnet 4.6 상한: **128K 토큰**

### 현재 모델 라인업 (2026년 3월 기준)

| 모델 | 용도 | 입력 가격 (/M) | 출력 가격 (/M) |
|------|------|----------------|----------------|
| Opus 4.6 | 최고 성능 | $5.00 | $25.00 |
| Sonnet 4.6 | 균형 (속도+지능) | $3.00 | $15.00 |
| Haiku 4.5 | 최고 속도 | $0.25 | $1.25 |

- **참고**: Claude Haiku 3은 2026년 4월 19일 퇴역 예정
- **출처**: [Claude API Pricing (TLDL)](https://www.tldl.io/resources/anthropic-api-pricing), [Models Overview](https://platform.claude.com/docs/en/about-claude/models/overview)

---

## 3. 구독/가격 관련

### 구독 플랜 (변동 없음)

| 플랜 | 가격 | Claude Code 포함 |
|------|------|------------------|
| Pro | $20/월 | O |
| Max 5x | $100/월 | O (5배 사용량) |
| Max 20x | $200/월 | O (20배 사용량) |

### 3월 사용량 프로모션

- **기간**: 2026년 3월 13일 ~ 3월 28일 23:59 PT
- **내용**: 한시적 사용량 한도 증가 (프로모션 종료 후 기본 한도로 복귀)
- **출처**: [Claude Help Center - March 2026 Usage Promotion](https://support.claude.com/en/articles/14063676-claude-march-2026-usage-promotion)

---

## 4. 새로운 명령어 및 기능

### /color (세션 색상 커스터마이징)

- **릴리스**: v2.1.75 (3월 13일)
- **기능**: 현재 세션의 프롬프트 바 색상을 설정. 병렬 작업 세션을 시각적으로 구분
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

### /remote-control (원격 제어)

- **릴리스**: v2.1.79 (3월 19일, VSCode)
- **기능**: VSCode에서 세션을 claude.ai/code로 브릿지하여 브라우저나 휴대폰에서 이어서 작업 가능
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

### --bare 플래그 (스크립트용 경량 실행)

- **릴리스**: v2.1.81 (3월 20일)
- **기능**: 스크립트에서 `-p` 호출 시 hooks, LSP, 플러그인 동기화, 스킬 디렉토리 워크를 건너뛰어 빠르게 실행
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

### --channels 권한 릴레이

- **릴리스**: v2.1.81 (3월 20일)
- **기능**: 채널 서버가 도구 승인 프롬프트를 휴대폰으로 전달. 외출 중에도 도구 사용 권한 승인 가능
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

### -n / --name 플래그 (세션 이름 지정)

- **릴리스**: v2.1.76 (3월 14일)
- **기능**: 시작 시 세션에 표시 이름을 지정. 여러 세션을 관리할 때 유용
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

### /context 개선 (컨텍스트 최적화 제안)

- **릴리스**: v2.1.74 (3월 12일)
- **기능**: 컨텍스트를 많이 차지하는 도구, 메모리 비대화, 용량 경고를 식별하고 구체적인 최적화 팁 제공
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

---

## 5. Hooks 및 자동화 기능

### 새로운 Hook 이벤트

| Hook | 버전 | 설명 |
|------|------|------|
| `StopFailure` | v2.1.78 (3/18) | API 에러(레이트 리밋, 인증 실패 등)로 턴 종료 시 발동 |
| `InstructionsLoaded` | v2.1.77 (3/17) | CLAUDE.md, `.claude/rules/*.md` 파일이 컨텍스트에 로드될 때 발동 |
| `PostCompact` | v2.1.76 (3/14) | 컨텍스트 압축(compaction) 완료 후 발동 |
| `Elicitation` / `ElicitationResult` | v2.1.76 (3/14) | MCP 서버의 대화형 입력 요청 가로채기/재정의 |

### 플러그인 시스템 개선

- **`${CLAUDE_PLUGIN_DATA}` 변수** (v2.1.78): 플러그인 업데이트에서도 유지되는 영구 상태 디렉토리
- **`source: 'settings'` 플러그인 소스** (v2.1.80): settings.json에 플러그인을 인라인으로 선언 가능
- **`/reload-plugins` 명령** (v2.1.69): 재시작 없이 플러그인 변경 적용
- **effort 프론트매터** (v2.1.80): 스킬과 슬래시 명령에서 모델 노력 수준 재정의 가능
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

---

## 6. 성능 및 안정성 개선

### 메모리/성능 최적화 (누적)

| 개선 사항 | 버전 |
|-----------|------|
| 대규모 저장소 시작 시 ~80MB 메모리 절약 | v2.1.80 |
| macOS 시작 ~60ms 단축 (키체인 병렬 읽기) | v2.1.77 |
| --resume 시 최대 45% 빠른 로딩, ~100-150MB 메모리 절약 | v2.1.77 |
| 시작 시 ~18MB 메모리 절약 | v2.1.79 |
| 기본 메모리 ~16MB 감소 | v2.1.69 |
| 번들 크기 ~510KB 감소 | v2.1.72 |
| 프롬프트 입력 재렌더링 ~74% 감소 | v2.1.70 |
| 시작 시 ~426KB 메모리 감소 | v2.1.70 |

### 주요 버그 수정

- OAuth 동시 세션 재인증 문제 해결 (v2.1.81)
- 음성 모드 WebSocket 장애 복구 (v2.1.80, 81)
- 스트리밍 API 응답 버퍼 메모리 누수 해결 (v2.1.74)
- `--resume` 시 병렬 도구 결과 누락 해결 (v2.1.80)
- 자동 업데이터 수십 GB 메모리 누적 버그 해결 (v2.1.77)
- RTL 텍스트 (히브리어, 아랍어) 렌더링 수정 (v2.1.74)
- CJK 문자 UI 요소 침범 수정 (v2.1.77)

---

## 7. 보안

- **샌드박스 의존성 누락 시 경고 표시** (v2.1.78): 이전에는 샌드박스가 조용히 비활성화되던 것을 시각적 경고로 변경
- **심링크 우회 취약점 수정** (v2.1.69): 심링크된 상위 디렉토리를 통해 작업 디렉토리를 벗어나 파일 쓰기가 가능했던 문제 해결
- **gitignore 디렉토리 스킬 로딩 차단** (v2.1.69): 중첩 스킬 탐색이 gitignore된 디렉토리에서 스킬을 로드하던 보안 문제 수정
- **출처**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog)

---

## 8. 영상 구성 제안

### 추천 토픽 순서 (6~8분 영상)

1. **인트로** (30초): 3월에만 13개 릴리스, 100개 이상의 변경사항이 쏟아진 Claude Code
2. **Voice Mode** (1분): 음성으로 코딩 지시 - 스페이스바 하나로 작동, 데모
3. **Claude Code Channels** (1.5분): 텔레그램/디스코드로 어디서든 Claude에게 코딩 지시 - "OpenClaw 킬러"
4. **1M Context + Opus 4.6** (1분): 100만 토큰 컨텍스트 + 64K 출력, 전체 코드베이스를 한번에
5. **/loop + /effort** (1분): 자동 반복 모니터링 + 사고 깊이 조절
6. **MCP Elicitation** (1분): AI가 작업 중 폼으로 추가 정보 요청
7. **성능 + 그 외** (1분): /color, /context 개선, 메모리 최적화 종합
8. **아웃트로** (30초): 가격 변동 없음, 3월 프로모션 언급

---

## 9. 전체 소스 목록

- [Claude Code 공식 Changelog](https://code.claude.com/docs/en/changelog)
- [Claude Code GitHub Releases](https://github.com/anthropics/claude-code/releases)
- [Claude Code March 2026: All Updates (pasqualepillitteri.it)](https://pasqualepillitteri.it/en/news/381/claude-code-march-2026-updates)
- [Releasebot - Claude Code](https://releasebot.io/updates/anthropic/claude-code)
- [VentureBeat - Claude Code Channels](https://venturebeat.com/orchestration/anthropic-just-shipped-an-openclaw-killer-called-claude-code-channels)
- [techbuddies.io - Claude Code Channels](https://www.techbuddies.io/2026/03/21/anthropics-claude-code-channels-bring-always-on-ai-coding-to-telegram-and-discord/)
- [Claude Code Docs - Scheduled Tasks](https://code.claude.com/docs/en/scheduled-tasks)
- [WinBuzzer - /loop](https://winbuzzer.com/2026/03/09/anthropic-claude-code-cron-scheduling-background-worker-loop-xcxwbn/)
- [Claude API Pricing (TLDL)](https://www.tldl.io/resources/anthropic-api-pricing)
- [Models Overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Claude Help Center - March 2026 Usage Promotion](https://support.claude.com/en/articles/14063676-claude-march-2026-usage-promotion)
- [Claude Help Center - Release Notes](https://support.claude.com/en/articles/12138966-release-notes)
- [Anthropic - Enabling Claude Code to Work More Autonomously](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously)
- [Claude Code Channels Setup Guide (claudefast)](https://claudefa.st/blog/guide/development/claude-code-channels)
