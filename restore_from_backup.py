#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
백업 파일에서 복원하는 스크립트
백업 JSON 파일에 저장된 파일 내용을 복원하거나 Git 히스토리를 사용하여 복원합니다.
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

BACKUP_DIR = Path(__file__).parent / "backups"

def restore_from_backup_json(backup_file_path, target_files=None):
    """백업 JSON 파일에서 파일 복원"""
    with open(backup_file_path, 'r', encoding='utf-8') as f:
        backup_data = json.load(f)
    
    project_root = Path(backup_data.get('project_root', Path(__file__).parent))
    restored_count = 0
    
    # 백업에 파일 내용이 있는 경우
    if 'file_contents' in backup_data:
        file_contents = backup_data['file_contents']
        for file_path, content in file_contents.items():
            if target_files and file_path not in target_files:
                continue
            
            full_path = project_root / file_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            try:
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ 복원 완료: {file_path}")
                restored_count += 1
            except Exception as e:
                print(f"❌ 복원 실패 ({file_path}): {e}")
    
    # Git 히스토리에서 복원 시도
    elif 'recent_files' in backup_data:
        print("⚠️  백업에 파일 내용이 없습니다. Git 히스토리에서 복원을 시도합니다...")
        backup_time = backup_data.get('local_time', '')
        
        for file_info in backup_data['recent_files']:
            file_path = file_info['path']
            if target_files and file_path not in target_files:
                continue
            
            try:
                # Git에서 해당 시간대의 파일 복원 시도
                result = subprocess.run(
                    ['git', 'log', '--until', backup_time, '--pretty=format:%H', '--', file_path],
                    capture_output=True,
                    text=True,
                    cwd=project_root
                )
                
                if result.returncode == 0 and result.stdout.strip():
                    commit_hash = result.stdout.split('\n')[0]
                    subprocess.run(
                        ['git', 'checkout', commit_hash, '--', file_path],
                        cwd=project_root,
                        check=True
                    )
                    print(f"✅ Git에서 복원 완료: {file_path} (커밋: {commit_hash[:8]})")
                    restored_count += 1
                else:
                    print(f"⚠️  Git 히스토리에서 찾을 수 없음: {file_path}")
            except Exception as e:
                print(f"❌ 복원 실패 ({file_path}): {e}")
    
    return restored_count

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python restore_from_backup.py <백업_타임스탬프> [파일1] [파일2] ...")
        print("예시: python restore_from_backup.py 2025-12-10_17-16-11 strategy.html service.html")
        sys.exit(1)
    
    timestamp = sys.argv[1]
    target_files = sys.argv[2:] if len(sys.argv) > 2 else None
    
    backup_file = BACKUP_DIR / f"backup_{timestamp}.json"
    
    if not backup_file.exists():
        print(f"❌ 백업 파일을 찾을 수 없습니다: {backup_file}")
        sys.exit(1)
    
    print(f"📁 백업 파일 로드: {backup_file}")
    restored = restore_from_backup_json(backup_file, target_files)
    print(f"\n✅ 총 {restored}개 파일 복원 완료")
