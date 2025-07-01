# SilentVote 🗳️

A secure voting web app built with React, Node.js, Express, and MongoDB.

## 🔐 Features
- Email Registration & Login
- JWT Authentication
- Poll Creation
- Live Voting & Results
- Public/Private Poll Access

## 🚀 Live Demo
- Frontend: https://silentvotes.vercel.app
- Backend: https://silentvotes.onrender.com

## 🛠️ Technologies Used
- React + Vite
- Node.js + Express
- MongoDB (via Mongoose)
- Render & Vercel for deployment

## 📦 Setup Instructions

1. Clone the repository
2. Add `.env` files for backend and frontend

### `.env` (backend)
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret_key

shell
### `.env` (frontend)
VITE_API_URL=https://silentvotes.onrender.com/api


3. Run backend:
```bash
cd server
npm install
npm start
```

4. Run frontend:
```bash
cd client
npm install
npm run dev
```