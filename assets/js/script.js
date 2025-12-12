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
        if (!expandedView || !expandedBox || !slideList || !thumbnailGrid) return;

        // 모든 박스 숨기기
        thumbnailBoxes.forEach(box => {
            box.classList.add("hidden");
        });

        // 그리드 뷰 숨기기
        thumbnailGrid.classList.add("hidden");
        
        // 확대 뷰 표시
        expandedView.classList.remove("hidden");

        // 메인박스에 내용 로드
        // 2번 박스인 경우 1.md 내용을 메인박스에 표시
        if (boxNumber === "2") {
            loadServiceContentToMainBox(expandedBox, 1);
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

        // 슬라이드 리스트 생성 (5개) - 모든 박스에 동일하게 적용
        slideList.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const slideItem = document.createElement("div");
            slideItem.className = "test-slide-item service-slide-item";
            // 네이밍: 1-1, 1-2, 1-3, 1-4, 1-5 형식
            const slideName = `${boxNumber}-${i}`;
            slideItem.setAttribute("data-slide", slideName);
            slideItem.setAttribute("data-parent-box", boxNumber);
            slideItem.setAttribute("data-slide-number", i);
            
            // 2번 박스의 경우 서비스 파일 내용 로드
            if (boxNumber === "2") {
                loadServiceContent(slideItem, i);
            }
            
            // 모든 슬라이드 아이템에 클릭 이벤트 추가: 메인박스에 해당 내용 표시
            slideItem.addEventListener("click", (e) => {
                e.stopPropagation();
                
                // 2번 박스인 경우 서비스 파일 내용 로드
                if (boxNumber === "2") {
                    const slideNum = slideItem.getAttribute("data-slide-number");
                    loadServiceContentToMainBox(expandedBox, parseInt(slideNum));
                } else {
                    // 나머지 박스는 추후 동일한 방식으로 구현 예정
                    // 현재는 클릭만 감지
                    console.log(`슬라이드 아이템 클릭: ${slideName}`);
                }
            });
            
            slideList.appendChild(slideItem);
        }
    }

    // 서비스 파일 내용을 객체로 저장
    const serviceContents = {
        1: `<!DOCTYPE html>
<html lang="ko" data-theme="light" style=""><head>
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
            background-color: #f8fafc;
        }
        .slide-container {
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
    </style>
</head>
<body style="">
<div class="slide-container">
<div class="deco-circle-large"></div>
<div class="deco-circle-small"></div>
<div class="accent-bar"></div>
<div class="content-wrapper">
<div class="text-content">
<div class="tag-pill">
                Fintech Project Portfolio
            </div>
<h1 class="main-title">
                모바일 로보어드바이저
<span class="highlight">KIWI 서비스 기획</span></h1>
<p class="sub-title">
                시간과 장소에 구애받지 않는<br>
                모바일 자산관리 서비스
            </p>
<div class="summary-box">
<div class="summary-label">
<i class="fas fa-bullseye mr-2" style="color: #A4C639;"></i> Core Value Proposition
                </div>
<p class="summary-text">
                    손 안의 <strong>'원클릭' 자동투자</strong> 경험 제공
                </p>
<p class="summary-text" style="font-size: 16px; margin-top: 16px; color: #64748b;">
                    전문 지식 없이도 알고리즘이 <strong>포트폴리오 구성·리밸런싱을 자동 수행</strong>하는<br>
                    모바일 투자일임 서비스
                </p>
</div>
</div>
</div>
<div class="footer">
</div>
</div>
</body></html>`,
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
            color: #A4C639;
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
            background-color: #ffffff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border-left: 5px solid transparent;
            display: flex;
            flex-direction: column;
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
        .card-overview { border-left-color: #1e3a8a; } 
        .card-overview .card-icon { background-color: #eff6ff; color: #1e3a8a; }
        .card-goal { border-left-color: #A4C639; } 
        .card-goal .card-icon { background-color: #f4f9e0; color: #82a325; }
        .card-tech { border-left-color: #4b5563; } 
        .card-tech .card-icon { background-color: #f3f4f6; color: #4b5563; }
        .card-value { border-left-color: #f59e0b; } 
        .card-value .card-icon { background-color: #fffbeb; color: #f59e0b; }
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
            color: #A4C639;
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
            color: #ef4444;
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
            background-color: #ffffff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border-left: 5px solid transparent;
            display: flex;
            flex-direction: column;
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
        .card-legal { border-left-color: #ef4444; } 
        .card-legal .card-icon { background-color: #fee2e2; color: #ef4444; }
        .card-competition { border-left-color: #f97316; } 
        .card-competition .card-icon { background-color: #ffedd5; color: #f97316; }
        .card-opportunity { border-left-color: #3b82f6; } 
        .card-opportunity .card-icon { background-color: #dbeafe; color: #3b82f6; }
        .card-strategy { border-left-color: #A4C639; } 
        .card-strategy .card-icon { background-color: #f4f9e0; color: #82a325; }
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
            color: #A4C639;
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
            color: #A4C639;
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
                    const slideContainer = iframeDoc.querySelector('.slide-container');
                    
                    if (slideContainer) {
                        if (isMainBox) {
                            // 메인 박스: 가득 차게 표시
                            slideContainer.style.width = '100%';
                            slideContainer.style.height = '100%';
                            slideContainer.style.maxWidth = '100%';
                            slideContainer.style.maxHeight = '100%';
                            
                            // body도 전체 크기로
                            iframeBody.style.margin = '0';
                            iframeBody.style.padding = '0';
                            iframeBody.style.width = '100%';
                            iframeBody.style.height = '100%';
                            iframeBody.style.overflow = 'hidden';
                            
                            // html도 전체 크기로
                            iframeDoc.documentElement.style.width = '100%';
                            iframeDoc.documentElement.style.height = '100%';
                            iframeDoc.documentElement.style.margin = '0';
                            iframeDoc.documentElement.style.padding = '0';
                            iframeDoc.documentElement.style.overflow = 'hidden';
                        } else {
                            // 작은 박스: 일부분만 보이도록 스케일링
                            const containerWidth = container.offsetWidth;
                            const containerHeight = container.offsetHeight;
                            const slideWidth = 1280;
                            const slideHeight = 720;
                            
                            // 컨테이너 크기에 맞게 스케일 계산
                            const scaleX = containerWidth / slideWidth;
                            const scaleY = containerHeight / slideHeight;
                            const scale = Math.max(scaleX, scaleY); // 더 큰 스케일 사용하여 가득 채움
                            
                            slideContainer.style.width = slideWidth + 'px';
                            slideContainer.style.height = slideHeight + 'px';
                            slideContainer.style.transform = `scale(${scale})`;
                            slideContainer.style.transformOrigin = 'top left';
                            
                            // body 스타일 조정
                            iframeBody.style.margin = '0';
                            iframeBody.style.padding = '0';
                            iframeBody.style.overflow = 'hidden';
                            iframeBody.style.width = (slideWidth * scale) + 'px';
                            iframeBody.style.height = (slideHeight * scale) + 'px';
                            
                            // html 스타일 조정
                            iframeDoc.documentElement.style.margin = '0';
                            iframeDoc.documentElement.style.padding = '0';
                            iframeDoc.documentElement.style.overflow = 'hidden';
                            iframeDoc.documentElement.style.width = (slideWidth * scale) + 'px';
                            iframeDoc.documentElement.style.height = (slideHeight * scale) + 'px';
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

    // 서비스 파일 내용을 메인박스에 로드하는 함수
    function loadServiceContentToMainBox(mainBox, slideNumber) {
        try {
            console.log('loadServiceContentToMainBox 호출됨, slideNumber:', slideNumber);
            console.log('serviceContents 키:', Object.keys(serviceContents));
            
            const html = serviceContents[slideNumber];
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

    // 서비스 파일 내용 로드 함수 (슬라이드용)
    function loadServiceContent(slideItem, slideNumber) {
        try {
            console.log('loadServiceContent 호출됨, slideNumber:', slideNumber);
            
            const html = serviceContents[slideNumber];
            if (!html) {
                console.error(`서비스 파일 ${slideNumber}를 찾을 수 없습니다.`);
                throw new Error(`서비스 파일 ${slideNumber}를 찾을 수 없습니다.`);
            }
            
            console.log(`서비스 파일 ${slideNumber} 로드됨, 길이:`, html.length);
            
            // iframe으로 로드
            loadContentToIframe(slideItem, html, false);
        } catch (error) {
            console.error(`Failed to load service ${slideNumber}:`, error);
            slideItem.innerHTML = '<div class="service-slide-content">콘텐츠를 불러올 수 없습니다.</div>';
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
                        // 전략 기획: 1번만 표시
                        if (boxNumber === "1") {
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

        // 박스 클릭 이벤트 - 모든 박스(1, 2, 3, 4번)에 동일하게 적용
        thumbnailBoxes.forEach(box => {
            box.addEventListener("click", (e) => {
                e.stopPropagation();
                const boxNumber = box.getAttribute("data-box");
                // 1번, 2번, 3번, 4번 모두 동일하게 확대 기능 적용
                if (boxNumber === "1" || boxNumber === "2" || boxNumber === "3" || boxNumber === "4") {
                    expandBox(boxNumber);
                }
            });
        });
    }
});

