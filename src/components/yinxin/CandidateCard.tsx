import { ArrowRight, Sparkles } from 'lucide-react';
import type { YinxinCandidate } from '../../types/yinxin';
import { CoverArt } from './CoverArt';
import { MockAudioPlayer } from './MockAudioPlayer';

export function CandidateCard({ candidate, onSelect }: { candidate: YinxinCandidate; onSelect: () => void }) {
  return (
    <article className="candidate-card">
      <CoverArt index={candidate.song.coverIndex} className="candidate-card__cover" />
      <div className="candidate-card__body">
        <div className="candidate-card__title">
          <div><strong>{candidate.song.title}</strong><span>{candidate.song.artist} · {candidate.song.album}</span></div>
          <em>{candidate.emotionLabel}</em>
        </div>
        <blockquote>“{candidate.primaryLyric.text}”</blockquote>
        <p className="candidate-card__reason"><Sparkles size={14} />{candidate.aiReason}</p>
        <div className="candidate-card__actions">
          <MockAudioPlayer id={candidate.candidateId} compact />
          <button className="select-song" onClick={onSelect}>选这首 <ArrowRight size={15} /></button>
        </div>
      </div>
    </article>
  );
}
