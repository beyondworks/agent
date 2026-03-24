#!/bin/bash
# Voicebox TTS 서버 헬스체크
# 사용법: ./voicebox-healthcheck.sh [--quiet]

VOICEBOX_URL="http://127.0.0.1:17493"
QUIET="${1:-}"

check_health() {
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$VOICEBOX_URL/" 2>/dev/null)
  echo "$status"
}

status=$(check_health)

if [ "$status" = "200" ]; then
  [ "$QUIET" != "--quiet" ] && echo "[OK] Voicebox 서버 정상 (HTTP $status)"
  exit 0
else
  [ "$QUIET" != "--quiet" ] && echo "[FAIL] Voicebox 서버 응답 없음 (HTTP $status)"
  exit 1
fi
