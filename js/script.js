/* ============================================================
   1. DARK / LIGHT MODE TOGGLE (with localStorage)
   ============================================================ */
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeBtn(savedTheme);

    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", toggleTheme);
}

function updateThemeBtn(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeBtn(next);
}

/* ============================================================
   2. HAMBURGER MENU TOGGLE
   ============================================================ */
function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("nav-open");
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Close menu on link click
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("nav-open");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", false);
        });
    });

    // Close on outside click
    document.addEventListener("click", e => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove("nav-open");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", false);
        }
    });
}

/* ============================================================
   3. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener(
        "scroll",
        () => {
            btn.classList.toggle("visible", window.scrollY > 300);
        },
        { passive: true }
    );

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ============================================================
   4. IMAGE SLIDER / CAROUSEL
   ============================================================ */
function initSlider() {
    const slider = document.querySelector(".slider");
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    const dotsContainer = slider.querySelector(".slider-dots");
    let current = 0;
    let autoPlay;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "slider-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        slides[current].classList.remove("active");
        slider
            .querySelectorAll(".slider-dot")
            [current].classList.remove("active");
        current = (index + slides.length) % slides.length;
        slides[current].classList.add("active");
        slider.querySelectorAll(".slider-dot")[current].classList.add("active");
    }

    function startAuto() {
        autoPlay = setInterval(() => goTo(current + 1), 4000);
    }

    function stopAuto() {
        clearInterval(autoPlay);
    }

    prevBtn.addEventListener("click", () => {
        stopAuto();
        goTo(current - 1);
        startAuto();
    });
    nextBtn.addEventListener("click", () => {
        stopAuto();
        goTo(current + 1);
        startAuto();
    });

    // Swipe support
    let touchStartX = 0;
    slider.addEventListener(
        "touchstart",
        e => {
            touchStartX = e.touches[0].clientX;
        },
        { passive: true }
    );
    slider.addEventListener("touchend", e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            stopAuto();
            goTo(current + (diff > 0 ? 1 : -1));
            startAuto();
        }
    });

    slides[0].classList.add("active");
    startAuto();
}

/* ============================================================
   5. MODAL POPUP
   ============================================================ */
function initModal() {
    const modal = document.getElementById("quote-modal");
    if (!modal) return;

    const openBtns = document.querySelectorAll("[data-modal-open]");
    const closeBtn = modal.querySelector(".modal-close");

    function openModal() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    openBtns.forEach(btn => btn.addEventListener("click", openModal));
    closeBtn.addEventListener("click", closeModal);

    // Close on outside click
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("open"))
            closeModal();
    });
}

/* ============================================================
   6. FORM VALIDATION (Real-time)
   ============================================================ */
function initFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const textarea = document.getElementById("message");
    const charCounter = document.getElementById("char-counter");

    /* ============================================================
   MODAL FORM VALIDATION
   ============================================================ */

    function showError(input, message) {
        let errEl = input.nextElementSibling;
        if (!errEl || !errEl.classList.contains("field-error")) {
            errEl = document.createElement("span");
            errEl.className = "field-error";
            input.parentNode.insertBefore(errEl, input.nextSibling);
        }
        errEl.textContent = message;
        input.classList.add("input-error");
        input.classList.remove("input-valid");
    }

    function showSuccess(input) {
        const errEl = input.nextElementSibling;
        if (errEl && errEl.classList.contains("field-error"))
            errEl.textContent = "";
        input.classList.remove("input-error");
        input.classList.add("input-valid");
    }

    function validateName() {
        const val = nameInput.value.trim();
        if (val.length === 0) {
            showError(nameInput, "Name is required.");
            return false;
        }
        if (val.length < 3) {
            showError(nameInput, "Name must be at least 3 characters.");
            return false;
        }
        showSuccess(nameInput);
        return true;
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val.length === 0) {
            showError(emailInput, "Email is required.");
            return false;
        }
        if (!regex.test(val)) {
            showError(emailInput, "Please enter a valid email address.");
            return false;
        }
        showSuccess(emailInput);
        return true;
    }

    function validatePhone() {
        const val = phoneInput.value.trim();
        if (val.length === 0) return true; // optional field
        const digits = val.replace(/\D/g, "");
        if (digits.length !== 10) {
            showError(phoneInput, "Phone number must be exactly 10 digits.");
            return false;
        }
        showSuccess(phoneInput);
        return true;
    }

    function validateMessage() {
        const val = messageInput.value.trim();
        if (val.length === 0) {
            showError(messageInput, "Message is required.");
            return false;
        }
        showSuccess(messageInput);
        return true;
    }

    // Real-time listeners
    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    phoneInput.addEventListener("input", validatePhone);
    messageInput.addEventListener("input", validateMessage);

    // Character counter for textarea
    if (textarea && charCounter) {
        const MAX = 200;
        textarea.setAttribute("maxlength", MAX);
        textarea.addEventListener("input", () => {
            const len = textarea.value.length;
            charCounter.textContent = `${len} / ${MAX} characters`;
            charCounter.classList.toggle("counter-warning", len >= MAX * 0.9);
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        const valid = [
            validateName(),
            validateEmail(),
            validatePhone(),
            validateMessage()
        ].every(Boolean);
        const status = document.getElementById("form-status");
        if (valid) {
            status.textContent = "✅ Thank you! Your message has been sent.";
            status.style.color = "green";
            form.reset();
            if (charCounter) charCounter.textContent = "0 / 200 characters";
            // Clear success states
            [nameInput, emailInput, phoneInput, messageInput].forEach(i =>
                i.classList.remove("input-valid")
            );
        } else {
            status.textContent =
                "❌ Please fix the errors above before submitting.";
            status.style.color = "red";
        }
        setTimeout(() => {
            status.textContent = "";
        }, 5000);
    });
}
/* Quote Form Validation */
function initQuoteFormValidation() {
    const nameInput = document.getElementById("quote-name");
    const emailInput = document.getElementById("quote-email");
    const serviceInput = document.getElementById("quote-service");
    const submitBtn = document.getElementById("quote-submit");
    const status = document.getElementById("quote-status");

    if (!nameInput || !emailInput || !serviceInput || !submitBtn) return;

    submitBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const service = serviceInput.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.length < 3) {
            status.textContent =
                "Please enter at least 3 characters for your name.";
            status.style.color = "red";
            return;
        }

        if (!emailRegex.test(email)) {
            status.textContent = "Please enter a valid email address.";
            status.style.color = "red";
            return;
        }

        if (service === "") {
            status.textContent = "Please select a service.";
            status.style.color = "red";
            return;
        }

        status.textContent = "✅ Quote request submitted successfully!";
        status.style.color = "green";

        nameInput.value = "";
        emailInput.value = "";
        serviceInput.selectedIndex = 0;

        setTimeout(() => {
            document.getElementById("quote-modal").classList.remove("open");
            document.body.style.overflow = "";
            status.textContent = "";
        }, 1000);
    });
}

/* ============================================================
   7. SMOOTH SCROLLING for anchor links
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

/* ============================================================
   8. ANIMATED COUNTERS (triggered on scroll into view)
   ============================================================ */
function initCounters() {
    const counters = document.querySelectorAll(".counter-number");
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = true;
                    animateCounter(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

/* ============================================================
   INIT — Run everything on DOMContentLoaded
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initHamburger();
    initBackToTop();
    initSlider();
    initModal();
    initFormValidation();
    initQuoteFormValidation();
    initSmoothScroll();
    initCounters();
});
