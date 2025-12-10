#!/bin/bash
# Cursor AI 백업 자동 시작 스크립트

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/backup_conversation.py"
LOG_FILE="$SCRIPT_DIR/backups/backup_service.log"

# 백업 디렉토리 생성
mkdir -p "$SCRIPT_DIR/backups"

# Python이 설치되어 있는지 확인
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3가 설치되어 있지 않습니다."
    exit 1
fi

# psutil이 설치되어 있는지 확인하고 없으면 설치
python3 -c "import psutil" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 psutil 라이브러리 설치 중..."
    pip3 install psutil
fi

# 백그라운드에서 실행
echo "🚀 Cursor AI 백업 서비스 시작..."
echo "📝 로그 파일: $LOG_FILE"
echo "🛑 중지하려면: pkill -f backup_conversation.py"

nohup python3 "$PYTHON_SCRIPT" >> "$LOG_FILE" 2>&1 &
BACKUP_PID=$!

echo "✅ 백업 서비스가 시작되었습니다. (PID: $BACKUP_PID)"
echo "💡 PID를 저장했습니다. 나중에 'kill $BACKUP_PID'로 중지할 수 있습니다."
echo "$BACKUP_PID" > "$SCRIPT_DIR/backups/.backup_pid"
