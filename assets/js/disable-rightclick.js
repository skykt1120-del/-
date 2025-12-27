// 마우스 오른쪽 클릭 방지 및 개발자 도구 접근 차단
(function() {
    'use strict';
    
    // 로컬 환경 감지 - 로컬에서는 우클릭 허용
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';
    
    // 로컬 환경이면 스크립트 실행 중단
    if (isLocal) {
        return;
    }
    
    // 1. 마우스 오른쪽 클릭 방지
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // 2. 텍스트 선택 방지
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // 3. 드래그 방지
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // 4. 키보드 단축키 방지
    document.addEventListener('keydown', function(e) {
        // F12 (개발자 도구)
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I (개발자 도구)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J (콘솔)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C (요소 검사)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (소스 보기)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S (저장)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+P (인쇄)
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            return false;
        }
    }, false);
    
    // 5. 개발자 도구 열림 감지 및 차단
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // 개발자 도구가 열렸을 때 페이지 리로드 또는 경고
                // window.location.reload();
            }
        } else {
            if (devtools.open) {
                devtools.open = false;
            }
        }
    }, 500);
    
    // 6. 이미지 우클릭 방지 (추가 보호) - 초기 로드 및 동적 추가된 이미지 모두 처리
    function addImageProtection() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            // 이미 이벤트 리스너가 추가되지 않은 경우에만 추가
            if (!img.dataset.rightclickProtected) {
                img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    return false;
                }, false);
                img.dataset.rightclickProtected = 'true';
            }
        });
    }
    
    // 초기 로드 시 이미지 보호
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addImageProtection);
    } else {
        addImageProtection();
    }
    
    // 동적으로 추가된 콘텐츠(예: slide= 파라미터로 로드된 콘텐츠)에도 이미지 보호 적용
    const observer = new MutationObserver(function(mutations) {
        addImageProtection();
    });
    
    // DOM 변경 감지 시작
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

