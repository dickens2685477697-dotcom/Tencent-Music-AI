/**
 * 封面图片组件
 * 优先使用 src prop 或 COVER_IMAGES 映射中的真实图片，
 * 若无则渲染彩色渐变占位。
 */

const COVER_GRADIENTS = [
  'linear-gradient(145deg, #c4a0d0 0%, #7c5fa8 50%, #4a3472 100%)',
  'linear-gradient(145deg, #8db8e8 0%, #4a8ccc 50%, #1e5fa0 100%)',
  'linear-gradient(145deg, #4a5a48 0%, #2c3a2a 50%, #1a2518 100%)',
  'linear-gradient(145deg, #7ecba8 0%, #3da872 50%, #1a7a4a 100%)',
  'linear-gradient(145deg, #e8b080 0%, #c87840 50%, #8a4a18 100%)',
  'linear-gradient(145deg, #f0c8a0 0%, #d89060 50%, #a05828 100%)',
];

const COVER_ICONS = ['♪', '♫', '♩', '♬', '♪', '♫'];

// 来自 Figma 的真实封面图片
const COVER_IMAGES: Record<number, string> = {
  0: '/assets/visualassets/result-cover-1.png',
  1: '/assets/visualassets/result-cover-2.png',
  2: '/assets/visualassets/result-cover-3.png',
  3: '/assets/song-cover-1-56586a.png',
  4: '/assets/song-cover-2-56586a.png',
  5: '/assets/song-cover-3-56586a.png',
};

export function CoverArt({
  index,
  src,
  className = '',
}: {
  index: number;
  src?: string;
  className?: string;
}) {
  const safeIndex = ((index % COVER_GRADIENTS.length) + COVER_GRADIENTS.length) % COVER_GRADIENTS.length;
  const imageSrc = src ?? COVER_IMAGES[index];

  if (imageSrc) {
    return (
      <div
        className={`cover-art ${className}`}
        role="img"
        aria-label={`专辑封面 ${safeIndex + 1}`}
        style={{ background: COVER_GRADIENTS[safeIndex] }}
      >
        <img
          src={imageSrc}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <div
      className={`cover-art ${className}`}
      role="img"
      aria-label={`专辑封面 ${safeIndex + 1}`}
      style={{ background: COVER_GRADIENTS[safeIndex] }}
    >
      <span className="cover-art__icon">{COVER_ICONS[safeIndex]}</span>
    </div>
  );
}
