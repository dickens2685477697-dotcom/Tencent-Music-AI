import {
  CloudMoon,
  DoorOpen,
  Feather,
  GraduationCap,
  HelpCircle,
  Heart,
  Leaf,
  LogOut,
  LockKeyhole,
  Smile,
  Star,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { ChipSelector } from '../../components/yinxin/ChipSelector';
import { useDraftActions, useYinxin } from '../../context/YinxinContext';
import type { Relationship, Scene, Tone } from '../../types/yinxin';

const relationships: { value: Relationship; label: string; icon: React.ReactNode }[] = [
  { value: 'friend',  label: '朋友', icon: <User size={13} strokeWidth={2} /> },
  { value: 'lover',   label: '恋人', icon: <Heart size={13} strokeWidth={2} /> },
  { value: 'family',  label: '家人', icon: <Users size={13} strokeWidth={2} /> },
  { value: 'teacher', label: '老师', icon: <GraduationCap size={13} strokeWidth={2} /> },
  { value: 'self',    label: '自己', icon: <User size={13} strokeWidth={2} /> },
  { value: 'other',   label: '其他', icon: <LogOut size={13} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} /> },
];

const scenes: { value: Scene; label: string; icon: React.ReactNode }[] = [
  { value: 'miss',     label: '想念',       icon: <CloudMoon size={13} strokeWidth={2} /> },
  { value: 'apology',  label: '道歉',       icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/></svg> },
  { value: 'farewell', label: '告别',       icon: <DoorOpen size={13} strokeWidth={2} /> },
  { value: 'encourage',label: '鼓励',       icon: <Zap size={13} strokeWidth={2} /> },
  { value: 'thanks',   label: '感谢',       icon: <Heart size={13} strokeWidth={2} /> },
  { value: 'mixed',    label: '说不清的情绪', icon: <HelpCircle size={13} strokeWidth={2} /> },
];

const tones: { value: Tone; label: string; icon: React.ReactNode }[] = [
  { value: 'gentle',     label: '温柔', icon: <Leaf size={13} strokeWidth={2} /> },
  { value: 'restrained', label: '克制', icon: <Feather size={13} strokeWidth={2} /> },
  { value: 'sincere',    label: '真诚', icon: <Heart size={13} strokeWidth={2} /> },
  { value: 'light',      label: '轻松', icon: <Smile size={13} strokeWidth={2} /> },
  { value: 'poetic',     label: '文艺', icon: <Star size={13} strokeWidth={2} /> },
];

export function CreateYinxinPage() {
  const { draft } = useYinxin();
  const updateDraft = useDraftActions();
  const navigate = useNavigate();
  const ready = draft.message.trim().length > 0;

  return (
    <AppShell light>
      <div className="page page--create">

        {/* Hero 区：Figma 背景图 + 标题 */}
        <div className="create-hero">
          <PageHeader title="音信" backTo="/home" />
          <div className="create-hero__content">
            <span className="create-hero__quote">&ldquo;</span>
            <h1>有什么话，<br />想让歌替你说？</h1>
            <p className="create-hero__sub">把你想说的话写下来，模糊一点也没关系。</p>
          </div>
        </div>

        {/* 主体区 */}
        <div className="create-body">

          {/* 浮动输入卡片 */}
          <div className="create-card">
            <label className="message-box">
              <textarea
                value={draft.message}
                maxLength={200}
                onChange={(e) => updateDraft({ message: e.target.value })}
                placeholder="比如：想和朋友和好，但不想说得太直接......"
              />
              <span>{draft.message.length}/200</span>
            </label>
          </div>

          {/* 选项区 */}
          <div className="create-selectors">
            <ChipSelector
              label="写给谁"
              value={draft.relationship}
              options={relationships}
              onChange={(relationship) => updateDraft({ relationship })}
            />
            <ChipSelector
              label="这是什么心情"
              value={draft.scene}
              options={scenes}
              onChange={(scene) => updateDraft({ scene })}
            />
            <ChipSelector
              label="希望它听起来"
              value={draft.tone}
              options={tones}
              onChange={(tone) => updateDraft({ tone })}
            />
          </div>

          {/* 底部 CTA */}
          <div className="bottom-action--light">
            <button
              className="primary-button create-cta"
              disabled={!ready}
              onClick={() => navigate('/yinxin/generating')}
            >
              帮我找一首歌
              <svg className="create-cta__note" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </button>
            <small>
              <LockKeyhole size={12} />
              内容仅用于生成音信，不会公开
            </small>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
