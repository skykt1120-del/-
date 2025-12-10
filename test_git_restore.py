#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git 커밋 히스토리로 복원 테스트 스크립트
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime

def test_git_restore(commit_hash, file_path):
    """특정 커밋에서 파일 복원 테스트"""
    project_root = Path(__file__).parent
    
    print("=" * 60)
    print("🧪 Git 커밋 히스토리 복원 테스트")
    print("=" * 60)
    print()
    
    # 1. 커밋 정보 확인
    try:
        result = subprocess.run(
            ['git', 'show', '--oneline', '-s', commit_hash],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        if result.returncode != 0:
            print(f"❌ 커밋을 찾을 수 없습니다: {commit_hash}")
            return False
        
        commit_info = result.stdout.strip()
        print(f"📌 커밋 정보: {commit_info}")
        print()
    except Exception as e:
        print(f"❌ 커밋 정보 확인 실패: {e}")
        return False
    
    # 2. 현재 파일 상태 확인
    full_path = project_root / file_path
    if full_path.exists():
        current_size = full_path.stat().st_size
        print(f"📄 현재 파일 상태:")
        print(f"   경로: {file_path}")
        print(f"   크기: {current_size} bytes")
        print()
    else:
        print(f"⚠️  현재 파일이 존재하지 않습니다: {file_path}")
        print()
    
    # 3. 커밋에서 파일 내용 확인
    try:
        result = subprocess.run(
            ['git', 'show', f'{commit_hash}:{file_path}'],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        
        if result.returncode != 0:
            print(f"❌ 커밋에서 파일을 찾을 수 없습니다: {file_path}")
            print(f"   오류: {result.stderr}")
            return False
        
        commit_file_size = len(result.stdout.encode('utf-8'))
        print(f"📄 커밋의 파일 상태:")
        print(f"   크기: {commit_file_size} bytes")
        print()
        
        if full_path.exists() and current_size != commit_file_size:
            print(f"⚠️  파일 크기가 다릅니다!")
            print(f"   현재: {current_size} bytes")
            print(f"   커밋: {commit_file_size} bytes")
            print(f"   차이: {abs(current_size - commit_file_size)} bytes")
            print()
        
    except Exception as e:
        print(f"❌ 파일 내용 확인 실패: {e}")
        return False
    
    # 4. 복원 테스트 (실제로는 복원하지 않고 확인만)
    print("🔍 복원 가능 여부 확인:")
    try:
        result = subprocess.run(
            ['git', 'checkout', commit_hash, '--', file_path],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        
        if result.returncode == 0:
            print(f"✅ 복원 가능: {file_path}")
            print()
            
            # 복원 후 상태 확인
            if full_path.exists():
                restored_size = full_path.stat().st_size
                print(f"📄 복원 후 파일 상태:")
                print(f"   크기: {restored_size} bytes")
                
                if restored_size == commit_file_size:
                    print(f"✅ 복원 성공! 파일 크기가 일치합니다.")
                else:
                    print(f"⚠️  파일 크기가 다릅니다.")
            
            return True
        else:
            print(f"❌ 복원 실패: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ 복원 테스트 실패: {e}")
        return False

def list_commits_with_file(file_path):
    """특정 파일이 포함된 커밋 목록 확인"""
    project_root = Path(__file__).parent
    
    print("=" * 60)
    print(f"📜 '{file_path}' 파일이 포함된 커밋 목록")
    print("=" * 60)
    print()
    
    try:
        result = subprocess.run(
            ['git', 'log', '--oneline', '--', file_path],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        
        if result.returncode == 0 and result.stdout.strip():
            commits = result.stdout.strip().split('\n')
            print(f"총 {len(commits)}개 커밋에서 발견:")
            print("-" * 60)
            for i, commit_line in enumerate(commits, 1):
                print(f"{i}. {commit_line}")
            print("-" * 60)
            print()
            return commits
        else:
            print(f"⚠️  '{file_path}' 파일이 포함된 커밋을 찾을 수 없습니다.")
            print()
            return []
            
    except Exception as e:
        print(f"❌ 커밋 목록 확인 실패: {e}")
        return []

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("사용법:")
        print("  python test_git_restore.py <커밋해시> <파일경로>")
        print("  python test_git_restore.py list <파일경로>")
        print()
        print("예시:")
        print("  python test_git_restore.py 97a8d4e backup_conversation.py")
        print("  python test_git_restore.py list backup_conversation.py")
        sys.exit(1)
    
    if sys.argv[1] == "list":
        # 파일이 포함된 커밋 목록 확인
        file_path = sys.argv[2]
        list_commits_with_file(file_path)
    else:
        # 특정 커밋에서 파일 복원 테스트
        commit_hash = sys.argv[1]
        file_path = sys.argv[2]
        success = test_git_restore(commit_hash, file_path)
        
        print("=" * 60)
        if success:
            print("✅ 복원 테스트 성공!")
        else:
            print("❌ 복원 테스트 실패!")
        print("=" * 60)

