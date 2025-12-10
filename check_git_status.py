#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git 커밋 상태 확인 스크립트
"""

import subprocess
from pathlib import Path
from datetime import datetime

def check_git_status():
    """Git 상태 확인"""
    project_root = Path(__file__).parent
    
    print("=" * 60)
    print("📊 Git 커밋 상태 확인")
    print("=" * 60)
    print()
    
    # 1. Git 저장소 확인
    try:
        result = subprocess.run(
            ['git', 'rev-parse', '--git-dir'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        if result.returncode != 0:
            print("❌ Git 저장소가 아닙니다.")
            return
        print("✅ Git 저장소 확인됨")
        print()
    except Exception as e:
        print(f"❌ Git 오류: {e}")
        return
    
    # 2. 현재 브랜치 확인
    try:
        result = subprocess.run(
            ['git', 'branch', '--show-current'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        current_branch = result.stdout.strip()
        print(f"🌿 현재 브랜치: {current_branch}")
        print()
    except Exception as e:
        print(f"⚠️  브랜치 확인 실패: {e}")
    
    # 3. 변경된 파일 확인
    try:
        result = subprocess.run(
            ['git', 'status', '--short'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        changed_files = result.stdout.strip()
        
        if changed_files:
            print("📝 변경된 파일:")
            print("-" * 60)
            for line in changed_files.split('\n'):
                if line.strip():
                    status = line[:2]
                    filename = line[3:]
                    if status.startswith('??'):
                        print(f"  🆕 {filename} (새 파일)")
                    elif status.startswith('M'):
                        print(f"  ✏️  {filename} (수정됨)")
                    elif status.startswith('D'):
                        print(f"  🗑️  {filename} (삭제됨)")
                    elif status.startswith('A'):
                        print(f"  ➕ {filename} (추가됨)")
                    else:
                        print(f"  {status} {filename}")
            print("-" * 60)
            print()
        else:
            print("✅ 변경된 파일 없음 (모든 변경사항이 커밋됨)")
            print()
    except Exception as e:
        print(f"⚠️  상태 확인 실패: {e}")
    
    # 4. 최근 커밋 확인
    try:
        result = subprocess.run(
            ['git', 'log', '--oneline', '-5'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        commits = result.stdout.strip()
        
        if commits:
            print("📜 최근 커밋 (최근 5개):")
            print("-" * 60)
            for line in commits.split('\n'):
                if line.strip():
                    parts = line.split(' ', 1)
                    commit_hash = parts[0][:8]
                    commit_msg = parts[1] if len(parts) > 1 else ""
                    print(f"  {commit_hash} {commit_msg}")
            print("-" * 60)
            print()
        else:
            print("⚠️  커밋 히스토리가 없습니다.")
            print()
    except Exception as e:
        print(f"⚠️  커밋 히스토리 확인 실패: {e}")
    
    # 5. 원격 저장소 확인
    try:
        result = subprocess.run(
            ['git', 'remote', '-v'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        remotes = result.stdout.strip()
        
        if remotes:
            print("🌐 원격 저장소:")
            print("-" * 60)
            for line in remotes.split('\n'):
                if line.strip():
                    parts = line.split()
                    remote_name = parts[0]
                    remote_url = parts[1]
                    print(f"  {remote_name}: {remote_url}")
            print("-" * 60)
            print()
        else:
            print("⚠️  원격 저장소가 설정되지 않았습니다.")
            print()
    except Exception as e:
        print(f"⚠️  원격 저장소 확인 실패: {e}")
    
    # 6. 커밋되지 않은 변경사항 요약
    try:
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        status_lines = result.stdout.strip().split('\n') if result.stdout.strip() else []
        
        if status_lines:
            modified_count = sum(1 for line in status_lines if line.startswith('M'))
            new_count = sum(1 for line in status_lines if line.startswith('??'))
            deleted_count = sum(1 for line in status_lines if line.startswith('D'))
            
            print("📊 변경사항 요약:")
            print("-" * 60)
            print(f"  수정된 파일: {modified_count}개")
            print(f"  새 파일: {new_count}개")
            print(f"  삭제된 파일: {deleted_count}개")
            print(f"  총 변경사항: {len(status_lines)}개")
            print("-" * 60)
            print()
            
            if modified_count > 0 or new_count > 0:
                print("💡 다음 명령어로 커밋할 수 있습니다:")
                print("   git add .")
                print("   git commit -m \"커밋 메시지\"")
                print()
        else:
            print("✅ 모든 변경사항이 커밋되었습니다!")
            print()
    except Exception as e:
        print(f"⚠️  요약 생성 실패: {e}")
    
    print("=" * 60)

if __name__ == "__main__":
    check_git_status()

