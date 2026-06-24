import { Pause, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

function formatDuration(durationSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(durationSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function MockAudioPlayer({
  id,
  compact = false,
  label = '播放关键片段',
  durationSeconds = 30,
}: {
  id: string;
  compact?: boolean;
  label?: string;
  durationSeconds?: number;
}) {
  const player = usePlayer();
  const active = player.activeId === id;
  const playing = active && player.state === 'playing';
  const progress = active ? player.progress : 0;
  const durationText = formatDuration(durationSeconds);
  return (
    <div className={`mock-player ${compact ? 'mock-player--compact' : ''}`}>
      <button type="button" className="player-button" onClick={() => player.toggle(id)} aria-label={playing ? '暂停' : label}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <div className="progress-track" aria-label={`播放进度 ${Math.round(progress)}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {compact ? <small>{durationText}</small> : <span>{playing ? '正在播放关键歌词' : label}</span>}
    </div>
  );
}
