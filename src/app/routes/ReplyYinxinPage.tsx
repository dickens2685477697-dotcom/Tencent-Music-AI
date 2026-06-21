import { Check, MessageSquareText, Music2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { useYinxin } from '../../context/YinxinContext';
import { getYinxinCard, saveReply } from '../../services/shareStore';
import type { ReplyType } from '../../types/yinxin';

const quickReplies = ['我听懂了，也谢谢你告诉我。', '其实，我也一直很想你。', '谢谢你愿意把这些话告诉我。', '找个时间，我们好好聊聊吧。'];

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
  if (done) return <AppShell><div className="page reply-done"><div className="reply-done__icon"><Check size={30} /></div><h1>你的回复已经送达</h1><p>这一次，没有借一首歌。<br />你的话已经足够动听。</p><div className="reply-quote">“{message}”</div><button className="secondary-button" onClick={() => navigate(`/s/${shareId}`)}>回到这封音信</button></div></AppShell>;
  return (
    <AppShell>
      <div className="page reply-page">
        <PageHeader title="回一封音信" backTo={`/s/${shareId}`} />
        <div className="reply-source"><CoverArt index={card.song.coverIndex} /><span><small>回复这封音信</small><strong>“{card.selectedLyric.text}”</strong></span></div>
        <p className="reply-instruction">选择一种方式，回应 TA</p>
        <div className="reply-types">
          <button className={type === 'message' ? 'active' : ''} onClick={() => setType('message')}><span><MessageSquareText /></span><div><strong>直接留言</strong><small>写几句话回应 TA，不选择音乐</small></div>{type === 'message' ? <Check size={17} /> : null}</button>
          <button className={type === 'music' ? 'active' : ''} onClick={() => setType('music')}><span><Music2 /></span><div><strong>用音乐回信</strong><small>也让一首歌替你说</small></div>{type === 'music' ? <Check size={17} /> : null}</button>
        </div>
        <label className="reply-input"><span>{type === 'message' ? '想对 TA 说的话' : '想让歌替你说的话'}</span><textarea maxLength={200} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="比如：其实我也一直想和你说……" /><small>{message.length}/200</small></label>
        <section className="quick-replies"><span>快捷回复</span><div>{quickReplies.map((reply) => <button onClick={() => setMessage(reply)} key={reply}>{reply}</button>)}</div></section>
        <div className="bottom-action bottom-action--solid"><button className="primary-button" disabled={!ready} onClick={submit}>{type === 'message' ? '发送回复' : '帮我找一首回信'}</button></div>
      </div>
    </AppShell>
  );
}
