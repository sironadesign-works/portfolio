/**
 * Emology Creative System - Main JS
 * - Interactive Canvas Metaballs (Organic Floating Spheres)
 * - Custom Cursor with Hover Elevation
 * - Works Modal Dialogs (9 Items)
 * - GSAP ScrollTrigger Animations
 * - Formspree Contact Form
 */

// ============================================================
// 1. Custom Cursor
// ============================================================
const cursor = document.getElementById("custom-cursor");
if (cursor) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const updateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);

  // Hover effect on interactive elements
  const interactiveElements = "a, button, input, textarea, .work-tile, .emology-card, .clean-accordion-header";
  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });
}

// ============================================================
// 2. Interactive Multi-Mode Background Animation System
// ============================================================
const canvas = document.getElementById("metaballs-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let mouse = { x: null, y: null, radius: 180, prevX: null, prevY: null, isMoving: false };
  let currentMode = "nodes_pulse"; // default mode: AI Synapse Pulse

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    initMode(currentMode);
  };
  window.addEventListener("resize", resize);

  let mouseMoveTimeout;
  window.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isMoving = true;

    // Mode specific triggers (e.g. Zen Ripple)
    if (currentMode === "ripple" && Math.random() < 0.25) {
      createRipple(mouse.x, mouse.y, 0.8);
    }

    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => { mouse.isMoving = false; }, 100);
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Palette
  const palette = [
    "rgba(6, 182, 212, 0.55)",   // Cyan
    "rgba(37, 99, 235, 0.45)",   // Royal Blue
    "rgba(16, 185, 129, 0.50)",  // Emerald Green
    "rgba(245, 158, 11, 0.50)",  // Vivid Amber
    "rgba(139, 92, 246, 0.45)",  // Violet
    "rgba(244, 63, 94, 0.40)"    // Rose Pink
  ];

  // ------------------------------------------------------------
  // MODE 1: Metaballs (Emology Burst Intro & Gooey Fusion)
  // ------------------------------------------------------------
  const canvasWrapper = document.getElementById("canvas-wrapper") || canvas.parentElement;
  let balls = [];

  class Ball {
    constructor(isBurst = true) {
      const tier = Math.random();
      if (tier < 0.45) this.targetRadius = Math.random() * 20 + 20;
      else if (tier < 0.80) this.targetRadius = Math.random() * 40 + 45;
      else this.targetRadius = Math.random() * 60 + 85; // 大玉を約2/3に上品スリム化 (85~145px)

      this.radius = isBurst ? 0 : this.targetRadius;
      this.growthSpeed = Math.random() * 0.08 + 0.04;

      if (isBurst) {
        // Start from center cluster
        const centerX = width / 2 + (Math.random() - 0.5) * 80;
        const centerY = height / 2 + (Math.random() - 0.5) * 80;
        this.x = centerX;
        this.y = centerY;

        // Big initial burst speed radiating outward
        const angle = Math.random() * Math.PI * 2;
        const burstSpeed = Math.random() * 16 + 10;
        this.vx = Math.cos(angle) * burstSpeed;
        this.vy = Math.sin(angle) * burstSpeed;
      } else {
        this.x = Math.random() * (width - this.targetRadius * 2) + this.targetRadius;
        this.y = Math.random() * (height - this.targetRadius * 2) + this.targetRadius;
        const speed = (Math.random() * 0.8 + 0.5) * (this.targetRadius > 80 ? 0.7 : 1.1);
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
      }

      this.cruiseSpeed = (Math.random() * 0.8 + 0.5) * (this.targetRadius > 80 ? 0.7 : 1.1);
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.scale = isBurst ? 0 : 1;
    }

    update() {
      // Scale pop-in on intro
      if (this.scale < 1) {
        this.scale += this.growthSpeed;
        if (this.scale > 1) this.scale = 1;
        this.radius = this.targetRadius * this.scale;
      }

      // Physics integration
      this.x += this.vx;
      this.y += this.vy;

      // Friction to smoothly settle down to cruising speed
      const currentSpeed = Math.hypot(this.vx, this.vy);
      if (currentSpeed > this.cruiseSpeed) {
        this.vx *= 0.94;
        this.vy *= 0.94;
      }

      // Edge bouncing with margin
      const r = this.radius || 10;
      if (this.x - r < 0) { this.x = r; this.vx = Math.abs(this.vx); }
      else if (this.x + r > width) { this.x = width - r; this.vx = -Math.abs(this.vx); }
      if (this.y - r < 0) { this.y = r; this.vy = Math.abs(this.vy); }
      else if (this.y + r > height) { this.y = height - r; this.vy = -Math.abs(this.vy); }

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius + r && dist > 0) {
          const angle = Math.atan2(dy, dx);
          const force = ((mouse.radius + r - dist) / (mouse.radius + r)) * 4.5;
          this.x -= Math.cos(angle) * force;
          this.y -= Math.sin(angle) * force;
        }
      }
    }

    draw() {
      if (this.radius <= 0) return;
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ------------------------------------------------------------
  // MODE 1B: Emology Authentic Engine (THRESHOLD = 210 & Explosion)
  // ------------------------------------------------------------
  const emoColor = {
    logical: {
      opacity: "rgba(10, 134, 200, 1)",
      transparent: "rgba(10, 134, 200, 0)",
      bgColor: "rgba(10, 134, 200, 0.35)",
    },
    emotional: {
      opacity: "rgba(238, 116, 71, 1)",
      transparent: "rgba(238, 116, 71, 0)",
      bgColor: "rgba(238, 116, 71, 0.35)",
    },
  };

  let emoMetaballs = [];
  let emoBgBalls = [];
  let emoOpeningBalls = [];
  let emoExplosionBalls = [];
  let emoState = "opening"; // "opening" -> "burst" -> "floating"
  let emoTimer = 0;

  const initEmoReal = () => {
    emoState = "opening";
    emoTimer = 0;
    const hRate = Math.max(0.6, height / 800);
    const speedRate = window.innerWidth < 768 ? 3.5 : 5.5;

    // 1. Initial 2 colliding balls
    emoOpeningBalls = [
      {
        x: width / 2 + 100,
        y: height / 2 + 70,
        vx: -3.2,
        vy: -2.2,
        size: 70 * hRate,
        color: emoColor.logical,
      },
      {
        x: width / 2 - 100,
        y: height / 2 - 70,
        vx: 3.2,
        vy: 2.2,
        size: 70 * hRate,
        color: emoColor.emotional,
      },
    ];

    // 2. Explosion balls (burst outwards)
    emoExplosionBalls = [];
    const burstCount = 14;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 / burstCount) * i + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 8 + 6;
      emoExplosionBalls.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 25 + 15,
        color: i % 2 === 0 ? emoColor.logical : emoColor.emotional,
        opacity: 1
      });
    }

    // 3. Steady state foreground metaballs
    emoMetaballs = [
      { x: width * 0.5, y: height * 0.3, vx: 0.5 * speedRate, vy: 0.7 * speedRate, size: 60 * hRate, color: emoColor.logical },
      { x: width * 0.5, y: height * 0.15, vx: -0.3 * speedRate, vy: -0.6 * speedRate, size: 160 * hRate, color: emoColor.emotional },
      { x: width * 0.7, y: height * 0.8, vx: 0.8 * speedRate, vy: 0.5 * speedRate, size: 70 * hRate, color: emoColor.emotional },
      { x: width * 0.2, y: height * 0.75, vx: 0.5 * speedRate, vy: 0.7 * speedRate, size: 80 * hRate, color: emoColor.emotional },
      { x: width * 0.15, y: height * 0.2, vx: 0.6 * speedRate, vy: 0.7 * speedRate, size: 140 * hRate, color: emoColor.logical },
      { x: width * 0.2, y: height * 0.5, vx: -0.5 * speedRate, vy: -0.2 * speedRate, size: 60 * hRate, color: emoColor.logical },
      { x: width * 0.5, y: height * 0.55, vx: -0.9 * speedRate, vy: -0.7 * speedRate, size: 90 * hRate, color: emoColor.emotional },
      { x: width * 0.25, y: height * 0.85, vx: -0.6 * speedRate, vy: 0.9 * speedRate, size: 110 * hRate, color: emoColor.logical },
      { x: width * 0.85, y: height * 0.55, vx: 0.6 * speedRate, vy: 0.4 * speedRate, size: 200 * hRate, color: emoColor.emotional },
    ];

    // 4. Background balls (subtle pulsing dots)
    emoBgBalls = [
      { x: width * 0.38, y: height * 0.3, vx: 0.4 * speedRate, vy: 0.3 * speedRate, size: 26 * hRate, toBig: false, color: emoColor.logical },
      { x: width * 0.22, y: height * 0.4, vx: -0.3 * speedRate, vy: 0.2 * speedRate, size: 30 * hRate, toBig: false, color: emoColor.emotional },
      { x: width * 0.6, y: height * 0.15, vx: 0.2 * speedRate, vy: -0.3 * speedRate, size: 14 * hRate, toBig: false, color: emoColor.logical },
      { x: width * 0.5, y: height * 0.12, vx: -0.3 * speedRate, vy: 0.4 * speedRate, size: 38 * hRate, toBig: false, color: emoColor.emotional },
      { x: width * 0.75, y: height * 0.8, vx: -0.1 * speedRate, vy: 0.3 * speedRate, size: 38 * hRate, toBig: false, color: emoColor.emotional },
      { x: width * 0.6, y: height * 0.7, vx: 0.1 * speedRate, vy: -0.3 * speedRate, size: 14 * hRate, toBig: false, color: emoColor.logical },
      { x: width * 0.33, y: height * 0.65, vx: -0.3 * speedRate, vy: 0.05 * speedRate, size: 16 * hRate, toBig: false, color: emoColor.logical },
    ];
  };

  const drawEmoReal = () => {
    emoTimer++;

    // Stage 1: Opening 2 colliding balls (frames 0 to 45)
    if (emoState === "opening") {
      emoOpeningBalls.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        ctx.beginPath();
        const g = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, b.size);
        g.addColorStop(0.3, b.color.opacity);
        g.addColorStop(1, b.color.transparent);
        ctx.fillStyle = g;
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Check collision / time
      if (emoTimer > 35) {
        emoState = "burst";
        emoTimer = 0;
      }
    }
    // Stage 2: Explosion burst (frames 36 to 90)
    else if (emoState === "burst") {
      let activeExplosion = false;
      emoExplosionBalls.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.95;
        b.vy *= 0.95;
        b.size *= 0.98;

        if (b.size > 2) {
          activeExplosion = true;
          ctx.beginPath();
          const g = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, b.size);
          g.addColorStop(0.3, b.color.opacity);
          g.addColorStop(1, b.color.transparent);
          ctx.fillStyle = g;
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (emoTimer > 45 || !activeExplosion) {
        emoState = "floating";
      }
    }
    // Stage 3: Steady floating metaballs with threshold fusion
    else {
      // 1. Draw background balls
      emoBgBalls.forEach((b) => {
        b.x += b.vx * 0.15;
        b.y += b.vy * 0.15;

        // Bounce
        if (b.x < 20) b.vx = Math.abs(b.vx);
        else if (b.x > width - 20) b.vx = -Math.abs(b.vx);
        if (b.y < 20) b.vy = Math.abs(b.vy);
        else if (b.y > height - 20) b.vy = -Math.abs(b.vy);

        // Pulsing scale
        if (b.toBig) {
          b.size *= 1.002;
          if (b.size > 40) b.toBig = false;
        } else {
          b.size *= 0.998;
          if (b.size < 10) b.toBig = true;
        }

        ctx.beginPath();
        const g = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, b.size);
        g.addColorStop(0.7, b.color.bgColor);
        g.addColorStop(1, b.color.transparent);
        ctx.fillStyle = g;
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw foreground metaballs (smooth floating & mouse interaction)
      emoMetaballs.forEach((b) => {
        b.x += b.vx * 0.2;
        b.y += b.vy * 0.2;

        const offset = b.size * 0.4;
        if (b.x < offset) b.vx = Math.abs(b.vx);
        else if (b.x > width - offset) b.vx = -Math.abs(b.vx);
        if (b.y < offset) b.vy = Math.abs(b.vy);
        else if (b.y > height - offset) b.vy = -Math.abs(b.vy);

        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - b.x;
          const dy = mouse.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius + b.size && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const force = ((mouse.radius + b.size - dist) / (mouse.radius + b.size)) * 3;
            b.x -= Math.cos(angle) * force;
            b.y -= Math.sin(angle) * force;
          }
        }

        ctx.beginPath();
        const g = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, b.size);
        g.addColorStop(0.3, b.color.opacity);
        g.addColorStop(1, b.color.transparent);
        ctx.fillStyle = g;
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Emology Authentic Threshold Pixel Pass (Metaball Gooey Fusion)
      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixel = imageData.data;
        const THRESHOLD = 210;
        for (let i = 3; i < pixel.length; i += 4) {
          if (pixel[i] < THRESHOLD) {
            pixel[i] = 0;
          } else {
            pixel[i] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      } catch (e) {
        // Fallback for cross-origin or canvas restrictions
      }
    }
  };

  // ------------------------------------------------------------
  // MODE 2: Aurora Mesh Wave
  // ------------------------------------------------------------
  let auroraTime = 0;
  const drawAurora = () => {
    auroraTime += 0.008;
    const grad1 = ctx.createRadialGradient(
      width * 0.3 + Math.sin(auroraTime * 1.2) * 150 + (mouse.x ? (mouse.x - width/2)*0.2 : 0),
      height * 0.4 + Math.cos(auroraTime * 0.9) * 100,
      50,
      width * 0.3,
      height * 0.4,
      width * 0.5
    );
    grad1.addColorStop(0, "rgba(6, 182, 212, 0.45)");
    grad1.addColorStop(1, "rgba(255, 255, 255, 0)");

    const grad2 = ctx.createRadialGradient(
      width * 0.7 + Math.cos(auroraTime * 1.1) * 180 + (mouse.x ? (mouse.x - width/2)*0.2 : 0),
      height * 0.6 + Math.sin(auroraTime * 1.3) * 120,
      80,
      width * 0.7,
      height * 0.6,
      width * 0.55
    );
    grad2.addColorStop(0, "rgba(37, 99, 235, 0.35)");
    grad2.addColorStop(1, "rgba(255, 255, 255, 0)");

    const grad3 = ctx.createRadialGradient(
      width * 0.5 + Math.sin(auroraTime * 0.8) * 120,
      height * 0.7 + Math.cos(auroraTime * 1.4) * 100,
      40,
      width * 0.5,
      height * 0.7,
      width * 0.4
    );
    grad3.addColorStop(0, "rgba(16, 185, 129, 0.35)");
    grad3.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, width, height);
  };

  // ------------------------------------------------------------
  // MODE 3: Geometric Constellation (AI Nodes)
  // ------------------------------------------------------------
  let nodes = [];
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 3 + 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          this.x += (dx / dist) * 1.5;
          this.y += (dy / dist) * 1.5;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "rgba(37, 99, 235, 0.7)";
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const drawNodes = () => {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.6 * (1 - dist / 160)})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  };

  // ------------------------------------------------------------
  // MODE 3B: 🌈 Rainbow Neural Nodes (Colorful nodes & gradient links)
  // ------------------------------------------------------------
  const rainbowColors = [
    { fill: "#06b6d4", rgb: "6, 182, 212" },   // Cyan
    { fill: "#2563eb", rgb: "37, 99, 235" },  // Royal Blue
    { fill: "#10b981", rgb: "16, 185, 129" }, // Emerald
    { fill: "#8b5cf6", rgb: "139, 92, 246" }, // Purple
    { fill: "#f59e0b", rgb: "245, 158, 11" }, // Amber
    { fill: "#f43f5e", rgb: "244, 63, 94" }   // Rose
  ];

  let rainbowNodes = [];
  class RainbowNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.4;
      this.vy = (Math.random() - 0.5) * 1.4;
      this.radius = Math.random() * 4 + 3;
      this.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      this.pulseOffset = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          this.x += (dx / dist) * 2;
          this.y += (dy / dist) * 2;
        }
      }
    }
    draw(time) {
      const pulse = Math.sin(time * 3 + this.pulseOffset) * 0.5 + 1;
      // Outer soft glow
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color.rgb}, 0.2)`;
      ctx.arc(this.x, this.y, this.radius * 2.2 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Solid core
      ctx.beginPath();
      ctx.fillStyle = this.color.fill;
      ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let rainbowTime = 0;
  const drawRainbowNodes = () => {
    rainbowTime += 0.02;
    for (let i = 0; i < rainbowNodes.length; i++) {
      rainbowNodes[i].update();
      rainbowNodes[i].draw(rainbowTime);
      for (let j = i + 1; j < rainbowNodes.length; j++) {
        const dx = rainbowNodes[i].x - rainbowNodes[j].x;
        const dy = rainbowNodes[i].y - rainbowNodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const alpha = 0.5 * (1 - dist / 140);
          const grad = ctx.createLinearGradient(
            rainbowNodes[i].x, rainbowNodes[i].y,
            rainbowNodes[j].x, rainbowNodes[j].y
          );
          grad.addColorStop(0, `rgba(${rainbowNodes[i].color.rgb}, ${alpha})`);
          grad.addColorStop(1, `rgba(${rainbowNodes[j].color.rgb}, ${alpha})`);

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.moveTo(rainbowNodes[i].x, rainbowNodes[i].y);
          ctx.lineTo(rainbowNodes[j].x, rainbowNodes[j].y);
          ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const dx = rainbowNodes[i].x - mouse.x;
        const dy = rainbowNodes[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rainbowNodes[i].color.rgb}, ${0.7 * (1 - dist / 180)})`;
          ctx.lineWidth = 2;
          ctx.moveTo(rainbowNodes[i].x, rainbowNodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  };

  // ------------------------------------------------------------
  // MODE 3C: ⚡ AI Synapse Pulse (Traveling signal packets on links)
  // ------------------------------------------------------------
  let pulseNodes = [];
  let signalPulses = [];

  class PulseNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.1;
      this.vy = (Math.random() - 0.5) * 1.1;
      this.radius = Math.random() * 3.5 + 3;
      this.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          this.x += (dx / dist) * 1.8;
          this.y += (dy / dist) * 1.8;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color.fill;
      ctx.shadowColor = this.color.fill;
      ctx.shadowBlur = 8;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const drawSynapsePulse = () => {
    // 1. Draw and connect nodes
    for (let i = 0; i < pulseNodes.length; i++) {
      pulseNodes[i].update();
      pulseNodes[i].draw();

      for (let j = i + 1; j < pulseNodes.length; j++) {
        const dx = pulseNodes[i].x - pulseNodes[j].x;
        const dy = pulseNodes[i].y - pulseNodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.35 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(pulseNodes[i].x, pulseNodes[i].y);
          ctx.lineTo(pulseNodes[j].x, pulseNodes[j].y);
          ctx.stroke();

          // Randomly spawn pulses on links
          if (Math.random() < 0.008 && signalPulses.length < 40) {
            signalPulses.push({
              startNode: pulseNodes[i],
              endNode: pulseNodes[j],
              progress: 0,
              speed: Math.random() * 0.03 + 0.02,
              color: pulseNodes[i].color.fill
            });
          }
        }
      }
    }

    // 2. Animate and draw traveling pulses (light packets)
    signalPulses = signalPulses.filter((p) => p.progress < 1);
    signalPulses.forEach((p) => {
      p.progress += p.speed;
      const px = p.startNode.x + (p.endNode.x - p.startNode.x) * p.progress;
      const py = p.startNode.y + (p.endNode.y - p.startNode.y) * p.progress;

      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  // ------------------------------------------------------------
  // MODE 3D: 🔮 Luminous Orbs Cluster (Glow orbs & Hub Cores)
  // ------------------------------------------------------------
  let orbClusters = [];
  let hubCores = [];

  class HubCore {
    constructor() {
      this.x = Math.random() * (width - 200) + 100;
      this.y = Math.random() * (height - 200) + 100;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 10 + 14;
      this.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      this.pulse = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 100 || this.x > width - 100) this.vx *= -1;
      if (this.y < 100 || this.y > height - 100) this.vy *= -1;
      this.pulse += 0.03;
    }
    draw() {
      const gRadius = this.radius * (1.8 + Math.sin(this.pulse) * 0.3);
      const grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, gRadius * 2);
      grad.addColorStop(0, `rgba(${this.color.rgb}, 0.8)`);
      grad.addColorStop(0.5, `rgba(${this.color.rgb}, 0.25)`);
      grad.addColorStop(1, `rgba(${this.color.rgb}, 0)`);

      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, gRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class SatelliteOrb {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 4 + 2.5;
      this.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      this.z = Math.random() * 0.8 + 0.4; // Depth scale
    }
    update() {
      this.x += this.vx * this.z;
      this.y += this.vy * this.z;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color.rgb}, ${0.7 * this.z})`;
      ctx.arc(this.x, this.y, this.radius * this.z, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const drawLuminousOrbs = () => {
    // 1. Draw Hub Cores
    hubCores.forEach((c) => { c.update(); c.draw(); });

    // 2. Draw Satellite Orbs & Connect to Hubs and Each Other
    orbClusters.forEach((orb) => {
      orb.update();
      orb.draw();

      // Connect to nearby Hub Cores
      hubCores.forEach((hub) => {
        const dx = hub.x - orb.x;
        const dy = hub.y - orb.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${hub.color.rgb}, ${0.4 * (1 - dist / 220)})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(hub.x, hub.y);
          ctx.lineTo(orb.x, orb.y);
          ctx.stroke();
        }
      });
    });
  };

  // ------------------------------------------------------------
  // MODE 4: Floating UI & Design Tokens
  // ------------------------------------------------------------
  let uiTokens = [];
  const tokenLabels = [
    { text: "</>", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    { text: "{\u00a0}", color: "#06b6d4", bg: "#ecfeff", border: "#a5f3fc" },
    { text: "Figma", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
    { text: "#2563EB", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    { text: "AI Pair", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
    { text: "WordPress", color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd" },
    { text: "★ Design", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    { text: "flex: 1", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
    { text: "Shopify", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
    { text: "<div>", color: "#f43f5e", bg: "#fff1f2", border: "#fecdd3" }
  ];

  class UIToken {
    constructor(item) {
      this.text = item.text;
      this.color = item.color;
      this.bg = item.bg;
      this.border = item.border;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.rot = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.01;
      this.width = 90;
      this.height = 36;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.vRot;
      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          this.x -= (dx / dist) * 2;
          this.y -= (dy / dist) * 2;
        }
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);

      // Pill Box
      ctx.beginPath();
      ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 18);
      ctx.fillStyle = this.bg;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = this.border;
      ctx.stroke();

      // Text
      ctx.font = "bold 12px sans-serif";
      ctx.fillStyle = this.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.text, 0, 0);

      ctx.restore();
    }
  }

  // ------------------------------------------------------------
  // MODE 5: Morphing Liquid Blobs
  // ------------------------------------------------------------
  let blobs = [];
  class MorphBlob {
    constructor(color, baseRadius, centerX, centerY) {
      this.color = color;
      this.baseRadius = baseRadius;
      this.x = centerX;
      this.y = centerY;
      this.points = 8;
      this.angles = [];
      this.offsets = [];
      this.speed = Math.random() * 0.02 + 0.01;
      this.phase = Math.random() * 10;
      for (let i = 0; i < this.points; i++) {
        this.angles.push((Math.PI * 2 / this.points) * i);
        this.offsets.push(Math.random() * Math.PI * 2);
      }
    }
    update() {
      this.phase += this.speed;
      if (mouse.x !== null) {
        this.x += (mouse.x - this.x) * 0.03;
        this.y += (mouse.y - this.y) * 0.03;
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      const coords = [];
      for (let i = 0; i < this.points; i++) {
        const angle = this.angles[i];
        const r = this.baseRadius + Math.sin(this.phase + this.offsets[i]) * 40;
        const px = this.x + Math.cos(angle) * r;
        const py = this.y + Math.sin(angle) * r;
        coords.push({ x: px, y: py });
      }

      ctx.moveTo((coords[0].x + coords[this.points - 1].x) / 2, (coords[0].y + coords[this.points - 1].y) / 2);
      for (let i = 0; i < this.points; i++) {
        const next = coords[(i + 1) % this.points];
        const curr = coords[i];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------
  // MODE 7: Aurora V2 (Neon Cosmic Curtains)
  // ------------------------------------------------------------
  let auroraV2Time = 0;
  const drawAuroraV2 = () => {
    auroraV2Time += 0.015;
    const layers = [
      { color1: "rgba(6, 182, 212, 0.6)", color2: "rgba(6, 182, 212, 0)", speed: 1.0, freq: 0.003, amp: 140, yBase: height * 0.4 },
      { color1: "rgba(16, 185, 129, 0.55)", color2: "rgba(16, 185, 129, 0)", speed: 0.7, freq: 0.004, amp: 160, yBase: height * 0.5 },
      { color1: "rgba(139, 92, 246, 0.5)", color2: "rgba(139, 92, 246, 0)", speed: 1.3, freq: 0.0025, amp: 120, yBase: height * 0.35 },
      { color1: "rgba(37, 99, 235, 0.45)", color2: "rgba(37, 99, 235, 0)", speed: 0.9, freq: 0.0035, amp: 150, yBase: height * 0.55 }
    ];

    layers.forEach((l) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const mouseFactor = mouse.x ? Math.sin((x - mouse.x) * 0.005) * 35 : 0;
        const y = l.yBase + Math.sin(x * l.freq + auroraV2Time * l.speed) * l.amp + Math.cos(x * l.freq * 1.5 - auroraV2Time * l.speed * 0.8) * (l.amp * 0.6) + mouseFactor;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, l.yBase - l.amp, 0, height);
      grad.addColorStop(0, l.color1);
      grad.addColorStop(0.7, l.color2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });
  };

  // ------------------------------------------------------------
  // MODE 8: 3D Starlight Warp
  // ------------------------------------------------------------
  let warpStars = [];
  class WarpStar {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = (Math.random() - 0.5) * width * 2;
      this.y = (Math.random() - 0.5) * height * 2;
      this.z = initial ? Math.random() * 1000 : 1000;
      this.pz = this.z;
      this.speed = Math.random() * 12 + 10;
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.pz = this.z;
      this.z -= this.speed;
      if (this.z <= 1) {
        this.reset(false);
      }
    }
    draw() {
      const offsetX = mouse.x ? (mouse.x - width / 2) * 0.3 : 0;
      const offsetY = mouse.y ? (mouse.y - height / 2) * 0.3 : 0;

      const sx = ((this.x + offsetX) / this.z) * 400 + width / 2;
      const sy = ((this.y + offsetY) / this.z) * 400 + height / 2;

      const px = ((this.x + offsetX) / this.pz) * 400 + width / 2;
      const py = ((this.y + offsetY) / this.pz) * 400 + height / 2;

      if (sx < 0 || sx > width || sy < 0 || sy > height) return;

      const size = Math.max(1, (1 - this.z / 1000) * 4);
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = size;
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------
  // MODE 9: Liquid Aurora Mesh
  // ------------------------------------------------------------
  let liquidTime = 0;
  const drawLiquidMesh = () => {
    liquidTime += 0.012;
    const centers = [
      { x: width * 0.3 + Math.sin(liquidTime * 0.8) * 140, y: height * 0.4 + Math.cos(liquidTime * 1.1) * 100, r: 260, color: "rgba(6, 182, 212, 0.5)" },
      { x: width * 0.7 + Math.cos(liquidTime * 0.9) * 160, y: height * 0.5 + Math.sin(liquidTime * 0.7) * 120, r: 300, color: "rgba(139, 92, 246, 0.45)" },
      { x: width * 0.5 + Math.sin(liquidTime * 1.3) * 120, y: height * 0.65 + Math.cos(liquidTime * 0.9) * 90, r: 240, color: "rgba(16, 185, 129, 0.45)" },
      { x: width * 0.4 + Math.cos(liquidTime * 0.7) * 110, y: height * 0.3 + Math.sin(liquidTime * 1.4) * 80, r: 200, color: "rgba(245, 158, 11, 0.4)" }
    ];

    centers.forEach(c => {
      ctx.save();
      const grad = ctx.createRadialGradient(c.x, c.y, 20, c.x, c.y, c.r);
      grad.addColorStop(0, c.color);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  // ------------------------------------------------------------
  // MODE 10: Cyber 3D Lightwave Grid
  // ------------------------------------------------------------
  let cyberTime = 0;
  const drawCyberGrid = () => {
    cyberTime += 0.02;
    ctx.save();
    const rows = 18;
    const cols = 28;
    const horizon = height * 0.35;
    ctx.lineWidth = 1.2;

    for (let r = 0; r < rows; r++) {
      const z = (r / rows);
      const y = horizon + Math.pow(z, 2.2) * (height - horizon);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(6, 182, 212, ${z * 0.5 + 0.1})`;
      for (let c = 0; c <= cols; c++) {
        const xNormalized = (c / cols) - 0.5;
        const x = width / 2 + xNormalized * (width * 1.4) * (z * 1.2 + 0.2);
        const wave = Math.sin(c * 0.4 + cyberTime * 2 + r * 0.5) * (18 * z);
        if (c === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    // Perspective Lines
    for (let c = 0; c <= cols; c += 2) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
      for (let r = 0; r < rows; r++) {
        const z = (r / rows);
        const y = horizon + Math.pow(z, 2.2) * (height - horizon);
        const xNormalized = (c / cols) - 0.5;
        const x = width / 2 + xNormalized * (width * 1.4) * (z * 1.2 + 0.2);
        const wave = Math.sin(c * 0.4 + cyberTime * 2 + r * 0.5) * (18 * z);
        if (r === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // ------------------------------------------------------------
  // MODE 11: 3D Holographic Crystal (Morphing Alternative M1)
  // ------------------------------------------------------------
  let crystalRotX = 0;
  let crystalRotY = 0;
  let crystalTime = 0;
  const drawHoloCrystal = () => {
    crystalTime += 0.015;
    crystalRotX += 0.008;
    crystalRotY += 0.012;

    const cx = width / 2 + (mouse.x ? (mouse.x - width / 2) * 0.15 : 0);
    const cy = height * 0.48 + (mouse.y ? (mouse.y - height / 2) * 0.15 : 0);
    const size = Math.min(width, height) * 0.22;

    const vertices = [
      [0, -size * 1.4, 0],
      [size, 0, size],
      [-size, 0, size],
      [-size, 0, -size],
      [size, 0, -size],
      [0, size * 1.4, 0]
    ];

    const faces = [
      [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
      [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]
    ];

    const projected = vertices.map(([vx, vy, vz]) => {
      // 3D Rotate Y
      const cosY = Math.cos(crystalRotY);
      const sinY = Math.sin(crystalRotY);
      const x1 = vx * cosY - vz * sinY;
      const z1 = vx * sinY + vz * cosY;

      // 3D Rotate X
      const cosX = Math.cos(crystalRotX);
      const sinX = Math.sin(crystalRotX);
      const y2 = vy * cosX - z1 * sinX;
      const z2 = vy * sinX + z1 * cosX;

      const scale = 400 / (400 + z2);
      return { x: cx + x1 * scale, y: cy + y2 * scale, z: z2 };
    });

    // Draw Crystal Faces with Prismatic Gradient
    ctx.save();
    faces.forEach((f, idx) => {
      const p1 = projected[f[0]];
      const p2 = projected[f[1]];
      const p3 = projected[f[2]];

      const grad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
      const hue = (idx * 45 + crystalTime * 50) % 360;
      grad.addColorStop(0, `hsla(${hue}, 85%, 60%, 0.35)`);
      grad.addColorStop(1, `hsla(${(hue + 60) % 360}, 85%, 65%, 0.15)`);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.7)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    ctx.restore();
  };

  // ------------------------------------------------------------
  // MODE 12: Magnetic Swarm (Morphing Alternative M2)
  // ------------------------------------------------------------
  let swarmParticles = [];
  class SwarmParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = Math.random() * 4 + 2;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.orbitRadius = Math.random() * 160 + 60;
      this.orbitSpeed = (Math.random() * 0.04 + 0.02) * (Math.random() < 0.5 ? 1 : -1);
      this.angle = Math.random() * Math.PI * 2;
    }
    update() {
      const targetX = mouse.x !== null ? mouse.x : width / 2;
      const targetY = mouse.y !== null ? mouse.y : height / 2;

      this.angle += this.orbitSpeed;
      const destX = targetX + Math.cos(this.angle) * this.orbitRadius;
      const destY = targetY + Math.sin(this.angle) * this.orbitRadius;

      this.x += (destX - this.x) * 0.06;
      this.y += (destY - this.y) * 0.06;
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------
  // MODE 13: Prism Caustics (Morphing Alternative M3)
  // ------------------------------------------------------------
  let causticsTime = 0;
  const drawPrismCaustics = () => {
    causticsTime += 0.015;
    ctx.save();
    const count = 12;
    for (let i = 0; i < count; i++) {
      const t = causticsTime + i * 0.4;
      const x1 = width * 0.2 + Math.sin(t * 0.7) * (width * 0.3);
      const y1 = 0;
      const x2 = width * 0.8 + Math.cos(t * 0.5) * (width * 0.3);
      const y2 = height;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      const hue = (i * 30 + causticsTime * 40) % 360;
      grad.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
      grad.addColorStop(0.5, `hsla(${hue}, 85%, 65%, 0.35)`);
      grad.addColorStop(1, `hsla(${(hue + 45) % 360}, 80%, 60%, 0)`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.sin(t) * 40 + 60;
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(
        x1 + Math.sin(t * 1.2) * 200, height * 0.3,
        x2 - Math.cos(t * 0.9) * 200, height * 0.7,
        x2, y2
      );
      ctx.stroke();
    }
    ctx.restore();
  };

  // ------------------------------------------------------------
  // MODE 6: Zen Ripple & Waves (和モダン枯山水波紋)
  // ------------------------------------------------------------
  let ripples = [];
  class Ripple {
    constructor(x, y, opacity = 1) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.maxRadius = Math.random() * 120 + 160;
      this.opacity = opacity;
      this.speed = Math.random() * 1.5 + 1.2;
    }
    update() {
      this.radius += this.speed;
      this.opacity -= 0.008;
    }
    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = `rgba(37, 99, 235, ${this.opacity * 0.45})`;
      ctx.lineWidth = 1.5;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner subtle ripple
      if (this.radius > 30) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6, 182, 212, ${this.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.arc(this.x, this.y, this.radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  const createRipple = (x, y, op = 1) => {
    ripples.push(new Ripple(x, y, op));
  };

  let autoRippleTimer = 0;

  // ------------------------------------------------------------
  // Mode Initializer
  // ------------------------------------------------------------
  const initMode = (mode) => {
    currentMode = mode;
    if (canvasWrapper) {
      if (mode === "metaballs") {
        canvasWrapper.classList.add("gooey-active");
      } else {
        canvasWrapper.classList.remove("gooey-active");
      }
    }

    if (mode === "metaballs") {
      const count = window.innerWidth < 768 ? 10 : 18;
      balls = Array.from({ length: count }, () => new Ball(true));
    } else if (mode === "emology_real") {
      initEmoReal();
    } else if (mode === "nodes") {
      const count = window.innerWidth < 768 ? 30 : 55;
      nodes = Array.from({ length: count }, () => new Node());
    } else if (mode === "nodes_rainbow") {
      const count = window.innerWidth < 768 ? 35 : 60;
      rainbowNodes = Array.from({ length: count }, () => new RainbowNode());
    } else if (mode === "nodes_pulse") {
      const count = window.innerWidth < 768 ? 30 : 50;
      pulseNodes = Array.from({ length: count }, () => new PulseNode());
      signalPulses = [];
    } else if (mode === "nodes_orbs") {
      const orbCount = window.innerWidth < 768 ? 30 : 50;
      orbClusters = Array.from({ length: orbCount }, () => new SatelliteOrb());
      hubCores = [new HubCore(), new HubCore(), new HubCore()];
    } else if (mode === "uitokens") {
      uiTokens = tokenLabels.map((item) => new UIToken(item));
    } else if (mode === "blob") {
      blobs = [
        new MorphBlob("rgba(6, 182, 212, 0.45)", 180, width * 0.35, height * 0.45),
        new MorphBlob("rgba(37, 99, 235, 0.40)", 220, width * 0.65, height * 0.5),
        new MorphBlob("rgba(16, 185, 129, 0.40)", 160, width * 0.5, height * 0.65)
      ];
    } else if (mode === "warp") {
      const count = window.innerWidth < 768 ? 120 : 250;
      warpStars = Array.from({ length: count }, () => new WarpStar());
    } else if (mode === "magnetic") {
      const count = window.innerWidth < 768 ? 60 : 120;
      swarmParticles = Array.from({ length: count }, () => new SwarmParticle());
    } else if (mode === "ripple") {
      ripples = [];
      createRipple(width / 2, height / 2, 1);
    }
  };

  resize();

  // ------------------------------------------------------------
  // Main Animation Loop
  // ------------------------------------------------------------
  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    if (currentMode === "metaballs") {
      ctx.globalCompositeOperation = "multiply";
      balls.forEach((b) => { b.update(); b.draw(); });
      ctx.globalCompositeOperation = "source-over";
    } else if (currentMode === "emology_real") {
      drawEmoReal();
    } else if (currentMode === "aurora") {
      ctx.globalCompositeOperation = "multiply";
      drawAurora();
      ctx.globalCompositeOperation = "source-over";
    } else if (currentMode === "aurora_v2") {
      ctx.globalCompositeOperation = "multiply";
      drawAuroraV2();
      ctx.globalCompositeOperation = "source-over";
    } else if (currentMode === "warp") {
      warpStars.forEach((s) => { s.update(); s.draw(); });
    } else if (currentMode === "liquid") {
      ctx.globalCompositeOperation = "multiply";
      drawLiquidMesh();
      ctx.globalCompositeOperation = "source-over";
    } else if (currentMode === "cyber") {
      drawCyberGrid();
    } else if (currentMode === "crystal") {
      drawHoloCrystal();
    } else if (currentMode === "magnetic") {
      swarmParticles.forEach((p) => { p.update(); p.draw(); });
    } else if (currentMode === "caustics") {
      ctx.globalCompositeOperation = "multiply";
      drawPrismCaustics();
      ctx.globalCompositeOperation = "source-over";
    } else if (currentMode === "nodes") {
      drawNodes();
    } else if (currentMode === "nodes_rainbow") {
      drawRainbowNodes();
    } else if (currentMode === "nodes_pulse") {
      drawSynapsePulse();
    } else if (currentMode === "nodes_orbs") {
      drawLuminousOrbs();
    } else if (currentMode === "uitokens") {
      uiTokens.forEach((t) => { t.update(); t.draw(); });
    } else if (currentMode === "blob") {
      ctx.globalCompositeOperation = "multiply";
      blobs.forEach((b) => { b.update(); b.draw(); });
      ctx.globalCompositeOperation = "source-over";
    } else if (currentMode === "ripple") {
      autoRippleTimer++;
      if (autoRippleTimer % 80 === 0) {
        createRipple(Math.random() * width, Math.random() * height, 0.7);
      }
      ripples = ripples.filter((r) => r.opacity > 0);
      ripples.forEach((r) => { r.update(); r.draw(); });
    }

    requestAnimationFrame(animate);
  };
  animate();

  // Expose switcher globally
  window.switchHeroAnimation = (mode) => {
    initMode(mode);
    document.querySelectorAll(".hero-anim-btn, .anim-switcher-btn").forEach((btn) => {
      if (btn.dataset.mode === mode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    const mobileAnimSelect = document.getElementById("mobile-anim-select");
    if (mobileAnimSelect && mobileAnimSelect.value !== mode) {
      mobileAnimSelect.value = mode;
    }
  };
}


// ============================================================
// 2. Profile Layout Switcher (3 Switchable Layouts)
// ============================================================
window.switchProfileLayout = (layoutId) => {
  // Hide all profile layouts
  document.querySelectorAll(".profile-layout-container").forEach((el) => {
    el.classList.add("hidden");
  });

  // Show target layout
  const target = document.getElementById(`profile-${layoutId}`);
  if (target) {
    target.classList.remove("hidden");
  }

  // Update tab buttons state
  document.querySelectorAll(".profile-tab-btn").forEach((btn) => {
    if (btn.dataset.target === layoutId) {
      btn.classList.add("active", "bg-white", "text-[#2563eb]", "shadow-sm");
      btn.classList.remove("text-[#64748b]");
    } else {
      btn.classList.remove("active", "bg-white", "text-[#2563eb]", "shadow-sm");
      btn.classList.add("text-[#64748b]");
    }
  });
};


// ============================================================
// 3. Header Scrolled Effect
// ============================================================
const header = document.querySelector("header");
if (header) {
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// ============================================================
// 4. Mobile Menu
// ============================================================
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenu = mobileMenuToggle ? document.getElementById(mobileMenuToggle.getAttribute("aria-controls")) : null;

if (mobileMenu && mobileMenuToggle) {
  const toggleMobileMenu = () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    mobileMenuToggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
    const icon = mobileMenuToggle.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = isHidden ? "close" : "menu";
  };

  mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      const icon = mobileMenuToggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "menu";
    });
  });
}

// ============================================================
// 5. Clean Accordion for Concerns (Before ➔ After Resolution)
// ============================================================
window.toggleCleanAccordion = (headerEl) => {
  const item = headerEl.closest(".clean-accordion-item");
  if (!item) return;
  const isActive = item.classList.contains("active");
  document.querySelectorAll(".clean-accordion-item").forEach((other) => other.classList.remove("active"));
  if (!isActive) {
    item.classList.add("active");
  }
};

// ============================================================
// 6. AI Dev Terminal Dynamic Simulator
// ============================================================
const terminalBody = document.getElementById("terminal-body");
if (terminalBody) {
  const steps = [
    { prompt: "$ antigravity dev --task \"Emology Style Rich Web\"", output: "✓ Organic Canvas Metaballs & GSAP motion initialized." },
    { prompt: "$ codex check --audit a11y", output: "✓ 100% Lighthouse standard | Zero CLS | Fluid Responsive." },
    { prompt: "$ git push origin main && deploy", output: "🚀 Production ready in 240ms. Live visual verified." }
  ];
  let stepIdx = 0;
  const updateTerminal = () => {
    const cur = steps[stepIdx];
    terminalBody.innerHTML = `
      <div class="text-[#06b6d4] font-mono text-xs mb-1 font-bold">${cur.prompt}</div>
      <div class="text-white/80 font-mono text-xs pl-3 border-l-2 border-[#06b6d4] mb-3">${cur.output}</div>
      <div class="text-white/40 text-[11px] font-mono flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
        AI Copilot Active
      </div>
    `;
    stepIdx = (stepIdx + 1) % steps.length;
  };
  updateTerminal();
  setInterval(updateTerminal, 3500);
}

// ============================================================
// 7. Modals Management (Works 1-9)
// ============================================================
let activeModal = null;
let lastFocusedElement = null;

const getFocusableElements = (modal) => {
  return Array.from(modal.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"));
};

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;

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
  const modal = typeof modalId === "string" ? document.getElementById(modalId) : activeModal;
  if (!modal) return;

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
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openModal(modalId);
};

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;

  if (event.key === "Escape") {
    closeModal(activeModal.id);
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements(activeModal);
  if (!focusableElements.length) return;

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

// ============================================================
// 8. GSAP Scroll Animations
// ============================================================
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-anim", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out"
  });

  gsap.utils.toArray("section h2").forEach((h2) => {
    gsap.from(h2, {
      scrollTrigger: {
        trigger: h2,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });
}

// ============================================================
// 9. Formspree Contact Form
// ============================================================
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

    if (contactFormStatus) {
      contactFormStatus.textContent = "送信しています...";
      contactFormStatus.classList.remove("hidden", "text-red-500");
      contactFormStatus.classList.add("text-gray-600");
    }
    if (contactFormSubmit) {
      contactFormSubmit.disabled = true;
      contactFormSubmit.classList.add("opacity-70", "cursor-not-allowed");
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Form submission failed");

      contactForm.reset();
      if (contactFormStatus) {
        contactFormStatus.textContent = "お問い合わせありがとうございます。送信が完了しました。";
        contactFormStatus.classList.remove("text-red-500", "text-gray-600");
        contactFormStatus.classList.add("text-emerald-600", "font-bold");
      }
    } catch {
      if (contactFormStatus) {
        contactFormStatus.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
        contactFormStatus.classList.remove("text-emerald-600", "text-gray-600");
        contactFormStatus.classList.add("text-red-500");
      }
    } finally {
      if (contactFormSubmit) {
        contactFormSubmit.disabled = false;
        contactFormSubmit.classList.remove("opacity-70", "cursor-not-allowed");
      }
    }
  });
}

/**
 * ========================================================
 * 制作実績（WORKS）ビュー切り替え ＆ カルーセル操作（無限オートグライド ＋ 手動両立）
 * ========================================================
 */
window.switchWorksView = function(viewType) {
  const carouselView = document.getElementById("works-view-carousel");
  const gridView = document.getElementById("works-view-grid");
  const tabBtns = document.querySelectorAll(".works-tab-btn");

  if (!carouselView || !gridView) return;

  tabBtns.forEach(btn => {
    if (btn.dataset.target === viewType) {
      btn.classList.add("active", "bg-white", "text-[#2563eb]", "shadow-sm");
      btn.classList.remove("text-[#64748b]");
    } else {
      btn.classList.remove("active", "bg-white", "text-[#2563eb]", "shadow-sm");
      btn.classList.add("text-[#64748b]");
    }
  });

  if (viewType === "carousel") {
    carouselView.classList.remove("hidden");
    gridView.classList.add("hidden");
  } else {
    carouselView.classList.add("hidden");
    gridView.classList.remove("hidden");
  }
};

(function setupCinematicCarousel() {
  function initCarousel() {
    const track = document.getElementById("works-carousel-track");
    if (!track || track.dataset.initialized) return;
    track.dataset.initialized = "true";

    // 1. PC横スクロール用にカード群をクローン（スマホではCSSで非表示）
    const originalCards = Array.from(track.children);
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("carousel-clone-item");
      track.appendChild(clone);
    });

    let isHovered = false;
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let virtualScrollLeft = 0;
    const autoScrollSpeed = 0.75; // 心地よい微速スクロール速度 (px/frame)
    let resumeTimer = null;
    let isUserInteracting = false;

    // 2. 自動スクロールループ（PC大画面のみ動作）
    function autoScrollLoop() {
      if (window.innerWidth >= 768) {
        if (!isHovered && !isDown && !isUserInteracting) {
          virtualScrollLeft += autoScrollSpeed;
          const halfWidth = track.scrollWidth / 2;

          if (virtualScrollLeft >= halfWidth) {
            virtualScrollLeft -= halfWidth;
          } else if (virtualScrollLeft <= 0) {
            virtualScrollLeft += halfWidth;
          }

          track.scrollLeft = virtualScrollLeft;
        }
      }
      requestAnimationFrame(autoScrollLoop);
    }
    requestAnimationFrame(autoScrollLoop);

    // 3. マウスホバーで一時停止（PC）
    track.addEventListener("mouseenter", () => {
      if (window.innerWidth < 768) return;
      isHovered = true;
    });

    track.addEventListener("mouseleave", () => {
      if (window.innerWidth < 768) return;
      isHovered = false;
      isDown = false;
    });

    // 4. マウスドラッグ操作（PC）
    track.addEventListener("mousedown", (e) => {
      if (window.innerWidth < 768) return;
      isDown = true;
      isUserInteracting = true;
      startX = e.pageX - track.offsetLeft;
      startScrollLeft = track.scrollLeft;
      virtualScrollLeft = track.scrollLeft;
      clearTimeout(resumeTimer);
    });

    track.addEventListener("mouseup", () => {
      if (window.innerWidth < 768) return;
      isDown = false;
      virtualScrollLeft = track.scrollLeft;
      resumeTimer = setTimeout(() => {
        isUserInteracting = false;
        virtualScrollLeft = track.scrollLeft;
      }, 1200);
    });

    track.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768 || !isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = startScrollLeft - walk;
      virtualScrollLeft = track.scrollLeft;
    });

    // 5. 前へ / 次へ 矢印ボタン関数
    window.scrollWorksCarousel = function(direction) {
      if (window.innerWidth < 768) return;
      isUserInteracting = true;
      clearTimeout(resumeTimer);
      const scrollAmount = track.clientWidth * 0.65 * direction;
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });

      resumeTimer = setTimeout(() => {
        virtualScrollLeft = track.scrollLeft;
        isUserInteracting = false;
      }, 1500);
    };
  }

  if (document.readyState === "loading") {
    // initCarousel will be called in main DOMContentLoaded
  } else {
    initCarousel();
  }
})();

window.switchFlowView = function(viewType) {
  const storyView = document.getElementById("flow-view-story");
  const cardsView = document.getElementById("flow-view-cards");
  const tabBtns = document.querySelectorAll(".flow-tab-btn");

  if (!storyView || !cardsView) return;

  tabBtns.forEach(btn => {
    if (btn.dataset.target === viewType) {
      btn.classList.add("active", "bg-[#2563eb]", "text-white", "shadow-sm");
      btn.classList.remove("text-[#64748b]");
    } else {
      btn.classList.remove("active", "bg-[#2563eb]", "text-white", "shadow-sm");
      btn.classList.add("text-[#64748b]");
    }
  });

  if (viewType === "story") {
    storyView.classList.remove("hidden");
    cardsView.classList.add("hidden");
  } else {
    storyView.classList.add("hidden");
    cardsView.classList.remove("hidden");
  }
};

/**
 * ========================================================
 * お悩み（CONCERNS）ビュー切り替え ＆ Before/After スライダー
 * ========================================================
 */
window.switchConcernsView = function(viewType) {
  const sliderView = document.getElementById("concerns-view-slider");
  const accordionView = document.getElementById("concerns-view-accordion");
  const tabBtns = document.querySelectorAll(".concerns-tab-btn");

  if (!sliderView || !accordionView) return;

  tabBtns.forEach(btn => {
    if (btn.dataset.target === viewType) {
      btn.classList.add("active", "bg-[#2563eb]", "text-white", "shadow-sm");
      btn.classList.remove("text-[#64748b]");
    } else {
      btn.classList.remove("active", "bg-[#2563eb]", "text-white", "shadow-sm");
      btn.classList.add("text-[#64748b]");
    }
  });

  if (viewType === "slider") {
    sliderView.classList.remove("hidden");
    accordionView.classList.add("hidden");
  } else {
    sliderView.classList.add("hidden");
    accordionView.classList.remove("hidden");
  }
};

// Before / After スライダーのドラッグ＆スワイプ処理
(function setupBeforeAfterSlider() {
  window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("ba-slider-container");
    const beforeLayer = document.getElementById("ba-before-layer");
    const handle = document.getElementById("ba-handle");

    if (!container || !beforeLayer || !handle) return;

    let isDragging = false;

    function updateSlider(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeLayer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    // マウスイベント
    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    // タッチイベント（スマートフォン対応）
    container.addEventListener("touchstart", (e) => {
      isDragging = true;
      if (e.touches.length > 0) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) updateSlider(e.touches[0].clientX);
    }, { passive: true });
  });
})();

/**
 * ========================================================
 * 🤖 AI Dev 表示モード切り替え（4パターン）
 * ========================================================
 */
window.switchAiDevView = function(viewId) {
  // すべてのビューコンテナを非表示
  document.querySelectorAll(".ai-view-container").forEach(el => {
    el.classList.add("hidden");
  });

  const targetView = document.getElementById(`ai-view-${viewId}`);
  if (targetView) targetView.classList.remove("hidden");

  // タブボタンのアクティブ状態を更新
  document.querySelectorAll(".ai-tab-btn").forEach(btn => {
    if (btn.dataset.target === viewId) {
      btn.classList.add("active", "bg-[#2563eb]", "text-white");
      btn.classList.remove("text-[#64748b]");
    } else {
      btn.classList.remove("active", "bg-[#2563eb]", "text-white");
      btn.classList.add("text-[#64748b]");
    }
  });

  if (viewId === "workbench") {
    runWorkbenchScenario("temple");
  }
};

/**
 * ========================================================
 * 🎮 協調ワークベンチ シナリオ実行エンジン
 * ========================================================
 */
const workbenchScenarios = {
  temple: {
    title: "お寺のWebサイト＆行事案内",
    aiLines: [
      "<span class='text-purple-400'>[Prompt]</span> '町のお寺のWebサイト。歴史と温かみ、月例行事カレンダー、スマホ予約導線'",
      "<span class='text-blue-400'>[AI-1]</span> 解析完了: ターゲット=檀家様・地域住民 (平均年齢高め)",
      "<span class='text-blue-400'>[AI-2]</span> コンポーネント生成: 明朝体フォント + 落ち着いた和モダンカラーパレット",
      "<span class='text-cyan-400'>[Code]</span> &lt;section class='zen-calendar grid-cols-7 gap-2 p-6'&gt;...&lt;/section&gt;",
      "<span class='text-emerald-400'>[Status]</span> 3.4秒で初期プロトタイプHTML生成完了"
    ],
    reviews: [
      {
        icon: "visibility",
        title: "シニア向け視認性・余白調整",
        desc: "文字サイズを通常より1.2倍拡大し、行間（leading-relaxed）とコントラスト比7:1を確保。"
      },
      {
        icon: "touch_app",
        title: "電話・法要予約導線の最適化",
        desc: "右下に追従する『お電話・LINEでのご相談』大型ボタンを配置し、スマホ片手で即タップ可能に設計。"
      },
      {
        icon: "photo_library",
        title: "写真撮影連携",
        desc: "境内の季節の移ろいや本堂の厳かな空気が伝わる撮り下ろし写真のレイアウト枠を組み込み。"
      }
    ]
  },
  lp: {
    title: "最短3日公開のセールスLP",
    aiLines: [
      "<span class='text-purple-400'>[Prompt]</span> '新商品・美容液のローンチLP。高CV導線、初回限定バナー、最短3日納品'",
      "<span class='text-blue-400'>[AI-1]</span> 解析完了: D2Cモデル、スマートフォン流入90%想定",
      "<span class='text-blue-400'>[AI-2]</span> 構成生成: FV強い訴求 ➔ 悩み共感 ➔ 解決根拠 ➔ 定期コース誘導",
      "<span class='text-cyan-400'>[Code]</span> &lt;button class='sticky-cta shadow-2xl animate-pulse'&gt;今すぐ試す&lt;/button&gt;",
      "<span class='text-emerald-400'>[Status]</span> レスポンシブLPコード 2.8秒で出力完了"
    ],
    reviews: [
      {
        icon: "trending_up",
        title: "CVRを高めるマイクロコピー改善",
        desc: "『購入する』ではなく『30秒で簡単お申し込み』に変更し、クリック心理ハードルを低減。"
      },
      {
        icon: "speed",
        title: "ページ表示速度の極限チューニング",
        desc: "画像WebP次世代フォーマット化、遅延読み込み（lazy）、CSSインライン化で0.4秒表示を実現。"
      },
      {
        icon: "verified",
        title: "薬機法・景表法に配慮した表現調律",
        desc: "過度な煽りを抑えつつ商品の魅力と信頼性を引き出す言葉遣いに17年の経験で推敲。"
      }
    ]
  },
  app: {
    title: "現場直結の社内ミニアプリ",
    aiLines: [
      "<span class='text-purple-400'>[Prompt]</span> 'オフィスの座席表・在席確認ツール。70インチタッチ画面とスマホで直感更新'",
      "<span class='text-blue-400'>[AI-1]</span> 解析完了: 大画面タッチ操作 ＆ モバイル同期",
      "<span class='text-blue-400'>[AI-2]</span> 設計: 軽量SPA + LocalStorage / 軽量DBリアルタイム同期",
      "<span class='text-cyan-400'>[Code]</span> const updateSeat = (seatId, user) =&gt; { state[seatId] = user; sync(); };",
      "<span class='text-emerald-400'>[Status]</span> 動作プロトタイプ 4.1秒で即時デプロイ"
    ],
    reviews: [
      {
        icon: "touch_app",
        title: "タッチUIの誤タップ防止設計",
        desc: "ボタンのタップ領域を最低48px以上確保し、直感的なドラッグ＆ドロップでも更新可能に。"
      },
      {
        icon: "devices",
        title: "マルチデバイス完全追従",
        desc: "70インチ大型モニターでもスマホ画面でも崩れないFlex/Gridレスポンシブを徹底検証。"
      },
      {
        icon: "lock_reset",
        title: "現場スタッフが迷わないゼロマニュアル設計",
        desc: "説明書を読まなくても見た瞬間に使い方がわかるミニマルなUI記号・カラーサインを採用。"
      }
    ]
  }
};

let scenarioTimeouts = [];

let currentRunId = 0;

window.runWorkbenchScenario = function(scenarioKey) {
  const thisRunId = ++currentRunId;
  const data = workbenchScenarios[scenarioKey] || workbenchScenarios.temple;

  document.querySelectorAll(".wb-scenario-btn, .scenario-btn").forEach(btn => {
    if (btn.dataset.scenario === scenarioKey) {
      btn.classList.add("active", "bg-[#0f172a]", "text-white", "border-[#0f172a]", "shadow-sm");
      btn.classList.remove("bg-white", "text-[#64748b]", "border-gray-200");
    } else {
      btn.classList.remove("active", "bg-[#0f172a]", "text-white", "border-[#0f172a]", "shadow-sm");
      btn.classList.add("bg-white", "text-[#64748b]", "border-gray-200");
    }
  });

  const aiOutputEl = document.getElementById("wb-steps-container");
  const humanReviewEl = document.getElementById("wb-human-review");
  const summaryEl = document.getElementById("wb-ai-output");
  const statusEl = document.getElementById("wb-status");

  if (statusEl) {
    statusEl.innerText = "STREAMING...";
    statusEl.className = "text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 animate-pulse";
  }

  if (aiOutputEl) {
    aiOutputEl.innerHTML = "";
    data.aiLines.forEach((line, index) => {
      setTimeout(() => {
        if (thisRunId !== currentRunId) return;
        const p = document.createElement("p");
        p.innerHTML = line;
        p.className = "p-3 rounded-lg bg-[#1e293b] border border-gray-700/60 leading-relaxed fade-in";
        aiOutputEl.appendChild(p);

        if (index === data.aiLines.length - 1 && statusEl && thisRunId === currentRunId) {
          statusEl.innerText = "CO-PILOT READY";
          statusEl.className = "text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800";
        }
      }, index * 120);
    });
  }

  if (summaryEl) {
    summaryEl.innerHTML = "<div class='flex items-center gap-2 text-xs font-bold text-emerald-300'><span class='material-symbols-outlined text-sm'>check_circle</span>" + data.title + " の要件定義・画面設計・初期プロトタイプコード生成が完了しました。</div>";
  }

  if (humanReviewEl) {
    humanReviewEl.innerHTML = "";
    data.reviews.forEach((rev) => {
      const card = document.createElement("div");
      card.className = "p-4 rounded-xl bg-[#1e293b] border border-gray-700/80 space-y-2 transition-all hover:border-cyan-500/50 shadow-md";
      card.innerHTML = '<div class="flex items-center gap-2 text-sm sm:text-base font-black text-cyan-300"><span class="material-symbols-outlined text-base text-[#38bdf8]">' + rev.icon + '</span><span>' + rev.title + '</span></div><p class="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">' + rev.desc + '</p>';
      humanReviewEl.appendChild(card);
    });
  }
};

// 初期化（重複呼び出しを完全防止）
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initCarousel === "function") initCarousel();
  if (typeof initComparisonSlider === "function") initComparisonSlider();
  const savedRadius = localStorage.getItem("sirona_radius_style") || "sharp";
  if (typeof switchRadiusStyle === "function") switchRadiusStyle(savedRadius);
});

window.switchRadiusStyle = function(styleId) {
  document.body.classList.remove("radius-sharp", "radius-solid", "radius-soft");
  document.body.classList.add(`radius-${styleId}`);

  localStorage.setItem("sirona_radius_style", styleId);

  document.querySelectorAll(".radius-switcher-btn").forEach(btn => {
    if (btn.dataset.radius === styleId) {
      btn.classList.add("active", "bg-[#2563eb]", "text-white");
      btn.classList.remove("text-gray-700", "bg-gray-100");
    } else {
      btn.classList.remove("active", "bg-[#2563eb]", "text-white");
      btn.classList.add("text-gray-700", "bg-gray-100");
    }
  });

  const mobileRadiusSelect = document.getElementById("mobile-radius-select");
  if (mobileRadiusSelect && mobileRadiusSelect.value !== styleId) {
    mobileRadiusSelect.value = styleId;
  }
};












/**
 * ========================================================
 * 📱 スマホ専用: 制作実績の「もっと見る / 閉じる」トグル（初期5件）
 * ========================================================
 */
window.toggleMoreWorksMobile = function() {
  const hiddenCards = document.querySelectorAll(".works-mobile-hidden");
  const moreText = document.getElementById("works-more-text");
  const moreIcon = document.getElementById("works-more-icon");

  if (!hiddenCards.length) return;

  const isExpanded = hiddenCards[0].classList.contains("expanded");

  if (isExpanded) {
    // 閉じる（初期5件に戻す）
    hiddenCards.forEach(card => card.classList.remove("expanded"));
    if (moreText) moreText.innerText = "制作実績をもっと見る (全9件)";
    if (moreIcon) {
      moreIcon.innerText = "expand_more";
      moreIcon.style.transform = "rotate(0deg)";
    }
    // Worksセクションの位置へスムーズスクロール
    const worksSection = document.getElementById("works");
    if (worksSection) {
      worksSection.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    // もっと見る（全9件展開）
    hiddenCards.forEach(card => card.classList.add("expanded"));
    if (moreText) moreText.innerText = "閉じる (5件表示に戻す)";
    if (moreIcon) {
      moreIcon.innerText = "expand_less";
      moreIcon.style.transform = "rotate(180deg)";
    }
  }
};


/**
 * ========================================================
 * 🤖 AI開発 表示モード切り替え（workbench / metrics）
 * ========================================================
 */
window.switchAiView = function(viewId) {
  const workbenchView = document.getElementById("ai-view-workbench");
  const metricsView = document.getElementById("ai-view-metrics");

  if (viewId === "workbench") {
    if (workbenchView) workbenchView.classList.remove("hidden");
    if (metricsView) metricsView.classList.add("hidden");
  } else {
    if (workbenchView) workbenchView.classList.add("hidden");
    if (metricsView) metricsView.classList.remove("hidden");
  }

  document.querySelectorAll(".ai-tab-btn").forEach(btn => {
    if (btn.dataset.target === viewId) {
      btn.classList.add("active", "bg-[#2563eb]", "text-white", "shadow-sm");
      btn.classList.remove("text-[#64748b]");
    } else {
      btn.classList.remove("active", "bg-[#2563eb]", "text-white", "shadow-sm");
      btn.classList.add("text-[#64748b]");
    }
  });

  if (viewId === "workbench") {
    runWorkbenchScenario("temple");
  }
};

// AIセクション進入時に自動でアニメーション開始
const aiSection = document.getElementById("ai");
if (aiSection && "IntersectionObserver" in window) {
  let aiTriggered = false;
  const aiObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !aiTriggered) {
        aiTriggered = true;
        if (typeof runWorkbenchScenario === "function") {
          runWorkbenchScenario("temple");
        }
      }
    });
  }, { threshold: 0.2 });
  aiObserver.observe(aiSection);
}
