import type { SongInfo } from '../../types/yinxin';
import songsData from './songs.json';

type SongCatalogItem = {
  songId: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  bestMatchLyric?: string;
  lyrics?: string[];
  durationSeconds?: number;
};

const songCatalog = songsData as SongCatalogItem[];

export function resolveSongInfo(song: SongInfo): SongInfo {
  const matched = songCatalog.find((item) => item.songId === song.songId)
    ?? songCatalog.find((item) => item.title === song.title && item.artist === song.artist);

  if (!matched) return song;

  return {
    ...song,
    title: matched.title,
    artist: matched.artist,
    album: matched.album ?? song.album,
    coverUrl: matched.coverUrl || song.coverUrl,
    durationSeconds: matched.durationSeconds ?? song.durationSeconds,
  };
}

export function resolveBestMatchLyric(song: SongInfo): string | undefined {
  const matched = songCatalog.find((item) => item.songId === song.songId)
    ?? songCatalog.find((item) => item.title === song.title && item.artist === song.artist);
  if (!matched) return undefined;
  if (matched.bestMatchLyric?.trim()) return matched.bestMatchLyric.trim();
  if (matched.lyrics?.length) {
    const firstLine = matched.lyrics.find((line) => line.trim().length > 0);
    return firstLine?.trim();
  }
  return undefined;
}
