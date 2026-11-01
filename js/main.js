/**
 * Main Interactive Storytelling Engine for Bondam's Birthday
 */

// Confetti System
function confettiBurst(count = 80) {
  const layer = document.getElementById('confettiLayer');
  if (!layer) return;
  const colors = [
    '#f5c45d', '#f28c82', '#83c99b', '#fff1c9', '#b6a0e8',
    '#ff6b8b', '#a78bfa', '#38bdf8', '#f43f5e', '#ffd166'
  ];
  const shapes = ['square', 'circle', 'ribbon'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('i');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    piece.className = `confetti-piece ${shape}`;
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--duration', (2.2 + Math.random() * 2.5) + 's');
    piece.style.setProperty('--drift', (Math.random() * 260 - 130) + 'px');
    piece.style.setProperty('--rotation', (Math.random() * 720 - 360) + 'deg');
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 5500);
  }
}

// Floating Hearts Generator
function spawnFloatingHearts(container, count = 12) {
  if (!container) return;
  const emojis = ['❤️', '💖', '✨', '🌸', '💫'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart-particle';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = (15 + Math.random() * 70) + '%';
    heart.style.bottom = '10%';
    heart.style.animationDelay = (i * 0.18) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 2600);
  }
}

// Personality Report Animation
let reportAnimated = false;
function animatePersonality() {
  if (reportAnimated) return;
  reportAnimated = true;

  document.querySelectorAll('.stat').forEach((stat, index) => {
    const value = Number(stat.dataset.value);
    const label = stat.querySelector('.stat-top b');
    const bar = stat.querySelector('.meter i');
    const visualWidth = value === 0 ? 2 : Math.min(value > 100 ? 100 : value, 100);

    setTimeout(() => {
      if (bar) bar.style.width = visualWidth + '%';
      if (label) {
        const start = performance.now();
        const duration = 1200;
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          label.textContent = Math.round(value * (1 - Math.pow(1 - p, 3))) + '%';
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    }, index * 120);
  });
}

// Cake Interaction: Make a Wish & Blow Candles
let cakeBlown = false;
function setupCakeInteraction() {
  const wishBtn = document.getElementById('makeWishBtn');
  const cake = document.getElementById('birthdayCake');
  const wishCard = document.getElementById('wishRevealCard');

  if (!wishBtn || !cake) return;

  wishBtn.addEventListener('click', () => {
    if (cakeBlown) return;
    cakeBlown = true;

    // Audio: Candle blow breath
    AudioManager.play('candle');

    // Blow flames
    const flames = cake.querySelectorAll('.candle-flame');
    flames.forEach(flame => {
      flame.classList.add('extinguished');
    });

    // Spawn smoke particles
    const candleTops = cake.querySelectorAll('.candle-wick');
    candleTops.forEach(wick => {
      const rect = wick.getBoundingClientRect();
      const smoke = document.createElement('div');
      smoke.className = 'smoke-particle';
      smoke.style.left = (wick.offsetLeft + 2) + 'px';
      smoke.style.top = (wick.offsetTop - 12) + 'px';
      cake.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1600);
    });

    // Celebration burst after candle blown
    setTimeout(() => {
      AudioManager.play('celebration');
      confettiBurst(120);

      wishBtn.disabled = true;
      wishBtn.innerHTML = '✨ సుఖీభవ! ✨';
      wishBtn.classList.add('wish-granted');

      if (wishCard) {
        wishCard.classList.add('show-wish');
        wishCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 700);
  });
}

// Interactive Birthday Letter with Envelope
let letterOpened = false;
function setupLetterInteraction() {
  const envelope = document.getElementById('interactiveEnvelope');
  const letterWrapper = document.getElementById('letterContainer');

  if (!envelope) return;

  envelope.addEventListener('click', () => {
    if (letterOpened) return;
    letterOpened = true;

    AudioManager.play('chime');
    envelope.classList.add('envelope-open');

    // Spawn floating hearts
    spawnFloatingHearts(letterWrapper, 16);

    setTimeout(() => {
      const letterContent = document.getElementById('specialLetter');
      if (letterContent) {
        letterContent.classList.add('revealed');
      }
      confettiBurst(60);
    }, 600);
  });
}

// Lightbox Modal for Memories
function setupPhotoLightbox() {
  const modal = document.getElementById('photoLightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.polaroid-caption');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Memory Photo';
        if (modalCaption && caption) {
          modalCaption.textContent = caption.textContent;
        }
        modal.classList.add('active');
        AudioManager.play('chime');
      }
    });
  });

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Funny Telugu Cards Micro-interactions
function setupComedyCards() {
  document.querySelectorAll('.comedy-dialogue-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    card.addEventListener('click', () => {
      AudioManager.play('chime');
      card.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.06) rotate(-2deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], { duration: 350 });
      confettiBurst(25);
    });
  });
}

// Intersection Observer for scroll triggers
function setupScrollTriggers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.id === 'comedy') {
          animatePersonality();
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-section').forEach(sec => {
    observer.observe(sec);
  });
}

// Initialise everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Start Coconut Sequence Button
  const startBtn = document.getElementById('startAdventureBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      runCoconutSequence();
    });
  }

  // Open Surprise Button (from cracked coconut) -> Unlocks Main Website
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const mainWebsite = document.getElementById('mainCelebrationWebsite');
  if (openSurpriseBtn && mainWebsite) {
    openSurpriseBtn.addEventListener('click', () => {
      AudioManager.play('celebration');
      confettiBurst(120);

      // Smoothly display main website
      mainWebsite.style.display = 'block';
      setTimeout(() => {
        mainWebsite.classList.add('visible');
        mainWebsite.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  }

  // Replay Button (back to opening scene)
  const replayBtn = document.getElementById('replayAdventureBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        // Reset states
        resetOpeningScene();

        // Reset Cake
        cakeBlown = false;
        const cake = document.getElementById('birthdayCake');
        if (cake) {
          cake.querySelectorAll('.candle-flame').forEach(f => f.classList.remove('extinguished'));
        }
        const wishBtn = document.getElementById('makeWishBtn');
        if (wishBtn) {
          wishBtn.disabled = false;
          wishBtn.innerHTML = 'Make a Wish ✨';
          wishBtn.classList.remove('wish-granted');
        }
        const wishCard = document.getElementById('wishRevealCard');
        if (wishCard) wishCard.classList.remove('show-wish');

        // Reset Letter
        letterOpened = false;
        const envelope = document.getElementById('interactiveEnvelope');
        if (envelope) envelope.classList.remove('envelope-open');
        const letter = document.getElementById('specialLetter');
        if (letter) letter.classList.remove('revealed');

        // Reset Personality
        reportAnimated = false;
        document.querySelectorAll('.stat').forEach(s => {
          const valLabel = s.querySelector('.stat-top b');
          const bar = s.querySelector('.meter i');
          if (valLabel) valLabel.textContent = '0%';
          if (bar) bar.style.width = '0%';
        });

        AudioManager.play('chime');
      }, 500);
    });
  }

  // Sound Toggle Button
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const isEnabled = AudioManager.toggle();
      soundToggle.textContent = isEnabled ? '🔊' : '🔇';
      soundToggle.setAttribute('aria-label', isEnabled ? 'Mute sound' : 'Enable sound');
      soundToggle.classList.toggle('sound-active', isEnabled);
    });
  }

  // Initialize interactive components
  setupCakeInteraction();
  setupLetterInteraction();
  setupPhotoLightbox();
  setupComedyCards();
  setupScrollTriggers();
});
