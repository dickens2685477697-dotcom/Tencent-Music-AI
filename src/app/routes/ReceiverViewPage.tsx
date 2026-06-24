import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ReceivedYinxinCard } from '../../components/yinxin/ReceivedYinxinCard';
import { Toast } from '../../components/yinxin/Toast';
import { getYinxinCard } from '../../services/shareStore';

export function ReceiverViewPage() {
  const { shareId = 'demo' } = useParams();
  const card = getYinxinCard(shareId);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { backTo?: string; backState?: unknown } | null) ?? null;
  const backTo = locationState?.backTo;
  const backState = locationState?.backState;
  const [toast, setToast] = useState('');
  const [cardOpened, setCardOpened] = useState(false);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1600); };

  const openCard = () => {
    if (!cardOpened) setCardOpened(true);
  };
  return (
    <AppShell light>
      <div className="page receiver-page">
        {backTo && (
          <button
            className="receiver-back"
            aria-label="返回我寄出的音信"
            onClick={() => navigate(backTo, backState ? { state: backState } : undefined)}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <section className="receiver-heading"><span className="receiver-spark">✦</span><h1>你收到了一封音信</h1><p>TA 让一首歌替 TA 说了这些话。</p></section>
        <div className={`receiver-envelope ${cardOpened ? 'receiver-envelope--opened' : ''}`}>
          <img
            className="receiver-envelope__layer receiver-envelope__layer--back"
            src="/assets/qq-envelope/qq-envelope-back.png"
            alt=""
            aria-hidden
          />
          <div
            className={`receiver-envelope__card-wrap ${cardOpened ? 'receiver-envelope__card-wrap--opened' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={cardOpened ? '音信卡片已展开' : '点击展开音信卡片'}
            onClick={openCard}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCard();
              }
            }}
          >
            <div className={`receiver-envelope__card-inner ${cardOpened ? 'receiver-envelope__card-inner--opened' : ''}`}>
              <ReceivedYinxinCard
                song={card.song}
                lyric={card.selectedLyric}
                message={card.userMessage}
                messageType={card.messageType}
                voiceDuration={card.voiceDuration}
                hideMessageInLyric={card.hideMessageInLyric}
              />
            </div>
          </div>
          <img
            className="receiver-envelope__layer receiver-envelope__layer--front"
            src="/assets/qq-envelope/qq-envelope-front.png"
            alt=""
            aria-hidden
          />
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
