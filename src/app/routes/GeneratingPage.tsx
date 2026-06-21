import { Music2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { useYinxin } from '../../context/YinxinContext';
import { generateYinxinCandidates } from '../../services/yinxinApi';
import type { MockScenario } from '../../types/yinxin';

const statusText = ['正在理解你的心情…', '正在从歌词里寻找合适的表达…', '正在生成你的音信卡片…'];

export function GeneratingPage() {
  const { draft, generation, dispatch } = useYinxin();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState(0);
  const [error, setError] = useState<'error' | 'empty'>();

  useEffect(() => {
    if (!draft.message.trim()) { navigate('/yinxin', { replace: true }); return; }
    setError(undefined);
    setStatus(0);
    const timers = [window.setTimeout(() => setStatus(1), 700), window.setTimeout(() => setStatus(2), 1400)];
    const scenario = (params.get('mock') ?? 'success') as MockScenario;
    generateYinxinCandidates(draft, { scenario, generation })
      .then((candidates) => {
        if (!candidates.length) { setError('empty'); return; }
        dispatch({ type: 'SET_CANDIDATES', payload: candidates });
        navigate('/yinxin/results', { replace: true });
      })
      .catch(() => setError('error'));
    return () => timers.forEach(window.clearTimeout);
  }, [dispatch, draft, generation, navigate, params]);

  const retry = () => {
    dispatch({ type: 'REGENERATE' });
    navigate('/yinxin/generating', { replace: true });
  };

  return (
    <AppShell>
      <div className="page generating-page">
        <PageHeader title="音信" backTo="/yinxin" />
        {error ? <section className="generation-error"><div className="error-record"><RefreshCw size={30} /></div><h1>{error === 'empty' ? '还差一点共鸣' : '这次没找到合适的歌'}</h1><p>{error === 'empty' ? '换一种说法，也许会有更合适的表达。' : '歌词海太大了，我们再找一次吧。'}</p><button className="primary-button" onClick={retry}>重新生成</button><button className="text-button" onClick={() => navigate('/yinxin')}>返回修改</button></section> : <section className="generating-content"><div className="vinyl"><span><Music2 size={56} fill="currentColor" /></span></div><h1>{statusText[status]}</h1><div className="waveform">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 35}ms` }} />)}</div><button className="secondary-button generating-cancel" onClick={() => navigate('/yinxin')}>取消生成</button><p>有些话不用直接说，歌会替你开口。</p></section>}
      </div>
    </AppShell>
  );
}
