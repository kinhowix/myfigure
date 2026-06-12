import { useStickers } from '../context/StickerContext';
import { stickerGroups } from '../data/stickersConfig';
import './Stats.css';

import { LogOut, Share2 } from 'lucide-react';

// Helper to convert country flag code to emoji
const getFlagEmoji = (flagCode) => {
  if (!flagCode) return '⭐';
  const specialEmojis = {
    'un': '⭐',
    'cc': '🥤',
    'gb-sct': '🏴\u{B354}\u{B347}\u{B353}\u{B343}\u{B354}\u{B37f}', // Scotland flag emoji
    'gb-eng': '🏴\u{B354}\u{B347}\u{B345}\u{B34e}\u{B347}\u{B37f}'  // England flag emoji
  };
  if (specialEmojis[flagCode.toLowerCase()]) {
    return specialEmojis[flagCode.toLowerCase()];
  }
  const code = flagCode.toUpperCase();
  try {
    return String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt(0)));
  } catch (e) {
    return '⭐';
  }
};

export default function Stats() {
  const { stickers, stats, logout } = useStickers();
  const percentage = ((stats.owned / stats.total) * 100).toFixed(1);

  // Filter completed groups
  const completedGroups = stickerGroups.filter(group => {
    const groupCodes = [];
    if (group.hasZero) groupCodes.push('00');
    for (let i = 1; i <= group.count; i++) {
      groupCodes.push(`${group.prefix} ${i}`);
    }
    return groupCodes.every(code => (stickers[code]?.count || 0) > 0);
  });

  // Generate WhatsApp text formatted exactly like the template
  const handleShareWhatsApp = () => {
    const lines = [];
    lines.push(`🏆 Copa 2026 – ❌ Faltam ${stats.missing} – ${stats.owned}/${stats.total} (${percentage}%)`);
    lines.push('');

    stickerGroups.forEach(group => {
      const groupCodes = [];
      if (group.hasZero) groupCodes.push('00');
      for (let i = 1; i <= group.count; i++) {
        groupCodes.push(`${group.prefix} ${i}`);
      }

      const missingCodesForGroup = groupCodes.filter(code => (stickers[code]?.count || 0) === 0);
      
      if (missingCodesForGroup.length > 0) {
        const flagEmoji = getFlagEmoji(group.flag);
        lines.push(`${flagEmoji} ${group.name}:`);
        const formattedCodes = missingCodesForGroup.map(code => {
          if (code === '00') return `${group.prefix}00`;
          return code.replace(/\s+/g, '');
        });
        lines.push(formattedCodes.join(', '));
        lines.push('');
      }
    });

    const text = lines.join('\n').trim();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-container">
      <div className="header-sticky">
        <div className="header-top">
          <h1>Estatísticas</h1>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
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
            <span className="stat-label">Repetidas</span>
            <span className="stat-value">{stats.repeated}</span>
          </div>
        </div>

        {stats.missing > 0 && (
          <button className="share-whatsapp-btn" onClick={handleShareWhatsApp}>
            <Share2 size={18} />
            Enviar Faltantes via WhatsApp
          </button>
        )}

        <div className="completed-countries-section">
          <h2>Países Completados ({completedGroups.length}/{stickerGroups.length})</h2>
          {completedGroups.length === 0 ? (
            <div className="no-completed-card">
              <p>Nenhum país completado ainda. Continue colando figurinhas! 🚀</p>
            </div>
          ) : (
            <div className="completed-grid">
              {completedGroups.map(group => (
                <div key={group.id} className="completed-group-card" style={{ borderLeftColor: group.color }}>
                  {group.flag && group.flag !== 'cc' && (
                    <img 
                      src={`https://flagcdn.com/w40/${group.flag}.png`} 
                      alt={group.name} 
                      className="completed-group-flag"
                    />
                  )}
                  <span className="completed-group-name">{group.name}</span>
                  <span className="completed-group-check">✓</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
