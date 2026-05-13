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
      console.log("Auth State Changed:", currentUser ? "Logged In" : "Logged Out");
      setUser(currentUser);
      
      // If no user, we can stop loading immediately
      if (!currentUser) {
        // Sem usuário logado, libera o loading imediatamente
        setLoading(false);
      }
      // Se há usuário, o loading será liberado pelo onSnapshot do Firestore
    });

    // Safety timeout: if nothing happens in 10 seconds, stop loading
    // to avoid the "blue screen of death" on mobile
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Firestore Listener for the Family Album
  useEffect(() => {
    if (!user) return;

    console.log("Setting up Firestore listener for user:", user.email);
    const albumRef = doc(db, 'albums', 'familia');

    const unsubscribe = onSnapshot(albumRef, (docSnap) => {
      clearTimeout(safetyTimeout);
      if (docSnap.exists()) {
        const data = docSnap.data().stickers;
        console.log("Album data received");
        // Merge with empty map in case new codes were added to config
        setStickers(prev => ({ ...prev, ...data }));
      } else {
        console.log("Album not found, creating new one");
        // First time initialization
        setDoc(albumRef, { stickers: generateEmptyStickersMap() });
      }
      setLoading(false);
    }, (error) => {
      clearTimeout(safetyTimeout);
      console.error("Error fetching album:", error);
      // Even on error, we must stop loading so the app can render something
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
