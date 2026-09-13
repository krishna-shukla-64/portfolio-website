let GD = ["Captivating", "Remarkable", "Seamless", "Exceptional", "Elegant", "Extraordinary", "Beautiful", "Professional", "Eye-Catching"]
let SD = ["Without Bugs", "Effortlessly", "Remarkably", "Exceptionally", "Responsively", "Consistently", "Flawlessly", "Non stop", "Effectively"]




const targetElem1 = document.querySelector(".changingTxtLeft");
let index1 = 0;

setInterval(() => {
    code = GD[index1]
    targetElem1.innerHTML = code
    index1 = (index1 + 1) % GD.length
}, 1300);




const targetElem2 = document.querySelector(".changingTxtRight");
let index2 = 0;

setInterval(() => {
    code = SD[index2]
    targetElem2.innerHTML = code;
    index2 = (index2 + 1) % SD.length;
}, 1600);




// script for my projects card 




document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("sliderContainer");
    const track = document.getElementById("sliderTrack");
    const dotsContainer = document.getElementById("navDots");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    const originalCards = Array.from(document.querySelectorAll(".procard"));
    const numOriginals = originalCards.length;

    // 1. Create Navigation Dots
    originalCards.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        
        dot.addEventListener("click", () => {
            goToSlide(index + numOriginals); 
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll(".dot");

    // 2. Clone Cards for the Infinite Loop Effect
    const clonesStart = originalCards.map(card => card.cloneNode(true));
    track.prepend(...clonesStart);
    
    const clonesEnd = originalCards.map(card => card.cloneNode(true));
    track.append(...clonesEnd);

    let currentIndex = numOriginals; 
    let isTransitioning = false;
    let autoPlayTimer;
    let transitionTimeout;

    // 3. Mathematical Centering Logic
    function updateSlider(instant = false) {
        const cards = track.children;
        if (!cards[currentIndex]) return;
        
        const card = cards[currentIndex];
        const cardWidth = card.getBoundingClientRect().width; // Exact mobile decimals
        const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
        
        const slidePos = currentIndex * (cardWidth + gap);
        const containerCenter = container.clientWidth / 2;
        const cardCenter = cardWidth / 2;
        const translateX = -(slidePos - containerCenter + cardCenter);

        // Clear any stuck timeouts
        clearTimeout(transitionTimeout);

        if (instant) {
            track.style.transition = 'none';
            track.style.transform = `translateX(${translateX}px)`;
            isTransitioning = false; // MUST UNLOCK HERE
        } else {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(${translateX}px)`;
            isTransitioning = true;
            
            // BULLETPROOF UNLOCK: Force unlock exactly when animation ends
            transitionTimeout = setTimeout(() => {
                isTransitioning = false;
                checkInfiniteLoop(); // Check if we need to silently reset position
            }, 500); // 500ms matches the 0.5s CSS transition
        }

        const activeIndex = currentIndex % numOriginals;
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[activeIndex]) dots[activeIndex].classList.add("active");
    }

    // 4. Infinite Loop Jump Logic
    function checkInfiniteLoop() {
        if (currentIndex >= numOriginals * 2) {
            currentIndex = currentIndex - numOriginals;
            updateSlider(true); 
        } 
        else if (currentIndex < numOriginals) {
            currentIndex = currentIndex + numOriginals;
            updateSlider(true); 
        }
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        updateSlider();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentIndex--;
        updateSlider();
    }

    // 5. Button Listeners
    // Added safety check in case buttons are clicked before slider initializes
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // 6. Auto-Play Loop
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // 7. Touch Support (Swipe Left/Right)
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        resetAutoPlay();
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        // Swipe threshold lowered to 30px for better mobile feel
        if (startX - endX > 30) {
            nextSlide(); 
        } else if (endX - startX > 30) {
            prevSlide();
        }
    });

    // 8. Initialization 
    window.addEventListener("load", () => {
        updateSlider(true);
        track.classList.add("loaded"); 
        startAutoPlay();
    });

    window.addEventListener("resize", () => {
        updateSlider(true); // instant update resets locks safely now
    });
});