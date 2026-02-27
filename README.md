# 🏥 Clinic Management System – Full Stack

A beginner-friendly, professionally structured full-stack web application for managing clinic patients and appointments.

## 📁 Project Structure

```
clinic-management-system/
├── backend/
│   ├── middleware/
│   │   └── auth.js          ← JWT authentication middleware
│   ├── models/
│   │   ├── Doctor.js        ← Doctor schema with password hashing
│   │   ├── Patient.js       ← Patient schema with doctor reference
│   │   └── Appointment.js   ← Appointment schema
│   ├── routes/
│   │   ├── authRoutes.js    ← Register & Login endpoints
│   │   ├── patientRoutes.js ← Patient CRUD endpoints
│   │   └── appointmentRoutes.js ← Appointment endpoints
│   ├── server.js            ← Express app entry point
│   ├── .env.example         ← Environment variable template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx    ← Login page
    │   │   ├── Register.jsx ← Registration page
    │   │   └── Dashboard.jsx ← Main dashboard
    │   ├── components/
    │   │   └── Navbar.jsx   ← Navigation bar
    │   ├── App.jsx          ← Routing
    │   ├── main.jsx         ← React entry point
    │   └── index.css        ← Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Setup & Running

### Step 1: Set Up MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a free **M0** cluster
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, click **Add IP Address → Allow Access from Anywhere** (for development)
5. Click **Connect → Drivers** and copy the connection string

### Step 2: Configure Backend Environment

```bash
cd backend
copy .env.example .env
```

Open `.env` and fill in your values:
```
MONGO_URI=mongodb+srv://yourUser:yourPass@cluster0.xxxxx.mongodb.net/clinicDB?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_string_at_least_32_characters_long
PORT=5000
```

### Step 3: Install & Run the Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 4: Install & Run the Frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 500ms
  ➜  Local:   http://localhost:5173/
```

### Step 5: Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔒 How It Works

| Feature | Technology | Location |
|---------|-----------|----------|
| Password Hashing | bcryptjs | `models/Doctor.js` pre-save hook |
| Authentication | JSON Web Token (JWT) | `routes/authRoutes.js`, `middleware/auth.js` |
| Route Protection | Express Middleware | `middleware/auth.js` + all protected routes |
| Data Isolation | MongoDB Query Filter | `{ doctor: req.doctorId }` in queries |
| API Proxy | Vite Proxy | `vite.config.js` → forwards `/api` to port 5000 |

## 🌐 API Endpoints

### Auth
| Method | URL | Body | Auth Required |
|--------|-----|------|--------------|
| POST | `/api/auth/register` | `{ name, email, password }` | ❌ |
| POST | `/api/auth/login` | `{ email, password }` | ❌ |

### Patients
| Method | URL | Body | Auth Required |
|--------|-----|------|--------------|
| POST | `/api/patients` | `{ name, age, disease }` | ✅ |
| GET | `/api/patients` | — | ✅ |

### Appointments
| Method | URL | Body | Auth Required |
|--------|-----|------|--------------|
| POST | `/api/appointments` | `{ patientId, date, notes }` | ✅ |
| GET | `/api/appointments` | — | ✅ |

## 🎓 Tech Stack

- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth**: bcryptjs (password hashing), jsonwebtoken (JWT)
- **Frontend**: React 18, Vite, Axios, React Router v6
- **Styling**: Vanilla CSS (custom design system)
