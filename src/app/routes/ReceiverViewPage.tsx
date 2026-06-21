import { Bookmark, ExternalLink, Heart, MessageCircleHeart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Toast } from '../../components/yinxin/Toast';
import { YinxinMusicCard } from '../../components/yinxin/YinxinMusicCard';
import { getYinxinCard } from '../../services/shareStore';

const feedback = [{ label: '我听懂了', icon: Heart }, { label: '有点想回 TA', icon: MessageCircleHeart }, { label: '收藏这封音信', icon: Bookmark }];

export function ReceiverViewPage() {
  const { shareId = 'demo' } = useParams();
  const card = getYinxinCard(shareId);
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [toast, setToast] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1600); };
  return (
    <AppShell>
      <div className="page receiver-page">
        <section className="receiver-heading"><span className="receiver-spark">✦</span><h1>你收到了一封音信</h1><p>TA 让一首歌替 TA 说了这些话。</p></section>
        <div className="receiver-envelope"><YinxinMusicCard song={card.song} lyric={card.selectedLyric} message={card.userMessage} style={card.cardStyle} /><span className="receiver-envelope__seal">音</span></div>
        <div className="feedback-bar">{feedback.map(({ label, icon: Icon }) => <button className={selected === label ? 'active' : ''} onClick={() => { setSelected(label); notify('已记录你的回应'); }} key={label}><Icon size={17} />{label}</button>)}</div>
        <button className="primary-button" onClick={() => navigate(`/s/${shareId}/reply`)}>回一封音信</button>
        <button className="text-button external-link" onClick={() => notify('即将前往 QQ音乐')}><ExternalLink size={14} />去 QQ音乐听完整首歌</button>
        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
