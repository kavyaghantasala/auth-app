# 🔐 AuthVault — Authentication & Authorization

> Week 2 · Authentication & Authorization

---

## ✅ Subtasks Completed

### Subtask 1 — User Registration
- `POST /api/register` accepts email, password, and role
- Passwords hashed using **bcryptjs** (salt rounds: 10)
- Duplicate email registrations rejected with **409 Conflict**

### Subtask 2 — User Login
- `POST /api/login` verifies email and password
- Returns **401 Unauthorized** for invalid credentials

### Subtask 3 — JWT Authentication
- Generates JWT token on successful login
- Token includes `user_id`, `email`, `role`
- Token expires in **24 hours**

### Subtask 4 — Protected Routes
- `GET /api/profile` — requires valid JWT token
- Returns **403 Forbidden** if no token or invalid token

### Subtask 5 — Role-Based Access Control (RBAC)
- `GET /api/users` — accessible by `user` and `admin` roles
- `GET /api/admin` — accessible by `admin` role only
- Returns **403 Forbidden** for unauthorized role access

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/register` | None | - | Register new user |
| POST | `/api/login` | None | - | Login and get JWT |
| GET | `/api/profile` | JWT | any | View own profile |
| GET | `/api/users` | JWT | user/admin | User route |
| GET | `/api/admin` | JWT | admin only | Admin dashboard |

---

## 🧪 Test the API

**Register:**
```powershell
Invoke-WebRequest -Uri "https://YOUR-SITE.vercel.app/api/register" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body '{"email":"test@test.com","password":"123456","role":"user"}' `
  -UseBasicParsing
```

**Login:**
```powershell
Invoke-WebRequest -Uri "https://YOUR-SITE.vercel.app/api/login" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body '{"email":"test@test.com","password":"123456"}' `
  -UseBasicParsing
```

**Access protected route:**
```powershell
Invoke-WebRequest -Uri "https://YOUR-SITE.vercel.app/api/profile" `
  -Headers @{"Authorization" = "Bearer YOUR_TOKEN"} `
  -UseBasicParsing
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js Serverless Functions |
| Auth | JWT (jsonwebtoken) |
| Hashing | bcryptjs |
| Hosting | Vercel |
| Database | JSONBin.io |

---

## 📁 Project Structure

```
├── index.html           # Frontend UI
├── vercel.json          # Route configuration
├── package.json
└── api/
    ├── _db.js           # JSONBin helper
    ├── _auth.js         # JWT helper
    ├── register.js      # POST /api/register
    ├── login.js         # POST /api/login
    ├── profile.js       # GET /api/profile (protected)
    ├── users.js         # GET /api/users (user + admin)
    └── admin.js         # GET /api/admin (admin only)
```
