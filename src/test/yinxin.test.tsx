import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EditYinxinPage } from '../app/routes/EditYinxinPage';
import { CandidateCard } from '../components/yinxin/CandidateCard';
import { MockAudioPlayer } from '../components/yinxin/MockAudioPlayer';
import { YinxinMusicCard } from '../components/yinxin/YinxinMusicCard';
import { PlayerProvider } from '../context/PlayerContext';
import { useYinxin, YinxinProvider } from '../context/YinxinContext';
import { allCandidates } from '../data/mockCandidates';
import { getReplies, getSentCards, getYinxinCard, relationshipLabel, saveReply, saveYinxinCard } from '../services/shareStore';
import { generateYinxinCandidates } from '../services/yinxinApi';
import type { YinxinDraft } from '../types/yinxin';

const draft: YinxinDraft = {
  message: '想和朋友和好，但不想说得太直接。',
  relationship: 'friend',
  scene: 'apology',
  tone: 'sincere',
  createdAt: 1,
};

function EditPageFixture() {
  const { selectedCandidate, dispatch } = useYinxin();
  useEffect(() => {
    if (!selectedCandidate) {
      dispatch({ type: 'SELECT_CANDIDATE', payload: allCandidates[0] });
    }
  }, [dispatch, selectedCandidate]);

  return selectedCandidate ? <EditYinxinPage /> : null;
}

function renderEditPage() {
  render(
    <MemoryRouter initialEntries={['/yinxin/edit/candidate']}>
      <YinxinProvider>
        <PlayerProvider>
          <EditPageFixture />
        </PlayerProvider>
      </YinxinProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});

describe('mock candidate API', () => {
  it('returns three scene-aware candidates', async () => {
    const candidates = await generateYinxinCandidates(draft, { delay: 0 });
    expect(candidates).toHaveLength(3);
    expect(candidates[0].aiReason).toContain('真诚');
  });

  it('exposes deterministic empty and error scenarios', async () => {
    await expect(generateYinxinCandidates(draft, { delay: 0, scenario: 'empty' })).resolves.toEqual([]);
    await expect(generateYinxinCandidates(draft, { delay: 0, scenario: 'error' })).rejects.toThrow('MOCK_GENERATION_ERROR');
  });
});

describe('share and reply store', () => {
  it('organizes sent letters by relationship instead of recipient account', () => {
    const cards = getSentCards();
    expect(cards.map((card) => relationshipLabel(card.relationship))).toEqual(expect.arrayContaining(['朋友', '恋人', '老师']));
    expect(getReplies('sent_friend')).toHaveLength(3);
  });

  it('persists cards and returns a safe fallback for missing links', () => {
    const candidate = allCandidates[1];
    saveYinxinCard({
      shareId: 'stored', candidateId: candidate.candidateId, song: candidate.song,
      selectedLyric: candidate.primaryLyric, userMessage: '测试附言', cardStyle: 'green', createdAt: 1,
    });
    expect(getYinxinCard('stored').userMessage).toBe('测试附言');
    expect(getYinxinCard('missing').shareId).toBe('missing');
  });

  it('stores direct and music replies against the original share', () => {
    saveReply({ replyId: 'r1', shareId: 'original', type: 'message', message: '收到', createdAt: 1 });
    saveReply({ replyId: 'r2', shareId: 'original', type: 'music', replyShareId: 'reply-card', createdAt: 2 });
    expect(getReplies('original').map((reply) => reply.type)).toEqual(['message', 'music']);
  });

  it('aggregates replies from any shared-link source under one share id', () => {
    saveReply({ replyId: 'wechat-reply', shareId: 'shared-letter', type: 'message', message: '微信回复', source: 'wechat', createdAt: 1 });
    saveReply({ replyId: 'qq-reply', shareId: 'shared-letter', type: 'message', message: 'QQ 回复', source: 'qq', createdAt: 2 });
    expect(getReplies('shared-letter').map((reply) => reply.source)).toEqual(['wechat', 'qq']);
  });
});

describe('music letter message visibility', () => {
  it('hides text content when the message is stored in the lyric', () => {
    const candidate = allCandidates[0];
    render(
      <PlayerProvider>
        <YinxinMusicCard
          song={candidate.song}
          lyric={candidate.primaryLyric}
          message="这是一句不该直接露出的文案"
          hideMessageInLyric
        />
      </PlayerProvider>,
    );
    expect(screen.queryByText('这是一句不该直接露出的文案')).not.toBeInTheDocument();
    expect(screen.queryByText('有一句话藏在这段歌词里')).not.toBeInTheDocument();
    expect(screen.queryByText('收信人先看到歌词，具体内容不会出现在封面上。')).not.toBeInTheDocument();
  });

  it('shows a playable voice note in the message area', () => {
    const candidate = allCandidates[1];
    render(
      <PlayerProvider>
        <YinxinMusicCard
          song={candidate.song}
          lyric={candidate.primaryLyric}
          message=""
          messageType="voice"
          voiceDuration={30}
        />
      </PlayerProvider>,
    );
    expect(screen.getByText('30 秒语音留言')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('播放语音留言'));
    expect(screen.getAllByLabelText('暂停')).toHaveLength(1);
  });
});

describe('edit page voice recording', () => {
  it('records a voice note on press and release', async () => {
    renderEditPage();
    fireEvent.click(await screen.findByRole('button', { name: '语音' }));
    expect(screen.getByRole('button', { name: '确认并生成' })).toBeDisabled();
    const recordButton = screen.getByLabelText('按住录入语音');
    fireEvent.pointerDown(recordButton);
    expect(screen.getByText('正在录入语音')).toBeInTheDocument();
    fireEvent.pointerUp(recordButton);
    expect(screen.getByText('已录入一段语音')).toBeInTheDocument();
    expect(screen.getByLabelText('播放语音留言')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认并生成' })).toBeEnabled();
  });

  it('lets the left record button overwrite the recorded voice note', async () => {
    renderEditPage();
    fireEvent.click(await screen.findByRole('button', { name: '语音' }));
    fireEvent.pointerDown(screen.getByLabelText('按住录入语音'));
    fireEvent.pointerUp(screen.getByLabelText('正在录入语音，松手完成'));
    fireEvent.click(screen.getByLabelText('播放语音留言'));
    expect(screen.getByLabelText('暂停')).toBeInTheDocument();

    const rerecordButton = screen.getByLabelText('按住重新录入语音');
    fireEvent.pointerDown(rerecordButton);
    expect(screen.getByLabelText('正在录入语音，松手完成')).toBeInTheDocument();
    fireEvent.pointerUp(screen.getByLabelText('正在录入语音，松手完成'));
    expect(screen.getByText('已录入一段语音')).toBeInTheDocument();
    expect(screen.getByLabelText('播放语音留言')).toBeInTheDocument();
  });
});

describe('single active mock player', () => {
  it('pauses the first card when another starts', () => {
    vi.useFakeTimers();
    render(<PlayerProvider><MockAudioPlayer id="a" label="播放 A" /><MockAudioPlayer id="b" label="播放 B" /></PlayerProvider>);
    fireEvent.click(screen.getByLabelText('播放 A'));
    expect(screen.getByLabelText('暂停')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('播放 B'));
    expect(screen.getAllByLabelText('暂停')).toHaveLength(1);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByLabelText(/播放进度 [1-9]/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('toggles the active card between play and pause', () => {
    render(<PlayerProvider><MockAudioPlayer id="a" label="播放 A" /></PlayerProvider>);
    fireEvent.click(screen.getByLabelText('播放 A'));
    expect(screen.getByLabelText('暂停')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('暂停'));
    expect(screen.getByLabelText('播放 A')).toBeInTheDocument();
  });

  it('toggles candidate card playback without selecting the card', () => {
    const onSelect = vi.fn();
    const candidate = allCandidates[0];
    render(<PlayerProvider><CandidateCard candidate={candidate} onSelect={onSelect} /></PlayerProvider>);
    fireEvent.click(screen.getByLabelText(`播放${candidate.song.title}`));
    expect(screen.getByLabelText('暂停')).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('暂停'));
    expect(screen.getByLabelText(`播放${candidate.song.title}`)).toBeInTheDocument();
  });
});
