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

    // 확대 뷰 닫기 함수
    function closeExpandedView() {
        if (expandedView && thumbnailGrid) {
            expandedView.classList.add("hidden");
            thumbnailGrid.classList.remove("hidden");
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

        // 슬라이드 리스트 생성 - 박스 번호에 따라 개수 다름
        slideList.innerHTML = "";
        const slideCount = boxNumber === "1" ? 8 : 5; // 전략1은 8개, 나머지는 5개
        for (let i = 1; i <= slideCount; i++) {
            const slideItem = document.createElement("div");
            slideItem.className = "test-slide-item service-slide-item";
            // 네이밍: 1-1, 1-2, ... 형식
            const slideName = `${boxNumber}-${i}`;
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
                
                const slideNum = slideItem.getAttribute("data-slide-number");
                if (boxNumber === "1") {
                    // 전략1 박스인 경우 전략1 파일 내용 로드
                    loadStrategy1ContentToMainBox(expandedBox, parseInt(slideNum));
                } else if (boxNumber === "2") {
                    // 2번 박스인 경우 서비스 파일 내용 로드
                    loadService1ContentToMainBox(expandedBox, parseInt(slideNum));
                } else if (boxNumber === "5") {
                    // 전략2 박스인 경우 전략2 파일 내용 로드
                    loadStrategy2ContentToMainBox(expandedBox, parseInt(slideNum));
                } else {
                    // 나머지 박스는 추후 동일한 방식으로 구현 예정
                    console.log(`슬라이드 아이템 클릭: ${slideName}`);
                }
            });
            
            slideList.appendChild(slideItem);
        }
    }

    // 서비스1 파일 내용을 객체로 저장
    const service1Contents = {
        1: `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>모바일 로보어드바이저 KIWI</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            overflow: hidden;
        }
        .slide-container-1 {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .accent-bar {
            position: absolute;
            left: 0;
            top: 60px;
            bottom: 60px;
            width: 14px;
            background-color: #A4C639;
            z-index: 20;
        }
        .content-wrapper {
            flex: 1;
            padding: 60px 80px 60px 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .text-content {
            width: 58%;
            z-index: 10;
        }
        .image-content {
            width: 42%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 10;
        }
        .tag-pill {
            display: inline-block;
            padding: 6px 16px;
            background-color: #f1f5f9;
            color: #051c2c;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 24px;
            border-radius: 4px;
            text-transform: uppercase;
            border-left: 4px solid #051c2c;
        }
        .main-title {
            font-size: 56px;
            font-weight: 900;
            line-height: 1.15;
            color: #1e293b;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }
        .sub-title {
            font-size: 24px;
            font-weight: 500;
            color: #64748b;
            margin-bottom: 32px;
            line-height: 1.4;
        }
        .highlight {
            color: #A4C639;
        }
        .summary-box {
            border-top: 2px solid #e2e8f0;
            padding-top: 32px;
            margin-top: 10px;
        }
        .summary-label {
            font-size: 15px;
            font-weight: 800;
            color: #051c2c;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-text {
            font-size: 18px;
            font-weight: 400;
            color: #475569;
            line-height: 1.6;
        }
        .value-prop {
            font-size: 20px;
            font-weight: 700;
            color: #051c2c;
            margin-top: 8px;
            display: block;
        }
        .footer {
            position: absolute;
            bottom: 30px;
            right: 50px;
            text-align: right;
            color: #94a3b8;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
            z-index: 20;
        }
        .deco-circle-large {
            position: absolute;
            right: -150px;
            top: -100px;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background-color: #f7fee7;
            z-index: 0;
            opacity: 0.8;
        }
        .deco-circle-small {
            position: absolute;
            right: 400px;
            bottom: -50px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background-color: #ecfccb;
            z-index: 0;
            opacity: 0.6;
        }
        .app-mockup {
            max-width: 100%;
            max-height: 580px;
            object-fit: contain;
            filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15));
            transform: perspective(1000px) rotateY(-5deg);
            transition: transform 0.3s ease;
        }
        .work-table {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .work-row {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 16px;
            align-items: center;
        }
        .work-label {
            font-size: 14px;
            color: #111827;
            font-weight: 500;
        }
        .work-progress-bar {
            width: 100%;
            height: 22px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
            position: relative;
        }
        .work-progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
<div class="slide-container-1">
<div class="deco-circle-large"></div>
<div class="deco-circle-small"></div>
<div class="accent-bar"></div>
<div class="content-wrapper">
<div class="text-content">
<div class="tag-pill">Fintech Project Portfolio</div>
<h1 class="main-title">모바일 로보어드바이저 <span class="highlight">KIWI 서비스 기획</span></h1>
<p class="sub-title">시간과 장소에 구애받지 않는<br>모바일 자산관리 서비스</p>
<div class="summary-box">
<div class="summary-label">
<i class="fas fa-bullseye mr-2" style="color: #A4C639;"></i> Core Value Proposition
</div>
<p class="summary-text">손 안의 <strong>'원클릭' 자동투자</strong> 경험 제공</p>
<p class="summary-text" style="font-size: 16px; margin-top: 16px; color: #64748b;">
전문 지식 없이도 알고리즘이 <strong>포트폴리오 구성·리밸런싱을 자동 수행</strong>하는<br>
모바일 투자일임 서비스
</p>
<div class="work-table" style="margin-top: 32px; max-width: 90%;">
<div class="work-row">
<div class="work-label">알고리즘 설계</div>
<div class="work-progress-bar">
<div class="work-progress-fill" style="width: 100%; background: rgba(164, 198, 57, 0.539); border-right: 1px solid rgba(164, 198, 57, 0.6); box-shadow: 0 2px 8px rgba(164, 198, 57, 0.2), 0 4px 12px rgba(164, 198, 57, 0.1);"></div>
</div>
</div>
<div class="work-row">
<div class="work-label">B2B 파트너십</div>
<div class="work-progress-bar">
<div class="work-progress-fill" style="width: 100%; background: rgba(164, 198, 57, 0.539); border-right: 1px solid rgba(164, 198, 57, 0.6); box-shadow: 0 2px 8px rgba(164, 198, 57, 0.2), 0 4px 12px rgba(164, 198, 57, 0.1);"></div>
</div>
</div>
<div class="work-row">
<div class="work-label">법률 리스크 검토</div>
<div class="work-progress-bar">
<div class="work-progress-fill" style="width: 80%; background: rgba(164, 198, 57, 0.539); border-right: 1px solid rgba(164, 198, 57, 0.6); box-shadow: 0 2px 8px rgba(164, 198, 57, 0.2), 0 4px 12px rgba(164, 198, 57, 0.1);"></div>
</div>
</div>
<div class="work-row">
<div class="work-label">투자 성과 모니터링</div>
<div class="work-progress-bar">
<div class="work-progress-fill" style="width: 90%; background: rgba(164, 198, 57, 0.539); border-right: 1px solid rgba(164, 198, 57, 0.6); box-shadow: 0 2px 8px rgba(164, 198, 57, 0.2), 0 4px 12px rgba(164, 198, 57, 0.1);"></div>
</div>
</div>
</div>
</div>
</div>
<div class="image-content">
<img src="assets/images/kiwi-phone.png" alt="KIWI 모바일 앱" class="app-mockup">
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
<title>Chapter 1. 프로젝트 개요 &amp; 기획 목표</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
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
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
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
            color: #A4C639;
            margin-right: 16px;
            font-size: 28px;
        }
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 24px;
            flex: 1;
        }
        .card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            padding: 24px;
            border-left: 4px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease;
        }
        .card:hover {
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
            color: #111827;
            flex-shrink: 0;
        }
        .card-title {
            font-size: 20px;
            font-weight: 800;
            color: #1f2937;
        }
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
            padding-left: 14px;
            margin-bottom: 6px;
        }
        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #9ca3af;
            font-weight: bold;
        }
        .highlight-text {
            font-weight: 700;
            color: #111827;
            background-color: #f3f4f6;
            padding: 0 4px;
            border-radius: 2px;
        }
        .brand-highlight {
            color: #65801c;
            font-weight: 700;
        }
    </style>
</head>
<body>
<div class="slide-container">
<aside class="sidebar">
<div class="chapter-label">Project Overview</div>
<h1 class="chapter-title">프로젝트 개요 &amp;<br/>기획 목표</h1>
<div class="nav-group">
<div class="nav-item active">
<span class="nav-number">01</span>
<span class="nav-text">Overview &amp; Goals</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Risk &amp; Opportunity</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Strategy &amp; Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Performance</span>
</div>
</div>
</aside>
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-mobile-alt"></i>
                    시간과 장소에 구애받지 않는 모바일 자산관리
                </h2>
</header>
<div class="analysis-grid">
<div class="card card-overview">
<div class="card-header">
<div class="card-icon"><i class="fas fa-clipboard-list"></i></div>
<h3 class="card-title">프로젝트 개요 (Overview)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>기간:</strong> 2022 ~ 2025 (3년)
                            </li>
<li>
<strong>주요 역할:</strong>
<div class="mt-1 pl-1 text-sm text-gray-500">
                                    앱 기능 정의 · 알고리즘 설계 · 법률 리스크 검토<br/>
                                    B2B 파트너십 · 투자 성과 모니터링
                                </div>
</li>
<li class="mt-2">
<strong>핵심 산출물:</strong> 로보어드바이저 알고리즘, <span class="highlight-text">모바일 UX/UI 정책</span>, 금융파트너십 계약
                            </li>
</ul>
</div>
</div>
<div class="card card-goal">
<div class="card-header">
<div class="card-icon"><i class="fas fa-bullseye"></i></div>
<h3 class="card-title">기획 목표 (Service Goal)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>손 안의 원클릭 투자:</strong> 전문 지식 없이도 누구나 쉽게 접근 가능한 <span class="brand-highlight">투자일임 서비스</span> 구현
                            </li>
<li>
<strong>자동화된 관리:</strong> 복잡한 포트폴리오 구성부터 리밸런싱까지 <span class="highlight-text">100% 알고리즘 자동 수행</span>
</li>
<li>
<strong>심리적 안도감:</strong> 실수 없는 마음 편한 투자가 가능하도록 직관적인 경험 설계
                            </li>
</ul>
</div>
</div>
<div class="card card-tech">
<div class="card-header">
<div class="card-icon"><i class="fas fa-robot"></i></div>
<h3 class="card-title">기술 전략 (Quant Engine)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>퀀트 기반 분산투자:</strong> 모멘텀, 변동성, 밸류 등 <span class="highlight-text">정량적 지표</span>를 활용한 알고리즘 개발
                            </li>
<li>
<strong>위험 관리 자동화:</strong> 시장 변동성에 대응하는 자동 리밸런싱 시스템 구축
                            </li>
<li>
<strong>안정성 검증:</strong> 철저한 <span class="highlight-text">과거 데이터 백테스트</span>를 통해 알고리즘 성과 및 안정성 확보
                            </li>
</ul>
</div>
</div>
<div class="card card-value">
<div class="card-header">
<div class="card-icon"><i class="fas fa-star"></i></div>
<h3 class="card-title">핵심 가치 제안 (Value Prop)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>Easy Start:</strong> 복잡한 절차 없이 시작하는 자산관리
                            </li>
<li>
<strong>Auto-Pilot:</strong> 신경 쓰지 않아도 알아서 굴려주는 편의성
                            </li>
<li>
<strong>Transparency:</strong> 휴대폰에서 <span class="highlight-text">실시간 확인</span> 가능한 투명한 성과 리포팅
                            </li>
</ul>
</div>
</div>
</div>
</main>
</div>
</body>
</html>`,
        3: `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Chapter 2. 법률·경쟁 리스크 분석</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
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
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
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
            color: #A4C639;
            margin-right: 16px;
            font-size: 28px;
        }
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 24px;
            flex: 1;
        }
        .card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            padding: 24px;
            border-left: 4px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease;
        }
        .card:hover {
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
            color: #111827;
            flex-shrink: 0;
        }
        .card-title {
            font-size: 20px;
            font-weight: 800;
            color: #1f2937;
        }
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
            padding-left: 14px;
            margin-bottom: 6px;
        }
        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #9ca3af;
            font-weight: bold;
        }
        .highlight-text {
            font-weight: 700;
            color: #111827;
            background-color: #f3f4f6;
            padding: 0 4px;
            border-radius: 2px;
        }
        .text-danger {
            color: #ef4444;
            font-weight: 700;
        }
        .text-brand {
            color: #65801c;
            font-weight: 700;
        }
    </style>
</head>
<body>
<div class="slide-container">
<aside class="sidebar">
<div class="chapter-label">Risk Analysis</div>
<h1 class="chapter-title">법률·경쟁 리스크<br/>분석 및 기회</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Overview &amp; Goals</span>
</div>
<div class="nav-item active">
<span class="nav-number">02</span>
<span class="nav-text">Risk &amp; Opportunity</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Strategy &amp; Execution</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Performance</span>
</div>
</div>
</aside>
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-scale-balanced"></i>
규제와 경쟁의 이중고 속에서 찾은 돌파구
</h2>
</header>
<div class="analysis-grid">
<div class="card card-legal">
<div class="card-header">
<div class="card-icon"><i class="fas fa-gavel"></i></div>
<h3 class="card-title">주요 법률 리스크 (Legal)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>진입 장벽:</strong> 투자일임 서비스는 금융위원회 등록된 '투자일임업자'만 제공 가능
                            </li>
<li>
<strong>현재 지위 문제:</strong> 당사는 투자일임업 미등록 상태로 <span class="text-danger">법적으로 직접 서비스 불가</span>
</li>
<li>
<strong>영업 제한:</strong> 독자적인 앱을 통한 고객 자산 수탁 및 운용 불가능
                            </li>
</ul>
</div>
</div>
<div class="card card-competition">
<div class="card-header">
<div class="card-icon"><i class="fas fa-users-slash"></i></div>
<h3 class="card-title">경쟁 환경 리스크 (Competition)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>시장 선점:</strong> 대형 증권사·은행이 이미 자체 로보어드바이저 서비스 보유
                            </li>
<li>
<strong>진입 난이도:</strong> 신규 스타트업이 직접 경쟁하기엔 <span class="highlight-text">자본력 및 신뢰도 열세</span>
</li>
<li>
<strong>출시 지연:</strong> 엄격한 금융 규제와 전문 인력 부족으로 인한 서비스 런칭 지연 우려
                            </li>
</ul>
</div>
</div>
<div class="card card-opportunity">
<div class="card-header">
<div class="card-icon"><i class="fas fa-file-signature"></i></div>
<h3 class="card-title">제도 변화 기회 (Opportunity)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>규제 완화:</strong> 2019년 5월 금융위원회 <span class="highlight-text">금융투자업 규정 개정</span>
</li>
<li>
<strong>위탁 운용 허용:</strong> "비금융 로보어드바이저 업체도 자산운용사로부터 펀드·일임재산 운용 업무 위탁 가능"
                            </li>
<li>
<strong>시장 활성화:</strong> 핀테크 기업의 진입 장벽을 낮추는 정책적 시그널 포착
                            </li>
</ul>
</div>
</div>
<div class="card card-strategy">
<div class="card-header">
<div class="card-icon"><i class="fas fa-chess-knight"></i></div>
<h3 class="card-title">전략적 판단 (Strategic Pivot)</h3>
</div>
<div class="card-content">
<ul class="bullet-list">
<li>
<strong>B2B 모델 전환:</strong> 직접 라이선스 취득 대신 <span class="text-brand">금융사 제휴 모델</span>로 피벗(Pivot)
                            </li>
<li>
<strong>역할 분담:</strong>
<div class="mt-1 pl-1 text-sm text-gray-500">
<strong>당사:</strong> 알고리즘 개발 &amp; 앱 UX 제공<br/>
<strong>파트너:</strong> 계좌 개설 &amp; 법적 운용 주체
                                </div>
</li>
<li class="mt-2">
<strong>기대 효과:</strong> 법적 리스크 100% 해소 및 시장 진입 속도(Time-to-market) 단축
                            </li>
</ul>
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
<title>Chapter 3. 리스크 해결방법 &amp; B2B 전략</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
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
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
        .main-content {
            flex: 1;
            padding: 50px 70px;
            background-color: #f9fafb;
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
        .framework-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            height: 100%;
        }
        .strategy-top {
            background-color: #A4C639;
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 6px -1px rgba(164, 198, 57, 0.3);
        }
        .strategy-badge {
            background-color: rgba(255,255,255,0.25);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: inline-block;
            color: #064e3b;
        }
        .strategy-main-text {
            font-size: 22px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .strategy-sub-text {
            font-size: 16px;
            opacity: 0.95;
            margin-top: 4px;
            font-weight: 500;
        }
        .pillars-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            flex: 1;
        }
        .pillar-card {
            background-color: white;
            border-radius: 10px;
            padding: 25px;
            border-top: 4px solid #cbd5e1;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,0.06);
            display: flex;
            flex-direction: column;
        }
        .pillar-card.green { border-top-color: #10b981; }
        .pillar-card.blue { border-top-color: #3b82f6; }
        .pillar-card.slate { border-top-color: #475569; }
        .pillar-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 20px;
        }
        .pillar-card.green .pillar-icon { background-color: #ecfdf5; color: #10b981; }
        .pillar-card.blue .pillar-icon { background-color: #eff6ff; color: #3b82f6; }
        .pillar-card.slate .pillar-icon { background-color: #f1f5f9; color: #475569; }
        .pillar-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .pillar-content {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
        }
        .check-list li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        .check-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #A4C639;
            font-weight: bold;
        }
        .foundation-box {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px 30px;
            display: flex;
            align-items: center;
        }
        .foundation-title-area {
            width: 200px;
            border-right: 2px solid #cbd5e1;
            margin-right: 30px;
        }
        .foundation-title {
            font-size: 16px;
            font-weight: 800;
            color: #334155;
            display: block;
        }
        .foundation-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            display: block;
        }
        .foundation-content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .process-step {
            text-align: center;
            position: relative;
            flex: 1;
        }
        .process-step:not(:last-child)::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -20%;
            width: 40%;
            height: 2px;
            background-color: #cbd5e1;
            z-index: 0;
        }
        .step-circle {
            width: 32px;
            height: 32px;
            background-color: white;
            border: 2px solid #64748b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 8px;
            font-weight: 700;
            color: #64748b;
            position: relative;
            z-index: 1;
            font-size: 12px;
        }
        .step-text {
            font-size: 13px;
            font-weight: 600;
            color: #475569;
        }
        .process-step.active .step-circle {
            border-color: #A4C639;
            color: #A4C639;
            background-color: #f7fee7;
        }
        .process-step.active .step-text {
            color: #65a30d;
        }
    </style>
</head>
<body>
<div class="slide-container">
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">리스크 해결<br/>&amp; B2B 전략</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Project Overview</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Risk Analysis</span>
</div>
<div class="nav-item active">
<span class="nav-number">03</span>
<span class="nav-text">Solution &amp; Strategy</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Performance</span>
</div>
</div>
</aside>
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-chess-board text-green-600 mr-3"></i>
                위기 돌파를 위한 비즈니스 모델 피벗(Pivot)
            </h2>
<span class="page-subtitle">Strategic Solution</span>
</header>
<div class="framework-container">
<div class="strategy-top">
<div>
<span class="strategy-badge">Core Strategy</span>
<div class="strategy-main-text">B2B 알고리즘 공급 모델로 전환</div>
<div class="strategy-sub-text">직접 서비스의 법적 한계를 극복하고 제도권 금융사와의 협업을 통해 시장 진입</div>
</div>
<i class="fas fa-rocket text-4xl opacity-40"></i>
</div>
<div class="pillars-grid">
<div class="pillar-card green">
<div class="pillar-icon">
<i class="fas fa-code"></i>
</div>
<h3 class="pillar-title">자체 알고리즘 고도화</h3>
<ul class="check-list pillar-content">
<li><strong>퀀트 엔진 개발:</strong> 모멘텀/변동성/밸류 등 정량 팩터 기반 포트폴리오 산출</li>
<li><strong>개인화 엔진:</strong> 투자자 성향별 맞춤 비중 최적화</li>
<li><strong>운영 효율화:</strong> 자동 리밸런싱 및 API 연동 구조 설계</li>
</ul>
</div>
<div class="pillar-card blue">
<div class="pillar-icon">
<i class="fas fa-handshake"></i>
</div>
<h3 class="pillar-title">라이선스 파트너 확보</h3>
<ul class="check-list pillar-content">
<li><strong>독점 계약:</strong> 금융위 등록 투자일임업자 선정 및 계약</li>
<li><strong>인프라 연동:</strong> 주문/체결 데이터 실시간 동기화</li>
<li><strong>역할 분담:</strong> 운용(파트너사) vs 기술/UX(당사) 명확화</li>
</ul>
</div>
<div class="pillar-card slate">
<div class="pillar-icon">
<i class="fas fa-file-shield"></i>
</div>
<h3 class="pillar-title">컴플라이언스 완벽 대응</h3>
<ul class="check-list pillar-content">
<li><strong>법적 리스크 해소:</strong> 투자일임 행위 주체를 파트너사로 명확화</li>
<li><strong>보안 강화:</strong> 금융권 수준의 망분리 및 데이터 암호화</li>
<li><strong>감사 추적:</strong> 알고리즘 운용 내역 로그 100% 적재</li>
</ul>
</div>
</div>
<div class="foundation-box">
<div class="foundation-title-area">
<span class="foundation-title">실행 로드맵</span>
<span class="foundation-subtitle">Execution Roadmap</span>
</div>
<div class="foundation-content">
<div class="process-step">
<div class="step-circle">1</div>
<span class="step-text">PoC 검증<br/>(0-3개월)</span>
</div>
<div class="process-step">
<div class="step-circle">2</div>
<span class="step-text">알고리즘 고도화<br/>(3-6개월)</span>
</div>
<div class="process-step active">
<div class="step-circle" style="background-color: #ecfccb; border-color: #84cc16; color: #4d7c0f;">3</div>
<span class="step-text" style="color: #4d7c0f;">상용화 &amp; 온보딩<br/>(6-12개월)</span>
</div>
<div class="process-step">
<div class="step-circle">4</div>
<span class="step-text">스케일업<br/>(12개월~)</span>
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
<title>Chapter 4. 사업 추진 성과</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
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
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
        .main-content {
            flex: 1;
            padding: 40px 60px;
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
        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 24px;
            flex: 1;
        }
        .result-card {
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .card-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 16px;
        }
        .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
        }
        .icon-growth { background-color: #f0fdf4; color: #65a30d; }
        .stat-row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 10px;
        }
        .stat-value {
            font-size: 36px;
            font-weight: 900;
            color: #4d7c0f;
            line-height: 1;
            margin-right: 8px;
        }
        .stat-unit {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .growth-badge {
            background-color: #ecfccb;
            color: #365314;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            margin-left: auto;
            margin-bottom: 6px;
        }
        .chart-wrapper-growth {
            flex: 1;
            position: relative;
            width: 100%;
            min-height: 80px;
        }
        .icon-efficiency { background-color: #ecfccb; color: #4d7c0f; }
        .efficiency-stat {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .chart-wrapper-efficiency {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .efficiency-label {
            position: absolute;
            text-align: center;
        }
        .efficiency-label strong {
            display: block;
            font-size: 24px;
            font-weight: 900;
            color: #4d7c0f;
        }
        .efficiency-label span {
            font-size: 12px;
            color: #64748b;
        }
        .icon-internal { background-color: #f7fee7; color: #3f6212; }
        .improvement-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .improvement-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 14px;
        }
        .check-icon {
            color: #84cc16;
            margin-right: 10px;
            margin-top: 4px;
        }
        .improvement-text strong {
            color: #334155;
            font-weight: 700;
            display: block;
            font-size: 15px;
        }
        .improvement-text p {
            color: #64748b;
            font-size: 13px;
            margin: 2px 0 0 0;
            line-height: 1.4;
        }
        .icon-impact { background-color: #f0fdfa; color: #0d9488; }
        .impact-flow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            position: relative;
        }
        .impact-step {
            text-align: center;
            width: 30%;
            background-color: #f9fafb;
            padding: 12px 4px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            position: relative;
            z-index: 1;
        }
        .impact-step.final {
            background-color: #ecfccb;
            border-color: #bef264;
            box-shadow: 0 2px 4px rgba(132, 204, 22, 0.1);
        }
        .impact-step h4 {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 4px;
            color: #4b5563;
        }
        .impact-step.final h4 { color: #3f6212; }
        .impact-step span {
            font-size: 10px;
            color: #9ca3af;
            display: block;
            line-height: 1.2;
        }
        .impact-step.final span { color: #4d7c0f; }
        .flow-arrow {
            color: #d1d5db;
            font-size: 12px;
        }
        .impact-summary {
            margin-top: auto;
            padding: 12px;
            background-color: #f8fafc;
            border-left: 3px solid #84cc16;
            font-size: 13px;
            color: #475569;
            line-height: 1.5;
        }
    </style>
</head>
<body>
<div class="slide-container">
<aside class="sidebar">
<div class="chapter-label">Current Chapter</div>
<h1 class="chapter-title">사업 추진<br/>성 과</h1>
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
<span class="nav-text">B2B Strategy</span>
</div>
<div class="nav-item active">
<span class="nav-number">04</span>
<span class="nav-text">Results &amp; Impact</span>
</div>
</div>
</aside>
<main class="main-content">
<header class="page-header">
<h2 class="page-title">
<i class="fas fa-chart-bar text-lime-600 mr-3"></i>
                    B2B 모델 전환을 통한 시장 조기 안착 및 성과 창출
                </h2>
<span class="page-subtitle">Performance &amp; Business Impact</span>
</header>
<div class="content-grid">
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-growth"><i class="fas fa-sack-dollar"></i></div>
<h3 class="card-title">핵심 성과 (Key Results)</h3>
</div>
<div class="stat-row">
<span class="stat-value">80억</span>
<span class="stat-unit">원</span>
<div class="growth-badge">출시 3개월 누적 계약</div>
</div>
<div class="chart-wrapper-growth">
<canvas id="growthChart"></canvas>
</div>
<div style="display: flex; justify-content: space-between; margin-top: 8px;">
<div style="font-size: 12px; color: #64748b;">
<strong>사용자 재투자율</strong> <span style="color: #4d7c0f; font-weight: 700;">62%</span>
</div>
<div style="font-size: 12px; color: #64748b;">
<strong>알고리즘 신뢰도 검증</strong>
</div>
</div>
</div>
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-efficiency"><i class="fas fa-stopwatch"></i></div>
<h3 class="card-title">운영 효율 (Efficiency)</h3>
</div>
<div class="chart-wrapper-efficiency">
<canvas id="efficiencyChart"></canvas>
<div class="efficiency-label">
<strong>30%</strong>
<span>효율 개선</span>
</div>
</div>
<p style="text-align: center; font-size: 13px; color: #64748b; margin-top: 10px;">
                    자동화 리밸런싱 시스템 도입으로<br/>수작업 대비 운용 시간 획기적 단축
                </p>
</div>
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-internal"><i class="fas fa-server"></i></div>
<h3 class="card-title">구조적 개선 &amp; 내부 성과</h3>
</div>
<ul class="improvement-list">
<li class="improvement-item">
<i class="fas fa-check-circle check-icon"></i>
<div class="improvement-text">
<strong>투자성과 리포팅 자동화</strong>
<p>고객별 수익률 계산 및 리포트 발송 자동화로 운영비 절감</p>
</div>
</li>
<li class="improvement-item">
<i class="fas fa-check-circle check-icon"></i>
<div class="improvement-text">
<strong>신규 B2B 매출 파이프라인</strong>
<p>파트너사의 추가 알고리즘 개발 의뢰 확보</p>
</div>
</li>
<li class="improvement-item">
<i class="fas fa-check-circle check-icon"></i>
<div class="improvement-text">
<strong>후속 서비스 기반 마련</strong>
<p>자문/리밸런싱 고도화를 위한 데이터 인프라 구축</p>
</div>
</li>
</ul>
</div>
<div class="result-card">
<div class="card-header">
<div class="card-icon icon-impact"><i class="fas fa-flag-checkered"></i></div>
<h3 class="card-title">사업 임팩트 (Business Impact)</h3>
</div>
<div class="impact-flow">
<div class="impact-step">
<h4>Risks Removed</h4>
<span>법적 위험 해소</span>
</div>
<div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
<div class="impact-step">
<h4>Market Entry</h4>
<span>시장 진입 가속</span>
</div>
<div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
<div class="impact-step final">
<h4>Scaling Up</h4>
<span>성장 기반 확보</span>
</div>
</div>
<div class="impact-summary">
<p>
<strong>"규제 리스크를 B2B 기회로 전환"</strong><br/>
                        직접 서비스의 한계를 극복하고, 금융사 파트너십을 통해 안정적인 운용 자산(AUM) 확보 및 스케일업 발판 마련
                    </p>
</div>
</div>
</div>
</main>
</div>
<script>
        const ctxGrowth = document.getElementById('growthChart').getContext('2d');
        const growthChart = new Chart(ctxGrowth, {
            type: 'bar',
            data: {
                labels: ['M+1', 'M+2', 'M+3'],
                datasets: [{
                    label: '누적 계약액 (억원)',
                    data: [20, 50, 80],
                    backgroundColor: [
                        '#d9f99d',
                        '#a3e635',
                        '#65a30d'
                    ],
                    borderRadius: 4,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Noto Sans KR', size: 11 } }
                    }
                },
                animation: { duration: 0 }
            }
        });
        const ctxEff = document.getElementById('efficiencyChart').getContext('2d');
        const efficiencyChart = new Chart(ctxEff, {
            type: 'doughnut',
            data: {
                labels: ['개선된 효율', '기존'],
                datasets: [{
                    data: [30, 70],
                    backgroundColor: ['#84cc16', '#f1f5f9'],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                animation: { duration: 0 }
            }
        });
    </script>
</body>
</html>`,
        2: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서비스 기획 - 2. 프로젝트 개요 & 기획 목표</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
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
            color: #A4C639;
            margin-right: 16px;
            font-size: 28px;
        }
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 24px;
            flex: 1;
        }
        .card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            padding: 24px;
            border-left: 4px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease;
        }
        .card:hover {
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
            color: #111827;
            flex-shrink: 0;
        }
        .card-title {
            font-size: 20px;
            font-weight: 800;
            color: #1f2937;
        }
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
            padding-left: 14px;
            margin-bottom: 6px;
        }
        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #9ca3af;
            font-weight: bold;
        }
        .highlight-text {
            font-weight: 700;
            color: #111827;
            background-color: #f3f4f6;
            padding: 0 4px;
            border-radius: 2px;
        }
        .brand-highlight {
            color: #65801c;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <aside class="sidebar">
            <div class="chapter-label">Project Overview</div>
            <h1 class="chapter-title">프로젝트 개요 &amp;<br/>기획 목표</h1>
            <div class="nav-group">
                <div class="nav-item active">
                    <span class="nav-number">01</span>
                    <span class="nav-text">Overview &amp; Goals</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">02</span>
                    <span class="nav-text">Risk &amp; Opportunity</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">03</span>
                    <span class="nav-text">Strategy &amp; Execution</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">04</span>
                    <span class="nav-text">Performance</span>
                </div>
            </div>
        </aside>
        <main class="main-content">
            <header class="page-header">
                <h2 class="page-title">
                    <i class="fas fa-mobile-alt"></i>
                    시간과 장소에 구애받지 않는 모바일 자산관리
                </h2>
            </header>
            <div class="analysis-grid">
                <div class="card card-overview">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-clipboard-list"></i></div>
                        <h3 class="card-title">프로젝트 개요 (Overview)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li><strong>기간:</strong> 2022 ~ 2025 (3년)</li>
                            <li>
                                <strong>주요 역할:</strong>
                                <div class="mt-1 pl-1 text-sm text-gray-500">
                                    앱 기능 정의 · 알고리즘 설계 · 법률 리스크 검토<br/>
                                    B2B 파트너십 · 투자 성과 모니터링
                                </div>
                            </li>
                            <li class="mt-2">
                                <strong>핵심 산출물:</strong> 로보어드바이저 알고리즘, <span class="highlight-text">모바일 UX/UI 정책</span>, 금융파트너십 계약
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card card-goal">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-bullseye"></i></div>
                        <h3 class="card-title">기획 목표 (Service Goal)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li>
                                <strong>손 안의 원클릭 투자:</strong> 전문 지식 없이도 누구나 쉽게 접근 가능한 <span class="brand-highlight">투자일임 서비스</span> 구현
                            </li>
                            <li>
                                <strong>자동화된 관리:</strong> 복잡한 포트폴리오 구성부터 리밸런싱까지 <span class="highlight-text">100% 알고리즘 자동 수행</span>
                            </li>
                            <li>
                                <strong>심리적 안도감:</strong> 실수 없는 마음 편한 투자가 가능하도록 직관적인 경험 설계
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card card-tech">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-robot"></i></div>
                        <h3 class="card-title">기술 전략 (Quant Engine)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li>
                                <strong>퀀트 기반 분산투자:</strong> 모멘텀, 변동성, 밸류 등 <span class="highlight-text">정량적 지표</span>를 활용한 알고리즘 개발
                            </li>
                            <li>
                                <strong>위험 관리 자동화:</strong> 시장 변동성에 대응하는 자동 리밸런싱 시스템 구축
                            </li>
                            <li>
                                <strong>안정성 검증:</strong> 철저한 <span class="highlight-text">과거 데이터 백테스트</span>를 통해 알고리즘 성과 및 안정성 확보
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card card-value">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-star"></i></div>
                        <h3 class="card-title">핵심 가치 제안 (Value Prop)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li><strong>Easy Start:</strong> 복잡한 절차 없이 시작하는 자산관리</li>
                            <li><strong>Auto-Pilot:</strong> 신경 쓰지 않아도 알아서 굴려주는 편의성</li>
                            <li>
                                <strong>Transparency:</strong> 휴대폰에서 <span class="highlight-text">실시간 확인</span> 가능한 투명한 성과 리포팅
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`,
        3: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서비스 기획 - 3. 법률·경쟁 리스크 분석 및 기회</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
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
            color: #A4C639;
            margin-right: 16px;
            font-size: 28px;
        }
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 24px;
            flex: 1;
        }
        .card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            padding: 24px;
            border-left: 4px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease;
        }
        .card:hover {
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
            color: #111827;
            flex-shrink: 0;
        }
        .card-title {
            font-size: 20px;
            font-weight: 800;
            color: #1f2937;
        }
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
            padding-left: 14px;
            margin-bottom: 6px;
        }
        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #9ca3af;
            font-weight: bold;
        }
        .highlight-text {
            font-weight: 700;
            color: #111827;
            background-color: #f3f4f6;
            padding: 0 4px;
            border-radius: 2px;
        }
        .text-danger {
            color: #ef4444;
            font-weight: 700;
        }
        .text-brand {
            color: #65801c;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <aside class="sidebar">
            <div class="chapter-label">Risk Analysis</div>
            <h1 class="chapter-title">법률·경쟁 리스크<br/>분석 및 기회</h1>
            <div class="nav-group">
                <div class="nav-item">
                    <span class="nav-number">01</span>
                    <span class="nav-text">Overview &amp; Goals</span>
                </div>
                <div class="nav-item active">
                    <span class="nav-number">02</span>
                    <span class="nav-text">Risk &amp; Opportunity</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">03</span>
                    <span class="nav-text">Strategy &amp; Execution</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">04</span>
                    <span class="nav-text">Performance</span>
                </div>
            </div>
        </aside>
        <main class="main-content">
            <header class="page-header">
                <h2 class="page-title">
                    <i class="fas fa-scale-balanced"></i>
                    <p>규제와 경쟁의 이중고 속에서 찾은 돌파구</p>
                </h2>
            </header>
            <div class="analysis-grid">
                <div class="card card-legal">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-gavel"></i></div>
                        <h3 class="card-title">주요 법률 리스크 (Legal)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li><strong>진입 장벽:</strong> 투자일임 서비스는 금융위원회 등록된 '투자일임업자'만 제공 가능</li>
                            <li>
                                <strong>현재 지위 문제:</strong> 당사는 투자일임업 미등록 상태로 <span class="text-danger">법적으로 직접 서비스 불가</span>
                            </li>
                            <li><strong>영업 제한:</strong> 독자적인 앱을 통한 고객 자산 수탁 및 운용 불가능</li>
                        </ul>
                    </div>
                </div>
                <div class="card card-competition">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-users-slash"></i></div>
                        <h3 class="card-title">경쟁 환경 리스크 (Competition)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li><strong>시장 선점:</strong> 대형 증권사·은행이 이미 자체 로보어드바이저 서비스 보유</li>
                            <li>
                                <strong>진입 난이도:</strong> 신규 스타트업이 직접 경쟁하기엔 <span class="highlight-text">자본력 및 신뢰도 열세</span>
                            </li>
                            <li><strong>출시 지연:</strong> 엄격한 금융 규제와 전문 인력 부족으로 인한 서비스 런칭 지연 우려</li>
                        </ul>
                    </div>
                </div>
                <div class="card card-opportunity">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-file-signature"></i></div>
                        <h3 class="card-title">제도 변화 기회 (Opportunity)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li>
                                <strong>규제 완화:</strong> 2019년 5월 금융위원회 <span class="highlight-text">금융투자업 규정 개정</span>
                            </li>
                            <li>
                                <strong>위탁 운용 허용:</strong> "비금융 로보어드바이저 업체도 자산운용사로부터 펀드·일임재산 운용 업무 위탁 가능"
                            </li>
                            <li><strong>시장 활성화:</strong> 핀테크 기업의 진입 장벽을 낮추는 정책적 시그널 포착</li>
                        </ul>
                    </div>
                </div>
                <div class="card card-strategy">
                    <div class="card-header">
                        <div class="card-icon"><i class="fas fa-chess-knight"></i></div>
                        <h3 class="card-title">전략적 판단 (Strategic Pivot)</h3>
                    </div>
                    <div class="card-content">
                        <ul class="bullet-list">
                            <li>
                                <strong>B2B 모델 전환:</strong> 직접 라이선스 취득 대신 <span class="text-brand">금융사 제휴 모델</span>로 피벗(Pivot)
                            </li>
                            <li>
                                <strong>역할 분담:</strong>
                                <div class="mt-1 pl-1 text-sm text-gray-500">
                                    <strong>당사:</strong> 알고리즘 개발 &amp; 앱 UX 제공<br/>
                                    <strong>파트너:</strong> 계좌 개설 &amp; 법적 운용 주체
                                </div>
                            </li>
                            <li class="mt-2">
                                <strong>기대 효과:</strong> 법적 리스크 100% 해소 및 시장 진입 속도(Time-to-market) 단축
                            </li>
                        </ul>
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서비스 기획 - 4. 리스크 해결 & B2B 전략</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
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
            color: #A4C639;
            margin-right: 16px;
            font-size: 28px;
        }
        .page-subtitle {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
        }
        .framework-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            height: 100%;
        }
        .strategy-top {
            background-color: #A4C639;
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 6px -1px rgba(164, 198, 57, 0.3);
        }
        .strategy-badge {
            background-color: rgba(255,255,255,0.25);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: inline-block;
            color: #064e3b;
        }
        .strategy-main-text {
            font-size: 22px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .strategy-sub-text {
            font-size: 16px;
            opacity: 0.95;
            margin-top: 4px;
            font-weight: 500;
        }
        .pillars-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            flex: 1;
        }
        .pillar-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            padding: 24px;
            border-left: 4px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease;
        }
        .pillar-card:hover {
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }
        .pillar-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 18px;
            color: #111827;
            flex-shrink: 0;
        }
        .pillar-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .pillar-content {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
        }
        .check-list li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        .check-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #A4C639;
            font-weight: bold;
        }
        .foundation-box {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px 30px;
            display: flex;
            align-items: center;
        }
        .foundation-title-area {
            width: 200px;
            border-right: 2px solid #cbd5e1;
            margin-right: 30px;
        }
        .foundation-title {
            font-size: 16px;
            font-weight: 800;
            color: #334155;
            display: block;
        }
        .foundation-subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            display: block;
        }
        .foundation-content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .process-step {
            text-align: center;
            position: relative;
            flex: 1;
        }
        .process-step:not(:last-child)::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -20%;
            width: 40%;
            height: 2px;
            background-color: #cbd5e1;
            z-index: 0;
        }
        .step-circle {
            width: 32px;
            height: 32px;
            background-color: white;
            border: 2px solid #64748b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 8px;
            font-weight: 700;
            color: #64748b;
            position: relative;
            z-index: 1;
            font-size: 12px;
        }
        .step-text {
            font-size: 13px;
            font-weight: 600;
            color: #475569;
        }
        .process-step.active .step-circle {
            border-color: #A4C639;
            color: #A4C639;
            background-color: #f7fee7;
        }
        .process-step.active .step-text {
            color: #65a30d;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <aside class="sidebar">
            <div class="chapter-label">Current Chapter</div>
            <h1 class="chapter-title">리스크 해결<br/>&amp; B2B 전략</h1>
            <div class="nav-group">
                <div class="nav-item">
                    <span class="nav-number">01</span>
                    <span class="nav-text">Project Overview</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">02</span>
                    <span class="nav-text">Risk Analysis</span>
                </div>
                <div class="nav-item active">
                    <span class="nav-number">03</span>
                    <span class="nav-text">Solution &amp; Strategy</span>
                </div>
                <div class="nav-item">
                    <span class="nav-number">04</span>
                    <span class="nav-text">Performance</span>
                </div>
            </div>
        </aside>
        <main class="main-content">
            <header class="page-header">
                <h2 class="page-title">
                    <i class="fas fa-chess-board text-green-600 mr-3"></i>
                    위기 돌파를 위한 비즈니스 모델 피벗(Pivot)
                </h2>
                <span class="page-subtitle">Strategic Solution</span>
            </header>
            <div class="framework-container">
                <div class="strategy-top">
                    <div>
                        <span class="strategy-badge">Core Strategy</span>
                        <div class="strategy-main-text">B2B 알고리즘 공급 모델로 전환</div>
                        <div class="strategy-sub-text">직접 서비스의 법적 한계를 극복하고 제도권 금융사와의 협업을 통해 시장 진입</div>
                    </div>
                    <i class="fas fa-rocket text-4xl opacity-40"></i>
                </div>
                <div class="pillars-grid">
                    <div class="pillar-card green">
                        <div class="pillar-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3 class="pillar-title">자체 알고리즘 고도화</h3>
                        <ul class="check-list pillar-content">
                            <li><strong>퀀트 엔진 개발:</strong> 모멘텀/변동성/밸류 등 정량 팩터 기반 포트폴리오 산출</li>
                            <li><strong>개인화 엔진:</strong> 투자자 성향별 맞춤 비중 최적화</li>
                            <li><strong>운영 효율화:</strong> 자동 리밸런싱 및 API 연동 구조 설계</li>
                        </ul>
                    </div>
                    <div class="pillar-card blue">
                        <div class="pillar-icon">
                            <i class="fas fa-handshake"></i>
                        </div>
                        <h3 class="pillar-title">라이선스 파트너 확보</h3>
                        <ul class="check-list pillar-content">
                            <li><strong>독점 계약:</strong> 금융위 등록 투자일임업자 선정 및 계약</li>
                            <li><strong>인프라 연동:</strong> 주문/체결 데이터 실시간 동기화</li>
                            <li><strong>역할 분담:</strong> 운용(파트너사) vs 기술/UX(당사) 명확화</li>
                        </ul>
                    </div>
                    <div class="pillar-card slate">
                        <div class="pillar-icon">
                            <i class="fas fa-file-shield"></i>
                        </div>
                        <h3 class="pillar-title">컴플라이언스 완벽 대응</h3>
                        <ul class="check-list pillar-content">
                            <li><strong>법적 리스크 해소:</strong> 투자일임 행위 주체를 파트너사로 명확화</li>
                            <li><strong>보안 강화:</strong> 금융권 수준의 망분리 및 데이터 암호화</li>
                            <li><strong>감사 추적:</strong> 알고리즘 운용 내역 로그 100% 적재</li>
                        </ul>
                    </div>
                </div>
                <div class="foundation-box">
                    <div class="foundation-title-area">
                        <span class="foundation-title">실행 로드맵</span>
                        <span class="foundation-subtitle">Execution Roadmap</span>
                    </div>
                    <div class="foundation-content">
                        <div class="process-step">
                            <div class="step-circle">1</div>
                            <span class="step-text">PoC 검증<br/>(0-3개월)</span>
                        </div>
                        <div class="process-step">
                            <div class="step-circle">2</div>
                            <span class="step-text">알고리즘 고도화<br/>(3-6개월)</span>
                        </div>
                        <div class="process-step active">
                            <div class="step-circle" style="background-color: #ecfccb; border-color: #84cc16; color: #4d7c0f;">3</div>
                            <span class="step-text" style="color: #4d7c0f;">상용화 &amp; 온보딩<br/>(6-12개월)</span>
                        </div>
                        <div class="process-step">
                            <div class="step-circle">4</div>
                            <span class="step-text">스케일업<br/>(12개월~)</span>
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서비스 기획 - 5. 사업 추진 성과</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
        }
        .sidebar {
            width: 280px;
            background-color: #A4C639;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 60px 40px;
            flex-shrink: 0;
            border-right: 1px solid #e5e7eb;
        }
        .chapter-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.7);
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
            transition: opacity 0.3s, color 0.3s;
            color: #ffffff;
            opacity: 0.7;
        }
        .nav-item.active {
            opacity: 1;
            color: #000000;
            font-weight: 600;
        }
        .nav-number {
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
            width: 20px;
            color: inherit;
        }
        .nav-text {
            font-size: 16px;
            font-weight: 500;
            color: inherit;
        }
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
            color: #A4C639;
            margin-right: 16px;
            font-size: 28px;
        }
        .page-subtitle {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
        }
        .content-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            flex: 1;
        }
        .result-card {
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
            color: #111827;
            flex-shrink: 0;
        }
        .card-title {
            font-size: 20px;
            font-weight: 800;
            color: #1f2937;
        }
        .icon-growth { background-color: #f0fdf4; color: #65a30d; }
        .stat-row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 10px;
        }
        .stat-value {
            font-size: 36px;
            font-weight: 900;
            color: #4d7c0f;
            line-height: 1;
            margin-right: 8px;
        }
        .stat-unit {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .growth-badge {
            background-color: #ecfccb;
            color: #365314;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            margin-left: auto;
            margin-bottom: 6px;
        }
        .chart-wrapper-growth {
            flex: 1;
            position: relative;
            width: 100%;
            min-height: 80px;
        }
        .icon-internal { background-color: #f7fee7; color: #3f6212; }
        .improvement-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .improvement-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 14px;
        }
        .check-icon {
            color: #84cc16;
            margin-right: 10px;
            margin-top: 4px;
        }
        .improvement-text strong {
            color: #334155;
            font-weight: 700;
            display: block;
            font-size: 15px;
        }
        .improvement-text p {
            color: #64748b;
            font-size: 13px;
            margin: 2px 0 0 0;
            line-height: 1.4;
        }
        .icon-impact { background-color: #f0fdfa; color: #0d9488; }
        .impact-flow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            position: relative;
        }
        .impact-step {
            text-align: center;
            width: 30%;
            background-color: #f9fafb;
            padding: 12px 4px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            position: relative;
            z-index: 1;
        }
        .impact-step.final {
            background-color: #ecfccb;
            border-color: #bef264;
            box-shadow: 0 2px 4px rgba(132, 204, 22, 0.1);
        }
        .impact-step h4 {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 4px;
            color: #4b5563;
        }
        .impact-step.final h4 { color: #3f6212; }
        .impact-step span {
            font-size: 10px;
            color: #9ca3af;
            display: block;
            line-height: 1.2;
        }
        .impact-step.final span { color: #4d7c0f; }
        .flow-arrow {
            color: #d1d5db;
            font-size: 12px;
        }
        .impact-summary {
            margin-top: auto;
            padding: 12px;
            background-color: #f8fafc;
            border-left: 3px solid #84cc16;
            font-size: 13px;
            color: #475569;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <aside class="sidebar">
            <div class="chapter-label">Current Chapter</div>
            <h1 class="chapter-title">사업 추진<br/>성 과</h1>
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
                    <span class="nav-text">B2B Strategy</span>
                </div>
                <div class="nav-item active">
                    <span class="nav-number">04</span>
                    <span class="nav-text">Results &amp; Impact</span>
                </div>
            </div>
        </aside>
        <main class="main-content">
            <header class="page-header">
                <h2 class="page-title">
                    <i class="fas fa-chart-bar text-lime-600 mr-3"></i>
                    B2B 모델 전환을 통한 시장 조기 안착 및 성과 창출
                </h2>
                <span class="page-subtitle">Performance &amp; Business Impact</span>
            </header>
            <div class="content-grid">
                <div class="result-card">
                    <div class="card-header">
                        <div class="card-icon icon-growth"><i class="fas fa-sack-dollar"></i></div>
                        <h3 class="card-title">핵심 성과 (Key Results)</h3>
                    </div>
                    <div class="stat-row">
                        <span class="stat-value">80억</span>
                        <span class="stat-unit">원</span>
                        <div class="growth-badge">출시 3개월 누적 계약</div>
                    </div>
                    <div class="chart-wrapper-growth">
                        <canvas id="growthChart"></canvas>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                        <div style="font-size: 12px; color: #64748b;">
                            <strong>사용자 재투자율</strong> <span style="color: #4d7c0f; font-weight: 700;">62%</span>
                        </div>
                        <div style="font-size: 12px; color: #64748b;">
                            <strong>알고리즘 신뢰도 검증</strong>
                        </div>
                    </div>
                </div>
                <div class="result-card">
                    <div class="card-header">
                        <div class="card-icon icon-internal"><i class="fas fa-server"></i></div>
                        <h3 class="card-title">구조적 개선 &amp; 내부 성과</h3>
                    </div>
                    <ul class="improvement-list">
                        <li class="improvement-item">
                            <i class="fas fa-check-circle check-icon"></i>
                            <div class="improvement-text">
                                <strong>투자성과 리포팅 자동화</strong>
                                <p>고객별 수익률 계산 및 리포트 발송 자동화로 운영비 절감</p>
                            </div>
                        </li>
                        <li class="improvement-item">
                            <i class="fas fa-check-circle check-icon"></i>
                            <div class="improvement-text">
                                <strong>신규 B2B 매출 파이프라인</strong>
                                <p>파트너사의 추가 알고리즘 개발 의뢰 확보</p>
                            </div>
                        </li>
                        <li class="improvement-item">
                            <i class="fas fa-check-circle check-icon"></i>
                            <div class="improvement-text">
                                <strong>후속 서비스 기반 마련</strong>
                                <p>자문/리밸런싱 고도화를 위한 데이터 인프라 구축</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="result-card">
                    <div class="card-header">
                        <div class="card-icon icon-impact"><i class="fas fa-flag-checkered"></i></div>
                        <h3 class="card-title">사업 임팩트 (Business Impact)</h3>
                    </div>
                    <div class="impact-flow">
                        <div class="impact-step">
                            <h4>Risks Removed</h4>
                            <span>법적 위험 해소</span>
                        </div>
                        <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                        <div class="impact-step">
                            <h4>Market Entry</h4>
                            <span>시장 진입 가속</span>
                        </div>
                        <div class="flow-arrow"><i class="fas fa-chevron-right"></i></div>
                        <div class="impact-step final">
                            <h4>Scaling Up</h4>
                            <span>성장 기반 확보</span>
                        </div>
                    </div>
                    <div class="impact-summary">
                        <p>
                            <strong>"규제 리스크를 B2B 기회로 전환"</strong><br/>
                            직접 서비스의 한계를 극복하고, 금융사 파트너십을 통해 안정적인 운용 자산(AUM) 확보 및 스케일업 발판 마련
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script>
        // 차트 스크립트
        const ctxGrowth = document.getElementById('growthChart');
        if (ctxGrowth) {
            const growthChart = new Chart(ctxGrowth.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['M+1', 'M+2', 'M+3'],
                    datasets: [{
                        label: '누적 계약액 (억원)',
                        data: [20, 50, 80],
                        backgroundColor: [
                            '#d9f99d',
                            '#a3e635',
                            '#65a30d'
                        ],
                        borderRadius: 4,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { display: false }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: 'Noto Sans KR', size: 11 } }
                        }
                    },
                    animation: { duration: 0 }
                }
            });
        }
    </script>
</body>
</html>`
    };

    // 전략2 파일 내용을 객체로 저장
    const strategy2Contents = {
        1: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>전략기획 포트폴리오 표지</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #051c2c;
            color: #ffffff;
            overflow: hidden;
        }
        .slide-container {
            width: 1920px;
            height: 1080px;
            display: flex;
            flex-direction: column;
            position: relative;
            background-color: #051c2c;
            justify-content: center;
            align-items: center;
        }

        /* Abstract Geometric Background Elements */
        .geo-shape {
            position: absolute;
            z-index: 0;
            opacity: 0.1;
            border: 2px solid #94a3b8;
        }
        
        /* Circle representing Environment/Data */
        .shape-circle-1 {
            width: 600px;
            height: 600px;
            border-radius: 50%;
            top: -150px;
            left: -150px;
            border-color: #60a5fa;
        }
        
        /* Square representing Structure */
        .shape-square-1 {
            width: 400px;
            height: 400px;
            bottom: 100px;
            right: 100px;
            border: 2px solid #94a3b8;
            transform: rotate(15deg);
        }

        /* Connecting Lines representing Strategy Pivot */
        .line-deco {
            position: absolute;
            background-color: #475569;
            z-index: 0;
            opacity: 0.3;
        }
        .line-vertical {
            width: 1px;
            height: 100%;
            left: 20%;
            top: 0;
        }
        .line-horizontal {
            width: 100%;
            height: 1px;
            top: 85%;
            left: 0;
        }

        /* Content Wrapper */
        .content-wrapper {
            z-index: 10;
            text-align: center;
            max-width: 1400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 60px;
        }

        /* Typography */
        .portfolio-label {
            font-size: 24px;
            letter-spacing: 0.4em;
            color: #94a3b8;
            font-weight: 500;
            text-transform: uppercase;
            margin-bottom: 20px;
            position: relative;
        }
        .portfolio-label::after {
            content: '';
            display: block;
            width: 60px;
            height: 2px;
            background-color: #60a5fa;
            margin: 20px auto 0;
        }

        .main-headline {
            font-size: 72px;
            font-weight: 700; /* Bold */
            line-height: 1.3;
            color: #f8fafc;
            word-break: keep-all;
        }
        
        .main-headline .highlight {
            color: #60a5fa; /* Light Blue for emphasis */
        }

        .project-period {
            margin-top: 40px;
            font-size: 28px;
            color: #cbd5e1;
            font-weight: 300;
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 40px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            border-radius: 4px;
            background-color: rgba(5, 28, 44, 0.5); /* Semi-transparent background */
        }
        
        .period-icon {
            font-size: 20px;
            color: #60a5fa;
        }

        /* Subtle Grid Pattern */
        .grid-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 120px 120px;
            z-index: 0;
            pointer-events: none;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Background Elements -->
<div class="grid-bg"></div>
<div class="geo-shape shape-circle-1"></div>
<div class="geo-shape shape-square-1"></div>
<div class="line-deco line-vertical"></div>
<div class="line-deco line-horizontal"></div>
<!-- Main Content -->
<div class="content-wrapper">
<div>
<p class="portfolio-label">Strategic Planning Portfolio</p>
</div>
<h1 class="main-headline">
<p>환경 변화와 고객 데이터를 기준으로</p>
<p>성과가 검증된 자산을</p>
<p class="mt-4"><span class="highlight">확장 가능한 사업 구조로 전환</span></p>
</h1>
<div class="project-period">
<i class="far fa-calendar-alt period-icon"></i>
<p>Project Period : 2020 - 2022</p>
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
<title>환경 변화 - 타임라인</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            overflow: hidden;
        }
        .slide-container {
            width: 1920px;
            height: 1080px;
            display: flex;
            background-color: #f8fafc;
        }
        
        /* Sidebar Styling (Scale up for 1920px) */
        .sidebar {
            width: 420px;
            background-color: #051c2c; /* Deep Navy to match Cover */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 80px 60px;
            flex-shrink: 0;
            justify-content: space-between;
        }
        .chapter-label {
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #94a3b8;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 56px;
            font-weight: 900;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 80px;
        }
        .nav-group {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            opacity: 0.4;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
        }
        .nav-item.active .nav-text {
            color: #60a5fa; /* Blue Highlight */
        }
        .nav-number {
            font-size: 24px;
            font-weight: 700;
            margin-right: 24px;
            color: #64748b;
            min-width: 40px;
        }
        .nav-item.active .nav-number {
            color: #60a5fa;
        }
        .nav-text {
            font-size: 28px;
            font-weight: 500;
            color: #e2e8f0;
        }
        
        /* Main Content Styling */
        .main-content {
            flex: 1;
            padding: 100px 120px;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        /* Page Header */
        .page-header {
            margin-bottom: 80px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .page-title-group {
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .page-icon {
            font-size: 48px;
            color: #051c2c;
        }
        .page-title {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
        }
        .page-subtitle {
            font-size: 24px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 10px;
        }

        /* Timeline Flow Layout */
        .flow-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            padding: 0 40px;
        }
        
        /* Background Connector Line */
        .connector-line {
            position: absolute;
            top: 40%;
            left: 100px;
            right: 100px;
            height: 4px;
            background-color: #e2e8f0;
            z-index: 0;
        }

        /* Stage Cards */
        .stage-card {
            width: 380px;
            height: 520px;
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 10;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.3s ease;
            border: 1px solid #f1f5f9;
        }
        .stage-card:hover {
            transform: translateY(-10px);
        }

        /* Card Visual Header */
        .card-visual {
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .card-visual.step1 { background-color: #eff6ff; }
        .card-visual.step2 { background-color: #f0fdf4; }
        .card-visual.step3 { background-color: #fef2f2; }

        .visual-icon {
            font-size: 80px;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        .step1 .visual-icon { color: #3b82f6; }
        .step2 .visual-icon { color: #10b981; }
        .step3 .visual-icon { color: #ef4444; }

        .step-badge {
            position: absolute;
            top: 24px;
            left: 24px;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.05em;
            background-color: rgba(255,255,255,0.9);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .step1 .step-badge { color: #2563eb; }
        .step2 .step-badge { color: #059669; }
        .step3 .step-badge { color: #dc2626; }

        /* Card Content */
        .card-content {
            padding: 40px 32px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .card-title {
            font-size: 32px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 24px;
            line-height: 1.3;
        }
        .card-desc-box {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin-top: auto;
        }
        .desc-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .desc-row:last-child { margin-bottom: 0; }
        .desc-bullet {
            color: #94a3b8;
            margin-right: 12px;
            font-weight: bold;
            margin-top: 6px;
        }
        .desc-text {
            font-size: 20px;
            color: #475569;
            font-weight: 500;
            line-height: 1.5;
        }

        /* Arrows between cards */
        .flow-arrow {
            font-size: 40px;
            color: #cbd5e1;
            z-index: 5;
        }
        
        /* Bottom Highlight Bar */
        .highlight-bar {
            margin-top: 60px;
            background-color: #051c2c;
            border-radius: 16px;
            padding: 30px 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .highlight-title {
            color: #94a3b8;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .highlight-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: 500;
        }
        .highlight-text strong {
            color: #60a5fa;
            font-weight: 800;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div>
<p class="chapter-label">Part 01</p>
<h1 class="chapter-title">환경 변화</h1>
<div class="nav-group">
<div class="nav-item active">
<span class="nav-number">01</span>
<span class="nav-text">Context Shift</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Structure</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Strategy Pivot</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Expansion</span>
</div>
</div>
</div>
<div style="opacity: 0.3; font-size: 14px;">
<p>Strategic Portfolio 2020-2022</p>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<div class="page-title-group">
<i class="fas fa-arrow-trend-up page-icon"></i>
<h2 class="page-title">
<p>외부 환경 변화에 따른 사용성 제약 발생</p>
</h2>
</div>
<span class="page-subtitle">From Pandemic to Endemic Transition</span>
</header>
<div class="flow-container">
<div class="connector-line"></div>
<!-- Step 1: 코로나 -->
<div class="stage-card">
<div class="card-visual step1">
<span class="step-badge">PHASE 1</span>
<i class="fas fa-house-laptop visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">재택근무 확산</h3>
<div class="card-desc-box">
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">코로나19 팬데믹</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">개인 PC 중심 업무</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">설치형 SW 활용 용이</p>
</div>
</div>
</div>
</div>
<!-- Arrow -->
<i class="fas fa-chevron-right flow-arrow"></i>
<!-- Step 2: 전환 -->
<div class="stage-card">
<div class="card-visual step2">
<span class="step-badge">TRANSITION</span>
<i class="fas fa-briefcase visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">근무 환경 전환</h3>
<div class="card-desc-box">
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">엔데믹 기조 확대</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">오피스 출근 재개</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">하이브리드 워크</p>
</div>
</div>
</div>
</div>
<!-- Arrow -->
<i class="fas fa-chevron-right flow-arrow"></i>
<!-- Step 3: 제약 -->
<div class="stage-card">
<div class="card-visual step3">
<span class="step-badge">PHASE 2</span>
<i class="fas fa-ban visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">사용 환경 제약</h3>
<div class="card-desc-box">
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">사내 보안망 접속</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">외부 프로그램 설치 차단</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text text-red-500 font-bold">기존 모델 작동 불능</p>
</div>
</div>
</div>
</div>
</div>
<!-- Bottom Insight -->
<div class="highlight-bar">
<span class="highlight-title">Key Implication</span>
<p class="highlight-text">
                물리적 근무 환경 변화로 인한 <strong class="ml-2">서비스 접근성 단절 위기</strong> 직면
            </p>
</div>
</main>
</div>
</body>
</html>`,
        3: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>전략 판단의 주체 - 구조도</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            overflow: hidden;
        }
        .slide-container {
            width: 1920px;
            height: 1080px;
            display: flex;
            background-color: #f8fafc;
        }
        
        /* Sidebar Styling */
        .sidebar {
            width: 420px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 80px 60px;
            flex-shrink: 0;
            justify-content: space-between;
        }
        .chapter-label {
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #94a3b8;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 56px;
            font-weight: 900;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 80px;
        }
        .nav-group {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            opacity: 0.4;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
        }
        .nav-item.active .nav-text {
            color: #60a5fa;
        }
        .nav-number {
            font-size: 24px;
            font-weight: 700;
            margin-right: 24px;
            color: #64748b;
            min-width: 40px;
        }
        .nav-item.active .nav-number {
            color: #60a5fa;
        }
        .nav-text {
            font-size: 28px;
            font-weight: 500;
            color: #e2e8f0;
        }
        
        /* Main Content Styling */
        .main-content {
            flex: 1;
            padding: 100px 120px;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        /* Page Header */
        .page-header {
            margin-bottom: 60px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .page-title-group {
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .page-icon {
            font-size: 48px;
            color: #051c2c;
        }
        .page-title {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
        }
        .page-subtitle {
            font-size: 24px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 10px;
        }

        /* Diagram Layout */
        .diagram-container {
            flex: 1;
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            gap: 40px;
            padding: 20px 0;
        }

        .column-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 30px;
        }
        .col-source { width: 300px; }
        .col-filter { flex: 1; max-width: 450px; }
        .col-dest { width: 300px; }

        /* Role Cards */
        .role-card {
            background-color: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
        }
        
        /* Input Data Cards */
        .data-card {
            background-color: #f1f5f9;
            border-left: 6px solid #94a3b8;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .data-card.qualitative { border-color: #3b82f6; background-color: #eff6ff; }
        .data-card.quantitative { border-color: #10b981; background-color: #ecfdf5; }
        .data-card.painpoint { border-color: #ef4444; background-color: #fef2f2; }

        .data-icon { font-size: 24px; margin-bottom: 10px; }
        .qualitative .data-icon { color: #3b82f6; }
        .quantitative .data-icon { color: #10b981; }
        .painpoint .data-icon { color: #ef4444; }

        .data-title { font-weight: 700; color: #334155; font-size: 18px; margin-bottom: 4px; }
        .data-desc { font-size: 16px; color: #64748b; }

        /* My Role (Center) */
        .me-card {
            background-color: #ffffff;
            border: 3px solid #051c2c;
            height: 100%;
            justify-content: center;
            position: relative;
            z-index: 10;
        }
        .me-badge {
            background-color: #051c2c;
            color: white;
            padding: 8px 24px;
            border-radius: 50px;
            font-weight: 800;
            position: absolute;
            top: -20px;
            font-size: 18px;
            letter-spacing: 0.05em;
        }
        .me-title { font-size: 36px; font-weight: 900; color: #0f172a; margin: 20px 0 10px; }
        .me-role-list { text-align: left; width: 100%; margin-top: 30px; }
        .role-item { 
            display: flex; 
            align-items: center; 
            margin-bottom: 16px; 
            font-size: 20px; 
            color: #475569;
            background-color: #f8fafc;
            padding: 12px 20px;
            border-radius: 8px;
        }
        .role-item i { margin-right: 15px; color: #3b82f6; width: 24px; text-align: center; }

        /* Team (Right) */
        .team-card {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            opacity: 0.8;
            padding: 24px;
        }
        .team-role { font-size: 16px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .team-name { font-size: 24px; font-weight: 800; color: #334155; margin-top: 5px; }

        /* Arrows */
        .arrow-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 80px;
            color: #cbd5e1;
        }
        .big-arrow { font-size: 40px; color: #94a3b8; }
        .arrow-label { 
            font-size: 14px; 
            font-weight: 700; 
            color: #64748b; 
            margin-top: 8px; 
            text-align: center;
        }

        /* Bottom Highlight Bar */
        .highlight-bar {
            margin-top: 40px;
            background-color: #051c2c;
            border-radius: 16px;
            padding: 30px 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .highlight-title {
            color: #94a3b8;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .highlight-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: 500;
        }
        .highlight-text strong {
            color: #60a5fa;
            font-weight: 800;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div>
<p class="chapter-label">Part 02</p>
<h1 class="chapter-title">전략 판단<br/>주체</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context Shift</span>
</div>
<div class="nav-item active">
<span class="nav-number">02</span>
<span class="nav-text">Structure</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Strategy Pivot</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Expansion</span>
</div>
</div>
</div>
<div style="opacity: 0.3; font-size: 14px;">
<p>Strategic Portfolio 2020-2022</p>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<div class="page-title-group">
<i class="fas fa-sitemap page-icon"></i>
<h2 class="page-title">
<p>고객 데이터 접근 위치와 전략 판단 주체</p>
</h2>
</div>
<span class="page-subtitle">Unique Position in 4-Member Early Stage Startup</span>
</header>
<!-- Diagram Content -->
<div class="diagram-container">
<!-- Column 1: Data Sources -->
<div class="column-box col-source">
<div class="data-card qualitative">
<i class="fas fa-comments data-icon"></i>
<p class="data-title">정성적 공감</p>
<p class="data-desc">직접 고객 문의 응대 및 니즈 파악</p>
</div>
<div class="data-card painpoint">
<i class="fas fa-exclamation-triangle data-icon"></i>
<p class="data-title">사용 제약 확인</p>
<p class="data-desc">설치 불가 등 환경적 제약 사항 수집</p>
</div>
<div class="data-card quantitative">
<i class="fas fa-chart-line data-icon"></i>
<p class="data-title">정량 데이터</p>
<p class="data-desc">사용 패턴 및 접속 로그 분석</p>
</div>
</div>
<!-- Arrow -->
<div class="arrow-container">
<i class="fas fa-chevron-right big-arrow"></i>
<p class="arrow-label">DATA INFLOW</p>
</div>
<!-- Column 2: ME (Strategist) -->
<div class="column-box col-filter">
<div class="role-card me-card">
<span class="me-badge">MY POSITION</span>
<div style="margin-top: 20px;">
<i class="fas fa-user-tag" style="font-size: 60px; color: #051c2c;"></i>
</div>
<h3 class="me-title">전략기획 / 운영</h3>
<p style="color: #64748b; font-size: 18px; margin-bottom: 20px;">Bridge between User &amp; Product</p>
<div class="me-role-list">
<div class="role-item">
<i class="fas fa-clipboard-check"></i>
<p>고객 접점 데이터 수집</p>
</div>
<div class="role-item">
<i class="fas fa-layer-group"></i>
<p>구조 전환 가설 수립</p>
</div>
<div class="role-item">
<i class="fas fa-file-powerpoint"></i>
<p>의사결정 자료화</p>
</div>
</div>
</div>
</div>
<!-- Arrow -->
<div class="arrow-container">
<i class="fas fa-chevron-right big-arrow"></i>
<p class="arrow-label">STRATEGY PROPOSAL</p>
</div>
<!-- Column 3: The Team -->
<div class="column-box col-dest">
<div class="role-card team-card">
<p class="team-role">Decision Maker</p>
<p class="team-name">CEO</p>
<i class="fas fa-gavel" style="margin-top: 15px; color: #94a3b8; font-size: 24px;"></i>
</div>
<div class="role-card team-card">
<p class="team-role">Product Execution</p>
<p class="team-name">Dev Team</p>
<div style="display: flex; gap: 10px; margin-top: 15px; justify-content: center;">
<i class="fas fa-code" style="color: #94a3b8; font-size: 20px;"></i>
<i class="fas fa-server" style="color: #94a3b8; font-size: 20px;"></i>
</div>
</div>
</div>
</div>
<!-- Bottom Insight -->
<div class="highlight-bar">
<span class="highlight-title">Key Position</span>
<p class="highlight-text">
                고객 데이터 최전방 접근을 통해 <strong class="ml-2">구조 전환의 타당성 확보</strong>
</p>
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
<title>전략 전환 - 구조 및 성과</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
<style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            overflow: hidden;
        }
        .slide-container {
            width: 1920px;
            height: 1080px;
            display: flex;
            background-color: #f8fafc;
        }
        
        /* Sidebar Styling */
        .sidebar {
            width: 420px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 80px 60px;
            flex-shrink: 0;
            justify-content: space-between;
        }
        .chapter-label {
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #94a3b8;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 56px;
            font-weight: 900;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 80px;
        }
        .nav-group {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            opacity: 0.4;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
        }
        .nav-item.active .nav-text {
            color: #60a5fa;
        }
        .nav-number {
            font-size: 24px;
            font-weight: 700;
            margin-right: 24px;
            color: #64748b;
            min-width: 40px;
        }
        .nav-item.active .nav-number {
            color: #60a5fa;
        }
        .nav-text {
            font-size: 28px;
            font-weight: 500;
            color: #e2e8f0;
        }
        
        /* Main Content Styling */
        .main-content {
            flex: 1;
            padding: 100px 120px;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        /* Page Header */
        .page-header {
            margin-bottom: 60px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .page-title-group {
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .page-icon {
            font-size: 48px;
            color: #051c2c;
        }
        .page-title {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
        }
        .page-subtitle {
            font-size: 24px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 10px;
        }

        /* Content Layout */
        .flow-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            padding: 0;
            gap: 30px;
        }
        
        /* Stage Cards */
        .stage-card {
            flex: 1;
            height: 560px;
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 10;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.3s ease;
            border: 1px solid #f1f5f9;
        }
        
        /* Card Visual Header */
        .card-visual {
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background-color: #f8fafc; /* Solid background replacing gradient */
        }
        .card-visual.type-logic { background-color: #eff6ff; }
        .card-visual.type-tech { background-color: #f0fdf4; }
        .card-visual.type-data { background-color: #fff1f2; }

        .visual-icon {
            font-size: 80px;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        .type-logic .visual-icon { color: #3b82f6; }
        .type-tech .visual-icon { color: #10b981; }
        
        .step-badge {
            position: absolute;
            top: 24px;
            left: 24px;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.05em;
            background-color: rgba(255,255,255,0.9);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .type-logic .step-badge { color: #2563eb; }
        .type-tech .step-badge { color: #059669; }
        .type-data .step-badge { color: #e11d48; }

        /* Card Content */
        .card-content {
            padding: 30px 28px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .card-title {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        .card-desc-box {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 18px;
            margin-top: auto;
        }
        .desc-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        .desc-row:last-child { margin-bottom: 0; }
        .desc-bullet {
            color: #94a3b8;
            margin-right: 10px;
            font-weight: bold;
            margin-top: 6px;
        }
        .desc-text {
            font-size: 18px;
            color: #475569;
            font-weight: 500;
            line-height: 1.5;
        }
        
        /* Bottom Highlight Bar */
        .highlight-bar {
            margin-top: 50px;
            background-color: #051c2c;
            border-radius: 16px;
            padding: 24px 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .highlight-title {
            color: #94a3b8;
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .highlight-text {
            color: #ffffff;
            font-size: 24px;
            font-weight: 500;
        }
        .highlight-text strong {
            color: #60a5fa;
            font-weight: 800;
        }

        /* Chart Container specific */
        .chart-wrapper {
            width: 85%;
            height: 85%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div>
<p class="chapter-label">Part 01</p>
<h1 class="chapter-title">전략 수립</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context Shift</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Structure</span>
</div>
<div class="nav-item active">
<span class="nav-number">03</span>
<span class="nav-text">Strategy Pivot</span>
</div>
<div class="nav-item">
<span class="nav-number">04</span>
<span class="nav-text">Expansion</span>
</div>
</div>
</div>
<div style="opacity: 0.3; font-size: 14px;">
<p>Strategic Portfolio 2020-2022</p>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<div class="page-title-group">
<i class="fas fa-shuffle page-icon"></i>
<h2 class="page-title">
<p>신뢰와 안정성 중심의 구조 전환</p>
</h2>
</div>
<span class="page-subtitle">Pivoting to Institutional Standards</span>
</header>
<div class="flow-container">
<!-- Card 1: Logic -->
<div class="stage-card">
<div class="card-visual type-logic">
<span class="step-badge">STRATEGY</span>
<i class="fas fa-building-columns visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">제도권 제휴 구조</h3>
<div class="card-desc-box">
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">개발사 단독 B2C 확장 한계</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">제도권 금융사 감독 편입</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">소비자 보호 및 신뢰 확보</p>
</div>
</div>
</div>
</div>
<!-- Card 2: Tech -->
<div class="stage-card">
<div class="card-visual type-tech">
<span class="step-badge">ARCHITECTURE</span>
<i class="fas fa-server visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">서버 기반 전환</h3>
<div class="card-desc-box">
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">알고리즘 서버 구동 방식</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">사용자 기기는 승인 권한만</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">통신 불안정 리스크 차단</p>
</div>
</div>
</div>
</div>
<!-- Card 3: Performance -->
<div class="stage-card">
<div class="card-visual type-data">
<span class="step-badge">VALIDATION</span>
<div class="chart-wrapper">
<canvas id="performanceChart"></canvas>
</div>
</div>
<div class="card-content">
<h3 class="card-title">성과 검증 (Alpha)</h3>
<div class="card-desc-box">
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">팬데믹 직후 시장 대비 우위</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text">모의투자대회 1위 기록 검증</p>
</div>
<div class="desc-row">
<span class="desc-bullet">•</span>
<p class="desc-text text-red-500 font-bold">시장 -13% vs 자사 +4.43%</p>
</div>
</div>
</div>
</div>
</div>
<!-- Bottom Insight -->
<div class="highlight-bar">
<span class="highlight-title">Pivot Criteria</span>
<p class="highlight-text">
                안정적인 서버 구조와 검증된 성과 데이터를 기반으로 <strong class="ml-2">제도권 진입 자격 획득</strong>
</p>
</div>
</main>
</div>
<script>
        // Chart.js Configuration
        const ctx = document.getElementById('performanceChart').getContext('2d');
        const performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['시장 평균', '자사 알고리즘'],
                datasets: [{
                    label: '수익률 (%)',
                    data: [-13, 4.43],
                    backgroundColor: [
                        '#94a3b8', // Slate 400 for Market
                        '#e11d48'  // Rose 600 for Algo
                    ],
                    borderRadius: 8,
                    barThickness: 50
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#1e293b',
                        anchor: function(context) {
                            return context.dataset.data[context.dataIndex] >= 0 ? 'end' : 'start';
                        },
                        align: function(context) {
                            return context.dataset.data[context.dataIndex] >= 0 ? 'top' : 'bottom';
                        },
                        formatter: function(value) {
                            return (value > 0 ? '+' : '') + value + '%';
                        },
                        font: {
                            weight: 'bold',
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            display: true,
                            drawBorder: false,
                            color: '#e2e8f0'
                        },
                        ticks: {
                            display: true,
                            font: {
                                size: 12
                            }
                        },
                        suggestedMin: -20,
                        suggestedMax: 20
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: '#334155'
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        bottom: 10
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    </script>
</body>
</html>`,
        5: `<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>확장 방향 - 전략 추진 프로세스</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
<style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #f8fafc;
            overflow: hidden;
        }
        .slide-container {
            width: 1920px;
            height: 1080px;
            display: flex;
            background-color: #f8fafc;
        }
        
        /* Sidebar Styling */
        .sidebar {
            width: 420px;
            background-color: #051c2c;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 80px 60px;
            flex-shrink: 0;
            justify-content: space-between;
        }
        .chapter-label {
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #94a3b8;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .chapter-title {
            font-size: 56px;
            font-weight: 900;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 80px;
        }
        .nav-group {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        .nav-item {
            display: flex;
            align-items: center;
            opacity: 0.4;
            transition: opacity 0.3s;
        }
        .nav-item.active {
            opacity: 1;
        }
        .nav-item.active .nav-text {
            color: #60a5fa;
        }
        .nav-number {
            font-size: 24px;
            font-weight: 700;
            margin-right: 24px;
            color: #64748b;
            min-width: 40px;
        }
        .nav-item.active .nav-number {
            color: #60a5fa;
        }
        .nav-text {
            font-size: 28px;
            font-weight: 500;
            color: #e2e8f0;
        }
        
        /* Main Content Styling */
        .main-content {
            flex: 1;
            padding: 100px 120px;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        /* Page Header */
        .page-header {
            margin-bottom: 60px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .page-title-group {
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .page-icon {
            font-size: 48px;
            color: #051c2c;
        }
        .page-title {
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
        }
        .page-subtitle {
            font-size: 24px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 10px;
        }

        /* Timeline Flow Layout */
        .flow-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            padding: 0 40px;
        }
        
        /* Background Connector Line */
        .connector-line {
            position: absolute;
            top: 40%;
            left: 100px;
            right: 100px;
            height: 4px;
            background-color: #e2e8f0;
            z-index: 0;
        }

        /* Stage Cards */
        .stage-card {
            width: 380px;
            height: 540px;
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 10;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.3s ease;
            border: 1px solid #f1f5f9;
        }
        
        /* Card Visual Header - Customized Colors for Strategy Stages */
        .card-visual {
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        /* Step 1: Analysis (Blue) */
        .card-visual.step1 { background-color: #eff6ff; }
        .step1 .visual-icon { color: #3b82f6; }
        .step1 .step-badge { color: #2563eb; }
        
        /* Step 2: Planning (Indigo/Purple) */
        .card-visual.step2 { background-color: #eef2ff; }
        .step2 .visual-icon { color: #6366f1; }
        .step2 .step-badge { color: #4f46e5; }
        
        /* Step 3: Execution (Teal/Green) */
        .card-visual.step3 { background-color: #f0fdfa; }
        .step3 .visual-icon { color: #14b8a6; }
        .step3 .step-badge { color: #0d9488; }

        .visual-icon {
            font-size: 80px;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }

        .step-badge {
            position: absolute;
            top: 24px;
            left: 24px;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.05em;
            background-color: rgba(255,255,255,0.9);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        /* Card Content */
        .card-content {
            padding: 36px 32px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .card-title {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        .card-desc-box {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin-top: auto;
            border: 1px solid #e2e8f0;
        }
        
        /* Process List Style */
        .process-item {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            position: relative;
        }
        .process-item:last-child { margin-bottom: 0; }
        .process-number {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #cbd5e1;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            flex-shrink: 0;
        }
        .step1 .process-number { background-color: #93c5fd; }
        .step2 .process-number { background-color: #a5b4fc; }
        .step3 .process-number { background-color: #5eead4; }
        
        .process-text {
            font-size: 19px;
            color: #475569;
            font-weight: 600;
            line-height: 1.4;
        }

        /* Arrows between cards */
        .flow-arrow {
            font-size: 40px;
            color: #cbd5e1;
            z-index: 5;
        }
        
        /* Bottom Highlight Bar */
        .highlight-bar {
            margin-top: 50px;
            background-color: #051c2c;
            border-radius: 16px;
            padding: 30px 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .highlight-title {
            color: #94a3b8;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .highlight-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: 500;
        }
        .highlight-text strong {
            color: #60a5fa;
            font-weight: 800;
        }

    </style>
</head>
<body>
<div class="slide-container">
<!-- Sidebar -->
<aside class="sidebar">
<div>
<p class="chapter-label">Part 04</p>
<h1 class="chapter-title">확장 방향</h1>
<div class="nav-group">
<div class="nav-item">
<span class="nav-number">01</span>
<span class="nav-text">Context Shift</span>
</div>
<div class="nav-item">
<span class="nav-number">02</span>
<span class="nav-text">Structure</span>
</div>
<div class="nav-item">
<span class="nav-number">03</span>
<span class="nav-text">Strategy Pivot</span>
</div>
<div class="nav-item active">
<span class="nav-number">04</span>
<span class="nav-text">Expansion</span>
</div>
</div>
</div>
<div style="opacity: 0.3; font-size: 14px;">
<p>Strategic Portfolio 2020-2022</p>
</div>
</aside>
<!-- Main Content -->
<main class="main-content">
<header class="page-header">
<div class="page-title-group">
<i class="fas fa-route page-icon"></i>
<h2 class="page-title">
<p>전략 공감 기반의 구조 전환 추진</p>
</h2>
</div>
<span class="page-subtitle">Process &amp; Role Definition</span>
</header>
<div class="flow-container">
<div class="connector-line"></div>
<!-- Step 1: 가설 및 발견 -->
<div class="stage-card">
<div class="card-visual step1">
<span class="step-badge">STEP 1. DISCOVERY</span>
<i class="fas fa-magnifying-glass-chart visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">데이터 기반 가설</h3>
<div class="card-desc-box">
<div class="process-item">
<span class="process-number">1</span>
<p class="process-text">고객 접점 데이터 지속 수집</p>
</div>
<div class="process-item">
<span class="process-number">2</span>
<p class="process-text">구조 전환 필요성 가설 수립</p>
</div>
</div>
</div>
</div>
<!-- Arrow -->
<i class="fas fa-chevron-right flow-arrow"></i>
<!-- Step 2: 전략 설계 -->
<div class="stage-card">
<div class="card-visual step2">
<span class="step-badge">STEP 2. STRATEGY</span>
<i class="fas fa-chess-board visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">전략 구체화</h3>
<div class="card-desc-box">
<div class="process-item">
<span class="process-number">3</span>
<p class="process-text">전략 설계 및 실행안 구체화</p>
</div>
<div class="process-item">
<span class="process-number">4</span>
<p class="process-text">경영진 의사결정 자료 정리</p>
</div>
</div>
</div>
</div>
<!-- Arrow -->
<i class="fas fa-chevron-right flow-arrow"></i>
<!-- Step 3: 실행 및 확장 -->
<div class="stage-card">
<div class="card-visual step3">
<span class="step-badge">STEP 3. EXECUTION</span>
<i class="fas fa-rocket visual-icon"></i>
</div>
<div class="card-content">
<h3 class="card-title">합의 및 전환 실행</h3>
<div class="card-desc-box">
<div class="process-item">
<span class="process-number">5</span>
<p class="process-text">전사 공유 및 공감대 형성</p>
</div>
<div class="process-item">
<span class="process-number">6</span>
<p class="process-text">제도권 공급 구조로 전환 추진</p>
</div>
</div>
</div>
</div>
</div>
<!-- Bottom Insight -->
<div class="highlight-bar">
<span class="highlight-title">Expansion Goal</span>
<p class="highlight-text">
                개인 판매 중심에서 <strong class="ml-2">기업·제도권 공급 구조</strong>로의 완전한 체질 개선
            </p>
</div>
</main>
</div>
</body>
</html>`
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
            border-left: 4px solid #1f2937;
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
            border-left: 1px solid #d1d5db;
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
            padding: 60px 80px;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .page-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
        }
        .page-title {
            font-size: 26px;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
        }
        .page-title i {
            color: #ef4444;
            margin-right: 16px;
            font-size: 22px;
        }
        
        /* Custom Layout for 3 Sections */
        .content-layout {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 24px;
            overflow: hidden;
        }
        
        .top-section {
            display: flex;
            gap: 24px;
            flex: 1;
            min-height: 0;
        }

        .card {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border-left: 4px solid transparent;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .card-bg {
            flex: 1;
            border-left-color: #3b82f6;
        }
        
        .card-crisis {
            flex: 1;
            border-left-color: #ef4444;
        }

        .card-diagram {
            height: 180px;
            border-left-color: #f59e0b;
            justify-content: center;
            flex-shrink: 0;
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
            font-size: 16px;
        }
        .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
        }
        
        /* Icon Colors */
        .icon-bg { background-color: #dbeafe; color: #3b82f6; }
        .icon-crisis { background-color: #fee2e2; color: #ef4444; }
        .icon-diagram { background-color: #fef3c7; color: #f59e0b; }

        .card-content {
            color: #4b5563;
            font-size: 13px;
            line-height: 1.6;
            flex: 1;
            overflow-y: auto;
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
            border-color: #fecaca;
            background-color: #fef2f2;
        }
        .flow-item.end {
            border-color: #fca5a5;
            background-color: #fee2e2;
            box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.1);
        }
        
        .flow-icon {
            font-size: 22px;
            margin-bottom: 10px;
            color: #6b7280;
        }
        .highlight .flow-icon { color: #ef4444; }
        .end .flow-icon { color: #b91c1c; }
        
        .flow-text {
            font-size: 12px;
            font-weight: 700;
            color: #374151;
            line-height: 1.3;
        }
        .highlight .flow-text { color: #ef4444; }
        .end .flow-text { color: #991b1b; }

        .flow-arrow {
            color: #9ca3af;
            font-size: 18px;
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
</div>
</body>
</html>`,
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
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            overflow: hidden;
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
            font-size: 26px;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
        }
        .page-title i {
            color: #ef4444;
            margin-right: 16px;
            font-size: 22px;
        }

        /* Content Layout */
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 24px;
            flex: 1;
            overflow: hidden;
        }

        /* Top Section: Analysis & Chart */
        .top-section {
            display: flex;
            gap: 24px;
            height: 280px;
            flex-shrink: 0;
        }
        
        .analysis-box {
            flex: 1;
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-left: 4px solid #1f2937;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .section-title {
            font-size: 16px;
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
            margin-bottom: 20px;
            overflow-y: auto;
        }
        .insight-list li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 10px;
            font-size: 13px;
            color: #374151;
            line-height: 1.5;
        }
        .insight-list li::before {
            content: "•";
            position: absolute;
            left: 4px;
            color: #ef4444;
            font-weight: bold;
        }
        
        .indicator-tags {
            margin-top: auto;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .indicator-tag {
            background-color: #f3f4f6;
            color: #4b5563;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 10px;
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
            overflow: hidden;
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
            font-size: 10px;
            color: #6b7280;
            text-align: center;
            margin-top: 10px;
        }

        /* Bottom Section: News Cards */
        .bottom-section {
            display: flex;
            gap: 24px;
            flex: 1;
            min-height: 0;
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
            overflow: visible;
        }
        .news-card::before {
            content: "";
            position: absolute;
            top: 24px;
            bottom: 24px;
            left: 0;
            width: 4px;
            background-color: #d1d5db;
        }
        .news-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        }
        .news-card.alert::before { background-color: #ef4444; }
        .news-card.info::before { background-color: #3b82f6; }

        .news-title {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
            line-height: 1.4;
            padding-left: 16px;
            min-height: 50px;
        }
        .news-source {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            padding-left: 16px;
        }
        .news-body {
            font-size: 12px;
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
            top: 8px;
            right: 20px;
            background-color: #1f2937;
            color: white;
            font-size: 8px;
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
<h3 class="news-title">"코로나19 경제적 피해,<br/>사스(SARS) 충격 뛰어 넘을 것"</h3>
<div class="news-source">
<span>하나금융경영연구소</span>
<span>2020.02.16</span>
</div>
<div class="news-body">
<p>사태 장기화 시 제조업 전반 타격 불가피. 코로나19의 경제적 파급력은 과거 사스 충격보다 훨씬 강력할 가능성 제기됨.</p>
</div>
</div>
<!-- News Card 2 -->
<div class="news-card info">
<div class="news-label">Industry Impact</div>
<h3 class="news-title">코로나19 팬데믹에 급속 위축…<br/>신산업 발굴·융합 시급해져</h3>
<div class="news-source">
<span>디지털타임스</span>
<span>2020.06.21</span>
</div>
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
            border-left: 4px solid transparent;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .card-org {
            flex: 1;
            border-left-color: #64748b;
        }
        
        .card-role {
            flex: 1.2;
            border-left-color: #3b82f6;
            background-color: #f0f9ff;
            border: 1px solid #e0f2fe;
            border-left-width: 4px;
        }

        .card-diagram {
            height: 160px;
            border-left-color: #10b981;
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
<h3 class="card-title">기존 조직 구성 (R&amp;R)</h3>
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
<h3 class="card-title">나의 역할 (Strategic Planner)</h3>
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
<span class="page-subtitle">Strategic Options &amp; Decision Making</span>
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

        /* Content Layout */
        .content-body {
            display: flex;
            flex-direction: column;
            gap: 20px;
            flex: 1;
            overflow: hidden;
        }

        /* 1. Top Section: Analysis & News */
        .top-row {
            display: flex;
            gap: 20px;
            height: 240px;
            flex-shrink: 0;
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
            overflow: visible;
            position: relative;
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
            overflow-y: auto;
        }
        .data-point {
            background-color: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            border-left: 3px solid #94a3b8;
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
            background-color: #eff6ff;
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            border: 1px solid #dbeafe;
            position: relative;
        }
        .insight-text {
            font-size: 13px;
            color: #1e40af;
            font-weight: 600;
            line-height: 1.5;
        }
        
        /* L-shaped connector from Insight to News */
        .insight-box::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, #3b82f6, rgba(59, 130, 246, 0.3));
            z-index: 5;
        }
        
        /* L-shaped connector horizontal line and arrow - positioned between news cards */
        .news-card:first-child::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -6px;
            width: calc(100% - 20px);
            height: 2px;
            background: linear-gradient(to right, #3b82f6, rgba(59, 130, 246, 0.3));
            z-index: 5;
        }
        .news-card:first-child {
            position: relative;
        }
        .news-card:first-child .connector-arrow {
            position: absolute;
            right: 20px;
            bottom: -6px;
            transform: translateY(50%);
            color: #3b82f6;
            font-size: 18px;
            font-weight: bold;
            z-index: 6;
            animation: pulse-arrow 2s ease-in-out infinite;
        }
        @keyframes pulse-arrow {
            0%, 100% { opacity: 0.6; transform: translateY(-50%) translateX(0); }
            50% { opacity: 1; transform: translateY(-50%) translateX(4px); }
        }

        /* News Box */
        .news-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: relative;
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
            justify-content: center;
            position: relative;
            padding-left: 20px;
            overflow: hidden;
        }
        .news-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 12px;
            bottom: 12px;
            width: 4px;
            background-color: #cbd5e1;
            border-radius: 0 4px 4px 0;
        }
        .news-card.highlight::before {
            background-color: #2563eb;
        }
        .news-title {
            font-size: 14px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 6px;
            line-height: 1.3;
        }
        .news-meta {
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
        }
        .news-snippet {
            font-size: 12px;
            color: #64748b;
            margin-top: 6px;
            line-height: 1.4;
        }

        /* 2. Middle Section: Pivot Banner */
        .pivot-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            border-radius: 50px;
            padding: 8px 24px;
            border: 2px solid #e2e8f0;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            flex-shrink: 0;
        }
        .pivot-banner::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            right: 0;
            background-color: #f0f9ff;
            z-index: 0;
        }
        
        .pivot-side {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        .pivot-side.right {
            justify-content: flex-end;
        }
        .pivot-label {
            font-size: 10px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
        }
        .pivot-text {
            font-size: 14px;
            font-weight: 800;
            color: #475569;
        }
        .pivot-side.right .pivot-text {
            color: #0284c7;
        }
        .pivot-arrow {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            background-color: #0284c7;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 4px solid white;
        }

        /* 3. Bottom Section: Flow & Contribution */
        .bottom-row {
            flex: 1;
            background-color: white;
            border-radius: 12px;
            padding: 18px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .flow-process {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
            padding-top: 8px;
        }
        .flow-process::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 50px;
            right: 50px;
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
            width: 42px;
            height: 42px;
            background-color: white;
            border: 2px solid #cbd5e1;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #64748b;
            margin-bottom: 10px;
            transition: all 0.3s;
        }
        .process-step:hover .step-icon {
            border-color: #3b82f6;
            color: #3b82f6;
            background-color: #eff6ff;
            transform: translateY(-2px);
        }
        .process-step:last-child .step-icon {
            background-color: #eff6ff;
            border-color: #3b82f6;
            color: #3b82f6;
        }
        
        .step-title {
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 6px;
        }
        .step-desc {
            font-size: 10px;
            color: #64748b;
            line-height: 1.4;
            background-color: #f8fafc;
            padding: 6px;
            border-radius: 6px;
            width: 100%;
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
<p>객관적 자료를 기반으로 과감한 전략적 피보팅</p>
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
<p class="data-value">대표자 가수금 의존<br/>runway 산출 자체 무의미</p>
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
<div class="news-card">
<span class="connector-arrow">→</span>
<h3 class="news-title">대신증권, 장기투자?<br/>低보수 로보어드바이저가 답</h3>
<div class="news-snippet">
<p>총보수율 0.137%의 저렴한 비용 구조. 성과보수 체계로 장기 투자 수단으로서 효용성 검증.</p>
</div>
<div class="news-meta mt-2">
<span>대신증권 보도자료</span>
<span>2019.07.25</span>
</div>
</div>
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
<p>재무상황/시장 근거 제시</p>
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
</html>`,
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
            padding: 30px 50px;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .page-header {
            margin-bottom: 16px;
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

        /* 2x2 Grid Layout */
        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 18px;
            flex: 1;
            overflow: hidden;
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
            overflow: hidden;
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
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
            font-size: 42px;
            font-weight: 900;
            color: #2563eb;
            line-height: 1;
            margin-right: 6px;
        }
        .stat-unit {
            font-size: 16px;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .growth-badge {
            background-color: #dbeafe;
            color: #1e40af;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 10px;
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
        .sub-stat-label { font-size: 10px; color: #64748b; display: block; margin-bottom: 3px; }
        .sub-stat-text { font-size: 13px; font-weight: 700; color: #334155; display: block; line-height: 1.3; }

        /* 2. Execution Design */
        .icon-design { background-color: #faf5ff; color: #9333ea; }
        .design-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            height: 100%;
            overflow: hidden;
        }
        .design-item {
            display: flex;
            align-items: center;
            background-color: #f3f4f6;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            color: #4b5563;
        }
        .design-icon-small {
            color: #9333ea;
            margin-right: 10px;
            width: 18px;
            text-align: center;
        }

        /* 3. Collaboration */
        .icon-collab { background-color: #f0fdf4; color: #16a34a; }
        .collab-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
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
            font-size: 11px;
            margin: 0;
            line-height: 1.4;
        }
        .quote-box {
            margin-top: auto;
            background-color: #f0fdf4;
            border-left: 3px solid #16a34a;
            padding: 8px;
            font-size: 11px;
            font-style: italic;
            color: #15803d;
            font-weight: 600;
        }

        /* 4. Qualitative Results */
        .icon-qualitative { background-color: #fff7ed; color: #ea580c; }
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
            background-color: #fff7ed;
            border-radius: 8px;
            padding: 12px 6px;
            border: 1px solid #ffedd5;
        }
        .qual-icon {
            font-size: 18px;
            color: #ea580c;
            margin-bottom: 6px;
        }
        .qual-title {
            font-size: 12px;
            font-weight: 700;
            color: #9a3412;
            margin-bottom: 3px;
        }
        .qual-desc {
            font-size: 10px;
            color: #c2410c;
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
                    "생존 없이는 나눌 파이도 없다."
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
</html>`,
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

        /* Content Layout */
        .content-body {
            display: flex;
            flex-direction: column;
            gap: 20px;
            height: 100%;
            overflow: hidden;
        }

        /* Top Row: Reflection Cards */
        .reflection-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: 220px;
            flex-shrink: 0;
        }

        .reflection-card {
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border-left: 5px solid transparent;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Difficulty Card */
        .card-difficulty {
            border-left-color: #ef4444;
        }
        .card-difficulty .card-icon {
            background-color: #fee2e2;
            color: #ef4444;
        }

        /* Learning Card */
        .card-learning {
            border-left-color: #10b981;
        }
        .card-learning .card-icon {
            background-color: #d1fae5;
            color: #10b981;
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        .card-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            margin-right: 12px;
        }
        .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
        }

        .card-list {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            overflow: hidden;
        }
        .card-list li {
            position: relative;
            padding-left: 18px;
            margin-bottom: 10px;
            font-size: 14px;
            color: #4b5563;
            line-height: 1.5;
        }
        .card-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
            font-size: 16px;
        }
        .card-difficulty li::before { color: #ef4444; }
        .card-learning li::before { color: #10b981; }

        /* Bottom Row: Quote Section */
        .quote-section {
            flex: 1;
            background-color: white;
            border-radius: 12px;
            padding: 0 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }
        
        .quote-icon {
            font-size: 36px;
            color: #e2e8f0;
            position: absolute;
            top: 30px;
            left: 30px;
        }
        .quote-icon-right {
            font-size: 36px;
            color: #e2e8f0;
            position: absolute;
            bottom: 30px;
            right: 30px;
        }

        .quote-text {
            font-size: 26px;
            font-weight: 800;
            color: #1e293b;
            line-height: 1.5;
            margin-bottom: 20px;
            position: relative;
            z-index: 10;
        }
        .quote-highlight {
            color: #2563eb;
        }
        
        .quote-author {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
            border-top: 2px solid #e2e8f0;
            padding-top: 12px;
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
</html>`
    };

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
            
            // iframe 생성 (srcdoc 속성 사용 - Blob URL 불필요)
            const iframe = document.createElement('iframe');
            iframe.srcdoc = html;  // srcdoc 속성으로 HTML 직접 삽입
            iframe.frameBorder = '0';
            iframe.className = isMainBox ? 'service-main-iframe' : 'service-slide-iframe';
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; overflow: hidden;';
            if (isMainBox) {
                iframe.style.borderRadius = '16px';
            } else {
                iframe.style.borderRadius = '12px';
            }
            
            // 컨테이너에 iframe 삽입
            container.appendChild(iframe);
            
            // 슬라이드 아이템인 경우 has-iframe 클래스 추가
            if (container.classList.contains('test-slide-item')) {
                container.classList.add('has-iframe');
            }
            
            // iframe 로드 완료 후 처리
            iframe.addEventListener('load', () => {
                console.log('iframe 로드 완료');
                
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeBody = iframeDoc.body;
                    const slideContainer = iframeDoc.querySelector('.slide-container') || iframeDoc.querySelector('.slide-container-1');
                    
                    if (slideContainer) {
                        if (isMainBox) {
                            // 메인 박스: 컨테이너 크기에 맞게 스케일링
                            const containerWidth = container.offsetWidth;
                            const containerHeight = container.offsetHeight;
                            
                            // HTML에서 slide-container의 크기 추출 시도
                            let slideWidth = 1280; // 기본값 (서비스 콘텐츠)
                            let slideHeight = 720; // 기본값 (서비스 콘텐츠)
                            
                            // HTML 문자열에서 width와 height 추출
                            const widthMatch = html.match(/width:\s*(\d+)px/i);
                            const heightMatch = html.match(/height:\s*(\d+)px/i);
                            
                            if (widthMatch && heightMatch) {
                                slideWidth = parseInt(widthMatch[1]);
                                slideHeight = parseInt(heightMatch[1]);
                            }
                            
                            // 컨테이너 크기에 맞게 스케일 계산 (비율 유지하면서 fit)
                            const scaleX = containerWidth / slideWidth;
                            const scaleY = containerHeight / slideHeight;
                            const scale = Math.min(scaleX, scaleY); // 더 작은 스케일 사용하여 내용이 잘리지 않게
                            
                            // 원본 크기 유지하면서 스케일 적용
                            slideContainer.style.width = slideWidth + 'px';
                            slideContainer.style.height = slideHeight + 'px';
                            slideContainer.style.transform = `scale(${scale})`;
                            slideContainer.style.transformOrigin = 'top left';
                            
                            // 컨테이너 중앙 정렬을 위한 추가 스타일
                            const scaledWidth = slideWidth * scale;
                            const scaledHeight = slideHeight * scale;
                            const offsetX = (containerWidth - scaledWidth) / 2;
                            const offsetY = (containerHeight - scaledHeight) / 2;
                            
                            slideContainer.style.marginLeft = offsetX + 'px';
                            slideContainer.style.marginTop = offsetY + 'px';
                            
                            // body 스타일 조정
                            iframeBody.style.margin = '0';
                            iframeBody.style.padding = '0';
                            iframeBody.style.overflow = 'hidden';
                            iframeBody.style.width = scaledWidth + 'px';
                            iframeBody.style.height = scaledHeight + 'px';
                            
                            // html 스타일 조정
                            iframeDoc.documentElement.style.margin = '0';
                            iframeDoc.documentElement.style.padding = '0';
                            iframeDoc.documentElement.style.overflow = 'hidden';
                            iframeDoc.documentElement.style.width = scaledWidth + 'px';
                            iframeDoc.documentElement.style.height = scaledHeight + 'px';
                        } else {
                            // 작은 박스: 일부분만 보이도록 스케일링
                            const containerWidth = container.offsetWidth;
                            const containerHeight = container.offsetHeight;
                            
                            // HTML에서 slide-container의 크기 추출 시도
                            let slideWidth = 1280; // 기본값 (서비스 콘텐츠)
                            let slideHeight = 720; // 기본값 (서비스 콘텐츠)
                            
                            // HTML 문자열에서 width와 height 추출
                            const widthMatch = html.match(/width:\s*(\d+)px/i);
                            const heightMatch = html.match(/height:\s*(\d+)px/i);
                            
                            if (widthMatch && heightMatch) {
                                slideWidth = parseInt(widthMatch[1]);
                                slideHeight = parseInt(heightMatch[1]);
                            }
                            
                            // 컨테이너 크기에 맞게 스케일 계산 (작은 박스에 맞게 fit)
                            const scaleX = containerWidth / slideWidth;
                            const scaleY = containerHeight / slideHeight;
                            const scale = Math.min(scaleX, scaleY); // 더 작은 스케일 사용하여 내용이 잘리지 않게
                            
                            slideContainer.style.width = slideWidth + 'px';
                            slideContainer.style.height = slideHeight + 'px';
                            slideContainer.style.transform = `scale(${scale})`;
                            slideContainer.style.transformOrigin = 'top left';
                            
                            // 컨테이너 중앙 정렬을 위한 추가 스타일
                            const scaledWidth = slideWidth * scale;
                            const scaledHeight = slideHeight * scale;
                            const offsetX = (containerWidth - scaledWidth) / 2;
                            const offsetY = (containerHeight - scaledHeight) / 2;
                            
                            slideContainer.style.marginLeft = offsetX + 'px';
                            slideContainer.style.marginTop = offsetY + 'px';
                            
                            // body 스타일 조정
                            iframeBody.style.margin = '0';
                            iframeBody.style.padding = '0';
                            iframeBody.style.overflow = 'hidden';
                            iframeBody.style.width = scaledWidth + 'px';
                            iframeBody.style.height = scaledHeight + 'px';
                            
                            // html 스타일 조정
                            iframeDoc.documentElement.style.margin = '0';
                            iframeDoc.documentElement.style.padding = '0';
                            iframeDoc.documentElement.style.overflow = 'hidden';
                            iframeDoc.documentElement.style.width = scaledWidth + 'px';
                            iframeDoc.documentElement.style.height = scaledHeight + 'px';
                        }
                    }
                } catch (e) {
                    console.warn('iframe 내부 스타일 조정 실패 (CORS 가능성):', e);
                }
            });
            
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
        try {
            console.log('loadService1ContentToMainBox 호출됨, slideNumber:', slideNumber);
            console.log('service1Contents 키:', Object.keys(service1Contents));
            
            const html = service1Contents[slideNumber];
            if (!html) {
                console.error(`서비스 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`서비스 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`서비스 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "2");
            mainBox.classList.add("service-box");
        } catch (error) {
            console.error(`Failed to load service ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 서비스1 파일 내용 로드 함수 (슬라이드용)
    function loadService1Content(slideItem, slideNumber) {
        try {
            console.log('loadService1Content 호출됨, slideNumber:', slideNumber);
            
            const html = service1Contents[slideNumber];
            if (!html) {
                console.error(`서비스1 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`서비스1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`서비스1 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
        } catch (error) {
            console.error(`Failed to load service1 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략2 파일 내용을 메인박스에 로드하는 함수
    function loadStrategy2ContentToMainBox(mainBox, slideNumber) {
        try {
            console.log('loadStrategy2ContentToMainBox 호출됨, slideNumber:', slideNumber);
            console.log('strategy2Contents 키:', Object.keys(strategy2Contents));
            
            const html = strategy2Contents[slideNumber];
            if (!html) {
                console.error(`전략2 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`전략2 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`전략2 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "5");
            mainBox.classList.remove("service-box");
        } catch (error) {
            console.error(`Failed to load strategy2 ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략2 파일 내용 로드 함수 (슬라이드용)
    function loadStrategy2Content(slideItem, slideNumber) {
        try {
            console.log('loadStrategy2Content 호출됨, slideNumber:', slideNumber);
            
            const html = strategy2Contents[slideNumber];
            if (!html) {
                console.error(`전략2 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`전략2 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`전략2 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
        } catch (error) {
            console.error(`Failed to load strategy2 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략1 파일 내용을 메인박스에 로드하는 함수
    function loadStrategy1ContentToMainBox(mainBox, slideNumber) {
        try {
            console.log('loadStrategy1ContentToMainBox 호출됨, slideNumber:', slideNumber);
            console.log('strategy1Contents 키:', Object.keys(strategy1Contents));
            
            const html = strategy1Contents[slideNumber];
            if (!html) {
                console.error(`전략1 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`전략1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`전략1 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(mainBox, html, true);
            mainBox.setAttribute("data-box", "1");
            mainBox.classList.remove("service-box");
        } catch (error) {
            console.error(`Failed to load strategy1 ${slideNumber}:`, error);
            mainBox.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 전략1 파일 내용 로드 함수 (슬라이드용)
    function loadStrategy1Content(slideItem, slideNumber) {
        try {
            console.log('loadStrategy1Content 호출됨, slideNumber:', slideNumber);
            
            const html = strategy1Contents[slideNumber];
            if (!html) {
                console.error(`전략1 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`전략1 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`전략1 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
        } catch (error) {
            console.error(`Failed to load strategy1 ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
        }
    }

    // 서비스1 박스 썸네일 로드
    const service1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="2"]');
    if (service1ThumbnailBox && typeof service1Contents !== 'undefined') {
        const html = service1Contents[1];
        if (html) {
            service1ThumbnailBox.innerHTML = '';
            loadContentToIframe(service1ThumbnailBox, html, false);
        }
    }

    // 전략1 박스 썸네일 로드
    const strategy1ThumbnailBox = document.querySelector('.test-thumbnail-box[data-box="1"]');
    if (strategy1ThumbnailBox && typeof strategy1Contents !== 'undefined') {
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

