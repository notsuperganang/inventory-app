# 📦 Inventory Management System

> **Sistem Manajemen Inventaris Modern dengan Full-Stack Web Application**

Aplikasi web yang memungkinkan user untuk melihat inventaris barang dan admin untuk mengelola data inventaris dengan operasi CRUD lengkap.

---

## 🎓 **Informasi Akademik**

**🏫 Tugas Akhir Semester (UAS)**  
**📚 Mata Kuliah:** Praktikum Proyek Perangkat Lunak  
**👨‍🎓 Mahasiswa:**
    **- Ganang Setyo Hadi (2208107010052)**
    **- Alfi Zamriza (22081070100)**
    **- Farhanul Khair (2208107010076)**<br>
**📅 Tahun Akademik:** 2024/2025  

---

## 🚀 **Demo Quick Start**

### **🔑 Admin Credentials**
```
Username: admin
Password: password123
```

### **📱 Access Points**
- **🏠 User Interface:** http://localhost:5173
- **🔧 Admin Panel:** http://localhost:5173 (Login required)
- **🌐 API Health:** http://localhost:3001/api/health

---

## ✨ **Features Overview**

### **👥 User Interface**
- 🔍 **Browse Items**: Lihat semua barang inventaris dengan layout grid yang menarik
- 🔎 **Smart Search**: Pencarian real-time berdasarkan nama barang atau kategori
- 💰 **Price Display**: Format mata uang Indonesia (IDR) yang user-friendly
- 📊 **Statistics**: Summary total items, kategori, dan status stok
- 📱 **Responsive Design**: Optimal di desktop, tablet, dan mobile

### **🔐 Admin Dashboard**
- 🔐 **Secure Login**: Autentikasi JWT dengan session management
- ➕ **Create Items**: Tambah barang baru dengan form validation
- ✏️ **Edit Items**: Update informasi barang existing
- 🗑️ **Delete Items**: Hapus barang dengan confirmation dialog
- 📋 **Table Management**: Interface tabel dengan sorting dan management
- 💾 **Real-time Updates**: Perubahan data langsung ter-refresh

---

## 🛠 **Tech Stack**

### **Backend**
- **⚡ Framework:** Express.js (Node.js)
- **🐘 Database:** PostgreSQL
- **🔐 Authentication:** JSON Web Token (JWT)
- **📡 API:** RESTful API Architecture

### **Frontend**
- **⚛️ Framework:** React 18 + Vite
- **📦 HTTP Client:** Axios
- **🎨 Styling:** CSS-in-JS + Responsive Design
- **🔄 State Management:** React Hooks (useState, useEffect)

### **Development Tools**
- **📦 Package Manager:** npm
- **🔄 Dev Server:** Nodemon (Backend) + Vite (Frontend)
- **🌍 Environment:** dotenv

---

## 📁 **Project Structure**

```
inventory-management-system/
├── 🔧 backend/                    # Express.js Backend
│   ├── .env                      # Environment variables
│   ├── db.js                     # PostgreSQL connection & setup
│   ├── server.js                 # Express server & API routes
│   ├── package.json              # Backend dependencies
│   └── package-lock.json
│
├── ⚛️ frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ItemList.jsx      # User interface component
│   │   │   └── AdminPanel.jsx    # Admin CRUD component
│   │   ├── App.jsx               # Main application component
│   │   ├── App.css               # Application styles
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Frontend dependencies
│   └── index.html                # HTML template
│
└── 📋 README.md                   # Project documentation
```

---

## ⚙️ **Installation & Setup**

### **📋 Prerequisites**
- Node.js (v16 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm package manager

### **🗄️ Database Setup**
```bash
# 1. Start PostgreSQL service
# Windows: services.msc → PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# 2. Create database
psql -U postgres
CREATE DATABASE inventory_db;

# 3. Grant permissions
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
\q
```

### **🔧 Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install express pg jsonwebtoken cors dotenv nodemon

# Configure environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Start development server
npm run dev
```

### **⚛️ Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install axios

# Start development server
npm run dev
```

---

## 🚀 **Running the Application**

### **🔥 Development Mode**

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:3001
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
# Client will run on http://localhost:5173
```

### **✅ Verification Steps**
1. **🌐 Check API Health:** http://localhost:3001/api/health
2. **🏠 Open User Interface:** http://localhost:5173
3. **🔐 Test Admin Login:** Use credentials above
4. **📦 Browse Sample Data:** 10 sample items will be auto-inserted

---

## 📊 **Database Schema**

```sql
-- Items Table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,              -- Unique identifier
  name VARCHAR(255) NOT NULL,         -- Item name
  category VARCHAR(100) NOT NULL,     -- Item category
  stock INTEGER NOT NULL DEFAULT 0,   -- Stock quantity
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,  -- Price in IDR
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **🎯 Sample Data**
Aplikasi akan otomatis insert 10 sample items:
- Laptop Dell XPS 13 (Rp 15.000.000)
- Mouse Wireless Logitech (Rp 150.000)
- Keyboard Mechanical RGB (Rp 800.000)
- Monitor 24 inch 4K (Rp 2.500.000)
- Dan 6 items lainnya...

---

## 🌐 **API Documentation**

### **🔐 Authentication**
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

### **📦 Items Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/items` | Get all items | ❌ |
| `GET` | `/api/items/:id` | Get single item | ❌ |
| `POST` | `/api/items` | Create new item | ✅ |
| `PUT` | `/api/items/:id` | Update item | ✅ |
| `DELETE` | `/api/items/:id` | Delete item | ✅ |
| `GET` | `/api/health` | API health check | ❌ |

### **📝 Request Examples**

**Create Item:**
```json
POST /api/items
Authorization: Bearer <token>

{
  "name": "MacBook Pro M3",
  "category": "Electronics",
  "stock": 5,
  "price": 25000000
}
```

**Search Items:**
```http
GET /api/items?search=laptop
```

---

## 🎨 **Screenshots & Features**

### **🏠 Homepage - User Interface**
- Grid layout dengan card design yang modern
- Search bar dengan real-time filtering
- Statistics summary di bagian bawah
- Responsive design untuk semua device

### **🔐 Admin Login**
- Simple dan secure login form
- JWT token-based authentication
- Session management dengan localStorage

### **🔧 Admin Panel**
- Table-based item management
- Inline editing dengan modal forms
- Delete confirmation dialogs
- Real-time data updates

---

## 🔧 **Configuration**

### **🔑 Environment Variables**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your-super-secret-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

---

## 🐛 **Troubleshooting**

### **❌ Common Issues**

**1. Database Connection Error**
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Test connection
psql -U postgres -d inventory_db
```

**2. Permission Denied Error**
```bash
# Grant schema permissions
psql -U postgres
GRANT ALL ON SCHEMA public TO postgres;
```

**3. Port Already in Use**
```bash
# Check port usage
lsof -i :3001
lsof -i :5173

# Kill process if needed
kill -9 <PID>
```

**4. Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 **Performance & Security**

### **🚀 Performance Features**
- **Connection Pooling:** PostgreSQL connection pool for optimal performance
- **Lazy Loading:** Component-based architecture dengan React hooks
- **Error Handling:** Comprehensive error handling di backend dan frontend
- **Responsive Caching:** Browser caching untuk static assets

### **🔒 Security Features**
- **JWT Authentication:** Secure token-based authentication
- **SQL Injection Protection:** Parameterized queries dengan pg library
- **CORS Configuration:** Proper CORS setup untuk cross-origin requests
- **Environment Variables:** Sensitive data dalam environment variables

---

## 🚀 **Future Enhancements**

### **🎯 Planned Features**
- [ ] **📸 Image Upload:** Upload gambar untuk setiap item
- [ ] **📊 Advanced Analytics:** Dashboard dengan charts dan graphs
- [ ] **👥 User Management:** Multi-user support dengan roles
- [ ] **📱 Mobile App:** React Native mobile application
- [ ] **🔄 Real-time Updates:** WebSocket untuk real-time notifications
- [ ] **📄 Export/Import:** Excel/CSV import/export functionality
- [ ] **🔍 Advanced Search:** Filter berdasarkan price range, category, dll
- [ ] **📦 Inventory Tracking:** Stock movement history
- [ ] **🔔 Low Stock Alerts:** Notification untuk stok rendah

---

## 🤝 **Contributing**

### **📝 Development Guidelines**
1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **🎯 Code Standards**
- Follow ES6+ JavaScript standards
- Use meaningful variable names
- Add comments untuk complex logic
- Maintain consistent formatting

---

## 📝 **License & Credits**

### **🎓 Academic Project**
**Tugas UAS Praktikum Proyek Perangkat Lunak**  
Universitas: Universitas Syiah Kuala  
Semester: 6  

### **🛠️ Built With**
- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [PostgreSQL](https://postgresql.org/) - Database
- [Vite](https://vitejs.dev/) - Build tool
- [Axios](https://axios-http.com/) - HTTP client

---

## 🏆 **Project Achievements**

### **✅ Requirements Fulfilled**
- ✅ **Framework Backend:** Express.js dengan PostgreSQL
- ✅ **Framework Frontend:** React dengan Vite
- ✅ **User Interface:** Homepage dengan browse dan search
- ✅ **Admin Dashboard:** Login-protected CRUD operations
- ✅ **Database Operations:** Create, Read, Update, Delete
- ✅ **Authentication:** JWT-based security
- ✅ **Responsive Design:** Mobile-friendly interface
- ✅ **Error Handling:** Comprehensive error management
- ✅ **Documentation:** Complete README dan code comments

### **🎖️ Bonus Features Implemented**
- ✅ **Search Functionality:** Real-time search capabilities
- ✅ **Currency Formatting:** Indonesian Rupiah formatting
- ✅ **Statistics Dashboard:** Item counts dan analytics
- ✅ **Sample Data:** Auto-generated demo data
- ✅ **Health Check API:** System monitoring endpoint
- ✅ **Connection Pooling:** Optimized database connections

---

<div align="center">

## 🎉 **Thank You!**

**Made with ❤️ for Academic Excellence**

⭐ **If you found this project useful, please give it a star!** ⭐

*Built as part of Software Engineering Lab Final Project*

</div>
