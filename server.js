const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const clientes = {}; // { email: socket }

io.on('connection', (socket) => {
  console.log('🔌 Nova conexão socket');

  socket.on('identificar', ({ email, nome }) => {
    console.log(`📥 Cliente identificado: ${email} (${nome})`);
    clientes[email] = socket;

    socket.email = email;
    socket.nome = nome;
  });

  socket.on('qr', ({ email, nome, qr }) => {
    console.log(`🔑 QR code recebido de ${email}`);
    io.to(email).emit('qr', { nome, qr });
  });

  socket.on('status', ({ email, status }) => {
    console.log(`📶 Status de ${email}: ${status.numero}`);
    io.to(email).emit('status', status);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.email}`);
    delete clientes[socket.email];
  });
});

server.listen(3000, () => {
  console.log('🌐 Backend socket.io rodando na porta 3000');
});
