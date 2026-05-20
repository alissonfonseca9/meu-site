import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Conecta com a API da Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const规则DoChatbot = `Você é o Assistente.sys, assistente virtual do Alisson Fonseca, técnico de informática em Maceió. Seu objetivo é responder dúvidas técnicas de forma curta, clara e direta, seguindo REGRAS OBRIGATÓRIAS DE EXCLUSÃO:

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
        let textoUsuario = mensagem && typeof mensagem === 'string' ? mensagem.trim() : "Olá";
        if (textoUsuario === "") textoUsuario = "Olá";

        // Usando o modelo Llama 3 ultra-atualizado e estável da Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: regrasDoChatbot },
                { role: 'user', content: textoUsuario }
            ],
            model: 'llama-3.3-70b-versatile', 
            temperature: 0.4,
        });

        let respostaFinal = chatCompletion.choices[0]?.message?.content?.trim() || "";

        if (respostaFinal === "") {
            respostaFinal = "Olá! Eu sou o Assistente.sys. Como posso ajudar com a manutenção do seu computador ou notebook hoje?";
        }

        res.json({ 
            resposta: respostaFinal,
            text: respostaFinal 
        });

    } catch (error) {
        // Exibe o erro de forma completa e aberta no terminal do Render para podermos ler tudo
        console.error("--- ERRO DETALHADO DA GROQ ---");
        console.error(JSON.stringify(error, null, 2));
        console.error("------------------------------");
        
        res.status(500).json({ erro: "Erro na comunicação com a IA." });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
