import type { LyricSegment, SongInfo, YinxinMessageType } from '../../types/yinxin';
import { CoverArt } from './CoverArt';

function formatLyricForCard(rawLyric: string) {
  const source = rawLyric.trim();
  if (!source) return source;

  const lineByBreak = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lineByBreak.length >= 2) {
    return `${lineByBreak[0]}\n${lineByBreak[1]}`;
  }

  const segments = source
    .split(/[，。！？!?；;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length >= 2) {
    return `${segments[0]}\n${segments[1]}`;
  }

  if (source.length >= 8) {
    const splitIndex = Math.ceil(source.length * 0.58);
    return `${source.slice(0, splitIndex)}\n${source.slice(splitIndex)}`;
  }

  return source;
}

interface ReceivedYinxinCardProps {
  song: SongInfo;
  lyric: LyricSegment;
  messageType?: YinxinMessageType;
  message?: string;
  voiceDuration?: number;
  hideMessageInLyric?: boolean;
  senderLabel?: string;
  className?: string;
}

export function ReceivedYinxinCard({
  song,
  lyric,
  messageType = 'text',
  message = '',
  voiceDuration = 30,
  hideMessageInLyric = false,
  senderLabel = '微信用户',
  className = '',
}: ReceivedYinxinCardProps) {
  const isVoiceMessage = messageType === 'voice';
  const lyricText = formatLyricForCard(lyric.text);
  const rootClassName = `packing-card ${isVoiceMessage ? 'packing-card--voice' : 'packing-card--text'} ${className}`.trim();

  return (
    <div className={rootClassName}>
      <div className="packing-card__head">
        <div className="packing-card__cover">
          <CoverArt index={song.coverIndex} src={song.coverUrl} className="cover-art" />
        </div>
        <div className="packing-card__info">
          <b>{song.title}</b>
          <small>{song.artist}</small>
          <p className="packing-card__lyric">
            <i>"</i>{lyricText}<i>"</i>
          </p>
        </div>
      </div>
      <span className="packing-card__divider" />
      {hideMessageInLyric ? null : isVoiceMessage ? (
        <div className="packing-card__voice-player" aria-label="语音留言播放器">
          <button type="button" className="packing-card__voice-play" aria-label="播放语音留言">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden>
              <path d="M0 0L8 5L0 10V0Z" fill="#21C879" />
            </svg>
          </button>
          <span className="packing-card__voice-track" aria-hidden>
            <span />
          </span>
          <small>00:{String(voiceDuration).padStart(2, '0')}</small>
        </div>
      ) : (
        <p className="packing-card__user-message">{message}</p>
      )}
      <small className="packing-card__from">from {senderLabel}</small>
    </div>
  );
}
