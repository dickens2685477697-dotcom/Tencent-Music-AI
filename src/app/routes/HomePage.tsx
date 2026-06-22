import {
  ChevronRight,
  Clapperboard,
  Disc3,
  Mail,
  Music2,
  Radio,
  Search,
  Star,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { Toast } from '../../components/yinxin/Toast';

const shortcuts = [
  { label: '每日推荐', icon: <Star size={20} /> },
  { label: '歌单', icon: <Music2 size={20} /> },
  { label: '排行榜', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="10" width="3.4" height="9" rx="1.4"/><rect x="10.3" y="5" width="3.4" height="14" rx="1.4"/><rect x="17.6" y="13" width="3.4" height="6" rx="1.4"/></svg> },
  { label: '电台', icon: <Radio size={20} /> },
  { label: '数字专辑', icon: <Disc3 size={20} /> },
];

const songs = [
  { title: '月光下的信件', artist: '苏打绿', index: 0 },
  { title: '风的形状', artist: '岑宁儿', index: 1 },
  { title: '时光慢递', artist: '理想混蛋', index: 2 },
];

export function HomePage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const unavailable = () => {
    setToast('demo 中暂未开放');
    window.setTimeout(() => setToast(''), 1500);
  };

  return (
    <AppShell light>
      <div className="home-page">
        {/* 顶部栏 */}
        <header className="home-topbar">
          <img
            src="/assets/qqmusic-logo-1b43a7.png"
            alt="QQ音乐"
            className="home-topbar__logo"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="home-topbar__logo-fallback">
            <Music2 size={16} fill="currentColor" />
            <strong>QQ音乐</strong>
          </div>
          <button className="home-topbar-app" aria-label="当前播放" onClick={unavailable}>
            <Music2 size={18} />
          </button>
        </header>

        {/* 搜索框 */}
        <button className="search-box" onClick={unavailable}>
          <Search size={14} />
          搜索歌曲、歌手
        </button>

        {/* 快捷入口 */}
        <div className="home-shortcuts">
          {shortcuts.map(({ label, icon }) => (
            <button key={label} onClick={unavailable}>
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* 音信特性卡 */}
        <button className="feature-entry" onClick={() => navigate('/yinxin')}>
          <div className="feature-entry__copy">
            <strong>音信</strong>
            <p>把说不出口的话，<br />变成一首歌里的告白</p>
            <span>
              写一封音信
              <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor"><path d="M1 1l6 5-6 5"/></svg>
            </span>
          </div>
        </button>

        {/* 我寄出的音信 */}
        <button className="sent-letters-entry" onClick={() => navigate('/yinxin/sent')}>
          <div className="sent-letters-entry__icon">
            <Mail size={20} />
          </div>
          <div className="sent-letters-entry__text">
            <strong>我寄出的音信</strong>
            <small>12 封待开启</small>
          </div>
          <ChevronRight size={16} className="sent-letters-entry__arrow" />
        </button>

        {/* 为你推荐 */}
        <section className="recommendations">
          <header>
            <strong>为你推荐</strong>
            <button onClick={unavailable}>
              更多
              <ChevronRight size={14} />
            </button>
          </header>
          {songs.map(({ title, artist, index }) => (
            <button className="song-row" onClick={unavailable} key={index}>
              <div className="song-row__cover">
                <CoverArt index={index} />
                <div className="song-row__play-overlay">
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="white">
                    <path d="M1 1.5l11 6.5-11 6.5V1.5z"/>
                  </svg>
                </div>
              </div>
              <span>
                <b>{title}</b>
                <small>{artist}</small>
              </span>
              <div className="song-row__actions">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>
                </svg>
              </div>
            </button>
          ))}
        </section>

        {/* 底部 5 Tab 导航 */}
        <nav className="home-nav">
          <button className="active" onClick={() => navigate('/')}>
            <Music2 size={20} />
            首页
          </button>
          <button onClick={unavailable}>
            <Clapperboard size={20} />
            视频
          </button>
          <button onClick={() => navigate('/yinxin')}>
            <Mail size={20} />
            音信
          </button>
          <button onClick={unavailable}>
            <Radio size={20} />
            雷达
          </button>
          <button onClick={() => navigate('/yinxin/sent')}>
            <User size={20} />
            我的
          </button>
          <div className="home-nav-indicator" />
        </nav>

        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
