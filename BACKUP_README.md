# Cursor AI 자동 백업 시스템

이 시스템은 Cursor AI와의 모든 대화 내용과 작업 내역을 자동으로 백업합니다.

## 🚀 빠른 시작

### 1. 필요한 라이브러리 설치
```bash
pip3 install -r requirements.txt
```

### 2. 백업 서비스 시작
```bash
./start_backup.sh
```

이제 백업 서비스가 백그라운드에서 실행되며, Cursor가 종료될 때마다 자동으로 백업이 생성됩니다.

### 3. 백업 서비스 중지 (필요시)
```bash
./stop_backup.sh
```

## 📋 주요 기능

### ✅ 자동 백업 시점
- **Cursor 종료 시**: Cursor 프로세스가 종료되면 자동으로 백업 실행
- **주기적 저장**: 1분마다 자동으로 백업 (설정 가능)
- **수동 저장**: 언제든지 수동으로 백업 가능

### 📁 백업 파일 위치
모든 백업 파일은 `backups/` 디렉토리에 저장됩니다:
- `backup_YYYY-MM-DD_HH-MM-SS.json`: JSON 형식 (전체 데이터)
- `backup_YYYY-MM-DD_HH-MM-SS.md`: 마크다운 형식 (읽기 쉬운 형식)

### 🕐 타임스탬프
모든 백업 파일은 **로컬 시간**을 기준으로 저장되므로, 백업 시간을 정확히 확인할 수 있습니다.

## 📝 백업 내용

각 백업 파일에는 다음 정보가 포함됩니다:

1. **타임스탬프**: 저장 시간 (로컬 시간)
2. **Git 상태**: 현재 프로젝트의 변경 사항
3. **최근 수정된 파일**: 최근 20개 파일의 수정 내역
4. **대화 내용**: Cursor AI와의 대화 데이터

## 🔧 사용 방법

### 수동 백업 실행
```bash
python3 backup_conversation.py save
```

### 백업 서비스 상태 확인
```bash
ps aux | grep backup_conversation.py
```

### 백업 로그 확인
```bash
tail -f backups/backup_service.log
```

## 🔄 복구 방법

데이터 손실 시 다음 단계로 복구할 수 있습니다:

1. **백업 파일 확인**
   ```bash
   ls -lt backups/*.md
   ```

2. **최신 백업 파일 열기**
   - 마크다운 파일(`.md`)을 열어 읽기 쉬운 형식으로 확인
   - JSON 파일(`.json`)을 열어 상세 데이터 확인

3. **Git 상태 복구**
   - 백업 파일의 Git 상태를 확인하여 변경된 파일 목록 파악
   - 필요한 파일을 수동으로 복구

4. **최근 수정 파일 확인**
   - 백업 파일에 포함된 최근 수정 파일 목록을 확인하여 작업 내역 추적

## ⚙️ 설정 변경

`backup_conversation.py` 파일에서 다음 설정을 변경할 수 있습니다:

- `BACKUP_INTERVAL`: 주기적 백업 간격 (초 단위, 기본값: 60초)
- `BACKUP_DIR`: 백업 디렉토리 경로

## 📌 주의사항

- 백업 파일은 `backups/` 디렉토리에 저장되며, `.gitignore`에 포함되어 Git에 커밋되지 않습니다.
- 백업 서비스는 백그라운드에서 실행되므로, 컴퓨터를 재시작하면 수동으로 다시 시작해야 합니다.
- macOS에서 자동 시작하려면 `launchd`를 사용하여 설정할 수 있습니다.

## 🛠️ 문제 해결

### 백업 서비스가 시작되지 않는 경우
1. Python3가 설치되어 있는지 확인: `python3 --version`
2. psutil 라이브러리가 설치되어 있는지 확인: `pip3 list | grep psutil`
3. 실행 권한이 있는지 확인: `ls -l start_backup.sh`

### Cursor 프로세스를 찾을 수 없는 경우
- `backup_conversation.py`의 `CURSOR_PROCESS_NAME` 변수를 확인하고 필요시 수정하세요.

## 📞 추가 도움말

자세한 내용은 `backups/README.md`를 참조하세요.
