import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { MockAudioPlayer } from '../../components/yinxin/MockAudioPlayer';
import { Toast } from '../../components/yinxin/Toast';
import { WireframeModal } from '../../components/yinxin/WireframeModal';
import { getReplies, getSentCards, getYinxinCard, relationshipLabel } from '../../services/shareStore';
import type { Relationship, YinxinCardData, YinxinReplyData } from '../../types/yinxin';

type Filter = 'all' | Relationship;

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: '全部' }, { value: 'lover', label: '恋人' }, { value: 'friend', label: '朋友' },
  { value: 'family', label: '家人' }, { value: 'teacher', label: '老师' }, { value: 'other', label: '其他' },
];

const sourceLabels: Record<NonNullable<YinxinReplyData['source']>, string> = {
  wechat: '通过微信链接打开', qq: '通过 QQ 链接打开', qqmusic: '通过 QQ音乐私信打开', link: '通过分享链接打开',
};

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function SentListCard({ card, selected, onSelect }: { card: YinxinCardData; selected: boolean; onSelect: () => void }) {
  const replies = getReplies(card.shareId);
  return (
    <button className={`sent-list-card ${selected ? 'active' : ''}`} onClick={onSelect}>
      <CoverArt index={card.song.coverIndex} />
      <span className="sent-list-card__body">
        <small>寄给{relationshipLabel(card.relationship)}</small>
        <strong>{card.song.title}</strong>
        <span>歌词：{card.selectedLyric.text}</span>
        <time>发送时间：{formatDate(card.createdAt)}</time>
      </span>
      <span className="sent-list-card__metrics"><span>图标占位　链接已打开 {card.openCount ?? 0} 次</span><span>图标占位　收到 {replies.length} 条回复</span></span>
      <b>查看音信与回复　›</b>
    </button>
  );
}

function ReplyItem({ reply, onAction }: { reply: YinxinReplyData; onAction: (reply: YinxinReplyData) => void }) {
  const musicCard = reply.replyShareId ? getYinxinCard(reply.replyShareId) : null;
  return (
    <article className="sent-reply-item">
      <header><strong>{reply.viewerLabel ?? '一位收信人'}</strong><span>{sourceLabels[reply.source ?? 'link']}</span><time>{formatDate(reply.createdAt)}</time></header>
      <div className="sent-reply-item__type">{reply.type === 'music' ? '音乐回信' : '直接留言'}</div>
      {musicCard ? <div className="sent-reply-music"><CoverArt index={musicCard.song.coverIndex} /><div><strong>{musicCard.song.title}</strong><span>歌词：{musicCard.selectedLyric.text}</span><MockAudioPlayer id={`reply-${reply.replyId}`} compact /></div></div> : <p>{reply.message}</p>}
      <button className="secondary-button" onClick={() => onAction(reply)}>{reply.type === 'music' ? '查看音乐回信' : '回复这条留言'}</button>
    </article>
  );
}

export function SentLettersPage() {
  const navigate = useNavigate();
  const { shareId } = useParams();
  const [filter, setFilter] = useState<Filter>('all');
  const [modal, setModal] = useState<'manage' | 'share' | 'reply' | null>(null);
  const [toast, setToast] = useState('');
  const cards = getSentCards();
  const filtered = useMemo(() => filter === 'all' ? cards : cards.filter((card) => card.relationship === filter), [cards, filter]);
  const selected = cards.find((card) => card.shareId === shareId) ?? cards[0];
  const replies = selected ? getReplies(selected.shareId) : [];
  const notify = (message: string) => { setModal(null); setToast(message); window.setTimeout(() => setToast(''), 1600); };
  return (
    <AppShell light>
      <div className={`sent-page ${shareId ? 'sent-page--detail' : ''}`}>
        <header className="sent-page__header"><button onClick={() => shareId ? navigate('/yinxin/sent') : navigate('/')}>图标占位</button><strong>我寄出的音信</strong><button onClick={() => setModal('manage')}>管理</button></header>
        <div className="sent-layout">
          <aside className="sent-list-pane">
            <div className="sent-filters" role="tablist">{filters.map((item) => <button role="tab" aria-selected={filter === item.value} className={filter === item.value ? 'active' : ''} onClick={() => setFilter(item.value)} key={item.value}>{item.label}</button>)}</div>
            <div className="sent-list">{filtered.length ? filtered.map((card) => <SentListCard card={card} selected={shareId === card.shareId} onSelect={() => navigate(`/yinxin/sent/${card.shareId}`)} key={card.shareId} />) : <section className="wire-empty"><div>图片占位</div><h2>这里还没有寄出的音信</h2><p>选择其他分类，或先去写一封音信。</p><button className="primary-button" onClick={() => navigate('/yinxin')}>写一封音信</button></section>}</div>
          </aside>
          {selected ? <main className="sent-detail-pane">
            <section className="sent-detail-letter">
              <header><span>寄给{relationshipLabel(selected.relationship)}</span><time>{formatDate(selected.createdAt)}</time></header>
              <div className="sent-detail-letter__main"><CoverArt index={selected.song.coverIndex} /><div><h1>{selected.song.title}</h1><p>歌词：{selected.selectedLyric.text}</p><blockquote>我想对你说：<br />{selected.userMessage}</blockquote></div></div>
              <MockAudioPlayer id={`sent-${selected.shareId}`} compact />
              <footer><span>图标占位　分享链接状态：已打开 {selected.openCount ?? 0} 次</span><button onClick={() => setModal('share')}>再次分享</button><button onClick={() => notify('链接已复制')}>复制链接</button></footer>
            </section>
            <section className="sent-replies"><h2>收到的回复（{replies.length}）</h2>{replies.length ? replies.map((reply) => <ReplyItem reply={reply} onAction={() => setModal('reply')} key={reply.replyId} />) : <div className="wire-empty wire-empty--compact"><div>图片占位</div><h3>暂时还没有回复</h3><p>分享链接被打开后，任何收信人都可以留下回复。</p><button className="secondary-button" onClick={() => setModal('share')}>再次分享</button></div>}</section>
          </main> : null}
        </div>
        {modal === 'manage' ? <WireframeModal title="管理寄出的音信" onClose={() => setModal(null)} onConfirm={() => notify('已进入管理模式')} confirmLabel="进入管理"><p>管理模式可选择、删除或批量分类寄出的音信。本原型仅模拟状态。</p></WireframeModal> : null}
        {modal === 'share' ? <WireframeModal title="再次分享音信" onClose={() => setModal(null)} onConfirm={() => notify('已模拟分享')} confirmLabel="确认分享"><div className="wire-share-options"><button>图标占位<br />微信</button><button>图标占位<br />QQ</button><button>图标占位<br />QQ音乐私信</button></div></WireframeModal> : null}
        {modal === 'reply' ? <WireframeModal title="回复这条留言" onClose={() => setModal(null)} onConfirm={() => notify('回复已发送')} confirmLabel="提交回复"><textarea className="wire-modal-textarea" placeholder="输入想回复的话……" /></WireframeModal> : null}
        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
