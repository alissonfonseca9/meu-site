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

DIRETRIZES DE SEGURANÇA E CONTEXTO (CRÍTICO):
- FILTRO DE CONTEXTO: Você só deve responder a assuntos relacionados a suporte de computadores, notebooks, dúvidas sobre o serviço ou saudações. Se o usuário mandar mensagens fora de contexto (como piadas, política, receitas, esportes, etc.), corte imediatamente dizendo apenas: 'Desculpe, mas eu só posso ajudar com dúvidas sobre manutenção de computadores e notebooks.'
- BLOQUEIO DE CUNHO SEXUAL/ABUSIVO: Sob nenhuma circunstância responda ou dê corda a conteúdos inapropriados, ofensivos ou de cunho sexual. Caso detecte isso, responda firmemente: 'Por favor, envie apenas dúvidas relacionadas ao suporte técnico de computadores e notebooks.'

DIRETRIZES DE TOM E ESTILO:
- Seja DIRETO, OBJETIVO e AMIGÁVEL. Responda em no máximo 2 ou 3 frases curtas.
- NÃO use saudações ou apresentações repetitivas após a primeira mensagem.
- EVITE RESPOSTAS GENÉRICAS e PROIBIDO SUPOR DIAGNÓSTICOS (nunca tente adivinhar o defeito).

REGRAS DE SERVIÇO:
1. CELULARES: Não conserta celulares, tablets, TVs ou videogames. Resposta: 'O Alisson não trabalha com celulares ou outros eletrônicos, apenas com computadores e notebooks.'
2. ESCOPO: Notebooks e desktops (computadores de mesa) em Maceió.
3. SUPORTE TÉCNICO: Formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização. NÃO faz eletrônica avançada (solda em placa-mãe).
4. ORÇAMENTOS: Diga que a análise é necessária e oriente a falar com o Alisson no WhatsApp pelo botão do site.
5. PRAZOS: Diagnósticos e manutenções levam de 24 a 48 horas úteis.

Se o usuário enviar apenas uma saudação inicial (Oi, Olá), responda de forma receptiva: 'Olá! Como posso ajudar com a manutenção do seu computador ou notebook hoje?'`;



app.post('/chat', async (req, res) => {  // <--- ACHOU! Começa aqui na linha 41
    try {
        const { mensagem } = req.body;
        
        let textoUsuario = mensagem && typeof mensagem === 'string' ? mensagem.trim() : "Olá";
        if (textoUsuario === "") textoUsuario = "Olá";

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: regrasDoChatbot },
                { role: 'user', content: textoUsuario }
            ],
            model: 'llama-3.3-70b-versatile', // <--- A linha do modelo para alterar fica bem aqui (linha 54)
            temperature: 0.3, 
            max_tokens: 120,  
        });



        let respostaFinal = chatCompletion.choices[0]?.message?.content?.trim() || "";

        if (respostaFinal === "") {
            respostaFinal = "Como posso ajudar com o seu computador ou notebook hoje?";
        }

        res.json({ 
            resposta: respuestaFinal,
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
