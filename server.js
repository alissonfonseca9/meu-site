import express from 'express';
import cors from 'cors'; // Ativa a permissão para o seu site conseguir conversar com o servidor
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; // Ativa o cofre (.env) para ler a sua chave secreta

const app = express();
app.use(cors()); // Libera o acesso para o seu navegador
app.use(express.json()); // Configura o servidor para entender textos em formato JSON

// Conecta com a API do Gemini usando a chave do seu arquivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Regras de comportamento da IA isoladas
const regrasDoChatbot = `Você é o Assistente.sys, assistente virtual do Alisson Fonseca, técnico de informática em Maceió. Seu objetivo é responder dúvidas técnicas de forma corta, clara e direta, seguindo REGRAS OBRIGATÓRIAS DE EXCLUSÃO:

1. PROIBIÇÃO DE IGNORAR OU FICAR EM BRANCO: Você NUNCA deve ignorar uma mensagem do usuário, e NUNCA deve enviar uma resposta vazia. Toda e qualquer mensagem recebida DEVE gerar uma resposta de texto clara e imediata.
2. PROIBIÇÃO ABSOLUTA DE CELULARES: Você NÃO conserta, NÃO repara e NÃO entende de celulares, tablets, TVs, impressoras ou videogames. Se o usuário perguntar sobre QUALQUER um desses aparelhos ou insistir neles, responda na hora de forma educada e firme: 'O Alisson não trabalha com celulares ou outros eletrônicos, apenas com computadores e notebooks.' - NUNCA simule conhecimento e nunca diga que ele é especialista nesses aparelhos.
3. ESCOPO DO TRABALHO: Ele atende EXCLUSIVAMENTE notebooks e desktops (computadores de mesa).
4. LIMITAÇÃO TÉCNICA: Realiza apenas manutenção corretiva e preventiva básica (formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização). Ele NÃO faz reparos de eletrônica avançada (como solda em placa-mãe ou recondicionamento de circuitos de notebooks).
5. LOCALIDADE: O atendimento é exclusivo para Maceió.
6. ORÇAMENTOS E VALORES: Nunca invente ou passe valores. Diga que não tem acesso aos preços e oriente o cliente a clicar no botão do WhatsApp para falar direto com o Alisson.
7. PRAZOS: O prazo padrão para diagnósticos e manutenções preventivas/corretivas simples é de até 24 a 48 horas úteis. Para prazos exatos, oriente a consultar no WhatsApp.

Se a mensagem do usuário for uma palavra solta, saudação ou confusa, responda educadamente se apresentando e perguntando qual o defeito do notebook ou computador de mesa dele.`;

// Cria a rota que o seu site vai chamar
app.post('/chat', async (req, res) => {
    try {
        const { mensagem } = req.body; 

        // Garante que o texto enviado seja uma String simples e limpa
        let textoUsuario = "Olá";
        if (mensagem) {
            if (typeof mensagem === 'string') {
                textoUsuario = mensagem.trim();
            } else if (typeof mensagem === 'object' && mensagem.text) {
                textoUsuario = mensagem.text.trim();
            } else {
                textoUsuario = String(mensagem).trim();
            }
        }

        if (textoUsuario === "") {
            textoUsuario = "Olá";
        }

        // VOLTAMOS PARA O MODELO CORRETO SUPORTADO PELO SEU SDK
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: textoUsuario, 
            config: {
                systemInstruction: regrasDoChatbot
            }
        });

        // Pega o texto retornado e remove espaços extras
        let respostaFinal = response.text ? response.text.trim() : "";

        // Trava de segurança para respostas em branco do modelo
        if (respostaFinal === "") {
            respostaFinal = "Olá! Eu sou o Assistente.sys. Como posso ajudar com a manutenção do seu computador ou notebook hoje?";
        }

        res.json({ resposta: respostaFinal });

    } catch (error) {
        console.error("Erro ao falar com o Gemini:", error);
        
        // TRAVA DE SEGURANÇA PARA COTA EXCEDIDA (Erro 429)
        // Se a API travar por excesso de cliques, o servidor intercepta e avisa o cliente com educação em vez de quebrar
        if (error.toString().includes("429") || JSON.stringify(error).includes("429")) {
            return res.json({ 
                resposta: "Olá! No momento estou recebendo muitas mensagens simultâneas. Por favor, aguarde uns segundinhos e envie sua dúvida novamente, ou se preferir, clique no botão abaixo para falar direto com o Alisson no WhatsApp! 🚀" 
            });
        }

        res.status(500).json({ erro: "Ih, deu erro no servidor!" });
    }
});

// Mantém o servidor ligado na porta 3000
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
