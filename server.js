import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Conecta com a API da Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const regrasDoChatbot = `Você é o Assistente.sys, assistente virtual do Alisson Fonseca, técnico de informática em Maceió. Seu objetivo é responder dúvidas técnicas de forma curta, clara e direta, seguindo REGRAS OBRIGATÓRIAS DE EXCLUSÃO:

1. PROIBIÇÃO DE IGNORAR OU FICAR EM BRANCO: Você NUNCA deve ignorar uma mensagem do usuário, e NUNCA deve enviar uma resposta vazia. Toda e qualquer mensagem recebida DEVE gerar uma resposta de texto clara e imediata.
2. PROIBIÇÃO ABSOLUTA DE CELULARES: Você NÃO conserta, NÃO repara e NÃO entende de celulares, tablets, TVs, impressoras ou videogames. Se o usuário perguntar sobre QUALQUER um desses aparelhos ou indicar necessidade de suporte para eles, responda na hora de forma educada e firme: 'O Alisson não trabalha com celulares ou outros eletrônicos, apenas com computadores e notebooks.'
3. ESCOPO DO TRABALHO: Ele atende EXCLUSIVAMENTE notebooks e desktops (computadores de mesa).
4. LIMITAÇÃO TÉCNICA: Realiza apenas manutenção corretiva e preventiva básica (formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização). Ele NÃO faz reparos de eletrônica avançada.
5. LOCALIDADE: O atendimento é exclusivo para Maceió.
6. ORÇAMENTOS E VALORES: Nunca invente ou passe valores. Diga que não tem acesso aos preços e oriente o cliente a clicar no botão do WhatsApp para falar direto com o Alisson.
7. PRAZOS: O prazo padrão para diagnósticos e manutenções é de até 24 a 48 horas úteis.

Se a mensagem do usuário for uma palavra solta, saudação ou confusa, responda educadamente se apresentando e perguntando qual o defeito do notebook ou computador de mesa dele.`;

app.post('/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;
        
        // Trata a entrada caso o front-end envie o objeto antigo do Gemini
        let textoUsuario = "Olá";
        if (mensagem) {
            if (typeof mensagem === 'string') {
                textoUsuario = mensagem.trim();
            } else if (typeof mensagem === 'object' && mensagem.text) {
                textoUsuario = message.text.trim();
            } else {
                textoUsuario = String(mensagem).trim();
            }
        }

        if (textoUsuario === "") textoUsuario = "Olá";

        // Chama o modelo Llama 3 na Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: regrasDoChatbot },
                { role: 'user', content: textoUsuario }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.4,
        });

        let respostaFinal = chatCompletion.choices[0]?.message?.content?.trim() || "";

        if (respostaFinal === "") {
            respostaFinal = "Olá! Eu sou o Assistente.sys. Como posso ajudar com a manutenção do seu computador ou notebook hoje?";
        }

        // Devolve exatamente no formato que o seu site espera receber (com suporte a 'resposta' e '.text')
        res.json({ 
            resposta: respostaFinal,
            text: respostaFinal 
        });

    } catch (error) {
        console.error("Erro ao falar com a Groq:", error);
        res.status(500).json({ erro: "Ih, deu erro no servidor!", detalhe: error.message });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
