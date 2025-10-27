const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Client ${socket.id} joined room: ${roomId}`);
        });

        socket.on('submitAnswer', (data) => {
            socket.to(data.roomId).emit('receiveAnswer', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initSocket;