/**
 * AAGAMAN 2K26 - CSBS Fresher's Celebration & Attendance Prank Portal
 * Fluid, Non-AI-Slop Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Synthesizer (Zero-dependency Web Audio API) ---
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

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
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

      // Celebratory Brass Chords
      const notes = [
        { freq: 261.63, time: 0, dur: 0.15 }, // C4
        { freq: 329.63, time: 0.12, dur: 0.15 }, // E4
        { freq: 392.00, time: 0.24, dur: 0.18 }, // G4
        { freq: 523.25, time: 0.38, dur: 0.6 },  // C5 (high drop)
        { freq: 659.25, time: 0.50, dur: 0.5 },  // E5
        { freq: 783.99, time: 0.62, dur: 0.7 }   // G5
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

  // --- Confetti Particle System ---
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
      const colors = ['#e11d48', '#fbbf24', '#f59e0b', '#ffffff', '#38bdf8', '#be123c', '#ffd700'];
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 3;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 12;
        this.particles.push({
          x: cx + (Math.random() - 0.5) * 100,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          size: 6 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 14,
          life: 1,
          decay: 0.006 + Math.random() * 0.008
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
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // air drag
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

  // --- UI Elements ---
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

  const ticketNameVal = document.getElementById('ticket-name-val');
  const ticketUsnVal = document.getElementById('ticket-usn-val');
  const ticketDivVal = document.getElementById('ticket-div-val');
  const ticketSerialVal = document.getElementById('ticket-serial-val');

  const btnDownloadPass = document.getElementById('btn-download-pass');
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const btnResetForm = document.getElementById('btn-reset-form');

  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioText = document.getElementById('audio-text');

  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  const posterCard = document.getElementById('poster-card-element');
  const posterTiltContainer = document.getElementById('poster-tilt-container');
  const posterGlare = document.getElementById('poster-glare');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  // Countdown Elements
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMins = document.getElementById('count-mins');
  const countSecs = document.getElementById('count-secs');

  // Format USN on type
  if (studentUsn) {
    studentUsn.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
  }

  // Audio Toggle Button
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      audioIcon.textContent = isEnabled ? '🔊' : '🔇';
      audioText.textContent = isEnabled ? 'Audio On' : 'Muted';
      showToast(isEnabled ? 'Sound effects enabled' : 'Sound effects muted');
      if (isEnabled) sound.playClick();
    });
  }

  // --- Attendance Form Submission & Prank Drop ---
  if (attendanceForm) {
    attendanceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usn = studentUsn.value.trim();
      const name = studentName.value.trim();
      const selectedDiv = document.querySelector('input[name="division"]:checked');
      const division = selectedDiv ? selectedDiv.value : 'A';

      if (!usn || !name) {
        showToast('Please enter both your USN and Full Name!');
        return;
      }

      sound.init();
      sound.playVerifyBeep();

      // Lock button & show progress modal
      submitBtn.classList.add('loading');
      btnText.textContent = 'Verifying...';
      progressModal.classList.add('show');
      progressBarFill.style.width = '0%';

      // Simulation steps for authenticity
      setTimeout(() => {
        progressStepText.textContent = 'Locating student in CSBS registry...';
        progressBarFill.style.width = '35%';
      }, 300);

      setTimeout(() => {
        progressStepText.textContent = `Applying attendance waiver to ${usn}...`;
        progressBarFill.style.width = '75%';
        sound.playVerifyBeep();
      }, 700);

      setTimeout(() => {
        progressStepText.textContent = 'SUCCESS: 100% Attendance Authorized!';
        progressBarFill.style.width = '100%';
      }, 1050);

      // --- THE DROP! ---
      setTimeout(() => {
        progressModal.classList.remove('show');
        submitBtn.classList.remove('loading');
        btnText.textContent = 'Claim Free Attendance';

        // Update Ticket Details
        ticketNameVal.textContent = name;
        ticketUsnVal.textContent = usn;
        ticketDivVal.textContent = `Section ${division}`;
        const randomSerial = 'CSBS-AAG-26-' + Math.floor(1000 + Math.random() * 9000);
        ticketSerialVal.textContent = randomSerial;

        // Switch Views with fluid transition
        portalView.classList.add('hidden');
        revealView.classList.add('active');

        // Trigger Confetti & Fanfare
        confetti.explode(160);
        setTimeout(() => confetti.explode(100), 400);
        sound.playCelebrationFanfare();

        // Smooth scroll to top of showcase
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1350);
    });
  }

  // --- Reset Form to Test Again ---
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      revealView.classList.remove('active');
      portalView.classList.remove('hidden');
      attendanceForm.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sound.playClick();
    });
  }

  // --- 3D Interactive Card Tilt on Poster ---
  if (posterTiltContainer && posterCard) {
    const handleMove = (x, y, rect) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (x - centerX) / (rect.width / 2);
      const deltaY = (y - centerY) / (rect.height / 2);

      const rotateY = deltaX * 14;
      const rotateX = -deltaY * 14;

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

    // Mobile Gyroscope tilt support
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          const rotY = Math.min(Math.max(e.gamma / 3, -15), 15);
          const rotX = Math.min(Math.max((e.beta - 45) / 3, -15), 15);
          posterCard.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }
      });
    }
  }

  // --- Fullscreen Poster Lightbox ---
  if (posterCard && lightboxModal) {
    posterCard.addEventListener('click', () => {
      lightboxModal.classList.add('show');
      sound.playClick();
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

  // --- VIP Ticket Image Generator & Downloader ---
  if (btnDownloadPass) {
    btnDownloadPass.addEventListener('click', () => {
      sound.playClick();
      generateAndDownloadTicket({
        name: ticketNameVal.textContent || 'Guest Fresher',
        usn: ticketUsnVal.textContent || '2KA24CB000',
        division: ticketDivVal.textContent || 'Section A',
        serial: ticketSerialVal.textContent || 'CSBS-AAG-26-0000'
      });
    });
  }

  function generateAndDownloadTicket(info) {
    const canvas = document.getElementById('ticket-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 630;

    // Background Dark Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGradient.addColorStop(0, '#0a0b12');
    bgGradient.addColorStop(0.5, '#161928');
    bgGradient.addColorStop(1, '#0c0d16');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Red Ambient Glow on left
    const redGlow = ctx.createRadialGradient(200, 315, 50, 200, 315, 400);
    redGlow.addColorStop(0, 'rgba(225, 29, 72, 0.35)');
    redGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = redGlow;
    ctx.fillRect(0, 0, 1200, 630);

    // Gold Ambient Glow on right
    const goldGlow = ctx.createRadialGradient(1000, 315, 50, 1000, 315, 450);
    goldGlow.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
    goldGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = goldGlow;
    ctx.fillRect(0, 0, 1200, 630);

    // Outer Border & Corner Frames
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 550);

    // Perforated Dashed Line separating stub
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.moveTo(850, 40);
    ctx.lineTo(850, 590);
    ctx.stroke();
    ctx.setLineDash([]);

    // Notch cutouts
    ctx.fillStyle = '#07080b';
    ctx.beginPath();
    ctx.arc(850, 30, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(850, 600, 24, 0, Math.PI * 2);
    ctx.fill();

    // Text: Header
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('S.G. BALEKUNDRI INSTITUTE OF TECHNOLOGY • DEPT OF CSBS', 70, 95);

    // Text: Event Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px "Cabinet Grotesk", sans-serif';
    ctx.fillText('AAGAMAN 2K26', 70, 175);

    ctx.fillStyle = '#e11d48';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("FRESHER'S PARTY • EXCLUSIVE VIP ACCESS", 70, 215);

    // Student Info Block
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('STUDENT NAME', 70, 290);
    ctx.fillText('UNIVERSITY SEAT NUMBER (USN)', 420, 290);

    ctx.fillStyle = '#fef08a';
    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(info.name.toUpperCase(), 70, 335);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 30px "JetBrains Mono", monospace';
    ctx.fillText(info.usn, 420, 335);

    // Date & Venue Details
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('EVENT DATE', 70, 405);
    ctx.fillText('VENUE', 420, 405);
    ctx.fillText('CLASS DIVISION', 70, 500);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('30TH NOVEMBER 2026', 70, 445);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DIVINE ALLAMA SABHAMANTAP', 420, 445);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(info.division, 70, 540);

    // Right Stub Content (Ticket Verification)
    ctx.save();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ADMIT ONE', 890, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VIP ENTRY', 890, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(info.serial, 890, 170);

    // Fake Barcode Lines
    let barX = 890;
    const barY = 220;
    const barHeight = 260;
    const barPattern = [3, 2, 6, 4, 2, 5, 2, 8, 4, 2, 7, 3, 2, 5, 3, 7, 2, 4, 6, 3, 2, 4, 7, 3, 2, 5];
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < barPattern.length; i++) {
      ctx.fillRect(barX, barY, barPattern[i], barHeight);
      barX += barPattern[i] + 4;
      if (barX > 1110) break;
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SCAN AT VENUE GATE', 890, 520);
    ctx.restore();

    // Convert to Image & Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Aagaman_2K26_VIP_Pass_${info.usn}.png`;
    link.href = dataUrl;
    link.click();

    showToast('VIP Pass downloaded successfully! 🎟️');
  }

  // --- Prank Sharing Actions ---
  const shareText = `Bro, hurry up! CSBS professors opened a link for free attendance credit, enter your USN before they take it down: https://theunknown107.github.io/aagaman-2026/ 🏃💨`;

  if (btnShareWhatsapp) {
    btnShareWhatsapp.addEventListener('click', () => {
      sound.playClick();
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      sound.playClick();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          showToast('Prank message & link copied to clipboard! 😂');
        }).catch(() => {
          copyFallback(shareText);
        });
      } else {
        copyFallback(shareText);
      }
    });
  }

  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Prank message & link copied to clipboard! 😂');
  }

  // --- Toast Notification Helper ---
  let toastTimer = null;
  function showToast(msg) {
    if (!toastNotice) return;
    toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // --- Event Countdown to November 30, 2026 ---
  function updateCountdown() {
    const targetDate = new Date('2026-11-30T17:30:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (countDays) countDays.textContent = '00';
      if (countHours) countHours.textContent = '00';
      if (countMins) countMins.textContent = '00';
      if (countSecs) countSecs.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((difference % (1000 * 60)) / 1000);

    if (countDays) countDays.textContent = String(days).padStart(2, '0');
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMins) countMins.textContent = String(mins).padStart(2, '0');
    if (countSecs) countSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
