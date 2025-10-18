'use client';
import * as Tone from 'tone';

type Instrument = "synth" | "piano" | "strings";

export class SoundEngine {
  private synth: Tone.PolySynth | null = null;
  private isStarted = false;

  constructor() {
    // We will initialize in a method that is called by user interaction
  }

  private async startContext() {
    if (!this.isStarted && Tone.context.state !== 'running') {
      await Tone.start();
      this.isStarted = true;
    }
  }

  private createSynth(instrument: Instrument): Tone.PolySynth {
    if (this.synth) {
      this.synth.dispose();
    }
    
    let newSynth;
    switch (instrument) {
      case "piano":
        newSynth = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 8,
          modulationIndex: 2,
          envelope: {
            attack: 0.01,
            decay: 0.5,
            sustain: 0.1,
            release: 1,
          },
        }).toDestination();
        break;
      case "strings":
        newSynth = new Tone.PolySynth(Tone.AMSynth, {
          envelope: {
            attack: 0.2,
            decay: 0.1,
            sustain: 0.8,
            release: 1.5,
          },
        }).toDestination();
        break;
      case "synth":
      default:
        newSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "fatsawtooth" },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.6,
            release: 0.8,
          },
        }).toDestination();
        break;
    }
    const reverb = new Tone.Reverb(1.5).toDestination();
    newSynth.connect(reverb);
    return newSynth;
  }

  public setInstrument(instrument: Instrument) {
    this.synth = this.createSynth(instrument);
  }

  public async playNote(note: string, key?: string) {
    await this.startContext();
    if (this.synth) {
      this.synth.triggerAttack(note, Tone.now());
    }
  }

  public stopNote(note: string, key?: string) {
    if (this.synth) {
      this.synth.triggerRelease(note, Tone.now());
    }
  }

  public stopAll() {
    if (this.synth) {
      this.synth.releaseAll();
    }
  }
}
