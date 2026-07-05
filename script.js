const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');
const loader = document.getElementById('loader');
const loaderPct = document.querySelector('.loader-percentage');
const animationContainer = document.querySelector('.animation-container');

const frameCount = 300;
const currentFrame = index => (
    `coke_frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];

// Preload images
const preloadImages = () => {
    let loadedCount = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedCount++;
            const pct = Math.floor((loadedCount / frameCount) * 100);
            loaderPct.innerText = `${pct}%`;

            if (loadedCount === frameCount) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 800);
                }, 500);
                initWebsite();
            }
        };
        images.push(img);
    }
};

const initWebsite = () => {
    resize();
    render(0);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const containerOffset = animationContainer.offsetTop;
        const containerHeight = animationContainer.offsetHeight - window.innerHeight;
        
        let progress = (scrollTop - containerOffset) / containerHeight;
        progress = Math.max(0, Math.min(1, progress));

        const frameIndex = Math.floor(progress * (frameCount - 1));

        requestAnimationFrame(() => {
            render(frameIndex);
            updateOverlays(progress);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
};

const render = (index) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[index];
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;
    
    const ratio = Math.max(cw / iw, ch / ih);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    context.drawImage(img, nx, ny, nw, nh);
};

const updateOverlays = (progress) => {
    const overlays = document.querySelectorAll('.hero-text');
    const step = 1 / overlays.length;
    
    overlays.forEach((el, i) => {
        const start = i * step;
        const end = (i + 1) * step;
        
        if (progress >= start && progress < end) {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    });
};

const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    render(0);
};

window.addEventListener('resize', resize);
preloadImages();
