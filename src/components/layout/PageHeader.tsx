import { ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, backTo, action }: { title: string; backTo?: string; action?: React.ReactNode }) {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scroller = headerRef.current?.closest('.phone-shell') as HTMLElement | null;
    if (!scroller) return;
    const onScroll = () => setScrolled(scroller.scrollTop > 6);
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={headerRef} className={`page-header ${scrolled ? 'page-header--scrolled' : ''}`}>
      <button className="icon-button" aria-label="返回" onClick={() => (backTo ? navigate(backTo) : navigate(-1))}>
        <ChevronLeft size={23} strokeWidth={1.8} />
      </button>
      <strong>{title}</strong>
      <span className="page-header__action">{action}</span>
    </header>
  );
}
