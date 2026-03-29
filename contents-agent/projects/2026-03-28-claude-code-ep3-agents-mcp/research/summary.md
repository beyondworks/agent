# EP.3 리서치 종합 — 에이전트와 MCP

## 핵심 수치

- MCP 공식 레지스트리: 2,000+ 서버 (비공식 포함 16,000+)
- OpenAI, Microsoft, Google, AWS 모두 MCP 채택
- Agent Teams: 최대 10개 서브에이전트 동시 실행
- 서브에이전트는 다른 서브에이전트 스폰 불가 (의도적 설계)
- MCP 도구 정의만으로 200K 컨텍스트의 18~33% 소비 가능
- TELUS: 500,000+ 직원 시간 절감, Advolve: 운영 시간 90% 감소

---

## 에이전트 시스템 요약

### 서브에이전트
- 독립 컨텍스트 윈도우에서 실행, 결과만 반환
- 내장: Explore(haiku), Plan, general-purpose, Bash
- 커스텀: `.claude/agents/` 에 마크다운 파일로 정의
- frontmatter: name, description, tools, model, isolation, memory 등

### Agent Teams (실험적)
- Team Lead가 태스크 분배, 팀원 간 직접 메시지 교환
- 서브에이전트와 달리 양방향 소통
- 비용 높음 (각자 Claude 인스턴스)

### Worktree 격리
- `isolation: worktree`로 독립 git worktree 할당
- 병렬 에이전트가 같은 코드베이스에서 충돌 없이 작업

---

## MCP 요약

### 세 가지 프리미티브
1. **Tools** — 모델이 호출하는 액션 (DB 쿼리, API 호출)
2. **Resources** — 앱이 제공하는 컨텍스트 데이터 (파일, 스키마)
3. **Prompts** — 사용자가 선택하는 대화 템플릿

### 전송 방식
- Stdio: 로컬 프로세스 간 표준 입출력
- Streamable HTTP: 원격 서버, OAuth 지원

### 주요 공식 서버
GitHub, Notion, Slack, Sentry, Stripe, Linear, Supabase, Vercel, Airtable, HubSpot, PayPal

### 보안
- OAuth 2.1 기반 인증
- 서드파티 서버는 Anthropic 검증 없음 — 프롬프트 인젝션 위험
- DB 연결은 읽기 전용 권한 권장

---

## "와" 포인트 (콘텐츠 훅)

1. **Slack 메시지 하나가 코드를 고친다** — 버그 리포트 → 자동 수정 → PR → Slack 알림
2. **10개 에이전트가 동시에 일한다** — tmux 분할 화면, 병렬 실행 비주얼
3. **200만 원짜리 작업을 만원에** — API $15,000 vs Max $100
4. **Figma→코드→DB→브라우저를 대화 하나로** — 컨텍스트 전환 0회
5. **에이전트가 자기 코드를 테스트하고 고친다** — Karpathy "처음으로 뒤처진다 느꼈다"
6. **비코더가 프로덕션 앱 배포** — PM이 자연어로 기능 구현

---

## 경쟁 차별점

| | Cursor | Windsurf | Claude Code |
|---|---|---|---|
| 강점 | 자동완성 1위 | 비용 효율 $15/월 | 대규모 멀티파일, MCP 오케스트레이션 |
| 약점 | 50파일 이상 컨텍스트 손실 | 프론티어 모델 BYOK | 자동완성 없음, 터미널 |
| MCP | 지원 | 지원 | 에이전트+MCP 오케스트레이션 |
| 자동화 | IDE 종속 | IDE 종속 | CI/CD, GitHub Actions 삽입 가능 |

---

## 한계점 (영상에서 언급할 것)

- 컨텍스트 토큰 잠식: MCP 3개 동시 활성화 시 72% 소비
- Agent Teams는 아직 실험적
- 에이전트 수에 비용 선형 비례
- 서드파티 MCP 보안 미검증
