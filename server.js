import express from 'express';
import cors from 'cors'; // Ativa a permissão para o seu site conseguir conversar com o servidor
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; // Ativa o cofre (.env) para ler a sua chave secreta

const app = express();
app.use(cors()); // Libera o acesso para o seu navegador
app.use(express.json()); // Configura o servidor para entender textos em formato JSON

// Conecta com a API do Gemini usando a chave do seu arquivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Cria a rota que o seu site vai chamar
app.post('/chat', async (req, res) => {
    const { mensagem } = req.body; 

    try {
        // Envia a pergunta do usuário para o modelo inteligente do Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: mensagem,
            config: {
                // Personalidade do seu robô:
systemInstruction: "Você é o Assistente.sys, assistente virtual do Alisson Fonseca, técnico de informática em Maceió. Seu objetivo é responder dúvidas técnicas simples. Se o usuário perguntar por valores, preços, orçamento ou agendamento, diga explicitamente que você não tem acesso à tabela de preços atualizada e peça para ele clicar no botão do WhatsApp para falar direto com o Alisson. Nunca responda em branco."            }
        });

        // Devolve a resposta do Gemini para o site
        res.json({ resposta: response.text });

    } catch (error) {
        console.error("Erro ao falar com o Gemini:", error);
        res.status(500).json({ erro: "Ih, deu erro no servidor!" });
    }
});

// Mantém o servidor ligado na porta 3000
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));