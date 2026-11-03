/**
 * Generative ambient soundscape using Web Audio API.
 * Synthesizes warm, meditative harmonic frequencies with gentle low-pass filters.
 * No external audio files or network requests required.
 */
class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private intervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start(volume: number = 0.25) {
    if (this.isPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), this.ctx.currentTime + 3);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      this.masterGain.connect(this.filter);
      this.filter.connect(this.ctx.destination);

      // Warm harmonic roots (C2, G2, C3, E3, G3 - warm resting chords)
      const frequencies = [65.41, 98.00, 130.81, 164.81, 196.00];

      this.oscillators = frequencies.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        // Subtle detune for organic acoustic warmth
        osc.detune.setValueAtTime((idx - 2) * 4, this.ctx!.currentTime);

        const individualGain = 0.18 / (idx + 1);
        oscGain.gain.setValueAtTime(individualGain, this.ctx!.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);
        osc.start();
        return osc;
      });

      this.isPlaying = true;

      // Slow gentle LFO filter modulation (breathing effect)
      let phase = 0;
      this.intervalId = window.setInterval(() => {
        if (!this.filter || !this.ctx) return;
        phase += 0.05;
        const targetFreq = 340 + Math.sin(phase) * 80;
        this.filter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 1.2);
      }, 500);
    } catch (e) {
      console.warn('AudioContext playback restricted by user gesture or browser policy', e);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 1.5);
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 1600);
    } else {
      this.isPlaying = false;
    }
  }

  setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0.001, volume), this.ctx.currentTime, 0.1);
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientSoundEngine();
