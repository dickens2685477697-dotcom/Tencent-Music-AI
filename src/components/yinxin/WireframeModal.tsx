import type { ReactNode } from 'react';

export function WireframeModal({ title, children, onClose, onConfirm, confirmLabel = '确认' }: { title: string; children: ReactNode; onClose: () => void; onConfirm?: () => void; confirmLabel?: string }) {
  return (
    <div className="wire-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="wire-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header><strong>{title}</strong><button onClick={onClose}>图标占位</button></header>
        <div className="wire-modal__content">{children}</div>
        <footer><button className="secondary-button" onClick={onClose}>取消</button>{onConfirm ? <button className="primary-button" onClick={onConfirm}>{confirmLabel}</button> : null}</footer>
      </section>
    </div>
  );
}
