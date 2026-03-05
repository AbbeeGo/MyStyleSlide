let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const pageIndicator = document.getElementById('pageIndicator');
const totalSlides = slides.length;

function updateSlides() {
	slides.forEach((slide, index) => {
		if (index === currentSlide) slide.classList.add('active');
		else slide.classList.remove('active');
	});
	pageIndicator.innerText = `${currentSlide + 1} / ${totalSlides}`;
}

function nextSlide() {
	if (currentSlide < totalSlides - 1) {
		currentSlide++;
		updateSlides();
	}
}

function prevSlide() {
	if (currentSlide > 0) {
		currentSlide--;
		updateSlides();
	}
}

function autoFitSlides() {
  document.querySelectorAll('.slide .outer').forEach(outer => {
    // 取得所有有 font-size 的子元素
    const textEls = outer.querySelectorAll('h1,h2,h3,h4,p,li,span,div,.item,.entry-content,.hex-desc,.tile-card p,.content-box,.info-note');
    const MIN_FONT = 14;
    let tries = 0;
    while (outer.scrollHeight > outer.clientHeight && tries < 30) {
      textEls.forEach(el => {
        const current = parseFloat(getComputedStyle(el).fontSize);
        if (current > MIN_FONT) {
          el.style.fontSize = (current - 1) + 'px';
        }
      });
      tries++;
    }
  });
}

document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowRight') nextSlide();
	if (e.key === 'ArrowLeft') prevSlide();
});
  
updateSlides();
autoFitSlides();
