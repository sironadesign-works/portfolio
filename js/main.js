// 表示アニメーションを有効化するための識別クラス。
// 手動変更: アニメーション自体の見た目や速度は css/style.css の .motion-ready 系を変更する。
document.documentElement.classList.add("motion-ready");

// モバイルメニューの開閉対象を取得する。
// 手動変更: HTML 側の data-mobile-menu-toggle と aria-controls / id を変更した場合は、対応関係を揃える。
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenu = mobileMenuToggle ? document.getElementById(mobileMenuToggle.getAttribute("aria-controls")) : null;

// モバイルメニューを閉じ、ボタン表示と読み上げ用属性を「開く」状態へ戻す。
const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuToggle) {
        return;
    }

    mobileMenu.classList.add("hidden");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "メニューを開く");
    mobileMenuToggle.querySelector(".material-symbols-outlined").textContent = "menu";
};

// モバイルメニューを開き、ボタン表示と読み上げ用属性を「閉じる」状態へ切り替える。
const openMobileMenu = () => {
    if (!mobileMenu || !mobileMenuToggle) {
        return;
    }

    mobileMenu.classList.remove("hidden");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileMenuToggle.setAttribute("aria-label", "メニューを閉じる");
    mobileMenuToggle.querySelector(".material-symbols-outlined").textContent = "close";
};

// メニューボタンのクリックで開閉し、リンク選択後は自動で閉じる。
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

// 要素が画面内へ入った時だけ表示アニメーションを開始する監視処理。
// 手動変更: 開始位置は rootMargin、見え始める割合は threshold を変更する。
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

// 対象要素へ表示アニメーションを設定する共通関数。
// 手動変更: 要素ごとの遅延間隔は index * 90、最大遅延は 360、拡大演出は options.scale で調整する。
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

// ヒーロー内のラベル・見出し・説明・ボタンを上から順に表示する。
// 手動変更: ヒーロー内で演出対象を増減する場合は、このセレクターを変更する。
document.querySelectorAll("#hero .inline-flex, #hero h1, #hero p, #hero .flex.flex-wrap").forEach((element, index) => {
    addReveal(element, index);
});

// ヒーロー以外の各セクションで、見出しとカードへ表示アニメーションを設定する。
// 手動変更: 新しいカード形式を追加した場合は article または .soft-shadow の判定を見直す。
document.querySelectorAll("main section:not(#hero)").forEach((section) => {
    section.querySelectorAll(":scope > div > .text-center, :scope h2:not(.text-center h2), :scope h3:not(.text-center h3)").forEach((element, index) => {
        if (element.closest("article, .soft-shadow")) {
            return;
        }
        addReveal(element, index);
    });

    section.querySelectorAll(":scope article, :scope .soft-shadow").forEach((element, index) => {
        if (element.closest("form")) {
            return;
        }

        addReveal(element, index, { scale: true });
    });
});

// プロフィール画像とお問い合わせフォームへ拡大付き表示アニメーションを設定する。
document.querySelectorAll("#profile img, #contact form").forEach((element, index) => {
    addReveal(element, index, { scale: true });
});

// 制作フローの横線を左から伸ばす。モバイルでは対象の線が非表示になる。
// 手動変更: #flow 内の横線クラスを変更した場合は、ここで取得するセレクターも揃える。
const flowLine = document.querySelector("#flow .hidden.md\\:block.absolute");
if (flowLine) {
    flowLine.classList.add("flow-line");
    if (revealObserver) {
        revealObserver.observe(flowLine);
    } else {
        flowLine.classList.add("is-visible");
    }
}

// 現在開いている実績モーダルと、閉じた後にフォーカスを戻す要素を保持する。
let activeModal = null;
let lastFocusedElement = null;

// モーダル内でキーボード操作できるリンク・ボタンを取得する。
const getFocusableElements = (modal) => {
    return Array.from(modal.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"));
};

// 指定 ID の実績モーダルを開き、背景スクロールを止めて最初の操作要素へフォーカスする。
// 手動変更: HTML 側でモーダル ID を変更した場合は、カードの onclick と aria-labelledby も揃える。
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

// 指定 ID の実績モーダルを閉じ、必要に応じて元のカードへフォーカスを戻す。
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

// 実績カードを Enter キーまたは Space キーでも開けるようにする。
const handleWorkCardKeydown = (event, modalId) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    event.preventDefault();
    openModal(modalId);
};

// Escape キーでメニュー・モーダルを閉じ、Tab キーのフォーカスをモーダル内に留める。
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

// HTML の onclick / onkeydown 属性からモーダル関数を呼べるよう、window に公開する。
window.openModal = openModal;
window.closeModal = closeModal;
window.handleWorkCardKeydown = handleWorkCardKeydown;

// お問い合わせフォームと送信状態表示を取得する。
// 手動変更: HTML 側の各 id を変更した場合は、ここも同じ名前へ変更する。
const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");
const contactFormSubmit = document.getElementById("contact-form-submit");

// Formspree へ非同期送信し、送信中・成功・失敗の状態を画面へ表示する。
// 手動変更: 送信先 URL は index.html の #contact-form にある action、表示文言は下記 textContent を変更する。
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
            contactFormStatus.classList.add("text-on-surface-variant");
        } catch (error) {
            contactFormStatus.textContent = "送信できませんでした。時間をおいて再度お試しください。";
            contactFormStatus.classList.remove("text-on-surface-variant");
            contactFormStatus.classList.add("text-error");
        } finally {
            if (contactFormSubmit) {
                contactFormSubmit.disabled = false;
                contactFormSubmit.classList.remove("opacity-70", "cursor-not-allowed");
            }
        }
    });
}
