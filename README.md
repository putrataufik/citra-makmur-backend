# Citra Makmur Warehouse Backend (CMW)

Project ini adalah backend dari aplikasi Citra Makmur Warehouse (CMW) yang dibangun menggunakan Node.js + Express dan MongoDB. Aplikasi ini sudah mendukung **Docker** untuk kemudahan setup dan deployment.

---

## 🚀 Fitur Utama

* Autentikasi dengan JWT
* Manajemen barang dan stok
* Transaksi penjualan dan stok keluar/masuk
* Audit trail aktivitas pengguna
* Support untuk input nota (AI Gemini-ready)
* Sudah mendukung Docker dan siap untuk CI/CD

---

## 📦 Jalankan Dengan Docker Compose

Jika kamu menggunakan **MongoDB eksternal**, kamu tidak perlu menjalankan MongoDB dalam Docker Compose.

### 1. **Kloning repository ini**

```bash
git clone https://github.com/your-username/cmw-backend.git
cd cmw-backend
```

### 2. **Siapkan file `.env`**

Buat file `.env` di root folder:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cmw?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

---

### 3. **Buat Dockerfile** (sudah disiapkan di root project)

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

### 4. **Buat docker-compose.yml**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - .:/app
    restart: unless-stopped
```

> Karena menggunakan MongoDB eksternal, tidak ada service `mongo` di sini.

---

### 5. **Jalankan Docker Compose**

```bash
docker-compose up --build
```

> Akses API di: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Tes Koneksi API

Coba akses:

```bash
curl http://localhost:3000/api/ping
```

Respon yang diharapkan:

```json
{ "status": "API is alive 🚀" }
```

---

## 🧹 Hentikan & Bersihkan

```bash
docker-compose down
```

---

## 📂 Struktur Folder Utama

```
/src
├── /api
│   ├── /controllers
│   ├── /middlewares
│   ├── /routes
│   └── /services
├── /config
├── /models
├── /utils
├── app.js
server.js
```

---

## 📌 Catatan Tambahan

* Proyek ini siap untuk CI/CD menggunakan GitHub Actions
* Tidak perlu menjalankan MongoDB di container
* Pastikan whitelist IP pada MongoDB Atlas sesuai dengan alamat server lokal/container

---

## 💬 Lisensi

MIT License – Putra Taufik Syaharuddin
