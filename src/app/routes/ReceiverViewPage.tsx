import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Toast } from '../../components/yinxin/Toast';
import { YinxinMusicCard } from '../../components/yinxin/YinxinMusicCard';
import { getYinxinCard } from '../../services/shareStore';

export function ReceiverViewPage() {
  const { shareId = 'demo' } = useParams();
  const card = getYinxinCard(shareId);
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = (location.state as { backTo?: string } | null)?.backTo;
  const [toast, setToast] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1600); };
  return (
    <AppShell>
      <div className="page receiver-page">
        {backTo && (
          <button className="receiver-back" aria-label="返回我寄出的音信" onClick={() => navigate(backTo)}>
            <ArrowLeft size={20} />
          </button>
        )}
        <section className="receiver-heading"><span className="receiver-spark">✦</span><h1>你收到了一封音信</h1><p>TA 让一首歌替 TA 说了这些话。</p></section>
        <div className="receiver-envelope">
          <YinxinMusicCard
            song={card.song}
            lyric={card.selectedLyric}
            message={card.userMessage}
            messageType={card.messageType}
            hideMessageInLyric={card.hideMessageInLyric}
            voiceDuration={card.voiceDuration}
            style={card.cardStyle}
          />
          <span className="receiver-envelope__seal">音</span>
        </div>
        <div className="receiver-actions">
          <button className="primary-button" onClick={() => navigate(`/s/${shareId}/reply`)}>回一封音信</button>
          <button className="text-button external-link" onClick={() => notify('即将前往 QQ音乐')}><ExternalLink size={14} />去 QQ音乐听完整首歌</button>
        </div>
        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
