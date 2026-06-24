import { ArrowLeftRight, Heart, PenSquare, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { CandidateCard } from '../../components/yinxin/CandidateCard';
import { useYinxin } from '../../context/YinxinContext';

export function CandidateListPage() {
  const { candidates, dispatch } = useYinxin();
  const navigate = useNavigate();

  if (!candidates.length) {
    return (
      <AppShell light>
        <div className="page results-page empty-page">
          <PageHeader title="候选音信" backTo="/yinxin" />
          <h1>候选还没准备好</h1>
          <button className="primary-button" onClick={() => navigate('/yinxin/generating')}>开始生成</button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell light>
      <div className="page results-page">
        {/* Header：仅标题 + 返回，无操作按钮 */}
          <PageHeader
            title="音信"
            backTo="/yinxin"
            action={(
              <button
                type="button"
                className="rematch-btn rematch-btn--header"
                onClick={() => { dispatch({ type: 'REGENERATE' }); navigate('/yinxin/generating'); }}
              >
                <RefreshCw size={12} />
                再次匹配
              </button>
            )}
          />

        {/* 标题区 */}
        <div className="results-hero">
          <h1 className="results-heading__title">
            为你找到 <em>{candidates.length}</em> 封音信
          </h1>
          <div className="results-heading__sub-row">
            <p className="results-heading__subtitle">这些歌曲最能表达「想说却没说出口的话」</p>
          </div>
        </div>

        {/* 卡片列表 */}
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.candidateId}
              candidate={candidate}
              onSelect={() => {
                dispatch({ type: 'SELECT_CANDIDATE', payload: candidate });
                navigate(`/yinxin/edit/${candidate.candidateId}`);
              }}
            />
          ))}
        </div>

        {/* 底部爱心提示 */}
        <p className="results-note">
          <Heart size={13} fill="currentColor" />
          希望这些歌曲，能替你说出心里的话
        </p>

        {/* 底部双按钮（各 152px，间距 16px） */}
        <div className="results-cta">
          <button
            className="btn-ghost"
            onClick={() => { dispatch({ type: 'REGENERATE' }); navigate('/yinxin/generating'); }}
          >
            <ArrowLeftRight size={15} />
            换一组
          </button>
          <button
            className="btn-solid"
            onClick={() => navigate('/yinxin')}
          >
            <PenSquare size={15} />
            回信修改
          </button>
        </div>
      </div>
    </AppShell>
  );
}
