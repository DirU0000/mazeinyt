import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LanguageSwitcher from './components/layout/LanguageSwitcher';
import TabNav from './components/layout/TabNav';
import Seo from './components/seo/Seo';
import VideosPage from './pages/VideosPage';
import KeywordsPage from './pages/KeywordsPage';
import ChannelsPage from './pages/ChannelsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import GuidePage from './pages/GuidePage';
import VideoDetailPage from './pages/VideoDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="app-shell">
      <Seo />
      <div className="app-topbar">
        <LanguageSwitcher />
      </div>
      <Header />
      <TabNav />
      <Routes>
        <Route path="/" element={<VideosPage />} />
        <Route path="/video/:id" element={<VideoDetailPage />} />
        <Route path="/keywords" element={<KeywordsPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
