import type { CardStyle, SongInfo, LyricSegment, YinxinMessageType } from '../../types/yinxin';
import { resolveSongInfo } from '../../data/songs/songCatalog';
import { CoverArt } from './CoverArt';
import { MockAudioPlayer } from './MockAudioPlayer';

export function YinxinMusicCard({
  song,
  lyric,
  message,
  messageType = 'text',
  hideMessageInLyric = false,
  voiceDuration = 30,
  style = 'midnight',
  interactive = true,
  className = '',
}: {
  song: SongInfo;
  lyric: LyricSegment;
  message: string;
  messageType?: YinxinMessageType;
  hideMessageInLyric?: boolean;
  voiceDuration?: number;
  style?: CardStyle;
  interactive?: boolean;
  className?: string;
}) {
  const displaySong = resolveSongInfo(song);
  const voicePlayerId = `voice-${displaySong.songId}-${lyric.segmentId}`;
  const letterClassName = `music-letter music-letter--${style} ${hideMessageInLyric ? 'music-letter--concealed' : ''} ${className}`.trim();

  return (
    <article className={letterClassName}>
      <div className="music-letter__halo" />
      {hideMessageInLyric ? null : (
        <CoverArt index={displaySong.coverIndex} src={displaySong.coverUrl} className="music-letter__cover" />
      )}
      <div className="music-letter__content">
        {hideMessageInLyric ? (
          <div className="music-letter__concealed-wrap">
            <span className="music-letter__concealed-badge">藏在歌词中</span>
            <p className="music-letter__lyric">“{lyric.text}”</p>
            <div className="music-letter__concealed-song">
              <CoverArt index={displaySong.coverIndex} src={displaySong.coverUrl} className="music-letter__concealed-cover" />
              <div className="music-letter__song">
                <strong>{displaySong.title}</strong>
                <span>{displaySong.artist}</span>
              </div>
            </div>
            {interactive ? <MockAudioPlayer id={`${displaySong.songId}-${lyric.segmentId}`} compact /> : null}
            <small className="music-letter__from">From 音信</small>
          </div>
        ) : (
          <>
            <p className="music-letter__lyric">“{lyric.text}”</p>
            <div className="music-letter__song">
              <strong>{displaySong.title}</strong>
              <span>{displaySong.artist}</span>
            </div>
            {interactive ? <MockAudioPlayer id={`${displaySong.songId}-${lyric.segmentId}`} compact /> : null}
          </>
        )}
        {hideMessageInLyric ? null : messageType === 'voice' ? (
          <div className="music-letter__message music-letter__message--voice">
            <span>{voiceDuration} 秒语音留言</span>
            {interactive ? (
              <MockAudioPlayer id={voicePlayerId} compact label="播放语音留言" />
            ) : (
              <div className="mock-player mock-player--compact mock-player--static">
                <button type="button" className="player-button" aria-label="语音留言预览" disabled>
                  <span className="voice-dot" />
                </button>
                <div className="progress-track" aria-label="语音留言进度 0%">
                  <span style={{ width: '0%' }} />
                </div>
                <small>00:{voiceDuration}</small>
              </div>
            )}
          </div>
        ) : (
          <p className="music-letter__message">{message}</p>
        )}
        {hideMessageInLyric ? null : <small className="music-letter__from">From 音信</small>}
      </div>
    </article>
  );
}
