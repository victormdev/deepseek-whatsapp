const axios = require('axios');
const logger = require('../utils/logger');
const weatherService = require('../services/weatherService');
const timeUtils = require('../utils/timeUtils');

// Objeto para armazenar o histórico de conversas
const conversationHistory = {};

module.exports = {
    handleCommand: async (message) => {
        const userId = message.from;
        const command = message.body.split(' ')[0];
        const args = message.body.split(' ').slice(1);

        switch (command) {
            case '/clear':
                conversationHistory[userId] = [];
                message.reply('Histórico de conversas limpo! 🧹');
                break;

            case '/help':
                const helpMessage = `
                *Comandos disponíveis:*
                - /clear: Limpa o histórico de conversas.
                - /help: Exibe esta mensagem de ajuda.
                - /info: Exibe informações sobre o bot.
                - /ping: Verifica se o bot está online.
                - /joke: Receba uma piada aleatória.
                - /weather <cidade>: Obtenha o clima de uma cidade.
                - /news: Receba as últimas notícias.
                - /translate <texto>: Traduz um texto para português.
                - /reminder <tempo> <mensagem>: Define um lembrete.
                - /quote: Receba uma citação motivacional.
                `;
                message.reply(helpMessage);
                break;

            case '/info':
                const infoMessage = `
                *Informações do Bot:*
                - Versão: 1.0.0
                - Autor: Seu Nome
                - Descrição: Um chatbot inteligente para WhatsApp.
                - Repositório: [GitHub](https://github.com/seu-usuario/seu-repositorio)
                `;
                message.reply(infoMessage);
                break;

            case '/ping':
                message.reply('Pong! 🏓');
                break;

            case '/joke':
                const jokes = [
                    "Por que o computador foi ao médico? Porque tinha um vírus!",
                    "O que o zero disse para o oito? Belo cinto!",
                    "Por que o livro de matemática se suicidou? Porque tinha muitos problemas."
                ];
                const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                message.reply(randomJoke);
                break;

            case '/news':
                try {
                    const apiKey = 'SUA_CHAVE_DA_API'; // Obtenha uma chave em https://newsapi.org/
                    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=br&apiKey=${apiKey}`);
                    const articles = response.data.articles.slice(0, 5); // Limita a 5 notícias

                    let newsMessage = '*Últimas notícias:*\n\n';
                    articles.forEach((article, index) => {
                        newsMessage += `${index + 1}. *${article.title}*\n${article.url}\n\n`;
                    });

                    message.reply(newsMessage);
                } catch (error) {
                    message.reply('Não foi possível obter as notícias no momento.');
                }
                break;

            case '/translate':
                const text = args.join(' ');
                if (!text) {
                    message.reply('Por favor, informe um texto para traduzir. Exemplo: /translate Hello');
                    return;
                }
                try {
                    const apiKey = 'SUA_CHAVE_DA_API'; // Obtenha uma chave em https://mymemory.translated.net/
                    const response = await axios.get(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|pt`);
                    const translatedText = response.data.responseData.translatedText;
                    message.reply(`Tradução: ${translatedText}`);
                } catch (error) {
                    message.reply('Não foi possível traduzir o texto.');
                }
                break;

            case '/reminder':
                const time = args[0];
                const reminderMessage = args.slice(1).join(' ');
                if (!time || !reminderMessage) {
                    message.reply('Uso correto: /reminder <tempo> <mensagem>. Exemplo: /reminder 10m Estudar para a prova');
                    return;
                }
                const timeInMs = timeUtils.parseTime(time);
                if (!timeInMs) {
                    message.reply('Formato de tempo inválido. Use números seguidos de "s" (segundos), "m" (minutos) ou "h" (horas).');
                    return;
                }
                setTimeout(() => {
                    message.reply(`⏰ Lembrete: ${reminderMessage}`);
                }, timeInMs);
                message.reply(`Lembrete definido para daqui a ${time}.`);
                break;

            case '/quote':
                const quotes = [
                    "A persistência é o caminho do êxito. – Charles Chaplin",
                    "O sucesso é a soma de pequenos esforços repetidos dia após dia. – Robert Collier",
                    "Acredite em si próprio e chegará um dia em que os outros não terão outra escolha senão acreditar com você. – Cynthia Kersey"
                ];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                message.reply(randomQuote);
                break;

            default:
                message.reply('Comando desconhecido. Use /help para ver a lista de comandos.');
        }
    }
};