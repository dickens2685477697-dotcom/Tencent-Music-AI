import { Headphones, Menu, Music2, Play, Radio, Search, Sparkles, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { Toast } from '../../components/yinxin/Toast';

const shortcuts = [
  { label: '推荐', icon: Sparkles }, { label: '乐馆', icon: Music2 }, { label: '排行', icon: Headphones },
  { label: '电台', icon: Radio }, { label: '直播', icon: Play },
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
        <header className="home-topbar">
          <div className="brand-mark"><Music2 size={18} fill="currentColor" /></div>
          <strong>QQ音乐</strong><button className="home-menu" aria-label="菜单" onClick={unavailable}><Menu size={22} /></button>
        </header>
        <button className="search-box" onClick={unavailable}><Search size={16} />搜索歌曲、歌手、歌词</button>
        <h1>好音乐，陪着你</h1>
        <div className="home-shortcuts">
          {shortcuts.map(({ label, icon: Icon }) => <button onClick={unavailable} key={label}><span><Icon size={20} /></span>{label}</button>)}
        </div>
        <button className="feature-entry" onClick={() => navigate('/yinxin')}>
          <div className="feature-entry__copy"><strong>音信</strong><p>把说不出口的话，<br />变成一首歌里的音信</p><span>写一封音信 <b>›</b></span></div>
          <div className="feature-entry__visual"><div className="mini-record"><Music2 size={28} fill="currentColor" /></div><div className="mini-envelope" /></div>
        </button>
        <button className="sent-letters-entry" onClick={() => navigate('/yinxin/sent')}><span>图标占位</span><strong>我寄出的音信</strong><small>查看分享链接收到的所有回复</small><b>›</b></button>
        <section className="recommendations">
          <header><strong>为你推荐</strong><button onClick={unavailable}>更多 ›</button></header>
          {[0, 1, 2].map((index) => <button className="song-row" onClick={unavailable} key={index}><CoverArt index={index} /><span><b>{['想念拟人化', '日落飞行', '好久不见'][index]}</b><small>{['陈粒', '周亦舟', '陈奕迅'][index]}</small></span><Play size={17} /></button>)}
        </section>
        <nav className="home-nav"><button className="active" onClick={() => navigate('/')}><Music2 size={19} />首页</button><button onClick={unavailable}><Sparkles size={19} />发现</button><button onClick={() => navigate('/yinxin/sent')}><UserRound size={19} />我的音信</button><button onClick={unavailable}><Play size={19} />播放</button></nav>
        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
