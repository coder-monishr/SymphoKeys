export const INSTRUMENTS = [
  { value: "synth", label: "Synth" },
  { value: "piano", label: "Piano" },
  { value: "strings", label: "Strings" },
];

export const SCALES = [
  { value: "major", label: "Major" },
  { value: "natural_minor", label: "Natural Minor" },
  { value: "major_pentatonic", label: "Major Pentatonic" },
  { value: "minor_pentatonic", label: "Minor Pentatonic" },
  { value: "chromatic", label: "Chromatic" },
];

export const KEYBOARD_MAP: { [key: string]: number } = {
  '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9,
  q: 10, w: 11, e: 12, r: 13, t: 14, y: 15, u: 16, i: 17, o: 18, p: 19,
  a: 20, s: 21, d: 22, f: 23, g: 24, h: 25, j: 26, k: 27, l: 28,
  z: 29, x: 30, c: 31, v: 32, b: 33, n: 34, m: 35,
};

export const KEY_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const scaleIntervals: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  natural_minor: [0, 2, 3, 5, 7, 8, 10],
  major_pentatonic: [0, 2, 4, 7, 9],
  minor_pentatonic: [0, 3, 5, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export function getNotesForScale(scale: string, rootNote: string = 'C', startOctave: number = 3, count: number): string[] {
  const rootIndex = notes.indexOf(rootNote.toUpperCase());
  if (rootIndex === -1) return [];

  const intervals = scaleIntervals[scale] || scaleIntervals.chromatic;
  const resultNotes: string[] = [];
  let currentNoteIndex = 0;

  while(resultNotes.length < count) {
    const interval = intervals[currentNoteIndex % intervals.length];
    const octaveOffset = Math.floor(currentNoteIndex / intervals.length);

    const noteIndex = (rootIndex + interval) % 12;
    const finalOctave = startOctave + octaveOffset;
    
    resultNotes.push(`${notes[noteIndex]}${finalOctave}`);
    currentNoteIndex++;
  }
  return resultNotes;
}
