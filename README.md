# Z-era — Women's Footwear E-commerce

> Bold Gen-Z women's footwear. Sandals, Flats & Sneakers designed for the future.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+ running locally

### 1. Setup Database
Create the database in MySQL:
```sql
CREATE DATABASE z_era_db;
```

### 2. Configure Environment
Edit `server/.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=z_era_db
```

### 3. Install Dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Seed Sample Data
```bash
cd server && node db/seed.js
```

### 5. Run the App
In two terminals:
```bash
# Terminal 1 — Backend
cd server && node index.js

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

## 🛠 Configuration

All categories, sizes, prices, carousel slides, and brand info are configurable in:
```
server/config/appConfig.json
```

## 📁 Structure

```
├── server/          Express.js API
│   ├── config/      Configurable settings
│   ├── db/          Database connection & seed
│   ├── middleware/   JWT auth middleware
│   ├── models/      Sequelize models
│   └── routes/      API routes
├── client/          Vite + React frontend
│   └── src/
│       ├── api/     API client
│       ├── components/  Reusable UI
│       ├── context/     Auth, Cart, Config
│       └── pages/       App pages
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/products | List + filter |
| GET | /api/products/:id | Product detail |
| GET | /api/products/featured | Featured |
| POST | /api/orders | Place order |
| GET | /api/orders | Order history |
| GET | /api/config | App config |
