# Nano Banana Prompt Translator

씬 연출 지시서 + 대본 맥락을 Gemini 네이티브 이미지 생성에 최적화된 프롬프트로 변환한다.

## 트리거
- "이미지 생성", "씬 이미지", "nano banana", "캐릭터 이미지"

## 입력
- 캐릭터 레퍼런스 이미지 (Image/ 폴더)
- 대본 (나레이션 텍스트, 자막, 감정)
- 장면 설명 (배경색, 소품, 포즈)

## 프롬프트 구조 규칙

### 1. 레퍼런스 이미지 필수 첨부
Gemini `generate_content`에 레퍼런스 이미지를 항상 함께 전달한다.
캐릭터 일관성은 텍스트 프롬프트만으로는 유지 불가.

### 2. 프롬프트 구조 (순서 중요)
```
[REFERENCE INSTRUCTION]
→ "이 레퍼런스와 동일한 캐릭터, 동일한 아트 스타일로 새 이미지를 생성하라"

[CHARACTER LOCK]
→ 절대 변경 불가 요소 명시 (눈=작은 검은 점, 부리=주황, 몸체=크림색, 3/4 측면뷰)

[SCENE CONTEXT]
→ 대본에서 추출한 감정/상황 ("ChatGPT가 거짓말한다는 사실에 충격받은 표정")

[VISUAL DIRECTION]
→ 배경색, 소품, 포즈, 구도

[NEGATIVE CONSTRAINTS]
→ 금지 요소 (정면뷰 금지, 큰 눈 금지, 그라데이션 금지, 아웃라인 금지)
```

### 3. 캐릭터 락 (CHARACTER LOCK) 텍스트
```
MANDATORY character traits (DO NOT deviate):
- 3/4 side view, facing right
- Eyes: two TINY simple black filled dots (like periods), NO iris, NO white circle, NOT large
- Beak: flat orange/golden duck beak, slightly open
- Body: cream/off-white (#F5F0E8), smooth, NO feather texture
- Neck: long and slender, goose-like proportions
- Style: ultra-minimal flat vector, like a premium corporate mascot
- NO outlines on body, NO gradients, NO shadows on body
- Character fills ~40% of frame, positioned slightly off-center
```

### 4. 감정 표현 매핑
텍스트 기반 이미지 생성에서 미세한 표정 변화는 어렵다.
대신 **포즈 + 소품 + 배경색**으로 감정을 전달한다.

| 감정 | 표현 방법 |
|------|-----------|
| 놀람/충격 | 부리 크게 벌림 + 날개 벌림 + 빨간/주황 배경 |
| 설명/자신감 | 날개로 가리킴 + 헤드셋 착용 + 초록/파랑 배경 |
| 생각/고민 | 날개를 턱에 + 고개 살짝 숙임 + 보라/남색 배경 |
| 만족/마무리 | 커피 들기 + 살짝 미소(부리 각도) + 주황/파랑 배경 |
| 유머/장난 | 윙크(한쪽 눈 살짝 작게) + 엄지척 + 밝은 배경 |

### 5. API 호출 설정
- 모델: `gemini-2.5-flash-image`
- config: `response_modalities=['IMAGE', 'TEXT']`
- contents: `[ref_image_1, ref_image_2, prompt_text]`

## 출력
- 최적화된 프롬프트 텍스트 (영문)
- Gemini API 호출 시 레퍼런스 이미지와 함께 전달
