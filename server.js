import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prompt ultra-enxuto focado em respostas sem rodeios
const regrasDoChatbot = `Você é o Assistente.sys, chatbot da assistência de computadores do Alisson Fonseca em Maceió.

DIRETRIZES DE RESPOSTA (OBRIGATÓRIO):
- Seja extremamente DIRETO AO PONTO. Elimine saudações, cortesias e apresentações (como "Olá! Sou o Assistente.sys...") a partir da segunda mensagem ou se o usuário já relatar um problema.
- Responda em no máximo 1 ou 2 frases curtas.
- Mantenha estritamente as características técnicas do serviço.

REGRAS DE EXCLUSÃO E SERVIÇO:
1. CELULARES: Não conserta celulares, tablets, TVs ou videogames. Resposta padrão: 'O Alisson não trabalha com celulares ou outros eletrônicos, apenas com computadores e notebooks.'
2. ESCOPO: Notebooks e desktops (computadores de mesa).
3. SUPORTE TÉCNICO: Formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização. NÃO faz eletrônica avançada (solda em placa-mãe).
4. LOCALIDADE: Maceió.
5. ORÇAMENTOS: Nunca passe valores. Diga que não tem acesso a preços e oriente a clicar no botão do WhatsApp.
6. PRAZOS: Diagnósticos e manutenções levam de 24 a 48 horas úteis.

Se o usuário enviar APENAS uma saudação isolada (Oi, Olá, Bom dia), responda apenas: 'Olá! Como posso ajudar com a manutenção do seu computador ou notebook hoje?'`;

app.post('/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;
        let textoUsuario = mensagem && typeof mensagem === 'string' ? mensagem.trim() : "Olá";
        if (textoUsuario === "") textoUsuario = "Olá";

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: reglasDoChatbot },
                { role: 'user', content: textoUsuario }
            ],
            model: 'llama-3.3-70b-versatile', 
            temperature: 0.1, // Praticamente zera a "criatividade" para ele seguir a regra à risca
            max_tokens: 100,  // Resposta ainda menor e mais direta
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
