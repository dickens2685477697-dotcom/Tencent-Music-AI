import {
  ChevronLeft,
  Heart,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Plus,
  Share2,
  SkipBack,
  SkipForward,
  Smile,
  ThumbsUp,
  UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ShareCard } from '../../components/yinxin/ShareCard';
import songsData from '../../data/songs/songs.json';
import type { LyricSegment, SongInfo } from '../../types/yinxin';

type DeliveryMode = 'lyric' | 'direct';
type ScenarioView = 'setup' | 'chat' | 'player';
type WechatDemoSong = {
  songId: string;
  title: string;
  artist: string;
  coverUrl: string;
  lyrics: string[];
};

const modeLabels: Record<DeliveryMode, string> = {
  lyric: '藏在歌词中',
  direct: '不隐藏',
};

const wechatSongs = songsData as WechatDemoSong[];
const currentSong = wechatSongs.find((song) => song.songId === 'demo_001') ?? wechatSongs[0];
const currentSongTitle = currentSong?.title ?? '开不了口';
const currentSongArtist = currentSong?.artist ?? '周杰伦';
const currentSongCover = currentSong?.coverUrl ?? '/assets/covers/demo_001.jpg';
const currentSongLyric = currentSong?.lyrics.find((line) => line.includes('开不了口')) ?? currentSong?.lyrics[0] ?? '没说出口的，都在这一句里';

const demoSongInfo: SongInfo = {
  songId: currentSong?.songId ?? 'demo_001',
  title: currentSongTitle,
  artist: currentSongArtist,
  coverUrl: currentSongCover,
  coverIndex: 0,
};

const demoLyricSegment: LyricSegment = {
  segmentId: 'wechat_demo_lyric',
  text: currentSongLyric,
  startTime: 20,
  endTime: 26,
  emotionTags: ['思念', '离别'],
};

const demoUserMessage = '到家就好。其实那句没发出去的话，我放在这封音信里了。';

export function WeChatYinxinPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<DeliveryMode>('lyric');
  const [view, setView] = useState<ScenarioView>('setup');
  const [receiverOpening, setReceiverOpening] = useState(false);
  const [playerRun, setPlayerRun] = useState(0);

  useEffect(() => {
    if (view !== 'player') return undefined;
    setReceiverOpening(false);
    const startTimer = window.setTimeout(() => setReceiverOpening(true), 2600);
    const navigateTimer = window.setTimeout(() => {
      navigate('/s/wechat_demo', { state: { backTo: '/wechat-yinxin' } });
    }, 3450);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(navigateTimer);
    };
  }, [navigate, view, playerRun]);

  const enterChat = () => {
    setReceiverOpening(false);
    setView('chat');
  };

  const openMusic = () => {
    if (mode === 'lyric') {
      setView('player');
      setPlayerRun((current) => current + 1);
      return;
    }
    openLetter();
  };

  const openLetter = () => {
    navigate('/s/wechat_demo', { state: { backTo: '/wechat-yinxin' } });
  };

  return (
    <AppShell light>
      <div className={`wechat-demo wechat-demo--${view}`}>
        {view === 'setup' ? (
          <ModeSetup mode={mode} onModeChange={setMode} onEnter={enterChat} />
        ) : view === 'chat' ? (
          <ChatScreen
            mode={mode}
            onBack={() => {
              setReceiverOpening(false);
              setView('setup');
            }}
            onOpenMusic={openMusic}
          />
        ) : (
          <QQMusicPlayer
            receiverOpening={receiverOpening}
            onBack={() => {
              setReceiverOpening(false);
              setView('chat');
            }}
          />
        )}
      </div>
    </AppShell>
  );
}

function ModeSetup({
  mode,
  onModeChange,
  onEnter,
}: {
  mode: DeliveryMode;
  onModeChange: (mode: DeliveryMode) => void;
  onEnter: () => void;
}) {
  return (
    <section className="wechat-setup">
      <WeChatStatusBar />
      <header className="wechat-setup__header">
        <strong>他</strong>
        <MoreHorizontal size={24} />
      </header>

      <div className="wechat-setup__body">
        <div className="wechat-setup__avatar">他</div>
        <h1>呈现方式</h1>
        <div className="wechat-mode-grid" role="radiogroup" aria-label="选择音信呈现方式">
          <button
            className={`wechat-mode-card ${mode === 'lyric' ? 'wechat-mode-card--active' : ''}`}
            type="button"
            onClick={() => onModeChange('lyric')}
            role="radio"
            aria-checked={mode === 'lyric'}
          >
            <Music2 size={19} />
            <span>{modeLabels.lyric}</span>
            <small>QQ音乐分享卡</small>
          </button>
          <button
            className={`wechat-mode-card ${mode === 'direct' ? 'wechat-mode-card--active' : ''}`}
            type="button"
            onClick={() => onModeChange('direct')}
            role="radio"
            aria-checked={mode === 'direct'}
          >
            <Mail size={19} />
            <span>{modeLabels.direct}</span>
            <small>音信专属卡</small>
          </button>
        </div>

        <div className="wechat-setup-preview" aria-hidden="true">
          <ChatBubble side="other">到家了吗？</ChatBubble>
          <ChatBubble side="me">到家啦～</ChatBubble>
          {mode === 'lyric' ? <QQMusicShareCard compact /> : <ShareCard song={demoSongInfo} lyric={demoLyricSegment} message={demoUserMessage} />}
        </div>
      </div>

      <footer className="wechat-setup__footer">
        <button className="wechat-enter-button" type="button" onClick={onEnter}>
          进入聊天
        </button>
      </footer>
    </section>
  );
}

function ChatScreen({
  mode,
  onBack,
  onOpenMusic,
}: {
  mode: DeliveryMode;
  onBack: () => void;
  onOpenMusic: () => void;
}) {
  return (
    <section className="wechat-chat">
      <WeChatStatusBar />
      <header className="wechat-chat__nav">
        <button type="button" aria-label="返回模式设置" onClick={onBack}>
          <ChevronLeft size={30} />
        </button>
        <strong>他</strong>
        <button type="button" aria-label="更多">
          <MoreHorizontal size={24} />
        </button>
      </header>

      <main className="wechat-chat__messages">
        <div className="wechat-message-row wechat-message-row--other">
          <Avatar tone="dark" />
          <ChatBubble side="other">到家了吗？</ChatBubble>
        </div>
        <div className="wechat-message-row wechat-message-row--me">
          <ChatBubble side="me">到家啦～</ChatBubble>
          <Avatar tone="light" />
        </div>
        <div className="wechat-message-row wechat-message-row--other wechat-message-row--music">
          <Avatar tone="dark" />
          <button className="wechat-music-button" type="button" onClick={onOpenMusic}>
            {mode === 'lyric' ? <QQMusicShareCard /> : <ShareCard song={demoSongInfo} lyric={demoLyricSegment} message={demoUserMessage} />}
          </button>
        </div>
      </main>

      <WeChatInputBar />
    </section>
  );
}

function QQMusicShareCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`qq-share-card ${compact ? 'qq-share-card--compact' : ''}`}>
      <div className="qq-share-card__main">
        <img src={currentSongCover} alt={`${currentSongTitle}封面`} />
        <div className="qq-share-card__meta">
          <strong>{currentSongTitle}</strong>
          <span>{currentSongArtist}</span>
        </div>
        <span className="qq-share-card__play">
          <Play className="qq-share-card__play-icon" size={20} fill="currentColor" />
        </span>
      </div>
      <div className="qq-share-card__brand">
        <img src="/assets/qqmusic-logo-1b43a7.png" alt="QQ音乐" />
      </div>
    </article>
  );
}

function YinxinDirectCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`yinxin-chat-card ${compact ? 'yinxin-chat-card--compact' : ''}`}>
      <div className="yinxin-chat-card__cover">
        <img src={currentSongCover} alt={`${currentSongTitle}封面`} />
        <span>音</span>
      </div>
      <div className="yinxin-chat-card__content">
        <div>
          <strong>音信 · {currentSongTitle}</strong>
          <small>{currentSongArtist}</small>
        </div>
        <div className="yinxin-chat-card__wave" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} style={{ height: `${8 + (index % 4) * 5}px` }} />
          ))}
        </div>
        <p>他寄来了一封音信</p>
      </div>
      <span className="yinxin-chat-card__action">
        <Mail size={20} />
      </span>
    </article>
  );
}

function QQMusicPlayer({
  receiverOpening,
  onBack,
}: {
  receiverOpening: boolean;
  onBack: () => void;
}) {
  return (
    <section className={`qq-player ${receiverOpening ? 'qq-player--letter-ready' : ''}`}>
      <WeChatStatusBar dark />
      <header className="qq-player__nav">
        <button type="button" aria-label="返回聊天" onClick={onBack}>
          <ChevronLeft size={29} />
        </button>
        <button className="qq-player__discover" type="button">
          发现
        </button>
      </header>

      <main className="qq-player__body">
        <img className="qq-player__cover" src={currentSongCover} alt={`${currentSongTitle}专辑封面`} />
        <div className="qq-player__listen">
          <span className="qq-music-mark">♪</span>
          <span>QQ音乐</span>
          <b>41 人在听</b>
        </div>

        <section className="qq-player__song">
          <div>
            <h1>{currentSongTitle}</h1>
            <p>{currentSongArtist}</p>
          </div>
          <div className="qq-player__stats">
            <span><ThumbsUp size={25} />1.8万</span>
            <span><Share2 size={25} />10万+</span>
            <span><Heart size={26} />9.8万</span>
          </div>
        </section>

        <div className="qq-player__progress">
          <span className="qq-player__dot" />
          <i />
          <time>00:06</time>
          <time>04:44</time>
        </div>

        <p className="qq-player__lyric">
          {receiverOpening ? currentSongLyric : '音乐播放中...'}
        </p>

        <div className="qq-player__controls">
          <button type="button" aria-label="上一首"><SkipBack size={40} fill="currentColor" /></button>
          <button type="button" aria-label="暂停"><Pause size={58} fill="currentColor" /></button>
          <button type="button" aria-label="下一首"><SkipForward size={40} fill="currentColor" /></button>
        </div>
      </main>

      <nav className="qq-player__tabs">
        <button type="button">词</button>
        <button type="button"><MessageCircle size={25} />1404</button>
        <button type="button"><UserRound size={25} /></button>
        <button type="button"><Menu size={25} /></button>
      </nav>

      {receiverOpening && <ReceiverOpeningTransition />}
    </section>
  );
}

function ReceiverOpeningTransition() {
  return (
    <div className="receiver-opening" aria-label="正在进入音信">
      <div className="receiver-opening__note">
        <Mail size={30} />
      </div>
      <span>正在进入音信</span>
    </div>
  );
}

function WeChatStatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`wechat-status ${dark ? 'wechat-status--dark' : ''}`}>
      <time>16:38</time>
      <div aria-hidden="true">
        <span className="wechat-signal"><i /><i /><i /><i /></span>
        <span className="wechat-wifi" />
        <span className="wechat-battery" />
      </div>
    </div>
  );
}

function ChatBubble({ side, children }: { side: 'me' | 'other'; children: string }) {
  return <p className={`wechat-bubble wechat-bubble--${side}`}>{children}</p>;
}

function Avatar({ tone }: { tone: 'dark' | 'light' }) {
  return <span className={`wechat-avatar wechat-avatar--${tone}`} />;
}

function WeChatInputBar() {
  return (
    <footer className="wechat-inputbar">
      <button type="button" aria-label="语音">
        <Mic size={28} />
      </button>
      <div className="wechat-inputbar__field" />
      <button type="button" aria-label="表情">
        <Smile size={29} />
      </button>
      <button type="button" aria-label="更多">
        <Plus size={30} />
      </button>
    </footer>
  );
}
