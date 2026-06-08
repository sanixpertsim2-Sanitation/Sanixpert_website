import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AreaSelectPage from './pages/AreaSelectPage';
import AreaHubPage from './pages/AreaHubPage';
import PreCleanPage from './pages/PreCleanPage';
import PostCleanPage from './pages/PostCleanPage';
import HandoverPage from './pages/HandoverPage';
import VerifyPage from './pages/VerifyPage';
import ReleasePage from './pages/ReleasePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/areas" element={<AreaSelectPage />} />
      <Route path="/hub" element={<AreaHubPage />} />
      <Route path="/pre-clean" element={<PreCleanPage />} />
      <Route path="/post-clean" element={<PostCleanPage />} />
      <Route path="/handover" element={<HandoverPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/release" element={<ReleasePage />} />
    </Routes>
  );
}
