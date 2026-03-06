import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { getFromCache, saveToCache, CACHE_KEYS } from '../services/cacheService';
import { useTheme } from '../components/theme-provider';

function Home() {
    const [surahs, setSurah] = useState([]);
    const [filteredSurahs, setFilteredSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [lastRead, setLastRead] = useState(null);
    const [greeting, setGreeting] = useState('');

    // Theme provider hook
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        // Init greeting
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) setGreeting('Selamat Pagi');
        else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang');
        else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');

        // Init last read
        const storedLastRead = localStorage.getItem('lastRead');
        if (storedLastRead) {
            try {
                setLastRead(JSON.parse(storedLastRead));
            } catch (e) {
                console.error('Failed to parse last read', e);
            }
        }

        const getData = async () => {
            try {
                const cachedSurahs = getFromCache(CACHE_KEYS.ALL_SURAHS);
                if (cachedSurahs && cachedSurahs.length > 0 && cachedSurahs[0].name_transliteration) {
                    setSurah(cachedSurahs);
                    setFilteredSurahs(cachedSurahs);
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://kael-api-quran.vercel.app/api/surah');
                const surahData = response.data.data;
                saveToCache(CACHE_KEYS.ALL_SURAHS, surahData);
                setSurah(surahData);
                setFilteredSurahs(surahData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        getData();
    }, []);

    const handleSearch = (event) => {
        const text = event.target.value;
        setSearchText(text);
        const filtered = surahs.filter(surah =>
            surah.name_transliteration.id.toLowerCase().includes(text.toLowerCase()) ||
            surah.name_translation.id.toLowerCase().includes(text.toLowerCase()) ||
            surah.number.toString().includes(text)
        );
        setFilteredSurahs(filtered);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-sans pb-20">
            {/* Header / Nav */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/40">
                <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold tracking-tight">Al-Quran Digital</h1>
                    </div>
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="p-2.5 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <main className="container max-w-3xl mx-auto px-4 pt-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 space-y-6"
                >
                    <div>
                        <h2 className="text-muted-foreground text-sm font-medium mb-1">{greeting}</h2>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Assalamu'alaikum</h3>
                    </div>

                    {/* Last Read Card */}
                    {lastRead && (
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <BookOpen className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium">
                                    <Clock className="w-4 h-4" />
                                    Terakhir Dibaca
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold font-arabic mb-1">{lastRead.surahNameArab || lastRead.surahName}</h4>
                                    <p className="text-primary-foreground/90 font-medium">
                                        Surah {lastRead.surahName} • Ayat {lastRead.verseNumber}
                                    </p>
                                </div>
                                <Link
                                    to={`/quran/surah/${lastRead.surahNumber}?ayat=${lastRead.verseNumber}`}
                                    className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-4 py-2.5 rounded-xl font-semibold w-fit text-sm hover:bg-primary-foreground/90 transition-colors"
                                >
                                    Lanjutkan Membaca
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            value={searchText}
                            onChange={handleSearch}
                            className="w-full h-14 pl-12 pr-4 bg-secondary/50 border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-base placeholder:text-muted-foreground"
                            placeholder="Cari surah..."
                        />
                    </div>
                </motion.div>

                {/* Surah List */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold tracking-tight">Daftar Surah</h3>
                    <p className="text-sm text-muted-foreground">{filteredSurahs.length} Surah</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground font-medium animate-pulse">Memuat Surah...</p>
                    </div>
                ) : filteredSurahs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSurahs.map((surah) => (
                            <div key={surah.number}>
                                <Link to={`/quran/surah/${surah.number}`}>
                                    <div className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex items-center justify-center w-12 h-12 bg-secondary/80 rounded-xl group-hover:bg-primary/10 transition-colors">
                                                <div className="absolute inset-0 border-[1.5px] border-primary/20 rotate-45 rounded-md group-hover:border-primary/40 transition-colors" />
                                                <span className="font-bold text-sm z-10">{surah.number}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-base mb-0.5 group-hover:text-primary transition-colors">
                                                    {surah.name_transliteration?.id}
                                                </h4>
                                                <p className="text-xs text-muted-foreground tracking-wide uppercase">
                                                    {surah.revelation?.id} • {surah.number_of_verses} Ayat
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-arabic text-xl md:text-2xl font-bold text-primary mr-1">
                                                {surah.name_short}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/80 mb-4">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-bold mb-1">Surah tidak ditemukan</h4>
                        <p className="text-muted-foreground">Coba gunakan kata kunci pencarian yang lain.</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

export default Home;