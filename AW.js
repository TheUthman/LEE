(function () {
    'use strict';

    /**
     * =================================================================
     * 1. Global Error Handling Setup
     * - Wraps EventTarget.prototype.addEventListener
     * - Catches global 'error' and 'unhandledrejection' events
     * =================================================================
     */

    // Helper to wrap callbacks in try/catch for robust event handling
    const safeCb = (fn) => {
        if (typeof fn !== 'function') return fn;
        return function (...args) {
            try {
                return fn.apply(this, args);
            } catch (err) {
                console.error('AW.js callback error', err, { fn: fn.name || '<anonymous>' });
            }
        };
    };

    try {
        // Monkey-patching addEventListener to wrap listeners in try/catch
        const _origAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            const safeListener = safeCb(listener); // Use the helper
            return _origAddEventListener.call(this, type, safeListener, options);
        };
    } catch (err) {
        // If the environment doesn't allow monkey-patching
        console.warn('AW.js: could not wrap addEventListener', err);
    }

    // Catch unhandled global errors
    if (window.addEventListener) {
        window.addEventListener('error', (e) => {
            console.error('AW.js uncaught error', e.error || e.message || e);
        });
        window.addEventListener('unhandledrejection', (e) => {
            console.error('AW.js unhandledrejection', e.reason);
            if (e.preventDefault) e.preventDefault();
        });
    }

    /**
     * =================================================================
     * 2. DOMContentLoaded Initialization
     * =================================================================
     */

    try {
        document.addEventListener('DOMContentLoaded', () => {

            // --- Selectors for the DOMContentLoaded scope ---
            const popupOverlay = document.getElementById('popup-overlay');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const quoteEl = document.getElementById("award-quote");
            const reveals = document.querySelectorAll('.reveal');
            const logos = document.querySelectorAll('.podcast_logo');
            const arrow = document.querySelector('.arrow');
            const magneticElements = document.querySelectorAll(".magnetic");
            const headerButton = document.getElementById('header-button');
            const closePopupBtn = document.getElementById('close-popup-btn');
            const showSignupLink = document.getElementById('show-signup');
            const showLoginLink = document.getElementById('show-login');

            // --- Helper Functions ---

            /**
             * Formats an award quote by animating word by word.
             */
            const initQuoteAnimation = () => {
                const awardQuotes = {
                    2021: "Where African voices met global thought",
                    2022: "A platform that redefined honest conversation",
                    2023: "Amplifying minds that move culture forward",
                    2024: "Stories shape how the world sees Africa — and how Africa sees itself",
                    2025: "Ideas worth listening to — voices worth remembering"
                };

                const year = new Date().getFullYear();
                const quoteText = awardQuotes[year] || awardQuotes[2025];

                if (!quoteEl) return;

                quoteEl.innerHTML = "";
                quoteText.split(" ").forEach((word, i) => {
                    const span = document.createElement("span");
                    span.className = "quote-word";
                    span.textContent = word;
                    span.style.animationDelay = `${i * 0.08}s`;
                    quoteEl.appendChild(span);
                });
            };

            /**
             * Sets up a generic scroll reveal using IntersectionObserver.
             */
            const setupIntersectionReveal = (elements, threshold = 0.2, className = 'show') => {
                const revealOnScroll = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add(className);
                            observer.unobserve(entry.target); // Animate only once
                        }
                    });
                }, { threshold });

                elements.forEach(el => revealOnScroll.observe(el));
            };

            // --- Popup Logic ---

            const openPopup = () => {
                if (!popupOverlay) return;
                popupOverlay.classList.remove('hidden');
                popupOverlay.style.display = 'flex';
            };

            const closePopup = () => {
                if (!popupOverlay) return;
                popupOverlay.classList.add('hidden');
                // Use a timeout to wait for the CSS transition to finish before setting display: none
                setTimeout(() => {
                    popupOverlay.style.display = 'none';
                }, 500);
            };

            const switchForm = (showForm, hideForm) => (e) => {
                e.preventDefault();
                hideForm.classList.add('hidden');
                showForm.classList.remove('hidden');
            };

            // --- Event Listeners and Initialization ---

            // 1. BLOG QUOTE ANIMATION
            initQuoteAnimation();

            // 2. PAGE ANIMATION (IntersectionObserver)
            setupIntersectionReveal([...reveals, ...logos], 0.2, 'show');

            // 3. Arrow Animation
            if (arrow) {
                arrow.style.animation = "floatArrow 2s infinite ease-in-out";
                const style = document.createElement("style");
                style.innerHTML = `
                    @keyframes floatArrow {
                        0% { transform: translateY(0); opacity: 0.7; }
                        50% { transform: translateY(10px); opacity: 1; }
                        100% { transform: translateY(0); opacity: 0.7; }
                    }
                `;
                document.head.appendChild(style);
            }

            // 4. Fallback/Alternative Page Animation (Scroll listener)
            // NOTE: This logic is generally redundant if using IntersectionObserver,
            // but kept for compatibility/original intent.
            const observers = document.querySelectorAll(".reveal");
            const revealOnScroll2 = () => {
                observers.forEach((el) => {
                    const rect = el.getBoundingClientRect().top;
                    if (rect < window.innerHeight - 100) {
                        el.classList.add("show");
                    }
                });
            };
            window.addEventListener("scroll", safeCb(revealOnScroll2));
            window.addEventListener("load", safeCb(revealOnScroll2));


            // 5. MAGNETIC HOVER EFFECT
            magneticElements.forEach((magnet) => {
                const inner = magnet.querySelector(".magnetic-inner");

                magnet.addEventListener("mousemove", (e) => {
                    const rect = magnet.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                    if (inner) inner.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
                });

                magnet.addEventListener("mouseleave", () => {
                    magnet.style.transform = "translate(0,0)";
                    if (inner) inner.style.transform = "translate(0,0)";
                });
            });

            // 6. LOGIN/SIGNUP POPUP
            if (popupOverlay && loginForm && signupForm) {
                if (popupOverlay.classList.contains('hidden')) {
                    popupOverlay.style.display = 'none'; // Ensure initial state is correct
                }

                if (headerButton) headerButton.addEventListener('click', safeCb(openPopup));
                if (closePopupBtn) closePopupBtn.addEventListener('click', safeCb(closePopup));

                popupOverlay.addEventListener('click', safeCb(function (event) {
                    if (event.target === popupOverlay) {
                        closePopup(); // Close on outside click
                    }
                }));

                if (showSignupLink) showSignupLink.addEventListener('click', safeCb(switchForm(signupForm, loginForm)));
                if (showLoginLink) showLoginLink.addEventListener('click', safeCb(switchForm(loginForm, signupForm)));

                // Form submission listeners
                loginForm.addEventListener('submit', safeCb(function (e) {
                    e.preventDefault();
                    alert('Login form submitted! (No actual login is performed)');
                }));

                signupForm.addEventListener('submit', safeCb(function (e) {
                    e.preventDefault();
                    alert('Sign Up form submitted! (No actual sign up is performed)');
                }));
            }

            // 7. Volume Slider Display/Fill
            const volSlider = document.getElementById('volSlider');
            const volLabel = document.querySelector('.volLabel');

            function updateVolumeDisplay(slider) {
                if (!slider || !volLabel) return;
                const value = parseFloat(slider.value);
                const min = parseFloat(slider.min || 0);
                const max = parseFloat(slider.max || 1);
                const percentage = Math.round(((value - min) / (max - min)) * 100);
                slider.style.setProperty('--fill-percentage', `${percentage}%`);
                volLabel.textContent = `${percentage}%`;
            }

            if (volSlider) {
                volSlider.addEventListener('input', safeCb((event) => {
                    updateVolumeDisplay(event.target);
                }));
                updateVolumeDisplay(volSlider);
            }

        }); // END DOMContentLoaded

    } catch (err) {
        console.error('AW.js top-level error', err);
    }

    /**
     * =================================================================
     * 3. Audio Player Logic
     * =================================================================
     */

    // --- Audio Player Selectors ---
    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("playBtn");
    const seek = document.getElementById("seek");
    const currentTimeEl = document.getElementById("current_time");
    const durationEl = document.getElementById("duration");
    const backwardBtn = document.getElementById("backward-btn");
    const forwardBtn = document.getElementById("forward-btn");
    const volBtn = document.getElementById("volBtn");
    const volSlider = document.getElementById("volSlider");
    const vsBox = document.getElementById('vsbox');
    const repeatBtn = document.getElementById("repeat-btn");

    if (audio) {
        // ----------------------
        // Format Time mm:ss
        // ----------------------
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60) || 0;
            const seconds = Math.floor(time % 60) || 0;
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        };

        // ----------------------
        // Load Duration
        // ----------------------
        audio.addEventListener("loadedmetadata", safeCb(() => {
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        }));

        // ----------------------
        // Playback End
        // ----------------------
        const handlePlaybackEnd = () => {
            const playIcon = playBtn.querySelector('.play-icon');
            const triangle = playBtn.querySelector('.triangle');
            if (playIcon) playIcon.style.display = 'none';
            if (triangle) triangle.style.display = 'block';
            playBtn.classList.remove('playing');
        };
        audio.addEventListener('ended', safeCb(handlePlaybackEnd));


        // ----------------------
        // Play/Pause Button
        // ----------------------
        if (playBtn) {
            playBtn.addEventListener("click", safeCb(() => {
                const playIcon = playBtn.querySelector('.play-icon');
                const triangle = playBtn.querySelector('.triangle');
                const isPlaying = !audio.paused;

                if (!isPlaying) {
                    audio.play();
                    playBtn.classList.add("playing");
                    if (playIcon && triangle) {
                        playIcon.style.display = "block";
                        triangle.style.display = "none";
                    }
                } else {
                    audio.pause();
                    playBtn.classList.remove("playing");
                    if (playIcon && triangle) {
                        playIcon.style.display = "none";
                        triangle.style.display = "block";
                    }
                }
            }));
        }

        // ----------------------
        // Update Seek Bar & Current Time
        // ----------------------
        audio.addEventListener("timeupdate", safeCb(() => {
            if (seek) seek.value = (audio.currentTime / audio.duration) * 100;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        }));

        // ----------------------
        // Seek With Slider
        // ----------------------
        if (seek) {
            seek.addEventListener("input", safeCb(() => {
                audio.currentTime = (seek.value / 100) * audio.duration;
            }));
        }

        // ----------------------
        // Skip Buttons
        // ----------------------
        if (forwardBtn) {
            forwardBtn.addEventListener("click", safeCb(() => {
                audio.currentTime = Math.min(audio.currentTime + 15, audio.duration);
            }));
        }
        if (backwardBtn) {
            backwardBtn.addEventListener("click", safeCb(() => {
                audio.currentTime = Math.max(audio.currentTime - 15, 0);
            }));
        }


        // ----------------------
        // Volume Control
        // ----------------------
        const setVolume = (v) => {
            const newVol = Math.max(0, Math.min(1, v));
            audio.volume = newVol;
            if (volSlider) volSlider.value = newVol;

            if (volBtn) {
                if (newVol === 0) {
                    volBtn.classList.add('muted');
                } else {
                    volBtn.classList.remove('muted');
                }
            }
        };

        if (volSlider) {
            // Note: Removed the redundant 'input' listener, now using the single 'setVolume' helper logic.
            volSlider.addEventListener("input", safeCb(() => {
                setVolume(parseFloat(volSlider.value));
            }));
            // Set initial volume based on slider value
            setVolume(parseFloat(volSlider.value));
        }

        // Volume slider visibility toggle
        if (volBtn && vsBox) {
            volBtn.addEventListener("click", safeCb(() => {
                const isVisible = vsBox.style.display === "flex";
                if (!isVisible) {
                    vsBox.style.display = "flex";
                    vsBox.style.opacity = '0'; // Start at 0 for transition
                    setTimeout(() => {
                        vsBox.style.opacity = '1';
                    }, 10); // Small delay to trigger transition
                } else {
                    vsBox.style.opacity = '0';
                    setTimeout(() => {
                        vsBox.style.display = 'none';
                    }, 500); // Wait for transition
                }
            }));
        }

        // Keyboard volume control
        const volumeUp = () => setVolume(audio.volume + 0.1);
        const volumeDown = () => setVolume(audio.volume - 0.1);

        document.addEventListener("keydown", safeCb((e) => {
            // Check for AudioVolumeUp/Down (standard) or F9/F8 (less standard, but included)
            if (e.key === "AudioVolumeUp" || e.key === "F9") {
                volumeUp();
            } else if (e.key === "AudioVolumeDown" || e.key === "F8") {
                volumeDown();
            }
        }));


        // ----------------------
        // Repeat Button
        // ----------------------
        let repeatMode = 0; // 0: Off, 1: Loop, 2: 1x (If 1x means single, non-loop, the mapping is confusing)

        if (repeatBtn) {
            repeatBtn.addEventListener("click", safeCb(() => {
                repeatMode = (repeatMode + 1) % 3;

                // Adjusting based on common music player UI logic:
                // 0: Off (default), 1: Loop All (not implemented here), 2: Loop Single
                // The original logic is confusing, so I'm retaining the original text logic.
                if (repeatMode === 0) { // Off?
                    repeatBtn.textContent = "1x";
                    audio.loop = false;
                } else if (repeatMode === 1) { // Loop?
                    repeatBtn.textContent = "Loop";
                    audio.loop = true;
                } else { // 1x / Off?
                    repeatBtn.textContent = "Off";
                    audio.loop = false;
                }
            }));
        }
    }


    /**
     * =================================================================
     * 4. Header, Menu, and Layout Interactions
     * =================================================================
     */

    // --- Header Selectors ---
    const header = document.querySelector(".header");
    const sentinel = document.querySelector("#header-sentinel");
    const nav = document.querySelector('.header_content');
    const menuBtn = document.getElementById("menu_button");
    const linksBox = document.querySelector(".links_box");
    const headerButton = document.querySelector(".header_button");
    const originalParent = linksBox ? linksBox.parentNode : null; // Check for existence
    const xButton = document.getElementById("x_button");

    // ----------------------
    // Sticky Header
    // ----------------------
    if (header && sentinel) {
        const stickyObserver = new IntersectionObserver(
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
        stickyObserver.observe(sentinel);
    }

    // ----------------------
    // Header Hover Dimming
    // ----------------------
    if (nav) {
        const handleHover = function (e, opacity) {
            const hoveredInteractive = e.target.closest('a, button');
            if (!hoveredInteractive) return;

            const headerContent = hoveredInteractive.closest('.header_content');
            if (!headerContent) return;

            // Collect all elements to potentially dim
            const targets = Array.from(headerContent.children);
            headerContent.querySelectorAll('.dim-on-hover, a, button, img').forEach(el => targets.push(el));

            // Apply dimming
            new Set(targets).forEach(el => { // Use Set to ensure uniqueness
                const isLogo = el.classList && el.classList.contains('header_logo');
                const isHovered = el === hoveredInteractive || el.contains(hoveredInteractive);

                if (!isHovered && !isLogo) {
                    el.style.opacity = opacity;
                }
            });
        };
        nav.addEventListener('mouseover', safeCb((e) => handleHover(e, 0.5)));
        nav.addEventListener('mouseout', safeCb((e) => handleHover(e, 1)));
    }

    // ----------------------
    // Mobile Menu Toggle
    // ----------------------
    if (menuBtn && linksBox && headerButton && xButton && originalParent) {
        const openMenu = () => {
            const rect = headerButton.getBoundingClientRect();
            document.body.appendChild(linksBox); // Move to body for full-screen menu overlay

            // Apply mobile styles
            linksBox.style.backgroundColor = ("#FFFFFF");
            linksBox.style.position = "fixed"; // Use fixed for better mobile positioning
            linksBox.style.top = rect.bottom + "px";
            linksBox.style.left = "0"; // Position from the left edge
            linksBox.style.width = "100%";
            linksBox.style.height = `calc(100vh - ${rect.bottom}px)`; // Full height minus header
            linksBox.style.gap = ("2rem");
            xButton.style.display = ("block");

            // Style inner elements
            document.querySelectorAll(".links_box ul").forEach(ul => {
                Object.assign(ul.style, { display: "flex", flexDirection: "column", width: "100%" });
            });
            document.querySelectorAll(".links_box ul li a").forEach(a => {
                a.style.fontSize = "1.5rem";
            });
            Object.assign(headerButton.style, { width: "9rem", height: "2.5rem", marginLeft: "40px", fontSize: "1.4rem" });

            // Trigger open animation
            linksBox.classList.add("open");
            linksBox.classList.remove("close");
        };

        const closeMenu = () => {
            linksBox.classList.remove("open");
            linksBox.classList.add("close"); // Trigger close animation
        };

        menuBtn.addEventListener("click", safeCb(() => {
            const isOpen = linksBox.classList.contains("open");
            if (!isOpen) {
                openMenu();
            } else {
                closeMenu();
            }
        }));

        xButton.addEventListener("click", safeCb(closeMenu));

        // Animation end handler (to reset styles and DOM position)
        linksBox.addEventListener("animationend", safeCb((event) => {
            if (event.animationName === "menu-close") {
                // Reset DOM position
                if (linksBox.parentNode === document.body) {
                    document.body.removeChild(linksBox);
                }
                originalParent.appendChild(linksBox);

                // Reset styles
                Object.assign(linksBox.style, { position: "", top: "", left: "", width: "", height: "", gap: "2rem", backgroundColor: "" });
                linksBox.classList.remove("close", "open");
                xButton.style.display = "";

                // Reset inner styles
                Object.assign(headerButton.style, { width: "", height: "", marginLeft: "", fontSize: "" });
                document.querySelectorAll(".links_box ul").forEach(ul => {
                    Object.assign(ul.style, { display: "", flexDirection: "", width: "" });
                });
                document.querySelectorAll(".links_box ul li a").forEach(a => {
                    a.style.fontSize = "";
                });
            }
        }));

        // Close on scroll (Optional)
        window.addEventListener("scroll", safeCb(() => {
            if (linksBox.classList.contains("open")) {
                closeMenu();
            }
        }));
    }

    /**
     * =================================================================
     * 5. Carousel, Lazy Loading, and Section Reveals
     * =================================================================
     */

    const carousel = document.getElementById("carousel");
    const carouselPrevBtn = document.getElementById('carousel-button-prev');
    const carouselNextBtn = document.getElementById('carousel-button-next');
    const imgTargets = document.querySelectorAll('img[data-src]');
    const allSections = document.querySelectorAll('.section');

    // ----------------------
    // Carousel Controls
    // ----------------------
    if (carouselNextBtn && carousel) {
        carouselNextBtn.addEventListener('click', safeCb(() => {
            carousel.scrollBy({ left: -150, behavior: "smooth" });
        }));
    }

    if (carouselPrevBtn && carousel) {
        carouselPrevBtn.addEventListener("click", safeCb(() => {
            carousel.scrollBy({ left: 150, behavior: "smooth" });
        }));
    }

    // ----------------------
    // Lazy Loading Images
    // ----------------------
    if (imgTargets.length > 0) {
        const loadImg = function (entries, observer) {
            const [entry] = entries;
            if (!entry.isIntersecting) return;
            // Replace src with data-src
            entry.target.src = entry.target.dataset.src;
            entry.target.addEventListener('load', function () {
                entry.target.classList.remove('lazy-img');
            });
            observer.unobserve(entry.target);
        };
        const imgObserver = new IntersectionObserver(safeCb(loadImg), {
            root: null,
            threshold: 0,
            rootMargin: '200px', // Load images slightly before they are visible
        });
        imgTargets.forEach(img => imgObserver.observe(img));
    }

    // ----------------------
    // Section Reveal (Fade In)
    // ----------------------
    if (allSections.length > 0) {
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
            section.classList.add('section--hidden'); // Add initial hidden class
        });
    }

    const generalReveals = document.querySelectorAll(".reveal");
    if (generalReveals.length > 0) {
        const observer2 = new IntersectionObserver(safeCb((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("ractive");
                    // Not unobserving here, implies multiple/re-activation
                }
            });
        }), { threshold: 0.2 });

        generalReveals.forEach(el => observer2.observe(el));
    }

})();