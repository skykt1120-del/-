#!/usr/bin/env python3
"""
전략1-1 영역을 JPG 파일로 추출하는 스크립트
playwright를 사용하여 브라우저에서 렌더링하고 스크린샷을 찍습니다.
"""

from playwright.sync_api import sync_playwright
import os
from pathlib import Path

def extract_strategy1():
    # 현재 디렉토리 경로
    current_dir = Path(__file__).parent
    html_file = current_dir / "strategy1-1-standalone.html"
    output_file = current_dir / "strategy1-1.jpg"
    
    if not html_file.exists():
        print(f"오류: {html_file} 파일을 찾을 수 없습니다.")
        return
    
    with sync_playwright() as p:
        print("브라우저를 시작하는 중...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # HTML 파일 로드
        file_url = f"file://{html_file.absolute()}"
        print(f"파일 로드 중: {file_url}")
        page.goto(file_url, wait_until="networkidle")
        
        # slide-container 요소 찾기
        slide_container = page.locator(".slide-container")
        
        if not slide_container.count():
            print("오류: slide-container 요소를 찾을 수 없습니다.")
            browser.close()
            return
        
        # 스크린샷 찍기
        print("스크린샷 촬영 중...")
        slide_container.screenshot(
            path=str(output_file),
            type="jpeg",
            quality=95
        )
        
        print(f"✅ 성공! 이미지가 저장되었습니다: {output_file}")
        
        # 크기 정보 출력
        bounding_box = slide_container.bounding_box()
        if bounding_box:
            print(f"   크기: {int(bounding_box['width'])} x {int(bounding_box['height'])}px")
        
        browser.close()

if __name__ == "__main__":
    try:
        extract_strategy1()
    except ImportError:
        print("오류: playwright가 설치되지 않았습니다.")
        print("다음 명령어로 설치하세요: pip install playwright")
        print("그 다음: playwright install chromium")
    except Exception as e:
        print(f"오류 발생: {e}")









