import { ArrowLeft, BarChart2, ChevronRight, Clock, Mail, MessageCircle, MoreHorizontal, Music2, Send } from 'lucide-react';
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
  { value: 'all', label: '全部' },
  { value: 'lover', label: '恋人' },
  { value: 'friend', label: '朋友' },
  { value: 'family', label: '家人' },
  { value: 'teacher', label: '老师' },
  { value: 'other', label: '其他' },
];

const sourceLabels: Record<NonNullable<YinxinReplyData['source']>, string> = {
  wechat: '通过微信链接打开',
  qq: '通过 QQ 链接打开',
  qqmusic: '通过 QQ音乐私信打开',
  link: '通过分享链接打开',
};

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function SentListCard({ card, selected, onSelect }: { card: YinxinCardData; selected: boolean; onSelect: () => void }) {
  const replies = getReplies(card.shareId);
  return (
    <button className={`sent-list-card ${selected ? 'active' : ''}`} onClick={onSelect}>
      <CoverArt index={card.song.coverIndex} className="sent-list-card__cover" />
      <div className="sent-list-card__body">
        <small>寄给{relationshipLabel(card.relationship)}</small>
        <strong>{card.song.title}</strong>
        <span className="sent-list-card__lyric">"{card.selectedLyric.text}"</span>
        <div className="sent-list-card__meta">
          <span><Clock size={11} />{formatDate(card.createdAt)}</span>
          <span><BarChart2 size={11} />打开 {card.openCount ?? 0} 次</span>
          <span><Mail size={11} />{replies.length} 条回复</span>
        </div>
      </div>
      <ChevronRight size={16} className="sent-list-card__arrow" />
    </button>
  );
}

function ReplyItem({ reply, onAction }: { reply: YinxinReplyData; onAction: (reply: YinxinReplyData) => void }) {
  const musicCard = reply.replyShareId ? getYinxinCard(reply.replyShareId) : null;
  return (
    <article className="sent-reply-item">
      <header>
        <strong>{reply.viewerLabel ?? '一位收信人'}</strong>
        <span className="sent-reply-item__source">{sourceLabels[reply.source ?? 'link']}</span>
        <time>{formatDate(reply.createdAt)}</time>
      </header>
      <div className="sent-reply-item__type">
        {reply.type === 'music' ? <><Music2 size={12} />音乐回信</> : <><Mail size={12} />直接留言</>}
      </div>
      {musicCard
        ? (
          <div className="sent-reply-music">
            <CoverArt index={musicCard.song.coverIndex} className="sent-reply-music__cover" />
            <div>
              <strong>{musicCard.song.title}</strong>
              <span>歌词：{musicCard.selectedLyric.text}</span>
              <MockAudioPlayer id={`reply-${reply.replyId}`} compact />
            </div>
          </div>
        )
        : <p className="sent-reply-item__msg">{reply.message}</p>
      }
      <button className="sent-reply-item__btn" onClick={() => onAction(reply)}>
        {reply.type === 'music' ? '查看音乐回信' : '回复这条留言'}
      </button>
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
  const filtered = useMemo(
    () => filter === 'all' ? cards : cards.filter((c) => c.relationship === filter),
    [cards, filter],
  );
  const selected = cards.find((c) => c.shareId === shareId) ?? cards[0];
  const replies = selected ? getReplies(selected.shareId) : [];

  const notify = (msg: string) => {
    setModal(null);
    setToast(msg);
    window.setTimeout(() => setToast(''), 1600);
  };

  return (
    <AppShell light>
      <div className={`sent-page ${shareId ? 'sent-page--detail' : ''}`}>

        {/* 顶部导航 */}
        <header className="sent-page__header">
          <button className="sent-header-back" onClick={() => shareId ? navigate('/yinxin/sent') : navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <strong>我寄出的音信</strong>
          <button className="sent-header-manage" onClick={() => setModal('manage')}>
            <MoreHorizontal size={20} />
          </button>
        </header>

        <div className="sent-layout">
          {/* 左侧列表 */}
          <aside className="sent-list-pane">
            <div className="sent-filters" role="tablist">
              {filters.map((item) => (
                <button
                  key={item.value}
                  role="tab"
                  aria-selected={filter === item.value}
                  className={filter === item.value ? 'active' : ''}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="sent-list">
              {filtered.length
                ? filtered.map((card) => (
                    <SentListCard
                      key={card.shareId}
                      card={card}
                      selected={shareId === card.shareId}
                      onSelect={() => navigate(`/yinxin/sent/${card.shareId}`)}
                    />
                  ))
                : (
                    <div className="sent-empty">
                      <div className="sent-empty__icon"><Mail size={32} /></div>
                      <h2>这里还没有寄出的音信</h2>
                      <p>选择其他分类，或先去写一封音信。</p>
                      <button className="sent-empty__btn" onClick={() => navigate('/yinxin')}>写一封音信</button>
                    </div>
                  )
              }
            </div>
          </aside>

          {/* 右侧详情 */}
          {selected && (
            <main className="sent-detail-pane">
              <section className="sent-detail-letter">
                <header>
                  <span>寄给{relationshipLabel(selected.relationship)}</span>
                  <time>{formatDate(selected.createdAt)}</time>
                </header>
                <div className="sent-detail-letter__main">
                  <CoverArt index={selected.song.coverIndex} className="sent-detail-cover" />
                  <div>
                    <h1>{selected.song.title}</h1>
                    <p>歌词：{selected.selectedLyric.text}</p>
                    <blockquote>我想对你说：<br />{selected.userMessage}</blockquote>
                  </div>
                </div>
                <MockAudioPlayer id={`sent-${selected.shareId}`} compact />
                <footer>
                  <span><BarChart2 size={13} />链接已打开 {selected.openCount ?? 0} 次</span>
                  <div>
                    <button onClick={() => setModal('share')}><Send size={14} />再次分享</button>
                    <button onClick={() => notify('链接已复制')}><Mail size={14} />复制链接</button>
                  </div>
                </footer>
              </section>

              <section className="sent-replies">
                <h2>收到的回复（{replies.length}）</h2>
                {replies.length
                  ? replies.map((reply) => (
                      <ReplyItem key={reply.replyId} reply={reply} onAction={() => setModal('reply')} />
                    ))
                  : (
                      <div className="sent-empty sent-empty--compact">
                        <div className="sent-empty__icon sent-empty__icon--sm"><Mail size={22} /></div>
                        <h3>暂时还没有回复</h3>
                        <p>分享链接被打开后，任何收信人都可以留下回复。</p>
                        <button className="sent-empty__btn-ghost" onClick={() => setModal('share')}>再次分享</button>
                      </div>
                    )
                }
              </section>
            </main>
          )}
        </div>

        {/* 弹窗 */}
        {modal === 'manage' && (
          <WireframeModal title="管理寄出的音信" onClose={() => setModal(null)} onConfirm={() => notify('已进入管理模式')} confirmLabel="进入管理">
            <p>管理模式可选择、删除或批量分类寄出的音信。本原型仅模拟状态。</p>
          </WireframeModal>
        )}
        {modal === 'share' && (
          <WireframeModal title="再次分享音信" onClose={() => setModal(null)} onConfirm={() => notify('已模拟分享')} confirmLabel="确认分享">
            <div className="sent-share-options">
              <button><MessageCircle size={22} /><br />微信</button>
              <button><Send size={22} /><br />QQ</button>
              <button><Music2 size={22} /><br />QQ音乐私信</button>
            </div>
          </WireframeModal>
        )}
        {modal === 'reply' && (
          <WireframeModal title="回复这条留言" onClose={() => setModal(null)} onConfirm={() => notify('回复已发送')} confirmLabel="提交回复">
            <textarea className="wire-modal-textarea" placeholder="输入想回复的话……" />
          </WireframeModal>
        )}

        <Toast message={toast} />
      </div>
    </AppShell>
  );
}
