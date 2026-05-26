# YouTube Content Studio Pro

Website untuk membuat paket konten YouTube dari satu input:

- ide konten
- script
- storyboard
- prompt gambar
- prompt video
- judul YouTube
- deskripsi
- hashtag
- jadwal upload
- saved library

Website ini dibuat dengan React + Vite untuk frontend, Vercel API Route untuk backend Gemini, dan localStorage untuk menyimpan konten di browser.

## Kenapa deploy pakai Vercel, bukan GitHub Pages?

Karena website ini memakai Gemini API. API key tidak boleh ditaruh langsung di frontend. Kalau pakai GitHub Pages saja, kode frontend bisa dilihat orang dan API key bisa bocor.

Vercel bisa menjalankan backend kecil di folder `/api`, jadi API key bisa disimpan aman di Environment Variables.

## Yang perlu disiapkan

1. Akun GitHub
2. Akun Vercel
3. Gemini API Key dari Google AI Studio
4. Laptop/PC yang sudah install Node.js

## Cara menjalankan di laptop

### 1. Download atau clone project

Kalau sudah upload ke GitHub:

```bash
git clone https://github.com/username/youtube-content-studio-pro.git
cd youtube-content-studio-pro
```

Kalau masih dari file ZIP:

- Extract file ZIP
- Buka folder `youtube-content-studio-pro`
- Klik kanan, pilih terminal di folder tersebut

### 2. Install dependency

```bash
npm install
```

### 3. Buat file .env

Copy file `.env.example`, lalu rename menjadi `.env`.

Isi seperti ini:

```bash
GEMINI_API_KEY=isi_api_key_gemini_kamu_di_sini
```

### 4. Jalankan frontend biasa

```bash
npm run dev
```

Catatan: mode ini hanya menjalankan frontend. Untuk mengetes API Gemini secara lokal, pakai Vercel Dev.

### 5. Jalankan versi lokal dengan API Vercel

```bash
npm run dev:vercel
```

Buka link yang muncul di terminal, biasanya:

```bash
http://localhost:3000
```

## Cara upload ke GitHub untuk pemula

### 1. Buat repository baru

- Buka GitHub
- Klik New Repository
- Nama repository: `youtube-content-studio-pro`
- Pilih Public atau Private
- Klik Create Repository

### 2. Upload file dari browser

Cara paling gampang:

- Buka repository yang baru dibuat
- Klik Add file
- Klik Upload files
- Drag semua file project ke halaman GitHub
- Klik Commit changes

Pastikan yang di-upload adalah isi folder project, bukan folder ZIP.

## Cara deploy ke Vercel

### 1. Import project dari GitHub

- Buka Vercel
- Klik Add New Project
- Pilih repository `youtube-content-studio-pro`
- Klik Import

### 2. Build settings

Biasanya Vercel akan otomatis membaca Vite.

Gunakan setting ini kalau diminta:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3. Tambahkan Environment Variable

Di Vercel project:

- Masuk ke Settings
- Environment Variables
- Tambahkan:

```bash
GEMINI_API_KEY=isi_api_key_gemini_kamu
```

Klik Save.

### 4. Deploy ulang

Setelah menambahkan API key:

- Masuk ke tab Deployments
- Klik titik tiga pada deployment terbaru
- Klik Redeploy

Setelah selesai, website akan punya URL seperti:

```bash
https://youtube-content-studio-pro.vercel.app
```

## Cara pakai website

1. Buka website
2. Pilih YouTube Shorts atau Long Video
3. Isi topic, niche, target audience, bahasa, tone, goal, durasi, dan style konten
4. Klik Generate Complete Content
5. Buka tab Script, Storyboard, Image Prompts, Video Prompts, Metadata, Upload Plan
6. Klik Save untuk menyimpan ke Saved Library
7. Klik Export JSON kalau mau menyimpan file hasil konten

## Penyimpanan data

Saved Library disimpan di localStorage browser.

Artinya:

- data tersimpan di browser yang sama
- kalau pindah laptop/browser, data tidak ikut pindah
- kalau clear browser data, library bisa hilang

Untuk versi berikutnya, bisa ditambahkan database seperti Supabase atau Firebase.

## Catatan keamanan

Jangan upload file `.env` ke GitHub.

File `.gitignore` sudah dibuat agar `.env` tidak ikut terupload.

Simpan API key hanya di Vercel Environment Variables.
