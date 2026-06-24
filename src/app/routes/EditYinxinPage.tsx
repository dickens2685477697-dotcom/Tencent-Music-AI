import { Check, LockKeyhole, MessageSquareText, Mic, UnlockKeyhole } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CoverArt } from '../../components/yinxin/CoverArt';
import { MockAudioPlayer } from '../../components/yinxin/MockAudioPlayer';
import { ReceivedYinxinCard } from '../../components/yinxin/ReceivedYinxinCard';
import { WireframeModal } from '../../components/yinxin/WireframeModal';
import { usePlayer } from '../../context/PlayerContext';
import { useYinxin } from '../../context/YinxinContext';
import { createShareId, saveReply, saveYinxinCard } from '../../services/shareStore';
import type { LyricSegment, YinxinMessageType } from '../../types/yinxin';

export function EditYinxinPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewEnvelopeOpened, setPreviewEnvelopeOpened] = useState(false);
  const [messageType, setMessageType] = useState<YinxinMessageType>('text');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [hasVoiceRecording, setHasVoiceRecording] = useState(false);
  const [voiceTake, setVoiceTake] = useState(0);
  const [hideMessageInLyric, setHideMessageInLyric] = useState(false);
  const wheelRef = useRef<HTMLDivElement | null>(null);
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
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const voiceDuration = 30;
  const canGenerate = messageType === 'text' || hasVoiceRecording;
  const lyricDisplayText = selectedLyric.text.replace(/[ \u3000]+/g, '\n');

  useEffect(() => {
    if (wheelRef.current) wheelRef.current.scrollTop = safeSelectedIndex * 56;
  }, [safeSelectedIndex]);

  useEffect(() => {
    if (!previewOpen) {
      setPreviewEnvelopeOpened(false);
      return;
    }
    const timer = window.setTimeout(() => setPreviewEnvelopeOpened(true), 180);
    return () => window.clearTimeout(timer);
  }, [previewOpen]);

  const selectLyric = (lyric: LyricSegment) => {
    if (lyric.segmentId === selectedLyric.segmentId) return;
    player.reset();
    dispatch({ type: 'SET_LYRIC', payload: lyric });
  };

  const handleLyricScroll = () => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const nextIndex = Math.max(0, Math.min(lyricOptions.length - 1, Math.round(wheel.scrollTop / 56)));
    const nextLyric = lyricOptions[nextIndex];
    if (nextLyric && nextLyric.segmentId !== selectedLyric.segmentId) selectLyric(nextLyric);
  };

  const startVoiceRecording = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    player.reset();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsRecordingVoice(true);
  };

  const finishVoiceRecording = () => {
    if (!isRecordingVoice) return;
    setIsRecordingVoice(false);
    setHasVoiceRecording(true);
    setVoiceTake((take) => take + 1);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
  };

  const generate = () => {
    if (!canGenerate) return;
    const shareId = createShareId();
    const savedMessageType: YinxinMessageType = messageType === 'voice' && hasVoiceRecording ? 'voice' : 'text';
    saveYinxinCard({
      shareId,
      candidateId: selectedCandidate.candidateId,
      song: selectedCandidate.song,
      selectedLyric,
      userMessage: cardCopy.trim() || selectedCandidate.cardCopy,
      messageType: savedMessageType,
      hideMessageInLyric,
      voiceDuration: savedMessageType === 'voice' ? voiceDuration : undefined,
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

  const replayPreviewEnvelope = () => {
    setPreviewEnvelopeOpened(false);
    window.setTimeout(() => setPreviewEnvelopeOpened(true), 100);
  };

  return (
    <AppShell>
      <div className="page edit-page">
        {/* Header：无操作按钮 */}
        <PageHeader
          title="编辑音信"
          backTo="/yinxin/results"
          action={(
            <button type="button" className="edit-preview-btn" onClick={() => setPreviewOpen(true)}>
              预览
            </button>
          )}
        />

        {/* ── 音乐预览卡片（Figma YinxinMusicCard 360×207） ── */}
        <div className="edit-music-card">
          <div className="edit-music-card__row">
            <CoverArt index={selectedCandidate.song.coverIndex} src={selectedCandidate.song.coverUrl} className="edit-music-card__cover" />
            <div className="edit-music-card__info">
              <div className="edit-music-card__title-line">
                <strong>{selectedCandidate.song.title}</strong>
                <span>{selectedCandidate.song.artist}</span>
              </div>
              <div className="edit-music-card__lyric-block">
                <span className="edit-music-card__badge">
                  <i aria-hidden>♪</i>
                  最佳匹配歌词
                </span>
                <div className="edit-music-card__lyric-row">
                  <span className="emc-q" aria-hidden>“</span>
                  <p className="emc-lyric">{lyricDisplayText}</p>
                  <span className="emc-q emc-q--close" aria-hidden>”</span>
                </div>
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
          <div className="message-mode-tabs" role="tablist" aria-label="选择音信内容类型">
            <button
              type="button"
              className={messageType === 'text' ? 'active' : ''}
              aria-pressed={messageType === 'text'}
              onClick={() => setMessageType('text')}
            >
              <MessageSquareText size={15} />
              普通输入
            </button>
            <button
              type="button"
              className={messageType === 'voice' ? 'active' : ''}
              aria-pressed={messageType === 'voice'}
              onClick={() => setMessageType('voice')}
            >
              <Mic size={15} />
              语音
            </button>
          </div>
          {messageType === 'text' ? (
            <div className="edit-textarea-wrap">
              <textarea
                maxLength={80}
                value={cardCopy}
                placeholder="说说你想表达的话…"
                onChange={(e) => dispatch({ type: 'SET_COPY', payload: e.target.value })}
              />
              <span className="edit-textarea-counter">{cardCopy.length}/80</span>
            </div>
          ) : (
            <div className={`voice-recording-area ${isRecordingVoice ? 'is-recording' : ''}`}>
              {!hasVoiceRecording ? (
                <button
                  type="button"
                  className="voice-record-button"
                  aria-label={isRecordingVoice ? '正在录入语音，松手完成' : '按住录入语音'}
                  onPointerDown={startVoiceRecording}
                  onPointerUp={finishVoiceRecording}
                  onPointerCancel={cancelVoiceRecording}
                >
                  <span className="voice-record-button__icon">
                    <Mic size={22} />
                  </span>
                  <strong>{isRecordingVoice ? '正在录入语音' : '按住录入语音'}</strong>
                  <small>{isRecordingVoice ? '松手完成录入' : '最长可录入 30 秒'}</small>
                </button>
              ) : (
                <div className={`voice-message-box ${isRecordingVoice ? 'is-recording' : ''}`} aria-busy={isRecordingVoice}>
                  <button
                    type="button"
                    className="voice-message-box__record"
                    aria-label={isRecordingVoice ? '正在录入语音，松手完成' : '按住重新录入语音'}
                    onPointerDown={startVoiceRecording}
                    onPointerUp={finishVoiceRecording}
                    onPointerCancel={cancelVoiceRecording}
                  >
                    <Mic size={18} />
                    {isRecordingVoice ? <span className="voice-message-box__record-status">录音中</span> : null}
                  </button>
                  <div className="voice-message-box__body">
                    <strong>已录入一段语音</strong>
                    <MockAudioPlayer id={`draft-voice-${selectedCandidate.candidateId}-${voiceTake}`} compact label="播放语音留言" />
                  </div>
                  <span>{voiceDuration}s</span>
                  {isRecordingVoice ? <div className="voice-message-box__mask" aria-hidden /> : null}
                </div>
              )}
              <div className="voice-recording-area__hint">
                {hasVoiceRecording ? '按住左侧录音按钮可重新录入并覆盖上一段。' : '按住按钮开始，说完松手即保存。'}
              </div>
            </div>
          )}
          <button
            type="button"
            className={`hide-in-lyric-toggle ${hideMessageInLyric ? 'active' : ''}`}
            aria-pressed={hideMessageInLyric}
            onClick={() => setHideMessageInLyric((value) => !value)}
          >
            <span>{hideMessageInLyric ? <LockKeyhole size={16} /> : <UnlockKeyhole size={16} />}</span>
            <b>{hideMessageInLyric ? '已藏在下面的歌词片段中' : '不藏在歌词片段中'}</b>
          </button>
          <div className="message-visibility-note">
            {hideMessageInLyric ? '收信人在封面上只会看到歌词，不会直接看到这段文字或语音。' : '收信人打开封面时会直接看到你的文字；语音会显示为可播放控件。'}
          </div>
        </section>

        {/* ── 选择歌词片段（iOS 轮盘样式） ── */}
        <section className="edit-section">
          <div className="edit-section__head">
            <label className="edit-section__label">选择歌词片段</label>
          </div>
          {/* 轮盘：仅选中项显示绿色底 */}
          <div className="lyric-wheel" ref={wheelRef} onScroll={handleLyricScroll}>
            {lyricOptions.map((lyric, i) => {
              const dist = Math.abs(i - safeSelectedIndex);
              const isActive = lyric.segmentId === selectedLyric.segmentId;
              return (
                <button
                  key={lyric.segmentId}
                  className={`lyric-wheel__item ${isActive ? 'active' : ''}`}
                  style={{
                    opacity: dist === 0 ? 1 : dist === 1 ? 0.5 : 0.22,
                    fontSize: dist === 0 ? '15px' : dist === 1 ? '14px' : '13px',
                  }}
                  onClick={() => selectLyric(lyric)}
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
          </div>
        </section>

        {/* 底部确认按钮 */}
        <div className="edit-cta">
          <button className="edit-cta__btn" onClick={generate} disabled={!canGenerate}>确认并生成</button>
        </div>

        {previewOpen && (
          <WireframeModal title="音信预览" onClose={() => setPreviewOpen(false)}>
            <div className="preview-envelope-scene">
              <div className="receiver-envelope receiver-envelope--preview">
                <img
                  className="receiver-envelope__layer receiver-envelope__layer--back"
                  src="/assets/qq-envelope/qq-envelope-back.png"
                  alt=""
                  aria-hidden
                />
                <div className={`receiver-envelope__card-wrap ${previewEnvelopeOpened ? 'receiver-envelope__card-wrap--opened' : ''}`}>
                  <div className={`receiver-envelope__card-inner ${previewEnvelopeOpened ? 'receiver-envelope__card-inner--opened' : ''}`}>
                    <ReceivedYinxinCard
                      song={selectedCandidate.song}
                      lyric={selectedLyric}
                      message={cardCopy}
                      messageType={messageType}
                      hideMessageInLyric={hideMessageInLyric}
                      voiceDuration={voiceDuration}
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
              <button type="button" className="text-button preview-envelope-replay" onClick={replayPreviewEnvelope}>
                重播动效
              </button>
            </div>
          </WireframeModal>
        )}
      </div>
    </AppShell>
  );
}
