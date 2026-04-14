# 🏍️ Jolly Cabs - Premium Bike Rental Web App

## Folder Structure
```
jolly-cabs/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Bike.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bikes.js
│   │   ├── bookings.js
│   │   ├── admin.js
│   │   └── payment.js
│   ├── utils/
│   │   └── email.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── BikeCard.js
    │   │   ├── Loader.js
    │   │   └── WhatsAppButton.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Bikes.js
    │   │   ├── BikeDetails.js
    │   │   ├── Booking.js
    │   │   ├── BookingConfirmation.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── MyBookings.js
    │   │   ├── Contact.js
    │   │   └── AdminDashboard.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install Backend
```bash
cd jolly-cabs/backend
npm install
```

### 2. Configure Backend .env
```bash
cp .env.example .env
```
Fill in your values:
- `MONGO_URI` → MongoDB Atlas connection string
- `JWT_SECRET` → Any random secret string
- `EMAIL_USER` → Gmail address
- `EMAIL_PASS` → Gmail App Password (not your real password)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` → From Razorpay Dashboard

### 3. Install Frontend
```bash
cd ../frontend
npm install
```

### 4. Configure Frontend .env
```bash
cp .env.example .env
```
Fill in:
- `REACT_APP_API_URL=http://localhost:5000/api`
- `REACT_APP_RAZORPAY_KEY` → Same Razorpay Key ID
- `REACT_APP_WHATSAPP_NUMBER` → Your WhatsApp number with country code

### 5. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

### 6. Create Admin User
Register normally, then in MongoDB Atlas update your user's `role` field to `"admin"`.

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub and connect to Vercel
# Set environment variables in Vercel dashboard
```

### Backend → Render
- Create a new Web Service on Render
- Connect your GitHub repo
- Set root directory to `backend`
- Add all environment variables
- Start command: `npm start`

### Database → MongoDB Atlas
- Create free cluster at mongodb.com/atlas
- Whitelist all IPs (0.0.0.0/0) for production
- Copy connection string to `MONGO_URI`

---

## 📧 Gmail App Password Setup
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords → Generate for "Mail"
4. Use that 16-char password as `EMAIL_PASS`

## 💳 Razorpay Setup
1. Sign up at razorpay.com
2. Go to Settings → API Keys
3. Generate Test Keys for development
