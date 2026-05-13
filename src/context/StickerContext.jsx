import { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { stickerGroups, generateEmptyStickersMap, getTotalStickersCount } from '../data/stickersConfig';

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
        setLoading(false);
      }
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
      if (docSnap.exists()) {
        const dbData = docSnap.data().stickers || {};
        const emptyMap = generateEmptyStickersMap();
        
        // Create a fast lookup map (no spaces, uppercase)
        const dbLookup = {};
        Object.entries(dbData).forEach(([key, val]) => {
          if (key && val) {
            const normalizedKey = key.replace(/\s+/g, '').toUpperCase();
            dbLookup[normalizedKey] = val;
          }
        });

        // Map database data to current config format
        const mergedStickers = { ...emptyMap };
        Object.keys(mergedStickers).forEach(configKey => {
          const normalizedConfigKey = configKey.replace(/\s+/g, '').toUpperCase();
          
          // 1. Try exact match
          if (dbData[configKey]) {
            mergedStickers[configKey] = dbData[configKey];
          } 
          // 2. Try normalized match (handles "BRA1" vs "BRA 1")
          else if (dbLookup[normalizedConfigKey]) {
            mergedStickers[configKey] = dbLookup[normalizedConfigKey];
          }
          // 3. Try flag-based fallback (handles prefix changes like "BR" -> "BRA")
          else {
            const parts = configKey.split(' ');
            const prefix = parts[0];
            const number = parts[1] || '';
            const group = stickerGroups.find(g => g.prefix === prefix);
            
            if (group && group.flag) {
              const flagPrefix = group.flag.toUpperCase();
              const flagKey = number ? `${flagPrefix} ${number}` : flagPrefix;
              const normalizedFlagKey = flagKey.replace(/\s+/g, '').toUpperCase();
              
              if (dbData[flagKey]) {
                mergedStickers[configKey] = dbData[flagKey];
              } else if (dbLookup[normalizedFlagKey]) {
                mergedStickers[configKey] = dbLookup[normalizedFlagKey];
              }
            }
          }
        });

        setStickers(mergedStickers);
      } else {
        console.log("Album not found, creating new one");
        setDoc(albumRef, { stickers: generateEmptyStickersMap() });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching album:", error);
      setLoading(false);
    });

    return () => unsubscribe();
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



  const logout = () => {
    auth.signOut();
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
      logout,
      removeSticker,
      stats
    }}>
      {children}
    </StickerContext.Provider>
  );
};

export const useStickers = () => useContext(StickerContext);
