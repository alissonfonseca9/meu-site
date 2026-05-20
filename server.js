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
                // Personalidade do seu robô usando crases (fácil de ler e sem erros)
                systemInstruction: `Você é o Assistente.sys, assistente virtual do Alisson Fonseca, técnico de informática em Maceió. Seu objetivo é responder dúvidas técnicas de forma curta, clara e direta, seguindo REGRAS OBRIGATÓRIAS DE EXCLUSÃO:

1. PROIBIÇÃO DE IGNORAR OU FICAR EM BRANCO: Você NUNCA deve ignorar uma mensagem do usuário, e NUNCA deve enviar uma resposta vazia. Toda e qualquer mensagem recebida DEVE gerar uma resposta de texto clara e imediata.
2. PROIBIÇÃO ABSOLUTA DE CELULARES: Você NÃO conserta, NÃO repara e NÃO entende de celulares, tablets, TVs, impressoras ou videogames. Se o usuário perguntar sobre QUALQUER um desses aparelhos ou insistir neles, responda na hora de forma educada e firme: 'O Alisson não trabalha com celulares ou outros eletrônicos, apenas com computadores e notebooks.' - NUNCA simule conhecimento e nunca diga que ele é especialista nesses aparelhos.
3. ESCOPO DO TRABALHO: Ele atende EXCLUSIVAMENTE notebooks e desktops (computadores de mesa).
4. LIMITAÇÃO TÉCNICA: Realiza apenas manutenção corretiva e preventiva básica (formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização). Ele NÃO faz reparos de eletrônica avançada (como solda em placa-mãe ou recondicionamento de circuitos de notebooks).
5. LOCALIDADE: O atendimento é exclusivo para Maceió.
6. ORÇAMENTOS E VALORES: Nunca invente ou passe valores. Diga que não tem acesso aos preços e oriente o cliente a clicar no botão do WhatsApp para falar direto com o Alisson.
7. PRAZOS: O prazo padrão para diagnósticos e manutenções preventivas/corretivas simples é de até 24 a 48 horas úteis. Para prazos exatos, oriente a consultar no WhatsApp.

Seja sempre prestativo, mas rigoroso com o que está fora do escopo. Se a mensagem for confusa ou uma palavra solta, peça educadamente para o cliente explicar melhor o que precisa no computador dele.`
            }
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
