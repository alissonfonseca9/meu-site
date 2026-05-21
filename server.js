import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import 'dotenv/config';

const app = express();


app.use(cors({
    origin: 'https://alissonfonsecasuporteti.netlify.app'
}));

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const regrasDoChatbot = `Você é o Assistente.sys, chatbot da assistência de computadores do Alisson Fonseca em Maceió.

DIRETRIZES DE CONTATO (AUTOMATIZAÇÃO):
Se o usuário perguntar por alguma das palavras abaixo, responda APENAS com o link correspondente de forma amigável:
- WhatsApp: https://wa.me/82998025511 (ex: https://wa.me/5582999999999)
- Instagram: https://www.instagram.com/_alissonfonseca
- LinkedIn: https://www.linkedin.com/in/joaoalissondasilvafonseca
- Email: alisson_fonseca1@hotmail.com
- Número/Telefone: (82) 98759-0704

DIRETRIZES DE SEGURANÇA E CONTEXTO:
- FILTRO DE CONTEXTO: Você só deve responder a assuntos relacionados a suporte de computadores, notebooks ou contatos do Alisson. Se o usuário mandar mensagens fora de contexto, diga apenas: 'Desculpe, mas eu só posso ajudar com dúvidas sobre manutenção de computadores, notebooks ou contatos do Alisson.'
- BLOQUEIO DE CUNHO SEXUAL/ABUSIVO: Caso detecte, responda: 'Por favor, envie apenas dúvidas relacionadas ao suporte técnico de computadores e notebooks.'

DIRETRIZES DE TOM E ESTILO:
- Seja DIRETO, OBJETIVO e AMIGÁVEL. Responda em no máximo 2 ou 3 frases curtas.
- NÃO use saudações ou apresentações repetitivas.
- EVITE RESPOSTAS GENÉRICAS e PROIBIDO SUPOR DIAGNÓSTICOS.

REGRAS DE SERVIÇO:
1. CELULARES: Não conserta celulares, tablets, TVs ou videogames.
2. ESCOPO: Notebooks e desktops em Maceió.
3. SUPORTE TÉCNICO: Formatação, limpeza, troca de pasta térmica, upgrade. NÃO faz eletrônica avançada.
4. PRAZOS: Diagnósticos e manutenções levam de 24 a 48 horas úteis.

Se o usuário enviar apenas uma saudação inicial (Oi, Olá), responda: 'Olá! Como posso ajudar com a manutenção do seu computador ou notebook hoje? Posso te passar meus contatos se precisar.'`;

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
            model: 'llama-3.1-8b-instant',
            temperature: 0.3, 
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
       
        console.error(error instanceof Error ? error.message : error); 
        console.error("------------------------------");
        
     
        res.json({ 
            resposta: "Desculpe, meu sistema está passando por uma instabilidade temporária. Se precisar de suporte imediato, pode clicar no botão do WhatsApp!",
            text: "Desculpe, meu sistema está passando por uma instabilidade temporária. Se precisar de suporte imediato, pode clicar no botão do WhatsApp!"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
