import { Copy, Mail, MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { ShareCard } from '../../components/yinxin/ShareCard';
import { Toast } from '../../components/yinxin/Toast';
import { WireframeModal } from '../../components/yinxin/WireframeModal';
import { copyShareLink, getYinxinCard } from '../../services/shareStore';

export function SharePreviewPage() {
  const { id = 'demo' } = useParams();
  const card = getYinxinCard(id);
  const navigate = useNavigate();
  const [packed, setPacked] = useState(false);
  const [toast, setToast] = useState('');
  const [shareTarget, setShareTarget] = useState<'wechat' | 'qq' | 'more' | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setPacked(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1700);
  };

  return (
    <AppShell light>
      <div className="page share-page">
        <PageHeader title="音信" backTo={`/yinxin/edit/${card.candidateId}`} />

        {/* 标题 */}
        <div className="share-heading">
          <h1>
            {packed ? '你的音信已经写好' : <>正在装入你的<b>音信</b>…</>}
          </h1>
          <p>{packed ? '用音乐，把心意送给 TA' : '把歌和想说的话，一起装进信封'}</p>
        </div>

        {/* 主视觉：信封 + 黑胶 + 音乐信息卡 + 彩屑 */}
        <div className={`packing-scene ${packed ? 'packing-scene--packed' : 'packing-scene--packing'}`}>
          {/* 彩屑 */}
          <span className="confetti cf1" />
          <span className="confetti cf2" />
          <span className="confetti cf3" />
          <span className="confetti cf4" />
          <span className="confetti cf5" />
          <span className="confetti cf6" />

          {/* 信封 */}
          <div className="envelope-wrap">
            <div className="envelope-back" />
            <div className="envelope-pocket-shadow" />
            {/* 音乐信息卡：放在信封前后层之间，形成插入效果 */}
            <div className="packing-card">
              <div className="packing-card__cover">
                <CoverArt index={card.song.coverIndex} src={card.song.coverUrl} className="cover-art" />
              </div>
              <div className="packing-card__info">
                <b>{card.song.title}</b>
                <small>{card.song.artist} · {card.song.album}</small>
                <p className="packing-card__lyric">
                  <i>"</i>{card.selectedLyric.text}<i>"</i>
                </p>
              </div>
            </div>
            <div className="envelope-front-left" />
            <div className="envelope-front-right" />
            <img
              className="envelope-front-overlay"
              src="/assets/figma-envelope/envelope-intersect-18e725.png"
              alt=""
              aria-hidden
            />
            <span className="envelope-wave" aria-hidden>
              <svg width="52" height="24" viewBox="0 0 52 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M2 12c4-8 8-8 12 0s8 8 12 0 8-8 12 0s8 8 12 0" />
              </svg>
            </span>
            <div className="envelope-seal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 17V6l9-2v11" /><circle cx="6.5" cy="17" r="2.2" fill="white" stroke="none" /><circle cx="15.5" cy="15" r="2.2" fill="white" stroke="none" />
              </svg>
            </div>
          </div>

          {/* 黑胶唱片 */}
          <div className="packing-vinyl" />
        </div>

        {/* 进度 / 打包完成后的分享操作 */}
        {!packed ? (
          <div className="packing-status">
            <p>正在为这封音信落款…</p>
            <div className="packing-bar">
              <span className="packing-bar-fill" />
            </div>
          </div>
        ) : (
          <>
            <div className={`share-actions share-actions--visible`}>
              <button onClick={() => setShareTarget('wechat')}>
                <span><MessageCircle size={20} /></span>
                微信好友
              </button>
              <button onClick={() => setShareTarget('qq')}>
                <span><Send size={20} /></span>
                QQ 好友
              </button>
              <button onClick={async () => {
                try { await copyShareLink(id); notify('链接已复制'); }
                catch { notify('链接已准备好'); }
              }}>
                <span><Copy size={20} /></span>
                复制链接
              </button>
              <button onClick={() => setShareTarget('more')}>
                <span><Mail size={20} /></span>
                更多
              </button>
            </div>
          </>
        )}

        {/* 底部行动 */}
        <div className="share-cta">
          <button
            className="share-btn-solid"
            disabled={!packed}
            onClick={() => navigate(`/s/${id}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="7" width="18" height="13" rx="2" /><path d="m3 9 9 6 9-6" />
            </svg>
            模拟接收者打开
          </button>
          <button
            className="share-btn-ghost"
            disabled={!packed}
            onClick={() => navigate(`/yinxin/sent/${id}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" strokeLinecap="round" />
            </svg>
            查看我寄出的音信
          </button>
        </div>

        {shareTarget && (
          <WireframeModal
            title={shareTarget === 'wechat' ? '分享到微信' : shareTarget === 'qq' ? '分享到 QQ' : '更多分享方式'}
            onClose={() => setShareTarget(null)}
            onConfirm={() => { setShareTarget(null); notify('已模拟分享'); }}
            confirmLabel="确认分享"
          >
            <p>音信将以链接形式分享。任何收到并打开链接的人都可以回复。</p>
            <div className="wire-share-card-wrap">
              <ShareCard song={card.song} lyric={card.selectedLyric} message={card.userMessage} />
            </div>
          </WireframeModal>
        )}

        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
