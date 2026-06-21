import type { CardStyle, SongInfo, LyricSegment } from '../../types/yinxin';
import { CoverArt } from './CoverArt';
import { MockAudioPlayer } from './MockAudioPlayer';

export function YinxinMusicCard({
  song,
  lyric,
  message,
  style = 'midnight',
  interactive = true,
  className = '',
}: {
  song: SongInfo;
  lyric: LyricSegment;
  message: string;
  style?: CardStyle;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <article className={`music-letter music-letter--${style} ${className}`}>
      <div className="music-letter__halo" />
      <CoverArt index={song.coverIndex} className="music-letter__cover" />
      <div className="music-letter__content">
        <p className="music-letter__lyric">“{lyric.text}”</p>
        <div className="music-letter__song">
          <strong>{song.title}</strong>
          <span>{song.artist}</span>
        </div>
        {interactive ? <MockAudioPlayer id={`${song.songId}-${lyric.segmentId}`} compact /> : null}
        <p className="music-letter__message">{message}</p>
        <small className="music-letter__from">From 音信</small>
      </div>
    </article>
  );
}
