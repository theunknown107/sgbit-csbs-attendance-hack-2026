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
      this.blobs.forEach((b) => {
        b.phaseX += b.speedX;
        b.phaseY += b.speedY;

        const posX = (Math.sin(b.phaseX) * 0.5 + 0.5) * w;
        const posY = (Math.cos(b.phaseY) * 0.5 + 0.5) * h;
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
  // 2. BACKGROUND THEME SONG (PLAYS 0:11 TO 1:00 THEN LOOPS)
  // ==========================================================================
  const bgMusic = document.getElementById('bg-theme-music') || new Audio('assets/aagaman_theme.mp3');
  bgMusic.preload = 'auto';

  let isMuted = false;
  let musicStarted = false;

  const muteToggleBtn = document.getElementById('mute-toggle-btn');
  const muteIcon = document.getElementById('mute-icon');
  const muteLabel = document.getElementById('mute-label');

  function updateMuteButtonUI() {
    if (!muteToggleBtn) return;
    if (isMuted) {
      muteToggleBtn.classList.remove('is-playing');
      muteToggleBtn.classList.add('is-muted');
      if (muteLabel) muteLabel.textContent = 'Muted';
      if (muteIcon) {
        muteIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          </svg>
        `;
      }
    } else {
      muteToggleBtn.classList.remove('is-muted');
      if (musicStarted && !bgMusic.paused) {
        muteToggleBtn.classList.add('is-playing');
      }
      if (muteLabel) muteLabel.textContent = 'Audio On';
      if (muteIcon) {
        muteIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      }
    }
  }

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      bgMusic.muted = isMuted;
      updateMuteButtonUI();

      if (!isMuted && musicStarted && bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Playback error:', e));
      }
      showToast(isMuted ? 'Audio muted' : 'Audio unmuted');
    });
  }

  function startPosterSong() {
    musicStarted = true;
    bgMusic.currentTime = 11.0;
    bgMusic.muted = isMuted;

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateMuteButtonUI();
      }).catch(err => {
        console.warn('Autoplay waiting for user interaction:', err);
      });
    }
  }

  // Exact Loop from 1:00 (60.0s) back to 0:11 (11.0s)
  bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.currentTime >= 60.0) {
      bgMusic.currentTime = 11.0;
      if (!isMuted && !bgMusic.paused) {
        bgMusic.play().catch(e => {});
      }
    }
  });

  // Secondary interval safeguard for seamless loop
  setInterval(() => {
    if (musicStarted && bgMusic.currentTime >= 60.0) {
      bgMusic.currentTime = 11.0;
      if (!isMuted && !bgMusic.paused) {
        bgMusic.play().catch(e => {});
      }
    }
  }, 250);

  // Beep sound during verification
  function playVerifyBeep() {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(650, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  }

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

  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  const posterCard = document.getElementById('poster-card-element');
  const posterTiltContainer = document.getElementById('poster-tilt-container');
  const posterHolo = document.getElementById('poster-holo');
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

      // Prime audio element on user gesture
      try {
        bgMusic.load();
      } catch (e) {}

      playVerifyBeep();

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
        playVerifyBeep();
      }, 700);

      setTimeout(() => {
        progressStepText.textContent = 'SUCCESS: Attendance verified';
        progressBarFill.style.width = '100%';
      }, 1050);

      // --- THE DROP & POSTER POP-UP ---
      setTimeout(() => {
        progressModal.classList.remove('show');
        submitBtn.classList.remove('loading');
        btnText.textContent = 'Claim Free Attendance';

        // Switch to Reveal View
        portalView.classList.add('hidden');
        revealView.classList.add('active');

        // Confetti Burst
        confetti.explode(160);
        setTimeout(() => confetti.explode(100), 400);

        // PLAY THE SONG FROM 0:11 TO 1:00 THEN LOOP
        startPosterSong();

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

      // Pause audio on reset
      bgMusic.pause();
      bgMusic.currentTime = 11.0;
      musicStarted = false;
      updateMuteButtonUI();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3D Perspective Holographic Tilt on Hero Poster (Desktop & Mobile)
  if (posterTiltContainer && posterCard) {
    const handleMove = (x, y, rect) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (x - centerX) / (rect.width / 2);
      const deltaY = (y - centerY) / (rect.height / 2);

      const rotateY = deltaX * 14;
      const rotateX = -deltaY * 14;

      posterCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
      posterCard.classList.add('is-active');

      const glareX = ((x - rect.left) / rect.width) * 100;
      const glareY = ((y - rect.top) / rect.height) * 100;

      if (posterGlare) {
        posterGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.32) 0%, transparent 60%)`;
      }

      if (posterHolo) {
        posterHolo.style.backgroundPosition = `${glareX}% ${glareY}%`;
      }
    };

    // Desktop Mouse Events
    posterTiltContainer.addEventListener('mousemove', (e) => {
      const rect = posterTiltContainer.getBoundingClientRect();
      handleMove(e.clientX, e.clientY, rect);
    });

    posterTiltContainer.addEventListener('mouseleave', () => {
      posterCard.classList.remove('is-active');
      posterCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Mobile Touch Events (Drag & Holo Interactive)
    posterTiltContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = posterTiltContainer.getBoundingClientRect();
        handleMove(touch.clientX, touch.clientY, rect);
      }
    }, { passive: true });

    posterTiltContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = posterTiltContainer.getBoundingClientRect();
        handleMove(touch.clientX, touch.clientY, rect);
      }
    }, { passive: true });

    posterTiltContainer.addEventListener('touchend', () => {
      posterCard.classList.remove('is-active');
      posterCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Mobile Gyroscope Tilt
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          const rotY = Math.min(Math.max(e.gamma / 2.5, -16), 16);
          const rotX = Math.min(Math.max((e.beta - 45) / 2.5, -16), 16);
          posterCard.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
          posterCard.classList.add('is-active');

          const holoX = 50 + (rotY / 16) * 40;
          const holoY = 50 + (rotX / 16) * 40;
          if (posterHolo) {
            posterHolo.style.backgroundPosition = `${holoX}% ${holoY}%`;
          }
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

  // Countdown to Aagaman 2K26 (November 30, 2026 - 5:30 PM)
  function updateCountdown() {
    const now = new Date();
    const targetYear = now.getFullYear();
    // Month 10 = November in JS Date (0-indexed)
    let target = new Date(targetYear, 10, 30, 17, 30, 0);

    let diff = target.getTime() - now.getTime();

    // If past November 30 for the current cycle, roll to the next
    if (diff < 0) {
      target = new Date(targetYear + 1, 10, 30, 17, 30, 0);
      diff = target.getTime() - now.getTime();
    }

    if (diff <= 0 || isNaN(diff)) {
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
