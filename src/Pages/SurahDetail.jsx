import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Moon, Sun, BookOpen, Search, Check, Info, Settings2, PlayCircle, Minus, Plus } from 'lucide-react';
import { getFromCache, saveToCache, CACHE_KEYS } from '../services/cacheService';
import { useTheme } from '../components/theme-provider';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function SurahDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [selectedVerse, setSelectedVerse] = useState(null);
  const [longPressVerse, setLongPressVerse] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTafsirModal, setShowTafsirModal] = useState(false);
  const [fontSize, setFontSize] = useState(32); // Base size for Arabic text
  const [showSettings, setShowSettings] = useState(false);
  const [scrollToVerse, setScrollToVerse] = useState(null);

  const verseRefs = useRef({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ayatParam = searchParams.get('ayat');
    if (ayatParam) {
      const verseNum = parseInt(ayatParam);
      setSelectedVerse(verseNum);
      setScrollToVerse(verseNum);
    }
  }, [location.search]);

  useEffect(() => {
    if (!loading && scrollToVerse && surah) {
      const scrollToElement = () => {
        const element = verseRefs.current[scrollToVerse];
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToElement);
      });
    }
  }, [loading, scrollToVerse, surah]);

  const saveLastReadVerse = useCallback((verseNumber) => {
    if (!surah) return;
    try {
      const lastReadData = {
        surahNumber: surah.number,
        surahNameArab: surah.name_short,
        surahName: surah.name_transliteration?.id || surah.name_latin,
        verseNumber: verseNumber
      };
      localStorage.setItem('lastRead', JSON.stringify(lastReadData));
    } catch (error) {
      console.error('Error saving last read verse', error);
    }
  }, [surah]);

  const confirmLastRead = () => {
    if (longPressVerse) {
      saveLastReadVerse(longPressVerse);
      setShowSuccessModal(true);
      setSelectedVerse(longPressVerse);
      setLongPressVerse(null);
      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  };

  useEffect(() => {
    // Reset selectedverse by default for new surah
    let newSelectedVerse = null;

    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
      const parsedLastRead = JSON.parse(savedLastRead);
      if (parsedLastRead.surahNumber === parseInt(id)) {
        // Highlight the verse if this is the last read surah
        newSelectedVerse = parsedLastRead.verseNumber;
      }
    }

    // Only set it here if we aren't relying on URL params
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.get('ayat')) {
      setSelectedVerse(newSelectedVerse);
    }

    // Load font size preference
    const savedFontSize = localStorage.getItem('arabicFontSize');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [id, location.search]);

  useEffect(() => {
    const getSurahDetail = async () => {
      setLoading(true);
      setError(null);

      // Reset scroll and states for new surah
      window.scrollTo(0, 0);

      // Only reset scrollToVerse if there are no search parameters (like ?ayat=)
      if (!location.search) {
        setScrollToVerse(null);
      }
      try {
        const cachedSurah = getFromCache(CACHE_KEYS.SURAH_DETAIL(id));
        if (cachedSurah && cachedSurah.name_transliteration) {
          setSurah(cachedSurah);
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://kael-api-quran.vercel.app/api/surah/${id}`);
        if (response.data && response.data.data) {
          const surahData = response.data.data;
          setSurah(surahData);
          saveToCache(CACHE_KEYS.SURAH_DETAIL(id), surahData);
        } else {
          throw new Error('Data tidak ditemukan');
        }
      } catch (error) {
        setError(error.message);
        navigate('/notFound');
      } finally {
        setLoading(false);
      }
    };
    getSurahDetail();
  }, [id, navigate]);

  const changeFontSize = (delta) => {
    const newSize = Math.max(20, Math.min(56, fontSize + delta));
    setFontSize(newSize);
    localStorage.setItem('arabicFontSize', newSize.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Memuat Ayat...</p>
      </div>
    );
  }

  if (error) return null;

  const showBismillah = parseInt(id) !== 1 && parseInt(id) !== 9;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* Modals */}
      <Dialog open={!!longPressVerse} onOpenChange={(open) => !open && setLongPressVerse(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Tandai Terakhir Dibaca</DialogTitle>
            <DialogDescription>
              Tandai ayat {longPressVerse} sebagai bacaan terakhir Anda?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setLongPressVerse(null)} className="rounded-xl">Batal</Button>
            <Button onClick={confirmLastRead} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-2xl flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl mb-2">Berhasil Disimpan</DialogTitle>
          <DialogDescription className="text-base">
            Ayat {selectedVerse} telah ditandai.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Tafsir Drawer/Modal */}
      <Dialog open={showTafsirModal} onOpenChange={setShowTafsirModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-0">
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">Tafsir Surah {surah.name_transliteration?.id}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Ringkasan makna dan panduan surah.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed text-foreground/90">
              {surah.tafsir_id ? (
                <p>{surah.tafsir_id}</p>
              ) : (
                <p className="text-center italic text-muted-foreground">Tafsir lengkap belum tersedia untuk surah ini.</p>
              )}
            </div>
            <DialogFooter className="mt-8">
              <Button onClick={() => setShowTafsirModal(false)} className="w-full md:w-auto rounded-xl">Tutup</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Pengaturan Bacaan</DialogTitle>
            <DialogDescription>Sesuaikan tampilan agar nyaman saat membaca.</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium">Ukuran Teks Arab</label>
              <div className="flex items-center gap-4 bg-secondary/50 p-2 rounded-xl">
                <Button variant="ghost" size="icon" onClick={() => changeFontSize(-4)} disabled={fontSize <= 20}>
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center font-medium">{fontSize}px</div>
                <Button variant="ghost" size="icon" onClick={() => changeFontSize(4)} disabled={fontSize >= 56}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Tema Tampilan</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={isDark ? "outline" : "default"}
                  onClick={() => setTheme('light')}
                  className="rounded-xl"
                >
                  <Sun className="w-4 h-4 mr-2" /> Terang
                </Button>
                <Button
                  variant={isDark ? "default" : "outline"}
                  onClick={() => setTheme('dark')}
                  className="rounded-xl"
                >
                  <Moon className="w-4 h-4 mr-2" /> Gelap
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/quran')}
            className="p-2 -ml-2 rounded-full hover:bg-secondary/80 text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold tracking-tight">{surah.name_transliteration?.id}</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {surah.revelation?.id} • {surah.number_of_verses} Ayat
            </p>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 -mr-2 rounded-full hover:bg-secondary/80 text-foreground transition-colors"
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 pt-10">
        {/* Surah Title Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-6 rounded-3xl bg-secondary/30 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-6xl font-arabic font-bold text-primary leading-tight">
              {surah.name_short}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
            "{surah.name_translation?.id}"
          </p>
          <Button
            onClick={() => setShowTafsirModal(true)}
            variant="outline"
            className="rounded-full px-6 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors border-primary/20"
          >
            <Info className="w-4 h-4" />
            Baca Tafsir Surah
          </Button>
        </motion.div>

        {/* Bismillah Container */}
        {showBismillah && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 pb-12 border-b border-border/30 text-center"
          >
            <p className="font-arabic text-4xl md:text-5xl text-foreground font-bold leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </motion.div>
        )}

        {/* Verses List */}
        <div className="space-y-10">
          {surah.verses.map((verse, index) => (
            <div
              key={verse.number_in_surah}
              id={`ayat-${verse.number_in_surah}`}
              ref={el => verseRefs.current[verse.number_in_surah] = el}
              onClick={() => setLongPressVerse(verse.number_in_surah)}
              className={`
                group relative p-6 md:p-8 rounded-3xl transition-all duration-300 cursor-pointer
                ${selectedVerse === verse.number_in_surah
                  ? 'bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/20'
                  : 'hover:bg-secondary/30'
                }
              `}
            >
              {/* Verse Number & Actions */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors
                    ${selectedVerse === verse.number_in_surah ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                  `}>
                    {verse.number_in_surah}
                  </div>
                  {selectedVerse === verse.number_in_surah && (
                    <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">Terakhir Dibaca</span>
                  )}
                </div>
              </div>

              {/* Arabic Text */}
              <div
                className="mb-10 w-full text-right"
                dir="rtl"
              >
                <p
                  className="font-arabic text-foreground font-bold leading-[2.5] tracking-wide"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {verse.text_arab}
                </p>
              </div>

              {/* Transliteration & Translation */}
              <div className="space-y-3 pt-6 border-t border-border/30">
                <p className="text-primary/80 font-medium text-lg italic tracking-wide">
                  {verse.text_transliteration}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {verse.translation_id}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Next Surah Navigator */}
        {parseInt(id) < 114 && (
          <div className="mt-20 flex justify-center">
            <Button
              onClick={() => navigate(`/quran/surah/${parseInt(id) + 1}`)}
              size="lg"
              className="rounded-full px-8 py-6 h-auto text-lg hover:scale-105 transition-transform bg-secondary/80 text-foreground hover:bg-secondary"
            >
              Lanjut ke Surah {parseInt(id) + 1}
              <ArrowLeft className="w-5 h-5 ml-3 rotate-180" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default SurahDetail;