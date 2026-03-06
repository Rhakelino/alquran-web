// API Cache Service for Quran API
// Menggunakan localStorage untuk menyimpan data dan mengurangi panggilan API

const CACHE_PREFIX = 'quran_cache_';
const CACHE_EXPIRY_KEY = 'quran_cache_expiry_';
const DEFAULT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

// Mendapatkan data dari cache
export const getFromCache = (key) => {
    try {
        const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY + key);

        // Cek apakah cache sudah kedaluwarsa
        if (expiryTime && Date.now() > parseInt(expiryTime)) {
            // Cache kedaluwarsa, hapus data
            localStorage.removeItem(CACHE_PREFIX + key);
            localStorage.removeItem(CACHE_EXPIRY_KEY + key);
            return null;
        }

        const cachedData = localStorage.getItem(CACHE_PREFIX + key);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
};

// Menyimpan data ke cache
export const saveToCache = (key, data, duration = DEFAULT_CACHE_DURATION) => {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
        localStorage.setItem(CACHE_EXPIRY_KEY + key, (Date.now() + duration).toString());
    } catch (error) {
        console.error('Error saving to cache:', error);
        // Jika localStorage penuh, bersihkan cache lama
        clearOldCache();
    }
};

// Membersihkan cache lama
export const clearOldCache = () => {
    try {
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_EXPIRY_KEY)) {
                const expiryTime = localStorage.getItem(key);
                if (expiryTime && Date.now() > parseInt(expiryTime)) {
                    const dataKey = key.replace(CACHE_EXPIRY_KEY, CACHE_PREFIX);
                    keysToRemove.push(key, dataKey);
                }
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.error('Error clearing old cache:', error);
    }
};

// Membersihkan semua cache Quran
export const clearAllQuranCache = () => {
    try {
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_KEY))) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.error('Error clearing all cache:', error);
    }
};

// Cache keys
export const CACHE_KEYS = {
    ALL_SURAHS: 'all_surahs',
    SURAH_DETAIL: (id) => `surah_${id}`,
};
