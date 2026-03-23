export const QUALITY_EVALUATION_SYSTEM = `당신은 영상 콘텐츠 품질 평가 전문가입니다.

이 채널의 캐릭터: "브랜드를 만들던 사람이, AI로 제품을 만들기 시작하면서 깨달은 것들을 정리하는 채널"
타겟: 기획자/디자이너/마케터/1인 사업자 (비개발자)

대본을 아래 5개 카테고리 + 26항목 체크리스트로 평가하세요.`;

export function getQualityEvaluationPrompt(params: {
  fullScript: string;
  scenes: Array<{ scene_number: number; narration: string; visual_desc: string; duration_sec: number }>;
  contentType: 'short_form' | 'long_form';
}) {
  const firstScene = params.scenes[0];
  const totalDuration = params.scenes.reduce((sum, s) => sum + s.duration_sec, 0);

  return `전체 대본:
${params.fullScript}

첫 씬 나레이션:
${firstScene?.narration ?? ''}

씬 수: ${params.scenes.length}개
총 길이: ${totalDuration}초
콘텐츠 유형: ${params.contentType === 'short_form' ? '숏폼' : '롱폼'}

시각적 설명 목록:
${params.scenes.map((s) => `씬 ${s.scene_number}: ${s.visual_desc}`).join('\n')}

## 평가 기준

### 5개 카테고리 점수
- hook (0-20): 후킹 — 결론/역설을 먼저 던지는가, 선언형인가, "어? 왜?"를 유발하는가
- storytelling (0-25): 구조 — 후킹→번호매기기→정리→행동제시 패턴, 원리→비유→사례 전개, 중간 정리 포함
- density (0-20): 밀도 — ${params.contentType === 'short_form' ? '분당 3-5개' : '분당 2-3개'} 키포인트, 항목마다 "실제로는 이렇게 된다" 포함
- cta (0-15): 행동 제시 — "오늘 당장 해볼 수 있는 것 하나", 구독/좋아요는 마지막에 한 번만
- visual (0-20): 시각화 — 3~5초마다 시각 변화, 빈 화면 0%, 텍스트/아이콘/차트 항상 존재

### 26항목 체크리스트 (필수 7개 ★)
포지셔닝:
- A1★ 니치를 한 문장으로 소유한다 ("기획자를 위한 AI 실무 해석 채널")
- A2 타겟이 구체적이다 (모두를 위한 영상이 아닌가)
- A3★ 본인이 실제로 그 일을 하고 있다 (1인칭 경험 포함)
- A4 비개발자 진입 가능 (기술 용어에 맥락 있는가)

콘텐츠 구조:
- B5★ 결과물이 영상 안에서 보인다 (시연/스크린샷/다이어그램)
- B6 구조가 예측 가능하다 (후킹→번호매기기→정리→행동제시)
- B7 단계별로 따라할 수 있다 ("실제로는 이렇게 된다" 포함)
- B8 숫자/결과로 후킹한다 (구체적 대비: 2주→30분)
- B9★ 한 영상 = 한 주제

신뢰:
- C10 실적/경험을 드러낸다 (12년 설계 경력)
- C11 실패담을 먼저 꺼낸다
- C12 증명한다 (주장하면 보여주는가)
- C13 출처를 밝힌다

편집/비주얼:
- D14★ 3~5초마다 시각 변화
- D15 빈 화면 0%
- D16 썸네일이 3초 안에 읽힌다
- D17 제목과 썸네일이 보완 관계

차별화:
- G24 남이 안 보여주는 걸 보여준다
- G25 카테고리를 만들었다 ("기획자의 AI 해석")
- G26★ 해석이 있다 (Why/How/What next)

톤 Don't 체크:
- 근거 없는 위기감 조성 없는가
- 기술 용어를 설명 없이 던지지 않았는가
- 감탄사/추임새가 없는가
- 불특정 다수 깎아내리기 없는가
- "코딩 없이도 됩니다"식 말 없는가 (→ "설계가 필요하다"로)

다음 JSON 형식으로 응답하세요:
{
  "categories": {
    "hook": { "score": 0-20, "reason": "평가 이유" },
    "storytelling": { "score": 0-25, "reason": "평가 이유" },
    "density": { "score": 0-20, "reason": "평가 이유" },
    "cta": { "score": 0-15, "reason": "평가 이유" },
    "visual": { "score": 0-20, "reason": "평가 이유" }
  },
  "total": 0-100,
  "checklist": {
    "passed": ["통과한 필수 항목 코드"],
    "failed": ["미통과 필수 항목 코드와 이유"]
  },
  "suggestions": ["개선 제안 (구체적으로)"]
}`;
}
