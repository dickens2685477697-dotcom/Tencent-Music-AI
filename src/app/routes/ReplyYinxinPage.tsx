import { Check, MessageSquareText, Music2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { useYinxin } from '../../context/YinxinContext';
import { getYinxinCard, saveReply } from '../../services/shareStore';
import type { ReplyType } from '../../types/yinxin';

const quickReplies = [
  '我听懂了，也谢谢你告诉我。',
  '其实，我也一直很想你。',
  '谢谢你愿意把这些话告诉我。',
  '找个时间，我们好好聊聊吧。',
];

export function ReplyYinxinPage() {
  const { shareId = 'demo' } = useParams();
  const card = getYinxinCard(shareId);
  const navigate = useNavigate();
  const { dispatch } = useYinxin();
  const [type, setType] = useState<ReplyType>('message');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const ready = message.trim().length > 0;

  const submit = () => {
    if (!ready) return;
    if (type === 'message') {
      saveReply({ replyId: `reply_${Date.now()}`, shareId, type, message: message.trim(), source: 'link', viewerLabel: '一位收信人', createdAt: Date.now() });
      setDone(true);
      return;
    }
    dispatch({ type: 'START_REPLY', payload: { message: message.trim(), shareId } });
    navigate('/yinxin/generating');
  };

  if (done) {
    return (
      <AppShell light>
        <div className="page reply-done">
          <div className="reply-done__icon"><Check size={28} /></div>
          <h1>你的回复已经送达</h1>
          <p>这一次，没有借一首歌。<br />你的话已经足够动听。</p>
          <div className="reply-done__quote">"{message}"</div>
          <button className="reply-done__back" onClick={() => navigate(`/s/${shareId}`)}>
            回到这封音信
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell light>
      <div className="page reply-page">
        <PageHeader title="回一封音信" backTo={`/s/${shareId}`} />

        {/* 原始音信卡片 */}
        <div className="reply-source">
          <CoverArt index={card.song.coverIndex} className="reply-source__cover" />
          <div className="reply-source__info">
            <small>回复这封音信</small>
            <strong>"{card.selectedLyric.text}"</strong>
          </div>
        </div>

        <p className="reply-instruction">选择一种方式，回应 TA</p>

        {/* 回复方式 */}
        <div className="reply-types">
          <button className={type === 'message' ? 'active' : ''} onClick={() => setType('message')}>
            <span className="reply-types__icon"><MessageSquareText size={20} /></span>
            <div>
              <strong>直接留言</strong>
              <small>写几句话回应 TA，不选择音乐</small>
            </div>
            {type === 'message' && <span className="reply-types__check"><Check size={14} /></span>}
          </button>
          <button className={type === 'music' ? 'active' : ''} onClick={() => setType('music')}>
            <span className="reply-types__icon"><Music2 size={20} /></span>
            <div>
              <strong>用音乐回信</strong>
              <small>也让一首歌替你说</small>
            </div>
            {type === 'music' && <span className="reply-types__check"><Check size={14} /></span>}
          </button>
        </div>

        {/* 输入框 */}
        <div className="reply-input-section">
          <label className="reply-input-label">
            {type === 'message' ? '想对 TA 说的话' : '想让歌替你说的话'}
          </label>
          <div className="reply-textarea-wrap">
            <textarea
              maxLength={200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="比如：其实我也一直想和你说……"
            />
            <span className="reply-textarea-counter">{message.length}/200</span>
          </div>
        </div>

        {/* 快捷回复 */}
        <section className="quick-replies">
          <span>快捷回复</span>
          <div>
            {quickReplies.map((reply) => (
              <button key={reply} onClick={() => setMessage(reply)}>{reply}</button>
            ))}
          </div>
        </section>

        {/* 底部按钮 */}
        <div className="reply-cta">
          <button className="reply-cta__btn" disabled={!ready} onClick={submit}>
            {type === 'message' ? '发送回复' : '帮我找一首回信'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
