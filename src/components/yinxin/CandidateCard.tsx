import { Pause, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import type { YinxinCandidate } from '../../types/yinxin';
import { CoverArt } from './CoverArt';

export function CandidateCard({
  candidate,
  rank,
  onSelect,
}: {
  candidate: YinxinCandidate;
  rank?: number;
  onSelect: () => void;
}) {
  const player = usePlayer();
  const playerId = `candidate-${candidate.candidateId}`;
  const playing = player.activeId === playerId && player.state === 'playing';
  // 歌词截断约 22 字
  const lyricText = candidate.primaryLyric.text;

  return (
    <article className="candidate-card" onClick={onSelect}>

      {/* ── 左侧封面（正方形 1:1） ── */}
      <div className="candidate-card__cover">
        <CoverArt index={candidate.song.coverIndex} />

        {rank !== undefined && (
          <span className="candidate-card__rank">{rank}</span>
        )}

        {/* 封面底部渐变遮罩 + 歌名 + 迷你播放 */}
        <div className="candidate-card__cover-overlay">
          <span className="candidate-card__cover-title">{candidate.song.title}</span>
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
            <span className="emotion-tag">{candidate.emotionLabel}</span>
          )}
        </div>

        {/* 第二行：歌手 · 专辑 */}
        <p className="candidate-card__artist">
          {candidate.song.artist} · {candidate.song.album}
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
            <span>00:30</span>
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
