import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CandidateCard } from '../../components/yinxin/CandidateCard';
import { useYinxin } from '../../context/YinxinContext';

export function CandidateListPage() {
  const { candidates, draft, dispatch } = useYinxin();
  const navigate = useNavigate();
  if (!candidates.length) {
    return <AppShell><div className="page empty-page"><PageHeader title="候选音信" backTo="/yinxin" /><h1>候选还没准备好</h1><button className="primary-button" onClick={() => navigate('/yinxin/generating')}>开始生成</button></div></AppShell>;
  }
  return (
    <AppShell>
      <div className="page results-page">
        <PageHeader title="音信" backTo="/yinxin" />
        <section className="results-heading"><h1>为你找到 3 封音信</h1><p>{draft.mode === 'reply' ? '选择最像你想回复的那一封。' : '选择最像你想说的那一封。'}</p></section>
        <div className="candidate-list">
          {candidates.map((candidate) => <CandidateCard key={candidate.candidateId} candidate={candidate} onSelect={() => { dispatch({ type: 'SELECT_CANDIDATE', payload: candidate }); navigate(`/yinxin/edit/${candidate.candidateId}`); }} />)}
        </div>
        <div className="results-footer"><button onClick={() => { dispatch({ type: 'REGENERATE' }); navigate('/yinxin/generating'); }}><RefreshCw size={15} />换一组</button><button onClick={() => navigate('/yinxin')}>返回修改</button></div>
      </div>
    </AppShell>
  );
}
