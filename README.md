# Real-Time Chat App 💬

A real-time chat application built with React, Node.js, Express, and Socket.IO.

## ✨ Features

- 💬 Real-time messaging
- 👥 Online users list
- ⌨️ Typing indicators
- 📜 Chat history
- 🎨 Clean, modern UI
- 📱 Responsive design

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/realtime-chatapp.git
cd realtime-chatapp
```

2. **Install dependencies:**
```bash
npm install
npm install express socket.io cors
```

3. **Start the backend server:**
```bash
node server.js
```

4. **In a new terminal, start the frontend:**
```bash
npm start
```

5. **Open your browser:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Deploy to Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Summary:

1. **Backend (Web Service):**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variable: `CLIENT_URL` = your frontend URL

2. **Frontend (Static Site):**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Environment Variable: `REACT_APP_SOCKET_URL` = your backend URL

## 🛠️ Tech Stack

- **Frontend:**
  - React
  - Socket.IO Client
  - CSS3

- **Backend:**
  - Node.js
  - Express
  - Socket.IO
  - CORS

## 📂 Project Structure

```
realtime-chatapp/
├── public/              # Static files
├── src/
│   ├── ChatApp.js      # Main chat component
│   ├── ChatApp.css     # Styles
│   └── index.js        # Entry point
├── server.js           # Backend server
├── package.json        # Frontend dependencies
├── server-package.json # Backend dependencies reference
├── .env.example        # Environment variables example
└── DEPLOYMENT.md       # Deployment guide
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📝 Available Scripts

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `node server.js` - Start server

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source.

## 👨‍💻 Author

Your Name

---

**Enjoy chatting! 🎉**
