import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { CiDark, CiLight } from "react-icons/ci";
import { getFromCache, saveToCache, CACHE_KEYS } from '../services/cacheService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function LastRead() {
  const navigate = useNavigate();
  const [lastRead, setLastRead] = useState(null);
  const [surahDetail, setSurahDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }
  }, []);

  // Load last read data
  useEffect(() => {
    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
      const parsedLastRead = JSON.parse(savedLastRead);
      setLastRead(parsedLastRead);

      // Fetch surah details with cache
      const fetchSurahDetail = async () => {
        setLoading(true);
        try {
          // Cek cache terlebih dahulu
          const cachedSurah = getFromCache(CACHE_KEYS.SURAH_DETAIL(parsedLastRead.surahNumber));
          if (cachedSurah && cachedSurah.name_transliteration) {
            console.log(`📦 Menggunakan data surah ${parsedLastRead.surahNumber} dari cache`);
            setSurahDetail(cachedSurah);
            return;
          }

          // Jika tidak ada cache, ambil dari API
          console.log(`🌐 Mengambil data surah ${parsedLastRead.surahNumber} dari API`);
          const response = await axios.get(`https://kael-api-quran.vercel.app/api/surah/${parsedLastRead.surahNumber}`);
          const surahData = response.data.data;

          // Simpan ke cache
          saveToCache(CACHE_KEYS.SURAH_DETAIL(parsedLastRead.surahNumber), surahData);
          setSurahDetail(surahData);
        } catch (error) {
          console.error('Error fetching surah details', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSurahDetail();
    }
  }, []);

  const toggleMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Ubah fungsi handleNavigateToSurah
  const handleNavigateToSurah = () => {
    if (lastRead) {
      // Tambahkan parameter query 'ayat' untuk scroll otomatis
      navigate(`/quran/surah/${lastRead.surahNumber}?ayat=${lastRead.verseNumber}`);
    }
  };

  const clearLastRead = () => {
    localStorage.removeItem('lastRead');
    setLastRead(null);
    setSurahDetail(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/img/loading.png" className="w-20 animate-pulse" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen
      ${isDarkMode ? 'bg-zinc-950 text-zinc-50' : 'bg-zinc-50 text-zinc-900'}
    `}>
      <div className="container mx-auto md:px-4 md:py-8 max-w-xl">
        <Card className={`shadow-lg border-muted/50 ${isDarkMode ? 'bg-zinc-950/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
                <IoHome className="text-2xl" />
              </Button>
              <h2 className="text-xl font-bold tracking-tight">Terakhir Dibaca</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMode}
                className="rounded-full"
              >
                {isDarkMode ? <CiLight className='text-xl' /> : <CiDark className='text-xl' />}
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Konten Terakhir Baca */}
            {lastRead ? (
              <div className="text-center space-y-6">
                <Card className="bg-muted/30 border-muted">
                  <CardHeader>
                    <CardTitle className="text-2xl font-[Amiri] text-primary">
                      {lastRead.surahName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="text-lg text-muted-foreground">
                        Ayat ke
                      </div>
                      <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold">
                        {lastRead.verseNumber}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center pt-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-semibold"
                    onClick={handleNavigateToSurah}
                  >
                    Lanjutkan Membaca
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={clearLastRead}
                  >
                    Hapus Riwayat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted/50 mx-auto flex items-center justify-center mb-4">
                  <IoHome className="text-4xl text-muted-foreground/50" />
                </div>
                <p className="text-xl text-muted-foreground font-medium">
                  Belum ada riwayat bacaan
                </p>
                <p className="text-sm text-muted-foreground/80">
                  Mulai membaca Al-Quran dan tandai ayat yang sedang dibaca.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => navigate('/quran')}>
                  Mulai Membaca
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LastRead;