const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('🧠 Cliente do painel conectado');

  socket.on('conectar', (data) => {
    const nome = data.nome || 'default';
    console.log(`📦 Pedido para iniciar conexão do cliente: ${nome}`);
    io.emit('iniciar', nome); // avisa os clientes conectados
  });

  socket.on('qr', (data) => {
    io.emit('qr', data); // repassa QR para painel
  });

  socket.on('status', (data) => {
    io.emit('status', data); // repassa status para painel
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('✅ Backend rodando na porta 3000');
});
