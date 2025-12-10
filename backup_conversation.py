#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cursor AI 대화 내용 및 작업 내역 자동 백업 스크립트
Cursor 종료 시 자동으로 대화 내용과 작업 내역을 백업합니다.
"""

import os
import json
import time
import psutil
import subprocess
from datetime import datetime
from pathlib import Path
import shutil

# 설정
BACKUP_DIR = Path(__file__).parent / "backups"
CURSOR_PROCESS_NAME = "Cursor"  # macOS에서 Cursor 프로세스 이름
SESSION_LOG_FILE = BACKUP_DIR / "current_session.json"
BACKUP_INTERVAL = 60  # 초 단위 (1분마다 자동 저장)

def get_local_timestamp():
    """로컬 시간으로 타임스탬프 생성"""
    return datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

def ensure_backup_dir():
    """백업 디렉토리 생성"""
    BACKUP_DIR.mkdir(exist_ok=True)
    return BACKUP_DIR

def get_cursor_processes():
    """실행 중인 Cursor 프로세스 찾기"""
    cursor_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            proc_name = proc.info['name'] or ''
            if 'Cursor' in proc_name or 'cursor' in proc_name.lower():
                cursor_processes.append(proc)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return cursor_processes

def get_git_status():
    """Git 상태 정보 가져오기"""
    try:
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        return result.stdout.strip()
    except:
        return "Git 정보를 가져올 수 없습니다."

def get_recent_files():
    """최근 수정된 파일 목록 및 내용 가져오기"""
    project_root = Path(__file__).parent
    recent_files = []
    file_contents = {}
    
    for file_path in project_root.rglob('*'):
        if file_path.is_file() and not any(part.startswith('.') for part in file_path.parts):
            # 백업 디렉토리와 큰 바이너리 파일 제외
            if 'backups' in str(file_path) or file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip']:
                continue
            try:
                mtime = file_path.stat().st_mtime
                rel_path = str(file_path.relative_to(project_root))
                recent_files.append({
                    'path': rel_path,
                    'modified': datetime.fromtimestamp(mtime).isoformat(),
                    'size': file_path.stat().st_size
                })
                
                # 파일 내용 저장 (텍스트 파일만, 최대 500KB)
                if file_path.stat().st_size < 500 * 1024:  # 500KB 미만
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            file_contents[rel_path] = content
                    except:
                        pass  # 바이너리 파일이면 건너뛰기
            except:
                continue
    
    # 수정 시간 기준으로 정렬
    recent_files.sort(key=lambda x: x['modified'], reverse=True)
    return recent_files[:20], file_contents  # 최근 20개 파일만

def save_backup(conversation_data=None, reason="auto"):
    """백업 파일 저장"""
    backup_dir = ensure_backup_dir()
    timestamp = get_local_timestamp()
    
    recent_files, file_contents = get_recent_files()
    
    backup_data = {
        'timestamp': timestamp,
        'local_time': datetime.now().isoformat(),
        'reason': reason,
        'git_status': get_git_status(),
        'recent_files': recent_files,
        'file_contents': file_contents,  # 파일 내용 추가
        'conversation_data': conversation_data or {},
        'project_root': str(Path(__file__).parent)
    }
    
    # JSON 파일로 저장
    backup_file = backup_dir / f"backup_{timestamp}.json"
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(backup_data, f, ensure_ascii=False, indent=2)
    
    # 마크다운 형식으로도 저장 (읽기 쉽게)
    md_file = backup_dir / f"backup_{timestamp}.md"
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(f"# Cursor AI 백업 - {timestamp}\n\n")
        f.write(f"**로컬 시간**: {datetime.now().strftime('%Y년 %m월 %d일 %H시 %M분 %S초')}\n\n")
        f.write(f"**백업 사유**: {reason}\n\n")
        f.write(f"## Git 상태\n\n```\n{backup_data['git_status']}\n```\n\n")
        f.write(f"## 최근 수정된 파일 ({len(recent_files)}개)\n\n")
        for file_info in recent_files:
            f.write(f"- `{file_info['path']}` (수정: {file_info['modified']}, 크기: {file_info['size']} bytes)\n")
        f.write(f"\n## 백업된 파일 내용 ({len(file_contents)}개 파일)\n\n")
        f.write(f"백업 JSON 파일에 {len(file_contents)}개 파일의 내용이 저장되었습니다.\n\n")
        f.write(f"\n## 대화 내용\n\n")
        if conversation_data:
            f.write(f"```json\n{json.dumps(conversation_data, ensure_ascii=False, indent=2)}\n```\n")
    
    print(f"✅ 백업 완료: {backup_file}")
    print(f"✅ 마크다운 백업: {md_file}")
    print(f"📦 {len(file_contents)}개 파일 내용 저장됨")
    
    return backup_file, md_file

def monitor_cursor():
    """Cursor 프로세스 모니터링 및 자동 백업"""
    print("🔄 Cursor 프로세스 모니터링 시작...")
    print(f"📁 백업 디렉토리: {BACKUP_DIR}")
    
    last_backup_time = time.time()
    cursor_was_running = False
    
    try:
        while True:
            cursor_processes = get_cursor_processes()
            cursor_is_running = len(cursor_processes) > 0
            
            # Cursor가 실행 중일 때
            if cursor_is_running:
                if not cursor_was_running:
                    print("✅ Cursor가 시작되었습니다.")
                    cursor_was_running = True
                
                # 주기적으로 자동 백업
                current_time = time.time()
                if current_time - last_backup_time >= BACKUP_INTERVAL:
                    print(f"⏰ 주기적 백업 실행 ({datetime.now().strftime('%H:%M:%S')})...")
                    save_backup(reason="주기적 자동 저장")
                    last_backup_time = current_time
            
            # Cursor가 종료되었을 때
            elif cursor_was_running:
                print("⚠️  Cursor가 종료되었습니다. 자동 백업 실행...")
                save_backup(reason="Cursor 종료 시 자동 저장")
                cursor_was_running = False
                print("💤 Cursor 재시작 대기 중...")
            
            time.sleep(5)  # 5초마다 체크
    
    except KeyboardInterrupt:
        print("\n⚠️  모니터링 중단. 최종 백업 실행...")
        save_backup(reason="수동 중단")
        print("✅ 백업 완료. 프로그램을 종료합니다.")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "save":
        # 수동 저장 모드
        print("💾 수동 백업 실행...")
        save_backup(reason="수동 저장")
    else:
        # 모니터링 모드
        try:
            monitor_cursor()
        except Exception as e:
            print(f"❌ 오류 발생: {e}")
            save_backup(reason=f"오류 발생: {str(e)}")
