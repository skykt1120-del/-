/contact.html
/contact.css
/img/
 ├ profile.jpg
 ├ portfolio.jpg

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Contact</title>
  <link rel="stylesheet" href="./contact.css" />
</head>
<body>

<section class="free-grid">

  <!-- Profile -->
  <a href="./profile.html"
     class="card image-card size-large parallax"
     data-speed="0.22"
     style="background-image:url('./img/profile.jpg')">
    <div class="overlay"></div>
    <div class="card-content">
      <span class="card-label">PROFILE</span>
      <h2>Profile</h2>
      <p>전략 · 서비스 기획자</p>
    </div>
  </a>

  <!-- Portfolio -->
  <a href="./portfolio.html"
     class="card image-card size-tall parallax"
     data-speed="0.28"
     style="background-image:url('./img/portfolio.jpg')">
    <div class="overlay"></div>
    <div class="card-content">
      <span class="card-label">WORK</span>
      <h2>Portfolio</h2>
    </div>
  </a>

  <!-- Contact -->
  <div class="card text-only size-small parallax" data-speed="0.1">
    <span class="card-label">CONTACT</span>
    <p>
      gitae1120@naver.com<br>
      010-6533-4477
    </p>
  </div>

  <!-- Sentence -->
  <div class="card text-only size-wide parallax" data-speed="0.16">
    <span class="card-label">THOUGHT</span>
    <p class="long-text">
      미국 빅데이터 프로세싱 대기업 팔란티어 테크놀로지는<br><br>

      복잡한 데이터 환경에서 조직의 효과적인 의사결정을 돕고,<br>
      국방 분야에서 시작해 다양한 상업 시장으로 확장하며<br>
      대기업·정부기관 중심에서 중견·중소기업까지 시장을 넓혀왔습니다.<br><br>

      저는 이러한 흐름처럼 단계적이고 큰 성장을 가능하게 하는<br>
      전략과 서비스 설계에 집중하려고 합니다.
    </p>
  </div>

</section>

<script>
  const cards = document.querySelectorAll('.card');
  const parallaxCards = document.querySelectorAll('.parallax');

  /* 1. 초기 흩어짐 */
  cards.forEach(card => {
    const x = (Math.random() - 0.5) * 60;
    const y = (Math.random() - 0.5) * 60;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });

  /* 2. 고정 */
  window.addEventListener('load', () => {
    setTimeout(() => {
      cards.forEach(card => card.classList.add('is-set'));
    }, 500);
  });

  /* 3. 패럴랙스 */
  let introFinished = false;
  setTimeout(() => introFinished = true, 1200);

  window.addEventListener('scroll', () => {
    if (!introFinished) return;

    const scrollY = window.scrollY;

    parallaxCards.forEach(card => {
      const speed = parseFloat(card.dataset.speed);
      const offset = scrollY * speed * -0.15;
      card.style.transform = `translateY(${offset}px)`;
    });
  });
</script>

</body>
</html>

body {
  background: #f3f3f3;
  padding: 80px;
  font-family: 'Pretendard', 'Helvetica Neue', Arial, sans-serif;
  color: #111;
}

/* 자유 그리드 */
.free-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 120px;
  grid-auto-flow: dense;
  gap: 32px;
}

/* 공통 카드 */
.card {
  background: #fff;
  border: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translate(var(--x, 0), var(--y, 0));
  transition:
    transform 1s cubic-bezier(.22,.61,.36,1),
    opacity 0.8s ease,
    box-shadow .4s ease;
  will-change: transform;
}

.card.is-set {
  opacity: 1;
  transform: translate(0,0);
}

.card:hover {
  box-shadow: 0 24px 48px rgba(0,0,0,.08);
}

/* 이미지 카드 */
.image-card {
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,.75);
}

.card-content {
  position: relative;
  padding: 32px;
}

/* 텍스트 카드 */
.text-only {
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 카드 사이즈 */
.size-large {
  grid-column: span 4;
  grid-row: span 3;
}

.size-tall {
  grid-column: span 2;
  grid-row: span 4;
}

.size-small {
  grid-column: span 2;
  grid-row: span 2;
}

.size-wide {
  grid-column: span 4;
  grid-row: span 3;
}

/* 타이포 */
.card-label {
  font-size: 11px;
  letter-spacing: .14em;
  color: #999;
  margin-bottom: 16px;
}

h2 {
  font-size: 26px;
  margin-bottom: 12px;
}

p {
  font-size: 14px;
  line-height: 1.7;
  color: #444;
}

.long-text {
  font-size: 15px;
  line-height: 1.9;
  color: #333;
}

