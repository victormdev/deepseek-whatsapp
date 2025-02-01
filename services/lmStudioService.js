const axios = require('axios');
const config = require('../config/config');

// Objeto para armazenar o histórico de conversas
const conversationHistory = {};

module.exports = {
    processMessage: async (text, userId) => {
        try {
            // Inicializa o histórico do usuário, se não existir
            if (!conversationHistory[userId]) {
                conversationHistory[userId] = [];
            }

            // Adiciona a mensagem do usuário ao histórico
            conversationHistory[userId].push({ role: "user", content: text });

            // Limita o histórico para as últimas 10 interações
            if (conversationHistory[userId].length > config.MAX_HISTORY_LENGTH) {
                conversationHistory[userId].shift();
            }

            const response = await axios.post(config.LM_STUDIO_API_URL, {
                model: config.MODEL_NAME,
                messages: [
                    { role: "system", content: config.SYSTEM_PROMPT },
                    ...conversationHistory[userId] // Envia o histórico completo do usuário
                ],
                temperature: config.TEMPERATURE,
                max_tokens: config.MAX_TOKENS
            });

            let reply = response.data.choices[0].message.content;

            // Remove qualquer <think>...</think> antes de responder
            reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

            // Adiciona a resposta da IA ao histórico
            conversationHistory[userId].push({ role: "assistant", content: reply });

            console.log(`Resposta gerada para ${userId}: ${reply}`);
            return reply;
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            throw error;
        }
    }
};