# 🔌 API Routes Documentation

Dokumentasi lengkap untuk semua API eksternal yang digunakan pada aplikasi Al-Quran Digital.

---

## 📖 Quran API

**Base URL:** `https://kael-api-quran.vercel.app`  

### Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/surah` | Mendapatkan daftar semua 114 surah |
| `GET` | `/api/surah/{id}` | Mendapatkan detail surah beserta ayat-ayatnya |

### GET `/api/surah`

Mendapatkan daftar semua surah dalam Al-Quran.

**Request:**
```http
GET https://kael-api-quran.vercel.app/api/surah
```

**Response:**
```json
{
  "status": "success",
  "message": "All surahs retrieved successfully",
  "meta": {
    "total_surahs": 114
  },
  "data": [
    {
      "number": 1,
      "sequence": 5,
      "number_of_verses": 7,
      "name_short": "الفاتحة",
      "name_long": "سُورَةُ ٱلْفَاتِحَةِ",
      "name_transliteration": {
        "en": "Al-Faatiha",
        "id": "Al-Fatihah"
      },
      "name_translation": {
        "en": "The Opening",
        "id": "Pembukaan"
      },
      "revelation": {
        "en": "Meccan",
        "id": "Makkiyyah",
        "arab": "مكة"
      },
      "tafsir_id": "Surat Al Faatihah...",
      "pre_bismillah": null
    }
  ]
}
```

---

### GET `/api/surah/{id}`

Mendapatkan detail surah berdasarkan nomor surah (1-114).

**Request:**
```http
GET https://kael-api-quran.vercel.app/api/surah/4
```

**Parameters:**

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `id` | Integer | ✅ | Nomor surah (1-114) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "number": 4,
    "name_short": "النساء",
    "number_of_verses": 176,
    "name_transliteration": {
      "id": "An-Nisa'"
    },
    "name_translation": {
      "id": "Wanita"
    },
    "tafsir_id": "Surat An Nisaa' yang terdiri dari 176 ayat...",
    "verses": [
      {
         "number_in_surah": 1,
         "text_arab": "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ...",
         "text_transliteration": "Yaa ayyuhan naasuttaqoo Rabbakumul...",
         "translation_id": "Wahai manusia! Bertakwalah kepada Tuhanmu..."
      }
    ]
  }
}
```

## 🛠️ Penggunaan dalam Aplikasi

### Contoh Fetch Surah List (React)

```javascript
import axios from 'axios';

const API_BASE = 'https://kael-api-quran.vercel.app';

// Fetch semua surah
export const fetchAllSurahs = async () => {
  const response = await axios.get(`${API_BASE}/api/surah`);
  return response.data.data; // Array of surah
};

// Fetch detail surah
export const fetchSurahDetail = async (surahId) => {
  const response = await axios.get(`${API_BASE}/api/surah/${surahId}`);
  return response.data.data; // Surah object with verses
};
```

### Struktur Data Surah

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `number` | Integer | Nomor surah (1-114) |
| `number_of_verses` | Integer | Jumlah ayat dalam surah |
| `name_short` | String | Nama surah dalam bahasa Arab (singkat) |
| `name_transliteration.id` | String | Nama surah dalam latin (Indonesia) |
| `name_translation.id` | String | Terjemahan nama surah (Indonesia) |
| `revelation.id` | String | Tempat turun (Makkiyyah/Madaniyyah) |
| `tafsir_id` | String | Tafsir surah dalam Bahasa Indonesia |

### Struktur Data Ayat (Verse)

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `number_in_surah` | Integer | Nomor ayat dalam surah |
| `text_arab` | String | Teks ayat dalam bahasa Arab |
| `text_transliteration` | String | Teks transliteration ayat |
| `translation_id` | String | Terjemahan ayat (Indonesia) |

<p align="center">
  <strong>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</strong>
</p>
