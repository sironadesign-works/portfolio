document.documentElement.classList.add("motion-ready");

const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenu = mobileMenuToggle ? document.getElementById(mobileMenuToggle.getAttribute("aria-controls")) : null;

const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuToggle) {
        return;
    }

    mobileMenu.classList.add("hidden");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "メニューを開く");
    mobileMenuToggle.querySelector(".material-symbols-outlined").textContent = "menu";
};

const openMobileMenu = () => {
    if (!mobileMenu || !mobileMenuToggle) {
        return;
    }

    mobileMenu.classList.remove("hidden");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileMenuToggle.setAttribute("aria-label", "メニューを閉じる");
    mobileMenuToggle.querySelector(".material-symbols-outlined").textContent = "close";
};

if (mobileMenu && mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
        if (mobileMenu.classList.contains("hidden")) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });
}

const supportsRevealObserver = "IntersectionObserver" in window;
const revealObserver = supportsRevealObserver ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
    });
}, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
}) : null;

const addReveal = (element, index = 0, options = {}) => {
    if (!element) {
        return;
    }

    element.classList.add("reveal");
    if (options.scale) {
        element.classList.add("reveal-scale");
    }
    element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
    if (revealObserver) {
        revealObserver.observe(element);
    } else {
        element.classList.add("is-visible");
    }
};

document.querySelectorAll("#hero .inline-flex, #hero h1, #hero p, #hero .flex.flex-wrap").forEach((element, index) => {
    addReveal(element, index);
});

document.querySelectorAll("main section:not(#hero)").forEach((section) => {
    section.querySelectorAll(":scope > div > .text-center, :scope h2, :scope h3").forEach((element, index) => {
        addReveal(element, index);
    });

    section.querySelectorAll(":scope article, :scope .soft-shadow").forEach((element, index) => {
        if (element.closest("form")) {
            return;
        }

        addReveal(element, index, { scale: true });
    });
});

document.querySelectorAll("#profile img, #contact form").forEach((element, index) => {
    addReveal(element, index, { scale: true });
});

const flowLine = document.querySelector("#flow .hidden.md\\:block.absolute");
if (flowLine) {
    flowLine.classList.add("flow-line");
    if (revealObserver) {
        revealObserver.observe(flowLine);
    } else {
        flowLine.classList.add("is-visible");
    }
}

let activeModal = null;
let lastFocusedElement = null;

const getFocusableElements = (modal) => {
    return Array.from(modal.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"));
};

const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }

    if (activeModal && activeModal !== modal) {
        closeModal(activeModal.id, { restoreFocus: false });
    }

    lastFocusedElement = document.activeElement;
    activeModal = modal;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    modal.setAttribute("aria-hidden", "false");

    const firstFocusable = getFocusableElements(modal)[0];
    requestAnimationFrame(() => {
        firstFocusable?.focus();
    });
};

const closeModal = (modalId, options = {}) => {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");

    if (activeModal === modal) {
        activeModal = null;
    }

    if (!document.querySelector("[id^='modal-work-'][role='dialog']:not(.hidden)")) {
        document.body.classList.remove("overflow-hidden");
    }

    if (options.restoreFocus !== false && lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
};

const handleWorkCardKeydown = (event, modalId) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    event.preventDefault();
    openModal(modalId);
};

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }

    if (!activeModal) {
        return;
    }

    if (event.key === "Escape") {
        closeModal(activeModal.id);
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getFocusableElements(activeModal);
    if (!focusableElements.length) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});

window.openModal = openModal;
window.closeModal = closeModal;
window.handleWorkCardKeydown = handleWorkCardKeydown;

const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");
const contactFormSubmit = document.getElementById("contact-form-submit");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const endpoint = contactForm.getAttribute("action");
        const formData = new FormData(contactForm);

        contactFormStatus.textContent = "送信しています...";
        contactFormStatus.classList.remove("hidden", "text-error");
        contactFormStatus.classList.add("text-on-surface-variant");
        if (contactFormSubmit) {
            contactFormSubmit.disabled = true;
            contactFormSubmit.classList.add("opacity-70", "cursor-not-allowed");
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            contactForm.reset();
            contactFormStatus.textContent = "送信ありがとうございました。内容を確認のうえ、折り返しご連絡します。";
            contactFormStatus.classList.remove("text-error");
        } catch (error) {
            contactFormStatus.textContent = "送信できませんでした。時間をおいて再度お試しください。";
            contactFormStatus.classList.add("text-error");
        } finally {
            if (contactFormSubmit) {
                contactFormSubmit.disabled = false;
                contactFormSubmit.classList.remove("opacity-70", "cursor-not-allowed");
            }
        }
    });
}
