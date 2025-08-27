# MeetFlow — Smart Online Meetings

![MeetFlow Banner](public/preview.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Last Commit](https://img.shields.io/github/last-commit/yourusername/meetflow)

---

## ✨ Overview

Seamless, secure, and smart online meetings.  
MeetFlow lets you **create, schedule, and join meetings** with HD video, real-time collaboration, and modern UI/UX.

---

## 🚀 Features

- 🔒 **Authentication** — Login & Register with JWT
- 📅 **Create & Schedule Meetings** with title, description, date, time
- ✉️ **Email Invitations** — Beautiful dark-themed HTML templates with logo
- 📡 **Join Meetings** by ID or direct invite link
- 📊 **Dashboard** — Manage upcoming, past, and scheduled meetings
- 🎥 **Video Conferencing (planned)** — High-quality calls, screen sharing, recordings
- 🌐 **Responsive & PWA** — Optimized for desktop and mobile
- ⚡ **SEO Ready** — Open Graph + Twitter Cards for link previews

---

## 🛠️ Tech Stack

### Frontend

- [React 19](https://react.dev/) (Vite + JSX)
- [React Router](https://reactrouter.com/)
- [React Helmet Async](https://github.com/staylor/react-helmet-async) (SEO & Meta tags)
- TailwindCSS (or custom CSS theme)

### Backend

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- MongoDB + Mongoose
- Nodemailer (meeting invite emails)
- JWT (authentication)

### Utilities

- Sharp (icon resizing for PWA manifest)
- Puppeteer (auto screenshot previews, optional)

---

## 📦 Installation

Clone the repository:

git clone https://github.com/yourusername/meetflow.git
cd meetflow
🔹 Backend Setup

cd backend
npm install
Create .env file:

ini
Copy code
PORT=8080
MONGO_URI=mongodb://localhost:27017/meetflow
JWT_SECRET=your_jwt_secret_here

# Email (for invites)

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
Run backend:

npm run dev
🔹 Frontend Setup

cd frontend
npm install
npm run dev
Now open → http://localhost:5173

⚙️ Environment Variables
Variable Description
PORT Backend server port (default: 8080)
MONGO_URI MongoDB connection string
JWT_SECRET Secret key for JWT auth
EMAIL_USER Email address used to send invites
EMAIL_PASS App password for email service

📁 Project Structure

meetflow/
├── backend/
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── utils/ # Email + helpers
│ └── server.js # Express entry point
│
├── frontend/
│ ├── public/ # Static files (favicon, preview.png, manifest)
│ ├── src/
│ │ ├── components/ # Shared UI components
│ │ ├── pages/ # React pages (Login, Dashboard, Meetings, etc.)
│ │ ├── config/ # metaConfig.js for SEO
│ │ └── App.jsx # Router entry
│ └── index.html
│
└── README.md
📸 Social Preview
Preview image: frontend/public/preview.png

Used in og:image and twitter:image meta tags

✅ Recommended size: 1200 × 630 px
✅ Format: .jpg or .png

🧪 Scripts
Backend

npm run dev # Run with nodemon
npm start # Production
Frontend
bash
Copy code
npm run dev # Vite dev server
npm run build # Production build
npm run preview # Preview build
🤝 Contributing
Fork this repo

Create a branch:

git checkout -b feature-name
Commit changes:

git commit -m "Added new feature"
Push branch:

git push origin feature-name
Create a Pull Request 🚀

📜 License
MIT License © 2025 MeetFlow Team

---

✅ This README is **all-in-one**:

- Top badges
- Banner image
- Features
- Tech stack
- Installation
- Env vars
- Project structure
- Preview image details
- Scripts
- Contributing + License

---

👉 Do you want me to also add a **“Roadmap” section** (with planned features like Recording, Calendar Integration, Teams, etc.) so contributors know what’s next?

```

```
