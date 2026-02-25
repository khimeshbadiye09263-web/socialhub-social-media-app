# 🌐 SocialHub

A full-stack social media platform with real-time chat, posts, likes, comments, and follow system.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express + Socket.io |
| Database | MongoDB + Mongoose |
| Auth | JWT |

## Features

- 🔐 Register & Login with JWT authentication
- 📝 Create, like, and delete posts
- 💬 Comment on posts
- 👥 Follow / unfollow users
- 🔍 Discover people
- 💬 Real-time one-on-one chat (Socket.io)
- 🌙 Dark / Light mode toggle

## Run Locally

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialhub
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

**frontend/.env** (optional for local)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Deploy

- **Database** → [MongoDB Atlas](https://mongodb.com/cloud/atlas)
- **Backend** → [Render](https://render.com) (root: `backend`, start: `node server.js`)
- **Frontend** → [Vercel](https://vercel.com) (root: `frontend`)
