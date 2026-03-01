let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const pageIndicator = document.getElementById('pageIndicator');
const slideOrderList = typeof slideOrder === 'string'
    ? slideOrder.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
    : null;
const totalSlides = slideOrderList ? slideOrderList.length : slides.length;
const hasInlineSlides = slides.length > 0;

const getCurrentOrderIndex = () => {
    if (!slideOrderList) return 0;
    const fileName = window.location.pathname.split('/').pop() || '';
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    let index = slideOrderList.indexOf(baseName);
    if (index === -1) {
        const baseKey = baseName.replace(/^\d+-/, '');
        index = slideOrderList.findIndex((item) => item.replace(/^\d+-/, '') === baseKey);
    }
    if (index === -1) {
        index = slideOrderList.findIndex((item) => baseName.startsWith(item) || item.startsWith(baseName));
    }
    return index === -1 ? 0 : index;
};

const getTargetHref = (index) => {
    if (!slideOrderList || index < 0 || index >= slideOrderList.length) return null;
    const fileName = window.location.pathname.split('/').pop() || '';
    const extensionMatch = fileName.match(/\.[^/.]+$/);
    const extension = extensionMatch ? extensionMatch[0] : '.html';
    return `${slideOrderList[index]}${extension}`;
};

currentSlide = getCurrentOrderIndex();

function updateSlides() {
    if (hasInlineSlides) {
        slides.forEach((slide, index) => {
            if (index === currentSlide) slide.classList.add('active');
            else slide.classList.remove('active');
        });
    }
    if (pageIndicator) {
        pageIndicator.innerText = `${currentSlide + 1} / ${totalSlides}`;
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        if (hasInlineSlides) {
            currentSlide++;
            updateSlides();
            return;
        }
        const target = getTargetHref(currentSlide + 1);
        if (target) window.location.href = target;
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        if (hasInlineSlides) {
            currentSlide--;
            updateSlides();
            return;
        }
        const target = getTargetHref(currentSlide - 1);
        if (target) window.location.href = target;
    }
}

updateSlides();

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});