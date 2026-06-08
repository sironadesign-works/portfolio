tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "error-container": "#ffdad6",
                "inverse-surface": "#2f3033",
                "on-primary": "#ffffff",
                "on-background": "#1a1c1e",
                "on-primary-fixed": "#001b3c",
                "on-secondary-fixed-variant": "#314e26",
                "background": "#faf9fd",
                "surface-dim": "#dad9dd",
                "secondary-container": "#c9edb6",
                "on-surface-variant": "#43474e",
                "tertiary": "#321b00",
                "surface": "#faf9fd",
                "on-secondary": "#ffffff",
                "tertiary-fixed-dim": "#f2bc82",
                "on-tertiary-fixed-variant": "#633f0f",
                "secondary-fixed-dim": "#aed09c",
                "on-surface": "#1a1c1e",
                "primary": "#002045",
                "inverse-primary": "#adc7f7",
                "on-error": "#ffffff",
                "outline-variant": "#c4c6cf",
                "on-primary-fixed-variant": "#2d476f",
                "tertiary-container": "#4f2e00",
                "surface-container-lowest": "#ffffff",
                "primary-fixed": "#d6e3ff",
                "tertiary-fixed": "#ffddba",
                "surface-container-highest": "#e3e2e6",
                "surface-tint": "#455f88",
                "outline": "#74777f",
                "primary-fixed-dim": "#adc7f7",
                "surface-bright": "#faf9fd",
                "secondary-fixed": "#c9edb6",
                "on-error-container": "#93000a",
                "primary-container": "#1a365d",
                "inverse-on-surface": "#f1f0f4",
                "on-tertiary-fixed": "#2b1700",
                "surface-variant": "#e3e2e6",
                "secondary": "#48663b",
                "on-primary-container": "#86a0cd",
                "on-secondary-fixed": "#052101",
                "error": "#ba1a1a",
                "surface-container-high": "#e9e7eb",
                "surface-container": "#efedf1",
                "surface-container-low": "#f4f3f7",
                "on-tertiary": "#ffffff",
                "on-tertiary-container": "#c6955e",
                "on-secondary-container": "#4e6c41"
            },
            "borderRadius": {
                "sm": "0.25rem",
                "DEFAULT": "0.5rem",
                "md": "0.75rem",
                "lg": "1.0rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
            "spacing": {
                "container-max": "1200px",
                "grid-gutter": "24px",
                "section-gap-desktop": "120px",
                "grid-margin": "24px",
                "section-gap-mobile": "64px",
                "base": "8px"
            },
            "fontFamily": {
                "label-sm": ["Manrope"],
                "display-lg-mobile": ["Manrope"],
                "body-md": ["Noto Sans JP"],
                "body-lg": ["Noto Sans JP"],
                "headline-md": ["Noto Sans JP"],
                "display-lg": ["Manrope"]
            },
            "fontSize": {
                "label-sm": ["12px", { "lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600" }],
                "display-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "700" }],
                "body-md": ["16px", { "lineHeight": "1.7", "fontWeight": "400" }],
                "body-lg": ["18px", { "lineHeight": "1.8", "fontWeight": "400" }],
                "headline-md": ["24px", { "lineHeight": "1.6", "letterSpacing": "0.05em", "fontWeight": "700" }],
                "display-lg": ["48px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }]
            }
        }
    }
};
