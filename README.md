
# 🚀 MeetFlow - Real-Time Video Meeting Platform 

![Node.js](https://img.shields.io/badge/Node.js-Backend-brightgreen) 
![React](https://img.shields.io/badge/React-Frontend-blue) 
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success) 
![WebRTC](https://img.shields.io/badge/WebRTC-Realtime-red) 
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-orange)

**MeetFlow** is a **real-time video meeting platform** enabling collaborative video/audio meetings, chat, and participant management. Built with the **MERN stack** and **WebRTC**, it supports secure, scalable, and user-friendly online meetings.

---
> ## 🌐 Live Demo
>You can try out the live version of **MeetFlow - Real-Time Video Meeting Platform** here:  
>**[Clikc Here](https://meetflow-3mv5.onrender.com/)**  
---

## 📋 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture Overview](#architecture-overview)  
- [Backend Structure](#backend-structure)  
- [Frontend Structure](#frontend-structure)  
- [Setup & Installation](#setup--installation)  
- [Environment Variables](#environment-variables)  
- [API Endpoints](#api-endpoints)  
- [Socket Events](#socket-events)  
- [Deployment](#deployment)   

---

## ✨ Features

- Multi-user real-time video & audio meetings (WebRTC)  
- Peer-to-peer room-based connections  
- Real-time chat and participant management  
- Meeting scheduling, invitations, and analytics  
- User authentication and profile management  
- Secure access with JWT and optional password protection  
- Responsive, modern UI built with React  
- Email invitations with branded HTML templates  
- Scalable deployment using Render  

---

## 🛠 Tech Stack

- **Frontend:** React.js, Vite  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Real-time Communication:** WebRTC, Socket.IO  
- **Authentication:** JWT, bcrypt  
- **File Uploads:** Multer, Cloudinary  
- **Email:** Nodemailer  
- **Deployment:** Render  

---

## 🏗 Architecture Overview

- **Backend:** RESTful API for users and meetings, Socket.IO for real-time video/audio and chat.  
- **Frontend:** Single Page Application (SPA) with React, modular components for meetings, chat, dashboard, remote access, etc.  
- **Database:** MongoDB collections for users and meetings.  
- **Socket:** Handles room join/leave, media state, messaging, and participant updates.  

---

## 📂 Backend Structure

| File/Folder                     | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `index.js`                      | Main server entry, sets up Express, routes, static serving, and Socket.IO.  |
| `config/cloudinary.js`          | Cloudinary setup for image uploads.                                         |
| `controller/user.js`            | User registration, login, profile, password reset, avatar upload.           |
| `controller/meeting.js`         | Meeting CRUD, code generation, analytics.                                   |
| `middleware/auth.js`            | JWT authentication middleware.                                              |
| `middleware/multer.js`          | Multer configuration for file uploads.                                      |
| `model/User.js`                  | Mongoose schema for users.                                                  |
| `model/Meeting.js`               | Mongoose schema for meetings.                                               |
| `router/user.js`                 | API routes for user management.                                             |
| `router/meeting.js`              | API routes for meeting management.                                          |
| `utils/db.js`                     | MongoDB connection setup.                                                   |
| `utils/sendMeetingInvite.js`    | Function to send HTML email invites.                                        |
| `utils/socket/meeting.js`       | Socket.IO event handlers for meetings.                                      |
| `public/`                        | Static files served by Express.                                             |

---

## 📂 Frontend Structure

| Folder/File                     | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `index.html`                     | App entry HTML.                                                             |
| `main.jsx`                       | React entry point.                                                          |
| `App.jsx`                        | Main app component with routing.                                            |
| `src/Components/`                | Modular UI components: Dashboard, JoinMeeting, Meetings, RemoteAccess, etc.|
| `src/Pages/`                     | Page-level components: Auth, Dashboard, Meetings, Settings, etc.           |
| `src/context/`                   | React contexts for user, meeting, and socket state.                         |
| `src/assets/`                    | Images, SVGs, and branding assets.                                          |
| `src/utils/SocketConnection.jsx` | Socket.IO client setup.                                                     |
| `public/`                        | Static assets and manifest.                                                 |

---

## ⚙ Setup & Installation

### Prerequisites

- Node.js (v18+)  
- MongoDB (local or Atlas)  
- Cloudinary account (optional, for image uploads)  
- Gmail or SMTP credentials (for email invites)  

### Backend Setup

```bash
cd backend
npm install
# Create a .env file with required environment variables
npm run dev
````

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 Environment Variables

**Backend `.env` example:**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

## 🔗 API Endpoints

### User

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| POST   | /api/user/register        | Register new user           |
| POST   | /api/user/login           | User login                  |
| GET    | /api/user/profile         | Get profile (auth required) |
| POST   | /api/user/profile         | Update profile              |
| POST   | /api/user/upload          | Upload avatar               |
| POST   | /api/user/forgot-password | Send reset token            |
| POST   | /api/user/reset-password  | Reset password              |

### Meeting

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | /api/meeting/      | Create a meeting      |
| GET    | /api/meeting/      | Get all user meetings |
| GET    | /api/meeting/:code | Get meeting by code   |
| PUT    | /api/meeting/:id   | Update meeting        |
| DELETE | /api/meeting/:id   | Delete meeting        |

---

## ⚡ Socket Events

| Event                    | Description                      |
| ------------------------ | -------------------------------- |
| join-room                | Join a meeting room              |
| leave-room               | Leave a meeting room             |
| send-offer / send-answer | WebRTC offer/answer exchange     |
| send-ice-candidate       | WebRTC ICE candidate exchange    |
| send-message             | Real-time chat messaging         |
| camera-toggled           | Update camera state              |
| screen-toggled           | Update screen sharing state      |
| mic-toggled              | Update microphone state          |
| participants-list        | Get list of current participants |

---

## 🚀 Deployment

* **Render:** Backend and frontend can be deployed on Render.
* **Environment Variables:** Set all secrets (MongoDB, JWT, Cloudinary, Email) in Render dashboard.
* Supports **HTTPS**, **JWT auth**, and **WebRTC P2P connections**.

---



