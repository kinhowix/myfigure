import { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { generateEmptyStickersMap, getTotalStickersCount } from '../data/stickersConfig';

const StickerContext = createContext();

export const StickerProvider = ({ children }) => {
  const [stickers, setStickers] = useState(generateEmptyStickersMap());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Sem usuário logado, libera o loading imediatamente
        setLoading(false);
      }
      // Se há usuário, o loading será liberado pelo onSnapshot do Firestore
    });
    return () => unsubscribe();
  }, []);

  // Firestore Listener for the Family Album
  useEffect(() => {
    if (!user) return;

    // Timeout de segurança: se o Firestore demorar mais de 5s, libera o loading
    // para evitar tela azul travada (problemas de rede no celular)
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const albumRef = doc(db, 'albums', 'familia');

    const unsubscribe = onSnapshot(albumRef, (docSnap) => {
      clearTimeout(safetyTimeout);
      if (docSnap.exists()) {
        const data = docSnap.data().stickers;
        // Merge with empty map in case new codes were added to config
        setStickers(prev => ({ ...prev, ...data }));
      } else {
        // First time initialization
        setDoc(albumRef, { stickers: generateEmptyStickersMap() });
      }
      setLoading(false);
    }, (error) => {
      clearTimeout(safetyTimeout);
      console.error("Error fetching album:", error);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, [user]);

  // Actions
  const updateFirebase = (newStickers) => {
    if (!user) return;
    const albumRef = doc(db, 'albums', 'familia');
    setDoc(albumRef, { stickers: newStickers }, { merge: true });
  };

  const incrementSticker = (code) => {
    setStickers(prev => {
      const current = prev[code] || { count: 0, note: '' };
      const next = { ...prev, [code]: { ...current, count: current.count + 1 } };
      updateFirebase(next);
      return next;
    });
  };

  const decrementSticker = (code) => {
    setStickers(prev => {
      const current = prev[code] || { count: 0, note: '' };
      if (current.count > 0) {
        const next = { ...prev, [code]: { ...current, count: current.count - 1 } };
        updateFirebase(next);
        return next;
      }
      return prev;
    });
  };

  const updateNote = (code, note) => {
    setStickers(prev => {
      const current = prev[code] || { count: 0, note: '' };
      const next = { ...prev, [code]: { ...current, note } };
      updateFirebase(next);
      return next;
    });
  };

  const logout = () => {
    auth.signOut();
  };

  const resetAlbum = () => {
    const emptyMap = generateEmptyStickersMap();
    setStickers(emptyMap);
    updateFirebase(emptyMap);
  };

  const removeSticker = (code) => {
    setStickers(prev => {
      const current = prev[code] || { count: 0, note: '' };
      const next = { ...prev, [code]: { ...current, count: 0 } };
      updateFirebase(next);
      return next;
    });
  };

  // Stats calculation
  const stats = {
    total: getTotalStickersCount(),
    owned: 0,
    missing: 0,
    repeated: 0
  };

  Object.values(stickers).forEach(s => {
    if (s.count > 0) stats.owned += 1;
    if (s.count === 0) stats.missing += 1;
    if (s.count > 1) stats.repeated += (s.count - 1);
  });

  return (
    <StickerContext.Provider value={{
      stickers,
      user,
      loading,
      incrementSticker,
      decrementSticker,
      updateNote,
      logout,
      resetAlbum,
      removeSticker,
      stats
    }}>
      {children}
    </StickerContext.Provider>
  );
};

export const useStickers = () => useContext(StickerContext);
