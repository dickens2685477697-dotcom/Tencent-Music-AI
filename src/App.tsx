import { Navigate, Route, Routes } from 'react-router-dom';
import { CandidateListPage } from './app/routes/CandidateListPage';
import { CreateYinxinPage } from './app/routes/CreateYinxinPage';
import { EditYinxinPage } from './app/routes/EditYinxinPage';
import { GeneratingPage } from './app/routes/GeneratingPage';
import { HomePage } from './app/routes/HomePage';
import { ReceiverViewPage } from './app/routes/ReceiverViewPage';
import { ReplyYinxinPage } from './app/routes/ReplyYinxinPage';
import { SharePreviewPage } from './app/routes/SharePreviewPage';
import { SentLettersPage } from './app/routes/SentLettersPage';
import { StartupPage } from './app/routes/StartupPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/yinxin" element={<CreateYinxinPage />} />
      <Route path="/yinxin/generating" element={<GeneratingPage />} />
      <Route path="/yinxin/results" element={<CandidateListPage />} />
      <Route path="/yinxin/edit/:id" element={<EditYinxinPage />} />
      <Route path="/yinxin/share/:id" element={<SharePreviewPage />} />
      <Route path="/yinxin/sent" element={<SentLettersPage />} />
      <Route path="/yinxin/sent/:shareId" element={<SentLettersPage />} />
      <Route path="/s/:shareId" element={<ReceiverViewPage />} />
      <Route path="/s/:shareId/reply" element={<ReplyYinxinPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
