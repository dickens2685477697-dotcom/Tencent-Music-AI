import { Pause, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { resolveSongInfo } from '../../data/songs/songCatalog';
import type { YinxinCandidate } from '../../types/yinxin';
import { CoverArt } from './CoverArt';

function formatDuration(durationSeconds?: number) {
  const safeSeconds = Math.max(0, durationSeconds ?? 0);
  if (safeSeconds <= 0) return '00:30';
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function CandidateCard({
  candidate,
  onSelect,
}: {
  candidate: YinxinCandidate;
  onSelect: () => void;
}) {
  const player = usePlayer();
  const playerId = `candidate-${candidate.candidateId}`;
  const playing = player.activeId === playerId && player.state === 'playing';
  const resolvedSong = resolveSongInfo(candidate.song);
  // 歌词截断约 22 字
  const lyricText = candidate.primaryLyric.text;
  const primaryEmotionTag = candidate.emotionLabel.split('/').map((part) => part.trim()).filter(Boolean)[0] ?? candidate.emotionLabel;
  const songDuration = formatDuration(resolvedSong.durationSeconds);

  return (
    <article className="candidate-card" onClick={onSelect}>

      {/* ── 左侧封面（正方形 1:1） ── */}
      <div className="candidate-card__cover">
        <CoverArt index={candidate.song.coverIndex} src={candidate.song.coverUrl} />

        {/* 封面底部渐变遮罩 + 歌名 + 迷你播放 */}
        <div className="candidate-card__cover-overlay">
          <span className="candidate-card__mini-play" aria-hidden>
            {playing ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
          </span>
        </div>
      </div>

      {/* ── 右侧内容区 ── */}
      <div className="candidate-card__body">

        {/* 第一行：歌名 + 情绪标签 */}
        <div className="candidate-card__head">
          <strong className="candidate-card__name">{candidate.song.title}</strong>
          {candidate.emotionLabel && (
            <span className="emotion-tag">{primaryEmotionTag}</span>
          )}
        </div>

        {/* 第二行：歌手 */}
        <p className="candidate-card__artist">
          {candidate.song.artist}
        </p>

        {/* 歌词引用 */}
        <div className="candidate-card__lyric">
          <span className="cq-open">"</span>
          {lyricText}
          <span className="cq-close">"</span>
        </div>

        {/* 底部操作行 */}
        <div className="candidate-card__foot">
          <div className="candidate-card__meta">
            {/* 小信封图标 */}
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
              <rect x=".5" y=".5" width="12" height="10" rx="1.5" stroke="#21C879" strokeWidth="1"/>
              <path d="M.5 2.5 6.5 6l6-3.5" stroke="#21C879" strokeWidth="1"/>
            </svg>
            <span>音信卡片</span>
            <span className="meta-divider">|</span>
            <span>{songDuration}</span>
          </div>
          <div className="candidate-card__actions">
            <button
              className="select-song"
              onClick={(e) => { e.stopPropagation(); player.toggle(playerId); }}
              aria-label={playing ? '暂停' : `播放${candidate.song.title}`}
            >
              {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
            </button>
            <button className="card-more" aria-label="更多" onClick={(e) => e.stopPropagation()}>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                <circle cx="2" cy="2" r="1.5" fill="#9aa0a6"/>
                <circle cx="8" cy="2" r="1.5" fill="#9aa0a6"/>
                <circle cx="14" cy="2" r="1.5" fill="#9aa0a6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
