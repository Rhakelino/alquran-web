# 📖 Al-Quran Digital

<p align="center">
  <img src="public/icon-512x512.png" alt="Al-Quran Digital Logo" width="150">
</p>

<p align="center">
  <strong>Aplikasi Al-Quran Digital berbasis web dengan dukungan offline (PWA)</strong>
</p>

<p align="center">
  <a href="#fitur">Fitur</a> •
  <a href="#teknologi">Teknologi</a> •
  <a href="#instalasi">Instalasi</a> •
  <a href="#api">API</a> •
  <a href="#struktur-proyek">Struktur</a> •
  <a href="#react-native">React Native</a>
</p>

---

## ✨ Fitur

### 📚 Baca Al-Quran
- Daftar 114 surah lengkap dengan nama Arab, transliterasi, dan terjemahan Indonesia
- Pencarian surah berdasarkan nama atau nomor
- Tampilan ayat dengan teks Arab, transliterasi, dan terjemahan Indonesia
- Audio murottal per ayat dengan kontrol play/pause
- Navigasi antar surah

### 🔖 Terakhir Baca
- Tandai ayat terakhir dibaca dengan **long press/tap**
- Simpan progress bacaan di `localStorage`
- Lanjutkan membaca dari posisi terakhir
- Auto-scroll ke ayat yang ditandai

### 🕌 Jadwal Sholat
- Jadwal sholat 5 waktu berdasarkan lokasi GPS
- Deteksi otomatis nama kota
- Jam digital real-time
- Update lokasi manual

### 🎨 Tampilan
- **Dark Mode** & **Light Mode**
- Desain responsif (Mobile & Desktop)
- Font Arab (Amiri) untuk teks Al-Quran
- Animasi transisi yang halus

### 📱 Progressive Web App (PWA)
- **Instalasi ke Home Screen** - Bisa dijalankan seperti aplikasi native
- **Offline Support** - Data surah tersimpan di cache
- **Auto Update** - Pembaruan otomatis saat online

---

## 🛠️ Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | React 18 + Vite |
| **Routing** | React Router DOM v7 |
| **Styling** | TailwindCSS |
| **HTTP Client** | Axios |
| **PWA** | vite-plugin-pwa + Workbox |
| **Icons** | React Icons |
| **Waktu** | Moment.js |

---

## 🚀 Instalasi

### Prasyarat
- Node.js >= 18
- npm atau yarn

### Clone & Install
```bash
# Clone repository
git clone https://github.com/Rhakelino/alquran-digital.git
cd alquran-digital

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

### Scripts
| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |

---

## 🔌 API

Aplikasi ini menggunakan beberapa API eksternal:

### 1. Quran API
- **URL**: `https://api.quran.gading.dev`
- **Dokumentasi**: [quran-api.gading.dev](https://quran-api.gading.dev)

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /surah` | Daftar semua surah |
| `GET /surah/{id}` | Detail surah dengan ayat |

**Contoh Response Surah:**
```json
{
  "code": 200,
  "data": {
    "number": 1,
    "name": {
      "short": "الفاتحة",
      "transliteration": { "id": "Al-Fatihah" },
      "translation": { "id": "Pembukaan" }
    },
    "numberOfVerses": 7,
    "verses": [
      {
        "number": { "inSurah": 1 },
        "text": {
          "arab": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "transliteration": { "en": "Bismillahir rahmanir rahim" }
        },
        "translation": { "id": "Dengan nama Allah Yang Maha Pengasih..." },
        "audio": { "primary": "https://..." }
      }
    ]
  }
}
```

### 2. Prayer Times API
- **URL**: `https://api.aladhan.com/v1/timings`
- **Dokumentasi**: [aladhan.com/prayer-times-api](https://aladhan.com/prayer-times-api)

### 3. Geocoding API (Nama Kota)
- **URL**: `https://nominatim.openstreetmap.org/reverse`
- **Dokumentasi**: [nominatim.org](https://nominatim.org/release-docs/develop/api/Reverse/)

---

## 📁 Struktur Proyek

```
quran-web/
├── public/
│   ├── icon-192x192.png      # Ikon PWA
│   ├── icon-512x512.png      # Ikon PWA
│   └── img/
│       └── loading.png       # Gambar loading
├── src/
│   ├── assets/               # Aset statis
│   ├── components/
│   │   └── InstallPWA.jsx    # Komponen install PWA
│   ├── Pages/
│   │   ├── Home.jsx          # Daftar surah
│   │   ├── SurahDetail.jsx   # Detail surah & ayat
│   │   ├── MainMenu.jsx      # Menu utama
│   │   ├── LastRead.jsx      # Terakhir baca
│   │   ├── WaktuSholat.jsx   # Jadwal sholat
│   │   └── notFound.jsx      # Halaman 404
│   ├── App.jsx               # Router utama
│   ├── main.jsx              # Entry point
│   └── index.css             # Style global
├── vite.config.js            # Konfigurasi Vite + PWA
├── tailwind.config.js        # Konfigurasi Tailwind
└── package.json
```

---

## 💾 Penyimpanan Lokal (localStorage)

| Key | Tipe | Deskripsi |
|-----|------|-----------|
| `darkMode` | `"true"` / `"false"` | Preferensi tema |
| `lastRead` | JSON Object | Data ayat terakhir dibaca |
| `surah_{id}` | JSON Object | Cache data surah |
| `longPressTooltipDismissed` | `"true"` | Status tooltip |

**Format `lastRead`:**
```json
{
  "surahNumber": 2,
  "surahName": "Al-Baqarah",
  "verseNumber": 255
}
```

---

## 📱 Panduan Pengembangan React Native

Jika Anda ingin mengembangkan versi React Native dari aplikasi ini untuk menjalankannya secara **offline**, berikut adalah panduan yang dapat diikuti:

### 1. Inisialisasi Project

```bash
# Menggunakan Expo (Recommended)
npx create-expo-app alquran-mobile
cd alquran-mobile

# ATAU menggunakan React Native CLI
npx react-native init AlQuranMobile
```

### 2. Dependencies yang Diperlukan

```bash
# Navigasi
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Penyimpanan Lokal (untuk offline)
npm install @react-native-async-storage/async-storage

# HTTP Client
npm install axios

# Icons
npm install react-native-vector-icons

# Audio (untuk murottal)
npm install expo-av  # Jika menggunakan Expo
# ATAU
npm install react-native-sound  # Jika menggunakan bare React Native

# Geolocation (untuk jadwal sholat)
npm install expo-location  # Jika menggunakan Expo
# ATAU
npm install @react-native-community/geolocation
```

### 3. Strategi Offline

#### A. Pra-bundle Data Al-Quran
Untuk mendukung offline penuh, unduh semua data surah dan simpan sebagai JSON statis:

```javascript
// src/data/quran.json
// Unduh dari: https://api.quran.gading.dev/surah
// Simpan response lengkap ke file JSON

// Penggunaan di aplikasi
import quranData from '../data/quran.json';
```

#### B. Cache Audio Murottal
```javascript
import * as FileSystem from 'expo-file-system';

const downloadAudio = async (audioUrl, surahId, verseId) => {
  const fileUri = `${FileSystem.documentDirectory}audio/${surahId}_${verseId}.mp3`;
  
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (!fileInfo.exists) {
    await FileSystem.downloadAsync(audioUrl, fileUri);
  }
  
  return fileUri;
};
```

#### C. Async Storage untuk Progress
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simpan terakhir baca
const saveLastRead = async (data) => {
  await AsyncStorage.setItem('lastRead', JSON.stringify(data));
};

// Ambil terakhir baca
const getLastRead = async () => {
  const data = await AsyncStorage.getItem('lastRead');
  return data ? JSON.parse(data) : null;
};
```

### 4. Struktur Folder React Native

```
alquran-mobile/
├── src/
│   ├── data/
│   │   └── quran.json        # Data Al-Quran (offline)
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── SurahDetailScreen.js
│   │   ├── LastReadScreen.js
│   │   └── PrayerTimesScreen.js
│   ├── components/
│   │   ├── SurahCard.js
│   │   ├── VerseItem.js
│   │   └── AudioPlayer.js
│   ├── services/
│   │   ├── QuranService.js   # Logic fetch/load data
│   │   ├── AudioService.js   # Logic audio murottal
│   │   └── StorageService.js # Logic AsyncStorage
│   ├── hooks/
│   │   ├── useQuran.js
│   │   ├── useAudio.js
│   │   └── useTheme.js
│   └── navigation/
│       └── AppNavigator.js
├── assets/
│   └── fonts/
│       └── Amiri-Regular.ttf # Font Arab
└── App.js
```

### 5. Contoh Implementasi Screen

```javascript
// src/screens/SurahDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quranData from '../data/quran.json';

export default function SurahDetailScreen({ route }) {
  const { surahId } = route.params;
  const [surah, setSurah] = useState(null);
  
  useEffect(() => {
    // Load dari data lokal (offline)
    const surahData = quranData.find(s => s.number === surahId);
    setSurah(surahData);
  }, [surahId]);
  
  const handleLongPress = async (verseNumber) => {
    await AsyncStorage.setItem('lastRead', JSON.stringify({
      surahNumber: surah.number,
      surahName: surah.name.transliteration.id,
      verseNumber
    }));
  };
  
  return (
    <FlatList
      data={surah?.verses}
      renderItem={({ item, index }) => (
        <TouchableOpacity 
          onLongPress={() => handleLongPress(index + 1)}
        >
          <Text style={styles.arabicText}>{item.text.arab}</Text>
          <Text>{item.translation.id}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
```

### 6. Mengunduh Data untuk Offline

Jalankan script berikut untuk mengunduh semua data surah:

```javascript
// scripts/downloadQuranData.js
const axios = require('axios');
const fs = require('fs');

async function downloadAllSurahs() {
  const allSurahs = [];
  
  for (let i = 1; i <= 114; i++) {
    console.log(`Downloading surah ${i}...`);
    const response = await axios.get(`https://api.quran.gading.dev/surah/${i}`);
    allSurahs.push(response.data.data);
    
    // Delay untuk menghindari rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  fs.writeFileSync(
    './src/data/quran.json', 
    JSON.stringify(allSurahs, null, 2)
  );
  
  console.log('Download complete!');
}

downloadAllSurahs();
```

Jalankan dengan:
```bash
node scripts/downloadQuranData.js
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk saran dan perbaikan.

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur/FiturBaru`)
3. Commit perubahan (`git commit -m 'Menambahkan FiturBaru'`)
4. Push ke branch (`git push origin fitur/FiturBaru`)
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dibuat dengan ❤️ oleh **Rhakelino**.

Data Al-Quran disediakan oleh [quran-api.gading.dev](https://quran-api.gading.dev)

---

<p align="center">
  <strong>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</strong>
</p>
