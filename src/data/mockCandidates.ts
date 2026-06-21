import type { Scene, YinxinCandidate } from '../types/yinxin';

const lyrics = [
  ['如果思念有声音，大概就是这首歌', '风从很远的地方来，也替我拥抱你', '没说出口的，都藏在旋律里'],
  ['慢一点也没关系，我会在原地等你', '绕了很远的路，还是想回到你身边', '等日落停在窗口，我们再好好说话'],
  ['不是所有道歉，都要说得很响亮', '愿这句迟到的话，能被你好好听见', '我把倔强放下，换一场温柔相见'],
  ['别怕夜太长，天亮会有新的回声', '你已经走了很远，值得一束光', '累的时候，就让音乐陪你坐一会儿'],
  ['我们在不同方向，也共享过一段月光', '告别不是遗忘，是把故事轻轻合上', '愿下一阵风，带你去更好的地方'],
  ['谢谢你路过，也谢谢你停留', '那些微小的好，我都认真记得', '有你的日子，平常也会发光'],
];

const songs = [
  ['月亮没有说', '林屿', '月潮', '克制想念'],
  ['落日慢行', '周末的海', '慢一点', '温柔和好'],
  ['轻声说抱歉', '白昼信箱', '留白', '真诚道歉'],
  ['森林回声', '青禾', '向光', '安静鼓励'],
  ['远方的风', '南岸', '再见以前', '体面告别'],
  ['星光落款', '微光合唱团', '谢谢你', '柔软感谢'],
] as const;

const reasons: Record<Scene, string> = {
  miss: '它没有直接说想念，却把等待和靠近都藏进了旋律。',
  apology: '这段歌词足够真诚，又给彼此留出了不尴尬的余地。',
  farewell: '它承认不舍，也保留了对下一段旅程的祝福。',
  encourage: '像一次不打扰的陪伴，温柔地告诉对方可以慢慢来。',
  thanks: '它把感谢写得轻盈，不会让认真显得过分隆重。',
  mixed: '这段表达没有急着定义情绪，适合那些暂时说不清的话。',
};

export const allCandidates: YinxinCandidate[] = songs.map((song, index) => {
  const segments = lyrics[index].map((text, lyricIndex) => ({
    segmentId: `lyric_${index}_${lyricIndex}`,
    text,
    startTime: 38 + lyricIndex * 32,
    endTime: 68 + lyricIndex * 32,
    emotionTags: song[3].split(/(?=[\u4e00-\u9fa5]{2}$)/),
  }));

  return {
    candidateId: `candidate_${index + 1}`,
    song: {
      songId: `song_${index + 1}`,
      title: song[0],
      artist: song[1],
      album: song[2],
      coverUrl: '/assets/yinxin-covers.png',
      coverIndex: index,
    },
    primaryLyric: segments[0],
    alternativeLyrics: segments.slice(1),
    aiReason: reasons.mixed,
    cardCopy: `有些话我还是说不出口，所以想让《${song[0]}》替我说。`,
    emotionLabel: song[3],
    confidence: 0.94 - index * 0.025,
  };
});

export function candidatesForScene(scene: Scene, offset = 0): YinxinCandidate[] {
  const starts: Record<Scene, number> = { miss: 0, apology: 2, farewell: 4, encourage: 3, thanks: 5, mixed: 1 };
  const start = (starts[scene] + offset) % allCandidates.length;
  return Array.from({ length: 3 }, (_, index) => {
    const candidate = allCandidates[(start + index) % allCandidates.length];
    return { ...candidate, aiReason: reasons[scene] };
  });
}
