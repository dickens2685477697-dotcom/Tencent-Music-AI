import type { ReactNode } from 'react';

export function AppShell({ children, light = false, wide = false }: { children: ReactNode; light?: boolean; wide?: boolean }) {
  return (
    <main className={`stage ${light ? 'stage--light' : ''}`}>
      <section className={`phone-shell ${light ? 'phone-shell--light' : ''} ${wide ? 'phone-shell--wide' : ''}`}>{children}</section>
    </main>
  );
}
