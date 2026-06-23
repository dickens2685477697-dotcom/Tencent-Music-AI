import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type PlayerState = 'idle' | 'playing' | 'paused' | 'ended';

interface PlayerContextValue {
  activeId?: string;
  state: PlayerState;
  progress: number;
  toggle: (id: string) => void;
  reset: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string>();
  const [state, setState] = useState<PlayerState>('idle');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearInterval(intervalRef.current);
    if (state !== 'playing') return;
    intervalRef.current = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 100 / 150;
        if (next >= 100) {
          window.clearInterval(intervalRef.current);
          setState('ended');
          return 100;
        }
        return next;
      });
    }, 200);
    return () => window.clearInterval(intervalRef.current);
  }, [state, activeId]);

  const toggle = useCallback((id: string) => {
    if (activeId !== id) {
      setActiveId(id);
      setProgress(0);
      setState('playing');
      return;
    }
    if (state === 'ended') {
      setProgress(0);
      setState('playing');
      return;
    }
    setState(state === 'playing' ? 'paused' : 'playing');
  }, [activeId, state]);

  const reset = useCallback(() => {
    setActiveId(undefined);
    setProgress(0);
    setState('idle');
  }, []);

  const value = useMemo(() => ({ activeId, state, progress, toggle, reset }), [activeId, state, progress, toggle, reset]);
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider');
  return context;
}
