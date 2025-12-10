#!/bin/bash
# Cursor AI 백업 서비스 중지 스크립트

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/backups/.backup_pid"

if [ -f "$PID_FILE" ]; then
    BACKUP_PID=$(cat "$PID_FILE")
    if ps -p "$BACKUP_PID" > /dev/null 2>&1; then
        kill "$BACKUP_PID"
        echo "✅ 백업 서비스가 중지되었습니다. (PID: $BACKUP_PID)"
        rm "$PID_FILE"
    else
        echo "⚠️  백업 프로세스를 찾을 수 없습니다."
        rm "$PID_FILE"
    fi
else
    # PID 파일이 없으면 프로세스 이름으로 찾아서 종료
    pkill -f backup_conversation.py
    if [ $? -eq 0 ]; then
        echo "✅ 백업 서비스가 중지되었습니다."
    else
        echo "⚠️  실행 중인 백업 서비스를 찾을 수 없습니다."
    fi
fi
