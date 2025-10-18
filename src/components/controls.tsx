'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { INSTRUMENTS, SCALES } from '@/lib/music';
import { AIRecommender } from './ai-recommender';
import { Music, SlidersHorizontal } from 'lucide-react';

type ControlsProps = {
  instrument: string;
  setInstrument: (instrument: string) => void;
  scale: string;
  setScale: (scale: string) => void;
  playNote: (key: string) => void;
  stopNote: (key: string) => void;
};

export function Controls({
  instrument,
  setInstrument,
  scale,
  setScale,
  playNote,
  stopNote,
}: ControlsProps) {

  const handleApplyAiPreset = (aiInstrument: string, aiScale: string) => {
    const validInstrument = INSTRUMENTS.find(i => i.value === aiInstrument);
    const validScale = SCALES.find(s => s.value === aiScale);
    
    if (validInstrument) {
      setInstrument(validInstrument.value);
    }
    if (validScale) {
      setScale(validScale.value);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-6 rounded-lg border bg-card p-4 shadow-md md:gap-8">
      <div className="flex items-center gap-3">
        <Music className="h-5 w-5 text-primary" />
        <Label htmlFor="instrument-select" className="text-sm">Instrument</Label>
        <Select value={instrument} onValueChange={setInstrument}>
          <SelectTrigger id="instrument-select" className="w-[140px]">
            <SelectValue placeholder="Instrument" />
          </SelectTrigger>
          <SelectContent>
            {INSTRUMENTS.map((inst) => (
              <SelectItem key={inst.value} value={inst.value}>
                {inst.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <Label htmlFor="scale-select" className="text-sm">Scale</Label>
        <Select value={scale} onValueChange={setScale}>
          <SelectTrigger id="scale-select" className="w-[180px]">
            <SelectValue placeholder="Scale" />
          </SelectTrigger>
          <SelectContent>
            {SCALES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AIRecommender onApply={handleApplyAiPreset} playNote={playNote} stopNote={stopNote} />
    </div>
  );
}
