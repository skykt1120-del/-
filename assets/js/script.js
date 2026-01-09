// 현재 구조에서는 페이지 이동이 앵커(#)가 아니라 html 파일 링크이기 때문에
// 별도의 스크롤 제어는 하지 않고, 추후 확장 시를 대비해 기본 구조만 남겨둡니다.

// 현재 구조에서는 페이지 이동이 앵커(#)가 아니라 html 파일 링크이기 때문에
// 별도의 스크롤 제어는 하지 않고, 추후 확장 시를 대비해 기본 구조만 남겨둡니다.

// Chart.js 전역 로딩 상태 관리 (성능 최적화)
// window 객체에 저장하여 iframe 내부에서도 접근 가능하도록 함
if (!window.chartJsLoadingPromise) {
    window.chartJsLoadingPromise = null;
}
if (typeof window.chartJsLoaded === 'undefined') {
    window.chartJsLoaded = false;
}

document.addEventListener("DOMContentLoaded", () => {
    // 현재 페이지에 맞는 네비게이션 링크에 active 클래스 추가
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
            link.classList.add('active');
        }
    });

    // 서브메뉴 링크도 확인 (네비게이션)
    const subLinks = document.querySelectorAll('.nav-sublink');
    subLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
            // 부모 Portfolio 메뉴도 active로 표시
            const portfolioNav = document.querySelector('.nav-item-has-sub .nav-link');
            if (portfolioNav) {
                portfolioNav.classList.add('active');
            }
        }
    });

    // 포트폴리오 보기 버튼의 하위 메뉴 링크도 확인
    const btnSubLinks = document.querySelectorAll('.btn-sublink');
    btnSubLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 브라우저 뒤로 가기 버튼 처리
    window.addEventListener('popstate', (e) => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // portfolio.html 페이지에서 뒤로 가기 시 확대 뷰만 닫기
        if (currentPage === 'portfolio.html' || currentPage === 'portfolio') {
            const urlParams = new URLSearchParams(window.location.search);
            const boxParam = urlParams.get('box');
            
            if (!boxParam) {
                // URL에 box 파라미터가 없으면 확대 뷰 닫기
                closeExpandedView();
            } else {
                // URL에 box 파라미터가 있으면 해당 상태로 복원
                const slideParam = urlParams.get('slide');
                const slideNumber = slideParam ? parseInt(slideParam) : 1;
                
                // expandBox 호출하여 상태 복원
                expandBox(boxParam);
                
                // 슬라이드 번호가 1보다 크면 해당 슬라이드로 이동
                if (slideNumber > 1) {
                    setTimeout(() => {
                        const expandedBox = document.getElementById("expandedBox");
                        if (expandedBox) {
                            currentSlideNumber = slideNumber;
                            updateNavButtons();
                            if (boxParam === "1") {
                                loadStrategy1ContentToMainBox(expandedBox, slideNumber);
                            } else if (boxParam === "2") {
                                loadService1ContentToMainBox(expandedBox, slideNumber);
                            } else if (boxParam === "3") {
                                loadService2ContentToMainBox(expandedBox, slideNumber);
                            } else if (boxParam === "4") {
                                loadNext1ContentToMainBox(expandedBox, slideNumber);
                            } else if (boxParam === "5") {
                                loadStrategy2ContentToMainBox(expandedBox, slideNumber);
                            }
                        }
                    }, 200);
                }
            }
        }
    });

    // 드롭다운 메뉴가 너무 빨리 사라지지 않도록 약간의 지연을 줍니다.
    const subItems = document.querySelectorAll(".nav-item-has-sub");

    subItems.forEach((item) => {
        let hideTimer;

        item.addEventListener("mouseenter", () => {
            if (hideTimer) clearTimeout(hideTimer);
            item.classList.add("open");
        });

        item.addEventListener("mouseleave", () => {
            hideTimer = setTimeout(() => {
                item.classList.remove("open");
            }, 150); // 마우스를 옮길 여유 시간
        });
    });

    // 포트폴리오 버튼 하위 메뉴 제어
    const portfolioWrapper = document.querySelector(".btn-portfolio-wrapper");
    if (portfolioWrapper) {
        let hideTimer;

        portfolioWrapper.addEventListener("mouseenter", () => {
            if (hideTimer) clearTimeout(hideTimer);
        });

        portfolioWrapper.addEventListener("mouseleave", () => {
            hideTimer = setTimeout(() => {
            }, 150);
        });
    }

    // 테스트 페이지 필터링 및 확대 기능
    const sidebarLinks = document.querySelectorAll(".test-top-menu-link");
    const thumbnailBoxes = document.querySelectorAll(".test-thumbnail-box");
    const thumbnailGrid = document.getElementById("thumbnailGrid");
    const expandedView = document.getElementById("expandedView");
    const expandedBox = document.getElementById("expandedBox");
    const slideList = document.getElementById("slideList");
    const prevSlideBtn = document.getElementById("prevSlideBtn");
    const nextSlideBtn = document.getElementById("nextSlideBtn");
    
    // 현재 슬라이드 정보 추적
    let currentBoxNumber = null;
    let currentSlideNumber = 1;
    let maxSlideCount = 0;

    // URL 업데이트 함수
    function updateURL(boxNumber, slideNumber) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'portfolio.html' || currentPage === 'portfolio') {
            const url = new URL(window.location);
            url.searchParams.set('box', boxNumber);
            url.searchParams.set('slide', slideNumber);
            window.history.replaceState({ expanded: true, boxNumber: boxNumber, slideNumber: slideNumber }, '', url);
        }
    }

    // URL에서 파라미터 제거 함수
    function clearURL() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'portfolio.html' || currentPage === 'portfolio') {
            const url = new URL(window.location);
            url.searchParams.delete('box');
            url.searchParams.delete('slide');
            window.history.replaceState(null, '', url);
        }
    }

    // 확대 뷰 닫기 함수
    function closeExpandedView() {
        if (expandedView && thumbnailGrid) {
            expandedView.classList.add("hidden");
            thumbnailGrid.classList.remove("hidden");
            // 모든 박스 다시 표시
            const thumbnailBoxes = document.querySelectorAll('.test-thumbnail-box');
            thumbnailBoxes.forEach(box => {
                box.classList.remove("hidden");
            });
        }
        // URL에서 파라미터 제거
        clearURL();
        // 상태 초기화
        currentBoxNumber = null;
        currentSlideNumber = 1;
    }

    // 화살표 버튼 위치 조정 함수 (전역으로 사용)
    function updateButtonPosition() {
        if (prevSlideBtn && nextSlideBtn && expandedBox && expandedView) {
            const expandedBoxRect = expandedBox.getBoundingClientRect();
            const expandedViewRect = expandedView.getBoundingClientRect();
            const boxTop = expandedBoxRect.top - expandedViewRect.top;
            const boxLeft = expandedBoxRect.left - expandedViewRect.left;
            const boxRight = boxLeft + expandedBoxRect.width;
            const boxCenter = boxTop + expandedBoxRect.height / 2;
            
            // 세로 위치 (중앙) - 반응형에 따라 큰 박스의 위아래 높이 가운데 위치에 유지
            prevSlideBtn.style.top = `${boxCenter}px`;
            nextSlideBtn.style.top = `${boxCenter}px`;
            prevSlideBtn.style.transform = 'translateY(-50%)';
            nextSlideBtn.style.transform = 'translateY(-50%)';
            
            // 가로 위치
            // 왼쪽 버튼: 박스 왼쪽에서 54px 왼쪽에 위치
            prevSlideBtn.style.left = `${boxLeft - 54}px`;
            
            // 오른쪽 버튼: 박스 오른쪽에서 16px 오른쪽에 위치 (원래대로 복구)
            // expandedView 기준으로 계산
            const boxRightRelativeToView = boxRight - expandedViewRect.left;
            nextSlideBtn.style.left = `${boxRightRelativeToView + 16}px`;
            nextSlideBtn.style.right = 'auto'; // right 값 초기화
        }
    }

    // 박스 확대 함수
    function expandBox(boxNumber) {
        console.log('expandBox 호출됨, boxNumber:', boxNumber);
        if (!expandedView || !expandedBox || !slideList || !thumbnailGrid) {
            console.error('필수 요소가 없습니다:', { expandedView, expandedBox, slideList, thumbnailGrid });
            return;
        }

        // 모든 박스 숨기기
        thumbnailBoxes.forEach(box => {
            box.classList.add("hidden");
        });

        // 그리드 뷰 숨기기
        thumbnailGrid.classList.add("hidden");
        
        // 확대 뷰 표시
        expandedView.classList.remove("hidden");
        
        // URL 업데이트
        updateURL(boxNumber, 1);
        
        // 화살표 버튼 위치 조정 (test-expanded-box의 중앙에 맞춤)
        // 즉시 실행 및 약간의 지연 후 재실행 (레이아웃 완료 대기)
        updateButtonPosition();
        setTimeout(updateButtonPosition, 100);
        setTimeout(updateButtonPosition, 300);

        // 메인박스에 내용 로드
        // 1번 박스인 경우 전략1-1 내용을 메인박스에 표시
        if (boxNumber === "1") {
            console.log('전략1 박스 처리, strategy1Contents 존재 여부:', typeof strategy1Contents !== 'undefined');
            if (typeof strategy1Contents !== 'undefined') {
                console.log('strategy1Contents 키:', Object.keys(strategy1Contents));
            }
            loadStrategy1ContentToMainBox(expandedBox, 1);
            // 초기 로딩 시 스케일 재계산 강제 실행
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 100);
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 300);
        } else if (boxNumber === "2") {
            console.log('서비스 박스 처리');
            loadService1ContentToMainBox(expandedBox, 1);
            // 초기 로딩 시 스케일 재계산 강제 실행
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 100);
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 300);
        } else if (boxNumber === "3") {
            // 서비스2 박스 처리
            console.log('서비스2 박스 처리');
            loadService2ContentToMainBox(expandedBox, 1);
            // 초기 로딩 시 스케일 재계산 강제 실행
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 100);
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 300);
        } else if (boxNumber === "4") {
            // 넥스트1 박스인 경우 넥스트1-1 내용을 메인박스에 표시
            console.log('넥스트1 박스 처리');
            loadNext1ContentToMainBox(expandedBox, 1);
        } else if (boxNumber === "5") {
            // 전략2 박스인 경우 전략2-1 내용을 메인박스에 표시
            console.log('전략2 박스 처리, strategy2Contents 존재 여부:', typeof strategy2Contents !== 'undefined');
            if (typeof strategy2Contents !== 'undefined') {
                console.log('strategy2Contents 키:', Object.keys(strategy2Contents));
            }
            loadStrategy2ContentToMainBox(expandedBox, 1);
            // 초기 로딩 시 스케일 재계산 강제 실행
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 100);
            setTimeout(() => {
                const iframeInfo = getIframeInfo(expandedBox);
                if (iframeInfo) {
                    recalculateIframeScale(iframeInfo);
                }
            }, 300);
        } else {
            // 알 수 없는 박스 번호인 경우 빈 상태로 표시
            expandedBox.innerHTML = '';
            expandedBox.setAttribute("data-box", boxNumber);
        }

        // 현재 박스 번호와 슬라이드 번호 저장
        currentBoxNumber = boxNumber;
        currentSlideNumber = 1;
        maxSlideCount = boxNumber === "1" ? 8 : (boxNumber === "5" ? 10 : (boxNumber === "2" ? 8 : (boxNumber === "3" ? 10 : (boxNumber === "4" ? 6 : 5)))); // 전략1은 8개, 전략2는 10개, 서비스1은 8개, 서비스2는 10개, 넥스트1은 6개, 나머지는 5개
        
        // 화살표 버튼 상태 업데이트
        updateNavButtons();
        
        // 슬라이드 리스트 생성 - 박스 번호에 따라 개수 다름
        slideList.innerHTML = "";
        
        // 넥스트1 박스는 일반적인 방식으로 6개 모두 생성
        if (boxNumber === "4") {
            // 넥스트1-1부터 넥스트1-6까지 모두 생성
            for (let i = 1; i <= 6; i++) {
                const slideItem = createNext1SlideItem(i, boxNumber);
                slideList.appendChild(slideItem);
            }
        } else {
            // 다른 박스들은 기존 방식대로 생성
            for (let i = 1; i <= maxSlideCount; i++) {
                const slideItem = document.createElement("div");
                slideItem.className = "test-slide-item service-slide-item";
                // 네이밍: 서비스1 박스는 "서비스1-1", "서비스1-2" 형식, 서비스2 박스는 "서비스2-1" 형식, 나머지는 "1-1", "1-2" 형식
                const slideName = boxNumber === "2" ? `서비스1-${i}` : (boxNumber === "3" ? `서비스2-${i}` : `${boxNumber}-${i}`);
                slideItem.setAttribute("data-slide", slideName);
                slideItem.setAttribute("data-parent-box", boxNumber);
                slideItem.setAttribute("data-slide-number", i);
                
                // 박스 번호에 따라 다른 파일 내용 로드
                if (boxNumber === "1") {
                    // 전략1 박스의 경우 전략1 파일 내용 로드
                    loadStrategy1Content(slideItem, i);
                } else if (boxNumber === "2") {
                    // 2번 박스의 경우 서비스1 파일 내용 로드
                    loadService1Content(slideItem, i);
                } else if (boxNumber === "3") {
                    // 3번 박스의 경우 서비스2 파일 내용 로드
                    loadService2Content(slideItem, i);
                } else if (boxNumber === "5") {
                    // 전략2 박스의 경우 전략2 파일 내용 로드
                    loadStrategy2Content(slideItem, i);
                }
                
                // 모든 슬라이드 아이템에 클릭 이벤트 추가: 메인박스에 해당 내용 표시
                slideItem.addEventListener("click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const slideNum = parseInt(slideItem.getAttribute("data-slide-number"));
                console.log('작은 박스 클릭됨:', { boxNumber, slideNum, expandedBox: !!expandedBox });
                
                currentSlideNumber = slideNum;
                updateNavButtons();
                updateURL(boxNumber, slideNum);
                
                if (!expandedBox) {
                    console.error('expandedBox가 없습니다!');
                    return;
                }
                
                if (boxNumber === "1") {
                    // 전략1 박스인 경우 전략1 파일 내용 로드
                    console.log('전략1 콘텐츠 로드 시작:', slideNum);
                    loadStrategy1ContentToMainBox(expandedBox, slideNum);
                } else if (boxNumber === "2") {
                    // 2번 박스인 경우 서비스1 파일 내용 로드
                    console.log('서비스1 콘텐츠 로드 시작:', slideNum);
                    loadService1ContentToMainBox(expandedBox, slideNum);
                } else if (boxNumber === "3") {
                    // 3번 박스인 경우 서비스2 파일 내용 로드
                    console.log('서비스2 콘텐츠 로드 시작:', slideNum);
                    loadService2ContentToMainBox(expandedBox, slideNum);
                } else if (boxNumber === "4") {
                    // 넥스트1 박스인 경우 넥스트1 파일 내용 로드
                    console.log('넥스트1 콘텐츠 로드 시작:', slideNum);
                    loadNext1ContentToMainBox(expandedBox, slideNum);
                } else if (boxNumber === "5") {
                    // 전략2 박스인 경우 전략2 파일 내용 로드
                    console.log('전략2 콘텐츠 로드 시작:', slideNum);
                    loadStrategy2ContentToMainBox(expandedBox, slideNum);
                } else {
                    // 나머지 박스는 추후 동일한 방식으로 구현 예정
                    console.log(`슬라이드 아이템 클릭: ${slideName}`);
                }
                
                // 버튼 위치 업데이트
                setTimeout(updateButtonPosition, 100);
                });
                
                slideList.appendChild(slideItem);
            }
        }
    }
    
    // 넥스트1 슬라이드 아이템 생성 함수
    function createNext1SlideItem(slideNumber, boxNumber) {
        const slideItem = document.createElement("div");
        slideItem.className = "test-slide-item service-slide-item";
        const slideName = `넥스트1-${slideNumber}`;
        slideItem.setAttribute("data-slide", slideName);
        slideItem.setAttribute("data-parent-box", boxNumber);
        slideItem.setAttribute("data-slide-number", slideNumber);
        
        // 명시적으로 표시 설정
        slideItem.style.display = 'block';
        slideItem.style.visibility = 'visible';
        slideItem.style.opacity = '1';
        
        // 넥스트1 파일 내용 로드
        loadNext1Content(slideItem, slideNumber);
        
        // 클릭 이벤트 추가
        slideItem.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const slideNum = parseInt(slideItem.getAttribute("data-slide-number"));
            console.log('넥스트1 작은 박스 클릭됨:', { boxNumber, slideNum, expandedBox: !!expandedBox });
            
            currentSlideNumber = slideNum;
            updateNavButtons();
            updateURL(boxNumber, slideNum);
            
            if (!expandedBox) {
                console.error('expandedBox가 없습니다!');
                return;
            }
            
            console.log('넥스트1 콘텐츠 로드 시작:', slideNum);
            loadNext1ContentToMainBox(expandedBox, slideNum);
            
            // 버튼 위치 업데이트
            setTimeout(updateButtonPosition, 100);
        });
        
        return slideItem;
    }
    
    // 화살표 버튼 상태 업데이트 함수
    function updateNavButtons() {
        if (!prevSlideBtn || !nextSlideBtn) return;
        
        // 첫 번째 슬라이드면 왼쪽 버튼 비활성화
        prevSlideBtn.disabled = currentSlideNumber <= 1;
        
        // 마지막 슬라이드면 오른쪽 버튼 비활성화
        nextSlideBtn.disabled = currentSlideNumber >= maxSlideCount;
    }
    
    // 다음 슬라이드로 이동
    function goToNextSlide() {
        if (currentSlideNumber >= maxSlideCount || !currentBoxNumber) return;
        
        currentSlideNumber++;
        updateNavButtons();
        updateURL(currentBoxNumber, currentSlideNumber);
        
        if (currentBoxNumber === "1") {
            loadStrategy1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "2") {
            loadService1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "3") {
            loadService2ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "4") {
            loadNext1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "5") {
            loadStrategy2ContentToMainBox(expandedBox, currentSlideNumber);
        }
        
        // 버튼 위치 업데이트
        setTimeout(updateButtonPosition, 100);
    }
    
    // 이전 슬라이드로 이동
    function goToPrevSlide() {
        if (currentSlideNumber <= 1 || !currentBoxNumber) return;
        
        currentSlideNumber--;
        updateNavButtons();
        updateURL(currentBoxNumber, currentSlideNumber);
        
        if (currentBoxNumber === "1") {
            loadStrategy1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "2") {
            loadService1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "3") {
            loadService2ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "4") {
            loadNext1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "5") {
            loadStrategy2ContentToMainBox(expandedBox, currentSlideNumber);
        }
        
        // 버튼 위치 업데이트
        setTimeout(updateButtonPosition, 100);
    }
    
    // 화살표 버튼 클릭 이벤트 추가
    if (prevSlideBtn) {
        prevSlideBtn.addEventListener("click", (e) => {
            e.preventDefault(); // 기본 동작 방지 (스크롤 이동 방지)
            e.stopPropagation();
            goToPrevSlide();
        });
    }
    
    if (nextSlideBtn) {
        nextSlideBtn.addEventListener("click", (e) => {
            e.preventDefault(); // 기본 동작 방지 (스크롤 이동 방지)
            e.stopPropagation();
            goToNextSlide();
        });
    }

    // 서비스1 파일 내용을 객체로 저장
    const service1Contents = {
        1: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>서비스1-1</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/서비스1-1썸네일(수정).png" alt="서비스1-1" class="slide-image" />
    </div>
</body>
</html>`,
        2: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>문제 정의 &amp; 전략적 배경</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .text-point { color: #A4C639; }
        .bg-point { background-color: #A4C639; }
        .border-point { border-color: #A4C639; }
        .bg-point-light { background-color: rgba(164, 198, 57, 0.1); }
        
        .card-box {
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body>
<div class="slide-container p-16">
<!-- Header Section -->
<div class="mb-10 border-b-2 border-gray-100 pb-6 flex justify-between items-end">
<div>
<div class="flex items-center mb-2">
<span class="w-2 h-8 bg-point mr-3"></span>
<h2 class="text-3xl font-bold text-gray-800 tracking-tight">문제 정의 &amp; 전략적 배경</h2>
</div>
<p class="text-gray-500 ml-5 text-lg">왜 모바일 전환이 시급했는가?</p>
</div>
<div class="flex items-center gap-4">
<!-- Key Keywords -->
<div class="flex space-x-3">
<span class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">#환경 변화</span>
<span class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">#보안 제한</span>
<span class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">#모니터링 부재</span>
<span class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">#신뢰 하락</span>
</div>
<div class="text-gray-300 font-bold text-4xl opacity-20">01</div>
</div>
</div>
<!-- Main Content: 3 Column Layout -->
<div class="flex-1 flex space-x-8 items-stretch pb-8">
<!-- Problem 1: Environment -->
<div class="flex-1 bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col shadow-sm card-box relative overflow-hidden">
<div class="absolute top-0 right-0 w-24 h-24 bg-gray-200 rounded-bl-full opacity-20 -mr-4 -mt-4"></div>
<div class="mb-6 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl text-point">
<i class="fas fa-desktop"></i>
</div>
<h3 class="text-xl font-bold text-gray-800 mb-4">PC 사용 환경의 붕괴</h3>
<div class="space-y-3 flex-1">
<p class="text-gray-600 leading-relaxed text-sm">
<strong class="text-gray-800 block mb-1">근무 환경 변화</strong>
                        코로나 이후 재택/유연 근무 확산으로 고정된 PC 앞을 지키기 어려워짐
                    </p>
<div class="h-px bg-gray-200 w-full"></div>
<p class="text-gray-600 leading-relaxed text-sm">
<strong class="text-gray-800 block mb-1">보안 정책 강화</strong>
                        회사 PC 보안 정책으로 외부 실행 파일(exe) 설치 원천 차단
                    </p>
</div>
<div class="mt-6 pt-4 border-t-2 border-point border-opacity-30">
<p class="text-point font-bold text-sm">Target: 기존 PC 유저</p>
</div>
</div>
<!-- Problem 2: User Pain Point (Core) -->
<div class="flex-1 bg-white rounded-2xl p-8 border-2 border-point border-opacity-20 flex flex-col shadow-lg card-box relative">
<!-- Highlight Badge -->
<div class="absolute top-6 right-6">
<span class="text-xs font-black text-white bg-point px-2 py-1 rounded">CORE ISSUE</span>
</div>
<div class="mb-6 w-14 h-14 rounded-xl bg-point-light flex items-center justify-center text-2xl text-point">
<i class="fas fa-eye-slash"></i>
</div>
<h3 class="text-xl font-bold text-gray-800 mb-4">매매 불투명성과 불안</h3>
<div class="space-y-4 flex-1">
<p class="text-gray-700 leading-relaxed font-medium">
                        "지금 내 돈이 정상적으로 매매되고 있는지 확인할 방법이 없다"
                    </p>
<ul class="text-sm text-gray-600 space-y-2 list-disc list-inside bg-gray-50 p-4 rounded-lg">
<li>실시간 매매 모니터링 불가</li>
<li>오류 발생 시 즉각 대응 불가</li>
<li>고객 불안 증가 및 VOC 급증</li>
</ul>
</div>
<div class="mt-6 pt-4 border-t-2 border-point">
<p class="text-point font-bold text-sm">Result: 신뢰도 하락</p>
</div>
</div>
<!-- Problem 3: Strategy -->
<div class="flex-1 bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col shadow-sm card-box relative overflow-hidden">
<div class="absolute top-0 right-0 w-24 h-24 bg-gray-200 rounded-bl-full opacity-20 -mr-4 -mt-4"></div>
<div class="mb-6 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl text-point">
<i class="fas fa-handshake"></i>
</div>
<h3 class="text-xl font-bold text-gray-800 mb-4">전략적 제휴의 필요성</h3>
<div class="space-y-3 flex-1">
<p class="text-gray-600 leading-relaxed text-sm">
<strong class="text-gray-800 block mb-1">비즈니스 확장 전략</strong>
                        투자일임사와의 위탁계약 체결을 위한 필수 조건
                    </p>
<div class="h-px bg-gray-200 w-full"></div>
<p class="text-gray-600 leading-relaxed text-sm">
<strong class="text-gray-800 block mb-1">서비스 구조 전환</strong>
                        단순 솔루션 판매에서 '비대면 투자일임 서비스'로의 BM 전환 필요
                    </p>
</div>
<div class="mt-6 pt-4 border-t-2 border-point border-opacity-30">
<p class="text-point font-bold text-sm">Goal: B2B 제휴 확대</p>
</div>
</div>
</div>
<!-- Bottom Summary -->
<div class="bg-gray-800 rounded-lg p-4 flex items-center justify-center text-white mb-2">
<i class="fas fa-arrow-right mr-3 text-point"></i>
<p class="text-base font-medium">
                고객 환경 변화에 대응하고 구조적 불안을 해소하기 위해 <span class="text-point font-bold">모바일 기반 서비스 전환</span>이 유일한 해결책
            </p>
</div>
</div>
</body>
</html>`,
        3: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>타깃 유저 &amp; 상황</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 60px 80px 60px 80px;
            box-sizing: border-box;
        }
        
        /* Header Style from previous slides */
        .header {
            margin-bottom: 40px;
        }
        .header h2 {
            font-size: 36px;
            font-weight: 900;
            color: #1a1a1a;
            position: relative;
            display: inline-block;
        }
        .header h2::after {
            content: '';
            display: block;
            width: 100%;
            height: 4px;
            background-color: #A4C639;
            margin-top: 10px;
            border-radius: 2px;
        }

        /* Layout */
        .content-wrapper {
            display: flex;
            gap: 30px;
            height: 100%;
        }
        
        /* Left Section: User Analysis (2 Tiers) */
        .analysis-section {
            flex: 2.5;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        
        .tier-container {
            background-color: #F9FAFB;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        
        .tier-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 10px;
        }
        .tier-title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
        }
        .tier-icon {
            color: #A4C639;
            margin-right: 10px;
            font-size: 20px;
        }

        /* Top Tier Cards (Grid for 2 items) */
        .user-cards-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: 100%;
        }
        
        /* Bottom Tier Cards (Grid for 3 items) */
        .exp-cards-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            height: 100%;
        }

        .info-card {
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: 4px solid #D1D5DB; /* Default neutral border */
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .info-card.active {
            border-left-color: #A4C639;
        }
        
        .info-card h4 {
            font-size: 18px;
            font-weight: 700;
            color: #374151;
            margin: 0 0 12px 0;
        }
        
        .info-card p {
            font-size: 15px;
            color: #6B7280;
            margin: 0;
            line-height: 1.5;
            word-break: keep-all;
        }

        /* Right Section: Design Criteria */
        .criteria-section {
            flex: 1;
            background-color: #f0f7e6; /* Light tint of brand color */
            border-radius: 16px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border: 1px solid rgba(164, 198, 57, 0.3);
        }
        
        .criteria-title {
            font-size: 22px;
            font-weight: 800;
            color: #3f6212; /* Darker green */
            margin-bottom: 30px;
            text-align: center;
            position: relative;
        }
        
        .criteria-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        
        .criteria-item {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 4px rgba(164, 198, 57, 0.1);
        }
        
        .check-icon {
            width: 28px;
            height: 28px;
            background-color: #A4C639;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            font-size: 14px;
            flex-shrink: 0;
        }
        
        .criteria-text {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Header -->
<div class="header flex justify-between items-end border-b-2 border-gray-100 pb-6 mb-10">
<div>
<h2>타깃 유저 &amp; 상황</h2>
</div>
<div class="text-gray-300 font-bold text-4xl opacity-20">02</div>
</div>
<!-- Content Layout -->
<div class="content-wrapper">
<!-- Left: User Analysis -->
<div class="analysis-section">
<!-- Top: By Inflow Timing -->
<div class="tier-container">
<div class="tier-header">
<i class="fas fa-clock tier-icon"></i>
<h3 class="tier-title">유입 시기 기준</h3>
</div>
<div class="user-cards-row">
<div class="info-card active">
<h4>기존 PC 유저</h4>
<p>• 알고리즘 신뢰 고객</p>
<p>• 서비스 방식 전환 대상</p>
</div>
<div class="info-card active">
<h4>신규 유저</h4>
<p>• 앱 마켓 및 제휴사 유입</p>
<p>• 시장 확장 대상</p>
</div>
</div>
</div>
<!-- Bottom: By Investment Experience -->
<div class="tier-container">
<div class="tier-header">
<i class="fas fa-chart-line tier-icon"></i>
<h3 class="tier-title">투자 경험 기준</h3>
</div>
<div class="exp-cards-row">
<div class="info-card">
<h4>투자 초보자</h4>
<p>투자 경험이 부족하여 전문가의 도움이 필요한 고객</p>
</div>
<div class="info-card">
<h4>소극적 투자자</h4>
<p>과거 손실 경험으로 인해 보수적인 투자를 선호</p>
</div>
<div class="info-card">
<h4>적극 투자자</h4>
<p>포트폴리오 분산 투자를 목적으로 서비스 이용</p>
</div>
</div>
</div>
</div>
<!-- Right: Design Criteria -->
<div class="criteria-section">
<h3 class="criteria-title">설계 기준</h3>
<div class="criteria-list">
<div class="criteria-item">
<div class="check-icon"><i class="fas fa-check"></i></div>
<p class="criteria-text">기존 고객 VOC 감소</p>
</div>
<div class="criteria-item">
<div class="check-icon"><i class="fas fa-check"></i></div>
<p class="criteria-text">고객층 확장</p>
</div>
<div class="criteria-item">
<div class="check-icon"><i class="fas fa-check"></i></div>
<p class="criteria-text">단기 사용자가 아닌<br/>장기 충성 고객 전환</p>
</div>
</div>
</div>
</div>
</div>
</body>
</html>`,
        4: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>핵심 목표 &amp; 성공 기준</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .text-point { color: #A4C639; }
        .bg-point { background-color: #A4C639; }
        .border-point { border-color: #A4C639; }
        .bg-point-light { background-color: rgba(164, 198, 57, 0.1); }
        .bg-point-super-light { background-color: rgba(164, 198, 57, 0.05); }
        
        .card-shadow {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
        }
        
        /* Custom list style */
        .check-list-item {
            position: relative;
            transition: all 0.3s ease;
        }
        .check-list-item:hover {
            transform: translateX(5px);
        }
    </style>
</head>
<body>
<div class="slide-container p-16">
<!-- Header Section -->
<div class="mb-10 border-b-2 border-gray-100 pb-6 flex justify-between items-end">
<div>
<div class="flex items-center mb-2">
<span class="w-2 h-8 bg-point mr-3"></span>
<h2 class="text-3xl font-bold text-gray-800 tracking-tight">핵심 목표 &amp; 성공 기준</h2>
</div>
<p class="text-gray-500 ml-5 text-lg">무엇을 달성하고자 하며, 어떻게 측정할 것인가?</p>
</div>
<!-- Slide Number -->
<div class="text-gray-300 font-bold text-4xl opacity-20">03</div>
</div>
<!-- Main Content: Split Layout -->
<div class="flex-1 flex gap-10 h-full">
<!-- Left Column: Core Goals (Priority 1) -->
<div class="w-1/2 flex flex-col">
<div class="flex items-center mb-6">
<div class="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded mr-3">PRIORITY 1</div>
<h3 class="text-2xl font-bold text-gray-800">핵심 목표</h3>
</div>
<div class="flex-1 flex flex-col gap-5">
<!-- Goal 1: Customer Perspective -->
<div class="bg-white border-l-4 border-point rounded-r-xl shadow-sm p-8 flex-1 flex flex-col justify-center relative overflow-hidden group">
<div class="absolute right-0 top-0 w-32 h-32 bg-point opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8 transition-transform group-hover:translate-x-6 group-hover:-translate-y-6"></div>
<div class="flex items-start mb-4 relative z-10">
<div class="w-12 h-12 rounded-full bg-point-light flex items-center justify-center text-point text-xl mr-5 flex-shrink-0">
<i class="fas fa-user"></i>
</div>
<div>
<p class="text-sm font-bold text-point uppercase tracking-wide mb-1">CUSTOMER VIEW</p>
<h4 class="text-xl font-bold text-gray-800 mb-2">즉각적인 대응과 확인</h4>
</div>
</div>
<p class="text-gray-600 leading-relaxed pl-16">
                            어떤 환경(PC/Mobile)에서도 현재의 매매 상태를<br/>
                            실시간으로 확인하고, 이상 발생 시 즉시 대응 가능한 환경 제공
                        </p>
</div>
<!-- Goal 2: Company Perspective -->
<div class="bg-white border-l-4 border-gray-400 rounded-r-xl shadow-sm p-8 flex-1 flex flex-col justify-center relative overflow-hidden group">
<div class="absolute right-0 top-0 w-32 h-32 bg-gray-200 opacity-20 rounded-bl-full transform translate-x-8 -translate-y-8 transition-transform group-hover:translate-x-6 group-hover:-translate-y-6"></div>
<div class="flex items-start mb-4 relative z-10">
<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl mr-5 flex-shrink-0">
<i class="fas fa-building"></i>
</div>
<div>
<p class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">COMPANY VIEW</p>
<h4 class="text-xl font-bold text-gray-800 mb-2">고객 신뢰 유지 및 이탈 방지</h4>
</div>
</div>
<p class="text-gray-600 leading-relaxed pl-16">
                            불안 요소 제거를 통한 서비스 신뢰도 회복 및<br/>
                            기존 우량 고객의 이탈을 방지하여 안정적 운영 기반 확보
                        </p>
</div>
</div>
</div>
<!-- Vertical Divider -->
<div class="w-px bg-gray-200 my-4"></div>
<!-- Right Column: Success Criteria -->
<div class="w-1/2 flex flex-col">
<div class="flex items-center mb-6">
<div class="bg-point text-white text-xs font-bold px-3 py-1 rounded mr-3">KPIs</div>
<h3 class="text-2xl font-bold text-gray-800">성공 기준</h3>
</div>
<div class="flex-1 bg-gray-50 rounded-2xl p-8 flex flex-col justify-between border border-gray-100 relative overflow-hidden">
<!-- Background Icon -->
<div class="absolute bottom-0 right-0 text-gray-200 opacity-20 transform translate-x-10 translate-y-10">
<i class="fas fa-flag-checkered text-9xl"></i>
</div>
<!-- Criteria List -->
<div class="space-y-8 relative z-10 py-4">
<!-- Item 1 -->
<div class="check-list-item bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
<div class="w-14 h-14 rounded-full bg-point text-white flex items-center justify-center text-2xl font-bold mr-6 shadow-md">
                                0
                            </div>
<div class="flex-1">
<p class="text-xs font-bold text-gray-400 uppercase mb-1">VOC REDUCTION</p>
<p class="text-lg font-bold text-gray-800">
                                    모니터링 불가 관련<br/>
<span class="text-point">고객 문의 0건 달성</span>
</p>
</div>
<div class="text-gray-300 text-xl">
<i class="fas fa-headset"></i>
</div>
</div>
<!-- Item 2 -->
<div class="check-list-item bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
<div class="w-14 h-14 rounded-full bg-white border-2 border-point text-point flex items-center justify-center text-xl mr-6">
<i class="fas fa-check"></i>
</div>
<div class="flex-1">
<p class="text-xs font-bold text-gray-400 uppercase mb-1">SERVICE LAUNCH</p>
<p class="text-lg font-bold text-gray-800">
                                    모바일 로보어드바이저<br/>
                                    서비스 정상 출시
                                </p>
</div>
<div class="text-gray-300 text-xl">
<i class="fas fa-mobile-alt"></i>
</div>
</div>
<!-- Item 3 -->
<div class="check-list-item bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
<div class="w-14 h-14 rounded-full bg-white border-2 border-point text-point flex items-center justify-center text-xl mr-6">
<i class="fas fa-check"></i>
</div>
<div class="flex-1">
<p class="text-xs font-bold text-gray-400 uppercase mb-1">CONTRACT</p>
<p class="text-lg font-bold text-gray-800">
                                    투자일임사와<br/>
                                    투자일임 위탁계약 체결
                                </p>
</div>
<div class="text-gray-300 text-xl">
<i class="fas fa-file-signature"></i>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</body>
</html>`,
        5: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>대안 검토 &amp; 선택</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .text-point { color: #A4C639; }
        .bg-point { background-color: #A4C639; }
        .border-point { border-color: #A4C639; }
        .bg-point-light { background-color: rgba(164, 198, 57, 0.1); }
        .bg-point-super-light { background-color: rgba(164, 198, 57, 0.05); }
        
        .rejected-card {
            border-left: 4px solid #CBD5E0;
            transition: all 0.3s ease;
        }
        .rejected-card:hover {
            border-left-color: #A0AEC0;
            background-color: #F7FAFC;
        }
        
        .selected-card {
            border: 2px solid #A4C639;
            box-shadow: 0 10px 30px rgba(164, 198, 57, 0.15);
        }
    </style>
</head>
<body>
<div class="slide-container p-16">
<!-- Header Section -->
<div class="mb-8 border-b-2 border-gray-100 pb-6 flex justify-between items-end">
<div>
<div class="flex items-center mb-2">
<span class="w-2 h-8 bg-point mr-3"></span>
<h2 class="text-3xl font-bold text-gray-800 tracking-tight">대안 검토 &amp; 선택</h2>
</div>
<p class="text-gray-500 ml-5 text-lg">어떤 해결책이 최선인가?</p>
</div>
<div class="text-gray-300 font-bold text-4xl opacity-20">04</div>
</div>
<!-- Main Content -->
<div class="flex-1 flex gap-8 h-full">
<!-- Left Column: Reviewed Alternatives & Limitations (60%) -->
<div class="w-7/12 flex flex-col">
<div class="mb-4 flex items-center justify-between">
<h3 class="text-xl font-bold text-gray-600">검토된 대안과 한계</h3>
<span class="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded">REJECTED</span>
</div>
<div class="flex-1 flex flex-col gap-4">
<!-- Alternative 1 -->
<div class="rejected-card bg-white p-6 rounded-r-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
<div class="flex justify-between items-start mb-3">
<div class="flex items-center">
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
<i class="fas fa-bell"></i>
</div>
<h4 class="text-lg font-bold text-gray-700">단순 알림 서비스</h4>
</div>
<span class="text-xs font-bold text-red-400 border border-red-200 px-2 py-1 rounded bg-red-50">LIMITATION</span>
</div>
<div class="pl-13 ml-13 border-t border-dashed border-gray-200 pt-3 mt-1">
<p class="text-gray-500 text-sm mb-1"><i class="fas fa-times-circle text-red-300 mr-2"></i>오류 발생 시 <strong>후속 조치 불가</strong></p>
<p class="text-gray-500 text-sm"><i class="fas fa-times-circle text-red-300 mr-2"></i>단순 정보 전달로 불안감 잔존</p>
</div>
</div>
<!-- Alternative 2 -->
<div class="rejected-card bg-white p-6 rounded-r-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
<div class="flex justify-between items-start mb-3">
<div class="flex items-center">
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
<i class="fas fa-eye"></i>
</div>
<h4 class="text-lg font-bold text-gray-700">모바일 모니터링 전용 앱</h4>
</div>
<span class="text-xs font-bold text-red-400 border border-red-200 px-2 py-1 rounded bg-red-50">LIMITATION</span>
</div>
<div class="pl-13 ml-13 border-t border-dashed border-gray-200 pt-3 mt-1">
<p class="text-gray-500 text-sm mb-1"><i class="fas fa-times-circle text-red-300 mr-2"></i><strong>근본적 불안(제어권 부재)</strong> 해소 불가</p>
<p class="text-gray-500 text-sm"><i class="fas fa-times-circle text-red-300 mr-2"></i>투자일임사 제휴 전략과 불일치</p>
</div>
</div>
</div>
</div>
<!-- Arrow Indicator -->
<div class="flex flex-col justify-center items-center text-gray-300">
<i class="fas fa-chevron-right text-3xl"></i>
</div>
<!-- Right Column: Final Selection (40%) -->
<div class="w-5/12 flex flex-col relative">
<div class="mb-4 flex items-center justify-between">
<h3 class="text-xl font-bold text-point">최종 선택</h3>
<span class="text-sm font-bold text-white bg-point px-3 py-1 rounded shadow-sm">SELECTED</span>
</div>
<div class="selected-card bg-white rounded-xl h-full p-8 flex flex-col relative overflow-hidden">
<!-- Background Decoration -->
<div class="absolute top-0 right-0 w-40 h-40 bg-point opacity-10 rounded-bl-full -mr-10 -mt-10"></div>
<div class="absolute bottom-0 left-0 w-32 h-32 bg-gray-100 opacity-50 rounded-tr-full -ml-8 -mb-8"></div>
<div class="relative z-10 flex flex-col h-full">
<div class="w-16 h-16 rounded-2xl bg-point text-white flex items-center justify-center text-3xl shadow-md mb-6">
<i class="fas fa-mobile-screen-button"></i>
</div>
<h4 class="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                            매매 실행·중단 가능한<br/>
<span class="text-point">모바일 앱 서비스</span>
</h4>
<p class="text-gray-500 text-sm mb-8 leading-relaxed">
                            단순 조회(View)를 넘어, 고객이 직접 자산을 통제(Control)할 수 있는 완결형 서비스 구조
                        </p>
<div class="mt-auto">
<div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
<p class="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">CONCLUSION</p>
<p class="text-lg font-bold text-gray-800 flex items-start">
<i class="fas fa-quote-left text-point opacity-50 text-sm mr-2 mt-1"></i>
                                    유일한 해결책
                                </p>
<p class="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-point">
                                    고객 불안 해소 및<br/>신규 비즈니스(투자일임) 확장 가능
                                </p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</body>
</html>`,
        6: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>유저 플로우 &amp; 서비스 구조</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 48px 64px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        .text-point { color: #A4C639; }
        .bg-point { background-color: #A4C639; }
        .border-point { border-color: #A4C639; }
        
        .row-label {
            font-size: 14px;
            font-weight: 900;
            color: #A4C639;
            background-color: #F0FFF4;
            padding: 4px 12px;
            border-radius: 4px;
            margin-bottom: 16px;
            display: inline-block;
        }
        
        .flow-card {
            width: 140px;
            height: 80px;
            background-color: #fff;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 10;
        }
        
        /* Exception Lines & Cards */
        .exception-line {
            position: absolute;
            top: 100%;
            left: 50%;
            height: 24px;
            border-left: 1px dashed #A0AEC0;
            z-index: 0;
        }
        
        .exception-card {
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 110px;
            padding: 4px 0;
            background-color: #F7FAFC;
            border: 1px solid #CBD5E0;
            border-radius: 6px;
            font-size: 11px;
            text-align: center;
            color: #718096;
            white-space: nowrap;
        }
        
        /* Branch Group */
        .branch-group {
            position: relative;
            padding: 20px;
            background-color: #F0F7E6;
            border: 1px solid #A4C639;
            border-radius: 16px;
            display: flex;
            gap: 20px;
        }
        
        .branch-group::before {
            content: '';
            position: absolute;
            top: -24px;
            left: 50%; /* Center of the group */
            transform: translateX(-50%);
            height: 24px;
            border-left: 2px solid #A4C639;
        }
        
        /* Specific adjustments for Branch connection */
        /* To make it look connected to the last card of Step 2 */
        .branch-connector-wrapper {
            position: relative;
            display: flex;
            justify-content: flex-end;
            margin-top: auto;
            padding-top: 24px;
            border-top: 1px dashed #E5E7EB;
        }
        
        .branch-group::before {
            /* Override to align with the 'Service Entry' card above */
            /* Since the group is aligned right, we need to position this line */
            left: auto;
            right: 70px; /* Approximate center of the last card (140px width) */
            transform: none;
        }

        p { margin: 0; }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Header -->
<div class="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
<div class="flex items-center">
<div class="w-2 h-8 bg-point mr-4"></div>
<h2 class="text-3xl font-bold text-gray-800"><p>유저 플로우 &amp; 서비스 구조</p></h2>
</div>
<div class="text-5xl font-bold text-gray-200"><p>05</p></div>
</div>
<!-- Step 01 -->
<div class="mb-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
<div class="row-label"><p>Step 01. 초기 진입 및 계약 전</p></div>
<div class="flex justify-between items-center relative z-10">
<!-- Card 1 -->
<div class="flow-card">
<i class="fas fa-download text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">앱 다운로드</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 2 -->
<div class="flow-card">
<i class="fas fa-mobile-alt text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">앱 실행</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 3 -->
<div class="flow-card">
<i class="fas fa-user-plus text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">회원가입</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 4 (Exception) -->
<div class="flow-card border-point">
<i class="fas fa-id-card text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center leading-tight">비대면<br/>계좌개설</p>
<div class="exception-line">
<div class="exception-card"><p>증권사 연결</p></div>
</div>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 5 (Exception) -->
<div class="flow-card">
<i class="fas fa-fingerprint text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">본인인증</p>
<div class="exception-line">
<div class="exception-card"><p>실패 시 Guest</p></div>
</div>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 6 (Exception) -->
<div class="flow-card">
<i class="fas fa-file-contract text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">약관 동의</p>
<div class="exception-line">
<div class="exception-card border-red-200 text-red-500 bg-red-50"><p>미동의 시 중단</p></div>
</div>
</div>
</div>
<!-- Spacer for exception cards visibility -->
<div class="h-8 w-full"></div>
</div>
<!-- Step 02 & Branch -->
<div class="bg-gray-50 p-6 rounded-xl border border-gray-200 flex-1 flex flex-col justify-between">
<div>
<div class="row-label"><p>Step 02. 계약 이후 서비스 이용</p></div>
<div class="flex justify-between items-center mb-6">
<!-- Card 1 -->
<div class="flow-card border-point">
<i class="fas fa-signature text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">투자일임계약</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 2 -->
<div class="flow-card">
<i class="fas fa-credit-card text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">수수료 결제</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 3 -->
<div class="flow-card">
<i class="fas fa-headset text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">관리자 해피콜</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 4 -->
<div class="flow-card">
<i class="fas fa-check-circle text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">계약 승낙</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 5 -->
<div class="flow-card">
<i class="fas fa-key text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">공인인증 로그인</p>
</div>
<i class="fas fa-chevron-right text-gray-300 text-sm"></i>
<!-- Card 6 (Highlight) -->
<div class="flow-card border-point">
<i class="fas fa-door-open text-point mb-2 text-lg"></i>
<p class="text-xs font-bold text-gray-600 text-center">서비스 진입</p>
</div>
</div>
</div>
<!-- Bottom Branch Area -->
<div class="branch-connector-wrapper">
<div class="branch-group">
<!-- Branch 1 -->
<div class="bg-white rounded-lg shadow-sm w-36 overflow-hidden border border-gray-200">
<div class="bg-gray-50 border-b border-gray-100 p-2 text-center">
<p class="text-xs font-bold text-point">메인 화면</p>
</div>
<div class="p-3 text-center space-y-1">
<p class="text-xs text-gray-500">증시 정보</p>
<p class="text-xs text-gray-500">실시간 뉴스</p>
<p class="text-xs text-gray-500">전문가 게시글</p>
</div>
</div>
<!-- Branch 2 (Highlight) -->
<div class="bg-white rounded-lg shadow-md w-36 overflow-hidden border-2 border-point transform -translate-y-2 z-10">
<div class="bg-point p-2 text-center">
<p class="text-xs font-bold text-white">매매 화면</p>
</div>
<div class="p-3 text-center space-y-1">
<p class="text-xs font-bold text-gray-800">매매 시작</p>
<p class="text-xs font-bold text-gray-800">매매 종료</p>
<p class="text-xs text-gray-500">실시간 상태</p>
</div>
</div>
<!-- Branch 3 -->
<div class="bg-white rounded-lg shadow-sm w-36 overflow-hidden border border-gray-200">
<div class="bg-gray-50 border-b border-gray-100 p-2 text-center">
<p class="text-xs font-bold text-point">앱 설정</p>
</div>
<div class="p-3 text-center space-y-1">
<p class="text-xs text-gray-500">알림 설정</p>
<p class="text-xs text-gray-500">고객센터</p>
<p class="text-xs text-gray-500">1:1 문의</p>
</div>
</div>
</div>
</div>
</div>
</div>
</body>
</html></html>`,
        7: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>기획 판단 &amp; 결과</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        /* Color Variables */
        .text-point { color: #A4C639; }
        .bg-point { background-color: #A4C639; }
        .border-point { border-color: #A4C639; }
        .bg-point-light { background-color: rgba(164, 198, 57, 0.1); }
        .bg-point-medium { background-color: rgba(164, 198, 57, 0.2); }
        
        /* Card Styles */
        .process-card {
            background-color: #F8F9FA;
            border-radius: 16px;
            transition: all 0.3s ease;
        }
        
        .result-card {
            background-color: white;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
        }
        
        .change-card {
            background-color: white;
            border-radius: 12px;
            border-left: 4px solid #A4C639;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .highlight-number {
            font-family: 'Noto Sans KR', sans-serif;
            letter-spacing: -2px;
            line-height: 1;
        }
        
        /* Custom list style */
        .thought-list li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 8px;
            color: #4A5568;
            font-size: 14px;
        }
        .thought-list li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #CBD5E0;
        }
        
        .criteria-list li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 8px;
            color: #2D3748;
            font-weight: 500;
            font-size: 15px;
        }
        .criteria-list li::before {
            content: '00c';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            left: 0;
            top: 2px;
            color: #A4C639;
            font-size: 14px;
        }
        
        /* Chart Container */
        #growthChart {
            max-height: 180px;
        }
    </style>
</head>
<body>
<div class="slide-container p-16">
<!-- Header Section -->
<div class="mb-10 border-b-2 border-gray-100 pb-6 flex justify-between items-end">
<div>
<div class="flex items-center mb-2">
<span class="w-2 h-8 bg-point mr-3"></span>
<h2 class="text-3xl font-bold text-gray-800 tracking-tight">기획 판단 &amp; 결과</h2>
</div>
<p class="text-gray-500 ml-5 text-lg">치열한 고민 끝에 내린 결정과 그로 인한 성과</p>
</div>
<div class="text-gray-300 font-bold text-4xl opacity-20">07</div>
</div>
<!-- Main Content: 3 Column Grid -->
<div class="flex-1 grid grid-cols-10 gap-8 h-full">
<!-- Column 1: 기획 판단 과정 (30%) -->
<div class="col-span-3 flex flex-col h-full">
<h3 class="text-xl font-bold text-gray-700 mb-6 flex items-center">
<span class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3 text-sm">
<i class="fas fa-brain"></i>
</span>
                    기획 판단 과정
                </h3>
<div class="process-card p-6 flex-1 flex flex-col relative border border-gray-100">
<!-- 고민 -->
<div class="mb-8 relative z-10">
<div class="flex items-center mb-4">
<span class="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded mr-2">THINKING</span>
<h4 class="font-bold text-gray-800 text-lg">핵심 고민</h4>
</div>
<ul class="thought-list">
<li><p>고령층 투자자의 모바일 적응 문제</p></li>
<li><p>보호자 동의 및 해피콜 프로세스 도입</p></li>
<li><p>기존 프로세스를 모바일에 재설계</p></li>
</ul>
</div>
<!-- Arrow Connector -->
<div class="flex justify-center mb-6">
<i class="fas fa-arrow-down text-gray-300 text-xl animate-bounce"></i>
</div>
<!-- 판단 -->
<div class="relative z-10">
<div class="flex items-center mb-4">
<span class="text-xs font-bold bg-point-light text-point px-2 py-1 rounded mr-2">DECISION</span>
<h4 class="font-bold text-gray-800 text-lg">판단 기준</h4>
</div>
<ul class="criteria-list">
<li><p>불안 해소에 직접 기여하는가?</p></li>
<li><p>오류 발생 시 즉각 대응 가능한가?</p></li>
</ul>
<div class="mt-4 p-3 bg-white rounded border border-point border-opacity-30">
<p class="text-sm text-point font-bold text-center">"통제권 부여가 핵심 솔루션"</p>
</div>
</div>
<!-- Bg Icon -->
<div class="absolute bottom-4 right-4 text-gray-100 text-6xl opacity-50 z-0">
<i class="fas fa-lightbulb"></i>
</div>
</div>
</div>
<!-- Column 2: 정량 성과 (35%) -->
<div class="col-span-4 flex flex-col h-full">
<h3 class="text-xl font-bold text-gray-700 mb-6 flex items-center">
<span class="w-8 h-8 rounded-full bg-point text-white flex items-center justify-center mr-3 text-sm">
<i class="fas fa-chart-line"></i>
</span>
                    정량 성과
                </h3>
<div class="result-card p-8 flex-1 flex flex-col justify-center items-center text-center bg-white">
<!-- Background Decoration -->
<div class="absolute top-0 right-0 w-64 h-64 bg-point-light rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
<div class="absolute bottom-0 left-0 w-32 h-32 bg-gray-50 rounded-tr-full -ml-8 -mb-8"></div>
<div class="relative z-10 w-full">
<p class="text-gray-500 font-medium mb-2 uppercase tracking-wide text-sm">출시 3개월 누적 계약 규모</p>
<div class="flex items-baseline justify-center mb-2">
<span class="highlight-number text-8xl font-black text-gray-800">80</span>
<span class="text-4xl font-bold text-gray-600 ml-2">억 원</span>
</div>
<div class="w-24 h-1 bg-point mx-auto mb-6 rounded-full"></div>
<!-- Chart Container -->
<div class="w-full mb-6" style="height: 180px;">
<canvas id="growthChart"></canvas>
</div>
<div class="grid grid-cols-2 gap-4 w-full">
<div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
<div class="text-point text-2xl mb-2"><i class="fas fa-rocket"></i></div>
<p class="text-gray-800 font-bold text-lg">시장 조기 안착</p>
<p class="text-xs text-gray-500 mt-1">B2B 모델 전환 성공</p>
</div>
<div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
<div class="text-point text-2xl mb-2"><i class="fas fa-handshake"></i></div>
<p class="text-gray-800 font-bold text-lg">파트너십 확대</p>
<p class="text-xs text-gray-500 mt-1">투자일임사 신규 제휴</p>
</div>
</div>
</div>
</div>
</div>
<!-- Column 3: 변화 & 정성 성과 (35%) -->
<div class="col-span-3 flex flex-col h-full">
<h3 class="text-xl font-bold text-gray-700 mb-6 flex items-center">
<span class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3 text-sm">
<i class="fas fa-sync-alt"></i>
</span>
                    변화 (Impact)
                </h3>
<div class="flex-1 flex flex-col gap-5">
<!-- Change 1 -->
<div class="change-card p-5 flex-1 flex flex-col justify-center">
<div class="flex justify-between items-start mb-2">
<div class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-600">
<i class="fas fa-headset"></i>
</div>
<span class="text-3xl font-bold text-point">0%</span>
</div>
<p class="font-bold text-gray-800 text-lg mb-1">모니터링 불가 VOC 소멸</p>
<p class="text-sm text-gray-500">고객이 직접 매매 상태를 확인함으로써<br/>구조적 불안감 완전 해소</p>
</div>
<!-- Change 2 -->
<div class="change-card p-5 flex-1 flex flex-col justify-center">
<div class="flex justify-between items-start mb-2">
<div class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-600">
<i class="fas fa-smile"></i>
</div>
<span class="text-xs font-bold text-white bg-point px-2 py-1 rounded">UX 개선</span>
</div>
<p class="font-bold text-gray-800 text-lg mb-1">고객 피로도 감소</p>
<p class="text-sm text-gray-500">원하는 시점에 매매 시작/중단이<br/>가능해져 심리적 압박 완화</p>
</div>
<!-- Change 3 -->
<div class="change-card p-5 flex-1 flex flex-col justify-center">
<div class="flex justify-between items-start mb-2">
<div class="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-600">
<i class="fas fa-layer-group"></i>
</div>
<span class="text-xs font-bold text-white bg-gray-400 px-2 py-1 rounded">NEXT</span>
</div>
<p class="font-bold text-gray-800 text-lg mb-1">알고리즘 확장 논의</p>
<p class="text-sm text-gray-500">안정적 모바일 플랫폼 확보로<br/>신규 투자 상품 라인업 확대</p>
</div>
</div>
</div>
</div>
</div>
<script>
        const ctx = document.getElementById('growthChart').getContext('2d');
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(164, 198, 57, 0.2)');
        gradient.addColorStop(1, 'rgba(164, 198, 57, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['M-1 (Pre)', 'M+1', 'M+2', 'M+3'],
                datasets: [{
                    label: '누적 계약고',
                    data: [0, 25, 48, 80],
                    borderColor: '#A4C639',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#A4C639',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 10,
                        titleFont: { size: 12 },
                        bodyFont: { size: 13, weight: 'bold' },
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' 억 원';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            maxTicksLimit: 5,
                            callback: function(value) {
                                return value + '억';
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#64748b',
                            font: { size: 11, weight: 'bold' }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html></html>`,
        8: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>에필로그 – 기억에 남는 사례</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }
        
        /* Header Style */
        .header {
            margin-top: 0;
            margin-bottom: 40px;
            padding-left: 0;
            flex-shrink: 0;
        }
        .header h2 {
            font-size: 32px;
            font-weight: 900;
            color: #1a1a1a;
            position: relative;
            display: inline-block;
        }
        .header h2::after {
            content: '';
            display: block;
            width: 100%;
            height: 4px;
            background-color: #A4C639;
            margin-top: 10px;
            border-radius: 2px;
        }

        /* Content Layout */
        .content-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center; /* Vertically center the text block */
            position: relative;
        }

        /* Narrative Container */
        .narrative-container {
            max-width: 900px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 32px;
            position: relative;
            z-index: 10;
        }

        /* Quotation Decoration */
        .quote-deco {
            position: absolute;
            top: -60px;
            left: -80px;
            font-size: 140px;
            color: #A4C639;
            opacity: 0.1;
            font-family: serif;
            z-index: 0;
            line-height: 1;
        }

        /* Text Styles */
        .text-block {
            font-size: 17px;
            line-height: 1.75; /* Generous line height for readability */
            color: #4B5563;
            font-weight: 400;
            word-break: keep-all;
        }

        .highlight {
            color: #111827; /* Darker black for emphasis */
            font-weight: 700;
            position: relative;
            display: inline;
            z-index: 1;
        }
        
        .highlight::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 0;
            width: 100%;
            height: 8px;
            background-color: rgba(164, 198, 57, 0.2); /* Soft highlighter effect */
            z-index: -1;
        }

        .quote-text {
            font-size: 20px;
            font-weight: 600;
            color: #374151;
            border-left: 4px solid #A4C639;
            padding-left: 20px;
            margin: 10px 0;
            background-color: #fcfdf9; /* Very subtle background */
            padding-top: 12px;
            padding-bottom: 12px;
        }

        .closing-text {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-top: 20px;
            text-align: right;
            border-top: 1px solid #E5E7EB;
            padding-top: 30px;
        }

        /* Bottom Decoration */
        .bottom-line {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 200px;
            height: 2px;
            background-color: #A4C639;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Header -->
<div class="header">
<h2>에필로그 – 기억에 남는 사례</h2>
</div>
<!-- Content -->
<div class="content-wrapper">
<div class="narrative-container">
<div class="quote-deco">“</div>
<div class="text-block">
<p>한 시각장애인 고객이 투자일임사를 통해 문의를 보내왔습니다.</p>
<div class="quote-text">
<p>"본인도 이 서비스를 사용하고 싶습니다."</p>
</div>
</div>
<div class="text-block">
<p>
                        그동안 저는 연령대에 따른 사용성만을 고려해왔지, 
                        시각장애인을 포함한 다른 사용자 환경에 대해서는 깊이 고민해본 적이 없었습니다.
                        이 요청을 받은 순간, 이 문제는 책상 위에서 판단할 수 있는 것이 아니라 
                        <span class="highlight">직접 사용자의 환경을 봐야 한다</span>고 생각했습니다.
                    </p>
</div>
<div class="text-block">
<p>
                        고객의 집을 찾아가 보조공학기를 통해 주식 거래를 수행하는 실제 사용 환경을 확인했습니다.
                        놀랍게도 시각장애인 역시 다양한 도구를 활용해 이미 투자 활동을 하고 계셨습니다.
                        신용불량자 등 법적인 제약이 있는 경우를 제외하고,
                        <span class="highlight">그 어떤 사용자도 대상에서 제외되어야 할 이유는 없다</span>는 
                        당연한 사실을 놓치고 있었다는 것을 깨달았습니다.
                    </p>
</div>
<div class="text-block">
<p>
                        이 경험은 저에게 분명한 반성이었습니다. 고려하지 못했던 것이 아니라, 
                        알지 않으려 했던 영역, 무지의 문제였다고 생각합니다.
                        이후 서비스 기획 과정에서 특정 사용자를 전제로 배제하고 있지는 않은지 
                        스스로 점검하는 기준이 생겼습니다.
                    </p>
</div>
<div class="closing-text">
<p>
                        이 프로젝트는 서비스를 모바일로 전환한 경험이기도 했지만,<br/>
                        무엇보다 <span style="color: #A4C639;">소비자 관점을 다시 정의하게 만든 계기</span>였습니다.
                    </p>
</div>
</div>
<div class="bottom-line"></div>
</div>
</div>
</body>
</html></html></html>`
    };

    // 전략1 파일 내용을 객체로 저장
    const strategy1Contents = {
        1: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-1</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-1썸네일(수정).png" alt="전략1-1" class="slide-image" />
    </div>
</body>
</html>`,
        2: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-2</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-2.png" alt="전략1-2" class="slide-image" />
    </div>
</body>
</html>`,
        3: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-3</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-3.png" alt="전략1-3" class="slide-image" />
    </div>
</body>
</html>`,
        4: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-4</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-4.png" alt="전략1-4" class="slide-image" />
    </div>
</body>
</html>`,
        5: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-5</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-5.png" alt="전략1-5" class="slide-image" />
    </div>
</body>
</html>`,
        6: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-6</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-6.png" alt="전략1-6" class="slide-image" />
    </div>
</body>
</html>`,
        7: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-7</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-7.png" alt="전략1-7" class="slide-image" />
    </div>
</body>
</html>`,
        8: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략1-8</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략1-8.png" alt="전략1-8" class="slide-image" />
    </div>
</body>
</html>`
    };

    // 넥스트1 파일 내용을 객체로 저장
    const next1Contents = {
        1: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>넥스트1-1</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/넥스트1(수정).png" alt="넥스트1-1" class="slide-image" />
    </div>
</body>
</html>`,
        2: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>기획자 역할 재정의</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: #ffffff;
        }
        .quote-mark {
            font-family: serif;
            font-size: 120px;
            line-height: 1;
            color: #e2e8f0;
            position: absolute;
            z-index: 0;
        }
    </style>
</head>
<body>
<div class="slide-container relative overflow-hidden flex flex-col justify-between p-16">
<!-- 배경 장식 -->
<div class="quote-mark top-10 left-10">"</div>
<div class="quote-mark bottom-40 right-10 rotate-180">"</div>
<!-- 상단: 타이틀 -->
<div class="mb-8">
<div class="flex items-center space-x-2 mb-2">
<span class="w-2 h-8 rounded-sm" style="background-color: #53afc8;"></span>
<h2 class="text-3xl font-bold text-slate-800">관점의 전환과 새로운 역할 정의</h2>
</div>
</div>
<!-- 중앙: 메인 선언 문구 -->
<div class="flex-1 flex flex-col justify-center items-center text-center z-10">
<p class="text-xl text-slate-500 mb-6 font-light leading-relaxed">
                AI 환경에서 기획자는 더 이상<br/>
<span class="border-b border-slate-300 pb-1">개발을 요청하기 위해 기획서를 만드는 사람</span>이 아니라,
            </p>
<div class="space-y-4">
<p class="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
<span style="color: #53afc8;">가능성을 직접 실행</span>해
                </p>
<p class="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
<span class="px-2" style="background-color: #e0f7f5;">검증까지</span>하는 역할
                </p>
</div>
</div>
<!-- 하단: 보조 텍스트 (3열 구조) -->
<div class="grid grid-cols-3 gap-8 mt-8 z-10 border-t border-slate-100 pt-8">
<!-- Item 1 -->
<div class="relative pl-6 border-l-4 border-slate-200">
<h3 class="text-slate-800 font-bold mb-2 flex items-center" style="font-size: 21px;">
<i class="fas fa-eye mr-2" style="color: #53afc8;"></i> 가시성 있는 결과물
                </h3>
<p class="text-slate-600 leading-relaxed" style="font-size: 17px;">
                    기획자의 사고 과정과 기획의 의도를<br/>
                    정적인 문서가 아닌<br/>
<strong>가시성 있는 결과물</strong>로 보여주고자 판단.
                </p>
</div>
<!-- Item 2 -->
<div class="relative pl-6 border-l-4 border-slate-200">
<h3 class="text-slate-800 font-bold mb-2 flex items-center" style="font-size: 21px;">
<i class="fas fa-ban text-red-400 mr-2"></i> 기존 방식의 한계 극복
                </h3>
<p class="text-slate-600 leading-relaxed" style="font-size: 17px;">
                    과거에는 기획은 있으나 개발 이해 부족으로<br/>
                    직접 구현까지 이어지지 못한<br/>
<strong>수동적 방식</strong>에서 탈피하고자 함.
                </p>
</div>
<!-- Item 3 -->
<div class="relative pl-6 rounded-r-lg py-2 -my-2" style="border-left: 4px solid #53afc8; background-color: rgba(83, 175, 200, 0.3);">
<h3 class="font-bold mb-2 flex items-center" style="font-size: 21px; color: #3c899e;">
<i class="fas fa-check-circle mr-2" style="color: #53afc8;"></i> 사전 검증의 당위성
                </h3>
<p class="text-slate-700 leading-relaxed" style="font-size: 17px;">
                    단순히 아이디어를 문서를 만드는데 그치지 않고,<br/>
                    <strong>검증을 통한 의사결정과 생산성 향상</strong> 목표
                </p>
</div>
</div>
</div>
</body>
</html>`,
        3: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>그래서 지금 하고 있는 것</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: #ffffff;
            padding: 40px 60px;
        }
        .step-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .connector-line {
            position: absolute;
            top: 50%;
            left: 2.5rem;
            right: 2.5rem;
            height: 2px;
            background-color: #e2e8f0;
            z-index: 0;
            transform: translateY(-50%);
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- 상단: 타이틀 -->
<div class="mb-8">
<div class="flex items-center space-x-2 mb-2">
<span class="w-2 h-8 rounded-sm" style="background-color: #53afc8;"></span>
<p class="text-3xl font-bold text-slate-800">그래서 지금 하고 있는 것</p>
</div>
<p class="text-slate-500 ml-4">기획자의 영역을 실행과 검증까지 확장하는 구체적 방법론</p>
</div>
<!-- 섹션 1: 프로세스 플로우 -->
<div class="rounded-2xl p-8 mb-6 relative" style="background-color: #e0f7f5;">
<div class="flex justify-between items-center relative px-10">
<!-- 연결선 -->
<div class="connector-line"></div>
<!-- 단계 1: 아이디어 -->
<div class="flex flex-col items-center relative z-10 group">
<div class="step-circle bg-white text-2xl shadow-md transition-all duration-300" style="color: #53afc8; border: 2px solid #e0f7f5;" onmouseover="this.style.borderColor='#53afc8'; this.style.backgroundColor='#53afc8'; this.style.color='white';" onmouseout="this.style.borderColor='#e0f7f5'; this.style.backgroundColor='white'; this.style.color='#53afc8';">
<i class="far fa-lightbulb"></i>
</div>
<p class="mt-3 font-bold text-slate-700 text-sm">아이디어</p>
</div>
<!-- 화살표 -->
<div class="z-10 px-2 text-slate-300" style="background-color: #e0f7f5;"><i class="fas fa-chevron-right"></i></div>
<!-- 단계 2: 기획 -->
<div class="flex flex-col items-center relative z-10 group">
<div class="step-circle bg-white text-2xl shadow-md transition-all duration-300" style="color: #53afc8; border: 2px solid #e0f7f5;" onmouseover="this.style.borderColor='#53afc8'; this.style.backgroundColor='#53afc8'; this.style.color='white';" onmouseout="this.style.borderColor='#e0f7f5'; this.style.backgroundColor='white'; this.style.color='#53afc8';">
<i class="fas fa-pen-ruler"></i>
</div>
<p class="mt-3 font-bold text-slate-700 text-sm">기획</p>
</div>
<!-- 화살표 -->
<div class="z-10 px-2 text-slate-300" style="background-color: #e0f7f5;"><i class="fas fa-chevron-right"></i></div>
<!-- 단계 3: 구조 설계 -->
<div class="flex flex-col items-center relative z-10 group">
<div class="step-circle bg-white text-2xl shadow-md transition-all duration-300" style="color: #53afc8; border: 2px solid #e0f7f5;" onmouseover="this.style.borderColor='#53afc8'; this.style.backgroundColor='#53afc8'; this.style.color='white';" onmouseout="this.style.borderColor='#e0f7f5'; this.style.backgroundColor='white'; this.style.color='#53afc8';">
<i class="fas fa-sitemap"></i>
</div>
<p class="mt-3 font-bold text-slate-700 text-sm">구조 설계</p>
</div>
<!-- 화살표 & 바이브코딩 뱃지 -->
<div class="z-10 px-2 text-slate-300 relative flex flex-col items-center" style="background-color: #e0f7f5;">
<div class="absolute -top-8 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-md text-center whitespace-nowrap" style="background-color: #7dd9ce; left: 50%; transform: translateX(-50%);">
                        With AI
                    </div>
<i class="fas fa-chevron-right"></i>
</div>
<!-- 단계 4: 개발 (강조) -->
<div class="flex flex-col items-center relative z-10 group">
<div class="step-circle text-white text-2xl shadow-lg" style="background-color: #7dd9ce; ring: 4px solid #e0f7f5;">
<i class="fas fa-code"></i>
</div>
<p class="mt-3 font-bold text-sm" style="color: #3c899e;">개발 (구현)</p>
</div>
<!-- 화살표 -->
<div class="z-10 px-2 text-slate-300" style="background-color: #e0f7f5;"><i class="fas fa-chevron-right"></i></div>
<!-- 단계 5: 배포 -->
<div class="flex flex-col items-center relative z-10 group">
<div class="step-circle bg-white text-2xl shadow-md transition-all duration-300" style="color: #53afc8; border: 2px solid #e0f7f5;" onmouseover="this.style.borderColor='#53afc8'; this.style.backgroundColor='#53afc8'; this.style.color='white';" onmouseout="this.style.borderColor='#e0f7f5'; this.style.backgroundColor='white'; this.style.color='#53afc8';">
<i class="fas fa-rocket"></i>
</div>
<p class="mt-3 font-bold text-slate-700 text-sm">배포</p>
</div>
</div>
<!-- 프로세스 설명 -->
<div class="mt-6 text-center pt-4" style="border-top: 1px solid #e0f7f5;">
<p class="text-slate-600 text-sm">
<span class="font-bold" style="color: #7dd9ce;">바이브코딩 등 AI 툴</span>을 활용해 아이디어를 빠르게 실험하고 직접 검증합니다.
                </p>
</div>
</div>
<!-- 섹션 2: 실행 방식 카드 (4개) -->
<div class="grid grid-cols-4 gap-6 mb-6">
<!-- Card 1 -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
<div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #e0f7f5; color: #53afc8;">
<i class="fas fa-tools"></i>
</div>
<h3 class="font-bold text-slate-800 mb-2 text-sm">실무 스킬화</h3>
<p class="text-xs text-slate-500 leading-relaxed">
                    AI 툴을 단순 보조 수단이 아닌<br/>핵심 실무 스킬로 적극 활용
                </p>
</div>
<!-- Card 2 -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
<div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #e0f7f5; color: #53afc8;">
<i class="fas fa-flask"></i>
</div>
<h3 class="font-bold text-slate-800 mb-2 text-sm">빠른 실험</h3>
<p class="text-xs text-slate-500 leading-relaxed">
                    아이디어를 묵히지 않고<br/>코딩 툴을 통해 즉시 실험
                </p>
</div>
<!-- Card 3 -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
<div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #e0f7f5; color: #53afc8;">
<i class="fas fa-user-cog"></i>
</div>
<h3 class="font-bold text-slate-800 mb-2 text-sm">직접 수행</h3>
<p class="text-xs text-slate-500 leading-relaxed">
                    기획부터 배포까지의 전 과정을<br/>주도적으로 직접 수행
                </p>
</div>
<!-- Card 4 -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
<div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #e0f7f5; color: #53afc8;">
<i class="fas fa-check-double"></i>
</div>
<h3 class="font-bold text-slate-800 mb-2 text-sm">역할 확장</h3>
<p class="text-xs text-slate-500 leading-relaxed">
                    개발자가 아니더라도<br/>가능성 검증은 기획자의 몫
                </p>
</div>
</div>
<!-- 섹션 3: 선제 답변 (하단 강조 박스) -->
<div class="flex-1 bg-slate-800 rounded-xl p-6 flex items-center justify-between text-white relative overflow-hidden">
<!-- 배경 데코 -->
<div class="absolute -right-10 -bottom-10 w-40 h-40 bg-slate-700 rounded-full opacity-50"></div>
<div class="w-1/4 border-r border-slate-600 pr-6">
<p class="font-bold mb-1 uppercase tracking-wider" style="font-size: 15px; color: #53afc8;">Clarification</p>
<p class="font-bold leading-tight text-black" style="font-size: 23px;">개발자가 되려는<br/>것이 아닌</p>
</div>
<div class="w-3/4 pl-8 z-10 flex justify-between items-center">
<div class="space-y-3">
<div class="flex items-start">
<i class="fas fa-check mt-1 mr-3" style="color: #53afc8;"></i>
<p class="text-black" style="font-size: 17px;">개발을 요청하기 전에 <span class="font-bold">기획 단계에서 구현 가능성을 미리 검증</span></p>
</div>
<div class="flex items-start">
<i class="fas fa-check mt-1 mr-3" style="color: #53afc8;"></i>
<p class="text-black" style="font-size: 17px;">AI 환경에서 기획자가 직접 구현 가능성을 <span class="font-bold">사전에 검증하기 위해 현재의 AI 인프라 적극 활용</span></p>
</div>
</div>
<div class="text-5xl text-slate-700 opacity-50">
<i class="fas fa-quote-right"></i>
</div>
</div>
</div>
</div>
</body>
</html>`,
        4: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>미니 케이스 스터디</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: #ffffff;
            padding: 40px 60px;
        }
        .flow-card {
            position: relative;
            transition: all 0.3s ease;
        }
        .arrow-right::after {
            content: '';
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 8px solid #cbd5e1;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- 상단 헤더 -->
<div class="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
<div>
<div class="flex items-center space-x-2 mb-1">
<span class="w-2 h-8 rounded-sm" style="background-color: #53afc8;"></span>
<h1 class="text-3xl font-bold text-slate-800">미니 케이스 스터디</h1>
</div>
<p class="text-slate-500 ml-4">내가 가고자 하는 방향이 맞는지 직접 실험해본 웹사이트 프로젝트</p>
</div>
<div class="text-right">
<span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style="background-color: #e0f7f5; color: #3c899e;">Case Study</span>
</div>
</div>
<!-- 메인 콘텐츠 영역 (2열 분할) -->
<div class="flex-1 flex space-x-8 mb-6 h-full">
<!-- 좌측: 문제 및 접근 (60%) - 1x3 배열 -->
<div class="w-3/5 flex flex-col space-y-6 h-full">
<!-- 문제 섹션 -->
<div class="bg-slate-50 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
<div class="flex items-center mb-3">
<div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-3">
<i class="fas fa-exclamation"></i>
</div>
<h2 class="text-lg font-bold text-slate-800">문제 (Problem)</h2>
</div>
<p class="text-slate-600 text-sm leading-relaxed pl-11 flex-1">
                        기획자의 사고 과정과 기획의 의도를 정적인 문서가 아닌, <span class="font-bold text-slate-800">가시성 있고 작동 가능한 결과물</span>로 전달할 필요성을 느낌.
                    </p>
</div>
<!-- 접근 섹션 1 -->
<div class="bg-slate-50 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
<div class="flex items-center mb-4">
<div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: #e0f7f5; color: #53afc8;">
<i class="fas fa-bullseye"></i>
</div>
<h2 class="text-lg font-bold text-slate-800">접근 (Approach)</h2>
</div>
<div class="pl-11 space-y-3 flex-1">
<div class="flex items-start">
<i class="fas fa-check mt-1 mr-2 text-xs" style="color: #53afc8;"></i>
<p class="text-slate-600 text-sm">기획은 있으나 직접 구현까지 이어지지 못했던 <span class="font-bold">기존 방식 탈피</span>.</p>
</div>
<div class="flex items-start">
<i class="fas fa-check mt-1 mr-2 text-xs" style="color: #53afc8;"></i>
<p class="text-slate-600 text-sm"><span class="px-1 font-bold text-xs rounded" style="background-color: #e0f7f5; color: #3c899e;">바이브코딩</span>을 활용해 기획 → 구조 설계 → 개발 → 배포까지 하나의 실험으로 진행.</p>
</div>
</div>
</div>
<!-- 접근 섹션 2 (새로운 박스) -->
<div class="bg-slate-50 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
<div class="flex items-center mb-4">
<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
<i class="fas fa-check-circle"></i>
</div>
<h2 class="text-lg font-bold text-slate-800">검증 (Verification)</h2>
</div>
<div class="pl-11 space-y-3 flex-1">
<div class="flex items-start">
<i class="fas fa-check text-green-400 mt-1 mr-2 text-xs"></i>
<p class="text-slate-600 text-sm">1차 검증 산출물: 개발자/디자이너 도움 없이 만든 <span class="font-bold">현재의 포트폴리오 웹사이트</span>.</p>
</div>
<div class="flex items-start">
<i class="fas fa-check text-green-400 mt-1 mr-2 text-xs"></i>
<p class="text-slate-600 text-sm">KT 협업: <span class="font-bold">AI 비대면 수술동의서 서비스</span> 기획을 통해 AI 산업 적용 시도.</p>
</div>
</div>
</div>
</div>
<!-- 우측: 의미 (40%) -->
<div class="w-2/5 flex flex-col">
<div class="bg-slate-800 text-white rounded-xl p-8 h-full relative overflow-hidden flex flex-col justify-center shadow-lg">
<!-- 장식 요소 -->
<div class="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20" style="background-color: #53afc8;"></div>
<div class="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-10" style="background-color: #7dd9ce;"></div>
<div class="relative z-10">
<div class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-6 shadow-lg" style="background-color: #53afc8;">
<i class="fas fa-lightbulb"></i>
</div>
<h2 class="text-2xl font-bold mb-4 text-black">의미 (Meaning)</h2>
<div class="space-y-4">
<p class="text-black text-sm leading-relaxed pl-4" style="border-left: 2px solid #53afc8;">
                                이 웹사이트는 단순한 포트폴리오가 아닙니다.
                            </p>
<p class="text-black text-base font-medium leading-relaxed">
                                AI 환경에서 <span class="text-black font-bold">기획자가 어떻게 움직일 수 있는지</span>를 보여주는 결과물입니다.
                            </p>
<p class="text-black text-sm leading-relaxed pt-2 border-t border-slate-700">
                                AI를 단순 보조 수단이 아닌, 산업에 적용 가능한 서비스로 확장하는 시도까지 포함하고 있습니다.
                            </p>
</div>
</div>
</div>
</div>
</div>
<!-- 하단: 간단 흐름 도식 -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mt-2">
<h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Process Flow</h3>
<div class="flex justify-between items-center relative">
<!-- 연결선 -->
<div class="absolute top-1/2 left-10 right-10 h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
<!-- Step 1 -->
<div class="flex-1 flex flex-col items-center">
<div class="w-32 bg-white border border-slate-300 rounded-lg py-2 px-3 text-center shadow-sm z-10">
<p class="text-xs font-bold text-slate-700">문제 인식</p>
</div>
</div>
<!-- Arrow -->
<div class="text-slate-300"><i class="fas fa-chevron-right"></i></div>
<!-- Step 2 -->
<div class="flex-1 flex flex-col items-center">
<div class="w-32 rounded-lg py-2 px-3 text-center shadow-sm z-10" style="background-color: #e0f7f5; border: 1px solid #7dd9ce;">
<p class="text-xs font-bold" style="color: #3c899e;">바이브코딩 실험</p>
</div>
</div>
<!-- Arrow -->
<div class="text-slate-300"><i class="fas fa-chevron-right"></i></div>
<!-- Step 3 -->
<div class="flex-1 flex flex-col items-center">
<div class="w-40 bg-white border border-slate-300 rounded-lg py-2 px-3 text-center shadow-sm z-10">
<p class="text-xs font-bold text-slate-700">포트폴리오 웹 제작</p>
</div>
</div>
<!-- Arrow -->
<div class="text-slate-300"><i class="fas fa-chevron-right"></i></div>
<!-- Step 4 -->
<div class="flex-1 flex flex-col items-center">
<div class="w-48 bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-center shadow-sm z-10">
<p class="text-xs font-bold text-white" style="color: #000000 !important;">산업 적용: AI 수술동의서</p>
</div>
</div>
</div>
</div>
</div>
</body>
</html>`,
        5: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AI 환경에서 기획 역할을 재정의하는 영역</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: #ffffff;
            padding: 40px 60px;
        }
        .list-item {
            position: relative;
            padding-left: 20px;
            margin-bottom: 8px;
            transition: all 0.2s ease;
        }
        .list-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #cbd5e1;
            transition: background-color 0.2s ease;
        }
        .group:hover .list-item::before {
            background-color: currentColor;
        }
        .card-shadow {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- 배경 장식 요소 -->
<div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full z-0 opacity-50"></div>
<div class="absolute bottom-0 left-0 w-40 h-40 rounded-tr-full z-0 opacity-50" style="background-color: #e0f7f5;"></div>
<!-- 상단 헤더 -->
<div class="mb-8 z-10">
<div class="flex items-center space-x-2 mb-2">
<span class="w-2 h-8 rounded-sm" style="background-color: #53afc8;"></span>
<h1 class="text-3xl font-bold text-slate-800">AI 환경에서 기획 역할을 재정의하는 영역</h1>
</div>
<p class="text-slate-500 ml-4 max-w-3xl">현재는 아래 영역들을 기준으로 AI 환경에서 각 역할을 어떻게 더 효율화할 수 있을지 고민하는 단계입니다.</p>
</div>
<!-- 메인 콘텐츠: 허브 앤 스포크 모델 다이어그램 -->
<style>
.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.hub-shadow {
  box-shadow: 0 10px 15px -3px rgba(83, 175, 200, 0.15), 0 4px 6px -2px rgba(83, 175, 200, 0.1);
}
.text-xs-custom {
  font-size: 0.85rem;
  line-height: 1.6;
}
</style>
<div class="flex-1 z-10 h-full overflow-auto relative">
<!-- SVG Connection Lines -->
<svg class="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 1280 720" preserveAspectRatio="none">
<!-- Center coordinate - 중앙 허브의 정중앙 (50%, 50%) -->
<!-- Line to Top Left Card - 박스 우측 중앙에 연결 -->
<line stroke="#CBD5E1" stroke-width="2" x1="50%" x2="330" y1="50%" y2="200"></line>
<!-- Line to Top Right Card - 박스 좌측 중앙에 연결 -->
<line stroke="#CBD5E1" stroke-width="2" x1="50%" x2="950" y1="50%" y2="200"></line>
<!-- Line to Bottom Left Card - 박스 우측 중앙에 연결 -->
<line stroke="#CBD5E1" stroke-width="2" x1="50%" x2="330" y1="50%" y2="520"></line>
<!-- Line to Bottom Right Card - 박스 좌측 중앙에 연결 -->
<line stroke="#CBD5E1" stroke-width="2" x1="50%" x2="950" y1="50%" y2="520"></line>
</svg>
<!-- Main Content Grid -->
<div class="relative w-full h-full z-10 p-12 flex flex-col justify-center items-center">
<!-- Top Row Cards -->
<div class="w-full flex justify-between items-start mb-16 px-10">
<!-- Top Left: 신사업 전략 수립 (I) -->
<div class="w-[420px] bg-white card-shadow border border-slate-100 rounded-lg p-6 relative" style="position: absolute; top: 80px; left: calc(40px + 5%); transform: translateY(-50%);">
<!-- Connector Dot -->
<div class="absolute -right-1 top-1/2 transform -translate-y-1/2 translate-x-full w-2 h-2 rounded-full" style="background-color: #7dd9ce;"></div>
<h2 class="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center">
<span class="w-1.5 h-4 mr-2 rounded-sm" style="background-color: #53afc8;"></span>
                        신사업 전략 수립 (Ⅰ)
                    </h2>
<div class="grid grid-cols-2 gap-x-4 gap-y-1">
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>시장 분석</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>사업 정의</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>시장 / 고객 분석</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>시장 환경 분석</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>타겟 고객 선정</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>경쟁 분석</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>핵심 자원 분석</p>
</div>
</div>
<!-- Top Right: 신사업 전략 수립 (II) -->
<div class="w-[420px] bg-white card-shadow border border-slate-100 rounded-lg p-6 relative" style="position: absolute; top: 120px; right: 40px;">
<!-- Connector Dot -->
<div class="absolute -left-1 top-1/2 transform -translate-y-1/2 -translate-x-full w-2 h-2 rounded-full" style="background-color: #7dd9ce;"></div>
<h2 class="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center">
<span class="w-1.5 h-4 mr-2 rounded-sm" style="background-color: #7dd9ce;"></span>
                        신사업 전략 수립 (Ⅱ)
                    </h2>
<div class="grid grid-cols-2 gap-x-4 gap-y-1">
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>사업 모델</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>아이디어 믹스</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>차별화 전략</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>수익 모델 설계</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>데이터 기반 의사결정</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>파트너십 전략</p>
</div>
</div>
</div>
<!-- Spacer for Center Hub -->
<div class="h-2"></div>
<!-- Bottom Row Cards -->
<div class="w-full flex justify-between items-end mt-16 px-10">
<!-- Bottom Left: 상품기획 및 관리 (I) -->
<div class="w-[420px] bg-white card-shadow border border-slate-100 rounded-lg p-6 relative" style="position: absolute; bottom: 200px; left: calc(40px + 5%); transform: translateY(50%);">
<!-- Connector Dot -->
<div class="absolute -right-1 top-1/2 transform -translate-y-1/2 translate-x-full w-2 h-2 rounded-full" style="background-color: #7dd9ce;"></div>
<h2 class="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center">
<span class="w-1.5 h-4 mr-2 rounded-sm" style="background-color: #7dd9ce;"></span>
                        상품기획 및 관리 (Ⅰ)
                    </h2>
<div class="grid grid-cols-2 gap-x-4 gap-y-1">
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>사업성 분석</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>BM 설정</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>경쟁 분석</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>포지셔닝</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>사업성 검증</p>
</div>
</div>
<!-- Bottom Right: 상품기획 및 관리 (II) -->
<div class="w-[420px] bg-white card-shadow border border-slate-100 rounded-lg p-6 relative" style="position: absolute; bottom: 120px; right: 40px;">
<!-- Connector Dot -->
<div class="absolute -left-1 top-1/2 transform -translate-y-1/2 -translate-x-full w-2 h-2 rounded-full" style="background-color: #3c899e;"></div>
<h2 class="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center">
<span class="w-1.5 h-4 mr-2 rounded-sm" style="background-color: #3c899e;"></span>
                        상품기획 및 관리 (Ⅱ)
                    </h2>
<div class="grid grid-cols-2 gap-x-4 gap-y-1">
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>실행 전략</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>MVP 정의</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>PMF 검증</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>KPI 설정</p>
<p class="text-xs-custom text-slate-600 flex items-center"><span class="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>서비스 딜리버리 방안</p>
</div>
</div>
</div>
<!-- Center Hub (Absolute Positioned on top of everything) -->
<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-20 flex items-center justify-center">
<!-- Outer glow ring -->
<div class="absolute w-full h-full rounded-full opacity-50 animate-pulse" style="background-color: #e0f7f5;"></div>
<!-- Main Circle -->
<div class="w-52 h-52 bg-white rounded-full hub-shadow flex flex-col items-center justify-center text-center relative z-10" style="border: 4px solid #e0f7f5;">
<div class="w-12 h-1 rounded-full mb-4" style="background-color: #53afc8;"></div>
<h1 class="text-2xl font-black text-slate-800 leading-tight">
                        AI 활용<br/>
<span style="color: #53afc8;">최적화</span>
</h1>
<p class="text-xs text-slate-400 mt-2 font-medium tracking-wide">Optimization</p>
</div>
</div>
</div>
</div>
<!-- 하단 메시지 (Optional) -->
<div class="absolute bottom-6 right-10 text-right z-10">
<p class="text-xs text-slate-400 italic">
                * 각 영역에 대한 AI 최적화 실험 진행 중
            </p>
</div>
</div>
</body>
</html>`,
        6: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Hybrid Planner의 완성형을 향해</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            position: relative;
            background-color: #ffffff;
            overflow: hidden;
        }
        .decorative-shape {
            position: absolute;
            border-radius: 50%;
            z-index: 0;
        }
        .arrow-box {
            position: relative;
        }
        .arrow-box::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 15px solid #cbd5e1;
        }
        /* Gradient fallback with solid colors/opacity since gradients are discouraged */
        .bg-accent-light {
            background-color: #eff6ff; /* blue-50 */
        }
        .bg-accent-dark {
            background-color: #1e293b; /* slate-800 */
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- 배경 장식 -->
<div class="decorative-shape w-96 h-96 top-[-100px] left-[-100px] opacity-50" style="background-color: #e0f7f5;"></div>
<div class="decorative-shape bg-slate-50 w-[800px] h-[800px] bottom-[-400px] right-[-200px] opacity-50"></div>
<!-- 좌측: 타이틀 영역 (40%) -->
<div class="w-2/5 h-full flex flex-col justify-center pl-20 pr-10 z-10 relative">
<div class="mb-6">
<span class="inline-block py-1 px-3 rounded-full text-xs font-bold tracking-wider uppercase mb-4" style="background-color: #e0f7f5; color: #3c899e;">Vision &amp; Goal</span>
<h1 class="text-4xl font-black text-slate-800 leading-tight mb-2">
<span style="color: #53afc8;">Hybrid Planner</span>의<br/>
                    완성형을 향해
                </h1>
<div class="w-20 h-2 mt-6 mb-6" style="background-color: #53afc8;"></div>
</div>
<p class="text-slate-500 text-lg font-light leading-relaxed">
                AI 환경에 최적화된 기획자로서,<br/>
                가능성을 검증하고 실행하는<br/>
                여정을 멈추지 않겠습니다.
            </p>
</div>
<!-- 우측: 콘텐츠 영역 (60%) -->
<div class="w-3/5 h-full flex flex-col justify-center pr-20 pl-10 z-10">
<!-- 메시지 1: 과정과 성장 -->
<div class="flex items-stretch mb-8 relative">
<!-- Step 1 -->
<div class="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative z-10">
<div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-4">
<i class="fas fa-tasks"></i>
</div>
<h3 class="text-sm font-bold text-slate-800 mb-2">영역별 고민 &amp; 검증</h3>
<p class="text-xs text-slate-500 leading-relaxed">
                        앞서 언급한 기획 영역들에 대한<br/>
                        치열한 고민과 실현 가능성 검증 수행
                    </p>
</div>
<!-- Arrow Connector -->
<div class="w-12 flex items-center justify-center text-slate-300 z-0">
<i class="fas fa-arrow-right text-xl"></i>
</div>
<!-- Step 2 -->
<div class="flex-1 bg-white rounded-xl p-6 shadow-md relative z-10" style="border: 2px solid #e0f7f5;">
<div class="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm" style="background-color: #53afc8;">
<i class="fas fa-check"></i>
</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center mb-4" style="background-color: #e0f7f5; color: #53afc8;">
<i class="fas fa-user-astronaut"></i>
</div>
<h3 class="text-sm font-bold text-slate-800 mb-2">하이브리드 기획자 완성</h3>
<p class="text-xs text-slate-500 leading-relaxed">
                        Profile에서 지향하는<br/>
                        완성형 기획자 모델에 근접
                    </p>
</div>
</div>
<!-- 메시지 2: 최종 목표 (Next Goal) - 강조 박스 -->
<div class="bg-slate-800 rounded-2xl p-8 relative overflow-hidden shadow-xl" style="background-color: #ffffff !important;">
<!-- 장식용 배경 아이콘 -->
<div class="absolute right-[-20px] bottom-[-20px] text-slate-700 text-[150px] opacity-20 transform rotate-12">
<i class="fas fa-flag-checkered"></i>
</div>
<h2 class="font-bold text-sm tracking-widest uppercase mb-4" style="color: #53afc8;">Next Goal</h2>
<div class="flex items-start space-x-6 relative z-10">
<div class="flex-1">
<div class="flex items-center mb-3">
<div class="w-8 h-8 rounded bg-slate-700 flex items-center justify-center mr-3" style="color: #53afc8;">
<i class="fas fa-building"></i>
</div>
<h3 class="text-lg font-bold text-black">조직 적용</h3>
</div>
<p class="text-black text-sm font-light leading-relaxed pl-11 border-l border-slate-600">
                            내가 속한 기업과 조직에<br/>
                            AI 환경에 최적화된 방식을 이식
                        </p>
</div>
<div class="h-20 w-px bg-slate-600 mx-4"></div>
<div class="flex-1">
<div class="flex items-center mb-3">
<div class="w-8 h-8 rounded bg-slate-700 flex items-center justify-center mr-3" style="color: #53afc8;">
<i class="fas fa-chart-line"></i>
</div>
<h3 class="text-lg font-bold text-black">성과 연결</h3>
</div>
<p class="text-black text-sm font-light leading-relaxed pl-11 border-l border-slate-600">
                            단순 도입을 넘어<br/>
                            실질적인 비즈니스 성과로 증명
                        </p>
</div>
</div>
<div class="mt-8 pt-6 border-t border-slate-700 text-center">
<p class="text-lg font-medium text-black">
                        "상상을 현실로 만드는 실행력으로 증명하겠습니다."
                    </p>
</div>
</div>
</div>
</div>
</body>
</html>`
    };

    // iframe 스케일 정보 저장을 위한 전역 배열


        // 전략2 파일 내용을 객체로 저장
    const strategy2Contents = {
        1: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>전략2-1</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/전략2-1썸네일(수정).png" alt="전략2-1" class="slide-image" />
    </div>
</body>
</html>`,
        2: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>문제 정의 ① 고객 환경 변화</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        .content-area {
            flex: 1;
            display: flex;
            gap: 24px;
            position: relative;
        }

        /* Content Boxes */
        .analysis-box {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .box-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f1f5f9;
        }

        .box-icon {
            width: 40px;
            height: 40px;
            background-color: #eff6ff; /* Blue-50 */
            color: #3b82f6; /* Blue-500 */
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            margin-right: 15px;
        }
        
        .box-icon.danger {
            background-color: #fef2f2; /* Red-50 */
            color: #ef4444; /* Red-500 */
        }

        .box-title {
            font-size: 18px;
            font-weight: 700;
            color: #334155; /* Slate-700 */
        }

        .context-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
        }

        .context-item {
            position: relative;
            padding-left: 18px;
            margin-bottom: 16px;
            font-size: 15px;
            color: #475569; /* Slate-600 */
            line-height: 1.6;
        }

        .context-item::before {
            content: "";
            position: absolute;
            left: 0;
            top: 10px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #94a3b8;
        }

        .highlight-text {
            color: #0f172a;
            font-weight: 600;
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* Arrow Connector */
        .flow-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            color: #94a3b8;
            font-size: 24px;
        }

        /* Bottom Impact Box */
        .impact-box {
            margin-top: 24px;
            background-color: #fff1f2; /* Red-50 */
            border: 1px solid #fecaca; /* Red-200 */
            border-radius: 8px;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .impact-label {
            font-size: 14px;
            font-weight: 800;
            color: #be123c; /* Rose-700 */
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }

        .impact-text {
            font-size: 16px;
            font-weight: 600;
            color: #9f1239; /* Rose-800 */
            flex: 1;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 01. 문제 정의</p>
<h1 class="page-title">고객의 물리적 환경 변화와 서비스 접근성 한계</h1>
</header>
<!-- Content Body -->
<div style="display: flex; flex-direction: column; flex: 1;">
<div class="content-area">
<!-- Box 1: Before -->
<div class="analysis-box">
<div class="box-header">
<div class="box-icon">
<i class="fas fa-house-laptop"></i>
</div>
<h3 class="box-title">Before: 팬데믹 시기</h3>
</div>
<ul class="context-list">
<li class="context-item">
                                전면 재택근무 확산으로 <span class="highlight-text">집(Home) 체류 시간</span> 극대화
                            </li>
<li class="context-item">
                                개인 PC 접근이 용이하여 <span class="highlight-text">설치형 프로그램(PC EXE)</span> 이용에 장벽 없음
                            </li>
<li class="context-item">
                                실시간으로 HTS/WTS를 켜두고 자동매매 현황 모니터링 가능
                            </li>
</ul>
</div>
<!-- Arrow -->
<div class="flow-arrow">
<i class="fas fa-circle-arrow-right"></i>
</div>
<!-- Box 2: After -->
<div class="analysis-box">
<div class="box-header">
<div class="box-icon danger">
<i class="fas fa-building-user"></i>
</div>
<h3 class="box-title">After: 엔데믹 전환기</h3>
</div>
<ul class="context-list">
<li class="context-item">
                                재택근무 축소 및 <span class="highlight-text">사무실 출근(Office)</span> 재개
                            </li>
<li class="context-item">
                                회사 PC 보안 정책(방화벽/DRM)으로 <span class="highlight-text" style="color:#ef4444; background-color: #fef2f2;">외부 프로그램 설치 불가</span>
</li>
<li class="context-item">
                                업무 중 개인 PC 사용 불가능하여 <span class="highlight-text">실시간 모니터링 단절</span>
</li>
</ul>
</div>
</div>
<!-- Impact Area -->
<div class="impact-box">
<div class="impact-label">Critical Problem</div>
<div class="impact-text">
<p>프로그램 자동 종료 및 재접속 불가로 인한 <span style="text-decoration: underline;">매매 미실행 사례 빈번</span> → VOC 급증 및 이탈 신호 감지</p>
</div>
<i class="fas fa-triangle-exclamation" style="color: #ef4444; font-size: 20px;"></i>
</div>
</div>
</main>
</div>
</body>
</html>
`,
        3: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>문제 정의 ② 제도 변화</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        .content-area {
            flex: 1;
            display: flex;
            gap: 24px;
            position: relative;
        }

        /* Content Boxes */
        .analysis-box {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .box-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f1f5f9;
        }

        .box-icon {
            width: 40px;
            height: 40px;
            background-color: #eff6ff; /* Blue-50 */
            color: #3b82f6; /* Blue-500 */
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            margin-right: 15px;
        }
        
        .box-icon.danger {
            background-color: #fef2f2; /* Red-50 */
            color: #ef4444; /* Red-500 */
        }

        .box-title {
            font-size: 18px;
            font-weight: 700;
            color: #334155; /* Slate-700 */
        }

        .context-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
        }

        .context-item {
            position: relative;
            padding-left: 18px;
            margin-bottom: 16px;
            font-size: 15px;
            color: #475569; /* Slate-600 */
            line-height: 1.6;
        }

        .context-item::before {
            content: "";
            position: absolute;
            left: 0;
            top: 10px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #94a3b8;
        }

        .highlight-text {
            color: #0f172a;
            font-weight: 600;
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* Arrow Connector */
        .flow-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            color: #94a3b8;
            font-size: 24px;
        }

        /* Bottom Impact Box */
        .impact-box {
            margin-top: 24px;
            background-color: #fff1f2; /* Red-50 */
            border: 1px solid #fecaca; /* Red-200 */
            border-radius: 8px;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .impact-label {
            font-size: 14px;
            font-weight: 800;
            color: #be123c; /* Rose-700 */
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }

        .impact-text {
            font-size: 16px;
            font-weight: 600;
            color: #9f1239; /* Rose-800 */
            flex: 1;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 01. 문제 정의</p>
<h1 class="page-title">규제 환경 변화에 따른 사업 지속성 위협</h1>
</header>
<!-- Content Body -->
<div style="display: flex; flex-direction: column; flex: 1;">
<div class="content-area">
<!-- Box 1: Before -->
<div class="analysis-box">
<div class="box-header">
<div class="box-icon">
<i class="fas fa-file-signature"></i>
</div>
<h3 class="box-title">기존: 유사투자자문업</h3>
</div>
<ul class="context-list">
<li class="context-item">
                                단순 신고만으로 불특정 다수 대상 정보제공 서비스 영업 가능
                            </li>
<li class="context-item">
                                자본금이나 전문 인력 등 진입 장벽이 낮아 초기 시장 진입 용이
                            </li>
<li class="context-item">
                                소프트웨어 판매 및 대여 형태로 <span class="highlight-text">법적 이슈 회피 가능</span>
</li>
</ul>
</div>
<!-- Arrow -->
<div class="flow-arrow">
<i class="fas fa-circle-arrow-right"></i>
</div>
<!-- Box 2: After -->
<div class="analysis-box">
<div class="box-header">
<div class="box-icon danger">
<i class="fas fa-gavel"></i>
</div>
<h3 class="box-title">변경: 투자자문·일임업 편입</h3>
</div>
<ul class="context-list">
<li class="context-item">
                                로보어드바이저 서비스가 <span class="highlight-text">자본시장법상 금융투자업</span> 영역으로 편입
                            </li>
<li class="context-item">
                                엄격한 자기자본, 전문 운용인력, 알고리즘 테스트베드 통과 요건 부과
                            </li>
<li class="context-item">
                                제도권 라이선스 미보유 시 <span class="highlight-text" style="color:#ef4444; background-color: #fef2f2;">불법 영업(형사처벌 대상)</span> 간주
                            </li>
</ul>
</div>
</div>
<!-- Impact Area -->
<div class="impact-box">
<div class="impact-label">Business Risk</div>
<div class="impact-text">
<p>기존 고객 대상 서비스 지속 불가 가능성 확대 → <span style="text-decoration: underline;">사업의 합법적 존속 자체가 불투명한 상황</span> 직면</p>
</div>
<i class="fas fa-ban" style="color: #ef4444; font-size: 20px;"></i>
</div>
</div>
</main>
</div>
</body>
</html>
`,
        4: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>문제 구조 맵</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling (Consistent with previous slides) */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        /* Structure Map Layout */
        .map-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            flex: 1;
            position: relative;
        }

        .flow-row {
            display: flex;
            align-items: stretch;
            position: relative;
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
            border: 1px solid #e2e8f0;
        }

        .flow-label {
            width: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #f1f5f9;
            margin-right: 20px;
            padding-right: 20px;
            text-align: center;
        }
        
        .label-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            margin-bottom: 8px;
        }

        .label-text {
            font-size: 13px;
            font-weight: 700;
            color: #475569;
            line-height: 1.3;
        }

        .flow-steps {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .step-box {
            flex: 1;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            height: 100%;
            justify-content: center;
        }
        
        .step-title {
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 4px;
        }

        .step-desc {
            font-size: 12px;
            color: #64748b;
            line-height: 1.3;
        }

        .arrow-next {
            color: #cbd5e1;
            font-size: 16px;
            flex-shrink: 0;
        }

        /* Converging Result */
        .result-container {
            margin-top: 10px;
            display: flex;
            gap: 20px;
        }

        .risk-box {
            flex: 1;
            background-color: #fff1f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .risk-icon {
            width: 40px;
            height: 40px;
            background-color: #fee2e2;
            color: #ef4444;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
        }

        .risk-content h4 {
            font-size: 15px;
            font-weight: 700;
            color: #991b1b;
            margin-bottom: 2px;
        }

        .risk-content p {
            font-size: 13px;
            color: #b91c1c;
        }

        /* Final Decision Box */
        .decision-box {
            background-color: #1e293b;
            border-radius: 12px;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-top: auto;
        }

        .decision-title {
            display: flex;
            flex-direction: column;
        }

        .decision-label {
            font-size: 12px;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
        }

        .decision-text {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        
        .decision-arrow {
            font-size: 24px;
            color: #60a5fa;
            animation: bounce-right 1.5s infinite;
        }

        .decision-action {
            background-color: #3b82f6;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 16px;
        }

        @keyframes bounce-right {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 01. 문제 정의</p>
<h1 class="page-title">복합적 위기 상황의 구조적 인과관계</h1>
</header>
<!-- Structure Map -->
<div class="map-container">
<!-- Flow 1: Environment -->
<div class="flow-row">
<div class="flow-label">
<div class="label-icon bg-blue-100 text-blue-600">
<i class="fas fa-users-viewfinder"></i>
</div>
<span class="label-text">고객 환경<br/>변화</span>
</div>
<div class="flow-steps">
<div class="step-box">
<p class="step-title">물리적 환경 변화</p>
<p class="step-desc">재택 축소 및<br/>사무실 출근 재개</p>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="step-box">
<p class="step-title">접근성 저하</p>
<p class="step-desc">회사 보안 정책으로<br/>PC 설치 불가</p>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="step-box">
<p class="step-title">모니터링 단절</p>
<p class="step-desc">매매 현황 실시간<br/>확인 불가능</p>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="step-box bg-red-50 border-red-100">
<p class="step-title text-red-700">VOC 급증</p>
<p class="step-desc text-red-600">주문 누락 및<br/>매매 미실행 불만</p>
</div>
</div>
</div>
<!-- Flow 2: Regulation -->
<div class="flow-row">
<div class="flow-label">
<div class="label-icon bg-orange-100 text-orange-600">
<i class="fas fa-scale-balanced"></i>
</div>
<span class="label-text">제도<br/>변화</span>
</div>
<div class="flow-steps">
<div class="step-box">
<p class="step-title">규제 편입</p>
<p class="step-desc">유사투자자문에서<br/>투자자문/일임으로 편입</p>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="step-box">
<p class="step-title">감독 강화</p>
<p class="step-desc">자본금·인력 요건<br/>및 알고리즘 검증</p>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="step-box">
<p class="step-title">라이선스 장벽</p>
<p class="step-desc">제도권 자격 미보유 시<br/>서비스 제공 불가</p>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="step-box bg-red-50 border-red-100">
<p class="step-title text-red-700">법적 리스크</p>
<p class="step-desc text-red-600">기존 영업 방식의<br/>불법화 가능성</p>
</div>
</div>
</div>
<!-- Combined Risks -->
<div class="result-container">
<div class="risk-box">
<div class="risk-icon">
<i class="fas fa-user-xmark"></i>
</div>
<div class="risk-content">
<h4>B2C 지속성 저하</h4>
<p>이용 불편으로 인한 고객 이탈 가속화</p>
</div>
</div>
<div class="risk-box">
<div class="risk-icon">
<i class="fas fa-ban"></i>
</div>
<div class="risk-content">
<h4>직접 영업 불가</h4>
<p>규제 준수 비용 증가 및 영업 정지 위험</p>
</div>
</div>
</div>
<!-- Final Decision -->
<div class="decision-box">
<div class="decision-title">
<span class="decision-label">Strategic Conclusion</span>
<p class="decision-text">기존 B2C 모델 유지 불가능 → 운영 모델의 전면적 전환 필요</p>
</div>
<i class="fas fa-arrow-right-long decision-arrow"></i>
<div class="decision-action">
                    New Strategic Package
                </div>
</div>
</div>
</main>
</div>
</body>
</html>`,
        5: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>전략 판단 ① 판단 근거</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        .content-area {
            flex: 1;
            display: flex;
            gap: 24px;
            position: relative;
        }

        /* Content Boxes */
        .analysis-box {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            flex: 1;
            border-top: 4px solid transparent;
        }

        .analysis-box.mobile {
            border-top-color: #3b82f6; /* Blue-500 */
        }

        .analysis-box.alliance {
            border-top-color: #6366f1; /* Indigo-500 */
        }

        .box-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f1f5f9;
        }

        .box-icon {
            width: 40px;
            height: 40px;
            background-color: #eff6ff; /* Blue-50 */
            color: #3b82f6; /* Blue-500 */
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            margin-right: 15px;
        }
        
        .analysis-box.alliance .box-icon {
            background-color: #eef2ff; /* Indigo-50 */
            color: #6366f1; /* Indigo-500 */
        }

        .box-title {
            font-size: 18px;
            font-weight: 700;
            color: #334155; /* Slate-700 */
        }

        .context-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
        }

        .context-item {
            position: relative;
            padding-left: 18px;
            margin-bottom: 16px;
            font-size: 15px;
            color: #475569; /* Slate-600 */
            line-height: 1.6;
        }

        .context-item::before {
            content: "";
            position: absolute;
            left: 0;
            top: 10px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #94a3b8;
        }

        .highlight-text {
            color: #0f172a;
            font-weight: 600;
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* Plus Connector */
        .flow-connector {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            color: #94a3b8;
            font-size: 24px;
        }

        /* Bottom Decision Box */
        .decision-box {
            margin-top: 24px;
            background-color: #1e293b; /* Slate-800 */
            border-radius: 12px;
            padding: 24px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .decision-content {
            flex: 1;
        }

        .decision-label {
            font-size: 13px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
            display: block;
        }

        .decision-main {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            display: flex;
            align-items: center;
        }

        .decision-arrow {
            margin: 0 15px;
            color: #64748b;
            font-size: 16px;
        }
        
        .tag {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-left: 10px;
        }
        
        .tag-blue {
            background-color: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 02. 전략 판단</p>
<h1 class="page-title">문제 해결을 위한 전략적 의사결정 (Strategic Decision)</h1>
</header>
<!-- Content Body -->
<div style="display: flex; flex-direction: column; flex: 1;">
<div class="content-area">
<!-- Box 1: Mobile Strategy -->
<div class="analysis-box mobile">
<div class="box-header">
<div class="box-icon">
<i class="fas fa-mobile-screen-button"></i>
</div>
<h3 class="box-title">고객 접근성 확보 (Mobile)</h3>
</div>
<ul class="context-list">
<li class="context-item">
<p>고객의 물리적 근무 환경 변화(재택→출근)는 일시적 현상이 아닌 <span class="highlight-text">상수(Constant)</span>로 인식</p>
</li>
<li class="context-item">
<p>시간·장소에 구애받지 않고 서비스 현황을 확인할 수 있는 <span class="highlight-text">Always-on 구조</span> 필수</p>
</li>
<li class="context-item">
<p>고객이 이미 보유한 디바이스(스마트폰)에 주목하여 <span class="highlight-text">모바일 기반 서비스 전환</span> 타당성 도출</p>
</li>
</ul>
</div>
<!-- Connector -->
<div class="flow-connector">
<i class="fas fa-plus"></i>
</div>
<!-- Box 2: Alliance Strategy -->
<div class="analysis-box alliance">
<div class="box-header">
<div class="box-icon">
<i class="fas fa-file-contract"></i>
</div>
<h3 class="box-title">사업 지속성 확보 (Alliance)</h3>
</div>
<ul class="context-list">
<li class="context-item">
<p>제도 변화(투자자문업 편입)에 따른 <span class="highlight-text">직접 영업 리스크 회피</span> 필요</p>
</li>
<li class="context-item">
<p>기존 서비스 중단 위기를 타개하기 위해 <span class="highlight-text">제도권 금융사와의 제휴 모델</span> 검토</p>
</li>
<li class="context-item">
<p>단독 사업자로서의 불확실성을 제거하고 금융사의 신뢰도를 레버리지하는 전략 수립</p>
</li>
</ul>
</div>
</div>
<!-- Decision Box -->
<div class="decision-box">
<div class="decision-content">
<span class="decision-label">Strategic Conclusion</span>
<div class="decision-main">
<p>모바일 전환</p>
<div class="tag tag-blue">Product</div>
<i class="fas fa-plus decision-arrow"></i>
<p>금융사 제휴</p>
<div class="tag tag-blue">Biz Model</div>
<i class="fas fa-arrow-right decision-arrow" style="color: white; font-size: 20px;"></i>
<p>단일 전략 패키지 실행</p>
</div>
</div>
<div style="text-align: right;">
<p style="font-size: 14px; color: #cbd5e1; margin-bottom: 4px;">Business Pivot</p>
<p style="font-size: 16px; font-weight: 700;">B2C 직접 영업 <i class="fas fa-arrow-right" style="font-size: 14px; margin: 0 8px;"></i> 공급형 모델</p>
</div>
</div>
</div>
</main>
</div>
</body>
</html>
`,
        6: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>전략 판단 ② 전략 패키지</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        /* Diagram Area */
        .diagram-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .strategy-flow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        /* Step 1: Before */
        .step-before {
            width: 200px;
            padding: 24px;
            background-color: #f1f5f9;
            border: 1px dashed #94a3b8;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            color: #64748b;
        }

        .step-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 0.05em;
        }

        .step-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #475569;
        }

        .step-desc {
            font-size: 13px;
            line-height: 1.4;
        }

        /* Step 2: Package (Main) */
        .step-package {
            flex: 1;
            background-color: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            position: relative;
            display: flex;
            flex-direction: column;
            z-index: 1;
        }
        
        .step-package::before {
            content: "STRATEGIC PACKAGE";
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #1e293b;
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 12px;
            letter-spacing: 0.1em;
        }

        .package-content {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .package-card {
            flex: 1;
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: all 0.3s;
            border: 1px solid #e2e8f0;
            min-width: 0;
            width: 100%;
        }

        .package-card.mobile {
            background-color: #eff6ff;
            border-color: #bfdbfe;
        }

        .package-card.alliance {
            background-color: #eef2ff;
            border-color: #c7d2fe;
        }

        .card-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            margin-bottom: 16px;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .mobile .card-icon { color: #3b82f6; }
        .alliance .card-icon { color: #6366f1; }

        .card-title {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 8px;
            color: #1e293b;
        }

        .card-desc {
            font-size: 13px;
            color: #475569;
            line-height: 1.4;
            word-break: keep-all;
        }

        .plus-sign {
            font-size: 24px;
            color: #94a3b8;
            font-weight: 300;
        }

        /* Step 3: Result */
        .step-result {
            width: 220px;
            padding: 24px;
            background-color: #1e293b;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .result-icon {
            width: 48px;
            height: 48px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            margin-bottom: 16px;
            color: #60a5fa;
        }

        /* Arrows */
        .flow-arrow {
            color: #cbd5e1;
            font-size: 20px;
        }

        /* Bottom Note */
        .strategy-note {
            margin-top: 30px;
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .note-tag {
            background-color: #3b82f6;
            color: white;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            white-space: nowrap;
        }

        .note-text {
            font-size: 14px;
            color: #475569;
            font-weight: 500;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 02. 전략 판단</p>
<h1 class="page-title">위기 돌파를 위한 통합 전략 패키지 (Strategic Package)</h1>
</header>
<!-- Diagram Area -->
<div class="diagram-area">
<div class="strategy-flow">
<!-- 1. Current State -->
<div class="step-before">
<span class="step-label">AS-IS</span>
<div style="font-size: 32px; margin-bottom: 10px; color: #94a3b8;"><i class="fas fa-user-xmark"></i></div>
<p class="step-title">B2C 직접 영업</p>
<p class="step-desc">규제 리스크 및<br/>고객 이탈 가속화</p>
</div>
<!-- Arrow -->
<div class="flow-arrow">
<i class="fas fa-chevron-right"></i>
</div>
<!-- 2. Package (Main) -->
<div class="step-package">
<div class="package-content">
<!-- Card 1: Mobile -->
<div class="package-card mobile">
<div class="card-icon">
<i class="fas fa-mobile-screen-button"></i>
</div>
            <p class="card-title">Mobile</p>
<p class="card-desc">언제 어디서나 접근 가능한<br/>앱 기반 서비스로 전환</p>
</div>
<!-- Plus -->
<div class="plus-sign">
<i class="fas fa-plus"></i>
</div>
<!-- Card 2: Alliance -->
<div class="package-card alliance">
<div class="card-icon">
<i class="fas fa-handshake-simple"></i>
</div>
<p class="card-title">Strategic Alliance</p>
<p class="card-desc">제도권 금융사의 라이선스와<br/>신뢰도를 레버리지</p>
</div>
</div>
</div>
<!-- Arrow -->
<div class="flow-arrow">
<i class="fas fa-arrow-right-long"></i>
</div>
<!-- 3. Result -->
<div class="step-result">
<span class="step-label" style="color: #94a3b8;">TO-BE</span>
<div class="result-icon">
<i class="fas fa-users-gear"></i>
</div>
<p class="step-title" style="color: white; margin-bottom: 4px;">공급형 모델 전환</p>
<p style="font-size: 12px; color: #cbd5e1;">(B2B2C)</p>
<div style="width: 40px; height: 2px; background-color: #475569; margin: 12px 0;"></div>
<p class="step-desc" style="color: #cbd5e1;">사업 리스크 해소<br/>&amp; 안정적 수익 확보</p>
</div>
</div>
<!-- Bottom Note -->
<div class="strategy-note">
<span class="note-tag">Synergy Effect</span>
<p class="note-text">
                        개별 추진 시 한계가 명확한 두 과제를 <span style="color: #1e293b; font-weight: 700; text-decoration: underline;">단일 패키지로 동시 추진</span>하여 상호 보완 효과 극대화
                    </p>
</div>
</div>
</main>
</div>
</body>
</html>
`,
        7: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>실행 방향 - 금융사 제휴 전략</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        /* Content Layout */
        .content-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Section 1: Target Selection (Upper) */
        .selection-section {
            flex: 1;
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }

        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 700;
            color: #334155;
            border-left: 4px solid #3b82f6;
            padding-left: 12px;
        }

        .branch-diagram {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex: 1;
        }

        .branch-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            z-index: 2;
            width: 160px;
            background-color: white;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 12px;
            transition: all 0.3s;
        }

        .branch-node.active {
            border-color: #3b82f6;
            background-color: #eff6ff;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
        }

        .branch-node.final {
            background-color: #1e293b;
            color: white;
            border-color: #1e293b;
        }

        .node-icon {
            font-size: 20px;
            margin-bottom: 8px;
            color: #64748b;
        }

        .active .node-icon { color: #3b82f6; }
        .final .node-icon { color: #60a5fa; }

        .node-title {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .node-desc {
            font-size: 11px;
            color: #64748b;
            line-height: 1.3;
        }

        .final .node-desc { color: #cbd5e1; }

        .branch-connector {
            flex: 1;
            height: 2px;
            background-color: #cbd5e1;
            position: relative;
            margin: 0 10px;
        }

        .branch-connector::after {
            content: "";
            position: absolute;
            right: 0;
            top: -3px;
            width: 0;
            height: 0;
            border-left: 6px solid #cbd5e1;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
        }

        .branch-connector.active {
            background-color: #3b82f6;
        }
        
        .branch-connector.active::after {
            border-left-color: #3b82f6;
        }

        /* Filter Badges */
        .filter-badge {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #64748b;
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 10px;
            white-space: nowrap;
            min-width: 80px;
            text-align: center;
        }

        /* Section 2: Timeline (Lower) */
        .process-section {
            height: 220px;
            display: flex;
            gap: 20px;
        }

        .timeline-card {
            flex: 1;
            background-color: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }

        .timeline-number {
            width: 28px;
            height: 28px;
            background-color: #f1f5f9;
            color: #64748b;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .timeline-card:last-child {
            background-color: #eff6ff;
            border-color: #bfdbfe;
        }

        .timeline-card:last-child .timeline-number {
            background-color: #3b82f6;
            color: white;
        }

        .timeline-title {
            font-size: 15px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .timeline-content {
            font-size: 13px;
            color: #475569;
            line-height: 1.5;
        }

        .timeline-arrow {
            position: absolute;
            right: -14px;
            top: 50%;
            transform: translateY(-50%);
            color: #cbd5e1;
            font-size: 16px;
            z-index: 5;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 03. 실행: 금융사 제휴</p>
<h1 class="page-title">최적 파트너 선정 기준 및 제휴 추진 프로세스</h1>
</header>
<!-- Content Container -->
<div class="content-container">
<!-- Upper: Target Selection Criteria -->
<div class="selection-section">
<div class="section-header">
<span>Target Selection Criteria (대상 선정 기준)</span>
</div>
<div class="branch-diagram">
<!-- Node 1: Pool -->
<div class="branch-node active">
<div class="node-icon"><i class="fas fa-building-columns"></i></div>
<p class="node-title">전체 금융사</p>
<p class="node-desc">은행, 증권, 운용사 등<br/>제도권 금융기관 Pool</p>
</div>
<!-- Connector -->
<div class="branch-connector active">
<span class="filter-badge">Filter 01</span>
</div>
<!-- Node 2: License -->
<div class="branch-node active">
<div class="node-icon"><i class="fas fa-certificate"></i></div>
<p class="node-title">투자일임업 보유</p>
<p class="node-desc">자격 보유 및 자본금 요건 충족</p>
</div>
<!-- Connector -->
<div class="branch-connector active">
<span class="filter-badge">Filter 02</span>
</div>
<!-- Node 3: Needs -->
<div class="branch-node active">
<div class="node-icon"><i class="fas fa-exclamation-triangle"></i></div>
<p class="node-title">성과 부진/고민</p>
<p class="node-desc">금감원 실적보고자료 참고</p>
</div>
<!-- Connector -->
<div class="branch-connector active">
<span class="filter-badge" style="background-color: #3b82f6;">Final Selection</span>
</div>
<!-- Node 4: Final -->
<div class="branch-node final">
<div class="node-icon"><i class="fas fa-bullseye"></i></div>
<p class="node-title">Target A 그룹</p>
<p class="node-desc">필터링을 통한 전략적 접근</p>
</div>
</div>
</div>
<!-- Lower: Process Timeline -->
<div class="process-section">
<!-- Step 1 -->
<div class="timeline-card">
<div class="timeline-number">01</div>
<p class="timeline-title">제안 및 타겟팅</p>
<div class="timeline-content">
<p>• Target 금융사 리스트업</p>
<p>• 맞춤형 제안서 작성</p>
<p>• 제안 메일 발송 및 접촉</p>
</div>
<i class="fas fa-chevron-right timeline-arrow"></i>
</div>
<!-- Step 2 -->
<div class="timeline-card">
<div class="timeline-number">02</div>
<p class="timeline-title">미팅 및 요건 정의</p>
<div class="timeline-content">
<p>• 다수 금융사 미팅 진행</p>
<p>• 실무진/임원진 Needs 파악</p>
<p>• 제휴 모델 및 요건 구체화</p>
</div>
<i class="fas fa-chevron-right timeline-arrow"></i>
</div>
<!-- Step 3 -->
<div class="timeline-card">
<div class="timeline-number">03</div>
<p class="timeline-title">협의 및 우선협상</p>
<div class="timeline-content">
<p>• 가장 적극적인 운용사 선정</p>
<p>• 독점 제휴 조건 협의</p>
<p>• 수익 배분 및 R&amp;R 조율</p>
</div>
<i class="fas fa-chevron-right timeline-arrow"></i>
</div>
<!-- Step 4 -->
<div class="timeline-card">
<div class="timeline-number"><i class="fas fa-check"></i></div>
<p class="timeline-title" style="color: #1e40af;">독점 제휴 체결</p>
<div class="timeline-content" style="color: #1e3a8a;">
<p>• 라이선스 공유 계약 체결</p>
<p>• 공동 마케팅 협약</p>
<p>• <strong>로보어드바이저 독점 제휴</strong></p>
</div>
</div>
</div>
</div>
</main>
</div>
</body>
</html>`,
        8: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>제휴 구조 설계</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff !important;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active > span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        /* 3-Column Matrix Layout */
        .matrix-container {
            flex: 1;
            display: flex;
            gap: 24px;
            align-items: stretch;
        }

        .matrix-column {
            flex: 1;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.2s;
            border: 1px solid #e2e8f0;
        }

        .matrix-column:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* Column Header */
        .col-header {
            padding: 24px;
            background-color: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .col-icon {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            margin-bottom: 16px;
        }

        .icon-type-1 { background-color: #eff6ff; color: #3b82f6; } /* Blue */
        .icon-type-2 { background-color: #f0fdf4; color: #22c55e; } /* Green/Emerald */
        .icon-type-3 { background-color: #f1f5f9; color: #64748b; } /* Slate/Gray */

        .col-title {
            font-size: 18px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .col-subtitle {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }

        /* Column Body */
        .col-body {
            padding: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .info-block {
            background-color: #fff;
            margin-bottom: 8px;
        }

        .block-title {
            font-size: 14px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }

        .block-title i {
            margin-right: 8px;
            font-size: 12px;
            color: #94a3b8;
        }

        .block-desc {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
            padding-left: 20px;
        }

        /* Highlight Box within Column */
        .highlight-box {
            background-color: #f1f5f9;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            color: #475569;
            margin-top: auto;
            border-left: 3px solid #cbd5e1;
        }

        .type-1 .highlight-box { border-left-color: #3b82f6; background-color: #eff6ff; color: #1e40af; }
        .type-2 .highlight-box { border-left-color: #22c55e; background-color: #f0fdf4; color: #166534; }
        .type-3 .highlight-box { border-left-color: #64748b; background-color: #f8fafc; color: #334155; }

        /* Bottom Summary */
        .summary-area {
            margin-top: 24px;
            padding: 16px 24px;
            background-color: #1e293b;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: white;
        }

        .summary-title {
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
        }

        .summary-text {
            font-size: 14px;
            color: #cbd5e1;
            margin-left: 20px;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span style="color: #ffffff !important;">03. Fundraising Execution</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>04. Results &amp; Impact</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 04. 실행: 제휴 구조 설계</p>
<h1 class="page-title">지속 가능한 성장을 위한 Win-Win 제휴 구조</h1>
</header>
<!-- Matrix Container -->
<div class="matrix-container">
<!-- Column 1: Partnership Model -->
<div class="matrix-column type-1">
<div class="col-header">
<div class="col-icon icon-type-1">
<i class="fas fa-handshake-simple"></i>
</div>
<h2 class="col-title">제휴 형태</h2>
<p class="col-subtitle">Partnership Structure</p>
</div>
<div class="col-body">
<div class="info-block">
<p class="block-title"><i class="fas fa-crown"></i>독점적 지위 확보</p>
<p class="block-desc">해당 금융사 로보어드바이저 상품의 독점 개발 및 운영권 확보</p>
</div>
<div class="info-block">
<p class="block-title"><i class="fas fa-user-gear"></i>운영 구조 설계</p>
<p class="block-desc">단순 독점이 아닌, 실질적 서비스 운영이 가능한 프로세스 확립</p>
</div>
<div class="highlight-box">
<p><strong>Effect:</strong> 안정적 사업 영위를 위한 배타적 사업권 확보</p>
</div>
</div>
</div>
<!-- Column 2: Profit Sharing -->
<div class="matrix-column type-2">
<div class="col-header">
<div class="col-icon icon-type-2">
<i class="fas fa-chart-pie"></i>
</div>
<h2 class="col-title">수익 배분</h2>
<p class="col-subtitle">Profit Sharing Model</p>
</div>
<div class="col-body">
<div class="info-block">
<p class="block-title"><i class="fas fa-percent"></i>선취 수수료 차등</p>
<p class="block-desc">고객 유입(Acquisition) 주체에 따라 수수료 배분 비율 조정</p>
</div>
<div class="info-block">
<p class="block-title"><i class="fas fa-arrow-trend-up"></i>성과 보수 공유</p>
<p class="block-desc">기준 수익률 초과 달성 시 발생하는 성과 보수 차등 적용</p>
</div>
<div class="highlight-box">
<p><strong>Effect:</strong> 양사의 적극적 모객 및 운용 성과 달성 유인</p>
</div>
</div>
</div>
<!-- Column 3: Cost Structure -->
<div class="matrix-column type-3">
<div class="col-header">
<div class="col-icon icon-type-3">
<i class="fas fa-file-invoice-dollar"></i>
</div>
<h2 class="col-title">고정비 분담</h2>
<p class="col-subtitle">Cost Allocation</p>
</div>
<div class="col-body">
<div class="info-block">
<p class="block-title"><i class="fas fa-server"></i>인프라 비용 명확화</p>
<p class="block-desc">클라우드 서버, 데이터 사용료 등 고정비 부담 기준 수립</p>
</div>
<div class="info-block">
<p class="block-title"><i class="fas fa-scale-balanced"></i>책임 소재 확립</p>
<p class="block-desc">운영 중 발생하는 비용에 대한 귀책 및 분담 원칙 정의</p>
</div>
<div class="highlight-box">
<p><strong>Effect:</strong> 불필요한 비용 분쟁 예방 및 책임 경영 강화</p>
</div>
</div>
</div>
</div>
<!-- Bottom Summary -->
<div class="summary-area">
<div class="summary-title">
<i class="fas fa-check-circle text-blue-400 mr-2"></i>
<span>Strategic Conclusion</span>
</div>
<p class="summary-text">
                "단순 하청이 아닌, <strong>수익과 비용 리스크를 합리적으로 공유하는 파트너십</strong>을 통해 지속 가능한 사업 모델 구축"
            </p>
</div>
</main>
</div>
</body>
</html>`,
        9: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>역할 분담 및 내부 조율</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        /* Role Comparison Layout */
        .comparison-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            gap: 40px;
            padding: 20px 0;
        }

        /* Background Connecting Line */
        .connector-line {
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 2px;
            background: repeating-linear-gradient(
                to right,
                #cbd5e1 0,
                #cbd5e1 10px,
                transparent 10px,
                transparent 20px
            );
            z-index: 0;
            transform: translateY(-50%);
        }

        /* Side Columns (Company & Partner) */
        .side-col {
            flex: 1;
            background-color: white;
            border-radius: 16px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            height: 420px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            position: relative;
            z-index: 1;
        }

        .side-col.left {
            border-top: 4px solid #3b82f6; /* Blue for My Company */
        }

        .side-col.right {
            border-top: 4px solid #64748b; /* Slate for Partner */
        }

        .col-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 24px;
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #f1f5f9;
        }

        .col-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            margin-bottom: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .left .col-icon { background-color: #eff6ff; color: #3b82f6; }
        .right .col-icon { background-color: #f1f5f9; color: #64748b; }

        .col-title {
            font-size: 18px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .col-subtitle {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
        }

        /* Role List */
        .role-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .role-item {
            display: flex;
            align-items: flex-start;
        }

        .role-item i {
            margin-top: 4px;
            margin-right: 12px;
            font-size: 14px;
        }

        .left .role-item i { color: #3b82f6; }
        .right .role-item i { color: #94a3b8; }

        .role-text {
            font-size: 12px;
            color: #334155;
            line-height: 1.5;
        }

        /* Center Hub Column */
        .hub-col {
            flex: 0 0 320px;
            background-color: #1e293b; /* Dark Navy */
            border-radius: 16px;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 460px; /* Taller than sides */
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            position: relative;
            z-index: 10;
            overflow: hidden;
            transform: translateY(-10px);
        }

        .hub-header {
            background-color: #0f172a;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #334155;
        }

        .hub-title {
            color: white;
            font-size: 18px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .hub-subtitle {
            color: #94a3b8;
            font-size: 12px;
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .hub-body {
            padding: 30px 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
        }

        .hub-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .hub-item {
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 12px 16px;
            border-left: 3px solid #3b82f6;
        }

        .hub-item p {
            color: #e2e8f0;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
        }
        
        .hub-item strong {
            color: #60a5fa;
            display: block;
            font-size: 12px;
            margin-bottom: 4px;
            text-transform: uppercase;
        }

        /* Arrows from Hub */
        .hub-arrows {
            position: absolute;
            top: 50%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            transform: translateY(-50%);
            pointer-events: none;
            z-index: -1;
        }

        .arrow-circle {
            width: 32px;
            height: 32px;
            background-color: white;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #94a3b8;
            font-size: 14px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 5;
        }
        
        .arrow-left { left: -16px; }
        .arrow-right { right: -16px; }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
            <span style="color: #ffffff;">03. Fundraising Execution</span>
        </div>
        <div class="nav-item">
            <div class="nav-icon"><i class="fas fa-chart-line"></i></div>
            <span>04. Results &amp; Impact</span>
        </div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
            <p class="chapter-title">Chapter 03. 실행: 역할 분담 및 조율</p>
<h1 class="page-title">성공적 런칭을 위한 R&amp;R 구조 및 조율 전략</h1>
</header>
<!-- Comparison Wrapper -->
<div class="comparison-wrapper">
<!-- Background Line -->
<div class="connector-line"></div>
<!-- Left Column: Our Company -->
<div class="side-col left">
<div class="col-header">
<div class="col-icon">
<i class="fas fa-laptop-code"></i>
</div>
            <h2 class="col-title">회사</h2>
<p class="col-subtitle">Tech &amp; Product</p>
</div>
<ul class="role-list">
<li class="role-item">
<i class="fas fa-check-circle"></i>
<p class="role-text"><strong>서비스 고도화 기획</strong><br/>모바일 앱 UX/UI 설계 및 개발</p>
</li>
<li class="role-item">
<i class="fas fa-check-circle"></i>
<p class="role-text"><strong>기술 이슈 대응</strong><br/>서버 안정성 확보 및 인프라 관리</p>
</li>
<li class="role-item">
<i class="fas fa-check-circle"></i>
<p class="role-text"><strong>데이터 연동</strong><br/>API 연동 및 실시간 데이터 처리</p>
</li>
</ul>
</div>
<!-- Center Column: My Role (Hub) -->
<div class="hub-col">
<!-- Connectors -->
<div class="arrow-circle arrow-left"><i class="fas fa-exchange-alt"></i></div>
<div class="arrow-circle arrow-right"><i class="fas fa-exchange-alt"></i></div>
<div class="hub-header">
            <h2 class="hub-title"><i class="fas fa-network-wired"></i> HUB 역할 담당</h2>
</div>
<div class="hub-body">
<div class="hub-list">
<div class="hub-item">
                <p><strong>Communication</strong>회사-투자일임사 간 기술/비즈니스 조율</p>
</div>
<div class="hub-item">
                <p><strong>Decision Making</strong>기술적 제약과 기획 의도 사이 최적의 대안 제시</p>
</div>
<div class="hub-item">
<p><strong>Priority Management</strong>서비스 안정성과 런칭 일정 준수를 위한 기능 개발 우선순위 조정</p>
</div>
</div>
</div>
</div>
<!-- Right Column: Partner -->
<div class="side-col right">
<div class="col-header">
<div class="col-icon">
<i class="fas fa-building-columns"></i>
</div>
<h2 class="col-title">투자일임사</h2>
<p class="col-subtitle">Operation &amp; Biz</p>
</div>
<ul class="role-list">
<li class="role-item">
<i class="fas fa-circle"></i>
<p class="role-text"><strong>고객 CS</strong><br/>투자 관련 문의 응대 및 민원 처리</p>
</li>
<li class="role-item">
<i class="fas fa-circle"></i>
<p class="role-text"><strong>성과 모니터링</strong><br/>알고리즘 종목 운용 및 리밸런싱</p>
</li>
<li class="role-item">
<i class="fas fa-circle"></i>
<p class="role-text"><strong>QA 및 기획 제안</strong><br/>금융 관점의 요구사항 및 알고리즘 기획</p>
</li>
</ul>
</div>
</div>
</main>
</div>
</body>
</html>`,
        10: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>성과 및 회고 통합</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background-color: #1e293b; /* Slate-800 */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 40px 30px;
            flex-shrink: 0;
            z-index: 10;
        }
        
        .logo-area {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #94a3b8; /* Slate-400 */
            letter-spacing: -0.02em;
        }

        .nav-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            color: #64748b; /* Slate-500 */
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
        }
        
        .nav-item.active span {
            color: #ffffff !important;
        }
        
        .nav-item.active .nav-icon {
            background-color: #3b82f6; /* Blue-500 */
            border-color: #3b82f6;
            color: white;
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #475569;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            margin-right: 12px;
            flex-shrink: 0;
        }

        /* Main Content Styling */
        .main-content {
            flex: 1;
            background-color: #f8fafc; /* Slate-50 */
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
        }

        .header-area {
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .chapter-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .page-title {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a; /* Slate-900 */
            letter-spacing: -0.03em;
        }

        /* Dashboard Layout */
        .dashboard-grid {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-height: 0;
            overflow: hidden;
        }

        /* Top Row: Metrics */
        .metrics-row {
            display: flex;
            gap: 20px;
            height: 240px;
            flex-shrink: 0;
        }

        /* Main KPI Card */
        .kpi-card {
            flex: 0 0 35%;
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            border: 1px solid #e2e8f0;
            border-left: 6px solid #3b82f6;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .kpi-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 0.05em;
        }

        .kpi-value-group {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 10px;
        }

        .kpi-value {
            font-size: 72px;
            font-weight: 900;
            color: #1e293b;
            line-height: 1;
            letter-spacing: -2px;
        }

        .kpi-unit {
            font-size: 24px;
            font-weight: 700;
            color: #64748b;
        }

        .kpi-badge {
            display: inline-flex;
            align-items: center;
            background-color: #eff6ff;
            color: #3b82f6;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            align-self: flex-start;
        }

        /* Chart Card */
        .chart-card {
            flex: 1;
            background-color: white;
            border-radius: 12px;
            padding: 20px 30px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .chart-title {
            font-size: 16px;
            font-weight: 700;
            color: #334155;
            display: flex;
            align-items: center;
        }

        .chart-container {
            flex: 1;
            position: relative;
            width: 100%;
            min-height: 0;
            max-height: 100%;
            overflow: hidden;
        }
        
        .chart-container canvas {
            max-width: 100%;
            max-height: 100%;
        }

        /* Bottom Row: Retro */
        .retro-row {
            flex: 1;
            display: flex;
            gap: 20px;
            min-height: 0;
            overflow: hidden;
        }

        .retro-col {
            display: flex;
            flex-direction: column;
            gap: 16px;
            min-height: 0;
            overflow: hidden;
        }

        .retro-col.left { flex: 1.2; }
        .retro-col.right { flex: 0.8; }

        /* Retro Box */
        .retro-box {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            flex: 1;
        }

        .retro-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }

        .retro-icon {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            font-size: 14px;
        }

        .icon-challenge { background-color: #fef2f2; color: #ef4444; }
        .icon-action { background-color: #f0f9ff; color: #0ea5e9; }

        .retro-title {
            font-size: 15px;
            font-weight: 700;
            color: #1e293b;
        }

        .retro-list {
            padding: 0;
            margin: 0;
            list-style: none;
        }

        .retro-item {
            font-size: 13px;
            color: #475569;
            line-height: 1.5;
            margin-bottom: 6px;
            display: flex;
            align-items: flex-start;
        }
        
        .retro-item::before {
            content: "•";
            color: #cbd5e1;
            margin-right: 8px;
            font-weight: bold;
        }

        /* Growth Highlight Box */
        .growth-box {
            background-color: #1e293b;
            border-radius: 12px;
            padding: 24px;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            max-height: 100%;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            min-height: 0;
        }

        .growth-box::after {
            content: "";
            position: absolute;
            bottom: -20px;
            right: -20px;
            width: 100px;
            height: 100px;
            background-color: rgba(255,255,255,0.05);
            border-radius: 50%;
        }

        .growth-tag {
            background-color: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 12px;
            align-self: flex-start;
            margin-bottom: 16px;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .growth-main-text {
            font-size: 20px;
            font-weight: 800;
            line-height: 1.4;
            margin-bottom: 16px;
        }

        .growth-sub-text {
            font-size: 13px;
            color: #cbd5e1;
            line-height: 1.5;
        }

        .highlight-blue {
            color: #60a5fa;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="logo-area">
<p>PORTFOLIO</p>
</div>
<nav class="nav-list">
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-search"></i></div>
<span>01. Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Choice</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
            <span>03. Fundraising Execution</span>
        </div>
        <div class="nav-item active">
            <div class="nav-icon"><i class="fas fa-chart-line"></i></div>
            <span>04. Results &amp; Impact</span>
        </div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
            <p class="chapter-title">Chapter 04. 성과 및 회고</p>
<h1 class="page-title">성공적 런칭과 직무 확장의 계기</h1>
</header>
<!-- Dashboard Grid -->
<div class="dashboard-grid">
<!-- Top Row: Metrics -->
<div class="metrics-row">
<!-- KPI Card -->
<div class="kpi-card">
<p class="kpi-label">Cumulative AUM</p>
<div class="kpi-value-group">
<span class="kpi-value">80</span>
<span class="kpi-unit">억 원</span>
</div>
<div class="kpi-badge">
<i class="fas fa-rocket mr-2"></i>출시 3개월 만에 달성
                    </div>
</div>
<!-- Chart Card -->
<div class="chart-card">
<div class="chart-header">
<h3 class="chart-title"><i class="fas fa-chart-area mr-2 text-blue-500"></i>누적 계약고 성장 추이</h3>
<span style="font-size: 12px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">(단위: 억 원)</span>
</div>
<div class="chart-container">
<canvas id="growthChart"></canvas>
</div>
</div>
</div>
<!-- Bottom Row: Retro -->
<div class="retro-row">
<!-- Left Column: Context & Action -->
<div class="retro-col left">
<!-- Challenge Box -->
<div class="retro-box">
<div class="retro-header">
<div class="retro-icon icon-challenge"><i class="fas fa-flag"></i></div>
<h3 class="retro-title">Challenge &amp; Context</h3>
</div>
<ul class="retro-list">
<li class="retro-item">
                                    시장 위기 상황에서 CEO와 전략 전환 논의 후 즉각 실행 결정 (Top-down Alignment)
                                </li>
<li class="retro-item">
                                    비개발 인력 충원이 불가능한 상황에서 내부 리소스 최적화 필요
                                </li>
</ul>
</div>
<!-- Action Box -->
<div class="retro-box">
<div class="retro-header">
<div class="retro-icon icon-action"><i class="fas fa-bolt"></i></div>
<h3 class="retro-title">My Action</h3>
</div>
<ul class="retro-list">
<li class="retro-item">
                                    기존 신사업 경험을 바탕으로 서비스 기획(PM/PO) 역할 수행
                                </li>
<li class="retro-item">
                                    전략 기획과 서비스 기획을 일원화하고 회사와 투자일임사 사이에서 조율과 의사결정 신속화
                                </li>
</ul>
</div>
</div>
<!-- Right Column: Growth (Highlight) -->
<div class="retro-col right">
<div class="growth-box">
<span class="growth-tag">Key Takeaway</span>
<p class="growth-main-text">
                            전략기획자에서<br/>
<span class="highlight-blue">서비스 기획자</span>로<br/>
                            역할 확장
                        </p>
<p class="growth-sub-text">
                            "단순 전략 수립을 넘어, 실질적인 Product를 만들어내며 업무 영역을 확장한 성장의 계기"
                        </p>
</div>
</div>
</div>
</div>
</main>
</div>
<script>
        const ctx = document.getElementById('growthChart').getContext('2d');
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['M-1 (Pre)', 'M+1', 'M+2', 'M+3'],
                datasets: [{
                    label: '누적 계약고',
                    data: [0, 25, 48, 80],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5,
                        left: 5,
                        right: 5
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 10,
                        titleFont: { size: 12 },
                        bodyFont: { size: 13, weight: 'bold' },
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' 억 원';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            maxTicksLimit: 5
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#64748b',
                            font: { size: 11, weight: 'bold' }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>`
    };

    const iframeScaleInfo = [];

    // DOM 조회 캐싱 헬퍼 함수
    const getIframeInfo = (container) => {
        return iframeScaleInfo.find(info => info.container === container);
    };

    // iframe 스케일 재계산 함수 (최적화)
    function recalculateIframeScale(iframeInfo) {
        const { container, iframe, slideWidth, slideHeight } = iframeInfo;
        
        if (!container || !iframe) return false;
        
        let iframeDoc;
        try {
            iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (e) {
            return false; // CORS 또는 아직 로드되지 않음
        }
        
        if (!iframeDoc) return false;
        
        const slideContainer = iframeDoc.querySelector('.slide-container') || iframeDoc.querySelector('.slide-container-1');
        if (!slideContainer) return false;
        
        // 컨테이너 크기 확인 (여러 방법으로 확인하여 정확도 향상)
        let containerWidth = container.offsetWidth;
        let containerHeight = container.offsetHeight;
        
        // offsetWidth가 0이면 getBoundingClientRect 사용
        if (containerWidth === 0 || containerHeight === 0) {
            const rect = container.getBoundingClientRect();
            containerWidth = rect.width || containerWidth;
            containerHeight = rect.height || containerHeight;
        }
        
        // 여전히 0이면 clientWidth/Height 사용
        if (containerWidth === 0 || containerHeight === 0) {
            containerWidth = container.clientWidth || containerWidth;
            containerHeight = container.clientHeight || containerHeight;
        }
        
        // 작은 박스의 경우 CSS aspect-ratio로 인해 높이가 계산되지 않을 수 있음
        // 이 경우 부모 컨테이너의 크기를 참조하거나 aspect-ratio로 계산
        if (containerWidth > 0 && containerHeight === 0) {
            // aspect-ratio가 16/9인 경우 높이 계산
            const computedStyle = window.getComputedStyle(container);
            const aspectRatio = computedStyle.aspectRatio;
            if (aspectRatio && aspectRatio !== 'auto') {
                const [width, height] = aspectRatio.split('/').map(Number);
                containerHeight = containerWidth * (height / width);
            } else {
                // 기본값으로 16/9 사용
                containerHeight = containerWidth * (9 / 16);
            }
        }
        
        // 최종 확인: 컨테이너가 보이는지 확인
        const isVisible = containerWidth > 0 && containerHeight > 0;
        
        if (!isVisible) {
            console.warn('컨테이너 크기가 0입니다:', { 
                containerWidth, 
                containerHeight, 
                container: container.className,
                offsetWidth: container.offsetWidth,
                offsetHeight: container.offsetHeight,
                clientWidth: container.clientWidth,
                clientHeight: container.clientHeight
            });
            return false;
        }
        
        // 작은 박스인지 확인 (test-slide-item 클래스가 있는 경우)
        const isSmallBox = container.classList.contains('test-slide-item');
        
        // slideNumber 확인
        const slideNumber = container.getAttribute('data-slide-number');
        
        // 박스 타입 확인 (data-parent-box 또는 data-box 속성으로 서비스 박스인지 확인)
        const parentBox = container.getAttribute('data-parent-box') || container.getAttribute('data-box');
        const isServiceBoxType = parentBox === '2'; // 서비스 박스만
        const isStrategy2BoxType = parentBox === '5'; // 전략2 박스
        const isStrategy1BoxType = parentBox === '1'; // 전략1 박스
        const isService2BoxType = parentBox === '3'; // 서비스2 박스
        const isNext1BoxType = parentBox === '4'; // 넥스트1 박스
        
        // 작은 박스에 표시되는 1-1 슬라이드들 (전략1-1, 전략2-1, 서비스1-1, 서비스2-1, 넥스트1-1)
        const isStrategy1_1_SmallBox = isStrategy1BoxType && slideNumber === '1' && isSmallBox;
        const isStrategy2_1_SmallBox = isStrategy2BoxType && slideNumber === '1' && isSmallBox;
        const isService1_1_SmallBox = isServiceBoxType && slideNumber === '1' && isSmallBox;
        const isService2_1_SmallBox = isService2BoxType && slideNumber === '1' && isSmallBox;
        const isNext1_1_SmallBox = isNext1BoxType && slideNumber === '1' && isSmallBox;
        
        // 작은 박스에 표시되는 1-1 슬라이드들은 작은 박스의 크기에 맞게 조절
        const is1_1_SmallBox = isStrategy1_1_SmallBox || isStrategy2_1_SmallBox || isService1_1_SmallBox || isService2_1_SmallBox || isNext1_1_SmallBox;
        
        // 큰 박스에 표시되는 1-1 슬라이드들 (전략1-1, 전략2-1, 서비스1-1, 서비스2-1, 넥스트1-1)
        const isStrategy1_1_MainBox = isStrategy1BoxType && slideNumber === '1' && !isSmallBox;
        const isStrategy2_1_MainBox = isStrategy2BoxType && slideNumber === '1' && !isSmallBox;
        const isService1_1_MainBox = isServiceBoxType && slideNumber === '1' && !isSmallBox;
        const isService2_1_MainBox = isService2BoxType && slideNumber === '1' && !isSmallBox;
        const isNext1_1_MainBox = isNext1BoxType && slideNumber === '1' && !isSmallBox;
        
        // 큰 박스에 표시되는 1-1 슬라이드들은 큰 박스 크기에 맞게 조절 (100%)
        const is1_1_MainBox = isStrategy1_1_MainBox || isStrategy2_1_MainBox || isService1_1_MainBox || isService2_1_MainBox || isNext1_1_MainBox;
        
        // 서비스1-2부터 서비스1-8까지 큰 박스와 작은 박스 모두에서 95% 비율로 표시
        const isServiceBox = isServiceBoxType && slideNumber && ['2', '3', '4', '5', '6', '7', '8'].includes(slideNumber);
        
        // 넥스트1-2부터 넥스트1-6까지 큰 박스와 작은 박스 모두에서 95% 비율로 표시 (넥스트1-1 제외)
        const isNext1Box = isNext1BoxType && slideNumber && ['2', '3', '4', '5', '6'].includes(slideNumber);
        
        // 전략2-10은 큰 박스에서 작은 박스와 동일한 padding 비율 적용
        const isStrategy2_10 = isStrategy2BoxType && slideNumber === '10' && !isSmallBox;
        
        // 컨테이너 크기에 맞게 스케일 계산
        let scale;
        if (is1_1_SmallBox) {
            // 작은 박스에 표시되는 1-1 슬라이드들 (전략1-1, 전략2-1, 서비스1-1, 서비스2-1, 넥스트1-1): 작은 박스 크기에 맞게 조절
            scale = Math.min(containerWidth / slideWidth, containerHeight / slideHeight);
        } else if (is1_1_MainBox) {
            // 큰 박스에 표시되는 1-1 슬라이드들 (전략1-1, 전략2-1, 서비스1-1, 서비스2-1, 넥스트1-1): 큰 박스 크기에 맞게 100% 조절
            scale = Math.min(containerWidth / slideWidth, containerHeight / slideHeight);
        } else if (isServiceBox) {
            // 서비스1-2부터 서비스1-8까지 큰 박스와 작은 박스 모두 95% 정도를 차지하도록 설정
            const contentPercent = 0.95; // 95%
            const targetWidth = containerWidth * contentPercent;
            const targetHeight = containerHeight * contentPercent;
            scale = Math.min(targetWidth / slideWidth, targetHeight / slideHeight);
        } else if (isNext1Box) {
            // 넥스트1-2부터 넥스트1-6까지 큰 박스와 작은 박스 모두 95% 정도를 차지하도록 설정 (넥스트1-1 제외)
            const contentPercent = 0.95; // 95%
            const targetWidth = containerWidth * contentPercent;
            const targetHeight = containerHeight * contentPercent;
            scale = Math.min(targetWidth / slideWidth, targetHeight / slideHeight);
        } else if (isStrategy2_10) {
            // 전략2-10 큰 박스: 작은 박스의 padding(8px)과 동일한 비율 적용
            // 작은 박스의 실제 크기를 동적으로 가져와서 padding 비율 계산
            const smallBoxPadding = 8; // 작은 박스의 padding (CSS에서 정의된 값)
            let smallBoxWidth = 200; // 기본값 (대략적인 작은 박스 너비)
            
            // 작은 박스의 실제 크기를 찾아서 계산
            const slideList = document.querySelector('.test-slide-list');
            if (slideList) {
                const smallBox = slideList.querySelector(`.test-slide-item[data-slide-number="10"][data-parent-box="5"]`);
                if (smallBox) {
                    const smallBoxRect = smallBox.getBoundingClientRect();
                    smallBoxWidth = smallBoxRect.width;
                }
            }
            
            // 작은 박스의 padding 비율 계산 (양쪽 padding = 16px)
            const paddingRatio = (smallBoxPadding * 2) / smallBoxWidth;
            
            // 큰 박스에서도 동일한 비율의 padding 적용
            const effectivePaddingWidth = containerWidth * paddingRatio;
            const effectivePaddingHeight = containerHeight * paddingRatio;
            
            // 실제 컨텐츠 영역 계산
            const targetWidth = containerWidth - effectivePaddingWidth;
            const targetHeight = containerHeight - effectivePaddingHeight;
            
            scale = Math.min(targetWidth / slideWidth, targetHeight / slideHeight);
        } else {
            // 일반 스케일링 (전략1-1, 전략1-6, 전략1-7, 전략2 등 모두 동일하게 처리)
            // 컨테이너 크기에 맞게 전체 컨텐츠를 조절
            scale = Math.min(containerWidth / slideWidth, containerHeight / slideHeight);
        }
        const scaledWidth = slideWidth * scale;
        const scaledHeight = slideHeight * scale;
        
        // 중앙 정렬을 위한 위치 계산
        // top: 50%, left: 50%를 사용하여 컨테이너 중앙에 위치시키고
        // transform: translate(-50%, -50%) scale()로 중앙 정렬 및 스케일링
        // 이렇게 하면 scale이 적용된 후에도 중앙에 위치함
        
        // 스타일 일괄 적용 (리플로우 최소화)
        // top: 50%, left: 50%로 컨테이너 중앙에 위치시키고
        // transform: translate(-50%, -50%) scale()로 중앙 정렬 및 스케일링
        slideContainer.style.cssText = `width: ${slideWidth}px; height: ${slideHeight}px; transform: translate(-50%, -50%) scale(${scale}); transform-origin: center center; margin: 0; padding: 0; position: absolute; top: 50%; left: 50%;`;
        
        // 서비스1-2부터 서비스1-8까지 큰 박스와 작은 박스 모두에서 흰색 배경 적용
        const isServiceBoxForBg = isServiceBoxType && slideNumber && ['2', '3', '4', '5', '6', '7', '8'].includes(slideNumber);
        
        // body와 html 스타일 조정 - 컨테이너 전체 크기로 설정하고 여백 제거
        const iframeBody = iframeDoc.body;
        if (iframeBody) {
            const bgColor = isServiceBoxForBg ? 'background-color: #ffffff;' : '';
            iframeBody.style.cssText = `margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; position: relative; ${bgColor}`;
        }
        
        const htmlEl = iframeDoc.documentElement;
        if (htmlEl) {
            const bgColor = isServiceBoxForBg ? 'background-color: #ffffff;' : '';
            htmlEl.style.cssText = `margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; ${bgColor}`;
        }
        
        // 서비스 슬라이드의 padding과 box-shadow 제거 (큰 박스와 작은 박스 모두)
        // 서비스1-2부터 서비스1-7까지 큰 박스에서 box-shadow 제거
        const isServiceBoxForShadow = isServiceBoxType && slideNumber && ['2', '3', '4', '5', '6', '7'].includes(slideNumber);
        
        if (isServiceBoxForShadow) {
            if (!isSmallBox) {
                // 큰 박스인 경우 padding과 box-shadow 제거
                const styleRemoveStyle = iframeDoc.createElement('style');
                styleRemoveStyle.textContent = `
                    .slide-container {
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                `;
                if (!iframeDoc.querySelector('style[data-padding-shadow-remove]')) {
                    styleRemoveStyle.setAttribute('data-padding-shadow-remove', 'true');
                    iframeDoc.head.appendChild(styleRemoveStyle);
                }
            } else {
                // 작은 박스인 경우 box-shadow만 제거
                const styleRemoveStyle = iframeDoc.createElement('style');
                styleRemoveStyle.textContent = `
                    .slide-container {
                        box-shadow: none !important;
                    }
                `;
                if (!iframeDoc.querySelector('style[data-shadow-remove-small]')) {
                    styleRemoveStyle.setAttribute('data-shadow-remove-small', 'true');
                    iframeDoc.head.appendChild(styleRemoveStyle);
                }
            }
            
            // slideContainer 스타일에 직접 box-shadow 제거 추가
            slideContainer.style.boxShadow = 'none';
        }
        
        // slide-container의 부모 요소들도 여백 제거
        const iframeHead = iframeDoc.head;
        if (iframeHead) {
            // head에 스타일 추가하여 기본 여백 제거
            const styleTag = iframeDoc.createElement('style');
            styleTag.textContent = `
                * {
                    box-sizing: border-box;
                }
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    overflow: hidden !important;
                }
            `;
            iframeHead.appendChild(styleTag);
        }
        
        return true;
    }

    // 모든 iframe 스케일 재계산
    function recalculateAllIframeScales() {
        iframeScaleInfo.forEach(info => {
            recalculateIframeScale(info);
        });
    }

    // window resize 이벤트 리스너 (디바운스 적용)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // 모든 iframe 스케일 재계산
            recalculateAllIframeScales();
            // 버튼 위치 업데이트 (반응형에 따라 큰 박스의 높이가 변경될 수 있으므로)
            updateButtonPosition();
            
            // 썸네일 박스가 있는 경우 추가로 재계산 (브라우저 최소화/최대화 대응)
            const service1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="2"]');
            const strategy1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="1"]');
            
            if (service1ThumbnailBox) {
                const index = iframeScaleInfo.findIndex(info => info.container === service1ThumbnailBox);
                if (index !== -1) {
                    requestAnimationFrame(() => {
                        recalculateIframeScale(iframeScaleInfo[index]);
                    });
                }
            }
            
            if (strategy1ThumbnailBox) {
                const index = iframeScaleInfo.findIndex(info => info.container === strategy1ThumbnailBox);
                if (index !== -1) {
                    requestAnimationFrame(() => {
                        recalculateIframeScale(iframeScaleInfo[index]);
                    });
                }
            }
        }, 100);
    });
    
    // 페이지 로드 완료 후 모든 iframe 스케일 재계산
    if (document.readyState === 'complete') {
        setTimeout(() => {
            recalculateAllIframeScales();
        }, 200);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                recalculateAllIframeScales();
            }, 200);
        });
    }
    
    // DOMContentLoaded 후에도 재계산 (레이아웃이 준비된 후)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                recalculateAllIframeScales();
            }, 100);
        });
    }

    // HTML 콘텐츠를 iframe으로 렌더링하는 범용 함수
    function loadContentToIframe(container, html, isMainBox = false) {
        try {
            if (!html) {
                throw new Error('HTML 콘텐츠가 없습니다.');
            }
            
            // HTML이 문자열인지 확인
            if (typeof html !== 'string') {
                console.error('HTML이 문자열이 아닙니다:', typeof html);
                throw new Error('HTML 콘텐츠가 문자열 형식이 아닙니다.');
            }
            
            // 넥스트1 박스인지 확인 (초기화 전에 확인)
            const isNext1Box = container.getAttribute('data-box') === '4' || container.getAttribute('data-parent-box') === '4';
            
            // 컨테이너 초기화
            container.innerHTML = '';
            
            // 넥스트1 박스인 경우 컨테이너 배경색 설정 (큰 박스와 작은 박스 모두)
            if (isNext1Box) {
                container.style.setProperty('background', '#ffffff', 'important');
                container.style.setProperty('background-color', '#ffffff', 'important');
                if (isMainBox) {
                    container.style.setProperty('border', 'none', 'important');
                    container.style.setProperty('box-shadow', 'none', 'important');
                }
            }
            
            // HTML 문자열에서 width와 height 추출 (최적화)
            let slideWidth = 1280;
            let slideHeight = 720;
            
            // 정규식으로 직접 매칭 (더 빠름)
            const widthMatch = html.match(/width:\s*(\d+)px/i);
            const heightMatch = html.match(/height:\s*(\d+)px/i);
            if (widthMatch) slideWidth = parseInt(widthMatch[1]);
            if (heightMatch) slideHeight = parseInt(heightMatch[1]);
            
            // iframe 생성 및 스타일 설정
            const iframe = document.createElement('iframe');
            iframe.frameBorder = '0';
            iframe.className = isMainBox ? 'service-main-iframe' : 'service-slide-iframe';
            // iframe을 absolute로 설정하여 컨테이너 전체를 채우도록 함
            // 넥스트1 박스는 z-index를 높여서 배경 위에 표시되도록 함
            if (isNext1Box) {
                if (isMainBox) {
                    iframe.style.cssText = 'width: 100%; height: 100%; border: none; overflow: hidden; position: absolute; top: 0; left: 0; display: block; z-index: 20; background-color: #ffffff;';
                    iframe.style.borderRadius = '0';
                } else {
                    // 작은 박스도 흰색 배경 적용
                    iframe.style.cssText = 'width: 100%; height: 100%; border: none; overflow: hidden; position: absolute; top: 0; left: 0; display: block; z-index: 10; background-color: #ffffff;';
                    iframe.style.borderRadius = '12px';
                }
            } else {
                iframe.style.cssText = 'width: 100%; height: 100%; border: none; overflow: hidden; position: absolute; top: 0; left: 0; display: block; z-index: 10;';
                if (isMainBox) {
                    iframe.style.borderRadius = '16px';
                } else {
                    iframe.style.borderRadius = '12px';
                }
            }
            
            // 컨테이너에 iframe 먼저 삽입 (브라우저가 렌더링 시작)
            container.appendChild(iframe);
            
            // 슬라이드 아이템인 경우 has-iframe 클래스 추가
            if (container.classList.contains('test-slide-item')) {
                container.classList.add('has-iframe');
            }
            
            // iframe 정보 저장 (로드 전에 미리 추가하여 resize 이벤트 즉시 작동)
            const iframeInfo = {
                container: container,
                iframe: iframe,
                slideWidth: slideWidth,
                slideHeight: slideHeight,
                isMainBox: isMainBox
            };
            
            // iframe 정보를 배열에 미리 추가
            iframeScaleInfo.push(iframeInfo);
            
            // HTML에 base 태그 추가하여 상대 경로가 올바르게 해석되도록 함
            let processedHtml = html;
            const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            
            // 넥스트1 박스인 경우 body 배경색을 흰색으로 강제 변경 (큰 박스와 작은 박스 모두)
            if (isNext1Box) {
                // body 배경색을 #ffffff로 변경
                processedHtml = processedHtml.replace(
                    /background-color:\s*#f8fafc/g,
                    'background-color: #ffffff'
                );
                processedHtml = processedHtml.replace(
                    /background-color:\s*#f8fafc\s*;/g,
                    'background-color: #ffffff;'
                );
                processedHtml = processedHtml.replace(
                    /background:\s*#f8fafc/g,
                    'background: #ffffff'
                );
                
                // body와 html 태그에 직접 스타일 추가
                if (processedHtml.includes('<body')) {
                    processedHtml = processedHtml.replace(
                        /<body([^>]*)>/i,
                        '<body$1 style="background-color: #ffffff !important; background: #ffffff !important;">'
                    );
                } else {
                    // body 태그가 없으면 추가
                    processedHtml = processedHtml.replace(
                        /<\/head>/i,
                        '</head><body style="background-color: #ffffff !important; background: #ffffff !important;">'
                    );
                }
                
                // html 태그에도 배경색 추가
                if (processedHtml.includes('<html')) {
                    processedHtml = processedHtml.replace(
                        /<html([^>]*)>/i,
                        '<html$1 style="background-color: #ffffff !important; background: #ffffff !important;">'
                    );
                }
                
                // 스타일 태그에 body 배경색 강제 설정 추가
                const backgroundStyle = '<style>body, html { background-color: #ffffff !important; background: #ffffff !important; }</style>';
                if (processedHtml.includes('</head>')) {
                    processedHtml = processedHtml.replace(
                        /<\/head>/i,
                        backgroundStyle + '</head>'
                    );
                } else if (processedHtml.includes('<head>')) {
                    processedHtml = processedHtml.replace(
                        /<head>/i,
                        '<head>' + backgroundStyle
                    );
                }
            }
            
            // Chart.js와 chartjs-plugin-datalabels를 동적으로 로드하여 소스맵 요청 차단
            // Chart.js가 완전히 로드된 후에 플러그인을 로드하도록 순차 로드
            // Chart 사용 코드를 감싸는 헬퍼 함수 추가
            // 성능 최적화: 전역 캐싱 및 Promise 기반 로딩
            processedHtml = processedHtml.replace(
                /<script\s+src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js["'][^>]*><\/script>/gi,
                `<script>
                    // Chart.js를 전역적으로 한 번만 로드하고 재사용 (성능 최적화)
                    (function() {
                        // 이미 로드 중이거나 로드된 경우 재사용
                        if (window.Chart) {
                            window.chartJsLoaded = true;
                            return;
                        }
                        
                        if (window.chartJsLoadingPromise) {
                            // 이미 로딩 중이면 기다림
                            return;
                        }
                        
                        // 소스맵 요청 차단
                        const originalFetch = window.fetch;
                        if (originalFetch) {
                            window.fetch = function(...args) {
                                const url = args[0];
                                if (typeof url === 'string' && url.includes('.map')) {
                                    return Promise.reject(new Error('Source map disabled'));
                                }
                                return originalFetch.apply(this, args);
                            };
                        }
                        const originalOpen = XMLHttpRequest.prototype.open;
                        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                            if (typeof url === 'string' && url.includes('.map')) {
                                return;
                            }
                            return originalOpen.apply(this, [method, url, ...rest]);
                        };
                        
                        // Chart.js를 Promise로 비동기 로드 (성능 개선)
                        window.chartJsLoadingPromise = new Promise((resolve, reject) => {
                            const chartScript = document.createElement('script');
                            chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
                            chartScript.async = true; // 비동기 로드로 변경하여 블로킹 방지
                            chartScript.onerror = function() {
                                console.warn('Chart.js 로드 실패');
                                reject(new Error('Chart.js 로드 실패'));
                            };
                            chartScript.onload = function() {
                                if (window.Chart) {
                                    // 플러그인 로드
                                    const pluginScript = document.createElement('script');
                                    pluginScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0';
                                    pluginScript.async = true; // 비동기 로드
                                    pluginScript.onerror = function() {
                                        console.warn('chartjs-plugin-datalabels 로드 실패');
                                        // 플러그인 없이도 진행
                                        window.chartJsLoaded = true;
                                        resolve();
                                    };
                                    pluginScript.onload = function() {
                                        window.chartJsLoaded = true;
                                        resolve();
                                    };
                                    document.head.appendChild(pluginScript);
                                } else {
                                    reject(new Error('Chart.js 로드 실패'));
                                }
                            };
                            document.head.appendChild(chartScript);
                        });
                    })();
                </script>`
            );
            
            // chartjs-plugin-datalabels 스크립트 태그 제거 (위에서 동적으로 로드하므로)
            processedHtml = processedHtml.replace(
                /<script\s+src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/chartjs-plugin-datalabels[^"']*["'][^>]*><\/script>/gi,
                ''
            );
            
            // Chart 사용 코드를 감싸서 Chart.js 로드 완료를 기다리도록 수정
            // Chart 사용 코드가 포함된 스크립트 태그를 찾아서 감싸기
            // 성능 최적화: Promise 기반 로딩 및 requestAnimationFrame 사용
            // 정규식 수정: 스크립트 태그 전체를 매칭하여 여러 Chart와 Chart.defaults도 처리
            processedHtml = processedHtml.replace(
                /<script>([\s\S]*?)<\/script>/gi,
                function(match, chartCode) {
                    // Chart 관련 코드가 없는 경우 스킵
                    if (!chartCode.includes('Chart') && !chartCode.includes('new Chart')) {
                        return match;
                    }
                    // Chart 관련 코드가 있지만 이미 감싸진 코드는 그대로 유지
                    if (chartCode.includes('waitForChart') || chartCode.includes('window.Chart && window.ChartDataLabels') || chartCode.includes('chartJsLoadingPromise') || chartCode.includes('initCharts') || chartCode.includes('function initCharts')) {
                        return match;
                    }
                    // Chart 관련 코드가 있는 경우에만 처리
                    if (!chartCode.includes('Chart.defaults') && !chartCode.includes('new Chart')) {
                        return match;
                    }
                    // Promise 기반으로 Chart.js 로드 대기 (폴링 제거로 성능 개선)
                    // DOM 요소 존재 확인 및 iframe 로드 완료 대기 추가
                    return `<script>
                        (function() {
                            function initCharts() {
                                // Chart 초기화 코드에서 사용하는 DOM 요소 ID 추출
                                const chartCodeStr = \`${chartCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
                                const elementIdMatches = chartCodeStr.match(/getElementById\\(['"]([^'"]+)['"]\\)/g);
                                const elementIds = elementIdMatches ? elementIdMatches.map(function(match) {
                                    const idMatch = match.match(/['"]([^'"]+)['"]/);
                                    return idMatch ? idMatch[1] : null;
                                }).filter(function(id) { return id !== null; }) : [];
                                
                                function checkElementsExist() {
                                    // 모든 필요한 DOM 요소가 존재하는지 확인
                                    for (let i = 0; i < elementIds.length; i++) {
                                        const element = document.getElementById(elementIds[i]);
                                        if (!element) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                                
                                // Chart 코드를 함수로 감싸서 실행 (이스케이프 문제 방지)
                                const executeChartCode = function() {
                                    try {
                                        ${chartCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}
                                    } catch (e) {
                                        console.error('Chart 초기화 오류:', e);
                                        throw e;
                                    }
                                };
                                
                                function tryInitChart() {
                                    // DOM 요소 확인
                                    if (elementIds.length > 0 && !checkElementsExist()) {
                                        return false;
                                    }
                                    
                                    if (window.Chart) {
                                        // Chart.js가 이미 로드됨
                                        try {
                                            executeChartCode();
                                            return true;
                                        } catch (e) {
                                            console.error('Chart 초기화 오류:', e);
                                            return false;
                                        }
                                    }
                                    return false;
                                }
                                
                                // 즉시 시도
                                if (tryInitChart()) {
                                    return;
                                }
                                
                                // Chart.js 로딩 및 DOM 준비 대기
                                function waitAndInit() {
                                    function checkAndInit() {
                                        // DOM 요소 확인
                                        const domReady = elementIds.length === 0 || checkElementsExist();
                                        
                                        // Chart.js 확인
                                        const chartReady = !!window.Chart;
                                        
                                        // 둘 다 준비되면 초기화
                                        if (chartReady && domReady) {
                                            try {
                                                executeChartCode();
                                            } catch (e) {
                                                console.error('Chart 초기화 오류:', e);
                                            }
                                            return true;
                                        }
                                        return false;
                                    }
                                    
                                    // Chart.js 로딩 Promise 대기
                                    if (window.chartJsLoadingPromise) {
                                        window.chartJsLoadingPromise.then(function() {
                                            // DOM도 준비될 때까지 대기
                                            let attempts = 0;
                                            const maxAttempts = 100;
                                            const checkDom = function() {
                                                attempts++;
                                                if (checkAndInit()) {
                                                    return;
                                                }
                                                if (attempts < maxAttempts) {
                                                    setTimeout(checkDom, 50);
                                                } else {
                                                    console.warn('Chart 초기화 타임아웃 (DOM 요소 대기)');
                                                }
                                            };
                                            checkDom();
                                        }).catch(function(err) {
                                            console.error('Chart.js 로드 실패:', err);
                                        });
                                    } else if (window.Chart) {
                                        // DOM 준비 대기
                                        let attempts = 0;
                                        const maxAttempts = 100;
                                        const checkDom = function() {
                                            attempts++;
                                            if (checkAndInit()) {
                                                return;
                                            }
                                            if (attempts < maxAttempts) {
                                                setTimeout(checkDom, 50);
                                            } else {
                                                console.warn('Chart 초기화 타임아웃 (DOM 요소 대기)');
                                            }
                                        };
                                        checkDom();
                                    } else {
                                        // Chart.js가 아직 로드되지 않음 - 폴링으로 대기
                                        let attempts = 0;
                                        const maxAttempts = 100;
                                        const checkBoth = function() {
                                            attempts++;
                                            if (checkAndInit()) {
                                                return;
                                            }
                                            if (attempts < maxAttempts) {
                                                setTimeout(checkBoth, 50);
                                            } else {
                                                console.warn('Chart 초기화 타임아웃');
                                            }
                                        };
                                        checkBoth();
                                    }
                                }
                                
                                // DOM이 준비되면 실행
                                if (document.readyState === 'loading') {
                                    document.addEventListener('DOMContentLoaded', waitAndInit);
                                } else {
                                    // 이미 로드되었어도 약간의 지연을 두어 DOM이 완전히 렌더링되도록 함
                                    setTimeout(waitAndInit, 100);
                                }
                            }
                            initCharts();
                        })();
                    </script>`;
                }
            );
            
            // 소스맵 요청 차단 스크립트 (추가 보호)
            const sourceMapBlocker = `<script>
                (function() {
                    // 소스맵 요청 차단
                    const originalFetch = window.fetch;
                    if (originalFetch) {
                        window.fetch = function(...args) {
                            const url = args[0];
                            if (typeof url === 'string' && url.includes('.map')) {
                                return Promise.reject(new Error('Source map disabled'));
                            }
                            return originalFetch.apply(this, args);
                        };
                    }
                    // XMLHttpRequest도 차단
                    const originalOpen = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                        if (typeof url === 'string' && url.includes('.map')) {
                            return;
                        }
                        return originalOpen.apply(this, [method, url, ...rest]);
                    };
                })();
            </script>`;
            
            // 우클릭 방지 스크립트 (배포 환경에서만 동작)
            const rightClickBlocker = `<script>
                (function() {
                    'use strict';
                    // 부모 창의 정보를 사용하여 로컬 환경 감지
                    let isLocal = false;
                    try {
                        if (window.parent && window.parent !== window) {
                            const parentHost = window.parent.location.hostname;
                            const parentProtocol = window.parent.location.protocol;
                            isLocal = parentHost === 'localhost' || 
                                     parentHost === '127.0.0.1' ||
                                     parentProtocol === 'file:';
                        } else {
                            // iframe 내부에서 직접 확인
                            isLocal = window.location.hostname === 'localhost' || 
                                     window.location.hostname === '127.0.0.1' ||
                                     window.location.protocol === 'file:';
                        }
                    } catch (e) {
                        // cross-origin이면 배포 환경으로 간주
                        isLocal = false;
                    }
                    
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
                        if (e.keyCode === 123) { e.preventDefault(); return false; }
                        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { e.preventDefault(); return false; }
                        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { e.preventDefault(); return false; }
                        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) { e.preventDefault(); return false; }
                        // Ctrl+C (복사) - 배포 환경에서만 차단
                        if (e.ctrlKey && e.keyCode === 67 && !e.shiftKey) { e.preventDefault(); return false; }
                        // Ctrl+A (전체 선택) - 배포 환경에서만 차단
                        if (e.ctrlKey && e.keyCode === 65) { e.preventDefault(); return false; }
                        // Ctrl+X (잘라내기) - 배포 환경에서만 차단
                        if (e.ctrlKey && e.keyCode === 88) { e.preventDefault(); return false; }
                        // Mac의 Cmd 키 지원 - 배포 환경에서만 차단
                        if (e.metaKey && e.keyCode === 67 && !e.shiftKey) { e.preventDefault(); return false; }
                        if (e.metaKey && e.keyCode === 65) { e.preventDefault(); return false; }
                        if (e.metaKey && e.keyCode === 88) { e.preventDefault(); return false; }
                        if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
                        if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }
                        if (e.ctrlKey && e.keyCode === 80) { e.preventDefault(); return false; }
                    }, false);
                    
                    // 5. 이미지 우클릭 방지
                    function addImageProtection() {
                        const images = document.querySelectorAll('img');
                        images.forEach(function(img) {
                            if (!img.dataset.rightclickProtected) {
                                img.addEventListener('contextmenu', function(e) {
                                    e.preventDefault();
                                    return false;
                                }, false);
                                img.dataset.rightclickProtected = 'true';
                            }
                        });
                    }
                    
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', addImageProtection);
                    } else {
                        addImageProtection();
                    }
                    
                    const observer = new MutationObserver(function(mutations) {
                        addImageProtection();
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                })();
            </script>`;
            
            // <head> 태그가 있는 경우 base 태그와 스크립트 추가
            // 소스맵 차단 스크립트를 가장 먼저 실행하도록 <head> 태그 바로 뒤에 추가
            if (processedHtml.includes('<head>')) {
                // <head> 태그 바로 뒤에 base 태그와 스크립트 추가 (소스맵 차단을 최우선으로)
                processedHtml = processedHtml.replace(
                    /<head>/i,
                    `<head>${sourceMapBlocker}${rightClickBlocker}<base href="${baseUrl}">`
                );
            } else if (processedHtml.includes('<html')) {
                // <head> 태그가 없으면 <html> 태그 뒤에 <head>와 스크립트, base 태그 추가
                processedHtml = processedHtml.replace(
                    /(<html[^>]*>)/i,
                    `$1<head>${sourceMapBlocker}${rightClickBlocker}<base href="${baseUrl}"></head>`
                );
            } else {
                // HTML 구조가 없는 경우 앞에 추가
                processedHtml = `<head>${sourceMapBlocker}${rightClickBlocker}<base href="${baseUrl}"></head>` + processedHtml;
            }
            
            // srcdoc 설정 (DOM에 추가한 후 설정하면 더 빠름)
            iframe.srcdoc = processedHtml;
            
            // iframe 로드 완료 후 처리 (즉시 시도하고 실패하면 이벤트 대기)
            const tryScale = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc && iframeDoc.readyState === 'complete') {
                        recalculateIframeScale(iframeInfo);
                        return true;
                    }
                } catch (e) {
                    // 아직 로드되지 않음
                }
                return false;
            };
            
            // 즉시 시도
            if (!tryScale()) {
                // 로드 완료 대기
                iframe.addEventListener('load', () => {
                    // 넥스트1 박스인 경우 배경색 재설정 (큰 박스와 작은 박스 모두)
                    if (isNext1Box) {
                        container.style.setProperty('background', '#ffffff', 'important');
                        container.style.setProperty('background-color', '#ffffff', 'important');
                        if (isMainBox) {
                            container.style.setProperty('border', 'none', 'important');
                            container.style.setProperty('box-shadow', 'none', 'important');
                        }
                        
                        // iframe 내부의 body와 html 배경색도 흰색으로 설정
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            if (iframeDoc) {
                                if (iframeDoc.body) {
                                    iframeDoc.body.style.setProperty('background-color', '#ffffff', 'important');
                                    iframeDoc.body.style.setProperty('background', '#ffffff', 'important');
                                }
                                if (iframeDoc.documentElement) {
                                    iframeDoc.documentElement.style.setProperty('background-color', '#ffffff', 'important');
                                    iframeDoc.documentElement.style.setProperty('background', '#ffffff', 'important');
                                }
                            }
                        } catch (e) {
                            // 크로스 오리진 제한으로 접근 불가능한 경우 무시
                        }
                    }
                    
                    // 소스맵 요청 차단 (404 에러 방지)
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const iframeWin = iframe.contentWindow || iframe.contentWindow;
                        if (iframeDoc && iframeWin) {
                            // 소스맵 요청을 무시하도록 설정
                            const originalFetch = iframeWin.fetch;
                            if (originalFetch) {
                                iframeWin.fetch = function(...args) {
                                    const url = args[0];
                                    if (typeof url === 'string' && url.includes('.map')) {
                                        return Promise.reject(new Error('Source map disabled'));
                                    }
                                    return originalFetch.apply(this, args);
                                };
                            }
                        }
                    } catch (e) {
                        // 크로스 오리진 제한으로 접근 불가능한 경우 무시
                    }
                    
                    // 스케일 적용 최적화 (최대 2번만 시도)
                    const applyScale = (attempt = 0) => {
                        if (attempt > 2) return; // 최대 2번만 시도
                        
                        if (recalculateIframeScale(iframeInfo)) {
                            // 성공하면 메인박스인 경우 한 번만 추가 재계산
                            if (isMainBox) {
                                requestAnimationFrame(() => {
                                    recalculateIframeScale(iframeInfo);
                                });
                            }
                            return;
                        }
                        
                        // 실패하면 짧은 지연 후 재시도
                        if (attempt < 2) {
                            setTimeout(() => applyScale(attempt + 1), 50);
                        }
                    };
                    
                    requestAnimationFrame(() => {
                        applyScale();
                    });
                }, { once: true });
            } else {
                // 즉시 성공한 경우 메인박스만 한 번 추가 재계산
                if (isMainBox) {
                    requestAnimationFrame(() => {
                        recalculateIframeScale(iframeInfo);
                    });
                }
            }
            
            // 에러 처리
            iframe.addEventListener('error', (e) => {
                console.error('iframe 로드 실패:', e);
                container.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
            });
            
        } catch (error) {
            console.error('Failed to load content to iframe:', error);
            container.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 서비스1 파일 내용을 메인박스에 로드하는 함수
    function loadService1ContentToMainBox(mainBox, slideNumber) {
        console.log('loadService1ContentToMainBox 호출:', { mainBox: !!mainBox, slideNumber, hasContent: !!service1Contents[slideNumber] });
        try {
            if (!mainBox) {
                throw new Error('mainBox가 없습니다.');
            }
            
            // 이전 iframe 정보 제거
            const index = iframeScaleInfo.findIndex(info => info.container === mainBox);
            if (index !== -1) {
                iframeScaleInfo.splice(index, 1);
            }
            
            const html = service1Contents[slideNumber];
            if (!html) {
                throw new Error(`서비스 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            // 모든 서비스 슬라이드는 일반 스케일링 적용 (서비스1-8과 동일)
            mainBox.classList.remove('service-main-no-scale');
            
            // 서비스1-2부터 서비스1-8까지 주변 여백에 흰색 배경을 위한 클래스 추가
            if (slideNumber >= 2 && slideNumber <= 8) {
                mainBox.classList.add('service-main-white-bg');
            } else {
                mainBox.classList.remove('service-main-white-bg');
            }
            
            console.log('서비스1 콘텐츠 로드 중:', slideNumber);
            // slideNumber를 data 속성으로 저장 (서비스1-8 구분을 위해)
            mainBox.setAttribute("data-slide-number", slideNumber);
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "2");
            mainBox.classList.add("service-box");
            
            // 스케일 재계산 최적화 (여러 번 재시도)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
                if (iframeInfo) {
                    // 즉시 시도
                    recalculateIframeScale(iframeInfo);
                    // 짧은 지연 후 재시도 (레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 50);
                    // 더 긴 지연 후 재시도 (완전한 레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 200);
                }
            };
            
            // requestAnimationFrame으로 실행
            requestAnimationFrame(scheduleRecalculate);
            // 추가로 약간의 지연 후에도 실행
            setTimeout(scheduleRecalculate, 100);
        } catch (error) {
            console.error(`Failed to load service ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 넥스트1 파일 내용을 메인박스에 로드하는 함수
    function loadNext1ContentToMainBox(mainBox, slideNumber) {
        console.log('loadNext1ContentToMainBox 호출:', { mainBox: !!mainBox, slideNumber, hasContent: !!next1Contents[slideNumber] });
        try {
            if (!mainBox) {
                throw new Error('mainBox가 없습니다.');
            }
            
            // 이전 iframe 정보 제거
            const index = iframeScaleInfo.findIndex(info => info.container === mainBox);
            if (index !== -1) {
                iframeScaleInfo.splice(index, 1);
            }
            
            const html = next1Contents[slideNumber];
            if (!html) {
                throw new Error(`넥스트1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log('넥스트1 콘텐츠 로드 중:', slideNumber);
            mainBox.setAttribute("data-slide-number", slideNumber);
            // data-box 속성을 먼저 설정 (loadContentToIframe에서 확인하기 위해)
            mainBox.setAttribute("data-box", "4");
            
            // 넥스트1-1인 경우 전략1-1과 동일하게 처리 (service-box 클래스 제거)
            if (slideNumber === 1) {
                mainBox.classList.remove("service-box");
                mainBox.classList.remove("next1-box");
            } else {
                // 넥스트1-2부터는 기존 스타일 유지
                mainBox.classList.add("service-box");
                mainBox.classList.add("next1-box");
                
                // 넥스트1 박스 스타일 설정: 배경 흰색, 윤곽선/그림자 제거
                // 먼저 ::before 요소 제거를 위한 스타일 추가 (iframe 로드 전에)
                if (!document.getElementById('next1-box-style')) {
                    const style = document.createElement('style');
                    style.id = 'next1-box-style';
                    style.textContent = `
                        .test-expanded-box.service-box.next1-box::before,
                        .test-expanded-box.next1-box::before {
                            display: none !important;
                            content: none !important;
                            background: none !important;
                        }
                        .test-expanded-box.service-box.next1-box {
                            background: #ffffff !important;
                            background-color: #ffffff !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // 배경색 강제 설정
                mainBox.style.setProperty('background', '#ffffff', 'important');
                mainBox.style.setProperty('background-color', '#ffffff', 'important');
                mainBox.style.setProperty('border', 'none', 'important');
                mainBox.style.setProperty('box-shadow', 'none', 'important');
                
                // iframe 로드 후에도 배경색 재확인 및 ::before 제거 (여러 번 시도)
                const applyBackground = () => {
                    mainBox.style.setProperty('background', '#ffffff', 'important');
                    mainBox.style.setProperty('background-color', '#ffffff', 'important');
                    mainBox.style.setProperty('border', 'none', 'important');
                    mainBox.style.setProperty('box-shadow', 'none', 'important');
                    
                    // ::before 요소 강제 제거
                    const styleTag = document.getElementById('next1-box-style');
                    if (styleTag) {
                        styleTag.textContent = `
                            .test-expanded-box.service-box.next1-box::before,
                            .test-expanded-box.next1-box::before {
                                display: none !important;
                                content: none !important;
                                background: transparent !important;
                            }
                            .test-expanded-box.service-box.next1-box {
                                background: #ffffff !important;
                                background-color: #ffffff !important;
                            }
                        `;
                    }
                };
                
                // 즉시 적용
                applyBackground();
                
                // 짧은 간격으로 여러 번 재적용
                setTimeout(applyBackground, 50);
                setTimeout(applyBackground, 100);
                setTimeout(applyBackground, 200);
                setTimeout(applyBackground, 500);
            }
            
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            
            // 스케일 재계산 최적화 (여러 번 재시도) - 전략1-1과 동일하게 처리
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
                if (iframeInfo) {
                    // 즉시 시도
                    recalculateIframeScale(iframeInfo);
                    // 짧은 지연 후 재시도 (레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 50);
                    // 더 긴 지연 후 재시도 (완전한 레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 200);
                }
            };
            
            // requestAnimationFrame으로 실행
            requestAnimationFrame(scheduleRecalculate);
            // 추가로 약간의 지연 후에도 실행
            setTimeout(scheduleRecalculate, 100);
        } catch (error) {
            console.error(`Failed to load next1 ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 넥스트1 파일 내용 로드 함수 (슬라이드용)
    function loadNext1Content(slideItem, slideNumber) {
        try {
            const html = next1Contents[slideNumber];
            if (!html) {
                throw new Error(`넥스트1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            slideItem.setAttribute("data-slide-number", slideNumber);
            
            // 넥스트1 작은 박스 배경색 설정
            slideItem.style.setProperty('background', '#ffffff', 'important');
            slideItem.style.setProperty('background-color', '#ffffff', 'important');
            
            loadContentToIframe(slideItem, html, false);
            
            // iframe 로드 후에도 배경색 재확인
            setTimeout(() => {
                slideItem.style.setProperty('background', '#ffffff', 'important');
                slideItem.style.setProperty('background-color', '#ffffff', 'important');
            }, 100);
        } catch (error) {
            console.error(`Failed to load next1 content ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 서비스1 파일 내용 로드 함수 (슬라이드용)
    function loadService1Content(slideItem, slideNumber) {
        try {
            const html = service1Contents[slideNumber];
            if (!html) {
                throw new Error(`서비스1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            // 서비스1-7의 경우 스케일링 없이 그대로 삽입
            // 서비스1-8은 일반 스케일링 적용
            if (slideNumber === 7) {
                slideItem.classList.add('service-slide-no-scale');
            }
            
            // slideNumber를 data 속성으로 저장 (작은 박스에서도 95% 비율 적용을 위해)
            slideItem.setAttribute("data-slide-number", slideNumber);
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
            
            // 서비스1-2부터 서비스1-8까지 작은 박스도 비율을 유지한 채 스케일링 적용
            if (slideNumber >= 2 && slideNumber <= 8) {
                const scheduleRecalculate = () => {
                    const iframeInfo = getIframeInfo(slideItem);
                    if (iframeInfo) {
                        // 한 번만 시도하고, 실패하면 짧은 지연 후 재시도
                        if (!recalculateIframeScale(iframeInfo)) {
                            setTimeout(() => {
                                recalculateIframeScale(iframeInfo);
                            }, 50);
                        }
                    }
                };
                
                // requestAnimationFrame으로 한 번만 실행
                requestAnimationFrame(scheduleRecalculate);
            }
        } catch (error) {
            console.error(`Failed to load service1 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 서비스2 파일 내용을 객체로 저장
    const service2Contents = {
        1: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>서비스2-1</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="assets/images/서비스2-1썸네일(수정).png" alt="서비스2-1" class="slide-image" />
    </div>
</body>
</html>`,
        2: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Slide 1: 기획 배경 및 시장 상황</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Noto Sans KR', sans-serif; 
            overflow: hidden; 
            background-color: #f0f0f0; 
        }
        .slide-container { 
            width: 1280px; 
            height: 720px; 
            background-color: #ffffff; 
            position: relative; 
            display: flex; 
            flex-direction: column; 
            overflow: hidden; 
        }
        
        /* KT Identity Colors */
        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        .bg-light-blue { background-color: #E8F4F6; }
        
        /* Shadow & Layout */
        .card-shadow { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
        .grid-dashboard {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 0.75rem; /* 12px gap */
            height: 100%;
        }
        
        /* Custom Adjustments for Fit */
        .chart-container { position: relative; height: 100px; width: 100%; }
        .burden-chart-container { position: relative; height: 90px; width: 100%; }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">1. 기획 배경 및 시장 상황</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

</div>
</header>
<!-- Main Content -->
<div class="flex-1 flex p-6 gap-4 bg-gray-50 overflow-hidden h-full">
<!-- Left Column: Philosophy & Key Message (32%) -->
<div class="w-[32%] flex flex-col h-full">
<!-- Philosophy Card -->
<div class="bg-white p-6 rounded-2xl card-shadow flex-1 flex flex-col justify-center relative overflow-hidden">
<div class="absolute top-0 left-0 w-full h-2 bg-mint"></div>
<!-- Background Icon -->
<div class="absolute -right-6 -bottom-6 text-gray-50 opacity-20 text-9xl z-0">
<i class="fa-solid fa-universal-access"></i>
</div>
<div class="relative z-10">
<h3 class="text-mint font-bold text-base mb-1 uppercase tracking-wider">Core Philosophy</h3>
<h2 class="text-3xl font-extrabold text-gray-800 leading-tight mb-5">
                            Universal<br/>Design<br/>Concept
                        </h2>
<div class="bg-light-blue p-5 rounded-xl border-l-4 border-mint mb-6">
<p class="text-gray-700 font-medium text-lg leading-relaxed">
                                "가장 어려운 사용자를<br/>기준으로 설계하면,<br/>
<span class="text-mint font-bold">모두에게 쉬운 서비스</span>가<br/>됩니다."
                            </p>
</div>
<div>
<p class="text-gray-500 text-xs mb-3 font-bold uppercase">서비스 기획 의도</p>
<div class="space-y-3">
<div class="flex items-start gap-2 text-gray-700">
<i class="fa-solid fa-check text-kt-red mt-1 text-xs"></i>
<p class="text-sm font-medium">고령층의 인지적 특성 고려</p>
</div>
<div class="flex items-start gap-2 text-gray-700">
<i class="fa-solid fa-check text-kt-red mt-1 text-xs"></i>
<p class="text-sm font-medium">반복 가능한 충분한 설명 시간 확보</p>
</div>
<div class="flex items-start gap-2 text-gray-700">
<i class="fa-solid fa-check text-kt-red mt-1 text-xs"></i>
<p class="text-sm font-medium">의료진의 단순 반복 업무 경감</p>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Right Column: Data Dashboard (68%) -->
<div class="w-[68%] grid-dashboard">
<!-- Card 1: Aging Society -->
<div class="bg-white p-4 rounded-2xl card-shadow flex flex-col justify-between h-full overflow-hidden">
<div class="flex justify-between items-start mb-1 shrink-0">
<div>
<p class="text-gray-500 text-[10px] font-bold uppercase mb-0.5">사회적 배경</p>
<p class="text-base font-bold text-gray-800">2025년 초고령사회 진입</p>
</div>
<div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-kt-red shrink-0">
<i class="fa-solid fa-users-rays text-sm"></i>
</div>
</div>
<div class="flex items-center gap-3 flex-1 min-h-0">
<div class="w-1/2 flex justify-center items-center h-full chart-container">
<canvas id="agingChart"></canvas>
</div>
<div class="w-1/2">
<p class="text-3xl font-black text-gray-800">20.0<span class="text-xl text-gray-500">%</span></p>
<p class="text-[10px] text-gray-500 mt-0.5 font-medium">65세 이상 인구 비율<br/>(출처: 행정안전부 2024)</p>
</div>
</div>
</div>
<!-- Card 2: Market Growth -->
<div class="bg-white p-4 rounded-2xl card-shadow flex flex-col justify-between h-full overflow-hidden">
<div class="flex justify-between items-start mb-1 shrink-0">
<div>
<p class="text-gray-500 text-[10px] font-bold uppercase mb-0.5">시장 전망</p>
<p class="text-base font-bold text-gray-800">국내 AI 헬스케어 시장</p>
</div>
<div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-mint shrink-0">
<i class="fa-solid fa-chart-line text-sm"></i>
</div>
</div>
<div class="flex-1 flex flex-col justify-between min-h-0">
<div class="flex items-baseline gap-2 mb-1">
<span class="text-gray-500 text-xs font-medium">23년 대비 30년</span>
<span class="text-3xl font-black text-mint">17배 성장</span>
</div>
<div class="flex-1 min-h-0 mb-1">
<div class="chart-container" style="height: 130px;">
<canvas id="marketChart"></canvas>
</div>
</div>
<p class="text-[9px] text-gray-400 text-center">출처: 삼정KPMG 2024.07 보고서</p>
</div>
</div>
<!-- Card 3: Medical Staff Burden -->
<div class="bg-white p-4 rounded-2xl card-shadow flex flex-col justify-between h-full overflow-hidden">
<div class="flex justify-between items-start mb-1 shrink-0">
<div>
<p class="text-gray-500 text-[10px] font-bold uppercase mb-0.5">의료 현황</p>
<p class="text-base font-bold text-gray-800">과중한 진료 부담</p>
</div>
<div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
<i class="fa-solid fa-stethoscope text-sm"></i>
</div>
</div>
<div class="flex-1 flex flex-col justify-center min-h-0">
<div class="burden-chart-container">
<canvas id="burdenChart"></canvas>
</div>
<p class="text-[10px] text-gray-500 font-medium text-center mt-2">의사 1인당 진료 부담 (OECD 평균 대비)</p>
</div>
</div>
<!-- Card 4: Need for Solution -->
<div class="bg-white p-4 rounded-2xl card-shadow flex flex-col justify-between relative overflow-hidden group h-full">
<div class="absolute right-0 top-0 w-20 h-20 bg-gray-50 rounded-bl-full -mr-3 -mt-3 z-0"></div>
<div class="relative z-10 flex justify-between items-start mb-1 shrink-0">
<div>
<p class="text-gray-500 text-[10px] font-bold uppercase mb-0.5">서비스 니즈</p>
<p class="text-base font-bold text-gray-800">수술 동의 프로세스 혁신</p>
</div>
<div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
<i class="fa-solid fa-file-signature text-sm"></i>
</div>
</div>
<div class="relative z-10 flex-1 flex flex-col justify-between min-h-0">
<div class="mb-2">
<div class="bg-gray-50 p-2 rounded-lg mb-2">
<p class="text-[10px] text-gray-400 font-bold mb-1.5">주요 대형병원 수술 건수 (출처: 각 병원 2024년 연보)</p>
<div class="chart-container" style="height: 80px;">
<canvas id="surgeryChart"></canvas>
</div>
</div>
<div class="grid grid-cols-2 gap-2">
<div class="bg-white p-2 rounded-lg text-center border border-purple-100 shadow-sm flex flex-col justify-center">
<p class="text-[10px] text-purple-400 font-bold mb-0.5">솔루션 목표</p>
<p class="text-base font-bold text-purple-700">이해 중심</p>
<p class="text-[9px] text-gray-500 font-medium">동의 체계 전환</p>
</div>
<div class="bg-gray-50 p-2 rounded-lg space-y-1">
<div class="flex items-center justify-between">
<p class="text-[9px] text-gray-500">현재 문제점</p>
<p class="text-[9px] font-bold text-gray-700">설명 부족 민원 증가</p>
</div>
<div class="flex items-center justify-between">
<p class="text-[9px] text-gray-500">해결 방안</p>
<p class="text-[9px] font-bold text-mint">AI 기반 체계적 설명</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<script>
        // Chart Config
        Chart.defaults.font.family = "'Noto Sans KR', sans-serif";
        Chart.defaults.color = '#666';

        // Chart 1: Aging Population (Donut)
        const ctxAging = document.getElementById('agingChart').getContext('2d');
        new Chart(ctxAging, {
            type: 'doughnut',
            data: {
                labels: ['65세 이상', '그 외'],
                datasets: [{
                    data: [20, 80],
                    backgroundColor: ['#E60012', '#E0E0E0'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                layout: { padding: 0 }
            }
        });

        // Chart 2: Market Growth (Line)
        const ctxMarket = document.getElementById('marketChart').getContext('2d');
        new Chart(ctxMarket, {
            type: 'line',
            data: {
                labels: ['2023', '2025', '2027', '2030'],
                datasets: [{
                    label: '시장 규모 (억$)',
                    data: [3.7, 12.5, 30.2, 66.7],
                    borderColor: '#87CEEB',
                    backgroundColor: 'rgba(135, 206, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#87CEEB',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 6,
                        titleFont: { size: 10 },
                        bodyFont: { size: 10 },
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toFixed(1) + '억$';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 9 },
                            color: '#6B7280',
                            callback: function(value) {
                                return value + '억$';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 9 },
                            color: '#6B7280'
                        },
                        grid: { display: false }
                    }
                }
            }
        });

        // Chart 3: Burden Comparison (Bar)
        const ctxBurden = document.getElementById('burdenChart').getContext('2d');
        new Chart(ctxBurden, {
            type: 'bar',
            data: {
                labels: ['OECD 평균', '한국'],
                datasets: [{
                    label: '진료 부담',
                    data: [1788, 6113],
                    backgroundColor: ['#E0E0E0', '#FF9F40'],
                    borderRadius: 4,
                    barPercentage: 0.5,
                    categoryPercentage: 0.8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        display: false,
                        max: 7000
                    },
                    y: {
                        grid: { display: false, drawBorder: false },
                        ticks: { 
                            font: { family: 'Noto Sans KR', weight: 'bold', size: 12 },
                            color: '#333'
                        },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                    datalabels: {
                        anchor: 'end',
                        align: 'right',
                        offset: 8,
                        color: '#333',
                        font: {
                            family: 'Noto Sans KR',
                            weight: 'bold',
                            size: 14
                        },
                        formatter: function(value) {
                            return value.toLocaleString('ko-KR') + '명';
                        }
                    }
                },
                layout: { padding: { right: 30 } }, // Space for labels
                animation: {
                    onComplete: function() {
                        // datalabels 플러그인이 없을 경우를 대비한 폴백
                        if (!window.ChartDataLabels) {
                            const chartInstance = this;
                            const ctx = chartInstance.ctx;
                            ctx.font = "bold 14px 'Noto Sans KR'";
                            ctx.fillStyle = "#333";
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle";
                            
                            this.data.datasets.forEach(function(dataset, i) {
                                const meta = chartInstance.getDatasetMeta(i);
                                meta.data.forEach(function(bar, index) {
                                    const data = dataset.data[index];
                                    const formattedData = data.toLocaleString('ko-KR');
                                    ctx.fillText(formattedData + "명", bar.x + 8, bar.y);
                                });
                            });
                        }
                    }
                }
            },
            plugins: window.ChartDataLabels ? [window.ChartDataLabels] : []
        });

        // Chart 4: Surgery Count (Horizontal Bar)
        const ctxSurgery = document.getElementById('surgeryChart').getContext('2d');
        new Chart(ctxSurgery, {
            type: 'bar',
            data: {
                labels: ['서울아산', '삼성서울', '서울대'],
                datasets: [{
                    label: '수술 건수',
                    data: [47471, 36805, 24478],
                    backgroundColor: [
                        'rgba(135, 206, 235, 0.8)',
                        'rgba(135, 206, 235, 0.7)',
                        'rgba(135, 206, 235, 0.6)'
                    ],
                    borderColor: '#87CEEB',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 9 },
                            color: '#6B7280',
                            callback: function(value) {
                                if (value === 0) return '0';
                                return (value / 10000).toFixed(0) + '만';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    y: {
                        ticks: {
                            font: { size: 10, weight: 'bold' },
                            color: '#333'
                        },
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 6,
                        titleFont: { size: 10 },
                        bodyFont: { size: 10 },
                        callbacks: {
                            label: function(context) {
                                return '연 ' + context.parsed.x.toLocaleString() + '건';
                            }
                        }
                    }
                },
                layout: { padding: { left: 0, right: 10 } }
            }
        });
    </script>
</body>
</html>
`,
        3: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Slide 2: 핵심 쟁점</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: 'Noto Sans KR', sans-serif;
            overflow: hidden;
        }
        
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            transform: scale(0.95);
            transform-origin: center center;
        }

        /* KT Identity Colors & Warning Colors */
        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .bg-kt-gray { background-color: #434343; }
        .text-kt-gray { color: #434343; }
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        
        /* Warning/Issue Colors */
        .bg-warn-light { background-color: #FFF5F5; }
        .border-warn { border-color: #FFCDD2; }
        .text-warn-dark { color: #B71C1C; }

        .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        /* Cycle Diagram Styles */
        .cycle-container {
            position: relative;
            width: 500px;
            height: 450px;
            margin: 0 auto;
        }

        .cycle-node {
            position: absolute;
            width: 140px;
            height: 140px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .cycle-node-1 { top: 0; left: 50%; transform: translateX(-50%); background-color: #E8F4F6; border: 3px solid #87CEEB; } /* Patient */
        .cycle-node-2 { bottom: 20px; right: 20px; background-color: #FFF3E0; border: 3px solid #FF9800; } /* Staff */
        .cycle-node-3 { bottom: 20px; left: 20px; background-color: #F3E5F5; border: 3px solid #9C27B0; } /* Hospital */

        .cycle-arrow {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .issue-tag {
            background-color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: #555;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: absolute;
            white-space: nowrap;
        }
    </style>
<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.absolute{position:absolute}.relative{position:relative}.bottom-6{bottom:1.5rem}.z-10{z-index:10}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.mb-8{margin-bottom:2rem}.ml-1{margin-left:0.25rem}.mr-1{margin-right:0.25rem}.mt-1{margin-top:0.25rem}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-12{height:3rem}.h-20{height:5rem}.h-8{height:2rem}.w-10{width:2.5rem}.w-12{width:3rem}.w-2{width:0.5rem}.w-\[38\%\]{width:38%}.w-\[62\%\]{width:62%}.w-\[90\%\]{width:90%}.flex-1{flex:1 1 0%}.grid-rows-3{grid-template-rows:repeat(3, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:0.25rem}.gap-12{gap:3rem}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.overflow-hidden{overflow:hidden}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border-b{border-bottom-width:1px}.border-l-8{border-left-width:8px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-gray-800{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-red-50{--tw-bg-opacity:1;background-color:rgb(254 242 242 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-12{padding-left:3rem;padding-right:3rem}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-extrabold{font-weight:800}.font-medium{font-weight:500}.font-normal{font-weight:400}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-0.025em}.text-gray-300{--tw-text-opacity:1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-purple-600{--tw-text-opacity:1;color:rgb(147 51 234 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}</style><style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.absolute{position:absolute}.relative{position:relative}.bottom-6{bottom:1.5rem}.z-10{z-index:10}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.mb-8{margin-bottom:2rem}.ml-1{margin-left:0.25rem}.mr-1{margin-right:0.25rem}.mt-1{margin-top:0.25rem}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-12{height:3rem}.h-20{height:5rem}.h-8{height:2rem}.w-10{width:2.5rem}.w-12{width:3rem}.w-2{width:0.5rem}.w-\[38\%\]{width:38%}.w-\[62\%\]{width:62%}.w-\[90\%\]{width:90%}.flex-1{flex:1 1 0%}.grid-rows-3{grid-template-rows:repeat(3, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:0.25rem}.gap-12{gap:3rem}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.overflow-hidden{overflow:hidden}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border-b{border-bottom-width:1px}.border-l-8{border-left-width:8px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-gray-800{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-red-50{--tw-bg-opacity:1;background-color:rgb(254 242 242 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-12{padding-left:3rem;padding-right:3rem}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-extrabold{font-weight:800}.font-medium{font-weight:500}.font-normal{font-weight:400}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-0.025em}.text-gray-300{--tw-text-opacity:1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-purple-600{--tw-text-opacity:1;color:rgb(147 51 234 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-lg{--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}</style></head>
<body style="">
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">2. 핵심 쟁점 (Core Issues)</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

</div>
</header>
<!-- Main Content -->
<div class="flex-1 flex p-12 gap-12 bg-gray-50">
<!-- Left Column: Legal & Data Facts -->
<div class="w-[38%] flex flex-col gap-6">
<!-- Legal Card -->
<div class="bg-white p-6 rounded-2xl card-shadow border-l-8 border-kt-red">
<div class="flex items-center gap-3 mb-3">
<i class="fa-solid fa-scale-balanced text-kt-red text-xl"></i>
<h3 class="text-gray-800 font-bold text-lg">의료법 제24조의2 (설명의무)</h3>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<p class="text-gray-600 text-sm leading-relaxed">
<span class="font-bold text-gray-800">"환자가 내용을 충분히 이해하고 동의했는가"</span>가<br> 
                            법적 효력의 핵심 조건입니다.<br>
                            단순 서명만으로는 설명 의무를 충족하지 못합니다.
                        </p>
</div>
</div>
<!-- Statistics Grid -->
<div class="grid grid-rows-3 gap-4 flex-1">
<!-- Stat 1 -->
<div class="bg-white p-5 rounded-2xl card-shadow flex items-center justify-between">
<div>
<p class="text-gray-500 text-xs font-bold mb-1">고령 환자 설명 소요</p>
<p class="text-3xl font-black text-gray-800">40~60<span class="text-lg text-gray-500 font-normal ml-1">분</span></p>
<p class="text-xs text-kt-red font-medium mt-1">일반 환자 대비 2배 소요</p>
</div>
<div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-kt-red">
<i class="fa-solid fa-hourglass-half text-xl"></i>
</div>
</div>
<!-- Stat 2 -->
<div class="bg-white p-5 rounded-2xl card-shadow flex items-center justify-between">
<div>
<p class="text-gray-500 text-xs font-bold mb-1">환자 이해도 부족</p>
<p class="text-3xl font-black text-gray-800">30<span class="text-lg text-gray-500 font-normal ml-1">%</span></p>
<p class="text-xs text-orange-500 font-medium mt-1">10명 중 3명은 이해 못함</p>
</div>
<div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
<i class="fa-solid fa-circle-question text-xl"></i>
</div>
</div>
<!-- Stat 3 -->
<div class="bg-white p-5 rounded-2xl card-shadow flex items-center justify-between">
<div>
<p class="text-gray-500 text-xs font-bold mb-1">연간 의료분쟁</p>
<p class="text-3xl font-black text-gray-800">2,089<span class="text-lg text-gray-500 font-normal ml-1">건</span></p>
<p class="text-xs text-gray-500 mt-1">'설명 위반'이 주요 원인</p>
</div>
<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
<i class="fa-solid fa-gavel text-xl"></i>
</div>
</div>
</div>
</div>
<!-- Right Column: Vicious Cycle Diagram -->
<div class="w-[62%] bg-white rounded-3xl card-shadow p-8 flex flex-col items-center relative overflow-hidden" style="transform: translate(-14.988848px, -11.776952px);">
<div class="text-center mb-8 z-10">
<h3 class="text-xl font-extrabold text-gray-800 mb-2" style="position: relative; transform: translate(-176.654275px, -28.907063px);">비효율의 악순환 구조 (Vicious Cycle)</h3>
<p class="text-gray-500 text-sm" style="position: relative; transform: translate(171.301115px, -61.026022px);">개별적인 문제가 아닌, 서로 연결되어 악화되는 구조적 한계</p>
</div>
<div class="cycle-container" style="transform: translate(-19.271375px, -58.884758px);">
<!-- SVG Arrows Background -->
<svg class="cycle-arrow" viewBox="0 0 500 450">
<!-- Triangle path connecting centers roughly -->
<path d="M250 80 L420 380 L80 380 Z" fill="none" stroke="#E0E0E0" stroke-dasharray="5,5" stroke-width="2"></path>
<!-- Arrow 1: Patient -> Staff -->
<path d="M290 110 Q400 200 420 310" fill="none" marker-end="url(#arrowhead-red)" stroke="#FFCDD2" stroke-width="4"></path>
<!-- Arrow 2: Staff -> Hospital -->
<path d="M380 400 Q250 440 120 400" fill="none" marker-end="url(#arrowhead-red)" stroke="#FFCDD2" stroke-width="4"></path>
<!-- Arrow 3: Hospital -> Patient -->
<path d="M80 310 Q100 200 210 110" fill="none" marker-end="url(#arrowhead-red)" stroke="#FFCDD2" stroke-width="4"></path>
<defs>
<marker id="arrowhead-red" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
<polygon fill="#FFCDD2" points="0 0, 10 3.5, 0 7"></polygon>
</marker>
</defs>
</svg>
<!-- Node 1: Patient -->
<div class="cycle-node cycle-node-1" style="transform: translate(-71.732344px, -18.200743px);">
<i class="fa-solid fa-user-injured text-3xl text-mint mb-2"></i>
<p class="font-bold text-gray-800 text-lg">환자</p>
<p class="text-xs text-gray-500 text-center">Patient</p>
<div class="issue-tag" style="top: 10px; right: -90px; color: rgb(230, 0, 18); transform: translate(-36.401487px, -18.200743px);">
<i class="fa-solid fa-triangle-exclamation mr-1"></i>용어 이해 불가
                        </div>
<div class="issue-tag" style="top: 50px; right: -100px; color: rgb(230, 0, 18); transform: translate(-40.684015px, -17.130112px);">
                            심리적 불안감
                        </div>
</div>
<!-- Node 2: Staff -->
<div class="cycle-node cycle-node-2" style="transform: translate(17.130112px, 13.918216px);">
<i class="fa-solid fa-user-doctor text-3xl text-orange-500 mb-2"></i>
<p class="font-bold text-gray-800 text-lg">의료진</p>
<p class="text-xs text-gray-500 text-center">Medical Staff</p>
<div class="issue-tag" style="bottom: -30px; right: 0px; color: rgb(230, 0, 18); transform: translate(88.862454px, -87.791822px);">
<i class="fa-solid fa-fire mr-1"></i>번아웃(Burnout)
                        </div>
<div class="issue-tag" style="top: -20px; right: -20px; color: rgb(230, 0, 18); transform: translate(12.847584px, 11.776952px);">
                            무한 반복 설명
                        </div>
</div>
<!-- Node 3: Hospital -->
<div class="cycle-node cycle-node-3" style="transform: translate(-26.765799px, -8.565055px);">
<i class="fa-solid fa-hospital text-3xl text-purple-600 mb-2"></i>
<p class="font-bold text-gray-800 text-lg">병원</p>
<p class="text-xs text-gray-500 text-center">Hospital</p>
<div class="issue-tag" style="bottom: -30px; left: 0px; color: rgb(230, 0, 18); transform: translate(-56.743494px, -102.780669px);">
<i class="fa-solid fa-chart-line-down mr-1"></i>매출/효율 하락
                        </div>
<div class="issue-tag" style="top: -20px; left: -30px; color: #E60012;">
                            법적 분쟁 리스크
                        </div>
</div>
</div>
<!-- Solution Key Message -->
<div class="absolute bottom-6 w-[90%] bg-gray-800 text-white p-4 rounded-xl flex items-center justify-between shadow-lg" style="transform: translate(3.211896px, 16.05948px);">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-kt-red flex items-center justify-center">
<i class="fa-solid fa-lightbulb text-white text-lg"></i>
</div>
<div>
<p class="font-bold text-lg">해결 과제 (Task)</p>
<p class="text-xs text-gray-300">악순환을 끊기 위한 골든타임 개입 필요</p>
</div>
</div>
<div class="flex gap-4 text-sm font-medium">
<span class="flex items-center gap-1"><i class="fa-solid fa-check text-mint"></i> 눈높이 설명</span>
<span class="flex items-center gap-1"><i class="fa-solid fa-check text-mint"></i> 무제한 반복</span>
<span class="flex items-center gap-1"><i class="fa-solid fa-check text-mint"></i> 이해도 데이터화</span>
</div>
</div>
</div>
</div>
</div>

</body></html>`,
        4: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Slide 3: 서비스 경쟁 포지셔닝</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: 'Noto Sans KR', sans-serif;
            overflow: hidden;
        }
        
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            transform: scale(0.95);
            transform-origin: center center;
        }

        /* KT Identity Colors */
        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .bg-kt-gray { background-color: #434343; }
        .text-kt-gray { color: #434343; }
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        .bg-light-mint { background-color: #E8F4F6; }
        .border-mint { border-color: #87CEEB; }

        .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        /* Positioning Matrix Styles */
        .matrix-container {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #F8F9FA;
            border-radius: 1rem;
            border: 1px solid #E9ECEF;
        }

        .matrix-axis-x {
            position: absolute;
            top: 50%;
            left: 5%;
            right: 5%;
            height: 2px;
            background-color: #CFD8DC;
        }

        .matrix-axis-y {
            position: absolute;
            left: 50%;
            top: 5%;
            bottom: 5%;
            width: 2px;
            background-color: #CFD8DC;
        }

        .matrix-quadrant-label {
            position: absolute;
            font-weight: 900;
            font-size: 3rem;
            color: #E9ECEF;
            z-index: 0;
            text-transform: uppercase;
        }

        .q1 { top: 20px; right: 20px; color: #E0F7FA; } /* Leader */
        .q2 { top: 20px; left: 20px; } /* Specialist */
        .q3 { bottom: 20px; left: 20px; } /* Basic */
        .q4 { bottom: 20px; right: 20px; } /* Niche */

        .matrix-point {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -50%);
            z-index: 10;
        }

        .point-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .point-label {
            margin-top: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            color: #555;
            background: rgba(255,255,255,0.9);
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
        }

        .point-kt {
            z-index: 20;
        }
        
        .point-kt .point-dot {
            width: 24px;
            height: 24px;
            background-color: #E60012;
            box-shadow: 0 0 0 6px rgba(230, 0, 18, 0.2);
            animation: pulse 2s infinite;
        }

        .point-kt .point-label {
            color: #E60012;
            font-size: 0.9rem;
            border: 1px solid #E60012;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(230, 0, 18, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(230, 0, 18, 0); }
            100% { box-shadow: 0 0 0 0 rgba(230, 0, 18, 0); }
        }

        .competitor-table th {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
            padding: 0.75rem;
            font-size: 0.8rem;
        }
        
        .competitor-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.8rem;
            color: #374151;
        }

        .competitor-table tr:last-child td {
            border-bottom: none;
        }
    </style>
<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.absolute{position:absolute}.relative{position:relative}.bottom-\[5\%\]{bottom:5%}.left-\[5\%\]{left:5%}.left-\[50\%\]{left:50%}.right-\[5\%\]{right:5%}.top-\[5\%\]{top:5%}.top-\[50\%\]{top:50%}.z-10{z-index:10}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-4{margin-bottom:1rem}.mt-0\.5{margin-top:0.125rem}.mt-1{margin-top:0.25rem}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-20{height:5rem}.h-8{height:2rem}.h-full{height:100%}.w-1\/2{width:50%}.w-1\/4{width:25%}.w-10{width:2.5rem}.w-2{width:0.5rem}.w-8{width:2rem}.w-full{width:100%}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.-translate-x-1\/2{--tw-translate-x:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\/2{--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-1\/2{--tw-translate-x:50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-y-1\/2{--tw-translate-y:50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-\[-90deg\]{--tw-rotate:-90deg;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-\[90deg\]{--tw-rotate:90deg;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.grid-cols-1{grid-template-columns:repeat(1, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-10{gap:2.5rem}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.overflow-hidden{overflow:hidden}.rounded{border-radius:0.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-l{border-left-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255 / var(--tw-bg-opacity, 1))}.bg-gray-400{--tw-bg-opacity:1;background-color:rgb(156 163 175 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-4{padding:1rem}.px-1{padding-left:0.25rem;padding-right:0.25rem}.px-12{padding-left:3rem;padding-right:3rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.pl-10{padding-left:2.5rem}.text-left{text-align:left}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\[10px\]{font-size:10px}.text-\[9px\]{font-size:9px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.uppercase{text-transform:uppercase}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-0.025em}.tracking-wide{letter-spacing:0.025em}.tracking-widest{letter-spacing:0.1em}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity, 1))}.text-gray-100{--tw-text-opacity:1;color:rgb(243 244 246 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-inner{--tw-shadow:inset 0 2px 4px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:inset 0 2px 4px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}</style></head>
<body style="">
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">3. 서비스 경쟁 포지셔닝</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

</div>
</header>
<!-- Main Content -->
<div class="flex-1 flex p-12 gap-10 bg-white">
<!-- Left Column: Positioning Matrix (50%) -->
<div class="w-1/2 flex flex-col">
<div class="mb-4">
<h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
<span class="w-8 h-8 rounded-lg bg-mint text-white flex items-center justify-center text-sm"><i class="fa-solid fa-crosshairs"></i></span>
                    Market Positioning
                </h3>
<p class="text-sm text-gray-500 mt-1 pl-10">기술적 우위와 환자 경험을 동시에 충족하는 Leader Position</p>
</div>
<div class="flex-1 relative">
<!-- Matrix Chart -->
<div class="matrix-container shadow-inner">
<!-- Labels -->
<div class="matrix-quadrant-label q1">Leader</div>
<div class="matrix-quadrant-label q2 text-gray-100">Specialist</div>
<div class="matrix-quadrant-label q3 text-gray-100">Basic</div>
<div class="matrix-quadrant-label q4 text-gray-100">Niche</div>
<!-- Axis Lines -->
<div class="matrix-axis-x"></div>
<div class="matrix-axis-y"></div>
<div class="absolute top-[5%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">High Tech (AI)</div>
<div class="absolute bottom-[5%] left-[50%] -translate-x-1/2 translate-y-1/2 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Low Tech (Digital)</div>
<div class="absolute left-[5%] top-[50%] -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest rotate-[-90deg]">Admin-Centric</div>
<div class="absolute right-[5%] top-[50%] translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest rotate-[90deg]">Patient-Centric</div>
<!-- Data Points -->
<!-- KT AI (Our Service) -->
<div class="matrix-point point-kt" style="top: 15%; left: 85%;">
<div class="point-dot"></div>
<div class="point-label">KT AI수술동의</div>
<div class="bg-white text-[10px] text-gray-400 mt-1 px-1 rounded border border-gray-100 shadow-sm">맥락인식 + 맞춤형</div>
</div>
<!-- Competitor 1: Electronic Consent (Basic) -->
<div class="matrix-point" style="top: 80%; left: 20%;">
<div class="point-dot bg-gray-400"></div>
<div class="point-label">기존 전자동의서</div>
<div class="text-[9px] text-gray-400 mt-0.5">단순 서명 전자화</div>
</div>
<!-- Competitor 2: General Chatbot (Niche) -->
<div class="matrix-point" style="top: 70%; left: 75%;">
<div class="point-dot bg-gray-400"></div>
<div class="point-label">일반 병원 챗봇</div>
<div class="text-[9px] text-gray-400 mt-0.5">예약/안내 중심</div>
</div>
<!-- Competitor 3: Patient Edu LMS (Specialist) -->
<div class="matrix-point" style="top: 30%; left: 30%;">
<div class="point-dot bg-gray-400"></div>
<div class="point-label">환자 교육 LMS</div>
<div class="text-[9px] text-gray-400 mt-0.5">일방향 교육</div>
</div>
</div>
</div>
</div>
<!-- Right Column: Strategic USP & Comparison (50%) -->
<div class="w-1/2 flex flex-col gap-6">
<!-- Top: 3 Key Differentiators -->
<div>
<h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
<span class="w-8 h-8 rounded-lg bg-kt-red text-white flex items-center justify-center text-sm"><i class="fa-solid fa-star"></i></span>
                    Core Differentiators
                </h3>
<div class="grid grid-cols-1 gap-3">
<!-- USP 1 -->
<div class="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 card-shadow hover:border-mint transition-colors duration-300">
<div class="w-10 h-10 rounded-full bg-light-mint flex items-center justify-center flex-shrink-0 text-mint">
<i class="fa-solid fa-brain text-lg"></i>
</div>
<div>
<h4 class="font-bold text-gray-800 text-sm mb-1">LLM 기반 맥락 파악 (Context-Aware)</h4>
<p class="text-xs text-gray-500 leading-relaxed">
                                단순 키워드 매칭이 아닌, 환자의 질문 의도와 이전 대화 맥락을 파악하여 
                                <span class="text-mint font-bold">"아까 그거요"</span> 같은 지시어까지 정확히 이해하고 답변
                            </p>
</div>
</div>
<!-- USP 2 -->
<div class="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 card-shadow hover:border-mint transition-colors duration-300">
<div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
<i class="fa-solid fa-glasses text-lg"></i>
</div>
<div>
<h4 class="font-bold text-gray-800 text-sm mb-1">고령자 초개인화 UX (Hyper-Personalized)</h4>
<p class="text-xs text-gray-500 leading-relaxed">
                                큰 글씨, 느린 음성, 쉬운 말 변환 등 
                                <span class="text-orange-500 font-bold">시니어 전용 모드</span> 자동 추천 및 아바타 인터랙션 제공
                            </p>
</div>
</div>
<!-- USP 3 -->
<div class="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 card-shadow hover:border-mint transition-colors duration-300">
<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
<i class="fa-solid fa-file-contract text-lg"></i>
</div>
<div>
<h4 class="font-bold text-gray-800 text-sm mb-1">실질적 이해 기반 동의 (Smart Consent)</h4>
<p class="text-xs text-gray-500 leading-relaxed">
                                형식적 서명이 아닌 <span class="text-blue-600 font-bold">이해도 측정 데이터</span>를 법적 증빙자료로 활용하여 의료분쟁 리스크 최소화
                            </p>
</div>
</div>
</div>
</div>
<!-- Bottom: Comparison Table -->
<div class="flex-1 flex flex-col">
<h3 class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Competitor Analysis</h3>
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1">
<table class="w-full text-left competitor-table h-full">
<thead>
<tr>
<th class="w-1/4">구분</th>
<th class="w-1/4">기존 전자동의서</th>
<th class="w-1/4">일반 챗봇</th>
<th class="w-1/4 bg-light-mint text-mint border-b border-mint">KT AI 서비스</th>
</tr>
</thead>
<tbody>
<tr>
<td class="font-bold text-gray-600">주요 기능</td>
<td>서류의 디지털화</td>
<td>예약/단순 안내</td>
<td class="bg-light-mint font-bold text-gray-800 border-l border-mint">맞춤형 설명+동의</td>
</tr>
<tr>
<td class="font-bold text-gray-600">소통 방식</td>
<td>일방향 (Read)</td>
<td>텍스트 위주</td>
<td class="bg-light-mint font-bold text-gray-800 border-l border-mint">멀티형 (Voice/text)</td>
</tr>
<tr>
<td class="font-bold text-gray-600">이해도 확인</td>
<td><span class="text-gray-400">불가능 (서명만)</span></td>
<td><span class="text-gray-400">단편적</span></td>
<td class="bg-light-mint font-bold text-gray-800 border-l border-mint">구간별 측정/데이터화</td>
</tr>
<tr>
<td class="font-bold text-gray-600">타겟 대응</td>
<td>획일적 UI</td>
<td>범용적 UI</td>
<td class="bg-light-mint font-bold text-gray-800 border-l border-mint">고령자 전용 모드</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>

</body></html>`,
        5: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Slide 4: 타겟 분석 및 사용자 페르소나</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: 'Noto Sans KR', sans-serif;
            overflow: hidden;
        }
        
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        /* KT Identity Colors */
        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .bg-kt-gray { background-color: #434343; }
        .text-kt-gray { color: #434343; }
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        .bg-light-mint { background-color: #E8F4F6; }
        .border-mint { border-color: #87CEEB; }

        .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .persona-card {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .persona-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
    </style>
<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.absolute{position:absolute}.relative{position:relative}.z-10{z-index:10}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mt-1{margin-top:0.25rem}.mt-2{margin-top:0.5rem}.mt-3{margin-top:0.75rem}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-12{height:3rem}.h-16{height:4rem}.h-20{height:5rem}.h-8{height:2rem}.h-full{height:100%}.w-1\/2{width:50%}.w-1\/3{width:33.333333%}.w-10{width:2.5rem}.w-12{width:3rem}.w-2{width:0.5rem}.w-8{width:2rem}.w-full{width:100%}.flex-1{flex:1 1 0%}.flex-shrink-0{flex-shrink:0}.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-10{gap:2.5rem}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.overflow-hidden{overflow:hidden}.rounded{border-radius:0.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255 / var(--tw-bg-opacity, 1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.bg-green-50{--tw-bg-opacity:1;background-color:rgb(240 253 244 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-purple-50{--tw-bg-opacity:1;background-color:rgb(250 245 255 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-3{padding:0.75rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.px-1{padding-left:0.25rem;padding-right:0.25rem}.px-12{padding-left:3rem;padding-right:3rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.px-3{padding-left:0.75rem;padding-right:0.75rem}.px-4{padding-left:1rem;padding-right:1rem}.pl-10{padding-left:2.5rem}.text-left{text-align:left}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\[10px\]{font-size:10px}.text-\[9px\]{font-size:9px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.leading-relaxed{line-height:1.625}.leading-tight{line-height:1.25}.tracking-tight{letter-spacing:-0.025em}.tracking-wide{letter-spacing:0.025em}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity, 1))}.text-gray-100{--tw-text-opacity:1;color:rgb(243 244 246 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-green-600{--tw-text-opacity:1;color:rgb(22 163 74 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-purple-600{--tw-text-opacity:1;color:rgb(147 51 234 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-inner{--tw-shadow:inset 0 2px 4px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:inset 0 2px 4px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-300{transition-duration:300ms}</style></head>
<body style="">
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">4. 타겟 분석 및 사용자 페르소나</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

</div>
</header>
<!-- Main Content -->
<div class="flex-1 flex px-12 pt-6 pb-12 gap-10 bg-white overflow-hidden">
<!-- Left: Target Segmentation (40%) -->
<div class="w-2/5 flex flex-col">
<div class="mb-3">
<h3 class="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
<span class="w-8 h-8 rounded-lg bg-mint text-white flex items-center justify-center text-sm"><i class="fa-solid fa-users"></i></span>
                    Target Segmentation
                </h3>
<p class="text-sm text-gray-500 pl-10">65세 이상 고령 환자 중심, 보호자 보조 활용</p>
</div>
<div class="flex-1 bg-gray-50 rounded-xl p-6 flex flex-col gap-4 shadow-inner">
<!-- Primary Target -->
<div class="bg-white rounded-lg p-4 border-2 border-mint card-shadow">
<div class="flex items-center justify-between mb-2">
<h4 class="font-bold text-gray-800 text-sm">1차 타겟</h4>
<span class="bg-mint text-white text-xs px-2 py-1 rounded-full font-semibold">Primary</span>
</div>
<div class="text-xs text-gray-600 leading-relaxed">
<p class="font-semibold text-gray-800 mb-1">65세 이상 고령 환자</p>
<ul class="list-disc pl-4 space-y-1 text-gray-500">
<li>만성질환 관리 필요</li>
<li>스마트폰 사용 가능 (기초 수준)</li>
<li>비대면 의료 서비스 경험 적음</li>
</ul>
</div>
</div>
<!-- Secondary Target -->
<div class="bg-white rounded-lg p-4 border border-gray-200 card-shadow">
<div class="flex items-center justify-between mb-2">
<h4 class="font-bold text-gray-800 text-sm">2차 타겟</h4>
<span class="bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-semibold">Secondary</span>
</div>
<div class="text-xs text-gray-600 leading-relaxed">
<p class="font-semibold text-gray-800 mb-1">보호자 (자녀/배우자)</p>
<ul class="list-disc pl-4 space-y-1 text-gray-500">
<li>고령 부모의 의료 결정 지원</li>
<li>원격 모니터링 및 관리</li>
<li>정보 공유 및 상담 동반</li>
</ul>
</div>
</div>
<!-- Key Characteristics -->
<div class="bg-white rounded-lg p-4 border border-gray-200 card-shadow">
<h4 class="font-bold text-gray-800 text-sm mb-2">공통 특성</h4>
<div class="grid grid-cols-2 gap-2 text-xs">
<div class="bg-purple-50 p-2 rounded text-purple-600 font-medium text-center">디지털 격차</div>
<div class="bg-orange-50 p-2 rounded text-orange-500 font-medium text-center">정보 접근성</div>
<div class="bg-green-50 p-2 rounded text-green-600 font-medium text-center">건강 관심도</div>
<div class="bg-blue-50 p-2 rounded text-blue-600 font-medium text-center">의료 신뢰</div>
</div>
</div>
</div>
</div>
<!-- Right: Persona Cards (60%) -->
<div class="w-3/5 flex flex-col">
<div class="mb-3">
<h3 class="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
<span class="w-8 h-8 rounded-lg bg-kt-red text-white flex items-center justify-center text-sm"><i class="fa-solid fa-user-circle"></i></span>
                    User Personas
                </h3>
<p class="text-sm text-gray-500 pl-10">대표 사용자 3인 프로필 및 니즈</p>
</div>
<div class="flex-1 grid grid-cols-3 gap-4">
<!-- Persona 1: 김00 -->
<div class="bg-white rounded-xl p-4 border border-gray-200 persona-card card-shadow flex flex-col">
<div class="flex items-center gap-3 mb-3">
<div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
<i class="fa-solid fa-user text-purple-600 text-xl"></i>
</div>
<div>
<h4 class="font-bold text-gray-800 text-sm">김00</h4>
<p class="text-xs text-gray-500">72세, 여성</p>
</div>
</div>
<div class="flex-1 flex flex-col gap-2">
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">상황</p>
<p class="text-[10px] text-gray-500 leading-tight">고혈압·당뇨 관리 중, 혼자 거주, 자녀는 타지역 거주</p>
</div>
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">Pain Point</p>
<ul class="text-[10px] text-gray-500 space-y-1">
<li>• 병원 가서 설명 들어도 이해 안 됨</li>
<li>• 집에 와서 다시 생각하면 모르겠음</li>
<li>• 자녀에게 물어보기 부담스러움</li>
</ul>
</div>
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">Need</p>
<ul class="text-[10px] text-gray-500 space-y-1">
<li>• 쉬운 말로 반복 설명</li>
<li>• 집에서 다시 확인 가능</li>
<li>• 음성으로 듣고 싶음</li>
</ul>
</div>
</div>
</div>
<!-- Persona 2: 박00 -->
<div class="bg-white rounded-xl p-4 border border-gray-200 persona-card card-shadow flex flex-col">
<div class="flex items-center gap-3 mb-3">
<div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
<i class="fa-solid fa-user text-orange-500 text-xl"></i>
</div>
<div>
<h4 class="font-bold text-gray-800 text-sm">박00</h4>
<p class="text-xs text-gray-500">68세, 남성</p>
</div>
</div>
<div class="flex-1 flex flex-col gap-2">
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">상황</p>
<p class="text-[10px] text-gray-500 leading-tight">관절 수술 예정, 배우자와 함께 거주, 스마트폰 사용 능숙</p>
</div>
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">Pain Point</p>
<ul class="text-[10px] text-gray-500 space-y-1">
<li>• 수술 전 설명이 너무 길고 복잡함</li>
<li>• 위험성 설명이 무서워서 듣기 싫음</li>
<li>• 서명만 하면 되는 줄 알았음</li>
</ul>
</div>
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">Need</p>
<ul class="text-[10px] text-gray-500 space-y-1">
<li>• 핵심만 간단히 설명</li>
<li>• 위험성도 이해하기 쉽게</li>
<li>• 배우자와 함께 확인</li>
</ul>
</div>
</div>
</div>
<!-- Persona 3: 이00 (보호자) -->
<div class="bg-white rounded-xl p-4 border border-gray-200 persona-card card-shadow flex flex-col">
<div class="flex items-center gap-3 mb-3">
<div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
<i class="fa-solid fa-user-tie text-green-600 text-xl"></i>
</div>
<div>
<h4 class="font-bold text-gray-800 text-sm">이00</h4>
<p class="text-xs text-gray-500">45세, 남성(보호자)</p>
</div>
</div>
<div class="flex-1 flex flex-col gap-2">
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">상황</p>
<p class="text-[10px] text-gray-500 leading-tight">부모(78세) 수술 동의서 작성 도와야 함, 직장인, 시간 부족</p>
</div>
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">Pain Point</p>
<ul class="text-[10px] text-gray-500 space-y-1">
<li>• 부모가 이해 못하는 것 같아 걱정</li>
<li>• 본인도 의학 용어 모름</li>
<li>• 병원 가는 시간 내기 어려움</li>
</ul>
</div>
<div>
<p class="text-xs font-semibold text-gray-600 mb-1">Need</p>
<ul class="text-[10px] text-gray-500 space-y-1">
<li>• 부모 이해도 확인 가능</li>
<li>• 원격으로 함께 상담</li>
<li>• 기록 남아서 나중에 확인</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

</body></html>`,
        6: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Slide 5: 유저플로우 및 주요기능</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: 'Noto Sans KR', sans-serif;
            overflow: hidden;
        }
        
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            transform: scale(0.95);
            transform-origin: center center;
        }

        /* KT Identity Colors */
        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .bg-kt-gray { background-color: #434343; }
        .text-kt-gray { color: #434343; }
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        .bg-mint-light { background-color: #E8F4F6; }
        
        /* Flow Colors */
        .bg-flow-step { background-color: #F8F9FA; }
        .border-flow-step { border-color: #E9ECEF; }
        .text-flow-num { color: #ADB5BD; }
        
        .step-active { 
            background-color: #E8F4F6; 
            border-color: #87CEEB;
        }
        .step-active .text-flow-num { color: #87CEEB; }

        .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        /* Connecting Arrows */
        .arrow-right {
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            color: #CFD8DC;
            z-index: 10;
        }
        
        .step-box {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .step-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        /* Feature Icons */
        .feature-icon-wrapper {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }
    </style>
<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.relative{position:relative}.z-10{z-index:10}.mb-0\.5{margin-bottom:0.125rem}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.ml-2{margin-left:0.5rem}.mr-1{margin-right:0.25rem}.mt-auto{margin-top:auto}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-20{height:5rem}.h-8{height:2rem}.h-full{height:100%}.w-10{width:2.5rem}.w-2{width:0.5rem}.w-8{width:2rem}.flex-1{flex:1 1 0%}.grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}.grid-cols-6{grid-template-columns:repeat(6, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:0.5rem}.gap-4{gap:1rem}.gap-5{gap:1.25rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.rounded{border-radius:0.25rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-l{border-left-width:1px}.border-t{border-top-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.border-gray-600{--tw-border-opacity:1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.bg-blue-100{--tw-bg-opacity:1;background-color:rgb(219 234 254 / var(--tw-bg-opacity, 1))}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255 / var(--tw-bg-opacity, 1))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.bg-gray-800{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity, 1))}.bg-orange-100{--tw-bg-opacity:1;background-color:rgb(255 237 213 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-purple-100{--tw-bg-opacity:1;background-color:rgb(243 232 255 / var(--tw-bg-opacity, 1))}.bg-purple-50{--tw-bg-opacity:1;background-color:rgb(250 245 255 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-12{padding-left:3rem;padding-right:3rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:0.25rem;padding-bottom:0.25rem}.pt-3{padding-top:0.75rem}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\[10px\]{font-size:10px}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-0.025em}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246 / var(--tw-text-opacity, 1))}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-orange-600{--tw-text-opacity:1;color:rgb(234 88 12 / var(--tw-text-opacity, 1))}.text-purple-500{--tw-text-opacity:1;color:rgb(168 85 247 / var(--tw-text-opacity, 1))}.text-purple-600{--tw-text-opacity:1;color:rgb(147 51 234 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.group:hover .group-hover\:bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235 / var(--tw-bg-opacity, 1))}.group:hover .group-hover\:bg-orange-600{--tw-bg-opacity:1;background-color:rgb(234 88 12 / var(--tw-bg-opacity, 1))}.group:hover .group-hover\:bg-purple-600{--tw-bg-opacity:1;background-color:rgb(147 51 234 / var(--tw-bg-opacity, 1))}.group:hover .group-hover\:text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}</style><style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.relative{position:relative}.z-10{z-index:10}.mb-0\.5{margin-bottom:0.125rem}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.ml-2{margin-left:0.5rem}.mr-1{margin-right:0.25rem}.mt-auto{margin-top:auto}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-20{height:5rem}.h-8{height:2rem}.h-full{height:100%}.w-10{width:2.5rem}.w-2{width:0.5rem}.w-8{width:2rem}.flex-1{flex:1 1 0%}.grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr))}.grid-cols-6{grid-template-columns:repeat(6, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:0.5rem}.gap-4{gap:1rem}.gap-5{gap:1.25rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.rounded{border-radius:0.25rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-l{border-left-width:1px}.border-t{border-top-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.border-gray-600{--tw-border-opacity:1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.bg-blue-100{--tw-bg-opacity:1;background-color:rgb(219 234 254 / var(--tw-bg-opacity, 1))}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255 / var(--tw-bg-opacity, 1))}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.bg-gray-800{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity, 1))}.bg-orange-100{--tw-bg-opacity:1;background-color:rgb(255 237 213 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-purple-100{--tw-bg-opacity:1;background-color:rgb(243 232 255 / var(--tw-bg-opacity, 1))}.bg-purple-50{--tw-bg-opacity:1;background-color:rgb(250 245 255 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-12{padding-left:3rem;padding-right:3rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:0.25rem;padding-bottom:0.25rem}.pt-3{padding-top:0.75rem}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\[10px\]{font-size:10px}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-0.025em}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246 / var(--tw-text-opacity, 1))}.text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-orange-600{--tw-text-opacity:1;color:rgb(234 88 12 / var(--tw-text-opacity, 1))}.text-purple-500{--tw-text-opacity:1;color:rgb(168 85 247 / var(--tw-text-opacity, 1))}.text-purple-600{--tw-text-opacity:1;color:rgb(147 51 234 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.group:hover .group-hover\:bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235 / var(--tw-bg-opacity, 1))}.group:hover .group-hover\:bg-orange-600{--tw-bg-opacity:1;background-color:rgb(234 88 12 / var(--tw-bg-opacity, 1))}.group:hover .group-hover\:bg-purple-600{--tw-bg-opacity:1;background-color:rgb(147 51 234 / var(--tw-bg-opacity, 1))}.group:hover .group-hover\:text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}</style></head>
<body style="">
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">5. 유저플로우 및 주요기능</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

</div>
</header>
<!-- Main Content -->
<div class="flex-1 flex flex-col p-12 bg-white gap-8">
<!-- Top Section: 6-Step User Flow -->
<div class="flex flex-col gap-4">
<div class="flex items-center gap-2 mb-2">
<span class="w-8 h-8 rounded-lg bg-mint text-white flex items-center justify-center text-sm"><i class="fa-solid fa-route"></i></span>
<h3 class="text-xl font-bold text-gray-800">Seamless User Journey</h3>
<span class="text-sm text-gray-500 ml-2">중단 없는 연속적 경험 (Seamless Flow)</span>
</div>
<div class="grid grid-cols-6 gap-6 relative">
<!-- Step 1 -->
<div class="step-box bg-white border-2 border-flow-step rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-flow-num font-black text-2xl mb-2">01</span>
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-600">
<i class="fa-solid fa-bell"></i>
</div>
<p class="font-bold text-gray-800 text-sm mb-1">진입 &amp; 인증</p>
<p class="text-xs text-gray-500">알림톡 링크<br>간편 본인확인</p>
<i class="fa-solid fa-chevron-right arrow-right"></i>
</div>
<!-- Step 2 -->
<div class="step-box bg-white border-2 border-flow-step rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-flow-num font-black text-2xl mb-2">02</span>
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-600">
<i class="fa-solid fa-clipboard-question"></i>
</div>
<p class="font-bold text-gray-800 text-sm mb-1">사전 문진</p>
<p class="text-xs text-gray-500">기저질환 체크<br><span class="text-kt-red font-bold">모드 자동 분기</span></p>
<i class="fa-solid fa-chevron-right arrow-right"></i>
</div>
<!-- Step 3 -->
<div class="step-box step-active border-2 rounded-xl p-4 flex flex-col items-center text-center shadow-md">
<span class="text-flow-num font-black text-2xl mb-2">03</span>
<div class="w-10 h-10 rounded-full bg-mint text-white flex items-center justify-center mb-3">
<i class="fa-solid fa-robot"></i>
</div>
<p class="font-bold text-gray-800 text-sm mb-1">AI 설명 시작</p>
<p class="text-xs text-gray-600">설명창 전환<br>맞춤형 UI 제공</p>
<i class="fa-solid fa-chevron-right arrow-right text-mint"></i>
</div>
<!-- Step 4 -->
<div class="step-box bg-white border-2 border-flow-step rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-flow-num font-black text-2xl mb-2">04</span>
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-600">
<i class="fa-solid fa-book-open"></i>
</div>
<p class="font-bold text-gray-800 text-sm mb-1">핵심 학습</p>
<p class="text-xs text-gray-500">수술법/합병증<br>영상 및 시각자료</p>
<i class="fa-solid fa-chevron-right arrow-right"></i>
</div>
<!-- Step 5 -->
<div class="step-box bg-white border-2 border-flow-step rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-flow-num font-black text-2xl mb-2">05</span>
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-600">
<i class="fa-solid fa-comments"></i>
</div>
<p class="font-bold text-gray-800 text-sm mb-1">Q&amp;A &amp; 체크</p>
<p class="text-xs text-gray-500">하이라이트 질문<br>이해도 확인</p>
<i class="fa-solid fa-chevron-right arrow-right"></i>
</div>
<!-- Step 6 -->
<div class="step-box bg-white border-2 border-flow-step rounded-xl p-4 flex flex-col items-center text-center">
<span class="text-flow-num font-black text-2xl mb-2">06</span>
<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-600">
<i class="fa-solid fa-file-signature"></i>
</div>
<p class="font-bold text-gray-800 text-sm mb-1">서명 &amp; 완료</p>
<p class="text-xs text-gray-500">전자서명법 준수<br>EMR 자동 전송</p>
</div>
</div>
</div>
<!-- Middle Section: Core Features Grid -->
<div class="flex-1 flex flex-col gap-4">
<div class="flex items-center gap-2 mb-2">
<span class="w-8 h-8 rounded-lg bg-kt-red text-white flex items-center justify-center text-sm"><i class="fa-solid fa-star"></i></span>
<h3 class="text-xl font-bold text-gray-800">Core Features</h3>
</div>
<div class="grid grid-cols-4 gap-5 h-full">
<!-- Feature 1: Easy Language -->
<div class="bg-gray-50 rounded-2xl p-6 flex flex-col border border-gray-100 hover:border-mint transition-colors group">
<div class="feature-icon-wrapper bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
<i class="fa-solid fa-language text-xl"></i>
</div>
<h4 class="font-bold text-gray-800 mb-2">쉬운 말 변환</h4>
<p class="text-xs text-gray-500 leading-relaxed mb-3">
                        복잡한 의학 용어를 환자 눈높이의 일상 언어로 자동 풀이<br>
                        (Ex. 복강경 → 배에 작은 구멍)
                    </p>
<div class="mt-auto pt-3 border-t border-gray-200">
<span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">LLM 기반</span>
</div>
</div>
<!-- Feature 2: Multi-modal -->
<div class="bg-gray-50 rounded-2xl p-6 flex flex-col border border-gray-100 hover:border-mint transition-colors group">
<div class="feature-icon-wrapper bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
<i class="fa-solid fa-photo-film text-xl"></i>
</div>
<h4 class="font-bold text-gray-800 mb-2">시각화 &amp; TTS</h4>
<p class="text-xs text-gray-500 leading-relaxed mb-3">
                        3D 해부도 및 영상 자료 연동. 
                        고령자를 위한 느린 음성(TTS)과 사투리 인식(STT) 지원
                    </p>
<div class="mt-auto pt-3 border-t border-gray-200">
<span class="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">멀티모달</span>
</div>
</div>
<!-- Feature 3: Highlight Q&A -->
<div class="bg-gray-50 rounded-2xl p-6 flex flex-col border border-gray-100 hover:border-mint transition-colors group">
<div class="feature-icon-wrapper bg-mint-light text-mint group-hover:bg-mint group-hover:text-white transition-colors">
<i class="fa-solid fa-highlighter text-xl"></i>
</div>
<h4 class="font-bold text-gray-800 mb-2">하이라이트 질문</h4>
<p class="text-xs text-gray-500 leading-relaxed mb-3">
                        모르는 문장을 드래그하면 즉시 설명. 
                        "이거요" 같은 지시어의 맥락을 파악해 답변
                    </p>
<div class="mt-auto pt-3 border-t border-gray-200">
<span class="text-[10px] font-bold text-mint bg-mint-light px-2 py-1 rounded">특허 출원</span>
</div>
</div>
<!-- Feature 4: Data & Legal -->
<div class="bg-gray-50 rounded-2xl p-6 flex flex-col border border-gray-100 hover:border-mint transition-colors group">
<div class="feature-icon-wrapper bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
<i class="fa-solid fa-scale-balanced text-xl"></i>
</div>
<h4 class="font-bold text-gray-800 mb-2">법적 데이터 관리</h4>
<p class="text-xs text-gray-500 leading-relaxed mb-3">
                        이해도 측정 결과, 질의응답 로그를 전자문서와 함께 저장하여 법적 효력 확보
                    </p>
<div class="mt-auto pt-3 border-t border-gray-200">
<span class="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded">리스크 관리</span>
</div>
</div>
</div>
</div>
<!-- Bottom Section: Continuity & Sync -->
<div class="bg-gray-800 rounded-xl p-5 flex items-center justify-between text-white" style="position: relative; transform: translate(2.141264px, -89.933086px);">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
<i class="fa-solid fa-arrows-rotate text-mint"></i>
</div>
<div>
<h4 class="font-bold text-sm mb-0.5">실시간 동기화 &amp; 이어하기 (Continuity)</h4>
<p class="text-xs text-gray-400">챗봇 ↔ 설명창 데이터 실시간 Sync, 이탈 시점부터 즉시 재개 가능</p>
</div>
</div>
<div class="flex gap-8 px-4 border-l border-gray-600">
<div class="text-center">
<p class="text-[10px] text-gray-400 mb-1">진행률 저장</p>
<p class="font-bold text-mint"><i class="fa-solid fa-check mr-1"></i><span style="font-size: 14px;">Auto Save</span></p>
</div>
<div class="text-center">
<p class="text-[10px] text-gray-400 mb-1">의료진 알림</p>
<p class="font-bold text-mint"><i class="fa-solid fa-check mr-1"></i><span style="font-size: 14px;">Real-time</span></p>
</div>
</div>
</div>
</div>
</div>

</body></html>`,
        7: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AS-IS vs TO-BE</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            transform-origin: center center;
        }

        /* Color definitions */
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        
        /* Main Layout */
        .main-content {
            flex: 1;
            display: flex;
            position: relative;
            background-color: #f8fafc;
        }

        /* Center Connector */
        .center-connector {
            position: absolute;
            left: 50%;
            top: 55%; /* Slightly adjusted to align with cards */
            transform: translate(-50%, -50%);
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 72px; /* Adjusted gap to match card spacing visually */
        }
        
        /* Arrow Circle Style - Modified as requested */
        .arrow-circle {
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #87CEEB; /* Sky Blue for consistency */
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #EFF6FF;
            z-index: 20;
        }

        /* Columns */
        .col-container {
            flex: 1;
            padding: 30px 50px 30px 50px; /* Adjusted padding */
            display: flex;
            flex-direction: column;
        }
        
        /* AS-IS Side (Left) */
        .col-left {
            background-color: #F9FAFB;
            border-right: 1px solid #E5E7EB;
            padding-right: 60px;
        }
        .asis-title {
            color: #6B7280;
            font-size: 2rem;
            font-weight: 900;
            margin-bottom: 4px;
        }
        .asis-subtitle {
            color: #9CA3AF;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* TO-BE Side (Right) */
        .col-right {
            background-color: #EFF6FF;
            padding-left: 60px;
        }
        .tobe-title {
            color: #87CEEB;
            font-size: 2rem;
            font-weight: 900;
            margin-bottom: 4px;
        }
        .tobe-subtitle {
            color: #87CEEB;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Cards Common */
        .process-card {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            position: relative;
            height: 96px; /* Fixed height for consistency */
        }

        /* AS-IS Cards (Paper Style) */
        .asis-card-inner {
            background: white;
            border: 1px solid #E5E7EB;
            border-left: 4px solid #9CA3AF;
            border-radius: 4px;
            padding: 16px;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: transform 0.2s;
        }
        .asis-card-inner:hover {
            transform: translateX(-4px);
        }
        .asis-icon {
            width: 48px;
            height: 48px;
            background: #F3F4F6;
            color: #6B7280;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border-radius: 4px;
            margin-right: 16px;
            flex-shrink: 0;
        }

        /* TO-BE Cards (Mobile App Style) */
        .tobe-card-inner {
            background: white;
            border-radius: 20px;
            padding: 16px;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            box-shadow: 0 10px 15px -3px rgba(135, 206, 235, 0.1), 0 4px 6px -2px rgba(135, 206, 235, 0.05);
            border: 1px solid #DBEAFE;
            position: relative;
            overflow: hidden;
            transition: transform 0.2s;
        }
        .tobe-card-inner:hover {
            transform: translateX(4px) scale(1.02);
            box-shadow: 0 20px 25px -5px rgba(135, 206, 235, 0.15), 0 10px 10px -5px rgba(135, 206, 235, 0.1);
            border-color: #87CEEB;
        }
        .tobe-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #87CEEB 0%, #87CEEB 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border-radius: 12px;
            margin-right: 16px;
            flex-shrink: 0;
            box-shadow: 0 4px 6px -1px rgba(135, 206, 235, 0.3);
        }
        
        /* Category Badge */
        .category-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 10px;
        }
        .cat-gray { background: #F3F4F6; color: #9CA3AF; }
        .cat-blue { background: #EFF6FF; color: #87CEEB; }

        /* Text Styles */
        .card-content h4 {
            font-size: 1.1rem;
            font-weight: 800;
            margin: 0 0 2px 0;
            line-height: 1.2;
        }
        .card-content p {
            font-size: 0.85rem;
            margin: 0;
            line-height: 1.4;
        }
        .asis-card-inner h4 { color: #374151; }
        .asis-card-inner p { color: #6B7280; }
        .tobe-card-inner h4 { color: #87CEEB; }
        .tobe-card-inner p { color: #4B5563; }

        .footer {
            padding: 0 40px 15px 40px;
            color: #9CA3AF;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: transparent;
            pointer-events: none;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">6. AS-IS vs TO-BE</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

<span>|</span>

</div>
</header>
<!-- Main Content -->
<main class="main-content">
<!-- Center Connector -->
<div class="center-connector">
<div class="arrow-circle"><i class="fas fa-chevron-right"></i></div>
<div class="arrow-circle"><i class="fas fa-chevron-right"></i></div>
<div class="arrow-circle"><i class="fas fa-chevron-right"></i></div>
<div class="arrow-circle"><i class="fas fa-chevron-right"></i></div>
</div>
<!-- Left Column: AS-IS (Analog/Paper Process) -->
<div class="col-container col-left">
<div>
<h2 class="asis-title">AS-IS</h2>
<div class="asis-subtitle">
<i class="fas fa-history"></i>
<span>현재 (서비스 도입 전)</span>
</div>
</div>
<!-- Items List -->
<div class="flex flex-col gap-2">
<!-- Item 1 -->
<div class="process-card">
<div class="asis-card-inner">
<div class="asis-icon"><i class="fas fa-user-md"></i></div>
<div class="card-content">
<h4>의료진이 직접 설명</h4>
<p>상당 시간 할애, 반복 업무</p>
</div>
<span class="category-badge cat-gray">Description</span>
</div>
</div>
<!-- Item 2 -->
<div class="process-card">
<div class="asis-card-inner">
<div class="asis-icon"><i class="fas fa-file-alt"></i></div>
<div class="card-content">
<h4>종이 동의서 기반</h4>
<p>일방향 설명, 형식적 동의</p>
</div>
<span class="category-badge cat-gray">Medium</span>
</div>
</div>
<!-- Item 3 -->
<div class="process-card">
<div class="asis-card-inner">
<div class="asis-icon"><i class="fas fa-question-circle"></i></div>
<div class="card-content">
<h4>이해도 파악 불가</h4>
<p>환자가 진짜 이해했는지 모름</p>
</div>
<span class="category-badge cat-gray">Insight</span>
</div>
</div>
<!-- Item 4 -->
<div class="process-card">
<div class="asis-card-inner">
<div class="asis-icon"><i class="fas fa-user-slash"></i></div>
<div class="card-content">
<h4>수술 후 관리 단절</h4>
<p>수술 동의서 작성 후 끝</p>
</div>
<span class="category-badge cat-gray">Care</span>
</div>
</div>
</div>
</div>
<!-- Right Column: TO-BE (Digital/App Process) -->
<div class="col-container col-right relative">
<div class="z-10">
<h2 class="tobe-title">TO-BE</h2>
<div class="tobe-subtitle">
<i class="fas fa-rocket"></i>
<span>서비스 도입 후 변화</span>
</div>
</div>
<!-- Items List -->
<div class="flex flex-col gap-2 z-10">
<!-- Item 1 -->
<div class="process-card">
<div class="tobe-card-inner">
<div class="tobe-icon"><i class="fas fa-robot"></i></div>
<div class="card-content">
<h4>AI 챗봇 기본 설명</h4>
<p>의료진은 핵심 보완만 집중</p>
</div>
<span class="category-badge cat-blue">Description</span>
<!-- App UI Decor -->
<div class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-400"></div>
</div>
</div>
<!-- Item 2 -->
<div class="process-card">
<div class="tobe-card-inner">
<div class="tobe-icon"><i class="fas fa-mobile-screen"></i></div>
<div class="card-content">
<h4>디지털 기반 쌍방향</h4>
<p>질의응답, 맞춤형 콘텐츠</p>
</div>
<span class="category-badge cat-blue">Medium</span>
</div>
</div>
<!-- Item 3 -->
<div class="process-card">
<div class="tobe-card-inner">
<div class="tobe-icon"><i class="fas fa-chart-line"></i></div>
<div class="card-content">
<h4>이해도 객관적 측정</h4>
<p>구간별 체크, 데이터화</p>
</div>
<span class="category-badge cat-blue">Insight</span>
<div class="absolute bottom-2 right-2 text-mint text-[10px]"><i class="fas fa-check-double"></i></div>
</div>
</div>
<!-- Item 4 -->
<div class="process-card">
<div class="tobe-card-inner">
<div class="tobe-icon"><i class="fas fa-heart-pulse"></i></div>
<div class="card-content">
<h4>통합 관리 확장</h4>
<p>수술 전후 리마인드 &amp; 케어</p>
</div>
<span class="category-badge cat-blue">Care</span>
</div>
</div>
</div>
</div>
</main>
<!-- Footer removed -->
</div>
</body>
</html>`,
        8: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Slide 2: Smart Consent 서비스 개요</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Noto Sans KR', sans-serif; 
            overflow: hidden; 
            background-color: #f0f0f0; 
        }
        .slide-container { 
            width: 1280px; 
            height: 720px; 
            background-color: #f8fafc; /* Very light slate background for clean medical look */
            position: relative; 
            display: flex; 
            flex-direction: column; 
            overflow: hidden; 
        }
        
        /* KT Identity Colors & Custom Palette */
        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        .bg-mint-light { background-color: #E0F7FA; }
        .border-mint { border-color: #87CEEB; }
        
        .bg-soft-blue { background-color: #E8F4F6; }
        
        /* Shadows */
        .card-shadow { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); }
        .inner-shadow { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }

        /* Custom Image Containers */
        .phone-frame {
            border: 8px solid #fff;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
            background: #fff;
        }

        .feature-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
        }

        .value-prop-item {
            position: relative;
            padding-left: 1.25rem;
        }
        .value-prop-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.4rem;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #87CEEB;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Header -->
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-200 bg-white z-20 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">7. AI 수술동의 시각화 자료</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

</div>
</header>
<!-- Main Content -->
<div class="flex-1 flex flex-col p-8 gap-6 overflow-hidden relative">
<!-- Background Decoration -->
<div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
<div class="absolute bottom-0 left-0 w-96 h-96 bg-mint-light rounded-tr-full -z-10 opacity-30"></div>
<!-- Top Section: 3 Main Features (Flex Row) -->
<div class="flex gap-6 h-[420px] items-stretch">
<!-- Feature 1: Main Screen -->
<div class="flex-1 bg-white rounded-2xl card-shadow p-5 flex flex-col items-center border border-gray-100 relative group transition-transform hover:-translate-y-1 duration-300">
<div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm z-10 whitespace-nowrap">
                        메인 화면
                    </div>
<div class="w-full flex-1 flex items-center justify-center mt-4 mb-2 bg-gray-50 rounded-xl inner-shadow p-2 overflow-hidden">
<img alt="메인 화면 - 의사 곰 캐릭터와 대화창" class="h-full object-contain rounded-lg shadow-sm" src="assets/images/메인화면.png"/>
</div>
<div class="text-center w-full mt-2">
<p class="text-gray-800 font-bold text-lg mb-1">친근한 캐릭터 인터페이스</p>
<p class="text-gray-500 text-xs">환자의 불안감을 낮추는<br/>친근한 캐릭터 활용</p>
</div>
</div>
<!-- Feature 2: Surgery Explanation -->
<div class="flex-1 bg-white rounded-2xl card-shadow p-5 flex flex-col items-center border border-gray-100 relative group transition-transform hover:-translate-y-1 duration-300">
<div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm z-10 whitespace-nowrap">
                        수술 설명 화면
                    </div>
<div class="w-full flex-1 flex items-center justify-center mt-4 mb-2 bg-gray-50 rounded-xl inner-shadow p-2 overflow-hidden">
<img alt="수술 설명 화면 - 담낭 제거 수술 일러스트" class="h-full object-contain rounded-lg shadow-sm" src="assets/images/설명.png"/>
</div>
<div class="text-center w-full mt-2">
<p class="text-gray-800 font-bold text-lg mb-1">단계별 시각적 설명</p>
<p class="text-gray-500 text-xs">직관적인 해부학적 이미지와<br/>눈높이 맞춤형 텍스트/음성 안내</p>
</div>
</div>
<!-- Feature 3: AI Customizing -->
<div class="flex-1 bg-white rounded-2xl card-shadow p-5 flex flex-col items-center border border-gray-100 relative group transition-transform hover:-translate-y-1 duration-300">
<div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm z-10 whitespace-nowrap">
                        병원별 AI 커스터마이징
                    </div>
<div class="w-full flex-1 flex items-center justify-center mt-4 mb-2 bg-gray-50 rounded-xl inner-shadow p-4 overflow-hidden">
<img alt="병원별 AI 커스터마이징 - 다양한 의료진 캐릭터" class="w-full object-contain drop-shadow-md transform group-hover:scale-105 transition-transform duration-500" src="assets/images/커스터.png"/>
</div>
<div class="text-center w-full mt-2">
<p class="text-gray-800 font-bold text-lg mb-1">맞춤형 페르소나</p>
<p class="text-gray-500 text-xs">병원 아이덴티티를 반영한<br/>다양한 의료진 캐릭터 및 톤앤매너 설정</p>
</div>
</div>
</div>
<!-- Bottom Section: Value Proposition -->
<div class="flex-1 bg-white rounded-2xl card-shadow p-4 flex gap-6 items-center border-l-4 border-mint">
<!-- Title Area -->
<div class="w-1/4 shrink-0 border-r border-gray-100 pr-4">
<h3 class="text-lg font-extrabold text-gray-800 mb-1.5">핵심 가치 제안</h3>
<p class="text-xs text-gray-500 leading-relaxed">
                    Smart Consent는<br/>
                    환자와 의료진 모두를 위한<br/>
<span class="text-mint font-bold">최적의 소통 경험</span>을 제공합니다.
                </p>
</div>
<!-- Values Grid -->
<div class="flex-1 grid grid-cols-3 gap-4">
<!-- Value 1 -->
<div class="flex flex-col items-center text-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
<div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2 text-lg shadow-sm">
<i class="fa-solid fa-face-smile"></i>
</div>
<h4 class="font-bold text-gray-800 mb-1.5 text-sm">환자: 쉬운 이해</h4>
<ul class="text-[10px] text-gray-500 text-left space-y-0.5 w-full pl-4">
<li class="value-prop-item">고령층 친화적 유니버설 디자인</li>
<li class="value-prop-item">눈높이 맞춤 설명으로 불안 해소</li>
</ul>
</div>
<!-- Value 2 -->
<div class="flex flex-col items-center text-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
<div class="w-10 h-10 bg-mint-light rounded-full flex items-center justify-center text-mint mb-2 text-lg shadow-sm">
<i class="fa-solid fa-clock-rotate-left"></i>
</div>
<h4 class="font-bold text-gray-800 mb-1.5 text-sm">의료진: 업무 효율화</h4>
<ul class="text-[10px] text-gray-500 text-left space-y-0.5 w-full pl-4">
<li class="value-prop-item">반복 설명 부담 획기적 경감</li>
<li class="value-prop-item">진료 외 시간 활용성 증대</li>
</ul>
</div>
<!-- Value 3 -->
<div class="flex flex-col items-center text-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
<div class="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-2 text-lg shadow-sm">
<i class="fa-solid fa-shield-halved"></i>
</div>
<h4 class="font-bold text-gray-800 mb-1.5 text-sm">병원: 브랜드 강화</h4>
<ul class="text-[10px] text-gray-500 text-left space-y-0.5 w-full pl-4">
<li class="value-prop-item">6단계 프로세스로 체계적 동의</li>
<li class="value-prop-item">스마트 병원 이미지 제고</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
</body>
</html>
`,
        9: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Slide 8: R&amp;R(AI/의료진 역할 영역)</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: 'Noto Sans KR', sans-serif;
            overflow: hidden;
        }
        
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .border-kt-red { border-color: #E60012; }
        
        .bg-kt-gray { background-color: #434343; }
        .text-kt-gray { color: #434343; }
        
        .bg-mint { background-color: #87CEEB; }
        .text-mint { color: #87CEEB; }
        .bg-mint-light { background-color: #E8F4F6; }
        .border-mint { border-color: #87CEEB; }

        .role-medical-bg { background-color: #F8F9FA; }
        .role-medical-accent { color: #2D3748; }
        .role-ai-bg { background-color: #F0FDFA; }
        .role-ai-accent { color: #87CEEB; }

        .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .center-connector {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .connector-circle {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background-color: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4px solid #E2E8F0;
            font-size: 24px;
            color: #718096;
            z-index: 21;
        }

        .flow-arrow-top {
            position: absolute;
            top: 15%;
            left: 50%;
            width: 120px;
            height: 40px;
            transform: translateX(-50%);
            z-index: 10;
        }

        .flow-arrow-bottom {
            position: absolute;
            bottom: 25%;
            left: 50%;
            width: 120px;
            height: 40px;
            transform: translateX(-50%);
            z-index: 10;
        }

        .role-card {
            transition: transform 0.3s ease;
        }
        .role-card:hover {
            transform: translateY(-5px);
        }
    </style>
<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.absolute{position:absolute}.relative{position:relative}.left-0{left:0px}.left-1\/2{left:50%}.right-0{right:0px}.top-1\/2{top:50%}.top-\[-20px\]{top:-20px}.z-10{z-index:10}.mb-2{margin-bottom:0.5rem}.mb-8{margin-bottom:2rem}.flex{display:flex}.h-16{height:4rem}.h-2{height:0.5rem}.h-20{height:5rem}.h-8{height:2rem}.h-px{height:1px}.w-1\/2{width:50%}.w-16{width:4rem}.w-2{width:0.5rem}.w-full{width:100%}.flex-1{flex:1 1 0%}.-translate-x-1\/2{--tw-translate-x:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\/2{--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-sm{border-radius:0.125rem}.rounded-xl{border-radius:0.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-l-4{border-left-width:4px}.border-r{border-right-width:1px}.border-r-4{border-right-width:4px}.border-t{border-top-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.border-gray-300{--tw-border-opacity:1;border-color:rgb(209 213 219 / var(--tw-border-opacity, 1))}.border-gray-600{--tw-border-opacity:1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.bg-gray-300{--tw-bg-opacity:1;background-color:rgb(209 213 219 / var(--tw-bg-opacity, 1))}.bg-gray-500{--tw-bg-opacity:1;background-color:rgb(107 114 128 / var(--tw-bg-opacity, 1))}.bg-gray-800{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-12{padding:3rem}.p-5{padding:1.25rem}.px-12{padding-left:3rem;padding-right:3rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.pl-20{padding-left:5rem}.pr-20{padding-right:5rem}.text-right{text-align:right}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\[10px\]{font-size:10px}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.uppercase{text-transform:uppercase}.leading-relaxed{line-height:1.625}.tracking-tight{letter-spacing:-0.025em}.tracking-widest{letter-spacing:0.1em}.text-gray-300{--tw-text-opacity:1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.text-yellow-400{--tw-text-opacity:1;color:rgb(250 204 21 / var(--tw-text-opacity, 1))}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}</style></head>
<body style="">
<div class="slide-container">
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">8. R&amp;R (AI/의료진 역할 영역)</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

<span>|</span>

</div>
</header>
<div class="flex-1 flex relative">
<div class="center-connector">
<div class="connector-circle">
<i class="fa-solid fa-handshake"></i>
</div>
</div>
<div class="w-1/2 bg-role-medical-bg p-12 pr-20 flex flex-col border-r border-gray-200 relative">
<div class="flex items-center gap-4 mb-8">
<div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-200">
<i class="fa-solid fa-user-doctor text-3xl text-gray-700"></i>
</div>
<div>
<h2 class="text-2xl font-black text-gray-800">Medical Staff</h2>
<p class="text-sm text-gray-500 font-medium">의료진 (Human Expert)</p>
</div>
</div>
<div class="flex flex-col gap-4 flex-1">
<div class="role-card bg-white p-5 rounded-xl border-l-4 border-gray-600 card-shadow">
<h3 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
<i class="fa-solid fa-gavel text-gray-500"></i>
                            법적/윤리적 최종 책임
                        </h3>
<p class="text-sm text-gray-600 leading-relaxed">
                            수술 동의에 대한 법적 효력을 보증하며, AI 설명 내용의 적절성을 최종적으로 확인하고 승인합니다.
                        </p>
</div>
<div class="role-card bg-white p-5 rounded-xl border-l-4 border-gray-600 card-shadow">
<h3 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
<i class="fa-solid fa-stethoscope text-gray-500"></i>
                            고위험/복잡 질문 응대
                        </h3>
<p class="text-sm text-gray-600 leading-relaxed">
                            환자 개별 상태에 따른 특이사항이나 AI가 답변하기 어려운 심층적/비정형 질문을 직접 해결합니다.
                        </p>
</div>
<div class="role-card bg-white p-5 rounded-xl border-l-4 border-gray-600 card-shadow">
<h3 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
<i class="fa-solid fa-heart-pulse text-gray-500"></i>
                            환자 상태 및 이해도 판단
                        </h3>
<p class="text-sm text-gray-600 leading-relaxed">
                            데이터상 이해도가 높더라도 실제 환자의 인지 능력과 심리 상태를 종합적으로 고려하여 동의를 받습니다.
                        </p>
</div>
</div>
</div>
<div class="w-1/2 bg-role-ai-bg p-12 pl-20 flex flex-col relative">
<div class="flex items-center justify-end gap-4 mb-8 text-right">
<div>
<h2 class="text-2xl font-black text-gray-800">AI Assistant</h2>
<p class="text-sm text-mint font-medium">인공지능 (Tech Support)</p>
</div>
<div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-mint">
<i class="fa-solid fa-microchip text-3xl text-mint"></i>
</div>
</div>
<div class="flex flex-col gap-4 flex-1">
<div class="role-card bg-white p-5 rounded-xl border-r-4 border-mint card-shadow text-right">
<h3 class="font-bold text-gray-800 mb-2 flex items-center justify-end gap-2">
                            표준화된 기본 설명
                            <i class="fa-solid fa-book-medical text-mint"></i>
</h3>
<p class="text-sm text-gray-600 leading-relaxed">
                            수술 방법, 합병증 등 필수 고지 항목을 누락 없이 정확하고 표준화된 방식으로 전달합니다.
                        </p>
</div>
<div class="role-card bg-white p-5 rounded-xl border-r-4 border-mint card-shadow text-right">
<h3 class="font-bold text-gray-800 mb-2 flex items-center justify-end gap-2">
                            무제한 반복 &amp; 맞춤 변환
                            <i class="fa-solid fa-rotate-right text-mint"></i>
</h3>
<p class="text-sm text-gray-600 leading-relaxed">
                            고령 환자를 위해 쉬운 말로 변환하고, 100번 질문해도 지치지 않고 친절하게 반복 설명합니다.
                        </p>
</div>
<div class="role-card bg-white p-5 rounded-xl border-r-4 border-mint card-shadow text-right">
<h3 class="font-bold text-gray-800 mb-2 flex items-center justify-end gap-2">
                            데이터 축적 &amp; 로그 관리
                            <i class="fa-solid fa-database text-mint"></i>
</h3>
<p class="text-sm text-gray-600 leading-relaxed">
                            모든 질의응답 과정과 이해도 측정 결과를 기록하여 법적 증빙을 위한 로그 데이터를 축적합니다.
                        </p>
</div>
</div>
</div>
</div>
<div class="bg-gray-800 text-white h-16 px-12 flex items-center justify-between z-10">
<div class="flex items-center gap-3">
<i class="fa-solid fa-triangle-exclamation text-yellow-400"></i>
<p class="text-xs font-medium text-gray-300">
<span class="text-white font-bold">책임의 경계:</span> 
                    AI는 설명을 보조하는 도구이며, 모든 의료 행위와 설명 의무의 최종 법적 책임은 의료진에게 있습니다.
                </p>
</div>
<div class="flex items-center gap-6">
<div class="flex items-center gap-2 text-xs text-gray-400">
<span class="w-2 h-2 rounded-full bg-gray-500"></span>
                    Human Judgment
                </div>
<div class="flex items-center gap-2 text-xs text-gray-400">
<span class="w-2 h-2 rounded-full bg-mint"></span>
                    AI Processing
                </div>
</div>
</div>
</div>

</body></html>`,
        10: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Slide 9: 기대효과 및 확장성</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: 'Noto Sans KR', sans-serif;
            overflow: hidden;
        }
        
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .bg-kt-red { background-color: #E60012; }
        .text-kt-red { color: #E60012; }
        .border-kt-red { border-color: #E60012; }
        
        .bg-mint { background-color: #87CEEB; }
        .bg-mint-dark { background-color: #008CA3; }
        .bg-mint-light { background-color: #E8F4F6; }
        .text-mint { color: #87CEEB; }
        .border-mint { border-color: #87CEEB; }

        .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .effect-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .effect-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        .roadmap-step {
            position: relative;
            flex: 1;
            padding: 16px;
            background-color: #F8F9FA;
            border-radius: 12px;
            border-left: 4px solid #E2E8F0;
            transition: all 0.3s ease;
        }

        .roadmap-step.active {
            background-color: #E8F4F6;
            border-left-color: #87CEEB;
        }

        .step-number {
            position: absolute;
            top: -15px;
            left: 20px;
            width: 32px;
            height: 32px;
            background-color: #434343;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            z-index: 10;
        }
        
        .roadmap-step.active .step-number {
            background-color: #87CEEB;
        }

        .arrow-connector {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #CBD5E0;
            font-size: 24px;
            padding: 0 10px;
        }

        .chart-container {
            position: relative;
            height: 140px;
            width: 100%;
        }

        .kpi-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-up { background-color: #E8F4F6; color: #87CEEB; }
        .badge-down { background-color: #FFF5F5; color: #E60012; }
    </style>
<style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.z-10{z-index:10}.mb-1{margin-bottom:0.25rem}.mb-2{margin-bottom:0.5rem}.mb-4{margin-bottom:1rem}.mr-1{margin-right:0.25rem}.mt-1{margin-top:0.25rem}.mt-2{margin-top:0.5rem}.mt-3{margin-top:0.75rem}.mt-4{margin-top:1rem}.flex{display:flex}.grid{display:grid}.h-16{height:4rem}.h-20{height:5rem}.h-8{height:2rem}.h-\[380px\]{height:380px}.h-full{height:100%}.w-1\/3{width:33.333333%}.w-16{width:4rem}.w-2{width:0.5rem}.w-2\/3{width:66.666667%}.w-8{width:2rem}.w-full{width:100%}.flex-1{flex:1 1 0%}.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr))}.grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr))}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.items-stretch{align-items:stretch}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}.gap-8{gap:2rem}.space-y-2 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem * var(--tw-space-y-reverse))}.overflow-hidden{overflow:hidden}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:0.5rem}.rounded-sm{border-radius:0.125rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity, 1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.bg-blue-50{--tw-bg-opacity:1;background-color:rgb(239 246 255 / var(--tw-bg-opacity, 1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.bg-orange-50{--tw-bg-opacity:1;background-color:rgb(255 247 237 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.bg-white\/60{background-color:rgb(255 255 255 / 0.6)}.p-12{padding:3rem}.p-3{padding:0.75rem}.p-6{padding:1.5rem}.px-12{padding-left:3rem;padding-right:3rem}.px-2{padding-left:0.5rem;padding-right:0.5rem}.pl-2{padding-left:0.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-\[10px\]{font-size:10px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.uppercase{text-transform:uppercase}.tracking-tight{letter-spacing:-0.025em}.text-blue-400{--tw-text-opacity:1;color:rgb(96 165 250 / var(--tw-text-opacity, 1))}.text-blue-500{--tw-text-opacity:1;color:rgb(59 130 246 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-orange-400{--tw-text-opacity:1;color:rgb(251 146 60 / var(--tw-text-opacity, 1))}.text-orange-500{--tw-text-opacity:1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}</style></head>
<body style="">
<div class="slide-container">
<header class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-10 shrink-0">
<div class="flex items-center gap-4">
<div class="bg-mint w-2 h-6 rounded-sm"></div>
<h1 class="text-2xl font-bold text-gray-800 tracking-tight">9. 기대효과 및 확장성</h1>
</div>
<div class="flex items-center gap-2 text-gray-400 text-sm font-medium">

<span>|</span>

</div>
</header>
<div class="flex-1 flex flex-col p-8 bg-white gap-4 overflow-hidden">
<div class="flex gap-4 h-[340px]">
<div class="w-2/3 flex flex-col gap-3">
<div class="flex items-center gap-2 mb-1">
<span class="w-8 h-8 rounded-lg bg-mint text-white flex items-center justify-center text-sm"><i class="fa-solid fa-bullseye"></i></span>
<h3 class="text-xl font-bold text-gray-800">이해관계자별 기대효과</h3>
</div>
<div class="flex-1 grid grid-cols-3 gap-3">
<div class="effect-card bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center card-shadow">
<div class="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-3 text-2xl">
<i class="fa-solid fa-hospital-user"></i>
</div>
<h4 class="font-bold text-gray-800 mb-1">환자 (Patient)</h4>
<p class="text-xs text-orange-500 font-bold mb-3">불안 해소 &amp; 이해 증진</p>
<ul class="text-sm text-gray-600 space-y-1 text-left w-full px-2">
<li class="flex items-start gap-2">
<i class="fa-solid fa-check text-orange-400 mt-1 text-xs"></i>
<span>눈높이 맞춤 설명으로 막연한 수술 공포감 해소</span>
</li>
<li class="flex items-start gap-2">
<i class="fa-solid fa-check text-orange-400 mt-1 text-xs"></i>
<span>언제든 다시 듣는 반복 학습으로 궁금증 완전 해결</span>
</li>
</ul>
</div>
<div class="effect-card bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center card-shadow">
<div class="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3 text-2xl">
<i class="fa-solid fa-user-doctor"></i>
</div>
<h4 class="font-bold text-gray-800 mb-1">의료진 (Staff)</h4>
<p class="text-xs text-blue-500 font-bold mb-3">업무 효율 &amp; 집중</p>
<ul class="text-sm text-gray-600 space-y-1 text-left w-full px-2">
<li class="flex items-start gap-2">
<i class="fa-solid fa-check text-blue-400 mt-1 text-xs"></i>
<span>단순 반복 설명 업무 감소로 진료 피로도 저하</span>
</li>
<li class="flex items-start gap-2">
<i class="fa-solid fa-check text-blue-400 mt-1 text-xs"></i>
<span>고위험 환자 및 고난이도 수술 준비에 시간 집중</span>
</li>
</ul>
</div>
<div class="effect-card bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center card-shadow">
<div class="w-14 h-14 rounded-full bg-mint-light flex items-center justify-center text-mint mb-3 text-2xl">
<i class="fa-solid fa-hospital"></i>
</div>
<h4 class="font-bold text-gray-800 mb-1">병원 (Hospital)</h4>
<p class="text-xs text-mint font-bold mb-3">리스크 관리 &amp; 브랜딩</p>
<ul class="text-sm text-gray-600 space-y-1 text-left w-full px-2">
<li class="flex items-start gap-2">
<i class="fa-solid fa-check text-mint mt-1 text-xs"></i>
<span>설명 의무 이행 데이터 확보로 법적 분쟁 예방</span>
</li>
<li class="flex items-start gap-2">
<i class="fa-solid fa-check text-mint mt-1 text-xs"></i>
<span>환자 중심의 스마트 병원 이미지 제고</span>
</li>
</ul>
</div>
</div>
</div>
<div class="w-1/3 flex flex-col gap-3">
<div class="flex items-center gap-2 mb-1">
<span class="w-8 h-8 rounded-lg bg-kt-red text-white flex items-center justify-center text-sm"><i class="fa-solid fa-chart-line"></i></span>
<h3 class="text-xl font-bold text-gray-800">주요 KPI 목표</h3>
</div>
<div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between h-full">
<div class="chart-container" style="height: 140px;">
<canvas id="kpiChart" width="344" height="140" style="display: block; box-sizing: border-box; height: 140px; width: 344.7px;"></canvas>
</div>
<div class="grid grid-cols-2 gap-2 mt-1">
<div class="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
<p class="text-[10px] text-gray-400 mb-0.5">설명 소요시간</p>
<div class="flex items-center justify-between">
<span class="font-black text-gray-800 text-base">15분</span>
<span class="kpi-badge badge-down"><i class="fa-solid fa-arrow-down mr-1"></i>70%</span>
</div>
</div>
<div class="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
<p class="text-[10px] text-gray-400 mb-0.5">환자 이해도</p>
<div class="flex items-center justify-between">
<span class="font-black text-gray-800 text-base">95점</span>
<span class="kpi-badge badge-up"><i class="fa-solid fa-arrow-up mr-1"></i>30%</span>
</div>
</div>
<div class="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
<p class="text-[10px] text-gray-400 mb-0.5">설명 부족 민원</p>
<div class="flex items-center justify-between">
<span class="font-black text-gray-800 text-base">0건</span>
<span class="kpi-badge badge-down"><i class="fa-solid fa-arrow-down mr-1"></i>99%</span>
</div>
</div>
<div class="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
<p class="text-[10px] text-gray-400 mb-0.5">수술 노쇼율</p>
<div class="flex items-center justify-between">
<span class="font-black text-gray-800 text-base">2%</span>
<span class="kpi-badge badge-down"><i class="fa-solid fa-arrow-down mr-1"></i>80%</span>
</div>
</div>
</div>
</div>
</div>
</div>
<div class="flex flex-col gap-3 mt-0">
<div class="flex items-center gap-2 mb-1">
<span class="w-8 h-8 rounded-lg bg-gray-700 text-white flex items-center justify-center text-sm"><i class="fa-solid fa-map-location-dot"></i></span>
<h3 class="text-xl font-bold text-gray-800">확장 로드맵 (Expansion Roadmap)</h3>
</div>
<div class="flex items-stretch gap-2">
<div class="roadmap-step active">
<div class="step-number">1</div>
<h4 class="font-bold text-gray-800 text-lg mb-1 pl-2">수술 전후 통합 케어</h4>
<div class="bg-white/60 rounded-lg p-2 text-sm text-gray-600">
<p class="mb-1"><span class="font-bold text-mint">●</span> 수술 전: 금식, 복약 중단 리마인드</p>
<p><span class="font-bold text-mint">●</span> 수술 후: 회복 가이드, 식단 관리 알림</p>
</div>
<p class="text-xs text-gray-400 mt-2 pl-2 font-bold uppercase">2026. 1Q ~ 2Q</p>
</div>
<div class="arrow-connector">
<i class="fa-solid fa-chevron-right"></i>
</div>
<div class="roadmap-step">
<div class="step-number">2</div>
<h4 class="font-bold text-gray-800 text-lg mb-1 pl-2">타 진료과 및 시술 확장</h4>
<div class="bg-white/60 rounded-lg p-2 text-sm text-gray-600">
<p class="mb-1"><span class="font-bold text-gray-400">●</span> 내시경, MRI 등 검사 동의서 적용</p>
<p><span class="font-bold text-gray-400">●</span> 만성질환 교육용 챗봇으로 확대</p>
</div>
<p class="text-xs text-gray-400 mt-2 pl-2 font-bold uppercase">2026. 3Q ~ 4Q</p>
</div>
<div class="arrow-connector">
<i class="fa-solid fa-chevron-right"></i>
</div>
<div class="roadmap-step">
<div class="step-number">3</div>
<h4 class="font-bold text-gray-800 text-lg mb-1 pl-2">PHR 기반 통합 플랫폼</h4>
<div class="bg-white/60 rounded-lg p-2 text-sm text-gray-600">
<p class="mb-1"><span class="font-bold text-gray-400">●</span> 환자 건강기록(PHR) 데이터 연동</p>
<p><span class="font-bold text-gray-400">●</span> 병원 예약, 결제, 보험 청구 원스톱</p>
</div>
<p class="text-xs text-gray-400 mt-2 pl-2 font-bold uppercase">2027 ~ Future</p>
</div>
</div>
</div>
</div>
</div>
<script>
        const ctx = document.getElementById('kpiChart').getContext('2d');
        const kpiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['소요시간(분)', '이해도(점)', '분쟁(건)'],
                datasets: [
                    {
                        label: 'Before (기존)',
                        data: [50, 65, 12],
                        backgroundColor: '#E2E8F0',
                        borderRadius: 4,
                        barPercentage: 0.6
                    },
                    {
                        label: 'After (도입 후)',
                        data: [15, 95, 1],
                        backgroundColor: ['#87CEEB', '#87CEEB', '#E60012'],
                        borderRadius: 4,
                        barPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 10,
                            font: { size: 10, family: 'Noto Sans KR' }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10, family: 'Noto Sans KR' } }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    </script>

</body></html>`
    };

    // 서비스2 파일 내용을 메인박스에 로드하는 함수
    function loadService2ContentToMainBox(mainBox, slideNumber) {
        console.log('loadService2ContentToMainBox 호출:', { mainBox: !!mainBox, slideNumber, hasContent: !!service2Contents[slideNumber] });
        try {
            if (!mainBox) {
                throw new Error('mainBox가 없습니다.');
            }
            
            // 이전 iframe 정보 제거
            const index = iframeScaleInfo.findIndex(info => info.container === mainBox);
            if (index !== -1) {
                iframeScaleInfo.splice(index, 1);
            }
            
            const html = service2Contents[slideNumber];
            if (!html) {
                throw new Error(`서비스2 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            // 모든 서비스2 슬라이드는 일반 스케일링 적용
            mainBox.classList.remove('service-main-no-scale');
            mainBox.classList.remove('service-main-white-bg');
            
            console.log('서비스2 콘텐츠 로드 중:', slideNumber);
            // slideNumber를 data 속성으로 저장
            mainBox.setAttribute("data-slide-number", slideNumber);
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "3");
            mainBox.classList.add("service-box");
            
            // 스케일 재계산 최적화 (여러 번 재시도)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
                if (iframeInfo) {
                    // 즉시 시도
                    recalculateIframeScale(iframeInfo);
                    // 짧은 지연 후 재시도 (레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 50);
                    // 더 긴 지연 후 재시도 (완전한 레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 200);
                }
            };
            
            // requestAnimationFrame으로 실행
            requestAnimationFrame(scheduleRecalculate);
            // 추가로 약간의 지연 후에도 실행
            setTimeout(scheduleRecalculate, 100);
        } catch (error) {
            console.error(`Failed to load service2 ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 서비스2 파일 내용 로드 함수 (슬라이드용)
    function loadService2Content(slideItem, slideNumber) {
        try {
            const html = service2Contents[slideNumber];
            if (!html) {
                throw new Error(`서비스2 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            // slideNumber를 data 속성으로 저장
            slideItem.setAttribute("data-slide-number", slideNumber);
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
            
            // 스케일 재계산
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(slideItem);
                if (iframeInfo) {
                    if (!recalculateIframeScale(iframeInfo)) {
                        setTimeout(() => {
                            recalculateIframeScale(iframeInfo);
                        }, 50);
                    }
                }
            };
            
            requestAnimationFrame(scheduleRecalculate);
        } catch (error) {
            console.error(`Failed to load service2 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략2 파일 내용을 메인박스에 로드하는 함수
    function loadStrategy2ContentToMainBox(mainBox, slideNumber) {
        // slideNumber를 문자열로 변환하여 키 접근
        const key = String(slideNumber);
        console.log('loadStrategy2ContentToMainBox 호출:', { mainBox: !!mainBox, slideNumber, key, hasContent: !!strategy2Contents[key], availableKeys: Object.keys(strategy2Contents) });
        try {
            if (!mainBox) {
                throw new Error('mainBox가 없습니다.');
            }
            
            // 이전 iframe 정보 제거
            const index = iframeScaleInfo.findIndex(info => info.container === mainBox);
            if (index !== -1) {
                iframeScaleInfo.splice(index, 1);
            }
            
            const html = strategy2Contents[key];
            if (!html) {
                console.error(`전략2 파일 ${slideNumber} (키: ${key})를 찾을 수 없습니다. 사용 가능한 키:`, Object.keys(strategy2Contents));
                throw new Error(`전략2 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log('전략2 콘텐츠 로드 중:', slideNumber);
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "5");
            mainBox.classList.remove("service-box");
            
            // 스케일 재계산 최적화 (여러 번 재시도)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
                if (iframeInfo) {
                    // 즉시 시도
                    recalculateIframeScale(iframeInfo);
                    // 짧은 지연 후 재시도 (레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 50);
                    // 더 긴 지연 후 재시도 (완전한 레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 200);
                }
            };
            
            // requestAnimationFrame으로 실행
            requestAnimationFrame(scheduleRecalculate);
            // 추가로 약간의 지연 후에도 실행
            setTimeout(scheduleRecalculate, 100);
        } catch (error) {
            console.error(`Failed to load strategy2 ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략2 파일 내용 로드 함수 (슬라이드용)
    function loadStrategy2Content(slideItem, slideNumber) {
        try {
            // slideNumber를 문자열로 변환하여 키 접근
            const key = String(slideNumber);
            const html = strategy2Contents[key];
            if (!html) {
                console.error(`전략2 파일 ${slideNumber} (키: ${key})를 찾을 수 없습니다. 사용 가능한 키:`, Object.keys(strategy2Contents));
                throw new Error(`전략2 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
        } catch (error) {
            console.error(`Failed to load strategy2 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략1 파일 내용을 메인박스에 로드하는 함수
    function loadStrategy1ContentToMainBox(mainBox, slideNumber) {
        console.log('loadStrategy1ContentToMainBox 호출:', { mainBox: !!mainBox, slideNumber, hasContent: !!strategy1Contents[slideNumber] });
        try {
            if (!mainBox) {
                throw new Error('mainBox가 없습니다.');
            }
            
            // 이전 iframe 정보 제거
            const index = iframeScaleInfo.findIndex(info => info.container === mainBox);
            if (index !== -1) {
                iframeScaleInfo.splice(index, 1);
            }
            
            const html = strategy1Contents[slideNumber];
            if (!html) {
                throw new Error(`전략1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log('전략1 콘텐츠 로드 중:', slideNumber);
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "1");
            mainBox.classList.remove("service-box");
            
            // 스케일 재계산 최적화 (여러 번 재시도)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
                if (iframeInfo) {
                    // 즉시 시도
                    recalculateIframeScale(iframeInfo);
                    // 짧은 지연 후 재시도 (레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 50);
                    // 더 긴 지연 후 재시도 (완전한 레이아웃 완료 대기)
                    setTimeout(() => {
                        recalculateIframeScale(iframeInfo);
                    }, 200);
                }
            };
            
            // requestAnimationFrame으로 실행
            requestAnimationFrame(scheduleRecalculate);
            // 추가로 약간의 지연 후에도 실행
            setTimeout(scheduleRecalculate, 100);
        } catch (error) {
            console.error(`Failed to load strategy1 ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략1 파일 내용 로드 함수 (슬라이드용)
    function loadStrategy1Content(slideItem, slideNumber) {
        try {
            const html = strategy1Contents[slideNumber];
            if (!html) {
                throw new Error(`전략1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
        } catch (error) {
            console.error(`Failed to load strategy1 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략1 박스 썸네일 로드 (전략1-1 이미지)
    const strategy1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="1"]');
    if (strategy1ThumbnailBox && typeof strategy1Contents !== 'undefined') {
        const html = strategy1Contents[1];
        if (html) {
            strategy1ThumbnailBox.innerHTML = '';
            loadContentToIframe(strategy1ThumbnailBox, html, false);
        }
    }

    // 서비스1 박스 썸네일 로드 (서비스1-1 이미지)
    const service1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="2"]');
    if (service1ThumbnailBox && typeof service1Contents !== 'undefined') {
        const html = service1Contents[1];
        if (html) {
            service1ThumbnailBox.innerHTML = '';
            loadContentToIframe(service1ThumbnailBox, html, false);
        }
    }

    // 서비스2 박스 썸네일 로드 (서비스2-1 이미지)
    const service2ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="3"]');
    if (service2ThumbnailBox && typeof service2Contents !== 'undefined') {
        const html = service2Contents[1];
        if (html) {
            service2ThumbnailBox.innerHTML = '';
            loadContentToIframe(service2ThumbnailBox, html, false);
        }
    }

    // 전략2 박스 썸네일 로드 (전략2-1 이미지)
    const strategy2ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="5"]');
    if (strategy2ThumbnailBox && typeof strategy2Contents !== 'undefined') {
        const html = strategy2Contents[1];
        if (html) {
            strategy2ThumbnailBox.innerHTML = '';
            loadContentToIframe(strategy2ThumbnailBox, html, false);
        }
    }

    // 넥스트1 박스 썸네일 로드 (넥스트1-1 이미지)
    const next1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="4"]');
    if (next1ThumbnailBox && typeof next1Contents !== 'undefined') {
        const html = next1Contents[1];
        if (html) {
            next1ThumbnailBox.innerHTML = '';
            next1ThumbnailBox.setAttribute('data-slide-number', '1');
            loadContentToIframe(next1ThumbnailBox, html, false);
        }
    }

    // 페이지 로드 시 URL 파라미터 확인하여 상태 복원
    const portfolioPage = window.location.pathname.split('/').pop() || 'index.html';
    if (portfolioPage === 'portfolio.html' || portfolioPage === 'portfolio') {
        const urlParams = new URLSearchParams(window.location.search);
        const boxParam = urlParams.get('box');
        const slideParam = urlParams.get('slide');
        
        if (boxParam && (boxParam === "1" || boxParam === "2" || boxParam === "3" || boxParam === "4" || boxParam === "5")) {
            const slideNumber = slideParam ? parseInt(slideParam) : 1;
            // 약간의 지연을 두어 DOM이 완전히 로드된 후 실행
            setTimeout(() => {
                expandBox(boxParam);
                if (slideNumber > 1) {
                    // 슬라이드 번호가 1보다 크면 해당 슬라이드로 이동
                    setTimeout(() => {
                        currentSlideNumber = slideNumber;
                        updateNavButtons();
                        updateURL(boxParam, slideNumber);
                        
                        if (boxParam === "1") {
                            loadStrategy1ContentToMainBox(expandedBox, slideNumber);
                        } else if (boxParam === "2") {
                            loadService1ContentToMainBox(expandedBox, slideNumber);
                        } else if (boxParam === "3") {
                            loadService2ContentToMainBox(expandedBox, slideNumber);
                        } else if (boxParam === "4") {
                            loadNext1ContentToMainBox(expandedBox, slideNumber);
                        } else if (boxParam === "5") {
                            loadStrategy2ContentToMainBox(expandedBox, slideNumber);
                        }
                    }, 100);
                }
            }, 100);
        }
    }

    // 필터링 및 박스 클릭 기능
    if (sidebarLinks.length > 0 && thumbnailBoxes.length > 0) {
        // 사이드바 링크 클릭 이벤트
        sidebarLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                // 확대 뷰가 열려있으면 닫기
                closeExpandedView();

                // 모든 링크에서 active 클래스 제거
                sidebarLinks.forEach(l => l.classList.remove("active"));
                // 클릭한 링크에 active 클래스 추가
                link.classList.add("active");

                const filter = link.getAttribute("data-filter");

                // 필터에 따라 해당 섹션 펼치기 기능
                if (typeof window.toggleSection === 'function') {
                    if (filter === "strategy") {
                        window.toggleSection("strategy", true);
                    } else if (filter === "service") {
                        window.toggleSection("service", true);
                    } else if (filter === "next") {
                        window.toggleSection("next", true);
                    } else if (filter === "all") {
                        // 전체 보기일 때는 모든 섹션 펼치기
                        window.toggleSection("strategy", true);
                        window.toggleSection("service", true);
                        window.toggleSection("next", true);
                    }
                }

                // 필터링 로직
                thumbnailBoxes.forEach(box => {
                    const boxNumber = box.getAttribute("data-box");

                    if (filter === "all") {
                        // 전체 보기: 모든 박스 표시
                        box.classList.remove("hidden");
                    } else if (filter === "strategy") {
                        // 전략 기획: 1번, 5번 표시
                        if (boxNumber === "1" || boxNumber === "5") {
                            box.classList.remove("hidden");
                        } else {
                            box.classList.add("hidden");
                        }
                    } else if (filter === "service") {
                        // 서비스 기획: 2번, 3번만 표시
                        if (boxNumber === "2" || boxNumber === "3") {
                            box.classList.remove("hidden");
                        } else {
                            box.classList.add("hidden");
                        }
                    } else if (filter === "next") {
                        // Next Step: 4번만 표시
                        if (boxNumber === "4") {
                            box.classList.remove("hidden");
                        } else {
                            box.classList.add("hidden");
                        }
                    }
                });
            });
        });

        // 박스 클릭 이벤트 - 모든 박스(1, 2, 3, 4, 5번)에 동일하게 적용
        thumbnailBoxes.forEach(box => {
            const boxNumber = box.getAttribute("data-box");
            console.log('박스 클릭 이벤트 등록:', boxNumber);
            box.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log('박스 클릭됨:', boxNumber);
                // 1번, 2번, 3번, 4번, 5번 모두 동일하게 확대 기능 적용
                if (boxNumber === "1" || boxNumber === "2" || boxNumber === "3" || boxNumber === "4" || boxNumber === "5") {
                    console.log('expandBox 호출 예정:', boxNumber);
                    expandBox(boxNumber);
                } else {
                    console.log('박스 번호가 처리 대상이 아님:', boxNumber);
                }
            });
        });
    }
});

