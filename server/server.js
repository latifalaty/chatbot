const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connexion à MongoDB Atlas
mongoose.connect('mongodb+srv://cluster.i57ixgk.mongodb.net/mydbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: 'latifaj1',             // Replace with your actual username
  pass: 'Latifa_2000'           // Replace with your actual password
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(error => {
  console.error('Error connecting to MongoDB Atlas:', error);
});


const Message = mongoose.model('Message', {
  text: String,
  createdAt: { type: Date, default: Date.now }
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('message', async messageData => {
    try {
      const message = new Message(messageData);
      await message.save();
      io.emit('message', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});