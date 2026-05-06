import { useStickers } from '../context/StickerContext';
import './Stats.css';

export default function Stats() {
  const { stats } = useStickers();
  const percentage = ((stats.owned / stats.total) * 100).toFixed(1);

  return (
    <div className="page-container">
      <h1>Estatísticas</h1>
      
      <div className="stats-content">
        <div className="progress-section">
          <h2>Progresso do Álbum</h2>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="percentage">{percentage}% Completo</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total do Álbum</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card primary">
            <span className="stat-label">Tenho</span>
            <span className="stat-value">{stats.owned}</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-label">Faltam</span>
            <span className="stat-value">{stats.missing}</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-label">Repetidas (Para Troca)</span>
            <span className="stat-value">{stats.repeated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
