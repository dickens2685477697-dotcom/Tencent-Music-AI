export function CoverArt({ index, className = '' }: { index: number; className?: string }) {
  return <div className={`cover-art ${className}`} data-placeholder-index={index} role="img" aria-label="图片占位">图片占位</div>;
}
