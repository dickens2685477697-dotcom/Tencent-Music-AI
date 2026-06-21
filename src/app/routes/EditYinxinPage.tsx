import { Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { YinxinMusicCard } from '../../components/yinxin/YinxinMusicCard';
import { WireframeModal } from '../../components/yinxin/WireframeModal';
import { usePlayer } from '../../context/PlayerContext';
import { useYinxin } from '../../context/YinxinContext';
import { createShareId, saveReply, saveYinxinCard } from '../../services/shareStore';
import type { CardStyle } from '../../types/yinxin';

const styles: { value: CardStyle; label: string }[] = [
  { value: 'midnight', label: '午夜耳语' }, { value: 'green', label: '绿色唱片' }, { value: 'minimal', label: '极简留白' },
];

export function EditYinxinPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { selectedCandidate, selectedLyric, cardCopy, cardStyle, draft, dispatch } = useYinxin();
  const player = usePlayer();
  const navigate = useNavigate();
  if (!selectedCandidate || !selectedLyric) return <AppShell><div className="page empty-page"><PageHeader title="编辑音信" backTo="/yinxin/results" /><h1>先选一首歌</h1><button className="primary-button" onClick={() => navigate('/yinxin/results')}>返回候选</button></div></AppShell>;
  const lyricOptions = [selectedCandidate.primaryLyric, ...selectedCandidate.alternativeLyrics];
  const generate = () => {
    const shareId = createShareId();
    saveYinxinCard({
      shareId,
      candidateId: selectedCandidate.candidateId,
      song: selectedCandidate.song,
      selectedLyric,
      userMessage: cardCopy.trim() || selectedCandidate.cardCopy,
      aiReason: selectedCandidate.aiReason,
      cardStyle,
      senderName: draft.mode === 'reply' ? '音信的回复者' : '一位朋友',
      createdAt: Date.now(),
      replyToShareId: draft.replyToShareId,
      relationship: draft.relationship,
      openCount: 0,
    });
    if (draft.mode === 'reply' && draft.replyToShareId) {
      saveReply({ replyId: `reply_${Date.now()}`, shareId: draft.replyToShareId, type: 'music', replyShareId: shareId, createdAt: Date.now() });
    }
    navigate(`/yinxin/share/${shareId}`);
  };
  return (
    <AppShell>
      <div className="page edit-page">
        <PageHeader title="编辑音信" backTo="/yinxin/results" action={<button className="header-action-button" onClick={() => setPreviewOpen(true)}>预览</button>} />
        <YinxinMusicCard song={selectedCandidate.song} lyric={selectedLyric} message={cardCopy} style={cardStyle} />
        <section className="edit-control"><label>想对 TA 说的话</label><div className="edit-textarea"><textarea maxLength={80} value={cardCopy} onChange={(event) => dispatch({ type: 'SET_COPY', payload: event.target.value })} /><span>{cardCopy.length}/80</span></div></section>
        <section className="edit-control"><label>选择歌词片段</label><div className="lyric-options">{lyricOptions.map((lyric) => <button className={lyric.segmentId === selectedLyric.segmentId ? 'active' : ''} onClick={() => { player.reset(); dispatch({ type: 'SET_LYRIC', payload: lyric }); }} key={lyric.segmentId}><span>“{lyric.text}”</span>{lyric.segmentId === selectedLyric.segmentId ? <Check size={16} /> : <ChevronRight size={16} />}</button>)}</div></section>
        <section className="edit-control"><label>选择视觉风格</label><div className="style-options">{styles.map((style, index) => <button className={`style-option style-option--${style.value} ${cardStyle === style.value ? 'active' : ''}`} onClick={() => dispatch({ type: 'SET_STYLE', payload: style.value })} key={style.value}><i>{index === 0 ? '☾' : index === 1 ? '◉' : '〰'}</i><span>{style.label}</span>{cardStyle === style.value ? <Check size={13} /> : null}</button>)}</div></section>
        <div className="bottom-action bottom-action--solid"><button className="primary-button" onClick={generate}>确认并生成</button></div>
        {previewOpen ? <WireframeModal title="音信预览" onClose={() => setPreviewOpen(false)}><YinxinMusicCard song={selectedCandidate.song} lyric={selectedLyric} message={cardCopy} style={cardStyle} interactive={false} /></WireframeModal> : null}
      </div>
    </AppShell>
  );
}
