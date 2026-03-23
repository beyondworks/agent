# VideoForge 영상 제작 파이프라인 상세 스펙

## 1. 대본 출력 포맷 (JSON Timeline)

대본은 렌더링 엔진이 해석 가능한 JSON 타임라인 데이터로 출력.

```json
{
  "video_metadata": {
    "title": "영상 제목",
    "target_audience": "타겟",
    "spicy_level": 50
  },
  "scenes": [
    {
      "scene_id": "S01",
      "narration": "나레이션 텍스트",
      "visual_prompt": "English visual description for image generation",
      "estimated_duration": 4.5,
      "transition": "zoom_in"
    }
  ]
}
```

## 2. 비주얼 스타일 제어 (Art Direction)

- **스타일 앵커링**: 레퍼런스 이미지를 Image Prompt / Style Reference로 지속 주입
- **Seed 고정**: 영상 전체 톤 일관성 위해 동일 Seed
- **네거티브 프롬프트**: 텍스트 깨짐, 손가락 기형, 워터마크 상시 포함
- **프롬프트 자동 보강**: "masterpiece, highly detailed, dramatic lighting" 자동 병합

### 스타일 카테고리
- 캐릭터 애니메이션 (2D/3D)
- 만화 스타일 (웹툰/코믹스)
- 실사 스타일 (시네마틱/다큐멘터리)
- 텍스트+아이콘 애니메이션 (인포그래픽/모션그래픽)
- 커스텀 (레퍼런스 이미지 기반)

## 3. Image-to-Video 파이프라인

1. Base Image: Gemini Flash Image로 씬별 고화질 이미지 일괄 생성
2. I2V: 이미지를 Veo 3의 시작 프레임으로 주입
3. Motion Control: 맥락별 모션 파라미터 (camera_pan, camera_zoom, motion_bucket)

## 4. TTS + 감정 맵핑

- 구두점/Spicy Level 분석 → TTS 감정 파라미터 동적 할당
- 오디오 타임스탬프 ms 단위 → 씬 영상 길이 = 오디오 길이

## 5. 자막 동기화

- Word-level 타임스탬프 → ASS/SRT 자동 생성
- 동적 타이포그래피: 볼륨 피크 시 자막 크기 변화, 글자 단위 하이라이팅
- **한글 텍스트는 이미지에 넣지 않고 ASS 자막 오버레이로만 구현**

## 6. Auto-QC

- Policy Check: 유튜브 노란 딱지 키워드 검증
- Sync Check: 비디오-오디오 길이 오차 0.5초 이내
- Visual Check: 렌더링 실패/검은 화면 해시 검사

## 7. FFmpeg 렌더링

- 씬별 영상을 TTS 길이에 맞춰 트림/루프
- 트랜지션 (Crossfade) concat
- BGM Audio Ducking (TTS 시 볼륨 다운)
- ASS 자막 오버레이
- H.264 + AAC, YouTube 권장 규격
