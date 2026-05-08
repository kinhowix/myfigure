import { useState } from 'react';
import { useStickers } from '../context/StickerContext';
import { stickerGroups } from '../data/stickersConfig';
import './Collection.css';

import { LogOut, Search } from 'lucide-react';

export default function Collection() {
  const { stickers, incrementSticker, decrementSticker, logout } = useStickers();
  const [selectedGroupId, setSelectedGroupId] = useState(stickerGroups[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeGroup = stickerGroups.find(g => g.id === selectedGroupId);
  const isCocaCola = activeGroup.id === 'cc';

  // Filter groups for the dropdown based on search
  const filteredGroups = stickerGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.prefix.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generates the codes for the active group
  const getActiveGroupCodes = () => {
    const codes = [];
    if (activeGroup.hasZero) {
      codes.push('00');
    }
    for (let i = 1; i <= activeGroup.count; i++) {
      codes.push(`${activeGroup.prefix} ${i}`);
    }
    return codes;
  };

  const activeCodes = getActiveGroupCodes();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredGroups.length > 0) {
      setSelectedGroupId(filteredGroups[0].id);
      setSearchQuery('');
    }
  };

  return (
    <div className={`page-container ${isCocaCola ? 'coca-cola-theme' : ''}`} style={{ '--team-color': activeGroup.color }}>
      <div className="header-sticky">
        <div className="header-top">
          <div className="team-header">
            {activeGroup.flag && activeGroup.flag !== 'cc' && (
              <img 
                src={`https://flagcdn.com/w40/${activeGroup.flag}.png`} 
                alt={activeGroup.name} 
                className="team-flag"
              />
            )}
            {isCocaCola && <div className="coca-cola-logo">Coca-Cola</div>}
            <h1>{activeGroup.name}</h1>
          </div>
          <button className="logout-btn" onClick={logout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar seleção..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="group-selector">
          <select 
            value={selectedGroupId} 
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="group-dropdown"
          >
            {filteredGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
            {filteredGroups.length === 0 && (
              <option disabled>Nenhuma seleção encontrada</option>
            )}
          </select>
        </div>
      </div>

      <div className="collection-grid">
        {activeCodes.map(code => {
          const stickerData = stickers[code] || { count: 0 };
          return (
            <div 
              key={code} 
              className={`sticker-card ${stickerData.count > 0 ? 'owned' : 'missing'}`}
              onClick={() => incrementSticker(code)}
              onContextMenu={(e) => {
                e.preventDefault();
                decrementSticker(code);
              }}
            >
              <div className="sticker-info">
                <span className="sticker-prefix">{activeGroup.prefix}</span>
                <span className="sticker-number">{code.replace(activeGroup.prefix + ' ', '')}</span>
              </div>
              {stickerData.count > 1 && (
                <span className="repeated-badge">+{stickerData.count - 1}</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="hint">Toque para adicionar, segure para remover.</p>
    </div>
  );
}
