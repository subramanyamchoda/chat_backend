# 🛠️ PandaChats – Backend Server 🐼💬

This is the **backend server** for **PandaChats**, a full-stack real-time chat application. It provides RESTful APIs, real-time WebSocket communication, and data persistence using MongoDB.

---

## 🔗 Live Links

* 🌐 **Frontend App**: [https://pandachats.vercel.app](https://pandachats.vercel.app)
* ⚙️ **Backend API**: [https://chat-5km8.onrender.com](https://chat-5km8.onrender.com)
* 📁 **Frontend Repo**: [https://github.com/subramanyamchoda/chat\_client](https://github.com/subramanyamchoda/chat_client)
* 📁 **Backend Repo**: [https://github.com/subramanyamchoda/chat\_backend](https://github.com/subramanyamchoda/chat_backend)

---

## 🚀 Features

* 🔐 User authentication using JWT
* 📁 REST APIs for users, chats, and messages
* ⚡ Real-time communication with Socket.IO
* 💬 One-to-one and group chat support
* ✍️ Typing indicators and online presence tracking
* 📂 Media and file message handling

---

## 🧰 Tech Stack

| Component      | Tech                   |
| -------------- | ---------------------- |
| Server         | Node.js + Express      |
| Real-time Comm | Socket.IO (WebSockets) |
| Database       | MongoDB + Mongoose     |
| Auth           | JWT + Bcrypt           |
| Deployment     | Render                 |

---

## 📂 Folder Structure

```
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── userController.js  # Auth & user logic
│   └── chatController.js  # Chat creation
│   └── messageController.js # Message handling
├── middleware/
│   └── authMiddleware.js  # JWT auth guard
├── models/
│   └── User.js
│   └── Chat.js
│   └── Message.js
├── routes/
│   └── userRoutes.js
│   └── chatRoutes.js
│   └── messageRoutes.js
├── .env                   # Env variables
├── server.js              # App entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

> 🔐 Replace `your-mongodb-uri` and `your-secret-key` with actual values.

---

## ▶️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/subramanyamchoda/chat_backend.git
cd chat_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

## 📡 WebSocket Events (Socket.IO)

The server emits and listens to:

| Event                    | Description                 |
| ------------------------ | --------------------------- |
| `setup`                  | Initializes user socket     |
| `join chat`              | Joins a specific chat room  |
| `typing` / `stop typing` | Typing status broadcast     |
| `new message`            | Sends/receives new messages |
| `disconnect`             | Handles socket cleanup      |

---

## ✅ API Endpoints

### 👤 Auth & Users

```
POST   /api/user/register   # Register
POST   /api/user/login      # Login
GET    /api/user?search=... # Search users
```

### 💬 Chat

```
POST   /api/chat            # Create one-to-one or group
GET    /api/chat            # Fetch user chats
PUT    /api/chat/group      # Rename group
PUT    /api/chat/add        # Add user to group
PUT    /api/chat/remove     # Remove user from group
```

### ✉️ Messages

```
POST   /api/message         # Send a message
GET    /api/message/:chatId # Get all messages for a chat
```

---

## 🧪 Sample Request (JSON)

```json
POST /api/user/login
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

## 🤝 Contributing

```bash
# 1. Fork this repo

# 2. Create a branch
git checkout -b feature/your-feature

# 3. Commit changes
git commit -m "Add your-feature"

# 4. Push to your fork
git push origin feature/your-feature

# 5. Open a Pull Request
```

---

## 🙌 Acknowledgments

This backend was created to practice and demonstrate:

* 🔐 Secure authentication with JWT
* ⚡ Real-time messaging with Socket.IO
* 📁 Clean API architecture with Express
* ☁️ Full-stack MERN deployment (Render + Vercel)

---

## 📌 License

This project is open-source and free to use.

---

## 📞 Contact

Reach out on [LinkedIn](https://www.linkedin.com/in/subramanyamchoda/) or star ⭐ the repo if you found it helpful!
