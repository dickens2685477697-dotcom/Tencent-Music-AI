import { Check, Copy, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Toast } from '../../components/yinxin/Toast';
import { YinxinMusicCard } from '../../components/yinxin/YinxinMusicCard';
import { WireframeModal } from '../../components/yinxin/WireframeModal';
import { copyShareLink, getYinxinCard } from '../../services/shareStore';

export function SharePreviewPage() {
  const { id = 'demo' } = useParams();
  const card = getYinxinCard(id);
  const navigate = useNavigate();
  const [packed, setPacked] = useState(false);
  const [toast, setToast] = useState('');
  const [shareTarget, setShareTarget] = useState<'wechat' | 'qq' | 'more' | null>(null);
  useEffect(() => { const timer = window.setTimeout(() => setPacked(true), 1250); return () => window.clearTimeout(timer); }, []);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1700); };
  return (
    <AppShell>
      <div className="page share-page">
        <PageHeader title="音信" backTo={`/yinxin/edit/${card.candidateId}`} />
        <section className="share-heading"><h1>{packed ? '你的音信已经写好' : '正在装入你的音信…'}</h1><p>{packed ? '用音乐，把心意送给 TA' : '把歌和想说的话，一起装进信封'}</p></section>
        <div className={`packing-scene ${packed ? 'packing-scene--done' : ''}`}>
          <YinxinMusicCard song={card.song} lyric={card.selectedLyric} message={card.userMessage} style={card.cardStyle} interactive={false} className="packing-card" />
          <div className="envelope-back" /><div className="envelope-front"><span><Check size={19} /></span></div>
        </div>
        <p className="packing-status">{packed ? '装信完成，可以分享给 TA 了' : '正在为这封音信落款…'}</p>
        <div className={`share-actions ${packed ? 'share-actions--visible' : ''}`}>
          <button onClick={() => setShareTarget('wechat')}><span><MessageCircle size={21} /></span>微信好友</button>
          <button onClick={() => setShareTarget('qq')}><span><Send size={21} /></span>QQ 好友</button>
          <button onClick={async () => { try { await copyShareLink(id); notify('链接已复制'); } catch { notify('链接已准备好'); } }}><span><Copy size={21} /></span>复制链接</button>
          <button onClick={() => setShareTarget('more')}><span><MoreHorizontal size={21} /></span>更多</button>
        </div>
        <button className="secondary-button receiver-open" disabled={!packed} onClick={() => navigate(`/s/${id}`)}>模拟接收者打开</button>
        <button className="text-button sent-record-link" disabled={!packed} onClick={() => navigate(`/yinxin/sent/${id}`)}>查看我寄出的音信</button>
        {shareTarget ? <WireframeModal title={shareTarget === 'wechat' ? '分享到微信' : shareTarget === 'qq' ? '分享到 QQ' : '更多分享方式'} onClose={() => setShareTarget(null)} onConfirm={() => { setShareTarget(null); notify('已模拟分享'); }} confirmLabel="确认分享"><p>音信将以链接形式分享。任何收到并打开链接的人都可以回复。</p><div className="wire-share-preview">图片占位（分享卡片）</div></WireframeModal> : null}
        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
