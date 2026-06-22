import { Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { MockAudioPlayer } from '../../components/yinxin/MockAudioPlayer';
import { WireframeModal } from '../../components/yinxin/WireframeModal';
import { YinxinMusicCard } from '../../components/yinxin/YinxinMusicCard';
import { usePlayer } from '../../context/PlayerContext';
import { useYinxin } from '../../context/YinxinContext';
import { createShareId, saveReply, saveYinxinCard } from '../../services/shareStore';
import type { CardStyle } from '../../types/yinxin';

const STYLES: { value: CardStyle; label: string; icon: string }[] = [
  { value: 'midnight', label: '午夜耳语', icon: '☾' },
  { value: 'green',    label: '绿色唱片', icon: '◉' },
  { value: 'minimal',  label: '极简留白', icon: '〰' },
];

export function EditYinxinPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { selectedCandidate, selectedLyric, cardCopy, cardStyle, draft, dispatch } = useYinxin();
  const player = usePlayer();
  const navigate = useNavigate();

  if (!selectedCandidate || !selectedLyric) {
    return (
      <AppShell>
        <div className="page empty-page">
          <PageHeader title="编辑音信" backTo="/yinxin/results" />
          <h1>先选一首歌</h1>
          <button className="primary-button" onClick={() => navigate('/yinxin/results')}>返回候选</button>
        </div>
      </AppShell>
    );
  }

  const lyricOptions = [selectedCandidate.primaryLyric, ...selectedCandidate.alternativeLyrics];
  const selectedIndex = lyricOptions.findIndex(l => l.segmentId === selectedLyric.segmentId);

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
        {/* Header：无操作按钮 */}
        <PageHeader title="编辑音信" backTo="/yinxin/results" />

        {/* ── 音乐预览卡片（Figma YinxinMusicCard 360×207） ── */}
        <div className="edit-music-card">
          <div className="edit-music-card__row">
            <CoverArt index={selectedCandidate.song.coverIndex} className="edit-music-card__cover" />
            <div className="edit-music-card__info">
              <div className="edit-music-card__titles">
                <strong>{selectedCandidate.song.title}</strong>
                <span>{selectedCandidate.song.artist}</span>
              </div>
              <div className="edit-music-card__lyric-row">
                <span className="emc-q">"</span>
                <span className="emc-lyric">{selectedLyric.text}</span>
                <span className="emc-q emc-q--close">"</span>
              </div>
            </div>
          </div>
          <div className="edit-music-card__player">
            <MockAudioPlayer id={`${selectedCandidate.song.songId}-${selectedLyric.segmentId}`} compact />
          </div>
        </div>

        {/* ── 想对 TA 说的话 ── */}
        <section className="edit-section">
          <label className="edit-section__label">想对 TA 说的话</label>
          <div className="edit-textarea-wrap">
            <textarea
              maxLength={80}
              value={cardCopy}
              placeholder="说说你想表达的话…"
              onChange={(e) => dispatch({ type: 'SET_COPY', payload: e.target.value })}
            />
            <span className="edit-textarea-counter">{cardCopy.length}/80</span>
          </div>
        </section>

        {/* ── 选择歌词片段（iOS 轮盘样式） ── */}
        <section className="edit-section">
          <label className="edit-section__label">选择歌词片段</label>
          {/* 轮盘窗口：固定高度，内部 track 平移实现居中 */}
          <div className="lyric-wheel">
            {/* 顶部 / 底部渐变遮罩 */}
            <div className="lyric-wheel__fade lyric-wheel__fade--top" />
            <div className="lyric-wheel__fade lyric-wheel__fade--bottom" />
            {/* 选中区域高亮条 */}
            <div className="lyric-wheel__bar" />
            {/* 可平移轨道：translate 使选中项居中 */}
            <div
              className="lyric-wheel__track"
              style={{ transform: `translateY(${-selectedIndex * 56}px)` }}
            >
              {/* 上方 2 个空白填充，保证第一个选项可以居中 */}
              <div className="lyric-wheel__item lyric-wheel__item--pad" />
              <div className="lyric-wheel__item lyric-wheel__item--pad" />

              {lyricOptions.map((lyric, i) => {
                const dist = Math.abs(i - selectedIndex);
                const isActive = lyric.segmentId === selectedLyric.segmentId;
                return (
                  <button
                    key={lyric.segmentId}
                    className={`lyric-wheel__item ${isActive ? 'active' : ''}`}
                    style={{
                      opacity: dist === 0 ? 1 : dist === 1 ? 0.52 : 0.22,
                      fontSize: dist === 0 ? '15px' : dist === 1 ? '14px' : '13px',
                    }}
                    onClick={() => { player.reset(); dispatch({ type: 'SET_LYRIC', payload: lyric }); }}
                  >
                    {isActive && (
                      <span className="lyric-wheel__check" aria-hidden>
                        <Check size={13} strokeWidth={2.8} />
                      </span>
                    )}
                    <span className="lyric-wheel__text">{lyric.text}</span>
                  </button>
                );
              })}

              {/* 下方 2 个空白填充 */}
              <div className="lyric-wheel__item lyric-wheel__item--pad" />
              <div className="lyric-wheel__item lyric-wheel__item--pad" />
            </div>
          </div>
        </section>

        {/* ── 选择视觉风格 ── */}
        <section className="edit-section">
          <label className="edit-section__label">选择视觉风格</label>
          <div className="style-options">
            {STYLES.map((s) => (
              <button
                key={s.value}
                className={`style-option style-option--${s.value} ${cardStyle === s.value ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_STYLE', payload: s.value })}
                aria-pressed={cardStyle === s.value}
              >
                <i>{s.icon}</i>
                <span>{s.label}</span>
                {cardStyle === s.value && (
                  <span className="style-option__badge" aria-hidden>
                    <Check size={8} strokeWidth={3} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 底部确认按钮 */}
        <div className="edit-cta">
          <button className="edit-cta__btn" onClick={generate}>确认并生成</button>
        </div>

        {previewOpen && (
          <WireframeModal title="音信预览" onClose={() => setPreviewOpen(false)}>
            <YinxinMusicCard song={selectedCandidate.song} lyric={selectedLyric} message={cardCopy} style={cardStyle} interactive={false} />
          </WireframeModal>
        )}
      </div>
    </AppShell>
  );
}
