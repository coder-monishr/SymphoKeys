'use client';

import { cn } from '@/lib/utils';
import { KEY_ROWS } from '@/lib/music';

type KeyboardProps = {
  activeKeys: Set<string>;
  noteMap: Record<string, string>;
};

const Key = ({
  char,
  note,
  isActive,
}: {
  char: string;
  note: string;
  isActive: boolean;
}) => {
  return (
    <div
      data-active={isActive}
      className={cn(
        'flex h-24 w-24 select-none items-end justify-start rounded-md border border-primary/20 bg-secondary/30 p-2 text-accent shadow-inner transition-all duration-75',
        'data-[active=true]:scale-105 data-[active=true]:bg-primary/50 data-[active=true]:shadow-primary/50 data-[active=true]:shadow-[0_0_1.5rem] data-[active=true]:border-primary'
      )}
    >
      <div className="flex flex-col">
        <span className="text-2xl font-bold uppercase text-primary-foreground/90">{char}</span>
        <span className="text-xs text-accent/80">{note}</span>
      </div>
    </div>
  );
};

export function Keyboard({ activeKeys, noteMap }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {KEY_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap justify-center gap-2">
          {row.map((key) => (
            <Key
              key={key}
              char={key}
              note={noteMap[key] || ''}
              isActive={activeKeys.has(key)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
