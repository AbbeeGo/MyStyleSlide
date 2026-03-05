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
/* ── Auto-Fit Text ──
		   偵測每張 slide 的 .outer 容器是否溢出，自動縮小字級。
		   支援 resize / fullscreen 切換：先還原原始字級再重新偵測。
		*/
(function () {
	const MIN_FONT = 14;          // 最小字級下限 (px)
	const STEP = 1;               // 每次縮小幅度 (px)
	const MAX_TRIES = 40;         // 最大縮小次數，避免無窮迴圈
	const SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,span,div,td,th';

	// 用 WeakMap 儲存每個元素的「原始 computed font-size」
	const originalSizes = new WeakMap();
	let initialized = false;

	/** 記錄所有 .outer 內文字元素的原始字級（只做一次） */
	function cacheOriginalSizes() {
		if (initialized) return;
		document.querySelectorAll('.slide .outer').forEach(outer => {
			outer.querySelectorAll(SELECTOR).forEach(el => {
				if (!originalSizes.has(el)) {
					originalSizes.set(el, parseFloat(getComputedStyle(el).fontSize));
				}
			});
		});
		initialized = true;
	}

	/** 還原所有元素到原始字級 */
	function resetAllSizes() {
		document.querySelectorAll('.slide .outer').forEach(outer => {
			outer.querySelectorAll(SELECTOR).forEach(el => {
				if (originalSizes.has(el)) {
					el.style.fontSize = '';   // 清除 inline override，回歸 CSS
				}
			});
		});
	}

	/** 對單一 .outer 做溢出偵測 & 縮放 */
	function fitOuter(outer) {
		const textEls = outer.querySelectorAll(SELECTOR);
		let tries = 0;

		while (outer.scrollHeight > outer.clientHeight + 2 && tries < MAX_TRIES) {
			let anyShrank = false;
			textEls.forEach(el => {
				const current = parseFloat(getComputedStyle(el).fontSize);
				if (current > MIN_FONT) {
					el.style.fontSize = (current - STEP) + 'px';
					anyShrank = true;
				}
			});
			if (!anyShrank) break;   // 全部已達下限，停止
			tries++;
		}
	}

	/** 主函式：還原 → 重新偵測全部 slide */
	function autoFitAll() {
		cacheOriginalSizes();
		resetAllSizes();

		// 給瀏覽器一個 frame 重新 layout 後再量測
		requestAnimationFrame(() => {
			document.querySelectorAll('.slide .outer').forEach(fitOuter);
		});
	}

	// ── 觸發時機 ──
	window.addEventListener('load', autoFitAll);

	// resize（含 F11 全螢幕）：加 debounce 避免頻繁觸發
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(autoFitAll, 200);
	});

	// Fullscreen API change
	document.addEventListener('fullscreenchange', () => {
		setTimeout(autoFitAll, 300);
	});
})();
updateSlides();
