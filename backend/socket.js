const setupSocket = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('add-user', (email) => {
      onlineUsers.set(email, socket.id);
    });

    socket.on('send-message', (data) => {
      const receiverSocket = onlineUsers.get(data.receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit('receive-message', data);
      }
    });

    socket.on('disconnect', () => {
      for (const [email, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(email);
          break;
        }
      }
    });
  });
};

module.exports = setupSocket;
