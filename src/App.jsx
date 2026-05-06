import { Routes, Route, Navigate } from 'react-router-dom';
import { useStickers } from './context/StickerContext';
import BottomNav from './components/BottomNav';
import Collection from './pages/Collection';
import Repeated from './pages/Repeated';
import Stats from './pages/Stats';
import Login from './pages/Login';

function App() {
  const { user, loading } = useStickers();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Carregando álbum...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Collection />} />
        <Route path="/repeated" element={<Repeated />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
