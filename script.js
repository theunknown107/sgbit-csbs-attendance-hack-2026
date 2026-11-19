/**
 * AAGAMAN 2K26 - CSBS Fresher's Celebration Portal
 * Dynamic Fluid Lava Lamp Background & Interactive Motion Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. DYNAMIC FLUID LAVA LAMP BACKGROUND SIMULATION
  // ==========================================================================
  class FluidLavaLamp {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.blobs = [];
      this.numBlobs = 5;
      this.time = 0;
      this.initBlobs();
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      if (!this.canvas) return;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    initBlobs() {
      // Colors reflecting Aagaman's red silk, gold disco, and dark luxury aesthetic
      const colors = [
        { r: 225, g: 29, b: 72, a: 0.55 },  // Crimson Primary
        { r: 245, g: 158, b: 11, a: 0.45 }, // Champagne Gold
        { r: 159, g: 18, b: 57, a: 0.50 },  // Deep Velvet Plum
        { r: 244, g: 63, b: 94, a: 0.40 },  // Coral Rose
        { r: 180, g: 83, b: 9, a: 0.35 }    // Warm Amber
      ];

      for (let i = 0; i < this.numBlobs; i++) {
        this.blobs.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.min(window.innerWidth, window.innerHeight) * (0.35 + Math.random() * 0.25),
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          speedX: 0.0008 + Math.random() * 0.001,
          speedY: 0.0006 + Math.random() * 0.001,
          color: colors[i % colors.length]
        });
      }
    }

    animate() {
      this.time += 1;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      // Dark obsidian base
      ctx.fillStyle = '#07080b';
      ctx.fillRect(0, 0, w, h);

      // Render undulating fluid blobs with radial gradients
      this.blobs.forEach((b, index) => {
        // Smooth organic Lissajous movement
        b.phaseX += b.speedX;
        b.phaseY += b.speedY;

        const posX = (Math.sin(b.phaseX) * 0.5 + 0.5) * w;
        const posY = (Math.cos(b.phaseY) * 0.5 + 0.5) * h;

        // Radius pulsing
        const currentRadius = b.radius * (1 + 0.15 * Math.sin(b.phaseX * 2));

        const grad = ctx.createRadialGradient(posX, posY, 0, posX, posY, currentRadius);
        const c = b.color;
        grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`);
        grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a * 0.4})`);
        grad.addColorStop(1, 'rgba(7, 8, 11, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(posX, posY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize Fluid Lava Lamp
  new FluidLavaLamp('lava-canvas');

  // ==========================================================================
  // 2. AUDIO SYNTHESIZER (ZERO-DEPENDENCY)
  // ==========================================================================
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playVerifyBeep() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.setValueAtTime(650, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    }

    playCelebrationFanfare() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [
        { freq: 261.63, time: 0, dur: 0.15 },
        { freq: 329.63, time: 0.12, dur: 0.15 },
        { freq: 392.00, time: 0.24, dur: 0.18 },
        { freq: 523.25, time: 0.38, dur: 0.6 },
        { freq: 659.25, time: 0.50, dur: 0.5 },
        { freq: 783.99, time: 0.62, dur: 0.7 }
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, this.ctx.currentTime + n.time);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.time + n.dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + n.time);
        osc.stop(this.ctx.currentTime + n.time + n.dur);
      });
    }
  }

  const sound = new SoundEngine();

  // ==========================================================================
  // 3. CONFETTI PARTICLE SYSTEM
  // ==========================================================================
  class ConfettiCannon {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    explode(count = 120) {
      if (!this.canvas || !this.ctx) return;
      const colors = ['#e11d48', '#fbbf24', '#f59e0b', '#ffffff', '#38bdf8', '#ffd700'];
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 3;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 12;
        this.particles.push({
          x: cx + (Math.random() - 0.5) * 80,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          size: 6 + Math.random() * 7,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 14,
          life: 1,
          decay: 0.007 + Math.random() * 0.008
        });
      }

      if (!this.animId) {
        this.loop();
      }
    }

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > this.canvas.height + 50) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.life);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  const confetti = new ConfettiCannon('confetti-canvas');

  // ==========================================================================
  // 4. UI ELEMENTS & EVENT LISTENERS
  // ==========================================================================
  const portalView = document.getElementById('portal-view');
  const revealView = document.getElementById('reveal-view');
  const attendanceForm = document.getElementById('attendance-form');
  const studentUsn = document.getElementById('student-usn');
  const studentName = document.getElementById('student-name');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');

  const progressModal = document.getElementById('progress-modal');
  const progressStepText = document.getElementById('progress-step-text');
  const progressBarFill = document.getElementById('progress-bar-fill');

  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  const posterCard = document.getElementById('poster-card-element');
  const posterTiltContainer = document.getElementById('poster-tilt-container');
  const posterGlare = document.getElementById('poster-glare');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  const btnResetForm = document.getElementById('btn-reset-form');

  // Countdown Elements
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMins = document.getElementById('count-mins');
  const countSecs = document.getElementById('count-secs');

  // Auto-capitalize USN as typed
  if (studentUsn) {
    studentUsn.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
  }

  // Audio Toggle
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      audioToggleBtn.style.opacity = isEnabled ? '1' : '0.4';
      showToast(isEnabled ? 'Sound enabled' : 'Sound muted');
    });
  }

  // --- Form Submit & Prank Drop ---
  if (attendanceForm) {
    attendanceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usn = studentUsn.value.trim();
      const name = studentName.value.trim();

      if (!usn || !name) {
        showToast('Please enter both your USN and Full Name');
        return;
      }

      sound.init();
      sound.playVerifyBeep();

      // Show Progress Modal
      submitBtn.classList.add('loading');
      btnText.textContent = 'Verifying...';
      progressModal.classList.add('show');
      progressBarFill.style.width = '0%';

      setTimeout(() => {
        progressStepText.textContent = 'Locating student in CSBS registry...';
        progressBarFill.style.width = '40%';
      }, 300);

      setTimeout(() => {
        progressStepText.textContent = `Applying session waiver to ${usn}...`;
        progressBarFill.style.width = '80%';
        sound.playVerifyBeep();
      }, 700);

      setTimeout(() => {
        progressStepText.textContent = 'SUCCESS: Attendance verified';
        progressBarFill.style.width = '100%';
      }, 1050);

      // The Drop
      setTimeout(() => {
        progressModal.classList.remove('show');
        submitBtn.classList.remove('loading');
        btnText.textContent = 'Claim Free Attendance';

        // Switch to Reveal View
        portalView.classList.add('hidden');
        revealView.classList.add('active');

        // Confetti & Celebration
        confetti.explode(160);
        setTimeout(() => confetti.explode(100), 400);
        sound.playCelebrationFanfare();

        // Smooth scroll to top of reveal
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1350);
    });
  }

  // Reset Button
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      revealView.classList.remove('active');
      portalView.classList.remove('hidden');
      attendanceForm.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3D Perspective Tilt on Hero Poster
  if (posterTiltContainer && posterCard) {
    const handleMove = (x, y, rect) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (x - centerX) / (rect.width / 2);
      const deltaY = (y - centerY) / (rect.height / 2);

      const rotateY = deltaX * 12;
      const rotateX = -deltaY * 12;

      posterCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (posterGlare) {
        const glareX = ((x - rect.left) / rect.width) * 100;
        const glareY = ((y - rect.top) / rect.height) * 100;
        posterGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, transparent 60%)`;
      }
    };

    posterTiltContainer.addEventListener('mousemove', (e) => {
      const rect = posterTiltContainer.getBoundingClientRect();
      handleMove(e.clientX, e.clientY, rect);
    });

    posterTiltContainer.addEventListener('mouseleave', () => {
      posterCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Mobile Gyroscope Tilt
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          const rotY = Math.min(Math.max(e.gamma / 3, -14), 14);
          const rotX = Math.min(Math.max((e.beta - 45) / 3, -14), 14);
          posterCard.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }
      });
    }
  }

  // Lightbox Zoom
  if (posterCard && lightboxModal) {
    posterCard.addEventListener('click', () => {
      lightboxModal.classList.add('show');
    });

    lightboxCloseBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('show');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('show');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightboxModal.classList.remove('show');
    });
  }

  // Toast Helper
  let toastTimer = null;
  function showToast(msg) {
    if (!toastNotice) return;
    toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  // Countdown to November 30, 2026
  function updateCountdown() {
    const targetDate = new Date('2026-11-30T17:30:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (countDays) countDays.textContent = '00';
      if (countHours) countHours.textContent = '00';
      if (countMins) countMins.textContent = '00';
      if (countSecs) countSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (countDays) countDays.textContent = String(days).padStart(2, '0');
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMins) countMins.textContent = String(mins).padStart(2, '0');
    if (countSecs) countSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
