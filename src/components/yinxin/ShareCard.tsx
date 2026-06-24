import { resolveSongInfo } from '../../data/songs/songCatalog';
import type { LyricSegment, SongInfo } from '../../types/yinxin';
import { CoverArt } from './CoverArt';

export function ShareCard({ song, lyric }: { song: SongInfo; lyric: LyricSegment }) {
  const displaySong = resolveSongInfo(song);
  const lyricPreview = lyric.text.length > 14 ? lyric.text.slice(0, 14) + '…' : lyric.text;

  return (
    <div className="ysc">
      {/* 主体：背景模糊封面 + 内容 */}
      <div className="ysc__main">
        <div
          className="ysc__bg"
          style={{ backgroundImage: `url(${displaySong.coverUrl})` }}
          aria-hidden
        />
        <div className="ysc__row">
          {/* 左：专辑封面 */}
          <div className="ysc__cover-wrap">
            <CoverArt
              index={displaySong.coverIndex}
              src={displaySong.coverUrl}
              className="ysc__cover"
            />
          </div>

          {/* 右：歌词与歌曲信息 */}
          <div className="ysc__content">
            {/* 品牌行：音信徽章 + 歌词预览 */}
            <div className="ysc__brand-row">
              <span className="ysc__badge">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 17V6l9-2v11" stroke="#25AF7E" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="6.5" cy="17" r="2.5" fill="#25AF7E" />
                  <circle cx="15.5" cy="15" r="2.5" fill="#25AF7E" />
                </svg>
                <span>音信</span>
              </span>
              <div className="ysc__preview">
                <span className="ysc__sep">·</span>
                <span>{lyricPreview}</span>
              </div>
            </div>

            {/* 歌词行：大引号 + 歌词文本 */}
            <div className="ysc__lyric-row">
              <span className="ysc__q" aria-hidden>"</span>
              <p className="ysc__lyric-text">{lyric.text}</p>
              <span className="ysc__q ysc__q--close" aria-hidden>"</span>
            </div>

            {/* 信息行：歌名 + 歌手 + 播放按钮 */}
            <div className="ysc__meta">
              <div className="ysc__song-info">
                <strong>{displaySong.title}</strong>
                <small>{displaySong.artist}</small>
              </div>
              <button className="ysc__play" type="button" aria-label="播放预览">
                <svg width="6" height="8" viewBox="0 0 6 8" fill="none" aria-hidden>
                  <path d="M0 0L6 4L0 8V0Z" fill="#21C879" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部品牌条 */}
      <div className="ysc__foot">
        <span>由&nbsp;音信&nbsp;创作</span>
      </div>
    </div>
  );
}
