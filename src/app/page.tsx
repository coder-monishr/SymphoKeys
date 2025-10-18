'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Keyboard } from '@/components/keyboard';
import { Controls } from '@/components/controls';
import { SoundEngine } from '@/lib/sound';
import { getNotesForScale, KEYBOARD_MAP } from '@/lib/music';

export default function Home() {
  const [instrument, setInstrument] = useState('synth');
  const [scale, setScale] = useState('major_pentatonic');
  const [activeKeys, setActiveKeys] = useState(new Set<string>());
  const soundEngineRef = useRef<SoundEngine | null>(null);

  useEffect(() => {
    soundEngineRef.current = new SoundEngine();
    soundEngineRef.current.setInstrument(instrument as any);
  }, []);

  useEffect(() => {
    if (soundEngineRef.current) {
      soundEngineRef.current.setInstrument(instrument as any);
    }
  }, [instrument]);

  const noteMap = useMemo(() => {
    const notes = getNotesForScale(scale, 'C', 3, Object.keys(KEYBOARD_MAP).length);
    const mapping: Record<string, string> = {};
    Object.entries(KEYBOARD_MAP).forEach(([key, index]) => {
      mapping[key] = notes[index];
    });
    return mapping;
  }, [scale]);

  const playNote = useCallback((key: string) => {
    if (noteMap[key] && !activeKeys.has(key) && soundEngineRef.current) {
        soundEngineRef.current.playNote(noteMap[key], key);
        setActiveKeys((prev) => new Set(prev).add(key));
    }
  }, [activeKeys, noteMap]);

  const stopNote = useCallback((key: string) => {
      if (noteMap[key] && soundEngineRef.current) {
        soundEngineRef.current.stopNote(noteMap[key], key);
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
  }, [noteMap]);


  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent default if it's a key we're handling, unless inside an input/textarea
      const target = event.target as HTMLElement;
      if (noteMap[event.key.toLowerCase()] && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      }
      playNote(event.key.toLowerCase());
    },
    [playNote, noteMap]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      stopNote(event.key.toLowerCase());
    },
    [stopNote]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      soundEngineRef.current?.stopAll();
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-8 bg-background relative">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-primary">SymphoKeys</h1>
        <p className="mt-2 text-accent">Use your keyboard to play music. Try changing the instrument and scale!</p>
      </div>
      <Keyboard activeKeys={activeKeys} noteMap={noteMap} />
      <Controls
        instrument={instrument}
        setInstrument={setInstrument}
        scale={scale}
        setScale={setScale}
        playNote={playNote}
        stopNote={stopNote}
      />
    </main>
  );
}
