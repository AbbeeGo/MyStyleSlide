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

document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowRight') nextSlide();
	if (e.key === 'ArrowLeft') prevSlide();
});
  
