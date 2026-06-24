import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';

export function StartupPage() {
  const navigate = useNavigate();

  return (
    <AppShell light>
      <button className="startup-page" type="button" onClick={() => navigate('/home')}>
        <img src="/assets/visualassets/startup-cover.png" alt="QQ音乐音信启动页" />
      </button>
    </AppShell>
  );
}
