const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { Readable } = require('stream');
const { Server } = require('socket.io');
const Message = require('./models/Message');

dotenv.config();
const app = express();
const server = http.createServer(app);
const upload = multer();

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// === MongoDB + GridFS Setup ===
let gridfsBucket;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('âœ… MongoDB connected');
  gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });
});

// === Online User Tracking ===
let onlineUsers = 0;
let lastSeen = {}; // Track last seen for each user
let messageReactions = {}; // Store reactions for messages
let typingUsers = {}; // Track typing users

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('updateOnlineUsers', onlineUsers);
  console.log('ðŸŸ¢ A user connected. Total:', onlineUsers);

  // Assign role and track last seen time
  socket.on('userConnected', (role) => {
    lastSeen[socket.id] = new Date().toLocaleTimeString();
    socket.broadcast.emit('userStatus', `${role} connected`);
    io.emit('lastSeen', lastSeen);
  });

  // Handle message sending
  socket.on('sendMessage', async (msg) => {


    
    const message = new Message({
      text: msg.text,
      sender: msg.sender,
      image: msg.image || null,
    });
    const saved = await message.save();
    io.emit('message', saved);
  });

  // Handle message read status
  socket.on('messageRead', (messageId, userId) => {
    io.emit('readMessage', { messageId, userId });
    // Emit a 'seen' event after reading
    io.emit('seenMessage', { messageId, userId });
  });

  // Handle typing event
  socket.on('typing', (userId) => {
    typingUsers[userId] = true;
    io.emit('typing', Object.keys(typingUsers).length > 0);
  });

  socket.on('stopTyping', (userId) => {
    delete typingUsers[userId];
    if (Object.keys(typingUsers).length === 0) {
      io.emit('stopTyping');
    }
  });

  // Handle message reactions (emoji reactions)
  socket.on('messageReaction', (messageId, emoji) => {
    if (!messageReactions[messageId]) {
      messageReactions[messageId] = [];
    }
    messageReactions[messageId].push(emoji);
    io.emit('messageReaction', { messageId, emoji });
  });

  // Handle disconnection and update last seen time
  socket.on('userDisconnected', (role) => {
    socket.broadcast.emit('userStatus', `${role} disconnected`);
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('updateOnlineUsers', onlineUsers);
    socket.broadcast.emit('userStatus', `A user disconnected`);
    console.log('ðŸ”´ A user disconnected. Total:', onlineUsers);

    // Update last seen time for disconnected user
    lastSeen[socket.id] = new Date().toLocaleTimeString();
    io.emit('lastSeen', lastSeen);
  });
});

// === Chat Routes ===
app.get('/messages', async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

app.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  await Message.findByIdAndDelete(id);
  io.emit('deleteMessage', id);
  res.sendStatus(204);
});

// === File Upload Routes ===
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file || !gridfsBucket) {
    return res.status(400).json({ message: "No file uploaded or GridFS not initialized" });
  }

  const bufferStream = new Readable();
  bufferStream.push(req.file.buffer);
  bufferStream.push(null);

  const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
  });

  bufferStream.pipe(uploadStream);

  uploadStream.on("finish", () => {
    res.json({ message: "File uploaded", fileId: uploadStream.id });
  });

  uploadStream.on("error", (err) => {
    console.error(err);
    res.status(500).json({ message: "Error uploading file" });
  });
});

app.get('/files', async (req, res) => {
  try {
    const files = await gridfsBucket.find().toArray();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching files" });
  }
});

app.get('/files/:filename', async (req, res) => {
  try {
    const files = await gridfsBucket.find({ filename: req.params.filename }).toArray();
    if (!files.length) return res.status(404).json({ message: "File not found" });

    const file = files[0];
    res.set({
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    });

    const downloadStream = gridfsBucket.openDownloadStream(file._id);
    downloadStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching file" });
  }
});

app.delete('/files/:filename', async (req, res) => {
  try {
    const files = await gridfsBucket.find({ filename: req.params.filename }).toArray();
    if (!files.length) return res.status(404).json({ message: "File not found" });

    await gridfsBucket.delete(files[0]._id);
    res.json({ message: "File deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting file" });
  }
});

// Default route
app.use((req, res) => {
  res.send("Welcome to the chat & file upload server");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`ðŸš€ Server running on port ${PORT}`);
});