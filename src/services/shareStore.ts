import { allCandidates } from '../data/mockCandidates';
import type { Relationship, YinxinCardData, YinxinReplyData } from '../types/yinxin';

const CARDS_KEY = 'yinxin.cards.v1';
const REPLIES_KEY = 'yinxin.replies.v1';

const seedCards: YinxinCardData[] = [
  {
    shareId: 'wechat_demo',
    candidateId: 'wechat_demo_jay',
    song: {
      songId: 'jay_kai_bu_liao_kou',
      title: '开不了口',
      artist: '周杰伦',
      album: '范特西',
      coverUrl: '/assets/wechat-demo/jay-cover.jpg',
      coverIndex: 6,
    },
    selectedLyric: {
      segmentId: 'wechat_demo_lyric',
      text: '没说出口的，都藏在这一句里',
      startTime: 26,
      endTime: 32,
      emotionTags: ['想念', '克制'],
    },
    userMessage: '到家就好。其实那句没发出去的话，我放在这封音信里了。',
    cardStyle: 'green',
    relationship: 'lover',
    openCount: 1,
    createdAt: new Date('2026-06-24T16:38:00').getTime(),
  },
  {
    shareId: 'wechat_demo_hold_001',
    candidateId: 'wechat_demo_gem',
    song: {
      songId: 'hold_001',
      title: '喜欢你',
      artist: '邓紫棋',
      coverUrl: '/assets/covers/hold_001.jpg',
      coverIndex: 0,
      durationSeconds: 232,
    },
    selectedLyric: {
      segmentId: 'hold_001_wechat_direct',
      text: '喜欢妳\n那双眼动人',
      startTime: 0,
      endTime: 8,
      emotionTags: ['心动'],
    },
    userMessage: '其实我也',
    cardStyle: 'green',
    relationship: 'lover',
    openCount: 1,
    createdAt: new Date('2026-06-24T16:41:00').getTime(),
  },
  { shareId: 'sent_friend', candidateId: allCandidates[0].candidateId, song: allCandidates[0].song, selectedLyric: allCandidates[0].primaryLyric, userMessage: '最近的夜晚总让我想起你，愿你被温柔以待，平安喜乐。', cardStyle: 'midnight', relationship: 'friend', openCount: 5, createdAt: new Date('2026-06-20T20:30:00').getTime() },
  { shareId: 'sent_lover', candidateId: allCandidates[1].candidateId, song: allCandidates[1].song, selectedLyric: allCandidates[1].primaryLyric, userMessage: '有些想念不用说得太满，这首歌会替我慢慢告诉你。', cardStyle: 'green', relationship: 'lover', openCount: 2, createdAt: new Date('2026-06-15T19:20:00').getTime() },
  { shareId: 'sent_teacher', candidateId: allCandidates[2].candidateId, song: allCandidates[2].song, selectedLyric: allCandidates[2].primaryLyric, userMessage: '谢谢你曾经给我的鼓励，我一直都记得。', cardStyle: 'minimal', relationship: 'teacher', openCount: 12, createdAt: new Date('2026-06-10T10:10:00').getTime() },
];

const seedReplies: YinxinReplyData[] = [
  { replyId: 'seed_reply_1', shareId: 'sent_friend', type: 'message', message: '看到你的信很感动，愿你每天都开心！', source: 'wechat', viewerLabel: '一位收信人', createdAt: new Date('2026-06-21T21:30:00').getTime() },
  { replyId: 'seed_reply_2', shareId: 'sent_friend', type: 'music', message: '也让这首歌替我回应你。', replyShareId: 'sent_lover', source: 'qq', viewerLabel: '一位收信人', createdAt: new Date('2026-06-21T18:05:00').getTime() },
  { replyId: 'seed_reply_3', shareId: 'sent_friend', type: 'message', message: '谢谢你的分享！这首歌我也很喜欢。', source: 'qqmusic', viewerLabel: '来自分享链接', createdAt: new Date('2026-06-20T23:16:00').getTime() },
  { replyId: 'seed_reply_4', shareId: 'sent_teacher', type: 'message', message: '看到你的成长，就是最好的回信。', source: 'link', viewerLabel: '一位收信人', createdAt: new Date('2026-06-18T09:00:00').getTime() },
];

function readMap<T>(key: string): Record<string, T> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as Record<string, T>;
  } catch {
    return {};
  }
}

export function createShareId() {
  return `yx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function saveYinxinCard(card: YinxinCardData) {
  localStorage.setItem(CARDS_KEY, JSON.stringify({ ...readMap<YinxinCardData>(CARDS_KEY), [card.shareId]: card }));
}

export function getYinxinCard(shareId: string): YinxinCardData {
  const stored = readMap<YinxinCardData>(CARDS_KEY)[shareId];
  if (stored) {
    if (shareId === 'wechat_demo_hold_001') {
      return {
        ...stored,
        selectedLyric: {
          ...stored.selectedLyric,
          text: '喜欢妳\n那双眼动人',
        },
        userMessage: '其实我也',
      };
    }
    return stored;
  }
  const seed = seedCards.find((card) => card.shareId === shareId);
  if (seed) return seed;
  const fallback = allCandidates[0];
  return {
    shareId,
    candidateId: fallback.candidateId,
    song: fallback.song,
    selectedLyric: fallback.primaryLyric,
    userMessage: '有些话我没有当面说，就让这首歌替我慢慢告诉你。',
    aiReason: fallback.aiReason,
    cardStyle: 'midnight',
    senderName: '一位朋友',
    createdAt: Date.now(),
  };
}

export function saveReply(reply: YinxinReplyData) {
  localStorage.setItem(REPLIES_KEY, JSON.stringify({ ...readMap<YinxinReplyData>(REPLIES_KEY), [reply.replyId]: reply }));
}

export function getReplies(shareId: string) {
  const stored = Object.values(readMap<YinxinReplyData>(REPLIES_KEY));
  return [...seedReplies, ...stored].filter((reply) => reply.shareId === shareId);
}

export function getSentCards(): YinxinCardData[] {
  const stored = Object.values(readMap<YinxinCardData>(CARDS_KEY));
  const byId = new Map(seedCards.map((card) => [card.shareId, card]));
  stored.forEach((card) => byId.set(card.shareId, card));
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export function relationshipLabel(relationship?: Relationship) {
  const labels: Record<Relationship, string> = { friend: '朋友', lover: '恋人', family: '家人', teacher: '老师', self: '自己', other: '其他' };
  return relationship ? labels[relationship] : '其他';
}

export async function copyShareLink(shareId: string) {
  const url = `${window.location.origin}/s/${shareId}`;
  if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
  return url;
}
