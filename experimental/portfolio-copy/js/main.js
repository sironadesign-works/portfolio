(() => {
    "use strict";

    const root = document.documentElement;
    root.classList.add("js");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    const setMenu = (isOpen) => {
        if (!menuToggle || !mobileMenu) return;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
        mobileMenu.hidden = !isOpen;
        menuToggle.classList.toggle("is-open", isOpen);
    };

    menuToggle?.addEventListener("click", () => {
        setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((item) => {
        const delay = item.dataset.delay;
        if (delay) item.style.setProperty("--delay", `${delay}ms`);
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const progress = document.querySelector("[data-scroll-progress]");
    let progressFrame = 0;
    const updateProgress = () => {
        progressFrame = 0;
        if (!progress) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    };
    window.addEventListener("scroll", () => {
        if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();

    const hero = document.querySelector(".hero");
    if (hero && !reducedMotion.matches) {
        hero.addEventListener("pointermove", (event) => {
            const bounds = hero.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
            const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
            hero.style.setProperty("--pointer-x", x.toFixed(2));
            hero.style.setProperty("--pointer-y", y.toFixed(2));
        }, { passive: true });
        hero.addEventListener("pointerleave", () => {
            hero.style.setProperty("--pointer-x", "0");
            hero.style.setProperty("--pointer-y", "0");
        }, { passive: true });
    }

    const dialog = document.getElementById("work-dialog");
    const dialogImage = document.getElementById("dialog-image");
    const dialogCategory = document.getElementById("dialog-category");
    const dialogTitle = document.getElementById("dialog-title");
    const dialogYear = document.getElementById("dialog-year");
    const dialogRole = document.getElementById("dialog-role");
    const dialogStack = document.getElementById("dialog-stack");
    const dialogSummary = document.getElementById("dialog-summary");
    const dialogLink = document.getElementById("dialog-link");
    const closeButton = dialog?.querySelector("[data-dialog-close]");
    let activeTrigger = null;

    const openWork = (card) => {
        if (!dialog) return;
        activeTrigger = card;
        dialogImage.src = card.dataset.workImage || "";
        dialogImage.alt = card.dataset.workAlt || "";
        dialogCategory.textContent = card.dataset.workCategory || "Selected work";
        dialogTitle.textContent = card.dataset.workTitle || "Untitled work";
        dialogYear.textContent = card.dataset.workYear || "—";
        dialogRole.textContent = card.dataset.workRole || "—";
        dialogStack.textContent = card.dataset.workStack || "—";
        dialogSummary.textContent = card.dataset.workSummary || "";

        if (card.dataset.workLink) {
            dialogLink.href = card.dataset.workLink;
            dialogLink.hidden = false;
        } else {
            dialogLink.hidden = true;
        }

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }
        closeButton?.focus();
    };

    const closeWork = () => {
        if (!dialog) return;
        if (typeof dialog.close === "function" && dialog.open) dialog.close();
        else dialog.removeAttribute("open");
        activeTrigger?.focus();
    };

    document.querySelectorAll(".work-card").forEach((card) => {
        card.addEventListener("click", () => openWork(card));
    });
    closeButton?.addEventListener("click", closeWork);
    dialog?.addEventListener("click", (event) => {
        if (event.target === dialog) closeWork();
    });
    dialog?.addEventListener("close", () => activeTrigger?.focus());

    document.querySelector("[data-dialog-contact]")?.addEventListener("click", () => {
        closeWork();
    });

    const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    dialog?.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        const focusable = [...dialog.querySelectorAll(focusableSelector)];
        if (focusable.length < 2) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    const form = document.querySelector("[data-offline-form]");
    const formStatus = document.getElementById("contact-form-status");
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (formStatus) formStatus.textContent = "入力内容を確認しました。オフライン実験版のため、外部送信は行っていません。";
    });
})();
