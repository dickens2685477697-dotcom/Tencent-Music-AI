import { resolveSongInfo } from '../../data/songs/songCatalog';
import type { LyricSegment, SongInfo } from '../../types/yinxin';
import { CoverArt } from './CoverArt';

interface ShareCardProps {
  song: SongInfo;
  lyric: LyricSegment;
  /** 用户输入的留言，显示在音信徽章旁；不传时回退显示歌词预览 */
  message?: string;
}

export function ShareCard({ song, lyric, message }: ShareCardProps) {
  const displaySong = resolveSongInfo(song);

  // 徽章旁：优先显示用户留言，无留言时退回歌词预览
  const badgeText = message
    ? (message.length > 16 ? message.slice(0, 16) + '…' : message)
    : (lyric.text.length > 14 ? lyric.text.slice(0, 14) + '…' : lyric.text);

  return (
    <div className="ysc">
      {/* 主体区：Figma 导出背景图 */}
      <div className="ysc__main">
        <div className="ysc__bg" aria-hidden />
        <div className="ysc__row">

          {/*
           * 左：封面区 78×68
           * 黑胶 SVG z=0（圆心 x=46.89，从封面右侧露出约 10px）
           * 封面 z=1（绝对 left=0，遮住黑胶左侧）
           */}
          <div className="ysc__cover-wrap">
            <img
              src="/assets/share-card/cover-decoration.svg"
              className="ysc__vinyl"
              alt=""
              aria-hidden
            />
            <div className="ysc__cover-frame">
              <CoverArt
                index={displaySong.coverIndex}
                src={displaySong.coverUrl}
                className="ysc__cover"
              />
            </div>
          </div>

          {/* 右：歌词与歌曲信息 */}
          <div className="ysc__content">

            {/* 品牌行：音信徽章 + 用户留言（Figma 设计中为用户话语） */}
            <div className="ysc__brand-row">
              <span className="ysc__badge">
                <img
                  src="/assets/share-card/yinxin-badge-icon.png"
                  alt=""
                  className="ysc__badge-icon"
                  aria-hidden
                />
                <span>音信</span>
              </span>
              <div className="ysc__preview">
                <span className="ysc__sep">·</span>
                <span>{badgeText}</span>
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

      {/* 底部品牌条：左对齐（同 QQ 音乐品牌条方式） */}
      <div className="ysc__foot">
        <img
          src="/assets/share-card/share-card-brand.png"
          alt="音信"
          className="ysc__brand-img"
        />
      </div>
    </div>
  );
}
