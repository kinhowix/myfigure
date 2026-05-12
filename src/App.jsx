import { Routes, Route, Navigate } from 'react-router-dom';
import { useStickers } from './context/StickerContext';
import BottomNav from './components/BottomNav';
import Collection from './pages/Collection';
import Repeated from './pages/Repeated';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Landing from './pages/Landing';

function App() {
  const { user, loading } = useStickers();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: 'white',
        background: '#0f172a',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #334155',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Carregando álbum...</p>
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

  return (
    <div className="app-container">
      <Routes>
        <Route path="/collection" element={<Collection />} />
        <Route path="/repeated" element={<Repeated />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/collection" />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
