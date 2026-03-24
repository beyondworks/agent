#!/bin/bash
# Voicebox TTS 서버 watchdog — 서버 다운 시 자동 재시작
# 사용법: ./voicebox-watchdog.sh [--once] (--once: 1회 체크 후 종료)
#
# 동작: 30초 간격으로 헬스체크, 3회 연속 실패 시 서버 재시작
# 로그: ~/Library/Logs/voicebox-watchdog.log

VOICEBOX_BIN="/Users/yoogeon/Projects/Voicebox.app/Contents/MacOS/voicebox-server"
VOICEBOX_DATA="$HOME/Library/Application Support/sh.voicebox.app"
VOICEBOX_PORT=17493
VOICEBOX_URL="http://127.0.0.1:$VOICEBOX_PORT"
LOG_FILE="$HOME/Library/Logs/voicebox-watchdog.log"
CHECK_INTERVAL=30
FAIL_THRESHOLD=3
MODE="${1:-}"

fail_count=0

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_health() {
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$VOICEBOX_URL/" 2>/dev/null)
  [ "$status" = "200" ]
}

start_server() {
  log "서버 시작 중..."

  # 기존 프로세스 정리
  local existing_pid
  existing_pid=$(lsof -iTCP:$VOICEBOX_PORT -sTCP:LISTEN -t 2>/dev/null)
  if [ -n "$existing_pid" ]; then
    log "기존 프로세스(PID $existing_pid) 종료"
    kill "$existing_pid" 2>/dev/null
    sleep 2
  fi

  # GUI 없이 서버만 독립 실행
  nohup "$VOICEBOX_BIN" \
    --data-dir "$VOICEBOX_DATA" \
    --port "$VOICEBOX_PORT" \
    >> "$LOG_FILE" 2>&1 &

  local new_pid=$!
  log "서버 시작됨 (PID $new_pid)"

  # 시작 확인 (최대 15초 대기)
  for i in $(seq 1 15); do
    sleep 1
    if check_health; then
      log "서버 정상 확인 (${i}초 후)"
      return 0
    fi
  done

  log "서버 시작 실패 (15초 타임아웃)"
  return 1
}

run_check() {
  if check_health; then
    if [ "$fail_count" -gt 0 ]; then
      log "서버 복구 확인 (이전 실패 ${fail_count}회)"
    fi
    fail_count=0
  else
    fail_count=$((fail_count + 1))
    log "헬스체크 실패 ($fail_count/$FAIL_THRESHOLD)"

    if [ "$fail_count" -ge "$FAIL_THRESHOLD" ]; then
      log "연속 ${FAIL_THRESHOLD}회 실패 — 서버 재시작"
      start_server
      fail_count=0
    fi
  fi
}

# 메인
log "Watchdog 시작 (간격: ${CHECK_INTERVAL}초, 임계: ${FAIL_THRESHOLD}회)"

if [ "$MODE" = "--once" ]; then
  run_check
  exit $?
fi

while true; do
  run_check
  sleep "$CHECK_INTERVAL"
done
