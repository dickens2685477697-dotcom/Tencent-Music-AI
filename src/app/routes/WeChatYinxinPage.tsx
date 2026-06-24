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
import { useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ShareCard } from '../../components/yinxin/ShareCard';
import songsData from '../../data/songs/songs.json';
import type { LyricSegment, SongInfo } from '../../types/yinxin';

type DeliveryMode = 'lyric' | 'direct';
type ScenarioView = 'setup' | 'chat' | 'player';
type PlayerAutoFlow = DeliveryMode | null;
type WeChatYinxinLocationState = {
  resumePlayer?: boolean;
  mode?: DeliveryMode;
};
type WechatDemoSong = {
  songId: string;
  title: string;
  artist: string;
  coverUrl: string;
  lyrics: string[];
};

const modeLabels: Record<DeliveryMode, string> = {
  lyric: '\u85cf\u5728\u6b4c\u8bcd\u4e2d',
  direct: '\u4e0d\u9690\u85cf',
};

const wechatSongs = songsData as WechatDemoSong[];
const currentSong = wechatSongs.find((song) => song.songId === 'demo_001') ?? wechatSongs[0];
const currentSongTitle = currentSong?.title ?? '\u5f00\u4e0d\u4e86\u53e3';
const currentSongArtist = currentSong?.artist ?? '\u5468\u6770\u4f26';
const currentSongCover = currentSong?.coverUrl ?? '/assets/covers/demo_001.jpg';
const currentSongLyric =
  currentSong?.lyrics.find((line) => line.includes('\u5f00\u4e0d\u4e86\u53e3')) ??
  currentSong?.lyrics[0] ??
  '\u6ca1\u8bf4\u51fa\u53e3\u7684\uff0c\u90fd\u5728\u8fd9\u4e00\u53e5\u91cc';

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
  emotionTags: ['\u601d\u5ff5', '\u79bb\u522b'],
};

const demoUserMessage =
  '\u5230\u5bb6\u5c31\u597d\u3002\u5176\u5b9e\u90a3\u53e5\u6ca1\u53d1\u51fa\u53bb\u7684\u8bdd\uff0c\u6211\u653e\u5728\u8fd9\u5c01\u97f3\u4fe1\u91cc\u4e86\u3002';
const lyricTriggerMs = 2600;
const lyricNavigateMs = 3450;
const directNavigateMs = 220;
const heAvatarSrc =
  '/@fs/C:/Users/Administrator/.cursor/projects/d-vibecoding-music/assets/c__Users_Administrator_AppData_Roaming_Cursor_User_workspaceStorage_d90546fdbbd4fe7434b338b59b4de4e0_images_4001e37f5ad1dd89dec233c84cb6c9a7-15223948-01e5-47c4-973c-d45d8e922a11.png';

export function WeChatYinxinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as WeChatYinxinLocationState | null) ?? null;
  const [mode, setMode] = useState<DeliveryMode>(routeState?.mode ?? 'lyric');
  const [view, setView] = useState<ScenarioView>(routeState?.resumePlayer ? 'player' : 'setup');
  const [receiverOpening, setReceiverOpening] = useState(false);
  const [playerAutoFlow, setPlayerAutoFlow] = useState<PlayerAutoFlow>(null);

  useEffect(() => {
    if (view !== 'player' || !playerAutoFlow) return undefined;
    setReceiverOpening(false);
    if (playerAutoFlow === 'direct') {
      const directTimer = window.setTimeout(() => {
        setPlayerAutoFlow(null);
        navigate('/s/wechat_demo', {
          state: { backTo: '/wechat-yinxin', backState: { resumePlayer: true, mode: 'direct' } },
        });
      }, directNavigateMs);
      return () => {
        window.clearTimeout(directTimer);
      };
    }
    const startTimer = window.setTimeout(() => setReceiverOpening(true), lyricTriggerMs);
    const navigateTimer = window.setTimeout(() => {
      setPlayerAutoFlow(null);
      navigate('/s/wechat_demo', {
        state: { backTo: '/wechat-yinxin', backState: { resumePlayer: true, mode: 'lyric' } },
      });
    }, lyricNavigateMs);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(navigateTimer);
    };
  }, [navigate, playerAutoFlow, view]);

  const enterChat = () => {
    setReceiverOpening(false);
    setView('chat');
  };

  const openMusic = () => {
    setView('player');
    setPlayerAutoFlow(mode);
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
        <strong>{'\u4ed6'}</strong>
        <MoreHorizontal size={24} />
      </header>

      <div className="wechat-setup__body">
        <img className="wechat-setup__avatar" src={heAvatarSrc} alt={'\u4ed6\u7684\u5934\u50cf'} />
        <h1>{'\u5448\u73b0\u65b9\u5f0f'}</h1>
        <div className="wechat-mode-grid" role="radiogroup" aria-label={'\u9009\u62e9\u97f3\u4fe1\u5448\u73b0\u65b9\u5f0f'}>
          <button
            className={`wechat-mode-card ${mode === 'lyric' ? 'wechat-mode-card--active' : ''}`}
            type="button"
            onClick={() => onModeChange('lyric')}
            role="radio"
            aria-checked={mode === 'lyric'}
          >
            <Music2 size={19} />
            <span>{modeLabels.lyric}</span>
            <small>{'QQ\u97f3\u4e50\u5206\u4eab\u5361'}</small>
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
            <small>{'\u97f3\u4fe1\u4e13\u5c5e\u5361'}</small>
          </button>
        </div>

        <div className="wechat-setup-preview" aria-hidden="true">
          <ChatBubble side="other">{'\u5230\u5bb6\u4e86\u5417\uff1f'}</ChatBubble>
          <ChatBubble side="me">{'\u5230\u5bb6\u5566\uff5e'}</ChatBubble>
          {mode === 'lyric' ? <QQMusicShareCard compact /> : <ShareCard song={demoSongInfo} lyric={demoLyricSegment} message={demoUserMessage} />}
        </div>
      </div>

      <footer className="wechat-setup__footer">
        <button className="wechat-enter-button" type="button" onClick={onEnter}>
          {'\u8fdb\u5165\u804a\u5929'}
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
        <button type="button" aria-label={'\u8fd4\u56de\u6a21\u5f0f\u8bbe\u7f6e'} onClick={onBack}>
          <ChevronLeft size={30} />
        </button>
        <strong>{'\u4ed6'}</strong>
        <button type="button" aria-label={'\u66f4\u591a'}>
          <MoreHorizontal size={24} />
        </button>
      </header>

      <main className="wechat-chat__messages">
        <div className="wechat-message-row wechat-message-row--other">
          <Avatar tone="dark" />
          <ChatBubble side="other">{'\u5230\u5bb6\u4e86\u5417\uff1f'}</ChatBubble>
        </div>
        <div className="wechat-message-row wechat-message-row--me">
          <ChatBubble side="me">{'\u5230\u5bb6\u5566\uff5e'}</ChatBubble>
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
        <img src={currentSongCover} alt={`${currentSongTitle}\u5c01\u9762`} />
        <div className="qq-share-card__meta">
          <strong>{currentSongTitle}</strong>
          <span>{currentSongArtist}</span>
        </div>
        <span className="qq-share-card__play">
          <Play className="qq-share-card__play-icon" size={20} fill="currentColor" />
        </span>
      </div>
      <div className="qq-share-card__brand">
        <img src="/assets/qqmusic-logo-1b43a7.png" alt={'QQ\u97f3\u4e50'} />
      </div>
    </article>
  );
}

function YinxinDirectCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`yinxin-chat-card ${compact ? 'yinxin-chat-card--compact' : ''}`}>
      <div className="yinxin-chat-card__cover">
        <img src={currentSongCover} alt={`${currentSongTitle}\u5c01\u9762`} />
        <span>{'\u97f3'}</span>
      </div>
      <div className="yinxin-chat-card__content">
        <div>
          <strong>{`\u97f3\u4fe1 \u00b7 ${currentSongTitle}`}</strong>
          <small>{currentSongArtist}</small>
        </div>
        <div className="yinxin-chat-card__wave" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} style={{ height: `${8 + (index % 4) * 5}px` }} />
          ))}
        </div>
        <p>{'\u4ed6\u5bc4\u6765\u4e86\u4e00\u5c01\u97f3\u4fe1'}</p>
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
        <button type="button" aria-label={'\u8fd4\u56de\u804a\u5929'} onClick={onBack}>
          <ChevronLeft size={29} />
        </button>
        <button className="qq-player__discover" type="button">
          {'\u53d1\u73b0'}
        </button>
      </header>

      <main className="qq-player__body">
        <img className="qq-player__cover" src={currentSongCover} alt={`${currentSongTitle}\u4e13\u8f91\u5c01\u9762`} />
        <div className="qq-player__listen">
          <span className="qq-music-mark">{'\u266a'}</span>
          <span>{'QQ\u97f3\u4e50'}</span>
          <b>{'41 \u4eba\u5728\u542c'}</b>
        </div>

        <section className="qq-player__song">
          <div>
            <h1>{currentSongTitle}</h1>
            <p>{currentSongArtist}</p>
          </div>
          <div className="qq-player__stats">
            <span><ThumbsUp size={25} />{'1.8\u4e07'}</span>
            <span><Share2 size={25} />{'10\u4e07+'}</span>
            <span><Heart size={26} />{'9.8\u4e07'}</span>
          </div>
        </section>

        <div className="qq-player__progress">
          <span className="qq-player__dot" />
          <i />
          <time>00:06</time>
          <time>04:44</time>
        </div>

        <p className="qq-player__lyric">
          {receiverOpening ? currentSongLyric : '\u97f3\u4e50\u64ad\u653e\u4e2d...'}
        </p>

        <div className="qq-player__controls">
          <button type="button" aria-label={'\u4e0a\u4e00\u9996'}><SkipBack size={40} fill="currentColor" /></button>
          <button type="button" aria-label={'\u6682\u505c'}><Pause size={58} fill="currentColor" /></button>
          <button type="button" aria-label={'\u4e0b\u4e00\u9996'}><SkipForward size={40} fill="currentColor" /></button>
        </div>
      </main>

      <nav className="qq-player__tabs">
        <button type="button">{'\u8bcd'}</button>
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
    <div className="receiver-opening" aria-label={'\u6b63\u5728\u8fdb\u5165\u97f3\u4fe1'}>
      <div className="receiver-opening__note">
        <Mail size={30} />
      </div>
      <span>{'\u6b63\u5728\u8fdb\u5165\u97f3\u4fe1'}</span>
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
  if (tone === 'dark') {
    return <img className="wechat-avatar wechat-avatar--photo" src={heAvatarSrc} alt={'\u4ed6\u7684\u5934\u50cf'} />;
  }
  return <span className="wechat-avatar wechat-avatar--light" />;
}

function WeChatInputBar() {
  return (
    <footer className="wechat-inputbar">
      <button type="button" aria-label={'\u8bed\u97f3'}>
        <Mic size={28} />
      </button>
      <div className="wechat-inputbar__field" />
      <button type="button" aria-label={'\u8868\u60c5'}>
        <Smile size={29} />
      </button>
      <button type="button" aria-label={'\u66f4\u591a'}>
        <Plus size={30} />
      </button>
    </footer>
  );
}
