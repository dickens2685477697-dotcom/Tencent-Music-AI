import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockAudioPlayer } from '../components/yinxin/MockAudioPlayer';
import { PlayerProvider } from '../context/PlayerContext';
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

beforeEach(() => localStorage.clear());

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
});
