import { useStickers } from '../context/StickerContext';
import './Repeated.css';

export default function Repeated() {
  const { stickers, updateNote, incrementSticker, decrementSticker } = useStickers();
  
  // Transform object to array and filter repeated
  const repeatedStickers = Object.entries(stickers)
    .filter(([code, data]) => data.count > 1)
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="page-container">
      <h1>Figurinhas Repetidas</h1>
      
      {repeatedStickers.length === 0 ? (
        <div className="empty-state">
          <p>Você não tem nenhuma figurinha repetida ainda!</p>
        </div>
      ) : (
        <div className="repeated-list">
          {repeatedStickers.map(sticker => (
            <div key={sticker.code} className="repeated-card">
              <div className="repeated-header">
                <div className="repeated-number">
                  <span>{sticker.code}</span>
                </div>
                <div className="repeated-controls">
                  <button className="control-btn" onClick={() => decrementSticker(sticker.code)}>-</button>
                  <span className="repeated-count">{sticker.count - 1} para troca</span>
                  <button className="control-btn" onClick={() => incrementSticker(sticker.code)}>+</button>
                </div>
              </div>
              <textarea 
                className="note-input"
                placeholder="Ex: Prometida para o João, Trocada com o primo..."
                value={sticker.note}
                onChange={(e) => updateNote(sticker.code, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
