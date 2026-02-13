// ── Audio Manager ────────────────────────────────────────────────────────────
// Web Audio API based sound system with pentatonic merge sounds.

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not available');
      this.enabled = false;
    }
  }

  // Ensure audio context is resumed (needs user gesture on mobile).
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pentatonic scale notes (C major pentatonic): C, D, E, G, A
  // Frequencies for octave 5
  _pentatonicFreq(index) {
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    return notes[Math.min(index, notes.length - 1)];
  }

  // Play a merge sound. Tier determines pitch, chainStep adds ascending effect.
  playMerge(tier = 1, chainStep = 0) {
    if (!this.enabled || !this.ctx) return;
    const noteIndex = Math.min(tier - 1 + chainStep, 7);
    const freq = this._pentatonicFreq(noteIndex);
    this._playTone(freq, 'triangle', 0.15, 0.3);
  }

  // Play tile placement sound (soft click).
  playPlace() {
    if (!this.enabled || !this.ctx) return;
    this._playNoise(0.03, 0.08);
  }

  // Play life burst chime.
  playLifeBurst(rarity = 'common') {
    if (!this.enabled || !this.ctx) return;
    const baseFreq = rarity === 'legendary' ? 1046.50 : rarity === 'rare' ? 880 : 783.99;
    // Quick arpeggio
    this._playTone(baseFreq, 'sine', 0.12, 0.2, 0);
    this._playTone(baseFreq * 1.25, 'sine', 0.10, 0.2, 0.1);
    this._playTone(baseFreq * 1.5, 'sine', 0.08, 0.3, 0.2);
  }

  // Play win jingle (ascending 4-note phrase).
  playWin() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      this._playTone(freq, 'triangle', 0.15, 0.4, i * 0.15);
    });
  }

  // Play loss sound (gentle descending).
  playLoss() {
    if (!this.enabled || !this.ctx) return;
    const notes = [659.25, 523.25, 440, 392];
    notes.forEach((freq, i) => {
      this._playTone(freq, 'sine', 0.08, 0.3, i * 0.2);
    });
  }

  // Play undo sound.
  playUndo() {
    if (!this.enabled || !this.ctx) return;
    this._playTone(440, 'sine', 0.08, 0.15);
    this._playTone(392, 'sine', 0.06, 0.15, 0.08);
  }

  // Play UI tap.
  playTap() {
    if (!this.enabled || !this.ctx) return;
    this._playTone(800, 'square', 0.03, 0.05);
  }

  // Internal: play a tone with given frequency, waveform, volume, duration, delay.
  _playTone(freq, type = 'triangle', volume = 0.1, duration = 0.2, delay = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  // Internal: play a short noise burst (for clicks).
  _playNoise(volume = 0.05, duration = 0.05) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume * (1 - i / bufferSize);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    source.connect(filter);
    filter.connect(this.ctx.destination);
    source.start();
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
