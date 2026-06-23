export type Relationship = 'friend' | 'lover' | 'family' | 'teacher' | 'self' | 'other';
export type Scene = 'miss' | 'apology' | 'farewell' | 'encourage' | 'thanks' | 'mixed';
export type Tone = 'gentle' | 'restrained' | 'sincere' | 'light' | 'poetic';
export type CardStyle = 'midnight' | 'green' | 'minimal';
export type ReplyType = 'message' | 'music';
export type MockScenario = 'success' | 'error' | 'empty';
export type YinxinMessageType = 'text' | 'voice';

export interface YinxinDraft {
  message: string;
  relationship: Relationship;
  scene: Scene;
  tone: Tone;
  createdAt: number;
  mode?: 'create' | 'reply';
  replyToShareId?: string;
}

export interface SongInfo {
  songId: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  coverIndex: number;
  audioPreviewUrl?: string;
}

export interface LyricSegment {
  segmentId: string;
  text: string;
  startTime: number;
  endTime: number;
  emotionTags: string[];
}

export interface YinxinCandidate {
  candidateId: string;
  song: SongInfo;
  primaryLyric: LyricSegment;
  alternativeLyrics: LyricSegment[];
  aiReason: string;
  cardCopy: string;
  emotionLabel: string;
  confidence: number;
}

export interface YinxinCardData {
  shareId: string;
  candidateId: string;
  song: SongInfo;
  selectedLyric: LyricSegment;
  userMessage: string;
  messageType?: YinxinMessageType;
  hideMessageInLyric?: boolean;
  voiceDuration?: number;
  aiReason?: string;
  cardStyle: CardStyle;
  senderName?: string;
  receiverName?: string;
  createdAt: number;
  replyToShareId?: string;
  relationship?: Relationship;
  openCount?: number;
}

export interface YinxinReplyData {
  replyId: string;
  shareId: string;
  type: ReplyType;
  message?: string;
  replyShareId?: string;
  createdAt: number;
  source?: 'wechat' | 'qq' | 'qqmusic' | 'link';
  viewerLabel?: string;
}
