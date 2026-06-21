import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, backTo, action }: { title: string; backTo?: string; action?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      <button className="icon-button" aria-label="返回" onClick={() => (backTo ? navigate(backTo) : navigate(-1))}>
        <ChevronLeft size={23} strokeWidth={1.8} />
      </button>
      <strong>{title}</strong>
      <span className="page-header__action">{action}</span>
    </header>
  );
}
