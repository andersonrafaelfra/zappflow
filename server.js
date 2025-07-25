const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

app.use(cors());

const conexoes = {};

io.on('connection', (socket) => {
  console.log('🧠 Nova conexão WebSocket');

  socket.on('qr', (data) => {
    conexoes[data.nome] = { status: 'Aguardando leitura', qr: data.qr };
    io.emit('qr', data); // envia pro painel
  });

  socket.on('conectado', (data) => {
    conexoes[data.nome] = {
      status: 'Conectado',
      numero: data.numero,
      foto: data.foto
    };
    io.emit('conectado', data); // envia pro painel
  });

  socket.on('desconectado', ({ nome }) => {
    conexoes[nome] = { status: 'Desconectado' };
    io.emit('desconectado', { nome });
  });

  socket.on('solicitarConexao', (nome) => {
    io.emit('iniciar', nome); // envia pro cliente iniciar conexão
  });
});

app.get('/status', (req, res) => {
  res.json(conexoes);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ZappFlow rodando na porta ${PORT}`);
});
