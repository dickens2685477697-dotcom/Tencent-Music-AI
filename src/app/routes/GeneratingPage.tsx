import { Heart, RefreshCw } from 'lucide-react';
import matchNoteImg from '../../assets/match-note.png';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { useYinxin } from '../../context/YinxinContext';
import { generateYinxinCandidates } from '../../services/yinxinApi';
import type { MockScenario } from '../../types/yinxin';

// 5 个标签：轨道半径 + 动画时长 + 起始延迟（秒，负值=提前开始）
const orbitTags = [
  { label: '治愈',  r: 108, dur: 14, delay: 0     },
  { label: '思念',  r: 120, dur: 11, delay: -2.2  },
  { label: '温柔',  r: 112, dur: 16, delay: -6.4  },
  { label: '释怀',  r: 106, dur: 12, delay: -8.6  },
  { label: '成长',  r: 116, dur: 18, delay: -12.9 },
];

export function GeneratingPage() {
  const { draft, generation, dispatch } = useYinxin();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<'error' | 'empty'>();

  useEffect(() => {
    if (!draft.message.trim()) { navigate('/yinxin', { replace: true }); return; }
    setError(undefined);
    const scenario = (params.get('mock') ?? 'success') as MockScenario;
    generateYinxinCandidates(draft, { scenario, generation })
      .then((candidates) => {
        if (!candidates.length) { setError('empty'); return; }
        dispatch({ type: 'SET_CANDIDATES', payload: candidates });
        navigate('/yinxin/results', { replace: true });
      })
      .catch(() => setError('error'));
  }, [dispatch, draft, generation, navigate, params]);

  const retry = () => {
    dispatch({ type: 'REGENERATE' });
    navigate('/yinxin/generating', { replace: true });
  };

  return (
    <AppShell light>
      <div className="page generating-page">
        <PageHeader title="音信" backTo="/yinxin" />

        {error ? (
          <section className="generation-error">
            <div className="error-record"><RefreshCw size={30} /></div>
            <h1>{error === 'empty' ? '还差一点共鸣' : '这次没找到合适的歌'}</h1>
            <p>{error === 'empty' ? '换一种说法，也许会有更合适的表达。' : '歌词海太大了，我们再找一次吧。'}</p>
            <button className="primary-button" onClick={retry}>重新生成</button>
            <button className="text-button" onClick={() => navigate('/yinxin')}>返回修改</button>
          </section>
        ) : (
          <section className="generating-content">
            {/* 标题 */}
            <div className="match-heading">
              <h1>AI正在为你<b>匹配</b><br />最能表达这段心情的歌曲</h1>
              <p>好音乐，替你说出心里话 <i><Heart size={12} fill="currentColor" /></i></p>
            </div>

            {/* 同心光环 + 音符 + 轨道公转标签 */}
            <div className="match-scene">
              {/* 环结构：静态底环 + 声波脉冲环 */}
              <div className="match-rings" aria-hidden>
                <div className="ring ring--1" />
                <div className="ring ring--2" />
                <div className="ring ring--3" />
                <div className="ring-pulse ring-pulse--1" />
                <div className="ring-pulse ring-pulse--2" />
                <div className="ring-pulse ring-pulse--3" />
              </div>

              {/* 中心音符：呼吸浮动 */}
              <div className="match-note" aria-hidden>
                <div className="match-note__glow" />
                <img src={matchNoteImg} alt="" className="match-note__icon" />
              </div>

              {/* 轨道公转标签：轨道臂旋转 + 标签反旋保持文字朝向 */}
              {orbitTags.map(({ label, r, dur, delay }, i) => (
                <div
                  key={label}
                  className={`match-orbit match-orbit--${i + 1}`}
                  style={{
                    ['--orbit-dur' as string]: `${dur}s`,
                    ['--orbit-delay' as string]: `${delay}s`,
                    ['--orbit-r' as string]: `${r}px`,
                  }}
                >
                  <span className="match-tag">{label}</span>
                </div>
              ))}

              {/* 闪烁装饰点 */}
              <span className="match-dot match-dot--a" />
              <span className="match-dot match-dot--b" />
              <span className="match-dot match-dot--c" />
              <span className="match-dot match-dot--d" />
              <span className="match-dot match-dot--e" />
            </div>

            {/* 进度卡片 */}
            <div className="progress-card">
              <div className="progress-card__top">
                <div className="progress-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="10" width="2.6" height="4" rx="1.3"/>
                    <rect x="7" y="7" width="2.6" height="10" rx="1.3"/>
                    <rect x="11" y="4" width="2.6" height="16" rx="1.3"/>
                    <rect x="15" y="8" width="2.6" height="8" rx="1.3"/>
                    <rect x="19" y="11" width="2.6" height="2" rx="1"/>
                  </svg>
                </div>
                <div>
                  <b>正在匹配歌曲…</b>
                  <small>预计需要 10-20 秒</small>
                </div>
              </div>
              <div className="progress-row">
                <div className="progress-bar">
                  <span className="progress-fill" />
                </div>
                <span className="progress-pct">43%</span>
              </div>
            </div>

            <button className="generating-cancel" onClick={() => navigate('/yinxin')}>
              取消匹配
            </button>
          </section>
        )}
      </div>
    </AppShell>
  );
}
