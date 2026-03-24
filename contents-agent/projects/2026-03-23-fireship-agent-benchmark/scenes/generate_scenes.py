#!/usr/bin/env python3
"""씬 이미지 생성 — Gemini 3.1 Flash Image Preview API."""

import base64
import json
import os
import sys
import time

import requests

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    # .env 파일에서 로드
    env_path = "/Users/yoogeon/Agents/contents agent/.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    API_KEY = line.strip().split("=", 1)[1]

MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

PROJECT_DIR = "/Users/yoogeon/Agents/contents agent/projects/2026-03-23-fireship-agent-benchmark"
SCENES_DIR = os.path.join(PROJECT_DIR, "scenes")

# 스타일 프리셋
STYLE_PREFIX = """You are generating a scene image for a Korean YouTube video about AI agents.

STRICT STYLE RULES:
- Resolution: 1920x1080 (16:9 landscape)
- Background: dark navy #001C2F
- Primary accent: neon green #06E5AC
- Secondary: #16213e, Accent highlight: #4DFFD2
- Text color: #f1f1f1 (white)
- Style: MUI dark mode components, clean flat design, no gradients
- Typography: modern sans-serif, large bold headings
- NO emoji, NO cartoon characters, NO stock photo people
- Korean text must be accurate and clean (no garbled characters)
- Infographic/data visualization aesthetic
- Subtle glassmorphism on 1-2 card elements only
- Dark, professional, tech-forward mood
"""

SCENES = [
    {
        "id": "001",
        "title": "후킹 - 40% vs 90%",
        "prompt": """Scene showing a dramatic data comparison on dark navy background.

Left side: Large "40%" text in neon green (#06E5AC), appearing with a typing cursor effect
Right side: Large "90%" text in red (#FF4D4D), sliding in from the right
Between them: "vs" text fading in, creating tension

Bottom: A blinking CLI cursor on a terminal-style line
The numbers should be very large and bold, dominating the frame
Minimal other elements - let the numbers speak

Korean subtitle area at bottom with semi-transparent black background"""
    },
    {
        "id": "002",
        "title": "챗봇 vs 에이전트",
        "prompt": """Scene showing comparison between Chatbot and Agent as two MUI dark mode cards side by side.

LEFT CARD (smaller, simpler):
- Header: "챗봇" in Korean
- Icon: speech bubble / headset icon
- Label: "Q&A"
- Simple, one-directional flow

RIGHT CARD (larger, more complex):
- Header: "에이전트" in Korean
- Icon: person with tools
- Flow diagram drawn with SVG-style lines: "판단" → "실행" → "보고" (Judge → Execute → Report)
- The flow is animated/dynamic looking with arrows

Cards have subtle glassmorphism effect, sitting on #001C2F background
Neon green (#06E5AC) accent lines connecting elements
Clean, minimal infographic style"""
    },
    {
        "id": "003",
        "title": "2026년 폭발 - 3가지 이유",
        "prompt": """Scene with "2026" year text large and prominent in neon green (#06E5AC) at top center.

Below it, three MUI dark mode cards stacking vertically (1-2-3 order):

Card 1: "모델 성능" with a rising graph SVG icon, green upward arrow
Card 2: "표준 프로토콜" with a USB-C connector icon, multiple connectors merging into one
Card 3: "1,445%" with a counter-style number display, emphasizing dramatic growth

Each card has #16213e background with subtle border
Cards appear to be stacking from bottom to top
Neon green (#06E5AC) highlights on key numbers and icons
Dark navy #001C2F background
Clean data visualization aesthetic"""
    },
    {
        "id": "004",
        "title": "시장 현실 - 마케팅 vs 실제",
        "prompt": """Scene split into two sections on dark navy background.

LEFT: A CLI terminal window with command:
"$ reddit search 'AI agent' --sort=top"
Terminal shows scrolling comment snippets (Korean text, slightly blurred)
Terminal has typical dark theme with green text

RIGHT: A comparison diagram with two rows:
Top row labeled "마케팅" (Marketing): [챗봇] + [자동화] = "에이전트" with quotation marks, dull gray
Bottom row labeled "실제" (Reality): [판단] + [도구 사용] + [자율 실행] = 에이전트, highlighted with neon green (#06E5AC) border

The "실제" row is clearly emphasized as the correct version
Clean infographic layout, MUI card components"""
    },
    {
        "id": "005",
        "title": "기획자 렌즈 - 구조가 핵심",
        "prompt": """Scene with two layers on dark navy background.

TOP SECTION: Three small MUI cards in a row showing coding agent tools:
- "클로드코드" (Claude Code)
- "커서" (Cursor)
- "데빈" (Devin)
Each card is compact with a simple icon placeholder and one-line positioning text

BOTTOM SECTION (main focus): A line-drawing diagram showing:
[목적] → [조건] → [판단 기준] → [결과]
Connected by clean arrows, drawn in neon green (#06E5AC)

Below the complete diagram, a broken/disconnected version where lines are cut
labeled "자동완성" in red (#FF4D4D)

The diagram emphasizes that structure (briefs) determine outcome
Clean, minimal data visualization style"""
    },
    {
        "id": "006",
        "title": "오늘 해볼 것 - 브리프 작성",
        "prompt": """Scene with two elements on dark navy background.

LEFT (main): A MUI dark mode notepad/text editor UI
Three lines being typed with a blinking neon green cursor:
"1. 목적:"
"2. 판단 기준:"
"3. 완료 상태:"
Each line has the green cursor (#06E5AC) blinking effect
The notepad has a subtle glassmorphism background

RIGHT: A timeline SVG showing compression
A long bar labeled "2주" (2 weeks) compressing/shrinking into a short bar labeled "30분" (30 minutes)
With an arrow showing the transformation

Bottom text: "구조 > 도구" in neon green (#06E5AC), clean and bold
Professional, actionable feel"""
    },
    {
        "id": "007",
        "title": "마무리 - 설계가 먼저다",
        "prompt": """Scene showing convergence on dark navy background.

Floating keyword cards scattered across the frame:
"40% vs 90%", "구조", "브리프", "목적-기준-상태"
Each card is a small MUI chip/tag component

All cards are converging toward the center where a large statement appears:
"설계가 먼저다" (Design comes first)
This text has a neon green (#06E5AC) glow effect, prominent and bold

Bottom right: A channel logo placeholder area
A CLI-style text: "$ subscribe --channel" typed in terminal font
With a subscribe button icon pulsing in neon green

Clean, professional conclusion frame
The convergence creates a sense of summary and completion"""
    },
]

THUMBNAIL_PROMPT = """YouTube thumbnail for a Korean tech video, 1920x1080.

Dark navy background (#001C2F).
Large bold Korean text in center: "90% 실패" in white (#f1f1f1)
"AI 에이전트" text above in neon green (#06E5AC), slightly smaller

A subtle broken/glitching circuit board pattern in the background
One clean infographic element: a downward arrow or crash indicator in red (#FF4D4D)

EXTREMELY CLEAN, BOLD, READABLE IN 3 SECONDS
No emoji, no cartoon, no people
Professional tech aesthetic
Text must be crisp and large enough to read on mobile thumbnail size"""


def generate_image(prompt, output_path, retries=2):
    """Gemini API로 이미지 생성."""
    full_prompt = STYLE_PREFIX + "\n\n" + prompt

    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {
            "responseModalities": ["image", "text"]
        }
    }

    for attempt in range(retries + 1):
        try:
            resp = requests.post(API_URL, json=payload, timeout=120)
            resp.raise_for_status()
            result = resp.json()

            # 이미지 데이터 추출
            candidates = result.get("candidates", [])
            if not candidates:
                print(f"  응답에 candidates 없음")
                continue

            parts = candidates[0].get("content", {}).get("parts", [])
            for part in parts:
                if "inlineData" in part:
                    img_data = base64.b64decode(part["inlineData"]["data"])
                    with open(output_path, "wb") as f:
                        f.write(img_data)
                    size_kb = len(img_data) / 1024
                    print(f"  저장: {os.path.basename(output_path)} ({size_kb:.0f}KB)")
                    return True

            print(f"  이미지 데이터 없음 (텍스트만 반환)")
            if attempt < retries:
                time.sleep(3)
        except Exception as e:
            print(f"  에러: {e}")
            if attempt < retries:
                print(f"  재시도 {attempt+1}/{retries}...")
                time.sleep(5)
    return False


def main():
    if not API_KEY:
        print("GEMINI_API_KEY가 설정되지 않았습니다.")
        sys.exit(1)

    os.makedirs(SCENES_DIR, exist_ok=True)
    print(f"Gemini 3.1 Flash Image Preview로 씬 이미지 생성")
    print(f"모델: {MODEL}")
    print(f"씬 수: {len(SCENES)} + 썸네일 1")
    print("=" * 60)

    success = 0
    failed = []

    for scene in SCENES:
        sid = scene["id"]
        title = scene["title"]
        out_path = os.path.join(SCENES_DIR, f"scene-{sid}.png")
        print(f"\n[Scene {sid}] {title}")
        if generate_image(scene["prompt"], out_path):
            success += 1
        else:
            failed.append(sid)
        time.sleep(2)  # rate limit 방지

    # 썸네일
    print(f"\n[Thumbnail]")
    thumb_path = os.path.join(SCENES_DIR, "thumbnail.png")
    if generate_image(THUMBNAIL_PROMPT, thumb_path):
        success += 1
    else:
        failed.append("thumbnail")

    print(f"\n{'=' * 60}")
    print(f"완료: {success}/{len(SCENES)+1} 성공")
    if failed:
        print(f"실패: {failed}")
    else:
        print("모든 씬 + 썸네일 생성 완료")


if __name__ == "__main__":
    main()
