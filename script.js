// ===== 1. Typing effect on the role badge =====
const roleEl = document.getElementById("role");
const roles = ["Full Stack Developer", "Software Developer", "B.Tech CSE Student", "Open to Internships"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
    const current = roles[roleIndex];

    if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeRole, 1500); // pause when the word is complete
            return;
        }
    } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    setTimeout(typeRole, deleting ? 40 : 80);
}
if (roleEl) typeRole();

// ===== 2. Smooth scroll for nav links =====
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", link.getAttribute("href"));
        }
    });
});

// ===== 3. Active nav link while scrolling (scrollspy) =====
const sections = document.querySelectorAll("#about, #skills, #edu, #portfolio, #achievements");

const spy = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((l) => l.classList.remove("active"));
                const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (active) active.classList.add("active");
            }
        });
    },
    { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => spy.observe(s));

// ===== 4. Reveal animation on scroll =====
const revealEls = document.querySelectorAll(".reveal");

const revealer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // animate only once
            }
        });
    },
    { threshold: 0.15 }
);
revealEls.forEach((el) => revealer.observe(el));

// Stagger skill cards & timeline items so they pop in one after another
document.querySelectorAll(".item, .ed1, .ed2, .ed3, .project").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
});

// ===== 4b. Count-up animation for achievement numbers =====
const counters = document.querySelectorAll(".count");

const counterObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = Number(el.dataset.target);
            const duration = 1500;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.floor(progress * target);
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    },
    { threshold: 0.6 }
);
counters.forEach((c) => counterObserver.observe(c));

// ===== 4c. Placeholder for missing project screenshots =====
function showFallback(img) {
    const box = document.createElement("div");
    box.className = "thumb-fallback";
    box.textContent = img.alt;
    img.replaceWith(box);
}

document.querySelectorAll(".project img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
        showFallback(img); // already failed before script ran
    } else {
        img.addEventListener("error", () => showFallback(img), { once: true });
    }
});

const track = document.getElementById("skillsTrack");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

function updateArrows() {
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
}

prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" });
});
nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
});
track.addEventListener("scroll", updateArrows);
window.addEventListener("resize", updateArrows);
updateArrows();

// ===== 5. Back to top button =====
const topBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 400);
});
topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== 6. Click email to copy =====
const emailLink = document.querySelector(".email .value");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

emailLink.addEventListener("click", (e) => {
    // Ctrl/Cmd + click opens the mail app, normal click copies
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const email = emailLink.textContent.trim();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(
            () => showToast("Email copied!"),
            () => showToast("Copy nahi hua :(")
        );
    }
});
