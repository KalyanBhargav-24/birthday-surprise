/**
 * Cinematic Coconut Falling & Hatching Sequence
 * Originates from the actual coconut tree branch and hatches Image 6!
 */

function runCoconutSequence(onSurpriseReady) {
  const introScene = document.getElementById('coconutScene');
  const heroCoconut = document.getElementById('heroCoconut');
  const fallingCoconut = document.getElementById('fallingCoconut');
  const dustContainer = document.getElementById('impactDust');
  const crackContainer = document.getElementById('coconutCracked');
  const surpriseCard = document.getElementById('openingSurprise');
  const startBtn = document.getElementById('startAdventureBtn');

  if (!introScene || !heroCoconut || !fallingCoconut) return;

  // Automatically enable audio context on start button click
  AudioManager.enable();

  // Hide button during animation
  if (startBtn) {
    startBtn.style.pointerEvents = 'none';
    startBtn.style.opacity = '0';
    startBtn.style.transform = 'scale(0.8)';
  }

  // STEP 2: Selection & Subtle Wobble / Tension
  heroCoconut.classList.add('wobble-selected');
  AudioManager.play('chime');

  setTimeout(() => {
    // Calculate exact screen coordinates of the hanging coconut on the tree
    const heroRect = heroCoconut.getBoundingClientRect();
    const sceneRect = introScene.getBoundingClientRect();

    const startX = heroRect.left - sceneRect.left;
    const startY = heroRect.top - sceneRect.top;

    // STEP 3: Detachment
    heroCoconut.style.opacity = '0'; // Hide the tree coconut at moment of detachment

    fallingCoconut.style.display = 'block';
    fallingCoconut.style.left = `${startX}px`;
    fallingCoconut.style.top = `${startY}px`;
    fallingCoconut.style.opacity = '1';
    fallingCoconut.classList.add('detaching');

    AudioManager.play('fall');

    // STEP 4: Physics-based Falling with curve & rotation
    // Calculate ground level (approx 78% of scene height or ground element top)
    const groundEl = document.getElementById('groundSurface');
    const groundRect = groundEl ? groundEl.getBoundingClientRect() : null;
    const targetY = groundRect ? (groundRect.top - sceneRect.top - 40) : (sceneRect.height * 0.76);
    const targetX = startX + 35; // slight natural curve to the right

    const fallDistance = targetY - startY;
    const fallDuration = 1150; // ms

    fallingCoconut.animate([
      {
        transform: 'translate(0, 0) rotate(0deg) scale(1)',
        easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'
      },
      {
        transform: `translate(${targetX - startX}px, ${fallDistance}px) rotate(420deg) scale(1.08)`,
        easing: 'cubic-bezier(0.5, 0, 0.85, 0.65)'
      }
    ], {
      duration: fallDuration,
      fill: 'forwards'
    }).onfinish = () => {
      // STEP 5: Ground Impact & Bounce
      handleGroundImpact(targetX, targetY, () => {
        // STEP 6: Coconut Cracking
        handleCoconutCracking(targetX, targetY, () => {
          // STEP 7: Image 6 Reveal
          revealImageSurprise(onSurpriseReady);
        });
      });
    };
  }, 900);
}

function handleGroundImpact(x, y, onCracked) {
  const fallingCoconut = document.getElementById('fallingCoconut');
  const scene = document.getElementById('coconutScene');
  const dustContainer = document.getElementById('impactDust');

  // Audio: Heavy thud
  AudioManager.play('thud');

  // Screen shake
  scene.classList.add('screen-shake');
  setTimeout(() => scene.classList.remove('screen-shake'), 450);

  // Spawn dust & leaf particles at impact point
  spawnImpactParticles(x + 28, y + 45);

  // Bounce 1 with squash and stretch
  fallingCoconut.animate([
    { transform: `translate(${x - parseFloat(fallingCoconut.style.left)}px, ${y - parseFloat(fallingCoconut.style.top)}px) scale(1.4, 0.6) rotate(420deg)` },
    { transform: `translate(${x - parseFloat(fallingCoconut.style.left) + 12}px, ${y - parseFloat(fallingCoconut.style.top) - 65}px) scale(0.9, 1.15) rotate(470deg)` },
    { transform: `translate(${x - parseFloat(fallingCoconut.style.left) + 20}px, ${y - parseFloat(fallingCoconut.style.top)}px) scale(1.2, 0.75) rotate(510deg)` },
    { transform: `translate(${x - parseFloat(fallingCoconut.style.left) + 25}px, ${y - parseFloat(fallingCoconut.style.top) - 22}px) scale(0.95, 1.05) rotate(530deg)` },
    { transform: `translate(${x - parseFloat(fallingCoconut.style.left) + 28}px, ${y - parseFloat(fallingCoconut.style.top)}px) scale(1, 1) rotate(540deg)` }
  ], {
    duration: 650,
    easing: 'ease-out',
    fill: 'forwards'
  }).onfinish = () => {
    setTimeout(onCracked, 350);
  };
}

function spawnImpactParticles(x, y) {
  const container = document.getElementById('impactDust');
  if (!container) return;
  container.innerHTML = '';

  // Tiny leaves and dust clouds
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = i % 2 === 0 ? 'particle-dust' : 'particle-leaf';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = (Math.PI * 2 * i) / 14 + (Math.random() * 0.4 - 0.2);
    const speed = 40 + Math.random() * 90;
    const vx = Math.cos(angle) * speed;
    const vy = (Math.sin(angle) * speed * 0.6) - 30; // shoot upward

    p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
      { transform: `translate(${vx}px, ${vy}px) scale(${0.3 + Math.random() * 0.5}) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: 600 + Math.random() * 400,
      easing: 'ease-out',
      fill: 'forwards'
    });

    container.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
}

function handleCoconutCracking(x, y, onRevealed) {
  const fallingCoconut = document.getElementById('fallingCoconut');
  const crackContainer = document.getElementById('coconutCracked');
  const scene = document.getElementById('coconutScene');

  fallingCoconut.style.opacity = '0';

  crackContainer.style.display = 'block';
  crackContainer.style.left = `${x - 10}px`;
  crackContainer.style.top = `${y - 10}px`;

  // Sound: Wood snap & crack
  AudioManager.play('crack');

  // Trigger confetti & sparkles from coconut
  confettiBurst(75);

  const shellLeft = crackContainer.querySelector('.shell-left');
  const shellRight = crackContainer.querySelector('.shell-right');
  const crackFlash = crackContainer.querySelector('.crack-flash');

  if (crackFlash) {
    crackFlash.animate([
      { transform: 'scale(0.1)', opacity: 1 },
      { transform: 'scale(3.5)', opacity: 0 }
    ], { duration: 500, easing: 'ease-out' });
  }

  if (shellLeft && shellRight) {
    shellLeft.animate([
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: 'translate(-55px, -15px) rotate(-35deg)', opacity: 0.95 },
      { transform: 'translate(-95px, 8px) rotate(-70deg)', opacity: 0.8 }
    ], { duration: 800, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' });

    shellRight.animate([
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: 'translate(55px, -15px) rotate(35deg)', opacity: 0.95 },
      { transform: 'translate(95px, 8px) rotate(70deg)', opacity: 0.8 }
    ], { duration: 800, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' });
  }

  setTimeout(onRevealed, 600);
}

function revealImageSurprise(onSurpriseReady) {
  const surpriseCard = document.getElementById('openingSurprise');
  if (!surpriseCard) return;

  surpriseCard.classList.add('visible');
  surpriseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  AudioManager.play('celebration');
  confettiBurst(120);

  if (onSurpriseReady) onSurpriseReady();
}

function resetOpeningScene() {
  const heroCoconut = document.getElementById('heroCoconut');
  const fallingCoconut = document.getElementById('fallingCoconut');
  const crackContainer = document.getElementById('coconutCracked');
  const surpriseCard = document.getElementById('openingSurprise');
  const startBtn = document.getElementById('startAdventureBtn');

  if (heroCoconut) {
    heroCoconut.classList.remove('wobble-selected');
    heroCoconut.style.opacity = '1';
  }
  if (fallingCoconut) {
    fallingCoconut.getAnimations().forEach(a => a.cancel());
    fallingCoconut.style.display = 'none';
    fallingCoconut.style.opacity = '0';
  }
  if (crackContainer) {
    crackContainer.style.display = 'none';
  }
  if (surpriseCard) {
    surpriseCard.classList.remove('visible');
  }
  if (startBtn) {
    startBtn.style.pointerEvents = 'auto';
    startBtn.style.opacity = '1';
    startBtn.style.transform = 'scale(1)';
  }
}
