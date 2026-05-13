---
name: Japanese Creative Partner System
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#48663b'
  on-secondary: '#ffffff'
  secondary-container: '#c9edb6'
  on-secondary-container: '#4e6c41'
  tertiary: '#321b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f2e00'
  on-tertiary-container: '#c6955e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#c9edb6'
  secondary-fixed-dim: '#aed09c'
  on-secondary-fixed: '#052101'
  on-secondary-fixed-variant: '#314e26'
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#f2bc82'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#633f0f'
  background: '#faf9fd'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Sans JP
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.6'
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.8'
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  grid-margin: 24px
  grid-gutter: 24px
  container-max: 1200px
---

## Brand & Style

This design system is built for a "Multi-Creator & Web Production Partner," emphasizing a balance between corporate reliability and creative approachability. The design style follows a **Modern Corporate** aesthetic with a strong emphasis on **Minimalism** to allow the portfolio work to remain the primary focus.

The emotional response should be one of "Meticulous Craftsmanship" (Kodawari). The UI avoids unnecessary ornamentation, relying instead on precise alignment, generous whitespace, and high-quality typography to signal professionalism. It targets B2B clients who value clear communication and technical excellence, but softened with a "Personal Touch" through organic rounded corners and subtle motion.

## Colors

The palette is rooted in a clean, high-contrast base to ensure readability and a "fresh" professional feel. 

- **Primary (Deep Blue):** Used for core branding, primary buttons, and navigational anchors to evoke trust and stability.
- **Secondary (Forest Green):** Used sparingly for accent details, success states, or "Personal/Creative" sections to add warmth and growth-oriented vibes.
- **Surface Strategy:** The system utilizes a "Soft Gray" background (`#f8f9fa`) to distinguish card elements from the main white page background, creating a gentle depth without harsh lines.
- **Typography Colors:** We avoid pure black, using a very deep charcoal (`#1a202c`) for body text to reduce eye strain while maintaining high accessibility.

## Typography

This design system uses a dual-language typographic approach. 

- **English Headings:** We use **Manrope** for its modern, geometric yet slightly warm character. It provides an "International B2B" feel for titles and numbers.
- **Japanese Content:** **Noto Sans JP** is the workhorse for all Japanese text, set with a slightly increased line-height (1.7 to 1.8) to accommodate the density of Kanji and improve the "approachable" feel.
- **Hierarchy:** Display styles use Manrope for impact. Standard section headers use Noto Sans JP with increased letter-spacing to create an elegant, curated look common in high-end Japanese web production portfolios.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a premium "magazine-like" structure, while transitioning to a fluid model for mobile devices.

- **Desktop:** 12-column grid with a 1200px max-width. Sections are separated by large vertical gaps (120px) to give the content "room to breathe," reinforcing the high-end B2B vibe.
- **Mobile:** 4-column grid with 20px margins. 
- **Rhythm:** All spacing (padding, margins) should be multiples of the 8px base unit. Card internal padding should be generous (typically 32px or 40px) to maintain the "Large Whitespace" requirement.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

- **Shadows:** Use a "Soft Focus" shadow for cards and floating elements. The shadow is highly diffused (20px-30px blur), low opacity (6-8%), and slightly tinted with the Primary Deep Blue to keep it from looking "dirty."
- **Layering:** Backgrounds use the Soft Gray surface, while interactive cards use a Pure White surface. This creates a natural hierarchy where the content "pops" forward.
- **Transitions:** Elevate cards slightly on hover (moving the Y-axis -4px and increasing shadow spread) to provide a tactile, responsive feel for the "Personal Touch."

## Shapes

The shape language centers on **softness within a professional structure**. 

- **Corner Radius:** A standard radius of 8px to 12px is applied to all cards, buttons, and input fields. This avoids the "aggressive" sharpness of traditional B2B sites while remaining more disciplined than a fully "bubbly" consumer app.
- **Visual Consistency:** Ensure that even nested elements (like image thumbnails inside a card) follow the same roundedness hierarchy to maintain a meticulously crafted appearance.

## Components

- **Buttons:** Primary buttons use the Deep Blue background with White text, featuring a subtle 2px transition on hover. Use Manrope for button labels for a cleaner, more functional look.
- **Project Cards:** The core of the portfolio. Features a white background, the standard 12px radius, and a subtle shadow. Typography inside cards should be strictly aligned to a 4px grid.
- **Chips/Tags:** Used for service categories (e.g., "Web Design," "Motion"). Use a light tint of the Secondary Forest Green with dark green text, or a simple subtle gray border with no background.
- **Input Fields:** Minimalist design with a light gray border that transitions to Deep Blue on focus. Labels should use the `label-sm` style for a technical, precise feel.
- **Service Lists:** Use custom iconography or simplified bullet points that utilize the Secondary Forest Green to guide the eye without being distracting.
- **Process Timeline:** A vertical or horizontal line (1px weight, Light Gray) connecting steps, with small primary-colored dots to mark milestones.