import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStickers } from './context/StickerContext';
import BottomNav from './components/BottomNav';
import Collection from './pages/Collection';
import Repeated from './pages/Repeated';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Fireworks from './components/Fireworks';

function App() {
  const { user, loading, stats } = useStickers();
  const [dismissedCongrats, setDismissedCongrats] = useState(false);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando Álbum da Família...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const isAlbumComplete = stats && stats.owned === stats.total && stats.total > 0;

  return (
    <div className="app-container">
      <Routes>
        <Route path="/collection" element={<Collection />} />
        <Route path="/repeated" element={<Repeated />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/collection" />} />
      </Routes>
      <BottomNav />

      {isAlbumComplete && !dismissedCongrats && (
        <>
          <Fireworks />
          <div className="congrats-overlay">
            <div className="congrats-modal">
              <div className="congrats-icon">🏆</div>
              <h2 className="congrats-title">Álbum Completo!</h2>
              <p className="congrats-text">
                Parabéns! Você conseguiu completar o seu Álbum da Família da Copa 2026! 🎉✨
              </p>
              <button 
                className="congrats-btn" 
                onClick={() => setDismissedCongrats(true)}
              >
                Fechar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
