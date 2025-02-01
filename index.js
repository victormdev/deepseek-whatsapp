const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const messageHandler = require('./handlers/messageHandler');
const logger = require('./utils/logger');

// Inicializa o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth() // Salva a sessão localmente
});

// Gera o QR Code no terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Quando estiver pronto, exibe uma mensagem
client.on('ready', () => {
    logger.log('Client is ready!');
});

// Escuta mensagens recebidas
client.on('message', async (message) => {
    logger.log(`Mensagem recebida de ${message.from}: ${message.body}`);
    await messageHandler.handleMessage(message);
});

// Inicializa o cliente
client.initialize();