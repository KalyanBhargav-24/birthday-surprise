// Web Audio API Synthesizer + Fallback MP3 Player
const AudioManager = (() => {
  let enabled = false;
  let audioCtx = null;
  let bgMusicOscs = [];
  let isPlayingMusic = false;

  const mp3s = {
    fall: new Audio('assets/audio/fall.mp3'),
    crack: new Audio('assets/audio/crack.mp3'),
    celebration: new Audio('assets/audio/celebration.mp3'),
    gift: new Audio('assets/audio/gift.mp3'),
    music: new Audio('assets/audio/birthday-music.mp3')
  };

  if (mp3s.music) {
    mp3s.music.loop = true;
    mp3s.music.volume = 0.35;
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Synthesized Sound Effects
  function synthSwoosh() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.65);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  function synthThud() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sub bass impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);

    // Noise click for contact
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    noise.connect(filter);
    filter.connect(ctx.destination);
    noise.start(now);
  }

  function synthCrack() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sharp wooden crack snap
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3.5, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, now);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Resonant woody split tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  function synthCelebration() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.6);
    });
  }

  function synthBlowCandle() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(250, now + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  function synthChime() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [784, 988, 1175, 1568];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      gain.gain.setValueAtTime(0.12, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.75);
    });
  }

  function play(name) {
    if (!enabled) return;
    getAudioContext();

    // Check if MP3 exists and is playable
    if (mp3s[name] && mp3s[name].readyState >= 2) {
      try {
        mp3s[name].currentTime = 0;
        mp3s[name].play().catch(() => playSynthFallback(name));
        return;
      } catch (_) {}
    }
    playSynthFallback(name);
  }

  function playSynthFallback(name) {
    switch (name) {
      case 'fall':
        synthSwoosh();
        break;
      case 'thud':
        synthThud();
        break;
      case 'crack':
        synthCrack();
        break;
      case 'celebration':
        synthCelebration();
        break;
      case 'candle':
        synthBlowCandle();
        break;
      case 'chime':
      case 'gift':
        synthChime();
        break;
      default:
        synthChime();
    }
  }

  // Gentle Ambient Melodic Arpeggio Loop for background celebration
  let melodyTimer = null;
  const melodyNotes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy Birthday phrase 1
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // phrase 2
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66 // phrase 3
  ];
  let noteIndex = 0;

  function startAmbientMusic() {
    if (isPlayingMusic) return;
    isPlayingMusic = true;

    // If MP3 music is available, use it
    if (mp3s.music && mp3s.music.readyState >= 2) {
      mp3s.music.play().catch(() => runSynthMelodyLoop());
    } else {
      runSynthMelodyLoop();
    }
  }

  function runSynthMelodyLoop() {
    if (!enabled || !isPlayingMusic) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const note = melodyNotes[noteIndex % melodyNotes.length];
    noteIndex++;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);

    // Warm, soft volume
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);

    const tempoDelay = [4, 5, 10, 11, 16, 17].includes(noteIndex % 18) ? 620 : 380;
    melodyTimer = setTimeout(runSynthMelodyLoop, tempoDelay);
  }

  function stopAmbientMusic() {
    isPlayingMusic = false;
    if (melodyTimer) {
      clearTimeout(melodyTimer);
      melodyTimer = null;
    }
    if (mp3s.music) {
      mp3s.music.pause();
    }
  }

  function toggle() {
    enabled = !enabled;
    const ctx = getAudioContext();
    if (enabled) {
      if (ctx && ctx.state === 'suspended') ctx.resume();
      startAmbientMusic();
      synthChime();
    } else {
      stopAmbientMusic();
    }
    return enabled;
  }

  function enable() {
    if (!enabled) {
      toggle();
    }
  }

  return {
    play,
    toggle,
    enable,
    isEnabled: () => enabled,
    getAudioContext
  };
})();
