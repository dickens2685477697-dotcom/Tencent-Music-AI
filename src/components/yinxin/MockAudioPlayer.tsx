import { Pause, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export function MockAudioPlayer({ id, compact = false, label = '播放关键片段' }: { id: string; compact?: boolean; label?: string }) {
  const player = usePlayer();
  const active = player.activeId === id;
  const playing = active && player.state === 'playing';
  const progress = active ? player.progress : 0;
  return (
    <div className={`mock-player ${compact ? 'mock-player--compact' : ''}`}>
      <button type="button" className="player-button" onClick={() => player.toggle(id)} aria-label={playing ? '暂停' : label}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <div className="progress-track" aria-label={`播放进度 ${Math.round(progress)}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {compact ? <small>{playing ? '00:18' : '00:30'}</small> : <span>{playing ? '正在播放关键歌词' : label}</span>}
    </div>
  );
}
