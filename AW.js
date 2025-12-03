(function(){
    'use strict';
    try {
        const _origAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const safeListener = function(...args) {
                try {
                    return listener.apply(this, args);
                } catch (err) {
                    console.error('AW.js listener error:', err, { type, target: this });
                }
            };
            return _origAddEventListener.call(this, type, safeListener, options);
        };
    } catch (err) {
        // If the environment doesn't allow monkey-patching, continue without it
        console.warn('AW.js: could not wrap addEventListener', err);
    }

    window.addEventListener && window.addEventListener('error', (e) => {
        console.error('AW.js uncaught error', e.error || e.message || e);
    });
    window.addEventListener && window.addEventListener('unhandledrejection', (e) => {
        console.error('AW.js unhandledrejection', e.reason);
        if (e.preventDefault) e.preventDefault();
    });

    try {
    document.addEventListener('DOMContentLoaded', () => {
    const header_button = document.getElementById('header-button');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    // --- Popup Visibility Functions ---
    
    // Function to show the popup
    function openPopup() {
        popupOverlay.classList.remove('hidden');
        popupOverlay.style.display = 'flex'; 
    }
    // Function to hide the popup
    function closePopup() {
        popupOverlay.classList.add('hidden');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 500);
    }
    header_button.addEventListener('click', openPopup);
    closePopupBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });

    // --- Form Switching Functions ---
    // Function to switch to Sign Up form
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link action
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    // Function to switch to Login form
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault(); 
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    // --- Initial State ---
    // Ensure the popup is hidden on load by setting its display property
    // We already have .hidden in the HTML, but this ensures the JS takes over.
    if (popupOverlay.classList.contains('hidden')) {
        popupOverlay.style.display = 'none';
    }

    // --- Form Submission (Prevent default for demonstration) ---
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Login form submitted! (No actual login is performed)');
        // In a real application, you would send data to a server here.
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Sign Up form submitted! (No actual sign up is performed)');
        // In a real application, you would send data to a server here.
    });
});
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const seek = document.getElementById("seek");
const currentTimeEl = document.getElementById("current_time");
const durationEl = document.getElementById("duration");
const backwardBtn = document.getElementById("backward-btn");
const forwardBtn = document.getElementById("forward-btn");
const volBtn = document.getElementById("volBtn");
const volSlider = document.getElementById("volSlider");
const repeatBtn = document.getElementById("repeat-btn");
const carousel = document.getElementById("carousel");
const nav = document.querySelector('.header_content');
const menubtn = document.getElementById('menu_button');
const page_header = document.querySelector('.header');
const menu = document.querySelector('.menu');
const menuBtn = document.getElementById("menu_button");
const linksBox = document.querySelector(".links_box");
const hb = document.querySelector(".header_button");
const originalParent = linksBox.parentNode;
const xbutton = document.getElementById("x_button");

// helper to wrap callbacks in try/catch
const safeCb = (fn) => {
    if (typeof fn !== 'function') return fn;
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (err) {
            console.error('AW.js callback error', err, { fn: fn.name || '<anonymous>' });
        }
    };
};
const reveals = document.querySelectorAll(".reveal");

const observer2 = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("ractive");
        }
    });
}, { threshold: 0.2 });

reveals.forEach(el => observer2.observe(el));

// Sticky header
const header = document.querySelector(".header");
const sentinel = document.querySelector("#header-sentinel");

const observer = new IntersectionObserver(
    safeCb(([entry]) => {
        if (!entry.isIntersecting) {
            header.classList.add("sticky");
            header.style.backgroundColor = "#FCF4E3";
        } else {
            header.classList.remove("sticky");
            header.style.backgroundColor = "transparent";
        }
    }),
    { threshold: 0 }
);
observer.observe(sentinel);

// --- Header hover dimming behavior ---

const handleHover = function (e, opacity) {
    const hoveredInteractive = e.target.closest('a, button');
    if (!hoveredInteractive) return;
    console.log("hovered")
    const header = hoveredInteractive.closest('.header_content');
    if (!header) return;
    const headerChildren = Array.from(header.children);
    const extraDimTargets = Array.from(header.querySelectorAll('.dim-on-hover'));
    const interactiveTargets = Array.from(header.querySelectorAll('a, button, img'));
    const targets = new Set([...headerChildren, ...extraDimTargets, ...interactiveTargets]);

    targets.forEach(el => {
        if (el === hoveredInteractive || el.contains(hoveredInteractive)) return;
        if (el.classList && el.classList.contains('header_logo')) return;
        el.style.opacity = opacity;
    });
};
nav.addEventListener('mouseover', (e) => handleHover(e, 0.5));
nav.addEventListener('mouseout', (e) => handleHover(e, 1));

menuBtn.addEventListener("click", () => {
    linksBox.getComputedStyle
    const isOpen = linksBox.classList.contains("open");
    if (!isOpen) {
    document.body.appendChild(linksBox);
    const rect = hb.getBoundingClientRect();
    document.querySelectorAll(".links_box ul").forEach(ul => {
        ul.style.display = "flex";
        ul.style.flexDirection = "column";
        ul.style.width = "100%"
        
        });
        document.querySelectorAll(".links_box ul li a").forEach(a => {
        a.style.fontSize = "1.5rem"
        });
    hb.style.width = ("9.5rem");
    hb.style.height = ("2.5rem");
    hb.style.marginLeft = ("40px");
    hb.style.fontSize = "1.5rem"
    linksBox.style.backgroundColor = ("#FFFFFF")
    linksBox.style.position = "absolute";
    linksBox.style.top = rect.bottom + "px";
    linksBox.style.left = rect.left + "px";
    linksBox.style.width = ("95%");
    linksBox.style.height = ("95%");
    linksBox.style.gap = ("2rem");
    xbutton.style.display = ("block")
    // Trigger open animation
    linksBox.classList.add("open");
    linksBox.classList.remove("close");
    }
});

xbutton.addEventListener("click", () => {
    linksBox.classList.remove("open");
    linksBox.classList.add("close");
});

// Listen for animation end
linksBox.addEventListener("animationend", (event) => {
    console.log(`Animation '${event.animationName}' finished!`);
    if (event.animationName === "menu-close") {
    linksBox.parentNode.removeChild(linksBox)
    originalParent.appendChild(linksBox);
    linksBox.style.position = "";
    linksBox.style.top = "";
    linksBox.style.left = "";
    linksBox.style.width = "";
    linksBox.style.height = "";
    linksBox.style.gap = "2rem";
    linksBox.style.backgroundColor = "";
    linksBox.classList.remove("close");
    linksBox.classList.remove("open")
    xbutton.style.display = ("")
    hb.style.width = ("");
    hb.style.height = ("");
    hb.style.marginLeft = ("");
    hb.style.fontSize = "";
    document.querySelectorAll(".links_box ul").forEach(ul => {
        ul.style.display = "";
        ul.style.flexDirection = "";
        ul.style.width = ""
        });
        document.querySelectorAll(".links_box ul li a").forEach(a => {
        a.style.fontSize = ""
        });
    }
});

// Optional: close on scroll
window.addEventListener("scroll", () => {
    if (linksBox.classList.contains("open")) {
        menuBtn.click();
    }
});

// ----------------------
// Format Time mm:ss
// ----------------------
function formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ----------------------
// Load Duration
// ----------------------
audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

const handlePlaybackEnd = () => {
    const playIcon = playBtn.querySelector('.play-icon');
    const triangle = playBtn.querySelector('.triangle');
    if (playIcon) playIcon.style.display = 'none';
    if (triangle) triangle.style.display = 'block';
    playBtn.classList.remove('playing');
};

audio.addEventListener('ended', handlePlaybackEnd);
playBtn.addEventListener("click", () => {
    const playIcon = playBtn.querySelector('.play-icon');
    const triangle = playBtn.querySelector('.triangle');
    const displayStyle = window.getComputedStyle(playIcon).display;
    if (audio.paused) {
        audio.play();
        playBtn.classList.add("playing");

        if (displayStyle === "none") {
            playIcon.style.display = "block";
            triangle.style.display = "none";
        }
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        if (displayStyle ===  "block") {
            playIcon.style.display = "none";
            triangle.style.display = "block";
        }
    }
});

// ----------------------
// Update Seek Bar
// ----------------------
audio.addEventListener("timeupdate", () => {
    seek.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

// ----------------------
// Seek With Slider
// ----------------------
seek.addEventListener("input", () => {
    audio.currentTime = (seek.value / 100) * audio.duration;
});

// ----------------------
// Skip Buttons
// ----------------------
forwardBtn.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.currentTime + 15, audio.duration);
});

backwardBtn.addEventListener("click", () => {
    audio.currentTime = Math.max(audio.currentTime - 15, 0);
});

// ----------------------
// Volume Slider
// ----------------------
volSlider.addEventListener("input", () => {
    audio.volume = volSlider.value;

    if (audio.volume === 0) {
        volBtn.classList.add("muted");
    } else {
        volBtn.classList.remove("muted");
    }
});
volSlider.addEventListener("input", () => {
    audio.volume = volSlider.value;

    if (audio.volume === 0) {
        volBtn.classList.add("muted");
    } else {
        volBtn.classList.remove("muted");
    }
});

const volumeup = function() {
    audio.volume = Math.min(audio.volume + 0.1, 1);
}
const volumedown = function() {
    audio.volume = Math.max(audio.volume - 0.1, 0);
}
document.addEventListener("keydown", (e) => {
    if (e.key === "AudioVolumeUp" || e.key === "F9") {
        volumeup();
    }else if (e.key === "AudioVolumeDown" || e.key === "F8") {
        volumedown();
    }
})

volBtn.addEventListener("click", () => {
    const currentDisplay = window.getComputedStyle(volSlider).display;
    if (currentDisplay === "none") {
        volSlider.style.display = "block";
    } else {
        volSlider.style.display = "none";
    }
});

const setVolume = (v) => {
    const newVol = Math.max(0, Math.min(1, v));
    audio.volume = newVol;
    if (volSlider) volSlider.value = newVol;
    if (newVol === 0) {
        volBtn.classList.add('muted');
    } else {
        volBtn.classList.remove('muted');
    }
};

const volumeUp = () => setVolume((audio.volume || 0) + 0.1);
const volumeDown = () => setVolume((audio.volume || 0) - 0.1);

document.addEventListener('keydown', (e) => {
    const key = e.key;
    const code = e.code;

    if (key === 'F9' || code === 'AudioVolumeUp' || key === 'VolumeUp' || key === 'AudioVolumeUp') {
        if (key === 'F9') e.preventDefault();
        volumeUp();
        return;
    }
    if (key === 'F8' || code === 'AudioVolumeDown' || key === 'VolumeDown' || key === 'AudioVolumeDown') {
        if (key === 'F8') e.preventDefault();
        volumeDown();
        return;
    }
});

// repeat button behavior
let repeatMode = 0;

repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;

    if (repeatMode === 0) {
        repeatBtn.textContent = "1x";
        audio.loop = false;
    }
    else if (repeatMode === 1) {
        repeatBtn.textContent = "Loop";
        audio.loop = true;
    }
    else {
        repeatBtn.textContent = "Off";
        audio.loop = false;
    }
});

//carousel buttons
const carouselPrevBtn = document.getElementById('carousel-button-prev');
const carouselNextBtn = document.getElementById('carousel-button-next');

carouselNextBtn.addEventListener('click', () =>{
    carousel.scrollBy({ left: -150, behavior: "smooth" });
});
carouselPrevBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: 150, behavior: "smooth" });
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(safeCb(loadImg), {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Section reveal
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    });
};
const sectionObserver = new IntersectionObserver(safeCb(revealSection), {
    root: null,
    threshold: 0.15,
});

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});



    } catch (err) {
        console.error('AW.js top-level error', err);
    }
})();




