import { LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { ChipSelector } from '../../components/yinxin/ChipSelector';
import { useDraftActions, useYinxin } from '../../context/YinxinContext';
import type { Relationship, Scene, Tone } from '../../types/yinxin';

const relationships: { value: Relationship; label: string }[] = [
  { value: 'friend', label: '朋友' }, { value: 'lover', label: '恋人' }, { value: 'family', label: '家人' }, { value: 'teacher', label: '老师' }, { value: 'self', label: '自己' }, { value: 'other', label: '其他' },
];
const scenes: { value: Scene; label: string }[] = [
  { value: 'miss', label: '想念' }, { value: 'apology', label: '道歉' }, { value: 'farewell', label: '告别' }, { value: 'encourage', label: '鼓励' }, { value: 'thanks', label: '感谢' }, { value: 'mixed', label: '说不清的情绪' },
];
const tones: { value: Tone; label: string }[] = [
  { value: 'gentle', label: '温柔' }, { value: 'restrained', label: '克制' }, { value: 'sincere', label: '真诚' }, { value: 'light', label: '轻松' }, { value: 'poetic', label: '文艺' },
];

export function CreateYinxinPage() {
  const { draft } = useYinxin();
  const updateDraft = useDraftActions();
  const navigate = useNavigate();
  const ready = draft.message.trim().length > 0;
  return (
    <AppShell>
      <div className="page page--create">
        <PageHeader title="音信" backTo="/" />
        <section className="create-intro"><h1>有什么话，<br />想让歌替你说？</h1><p>把你想说的话写下来，模糊一点也没关系。</p></section>
        <label className="message-box">
          <textarea value={draft.message} maxLength={200} onChange={(event) => updateDraft({ message: event.target.value })} placeholder="比如：想和朋友和好，但不想说得太直接……" />
          <span>{draft.message.length}/200</span>
        </label>
        <div className="create-selectors">
          <ChipSelector label="写给谁" value={draft.relationship} options={relationships} onChange={(relationship) => updateDraft({ relationship })} />
          <ChipSelector label="这是什么心情" value={draft.scene} options={scenes} onChange={(scene) => updateDraft({ scene })} />
          <ChipSelector label="希望它听起来" value={draft.tone} options={tones} onChange={(tone) => updateDraft({ tone })} />
        </div>
        <div className="bottom-action">
          <button className="primary-button" disabled={!ready} onClick={() => navigate('/yinxin/generating')}>帮我找一首歌</button>
          <small><LockKeyhole size={12} /> 内容仅用于生成音信，不会公开</small>
        </div>
      </div>
    </AppShell>
  );
}
