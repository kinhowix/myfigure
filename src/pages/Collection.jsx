import { useState } from 'react';
import { useStickers } from '../context/StickerContext';
import { stickerGroups } from '../data/stickersConfig';
import './Collection.css';

export default function Collection() {
  const { stickers, incrementSticker, decrementSticker } = useStickers();
  const [selectedGroupId, setSelectedGroupId] = useState(stickerGroups[0].id);

  const activeGroup = stickerGroups.find(g => g.id === selectedGroupId);

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

  return (
    <div className="page-container">
      <div className="header-sticky">
        <h1>Minha Coleção</h1>
        <div className="group-selector">
          <select 
            value={selectedGroupId} 
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="group-dropdown"
          >
            {stickerGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
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
              <span className="sticker-number">{code.replace(activeGroup.prefix + ' ', '')}</span>
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
