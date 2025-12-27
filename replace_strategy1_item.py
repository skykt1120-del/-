#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
전략1 항목 교체 스크립트
strategy1Contents 객체 내의 특정 항목만 교체하도록 보장
"""

import re
import sys

def replace_strategy1_item(item_number, new_content_file):
    """
    strategy1Contents 객체 내의 특정 항목만 교체
    
    Args:
        item_number: 교체할 항목 번호 (예: 6, 7, 8)
        new_content_file: 새 내용이 있는 파일 경로
    """
    # 파일 읽기
    with open('assets/js/script.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 새 내용 읽기
    with open(new_content_file, 'r', encoding='utf-8') as f:
        new_content = f.read()
    
    # strategy1Contents 객체의 시작 위치 찾기
    strategy1_start = content.find('const strategy1Contents = {')
    if strategy1_start == -1:
        print('오류: strategy1Contents 객체를 찾을 수 없습니다')
        return False
    
    # strategy1Contents 객체의 끝 위치 찾기 (다음 주요 const나 함수 정의 전까지)
    # strategy2Contents가 시작하는 위치를 찾아서 그 전까지가 strategy1Contents
    strategy2_start = content.find('const strategy2Contents = {')
    if strategy2_start == -1:
        print('오류: strategy2Contents 객체를 찾을 수 없습니다')
        return False
    
    # strategy1Contents 객체 부분만 추출
    strategy1_section = content[strategy1_start:strategy2_start]
    
    # strategy1Contents 객체 내에서만 해당 항목 찾기
    pattern = rf'(        {item_number}: `).*?(</html>`,\s+{item_number + 1}: `)'
    match = re.search(pattern, strategy1_section, re.DOTALL)
    
    if not match:
        # 마지막 항목인 경우 (8번)
        if item_number == 8:
            pattern = rf'(        {item_number}: `).*?(</html>`\s+);'
            match = re.search(pattern, strategy1_section, re.DOTALL)
        
        if not match:
            print(f'오류: strategy1Contents 객체 내에서 {item_number}번 항목을 찾을 수 없습니다')
            return False
    
    # 새 내용 이스케이프 처리
    new_content_escaped = new_content.replace('`', '\\`').replace('${', '\\${')
    
    # strategy1Contents 객체 내에서만 교체
    new_strategy1_section = re.sub(
        pattern,
        rf'\1' + new_content_escaped + rf'\2',
        strategy1_section,
        flags=re.DOTALL
    )
    
    # 전체 내용 재구성
    before_strategy1 = content[:strategy1_start]
    after_strategy2 = content[strategy2_start:]
    new_content_full = before_strategy1 + new_strategy1_section + after_strategy2
    
    # 파일 쓰기
    with open('assets/js/script.js', 'w', encoding='utf-8') as f:
        f.write(new_content_full)
    
    print(f'전략1-{item_number} 교체 완료 (strategy1Contents 객체 내에서만 교체됨)')
    return True

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('사용법: python3 replace_strategy1_item.py <항목번호> <파일경로>')
        print('예: python3 replace_strategy1_item.py 6 전략1/6.md')
        sys.exit(1)
    
    item_number = int(sys.argv[1])
    file_path = sys.argv[2]
    
    replace_strategy1_item(item_number, file_path)



