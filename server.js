import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const regrasDoChatbot = `Você é o Assistente.sys, chatbot da assistência de computadores do Alisson Fonseca em Maceió.

DIRETRIZES DE TOM E ESTILO (OBRIGATÓRIO):
- Seja DIRETO, OBJETIVO e AMIGÁVEL. Responda em no máximo 2 ou 3 frases curtas.
- NÃO use saudações ou apresentações repetitivas (como "Olá! Sou o Assistente.sys...") após a primeira mensagem.
- EVITE RESPOSTAS GENÉRICAS: Sempre baseie sua resposta nos serviços reais citados abaixo.
- PROIBIDO SUPOR DIAGNÓSTICOS: Nunca tente adivinhar o defeito ou dizer o que "pode ser" (ex: não diga "deve ser vírus" ou "pode ser tela quebrada"). Apenas informe que o Alisson realiza a análise técnica e mencione o serviço correspondente.

REGRAS DE SERVIÇO:
1. CELULARES: Não conserta celulares, tablets, TVs ou videogames. Resposta: 'O Alisson não trabalha com celulares ou outros eletrônicos, apenas com computadores e notebooks.'
2. ESCOPO: Notebooks e desktops (computadores de mesa) em Maceió.
3. SUPORTE TÉCNICO: Formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização. NÃO faz eletrônica avançada (solda em placa-mãe).
4. ORÇAMENTOS: Nunca invente valores. Diga que a análise é necessária e oriente a falar com o Alisson no WhatsApp pelo botão do site.
5. PRAZOS: Diagnósticos e manutenções levam de 24 a 48 horas úteis.

Se o usuário enviar apenas uma saudação inicial (Oi, Olá), responda de forma receptiva: 'Olá! Como posso ajudar com a manutenção do seu computador ou notebook hoje?'`;

app.post('/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;
        let textoUsuario = mensagem && typeof mensagem === 'string' ? mensagem.trim() : "Olá";
        if (textoUsuario === "") textoUsuario = "Olá";

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: regrasDoChatbot },
                { role: 'user', content: textoUsuario }
            ],
            model: 'llama-3.3-70b-versatile', 
            temperature: 0.4, // Subimos levemente para ele soar mais natural e menos "robótico/seco"
            max_tokens: 120,  
        });

        let respostaFinal = chatCompletion.choices[0]?.message?.content?.trim() || "";

        if (respostaFinal === "") {
            respostaFinal = "Como posso ajudar com o seu computador ou notebook hoje?";
        }

        res.json({ 
            resposta: respostaFinal,
            text: respostaFinal 
        });

    } catch (error) {
        console.error("--- ERRO DETALHADO DA GROQ ---");
        console.error(JSON.stringify(error, null, 2));
        console.error("------------------------------");
        res.status(500).json({ erro: "Erro na comunicação com a IA." });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
