// 현재 구조에서는 페이지 이동이 앵커(#)가 아니라 html 파일 링크이기 때문에
// 별도의 스크롤 제어는 하지 않고, 추후 확장 시를 대비해 기본 구조만 남겨둡니다.

// 현재 구조에서는 페이지 이동이 앵커(#)가 아니라 html 파일 링크이기 때문에
// 별도의 스크롤 제어는 하지 않고, 추후 확장 시를 대비해 기본 구조만 남겨둡니다.

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
            const expandedView = document.getElementById("expandedView");
            const thumbnailGrid = document.getElementById("thumbnailGrid");
            if (expandedView && thumbnailGrid && !expandedView.classList.contains("hidden")) {
                expandedView.classList.add("hidden");
                thumbnailGrid.classList.remove("hidden");
                // 모든 박스 다시 표시
                const thumbnailBoxes = document.querySelectorAll('.test-thumbnail-box');
                thumbnailBoxes.forEach(box => {
                    box.classList.remove("hidden");
                });
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
    const sidebarLinks = document.querySelectorAll(".test-sidebar-link");
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
        // history에서 확대 뷰 상태가 있으면 제거
        if (window.history.state && window.history.state.expanded) {
            window.history.back();
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
        
        // 현재 페이지가 portfolio.html인 경우에만 history 상태 추가
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'portfolio.html' || currentPage === 'portfolio') {
            // 확대 뷰 상태를 history에 추가
            window.history.pushState({ expanded: true, boxNumber: boxNumber }, '', window.location.href);
        }
        
        // 화살표 버튼 위치 조정 (test-expanded-box의 중앙에 맞춤)
        const updateButtonPosition = () => {
            if (prevSlideBtn && nextSlideBtn && expandedBox) {
                const expandedBoxRect = expandedBox.getBoundingClientRect();
                const expandedViewRect = expandedView.getBoundingClientRect();
                const boxTop = expandedBoxRect.top - expandedViewRect.top;
                const boxLeft = expandedBoxRect.left - expandedViewRect.left;
                const boxCenter = boxTop + expandedBoxRect.height / 2;
                
                // 세로 위치 (중앙)
                prevSlideBtn.style.top = `${boxCenter}px`;
                nextSlideBtn.style.top = `${boxCenter}px`;
                prevSlideBtn.style.transform = 'translateY(-50%)';
                nextSlideBtn.style.transform = 'translateY(-50%)';
                
                // 가로 위치
                const boxRight = boxLeft + expandedBoxRect.width;
                const expandedViewWidth = expandedViewRect.width;
                const currentRightOffset = expandedViewWidth - boxRight;
                
                // 왼쪽 버튼: 박스 왼쪽에서 16px 왼쪽에 위치
                prevSlideBtn.style.left = `${boxLeft - 16}px`;
                
                // 오른쪽 버튼: 박스 오른쪽 경계선에서 현재 오프셋만큼 더 오른쪽으로 이동
                // right 값이 작을수록 더 오른쪽에 위치하므로, 현재 오프셋만큼 빼서 더 오른쪽으로 이동
                nextSlideBtn.style.right = `${-currentRightOffset}px`; // 현재 오프셋만큼 더 오른쪽으로 이동
            }
        };
        
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
        } else if (boxNumber === "2") {
            console.log('서비스 박스 처리');
            loadService1ContentToMainBox(expandedBox, 1);
        } else if (boxNumber === "5") {
            // 전략2 박스인 경우 전략2-1 내용을 메인박스에 표시
            console.log('전략2 박스 처리, strategy2Contents 존재 여부:', typeof strategy2Contents !== 'undefined');
            if (typeof strategy2Contents !== 'undefined') {
                console.log('strategy2Contents 키:', Object.keys(strategy2Contents));
            }
            loadStrategy2ContentToMainBox(expandedBox, 1);
        } else {
            // 다른 박스는 기존대로 클릭된 박스의 내용을 복사
            const clickedBox = document.querySelector(`.test-thumbnail-box[data-box="${boxNumber}"]`);
            if (clickedBox) {
                expandedBox.innerHTML = clickedBox.innerHTML;
                expandedBox.setAttribute("data-box", boxNumber);
                // 서비스 박스 클래스도 복사
                if (clickedBox.classList.contains("service-box")) {
                    expandedBox.classList.add("service-box");
                } else {
                    expandedBox.classList.remove("service-box");
                }
            }
        }

        // 현재 박스 번호와 슬라이드 번호 저장
        currentBoxNumber = boxNumber;
        currentSlideNumber = 1;
        maxSlideCount = boxNumber === "1" ? 8 : (boxNumber === "5" ? 10 : (boxNumber === "2" ? 8 : 5)); // 전략1은 8개, 전략2는 10개, 서비스는 8개, 나머지는 5개
        
        // 화살표 버튼 상태 업데이트
        updateNavButtons();
        
        // 슬라이드 리스트 생성 - 박스 번호에 따라 개수 다름
        slideList.innerHTML = "";
        for (let i = 1; i <= maxSlideCount; i++) {
            const slideItem = document.createElement("div");
            slideItem.className = "test-slide-item service-slide-item";
            // 네이밍: 서비스 박스는 "서비스1-1", "서비스1-2" 형식, 나머지는 "1-1", "1-2" 형식
            const slideName = boxNumber === "2" ? `서비스1-${i}` : `${boxNumber}-${i}`;
            slideItem.setAttribute("data-slide", slideName);
            slideItem.setAttribute("data-parent-box", boxNumber);
            slideItem.setAttribute("data-slide-number", i);
            
            // 박스 번호에 따라 다른 파일 내용 로드
            if (boxNumber === "1") {
                // 전략1 박스의 경우 전략1 파일 내용 로드
                loadStrategy1Content(slideItem, i);
            } else if (boxNumber === "2") {
                // 2번 박스의 경우 서비스 파일 내용 로드
                loadService1Content(slideItem, i);
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
                
                if (!expandedBox) {
                    console.error('expandedBox가 없습니다!');
                    return;
                }
                
                if (boxNumber === "1") {
                    // 전략1 박스인 경우 전략1 파일 내용 로드
                    console.log('전략1 콘텐츠 로드 시작:', slideNum);
                    loadStrategy1ContentToMainBox(expandedBox, slideNum);
                } else if (boxNumber === "2") {
                    // 2번 박스인 경우 서비스 파일 내용 로드
                    console.log('서비스1 콘텐츠 로드 시작:', slideNum);
                    loadService1ContentToMainBox(expandedBox, slideNum);
                } else if (boxNumber === "5") {
                    // 전략2 박스인 경우 전략2 파일 내용 로드
                    console.log('전략2 콘텐츠 로드 시작:', slideNum);
                    loadStrategy2ContentToMainBox(expandedBox, slideNum);
                } else {
                    // 나머지 박스는 추후 동일한 방식으로 구현 예정
                    console.log(`슬라이드 아이템 클릭: ${slideName}`);
                }
            });
            
            slideList.appendChild(slideItem);
        }
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
        
        if (currentBoxNumber === "1") {
            loadStrategy1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "2") {
            loadService1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "5") {
            loadStrategy2ContentToMainBox(expandedBox, currentSlideNumber);
        }
        
        // 스크롤 이동 제거 (사용자가 보고 있는 화면에서 스크롤이 이동하지 않도록)
    }
    
    // 이전 슬라이드로 이동
    function goToPrevSlide() {
        if (currentSlideNumber <= 1 || !currentBoxNumber) return;
        
        currentSlideNumber--;
        updateNavButtons();
        
        if (currentBoxNumber === "1") {
            loadStrategy1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "2") {
            loadService1ContentToMainBox(expandedBox, currentSlideNumber);
        } else if (currentBoxNumber === "5") {
            loadStrategy2ContentToMainBox(expandedBox, currentSlideNumber);
        }
        
        // 스크롤 이동 제거 (사용자가 보고 있는 화면에서 스크롤이 이동하지 않도록)
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
<title>프로젝트 개요</title>
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
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .text-point {
            color: #A4C639;
        }
        .bg-point {
            background-color: #A4C639;
        }
        .border-point {
            border-color: #A4C639;
        }
        /* Custom Blur Effect for Top Right Area */
        .blur-overlay {
            backdrop-filter: blur(10px);
            background: rgba(255,255,255,0.7); /* Fallback for no-gradient requirement */
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Left Content Area (50%) -->
<div class="w-1/2 h-full flex flex-col justify-center px-16 z-20 bg-white">
<!-- Project Duration & Label -->
<div class="flex items-center mb-6">
<span class="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-sm tracking-wider">PROJECT</span>
<span class="ml-3 text-gray-500 font-medium tracking-wide text-sm">2022 – 2025</span>
</div>
<!-- Project Title -->
<div class="mb-8">
<h1 class="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-2">
                    모바일 로보어드바이저<br/>
<span class="text-point">서비스 전환 기획</span>
</h1>
<div class="w-16 h-1.5 bg-point mt-6"></div>
</div>
<!-- One Line Summary -->
<div class="mb-10 bg-gray-50 p-6 border-l-4 border-point rounded-r-lg">
<p class="text-gray-700 text-lg font-medium leading-relaxed">
                    PC 설치형 로보어드바이저를<br/>
<span class="font-bold text-gray-900">모바일 기반 비대면 투자일임 서비스</span>로 전환
                </p>
</div>
<!-- Roles -->
<div>
<h3 class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">MY ROLE</h3>
<ul class="space-y-3">
<li class="flex items-center text-gray-700 text-lg">
<i class="fas fa-check text-point mr-3 text-sm"></i>
<span>서비스 기획</span>
</li>
<li class="flex items-center text-gray-700 text-lg">
<i class="fas fa-check text-point mr-3 text-sm"></i>
<span>유저 플로우 설계</span>
</li>
<li class="flex items-center text-gray-700 text-lg">
<i class="fas fa-check text-point mr-3 text-sm"></i>
<span>투자일임사 제휴 프로세스 기획</span>
</li>
</ul>
</div>
</div>
<!-- Right Image Area (50%) -->
<div class="w-1/2 h-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
<!-- Background Abstract Elements -->
<div class="absolute top-0 right-0 w-full h-full bg-gray-100">
<div class="absolute -right-20 -top-20 w-96 h-96 bg-gray-200 rounded-full opacity-50"></div>
<div class="absolute left-10 bottom-10 w-64 h-64 bg-gray-200 rounded-full opacity-50"></div>
</div>
<!-- Mockup Image Representation -->
<div class="relative z-10 w-3/5 shadow-2xl rounded-3xl overflow-hidden transform rotate-[-5deg] border-8 border-white bg-white" style="height: 80%;">
<img alt="Mobile App Interface" class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-500" src="https://page.gensparksite.com/slides_images/84b421ca933a98517acb4beff844afe3.webp"/>
<!-- Mockup Overlay to simulate app UI depth -->
<div class="absolute inset-0 bg-black bg-opacity-5 pointer-events-none"></div>
</div>
<!-- Top Blur Area for Logo masking effect -->
<div class="absolute top-0 left-0 w-full h-32 blur-overlay z-20 flex items-start justify-end p-8">
<!-- Optional: Abstract shapes or subtle text here if needed, kept clean as requested -->
</div>
<!-- Decorative Elements -->
<div class="absolute bottom-12 right-12 z-20">
<div class="flex space-x-2">
<div class="w-2 h-2 rounded-full bg-gray-300"></div>
<div class="w-2 h-2 rounded-full bg-gray-300"></div>
<div class="w-2 h-2 rounded-full bg-point"></div>
</div>
</div>
</div>
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
<title>전략기획자 커리어 스토리 - 표지</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #e5e5e5;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 80px 100px;
        }
        .top-deco-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 12px;
            background-color: #1f2937;
        }
        .content-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 10;
        }
        .tag-pill {
            display: inline-block;
            padding: 6px 14px;
            background-color: #f3f4f6;
            color: #374151;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 30px;
            border-radius: 4px;
            text-transform: uppercase;
            width: fit-content;
            border-left: none;
        }
        .title-section {
            margin-bottom: 50px;
        }
        .title-content {
            flex: 1;
        }
        .main-title {
            font-size: 50px;
            font-weight: 900;
            line-height: 1.25;
            color: #111827;
            margin-bottom: 24px;
            letter-spacing: -0.025em;
            word-break: keep-all;
        }
        .sub-title-section {
            display: flex;
            align-items: flex-start;
            gap: 60px;
        }
        .sub-title {
            font-size: 22px;
            font-weight: 400;
            color: #4b5563;
            line-height: 1.5;
            margin-bottom: 0;
            padding-left: 20px;
            border-left: none;
            flex: 1;
        }
        .info-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-width: 200px;
        }
        .right-section {
            display: flex;
            flex-direction: column;
            gap: 30px;
            min-width: 200px;
        }
        .info-item {
            display: flex;
            flex-direction: column;
        }
        .info-label {
            font-size: 11px;
            color: #9ca3af;
            font-weight: 700;
            margin-bottom: 6px;
            text-transform: uppercase;
        }
        .info-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
        }
        .info-grid {
            display: flex;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        /* Graph Section */
        .graph-section {
            width: 100%;
            background-color: #fafafa;
            padding: 20px 24px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
        }
        .graph-title {
            font-size: 12px;
            font-weight: 700;
            color: #374151;
            margin-bottom: 16px;
            display: block;
            border-bottom: 2px solid #1f2937;
            padding-bottom: 8px;
            width: fit-content;
        }
        .progress-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            gap: 12px;
        }
        .progress-row:last-child {
            margin-bottom: 0;
        }
        .progress-label {
            font-size: 9px;
            font-weight: 600;
            color: #4b5563;
            text-align: left;
            flex-shrink: 0;
            min-width: 100px;
            line-height: 1.3;
        }
        .progress-bar-bg {
            flex: 1;
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            min-width: 80px;
        }
        .progress-bar-fill {
            height: 100%;
            background-color: #4b5563;
            border-radius: 4px;
        }
        
        /* Background Decoration */
        .bg-pattern {
            position: absolute;
            right: 0;
            top: 0;
            width: 40%;
            height: 100%;
            background-color: #f9fafb;
            z-index: 0;
            clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
        }
    </style>
</head>
<body>
<div class="slide-container">
<div class="top-deco-line"></div>
<div class="bg-pattern"></div>
<div class="content-wrapper">
<div class="tag-pill">
                Project Overview
            </div>
<div class="title-section">
    <div class="title-content">
        <h1 class="main-title">
            위기 한복판에서 성장의 궤도를 만든<br/>
            초기 스타트업에서 전략적 전환
        </h1>
        <div class="sub-title-section">
            <p class="sub-title">
                생존을 목표로 외부 위기를 극복하고,<br/>
                법인 설립 자본금 100만 원에서 9억 원으로 성장시킨 전략적 판단
            </p>
            <div class="right-section">
                <div class="info-section">
                    <div class="info-item">
                        <span class="info-label">Period</span>
                        <span class="info-value">2020.06 ~</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Stage</span>
                        <span class="info-value">설립 1년차 / 구성원 4명</span>
                    </div>
                </div>
                <!-- 담당 업무 그래프 영역 -->
                <div class="graph-section">
<span class="graph-title">담당 업무 및 비중</span>
<div class="progress-row">
<span class="progress-label">전략 분석 &amp; 의사결정</span>
<div class="progress-bar-bg">
<div class="progress-bar-fill" style="width: 80%;"></div>
</div>
</div>
<div class="progress-row">
<span class="progress-label">중·장기 로드맵 설계</span>
<div class="progress-bar-bg">
<div class="progress-bar-fill" style="width: 80%;"></div>
</div>
</div>
<div class="progress-row">
<span class="progress-label">자금 운용</span>
<div class="progress-bar-bg">
<div class="progress-bar-fill" style="width: 90%;"></div>
</div>
</div>
<div class="progress-row">
<span class="progress-label">투자 유치 &amp; IR</span>
<div class="progress-bar-bg">
<div class="progress-bar-fill" style="width: 70%;"></div>
</div>
</div>
</div>
            </div>
        </div>
    </div>
</div>
</div>
</div>
</body>
</html>`,
        2: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 1. 배경과 문제 정의</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
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
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 32px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 60px 80px;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
        }
        .page-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
        }
        .page-title {
            font-size: 28px;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
        }
        .page-title i {
            color: #ef4444; /* Red for crisis context */
            margin-right: 16px;
            font-size: 24px;
        }
        
        /* Custom Layout for 3 Sections */
        .content-layout {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 24px;
        }
        
        .top-section {
            display: flex;
            gap: 24px;
            flex: 1;
        }

        .card {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border-left: none;
            display: flex;
            flex-direction: column;
        }

        .card-bg {
            flex: 1;
            border-left: none;
        }
        
        .card-crisis {
            flex: 1;
            border-left: none;
        }

        .card-diagram {
            height: 180px;
            border-left: none;
            justify-content: center;
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .card-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            font-size: 18px;
        }
        .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
        }
        
        /* Icon Colors */
        .icon-bg { background-color: transparent; color: #3b82f6; }
        .icon-crisis { background-color: transparent; color: #ef4444; }
        .icon-diagram { background-color: transparent; color: #f59e0b; }

        .card-content {
            color: #4b5563;
            font-size: 15px;
            line-height: 1.6;
            flex: 1;
        }
        .bullet-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .bullet-list li {
            position: relative;
            padding-left: 16px;
            margin-bottom: 10px;
        }
        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #9ca3af;
            font-weight: bold;
        }

        .highlight-text {
            font-weight: 600;
            color: #111827;
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* Flow Diagram Styling */
        .flow-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            width: 100%;
        }
        .flow-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            width: 180px;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .flow-item.highlight {
            border-color: #ef4444;
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
        }
        .flow-item.end {
            border-color: #ef4444;
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        
        .flow-icon {
            font-size: 24px;
            margin-bottom: 10px;
            color: #6b7280;
        }
        .highlight .flow-icon { color: #1e293b; }
        .end .flow-icon { color: #1e293b; }
        
        .flow-text {
            font-size: 14px;
            font-weight: 700;
            color: #374151;
            line-height: 1.3;
        }
        .highlight .flow-text { color: #1e293b; }
        .end .flow-text { color: #1e293b; }

        .flow-arrow {
            color: #9ca3af;
            font-size: 20px;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">배경과<br/>문제 정의</h1>
<div class="nav-group">
<div class="nav-item active">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Response</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Fundraising Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Results &amp; Impact</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-exclamation-triangle"></i>
                    설립 직후 직면한 통제 불가능한 외부 위기
                </h2>
</header>
<div class="content-layout">
<div class="top-section">
<!-- 1. 배경 (Background) -->
<div class="card card-bg">
<div class="card-header">
<div class="card-icon icon-bg"><i class="fas fa-history"></i></div>
<h3 class="card-title">배경 (Background)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<p>개인 PC 설치형 <strong>로보어드바이저 판매</strong>를 핵심 아이템으로 출발</p>
</li>
<li>
<p>'우리만의 매출로 성장'이라는 비교적 <strong>폐쇄적인 방향</strong>에서 출발</p>
</li>
<li>
<p>설립 직후 통제 불가능한 <span class="highlight-text">외부 위기 발생: 코로나19</span></p>
</li>
</ul>
</div>
</div>
<!-- 2. 초기 위기 인식 (Crisis Recognition) -->
<div class="card card-crisis">
<div class="card-header">
<div class="card-icon icon-crisis"><i class="fas fa-bolt"></i></div>
<h3 class="card-title">초기 위기 인식</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<p>법인의 진입 시장: <strong>금융 산업</strong> (국내 정책 및 글로벌 환경에 고도로 민감)</p>
</li>
<li>
<p>초기 스타트업 특성상 <strong>금융위기 = 즉각적인 재무 위기</strong> 가능성</p>
</li>
<li>
<p>업력이 짧은 금융 IT 기업에 대한 <strong>낮은 시장 신뢰</strong> 및 실적 가시화 장기 소요</p>
</li>
<li>
<p>팬데믹 지속 기간의 <strong>극심한 불확실성</strong></p>
</li>
</ul>
</div>
</div>
</div>
<!-- 3. 도식화 (Diagram) -->
<div class="card card-diagram">
<div class="card-header" style="margin-bottom: 10px;">
<div class="card-icon icon-diagram"><i class="fas fa-project-diagram"></i></div>
<h3 class="card-title">위기 전이 메커니즘</h3>
</div>
<div class="flow-container">
<div class="flow-item highlight">
<i class="fas fa-virus flow-icon"></i>
<span class="flow-text">코로나19<br/>팬데믹</span>
</div>
<i class="fas fa-chevron-right flow-arrow"></i>
<div class="flow-item">
<i class="fas fa-globe-americas flow-icon"></i>
<span class="flow-text">글로벌<br/>금융 충격</span>
</div>
<i class="fas fa-chevron-right flow-arrow"></i>
<div class="flow-item">
<i class="fas fa-landmark flow-icon"></i>
<span class="flow-text">금융 산업<br/>전반 위축</span>
</div>
<i class="fas fa-chevron-right flow-arrow"></i>
<div class="flow-item end">
<i class="fas fa-coins flow-icon"></i>
<span class="flow-text">초기 스타트업<br/>자금 리스크</span>
</div>
</div>
</div>
</div>
</main>
</div>`,
        3: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 1. 진짜 문제 인식</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
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
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 32px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 50px 70px;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
        }
        .page-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .page-title {
            font-size: 28px;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
        }
        .page-title i {
            color: #ef4444;
            margin-right: 16px;
            font-size: 24px;
        }

        /* Content Layout */
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 24px;
            flex: 1;
        }

        /* Top Section: Analysis & Chart */
        .top-section {
            display: flex;
            gap: 24px;
            height: 280px; /* Fixed height for consistency */
        }
        
        .analysis-box {
            flex: 1;
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: none;
            display: flex;
            flex-direction: column;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }
        .section-title i {
            margin-right: 10px;
            color: #4b5563;
        }

        .insight-list {
            list-style: none;
            padding: 0;
            margin: 0;
            margin-bottom: 1px;
        }
        .insight-list li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 10px;
            font-size: 15px;
            color: #374151;
            line-height: 1.5;
        }
        .insight-list li::before {
            content: "•";
            position: absolute;
            left: 4px;
            color: #1e293b;
            font-weight: bold;
        }
        
        .indicator-tags {
            margin-top: 1px;
            margin-bottom: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .indicator-tag {
            background-color: #f3f4f6;
            color: #4b5563;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid #e5e7eb;
        }

        .chart-box {
            flex: 1;
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
        }
        .chart-image-container {
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative;
            background-color: #f9fafb;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chart-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .chart-caption {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            margin-top: 10px;
        }

        /* Bottom Section: News Cards */
        .bottom-section {
            display: flex;
            gap: 24px;
            flex: 1;
        }
        
        .news-card {
            flex: 1;
            background-color: #fff;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
            padding: 24px;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: transform 0.2s;
        }
        .news-card::before {
            content: "";
            position: absolute;
            top: 24px;
            bottom: 24px;
            left: 0;
            width: 4px;
            background-color: transparent;
        }
        .news-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        }
        .news-card.alert::before { background-color: transparent; }
        .news-card.info::before { background-color: transparent; }

        .news-source {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            padding-left: 16px;
        }
        .news-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
            line-height: 1.4;
            padding-left: 16px;
            min-height: 50px; /* Align heights */
        }
        .news-body {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            padding-left: 16px;
            border-top: 1px solid #f3f4f6;
            padding-top: 12px;
            margin-top: auto;
        }
        
        /* Decorative Label */
        .news-label {
            position: absolute;
            top: -10px;
            right: 20px;
            background-color: #1f2937;
            color: white;
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 2px;
            text-transform: uppercase;
            font-weight: 700;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">배경과<br/>문제 정의</h1>
<div class="nav-group">
<div class="nav-item active">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Response</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Fundraising Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Results &amp; Impact</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-magnifying-glass-chart"></i>
<p>'진짜 문제'에 대한 심층적 인식과 판단 근거</p>
</h2>
</header>
<div class="content-wrapper">
<!-- Top Section -->
<div class="top-section">
<!-- Insight Box -->
<div class="analysis-box">
<div class="section-title">
<i class="fas fa-brain"></i>
<span>핵심 인식 (Key Insight)</span>
</div>
<ul class="insight-list">
<li>단순한 질병 이슈가 아닌 <strong>글로벌 금융 시스템 위기</strong>로 인식</li>
<li>각국의 무역·여행·산업 전반 <strong>동시다발적 봉쇄(Lockdown)</strong> 시작</li>
<li>2000년대 후반 <span class="text-red-600 font-bold">서브프라임 모기지 사태보다 심각한 국면</span>으로 판단</li>
</ul>
<div class="indicator-tags">
<span class="indicator-tag"><i class="fas fa-check mr-1"></i>시장 뉴스</span>
<span class="indicator-tag"><i class="fas fa-check mr-1"></i>규제/정책 변화</span>
<span class="indicator-tag"><i class="fas fa-check mr-1"></i>KOSPI/KOSDAQ</span>
<span class="indicator-tag text-red-600 border-red-200 bg-red-50"><i class="fas fa-chart-line mr-1"></i>시장 공포 지수 (VIX)</span>
</div>
</div>
<!-- Chart Box -->
<div class="chart-box">
<div class="section-title">
<i class="fas fa-chart-area"></i>
<span>참고 지표: 시장 변동성 지수 (VIX)</span>
</div>
<div class="chart-image-container">
<img alt="VIX Index Chart showing spike in 2020" class="chart-image" src="assets/images/vix지수.jpg"/>
</div>
<div class="chart-caption">
                        * 2020년 3월 팬데믹 선언 직후 역대 최고 수준 급등 (불확실성 극대화)
                    </div>
</div>
</div>
<!-- Bottom Section: News Cards -->
<div class="bottom-section">
<!-- News Card 1 -->
<div class="news-card alert">
<div class="news-label">Market Warning</div>
<div class="news-source">
<span>하나금융경영연구소</span>
<span>2020.02.16</span>
</div>
<h3 class="news-title">“코로나19 경제적 피해,<br/>사스(SARS) 충격 뛰어 넘을 것”</h3>
<div class="news-body">
<p>사태 장기화 시 제조업 전반 타격 불가피. 코로나19의 경제적 파급력은 과거 사스 충격보다 훨씬 강력할 가능성 제기됨.</p>
</div>
</div>
<!-- News Card 2 -->
<div class="news-card info">
<div class="news-label">Industry Impact</div>
<div class="news-source">
<span>디지털타임스</span>
<span>2020.06.21</span>
</div>
<h3 class="news-title">코로나19 팬데믹에 급속 위축…<br/>신산업 발굴·융합 시급해져</h3>
<div class="news-body">
<p>기업 영업이익률 급감 및 투자심리 급속 위축. 생산·수출 감소세 뚜렷하며 해외직접투자 규모 15.3% 감소 기록.</p>
</div>
</div>
</div>
</div>
</main>
</div>
</body>
</html>`,
        4: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 1. 나의 역할과 책임</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 30px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 12px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 14px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 40px 60px;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .page-header {
            margin-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 12px;
        }
        .page-title {
            font-size: 24px;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
            line-height: 1.3;
        }
        .page-title i {
            color: #3b82f6;
            margin-right: 12px;
            font-size: 20px;
        }
        
        /* Custom Layout for 3 Sections */
        .content-layout {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 16px;
            overflow: hidden;
        }
        
        .top-section {
            display: flex;
            gap: 20px;
            flex: 1;
            min-height: 0;
        }

        .card {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border-left: none;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .card-org {
            flex: 1;
            border-left: none;
        }
        
        .card-role {
            flex: 1.2;
            border-left: none;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
        }

        .card-diagram {
            height: 160px;
            border-left: none;
            justify-content: center;
            flex-shrink: 0;
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        .card-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 16px;
        }
        .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
        }
        
        /* Icon Colors */
        .icon-org { background-color: #f1f5f9; color: #64748b; }
        .icon-role { background-color: #dbeafe; color: #3b82f6; }
        .icon-diagram { background-color: #d1fae5; color: #10b981; }

        .card-content {
            color: #4b5563;
            font-size: 13px;
            line-height: 1.5;
            flex: 1;
            overflow: hidden;
        }
        
        /* Sub-list for roles */
        .role-group {
            margin-bottom: 12px;
        }
        .role-title {
            font-weight: 700;
            color: #374151;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            font-size: 13px;
        }
        .role-title i {
            margin-right: 6px;
            font-size: 12px;
            color: #9ca3af;
        }
        
        .bullet-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .bullet-list li {
            position: relative;
            padding-left: 14px;
            margin-bottom: 4px;
            font-size: 12px;
        }
        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #9ca3af;
            font-weight: bold;
        }

        /* Flow Diagram Styling */
        .flow-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            width: 100%;
            gap: 20px;
        }
        .flow-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            width: 150px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            background-color: #ffffff;
            z-index: 10;
        }
        .flow-item.hub {
            border-color: #3b82f6;
            background-color: #eff6ff;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
            transform: scale(1.05);
        }
        .flow-item.external {
            border-color: #e5e7eb;
            background-color: #f9fafb;
            border-style: dashed;
        }
        
        .flow-icon {
            font-size: 20px;
            margin-bottom: 8px;
            color: #6b7280;
        }
        .hub .flow-icon { color: #2563eb; }
        
        .flow-text {
            font-size: 12px;
            font-weight: 700;
            color: #374151;
            line-height: 1.3;
        }
        .hub .flow-text { color: #1e40af; }

        .flow-arrow-container {
            display: flex;
            align-items: center;
            color: #94a3b8;
            font-size: 14px;
            padding: 0 10px;
        }
        .flow-arrow-line {
            height: 2px;
            width: 40px;
            background-color: #cbd5e1;
            position: relative;
        }
        .flow-arrow-line::before, .flow-arrow-line::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-top: 2px solid #cbd5e1;
            border-right: 2px solid #cbd5e1;
            top: -3px;
        }
        .flow-arrow-line::before {
            left: 0;
            transform: rotate(-135deg);
        }
        .flow-arrow-line::after {
            right: 0;
            transform: rotate(45deg);
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">조직 구성과<br/>역할 정의</h1>
<div class="nav-group">
<div class="nav-item active">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Response</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Fundraising Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Results &amp; Impact</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-users-cog"></i>
                    위기 대응을 위한 전략적 커뮤니케이션 및 역할 재정립
                </h2>
</header>
<div class="content-layout">
<div class="top-section">
<!-- 1. 조직 구성 (Organization) -->
<div class="card card-org">
<div class="card-header">
<div class="card-icon icon-org"><i class="fas fa-sitemap"></i></div>
<h3 class="card-title">R&amp;R</h3>
</div>
<div class="card-content">
<div class="role-group">
<div class="role-title"><i class="fas fa-user-tie"></i> CEO</div>
<ul class="bullet-list">
<li><p>외부 사업체 제휴 및 협업 구조 설계</p></li>
<li><p>기존 산업 협력업체 네트워크 관리</p></li>
<li><p>대외 협력 전반 및 영업 총괄</p></li>
</ul>
</div>
<div class="role-group" style="margin-bottom: 0;">
<div class="role-title"><i class="fas fa-code"></i> 개발자</div>
<ul class="bullet-list">
<li><p>로보어드바이저 서비스 안정화</p></li>
<li><p>알고리즘 및 서비스 고도화 개발 집중</p></li>
</ul>
</div>
</div>
</div>
<!-- 2. 나의 역할 (My Role) -->
<div class="card card-role">
<div class="card-header">
<div class="card-icon icon-role"><i class="fas fa-chess-knight"></i></div>
<h3 class="card-title">나의 역할</h3>
</div>
<div class="card-content">
<div class="role-group">
<div class="role-title" style="color: #1e40af;"><i class="fas fa-bullseye" style="color: #3b82f6;"></i> 전략적 커뮤니케이션 허브</div>
<p style="font-size: 14px; margin-bottom: 12px; color: #4b5563;">내부 조직과 CEO 사이의 의사결정 조율 및 외부 연결</p>
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
<ul class="bullet-list">
<li><p>환경 분석 및 리스크 요인 정리</p></li>
<li><p>필요 제반 사항 도출·공유</p></li>
<li><p>보완 과제 정의 및 실행 관리</p></li>
</ul>
<ul class="bullet-list">
<li><p>외부 커뮤니케이션(IR) 동행</p></li>
<li><p>운영 자금 계획 및 운용</p></li>
<li><p>초기 핵심 고객 관리</p></li>
</ul>
</div>
</div>
</div>
</div>
<!-- 3. 도식화 (Communication Flow) -->
<div class="card card-diagram">
<div class="card-header" style="margin-bottom: 0; padding-bottom: 10px;">
<div class="card-icon icon-diagram"><i class="fas fa-project-diagram"></i></div>
<h3 class="card-title">커뮤니케이션 구조도</h3>
</div>
<div class="flow-container">
<!-- Internal -->
<div class="flow-item">
<i class="fas fa-laptop-code flow-icon"></i>
<span class="flow-text">내부 조직<br/>(개발/운영)</span>
</div>
<!-- Arrow -->
<div class="flow-arrow-container">
<div class="flow-arrow-line"></div>
</div>
<!-- Me (Hub) -->
<div class="flow-item hub">
<i class="fas fa-user-cog flow-icon"></i>
<span class="flow-text">전략기획 (나)<br/>Communication Hub</span>
</div>
<!-- Arrow -->
<div class="flow-arrow-container">
<div class="flow-arrow-line"></div>
</div>
<!-- CEO -->
<div class="flow-item">
<i class="fas fa-user-tie flow-icon"></i>
<span class="flow-text">CEO<br/>(의사결정)</span>
</div>
<!-- Arrow -->
<div class="flow-arrow-container">
<div class="flow-arrow-line"></div>
</div>
<!-- External -->
<div class="flow-item external">
<i class="fas fa-handshake flow-icon"></i>
<span class="flow-text">외부 이해관계자<br/>(투자자/제휴사)</span>
</div>
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
<title>Chapter 2. 전략 옵션과 선택</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            overflow: hidden;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 30px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 12px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 14px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 50px 70px;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .page-header {
            margin-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: end;
        }
        .page-title {
            font-size: 24px;
            font-weight: 800;
            color: #1e293b;
            display: flex;
            align-items: center;
        }
        .page-subtitle {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
        }

        /* Strategy Framework Layout */
        .framework-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            height: 100%;
            overflow: hidden;
        }

        /* 1. Top Strategy Box */
        .strategy-top {
            background-color: #1e40af;
            color: white;
            padding: 20px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.3);
            flex-shrink: 0;
        }
        .strategy-badge {
            background-color: rgba(255,255,255,0.2);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: inline-block;
        }
        .strategy-main-text {
            font-size: 22px;
            font-weight: 800;
        }
        .strategy-sub-text {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 4px;
            font-weight: 400;
        }

        /* 2. Middle Pillars (Options Comparison) */
        .pillars-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            flex: 1;
            min-height: 0;
        }
        .pillar-card {
            background-color: white;
            border-radius: 10px;
            padding: 18px;
            border-top: 4px solid #cbd5e1;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,0.06);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: visible;
        }
        /* Status Badges */
        .status-badge {
            position: absolute;
            top: 16px;
            right: 16px;
            font-size: 9px;
            font-weight: 700;
            padding: 3px 6px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        
        /* Option A: Dropped */
        .pillar-card.gray { 
            border-top-color: #94a3b8; 
            background-color: #f8fafc;
        }
        .pillar-card.gray .pillar-title { color: #64748b; }
        .pillar-card.gray .status-badge { background-color: #e2e8f0; color: #64748b; }
        .pillar-card.gray .pillar-icon { background-color: #e2e8f0; color: #64748b; }

        /* Option B: Pivot */
        .pillar-card.amber { 
            border-top-color: #f59e0b; 
        }
        .pillar-card.amber .status-badge { background-color: #fef3c7; color: #d97706; }
        .pillar-card.amber .pillar-icon { background-color: #fffbeb; color: #f59e0b; }

        /* Final Choice: Selected */
        .pillar-card.blue { 
            border-top-color: #2563eb; 
            border: 2px solid #2563eb;
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .pillar-card.blue .status-badge { background-color: #dbeafe; color: #1e40af; }
        .pillar-card.blue .pillar-icon { background-color: #eff6ff; color: #2563eb; }

        .pillar-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            font-size: 18px;
        }

        .pillar-title {
            font-size: 16px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 10px;
            padding-right: 60px;
        }
        
        .pillar-section-title {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            margin-top: 10px;
            margin-bottom: 4px;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
            display: block;
        }

        .pillar-content {
            font-size: 12px;
            color: #475569;
            line-height: 1.4;
        }
        .reason-text {
            font-size: 12px;
            line-height: 1.4;
            margin-top: 4px;
        }
        .pillar-card.gray .reason-text { color: #ef4444; font-weight: 500; }
        .pillar-card.amber .reason-text { color: #b45309; font-weight: 500; }
        .pillar-card.blue .reason-text { color: #2563eb; font-weight: 500; }

        /* 3. Bottom Foundation */
        .foundation-box {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 10px;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }
        .foundation-title-area {
            width: 200px;
            border-right: 2px solid #bae6fd;
            margin-right: 24px;
        }
        .foundation-title {
            font-size: 14px;
            font-weight: 800;
            color: #0369a1;
            display: block;
        }
        .foundation-subtitle {
            font-size: 10px;
            color: #0ea5e9;
            margin-top: 2px;
            display: block;
        }
        .foundation-content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
        }
        
        .result-item {
            display: flex;
            align-items: center;
            background-color: white;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #e0f2fe;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            flex: 1;
            margin: 0 4px;
        }
        .result-icon {
            width: 28px;
            height: 28px;
            background-color: #e0f2fe;
            color: #0284c7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin-right: 10px;
            flex-shrink: 0;
        }
        .result-text {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        .result-label {
            font-size: 9px;
            color: #64748b;
            font-weight: 600;
        }
        .result-value {
            font-size: 12px;
            color: #0f172a;
            font-weight: 700;
            white-space: nowrap;
            line-height: 1.3;
        }
        .arrow-next {
            color: #94a3b8;
            font-size: 12px;
            flex-shrink: 0;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">전략 옵션과<br/>최종 선택</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item active">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Choice</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Fundraising Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Results &amp; Impact</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-code-branch text-blue-600 mr-3"></i>
                생존과 성장을 위한 전략적 옵션 비교 및 결단
            </h2>
<span class="page-subtitle"></span>
</header>
<div class="framework-container">
<!-- 1. Top Strategy Box -->
<div class="strategy-top">
<div>
<span class="strategy-badge">Final Decision</span>
<div class="strategy-main-text">전환사채(CB) 발행을 통한 생존 자금 확보</div>
<div class="strategy-sub-text">아이템 중심 성장에서 '투자 유치 중심 생존'으로 전략 급선회</div>
</div>
<i class="fas fa-hand-holding-dollar text-4xl opacity-50"></i>
</div>
<!-- 2. Middle Pillars (Options) -->
<div class="pillars-grid">
<!-- Option 1: Dropped -->
<div class="pillar-card gray">
<div class="status-badge">Dropped</div>
<div class="pillar-icon">
<i class="fab fa-youtube"></i>
</div>
<h3 class="pillar-title">옵션 1: 유튜버 협업/투자 제안</h3>
<span class="pillar-section-title">주요 내용</span>
<p class="pillar-content">
                        주식 투자 방송 유튜버 제휴<br/>
                        프로그램 방송 송출 및 판매<br/>
                        투자 제안
                    </p>
<span class="pillar-section-title">배제 사유</span>
<p class="reason-text">
<i class="fas fa-times-circle mr-1"></i> 불완전판매 우려<br/>
<i class="fas fa-times-circle mr-1"></i> 아이템 소유권 이전 요구<br/>
<i class="fas fa-times-circle mr-1"></i> 장기적 자산 가치 상실 가능성
                    </p>
</div>
<!-- Option 2: Pivot -->
<div class="pillar-card amber">
<div class="status-badge">Pivoted</div>
<div class="pillar-icon">
<i class="fas fa-building-columns"></i>
</div>
<h3 class="pillar-title">옵션 2: 제도권 등록</h3>
<span class="pillar-section-title">주요 내용</span>
<p class="pillar-content">
                        금융당국 직접 라이선스 취득<br/>
                        독자적 금융 브랜드 구축
                    </p>
<span class="pillar-section-title">한계점 (Pivot 요인)</span>
<p class="reason-text">
<i class="fas fa-exclamation-triangle mr-1"></i> 자본시장법 요건 미충족<br/>
                        → 해당 옵션은 추후 제도권 금융사 제휴 전략으로 반영
                    </p>
</div>
<!-- Option 3: Selected -->
<div class="pillar-card blue">
<div class="status-badge">Selected</div>
<div class="pillar-icon">
<i class="fas fa-file-signature"></i>
</div>
<h3 class="pillar-title">최종: 투자 유치 (CB)</h3>
<span class="pillar-section-title">주요 내용</span>
<p class="pillar-content">
                        전환사채(CB) 발행<br/>
                        산업 진출 교두보 파트너십
                    </p>
<span class="pillar-section-title">선택 이유</span>
<p class="reason-text">
<i class="fas fa-check-circle mr-1"></i> 경영권 영향 없는 조건<br/>
<i class="fas fa-check-circle mr-1"></i> Runway 1년 이상 확보
                    </p>
</div>
</div>
<!-- 3. Bottom Foundation (Results) -->
<div class="foundation-box">
<div class="foundation-title-area">
<span class="foundation-title">전략적 결과</span>
<span class="foundation-subtitle">Strategic Outcome</span>
</div>
<div class="foundation-content">
<div class="result-item">
<div class="result-icon"><i class="fas fa-hourglass-half"></i></div>
<div class="result-text">
<span class="result-label">Runway</span>
<span class="result-value">1년 이상 확보</span>
</div>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="result-item">
<div class="result-icon"><i class="fas fa-arrow-up-right-dots"></i></div>
<div class="result-text">
<span class="result-label">Fundraising</span>
<span class="result-value">최초 3억 유치</span>
</div>
</div>
<i class="fas fa-chevron-right arrow-next"></i>
<div class="result-item">
<div class="result-icon"><i class="fas fa-sack-dollar"></i></div>
<div class="result-text">
<span class="result-label">Expansion</span>
<span class="result-value">동일 투자자 9억 증액</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</body>
</html>`,
        6: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 2. 분석 과정과 의사결정 기여</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
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
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 32px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 50px 70px;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
        }
        .page-header {
            margin-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: end;
        }
        .page-title {
            font-size: 26px;
            font-weight: 800;
            color: #1e293b;
            display: flex;
            align-items: center;
        }
        .page-subtitle {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
        }

        /* Content Layout */
        .content-body {
            display: flex;
            flex-direction: column;
            gap: 20px;
            flex: 1;
        }

        /* 1. Top Section: Analysis & News */
        .top-row {
            display: flex;
            gap: 20px;
            height: 240px;
        }
        
        /* Analysis Box */
        .analysis-container {
            flex: 1.2;
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }
        .box-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            font-weight: 700;
            color: #1e293b;
            font-size: 16px;
        }
        .box-header i {
            margin-right: 8px;
            color: #3b82f6;
        }
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            flex: 1;
        }
        .data-point {
            background-color: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            border-left: none;
        }
        .data-label {
            font-size: 12px;
            color: #64748b;
            display: block;
            margin-bottom: 4px;
            font-weight: 600;
        }
        .data-value {
            font-size: 14px;
            color: #0f172a;
            font-weight: 700;
            line-height: 1.4;
        }
        .insight-box {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            border: 1px solid #e5e7eb;
        }
        .insight-text {
            font-size: 13px;
            color: #1e293b;
            font-weight: 600;
            line-height: 1.5;
        }

        /* News Box */
        .news-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            height: 100%;
        }
        .news-card {
            background-color: white;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            position: relative;
            padding-left: 20px;
            min-height: 0;
        }
        .news-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 12px;
            bottom: 12px;
            width: 4px;
            background-color: transparent;
            border-radius: 0 4px 4px 0;
        }
        .news-card.highlight::before {
            background-color: transparent;
        }
        .news-title {
            font-size: 12px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 6px;
            line-height: 1.3;
        }
        .news-meta {
            font-size: 9px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
        }
        .news-snippet {
            font-size: 10px;
            color: #64748b;
            margin-top: 6px;
            line-height: 1.4;
        }

        /* 2. Middle Section: Pivot Banner */
        .pivot-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white; /* Changed to white for cleaner look */
            border-radius: 50px; /* Pill shape */
            padding: 10px 30px;
            border: 2px solid #e2e8f0;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        /* Background gradient effect */
        .pivot-banner::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            right: 0;
            background-color: transparent;
            z-index: 0;
        }
        
        .pivot-side {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        .pivot-side.right {
            justify-content: flex-end;
        }
        .pivot-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
        }
        .pivot-text {
            font-size: 16px;
            font-weight: 800;
            color: #475569;
        }
        .pivot-side.right .pivot-text {
            color: #1e293b;
        }
        .pivot-arrow {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            background-color: transparent;
            color: #1e293b;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            border: 2px solid #e5e7eb;
        }

        /* 3. Bottom Section: Flow & Contribution */
        .bottom-row {
            flex: 1;
            background-color: white;
            border-radius: 12px;
            padding: 20px 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
        }
        .flow-process {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
            padding-top: 8px;
        }
        /* Connecting Line */
        .flow-process::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 60px;
            right: 60px;
            height: 2px;
            background-color: #e2e8f0;
            z-index: 0;
        }
        
        .process-step {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 22%;
            text-align: center;
        }
        .step-icon {
            width: 44px;
            height: 44px;
            background-color: white;
            border: 2px solid #cbd5e1;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #64748b;
            margin-bottom: 8px;
            transition: all 0.3s;
        }
        .process-step:hover .step-icon {
            border-color: #e5e7eb;
            color: #1e293b;
            background-color: #ffffff;
            transform: translateY(-2px);
        }
        .process-step:last-child .step-icon {
            background-color: #ffffff;
            border-color: #e5e7eb;
            color: #1e293b;
        }
        
        .step-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 6px;
        }
        .step-desc {
            font-size: 12px;
            color: #64748b;
            line-height: 1.3;
            background-color: #f8fafc;
            padding: 6px 8px;
            border-radius: 6px;
            width: 100%;
        }
        .step-desc p {
            margin: 0;
            line-height: 1.3;
        }
        .step-desc p + p {
            margin-top: 4px;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">전략 옵션과<br/>최종 선택</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item active">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Choice</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Fundraising Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Results &amp; Impact</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-magnifying-glass-chart text-blue-600 mr-3"></i>
<p>데이터 기반 분석을 통한 과감한 전략적 피보팅</p>
</h2>
<span class="page-subtitle">Analysis &amp; Decision Making</span>
</header>
<div class="content-body">
<!-- 1. Top Section -->
<div class="top-row">
<!-- Analysis Box -->
<div class="analysis-container">
<div class="box-header">
<i class="fas fa-chart-pie"></i> 현황 분석 및 시장 기회 포착
                    </div>
<div class="analysis-grid">
<div class="data-point">
<span class="data-label">Runway / 재무</span>
<p class="data-value">대표자 가수금 의존<br/>유효 버티기 기간 산출 불가</p>
</div>
<div class="data-point">
<span class="data-label">매출 구조 / 한계</span>
<p class="data-value">단일 프로그램 판매<br/>평균 객단가 약 100만 원</p>
</div>
</div>
<div class="insight-box">
<p class="insight-text">
<i class="fas fa-lightbulb mr-2"></i><strong>Key Insight:</strong> 
                            시장 변동성 확대 속에서 '안정적 수익률'을 입증한 로보어드바이저의 투자가치 확인 (예적금 대비 우월)
                        </p>
</div>
</div>
<!-- News Box -->
<div class="news-container">
<div class="news-card highlight">
<h3 class="news-title">4대 은행 로보어드바이저 수익률,<br/>예적금보다 3배 높다</h3>
<div class="news-snippet">
<p>은행권 RA 펀드 평균 수익률 2.92% (vs 수신금리 0.81%). 불확실성 시대의 투자 대안 부상.</p>
</div>
<div class="news-meta mt-2">
<span>이코노믹리뷰</span>
<span>2020.10.21</span>
</div>
</div>
<div class="news-card">
<h3 class="news-title">대신증권, 장기투자?<br/>低보수 로보어드바이저가 답</h3>
<div class="news-snippet">
<p>총보수율 0.137%의 저렴한 비용 구조. 성과보수 체계로 장기 투자 수단으로서 효용성 검증.</p>
</div>
<div class="news-meta mt-2">
<span>대신증권 보도자료</span>
<span>2019.07.25</span>
</div>
</div>
</div>
</div>
<!-- 2. Pivot Banner -->
<div class="pivot-banner">
<div class="pivot-side">
<span class="pivot-label">Before</span>
<span class="pivot-text">아이템 중심 성장 전략</span>
</div>
<div class="pivot-arrow">
<i class="fas fa-arrow-right"></i>
</div>
<div class="pivot-side right">
<span class="pivot-text">투자 유치 중심 생존 전략</span>
<span class="pivot-label">After</span>
</div>
</div>
<!-- 3. Bottom Section: Decision Flow -->
<div class="bottom-row">
<div class="box-header" style="margin-bottom: 20px;">
<i class="fas fa-project-diagram"></i> 의사결정 프로세스 및 기여
                </div>
<div class="flow-process">
<!-- Step 1 -->
<div class="process-step">
<div class="step-icon"><i class="fas fa-search-dollar"></i></div>
<h4 class="step-title">분석 (Analysis)</h4>
<div class="step-desc">
<p>Runway 정밀 진단</p>
<p>시장 수익률 비교</p>
</div>
</div>
<!-- Step 2 -->
<div class="process-step">
<div class="step-icon"><i class="fas fa-comments-dollar"></i></div>
<h4 class="step-title">제안 (Proposal)</h4>
<div class="step-desc">
<p>전략 방향 직접 제안</p>
<p>재무/시장 근거 제시</p>
</div>
</div>
<!-- Step 3 -->
<div class="process-step">
<div class="step-icon"><i class="fas fa-map"></i></div>
<h4 class="step-title">설계 (Design)</h4>
<div class="step-desc">
<p>실행 로드맵 설계</p>
<p>투트랙(Two-Track) 구조</p>
</div>
</div>
<!-- Step 4 -->
<div class="process-step">
<div class="step-icon"><i class="fas fa-handshake"></i></div>
<h4 class="step-title">실행 (Action)</h4>
<div class="step-desc">
<p>외부 커뮤니케이션</p>
<p>가치 평가 및 협상</p>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</body>
</html></html>`,
        7: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 3. 실행, 협업, 그리고 결과</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
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
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 32px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 30px 50px;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
        }
        .page-header {
            margin-bottom: 18px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: end;
        }
        .page-title {
            font-size: 22px;
            font-weight: 800;
            color: #1e293b;
            display: flex;
            align-items: center;
        }
        .page-subtitle {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
        }

        /* 2x2 Grid Layout */
        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 18px;
            flex: 1;
        }

        /* Card Styles */
        .result-card {
            background-color: white;
            border-radius: 12px;
            padding: 18px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f1f5f9;
        }
        .card-icon {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-size: 14px;
        }
        .card-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
        }

        /* 1. Quantitative Results */
        .icon-growth { background-color: #eff6ff; color: #3b82f6; }
        .stat-row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 12px;
        }
        .stat-value {
            font-size: 36px;
            font-weight: 900;
            color: #1e293b;
            line-height: 1;
            margin-right: 6px;
        }
        .stat-unit {
            font-size: 15px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .growth-badge {
            background-color: transparent;
            color: #1e293b;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            margin-left: auto;
            margin-bottom: 6px;
        }
        .sub-stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: auto;
        }
        .sub-stat-box {
            background-color: #f8fafc;
            padding: 10px;
            border-radius: 8px;
        }
        .sub-stat-label { font-size: 11px; color: #64748b; display: block; margin-bottom: 3px; }
        .sub-stat-text { font-size: 13px; font-weight: 700; color: #334155; display: block; line-height: 1.3; }

        /* 2. Execution Design */
        .icon-design { background-color: transparent; color: #9333ea; }
        .design-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: 100%;
        }
        .design-item {
            display: flex;
            align-items: center;
            background-color: #f3f4f6;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            color: #4b5563;
        }
        .design-icon-small {
            color: #9333ea;
            margin-right: 10px;
            width: 18px;
            text-align: center;
        }

        /* 3. Collaboration */
        .icon-collab { background-color: transparent; color: #16a34a; }
        .collab-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .collab-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        .collab-check {
            color: #16a34a;
            margin-right: 8px;
            margin-top: 3px;
            font-size: 12px;
        }
        .collab-text strong {
            color: #334155;
            font-weight: 700;
            display: block;
            font-size: 13px;
            margin-bottom: 2px;
        }
        .collab-text p {
            color: #64748b;
            font-size: 12px;
            margin: 0;
            line-height: 1.4;
        }
        .quote-box {
            margin-top: auto;
            background-color: #ffffff;
            border-left: none;
            padding: 8px;
            font-size: 12px;
            font-style: italic;
            color: #1e293b;
            font-weight: 600;
        }

        /* 4. Qualitative Results */
        .icon-qualitative { background-color: transparent; color: #ea580c; }
        .qual-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            height: 100%;
        }
        .qual-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 12px 6px;
            border: 1px solid #e5e7eb;
        }
        .qual-icon {
            font-size: 18px;
            color: #1e293b;
            margin-bottom: 6px;
        }
        .qual-title {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 3px;
        }
        .qual-desc {
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Chapter 3</div>
<h1 class="chapter-title">실행, 협업,<br/>그리고 결과</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Response</span>
</div>
<div class="nav-item active">
<span class="nav-number">03</span>
<span class="nav-text">Execution &amp; Results</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Reflection</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-flag-checkered text-blue-600 mr-3"></i>
                전략적 실행을 통한 투자 유치 및 성장 기반 확보
            </h2>
<span class="page-subtitle">Execution, Collaboration &amp; Outcomes</span>
</header>
<div class="content-grid">
<!-- 1. Quantitative Results -->
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-growth"><i class="fas fa-coins"></i></div>
<h3 class="card-title">정량적 성과 (Quantitative)</h3>
</div>
<div class="stat-row">
<span class="stat-value">17억</span>
<span class="stat-unit">원</span>
<div class="growth-badge">총 투자 유치</div>
</div>
<div class="sub-stat-grid">
<div class="sub-stat-box">
<span class="sub-stat-label">단계별 유치 금액</span>
<span class="sub-stat-text text-blue-700">3억 / 9억 / 5억</span>
</div>
<div class="sub-stat-box">
<span class="sub-stat-label">자본금 변화</span>
<span class="sub-stat-text text-blue-700">100만 원 → 9억 원</span>
</div>
</div>
</div>
<!-- 2. Execution Design -->
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-design"><i class="fas fa-compass-drafting"></i></div>
<h3 class="card-title">실행 설계 (Execution Design)</h3>
</div>
<div class="design-list">
<div class="design-item">
<i class="fas fa-landmark design-icon-small"></i>
<span>금융 정책 환경과 연계한 산업 성장성 강조</span>
</div>
<div class="design-item">
<i class="fas fa-file-powerpoint design-icon-small"></i>
<span>법인 설립 전 테스트 결과 중심 IR 자료 구성</span>
</div>
<div class="design-item">
<i class="fas fa-users-gear design-icon-small"></i>
<span>내부 조직 역량 점검 및 보완 계획 수립</span>
</div>
<div class="design-item">
<i class="fas fa-user-tie design-icon-small"></i>
<span>CEO 중심 대외 투자 유치 활동 전개</span>
</div>
</div>
</div>
<!-- 3. Collaboration -->
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-collab"><i class="fas fa-handshake"></i></div>
<h3 class="card-title">협업과 커뮤니케이션</h3>
</div>
<ul class="collab-list">
<li class="collab-item">
<i class="fas fa-check-circle collab-check"></i>
<div class="collab-text">
<strong>지분 희석 우려 해소</strong>
<p>생존과 지분 희석 간의 균형 문제 제기 및 조율</p>
</div>
</li>
<li class="collab-item">
<i class="fas fa-check-circle collab-check"></i>
<div class="collab-text">
<strong>내부 합의 도출</strong>
<p>경영진 및 주주 설득을 통한 만장일치 투자 유치</p>
</div>
</li>
<li class="collab-item">
<i class="fas fa-check-circle collab-check"></i>
<div class="collab-text">
<strong>실사(DD) 대응</strong>
<p>투자자 커뮤니케이션 및 실사 자료 완벽 대응</p>
</div>
</li>
</ul>
<div class="quote-box">
                    “생존 없이는 나눌 파이도 없다.”
                </div>
</div>
<!-- 4. Qualitative Results -->
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-qualitative"><i class="fas fa-star"></i></div>
<h3 class="card-title">정성적 성과 (Qualitative)</h3>
</div>
<div class="qual-grid">
<div class="qual-item">
<i class="fas fa-bullseye qual-icon"></i>
<span class="qual-title">전략 가치 입증</span>
<span class="qual-desc">전략기획 필요성 확인</span>
</div>
<div class="qual-item">
<i class="fas fa-user-shield qual-icon"></i>
<span class="qual-title">내부 신뢰 확보</span>
<span class="qual-desc">의사결정 프로세스 정착</span>
</div>
<div class="qual-item">
<i class="fas fa-network-wired qual-icon"></i>
<span class="qual-title">조직 성장</span>
<span class="qual-desc">4명 → 약 40명 규모</span>
</div>
<div class="qual-item">
<i class="fas fa-eye qual-icon"></i>
<span class="qual-title">시각 확장</span>
<span class="qual-desc">외부 관점 반영 구조화</span>
</div>
</div>
</div>
</div>
</main>
</div>
</body>
</html></html>`,
        8: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 4. 회고와 학습</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
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
        }
        /* Left Sidebar */
        .sidebar {
            width: 280px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #9ca3af;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 32px;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 40px;
            color: #ffffff;
        }
        .nav-item {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
            color: #60a5fa;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            padding: 50px 70px;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
        }
        .page-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: end;
        }
        .page-title {
            font-size: 26px;
            font-weight: 800;
            color: #1e293b;
            display: flex;
            align-items: center;
        }
        .page-subtitle {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
        }

        /* Content Layout */
        .content-body {
            display: flex;
            flex-direction: column;
            gap: 24px;
            height: 100%;
        }

        /* Top Row: Reflection Cards */
        .reflection-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            height: 240px;
        }

        .reflection-card {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border-left: none;
            display: flex;
            flex-direction: column;
        }

        /* Difficulty Card */
        .card-difficulty {
            border-left: none;
        }
        .card-difficulty .card-icon {
            background-color: transparent;
            color: #1e293b;
        }

        /* Learning Card */
        .card-learning {
            border-left: none;
        }
        .card-learning .card-icon {
            background-color: transparent;
            color: #1e293b;
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .card-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin-right: 16px;
        }
        .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
        }

        .card-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
        }
        .card-list li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 12px;
            font-size: 16px;
            color: #4b5563;
            line-height: 1.6;
        }
        .card-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
            font-size: 18px;
        }
        .card-difficulty li::before { color: #1e293b; }
        .card-learning li::before { color: #1e293b; }

        /* Bottom Row: Quote Section */
        .quote-section {
            flex: 1;
            background-color: white; /* Clean white background */
            border-radius: 12px;
            padding: 0 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        
        .quote-icon {
            font-size: 40px;
            color: #e2e8f0;
            position: absolute;
            top: 40px;
            left: 40px;
        }
        .quote-icon-right {
            font-size: 40px;
            color: #e2e8f0;
            position: absolute;
            bottom: 40px;
            right: 40px;
        }

        .quote-text {
            font-size: 28px;
            font-weight: 800; /* Extra bold */
            color: #1e293b;
            line-height: 1.5;
            margin-bottom: 24px;
            position: relative;
            z-index: 10;
        }
        .quote-highlight {
            color: #1e293b;
        }
        
        .quote-author {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
            border-top: 2px solid #e2e8f0;
            padding-top: 16px;
            width: 200px;
        }

        /* Decorative Background */
        .bg-pattern {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 200px;
            height: 200px;
            opacity: 0.03;
            background-image: radial-gradient(#1e293b 1px, transparent 1px);
            background-size: 20px 20px;
            border-bottom-right-radius: 12px;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div class="chapter-label">Conclusion</div>
<h1 class="chapter-title">회고와<br/>학습</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context &amp; Diagnosis</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Strategic Response</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Execution &amp; Results</span>
</div>
<div class="nav-item active">
<span class="nav-number">04</span>
<span class="nav-text">Reflection</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-quote-right text-blue-600 mr-3"></i>
                    위기를 넘어 성장의 자산으로
                </h2>
<span class="page-subtitle">Reflection &amp; Insight</span>
</header>
<div class="content-body">
<!-- Top Row: Reflection Cards -->
<div class="reflection-grid">
<!-- Difficulty -->
<div class="reflection-card card-difficulty">
<div class="card-header">
<div class="card-icon">
<i class="fas fa-mountain"></i>
</div>
<h3 class="card-title">당시의 어려움 (Pain Points)</h3>
</div>
<ul class="card-list">
<li>
<p>글로벌 금융위기가 회사 생존에 직접적인 영향을 미치는 <strong>위기 상황 최초 경험</strong></p>
</li>
<li>
<p>경험이 전무한 상태에서 조직의 사활이 걸린 <strong>설득과 의사결정 수행에 따른 심리적 부담</strong></p>
</li>
</ul>
</div>
<!-- Learning/Next -->
<div class="reflection-card card-learning">
<div class="card-header">
<div class="card-icon">
<i class="fas fa-rotate-right"></i>
</div>
<h3 class="card-title">다시 한다면 (Lesson Learned)</h3>
</div>
<ul class="card-list">
<li>
<p>투자 유치 이후 단순 인원 확장이 아닌,</p>
</li>
<li>
<p><strong>"매출 성장 기반의 인재 채용 구조"</strong>를 설계하여 자생력을 더욱 빠르게 확보할 것</p>
</li>
</ul>
</div>
</div>
<!-- Bottom Row: Closing Quote -->
<div class="quote-section">
<i class="fas fa-quote-left quote-icon"></i>
<i class="fas fa-quote-right quote-icon-right"></i>
<div class="bg-pattern"></div>
<p class="quote-text">
                        "책임이란 결과가 나올 때까지 <span class="quote-highlight">자리를 지키는 것</span>이다.<br/>
                        나는 전략기획자로서 모두의 생존이라는 선택지를 만들었고,<br/>
                        그 판단이 끝나는 순간까지 함께했다."
                    </p>
<div class="quote-author">
                        Strategic Planner's Epilogue
                    </div>
</div>
</div>
</main>
</div>
</body>
</html></html></html>`
    };

    // iframe 스케일 정보 저장을 위한 전역 배열


        // 전략2 파일 내용을 객체로 저장
    const strategy2Contents = {
        1: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>모바일 로보어드바이저 전환 프로젝트</title>
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
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        /* Background Pattern */
        .bg-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.3;
            z-index: 0;
        }

        .content-wrapper {
            z-index: 10;
            width: 80%;
            max-width: 900px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .top-label {
            font-size: 14px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #64748b; /* Slate-500 */
            margin-bottom: 24px;
            font-weight: 700;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            display: inline-block;
        }

        .main-title {
            font-size: 64px;
            font-weight: 900;
            color: #1e293b; /* Slate-800 */
            line-height: 1.2;
            margin-bottom: 40px;
            letter-spacing: -0.02em;
        }

        .summary-container {
            position: relative;
            padding: 30px 40px;
            margin-bottom: 60px;
            background-color: #f8fafc; /* Slate-50 */
            border-radius: 4px;
            border-left: 4px solid #475569; /* Slate-600 (Point Color) */
            text-align: left;
            width: 100%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .summary-label {
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            display: block;
        }

        .summary-text {
            font-size: 20px;
            font-weight: 400;
            color: #334155; /* Slate-700 */
            line-height: 1.6;
            word-break: keep-all;
        }

        .meta-info-grid {
            display: flex;
            justify-content: center;
            gap: 60px;
            width: 100%;
            border-top: 1px solid #e2e8f0;
            padding-top: 30px;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .meta-label {
            font-size: 13px;
            color: #94a3b8; /* Slate-400 */
            margin-bottom: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .meta-value {
            font-size: 18px;
            color: #1e293b; /* Slate-800 */
            font-weight: 700;
            display: flex;
            align-items: center;
        }
        
        .meta-value i {
            margin-right: 8px;
            font-size: 16px;
            color: #64748b;
        }

        /* Decorative Elements */
        .corner-accent {
            position: absolute;
            width: 120px;
            height: 120px;
            border-top: 2px solid #cbd5e1;
            border-left: 2px solid #cbd5e1;
            top: 40px;
            left: 40px;
        }
        .corner-accent-bottom {
            position: absolute;
            width: 120px;
            height: 120px;
            border-bottom: 2px solid #cbd5e1;
            border-right: 2px solid #cbd5e1;
            bottom: 40px;
            right: 40px;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Background -->
<div class="bg-pattern"></div>
<div class="corner-accent"></div>
<div class="corner-accent-bottom"></div>
<!-- Main Content -->
<div class="content-wrapper">
<p class="top-label">Strategic Planning Portfolio</p>
<h1 class="main-title">
                모바일 로보어드바이저<br/>
                전환 프로젝트
            </h1>
<div class="summary-container">
<span class="summary-label">Executive Summary</span>
<p class="summary-text">
                    "규제 환경 변화 속에서 모바일 전환과 제도권 금융사 제휴를 하나의 전략 패키지로 설계하고, 로보어드바이저 사업 구조를 B2C에서 공급형 모델로 전환한 기획 사례"
                </p>
</div>
<div class="meta-info-grid">
<div class="meta-item">
<span class="meta-label">Role</span>
<span class="meta-value">
<i class="fas fa-user-pen"></i> 전략기획 / 서비스기획
                    </span>
</div>
<div class="meta-item">
<span class="meta-label">Project Type</span>
<span class="meta-value">
<i class="fas fa-layer-group"></i> 모바일 전환 &amp; 사업구조 개편
                    </span>
</div>
<div class="meta-item">
<span class="meta-label">Period</span>
<span class="meta-value">
<i class="far fa-calendar-alt"></i> 2020.03 - 2020.09
                    </span>
</div>
</div>
</div>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
            font-size: 20px;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
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
<p style="font-size: 18px; font-weight: 700;">B2C 직접 영업 <i class="fas fa-arrow-right" style="font-size: 14px; margin: 0 8px;"></i> 공급형 모델</p>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
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
<p class="card-title">Mobile Transformation</p>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 04. 실행: 금융사 제휴</p>
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
<span class="filter-badge">Filter 01. 라이선스</span>
</div>
<!-- Node 2: License -->
<div class="branch-node active">
<div class="node-icon"><i class="fas fa-certificate"></i></div>
<p class="node-title">투자일임업 보유</p>
<p class="node-desc">로보어드바이저 서비스<br/>필수 자격 보유사</p>
</div>
<!-- Connector -->
<div class="branch-connector active">
<span class="filter-badge">Filter 02. 비즈니스 니즈</span>
</div>
<!-- Node 3: Needs -->
<div class="branch-node active">
<div class="node-icon"><i class="fas fa-chart-line-down"></i></div>
<p class="node-title">성과 부진/고민</p>
<p class="node-desc">기존 로보어드바이저<br/>수익률 정체로 고민 중</p>
</div>
<!-- Connector -->
<div class="branch-connector active">
<span class="filter-badge" style="background-color: #3b82f6;">Final Selection</span>
</div>
<!-- Node 4: Final -->
<div class="branch-node final">
<div class="node-icon"><i class="fas fa-bullseye"></i></div>
<p class="node-title">Target A 그룹</p>
<p class="node-desc">디지털 돌파구가 필요한<br/>전통 자산운용사</p>
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
</html>\`,
        8: \`</html>`,
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
            font-size: 15px;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 04. 실행: 역할 분담 및 조율</p>
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
<h2 class="col-title">우리 회사</h2>
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
<h2 class="hub-title"><i class="fas fa-network-wired"></i> Internal Coordination</h2>
<p class="hub-subtitle">Communication Hub</p>
</div>
<div class="hub-body">
<div class="hub-list">
<div class="hub-item">
<p><strong>Communication</strong>투자일임사 - 개발조직 간 기술/비즈니스 언어 통역 및 조율</p>
</div>
<div class="hub-item">
<p><strong>Decision Making</strong>기술적 제약과 기획 의도 사이 최적의 대안 제시 (Trade-off 조율)</p>
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
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-item.active {
            color: #ffffff;
            font-weight: 700;
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
        }

        /* Top Row: Metrics */
        .metrics-row {
            display: flex;
            gap: 20px;
            height: 240px;
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
            max-height: 200px;
            min-height: 0;
            overflow: hidden;
        }
        .chart-container canvas {
            max-height: 100%;
            width: 100% !important;
            height: auto !important;
        }

        /* Bottom Row: Retro */
        .retro-row {
            flex: 1;
            display: flex;
            gap: 20px;
        }

        .retro-col {
            display: flex;
            flex-direction: column;
            gap: 16px;
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
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
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
<span>01. Problem Definition</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-chess-knight"></i></div>
<span>02. Strategic Decision</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-mobile-screen"></i></div>
<span>03. Execution: Mobile</span>
</div>
<div class="nav-item">
<div class="nav-icon"><i class="fas fa-handshake"></i></div>
<span>04. Execution: Alliance</span>
</div>
<div class="nav-item active">
<div class="nav-icon"><i class="fas fa-chart-line"></i></div>
<span>05. Result &amp; Retro</span>
</div>
</nav>
</aside>
<!-- Main Content -->
<main class="main-content">
<!-- Header -->
<header class="header-area">
<p class="chapter-title">Chapter 05. 성과 및 회고</p>
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
                                    기존 신사업 경험을 바탕으로 서비스 기획(PM/PO) 역할 주도적 수행
                                </li>
<li class="retro-item">
                                    서비스 컨셉, 브랜딩, 앱 UX/UI 구조를 Zero-to-One으로 설계
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
                            font: { size: 10 },
                            maxTicksLimit: 5,
                            padding: 5
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#64748b',
                            font: { size: 10, weight: 'bold' },
                            padding: 5
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
        
        // 서비스1-2부터 서비스1-8까지 큰 박스와 작은 박스 모두에서 95% 비율로 표시
        const isServiceBox = isServiceBoxType && slideNumber && ['2', '3', '4', '5', '6', '7', '8'].includes(slideNumber);
        
        // 전략2-10은 큰 박스에서 작은 박스와 동일한 padding 비율 적용
        const isStrategy2_10 = isStrategy2BoxType && slideNumber === '10' && !isSmallBox;
        
        // 컨테이너 크기에 맞게 스케일 계산
        let scale;
        if (isServiceBox) {
            // 서비스1-2부터 서비스1-8까지 큰 박스와 작은 박스 모두 95% 정도를 차지하도록 설정
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
            
            // 컨테이너 초기화
            container.innerHTML = '';
            
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
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; overflow: hidden; position: absolute; top: 0; left: 0; display: block;';
            if (isMainBox) {
                iframe.style.borderRadius = '16px';
            } else {
                iframe.style.borderRadius = '12px';
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
            
            // Chart.js와 chartjs-plugin-datalabels를 동적으로 로드하여 소스맵 요청 차단
            // Chart.js가 완전히 로드된 후에 플러그인을 로드하도록 순차 로드
            // Chart 사용 코드를 감싸는 헬퍼 함수 추가
            processedHtml = processedHtml.replace(
                /<script\s+src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js["'][^>]*><\/script>/gi,
                `<script>
                    // Chart.js를 동적으로 로드하여 소스맵 요청 차단
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
                        const originalOpen = XMLHttpRequest.prototype.open;
                        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                            if (typeof url === 'string' && url.includes('.map')) {
                                return;
                            }
                            return originalOpen.apply(this, [method, url, ...rest]);
                        };
                        
                        // Chart.js를 동적으로 로드
                        const chartScript = document.createElement('script');
                        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                        chartScript.async = false; // 순차 로드를 위해 동기 로드
                        chartScript.onerror = function() {
                            console.warn('Chart.js 로드 실패');
                        };
                        chartScript.onload = function() {
                            // Chart.js 로드 완료 후 플러그인 로드
                            if (window.Chart) {
                                const pluginScript = document.createElement('script');
                                pluginScript.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0';
                                pluginScript.async = false;
                                pluginScript.onerror = function() {
                                    console.warn('chartjs-plugin-datalabels 로드 실패');
                                };
                                pluginScript.onload = function() {
                                    // Chart.js와 플러그인이 모두 로드됨
                                    // Chart 사용 코드는 waitForChart 함수에서 자동으로 실행됨
                                };
                                document.head.appendChild(pluginScript);
                            }
                        };
                        document.head.appendChild(chartScript);
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
            processedHtml = processedHtml.replace(
                /<script>([\s\S]*?new\s+Chart\([\s\S]*?)<\/script>/gi,
                function(match, chartCode) {
                    // 이미 감싸진 코드는 그대로 유지
                    if (chartCode.includes('waitForChart') || chartCode.includes('window.Chart && window.ChartDataLabels')) {
                        return match;
                    }
                    // Chart 사용 코드를 감싸서 Chart.js 로드 완료를 기다리도록 수정
                    return `<script>
                        (function waitForChart() {
                            if (window.Chart && window.ChartDataLabels) {
                                ${chartCode}
                            } else {
                                setTimeout(waitForChart, 50);
                            }
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
            
            // <head> 태그가 있는 경우 base 태그와 소스맵 차단 스크립트 추가
            // 소스맵 차단 스크립트를 가장 먼저 실행하도록 <head> 태그 바로 뒤에 추가
            if (processedHtml.includes('<head>')) {
                // <head> 태그 바로 뒤에 base 태그와 스크립트 추가 (소스맵 차단을 최우선으로)
                processedHtml = processedHtml.replace(
                    /<head>/i,
                    `<head>${sourceMapBlocker}<base href="${baseUrl}">`
                );
            } else if (processedHtml.includes('<html')) {
                // <head> 태그가 없으면 <html> 태그 뒤에 <head>와 스크립트, base 태그 추가
                processedHtml = processedHtml.replace(
                    /(<html[^>]*>)/i,
                    `$1<head>${sourceMapBlocker}<base href="${baseUrl}"></head>`
                );
            } else {
                // HTML 구조가 없는 경우 앞에 추가
                processedHtml = `<head>${sourceMapBlocker}<base href="${baseUrl}"></head>` + processedHtml;
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
            
            // 스케일 재계산 최적화 (단일 재계산)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
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
        } catch (error) {
            console.error(`Failed to load service ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
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
            
            // 스케일 재계산 최적화 (단일 재계산)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
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
            
            // 스케일 재계산 최적화 (단일 재계산)
            const scheduleRecalculate = () => {
                const iframeInfo = getIframeInfo(mainBox);
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

    // 서비스1 박스 썸네일 로드 (HTML에 이미 있으면 스킵)
    const service1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="2"]');
    if (service1ThumbnailBox && service1ThumbnailBox.innerHTML.trim() === '' && typeof service1Contents !== 'undefined') {
        const html = service1Contents[1];
        if (html) {
            service1ThumbnailBox.innerHTML = '';
            loadContentToIframe(service1ThumbnailBox, html, false);
        }
    }

    // 전략1 박스 썸네일 로드 (HTML에 이미 있으면 스킵)
    const strategy1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="1"]');
    if (strategy1ThumbnailBox && strategy1ThumbnailBox.innerHTML.trim() === '' && typeof strategy1Contents !== 'undefined') {
        const html = strategy1Contents[1];
        if (html) {
            strategy1ThumbnailBox.innerHTML = '';
            loadContentToIframe(strategy1ThumbnailBox, html, false);
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

