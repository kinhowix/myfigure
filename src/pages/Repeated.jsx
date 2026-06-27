import { useState } from 'react';
import { useStickers } from '../context/StickerContext';
import { stickerGroups } from '../data/stickersConfig';
import './Repeated.css';

import { LogOut, Search, Share2 } from 'lucide-react';

const getFlagEmoji = (flagCode) => {
  if (!flagCode) return '⭐';
  const specialEmojis = {
    'un': '⭐',
    'cc': '🥤',
    'gb-sct': String.fromCodePoint(0x1F3F4, 0xE0067, 0xE0062, 0xE0073, 0xE0063, 0xE0074, 0xE007F),
    'gb-eng': String.fromCodePoint(0x1F3F4, 0xE0067, 0xE0062, 0xE0065, 0xE006E, 0xE0067, 0xE007F)
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

const normalizeString = (value = '') => {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const getStickerGroupOrder = (code) => {
  if (code === '00') {
    const specialGroup = stickerGroups.find(group => group.hasZero);
    return specialGroup ? stickerGroups.findIndex(group => group.id === specialGroup.id) : stickerGroups.length;
  }

  const [prefix] = code.split(' ');
  const groupIndex = stickerGroups.findIndex(group => group.prefix === prefix);
  return groupIndex === -1 ? stickerGroups.length : groupIndex;
};

const getStickerNumber = (code) => {
  if (code === '00') return 0;
  const parts = code.split(' ');
  return parseInt(parts[1] || '0', 10);
};

export default function Repeated() {
  const { stickers, incrementSticker, decrementSticker, logout, stats } = useStickers();
  const [searchQuery, setSearchQuery] = useState('');
  const percentage = ((stats.owned / stats.total) * 100).toFixed(1);

  const normalizedQuery = normalizeString(searchQuery).replace(/\s+/g, '');

  const repeatedStickers = Object.entries(stickers)
    .filter(([code, data]) => data.count > 1)
    .map(([code, data]) => ({ code, ...data }))
    .filter(sticker => {
      if (!normalizedQuery) return true;
      const normalizedCode = normalizeString(sticker.code).replace(/\s+/g, '');
      return normalizedCode.includes(normalizedQuery);
    })
    .sort((a, b) => {
      const orderDifference = getStickerGroupOrder(a.code) - getStickerGroupOrder(b.code);
      if (orderDifference !== 0) return orderDifference;
      return getStickerNumber(a.code) - getStickerNumber(b.code);
    });

  const repeatedExtraCount = repeatedStickers.reduce((sum, sticker) => sum + (sticker.count - 1), 0);

  const handleShareWhatsApp = () => {
    const lines = [];
    lines.push(`🏆 Copa 2026 – 🔁 Repetidas ${repeatedExtraCount} – ${stats.owned}/${stats.total} (${percentage}%)`);
    lines.push('');

    stickerGroups.forEach(group => {
      const groupCodes = [];
      if (group.hasZero) groupCodes.push('00');
      for (let i = 1; i <= group.count; i++) {
        groupCodes.push(`${group.prefix} ${i}`);
      }

      const repeatedCodesForGroup = groupCodes.filter(code => (stickers[code]?.count || 0) > 1);

      if (repeatedCodesForGroup.length > 0) {
        const flagEmoji = getFlagEmoji(group.flag);
        lines.push(`${flagEmoji} ${group.name}:`);
        const formattedCodes = repeatedCodesForGroup.map(code => {
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
          <h1>Figurinhas Repetidas</h1>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {repeatedStickers.length === 0 ? (
        <div className="empty-state">
          <p>{searchQuery ? 'Nenhuma figurinha repetida encontrada para esta busca.' : 'Você não tem nenhuma figurinha repetida ainda!'}</p>
        </div>
      ) : (
        <>
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="search"
                placeholder="Buscar por código"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                enterKeyHint="search"
              />
            </div>
          </div>

          <button className="share-whatsapp-btn" onClick={handleShareWhatsApp}>
            <Share2 size={18} />
            Enviar Repetidas via WhatsApp
          </button>

          <div className="repeated-list">
            {repeatedStickers.map(sticker => (
              <div key={sticker.code} className="repeated-card">
                <div className="repeated-header">
                  <div className="repeated-number">
                    <span>{sticker.code}</span>
                  </div>
                  <div className="repeated-controls">
                    <button className="control-btn" onClick={() => decrementSticker(sticker.code)}>-</button>
                    <span className="repeated-count">{sticker.count - 1} </span>
                    <button className="control-btn" onClick={() => incrementSticker(sticker.code)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
