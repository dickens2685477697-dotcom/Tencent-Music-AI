import type { Scene, YinxinCandidate } from '../types/yinxin';
import songsData from './songs/songs.json';

type SongSeed = {
  songId: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  bestMatchLyric?: string;
  lyrics: string[];
  tags?: string[];
  durationSeconds?: number;
};

const reasons: Record<Scene, string> = {
  miss: '它没有直接说想念，却把等待和靠近都藏进了旋律。',
  apology: '这段歌词足够真诚，又给彼此留出了不尴尬的余地。',
  farewell: '它承认不舍，也保留了对下一段旅程的祝福。',
  encourage: '像一次不打扰的陪伴，温柔地告诉对方可以慢慢来。',
  thanks: '它把感谢写得轻盈，不会让认真显得过分隆重。',
  mixed: '这段表达没有急着定义情绪，适合那些暂时说不清的话。',
};

function normalizeCoverUrl(url: string) {
  if (url.startsWith('/covers/')) return `/assets${url}`;
  return url;
}

function cleanLyrics(lines: string[]) {
  const cleaned = lines.map((line) => line.trim()).filter(Boolean);
  if (!cleaned.length) return ['这首歌里有句想说的话'];
  return cleaned;
}

const songSeeds = songsData as SongSeed[];

export const allCandidates: YinxinCandidate[] = songSeeds.map((song, index) => {
  const emotionTags = song.tags?.length ? song.tags : ['共鸣'];
  const allLines = cleanLyrics(song.lyrics);
  const preferredPrimaryLyric = song.bestMatchLyric;
  const preferredIndex = preferredPrimaryLyric
    ? allLines.findIndex((line) => line === preferredPrimaryLyric || line.includes(preferredPrimaryLyric))
    : -1;
  const primaryIndex = preferredIndex >= 0 ? preferredIndex : 0;
  const primaryText = allLines[primaryIndex];
  const alternativeTexts = allLines.filter((_, lyricIndex) => lyricIndex !== primaryIndex);
  const orderedLyrics = [primaryText, ...alternativeTexts];

  const segments = orderedLyrics.map((text, lyricIndex) => ({
    segmentId: `lyric_${song.songId}_${lyricIndex}`,
    text,
    startTime: 32 + lyricIndex * 28,
    endTime: 56 + lyricIndex * 28,
    emotionTags,
  }));

  return {
    candidateId: `candidate_${song.songId}`,
    song: {
      songId: song.songId,
      title: song.title,
      artist: song.artist,
      album: song.album ?? '未提供专辑',
      coverUrl: normalizeCoverUrl(song.coverUrl),
      coverIndex: index,
      durationSeconds: song.durationSeconds,
    },
    primaryLyric: segments[0],
    alternativeLyrics: segments.slice(1),
    aiReason: reasons.mixed,
    cardCopy: `有些话我还是说不出口，所以想让《${song.title}》替我说。`,
    emotionLabel: emotionTags.join(' / '),
    confidence: 0.95 - index * 0.03,
  };
});

export function candidatesForScene(scene: Scene, offset = 0): YinxinCandidate[] {
  if (!allCandidates.length) return [];
  const starts: Record<Scene, number> = { miss: 0, apology: 1, farewell: 2, encourage: 0, thanks: 1, mixed: 2 };
  const start = (starts[scene] + offset) % allCandidates.length;
  const count = Math.min(3, allCandidates.length);
  return Array.from({ length: count }, (_, index) => {
    const candidate = allCandidates[(start + index) % allCandidates.length];
    return { ...candidate, aiReason: reasons[scene] };
  });
}
