/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Sound & music engine for Purrfect Haven using the real MP3 audio recordings:
 * - Rain Ambience: /assets/aistudio/gingerleegalaxy_1-raining-on-multiple-surfaces-mix-231892_15ae2c83.mp3
 * - Fireplace Ambience: /assets/aistudio/king_of_the_christmas-fireplace-loop-original-noise-178209_5b1bfdf0.mp3
 * - Cat Purr: /assets/aistudio/freesound_community-cat-purr-33835_0610f898.mp3
 * - Cute Cat Meow: /assets/aistudio/dragon-studio-cute-cat-meow-472372_efddb3d0.mp3
 * - Cat Meow: /assets/aistudio/dragon-studio-cat-meow-401729_1afdaec4.mp3
 */

const AUDIO_PATHS = {
  rain: '/assets/aistudio/gingerleegalaxy_1-raining-on-multiple-surfaces-mix-231892_15ae2c83.mp3',
  fireplace: '/assets/aistudio/king_of_the_christmas-fireplace-loop-original-noise-178209_5b1bfdf0.mp3',
  catPurr: '/assets/aistudio/freesound_community-cat-purr-33835_0610f898.mp3',
  cuteMeow: '/assets/aistudio/dragon-studio-cute-cat-meow-472372_efddb3d0.mp3',
  catMeow: '/assets/aistudio/dragon-studio-cat-meow-401729_1afdaec4.mp3',
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Real MP3 Audio Elements
  private rainAudio: HTMLAudioElement | null = null;
  private fireplaceAudio: HTMLAudioElement | null = null;
  private purrAudio: HTMLAudioElement | null = null;
  private cuteMeowAudio: HTMLAudioElement | null = null;
  private catMeowAudio: HTMLAudioElement | null = null;

  public sfxEnabled = true;
  public musicEnabled = true;
  public ambientType: 'none' | 'rain' | 'fireplace' = 'rain';
  public volume = 0.8;
  public ambientVolume = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElements();
    }
  }

  private initAudioElements() {
    try {
      this.rainAudio = new Audio(AUDIO_PATHS.rain);
      this.rainAudio.loop = true;
      this.rainAudio.preload = 'auto';

      this.fireplaceAudio = new Audio(AUDIO_PATHS.fireplace);
      this.fireplaceAudio.loop = true;
      this.fireplaceAudio.preload = 'auto';

      this.purrAudio = new Audio(AUDIO_PATHS.catPurr);
      this.purrAudio.preload = 'auto';

      this.cuteMeowAudio = new Audio(AUDIO_PATHS.cuteMeow);
      this.cuteMeowAudio.preload = 'auto';

      this.catMeowAudio = new Audio(AUDIO_PATHS.catMeow);
      this.catMeowAudio.preload = 'auto';

      this.updateVolumes();
    } catch {
      // Audio element creation error fallback
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private updateVolumes() {
    const ambVol = Math.max(0, Math.min(1, this.volume * this.ambientVolume));
    const sfxVol = Math.max(0, Math.min(1, this.volume * (this.sfxEnabled ? 0.85 : 0)));

    if (this.rainAudio) {
      this.rainAudio.volume = ambVol;
    }
    if (this.fireplaceAudio) {
      this.fireplaceAudio.volume = ambVol;
    }
    if (this.purrAudio) {
      this.purrAudio.volume = sfxVol;
    }
    if (this.cuteMeowAudio) {
      this.cuteMeowAudio.volume = sfxVol;
    }
    if (this.catMeowAudio) {
      this.catMeowAudio.volume = sfxVol;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setMasterVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    this.updateVolumes();
  }

  public setAmbientVolume(v: number) {
    this.ambientVolume = Math.max(0, Math.min(1, v));
    this.updateVolumes();
  }

  // ==========================================
  // REAL MP3 CAT AUDIO (Meows & Purr)
  // ==========================================

  /** Real cat purr MP3 for petting and swiping */
  public playPurr(_duration?: number) {
    if (!this.sfxEnabled) return;
    try {
      if (this.purrAudio) {
        this.purrAudio.currentTime = 0;
        this.purrAudio.play().catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  /** Real cute kitten meow MP3 for gentle petting */
  public playCuteMeow() {
    if (!this.sfxEnabled) return;
    try {
      if (this.cuteMeowAudio) {
        this.cuteMeowAudio.currentTime = 0;
        this.cuteMeowAudio.play().catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  /** Real cat meow MP3 for feeding and idle */
  public playCatMeow() {
    if (!this.sfxEnabled) return;
    try {
      if (this.catMeowAudio) {
        this.catMeowAudio.currentTime = 0;
        this.catMeowAudio.play().catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  /** Combined meow trigger (alternates cute and classic meows) */
  public playMeow(pitch = 1.0) {
    if (pitch > 1.1) {
      this.playCuteMeow();
    } else {
      this.playCatMeow();
    }
  }

  /** Trill meow alias */
  public playTrillMeow() {
    this.playCuteMeow();
  }

  /** Kitten chirp */
  public playKittenChirp() {
    this.playCuteMeow();
  }

  /** Triggered on petting / swiping across the cat */
  public playCutePetSound() {
    if (!this.sfxEnabled) return;
    const r = Math.random();
    if (r < 0.5) {
      this.playPurr();
    } else {
      this.playCuteMeow();
    }
  }

  /** Triggered on feeding */
  public playFeedSound() {
    this.playFeedMunch();
    this.playCatMeow();
  }

  /** Periodic idle cat voice */
  public playIdleCatSound() {
    if (!this.sfxEnabled) return;
    if (Math.random() < 0.5) {
      this.playCuteMeow();
    } else {
      this.playPurr();
    }
  }

  // ==========================================
  // REAL MP3 AMBIENCE (Rain & Fireplace Loops)
  // ==========================================

  public setAmbient(type: 'none' | 'rain' | 'fireplace') {
    this.ambientType = type;
    this.updateVolumes();

    // Pause all ambient loops first
    try {
      if (this.rainAudio) {
        this.rainAudio.pause();
        this.rainAudio.currentTime = 0;
      }
      if (this.fireplaceAudio) {
        this.fireplaceAudio.pause();
        this.fireplaceAudio.currentTime = 0;
      }
    } catch {
      // ignore
    }

    if (type === 'rain' && this.rainAudio) {
      this.rainAudio.play().catch(() => {});
    } else if (type === 'fireplace' && this.fireplaceAudio) {
      this.fireplaceAudio.play().catch(() => {});
    }
  }

  // ==========================================
  // GAMEPLAY JINGLES (Chimes, Harps, Hatch)
  // ==========================================

  public playEggCrack() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.07);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playPetChime(freqIndex = 0) {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const note = notes[freqIndex % notes.length];
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.7);
  }

  public playFeedMunch() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    [0, 0.1, 0.22].forEach((delay, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const ot = t + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 + idx * 50, ot);
      osc.frequency.exponentialRampToValueAtTime(260, ot + 0.07);

      gain.gain.setValueAtTime(0.001, ot);
      gain.gain.linearRampToValueAtTime(0.2, ot + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ot + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(ot);
      osc.stop(ot + 0.09);
    });
  }

  public playCoinSound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, t);
    osc1.frequency.setValueAtTime(1318.51, t + 0.08);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1975.53, t + 0.08);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.setValueAtTime(0.22, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.75);
    osc2.stop(t + 0.75);
  }

  public playPlantSound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.1);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playWaterSound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.2);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  public playHarvestSound() {
    this.playCoinSound();
    this.playPetChime(3);
  }

  public playKittenHatch() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.9);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.95);
    });
  }

  // ==========================================
  // BACKGROUND LULLABY
  // ==========================================

  public startBackgroundMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;

    const chords: number[][] = [
      [174.61, 261.63, 329.63, 392.0, 523.25],
      [130.81, 196.0, 246.94, 329.63, 392.0],
      [110.0, 220.0, 261.63, 329.63, 440.0],
      [146.83, 196.0, 293.66, 392.0, 493.88],
    ];

    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || !this.musicEnabled) return;

      const t = this.ctx.currentTime;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGain) return;
        const noteTime = t + idx * 0.22;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, noteTime);
        filter.frequency.exponentialRampToValueAtTime(420, noteTime + 3.8);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 4.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(noteTime);
        osc.stop(noteTime + 4.3);
      });
    };

    playChordStep();
    this.musicInterval = window.setInterval(playChordStep, 4500);
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  public playPaperSound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.linearRampToValueAtTime(900, now + 0.18);
      filter.Q.value = 1.4;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
    } catch {
      // fallback
    }
  }

  public playMemoryChime() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.3);
      });
    } catch {
      // fallback
    }
  }
}

export const sound = new SoundEngine();
