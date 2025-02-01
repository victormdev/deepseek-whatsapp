const lmStudioService = require('../services/lmStudioService');

module.exports = {
    handleMessage: async (message) => {
        const userId = message.from;
        const userMessage = message.body;

        try {
            const response = await lmStudioService.processMessage(userMessage, userId);
            message.reply(response);
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            message.reply('Desculpe, ocorreu um erro ao processar sua mensagem.');
        }
    }
};